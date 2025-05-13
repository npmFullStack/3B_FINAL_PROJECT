import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

import "../assets/css/Auth.css";
import Header from "../components/Header";

const Auth = () => {
    const { login } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        course: "",
        yearLevel: "",
        section: "",
        idNumber: "",
        password: "",
        confirmPassword: ""
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const initializeCSRF = async () => {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
            withCredentials: true
        });
    };

    const handleLogin = async () => {
    try {
        // 1. Get CSRF cookie first
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
            withCredentials: true
        });

        // 2. Send login request
        const response = await axios.post(
            "http://localhost:8000/api/login",
            {
                id_number: formData.idNumber,
                password: formData.password
            },
            { withCredentials: true }
        );

        // 3. Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // 4. Update auth context
        // You'll need to pass the AuthContext's login function here
        // or use useContext(AuthContext) at the top of your component
        
        // 5. Redirect based on user type
        navigate(
            response.data.user.user_type === "librarian" 
                ? "/librarian-dashboard" 
                : "/student-dashboard"
        );
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        alert("Login failed. Please check credentials and try again.");
    }
};

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            // 1. Initialize CSRF cookie
            await initializeCSRF();

            // 2. Send registration request with credentials
            const response = await axios.post(
                "http://localhost:8000/api/register",
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    course: formData.course,
                    year_level: formData.yearLevel,
                    section: formData.section,
                    id_number: formData.idNumber,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword
                },
                { withCredentials: true } // Required for Sanctum cookies
            );

            // 3. Redirect (no localStorage needed!)
            navigate(
                response.data.user.user_type === "librarian"
                    ? "/librarian-dashboard"
                    : "/student-dashboard"
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        }
    };

    return (
        <>
            <Header />
            <main className="auth-container">
                <div className="auth-left">
                    <img
                        src={
                            isLogin
                                ? "./images/login.png"
                                : "./images/register.png"
                        }
                        alt={isLogin ? "Login" : "Register"}
                    />
                </div>

                <div className="auth-right">
                    {isLogin ? (
                        <>
                            <div className="auth-header">
                                <h1>Welcome Back!</h1>
                                <p>
                                    Please enter your details to login to your
                                    account
                                </p>
                            </div>

                            {/* Login Form */}
                            <form className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="idNumber">ID Number</label>
                                    <input
                                        type="text"
                                        id="idNumber"
                                        name="idNumber" // Add name
                                        placeholder="Enter your ID Number"
                                        value={formData.idNumber} // Bind to state
                                        onChange={handleInputChange} // Add onChange
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="password-input">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            name="password" // Add name
                                            placeholder="Enter your password"
                                            value={formData.password} // Bind to state
                                            onChange={handleInputChange} // Add onChange
                                            required
                                        />
                                        <span
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="auth-button"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </form>

                            <p className="auth-switch">
                                Doesn't have an account?{" "}
                                <span onClick={() => setIsLogin(false)}>
                                    Sign up
                                </span>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="auth-header">
                                <h1>Create Account</h1>
                                <p>Fill in your details to create an account</p>
                            </div>

                            {currentStep === 1 ? (
                                <form className="auth-form">
                                    <div className="name-group">
                                        <div className="form-group">
                                            <label htmlFor="firstName">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                placeholder="First name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="lastName">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Last name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="course">Course</label>
                                        <Select.Root
                                            value={formData.course}
                                            onValueChange={value =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    course: value
                                                }))
                                            }
                                        >
                                            <Select.Trigger
                                                className="select-trigger"
                                                id="course"
                                            >
                                                <Select.Value placeholder="Select Course" />
                                                <Select.Icon>
                                                    <ChevronDownIcon />
                                                </Select.Icon>
                                            </Select.Trigger>
                                            <Select.Portal>
                                                <Select.Content className="select-content">
                                                    <Select.Viewport>
                                                        {[
                                                            "BSIT",
                                                            "BSED",
                                                            "BEED",
                                                            "BSBA-FM",
                                                            "BSBA-MM"
                                                        ].map(course => (
                                                            <Select.Item
                                                                value={course}
                                                                key={course}
                                                                className="select-item"
                                                            >
                                                                <Select.ItemText>
                                                                    {course}
                                                                </Select.ItemText>
                                                                <Select.ItemIndicator>
                                                                    <CheckIcon />
                                                                </Select.ItemIndicator>
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Portal>
                                        </Select.Root>
                                    </div>

                                    <div className="name-group">
                                        <div className="form-group">
                                            <label htmlFor="yearLevel">
                                                Year Level
                                            </label>
                                            <Select.Root
                                                value={formData.yearLevel}
                                                onValueChange={value =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        yearLevel: value
                                                    }))
                                                }
                                            >
                                                <Select.Trigger
                                                    className="select-trigger"
                                                    id="yearLevel"
                                                >
                                                    <Select.Value placeholder="Select Year Level" />
                                                    <Select.Icon>
                                                        <ChevronDownIcon />
                                                    </Select.Icon>
                                                </Select.Trigger>
                                                <Select.Portal>
                                                    <Select.Content className="select-content">
                                                        <Select.Viewport>
                                                            {[
                                                                "1",
                                                                "2",
                                                                "3",
                                                                "4"
                                                            ].map(year => (
                                                                <Select.Item
                                                                    value={year}
                                                                    key={year}
                                                                    className="select-item"
                                                                >
                                                                    <Select.ItemText>
                                                                        {year}
                                                                    </Select.ItemText>
                                                                    <Select.ItemIndicator>
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
                                            <label htmlFor="section">
                                                Section
                                            </label>
                                            <Select.Root
                                                value={formData.section}
                                                onValueChange={value =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        section: value
                                                    }))
                                                }
                                            >
                                                <Select.Trigger
                                                    className="select-trigger"
                                                    id="section"
                                                >
                                                    <Select.Value placeholder="Select Section" />
                                                    <Select.Icon>
                                                        <ChevronDownIcon />
                                                    </Select.Icon>
                                                </Select.Trigger>
                                                <Select.Portal>
                                                    <Select.Content className="select-content">
                                                        <Select.Viewport>
                                                            {[
                                                                "A",
                                                                "B",
                                                                "C",
                                                                "D",
                                                                "E",
                                                                "F",
                                                                "G"
                                                            ].map(section => (
                                                                <Select.Item
                                                                    value={
                                                                        section
                                                                    }
                                                                    key={
                                                                        section
                                                                    }
                                                                    className="select-item"
                                                                >
                                                                    <Select.ItemText>
                                                                        {
                                                                            section
                                                                        }
                                                                    </Select.ItemText>
                                                                    <Select.ItemIndicator>
                                                                        <CheckIcon />
                                                                    </Select.ItemIndicator>
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Viewport>
                                                    </Select.Content>
                                                </Select.Portal>
                                            </Select.Root>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="auth-button"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Next
                                    </button>
                                </form>
                            ) : (
                                <form className="auth-form">
                                    <div className="form-group">
                                        <label htmlFor="idNumber">
                                            ID Number
                                        </label>
                                        <input
                                            type="text"
                                            id="idNumber"
                                            name="idNumber"
                                            placeholder="Enter your ID Number"
                                            value={formData.idNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <div className="password-input">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password"
                                                name="password"
                                                placeholder="Create password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span
                                                className="password-toggle"
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">
                                            Confirm Password
                                        </label>
                                        <div className="password-input">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span
                                                className="password-toggle"
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="form-group"
                                        style={{ display: "flex", gap: "10px" }}
                                    >
                                        <button
                                            type="button"
                                            className="auth-button"
                                            style={{ backgroundColor: "#666" }}
                                            onClick={() => setCurrentStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="auth-button"
                                            onClick={handleRegister}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>
                            )}

                            <p className="auth-switch">
                                Already have an account?{" "}
                                <span
                                    onClick={() => {
                                        setIsLogin(true);
                                        setCurrentStep(1);
                                    }}
                                >
                                    Login
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default Auth;