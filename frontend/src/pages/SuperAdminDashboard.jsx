import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/SuperAdminDashboard.css";

const API = "https://codenexus-backend-0we9.onrender.com";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || user.role !== 'superadmin') {
        navigate('/');
        return;
      }

      try {
        const res = await fetch(`${API}/superadmin/dashboard?email=${user.email}`);
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        alert('Error loading dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading Super Admin Dashboard...</div>;
  }

  return (
    <div className="superadmin-dashboard">
      <header className="dashboard-header">
        <h1>👑 Super Admin Dashboard</h1>
        <div className="header-actions">
          <button 
            className="create-quiz-btn"
            onClick={() => navigate('/create-quiz')}
          >
            ➕ Create Global Quiz
          </button>
          <button 
            className="manage-quiz-btn"
            onClick={() => navigate('/manage-quizzes')}
          >
            📚 Manage All Quizzes
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{dashboardData?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-info">
            <h3>{dashboardData?.totalInstitutes || 0}</h3>
            <p>Total Institutes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-info">
            <h3>{dashboardData?.totalAdmins || 0}</h3>
            <p>Total Admins</p>
          </div>
        </div>
      </div>

      <div className="institutes-section">
        <h2>All Institutes</h2>
        <table className="institutes-table">
          <thead>
            <tr>
              <th>Institute Name</th>
              <th>Admin Email</th>
              <th>Students</th>
              <th>Total Score</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData?.institutes?.map((inst, index) => (
              <tr key={index}>
                <td>{inst.name}</td>
                <td>{inst.adminEmail}</td>
                <td>{inst.studentCount}</td>
                <td>{inst.totalScore}</td>
                <td><code>{inst.code}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;