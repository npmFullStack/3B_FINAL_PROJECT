import React, { useState, useEffect } from "react";
import {
    Menu as MenuIcon,
    Book as BookIcon,
    People as PeopleIcon,
    Event as EventIcon
} from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import "../assets/css/Dashboard.css";
import axios from "axios";

const AdminDashboard = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalStudents: 0,
        pendingRequests: 0
    });
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
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch counts directly from the backend
            const booksCount = await axios.get("/books/count", { headers });
            const studentsCount = await axios.get(
                "/users/count?user_type=student",
                { headers }
            );
            const pendingRequestsCount = await axios.get(
                "/requests/count?status=pending",
                { headers }
            );

            setStats({
                totalBooks: booksCount.data.count,
                totalStudents: studentsCount.data.count,
                pendingRequests: pendingRequestsCount.data.count
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            // Fallback to counting on client side if endpoints don't exist
            const token = localStorage.getItem("token");
            await fetchCountsManually(token);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountsManually = async token => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const booksRes = await axios.get("/books", { headers });
            const usersRes = await axios.get("/users", { headers });
            const requestsRes = await axios.get("/requests", { headers });

            setStats({
                totalBooks: booksRes.data.length,
                totalStudents: usersRes.data.filter(
                    user => user.user_type === "student"
                ).length,
                pendingRequests: requestsRes.data.filter(
                    request => request.status === "pending"
                ).length
            });
        } catch (error) {
            console.error("Error in fallback counting:", error);
        }
    };

    fetchStats(); // This was previously tats()

    const handleResize = () => {
        if (window.innerWidth > 768) {
            setShowOverlay(false);
        }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

    if (loading) {
        return (
            <div
                className="main-content"
                style={{ marginLeft: isMinimized ? "70px" : "250px" }}
            >
                <div className="navbar">
                    <div className="navbar-left">
                        <div className="burger-icon" onClick={toggleSidebar}>
                            <MenuIcon />
                        </div>
                        <h2>Admin Dashboard</h2>
                    </div>
                </div>
                <div>Loading statistics...</div>
            </div>
        );
    }
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
                        <h2>Admin Dashboard</h2>
                    </div>
                </div>
                <div className="cards-container">
                    <div className="card">
                        <div className="card-icon">
                            <BookIcon fontSize="large" />
                        </div>
                        <div className="card-content">
                            <h3>{stats.totalBooks}</h3>
                            <p>Total Books</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-icon">
                            <PeopleIcon fontSize="large" />
                        </div>
                        <div className="card-content">
                            <h3>{stats.totalStudents}</h3>
                            <p>Total Students</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-icon">
                            <EventIcon fontSize="large" />
                        </div>
                        <div className="card-content">
                            <h3>{stats.pendingRequests}</h3>
                            <p>Pending Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;