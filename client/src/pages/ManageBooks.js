import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
    Menu as MenuIcon,
    Edit,
    Delete,
    Add,
    Search
} from "@mui/icons-material";
import DataTable from "react-data-table-component";
import AddBookModal from "../components/modal/AddBookModal";
import EditBookModal from "../components/modal/EditBookModal";
import DeleteBookModal from "../components/modal/DeleteBookModal";
import "../assets/css/ManageBooks.css";
import axios from "axios";

const ManageBooks = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterText, setFilterText] = useState("");

    const [editingBook, setEditingBook] = useState(null);
    const [deletingBook, setDeletingBook] = useState(null);

    // Fetch books data with categories and images
    const fetchBooks = async () => {
    try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/books");
        const booksWithData = response.data.map(book => ({
            ...book,
            category: book.categories?.map(c => c.name).join(", ") || "No category",
            imageUrl: book.image_path ? `http://localhost:8000/storage/${book.image_path}` : null
        }));
        setBooks(booksWithData);
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchBooks();
    }, []);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
        setShowOverlay(!isMinimized);
    };

    const closeSidebar = () => {
        setIsMinimized(true);
        setShowOverlay(false);
    };

    // Filter books based on search text
    const filteredBooks = books.filter(
        item =>
            item.title.toLowerCase().includes(filterText.toLowerCase()) ||
            item.author.toLowerCase().includes(filterText.toLowerCase()) ||
            item.category.toLowerCase().includes(filterText.toLowerCase())
    );

    // Custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                backgroundColor: "#f5f5f5"
            }
        },
        cells: {
            style: {
                padding: "12px"
            }
        }
    };

    // Table columns
    const columns = [
        {
            name: "Cover",
            cell: row =>
                row.imageUrl ? (
                    <img
                        src={row.imageUrl}
                        alt={row.title}
                        className="book-cover"
                        style={{
                            width: "50px",
                            height: "70px",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <div className="no-cover">No Image</div>
                ),
            width: "80px"
        },
        {
            name: "Title",
            selector: row => row.title,
            sortable: true,
            wrap: true
        },
        {
            name: "Author",
            selector: row => row.author,
            sortable: true
        },
        {
            name: "Categories",
            selector: row => row.category,
            sortable: true,
            wrap: true
        },
        {
            name: "Available",
            selector: row => row.available,
            sortable: true,
            center: true
        },
        {
            name: "Stock",
            selector: row => row.quantity,
            sortable: true,
            center: true
        },
        {
            name: "Added",
            selector: row => new Date(row.created_at).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Actions",
            cell: row => (
                <div className="action-buttons">
                    <button
                        className="btn-icon btn-edit"
                        title="Edit"
                        onClick={() => handleEdit(row.id)}
                    >
                        <Edit fontSize="small" />
                    </button>
                    <button
                        className="btn-icon btn-delete"
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                    >
                        <Delete fontSize="small" />
                    </button>
                </div>
            ),
            width: "120px"
        }
    ];

    const handleEdit = id => {
        const bookToEdit = books.find(book => book.id === id);
        if (bookToEdit) {
            setEditingBook(bookToEdit);
        }
    };

    const handleDelete = id => {
        const bookToDelete = books.find(book => book.id === id);
        if (bookToDelete) {
            setDeletingBook(bookToDelete);
        }
    };

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
                        <h2>Manage Books</h2>
                    </div>
                </div>

                <div className="content-wrapper">
                    <div className="table-header">
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Add
                                fontSize="small"
                                style={{ marginRight: "8px" }}
                            />
                            Add Book
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : books.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={filteredBooks}
                            pagination
                            highlightOnHover
                            responsive
                            striped
                            defaultSortField="title"
                            customStyles={customStyles}
                            subHeader
                            subHeaderComponent={
                                <div style={{ display: "none" }} /> // Hide default search
                            }
                        />
                    ) : (
                        <div className="no-data">
                            <img
                                src="./images/no-data.png"
                                alt="No data available"
                            />
                            <p>No books found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Book Modal */}
            {showAddModal && (
                <AddBookModal
                    onClose={() => setShowAddModal(false)}
                    onBookAdded={fetchBooks}
                />
            )}

            {/* Edit Book Modal */}
            {editingBook && (
                <EditBookModal
                    bookId={editingBook.id}
                    onClose={() => setEditingBook(null)}
                    onBookUpdated={fetchBooks}
                />
            )}

            {/* Delete Book Modal */}
            {deletingBook && (
                <DeleteBookModal
                    book={deletingBook}
                    onClose={() => setDeletingBook(null)}
                    onBookDeleted={fetchBooks}
                />
            )}
        </div>
    );
};

export default ManageBooks;
