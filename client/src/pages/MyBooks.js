import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { Menu as MenuIcon } from "@mui/icons-material";
import "../assets/css/SearchBooks.css";

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
  try {
    const res = await axios.get("/api/my-books");
    setBooks(res.data);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};


    const handleReturnBook = async book => {
        try {
            await axios.put(`/api/requests/${book.id}`, {
                internal_status: "returned",
                returned_at: new Date().toISOString()
            });
            toast.success("Book returned successfully!");
            fetchBorrowedBooks();
        } catch (error) {
            console.error("Return error:", error);
            toast.error("Error returning book!");
        }
    };

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        setShowOverlay(!isMinimized);
    };

    const closeSidebar = () => {
        setIsMinimized(true);
        setShowOverlay(false);
    };

    // ...

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
                        <h2>My Borrowed Books</h2>
                    </div>
                </div>
                <div className="content-wrapper">
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : books.length > 0 ? (
                        <div className="book-cards-container">
                            {books.map(book => (
                                <div className="book-card" key={book.id}>
                                    <div className="book-card-content">
                                        <h4 className="book-title">
                                            {book.book.title}
                                        </h4>
                                        <div className="book-category">
                                            {book.book.category}
                                        </div>
                                        <button
                                            className="return-button"
                                            onClick={() =>
                                                handleReturnBook(book)
                                            }
                                        >
                                            Return Book
                                        </button>
                                        {book.internal_status === "overdue" ? (
                                            <div className="overdue-note">
                                                <i
                                                    className="fa fa-exclamation-triangle"
                                                    style={{ color: "red" }}
                                                />
                                                <span style={{ color: "red" }}>
                                                    Overdue! Please pay your
                                                    fine of $
                                                    {/* calculate fine amount */}{" "}
                                                    ASAP.
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="note">
                                                <i className="fa fa-clock-o" />
                                                <span>
                                                    Due Date:{" "}
                                                    {new Date(
                                                        book.due_date
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">
                            <p>No borrowed books found!</p>
                        </div>
                    )}
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

export default MyBooks;
