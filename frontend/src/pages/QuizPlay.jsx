import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/QuizPlay.css';

const API = "http://127.0.0.1:8000";

const QuizPlay = () => {
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

  // Fallback quizzes (for backward compatibility)
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
    const fetchQuiz = async () => {
      try {
        // If quizId is provided, fetch from backend
        if (quizId) {
          const res = await fetch(`${API}/quiz/${quizId}`);
          if (!res.ok) throw new Error('Quiz not found');
          const data = await res.json();
          setQuizData(data.quiz.questions);
          setDomain(data.quiz.domain);
        } else {
          // Fallback: Check localStorage for domain
          const storedDomain = localStorage.getItem("quizDomain");
          if (storedDomain && fallbackQuizzes[storedDomain]) {
            setQuizData(fallbackQuizzes[storedDomain]);
            setDomain(storedDomain);
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

  const handleSelectAnswer = (selected) => {
    if (locked || !quizData) return;
    
    const currentQ = quizData[currentQuestion];
    const correct = selected === currentQ.c;
    
    setLocked(true);
    
    // Update option styles
    const styles = {};
    currentQ.a.forEach((_, idx) => {
      if (idx === currentQ.c) {
        styles[idx] = 'correct';
      } else if (idx === selected && !correct) {
        styles[idx] = 'incorrect';
      }
    });
    setOptionStyles(styles);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < quizData.length) {
        setCurrentQuestion(prev => prev + 1);
        setLocked(false);
        setOptionStyles({});
      } else {
        handleFinishQuiz();
      }
    }, 800);
  };

  const handleFinishQuiz = async () => {
    setIsComplete(true);
    setFinalScore(score);

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
          score: score
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Quiz submit failed");
        return;
      }

      await refreshUser();
      alert("🎉 Quiz completed! Your score has been saved.");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="quiz-play-page">
        <div className="loading-spinner">
          <div className="loader"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="quiz-play-page">
        <div className="error-container">
          <p>No quiz data available.</p>
          <button onClick={() => navigate('/quiz')}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="quiz-play-page">
        <div className="result-container">
          <div className="result-icon">🎉</div>
          <h2>Quiz Completed!</h2>
          <div className="result-score">
            <span className="score-label">Your Score:</span>
            <span className="score-value">{finalScore}</span>
            <span className="score-total">/ {quizData.length}</span>
          </div>
          <div className="result-percentage">
            {Math.round((finalScore / quizData.length) * 100)}%
          </div>
          <button className="result-btn" onClick={goToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];

  return (
    <div className="quiz-play-page" data-domain={domain}>
      <div className="quiz-header-bar">
        <button className="quit-btn" onClick={() => navigate('/quiz')}>
          ✕ Quit
        </button>
        <div className="quiz-progress">
          <span className="progress-text">
            {currentQuestion + 1} / {quizData.length}
          </span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-score-display">
          <span className="score-icon">⭐</span>
          <span className="score-text">{score}</span>
        </div>
      </div>

      <div className="question-container">
        <div className="domain-badge">
          {domain || 'General'}
        </div>
        <h2 className="question-text">{currentQ.q}</h2>
        <div className="options-container">
          {currentQ.a.map((option, idx) => {
            let className = 'quiz-option';
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
                disabled={locked}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="option-text">{option}</span>
                {optionStyles[idx] === 'correct' && (
                  <span className="option-check">✓</span>
                )}
                {optionStyles[idx] === 'incorrect' && (
                  <span className="option-cross">✗</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// IMPORTANT: Default export
export default QuizPlay;