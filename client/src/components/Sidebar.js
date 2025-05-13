import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/Sidebar.css";
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Book as BookIcon,
    People as PeopleIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    ExitToApp as LogoutIcon,
    LibraryBooks as LibraryIcon,
    Search as SearchIcon,
    RequestPage as RequestIcon,
    Assessment as ReportIcon
} from "@mui/icons-material";

const Sidebar = ({ isMinimized, toggleSidebar, closeSidebar }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const sidebarRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleClickOutside = event => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                if (window.innerWidth <= 768 && !isMinimized) {
                    closeSidebar();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMinimized, closeSidebar]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const adminLinks = [
        {
            to: "/librarian-dashboard",
            icon: <HomeIcon className="menu-icon" />,
            text: "Dashboard"
        },
        {
            to: "/manage-books",
            icon: <BookIcon className="menu-icon" />,
            text: "Manage Books"
        },

        {
            to: "/manage-requests",
            icon: <RequestIcon className="menu-icon" />,
            text: "Manage Requests"
        },

    ];

    const studentLinks = [
        {
            to: "/search-books",
            icon: <SearchIcon className="menu-icon" />,
            text: "Search"
        },
        {
            to: "/student-dashboard",
            icon: <HomeIcon className="menu-icon" />,
            text: "Dashboard"
        },

    ];

    const links = user?.user_type === "librarian" ? adminLinks : studentLinks;

    return (
        <>
            <div
                className={`sidebar ${isMinimized ? "minimized" : ""}`}
                ref={sidebarRef}
            >
                <div className="sidebar-header">
                    <img src="./images/logo.png" alt="Logo" className="logo" />
                    {!isMinimized && (
                        <div className="header-text">
                            <h2>OPOL COMMUNITY COLLEGE</h2>
                            <p>LIBRARY MANAGEMENT SYSTEM</p>
                        </div>
                    )}
                </div>

                {user && (
                    <div className="user-container">
                        <img
                            src="./images/user.png"
                            alt="User"
                            className="user-image"
                        />
                        {!isMinimized && (
                            <div className="user-details">
                                <h3>{user.first_name}</h3>
                                <h3>{user.last_name}</h3>
                                <span className="user-role">
                                    {user.user_type === "librarian"
                                        ? "Librarian"
                                        : "Student"}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <ul className="sidebar-menu">
                    {links.map((link, index) => (
                        <li
                            key={index}
                            className={
                                location.pathname === link.to ? "active" : ""
                            }
                            id="search"
                        >
                            <Link
                                to={link.to}
                                onClick={
                                    window.innerWidth <= 768
                                        ? closeSidebar
                                        : null
                                }
                            >
                                {link.icon}
                                {!isMinimized && (
                                    <span className="menu-text">
                                        {link.text}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                    <li onClick={handleLogout}>
                        <a>
                            <LogoutIcon className="menu-icon" />
                            {!isMinimized && (
                                <span className="menu-text">Logout</span>
                            )}
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
