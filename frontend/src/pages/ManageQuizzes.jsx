import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageQuizzes.css';

const API = "http://127.0.0.1:8000";

const ManageQuizzes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'superadmin')) {
      navigate('/dashboard');
      return;
    }
    setUser(storedUser);
    fetchQuizzes(storedUser);
  }, [navigate]);

  const fetchQuizzes = async (userData) => {
    try {
      const res = await fetch(`${API}/quizzes?username=${userData.username}`);
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const res = await fetch(`${API}/quiz/${quizId}?username=${user.username}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete quiz');
      
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      alert('Quiz deleted successfully!');
    } catch (err) {
      alert('Error deleting quiz: ' + err.message);
    }
  };

  const getFilteredQuizzes = () => {
    if (activeTab === 'all') return quizzes;
    if (activeTab === 'global') return quizzes.filter(q => q.is_global);
    if (activeTab === 'institute') return quizzes.filter(q => !q.is_global);
    return quizzes;
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
    <div className="manage-quizzes-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Manage Quizzes</h2>
        <button className="create-btn" onClick={() => navigate('/create-quiz')}>
          + Create New Quiz
        </button>
      </header>

      <div className="tabs">
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
          🌍 Global Quizzes
        </button>
        <button
          className={`tab ${activeTab === 'institute' ? 'active' : ''}`}
          onClick={() => setActiveTab('institute')}
        >
          🏫 Institute Quizzes
        </button>
      </div>

      <div className="quizzes-grid">
        {getFilteredQuizzes().map((quiz) => (
          <div key={quiz._id} className="quiz-card">
            <div className="quiz-header">
              <h3>{quiz.title}</h3>
              <div className="quiz-badges">
                {quiz.is_global ? (
                  <span className="badge global">Global</span>
                ) : (
                  <span className="badge institute">Institute</span>
                )}
              </div>
            </div>
            
            <div className="quiz-body">
              <p className="domain">📚 {quiz.domain}</p>
              <p className="questions-count">📝 {quiz.questions.length} Questions</p>
              <p className="created-by">👤 Created by: {quiz.created_by}</p>
            </div>

            <div className="quiz-actions">
              <button 
                className="view-btn"
                onClick={() => navigate(`/quiz/${quiz._id}`)}
              >
                View
              </button>
              <button 
                className="delete-btn"
                onClick={() => deleteQuiz(quiz._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {getFilteredQuizzes().length === 0 && (
        <div className="empty-state">
          <p>No quizzes found. Create your first quiz!</p>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;