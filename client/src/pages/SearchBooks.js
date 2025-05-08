// pages/SearchBooks.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu as MenuIcon, Search } from "@mui/icons-material";
import DataTable from "react-data-table-component";
import axios from "axios";
import RequestBookModal from "../components/modal/RequestBookModal";
import "../assets/css/ManageBooks.css";

const SearchBooks = () => {
    const [books, setBooks] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const fetchBooks = async () => {
        try {
            const res = await axios.get("/api/books");
            const booksData = res.data.map(book => ({
                ...book,
                category:
                    book.categories?.map(c => c.name).join(", ") ||
                    "Uncategorized",
                imageUrl: book.image_path
                    ? `http://localhost:8000/storage/${book.image_path}`
                    : null
            }));
            setBooks(booksData);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = book => {
        setSelectedBook(book);
        setShowModal(true);
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

    const filteredBooks = books.filter(
        b =>
            b.title.toLowerCase().includes(filterText.toLowerCase()) ||
            b.author.toLowerCase().includes(filterText.toLowerCase()) ||
            b.category.toLowerCase().includes(filterText.toLowerCase())
    );

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

    const columns = [
        {
            name: "Cover",
            cell: row =>
                row.imageUrl ? (
                    <img
                        src={row.imageUrl}
                        alt={row.title}
                        style={{ width: 50, height: 70, objectFit: "cover" }}
                    />
                ) : (
                    <span>No Image</span>
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
            wrap: true
        },
        {
            name: "Available",
            selector: row => row.available,
            center: true
        },
{
            name: "Action",
            cell: row => (
                <button
                    className="btn-request"
                    onClick={() => handleRequest(row)}  // Just trigger the modal
                >
                    Request
                </button>
            ),
            center: true
        }
    ];

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
                        <h2>Search Books</h2>
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

            {showModal && selectedBook && (
                <RequestBookModal
                    book={{
                        ...selectedBook,
                        image: selectedBook.imageUrl  // Fix the image prop
                    }}
                    onClose={() => setShowModal(false)}
                    onRequest={async bookId => {
                        try {
                            const response = await axios.post(
                                "/api/request-book",
                                { book_id: bookId },
                                {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`
                                    }
                                }
                            );
                            alert("Request submitted successfully!");
                            setShowModal(false);
                        } catch (error) {
                            console.error("Request error:", error);
                            alert(
                                error.response?.data?.message ||
                                "Failed to submit request"
                            );
                        }
                    }}
                />
            )}
        </div>
        
        </div>
    );
};



export default SearchBooks;
