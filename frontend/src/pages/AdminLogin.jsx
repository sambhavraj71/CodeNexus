import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();
    const API = "https://codenexus-backend-0we9.onrender.com";
";
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            console.log("🔍 Admin Login Attempt:", {
                username: formData.username,
                password: formData.password
            });

            const res = await axios.post(API + "/admin/login", {
                username: formData.username,
                password: formData.password
            });

            console.log("✅ Admin Login Response:", res.data);

            if (res.data.success) {
                localStorage.setItem("currentUser", JSON.stringify(res.data.admin));
                alert("✅ Admin Login Successful!");
                navigate("/admin-dashboard");
            }
        } catch (err) {
            console.error("❌ Admin Login Error:", err);
            alert(err.response?.data?.detail || "Login Failed");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-icon">🏫</div>
                    <h2>Institute Admin Login</h2>
                    <p>Login to manage your institute</p>
                </div>

                <div className="admin-login-form">
                    <div className="form-group">
                        <label>
                            <i className="fas fa-user"></i>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your admin username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <i className="fas fa-lock"></i>
                            Password
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button className="login-btn" onClick={handleSubmit}>
                        <i className="fas fa-sign-in-alt"></i>
                        Login as Admin
                    </button>

                    <div className="admin-help">
                        <p>
                            <i className="fas fa-info-circle"></i>
                            Don't have an admin account? Contact super admin.
                        </p>
                    </div>

                    <button 
                        className="back-btn" 
                        onClick={() => navigate('/')}
                    >
                        ← Back to Student Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
