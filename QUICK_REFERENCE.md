# 🚀 Quick Reference Card

## 🎯 ONE COMMAND TO COMPLETE SETUP

```bash
npx tsx scripts/seed-uniport-data.ts
```

---

## 🔗 Important URLs (Development)

### Student Pages
- **Dashboard:** http://localhost:3000/dashboard
- **Profile Setup:** http://localhost:3000/dashboard/profile/setup
- **Results:** http://localhost:3000/dashboard/results
- **AI Predictions:** http://localhost:3000/dashboard/predictions
- **AI Advisor (Chat):** http://localhost:3000/dashboard/ai-advisor
- **Academic Tools:** http://localhost:3000/dashboard/tools
- **Analytics:** http://localhost:3000/dashboard/analytics

### Admin Pages (Super Admin Only)
- **Admin Dashboard:** http://localhost:3000/admin
- **Faculties Management:** http://localhost:3000/admin/faculties
- **Departments Management:** http://localhost:3000/admin/departments
- **Programmes Management:** http://localhost:3000/admin/programmes
- **Courses Management:** http://localhost:3000/admin/courses
- **Students List:** http://localhost:3000/admin/students
- **Users Management:** http://localhost:3000/admin/users
- **Analytics:** http://localhost:3000/admin/analytics
- **Settings:** http://localhost:3000/admin/settings

### Auth Pages
- **Sign In:** http://localhost:3000/auth/signin
- **Sign Up:** http://localhost:3000/auth/signup

---

## 👤 Login Credentials

### Super Admin
```
Email: admin@university.edu
Password: admin123
```

### Your Account
```
Email: hillaryprosperwahua@gmail.com
Password: [your password]
```

---

## 💻 Common Commands

```bash
# Start development server
npm run dev

# Seed UNIPORT data (RUN THIS FIRST!)
npx tsx scripts/seed-uniport-data.ts

# Build for production
npm run build

# Start production server
npm start

# Install dependencies
npm install

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🗂️ Project Structure

```
choicepro/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication
│   │   ├── admin/                # Admin endpoints
│   │   ├── ai/                   # AI chat & predictions
│   │   ├── faculties/            # Faculty CRUD
│   │   ├── departments/          # Department CRUD
│   │   ├── programmes/           # Programme CRUD
│   │   ├── courses/              # Course CRUD
│   │   ├── results/              # Results CRUD
│   │   └── predictions/          # AI predictions
│   ├── dashboard/                # Student dashboard
│   └── admin/                    # Admin dashboard
├── components/                   # React components
│   ├── dashboard/                # Dashboard components
│   └── ui/                       # Radix UI components
├── lib/                          # Utilities
│   ├── mongodb.ts               # Database connection
│   ├── gemini.ts                # AI integration
│   ├── ai-predictions.ts        # Prediction logic
│   ├── utils.ts                 # Helper functions
│   └── auth-helpers.ts          # Auth utilities
├── models/                       # Mongoose models
│   ├── User.ts
│   ├── Student.ts
│   ├── Faculty.ts
│   ├── Department.ts
│   ├── Programme.ts
│   ├── Course.ts
│   ├── Result.ts
│   └── AIPredictionHistory.ts
├── scripts/                      # Utility scripts
│   └── seed-uniport-data.ts     # UNIPORT data seeder
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

---

## 🎓 UNIPORT Data Overview

### 12 Faculties
1. Agriculture (FAGRIC)
2. Basic Medical Sciences (FBMS)
3. Clinical Sciences (FCS)
4. Education (FEDU)
5. Engineering (FENG)
6. Humanities (FHUM)
7. Law (FLAW)
8. Management Sciences (FMS)
9. Pharmaceutical Sciences (FPHS)
10. Science (FSCI)
11. Social Sciences (FSOC)
12. Technical & Science Education (FTSE)

### 60+ Departments
Including:
- Computer Science
- Electrical Engineering
- Accounting
- Medicine and Surgery
- Law
- And 55+ more...

### 80+ Programmes
Including:
- MBBS (Medicine, 6 years)
- B.ENG (Engineering, 5 years)
- B.SC (Science, 4 years)
- LLB (Law, 5 years)
- B.PHARM (Pharmacy, 5 years)
- And 75+ more...

### 100+ Courses
Sample courses:
- **Computer Science**: CSC101, CSC201, CSC301, CSC401, CSC499
- **Accounting**: ACC101, ACC201, ACC301, ACC401, ACC499
- **Economics**: ECO111, ECO201, ECO301, ECO401, ECO499
- **Engineering**: ELE101, ELE201, ELE301, ELE401, ELE499
- **Law**: LAW101, LAW201, LAW301, LAW401, LAW599

---

## 🔑 Environment Variables (.env)

```env
# Database
DATABASE_URL="mongodb://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AI Configuration
AI_MODE="gemini"
GEMINI_API_KEY="AIza..."
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js
- **AI:** Google Gemini
- **UI:** Radix UI + Tailwind CSS
- **Icons:** Lucide React

---

## 📊 Key Features

### For Students
✅ Profile management with faculty/dept/programme
✅ Course result tracking with auto-grade calculation
✅ AI-powered CGPA predictions
✅ Risk assessment (low/medium/high/critical)
✅ Academic calculator tools
✅ Conversational AI advisor
✅ Performance analytics
✅ Mobile responsive design

### For Admins
✅ Faculty management (CRUD)
✅ Department management (CRUD + move)
✅ Programme management (CRUD)
✅ Course management (CRUD)
✅ Student overview
✅ User management
✅ System analytics
✅ Super admin access control

---

## 🔄 Workflow After Seeding

1. ✅ Run seeding script
2. ✅ Verify data in admin panels
3. ✅ Complete student profile setup
4. ✅ Add some course results
5. ✅ Get AI predictions
6. ✅ Test all features

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to database | Check DATABASE_URL in .env |
| Seeding fails | Verify MongoDB is running |
| Programmes not showing | Run seed script, check API |
| AI not working | Verify GEMINI_API_KEY in .env |
| Not authorized | Login as super admin |
| Mobile menu not working | Clear cache, check responsive |

---

## 📖 Documentation Files

- `README.md` - Project overview
- `NEXT_STEPS.md` - Detailed next steps
- `SEEDING_GUIDE.md` - Complete seeding documentation
- `QUICK_REFERENCE.md` - This file (quick reference)

---

**🎯 Start Here:** Run `npx tsx scripts/seed-uniport-data.ts` then visit http://localhost:3000
