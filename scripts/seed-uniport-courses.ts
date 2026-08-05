/**
 * University of Port Harcourt (UNIPORT) Courses Seed
 * 
 * This script populates the database with actual UNIPORT courses
 * across various departments and levels.
 * 
 * Run with: npx tsx scripts/seed-uniport-courses.ts
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL
    if (!mongoUri) {
      throw new Error('MongoDB connection string not found')
    }
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const DepartmentSchema = new mongoose.Schema({
  name: String,
  code: String,
  facultyId: String
}, { timestamps: true })

const CourseSchema = new mongoose.Schema({
  code: String,
  title: String,
  creditUnits: Number,
  level: Number,
  semester: Number,
  departmentId: String,
  description: String,
  isElective: Boolean
}, { timestamps: true })

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

// UNIPORT Courses by Department
const coursesByDepartment: Record<string, Array<{
  code: string
  title: string
  units: number
  level: number
  semester: number
  isElective?: boolean
}>> = {
  // Computer Science Courses
  "Computer Science": [
    // 100 Level
    { code: "CSC101", title: "Introduction to Computer Science", units: 3, level: 100, semester: 1 },
    { code: "CSC102", title: "Introduction to Problem Solving", units: 3, level: 100, semester: 2 },
    { code: "MTH101", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH102", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "PHY101", title: "General Physics I", units: 3, level: 100, semester: 1 },
    { code: "PHY102", title: "General Physics II", units: 3, level: 100, semester: 2 },
    
    // 200 Level
    { code: "CSC201", title: "Computer Programming I", units: 3, level: 200, semester: 1 },
    { code: "CSC202", title: "Computer Programming II", units: 3, level: 200, semester: 2 },
    { code: "CSC203", title: "Discrete Structures", units: 3, level: 200, semester: 1 },
    { code: "CSC204", title: "Data Structures", units: 3, level: 200, semester: 2 },
    { code: "MTH201", title: "Mathematical Methods I", units: 3, level: 200, semester: 1 },
    { code: "MTH202", title: "Elementary Differential Equations", units: 3, level: 200, semester: 2 },
    
    // 300 Level
    { code: "CSC301", title: "Algorithm Design and Analysis", units: 3, level: 300, semester: 1 },
    { code: "CSC302", title: "Database Management Systems", units: 3, level: 300, semester: 2 },
    { code: "CSC303", title: "Operating Systems I", units: 3, level: 300, semester: 1 },
    { code: "CSC304", title: "Computer Architecture", units: 3, level: 300, semester: 2 },
    { code: "CSC305", title: "Software Engineering", units: 3, level: 300, semester: 1 },
    { code: "CSC306", title: "Computer Networks", units: 3, level: 300, semester: 2 },
    
    // 400 Level
    { code: "CSC401", title: "Artificial Intelligence", units: 3, level: 400, semester: 1 },
    { code: "CSC402", title: "Compiler Construction", units: 3, level: 400, semester: 2 },
    { code: "CSC403", title: "Theory of Computation", units: 3, level: 400, semester: 1 },
    { code: "CSC404", title: "Computer Graphics", units: 3, level: 400, semester: 2, isElective: true },
    { code: "CSC405", title: "Information Security", units: 3, level: 400, semester: 1, isElective: true },
    { code: "CSC499", title: "Project", units: 6, level: 400, semester: 2 }
  ],

  // Accounting Courses
  "Accounting": [
    // 100 Level
    { code: "ACC101", title: "Introduction to Financial Accounting I", units: 3, level: 100, semester: 1 },
    { code: "ACC102", title: "Introduction to Financial Accounting II", units: 3, level: 100, semester: 2 },
    { code: "BUS101", title: "Introduction to Business", units: 2, level: 100, semester: 1 },
    { code: "ECO101", title: "Principles of Economics I", units: 3, level: 100, semester: 1 },
    { code: "ECO102", title: "Principles of Economics II", units: 3, level: 100, semester: 2 },
    
    // 200 Level
    { code: "ACC201", title: "Financial Accounting I", units: 3, level: 200, semester: 1 },
    { code: "ACC202", title: "Financial Accounting II", units: 3, level: 200, semester: 2 },
    { code: "ACC203", title: "Cost Accounting I", units: 3, level: 200, semester: 1 },
    { code: "ACC204", title: "Management Accounting", units: 3, level: 200, semester: 2 },
    { code: "BUS201", title: "Business Statistics", units: 3, level: 200, semester: 1 },
    
    // 300 Level
    { code: "ACC301", title: "Advanced Financial Accounting", units: 3, level: 300, semester: 1 },
    { code: "ACC302", title: "Auditing and Investigation I", units: 3, level: 300, semester: 2 },
    { code: "ACC303", title: "Taxation I", units: 3, level: 300, semester: 1 },
    { code: "ACC304", title: "Public Sector Accounting", units: 3, level: 300, semester: 2 },
    { code: "ACC305", title: "Accounting Information Systems", units: 3, level: 300, semester: 1 },
    
    // 400 Level
    { code: "ACC401", title: "Advanced Auditing", units: 3, level: 400, semester: 1 },
    { code: "ACC402", title: "International Accounting", units: 3, level: 400, semester: 2 },
    { code: "ACC403", title: "Financial Management", units: 3, level: 400, semester: 1 },
    { code: "ACC404", title: "Corporate Reporting", units: 3, level: 400, semester: 2 },
    { code: "ACC499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Electrical Engineering Courses
  "Electrical Engineering": [
    // 100 Level
    { code: "ELE101", title: "Introduction to Electrical Engineering", units: 2, level: 100, semester: 1 },
    { code: "ELE102", title: "Engineering Drawing", units: 2, level: 100, semester: 2 },
    { code: "MTH101", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH102", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "PHY101", title: "General Physics I", units: 3, level: 100, semester: 1 },
    { code: "PHY102", title: "General Physics II", units: 3, level: 100, semester: 2 },
    { code: "CHM101", title: "General Chemistry I", units: 3, level: 100, semester: 1 },
    
    // 200 Level
    { code: "ELE201", title: "Circuit Theory I", units: 3, level: 200, semester: 1 },
    { code: "ELE202", title: "Circuit Theory II", units: 3, level: 200, semester: 2 },
    { code: "ELE203", title: "Electromagnetic Fields and Waves", units: 3, level: 200, semester: 1 },
    { code: "ELE204", title: "Electrical Measurements", units: 3, level: 200, semester: 2 },
    { code: "ELE205", title: "Electronic Devices and Circuits", units: 3, level: 200, semester: 1 },
    
    // 300 Level
    { code: "ELE301", title: "Control Systems I", units: 3, level: 300, semester: 1 },
    { code: "ELE302", title: "Power Systems Analysis", units: 3, level: 300, semester: 2 },
    { code: "ELE303", title: "Digital Electronics", units: 3, level: 300, semester: 1 },
    { code: "ELE304", title: "Microprocessor Systems", units: 3, level: 300, semester: 2 },
    { code: "ELE305", title: "Communication Systems I", units: 3, level: 300, semester: 1 },
    
    // 400 Level
    { code: "ELE401", title: "Power Electronics", units: 3, level: 400, semester: 1 },
    { code: "ELE402", title: "Electrical Machines", units: 3, level: 400, semester: 2 },
    { code: "ELE403", title: "Digital Signal Processing", units: 3, level: 400, semester: 1, isElective: true },
    { code: "ELE404", title: "Renewable Energy Systems", units: 3, level: 400, semester: 2, isElective: true },
    { code: "ELE499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Medicine and Surgery Courses
  "Medicine and Surgery": [
    // 100 Level
    { code: "ANA101", title: "General Anatomy I", units: 4, level: 100, semester: 1 },
    { code: "ANA102", title: "General Anatomy II", units: 4, level: 100, semester: 2 },
    { code: "BCH101", title: "General Biochemistry I", units: 3, level: 100, semester: 1 },
    { code: "BCH102", title: "General Biochemistry II", units: 3, level: 100, semester: 2 },
    { code: "PHY101", title: "General Physiology I", units: 3, level: 100, semester: 1 },
    
    // 200 Level
    { code: "ANA201", title: "Systemic Anatomy", units: 4, level: 200, semester: 1 },
    { code: "PHY201", title: "Systemic Physiology I", units: 3, level: 200, semester: 1 },
    { code: "PHY202", title: "Systemic Physiology II", units: 3, level: 200, semester: 2 },
    { code: "BCH201", title: "Medical Biochemistry", units: 3, level: 200, semester: 1 },
    { code: "PHA201", title: "General Pharmacology", units: 3, level: 200, semester: 2 },
    
    // 300 Level
    { code: "MED301", title: "Pathology I", units: 4, level: 300, semester: 1 },
    { code: "MED302", title: "Pathology II", units: 4, level: 300, semester: 2 },
    { code: "MED303", title: "Microbiology and Parasitology", units: 3, level: 300, semester: 1 },
    { code: "MED304", title: "Community Medicine I", units: 3, level: 300, semester: 2 },
    { code: "PHA301", title: "Systemic Pharmacology", units: 3, level: 300, semester: 1 },
    
    // 400 Level (Clinical Years)
    { code: "MED401", title: "Medicine I", units: 4, level: 400, semester: 1 },
    { code: "MED402", title: "Surgery I", units: 4, level: 400, semester: 2 },
    { code: "MED403", title: "Obstetrics and Gynaecology I", units: 4, level: 400, semester: 1 },
    { code: "MED404", title: "Paediatrics I", units: 4, level: 400, semester: 2 },
    
    // 500 Level
    { code: "MED501", title: "Medicine II", units: 4, level: 500, semester: 1 },
    { code: "MED502", title: "Surgery II", units: 4, level: 500, semester: 2 },
    { code: "MED503", title: "Psychiatry", units: 3, level: 500, semester: 1 },
    { code: "MED504", title: "Community Medicine II", units: 3, level: 500, semester: 2 },
    
    // 600 Level
    { code: "MED601", title: "Clinical Clerkship", units: 6, level: 600, semester: 1 },
    { code: "MED602", title: "Final Clinical Examination", units: 6, level: 600, semester: 2 }
  ],

  // Economics Courses
  "Economics": [
    // 100 Level
    { code: "ECO101", title: "Principles of Economics I", units: 3, level: 100, semester: 1 },
    { code: "ECO102", title: "Principles of Economics II", units: 3, level: 100, semester: 2 },
    { code: "MTH101", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH102", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "ACC101", title: "Introduction to Accounting", units: 3, level: 100, semester: 1 },
    
    // 200 Level
    { code: "ECO201", title: "Microeconomics I", units: 3, level: 200, semester: 1 },
    { code: "ECO202", title: "Macroeconomics I", units: 3, level: 200, semester: 2 },
    { code: "ECO203", title: "Statistical Methods", units: 3, level: 200, semester: 1 },
    { code: "ECO204", title: "Development Economics I", units: 3, level: 200, semester: 2 },
    { code: "ECO205", title: "History of Economic Thought", units: 3, level: 200, semester: 1 },
    
    // 300 Level
    { code: "ECO301", title: "Microeconomics II", units: 3, level: 300, semester: 1 },
    { code: "ECO302", title: "Macroeconomics II", units: 3, level: 300, semester: 2 },
    { code: "ECO303", title: "Econometrics I", units: 3, level: 300, semester: 1 },
    { code: "ECO304", title: "Public Finance", units: 3, level: 300, semester: 2 },
    { code: "ECO305", title: "International Economics", units: 3, level: 300, semester: 1 },
    
    // 400 Level
    { code: "ECO401", title: "Advanced Microeconomics", units: 3, level: 400, semester: 1 },
    { code: "ECO402", title: "Advanced Macroeconomics", units: 3, level: 400, semester: 2 },
    { code: "ECO403", title: "Monetary Economics", units: 3, level: 400, semester: 1 },
    { code: "ECO404", title: "Environmental Economics", units: 3, level: 400, semester: 2, isElective: true },
    { code: "ECO499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Law Courses (Public Law, Private Law, etc. - all use same courses)
  "Public Law": [
    // 100 Level
    { code: "LAW101", title: "Introduction to Nigerian Legal System", units: 3, level: 100, semester: 1 },
    { code: "LAW102", title: "Legal Method and Legal Reasoning", units: 3, level: 100, semester: 2 },
    { code: "LAW103", title: "Law of Contract", units: 3, level: 100, semester: 1 },
    { code: "LAW104", title: "Law of Torts", units: 3, level: 100, semester: 2 },
    { code: "LAW105", title: "Constitutional Law I", units: 3, level: 100, semester: 1 },
    
    // 200 Level
    { code: "LAW201", title: "Constitutional Law II", units: 3, level: 200, semester: 1 },
    { code: "LAW202", title: "Criminal Law I", units: 3, level: 200, semester: 2 },
    { code: "LAW203", title: "Land Law", units: 3, level: 200, semester: 1 },
    { code: "LAW204", title: "Law of Evidence", units: 3, level: 200, semester: 2 },
    { code: "LAW205", title: "Administrative Law", units: 3, level: 200, semester: 1 },
    
    // 300 Level
    { code: "LAW301", title: "Criminal Law II", units: 3, level: 300, semester: 1 },
    { code: "LAW302", title: "Company Law", units: 3, level: 300, semester: 2 },
    { code: "LAW303", title: "International Law I", units: 3, level: 300, semester: 1 },
    { code: "LAW304", title: "Equity and Trusts", units: 3, level: 300, semester: 2 },
    { code: "LAW305", title: "Commercial Law", units: 3, level: 300, semester: 1 },
    
    // 400 Level
    { code: "LAW401", title: "Jurisprudence and Legal Theory", units: 3, level: 400, semester: 1 },
    { code: "LAW402", title: "International Law II", units: 3, level: 400, semester: 2 },
    { code: "LAW403", title: "Labor Law", units: 3, level: 400, semester: 1 },
    { code: "LAW404", title: "Taxation", units: 3, level: 400, semester: 2 },
    
    // 500 Level
    { code: "LAW501", title: "Civil Procedure", units: 3, level: 500, semester: 1 },
    { code: "LAW502", title: "Criminal Procedure", units: 3, level: 500, semester: 2 },
    { code: "LAW503", title: "Professional Ethics", units: 3, level: 500, semester: 1 },
    { code: "LAW599", title: "Research Project", units: 6, level: 500, semester: 2 }
  ],

  // Pharmacy Courses
  "Clinical Pharmacy and Pharmacy Practice": [
    // 100 Level
    { code: "PHM101", title: "Pharmaceutical Chemistry I", units: 3, level: 100, semester: 1 },
    { code: "PHM102", title: "Pharmaceutics I", units: 3, level: 100, semester: 2 },
    { code: "ANA101", title: "Human Anatomy", units: 3, level: 100, semester: 1 },
    { code: "BCH101", title: "Biochemistry I", units: 3, level: 100, semester: 1 },
    { code: "PHY101", title: "Physiology", units: 3, level: 100, semester: 2 },
    
    // 200 Level
    { code: "PHM201", title: "Pharmaceutical Chemistry II", units: 3, level: 200, semester: 1 },
    { code: "PHM202", title: "Pharmaceutics II", units: 3, level: 200, semester: 2 },
    { code: "PHM203", title: "Pharmacognosy I", units: 3, level: 200, semester: 1 },
    { code: "PHM204", title: "Pharmaceutical Microbiology", units: 3, level: 200, semester: 2 },
    { code: "PHA201", title: "General Pharmacology", units: 3, level: 200, semester: 1 },
    
    // 300 Level
    { code: "PHM301", title: "Medicinal Chemistry", units: 3, level: 300, semester: 1 },
    { code: "PHM302", title: "Pharmaceutical Technology", units: 3, level: 300, semester: 2 },
    { code: "PHM303", title: "Pharmacology and Toxicology", units: 3, level: 300, semester: 1 },
    { code: "PHM304", title: "Clinical Pharmacy I", units: 3, level: 300, semester: 2 },
    { code: "PHM305", title: "Pharmaceutical Analysis", units: 3, level: 300, semester: 1 },
    
    // 400 Level
    { code: "PHM401", title: "Clinical Pharmacy II", units: 3, level: 400, semester: 1 },
    { code: "PHM402", title: "Pharmacy Practice", units: 3, level: 400, semester: 2 },
    { code: "PHM403", title: "Pharmaceutical Law and Ethics", units: 3, level: 400, semester: 1 },
    { code: "PHM404", title: "Pharmacoeconomics", units: 3, level: 400, semester: 2, isElective: true },
    
    // 500 Level
    { code: "PHM501", title: "Hospital Pharmacy", units: 3, level: 500, semester: 1 },
    { code: "PHM502", title: "Community Pharmacy", units: 3, level: 500, semester: 2 },
    { code: "PHM599", title: "Final Year Project", units: 6, level: 500, semester: 2 }
  ]
}


async function seedUniportCourses() {
  try {
    await connectDB()

    console.log('\n📚 University of Port Harcourt Courses Seeding\n')
    console.log('=' .repeat(60))

    let totalCreated = 0
    let totalSkipped = 0

    for (const [deptName, courses] of Object.entries(coursesByDepartment)) {
      console.log(`\n🏛️  Processing: ${deptName}`)
      
      // Find department by name
      const department = await Department.findOne({ name: deptName })
      
      if (!department) {
        console.log(`⚠️  Department not found: ${deptName} (skipping ${courses.length} courses)`)
        totalSkipped += courses.length
        continue
      }

      let deptCreated = 0
      let deptSkipped = 0

      for (const course of courses) {
        // Check if course already exists by code
        const existing = await Course.findOne({ code: course.code })
        
        if (existing) {
          console.log(`   ⏭️  Exists: ${course.code} - ${course.title}`)
          deptSkipped++
        } else {
          await Course.create({
            code: course.code,
            title: course.title,
            creditUnits: course.units,
            level: course.level,
            semester: course.semester,
            departmentId: department._id.toString(),
            description: `${course.title} course`,
            isElective: course.isElective || false
          })
          console.log(`   ✅ Created: ${course.code} - ${course.title}`)
          deptCreated++
        }
      }

      console.log(`   📊 ${deptName}: ${deptCreated} created, ${deptSkipped} existed`)
      totalCreated += deptCreated
      totalSkipped += deptSkipped
    }


    // Final Summary
    console.log('\n' + '='.repeat(60))
    console.log('\n✨ UNIPORT COURSES SEEDING COMPLETE!\n')
    console.log('📊 Final Summary:')
    console.log(`   ✅ Courses Created: ${totalCreated}`)
    console.log(`   ⏭️  Courses Existed: ${totalSkipped}`)
    console.log(`   📚 Total Processed: ${totalCreated + totalSkipped}`)
    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('\n❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB\n')
    process.exit(0)
  }
}

seedUniportCourses()
