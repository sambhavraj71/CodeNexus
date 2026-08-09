import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Login.css";
// Correct import
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const API = "https://codenexus-backend-0we9.onrender.com
";
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "student",
        institute_code: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (isLogin) {
            if (!formData.username || !formData.password) {
                alert("Please fill all fields");
                return;
            }
        } else {
            if (!formData.username || !formData.email || !formData.password) {
                alert("Please fill all fields");
                return;
            }
        }

        try {
            const endpoint = isLogin ? "/login" : "/signup";
            const payload = isLogin
                ? {
                      username: formData.username,
                      password: formData.password
                  }
                : {
                      username: formData.username,
                      email: formData.email,
                      password: formData.password,
                      role: formData.role,
                      institute_code: formData.institute_code.trim() || null
                  };

            const res = await axios.post(API + endpoint, payload);
            
            if (res.data.message) {
                alert(res.data.message);
            }
            
            const userData = res.data.user || res.data.admin;
            localStorage.setItem("currentUser", JSON.stringify(userData));
            
            if (userData.role === "superadmin") {
                navigate("/superadmin-dashboard");
            } else if (userData.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            alert(err.response?.data?.detail || "Authentication Failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-tabs">
                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => setIsLogin(false)}
                    >
                        Signup
                    </button>
                </div>

                <h2>
                    {isLogin ? "Welcome Back 👋" : "Create New Account"}
                </h2>

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />

                {!isLogin && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        
                        <div className="institute-code-field">
                            <input
                                type="text"
                                placeholder="Institute Code (Optional)"
                                name="institute_code"
                                value={formData.institute_code}
                                onChange={handleChange}
                            />
                            <small className="code-hint">
                                💡 Enter institute code to join a specific institute
                            </small>
                        </div>
                    </>
                )}

                <div className="password-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                    {isLogin ? "Login" : "Signup"}
                </button>

                <p className="switch-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? " Signup" : " Login"}
                    </span>
                </p>

                {/* Admin Login Button */}
                <div className="admin-login-link">
                    <button 
                        className="admin-link-btn"
                        onClick={() => navigate('/admin-login')}
                    >
                        🏫 Login as Institute Admin
                    </button>
                </div>

                {/*Super Admin Login Button */}
                <div className="admin-login-link">
                    <button
                        className="admin-link-btn"
                        onClick={() => navigate("/superadmin-login")}
                    >
                        👑 Login as Super Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
