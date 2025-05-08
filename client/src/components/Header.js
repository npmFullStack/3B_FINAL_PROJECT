import React, { useState } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import "../assets/css/Header.css";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate("/");
        // Small timeout to ensure page loads before scrolling
        setTimeout(() => {
            const element = document.getElementById("home");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
        setIsMobileMenuOpen(false);
    };

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-left">
                <img src="./images/logo.png" alt="Logo" className="logo" />
                <div className="logo-text">
                    <div className="logo-text-top">OPOL COMMUNITY COLLEGE</div>
                    <div className="logo-text-bottom">
                        Library Management System
                    </div>
                </div>
            </div>

            <div className="header-right">
                <nav className="desktop-nav">
                    <a href="/" onClick={handleHomeClick}>
                        Home
                    </a>
                    <a href="#about" onClick={(e) => scrollToSection(e, "about")}>
                        About
                    </a>
                    <a href="#services" onClick={(e) => scrollToSection(e, "services")}>
                        Services
                    </a>
                    <button 
                        className="btn-primary" 
                        onClick={() => navigate("/auth")}
                        style={{ cursor: 'pointer' }}
                    >
                        Get Started
                    </button>
                </nav>

                <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                    <MenuIcon />
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <a href="/" onClick={handleHomeClick}>
                        Home
                    </a>
                    <a href="#about" onClick={(e) => scrollToSection(e, "about")}>
                        About
                    </a>
                    <a href="#services" onClick={(e) => scrollToSection(e, "services")}>
                        Services
                    </a>
                    <button 
                        className="btn-primary" 
                        onClick={() => {
                            navigate("/auth");
                            setIsMobileMenuOpen(false);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        Get Started
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;