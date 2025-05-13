
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/categories");
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
        setIsSubmitting(true);
        setErrors({});

        // Validate category selection
        if (!formData.selectedCategory && !formData.newCategory.trim()) {
            setErrors(prev => ({ ...prev, categories: "Please select or add a category" }));
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No authentication token found');

            const dataToSend = new FormData();
            dataToSend.append("title", formData.title);
            dataToSend.append("author", formData.author);
            
            // Handle categories
            const categories = [];
            if (formData.selectedCategory) {
                categories.push(formData.selectedCategory);
            } else if (formData.newCategory.trim()) {
                categories.push(formData.newCategory.trim());
            }
            
            categories.forEach((cat, index) => {
                dataToSend.append(`categories[${index}]`, cat);
            });

            dataToSend.append("isbn", formData.isbn);
            dataToSend.append("quantity", formData.quantity);
            dataToSend.append("description", formData.description);
            if (formData.image) dataToSend.append("image", formData.image);

            const api = axios.create({
                baseURL: 'http://localhost:8000',
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            await api.post('/api/add-book', dataToSend);
            const categoriesResponse = await axios.get('/api/categories');
            setExistingCategories(categoriesResponse.data);
            onBookAdded();
            onClose();
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    alert(error.response.data.message || "An error occurred");
                }
            } else {
                alert("Cannot connect to server. Check your network.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Book</h3>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {Object.keys(errors).length > 0 && (
                        <div className="form-errors">
                            {Object.entries(errors).map(([field, messages]) => (
                                <p key={field} className="error-message">
                                    {Array.isArray(messages) ? messages[0] : messages}
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
                                    className={`modern-input ${errors.title ? 'error' : ''}`}
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
                                    className={`modern-input ${errors.author ? 'error' : ''}`}
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
                                    className={`modern-input ${errors.quantity ? 'error' : ''}`}
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
                                            src={URL.createObjectURL(formData.image)}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <>
                                            <CloudUploadIcon fontSize="large" />
                                            <span>Upload Cover Image</span>
                                            <p className="upload-hint">PNG, JPG up to 5MB</p>
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
                                value={formData.selectedCategory || undefined}
                                onValueChange={(value) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        selectedCategory: value,
                                        newCategory: "" // Clear new category when selecting existing one
                                    }));
                                    setErrors(prev => ({ ...prev, categories: undefined }));
                                }}
                            >
                                <Select.Trigger 
                                    className={`select-trigger ${errors.categories ? 'error' : ''}`} 
                                    id="category-select"
                                    aria-label="Category"
                                >
                                    <Select.Value placeholder="Select a category" />
                                    <Select.Icon className="select-icon">
                                        <ChevronDownIcon />
                                    </Select.Icon>
                                </Select.Trigger>
                                
                                <Select.Portal>
                                    <Select.Content className="select-content">
                                        <Select.Viewport className="select-viewport">
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
                                onChange={(e) => {
                                    handleChange(e);
                                    setErrors(prev => ({ ...prev, categories: undefined }));
                                }}
                                placeholder="Enter new category name"
                                disabled={!!formData.selectedCategory}
                                className={`modern-input ${errors.categories ? 'error' : ''}`}
                            />
                        </div>
                        {errors.categories && (
                            <p className="error-message">{errors.categories}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn}
                            onChange={handleChange}
                            className={`modern-input ${errors.isbn ? 'error' : ''}`}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`modern-textarea ${errors.description ? 'error' : ''}`}
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="spinner"></span>
                            ) : (
                                "Publish Book"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;