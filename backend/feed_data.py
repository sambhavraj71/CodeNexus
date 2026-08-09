# reset_database.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import hashlib
from datetime import datetime
from bson import ObjectId
import sys

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def reset_database():
    print("🔄 Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    
    # Collections
    users = db["users"]
    admins = db["admins"]
    institutes = db["institutes"]
    superadmins = db["superadmins"]
    quizzes = db["quizzes"]
    
    print("🗑️  Clearing existing data...")
    
    # Delete all documents from all collections
    users.delete_many({})
    admins.delete_many({})
    institutes.delete_many({})
    superadmins.delete_many({})
    quizzes.delete_many({})
    
    print("✅ All data cleared!")
    print("📝 Creating new data...")
    
    # 1. Create Super Admin
    super_admin = {
        "name": "Skill Rank Super Admin",
        "username": "superadmin",
        "email": "admin@skillrank.com",
        "password": hash_password("Admin@123"),
        "role": "superadmin",
        "createdAt": str(datetime.now())
    }
    superadmins.insert_one(super_admin)
    print("✅ Super Admin created: admin@skillrank.com / Admin@123")
    
    # 2. Create Institute & Admin
    institute_data = {
        "name": "Tech University",
        "adminEmail": "admin@techuniversity.com",
        "adminUsername": "techadmin",
        "institute_code": "TECH2026",
        "students": [],
        "createdAt": str(datetime.now())
    }
    institute_result = institutes.insert_one(institute_data)
    institute_id = str(institute_result.inserted_id)
    
    # Admin for this institute
    admin_data = {
        "username": "techadmin",
        "email": "admin@techuniversity.com",
        "password": hash_password("Admin@123"),
        "role": "admin",
        "instituteId": institute_id,
        "name": "Tech University Admin",
        "createdAt": str(datetime.now())
    }
    admins.insert_one(admin_data)
    print("✅ Institute created: Tech University (Code: TECH2026)")
    print("✅ Admin created: techadmin / Admin@123")
    
    # 3. Create Sample Students
    students = [
        {
            "username": "alice",
            "email": "alice@example.com",
            "password": hash_password("Student@123"),
            "role": "student",
            "instituteId": institute_id,
            "instituteName": "Tech University",
            "isInstituteMember": True,
            "instituteCode": "TECH2026",
            "score": 85,
            "level": 3,
            "badges": ["Code Novice", "Script Learner", "Bug Buster"],
            "notifications": 0,
            "streak": 5,
            "codeQuality": 78,
            "recentActivity": [
                {"text": "Completed Python quiz", "points": 25},
                {"text": "Level Up! Reached Level 3", "points": 0},
                {"text": "Welcome to Skill Rank!", "points": 0}
            ],
            "subjectCertificates": ["Python", "JavaScript"],
            "levelCertificates": [1, 2, 3],
            "createdAt": str(datetime.now())
        },
        {
            "username": "bob",
            "email": "bob@example.com",
            "password": hash_password("Student@123"),
            "role": "student",
            "instituteId": institute_id,
            "instituteName": "Tech University",
            "isInstituteMember": True,
            "instituteCode": "TECH2026",
            "score": 45,
            "level": 2,
            "badges": ["Code Novice", "Script Learner"],
            "notifications": 0,
            "streak": 3,
            "codeQuality": 65,
            "recentActivity": [
                {"text": "Completed HTML quiz", "points": 15},
                {"text": "Level Up! Reached Level 2", "points": 0},
                {"text": "Welcome to Skill Rank!", "points": 0}
            ],
            "subjectCertificates": ["HTML"],
            "levelCertificates": [1, 2],
            "createdAt": str(datetime.now())
        },
        {
            "username": "charlie",
            "email": "charlie@example.com",
            "password": hash_password("Student@123"),
            "role": "student",
            "instituteId": institute_id,
            "instituteName": "Tech University",
            "isInstituteMember": True,
            "instituteCode": "TECH2026",
            "score": 120,
            "level": 4,
            "badges": ["Code Novice", "Script Learner", "Bug Buster", "DevOps Master"],
            "notifications": 0,
            "streak": 10,
            "codeQuality": 92,
            "recentActivity": [
                {"text": "Completed DevOps quiz", "points": 30},
                {"text": "Level Up! Reached Level 4", "points": 0},
                {"text": "Earned certificate in DevOps", "points": 0},
                {"text": "Welcome to Skill Rank!", "points": 0}
            ],
            "subjectCertificates": ["Python", "JavaScript", "DevOps"],
            "levelCertificates": [1, 2, 3, 4],
            "createdAt": str(datetime.now())
        },
        {
            "username": "diana",
            "email": "diana@example.com",
            "password": hash_password("Student@123"),
            "role": "student",
            "instituteId": "",
            "instituteName": "",
            "isInstituteMember": False,
            "instituteCode": "",
            "score": 30,
            "level": 2,
            "badges": ["Code Novice", "Script Learner"],
            "notifications": 0,
            "streak": 2,
            "codeQuality": 55,
            "recentActivity": [
                {"text": "Completed CSS quiz", "points": 10},
                {"text": "Welcome to Skill Rank!", "points": 0}
            ],
            "subjectCertificates": ["CSS"],
            "levelCertificates": [1, 2],
            "createdAt": str(datetime.now())
        },
        {
            "username": "eve",
            "email": "eve@example.com",
            "password": hash_password("Student@123"),
            "role": "student",
            "instituteId": "",
            "instituteName": "",
            "isInstituteMember": False,
            "instituteCode": "",
            "score": 15,
            "level": 1,
            "badges": ["Code Novice"],
            "notifications": 0,
            "streak": 1,
            "codeQuality": 40,
            "recentActivity": [
                {"text": "Completed Git quiz", "points": 5},
                {"text": "Welcome to Skill Rank!", "points": 0}
            ],
            "subjectCertificates": ["Git"],
            "levelCertificates": [1],
            "createdAt": str(datetime.now())
        }
    ]
    
    # Insert students
    for student in students:
        users.insert_one(student)
    
    print(f"✅ {len(students)} students created!")
    
    # 4. Create Sample Quizzes
    quizzes_data = [
        {
            "title": "Python Basics Quiz",
            "domain": "Python",
            "questions": [
                {
                    "q": "What is the output of print(2**3)?",
                    "a": ["6", "8", "9", "5"],
                    "c": 1
                },
                {
                    "q": "Which keyword is used for function definition in Python?",
                    "a": ["function", "def", "define", "func"],
                    "c": 1
                },
                {
                    "q": "What is the correct file extension for Python files?",
                    "a": [".python", ".py", ".pt", ".pyth"],
                    "c": 1
                }
            ],
            "created_by": "superadmin",
            "institute_id": None,
            "is_global": True,
            "createdAt": str(datetime.now()),
            "updatedAt": str(datetime.now())
        },
        {
            "title": "JavaScript Fundamentals",
            "domain": "JavaScript",
            "questions": [
                {
                    "q": "How do you declare a variable in JavaScript?",
                    "a": ["variable x;", "let x;", "v x;", "var x;"],
                    "c": 1
                },
                {
                    "q": "What is the output of console.log(typeof null)?",
                    "a": ["null", "undefined", "object", "number"],
                    "c": 2
                }
            ],
            "created_by": "superadmin",
            "institute_id": None,
            "is_global": True,
            "createdAt": str(datetime.now()),
            "updatedAt": str(datetime.now())
        },
        {
            "title": "HTML & CSS Quiz",
            "domain": "HTML",
            "questions": [
                {
                    "q": "What does HTML stand for?",
                    "a": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"],
                    "c": 0
                }
            ],
            "created_by": "techadmin",
            "institute_id": institute_id,
            "is_global": False,
            "createdAt": str(datetime.now()),
            "updatedAt": str(datetime.now())
        }
    ]
    
    for quiz in quizzes_data:
        quizzes.insert_one(quiz)
    
    print(f"✅ {len(quizzes_data)} quizzes created!")
    
    # 5. Summary
    print("\n" + "="*50)
    print("🎉 DATABASE RESET COMPLETE!")
    print("="*50)
    print("\n📊 Summary:")
    print(f"  • Super Admin: 1")
    print(f"  • Institutes: 1 (Tech University)")
    print(f"  • Admins: 1 (techadmin)")
    print(f"  • Students: {len(students)}")
    print(f"  • Quizzes: {len(quizzes_data)}")
    print("\n🔑 Login Credentials:")
    print("-" * 30)
    print("🔹 SUPER ADMIN:")
    print("  Email: admin@skillrank.com")
    print("  Password: Admin@123")
    print("\n🔹 ADMIN:")
    print("  Username: techadmin")
    print("  Password: Admin@123")
    print("\n🔹 STUDENTS:")
    for student in students:
        print(f"  Username: {student['username']}")
        print(f"  Password: Student@123")
        print(f"  Institute: {student.get('instituteName', 'Normal Student')}")
        print("  ---")
    print("="*50)
    
    client.close()

if __name__ == "__main__":
    try:
        reset_database()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)