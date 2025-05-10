import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import axios from "axios";
import "../../assets/css/ViewBookModal.css";

const ViewBookModal = ({ book, onClose, onRequest }) => {
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!book || !book.id) {
                setError("Book information is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await axios.get("/api/books");
                const books = response.data;
                const foundBook = books.find(b => b.id === book.id);

                if (foundBook) {
                    setBookDetails(foundBook);
                } else {
                    setError("Book not found");
                }
            } catch (err) {
                console.error("Error fetching book details:", err);
                setError("Failed to fetch book details");
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [book]);

    const handleRequest = async () => {
        if (!bookDetails || !bookDetails.id) return;

        try {
            const response = await axios.post(
                "/api/request-book",
                { book_id: bookDetails.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("Request submitted successfully!");
            onClose();
        } catch (error) {
            console.error("Request error:", error);
            alert(error.response?.data?.message || "Failed to submit request");
        }
    };

    // Function to render category badges
    const renderCategories = categories => {
        if (!categories || categories.length === 0) {
            return <span className="no-categories">No categories</span>;
        }

        return categories.map((category, index) => (
            <span key={index} className="category-badge">
                {category.name}
            </span>
        ));
    };

    return (
        <div className="modal-overlay">
            <div className="view-book-modal">
                <div className="modal-header">
                    <h2>Book Details</h2>
                    <button className="close-button" onClick={onClose}>
                        <Close />
                    </button>
                </div>

                {loading ? (
                    <div className="modal-loader">Loading book details...</div>
                ) : error ? (
                    <div className="modal-error">{error}</div>
                ) : bookDetails ? (
                    <div className="book-details">
                        <div className="book-image-section">
                            {bookDetails.image_path ? (
                                <img
                                    src={`http://localhost:8000/storage/${bookDetails.image_path}`}
                                    alt={bookDetails.title}
                                    className="book-cover"
                                />
                            ) : (
                                <div className="no-cover">
                                    <span>No Cover Image</span>
                                </div>
                            )}
                        </div>

                        <div className="book-info-section">
                            <h3 className="book-title">{bookDetails.title}</h3>
                            <div className="book-meta">
                                <p className="book-author">
                                    <strong>Author:</strong>{" "}
                                    {bookDetails.author}
                                </p>
                                {bookDetails.isbn && (
                                    <p className="book-isbn">
                                        <strong>ISBN:</strong>{" "}
                                        {bookDetails.isbn}
                                    </p>
                                )}
                                <p className="book-availability">
                                    <strong>Available:</strong>{" "}
                                    {bookDetails.available} of{" "}
                                    {bookDetails.quantity}
                                </p>
                            </div>

                            <div className="book-categories">
                                <strong>Categories:</strong>
                                <div className="categories-container">
                                    {renderCategories(bookDetails.categories)}
                                </div>
                            </div>

                            {bookDetails.description && (
                                <div className="book-description">
                                    <strong>Description:</strong>
                                    <p>{bookDetails.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="modal-error">No book data available</div>
                )}

                <div className="modal-actions">
                    {bookDetails && bookDetails.available > 0 && (
                        <button
                            className="request-button"
                            onClick={handleRequest}
                        >
                            Request Book
                        </button>
                    )}
                    {bookDetails && bookDetails.available === 0 && (
                        <button className="unavailable-button" disabled>
                            Currently Unavailable
                        </button>
                    )}
                    <button className="cancel-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewBookModal;
