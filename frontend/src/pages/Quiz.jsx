// Quiz.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const API = "https://codenexus-backend-0we9.onrender.com";

const Quiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [globalQuizzes, setGlobalQuizzes] = useState([]);
  const [instituteQuizzes, setInstituteQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(storedUser);
    fetchQuizzes(storedUser);
  }, [navigate]);

  const fetchQuizzes = async (userData) => {
    try {
      const res = await fetch(`${API}/quizzes?username=${userData.username}`);
      const data = await res.json();
      
      const global = data.quizzes?.filter(q => q.is_global) || [];
      const institute = data.quizzes?.filter(q => !q.is_global) || [];
      
      setGlobalQuizzes(global);
      setInstituteQuizzes(institute);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz-play/${quizId}`);
  };

  const getFilteredQuizzes = () => {
    let quizzes = [];
    if (activeTab === 'all') {
      quizzes = [...globalQuizzes, ...instituteQuizzes];
    } else if (activeTab === 'global') {
      quizzes = globalQuizzes;
    } else if (activeTab === 'institute') {
      quizzes = instituteQuizzes;
    }
    
    if (searchTerm.trim()) {
      return quizzes.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return quizzes;
  };

  const getStats = () => {
    const total = globalQuizzes.length + instituteQuizzes.length;
    return { total, global: globalQuizzes.length, institute: instituteQuizzes.length };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading available assessments...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Header */}
      <header className="quiz-header">
        <div className="header-left">
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dashboard
          </button>
        </div>
        <div className="header-center">
          <h1>Assessments</h1>
          <span className="quiz-count">{stats.total} available</span>
        </div>
        <div className="header-right">
          <div className="user-badge">
            <span className="user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <span className="user-name">{user?.username}</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Global</span>
          <span className="stat-value">{stats.global}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Institute</span>
          <span className="stat-value">{stats.institute}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="quiz-controls">
        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        <div className="tabs-wrapper">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => setActiveTab('global')}
          >
            🌍 Global
          </button>
          {instituteQuizzes.length > 0 && (
            <button
              className={`tab-btn ${activeTab === 'institute' ? 'active' : ''}`}
              onClick={() => setActiveTab('institute')}
            >
              🏫 Institute
            </button>
          )}
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="quiz-grid">
        {getFilteredQuizzes().map((quiz) => (
          <div key={quiz._id} className="quiz-card">
            <div className="card-header">
              <div className="card-title-group">
                <h3>{quiz.title}</h3>
                <span className={`card-badge ${quiz.is_global ? 'global' : 'institute'}`}>
                  {quiz.is_global ? 'Global' : 'Institute'}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <div className="card-meta">
                <span className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"/>
                  </svg>
                  {quiz.domain}
                </span>
                <span className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6v6l4 2"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  {quiz.questions.length} questions
                </span>
              </div>
            </div>

            <button
              className="start-btn"
              onClick={() => startQuiz(quiz._id)}
            >
              Start Assessment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {getFilteredQuizzes().length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <h3>No assessments found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;