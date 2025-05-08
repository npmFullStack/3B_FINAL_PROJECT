import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";
import "./App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBooks from "./pages/ManageBooks";
import ManageRequest from "./pages/ManageRequest";
import SearchBooks from "./pages/SearchBooks";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    // ===== Axios Global Configuration =====
    // Inside your App component
    useEffect(() => {
        // Set base URL for all Axios requests
        axios.defaults.baseURL = "http://localhost:8000";

        // Enable sending cookies with requests
        axios.defaults.withCredentials = true;

        // Initialize CSRF token
        axios
            .get("/sanctum/csrf-cookie")
            .catch(err => console.error("CSRF init error:", err));

        // Add request interceptor to attach token to every request
        axios.interceptors.request.use(config => {
            // Skip for CSRF cookie request
            if (config.url === "/sanctum/csrf-cookie") {
                return config;
            }

            const token = localStorage.getItem("authToken");
            if (token) {
                // For FormData requests, we need to preserve headers
                if (config.data instanceof FormData) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    };
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        });

        // Add response interceptor to handle token expiration
        axios.interceptors.response.use(
            response => response,
            async error => {
                if (error.response?.status === 401) {
                    // Handle token expiration
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    window.location.href = "/auth";
                }
                return Promise.reject(error);
            }
        );
    }, []);

    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <main>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<Auth />} />

                            {/* Protected routes - Student */}
                            <Route
                                path="/student-dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={["student"]}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/search-books"
                                element={
                                    <ProtectedRoute allowedRoles={["student"]}>
                                        <SearchBooks />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected routes - Librarian/Admin */}
                            <Route
                                path="/librarian-dashboard"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["librarian"]}
                                    >
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/manage-books"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["librarian"]}
                                    >
                                        <ManageBooks />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/manage-requests"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={["librarian"]}
                                    >
                                        <ManageRequest />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
