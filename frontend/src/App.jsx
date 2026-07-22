// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FullscreenProvider } from "./contexts/FullscreenContext";
import FullscreenButton from "./components/FullscreenButton";
import FullscreenShortcut from "./components/FullscreenShortcut";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Quiz from './pages/Quiz';
import QuizPlay from './pages/QuizPlay';
import Profile from "./pages/Profile";
import Certificate from "./pages/Certificate";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import ManageQuizzes from "./pages/ManageQuizzes";
import SuperAdminLogin from "./pages/SuperAdminLogin";

function App() {
  return (
    <FullscreenProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-play" element={<QuizPlay />} />
          <Route path="/quiz-play/:quizId" element={<QuizPlay />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/manage-quizzes" element={<ManageQuizzes />} />
          <Route path="/superadmin-login" element={<SuperAdminLogin />} />
        </Routes>
        <FullscreenButton />
        <FullscreenShortcut />
      </BrowserRouter>
    </FullscreenProvider>
  );
}

export default App;