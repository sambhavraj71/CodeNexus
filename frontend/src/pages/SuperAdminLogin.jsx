import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function SuperAdminLogin() {
    const navigate = useNavigate();
    const API = "http://127.0.0.1:8000";

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await axios.post(`${API}/superadmin/login`, {
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem(
                "currentUser",
                JSON.stringify(res.data.admin)
            );

            navigate("/superadmin-dashboard");

        } catch (err) {
            alert(err.response?.data?.detail || "Login Failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2>👑 Super Admin Login</h2>

                <input
                    type="email"
                    placeholder="Super Admin Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

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

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                >
                    Login
                </button>

                <div className="admin-login-link">
                    <button
                        className="admin-link-btn"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Student Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SuperAdminLogin;