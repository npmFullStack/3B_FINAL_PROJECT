import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
    Menu as MenuIcon,
    Search,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon
} from "@mui/icons-material";
import DataTable from "react-data-table-component";
import "../assets/css/ManageBooks.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRequests = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    const fetchRequests = async () => {
        try {
            console.log("Fetching requests...");
            const response = await axios.get("/api/requests", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                params: {
                    _: Date.now()
                }
            });

            console.log("Fetched requests:", response.data);
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setLoading(false);
            alert("Failed to load requests");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            setLoading(true);
            const { data } = await axios.put(
                `/api/requests/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!data.success) {
                throw new Error(data.message || `Failed to ${status} request`);
            }

            setRequests(prevRequests =>
                prevRequests.map(req => (req.id === id ? data.data : req))
            );

            toast.success(`Request ${status} successfully!`);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                `Failed to ${status} request`;
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handleApprove = id => handleStatusUpdate(id, "approved");
    const handleReject = id => handleStatusUpdate(id, "rejected");

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        setShowOverlay(!isMinimized);
    };

    const closeSidebar = () => {
        setIsMinimized(true);
        setShowOverlay(false);
    };

    const filteredRequests = requests.filter(
        item =>
            item.user.id_number
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
            `${item.user.first_name} ${item.user.last_name}`
                .toLowerCase()
                .includes(filterText.toLowerCase()) ||
            item.book.title.toLowerCase().includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: "ID Number",
            selector: row => row.user.id_number,
            sortable: true,
            width: "120px"
        },
        {
            name: "Full Name",
            cell: row => (
                <div className="student-name">
                    {row.user.first_name} {row.user.last_name}
                </div>
            ),
            sortable: true,
            grow: 1,
            minWidth: "150px"
        },
        {
            name: "Course Year & Section",
            cell: row => (
                <div className="course-year-section">
                    <span className="course">
                        {row.user.student?.course || "N/A"}
                    </span>
                    <span className="year-section">
                        {row.user.student?.year_level || "N/A"}-
                        {row.user.student?.section || "N/A"}
                    </span>
                </div>
            ),
            sortable: true,
            minWidth: "180px"
        },
        {
            name: "Book Title",
            selector: row => row.book.title,
            sortable: true,
            grow: 2,
            minWidth: "200px"
        },
        {
            name: "Actions",
            cell: row => {
                // Check both status and internal_status for more reliable state
                const isPending =
                    row.status === "pending" &&
                    (!row.internal_status || row.internal_status === null);

                return (
                    <div className="action-buttons">
                        {isPending ? (
                            <>
                                <button
                                    className="btn-action btn-approve"
                                    onClick={() => handleApprove(row.id)}
                                    disabled={loading}
                                >
                                    <ApproveIcon fontSize="small" />
                                    Approve
                                </button>
                                <button
                                    className="btn-action btn-reject"
                                    onClick={() => handleReject(row.id)}
                                    disabled={loading}
                                >
                                    <RejectIcon fontSize="small" />
                                    Reject
                                </button>
                            </>
                        ) : (
                            <div className={`status-badge ${row.status}`}>
                                {row.status.toUpperCase()}
                                {row.internal_status && (
                                    <div className="internal-status">
                                        ({row.internal_status})
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            },
            width: "200px",
            right: true
        }
    ];

    return (
        <div className="manage-books-page">
            <div
                className={`sidebar-overlay ${showOverlay ? "active" : ""}`}
                onClick={closeSidebar}
            />
            <Sidebar
                isMinimized={isMinimized}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
            />
            <div
                className="main-content"
                style={{ marginLeft: isMinimized ? "70px" : "250px" }}
            >
                <div className="navbar">
                    <div className="navbar-left">
                        <div className="burger-icon" onClick={toggleSidebar}>
                            <MenuIcon />
                        </div>
                        <h2>Manage Requests</h2>
                    </div>
                </div>

                <div className="content-wrapper">
                    <div className="table-header">
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by ID, name, or book..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredRequests}
                        pagination
                        highlightOnHover
                        responsive
                        striped
                        progressPending={loading}
                        progressComponent={
                            <div className="loading-spinner">Loading...</div>
                        }
                        noDataComponent={
                            <div className="no-data">
                                <img
                                    src="./images/no-data.png"
                                    alt="No data available"
                                />
                                <p>No requests found</p>
                            </div>
                        }
                        customStyles={{
                            cells: {
                                style: {
                                    padding: "8px",
                                    fontSize: "0.875rem"
                                }
                            },
                            headCells: {
                                style: {
                                    padding: "8px",
                                    fontSize: "0.875rem",
                                    fontWeight: "600"
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ManageRequests;
