import React, { useState, useEffect } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../assets/css/AddBookModal.css";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

const AddBookModal = ({ onClose, onBookAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        selectedCategory: "",
        newCategory: "",
        isbn: "",
        quantity: 1,
        description: "",
        image: null
    });

    const [existingCategories, setExistingCategories] = useState([]);
    const [errors, setErrors] = useState(null);

    // Fetch existing categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/categories"
                );
                // Assuming response.data is an array of strings (category names)
                setExistingCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = e => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async e => {
    e.preventDefault();

    // Prepare categories array
    const categories = [];
    if (formData.selectedCategory) {
        categories.push(formData.selectedCategory);
    }
    if (formData.newCategory.trim()) {
        categories.push(formData.newCategory.trim());
    }

    if (categories.length === 0) {
        alert("Please select or add at least one category");
        return;
    }

    try {
        // Get token from storage
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("author", formData.author);
        categories.forEach((cat, index) => {
            dataToSend.append(`categories[${index}]`, cat);
        });
        dataToSend.append("isbn", formData.isbn);
        dataToSend.append("quantity", formData.quantity);
        dataToSend.append("description", formData.description);
        if (formData.image) dataToSend.append("image", formData.image);

        // Create a specific axios instance for this request
        const api = axios.create({
            baseURL: 'http://localhost:8000',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        const response = await api.post('/api/add-book', dataToSend);

        // Refresh categories after successful submission
        const categoriesResponse = await axios.get('/api/categories');
        setExistingCategories(categoriesResponse.data);

        console.log("Success:", response.data);
        onBookAdded();
        onClose();
    } catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            alert(
                `Server error: ${
                    error.response.data.message || error.response.statusText
                }`
            );
        } else {
            alert("Cannot connect to server. Check your network.");
        }
    }
};

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add New Book</h3>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {errors && (
                        <div className="form-errors">
                            {Object.values(errors).map((error, index) => (
                                <p key={index} className="error-message">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                    <div className="form-container">
                        <div className="text-fields">
                            <div className="form-group">
                                <label>Book Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="image-upload">
                            <label className="image-upload-label">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                                <div className="image-upload-box">
                                    {formData.image ? (
                                        <img
                                            src={URL.createObjectURL(
                                                formData.image
                                            )}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <>
                                            <CloudUploadIcon fontSize="large" />
                                            <span>Upload Cover Image</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>


<div className="category-container">
    <div className="form-group">
        <label htmlFor="category-select">Select Category</label>
        <Select.Root
            value={formData.selectedCategory || undefined} // Use undefined instead of empty string
            onValueChange={(value) => {
                setFormData(prev => ({
                    ...prev,
                    selectedCategory: value || "", // Convert undefined back to empty string
                    newCategory: value ? "" : prev.newCategory // Clear new category if selecting existing
                }));
            }}
        >
            <Select.Trigger 
                className="select-trigger" 
                id="category-select"
                aria-label="Category"
            >
                <Select.Value placeholder="-- Select a category --" />
                <Select.Icon className="select-icon">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
                <Select.Content className="select-content">
                    <Select.ScrollUpButton />
                    <Select.Viewport className="select-viewport">
                        {/* Remove the empty value item since Radix doesn't allow it */}
                        {existingCategories.map((category, index) => (
                            <Select.Item
                                value={category}
                                key={`category-${index}`}
                                className="select-item"
                            >
                                <Select.ItemText>{category}</Select.ItemText>
                                <Select.ItemIndicator className="select-item-indicator">
                                    <CheckIcon />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    </div>
    
    <div className="form-group">
        <label htmlFor="new-category">Or Add New Category</label>
        <input
            type="text"
            id="new-category"
            name="newCategory"
            value={formData.newCategory}
            onChange={handleChange}
            placeholder="Enter new category name"
            disabled={!!formData.selectedCategory}
        />
    </div>
</div>
                    <div className="form-group">
                        <label>ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;
