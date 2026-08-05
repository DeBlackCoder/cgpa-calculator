# 🚀 RUN THIS COMMAND NOW!

## ONE COMMAND TO SEED EVERYTHING

```bash
npx tsx scripts/seed-uniport-data.ts
```

---

## ✅ What This Will Create

### 📚 Faculties: 12
All UNIPORT faculties

### 🏛️ Departments: 60+
Departments across all faculties

### 🎓 Programmes: 80+
Bachelor's, Professional, and Graduate programmes

### 📖 Courses: 315+
Complete curriculum across 16 departments:

1. **Computer Science** - 25 courses
2. **Accounting** - 22 courses
3. **Economics** - 20 courses
4. **Electrical Engineering** - 24 courses
5. **Law (Public Law)** - 28 courses
6. **Mathematics** - 20 courses
7. **Physics** - 22 courses
8. **Chemistry** - 24 courses
9. **Microbiology** - 20 courses
10. **Biochemistry** - 22 courses
11. **Business Administration** - 20 courses
12. **Banking and Finance** - 18 courses
13. **Marketing** - 18 courses
14. **Political Science** - 18 courses
15. **Psychology** - 18 courses
16. **Sociology** - 16 courses

**TOTAL: 315 Courses**

---

## ⏱️ Expected Time

30-90 seconds (depending on your system)

---

## 📊 Expected Output

```
✅ MongoDB connected

🏫 University of Port Harcourt Data Seeding

============================================================

📚 STEP 1: Creating Faculties...
✅ Created: Faculty of Agriculture
✅ Created: Faculty of Basic Medical Sciences
... (12 total)

🏛️  STEP 2: Creating Departments...
✅ Created: Computer Science (Faculty of Science)
✅ Created: Accounting (Faculty of Management Sciences)
... (60+ total)

🎓 STEP 3: Creating Programmes...
✅ Created: Computer Science (B.SC-CSC)
✅ Created: Accounting (B.SC-ACC)
... (80+ total)

📖 STEP 4: Creating Courses...
✅ Created: CSC101 - Introduction to Computer Science
✅ Created: ACC101 - Introduction to Financial Accounting
✅ Created: ECO111 - Principles of Economics I
... (315 total)

============================================================

✨ UNIPORT DATA SEEDING COMPLETE!

📊 Final Summary:
   🏛️  Faculties: 12 new
   🏫 Departments: 60+ new
   🎓 Programmes: 80+ new
   📖 Courses: 315 new

============================================================

👋 Disconnected from MongoDB
```

---

## ✅ After Seeding - Verification

### 1. Check Admin Panels
Visit these URLs (login as super admin first):

- **Faculties:** http://localhost:3000/admin/faculties (should show 12)
- **Departments:** http://localhost:3000/admin/departments (should show 60+)
- **Programmes:** http://localhost:3000/admin/programmes (should show 80+)
- **Courses:** http://localhost:3000/admin/courses (should show 315+)

### 2. Test Student Profile Setup
- Go to: http://localhost:3000/dashboard/profile/setup
- Select a faculty → departments populate
- Select a department → programmes populate
- Everything should work smoothly!

### 3. Test Course Registration
- Students can now browse and select from 315+ real courses
- Courses organized by:
  - Department
  - Level (100-500)
  - Semester (1 or 2)
  - Credit units (2-6)
  - Core vs Elective

---

## 🔐 Login Credentials

### Super Admin (Full Access)
```
Email: admin@university.edu
Password: admin123
```

### Your Student Account
```
Email: hillaryprosperwahua@gmail.com
Password: [your password]
```

---

## 📚 Additional Documentation

- **Course Details:** `COURSES_SUMMARY.md` - Complete breakdown of all 315 courses
- **Seeding Guide:** `SEEDING_GUIDE.md` - Detailed documentation
- **Quick Reference:** `QUICK_REFERENCE.md` - Quick links and commands
- **Scripts README:** `scripts/README.md` - Script documentation

---

## 🆘 Troubleshooting

### If you see "MongoDB connection error"
- Check your `.env` file has `DATABASE_URL` set
- Verify MongoDB is running

### If you see "E11000 duplicate key error"
- This is normal! It means some data already exists
- The script will skip existing records and continue

### If courses don't appear
- Refresh your browser
- Check browser console for errors
- Verify API: http://localhost:3000/api/courses

---

## 🎉 You're Ready!

After running the command, your database will be fully populated with:
- ✅ Complete UNIPORT academic structure
- ✅ 315+ real courses ready for students
- ✅ Proper relationships between all data
- ✅ Professional course codes and descriptions

**Just run:**
```bash
npx tsx scripts/seed-uniport-data.ts
```

🚀 **GO!**
