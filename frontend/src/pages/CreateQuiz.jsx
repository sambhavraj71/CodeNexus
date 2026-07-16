import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateQuiz.css';

const API = "http://127.0.0.1:8000";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [quizType, setQuizType] = useState('global');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    q: '',
    a: ['', '', '', ''],
    c: 0
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser || (storedUser.role !== 'admin' && storedUser.role !== 'superadmin')) {
      navigate('/dashboard');
      return;
    }
    setUser(storedUser);
  }, [navigate]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.a];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, a: newOptions });
  };

  const handleCorrectAnswer = (index) => {
    setCurrentQuestion({ ...currentQuestion, c: index });
  };

  const addQuestion = () => {
    if (!currentQuestion.q.trim()) {
      setMessage({ type: 'error', text: 'Please enter a question' });
      return;
    }
    if (currentQuestion.a.some(opt => !opt.trim())) {
      setMessage({ type: 'error', text: 'Please fill all options' });
      return;
    }

    if (editingIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = { ...currentQuestion };
      setQuestions(newQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, { ...currentQuestion }]);
    }

    setCurrentQuestion({ q: '', a: ['', '', '', ''], c: 0 });
    setMessage({ type: 'success', text: 'Question added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const editQuestion = (index) => {
    setCurrentQuestion({ ...questions[index] });
    setEditingIndex(index);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setMessage({ type: 'success', text: 'Question deleted!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleJsonImport = () => {
    try {
      let parsedData = JSON.parse(jsonInput);
      
      if (Array.isArray(parsedData)) {
        const validQuestions = parsedData.filter(q => 
          q.q && q.a && Array.isArray(q.a) && q.a.length >= 2 && typeof q.c === 'number'
        );
        
        if (validQuestions.length === 0) {
          setMessage({ type: 'error', text: 'Invalid JSON format. Each question must have q, a (array), and c (number)' });
          return;
        }
        
        setQuestions([...questions, ...validQuestions]);
        setMessage({ 
          type: 'success', 
          text: `✅ Successfully imported ${validQuestions.length} questions!` 
        });
        setJsonInput('');
        setShowJsonInput(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'JSON must be an array of questions' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid JSON format: ' + err.message });
    }
  };

  const loadSampleJson = () => {
    const sample = [
      {
        "q": "What is the primary greenhouse gas responsible for global warming?",
        "a": ["Carbon Dioxide (CO₂)", "Methane (CH₄)", "Water Vapor (H₂O)", "Nitrous Oxide (N₂O)"],
        "c": 0
      },
      {
        "q": "Which human activity contributes the most to climate change?",
        "a": ["Burning fossil fuels", "Deforestation", "Agriculture", "Industrial processes"],
        "c": 0
      },
      {
        "q": "What is the main cause of rising sea levels?",
        "a": ["Melting glaciers and ice caps", "Increased rainfall", "Underwater volcanic activity", "Ocean currents changing"],
        "c": 0
      },
      {
        "q": "What does 'carbon footprint' refer to?",
        "a": ["Total greenhouse gases emitted by human activities", "Amount of carbon in soil", "Carbon dioxide in the atmosphere", "Carbon stored in forests"],
        "c": 0
      },
      {
        "q": "Which of these is a renewable energy source?",
        "a": ["Solar power", "Coal", "Natural gas", "Nuclear energy"],
        "c": 0
      }
    ];
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const handleSubmit = async () => {
    if (!quizTitle.trim()) {
      setMessage({ type: 'error', text: 'Please enter a quiz title' });
      return;
    }
    if (!domain.trim()) {
      setMessage({ type: 'error', text: 'Please enter a domain' });
      return;
    }
    if (questions.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one question' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: quizTitle,
        domain: domain,
        questions: questions,
        created_by: user.username,
        institute_id: quizType === 'institute' ? user.instituteId : null
      };

      const res = await fetch(`${API}/quiz/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create quiz');

      setMessage({ type: 'success', text: '🎉 Quiz created successfully!' });
      setTimeout(() => {
        navigate('/manage-quizzes');
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="create-quiz-container">
        <h2>📝 Create New Quiz</h2>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="quiz-form">
          {/* Quiz Details */}
          <div className="form-row">
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g., Climate Change Basics"
              />
            </div>

            <div className="form-group">
              <label>Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., climate, pollution, recycling"
              />
            </div>
          </div>

          {/* Quiz Type */}
          <div className="form-group">
            <label>Quiz Type</label>
            <div className="quiz-type-selector">
              {user?.role === 'superadmin' && (
                <button
                  className={`type-btn ${quizType === 'global' ? 'active' : ''}`}
                  onClick={() => setQuizType('global')}
                >
                  🌍 Global Quiz
                </button>
              )}
              <button
                className={`type-btn ${quizType === 'institute' ? 'active' : ''}`}
                onClick={() => setQuizType('institute')}
              >
                🏫 Institute Quiz
              </button>
            </div>
          </div>

          {/* Questions Section */}
          <div className="questions-section">
            <div className="section-header">
              <h3>📋 Questions</h3>
              <div className="section-actions">
                <button 
                  className="json-toggle-btn"
                  onClick={() => setShowJsonInput(!showJsonInput)}
                >
                  {showJsonInput ? '📝 Manual Entry' : '📥 Import JSON'}
                </button>
                <span className="question-count">{questions.length} questions</span>
              </div>
            </div>

            {/* JSON Import Section */}
            {showJsonInput && (
              <div className="json-import-section">
                <div className="json-header">
                  <h4>📥 Import Questions from JSON</h4>
                  <button 
                    className="sample-btn"
                    onClick={loadSampleJson}
                  >
                    Load Sample
                  </button>
                </div>
                <div className="json-format-hint">
                  <p>Format: {'{'} "q": "Question", "a": ["Option1", "Option2", "Option3", "Option4"], "c": 0 {'}'}</p>
                  <p><small>💡 c is the index of correct answer (0-based)</small></p>
                </div>
                <textarea
                  className="json-textarea"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='Paste your JSON here...'
                  rows={10}
                />
                <div className="json-actions">
                  <button 
                    className="import-btn"
                    onClick={handleJsonImport}
                  >
                    ➕ Import Questions
                  </button>
                  <button 
                    className="cancel-json-btn"
                    onClick={() => {
                      setJsonInput('');
                      setShowJsonInput(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Manual Question Entry */}
            {!showJsonInput && (
              <div className="question-form">
                <div className="form-group">
                  <label>Question</label>
                  <input
                    type="text"
                    value={currentQuestion.q}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, q: e.target.value })}
                    placeholder="Enter your question"
                  />
                </div>

                <div className="options-group">
                  <label>Options</label>
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="option-input">
                      <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={currentQuestion.a[idx]}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      />
                      <button
                        className={`correct-btn ${currentQuestion.c === idx ? 'active' : ''}`}
                        onClick={() => handleCorrectAnswer(idx)}
                      >
                        {currentQuestion.c === idx ? '✓ Correct' : 'Set Correct'}
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="add-question-btn"
                  onClick={addQuestion}
                >
                  {editingIndex !== null ? '🔄 Update Question' : '➕ Add Question'}
                </button>
              </div>
            )}

            {/* Questions List */}
            <div className="questions-list">
              <h4>Added Questions</h4>
              {questions.length === 0 ? (
                <div className="empty-questions">
                  <p>No questions added yet. Add questions manually or import from JSON.</p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div key={idx} className="question-item">
                    <div className="question-text">
                      <span className="q-number">{idx + 1}.</span>
                      <span className="q-text">{q.q}</span>
                      <span className="q-options-count">({q.a.length} options)</span>
                    </div>
                    <div className="question-actions">
                      <button onClick={() => editQuestion(idx)} className="edit-btn" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => deleteQuestion(idx)} className="delete-btn" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="submit-quiz-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ Creating...' : '🚀 Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;