# UNIPORT Data Seeding Guide

## Overview
This guide helps you populate your database with complete University of Port Harcourt (UNIPORT) data including:
- **12 Faculties** (Agriculture, Basic Medical Sciences, Clinical Sciences, Education, Engineering, Humanities, Law, Management Sciences, Pharmaceutical Sciences, Science, Social Sciences, Technical & Science Education)
- **60+ Departments** across all faculties
- **80+ Programmes** with proper degree codes and durations
- **315+ Courses** across 16 major departments with comprehensive curriculum coverage

## Quick Start

### Run the Seeding Script

```bash
npx tsx scripts/seed-uniport-data.ts
```

**Expected Output:**
```
✅ MongoDB connected

🏫 University of Port Harcourt Data Seeding

============================================================

📚 STEP 1: Creating Faculties...
✅ Created: Faculty of Agriculture
✅ Created: Faculty of Basic Medical Sciences
... (continues for all faculties)

🏛️  STEP 2: Creating Departments...
✅ Created: Agricultural Economics and Extension (Faculty of Agriculture)
✅ Created: Animal Science (Faculty of Agriculture)
... (continues for all departments)

🎓 STEP 3: Creating Programmes...
✅ Created: Agricultural Economics (B.AGRIC-ECON)
✅ Created: Animal Science (B.AGRIC-ANS)
... (continues for all programmes)

📖 STEP 4: Creating Courses...
✅ Created: CSC101 - Introduction to Computer Science (Computer Science)
✅ Created: ACC101 - Introduction to Financial Accounting (Accounting)
✅ Created: ECO111 - Principles of Economics I (Economics)
... (continues for all 315 courses)

============================================================

✨ UNIPORT DATA SEEDING COMPLETE!

📊 Final Summary:
   🏛️  Faculties: 12 new
   🏫 Departments: 60+ new
   🎓 Programmes: 80+ new
   📖 Courses: 315+ new

============================================================

👋 Disconnected from MongoDB
```

## What Gets Created

### Faculties (12 Total)
1. Faculty of Agriculture (FAGRIC)
2. Faculty of Basic Medical Sciences (FBMS)
3. Faculty of Clinical Sciences (FCS)
4. Faculty of Education (FEDU)
5. Faculty of Engineering (FENG)
6. Faculty of Humanities (FHUM)
7. Faculty of Law (FLAW)
8. Faculty of Management Sciences (FMS)
9. Faculty of Pharmaceutical Sciences (FPHS)
10. Faculty of Science (FSCI)
11. Faculty of Social Sciences (FSOC)
12. Faculty of Technical and Science Education (FTSE)

### Sample Departments by Faculty

**Faculty of Agriculture:**
- Agricultural Economics and Extension
- Animal Science
- Crop and Soil Science
- Fisheries and Aquatic Environment
- Food Science and Technology
- Forestry and Wildlife Management

**Faculty of Engineering:**
- Chemical Engineering
- Civil Engineering
- Electrical Engineering
- Mechanical Engineering
- Marine Engineering
- Petroleum and Gas Engineering

**Faculty of Management Sciences:**
- Accounting
- Banking and Finance
- Business Administration
- Hospitality Management and Tourism
- Marketing

**Faculty of Science:**
- Animal and Environmental Biology
- Biochemistry
- Chemistry
- Computer Science
- Geology
- Mathematics
- Microbiology
- Physics
- Plant Science and Biotechnology

### Sample Programmes
- **MBBS** - Medicine and Surgery (6 years)
- **B.ENG-CSE** - Computer Science and Engineering (5 years)
- **B.SC-CSC** - Computer Science (4 years)
- **B.SC-ACC** - Accounting (4 years)
- **LLB** - Law (5 years)
- **B.PHARM** - Pharmacy (5 years)
- And 70+ more...

### Sample Courses by Department

**Computer Science:**
- CSC101 - Introduction to Computer Science (100L)
- CSC201 - Computer Programming I (200L)
- CSC301 - Algorithm Design and Analysis (300L)
- CSC401 - Artificial Intelligence (400L)
- CSC499 - Project (400L)

**Accounting:**
- ACC101 - Introduction to Financial Accounting (100L)
- ACC201 - Financial Accounting I (200L)
- ACC301 - Advanced Financial Accounting (300L)
- ACC401 - Advanced Auditing (400L)

**Economics:**
- ECO111 - Principles of Economics I (100L)
- ECO201 - Microeconomics I (200L)
- ECO301 - Microeconomics II (300L)
- ECO401 - Advanced Economic Theory (400L)

**Electrical Engineering:**
- ELE101 - Introduction to Electrical Engineering (100L)
- ELE201 - Circuit Theory I (200L)
- ELE301 - Control Systems (300L)
- ELE401 - Power Electronics (400L)

**Law:**
- LAW101 - Introduction to Nigerian Legal System (100L)
- LAW201 - Constitutional Law (200L)
- LAW301 - Administrative Law (300L)
- LAW401 - International Law (400L)

## Verification Steps

### 1. Check Admin Panels
After seeding, verify the data in these admin pages:

- **Faculties:** http://localhost:3000/admin/faculties
- **Departments:** http://localhost:3000/admin/departments
- **Programmes:** http://localhost:3000/admin/programmes

### 2. Test Profile Setup
Go to the student profile setup page and verify:
- All faculties appear in the Faculty dropdown
- Selecting a faculty shows its departments
- Selecting a department shows its programmes

**Profile Setup URL:** http://localhost:3000/dashboard/profile/setup

### 3. Database Direct Check
If you want to verify directly in the database:

```javascript
// Check counts
const facultyCount = await Faculty.countDocuments()
const deptCount = await Department.countDocuments()
const progCount = await Programme.countDocuments()

console.log(`Faculties: ${facultyCount}`)
console.log(`Departments: ${deptCount}`)
console.log(`Programmes: ${progCount}`)
```

## Features of the Seed Script

### Smart Duplicate Prevention
- Checks for existing faculties by `code`
- Checks for existing departments by `code` and `facultyId`
- Checks for existing programmes by `code`
- Only creates new records, never duplicates

### Proper Relationships
- Departments are linked to correct faculties via `facultyId`
- Programmes are linked to correct departments via `departmentId`
- Maintains referential integrity

### Comprehensive Data
- All faculty codes match UNIPORT standards
- Department codes are properly abbreviated
- Programme codes follow Nigerian university naming conventions
- Durations reflect actual programme lengths (4-6 years)
- Credit requirements match standard structures
- **100+ courses** across major departments with proper:
  - Course codes (e.g., CSC101, ACC201, LAW301)
  - Credit units (2-6 units)
  - Level assignment (100-600)
  - Semester distribution (1 or 2)
  - Core vs Elective designation

## Troubleshooting

### Problem: "MongoDB connection string not found"
**Solution:** Verify `.env` file has `DATABASE_URL` set:
```env
DATABASE_URL="mongodb://..."
```

### Problem: Script runs but no data appears
**Solution:** 
1. Check if data already exists (script will show "⏭️ Exists" messages)
2. Verify MongoDB connection string is correct
3. Check database name in connection string

### Problem: Programmes not showing in profile setup
**Solution:**
1. Clear browser cache
2. Check browser console for API errors
3. Verify API route at `/api/programmes` returns data
4. Check that programmes have valid `departmentId` references

## Re-running the Script

You can safely run the script multiple times. It will:
- Skip existing faculties
- Skip existing departments
- Skip existing programmes
- Only create what's missing

## Manual Data Management

After seeding, super admins can:
- Add new faculties at `/admin/faculties`
- Add new departments at `/admin/departments`
- Move departments between faculties
- Add/edit/delete programmes at `/admin/programmes`
- All changes are protected by super admin authentication

## Need Help?

If you encounter issues:
1. Check the script output for error messages
2. Verify your `.env` configuration
3. Check MongoDB connection
4. Ensure you're logged in as super admin to view admin pages
5. Check browser console for frontend errors

---

**Script Location:** `scripts/seed-uniport-data.ts`  
**Created:** Based on official UNIPORT academic structure  
**Last Updated:** January 2025
