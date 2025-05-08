import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Menu as MenuIcon, Check, Close, Search } from "@mui/icons-material";
import DataTable from "react-data-table-component";
import "../assets/css/ManageBooks.css";
import axios from "axios";

const ManageRequests = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    // Fetch all book requests with user and book details
    const fetchRequests = async () => {
        try {
            const response = await axios.get("/api/requests", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        setShowOverlay(!isMinimized);
    };

    const closeSidebar = () => {
        setIsMinimized(true);
        setShowOverlay(false);
    };

    // Filter requests based on search text
    const filteredRequests = requests.filter(item =>
        item.user.id_number.toLowerCase().includes(filterText.toLowerCase()) ||
        item.user.first_name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.book.title.toLowerCase().includes(filterText.toLowerCase())
    );

    // Custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#f5f5f5',
            },
        },
        cells: {
            style: {
                padding: '12px',
            },
        },
    };

    // Handle approve/reject actions
    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await axios.put(`/api/requests/${requestId}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            fetchRequests(); // Refresh the list
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update request status");
        }
    };

    // Table columns
    const columns = [
        {
            name: "ID Number",
            selector: row => row.user.id_number,
            sortable: true
        },
        {
            name: "Student Name",
            cell: row => (
                <div>
                    {row.user.first_name} {row.user.last_name}
                    <div className="student-details">
                        {row.user.student?.course} - 
                        {row.user.student?.year_level}-
                        {row.user.student?.section}
                    </div>
                </div>
            ),
            sortable: true,
            wrap: true
        },
        {
            name: "Book Title",
            selector: row => row.book.title,
            sortable: true,
            wrap: true
        },
        {
            name: "Author",
            selector: row => row.book.author,
            sortable: true
        },
        {
            name: "Request Date",
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true
        },
        {
            name: "Status",
            cell: row => (
                <span className={`status-badge ${row.status}`}>
                    {row.status}
                </span>
            ),
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="action-buttons">
                    {row.status === 'pending' && (
                        <>
                            <button 
                                className="btn-icon btn-approve" 
                                title="Approve"
                                onClick={() => handleStatusChange(row.id, 'approved')}
                            >
                                <Check fontSize="small" />
                            </button>
                            <button 
                                className="btn-icon btn-reject" 
                                title="Reject"
                                onClick={() => handleStatusChange(row.id, 'rejected')}
                            >
                                <Close fontSize="small" />
                            </button>
                        </>
                    )}
                </div>
            ),
            width: '150px'
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
                                placeholder="Search requests..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : requests.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={filteredRequests}
                            pagination
                            highlightOnHover
                            responsive
                            striped
                            defaultSortField="created_at"
                            defaultSortAsc={false}
                            customStyles={customStyles}
                            subHeader
                            subHeaderComponent={
                                <div style={{ display: 'none' }} /> // Hide default search
                            }
                        />
                    ) : (
                        <div className="no-data">
                            <img
                                src="./images/no-data.png"
                                alt="No data available"
                            />
                            <p>No requests found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageRequests;