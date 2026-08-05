import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../lib/mongodb'
import User from '../models/User'
import Admin from '../models/Admin'
import Student from '../models/Student'
import Faculty from '../models/Faculty'
import Department from '../models/Department'
import Programme from '../models/Programme'
import Course from '../models/Course'
import AcademicSession from '../models/AcademicSession'
import Result from '../models/Result'

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n')

    // Connect to database
    await connectDB()

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Department.deleteMany({}),
      Programme.deleteMany({}),
      Course.deleteMany({}),
      AcademicSession.deleteMany({}),
      Result.deleteMany({})
    ])
    console.log('✅ Data cleared\n')

    // Create Academic Sessions
    console.log('📅 Creating academic sessions...')
    const session2023 = await AcademicSession.create({
      name: '2023/2024',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-08-31'),
      isCurrent: true
    })
    const session2022 = await AcademicSession.create({
      name: '2022/2023',
      startDate: new Date('2022-09-01'),
      endDate: new Date('2023-08-31'),
      isCurrent: false
    })
    console.log('✅ Academic sessions created\n')

    // Create Faculties
    console.log('🏛️  Creating faculties...')
    const scienceFaculty = await Faculty.create({
      name: 'Faculty of Science',
      code: 'SCI',
      description: 'Natural and applied sciences'
    })
    const engineeringFaculty = await Faculty.create({
      name: 'Faculty of Engineering',
      code: 'ENG',
      description: 'Engineering and technology'
    })
    console.log('✅ Faculties created\n')

    // Create Departments
    console.log('🏢 Creating departments...')
    const csDept = await Department.create({
      name: 'Computer Science',
      code: 'CSC',
      facultyId: scienceFaculty._id.toString(),
      description: 'Computing and information technology'
    })
    const mathDept = await Department.create({
      name: 'Mathematics',
      code: 'MTH',
      facultyId: scienceFaculty._id.toString(),
      description: 'Pure and applied mathematics'
    })
    const eeDept = await Department.create({
      name: 'Electrical Engineering',
      code: 'EEE',
      facultyId: engineeringFaculty._id.toString(),
      description: 'Electrical and electronics engineering'
    })
    console.log('✅ Departments created\n')

    // Create Programmes
    console.log('🎓 Creating programmes...')
    const csProgramme = await Programme.create({
      name: 'B.Sc Computer Science',
      code: 'BSC-CS',
      departmentId: csDept._id.toString(),
      duration: 4,
      totalCredits: 120,
      description: '4-year computer science degree'
    })
    const mathProgramme = await Programme.create({
      name: 'B.Sc Mathematics',
      code: 'BSC-MTH',
      departmentId: mathDept._id.toString(),
      duration: 4,
      totalCredits: 120,
      description: '4-year mathematics degree'
    })
    const eeProgramme = await Programme.create({
      name: 'B.Eng Electrical Engineering',
      code: 'BENG-EEE',
      departmentId: eeDept._id.toString(),
      duration: 5,
      totalCredits: 150,
      description: '5-year electrical engineering degree'
    })
    console.log('✅ Programmes created\n')

    // Create Courses
    console.log('📚 Creating courses...')
    const courses = await Course.insertMany([
      // 100 Level CS Courses
      { code: 'CSC101', title: 'Introduction to Computer Science', creditUnits: 3, level: 100, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC102', title: 'Computer Programming I', creditUnits: 4, level: 100, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      { code: 'MTH101', title: 'General Mathematics I', creditUnits: 3, level: 100, semester: 1, departmentId: mathDept._id.toString(), isElective: false },
      { code: 'PHY101', title: 'General Physics I', creditUnits: 3, level: 100, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      
      { code: 'CSC103', title: 'Computer Programming II', creditUnits: 4, level: 100, semester: 2, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC104', title: 'Discrete Mathematics', creditUnits: 3, level: 100, semester: 2, departmentId: csDept._id.toString(), isElective: false },
      { code: 'MTH102', title: 'General Mathematics II', creditUnits: 3, level: 100, semester: 2, departmentId: mathDept._id.toString(), isElective: false },
      
      // 200 Level CS Courses
      { code: 'CSC201', title: 'Data Structures', creditUnits: 4, level: 200, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC202', title: 'Algorithms', creditUnits: 3, level: 200, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC203', title: 'Computer Architecture', creditUnits: 3, level: 200, semester: 1, departmentId: csDept._id.toString(), isElective: false },
      
      { code: 'CSC204', title: 'Database Systems', creditUnits: 4, level: 200, semester: 2, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC205', title: 'Operating Systems', creditUnits: 3, level: 200, semester: 2, departmentId: csDept._id.toString(), isElective: false },
      { code: 'CSC206', title: 'Web Development', creditUnits: 3, level: 200, semester: 2, departmentId: csDept._id.toString(), isElective: true }
    ])
    console.log('✅ Courses created\n')

    // Create Super Admin User
    console.log('👨‍💼 Creating super admin...')
    const hashedAdminPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await User.create({
      email: 'admin@university.edu',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    })
    await Admin.create({
      userId: adminUser._id.toString(),
      isSuperAdmin: true
    })
    console.log('✅ Super admin created')
    console.log('   Email: admin@university.edu')
    console.log('   Password: admin123\n')

    // Create Demo Student User
    console.log('👨‍🎓 Creating demo student...')
    const hashedStudentPassword = await bcrypt.hash('student123', 10)
    const studentUser = await User.create({
      email: 'student@university.edu',
      password: hashedStudentPassword,
      name: 'Demo Student',
      role: 'STUDENT'
    })

    const demoStudent = await Student.create({
      userId: studentUser._id.toString(),
      matricNumber: 'CSC/2020/001',
      facultyId: scienceFaculty._id.toString(),
      departmentId: csDept._id.toString(),
      programmeId: csProgramme._id.toString(),
      level: 200,
      currentSession: '2023/2024',
      currentSemester: 1,
      admissionYear: 2020,
      targetCGPA: 4.5,
      creditsEarned: 30
    })
    console.log('✅ Demo student created')
    console.log('   Email: student@university.edu')
    console.log('   Password: student123')
    console.log('   Matric: CSC/2020/001\n')

    // Create Sample Results for Demo Student
    console.log('📊 Creating sample results...')
    const csCoursesLevel100 = courses.filter(c => c.level === 100)
    
    for (const course of csCoursesLevel100) {
      const score = Math.floor(Math.random() * 30) + 60 // 60-90
      const { grade, gradePoint } = getGradeFromScore(score)
      
      await Result.create({
        studentId: demoStudent._id.toString(),
        courseId: course._id.toString(),
        sessionId: session2022._id.toString(),
        semester: course.semester,
        level: 100,
        score,
        grade,
        gradePoint,
        creditUnits: course.creditUnits,
        qualityPoints: gradePoint * course.creditUnits
      })
    }
    console.log('✅ Sample results created\n')

    console.log('🎉 Database seeding completed successfully!\n')
    console.log('📝 Summary:')
    console.log(`   Faculties: ${await Faculty.countDocuments()}`)
    console.log(`   Departments: ${await Department.countDocuments()}`)
    console.log(`   Programmes: ${await Programme.countDocuments()}`)
    console.log(`   Courses: ${await Course.countDocuments()}`)
    console.log(`   Users: ${await User.countDocuments()}`)
    console.log(`   Students: ${await Student.countDocuments()}`)
    console.log(`   Admins: ${await Admin.countDocuments()}`)
    console.log(`   Results: ${await Result.countDocuments()}`)
    console.log(`   Sessions: ${await AcademicSession.countDocuments()}\n`)

    console.log('🚀 You can now:')
    console.log('   1. Run: npm run dev')
    console.log('   2. Visit: http://localhost:3000')
    console.log('   3. Sign in with the credentials above\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

function getGradeFromScore(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F', gradePoint: number } {
  if (score >= 70) return { grade: 'A', gradePoint: 5.0 }
  if (score >= 60) return { grade: 'B', gradePoint: 4.0 }
  if (score >= 50) return { grade: 'C', gradePoint: 3.0 }
  if (score >= 45) return { grade: 'D', gradePoint: 2.0 }
  if (score >= 40) return { grade: 'E', gradePoint: 1.0 }
  return { grade: 'F', gradePoint: 0.0 }
}

// Run seed
seed()
