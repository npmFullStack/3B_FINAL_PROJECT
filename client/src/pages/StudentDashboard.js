import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Book as BookIcon,
  BookOutlined as BookOutlinedIcon,
  Schedule as ScheduleIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import '../assets/css/Dashboard.css';

const StudentDashboard = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

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

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="dashboard-container">
            <div className={`sidebar-overlay ${showOverlay ? 'active' : ''}`} onClick={closeSidebar} />
            <Sidebar 
                isMinimized={isMinimized} 
                toggleSidebar={toggleSidebar} 
                closeSidebar={closeSidebar} 
            />
            <div className="main-content" style={{ marginLeft: isMinimized ? '70px' : '250px' }}>
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
            </div>
        </div>
    );
};

export default StudentDashboard;