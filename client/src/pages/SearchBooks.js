// pages/SearchBooks.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
    Menu as MenuIcon,
    Search,
    FilterList,
    MoreVert
} from "@mui/icons-material";
import axios from "axios";
import ViewBookModal from "../components/modal/ViewBookModal";
import "../assets/css/SearchBooks.css";

const SearchBooks = () => {
    const [books, setBooks] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Extract unique categories
    const uniqueCategories = [...new Set(books.map(book => book.category))];

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

    

    const handleView = book => {
        setSelectedBook(book);
        setShowViewModal(true);
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

    // Generate consistent color for each category
    const getCategoryColor = category => {
        const colors = [
            "#3498db", // Blue
            "#e74c3c", // Red
            "#2ecc71", // Green
            "#f39c12", // Orange
            "#9b59b6", // Purple
            "#1abc9c", // Turquoise
            "#34495e", // Dark Blue
            "#d35400", // Dark Orange
            "#27ae60", // Dark Green
            "#8e44ad" // Dark Purple
        ];

        // Create a simple hash function for string
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Get positive index
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(filterText.toLowerCase()) ||
            book.author.toLowerCase().includes(filterText.toLowerCase());

        const matchesCategory =
            categoryFilter === "" ||
            book.category.toLowerCase().includes(categoryFilter.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const availableBooks = books.filter(book => book.available > 0).length;

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
                    <h3 className="books-counter">
                        {availableBooks} Books Available
                    </h3>

                    <div className="search-container">
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={filterText}
                                onChange={e => setFilterText(e.target.value)}
                            />
                            <div className="filter-container">
                                <FilterList
                                    className="filter-icon"
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                />
                                {showDropdown && (
                                    <div className="category-dropdown">
                                        <div
                                            className={`category-option ${
                                                categoryFilter === ""
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setCategoryFilter("");
                                                setShowDropdown(false);
                                            }}
                                        >
                                            All Categories
                                        </div>
                                        {uniqueCategories.map(
                                            (category, index) => (
                                                <div
                                                    key={index}
                                                    className={`category-option ${
                                                        categoryFilter ===
                                                        category
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        setCategoryFilter(
                                                            category
                                                        );
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {category}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : filteredBooks.length > 0 ? (

<div className="book-cards-container">
  {filteredBooks.map((book, index) => (
    <div className="book-card" key={index}>
      <div className="book-card-header">
        <div className="book-header-left">
          <h4 className="book-title">{book.title}</h4>
          <div
            className="book-category"
            style={{ backgroundColor: getCategoryColor(book.category) }}
          >
            {book.category}
          </div>
        </div>
        <div className="book-header-right">
          <MoreVert
            className="more-icon"
            onClick={(e) => {
              e.stopPropagation();
              const dropdown = e.currentTarget.nextElementSibling;
              dropdown.classList.toggle("show");
            }}
          />
          <div className="card-dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleView(book)}
            >
              View
            </div>
          </div>
        </div>
      </div>
      <div className="book-image-container">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="book-image"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
    </div>
  ))}
</div>

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


                {showViewModal && selectedBook && (
                    <ViewBookModal
                        book={selectedBook}
                        onClose={() => setShowViewModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchBooks;
