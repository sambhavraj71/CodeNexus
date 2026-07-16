import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const API = "http://127.0.0.1:8000";

const Quiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [globalQuizzes, setGlobalQuizzes] = useState([]);
  const [instituteQuizzes, setInstituteQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
    if (activeTab === 'all') {
      return [...globalQuizzes, ...instituteQuizzes];
    }
    if (activeTab === 'global') {
      return globalQuizzes;
    }
    if (activeTab === 'institute') {
      return instituteQuizzes;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2>📚 Available Quizzes</h2>

      {/* Show tabs only if institute quizzes exist */}
      {instituteQuizzes.length > 0 && (
        <div className="quiz-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Quizzes
          </button>
          <button
            className={`tab ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => setActiveTab('global')}
          >
            🌍 Global
          </button>
          <button
            className={`tab ${activeTab === 'institute' ? 'active' : ''}`}
            onClick={() => setActiveTab('institute')}
          >
            🏫 Institute
          </button>
        </div>
      )}

      <div className="quiz-grid">
        {getFilteredQuizzes().map((quiz) => (
          <div key={quiz._id} className="quiz-card">
            <div className="quiz-card-header">
              <h3>{quiz.title}</h3>
              {quiz.is_global ? (
                <span className="badge global">Global</span>
              ) : (
                <span className="badge institute">Institute</span>
              )}
            </div>
            <p className="quiz-domain">📚 {quiz.domain}</p>
            <p className="quiz-questions">📝 {quiz.questions.length} Questions</p>
            <button
              className="start-quiz-btn"
              onClick={() => startQuiz(quiz._id)}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>

      {getFilteredQuizzes().length === 0 && (
        <div className="empty-state">
          <p>No quizzes available right now. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;