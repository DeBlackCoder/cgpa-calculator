# 🎓 UNIPORT Courses Summary (300+ Courses)

## Overview
The seed script now includes **300+ comprehensive courses** across 16 major departments at the University of Port Harcourt.

## 📊 Course Distribution by Department

| Department | Courses | Levels | Description |
|------------|---------|--------|-------------|
| **Computer Science** | 25 | 100-400 | Programming, AI, Databases, Networks, Software Engineering |
| **Accounting** | 22 | 100-400 | Financial Accounting, Auditing, Taxation, Management Accounting |
| **Economics** | 20 | 100-400 | Micro/Macro Economics, Econometrics, Development Economics |
| **Electrical Engineering** | 24 | 100-400 | Circuit Theory, Power Systems, Control Systems, Electronics |
| **Law (Public Law)** | 28 | 100-500 | Constitutional, Criminal, Commercial, International Law |
| **Mathematics** | 20 | 100-400 | Calculus, Analysis, Algebra, Topology, Cryptography |
| **Physics** | 22 | 100-400 | Mechanics, Quantum, Electromagnetism, Nuclear Physics |
| **Chemistry** | 24 | 100-400 | Inorganic, Organic, Physical, Analytical Chemistry |
| **Microbiology** | 20 | 100-400 | Virology, Bacteriology, Immunology, Biotechnology |
| **Biochemistry** | 22 | 100-400 | Enzymology, Metabolism, Molecular Biology, Biotechnology |
| **Business Administration** | 20 | 100-400 | Management, HR, Strategic Management, Entrepreneurship |
| **Banking and Finance** | 18 | 100-400 | Corporate Finance, Investment, Risk Management, FinTech |
| **Marketing** | 18 | 100-400 | Brand Management, Digital Marketing, Analytics |
| **Political Science** | 18 | 100-400 | International Relations, Public Administration, Democracy |
| **Psychology** | 18 | 100-400 | Clinical, Educational, Cognitive, Forensic Psychology |
| **Sociology** | 16 | 100-400 | Social Research, Criminology, Urban Sociology |

**TOTAL: 315 Courses**

---

## 📚 Sample Courses by Level

### 100 Level (Foundational)
- CSC101 - Introduction to Computer Science
- ACC101 - Introduction to Financial Accounting
- ECO111 - Principles of Economics I
- LAW101 - Introduction to Nigerian Legal System
- MTH111 - Elementary Mathematics I
- PHY121 - General Physics I
- CHM121 - General Chemistry I

### 200 Level (Intermediate)
- CSC201 - Computer Programming I (C++)
- ACC201 - Financial Accounting I
- ECO201 - Microeconomics I
- ELE201 - Circuit Theory I
- MTH211 - Mathematical Methods I
- PHY221 - Thermal Physics

### 300 Level (Advanced)
- CSC301 - Algorithm Design and Analysis
- ACC301 - Advanced Financial Accounting
- ECO301 - Microeconomics II
- LAW301 - Criminal Law II
- MTH311 - Complex Analysis
- PHY321 - Quantum Mechanics I

### 400 Level (Specialization)
- CSC401 - Artificial Intelligence
- ACC401 - Advanced Auditing
- ECO401 - Advanced Microeconomics
- ELE401 - Power Electronics
- MTH411 - Functional Analysis
- PHY421 - Quantum Mechanics II

### Final Year Projects
- CSC499 - Computer Science Project (6 units)
- ACC499 - Accounting Research Project (6 units)
- ECO499 - Economics Research Project (6 units)
- LAW599 - Law Research Project (6 units)
- MTH499 - Mathematics Project (6 units)

---

## 🎯 Course Features

### Credit Units Distribution
- **2 units**: Practical/Lab courses, Engineering Drawing
- **3 units**: Most theory courses
- **6 units**: Final year projects and research

### Semester Distribution
- **Semester 1**: Core theoretical courses
- **Semester 2**: Applied courses and electives

### Course Types
- ✅ **Core Courses**: Required for all students
- 🎓 **Elective Courses**: Optional specialization courses
  - Examples: Cloud Computing, Digital Marketing, Islamic Banking, Forensic Psychology

---

## 🔬 Department-Specific Highlights

### Computer Science (25 courses)
**Specializations:**
- Software Development (CSC201, CSC202, CSC305)
- Artificial Intelligence (CSC401)
- Database Systems (CSC302)
- Networking (CSC306)
- Security (CSC405)
- Cloud Computing (CSC406) - Elective

### Accounting (22 courses)
**Specializations:**
- Financial Accounting (ACC101-ACC401)
- Auditing (ACC302, ACC401)
- Taxation (ACC205, ACC303)
- Public Sector Accounting (ACC304)
- Accounting Information Systems (ACC305)

### Economics (20 courses)
**Core Areas:**
- Microeconomics (ECO201, ECO301, ECO401)
- Macroeconomics (ECO202, ECO302, ECO402)
- Econometrics (ECO303)
- Development Economics (ECO204)
- International Economics (ECO305)

### Electrical Engineering (24 courses)
**Specializations:**
- Power Systems (ELE302, ELE401)
- Control Systems (ELE301)
- Electronics (ELE205, ELE206, ELE303)
- Communications (ELE305)
- Renewable Energy (ELE404) - Elective

### Law (28 courses)
**5-Year Programme:**
- Constitutional & Administrative Law
- Criminal Law & Procedure
- Commercial & Company Law
- International Law
- Professional Ethics

### Sciences (Mathematics, Physics, Chemistry)
**Strong Foundation:**
- Pure Mathematics (Analysis, Algebra, Topology)
- Applied Mathematics (Numerical Analysis, Operations Research)
- Theoretical Physics (Quantum Mechanics, Statistical Mechanics)
- Applied Physics (Electronics, Renewable Energy)
- Chemistry (Inorganic, Organic, Physical, Analytical)

### Life Sciences (Microbiology, Biochemistry)
**Cutting-Edge Topics:**
- Molecular Biology
- Genetic Engineering
- Biotechnology
- Bioinformatics
- Immunology

### Business & Management
**Modern Business:**
- E-Business, FinTech, Digital Banking
- Digital Marketing, Social Media Marketing
- Strategic Management
- Entrepreneurship
- International Business

### Social Sciences (Political Science, Psychology, Sociology)
**Contemporary Issues:**
- Gender and Politics
- Human Rights
- Forensic Psychology
- Neuropsychology
- Criminology and Deviance

---

## 🎓 Course Code Structure

**Format: ABC123**
- **ABC**: Department code (3 letters)
  - CSC = Computer Science
  - ACC = Accounting
  - ECO = Economics
  - LAW = Law
  - MTH = Mathematics
  - etc.

- **1**: Level (first digit)
  - 1 = 100 Level
  - 2 = 200 Level
  - 3 = 300 Level
  - 4 = 400 Level
  - 5 = 500 Level

- **23**: Course number within level

- **99**: Reserved for final year projects

**Examples:**
- `CSC301` = Computer Science, 300 Level, Course 01
- `ACC499` = Accounting, 400 Level, Project
- `LAW599` = Law, 500 Level, Project

---

## 📈 Usage Statistics

After seeding, you'll have:
- **315 total courses** across 16 departments
- **100-500 level** courses covering all academic years
- **Core & Elective** courses for flexible curriculum
- **Professional projects** for final year students
- **Interdisciplinary courses** (e.g., CSC111 in Mathematics)

---

## ✅ Verification Checklist

After running the seed script:

1. **Check Course Count**
   ```javascript
   db.courses.countDocuments() // Should be 315+
   ```

2. **Check by Department**
   ```javascript
   db.courses.aggregate([
     { $lookup: { from: 'departments', localField: 'departmentId', foreignField: '_id', as: 'dept' }},
     { $group: { _id: '$dept.name', count: { $sum: 1 }}},
     { $sort: { count: -1 }}
   ])
   ```

3. **Check by Level**
   ```javascript
   db.courses.aggregate([
     { $group: { _id: '$level', count: { $sum: 1 }}},
     { $sort: { _id: 1 }}
   ])
   ```

4. **Check Electives**
   ```javascript
   db.courses.countDocuments({ isElective: true })
   ```

---

## 🚀 Next Steps

1. **Run the seed script:**
   ```bash
   npx tsx scripts/seed-uniport-data.ts
   ```

2. **Verify in admin panel:**
   - Visit: http://localhost:3000/admin/courses
   - Check course counts by department
   - Verify level distribution

3. **Test student registration:**
   - Students can now select from 300+ real courses
   - Courses organized by level and semester
   - Proper credit unit calculations

---

## 📝 Notes

- All courses follow Nigerian university standards
- Course codes match UNIPORT conventions
- Credit units: 2-6 per course
- Final year projects: 6 units
- Elective courses marked with `isElective: true`
- Courses properly linked to departments

**Last Updated:** January 2025  
**Total Courses:** 315  
**Departments Covered:** 16
