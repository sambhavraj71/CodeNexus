import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/QuizPlay.css';
import {useRef} from 'react';
import { useFullscreen } from '../contexts/FullscreenContext';

const API = "https://codenexus-backend-0we9.onrender.com";

const QuizPlay = () => {
   const {
    isFullscreen,
    enterFullscreen
  } = useFullscreen();

  const [fullscreenRequired, setFullscreenRequired] = useState(true);

  const quizStartedRef = useRef(false);
  const quizEndedRef = useRef(false);
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [domain, setDomain] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [optionStyles, setOptionStyles] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // Navigation states
  const [markedForReview, setMarkedForReview] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fallback quizzes
  const fallbackQuizzes = {
    climate: [
      {
        q: "What is the primary greenhouse gas responsible for global warming?",
        a: ["Carbon Dioxide (CO₂)", "Methane (CH₄)", "Water Vapor (H₂O)", "Nitrous Oxide (N₂O)"],
        c: 0
      },
      {
        q: "Which human activity contributes the most to climate change?",
        a: ["Burning fossil fuels", "Deforestation", "Agriculture", "Industrial processes"],
        c: 0
      },
      {
        q: "What is the main cause of rising sea levels?",
        a: ["Melting glaciers and ice caps", "Increased rainfall", "Underwater volcanic activity", "Ocean currents changing"],
        c: 0
      },
      {
        q: "What does 'carbon footprint' refer to?",
        a: ["Total greenhouse gases emitted by human activities", "Amount of carbon in soil", "Carbon dioxide in the atmosphere", "Carbon stored in forests"],
        c: 0
      },
      {
        q: "Which of these is a renewable energy source?",
        a: ["Solar power", "Coal", "Natural gas", "Nuclear energy"],
        c: 0
      },
      {
        q: "What is the Paris Agreement's main goal?",
        a: ["Limit global warming to well below 2°C", "Eliminate all fossil fuels by 2050", "Plant 1 trillion trees worldwide", "Reduce plastic use by 50%"],
        c: 0
      },
      {
        q: "Which ecosystem is most effective at absorbing carbon dioxide?",
        a: ["Rainforests", "Deserts", "Grasslands", "Tundra"],
        c: 0
      },
      {
        q: "What does 'net zero emissions' mean?",
        a: ["Balancing emitted and removed greenhouse gases", "No emissions at all", "Only using solar energy", "Planting trees for every emission"],
        c: 0
      },
      {
        q: "Which of these is NOT a consequence of climate change?",
        a: ["Increased oxygen levels", "More extreme weather events", "Ocean acidification", "Loss of biodiversity"],
        c: 0
      },
      {
        q: "What percentage of climate scientists agree humans cause climate change?",
        a: ["Over 97%", "About 50%", "Less than 30%", "Exactly 75%"],
        c: 0
      }
    ],
    pollution: [
      {
        q: "Which type of pollution causes the most human deaths worldwide?",
        a: ["Air pollution", "Water pollution", "Soil pollution", "Noise pollution"],
        c: 0
      },
      {
        q: "What are microplastics?",
        a: ["Tiny plastic particles less than 5mm", "Biodegradable plastics", "Plastic recycling pellets", "Plastic manufacturing waste"],
        c: 0
      },
      {
        q: "Which river is considered the most polluted in the world?",
        a: ["Ganges River", "Nile River", "Amazon River", "Yangtze River"],
        c: 0
      },
      {
        q: "What is the Great Pacific Garbage Patch?",
        a: ["A massive collection of marine debris", "A polluted fishing area", "An oil spill location", "A toxic algae bloom"],
        c: 0
      },
      {
        q: "Which air pollutant causes acid rain?",
        a: ["Sulfur dioxide", "Carbon monoxide", "Ozone", "Particulate matter"],
        c: 0
      },
      {
        q: "What is eutrophication?",
        a: ["Excess nutrients causing algae blooms", "Water turning acidic", "Oil spill contamination", "Heavy metal accumulation"],
        c: 0
      },
      {
        q: "Which plastic item is most commonly found in ocean pollution?",
        a: ["Plastic bags", "Plastic bottles", "Fishing nets", "Food wrappers"],
        c: 0
      },
      {
        q: "What does PM2.5 refer to?",
        a: ["Fine particulate matter 2.5 micrometers or smaller", "Pollution measurement at 2.5 meters height", "Water pollution index", "Noise pollution level"],
        c: 0
      },
      {
        q: "Which heavy metal causes Minamata disease?",
        a: ["Mercury", "Lead", "Cadmium", "Arsenic"],
        c: 0
      },
      {
        q: "What is light pollution?",
        a: ["Excessive artificial light", "Light from pollution fires", "Reflected pollution light", "Natural light disruption"],
        c: 0
      }
    ],
    recycling: [
      {
        q: "Which material takes the longest to decompose in a landfill?",
        a: ["Glass", "Plastic", "Paper", "Aluminum"],
        c: 0
      },
      {
        q: "What does the recycling symbol with three arrows represent?",
        a: ["Reduce, Reuse, Recycle", "Collect, Process, Manufacture", "Paper, Plastic, Glass", "Home, Factory, Store"],
        c: 0
      },
      {
        q: "Which plastic recycling number indicates PET (polyethylene terephthalate)?",
        a: ["1", "2", "3", "4"],
        c: 0
      },
      {
        q: "What is composting?",
        a: ["Decomposing organic waste into fertilizer", "Burning waste for energy", "Melting plastic for reuse", "Sorting recyclables"],
        c: 0
      },
      {
        q: "Which item is NOT typically accepted in curbside recycling?",
        a: ["Pizza boxes with grease stains", "Clean glass bottles", "Aluminum cans", "Newspapers"],
        c: 0
      },
      {
        q: "What percentage of plastic ever produced has been recycled?",
        a: ["Less than 10%", "About 25%", "Around 50%", "Over 75%"],
        c: 0
      },
      {
        q: "Which country recycles the highest percentage of its waste?",
        a: ["Germany", "Sweden", "Japan", "South Korea"],
        c: 0
      },
      {
        q: "What is upcycling?",
        a: ["Turning waste into higher-value products", "Basic recycling processes", "Downcycling materials", "Composting at home"],
        c: 0
      },
      {
        q: "Which material is infinitely recyclable without quality loss?",
        a: ["Aluminum", "Plastic", "Paper", "Glass"],
        c: 0
      },
      {
        q: "What does EPR stand for in recycling?",
        a: ["Extended Producer Responsibility", "Environmental Protection Recycling", "Eco-Friendly Product Recovery", "Efficient Plastic Reuse"],
        c: 0
      }
    ],
    biodiversity: [
      {
        q: "What percentage of Earth's species have gone extinct in the last 500 years?",
        a: ["About 75%", "Less than 10%", "Around 25%", "Over 90%"],
        c: 2
      },
      {
        q: "Which habitat has the highest biodiversity?",
        a: ["Tropical rainforests", "Coral reefs", "Savannas", "Temperate forests"],
        c: 0
      },
      {
        q: "What does IUCN stand for?",
        a: ["International Union for Conservation of Nature", "International United Conservation Network", "Institute for Understanding Climate Nature", "International Union of Conservation Needs"],
        c: 0
      },
      {
        q: "Which is the most biodiverse country in the world?",
        a: ["Brazil", "Indonesia", "Colombia", "China"],
        c: 0
      },
      {
        q: "What is an endemic species?",
        a: ["Species found only in one specific location", "Species that migrate seasonally", "Species that adapt easily", "Species found worldwide"],
        c: 0
      },
      {
        q: "Which group of animals is most threatened with extinction?",
        a: ["Amphibians", "Birds", "Mammals", "Reptiles"],
        c: 0
      },
      {
        q: "What is the main cause of biodiversity loss?",
        a: ["Habitat destruction", "Climate change", "Pollution", "Overhunting"],
        c: 0
      },
      {
        q: "How many mass extinctions has Earth experienced?",
        a: ["5", "3", "7", "10"],
        c: 0
      },
      {
        q: "What is a biodiversity hotspot?",
        a: ["Region with many endemic species facing threat", "Area with highest species count", "Place where new species are discovered", "Protected natural reserve"],
        c: 0
      },
      {
        q: "Which animal is a keystone species in its ecosystem?",
        a: ["Sea otter", "Panda", "Tiger", "Elephant"],
        c: 0
      }
    ]
  };
  useEffect(() => {
  const startFullscreen = async () => {
    // Already fullscreen hai
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      setFullscreenRequired(false);
      quizStartedRef.current = true;
      return;
    }

    // Browser permission try karo
    const success = await enterFullscreen();

    if (success) {
      setFullscreenRequired(false);
      quizStartedRef.current = true;
    } else {
      // Browser ne automatic fullscreen block kar diya
      setFullscreenRequired(true);
    }
  };

  startFullscreen();
}, [enterFullscreen]);

useEffect(() => {
  const handleFullscreenExit = () => {
    const currentlyFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (!currentlyFullscreen) {
      setFullscreenRequired(true);

      if (
        quizStartedRef.current &&
        !quizEndedRef.current
      ) {
        quizEndedRef.current = true;

        handleFinishQuiz(score);
      }
    } else {
      setFullscreenRequired(false);
    }
  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreenExit
  );

  document.addEventListener(
    "webkitfullscreenchange",
    handleFullscreenExit
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreenExit
    );

    document.removeEventListener(
      "webkitfullscreenchange",
      handleFullscreenExit
    );
  };
}, [score]);

  // Timer logic
  useEffect(() => {
    if (!quizData || isComplete || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleFinishQuiz(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData, isComplete, isTimeUp]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isComplete || locked || isTimeUp || !quizData) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentQuestion < quizData.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setOptionStyles({});
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentQuestion > 0) {
          setCurrentQuestion(prev => prev - 1);
          setOptionStyles({});
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, isComplete, locked, isTimeUp, quizData]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (quizId) {
          const res = await fetch(`${API}/quiz/${quizId}`);
          if (!res.ok) throw new Error('Quiz not found');
          const data = await res.json();
          setQuizData(data.quiz.questions);
          setDomain(data.quiz.domain);
          // Set timer from quiz data
          const duration = data.quiz.duration || 300;
          setTimeRemaining(duration);
          setTotalDuration(duration);
        } else {
          const storedDomain = localStorage.getItem("quizDomain");
          if (storedDomain && fallbackQuizzes[storedDomain]) {
            setQuizData(fallbackQuizzes[storedDomain]);
            setDomain(storedDomain);
            setTimeRemaining(300);
            setTotalDuration(300);
          } else {
            navigate('/quiz');
            return;
          }
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
        alert('Error loading quiz: ' + err.message);
        navigate('/quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const refreshUser = async () => {
    const localUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!localUser) return;

    try {
      const res = await fetch(`${API}/user/${localUser.username}`);
      const updatedUser = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const handleFinishQuiz = async (finalScoreValue) => {
    if (isComplete) return;
    
    setIsComplete(true);
    setFinalScore(finalScoreValue);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("User not logged in");
      return;
    }

    try {
      const res = await fetch(`${API}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          domain: domain || "general",
          score: finalScoreValue
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Quiz submit failed");
        return;
      }

      await refreshUser();
      
      if (isTimeUp) {
        alert("⏰ Time's up! Your quiz has been auto-submitted.");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  const handleSelectAnswer = (selected) => {
  if (locked || !quizData || isTimeUp) return;

  const currentQ = quizData[currentQuestion];
  const correct = selected === currentQ.c;

  setLocked(true);

  // Store selected answer
  setSelectedAnswers(prev => ({
    ...prev,
    [currentQuestion]: selected
  }));

  // Update score internally
  const newScore = correct ? score + 1 : score;
  setScore(newScore);

  // DO NOT show correct/incorrect answer
  setOptionStyles({});

  setTimeout(() => {
    if (currentQuestion + 1 < quizData.length && !isTimeUp) {
      setCurrentQuestion(prev => prev + 1);
      setLocked(false);
      setOptionStyles({});
    } else {
      handleFinishQuiz(newScore);
    }
  }, 300);
};

  const goToQuestion = (index) => {
    if (locked || isTimeUp) return;
    if (index >= 0 && index < quizData.length) {
      setCurrentQuestion(index);
      setOptionStyles({});
    }
  };

  const toggleMarkForReview = () => {
    if (locked || isTimeUp) return;
    const current = markedForReview[currentQuestion];
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion]: !current
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current';
    if (markedForReview[index]) return 'review';
    if (selectedAnswers[index] !== undefined) return 'answered';
    return 'unanswered';
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 60) return '#ef4444';
    if (timeRemaining <= 300) return '#fbbf24';
    return '#10b981';
  };

  const getTimerWarning = () => {
    if (timeRemaining <= 10) return '⚠️ Time running out!';
    if (timeRemaining <= 30) return '⏰ Hurry up!';
    if (timeRemaining <= 60) return '⏳ Less than a minute left';
    return '';
  };
  if (fullscreenRequired && !isComplete) {
  return (
    <div className="fullscreen-required">
      <div className="fullscreen-card">

        <div className="fullscreen-icon">
          ⛶
        </div>

        <h1>Fullscreen Required</h1>

        <p>
          This assessment must be taken in fullscreen mode.
        </p>

        <p className="fullscreen-warning">
          ⚠️ Exiting fullscreen during the quiz will
          automatically submit your quiz.
        </p>

        <button
          className="fullscreen-start-btn"
          onClick={async () => {
            const success = await enterFullscreen();

            if (success) {
              setFullscreenRequired(false);
              quizStartedRef.current = true;
            }
          }}
        >
          ⛶ Enter Fullscreen & Start Quiz
        </button>

      </div>
    </div>
  );
}
  if (loading) {
    return (
      <div className="quiz-play-container">
        <div className="loading-wrapper">
          <div className="loader-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="quiz-play-container">
        <div className="error-wrapper">
          <p>No quiz data available.</p>
          <button onClick={() => navigate('/quiz')}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  if (isComplete || isTimeUp) {
    const percentage = Math.round((finalScore / quizData.length) * 100);
    return (
      <div className="quiz-play-container">
        <div className="result-wrapper">
          <div className="result-card">
            <div className="result-icon">{isTimeUp ? '⏰' : '🎉'}</div>
            <h2>{isTimeUp ? "Time's Up!" : "Quiz Completed!"}</h2>
            <p className="result-subtitle">
              {isTimeUp ? "Your quiz was auto-submitted" : "Great effort!"}
            </p>
            <div className="result-score">
              <span className="score-label">Your Score:</span>
              <span className="score-value">{finalScore}</span>
              <span className="score-total">/ {quizData.length}</span>
            </div>
            <div className="result-percentage">{percentage}%</div>
            <button className="result-btn" onClick={goToDashboard}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];
  const totalQuestions = quizData.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(v => v).length;

  return (
    <div className="quiz-play-container" data-domain={domain}>
      {/* Top Bar */}
      <header className="quiz-topbar">
        <div className="topbar-left">
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <div className="quiz-brand">
            <span className="brand-dot red"></span>
            <span className="brand-dot yellow"></span>
            <span className="brand-dot green"></span>
            <span className="brand-name">Skill Rank</span>
          </div>
        </div>
        <div className="topbar-center">
          <span className="quiz-title">{domain || 'Assessment'}</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-stats">
            <span className="stat-badge timer" style={{ color: getTimerColor() }}>
              <span className="stat-icon">⏱️</span>
              <span className="stat-value timer-value">
                {formatTime(timeRemaining)}
              </span>
            </span>
            <span className="stat-badge">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{score}</span>
            </span>
            <span className="stat-badge">
              <span className="stat-icon">📝</span>
              <span className="stat-value">{answeredCount}/{totalQuestions}</span>
            </span>
          </div>
          {getTimerWarning() && (
            <span className="timer-warning">{getTimerWarning()}</span>
          )}
          <button className="exit-btn" onClick={() => {
            if (window.confirm('Are you sure you want to quit? Your progress will be lost.')) {
              navigate('/quiz');
            }
          }}>
            ✕
          </button>
        </div>
      </header>

      {/* Timer Progress Bar */}
      <div className="timer-progress-bar">
        <div 
          className="timer-progress-fill"
          style={{
            width: `${(timeRemaining / totalDuration) * 100}%`,
            background: timeRemaining <= 60 ? '#ef4444' : 
                       timeRemaining <= 300 ? '#fbbf24' : '#6366f1'
          }}
        />
      </div>

      <div className="quiz-main">
        {/* Main Content */}
        <main className={`quiz-content ${!isSidebarOpen ? 'expanded' : ''}`}>
          <div className="question-card">
            <div className="question-header">
              <div className="question-meta">
                <span className="question-number">Question {currentQuestion + 1} of {totalQuestions}</span>
                <span className="question-domain">{domain || 'General'}</span>
              </div>
              <button 
                className={`mark-review-btn ${markedForReview[currentQuestion] ? 'marked' : ''}`}
                onClick={toggleMarkForReview}
                disabled={locked || isTimeUp}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={markedForReview[currentQuestion] ? '#fbbf24' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {markedForReview[currentQuestion] ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <h3 className="question-text">{currentQ.q}</h3>
            
            <div className="options-grid">
              {currentQ.a.map((option, idx) => {
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                let className = 'option-btn';
                if (optionStyles[idx] === 'correct') {
                  className += ' correct';
                } else if (optionStyles[idx] === 'incorrect') {
                  className += ' incorrect';
                }
                
                return (
                  <button
                    key={idx}
                    className={className}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={locked || isTimeUp}
                  >
                    <span className="option-label">{letters[idx]}</span>
                    <span className="option-content">{option}</span>
                    {optionStyles[idx] === 'correct' && (
                      <span className="option-status correct">✓</span>
                    )}
                    {optionStyles[idx] === 'incorrect' && (
                      <span className="option-status incorrect">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="question-footer">
              <button 
                className="nav-btn prev"
                onClick={() => {
                  if (currentQuestion > 0 && !locked && !isTimeUp) {
                    setCurrentQuestion(prev => prev - 1);
                    setOptionStyles({});
                  }
                }}
                disabled={currentQuestion === 0 || locked || isTimeUp}
              >
                ← Previous
              </button>
              <span className="question-indicator">
                {currentQuestion + 1} / {totalQuestions}
              </span>
              {currentQuestion === totalQuestions - 1 ? (
                <button 
                  className="nav-btn submit"
                  onClick={() => handleFinishQuiz(score)}
                  disabled={locked || isTimeUp}
                >
                  Submit Quiz →
                </button>
              ) : (
                <button 
                  className="nav-btn next"
                  onClick={() => {
                    if (currentQuestion < totalQuestions - 1 && !locked && !isTimeUp) {
                      setCurrentQuestion(prev => prev + 1);
                      setOptionStyles({});
                    }
                  }}
                  disabled={locked || isTimeUp}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Question Navigator */}
        <aside className={`question-navigator ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="navigator-header">
            <h4>Questions</h4>
            <span className="question-count">{totalQuestions}</span>
          </div>

          <div className="navigator-stats">
            <div className="stat-row">
              <span className="dot answered"></span>
              <span>Answered</span>
              <span className="count">{answeredCount}</span>
            </div>
            <div className="stat-row">
              <span className="dot review"></span>
              <span>For Review</span>
              <span className="count">{reviewCount}</span>
            </div>
            <div className="stat-row">
              <span className="dot unanswered"></span>
              <span>Unanswered</span>
              <span className="count">{totalQuestions - answeredCount - reviewCount}</span>
            </div>
          </div>

          <div className="navigator-grid">
            {quizData.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  className={`nav-question ${status}`}
                  onClick={() => goToQuestion(index)}
                  disabled={locked || isTimeUp}
                >
                  <span>{index + 1}</span>
                  {markedForReview[index] && (
                    <span className="review-star">★</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="navigator-legend">
            <div className="legend-item">
              <span className="legend-dot current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot review"></span>
              <span>Review</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot unanswered"></span>
              <span>Unanswered</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizPlay;