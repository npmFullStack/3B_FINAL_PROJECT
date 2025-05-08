import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Home.css";
import Header from "../components/Header";

const Home = () => {
    

    return (
        <main>
            <Header />
            {/* Hero Section */}
            <section id="home" className="section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Welcome to Opol Community College Library</h1>
                        <p>
                            Access thousands of books, journals, and digital
                            resources to support your academic journey.
                        </p>
                        <Link to="/auth" className="btn-primary">
                            Get Started
                        </Link>
                    </div>
                    <div className="image">
                        <img src="./images/home.png" alt="Library" />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section">
                <div className="about-content">
                    <div className="image">
                        <img src="./images/about.png" alt="About our library" />
                    </div>
                    <div className="about-text">
                        <h1 id="about">About Our Library</h1>
                        <p>
                            The Opol Community College Library is a
                            state-of-the-art facility dedicated to supporting
                            the academic and research needs of our students and
                            faculty. With over 50,000 physical volumes and
                            access to numerous digital resources, we provide
                            comprehensive support for all learning endeavors.
                        </p>
                        <p>
                            Our professional staff is always available to assist
                            with research questions, resource location, and
                            information literacy instruction.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="service-section">
                <div className="services-header">
                    <h1>Our Services</h1>
                    <p>
                        Discover the range of services we offer to support your
                        academic success
                    </p>
                </div>
                <div className="services-cards">
                    <div className="service-card">
                        <div className="card-image">
                            <img
                                src="./images/service1.png"
                                alt="Book Lending"
                            />
                        </div>
                        <div className="card-text">
                            <h3>Explore Our Online Catalog</h3>
                            <p>
                                Easily search our entire collection of books,
                                textbooks, and references with our user-friendly
                                online catalog system.
                            </p>
                        </div>
                    </div>
                    <div className="service-card">
                        <div className="card-image">
                            <img
                                src="./images/service2.png"
                                alt="Digital Resources"
                            />
                        </div>
                        <div className="card-text">
                            <h3>Request Books Online</h3>
                            <p>
                                Reserve books from home and get notified when
                                they're ready for pickup at your preferred
                                library location.
                            </p>
                        </div>
                    </div>
                    <div className="service-card">
                        <div className="card-image">
                            <img
                                src="./images/service3.png"
                                alt="Research Assistance"
                            />
                        </div>
                        <div className="card-text">
                            <h3>Never Miss a Due Date</h3>
                            <p>
                                Get automatic email and SMS reminders before
                                your books are due, with options to renew online
                                when available.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
