import React from "react";
import "../../assets/css/AddBookModal.css";
import axios from "axios";

const DeleteBookModal = ({ book, onClose, onBookDeleted }) => {
    const handleDelete = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(`http://localhost:8000/api/books/${book.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.status === 200) {
            onBookDeleted();
            onClose();
        } else {
            throw new Error("Failed to delete book");
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert(error.response?.data?.message || "Failed to delete book");
    }
};

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Delete Book</h3>
                    <button className="close-btn" onClick={onClose}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div className="delete-modal-body">
                    <p>Are you sure you want to delete this book?</p>
                    <div className="book-preview">
                        {book.imageUrl && (
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="preview-image"
                            />
                        )}
                        <h4>{book.title}</h4>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-delete" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBookModal;
