import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const API = "http://127.0.0.1:8000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      navigate('/');
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/profile/${storedUser.username}`);
        if (!res.ok) throw new Error('Failed to load profile');
        
        const data = await res.json();
        setUser(data);

        const lastLevel = parseInt(localStorage.getItem('lastLevel') || '1');
        if (data.level > lastLevel) {
          showAchievement(`🎉 Level Up! Reached level ${data.level}`);
          localStorage.setItem('lastLevel', data.level);
        }
        
        const lastBadges = JSON.parse(localStorage.getItem('lastBadges') || '[]');
        const newBadges = data.badges.filter(badge => !lastBadges.includes(badge));
        if (newBadges.length > 0) {
          newBadges.forEach(badge => {
            showAchievement(`🏆 New Badge: ${badge}`);
          });
          localStorage.setItem('lastBadges', JSON.stringify(data.badges));
        }

      } catch (error) {
        console.error('Error loading profile:', error);
        showNotification('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const showAchievement = (message) => {
    setAchievement(message);
    setTimeout(() => setAchievement(null), 3000);
  };

  const getBadgeIcon = (badgeName) => {
    const icons = {
      'Code Novice': '🟢',
      'Script Learner': '🔵',
      'Bug Buster': '🟡',
      'DevOps Master': '🟣',
      'Beginner': '🎯',
      'Explorer': '🌍',
      'Hero': '🛡️',
      'Master': '👑',
      'Scholar': '🎓',
      'Streak Master': '🔥',
      'Quick Learner': '⚡',
      'Quiz Champion': '🏅'
    };
    return icons[badgeName] || '◆';
  };

  const getBadgeColor = (badgeName) => {
    const colors = {
      'Code Novice': '#4ade80',
      'Script Learner': '#60a5fa',
      'Bug Buster': '#f59e0b',
      'DevOps Master': '#a78bfa',
      'Beginner': '#4ade80',
      'Explorer': '#60a5fa',
      'Hero': '#f59e0b',
      'Master': '#a78bfa',
      'Scholar': '#818cf8',
      'Streak Master': '#f87171',
      'Quick Learner': '#22d3ee',
      'Quiz Champion': '#fbbf24'
    };
    return colors[badgeName] || '#64748b';
  };

  const getLevelColor = (level) => {
    const colors = ['#4ade80', '#60a5fa', '#f59e0b', '#f472b6', '#a78bfa'];
    return colors[level - 1] || colors[0];
  };

  const handleLogout = () => {
    showNotification('Logging out...', 'info');
    setTimeout(() => {
      localStorage.removeItem("currentUser");
      localStorage.removeItem('lastLevel');
      localStorage.removeItem('lastBadges');
      navigate('/');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p className="error-text">// ERROR: Unable to load profile</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            <span className="retry-icon">⟳</span> Retry
          </button>
        </div>
      </div>
    );
  }

  const totalCerts = (user.subjectCertificates?.length || 0) + (user.levelCertificates?.length || 0);

  return (
    <div className="profile-page">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">
          <span className="prompt">$</span> cat /profile/{user.username}
        </div>
        <div className="terminal-actions">
          <button className="btn-back" onClick={goToDashboard}>
            <span className="icon">⌂</span>
            <span>Dashboard</span>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <span className="icon">⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✗' : 'ℹ'}
          </span>
          {notification.message}
        </div>
      )}

      {/* Achievement Popup */}
      {achievement && (
        <div className="achievement-popup show">
          <div className="achievement-content">
            <span className="achievement-icon">🏆</span>
            <div>
              <span className="achievement-title">// NEW ACHIEVEMENT</span>
              <p className="achievement-text">{achievement}</p>
            </div>
          </div>
        </div>
      )}

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="avatar-status online"></div>
          </div>
          <div className="profile-info">
            <h2 className="profile-username">
              <span className="user-icon">👨‍💻</span>
              {user.username}
            </h2>
            <div className="profile-badges">
              <span className="role-badge">
                <span className="badge-icon">⚡</span>
                {user.role || 'Student'}
              </span>
              {user.isInstituteMember && (
                <span className="institute-badge">
                  <span className="badge-icon">🏛️</span>
                  {user.instituteName || 'Institute Member'}
                </span>
              )}
            </div>
            <div className="rank-level">
              <span className="rank-display">
                <span className="rank-icon">👑</span>
                Rank #{user.rank}
              </span>
              <span className="level-display" style={{ color: getLevelColor(user.level) }}>
                <span className="level-icon">⚡</span>
                Level {user.level}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-value">{user.score.toLocaleString()}</span>
              <span className="stat-label">// total XP</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-value">{user.streak || 0}</span>
              <span className="stat-label">// day streak</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-info">
              <span className="stat-value">{user.codeQuality || 0}%</span>
              <span className="stat-label">// code quality</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📜</div>
            <div className="stat-info">
              <span className="stat-value">{totalCerts}</span>
              <span className="stat-label">// certificates</span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="section badges-section">
          <div className="section-header">
            <h3>
              <span className="section-icon">🏅</span>
              Badges
            </h3>
            <span className="section-count">{user.badges?.length || 0}</span>
          </div>
          <div className="badges-grid">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((badge, index) => (
                <div
                  key={index}
                  className="badge-item"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    borderColor: getBadgeColor(badge)
                  }}
                >
                  <span className="badge-icon">{getBadgeIcon(badge)}</span>
                  <span className="badge-name">{badge}</span>
                  <span className="badge-dot">◆</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">◇</span>
                <p>// no badges earned yet</p>
                <span className="empty-hint">// complete challenges to earn rewards</span>
              </div>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="section certificates-section">
          <div className="section-header">
            <h3>
              <span className="section-icon">📜</span>
              Certificates
            </h3>
            <span className="section-count">{totalCerts}</span>
          </div>
          <div className="certificates-grid">
            {user.levelCertificates && user.levelCertificates.length > 0 && (
              user.levelCertificates.map((level, index) => (
                <div key={`level-${index}`} className="cert-item level-cert">
                  <span className="cert-icon">🏆</span>
                  <span className="cert-name">Level {level} Certificate</span>
                  <span className="cert-badge">Lv.{level}</span>
                </div>
              ))
            )}
            {user.subjectCertificates && user.subjectCertificates.length > 0 && (
              user.subjectCertificates.map((subject, index) => (
                <div key={`subject-${index}`} className="cert-item subject-cert">
                  <span className="cert-icon">📘</span>
                  <span className="cert-name">{subject}</span>
                  <span className="cert-badge">✓</span>
                </div>
              ))
            )}
            {(!user.levelCertificates || user.levelCertificates.length === 0) && 
             (!user.subjectCertificates || user.subjectCertificates.length === 0) && (
              <div className="empty-state">
                <span className="empty-icon">◇</span>
                <p>// no certificates yet</p>
                <span className="empty-hint">// complete courses to earn certificates</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn primary" onClick={goToDashboard}>
            <span className="btn-icon">⌂</span>
            Dashboard
          </button>
          <button className="action-btn secondary" onClick={handleLogout}>
            <span className="btn-icon">⏻</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;