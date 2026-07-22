from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import hashlib
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv
app = FastAPI()
load_dotenv()


# ---------------- CORS ----------------


origins = [
    "https://skill-rank.onrender.com",  # Replace with your frontend URL
    "http://localhost:5173",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MongoDB ----------------
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users = db["users"]
admins = db["admins"]
institutes = db["institutes"]
superadmins = db["superadmins"]
quizzes = db["quizzes"]

# ---------------- MODELS ----------------

class SignupData(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "student"
    institute_code: Optional[str] = None

class LoginData(BaseModel):
    username: str  # ← Student login with username
    password: str

class InstituteRegister(BaseModel):
    institute_name: str
    admin_username: str  # ← New: Admin username
    admin_email: str
    password: str
    institute_code: str

class AdminLogin(BaseModel):
    username: str  # ← Admin login with username
    password: str

class SuperAdminLogin(BaseModel):
    email: str  # ← Super admin login with email
    password: str

class QuizCreate(BaseModel):
    title: str
    domain: str
    questions: List[dict]
    created_by: str
    institute_id: Optional[str] = None


# ---------------- HELPERS ----------------

def calculate_level(score: int) -> int:
    if score <= 20:
        return 1
    elif score <= 40:
        return 2
    elif score <= 60:
        return 3
    else:
        return 4

def calculate_badges(level: int):
    badges = []
    if level >= 1:
        badges.append("Code Novice")          # ← Changed
    if level >= 2:
        badges.append("Script Learner")       # ← Changed
    if level >= 3:
        badges.append("Bug Buster")           # ← Changed
    if level >= 4:
        badges.append("DevOps Master")        # ← Changed
    return badges

def add_activity(user, text, points=0):
    activity = user.get("recentActivity", [])
    activity.insert(0, {"text": text, "points": points})
    return activity[:5]

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------------- SIGNUP ----------------

@app.post("/signup")
def signup(data: SignupData):
    if users.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    institute_id = ""
    institute_name = ""
    is_institute_member = False

    if data.institute_code and data.institute_code.strip():
        institute = institutes.find_one({"institute_code": data.institute_code})
        if institute:
            institute_id = str(institute["_id"])
            institute_name = institute.get("name", "")
            is_institute_member = True

    user = {
        "username": data.username,
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role,
        "instituteId": institute_id,
        "instituteName": institute_name if is_institute_member else "",
        "isInstituteMember": is_institute_member,
        "instituteCode": data.institute_code if data.institute_code else "",
        "score": 0,
        "level": 1,
        "badges": [],
        "notifications": 0,
        "streak": 0,
        "codeQuality": 0,
        "recentActivity": [{"text": "Welcome to Skill Rank!", "points": 0}],
        "subjectCertificates": [],
        "levelCertificates": [],
        "createdAt": str(datetime.now())
    }

    users.insert_one(user)
    
    if is_institute_member and institute_id:
        institutes.update_one(
            {"_id": ObjectId(institute_id)},
            {"$push": {"students": data.email}}
        )

    user.pop("password", None)
    user.pop("_id", None)

    return {
        "success": True,
        "user": user,
        "message": f"Account created successfully! {'Joined ' + institute_name if is_institute_member else 'Registered as normal student'}"
    }

# ---------------- STUDENT LOGIN (with username) ----------------

@app.post("/login")
def login(data: LoginData):
    user = users.find_one({"username": data.username})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user["password"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    user.pop("password", None)
    user.pop("_id", None)
    return {"success": True, "user": user}

# ---------------- ADMIN REGISTER (with username) ----------------

@app.post("/admin/register")
def register_admin(data: InstituteRegister):
    # Check if admin username already exists
    if admins.find_one({"username": data.admin_username}):
        raise HTTPException(400, "Admin username already exists")
    
    if admins.find_one({"email": data.admin_email}):
        raise HTTPException(400, "Admin email already exists")
    
    if institutes.find_one({"adminEmail": data.admin_email}):
        raise HTTPException(400, "Institute already registered")
    
    if institutes.find_one({"institute_code": data.institute_code}):
        raise HTTPException(400, "Institute code already taken")

    institute = {
        "name": data.institute_name,
        "adminEmail": data.admin_email,
        "adminUsername": data.admin_username,
        "institute_code": data.institute_code,
        "students": [],
        "createdAt": str(datetime.now())
    }

    result = institutes.insert_one(institute)

    admin = {
        "username": data.admin_username,  # ← Added username
        "email": data.admin_email,
        "password": hash_password(data.password),
        "role": "admin",
        "instituteId": str(result.inserted_id),
        "name": f"Admin of {data.institute_name}",
        "createdAt": str(datetime.now())
    }

    admins.insert_one(admin)
    return {
        "success": True, 
        "instituteId": str(result.inserted_id),
        "message": f"Institute {data.institute_name} created with code: {data.institute_code}"
    }

# ---------------- ADMIN LOGIN (with username) ----------------

@app.post("/admin/login")
def admin_login(data: AdminLogin):
    admin = admins.find_one({"username": data.username})  # ← Search by username
    
    if not admin:
        raise HTTPException(404, "Admin not found")
    
    if admin["password"] != hash_password(data.password):
        raise HTTPException(401, "Wrong password")

    admin.pop("_id", None)
    admin.pop("password", None)
    return {"success": True, "admin": admin}

# ---------------- SUPER ADMIN ----------------

@app.post("/superadmin/create")
def create_super_admin():
    if superadmins.find_one({"email": "admin@skillrank.com"}):
        return {"message": "Already Exists"}
    
    superadmins.insert_one({
        "name": "Skill Rank",
        "username": "superadmin",  # ← Added username
        "email": "admin@skillrank.com",
        "password": hash_password("Admin@123"),
        "role": "superadmin",
        "createdAt": str(datetime.now())
    })
    return {"success": True}

@app.post("/superadmin/login")
def super_admin_login(data: SuperAdminLogin):
    admin = superadmins.find_one({"email": data.email})
    if not admin:
        raise HTTPException(404, "Super Admin not found")
    if admin["password"] != hash_password(data.password):
        raise HTTPException(401, "Wrong Password")

    admin.pop("_id", None)
    admin.pop("password", None)
    return {"success": True, "admin": admin}

# ---------------- GET USER ----------------

@app.get("/user/{username}")
def get_user(username: str):
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    score = user.get("score", 0)
    old_level = user.get("level", 1)
    old_rank = user.get("rank", None)
    level = calculate_level(score)
    badges = calculate_badges(level)
    rank = users.count_documents({"score": {"$gt": score}}) + 1
    
    recent_activity = user.get("recentActivity", [])
    if level > old_level:
        recent_activity.insert(0, {"text": f"Level Up! Reached Level {level}", "points": 0})
    if old_rank and rank < old_rank:
        recent_activity.insert(0, {"text": f"Rank improved to #{rank}", "points": 0})
    recent_activity = recent_activity[:5]
    
    users.update_one(
        {"username": username},
        {"$set": {"level": level, "badges": badges, "rank": rank, "recentActivity": recent_activity}}
    )
    
    return {
        "username": user.get("username"),
        "email": user.get("email", ""),
        "role": user.get("role", "student"),
        "instituteId": user.get("instituteId", ""),
        "instituteName": user.get("instituteName", ""),
        "isInstituteMember": user.get("isInstituteMember", False),
        "score": score,
        "level": level,
        "rank": rank,
        "badges": badges,
        "notifications": user.get("notifications", 0),
        "streak": user.get("streak", 0),
        "codeQuality": user.get("codeQuality", 0), 
        "recentActivity": recent_activity,
        "subjectCertificates": user.get("subjectCertificates", []),
        "levelCertificates": user.get("levelCertificates", [])
    }

#-------Quiz--------------#


# Create Quiz (Super Admin or Institute Admin)


# ---------------- QUIZ MANAGEMENT ENDPOINTS ----------------

# Create Quiz (Super Admin or Institute Admin)
@app.post("/quiz/create")
def create_quiz(data: QuizCreate):
    # Verify if user is admin or super admin
    admin = admins.find_one({"username": data.created_by})
    super_admin = superadmins.find_one({"username": data.created_by})
    
    if not admin and not super_admin:
        raise HTTPException(403, "Only admins can create quizzes")
    
    # If institute_id is not provided, it's a global quiz
    if not data.institute_id and not super_admin:
        raise HTTPException(403, "Only Super Admin can create global quizzes")
    
    # If admin is creating, verify they own the institute
    if admin and data.institute_id:
        if admin.get("instituteId") != data.institute_id:
            raise HTTPException(403, "You can only create quizzes for your institute")
    
    # Validate questions format
    for q in data.questions:
        if not q.get('q') or not q.get('a') or not isinstance(q.get('a'), list) or len(q['a']) < 2:
            raise HTTPException(400, "Each question must have 'q', 'a' (array with at least 2 options), and 'c'")
        if not isinstance(q.get('c'), int):
            raise HTTPException(400, "Correct answer index 'c' must be an integer")
    
    quiz = {
        "title": data.title,
        "domain": data.domain,
        "questions": data.questions,
        "created_by": data.created_by,
        "institute_id": data.institute_id,  # None for global
        "is_global": data.institute_id is None,
        "createdAt": str(datetime.now()),
        "updatedAt": str(datetime.now())
    }
    
    result = quizzes.insert_one(quiz)
    quiz["_id"] = str(result.inserted_id)
    
    return {"success": True, "quiz": quiz}

# Get Quizzes (Filtered by user role and institute)
@app.get("/quizzes")
def get_quizzes(username: str):
    user = users.find_one({"username": username})
    admin = admins.find_one({"username": username})
    super_admin = superadmins.find_one({"username": username})
    
    if not user and not admin and not super_admin:
        raise HTTPException(404, "User not found")
    
    # Get all quizzes
    all_quizzes = []
    
    # For super admin - see all quizzes
    if super_admin:
        for quiz in quizzes.find():
            quiz["_id"] = str(quiz["_id"])
            all_quizzes.append(quiz)
        return {"quizzes": all_quizzes, "role": "superadmin"}
    
    # For institute admin - see their institute quizzes + global quizzes
    if admin:
        institute_id = admin.get("instituteId")
        for quiz in quizzes.find({
            "$or": [
                {"institute_id": institute_id},
                {"is_global": True}
            ]
        }):
            quiz["_id"] = str(quiz["_id"])
            all_quizzes.append(quiz)
        return {"quizzes": all_quizzes, "role": "admin", "institute_id": institute_id}
    
    # For student - see global quizzes + their institute quizzes
    if user:
        institute_id = user.get("instituteId")
        if institute_id:
            for quiz in quizzes.find({
                "$or": [
                    {"institute_id": institute_id},
                    {"is_global": True}
                ]
            }):
                quiz["_id"] = str(quiz["_id"])
                all_quizzes.append(quiz)
        else:
            # Normal student - only global quizzes
            for quiz in quizzes.find({"is_global": True}):
                quiz["_id"] = str(quiz["_id"])
                all_quizzes.append(quiz)
        return {"quizzes": all_quizzes, "role": "student"}

# Get Quiz by ID
@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: str):
    try:
        quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
        if not quiz:
            raise HTTPException(404, "Quiz not found")
        
        quiz["_id"] = str(quiz["_id"])
        return {"quiz": quiz}
    except:
        raise HTTPException(404, "Invalid quiz ID")

# Delete Quiz (Admin only)
@app.delete("/quiz/{quiz_id}")
def delete_quiz(quiz_id: str, username: str):
    admin = admins.find_one({"username": username})
    super_admin = superadmins.find_one({"username": username})
    
    if not admin and not super_admin:
        raise HTTPException(403, "Only admins can delete quizzes")
    
    try:
        quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
        if not quiz:
            raise HTTPException(404, "Quiz not found")
        
        # Check permissions
        if admin:
            institute_id = admin.get("instituteId")
            if quiz.get("institute_id") != institute_id:
                raise HTTPException(403, "You can only delete quizzes from your institute")
        
        quizzes.delete_one({"_id": ObjectId(quiz_id)})
        return {"success": True, "message": "Quiz deleted successfully"}
    except:
        raise HTTPException(404, "Invalid quiz ID")
#---------End----------------#

# Get Quiz by ID
@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    
    quiz["_id"] = str(quiz["_id"])
    return {"quiz": quiz}

#----------End------------------#



# ---------------- QUIZ SUBMIT ----------------

@app.post("/quiz/submit")
def submit_quiz(data: dict):
    username = data["username"]
    domain = data["domain"]
    quiz_score = data["score"]
    
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_score = user.get("score", 0)
    old_level = user.get("level", 1)
    total_score = old_score + quiz_score
    level = calculate_level(total_score)
    badges = calculate_badges(level)
    
    subject_certs = set(user.get("subjectCertificates", []))
    new_subject = domain not in subject_certs
    subject_certs.add(domain)
    
    level_certs = set(user.get("levelCertificates", []))
    for i in range(1, level + 1):
        level_certs.add(i)
    
    activity = user.get("recentActivity", [])
    activity = add_activity(user, f"Completed {domain} quiz", quiz_score)
    
    if level > old_level:
        activity = add_activity({"recentActivity": activity}, f"Level Up! Reached Level {level}")
    
    if new_subject:
        activity = add_activity({"recentActivity": activity}, f"Earned certificate in {domain}")
    
    users.update_one(
        {"username": username},
        {"$set": {
            "score": total_score,
            "level": level,
            "badges": badges,
            "recentActivity": activity,
            "subjectCertificates": list(subject_certs),
            "levelCertificates": list(level_certs)
        }}
    )
    
    return {"success": True}

# ---------------- LEADERBOARD ----------------

@app.get("/leaderboard")
def leaderboard(institute_id: Optional[str] = None):
    query = {}
    if institute_id:
        query["instituteId"] = institute_id
    
    cursor = users.find(
        query,
        {"_id": 0, "username": 1, "email": 1, "score": 1, "level": 1, 
         "subjectCertificates": 1, "levelCertificates": 1, 
         "instituteId": 1, "isInstituteMember": 1}
    ).sort("score", -1)
    
    leaderboard = []
    for user in cursor:
        leaderboard.append({
            "username": user.get("username"),
            "email": user.get("email"),
            "score": user.get("score", 0),
            "level": user.get("level", 1),
            "subjectCertificates": user.get("subjectCertificates", []),
            "levelCertificates": user.get("levelCertificates", []),
            "instituteId": user.get("instituteId", ""),
            "isInstituteMember": user.get("isInstituteMember", False)
        })
    
    return leaderboard

# ---------------- CERTIFICATES ----------------

@app.get("/certificates/{username}")
def get_certificates(username: str):
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": username,
        "subjectCertificates": user.get("subjectCertificates", []),
        "levelCertificates": user.get("levelCertificates", [])
    }

# ---------------- PROFILE ----------------

@app.get("/profile/{username}")
def get_profile(username: str):
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    score = user.get("score", 0)
    level = calculate_level(score)
    badges = calculate_badges(level)
    rank = users.count_documents({"score": {"$gt": score}}) + 1
    
    return {
        "username": user["username"],
        "email": user.get("email", ""),
        "role": user.get("role", "student"),
        "instituteId": user.get("instituteId", ""),
        "instituteName": user.get("instituteName", ""),
        "isInstituteMember": user.get("isInstituteMember", False),
        "score": score,
        "level": level,
        "rank": rank,
        "badges": badges,
        "streak": user.get("streak", 0),
        "codeQuality": user.get("codeQuality", 0),
        "subjectCertificates": user.get("subjectCertificates", []),
        "levelCertificates": user.get("levelCertificates", [])
    }

# ---------------- SUPER ADMIN DASHBOARD ----------------

@app.get("/superadmin/dashboard")
def super_admin_dashboard(email: str):
    if not superadmins.find_one({"email": email}):
        raise HTTPException(403, "Only Super Admin can access")
    
    total_users = users.count_documents({})
    total_institutes = institutes.count_documents({})
    total_admins = admins.count_documents({})
    
    all_users = []
    for user in users.find({}, {"password": 0}):
        user["_id"] = str(user["_id"])
        all_users.append(user)
    
    institute_stats = []
    for inst in institutes.find():
        inst_id = str(inst["_id"])
        student_count = users.count_documents({"instituteId": inst_id})
        inst_students = users.find({"instituteId": inst_id})
        total_score = sum([s.get("score", 0) for s in inst_students])
        
        institute_stats.append({
            "name": inst.get("name"),
            "adminEmail": inst.get("adminEmail"),
            "adminUsername": inst.get("adminUsername"),
            "studentCount": student_count,
            "totalScore": total_score,
            "code": inst.get("institute_code")
        })
    
    return {
        "totalUsers": total_users,
        "totalInstitutes": total_institutes,
        "totalAdmins": total_admins,
        "allUsers": all_users,
        "institutes": institute_stats
    }

# ---------------- ADMIN DASHBOARD ----------------

@app.get("/admin/dashboard")
def admin_dashboard(username: str):  # ← Changed to username
    admin = admins.find_one({"username": username})  # ← Find by username
    if not admin:
        raise HTTPException(403, "Access denied")
    
    institute_id = admin.get("instituteId")
    institute = institutes.find_one({"_id": ObjectId(institute_id)})
    if not institute:
        raise HTTPException(404, "Institute not found")
    
    institute_students = users.find({"instituteId": institute_id})
    students_list = []
    total_score = 0
    
    for student in institute_students:
        students_list.append({
            "username": student.get("username"),
            "email": student.get("email"),
            "score": student.get("score", 0),
            "level": student.get("level", 1)
        })
        total_score += student.get("score", 0)
    
    return {
        "instituteName": institute.get("name"),
        "instituteCode": institute.get("institute_code"),
        "totalStudents": len(students_list),
        "totalScore": total_score,
        "averageScore": total_score / len(students_list) if students_list else 0,
        "students": students_list
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)