import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from '../models/Course'
import Department from '../models/Department'

dotenv.config()

const csCourses = [
  // 100 Level - First Semester
  { code: 'CSC101', title: 'Introduction to Computer Science', creditUnits: 3, level: 100, semester: 1 },
  { code: 'CSC103', title: 'Introduction to Programming (Pascal)', creditUnits: 3, level: 100, semester: 1 },
  { code: 'CSC105', title: 'Mathematics for Computer Science I', creditUnits: 3, level: 100, semester: 1 },
  { code: 'MTH101', title: 'Elementary Mathematics I (Algebra & Trigonometry)', creditUnits: 3, level: 100, semester: 1 },
  { code: 'MTH103', title: 'Elementary Mathematics III (Vectors, Geometry & Dynamics)', creditUnits: 3, level: 100, semester: 1 },
  { code: 'PHY101', title: 'General Physics I (Mechanics)', creditUnits: 3, level: 100, semester: 1 },
  { code: 'PHY107', title: 'General Practical Physics I', creditUnits: 1, level: 100, semester: 1 },
  { code: 'GST101', title: 'Use of English and Communication Skills I', creditUnits: 2, level: 100, semester: 1 },

  // 100 Level - Second Semester
  { code: 'CSC102', title: 'Problem Solving', creditUnits: 2, level: 100, semester: 2 },
  { code: 'CSC104', title: 'Introduction to Data Processing', creditUnits: 2, level: 100, semester: 2 },
  { code: 'CSC106', title: 'Mathematics for Computer Science II', creditUnits: 3, level: 100, semester: 2 },
  { code: 'MTH102', title: 'Elementary Mathematics II (Calculus)', creditUnits: 3, level: 100, semester: 2 },
  { code: 'MTH104', title: 'Elementary Mathematics IV (Probability)', creditUnits: 2, level: 100, semester: 2 },
  { code: 'PHY102', title: 'General Physics II (Electricity, Magnetism & Modern Physics)', creditUnits: 3, level: 100, semester: 2 },
  { code: 'PHY108', title: 'General Practical Physics II', creditUnits: 1, level: 100, semester: 2 },
  { code: 'GST102', title: 'Use of English and Communication Skills II', creditUnits: 2, level: 100, semester: 2 },
  { code: 'GST104', title: 'African and Nigerian Peoples & Culture', creditUnits: 2, level: 100, semester: 2 },

  // 200 Level - First Semester
  { code: 'CSC201', title: 'Computer Programming I (Fortran)', creditUnits: 3, level: 200, semester: 1 },
  { code: 'CSC203', title: 'Discrete Structures', creditUnits: 3, level: 200, semester: 1 },
  { code: 'CSC205', title: 'Computer Architecture & Organization I', creditUnits: 3, level: 200, semester: 1 },
  { code: 'CSC207', title: 'File Processing', creditUnits: 3, level: 200, semester: 1 },
  { code: 'MTH201', title: 'Mathematical Methods I', creditUnits: 3, level: 200, semester: 1 },
  { code: 'MTH203', title: 'Linear Algebra I', creditUnits: 3, level: 200, semester: 1 },
  { code: 'MTH205', title: 'Real Analysis I', creditUnits: 3, level: 200, semester: 1 },
  { code: 'STA201', title: 'Probability I', creditUnits: 3, level: 200, semester: 1 },

  // 200 Level - Second Semester
  { code: 'CSC202', title: 'Computer Programming II (C/C++)', creditUnits: 3, level: 200, semester: 2 },
  { code: 'CSC204', title: 'Introduction to Data Structures', creditUnits: 3, level: 200, semester: 2 },
  { code: 'CSC206', title: 'Computer Architecture & Organization II', creditUnits: 3, level: 200, semester: 2 },
  { code: 'CSC208', title: 'Fundamentals of Numerical Analysis', creditUnits: 3, level: 200, semester: 2 },
  { code: 'MTH202', title: 'Elementary Differential Equations I', creditUnits: 3, level: 200, semester: 2 },
  { code: 'MTH204', title: 'Linear Algebra II', creditUnits: 3, level: 200, semester: 2 },
  { code: 'MTH206', title: 'Real Analysis II', creditUnits: 3, level: 200, semester: 2 },
  { code: 'STA202', title: 'Probability II', creditUnits: 3, level: 200, semester: 2 },

  // 300 Level - First Semester
  { code: 'CSC301', title: 'Analysis of Algorithms', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC303', title: 'Operating Systems I', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC305', title: 'Database Management Systems I', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC307', title: 'Principles of Programming Languages', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC309', title: 'System Programming', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC311', title: 'Computer Graphics & Visualization', creditUnits: 3, level: 300, semester: 1 },
  { code: 'CSC313', title: 'Formal Methods & Software Development', creditUnits: 3, level: 300, semester: 1 },

  // 300 Level - Second Semester
  { code: 'CSC302', title: 'Data Structures & Algorithms', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC304', title: 'Operating Systems II', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC306', title: 'Database Management Systems II', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC308', title: 'Automata Theory & Formal Languages', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC310', title: 'Software Engineering', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC312', title: 'Compiler Construction', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC316', title: 'Microprocessor Systems', creditUnits: 3, level: 300, semester: 2 },
  { code: 'CSC399', title: 'Industrial Training (SIWES)', creditUnits: 6, level: 300, semester: 2 },

  // 400 Level - First Semester
  { code: 'CSC401', title: 'Artificial Intelligence', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC403', title: 'Computer Networks & Communication I', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC405', title: 'Computer Security & Cryptography', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC407', title: 'Distributed Systems', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC409', title: 'Principles of Machine Learning', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC411', title: 'Human-Computer Interaction', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC413', title: 'Web Programming', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC415', title: 'Mobile Application Development', creditUnits: 3, level: 400, semester: 1 },

  // 400 Level - Second Semester
  { code: 'CSC402', title: 'Computer Networks & Communication II', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC404', title: 'Information Retrieval', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC406', title: 'Cloud Computing', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC408', title: 'Data Science & Big Data Analytics', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC410', title: 'Internet of Things (IoT)', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC412', title: 'Bioinformatics', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC414', title: 'Natural Language Processing', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC416', title: 'Advanced Database Systems', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC499', title: 'Final Year Project', creditUnits: 6, level: 400, semester: 2 },

  // Electives
  { code: 'CSC417', title: 'Game Development', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC418', title: 'Robotics & Automation', creditUnits: 3, level: 400, semester: 1 },
  { code: 'CSC419', title: 'Computer Vision', creditUnits: 3, level: 400, semester: 2 },
  { code: 'CSC420', title: 'Blockchain Technology', creditUnits: 3, level: 400, semester: 2 },
]

async function seedCSCourses() {
  try {
    console.log('[*] Connecting to MongoDB...')
    await mongoose.connect(process.env.DATABASE_URL!)
    console.log('[+] Connected to MongoDB')

    // Find Computer Science department
    const csDept = await Department.findOne({ code: { $in: ['CSC', 'CS'] } })
    
    if (!csDept) {
      console.log('[!] Computer Science department not found')
      console.log('Please ensure the department exists before seeding courses')
      process.exit(1)
    }

    console.log(`[+] Found Computer Science department: ${csDept.name}`)
    console.log(`[*] Seeding ${csCourses.length} Computer Science courses...`)

    let created = 0
    let skipped = 0

    for (const courseData of csCourses) {
      // Check if course already exists
      const existing = await Course.findOne({ code: courseData.code })
      
      if (existing) {
        console.log(`[-] Skipped: ${courseData.code} - ${courseData.title} (already exists)`)
        skipped++
        continue
      }

      // Create course
      await Course.create({
        ...courseData,
        departmentId: csDept._id.toString(),
        description: `${courseData.title} - Level ${courseData.level}, Semester ${courseData.semester}`,
        isElective: courseData.code.includes('417') || 
                    courseData.code.includes('418') || 
                    courseData.code.includes('419') || 
                    courseData.code.includes('420')
      })

      console.log(`[+] Created: ${courseData.code} - ${courseData.title}`)
      created++
    }

    console.log('\n[=] Seeding Summary:')
    console.log(`[+] Created: ${created} courses`)
    console.log(`[-] Skipped: ${skipped} courses (already existed)`)
    console.log(`[#] Total: ${csCourses.length} courses`)

    // Course count by level
    console.log('\n[=] Course Distribution:')
    console.log(`   100 Level: ${csCourses.filter(c => c.level === 100).length} courses`)
    console.log(`   200 Level: ${csCourses.filter(c => c.level === 200).length} courses`)
    console.log(`   300 Level: ${csCourses.filter(c => c.level === 300).length} courses`)
    console.log(`   400 Level: ${csCourses.filter(c => c.level === 400).length} courses`)

    console.log('\n[!] CS Courses seeding completed successfully!')

  } catch (error) {
    console.error('[X] Error seeding CS courses:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('[*] Database connection closed')
  }
}

// Run the seed function
seedCSCourses()
