import React, { useState, useEffect } from 'react';
import "../styles/Leaderboard.css";
import { useNavigate } from 'react-router-dom';

const API = "https://codenexus-backend-0we9.onrender.com";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [instituteUsers, setInstituteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [stats, setStats] = useState({ total: 0, topScore: 0, avgScore: 0 });

  const getUserInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const getUserColor = (username) => {
    const colors = [
      "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
      "#ec4899", "#f43f5e", "#f59e0b", "#10b981",
      "#06b6d4", "#3b82f6"
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const loadLeaderboard = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!storedUser) {
        navigate('/');
        return;
      }
      setCurrentUser(storedUser);

      const globalRes = await fetch(`${API}/leaderboard`);
      const globalData = await globalRes.json();
      setUsers(globalData);

      // Calculate stats
      const total = globalData.length;
      const topScore = total > 0 ? globalData[0]?.score || 0 : 0;
      const avgScore = total > 0 ? Math.round(globalData.reduce((sum, u) => sum + u.score, 0) / total) : 0;
      setStats({ total, topScore, avgScore });

      if (storedUser.instituteId) {
        const instituteRes = await fetch(`${API}/leaderboard?institute_id=${storedUser.instituteId}`);
        const instituteData = await instituteRes.json();
        setInstituteUsers(instituteData);
      }

    } catch (err) {
      console.error(err);
      alert("Leaderboard backend not running");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderLeaderboardList = (data) => {
    return data.map((user, index) => {
      const rank = index + 1;
      const isYou = user.username === currentUser?.username;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

      return (
        <li 
          key={user.username} 
          className={`leaderboard-item ${isYou ? 'current-user' : ''}`}
          style={{ animationDelay: `${(index + 1) * 0.05}s` }}
        >
          <div className={`rank ${rankClass}`}>
            <span className="rank-number">{rank}</span>
            {rank <= 3 && <span className="rank-emoji">{getRankEmoji(rank)}</span>}
          </div>
          <div className="user-info">
            <div 
              className="user-avatar" 
              style={{ background: getUserColor(user.username) }}
            >
              {getUserInitials(user.username)}
              {isYou && <span className="you-indicator">●</span>}
            </div>
            <div className="user-details">
              <h3>
                {user.username}
                {isYou && <span className="you-tag">you</span>}
              </h3>
              <div className="user-meta">
                <span className="level-badge-sm">Lv.{user.level}</span>
                <span className="cert-count">📜 {user.levelCertificates?.length || 0}</span>
              </div>
            </div>
          </div>
          <div className="score">
            <span className="score-value">{user.score}</span>
            <span className="score-label">XP</span>
          </div>
          <div className="level-badge">Level {user.level}</div>
        </li>
      );
    });
  };

  return (
    <div className="leaderboard-page">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">
          <span className="prompt">$</span> cat /leaderboard
        </div>
        <div className="terminal-actions">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <span className="icon">⌂</span>
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="leaderboard-header-section">
        <div className="header-left">
          <h1 className="page-title">
            <span className="title-icon">🏆</span>
            Leaderboard
          </h1>
          <p className="page-subtitle">// ranking the top performers</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-pill-icon">👥</span>
            <span className="stat-pill-value">{stats.total}</span>
            <span className="stat-pill-label">players</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-icon">⭐</span>
            <span className="stat-pill-value">{stats.topScore}</span>
            <span className="stat-pill-label">top score</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-icon">📊</span>
            <span className="stat-pill-value">{stats.avgScore}</span>
            <span className="stat-pill-label">avg score</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <span className="tab-icon">🌍</span>
          Global
        </button>
        {currentUser?.instituteId && (
          <button 
            className={`tab ${activeTab === 'institute' ? 'active' : ''}`}
            onClick={() => setActiveTab('institute')}
          >
            <span className="tab-icon">🏛️</span>
            Institute
          </button>
        )}
      </div>

      {/* Leaderboard Container */}
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-rank">#</div>
          <div className="header-player">Player</div>
          <div className="header-score">Score</div>
          <div className="header-level">Level</div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="loader"></div>
            <p className="loading-text">Loading rankings...</p>
          </div>
        ) : (
          <ul className="leaderboard-list">
            {activeTab === 'global' ? (
              users.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">◇</span>
                  <p>// no players registered yet</p>
                </div>
              ) : (
                renderLeaderboardList(users)
              )
            ) : (
              instituteUsers.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">◇</span>
                  <p>// no institute members yet</p>
                </div>
              ) : (
                renderLeaderboardList(instituteUsers)
              )
            )}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="leaderboard-footer">
        <span className="footer-text">// live rankings • updated every 30s</span>
      </div>
    </div>
  );
};

export default Leaderboard;