import React, { useState, useEffect } from "react";
import {
    Menu as MenuIcon,
    Book as BookIcon,
    BookOutlined as BookOutlinedIcon,
    Schedule as ScheduleIcon,
    DoneAll as DoneAllIcon,
    History as HistoryIcon
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import "../assets/css/Dashboard.css";
import axios from "axios";

const StudentDashboard = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [requestHistory, setRequestHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        if (window.innerWidth <= 768) {
            setShowOverlay(!showOverlay);
        }
    };

    const closeSidebar = () => {
        if (window.innerWidth <= 768) {
            setIsMinimized(true);
            setShowOverlay(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setShowOverlay(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchRequestHistory = async () => {
            try {
                const response = await axios.get("/api/requests");
                setRequestHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching request history:", error);
                setLoading(false);
            }
        };

        // Initial fetch
        fetchRequestHistory();

        // Set up polling for updates (every 30 seconds)
        const intervalId = setInterval(fetchRequestHistory, 30000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (requestHistory.length > 0) {
            const pendingRequests = requestHistory.filter(
                req => req.status === "pending"
            );
            const updatedRequests = requestHistory.filter(
                req =>
                    req.status !== "pending" &&
                    new Date(req.updated_at) > new Date(Date.now() - 30000) // Changed in last 30s
            );

            if (updatedRequests.length > 0) {
                updatedRequests.forEach(req => {
                    alert(
                        `Your request for "${req.book.title}" has been ${req.status}!`
                    );
                });
            }
        }
    }, [requestHistory]);

    const getStatusBadgeClass = status => {
        switch (status.toLowerCase()) {
            case "approved":
                return "status-badge approved";
            case "rejected":
                return "status-badge rejected";
            default:
                return "status-badge pending";
        }
    };

    const columns = [
        {
            name: "Cover",
            cell: row =>
                row.book.image_path ? (
                    <img
                        src={`http://localhost:8000/storage/${row.book.image_path}`}
                        alt={`Cover of ${row.book.title}`}
                        className="book-cover-thumbnail"
                        style={{
                            width: "50px",
                            height: "70px",
                            objectFit: "cover"
                        }}
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = "./images/no-data.png";
                        }}
                    />
                ) : (
                    <div className="no-cover">No Cover</div>
                ),
            width: "15%"
        },
        {
            name: "Title",
            selector: row => row.book.title,
            sortable: true,
            wrap: true,
            width: "35%"
        },

        {
            name: "Request Date",
            selector: row => row.created_at,
            cell: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            width: "25%"
        },
        {
            name: "Status",
            selector: row => row.status,
            cell: row => (
                <span className={getStatusBadgeClass(row.status)}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            ),
            sortable: true,
            width: "25%"
        }
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: "80px"
            }
        },
        headCells: {
            style: {
                fontSize: "1rem",
                fontWeight: "bold",
                paddingLeft: "8px",
                paddingRight: "8px"
            }
        },
        cells: {
            style: {
                paddingLeft: "8px",
                paddingRight: "8px"
            }
        }
    };

    return (
        <div className="dashboard-container">
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
                        <h2>Student Dashboard</h2>
                    </div>
                </div>
                <div className="content-wrapper">
                    <div className="cards-container">
                        <div className="card">
                            <div className="card-icon">
                                <BookIcon fontSize="large" />
                            </div>
                            <div className="card-content">
                                <h3>5</h3>
                                <p>Borrowed Books</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon">
                                <BookOutlinedIcon fontSize="large" />
                            </div>
                            <div className="card-content">
                                <h3>12</h3>
                                <p>Available Books</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon">
                                <ScheduleIcon fontSize="large" />
                            </div>
                            <div className="card-content">
                                <h3>2</h3>
                                <p>Pending Requests</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon">
                                <DoneAllIcon fontSize="large" />
                            </div>
                            <div className="card-content">
                                <h3>23</h3>
                                <p>Total Read</p>
                            </div>
                        </div>
                    </div>

                    {/* Request History Section */}
                    <div className="request-history-container">
                        <div className="request-history-header">
                            <HistoryIcon className="history-icon" />
                            <h2>Request History</h2>
                        </div>

                        <div className="request-table-wrapper">
                            {loading ? (
                                <p>Loading request history...</p>
                            ) : requestHistory.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={requestHistory}
                                    customStyles={customStyles}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    noDataComponent={
                                        <p className="no-requests-message">
                                            No request history found.
                                        </p>
                                    }
                                />
                            ) : (
                                <p className="no-requests-message">
                                    No request history found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
