import React from "react";
import "../../assets/css/AddBookModal.css";

const RequestBookModal = ({ book, onClose, onRequest }) => {
    if (!book) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Request Book</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="book-preview">
                        {book.image ? (
                            <img src={book.image} alt={book.title} className="book-image" />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>
                    <p><strong>Title:</strong> {book.title}</p>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Category:</strong> {book.category}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button 
                        className="btn-submit" 
                        onClick={() => onRequest(book.id)}
                    >
                        Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestBookModal;