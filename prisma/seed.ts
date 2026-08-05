import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      admin: {
        create: {
          isSuperAdmin: true
        }
      }
    }
  })
  console.log('✅ Admin user created')

  // Create Sample Student User
  const studentPassword = await bcrypt.hash('student123', 10)
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@university.edu' },
    update: {},
    create: {
      email: 'student@university.edu',
      password: studentPassword,
      name: 'John Doe',
      role: 'STUDENT'
    }
  })
  console.log('✅ Sample student user created')

  // Create Faculties
  const scienceFaculty = await prisma.faculty.upsert({
    where: { code: 'SCI' },
    update: {},
    create: {
      name: 'Faculty of Science',
      code: 'SCI',
      description: 'Natural and Applied Sciences'
    }
  })

  const artsFaculty = await prisma.faculty.upsert({
    where: { code: 'ARTS' },
    update: {},
    create: {
      name: 'Faculty of Arts',
      code: 'ARTS',
      description: 'Arts and Humanities'
    }
  })

  const engineeringFaculty = await prisma.faculty.upsert({
    where: { code: 'ENG' },
    update: {},
    create: {
      name: 'Faculty of Engineering',
      code: 'ENG',
      description: 'Engineering and Technology'
    }
  })

  console.log('✅ Faculties created')

  // Create Departments
  const csDept = await prisma.department.upsert({
    where: { code: 'CSC' },
    update: {},
    create: {
      name: 'Computer Science',
      code: 'CSC',
      description: 'Department of Computer Science',
      facultyId: scienceFaculty.id
    }
  })

  const mathDept = await prisma.department.upsert({
    where: { code: 'MTH' },
    update: {},
    create: {
      name: 'Mathematics',
      code: 'MTH',
      description: 'Department of Mathematics',
      facultyId: scienceFaculty.id
    }
  })

  const englishDept = await prisma.department.upsert({
    where: { code: 'ENG' },
    update: {},
    create: {
      name: 'English Language',
      code: 'ENG',
      description: 'Department of English',
      facultyId: artsFaculty.id
    }
  })

  console.log('✅ Departments created')

  // Create Programmes
  const csProgramme = await prisma.programme.upsert({
    where: { code: 'BSCCS' },
    update: {},
    create: {
      name: 'B.Sc. Computer Science',
      code: 'BSCCS',
      description: 'Bachelor of Science in Computer Science',
      duration: 4,
      totalCredits: 120,
      departmentId: csDept.id
    }
  })

  const mathProgramme = await prisma.programme.upsert({
    where: { code: 'BSCMTH' },
    update: {},
    create: {
      name: 'B.Sc. Mathematics',
      code: 'BSCMTH',
      description: 'Bachelor of Science in Mathematics',
      duration: 4,
      totalCredits: 120,
      departmentId: mathDept.id
    }
  })

  console.log('✅ Programmes created')

  // Create Academic Session
  const session = await prisma.academicSession.upsert({
    where: { name: '2023/2024' },
    update: {},
    create: {
      name: '2023/2024',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-07-31'),
      isCurrent: true
    }
  })

  console.log('✅ Academic session created')

  // Create Sample Courses for Computer Science
  const courses = [
    // 100 Level
    { code: 'CSC101', title: 'Introduction to Computing', level: 100, semester: 1, credits: 3 },
    { code: 'CSC102', title: 'Computer Programming I', level: 100, semester: 1, credits: 3 },
    { code: 'MTH101', title: 'Elementary Mathematics I', level: 100, semester: 1, credits: 3 },
    { code: 'PHY101', title: 'General Physics I', level: 100, semester: 1, credits: 3 },
    { code: 'CSC103', title: 'Computer Programming II', level: 100, semester: 2, credits: 3 },
    { code: 'MTH102', title: 'Elementary Mathematics II', level: 100, semester: 2, credits: 3 },
    
    // 200 Level
    { code: 'CSC201', title: 'Data Structures', level: 200, semester: 1, credits: 3 },
    { code: 'CSC202', title: 'Computer Architecture', level: 200, semester: 1, credits: 3 },
    { code: 'CSC203', title: 'Discrete Mathematics', level: 200, semester: 1, credits: 3 },
    { code: 'CSC204', title: 'Algorithms and Complexity', level: 200, semester: 2, credits: 3 },
    { code: 'CSC205', title: 'Operating Systems', level: 200, semester: 2, credits: 3 },
  ]

  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: {
        code: course.code,
        title: course.title,
        creditUnits: course.credits,
        level: course.level,
        semester: course.semester,
        departmentId: csDept.id,
        isElective: false
      }
    })
  }

  console.log('✅ Sample courses created')

  // Create Grade System
  const grades = [
    { grade: 'A', minScore: 70, maxScore: 100, gradePoint: 5.0, description: 'Excellent' },
    { grade: 'B', minScore: 60, maxScore: 69, gradePoint: 4.0, description: 'Very Good' },
    { grade: 'C', minScore: 50, maxScore: 59, gradePoint: 3.0, description: 'Good' },
    { grade: 'D', minScore: 45, maxScore: 49, gradePoint: 2.0, description: 'Fair' },
    { grade: 'E', minScore: 40, maxScore: 44, gradePoint: 1.0, description: 'Pass' },
    { grade: 'F', minScore: 0, maxScore: 39, gradePoint: 0.0, description: 'Fail' }
  ]

  for (const g of grades) {
    await prisma.gradeSystem.upsert({
      where: { 
        grade_minScore_maxScore: {
          grade: g.grade as any,
          minScore: g.minScore,
          maxScore: g.maxScore
        }
      },
      update: {},
      create: {
        grade: g.grade as any,
        minScore: g.minScore,
        maxScore: g.maxScore,
        gradePoint: g.gradePoint,
        description: g.description
      }
    })
  }

  console.log('✅ Grade system created')

  // Create Sample Student Profile
  const sampleStudent = await prisma.student.upsert({
    where: { matricNumber: 'CS/20/001' },
    update: {},
    create: {
      userId: studentUser.id,
      matricNumber: 'CS/20/001',
      facultyId: scienceFaculty.id,
      departmentId: csDept.id,
      programmeId: csProgramme.id,
      level: 200,
      currentSession: '2023/2024',
      currentSemester: 1,
      admissionYear: 2020,
      targetCGPA: 4.5,
      creditsEarned: 24
    }
  })

  console.log('✅ Sample student profile created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Login Credentials:')
  console.log('Admin: admin@university.edu / admin123')
  console.log('Student: student@university.edu / student123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
