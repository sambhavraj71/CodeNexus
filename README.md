
````markdown
# 🚀 CodeNexus

### Learn • Assess • Rank • Grow

> A full-stack skill assessment and ranking platform built to help students test their technical knowledge, track their progress, earn achievements, and compete with other learners.

<p align="center">
  <a href="https://codenexus-nodt.onrender.com">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-CodeNexus-success?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

---

## 🌐 Live Application

### 👉 [Open CodeNexus](https://codenexus-nodt.onrender.com)

CodeNexus is deployed as a full-stack web application with a React frontend, Python FastAPI backend, and MongoDB database.

---

# 💡 What is CodeNexus?

CodeNexus is more than a simple quiz application.

It is a **skill assessment and competitive learning platform** where a student's performance is converted into a complete skill profile.

Instead of stopping at:

```text
Question → Answer → Score
````

CodeNexus turns the result into:

```text
Quiz
  ↓
Score
  ↓
Skill Level
  ↓
Badges
  ↓
Certificates
  ↓
Leaderboard Rank
  ↓
Progress Tracking
```

The platform also supports **institutes**, allowing colleges/training organizations to create their own assessments and monitor student performance.

---

# 🎯 The Problem

Students often take online quizzes, get a score, and then have no meaningful way to track their overall progress.

Institutes also need a simple system where they can:

* Conduct technical assessments
* Manage students
* Create institute-specific quizzes
* Monitor student performance
* Compare student rankings

CodeNexus brings these requirements together into a single platform.

---

# ✨ What CodeNexus Provides

### 👨‍🎓 For Students

Students can:

* Create an account
* Join an institute using an institute code
* Take technical/domain-based quizzes
* Attempt timed assessments
* Earn scores
* Progress through skill levels
* Unlock achievement badges
* Earn subject certificates
* Earn level certificates
* View their ranking
* Compare performance through the leaderboard
* Track their profile and achievements

### 🏫 For Institute Administrators

Institute admins can:

* Register their institute
* Create an administrator account
* Get a unique institute code
* View students belonging to their institute
* Create institute-specific quizzes
* Manage their quizzes
* Monitor student scores
* View student levels
* View institute statistics

### 👑 For Super Administrators

The Super Admin has platform-wide visibility and can:

* Monitor total users
* Monitor registered institutes
* Monitor administrators
* View platform users
* View institute statistics
* Create global quizzes
* Manage global assessments
* Access all quizzes across the platform

---

# 🧩 How the Platform Works

## 👨‍🎓 Student Journey

```text
                    ┌──────────────┐
                    │   Register   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │     Login    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Select Quiz  │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  Take Quiz   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │Submit Result │
                    └──────┬───────┘
                           ↓
              ┌────────────┴────────────┐
              ↓            ↓            ↓
           Score         Level        Ranking
              ↓            ↓            ↓
           Badges    Certificates   Leaderboard
```

---

# 🏆 Skill & Ranking System

One of the core features of CodeNexus is its automatic skill progression system.

A student's total score determines their current level.

|   Score |   Level | Achievement    |
| ------: | ------: | -------------- |
|  0 – 20 | Level 1 | Code Novice    |
| 21 – 40 | Level 2 | Script Learner |
| 41 – 60 | Level 3 | Bug Buster     |
|     61+ | Level 4 | DevOps Master  |

Every completed quiz contributes to the student's overall score.

For example:

```text
Quiz 1 → 15 points
Quiz 2 → 20 points
Quiz 3 → 18 points
              ↓
Total Score = 53
              ↓
          Level 3
              ↓
        Bug Buster
```

The student's rank is then calculated based on their score compared with other students.

---

# 🥇 Leaderboard

CodeNexus includes a leaderboard system that ranks students according to their accumulated scores.

Students can compete at different levels of the platform:

```text
Global Ranking
      │
      └── Students across the platform

Institute Ranking
      │
      └── Students belonging to an institute
```

This adds a competitive element to the learning experience and motivates students to improve their performance.

---

# 🎖️ Achievement System

Students automatically unlock badges as they progress through levels.

### Level 1

**Code Novice**

The starting achievement for beginning the skill journey.

### Level 2

**Script Learner**

Unlocked after progressing to Level 2.

### Level 3

**Bug Buster**

Unlocked after reaching Level 3.

### Level 4

**DevOps Master**

The highest achievement currently available in the level system.

---

# 📜 Certificate System

CodeNexus maintains two types of certificates:

### Subject Certificates

When a student successfully completes a quiz in a particular domain, the domain can be added to their subject achievements.

Example:

```text
Java
Python
JavaScript
Database
Web Development
```

### Level Certificates

As students progress through levels, their achieved levels are recorded.

This creates a permanent learning-progress history for each student.

---

# 🏫 Institute System

CodeNexus supports a multi-institute environment.

An institute administrator can register an institute and receive a unique institute code.

For example:

```text
Institute Name:
ABC Institute of Technology

Institute Code:
ABC2026
```

A student can use that code during signup to become a member of the institute.

The relationship becomes:

```text
Institute
    │
    ├── Admin
    │
    └── Students
           │
           ├── Scores
           ├── Levels
           ├── Badges
           ├── Certificates
           └── Quiz History
```

---

# 📝 Quiz System

CodeNexus supports both **global quizzes** and **institute-specific quizzes**.

### Global Quiz

Created by the Super Admin.

```text
Super Admin
     ↓
Global Quiz
     ↓
Available to eligible students
```

### Institute Quiz

Created by an Institute Admin.

```text
Institute Admin
      ↓
Institute Quiz
      ↓
Students of that institute
```

This allows CodeNexus to work both as a public skill platform and as an assessment platform for individual institutes.

---

# 🔐 Role-Based Access

The platform has three primary roles:

| Role               | Main Responsibility                       |
| ------------------ | ----------------------------------------- |
| 👨‍🎓 Student      | Learn, attempt quizzes, earn achievements |
| 🏫 Institute Admin | Manage institute students and quizzes     |
| 👑 Super Admin     | Manage and monitor the complete platform  |

The backend verifies the role before allowing privileged operations.

For example, an Institute Admin can only create quizzes for their own institute, while the Super Admin can create global quizzes.

---

# 🖥️ Application Pages

The React frontend is organized around different user experiences.

### Student

```text
/login
/dashboard
/quiz
/quiz-play
/quiz-play/:quizId
/leaderboard
/profile
/certificate
```

### Institute Admin

```text
/admin-login
/admin-dashboard
/create-quiz
/manage-quizzes
```

### Super Admin

```text
/superadmin-login
/superadmin-dashboard
```

---

# 🏗️ System Architecture

CodeNexus follows a clean three-layer architecture:

```text
┌────────────────────────────────────────────┐
│                React.js                   │
│             Frontend / UI                 │
│                                            │
│ Dashboard • Quiz • Profile • Leaderboard │
└─────────────────────┬──────────────────────┘
                      │
                      │ REST API
                      ▼
┌────────────────────────────────────────────┐
│              Python FastAPI               │
│                  Backend                  │
│                                            │
│ Auth • Quiz • Ranking • Certificates      │
│ Institute • Admin • Super Admin           │
└─────────────────────┬──────────────────────┘
                      │
                      │ PyMongo
                      ▼
┌────────────────────────────────────────────┐
│                  MongoDB                  │
│                                            │
│ Users • Admins • Institutes • Quizzes     │
│ SuperAdmins                               │
└────────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* React Router
* Context API
* HTML5
* CSS3
* REST API integration

## Backend

* Python
* FastAPI
* Pydantic
* PyMongo
* Uvicorn
* python-dotenv

## Database

* MongoDB
* MongoDB Atlas

## Deployment

* Render
* MongoDB Atlas

---

# 🗄️ Database Design

CodeNexus uses MongoDB collections for different entities.

```text
MongoDB
│
├── users
│   ├── username
│   ├── email
│   ├── password
│   ├── role
│   ├── instituteId
│   ├── score
│   ├── level
│   ├── rank
│   ├── badges
│   ├── certificates
│   └── recentActivity
│
├── admins
│
├── superadmins
│
├── institutes
│
└── quizzes
    ├── title
    ├── domain
    ├── questions
    ├── duration
    ├── created_by
    ├── institute_id
    └── is_global
```

---

# 🔌 Backend API

The frontend communicates with the FastAPI backend through REST APIs.

## Authentication

```http
POST /signup
POST /login

POST /admin/register
POST /admin/login

POST /superadmin/create
POST /superadmin/login
```

## Student

```http
GET /user/{username}
GET /profile/{username}
GET /certificates/{username}
```

## Quiz

```http
POST /quiz/create
GET /quizzes
GET /quiz/{quiz_id}
DELETE /quiz/{quiz_id}
POST /quiz/submit
```

## Leaderboard

```http
GET /leaderboard
```

## Admin Dashboard

```http
GET /admin/dashboard
```

## Super Admin Dashboard

```http
GET /superadmin/dashboard
```

---

# ⚡ Fullscreen Assessment Experience

CodeNexus also includes a fullscreen experience for assessments.

The React application uses a dedicated fullscreen context along with:

* Fullscreen Button
* Fullscreen Shortcut
* Fullscreen Context

This provides a more focused environment while attempting quizzes.

---

# 📁 Project Structure

```text
CodeNexus/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuizPlay.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Certificate.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateQuiz.jsx
│   │   │   ├── ManageQuizzes.jsx
│   │   │   ├── SuperAdminLogin.jsx
│   │   │   └── SuperAdminDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# 🚀 Run CodeNexus Locally

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/codenexus.git

cd codenexus
```

---

## 2. Start the Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# 3. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔒 Environment Variables

The project uses environment variables for sensitive configuration.

Example:

```env
MONGO_URI=your_mongodb_uri
DATABASE_NAME=your_database_name
```

Sensitive credentials should never be committed to GitHub.

Make sure `.env` is included in `.gitignore`.

---

# 📸 Screenshots

Add screenshots of the major sections of CodeNexus here.

### 🔐 Student Login

*Add screenshot here*

### 📊 Student Dashboard

*Add screenshot here*

### 📝 Quiz Interface

*Add screenshot here*

### 🏆 Leaderboard

*Add screenshot here*

### 📜 Certificate

*Add screenshot here*

### 🏫 Institute Admin Dashboard

*Add screenshot here*

### 👑 Super Admin Dashboard

*Add screenshot here*

---

# 🔮 Future Improvements

CodeNexus is designed to be extended further.

Potential future improvements include:

* JWT-based authentication
* Refresh token system
* Stronger password hashing with bcrypt/Argon2
* Email verification
* Password reset
* Advanced analytics
* Student performance graphs
* AI-powered skill analysis
* AI-generated assessments
* Coding questions with an online compiler
* Personalized learning recommendations
* Real-time notifications
* Downloadable PDF certificates
* More advanced institute management
* Mobile application
* Detailed quiz history and analytics

---

# 🎯 Project Highlights

What makes CodeNexus different from a basic quiz application:

```text
              CodeNexus
                  │
        ┌─────────┴─────────┐
        │                   │
    Assessment          Management
        │                   │
        ↓                   ↓
     Quizzes             Institutes
        │                   │
        ↓                   ↓
      Scores              Admins
        │                   │
        ↓                   ↓
      Levels          Student Tracking
        │
        ↓
     Badges
        │
        ↓
   Certificates
        │
        ↓
   Leaderboard
```

It combines **assessment, gamification, certification, ranking and institute management** into a single platform.

---

# 👨‍💻 Built By

## Sambhav Raj

**Full Stack Developer**

Interested in building modern web applications, developer tools and intelligent software solutions.

### Tech Interests

`React.js` • `JavaScript` • `Python` • `FastAPI` • `MongoDB` • `Node.js` • `AI/ML`

---

# ⭐ Support the Project

If you like CodeNexus, consider giving this repository a ⭐.

Your support helps motivate further development!

---

<div align="center">

## 🚀 CodeNexus

### Learn. Assess. Rank. Grow.

**Your skills deserve a rank.**

</div>
```
