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
        // Fetch request history
        const fetchRequestHistory = async () => {
            try {
                const response = await axios.get("/api/requests");
                // Filter requests for the current user if needed
                setRequestHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching request history:", error);
                setLoading(false);
            }
        };

        fetchRequestHistory();
    }, []);

    // Get status badge class based on status
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
                            <table className="request-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>Book Title</th>
                                        <th style={{ width: '40%' }}>Book Cover</th>
                                        <th style={{ width: '40%' }}>Request Date</th>
                                        <th style={{ width: '40%' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requestHistory.map((request) => (
                                        <tr key={request.id}>
                                            <td>{request.book.title}</td>
                                            <td>
                                                <img 
                                                    src={request.book.cover_image} 
                                                    alt={`Cover of ${request.book.title}`} 
                                                    className="book-cover-thumbnail" 
                                                />
                                            </td>
                                            <td>{new Date(request.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={getStatusBadgeClass(request.status)}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-requests-message">No request history found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
