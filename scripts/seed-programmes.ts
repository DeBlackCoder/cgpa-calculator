/**
 * Seed Script: Populate University Programmes
 * 
 * This script automatically creates common university programmes
 * across various faculties and departments.
 * 
 * Run with: npx tsx scripts/seed-programmes.ts
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Import models
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL
    if (!mongoUri) {
      throw new Error('MongoDB connection string not found in environment variables')
    }
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const FacultySchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String
})

const DepartmentSchema = new mongoose.Schema({
  name: String,
  code: String,
  facultyId: String,
  description: String
})

const ProgrammeSchema = new mongoose.Schema({
  name: String,
  code: String,
  departmentId: String,
  duration: Number,
  totalCredits: Number,
  description: String
})

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema)
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)
const Programme = mongoose.models.Programme || mongoose.model('Programme', ProgrammeSchema)

async function seedProgrammes() {
  try {
    await connectDB()

    // Get all faculties and departments
    const faculties = await Faculty.find().lean()
    const departments = await Department.find().lean()

    if (faculties.length === 0 || departments.length === 0) {
      console.log('⚠️  No faculties or departments found. Please run seed-data.ts first.')
      process.exit(0)
    }

    console.log(`📚 Found ${faculties.length} faculties and ${departments.length} departments`)

    // Helper function to find department by name
    const findDept = (name: string) => departments.find(d => d.name.toLowerCase().includes(name.toLowerCase()))

    // Define comprehensive list of programmes
    const programmes = [
      // COMPUTING & TECHNOLOGY PROGRAMMES
      {
        name: "Computer Science",
        code: "B.SC-CS",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Study of computation, algorithms, and information processing"
      },
      {
        name: "Software Engineering",
        code: "B.ENG-SE",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Design, development, and maintenance of software systems"
      },
      {
        name: "Information Technology",
        code: "B.SC-IT",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Application of technology in business and organizations"
      },
      {
        name: "Cyber Security",
        code: "B.SC-CYB",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Protection of computer systems and networks from threats"
      },
      {
        name: "Data Science",
        code: "B.SC-DS",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Analysis and interpretation of complex data"
      },
      {
        name: "Artificial Intelligence",
        code: "B.SC-AI",
        deptName: "computer science",
        duration: 4,
        totalCredits: 120,
        description: "Machine learning, neural networks, and intelligent systems"
      },

      // ENGINEERING PROGRAMMES
      {
        name: "Electrical Engineering",
        code: "B.ENG-EE",
        deptName: "electrical",
        duration: 5,
        totalCredits: 150,
        description: "Study of electrical systems, power generation, and electronics"
      },
      {
        name: "Mechanical Engineering",
        code: "B.ENG-ME",
        deptName: "mechanical",
        duration: 5,
        totalCredits: 150,
        description: "Design and manufacturing of mechanical systems"
      },
      {
        name: "Civil Engineering",
        code: "B.ENG-CE",
        deptName: "civil",
        duration: 5,
        totalCredits: 150,
        description: "Infrastructure, construction, and structural engineering"
      },
      {
        name: "Chemical Engineering",
        code: "B.ENG-CHE",
        deptName: "chemical",
        duration: 5,
        totalCredits: 150,
        description: "Industrial chemical processes and materials"
      },
      {
        name: "Petroleum Engineering",
        code: "B.ENG-PE",
        deptName: "petroleum",
        duration: 5,
        totalCredits: 150,
        description: "Exploration and production of oil and gas"
      },
      {
        name: "Mechatronics Engineering",
        code: "B.ENG-MTE",
        deptName: "mechanical",
        duration: 5,
        totalCredits: 150,
        description: "Integration of mechanics, electronics, and computing"
      },

      // SCIENCE PROGRAMMES
      {
        name: "Mathematics",
        code: "B.SC-MATH",
        deptName: "mathematics",
        duration: 4,
        totalCredits: 120,
        description: "Pure and applied mathematics"
      },
      {
        name: "Physics",
        code: "B.SC-PHY",
        deptName: "physics",
        duration: 4,
        totalCredits: 120,
        description: "Study of matter, energy, and their interactions"
      },
      {
        name: "Chemistry",
        code: "B.SC-CHEM",
        deptName: "chemistry",
        duration: 4,
        totalCredits: 120,
        description: "Study of matter and chemical reactions"
      },
      {
        name: "Biology",
        code: "B.SC-BIO",
        deptName: "biology",
        duration: 4,
        totalCredits: 120,
        description: "Study of living organisms"
      },
      {
        name: "Biochemistry",
        code: "B.SC-BCH",
        deptName: "biochemistry",
        duration: 4,
        totalCredits: 120,
        description: "Chemical processes within living organisms"
      },
      {
        name: "Microbiology",
        code: "B.SC-MIC",
        deptName: "microbiology",
        duration: 4,
        totalCredits: 120,
        description: "Study of microorganisms"
      },
      {
        name: "Geology",
        code: "B.SC-GEO",
        deptName: "geology",
        duration: 4,
        totalCredits: 120,
        description: "Study of Earth's structure and processes"
      },
      {
        name: "Statistics",
        code: "B.SC-STAT",
        deptName: "statistics",
        duration: 4,
        totalCredits: 120,
        description: "Collection, analysis, and interpretation of data"
      },

      // MEDICAL & HEALTH SCIENCES
      {
        name: "Medicine and Surgery",
        code: "MBBS",
        deptName: "medicine",
        duration: 6,
        totalCredits: 180,
        description: "Medical practice and patient care"
      },
      {
        name: "Nursing Science",
        code: "B.NSC",
        deptName: "nursing",
        duration: 5,
        totalCredits: 150,
        description: "Healthcare and patient nursing"
      },
      {
        name: "Pharmacy",
        code: "B.PHARM",
        deptName: "pharmacy",
        duration: 5,
        totalCredits: 150,
        description: "Pharmaceutical sciences and drug preparation"
      },
      {
        name: "Medical Laboratory Science",
        code: "B.MLS",
        deptName: "medical lab",
        duration: 4,
        totalCredits: 120,
        description: "Clinical laboratory testing and diagnosis"
      },
      {
        name: "Physiotherapy",
        code: "B.PT",
        deptName: "physiotherapy",
        duration: 5,
        totalCredits: 150,
        description: "Physical rehabilitation and therapy"
      },
      {
        name: "Dentistry",
        code: "BDS",
        deptName: "dentistry",
        duration: 6,
        totalCredits: 180,
        description: "Oral health and dental care"
      },

      // BUSINESS & MANAGEMENT
      {
        name: "Business Administration",
        code: "B.SC-BA",
        deptName: "business",
        duration: 4,
        totalCredits: 120,
        description: "General management and business operations"
      },
      {
        name: "Accounting",
        code: "B.SC-ACC",
        deptName: "accounting",
        duration: 4,
        totalCredits: 120,
        description: "Financial accounting and auditing"
      },
      {
        name: "Economics",
        code: "B.SC-ECON",
        deptName: "economics",
        duration: 4,
        totalCredits: 120,
        description: "Economic theory and policy"
      },
      {
        name: "Banking and Finance",
        code: "B.SC-BF",
        deptName: "banking",
        duration: 4,
        totalCredits: 120,
        description: "Financial services and banking operations"
      },
      {
        name: "Marketing",
        code: "B.SC-MKT",
        deptName: "marketing",
        duration: 4,
        totalCredits: 120,
        description: "Marketing strategy and consumer behavior"
      },
      {
        name: "Human Resource Management",
        code: "B.SC-HRM",
        deptName: "human resource",
        duration: 4,
        totalCredits: 120,
        description: "Personnel management and organizational behavior"
      },

      // SOCIAL SCIENCES & HUMANITIES
      {
        name: "Law",
        code: "LLB",
        deptName: "law",
        duration: 5,
        totalCredits: 150,
        description: "Legal studies and jurisprudence"
      },
      {
        name: "Psychology",
        code: "B.SC-PSY",
        deptName: "psychology",
        duration: 4,
        totalCredits: 120,
        description: "Study of human behavior and mental processes"
      },
      {
        name: "Sociology",
        code: "B.SC-SOC",
        deptName: "sociology",
        duration: 4,
        totalCredits: 120,
        description: "Study of society and social behavior"
      },
      {
        name: "Mass Communication",
        code: "B.SC-MC",
        deptName: "mass communication",
        duration: 4,
        totalCredits: 120,
        description: "Journalism, broadcasting, and media studies"
      },
      {
        name: "Political Science",
        code: "B.SC-POL",
        deptName: "political",
        duration: 4,
        totalCredits: 120,
        description: "Government, politics, and public policy"
      },
      {
        name: "International Relations",
        code: "B.SC-IR",
        deptName: "international",
        duration: 4,
        totalCredits: 120,
        description: "Global affairs and diplomacy"
      },

      // ARTS & LANGUAGES
      {
        name: "English Language",
        code: "B.A-ENG",
        deptName: "english",
        duration: 4,
        totalCredits: 120,
        description: "English literature and linguistics"
      },
      {
        name: "French",
        code: "B.A-FRE",
        deptName: "french",
        duration: 4,
        totalCredits: 120,
        description: "French language and literature"
      },
      {
        name: "History",
        code: "B.A-HIS",
        deptName: "history",
        duration: 4,
        totalCredits: 120,
        description: "Historical studies and research"
      },
      {
        name: "Philosophy",
        code: "B.A-PHI",
        deptName: "philosophy",
        duration: 4,
        totalCredits: 120,
        description: "Philosophical thought and logic"
      },
      {
        name: "Music",
        code: "B.A-MUS",
        deptName: "music",
        duration: 4,
        totalCredits: 120,
        description: "Musical theory and performance"
      },

      // EDUCATION
      {
        name: "Education & Biology",
        code: "B.ED-BIO",
        deptName: "education",
        duration: 4,
        totalCredits: 120,
        description: "Teacher education with biology specialization"
      },
      {
        name: "Education & Mathematics",
        code: "B.ED-MATH",
        deptName: "education",
        duration: 4,
        totalCredits: 120,
        description: "Teacher education with mathematics specialization"
      },
      {
        name: "Education & English",
        code: "B.ED-ENG",
        deptName: "education",
        duration: 4,
        totalCredits: 120,
        description: "Teacher education with English specialization"
      },

      // AGRICULTURE
      {
        name: "Agriculture",
        code: "B.AGRIC",
        deptName: "agriculture",
        duration: 4,
        totalCredits: 120,
        description: "Crop production and agricultural science"
      },
      {
        name: "Agricultural Economics",
        code: "B.SC-AGECON",
        deptName: "agricultural economics",
        duration: 4,
        totalCredits: 120,
        description: "Economics of agricultural production"
      },
      {
        name: "Animal Science",
        code: "B.SC-ANS",
        deptName: "animal science",
        duration: 4,
        totalCredits: 120,
        description: "Livestock production and management"
      },
      {
        name: "Veterinary Medicine",
        code: "DVM",
        deptName: "veterinary",
        duration: 6,
        totalCredits: 180,
        description: "Animal health and veterinary care"
      },

      // ENVIRONMENTAL SCIENCES
      {
        name: "Environmental Science",
        code: "B.SC-ENV",
        deptName: "environmental",
        duration: 4,
        totalCredits: 120,
        description: "Environmental conservation and management"
      },
      {
        name: "Fisheries and Aquaculture",
        code: "B.SC-FISH",
        deptName: "fisheries",
        duration: 4,
        totalCredits: 120,
        description: "Aquatic resources management"
      },
      {
        name: "Forestry",
        code: "B.SC-FOR",
        deptName: "forestry",
        duration: 4,
        totalCredits: 120,
        description: "Forest resources and wildlife management"
      },

      // ARCHITECTURE & PLANNING
      {
        name: "Architecture",
        code: "B.ARCH",
        deptName: "architecture",
        duration: 5,
        totalCredits: 150,
        description: "Building design and architectural planning"
      },
      {
        name: "Urban and Regional Planning",
        code: "B.URP",
        deptName: "urban planning",
        duration: 5,
        totalCredits: 150,
        description: "City planning and urban development"
      },
      {
        name: "Estate Management",
        code: "B.SC-EM",
        deptName: "estate",
        duration: 4,
        totalCredits: 120,
        description: "Property and real estate management"
      },
    ]

    console.log(`\n🌱 Creating ${programmes.length} programmes...`)

    let created = 0
    let skipped = 0
    let failed = 0

    for (const prog of programmes) {
      try {
        // Find matching department
        const dept = findDept(prog.deptName)
        
        if (!dept) {
          console.log(`⚠️  Skipped: ${prog.name} (Department "${prog.deptName}" not found)`)
          skipped++
          continue
        }

        // Check if programme already exists
        const existing = await Programme.findOne({ code: prog.code })
        if (existing) {
          console.log(`⏭️  Exists: ${prog.name} (${prog.code})`)
          skipped++
          continue
        }

        // Create programme
        await Programme.create({
          name: prog.name,
          code: prog.code,
          departmentId: dept._id.toString(),
          duration: prog.duration,
          totalCredits: prog.totalCredits,
          description: prog.description
        })

        console.log(`✅ Created: ${prog.name} (${prog.code}) under ${dept.name}`)
        created++
      } catch (error: any) {
        console.log(`❌ Failed: ${prog.name} - ${error.message}`)
        failed++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Created: ${created}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📚 Total: ${created + skipped + failed}`)

    console.log(`\n✨ Programme seeding completed!`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run the seed function
seedProgrammes()
