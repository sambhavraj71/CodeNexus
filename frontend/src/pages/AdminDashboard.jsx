import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/AdminDashboard.css";

const API = "https://codenexus-backend-0we9.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      console.log("🔍 Current User:", user);
      
      if (!user || user.role !== 'admin') {
        navigate('/');
        return;
      }

      try {
        const url = `${API}/admin/dashboard?username=${user.username}`;
        console.log("🔍 Fetching URL:", url);
        
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Error Response:", errorData);
          throw new Error(errorData.detail || 'Failed to fetch dashboard');
        }
        const data = await res.json();
        console.log("✅ Dashboard Data:", data);
        setDashboardData(data);
      } catch (err) {
        alert('Error loading dashboard: ' + err.message);
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
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Institute Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="error-container">
        <p>Unable to load dashboard data. Please try again.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>🏫 {dashboardData?.instituteName || 'Institute Dashboard'}</h1>
          <p className="institute-code">Code: {dashboardData?.instituteCode || 'N/A'}</p>
        </div>
        <div className="header-info">
          <button 
            className="quiz-mgmt-btn"
            onClick={() => navigate('/manage-quizzes')}
          >
            📚 Manage Quizzes
          </button>
          <button 
            className="create-quiz-btn"
            onClick={() => navigate('/create-quiz')}
          >
            ➕ Create Quiz
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-info">
            <h3>{dashboardData?.totalStudents || 0}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{dashboardData?.totalScore || 0}</h3>
            <p>Total Score</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{Math.round(dashboardData?.averageScore || 0)}</h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>

      <div className="students-section">
        <h2>Students List</h2>
        {dashboardData?.students?.length === 0 ? (
          <p className="no-students">No students enrolled yet.</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Score</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.students?.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name || student.username}</td>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.score}</td>
                  <td>Level {student.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card" onClick={() => navigate('/create-quiz')}>
            <div className="quick-action-icon">📝</div>
            <h4>Create New Quiz</h4>
            <p>Create quizzes for your students</p>
          </div>
          <div className="quick-action-card" onClick={() => navigate('/manage-quizzes')}>
            <div className="quick-action-icon">📚</div>
            <h4>Manage Quizzes</h4>
            <p>View, edit or delete quizzes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
