import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const API = "http://127.0.0.1:8000";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      navigate('/');
      return;
    }

    const loadDashboard = async () => {
      try {
        const res = await fetch(`${API}/user/${storedUser.username}`);
        if (!res.ok) throw new Error("Backend not responding");
        const data = await res.json();
        setUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
      } catch (err) {
        alert("Dashboard backend not running");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p className="loading-text">Initializing system...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <p className="error-text">// ERROR: Unable to load profile data</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          <span className="retry-icon">⟳</span> Retry
        </button>
      </div>
    );
  }

  const MAX_POINTS = 80;
  const percent = Math.min(Math.round((user.score / MAX_POINTS) * 100), 100);
  const certCount = (user.subjectCertificates?.length || 0) + (user.levelCertificates?.length || 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get level badge color
  const getLevelColor = (level) => {
    const colors = ['#4ade80', '#60a5fa', '#f59e0b', '#f472b6', '#a78bfa'];
    return colors[level - 1] || colors[0];
  };

  // Get badge emoji based on badge name
  const getBadgeEmoji = (badge) => {
    const emojiMap = {
      "Code Novice": "🟢",
      "Script Learner": "🔵",
      "Bug Buster": "🟡",
      "DevOps Master": "🟣"
    };
    return emojiMap[badge] || "◆";
  };

  return (
    <div className="dashboard">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">
          <span className="prompt">$</span> echo "Welcome, {user.username}"
        </div>
        <div className="terminal-actions">
          <button className="btn-notification" onClick={() => goTo('/notifications')}>
            <span className="icon">🔔</span>
            {user.notifications > 0 && (
              <span className="notification-count">{user.notifications}</span>
            )}
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <span className="icon">⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Welcome Section - Terminal Style */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="greeting-line">
            <span className="line-number">01</span>
            <span className="greeting">{getGreeting()}</span>
          </div>
          <h2 className="username-display">
            <span className="user-icon">👨‍💻</span>
            {user.username}
          </h2>
          <p className="subtitle">// Building a sustainable future through code</p>
          <div className="user-status">
            {user.isInstituteMember ? (
              <div className="institute-badge">
                <span className="badge-icon">🏛️</span>
                <span>{user.instituteName || 'Institute Member'}</span>
              </div>
            ) : (
              <div className="student-badge">
                <span className="badge-icon">🧑‍💻</span>
                <span>Independent Developer</span>
              </div>
            )}
            <div className="role-badge">
              <span className="badge-icon">⚡</span>
              <span>{user.role}</span>
            </div>
          </div>
        </div>
        <div className="welcome-avatar">
          <div className="avatar-circle">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="avatar-status online"></div>
        </div>
      </div>

      {/* Stats Grid - Code Style */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon level-icon">⚡</div>
          <div className="stat-content">
            <h3>LEVEL</h3>
            <p className="stat-value" style={{ color: getLevelColor(user.level) }}>
              {user.level}
            </p>
            <span className="stat-label">// experience points</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon score-icon">⭐</div>
          <div className="stat-content">
            <h3>SCORE</h3>
            <p className="stat-value">{user.score}</p>
            <span className="stat-label">// total points</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon streak-icon">🔥</div>
          <div className="stat-content">
            <h3>STREAK</h3>
            <p className="stat-value">{user.streak || 0}</p>
            <span className="stat-label">// days consecutive</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon quality-icon">💻</div>
          <div className="stat-content">
            <h3>QUALITY</h3>
            <p className="stat-value">{user.codeQuality || 0}%</p>
            <span className="stat-label">// code quality score</span>
          </div>
        </div>
      </div>

      {/* Rank & Badges - Code Style */}
      <div className="rank-badges-section">
        <div className="rank-card">
          <div className="rank-content">
            <span className="rank-icon">👑</span>
            <div>
              <span className="rank-label">// RANK</span>
              <span className="rank-number">#{user.rank}</span>
            </div>
          </div>
        </div>
        <div className="badges-card">
          <div className="badges-content">
            <span className="badges-icon">🏅</span>
            <div className="badges-list">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <span className="badge-item" key={idx}>
                    <span className="badge-dot">{getBadgeEmoji(badge)}</span>
                    {badge}
                  </span>
                ))
              ) : (
                <span className="badge-item empty">// no achievements yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section - Code Style */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>📊 Progress</h3>
          <span className="progress-percent">{percent}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${percent}%` }}>
            <span className="progress-text">{percent}%</span>
          </div>
        </div>
        <div className="progress-details">
          <span><span className="detail-icon">◆</span> {user.score} / {MAX_POINTS} XP</span>
          <span><span className="detail-icon">◆</span> {certCount} certificates</span>
        </div>
      </div>

      {/* Quick Actions - Code Style */}
      <div className="quick-actions">
        <h3>🚀 Quick Commands</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => goTo('/quiz')}>
            <span className="action-icon">📝</span>
            <span>Quiz</span>
            <span className="action-shortcut">Ctrl+Q</span>
          </button>
          <button className="action-btn" onClick={() => goTo('/leaderboard')}>
            <span className="action-icon">📊</span>
            <span>Leaderboard</span>
            <span className="action-shortcut">Ctrl+L</span>
          </button>
          <button className="action-btn" onClick={() => goTo('/certificate')}>
            <span className="action-icon">🎓</span>
            <span>Certificates</span>
            <span className="action-shortcut">Ctrl+C</span>
          </button>
          <button className="action-btn" onClick={() => goTo('/profile')}>
            <span className="action-icon">👤</span>
            <span>Profile</span>
            <span className="action-shortcut">Ctrl+P</span>
          </button>
        </div>
      </div>

      {/* Learning Hub - Code Style */}
      <div className="section-title">
        <h3>📚 Learning Repository</h3>
        <p>// explore, learn, and level up</p>
      </div>

      <div className="learning-cards">
        <div onClick={() => goTo('/quiz')} className="learning-card quiz-card">
          <div className="card-icon-wrapper">📝</div>
          <h4>Quizzes</h4>
          <p>// test your knowledge</p>
          <div className="card-footer">
            <span className="card-badge">new challenges</span>
          </div>
        </div>
        
        <div onClick={() => goTo('/leaderboard')} className="learning-card leaderboard-card">
          <div className="card-icon-wrapper">🏆</div>
          <h4>Leaderboard</h4>
          <p>// see where you rank</p>
          <div className="card-footer">
            <span className="card-rank">#{user.rank}</span>
          </div>
        </div>
        
        <div onClick={() => goTo('/certificate')} className="learning-card certificate-card">
          <div className="card-icon-wrapper">📜</div>
          <h4>Achievements</h4>
          <p>// your earned badges</p>
          <div className="card-footer">
            <span className="card-count">{certCount} earned</span>
          </div>
        </div>
      </div>

      {/* Recent Activity - Code Style */}
      <div className="activity-section">
        <h3>📋 Recent Activity</h3>
        <div className="activity-list">
          {user.recentActivity && user.recentActivity.length > 0 ? (
            user.recentActivity.map((activity, idx) => (
              <div className="activity-item" key={idx}>
                <span className="activity-line">[{String(idx + 1).padStart(2, '0')}]</span>
                <div className="activity-content">
                  <p>{activity.text}</p>
                  <span className="activity-time">
                    <span className="xp-icon">✦</span> +{activity.points} XP
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-item empty-activity">
              <span className="activity-line">[--]</span>
              <div className="activity-content">
                <p>// no activity logged</p>
                <span className="activity-time">// start a quiz to earn XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation - Code Style */}
      <div className="footer-nav">
        <button onClick={() => goTo('/dashboard')} className="nav-btn active">
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>
        <button onClick={() => goTo('/quiz')} className="nav-btn">
          <span className="nav-icon">⌨</span>
          <span>Quiz</span>
        </button>
        <button onClick={() => goTo('/leaderboard')} className="nav-btn">
          <span className="nav-icon">▣</span>
          <span>Rank</span>
        </button>
        <button onClick={() => goTo('/profile')} className="nav-btn">
          <span className="nav-icon">◉</span>
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;