# UNIPORT Data Seeding Scripts

This directory contains scripts to populate your ChoicePro database with complete University of Port Harcourt (UNIPORT) academic data.

## 🚀 Quick Start (ONE COMMAND)

Run this single command to seed everything:

```bash
npx tsx scripts/seed-uniport-data.ts
```

This will automatically create:
- ✅ 12 Faculties
- ✅ 60+ Departments
- ✅ 80+ Programmes
- ✅ 100+ Courses

## 📁 Available Scripts

### 1. `seed-uniport-data.ts` (RECOMMENDED - Use This!)
**Complete UNIPORT data seeding in one go**

Seeds all academic data in the correct order:
1. Faculties (12 total)
2. Departments (60+, linked to faculties)
3. Programmes (80+, linked to departments)
4. Courses (100+, linked to departments)

**Usage:**
```bash
npx tsx scripts/seed-uniport-data.ts
```

**Features:**
- One command does everything
- Smart duplicate detection
- Proper relationship linking
- Progress reporting
- Safe to run multiple times

---

### 2. `seed-uniport-courses.ts` (Optional - Standalone)
**Seed courses only** (if you already have departments)

Seeds 100+ courses across major departments.

**Usage:**
```bash
npx tsx scripts/seed-uniport-courses.ts
```

**Note:** Only use this if you already ran the main script and want to add more courses separately.

---

### 3. `seed-programmes.ts` (Legacy)
**Old programme seeding script**

This is kept for reference but **NOT RECOMMENDED**. Use `seed-uniport-data.ts` instead.

## 📊 What Gets Created

### Faculties (12)

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

### Departments (60+)
Organized under their respective faculties:
- Agriculture: 6 departments
- Basic Medical Sciences: 5 departments
- Clinical Sciences: 4 departments
- Education: 6 departments
- Engineering: 7 departments
- Humanities: 8 departments
- Law: 4 departments
- Management Sciences: 6 departments
- Pharmaceutical Sciences: 6 departments
- Science: 9 departments
- Social Sciences: 5 departments
- Technical & Science Education: 3 departments

### Programmes (80+)
Degree programmes across all departments:
- Bachelor's degrees (B.SC, B.ENG, B.A, etc.)
- Professional degrees (MBBS, LLB, B.PHARM)
- Duration: 4-6 years
- Credit requirements: 120-180 credits

### Courses (100+)
Core and elective courses for major departments:

**Computer Science (15 courses)**
- 100 Level: CSC101, CSC102, MTH101, MTH102
- 200 Level: CSC201, CSC202, CSC203, CSC204
- 300 Level: CSC301, CSC302, CSC303, CSC304
- 400 Level: CSC401, CSC402, CSC499 (Project)

**Accounting (13 courses)**
- Financial Accounting, Cost Accounting, Auditing
- Taxation, Management Accounting
- Research Project

**Economics (11 courses)**
- Microeconomics, Macroeconomics, Econometrics
- Development Economics, Statistical Methods


**Electrical Engineering (11 courses)**
- Circuit Theory, Electromagnetic Fields
- Control Systems, Power Systems, Digital Electronics
- Final Year Project

**Law (11 courses)**
- Constitutional Law, Criminal Law
- Contract Law, Administrative Law
- International Law, Jurisprudence

## 🔄 Script Execution Order

The main script (`seed-uniport-data.ts`) executes in this order:

```
1. Connect to MongoDB
   ↓
2. Create Faculties (with duplicate check)
   ↓
3. Create Departments (linked to faculties)
   ↓
4. Create Programmes (linked to departments)
   ↓
5. Create Courses (linked to departments)
   ↓
6. Display summary and disconnect
```

## 🛡️ Duplicate Prevention

All scripts include smart duplicate detection:

- **Faculties**: Checked by `code` OR `name`
- **Departments**: Checked by `code` globally OR `name` within faculty
- **Programmes**: Checked by `code` OR `name`
- **Courses**: Checked by `code`

This means you can safely run the scripts multiple times. Existing records will be skipped, only missing data will be created.

## ✅ Verification Steps

After seeding, verify the data:

### 1. Check Counts in MongoDB
```javascript
// In MongoDB shell or Compass
db.faculties.countDocuments()    // Should be 12
db.departments.countDocuments()   // Should be 60+
db.programmes.countDocuments()    // Should be 80+
db.courses.countDocuments()       // Should be 100+
```

### 2. Check Admin Panels
Visit these URLs (must be logged in as super admin):
- http://localhost:3000/admin/faculties
- http://localhost:3000/admin/departments
- http://localhost:3000/admin/programmes
- http://localhost:3000/admin/courses

### 3. Test Student Profile Setup
- Go to: http://localhost:3000/dashboard/profile/setup
- Select a faculty → departments should populate
- Select a department → programmes should populate


## 🔧 Troubleshooting

### Error: "MongoDB connection string not found"
**Solution:** Check your `.env` file has `DATABASE_URL` set:
```env
DATABASE_URL="mongodb://..."
```

### Error: "E11000 duplicate key error"
**Cause:** Data already exists with same code or name.

**Solution:** This is normal! The script will skip existing records and continue. If you want to start fresh:
1. Delete all existing data from MongoDB
2. Run the script again

### Courses not showing for students
**Check:**
1. Courses are linked to the correct department
2. API route `/api/courses` returns data
3. Browser console for errors

### Programmes not appearing in dropdowns
**Check:**
1. Programmes have valid `departmentId` references
2. Departments have valid `facultyId` references
3. API responses include the data

## 📝 Environment Requirements

### Required Environment Variables
```env
DATABASE_URL="mongodb://..."  # MongoDB connection string
```

### Optional (for the main app)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GEMINI_API_KEY="your-api-key"
AI_MODE="gemini"
```

## 🎯 Best Practices

1. **Always run the main script first**: `seed-uniport-data.ts`
2. **Verify data after seeding**: Check admin panels
3. **Safe to re-run**: Scripts skip existing data
4. **Backup before cleanup**: If deleting data to start fresh
5. **Check relationships**: Ensure programmes link to departments, departments to faculties

## 📚 Additional Documentation

- **Complete Guide**: `../SEEDING_GUIDE.md`
- **Quick Reference**: `../QUICK_REFERENCE.md`
- **Next Steps**: `../NEXT_STEPS.md`

## 🆘 Need Help?

If you encounter issues:
1. Check script output for specific error messages
2. Verify MongoDB connection is working
3. Ensure you're using the correct environment variables
4. Check that super admin account exists for admin access
5. Review browser console for frontend errors

---

**Last Updated:** January 2025  
**Script Version:** 1.0  
**Database:** MongoDB with Mongoose
