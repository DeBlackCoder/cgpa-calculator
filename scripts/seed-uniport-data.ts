/**
 * University of Port Harcourt (UNIPORT) Complete Data Seed
 * 
 * This script populates the database with actual UNIPORT faculties,
 * departments, and programmes.
 * 
 * Run with: npx tsx scripts/seed-uniport-data.ts
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

const FacultySchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String
}, { timestamps: true })

const DepartmentSchema = new mongoose.Schema({
  name: String,
  code: String,
  facultyId: String,
  description: String
}, { timestamps: true })

const ProgrammeSchema = new mongoose.Schema({
  name: String,
  code: String,
  departmentId: String,
  duration: Number,
  totalCredits: Number,
  description: String
}, { timestamps: true })

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema)
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)
const Programme = mongoose.models.Programme || mongoose.model('Programme', ProgrammeSchema)

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

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

// UNIPORT Official Structure
const uniportData = {
  faculties: [
    {
      name: "Faculty of Agriculture",
      code: "FAGRIC",
      description: "Training in agricultural sciences and food production"
    },
    {
      name: "Faculty of Basic Medical Sciences",
      code: "FBMS",
      description: "Foundation medical and health sciences"
    },
    {
      name: "Faculty of Clinical Sciences",
      code: "FCS",
      description: "Clinical medical practice and patient care"
    },
    {
      name: "Faculty of Education",
      code: "FEDU",
      description: "Teacher training and educational studies"
    },
    {
      name: "Faculty of Engineering",
      code: "FENG",
      description: "Engineering and technological sciences"
    },
    {
      name: "Faculty of Humanities",
      code: "FHUM",
      description: "Languages, history, and cultural studies"
    },
    {
      name: "Faculty of Law",
      code: "FLAW",
      description: "Legal studies and jurisprudence"
    },
    {
      name: "Faculty of Management Sciences",
      code: "FMS",
      description: "Business, management, and administrative sciences"
    },
    {
      name: "Faculty of Pharmaceutical Sciences",
      code: "FPHS",
      description: "Pharmaceutical and medicinal sciences"
    },
    {
      name: "Faculty of Science",
      code: "FSCI",
      description: "Pure and applied sciences"
    },
    {
      name: "Faculty of Social Sciences",
      code: "FSOC",
      description: "Social sciences and behavioral studies"
    },
    {
      name: "Faculty of Technical and Science Education",
      code: "FTSE",
      description: "Technical and vocational education"
    }
  ],

  departments: {
    "Faculty of Agriculture": [
      { name: "Agricultural Economics and Extension", code: "AEE" },
      { name: "Animal Science", code: "ANS" },
      { name: "Crop and Soil Science", code: "CSS" },
      { name: "Fisheries and Aquatic Environment", code: "FAE" },
      { name: "Food Science and Technology", code: "FST" },
      { name: "Forestry and Wildlife Management", code: "FWM" }
    ],

    "Faculty of Basic Medical Sciences": [
      { name: "Anatomy", code: "ANA" },
      { name: "Biochemistry", code: "BCH" },
      { name: "Human Physiology", code: "PHY" },
      { name: "Medical Laboratory Science", code: "MLS" },
      { name: "Pharmacology", code: "PHA" }
    ],

    "Faculty of Clinical Sciences": [
      { name: "Medicine and Surgery", code: "MED" },
      { name: "Dentistry", code: "DEN" },
      { name: "Nursing Science", code: "NUR" },
      { name: "Radiography", code: "RAD" }
    ],

    "Faculty of Education": [
      { name: "Educational Management", code: "EDM" },
      { name: "Educational Psychology, Guidance and Counselling", code: "EPG" },
      { name: "Curriculum Studies and Educational Technology", code: "CSE" },
      { name: "Science Education", code: "SED" },
      { name: "Arts and Social Science Education", code: "ASS" },
      { name: "Physical and Health Education", code: "PHE" }
    ],

    "Faculty of Engineering": [
      { name: "Agricultural and Environmental Engineering", code: "AEEN" },
      { name: "Chemical Engineering", code: "CHE" },
      { name: "Civil Engineering", code: "CVE" },
      { name: "Electrical Engineering", code: "ELE" },
      { name: "Mechanical Engineering", code: "MEE" },
      { name: "Marine Engineering", code: "MAR" },
      { name: "Petroleum and Gas Engineering", code: "PGE" }
    ],

    "Faculty of Humanities": [
      { name: "English and Literary Studies", code: "ENG" },
      { name: "History and Strategic Studies", code: "HIS" },
      { name: "Linguistics and Communication Studies", code: "LCS" },
      { name: "Modern Languages and Translation Studies", code: "MLT" },
      { name: "Music", code: "MUS" },
      { name: "Philosophy", code: "PHI" },
      { name: "Religious and Cultural Studies", code: "RCS" },
      { name: "Theatre and Film Studies", code: "TFS" }
    ],

    "Faculty of Law": [
      { name: "Public Law", code: "PBL" },
      { name: "Private and Property Law", code: "PPL" },
      { name: "Commercial and Industrial Law", code: "CIL" },
      { name: "International and Jurisprudence", code: "IJU" }
    ],

    "Faculty of Management Sciences": [
      { name: "Accounting", code: "ACC" },
      { name: "Banking and Finance", code: "BFN" },
      { name: "Business Administration", code: "BUA" },
      { name: "Hospitality Management and Tourism", code: "HMT" },
      { name: "Insurance", code: "INS" },
      { name: "Marketing", code: "MKT" }
    ],

    "Faculty of Pharmaceutical Sciences": [
      { name: "Clinical Pharmacy and Pharmacy Practice", code: "CPP" },
      { name: "Pharmaceutical and Medicinal Chemistry", code: "PMC" },
      { name: "Pharmaceutical Microbiology and Biotechnology", code: "PMB" },
      { name: "Pharmacognosy and Herbal Medicine", code: "PHM" },
      { name: "Pharmacology and Toxicology", code: "PHT" },
      { name: "Pharmaceutics and Pharmaceutical Technology", code: "PPT" }
    ],

    "Faculty of Science": [
      { name: "Animal and Environmental Biology", code: "AEB" },
      { name: "Biochemistry", code: "BCH" },
      { name: "Chemistry", code: "CHM" },
      { name: "Computer Science", code: "CSC" },
      { name: "Geology", code: "GEO" },
      { name: "Mathematics", code: "MTH" },
      { name: "Microbiology", code: "MCB" },
      { name: "Physics", code: "PHY" },
      { name: "Plant Science and Biotechnology", code: "PSB" }
    ],

    "Faculty of Social Sciences": [
      { name: "Economics", code: "ECO" },
      { name: "Geography and Environmental Management", code: "GEM" },
      { name: "Political Science", code: "POL" },
      { name: "Psychology", code: "PSY" },
      { name: "Sociology", code: "SOC" }
    ],

    "Faculty of Technical and Science Education": [
      { name: "Technology and Vocational Education", code: "TVE" },
      { name: "Computer Science Education", code: "CSE" },
      { name: "Mathematics/Science Education", code: "MSE" }
    ]
  },

  programmes: {
    // Agriculture
    "Agricultural Economics and Extension": [
      { name: "Agricultural Economics", code: "B.AGRIC-ECON", duration: 4, credits: 120 },
      { name: "Agricultural Extension and Rural Sociology", code: "B.AGRIC-EXT", duration: 4, credits: 120 }
    ],
    "Animal Science": [
      { name: "Animal Science", code: "B.AGRIC-ANS", duration: 4, credits: 120 }
    ],
    "Crop and Soil Science": [
      { name: "Crop Science", code: "B.AGRIC-CRP", duration: 4, credits: 120 },
      { name: "Soil Science", code: "B.AGRIC-SOL", duration: 4, credits: 120 }
    ],
    "Fisheries and Aquatic Environment": [
      { name: "Fisheries", code: "B.FISH", duration: 4, credits: 120 }
    ],
    "Food Science and Technology": [
      { name: "Food Science and Technology", code: "B.TECH-FST", duration: 4, credits: 120 }
    ],
    "Forestry and Wildlife Management": [
      { name: "Forestry and Wildlife Management", code: "B.AGRIC-FOR", duration: 4, credits: 120 }
    ],

    // Basic Medical Sciences
    "Anatomy": [
      { name: "Anatomy", code: "B.SC-ANA", duration: 4, credits: 120 }
    ],
    "Biochemistry": [
      { name: "Biochemistry", code: "B.SC-BCH", duration: 4, credits: 120 }
    ],
    "Human Physiology": [
      { name: "Human Physiology", code: "B.SC-PHY", duration: 4, credits: 120 }
    ],
    "Medical Laboratory Science": [
      { name: "Medical Laboratory Science", code: "B.MLS", duration: 5, credits: 150 }
    ],

    // Clinical Sciences
    "Medicine and Surgery": [
      { name: "Medicine and Surgery", code: "MBBS", duration: 6, credits: 180 }
    ],
    "Dentistry": [
      { name: "Dental Surgery", code: "BDS", duration: 6, credits: 180 }
    ],
    "Nursing Science": [
      { name: "Nursing Science", code: "B.NSC", duration: 5, credits: 150 }
    ],
    "Radiography": [
      { name: "Radiography", code: "B.RAD", duration: 5, credits: 150 }
    ],

    // Education
    "Educational Management": [
      { name: "Educational Management", code: "B.ED-EDM", duration: 4, credits: 120 }
    ],
    "Science Education": [
      { name: "Biology Education", code: "B.ED-BIO", duration: 4, credits: 120 },
      { name: "Chemistry Education", code: "B.ED-CHM", duration: 4, credits: 120 },
      { name: "Physics Education", code: "B.ED-PHY", duration: 4, credits: 120 },
      { name: "Mathematics Education", code: "B.ED-MTH", duration: 4, credits: 120 }
    ],
    "Arts and Social Science Education": [
      { name: "English Education", code: "B.ED-ENG", duration: 4, credits: 120 },
      { name: "Social Studies Education", code: "B.ED-SOS", duration: 4, credits: 120 }
    ],
    "Physical and Health Education": [
      { name: "Physical and Health Education", code: "B.ED-PHE", duration: 4, credits: 120 }
    ],

    // Engineering
    "Chemical Engineering": [
      { name: "Chemical Engineering", code: "B.ENG-CHE", duration: 5, credits: 150 }
    ],
    "Civil Engineering": [
      { name: "Civil Engineering", code: "B.ENG-CVE", duration: 5, credits: 150 }
    ],
    "Electrical Engineering": [
      { name: "Electrical Engineering", code: "B.ENG-ELE", duration: 5, credits: 150 }
    ],
    "Mechanical Engineering": [
      { name: "Mechanical Engineering", code: "B.ENG-MEE", duration: 5, credits: 150 }
    ],
    "Marine Engineering": [
      { name: "Marine Engineering", code: "B.ENG-MAR", duration: 5, credits: 150 }
    ],
    "Petroleum and Gas Engineering": [
      { name: "Petroleum and Gas Engineering", code: "B.ENG-PGE", duration: 5, credits: 150 }
    ],

    // Humanities
    "English and Literary Studies": [
      { name: "English and Literary Studies", code: "B.A-ENG", duration: 4, credits: 120 }
    ],
    "History and Strategic Studies": [
      { name: "History and Strategic Studies", code: "B.A-HIS", duration: 4, credits: 120 }
    ],
    "Linguistics and Communication Studies": [
      { name: "Linguistics", code: "B.A-LIN", duration: 4, credits: 120 }
    ],
    "Modern Languages and Translation Studies": [
      { name: "French", code: "B.A-FRE", duration: 4, credits: 120 },
      { name: "Russian", code: "B.A-RUS", duration: 4, credits: 120 }
    ],
    "Music": [
      { name: "Music", code: "B.A-MUS", duration: 4, credits: 120 }
    ],
    "Philosophy": [
      { name: "Philosophy", code: "B.A-PHI", duration: 4, credits: 120 }
    ],
    "Religious and Cultural Studies": [
      { name: "Religious and Cultural Studies", code: "B.A-RCS", duration: 4, credits: 120 }
    ],
    "Theatre and Film Studies": [
      { name: "Theatre Arts", code: "B.A-THA", duration: 4, credits: 120 }
    ],

    // Law
    "Public Law": [
      { name: "Law", code: "LLB", duration: 5, credits: 150 }
    ],

    // Management Sciences
    "Accounting": [
      { name: "Accounting", code: "B.SC-ACC", duration: 4, credits: 120 }
    ],
    "Banking and Finance": [
      { name: "Banking and Finance", code: "B.SC-BFN", duration: 4, credits: 120 }
    ],
    "Business Administration": [
      { name: "Business Administration", code: "B.SC-BUA", duration: 4, credits: 120 }
    ],
    "Hospitality Management and Tourism": [
      { name: "Hospitality Management and Tourism", code: "B.SC-HMT", duration: 4, credits: 120 }
    ],
    "Marketing": [
      { name: "Marketing", code: "B.SC-MKT", duration: 4, credits: 120 }
    ],

    // Pharmaceutical Sciences
    "Clinical Pharmacy and Pharmacy Practice": [
      { name: "Pharmacy", code: "B.PHARM", duration: 5, credits: 150 }
    ],

    // Science
    "Animal and Environmental Biology": [
      { name: "Animal and Environmental Biology", code: "B.SC-AEB", duration: 4, credits: 120 }
    ],
    "Chemistry": [
      { name: "Chemistry", code: "B.SC-CHM", duration: 4, credits: 120 },
      { name: "Industrial Chemistry", code: "B.SC-ICH", duration: 4, credits: 120 }
    ],
    "Computer Science": [
      { name: "Computer Science", code: "B.SC-CSC", duration: 4, credits: 120 }
    ],
    "Geology": [
      { name: "Geology", code: "B.SC-GEO", duration: 4, credits: 120 }
    ],
    "Mathematics": [
      { name: "Mathematics", code: "B.SC-MTH", duration: 4, credits: 120 },
      { name: "Statistics", code: "B.SC-STA", duration: 4, credits: 120 }
    ],
    "Microbiology": [
      { name: "Microbiology", code: "B.SC-MCB", duration: 4, credits: 120 }
    ],
    "Physics": [
      { name: "Physics", code: "B.SC-PHY", duration: 4, credits: 120 },
      { name: "Applied Physics", code: "B.SC-APH", duration: 4, credits: 120 }
    ],
    "Plant Science and Biotechnology": [
      { name: "Plant Science and Biotechnology", code: "B.SC-PSB", duration: 4, credits: 120 }
    ],

    // Social Sciences
    "Economics": [
      { name: "Economics", code: "B.SC-ECO", duration: 4, credits: 120 }
    ],
    "Geography and Environmental Management": [
      { name: "Geography and Environmental Management", code: "B.SC-GEM", duration: 4, credits: 120 }
    ],
    "Political Science": [
      { name: "Political Science", code: "B.SC-POL", duration: 4, credits: 120 }
    ],
    "Psychology": [
      { name: "Psychology", code: "B.SC-PSY", duration: 4, credits: 120 }
    ],
    "Sociology": [
      { name: "Sociology", code: "B.SC-SOC", duration: 4, credits: 120 }
    ],

    // Technical and Science Education
    "Technology and Vocational Education": [
      { name: "Technology Education", code: "B.TECH-ED", duration: 4, credits: 120 }
    ]
  }
}

// UNIPORT Courses by Department (300+ Courses)
const coursesByDepartment: Record<string, Array<{
  code: string
  title: string
  units: number
  level: number
  semester: number
  isElective?: boolean
}>> = {
  // Computer Science (25 courses)
  "Computer Science": [
    // 100 Level
    { code: "CSC101", title: "Introduction to Computer Science", units: 3, level: 100, semester: 1 },
    { code: "CSC102", title: "Introduction to Problem Solving", units: 3, level: 100, semester: 2 },
    { code: "MTH101", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH102", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "PHY107", title: "General Physics I", units: 3, level: 100, semester: 1 },
    { code: "PHY108", title: "General Physics II", units: 3, level: 100, semester: 2 },
    // 200 Level
    { code: "CSC201", title: "Computer Programming I (C++)", units: 3, level: 200, semester: 1 },
    { code: "CSC202", title: "Computer Programming II (Java)", units: 3, level: 200, semester: 2 },
    { code: "CSC203", title: "Discrete Structures", units: 3, level: 200, semester: 1 },
    { code: "CSC204", title: "Data Structures and Algorithms", units: 3, level: 200, semester: 2 },
    { code: "CSC205", title: "Computer Hardware", units: 3, level: 200, semester: 1 },
    { code: "CSC206", title: "Web Technologies", units: 3, level: 200, semester: 2 },
    // 300 Level
    { code: "CSC301", title: "Algorithm Design and Analysis", units: 3, level: 300, semester: 1 },
    { code: "CSC302", title: "Database Management Systems", units: 3, level: 300, semester: 2 },
    { code: "CSC303", title: "Operating Systems I", units: 3, level: 300, semester: 1 },
    { code: "CSC304", title: "Computer Architecture and Organization", units: 3, level: 300, semester: 2 },
    { code: "CSC305", title: "Software Engineering I", units: 3, level: 300, semester: 1 },
    { code: "CSC306", title: "Computer Networks", units: 3, level: 300, semester: 2 },
    // 400 Level
    { code: "CSC401", title: "Artificial Intelligence", units: 3, level: 400, semester: 1 },
    { code: "CSC402", title: "Compiler Construction", units: 3, level: 400, semester: 2 },
    { code: "CSC403", title: "Theory of Computation", units: 3, level: 400, semester: 1 },
    { code: "CSC404", title: "Computer Graphics", units: 3, level: 400, semester: 2, isElective: true },
    { code: "CSC405", title: "Information Security", units: 3, level: 400, semester: 1, isElective: true },
    { code: "CSC406", title: "Cloud Computing", units: 3, level: 400, semester: 2, isElective: true },
    { code: "CSC499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Accounting (22 courses)
  "Accounting": [
    // 100 Level
    { code: "ACC101", title: "Introduction to Financial Accounting I", units: 3, level: 100, semester: 1 },
    { code: "ACC102", title: "Introduction to Financial Accounting II", units: 3, level: 100, semester: 2 },
    { code: "BUS101", title: "Introduction to Business", units: 2, level: 100, semester: 1 },
    { code: "ECO101", title: "Principles of Economics I (Micro)", units: 3, level: 100, semester: 1 },
    { code: "ECO102", title: "Principles of Economics II (Macro)", units: 3, level: 100, semester: 2 },
    { code: "MTH103", title: "Elementary Mathematics for Business", units: 3, level: 100, semester: 1 },
    // 200 Level
    { code: "ACC201", title: "Financial Accounting I", units: 3, level: 200, semester: 1 },
    { code: "ACC202", title: "Financial Accounting II", units: 3, level: 200, semester: 2 },
    { code: "ACC203", title: "Cost Accounting I", units: 3, level: 200, semester: 1 },
    { code: "ACC204", title: "Management Accounting", units: 3, level: 200, semester: 2 },
    { code: "BUS201", title: "Business Statistics", units: 3, level: 200, semester: 1 },
    { code: "ACC205", title: "Introduction to Taxation", units: 3, level: 200, semester: 2 },
    // 300 Level
    { code: "ACC301", title: "Advanced Financial Accounting I", units: 3, level: 300, semester: 1 },
    { code: "ACC302", title: "Auditing and Investigation I", units: 3, level: 300, semester: 2 },
    { code: "ACC303", title: "Taxation I (Personal Income Tax)", units: 3, level: 300, semester: 1 },
    { code: "ACC304", title: "Public Sector Accounting", units: 3, level: 300, semester: 2 },
    { code: "ACC305", title: "Accounting Information Systems", units: 3, level: 300, semester: 1 },
    { code: "ACC306", title: "Cost Accounting II", units: 3, level: 300, semester: 2 },
    // 400 Level
    { code: "ACC401", title: "Advanced Auditing", units: 3, level: 400, semester: 1 },
    { code: "ACC402", title: "International Accounting", units: 3, level: 400, semester: 2 },
    { code: "ACC403", title: "Financial Management", units: 3, level: 400, semester: 1 },
    { code: "ACC499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Economics (20 courses)
  "Economics": [
    // 100 Level
    { code: "ECO111", title: "Principles of Economics I", units: 3, level: 100, semester: 1 },
    { code: "ECO112", title: "Principles of Economics II", units: 3, level: 100, semester: 2 },
    { code: "MTH104", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH105", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "ACC111", title: "Introduction to Accounting", units: 3, level: 100, semester: 1 },
    // 200 Level
    { code: "ECO201", title: "Microeconomics I", units: 3, level: 200, semester: 1 },
    { code: "ECO202", title: "Macroeconomics I", units: 3, level: 200, semester: 2 },
    { code: "ECO203", title: "Statistical Methods for Economics", units: 3, level: 200, semester: 1 },
    { code: "ECO204", title: "Development Economics I", units: 3, level: 200, semester: 2 },
    { code: "ECO205", title: "History of Economic Thought", units: 3, level: 200, semester: 1 },
    { code: "ECO206", title: "Mathematical Economics I", units: 3, level: 200, semester: 2 },
    // 300 Level
    { code: "ECO301", title: "Microeconomics II (Intermediate)", units: 3, level: 300, semester: 1 },
    { code: "ECO302", title: "Macroeconomics II (Intermediate)", units: 3, level: 300, semester: 2 },
    { code: "ECO303", title: "Econometrics I", units: 3, level: 300, semester: 1 },
    { code: "ECO304", title: "Public Finance", units: 3, level: 300, semester: 2 },
    { code: "ECO305", title: "International Economics", units: 3, level: 300, semester: 1 },
    // 400 Level
    { code: "ECO401", title: "Advanced Microeconomics", units: 3, level: 400, semester: 1 },
    { code: "ECO402", title: "Advanced Macroeconomics", units: 3, level: 400, semester: 2 },
    { code: "ECO403", title: "Monetary Economics", units: 3, level: 400, semester: 1 },
    { code: "ECO499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Electrical Engineering (24 courses)
  "Electrical Engineering": [
    // 100 Level
    { code: "ELE101", title: "Introduction to Electrical Engineering", units: 2, level: 100, semester: 1 },
    { code: "ELE102", title: "Engineering Drawing and CAD", units: 2, level: 100, semester: 2 },
    { code: "MTH106", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH107", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "PHY109", title: "General Physics I (Mechanics)", units: 3, level: 100, semester: 1 },
    { code: "PHY110", title: "General Physics II (Electricity)", units: 3, level: 100, semester: 2 },
    { code: "CHM103", title: "General Chemistry I", units: 3, level: 100, semester: 1 },
    // 200 Level
    { code: "ELE201", title: "Circuit Theory I", units: 3, level: 200, semester: 1 },
    { code: "ELE202", title: "Circuit Theory II", units: 3, level: 200, semester: 2 },
    { code: "ELE203", title: "Electromagnetic Fields and Waves I", units: 3, level: 200, semester: 1 },
    { code: "ELE204", title: "Electrical Measurements and Instrumentation", units: 3, level: 200, semester: 2 },
    { code: "ELE205", title: "Electronic Devices and Circuits", units: 3, level: 200, semester: 1 },
    { code: "ELE206", title: "Digital Electronics", units: 3, level: 200, semester: 2 },
    // 300 Level
    { code: "ELE301", title: "Control Systems I", units: 3, level: 300, semester: 1 },
    { code: "ELE302", title: "Power Systems Analysis I", units: 3, level: 300, semester: 2 },
    { code: "ELE303", title: "Signals and Systems", units: 3, level: 300, semester: 1 },
    { code: "ELE304", title: "Microprocessor and Microcontroller Systems", units: 3, level: 300, semester: 2 },
    { code: "ELE305", title: "Communication Systems I", units: 3, level: 300, semester: 1 },
    { code: "ELE306", title: "Power Electronics I", units: 3, level: 300, semester: 2 },
    // 400 Level
    { code: "ELE401", title: "Advanced Power Electronics", units: 3, level: 400, semester: 1 },
    { code: "ELE402", title: "Electrical Machines and Drives", units: 3, level: 400, semester: 2 },
    { code: "ELE403", title: "Digital Signal Processing", units: 3, level: 400, semester: 1, isElective: true },
    { code: "ELE404", title: "Renewable Energy Systems", units: 3, level: 400, semester: 2, isElective: true },
    { code: "ELE499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Public Law (for Law programmes) (28 courses)
  "Public Law": [
    // 100 Level
    { code: "LAW101", title: "Introduction to Nigerian Legal System", units: 3, level: 100, semester: 1 },
    { code: "LAW102", title: "Legal Method and Legal Reasoning", units: 3, level: 100, semester: 2 },
    { code: "LAW103", title: "Law of Contract I", units: 3, level: 100, semester: 1 },
    { code: "LAW104", title: "Law of Torts", units: 3, level: 100, semester: 2 },
    { code: "LAW105", title: "Constitutional Law I", units: 3, level: 100, semester: 1 },
    { code: "LAW106", title: "Legal History", units: 2, level: 100, semester: 2 },
    // 200 Level
    { code: "LAW201", title: "Constitutional Law II", units: 3, level: 200, semester: 1 },
    { code: "LAW202", title: "Criminal Law I", units: 3, level: 200, semester: 2 },
    { code: "LAW203", title: "Land Law I", units: 3, level: 200, semester: 1 },
    { code: "LAW204", title: "Law of Evidence I", units: 3, level: 200, semester: 2 },
    { code: "LAW205", title: "Administrative Law", units: 3, level: 200, semester: 1 },
    { code: "LAW206", title: "Law of Contract II", units: 3, level: 200, semester: 2 },
    // 300 Level
    { code: "LAW301", title: "Criminal Law II", units: 3, level: 300, semester: 1 },
    { code: "LAW302", title: "Company Law I", units: 3, level: 300, semester: 2 },
    { code: "LAW303", title: "International Law I", units: 3, level: 300, semester: 1 },
    { code: "LAW304", title: "Equity and Trusts", units: 3, level: 300, semester: 2 },
    { code: "LAW305", title: "Commercial Law", units: 3, level: 300, semester: 1 },
    { code: "LAW306", title: "Family Law", units: 3, level: 300, semester: 2 },
    // 400 Level
    { code: "LAW401", title: "Jurisprudence and Legal Theory", units: 3, level: 400, semester: 1 },
    { code: "LAW402", title: "International Law II", units: 3, level: 400, semester: 2 },
    { code: "LAW403", title: "Labor and Employment Law", units: 3, level: 400, semester: 1 },
    { code: "LAW404", title: "Taxation Law", units: 3, level: 400, semester: 2 },
    { code: "LAW405", title: "Banking and Insurance Law", units: 3, level: 400, semester: 1, isElective: true },
    // 500 Level
    { code: "LAW501", title: "Civil Procedure", units: 3, level: 500, semester: 1 },
    { code: "LAW502", title: "Criminal Procedure", units: 3, level: 500, semester: 2 },
    { code: "LAW503", title: "Professional Ethics and Legal Practice", units: 3, level: 500, semester: 1 },
    { code: "LAW504", title: "Environmental Law", units: 3, level: 500, semester: 2, isElective: true },
    { code: "LAW599", title: "Research Project", units: 6, level: 500, semester: 2 }
  ],

  // Mathematics (20 courses)
  "Mathematics": [
    { code: "MTH111", title: "Elementary Mathematics I (Algebra)", units: 3, level: 100, semester: 1 },
    { code: "MTH112", title: "Elementary Mathematics II (Calculus)", units: 3, level: 100, semester: 2 },
    { code: "MTH113", title: "Vectors and Dynamics", units: 3, level: 100, semester: 1 },
    { code: "PHY111", title: "General Physics", units: 3, level: 100, semester: 1 },
    { code: "CSC111", title: "Introduction to Computer Science", units: 3, level: 100, semester: 2 },
    { code: "MTH211", title: "Mathematical Methods I", units: 3, level: 200, semester: 1 },
    { code: "MTH212", title: "Elementary Differential Equations", units: 3, level: 200, semester: 2 },
    { code: "MTH213", title: "Linear Algebra I", units: 3, level: 200, semester: 1 },
    { code: "MTH214", title: "Set Theory and Abstract Algebra", units: 3, level: 200, semester: 2 },
    { code: "MTH215", title: "Real Analysis I", units: 3, level: 200, semester: 1 },
    { code: "MTH311", title: "Complex Analysis", units: 3, level: 300, semester: 1 },
    { code: "MTH312", title: "Numerical Analysis I", units: 3, level: 300, semester: 2 },
    { code: "MTH313", title: "Topology", units: 3, level: 300, semester: 1 },
    { code: "MTH314", title: "Operations Research", units: 3, level: 300, semester: 2 },
    { code: "MTH315", title: "Probability Theory", units: 3, level: 300, semester: 1 },
    { code: "MTH411", title: "Functional Analysis", units: 3, level: 400, semester: 1 },
    { code: "MTH412", title: "Differential Geometry", units: 3, level: 400, semester: 2 },
    { code: "MTH413", title: "Mathematical Modeling", units: 3, level: 400, semester: 1, isElective: true },
    { code: "MTH414", title: "Cryptography", units: 3, level: 400, semester: 2, isElective: true },
    { code: "MTH499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Physics (22 courses)
  "Physics": [
    { code: "PHY121", title: "General Physics I (Mechanics)", units: 3, level: 100, semester: 1 },
    { code: "PHY122", title: "General Physics II (Electricity & Magnetism)", units: 3, level: 100, semester: 2 },
    { code: "PHY123", title: "Practical Physics I", units: 2, level: 100, semester: 1 },
    { code: "PHY124", title: "Practical Physics II", units: 2, level: 100, semester: 2 },
    { code: "MTH121", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1 },
    { code: "MTH122", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2 },
    { code: "CHM111", title: "General Chemistry I", units: 3, level: 100, semester: 1 },
    { code: "PHY221", title: "Thermal Physics", units: 3, level: 200, semester: 1 },
    { code: "PHY222", title: "Waves and Optics", units: 3, level: 200, semester: 2 },
    { code: "PHY223", title: "Modern Physics", units: 3, level: 200, semester: 1 },
    { code: "PHY224", title: "Elementary Classical Mechanics", units: 3, level: 200, semester: 2 },
    { code: "PHY321", title: "Quantum Mechanics I", units: 3, level: 300, semester: 1 },
    { code: "PHY322", title: "Statistical Mechanics", units: 3, level: 300, semester: 2 },
    { code: "PHY323", title: "Electromagnetic Theory I", units: 3, level: 300, semester: 1 },
    { code: "PHY324", title: "Electronics and Instrumentation", units: 3, level: 300, semester: 2 },
    { code: "PHY325", title: "Atomic and Molecular Physics", units: 3, level: 300, semester: 1 },
    { code: "PHY421", title: "Quantum Mechanics II", units: 3, level: 400, semester: 1 },
    { code: "PHY422", title: "Solid State Physics", units: 3, level: 400, semester: 2 },
    { code: "PHY423", title: "Nuclear and Particle Physics", units: 3, level: 400, semester: 1 },
    { code: "PHY424", title: "Astrophysics", units: 3, level: 400, semester: 2, isElective: true },
    { code: "PHY425", title: "Renewable Energy", units: 3, level: 400, semester: 1, isElective: true },
    { code: "PHY499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Chemistry (24 courses)
  "Chemistry": [
    { code: "CHM121", title: "General Chemistry I (Inorganic)", units: 3, level: 100, semester: 1 },
    { code: "CHM122", title: "General Chemistry II (Organic)", units: 3, level: 100, semester: 2 },
    { code: "CHM123", title: "Practical Chemistry I", units: 2, level: 100, semester: 1 },
    { code: "CHM124", title: "Practical Chemistry II", units: 2, level: 100, semester: 2 },
    { code: "PHY131", title: "General Physics", units: 3, level: 100, semester: 1 },
    { code: "MTH131", title: "Mathematics for Chemists", units: 3, level: 100, semester: 1 },
    { code: "CHM221", title: "Inorganic Chemistry I", units: 3, level: 200, semester: 1 },
    { code: "CHM222", title: "Organic Chemistry I", units: 3, level: 200, semester: 2 },
    { code: "CHM223", title: "Physical Chemistry I", units: 3, level: 200, semester: 1 },
    { code: "CHM224", title: "Analytical Chemistry I", units: 3, level: 200, semester: 2 },
    { code: "CHM225", title: "Industrial Chemistry", units: 3, level: 200, semester: 1 },
    { code: "CHM321", title: "Inorganic Chemistry II", units: 3, level: 300, semester: 1 },
    { code: "CHM322", title: "Organic Chemistry II (Reaction Mechanisms)", units: 3, level: 300, semester: 2 },
    { code: "CHM323", title: "Physical Chemistry II (Quantum Chemistry)", units: 3, level: 300, semester: 1 },
    { code: "CHM324", title: "Instrumental Methods of Analysis", units: 3, level: 300, semester: 2 },
    { code: "CHM325", title: "Polymer Chemistry", units: 3, level: 300, semester: 1 },
    { code: "CHM326", title: "Environmental Chemistry", units: 3, level: 300, semester: 2 },
    { code: "CHM421", title: "Advanced Inorganic Chemistry", units: 3, level: 400, semester: 1 },
    { code: "CHM422", title: "Organic Synthesis", units: 3, level: 400, semester: 2 },
    { code: "CHM423", title: "Chemical Kinetics and Catalysis", units: 3, level: 400, semester: 1 },
    { code: "CHM424", title: "Spectroscopy", units: 3, level: 400, semester: 2 },
    { code: "CHM425", title: "Biochemistry", units: 3, level: 400, semester: 1, isElective: true },
    { code: "CHM426", title: "Petrochemistry", units: 3, level: 400, semester: 2, isElective: true },
    { code: "CHM499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Microbiology (20 courses)
  "Microbiology": [
    { code: "MCB141", title: "General Microbiology", units: 3, level: 100, semester: 1 },
    { code: "MCB142", title: "Introduction to Cell Biology", units: 3, level: 100, semester: 2 },
    { code: "BCH141", title: "General Biochemistry", units: 3, level: 100, semester: 1 },
    { code: "CHM141", title: "General Chemistry", units: 3, level: 100, semester: 1 },
    { code: "PHY141", title: "General Physics", units: 3, level: 100, semester: 2 },
    { code: "MCB241", title: "Microbial Physiology", units: 3, level: 200, semester: 1 },
    { code: "MCB242", title: "Virology", units: 3, level: 200, semester: 2 },
    { code: "MCB243", title: "Mycology", units: 3, level: 200, semester: 1 },
    { code: "MCB244", title: "Bacteriology", units: 3, level: 200, semester: 2 },
    { code: "GNS211", title: "Biostatistics", units: 3, level: 200, semester: 1 },
    { code: "MCB341", title: "Medical Microbiology", units: 3, level: 300, semester: 1 },
    { code: "MCB342", title: "Industrial Microbiology", units: 3, level: 300, semester: 2 },
    { code: "MCB343", title: "Food Microbiology", units: 3, level: 300, semester: 1 },
    { code: "MCB344", title: "Environmental Microbiology", units: 3, level: 300, semester: 2 },
    { code: "MCB345", title: "Immunology", units: 3, level: 300, semester: 1 },
    { code: "MCB441", title: "Microbial Genetics", units: 3, level: 400, semester: 1 },
    { code: "MCB442", title: "Molecular Biology", units: 3, level: 400, semester: 2 },
    { code: "MCB443", title: "Microbial Biotechnology", units: 3, level: 400, semester: 1 },
    { code: "MCB444", title: "Public Health Microbiology", units: 3, level: 400, semester: 2, isElective: true },
    { code: "MCB499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Biochemistry (22 courses)
  "Biochemistry": [
    { code: "BCH151", title: "Introduction to Biochemistry", units: 3, level: 100, semester: 1 },
    { code: "BCH152", title: "General Biochemistry", units: 3, level: 100, semester: 2 },
    { code: "CHM151", title: "General Chemistry I", units: 3, level: 100, semester: 1 },
    { code: "CHM152", title: "Organic Chemistry", units: 3, level: 100, semester: 2 },
    { code: "PHY151", title: "General Physics", units: 3, level: 100, semester: 1 },
    { code: "BCH251", title: "Enzymology", units: 3, level: 200, semester: 1 },
    { code: "BCH252", title: "Metabolism", units: 3, level: 200, semester: 2 },
    { code: "BCH253", title: "Biomolecules", units: 3, level: 200, semester: 1 },
    { code: "BCH254", title: "Analytical Biochemistry", units: 3, level: 200, semester: 2 },
    { code: "PHY251", title: "Biophysics", units: 3, level: 200, semester: 1 },
    { code: "BCH351", title: "Molecular Biology", units: 3, level: 300, semester: 1 },
    { code: "BCH352", title: "Clinical Biochemistry", units: 3, level: 300, semester: 2 },
    { code: "BCH353", title: "Immunology and Immunochemistry", units: 3, level: 300, semester: 1 },
    { code: "BCH354", title: "Nutritional Biochemistry", units: 3, level: 300, semester: 2 },
    { code: "BCH355", title: "Endocrinology", units: 3, level: 300, semester: 1 },
    { code: "BCH451", title: "Advanced Molecular Biology", units: 3, level: 400, semester: 1 },
    { code: "BCH452", title: "Biotechnology", units: 3, level: 400, semester: 2 },
    { code: "BCH453", title: "Toxicology and Pharmacology", units: 3, level: 400, semester: 1 },
    { code: "BCH454", title: "Genetic Engineering", units: 3, level: 400, semester: 2 },
    { code: "BCH455", title: "Bioinformatics", units: 3, level: 400, semester: 1, isElective: true },
    { code: "BCH456", title: "Industrial Biochemistry", units: 3, level: 400, semester: 2, isElective: true },
    { code: "BCH499", title: "Final Year Project", units: 6, level: 400, semester: 2 }
  ],

  // Business Administration (20 courses)
  "Business Administration": [
    { code: "BUS111", title: "Introduction to Business Management", units: 3, level: 100, semester: 1 },
    { code: "BUS112", title: "Business Communication", units: 2, level: 100, semester: 2 },
    { code: "ACC121", title: "Principles of Accounting", units: 3, level: 100, semester: 1 },
    { code: "ECO121", title: "Principles of Economics", units: 3, level: 100, semester: 1 },
    { code: "MTH141", title: "Business Mathematics", units: 3, level: 100, semester: 1 },
    { code: "BUS211", title: "Organizational Behavior", units: 3, level: 200, semester: 1 },
    { code: "BUS212", title: "Human Resource Management", units: 3, level: 200, semester: 2 },
    { code: "BUS213", title: "Business Statistics", units: 3, level: 200, semester: 1 },
    { code: "BUS214", title: "Marketing Management", units: 3, level: 200, semester: 2 },
    { code: "BUS215", title: "Operations Management", units: 3, level: 200, semester: 1 },
    { code: "BUS311", title: "Strategic Management", units: 3, level: 300, semester: 1 },
    { code: "BUS312", title: "Entrepreneurship Development", units: 3, level: 300, semester: 2 },
    { code: "BUS313", title: "Financial Management", units: 3, level: 300, semester: 1 },
    { code: "BUS314", title: "International Business", units: 3, level: 300, semester: 2 },
    { code: "BUS315", title: "Business Policy", units: 3, level: 300, semester: 1 },
    { code: "BUS411", title: "Corporate Governance", units: 3, level: 400, semester: 1 },
    { code: "BUS412", title: "Business Ethics", units: 3, level: 400, semester: 2 },
    { code: "BUS413", title: "Project Management", units: 3, level: 400, semester: 1 },
    { code: "BUS414", title: "E-Business", units: 3, level: 400, semester: 2, isElective: true },
    { code: "BUS499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Banking and Finance (18 courses)
  "Banking and Finance": [
    { code: "BFN121", title: "Introduction to Finance", units: 3, level: 100, semester: 1 },
    { code: "BFN122", title: "Introduction to Banking", units: 3, level: 100, semester: 2 },
    { code: "ACC131", title: "Financial Accounting", units: 3, level: 100, semester: 1 },
    { code: "ECO131", title: "Principles of Economics", units: 3, level: 100, semester: 1 },
    { code: "BFN221", title: "Financial Markets and Institutions", units: 3, level: 200, semester: 1 },
    { code: "BFN222", title: "Money and Banking", units: 3, level: 200, semester: 2 },
    { code: "BFN223", title: "Corporate Finance", units: 3, level: 200, semester: 1 },
    { code: "BFN224", title: "Investment Analysis", units: 3, level: 200, semester: 2 },
    { code: "BFN321", title: "International Finance", units: 3, level: 300, semester: 1 },
    { code: "BFN322", title: "Financial Risk Management", units: 3, level: 300, semester: 2 },
    { code: "BFN323", title: "Portfolio Management", units: 3, level: 300, semester: 1 },
    { code: "BFN324", title: "Islamic Banking and Finance", units: 3, level: 300, semester: 2, isElective: true },
    { code: "BFN421", title: "Advanced Financial Management", units: 3, level: 400, semester: 1 },
    { code: "BFN422", title: "Derivatives and Risk Management", units: 3, level: 400, semester: 2 },
    { code: "BFN423", title: "Financial Modeling", units: 3, level: 400, semester: 1 },
    { code: "BFN424", title: "Mergers and Acquisitions", units: 3, level: 400, semester: 2, isElective: true },
    { code: "BFN425", title: "FinTech and Digital Banking", units: 3, level: 400, semester: 1, isElective: true },
    { code: "BFN499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Marketing (18 courses)
  "Marketing": [
    { code: "MKT131", title: "Principles of Marketing", units: 3, level: 100, semester: 1 },
    { code: "MKT132", title: "Introduction to Business", units: 3, level: 100, semester: 2 },
    { code: "ECO141", title: "Principles of Economics", units: 3, level: 100, semester: 1 },
    { code: "ACC141", title: "Introduction to Accounting", units: 3, level: 100, semester: 1 },
    { code: "MKT231", title: "Consumer Behavior", units: 3, level: 200, semester: 1 },
    { code: "MKT232", title: "Marketing Research", units: 3, level: 200, semester: 2 },
    { code: "MKT233", title: "Sales Management", units: 3, level: 200, semester: 1 },
    { code: "MKT234", title: "Advertising and Promotion", units: 3, level: 200, semester: 2 },
    { code: "MKT331", title: "Brand Management", units: 3, level: 300, semester: 1 },
    { code: "MKT332", title: "Digital Marketing", units: 3, level: 300, semester: 2 },
    { code: "MKT333", title: "International Marketing", units: 3, level: 300, semester: 1 },
    { code: "MKT334", title: "Services Marketing", units: 3, level: 300, semester: 2 },
    { code: "MKT431", title: "Strategic Marketing", units: 3, level: 400, semester: 1 },
    { code: "MKT432", title: "Marketing Analytics", units: 3, level: 400, semester: 2 },
    { code: "MKT433", title: "Social Media Marketing", units: 3, level: 400, semester: 1, isElective: true },
    { code: "MKT434", title: "E-Commerce Marketing", units: 3, level: 400, semester: 2, isElective: true },
    { code: "MKT435", title: "Retail Management", units: 3, level: 400, semester: 1, isElective: true },
    { code: "MKT499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Political Science (18 courses)
  "Political Science": [
    { code: "POL151", title: "Introduction to Political Science", units: 3, level: 100, semester: 1 },
    { code: "POL152", title: "Introduction to African Politics", units: 3, level: 100, semester: 2 },
    { code: "HIS151", title: "History of Political Thought", units: 3, level: 100, semester: 1 },
    { code: "SOC151", title: "Introduction to Sociology", units: 3, level: 100, semester: 1 },
    { code: "POL251", title: "Comparative Politics", units: 3, level: 200, semester: 1 },
    { code: "POL252", title: "Nigerian Government and Politics", units: 3, level: 200, semester: 2 },
    { code: "POL253", title: "Political Theory", units: 3, level: 200, semester: 1 },
    { code: "POL254", title: "Public Administration", units: 3, level: 200, semester: 2 },
    { code: "POL351", title: "International Relations", units: 3, level: 300, semester: 1 },
    { code: "POL352", title: "Political Economy", units: 3, level: 300, semester: 2 },
    { code: "POL353", title: "Political Parties and Elections", units: 3, level: 300, semester: 1 },
    { code: "POL354", title: "Constitutional Law", units: 3, level: 300, semester: 2 },
    { code: "POL451", title: "Foreign Policy Analysis", units: 3, level: 400, semester: 1 },
    { code: "POL452", title: "Conflict and Peace Studies", units: 3, level: 400, semester: 2 },
    { code: "POL453", title: "Democracy and Democratization", units: 3, level: 400, semester: 1 },
    { code: "POL454", title: "Gender and Politics", units: 3, level: 400, semester: 2, isElective: true },
    { code: "POL455", title: "Human Rights", units: 3, level: 400, semester: 1, isElective: true },
    { code: "POL499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Psychology (18 courses)
  "Psychology": [
    { code: "PSY161", title: "Introduction to Psychology", units: 3, level: 100, semester: 1 },
    { code: "PSY162", title: "Developmental Psychology", units: 3, level: 100, semester: 2 },
    { code: "BIO161", title: "Introduction to Biology", units: 3, level: 100, semester: 1 },
    { code: "SOC161", title: "Introduction to Sociology", units: 3, level: 100, semester: 1 },
    { code: "PSY261", title: "Social Psychology", units: 3, level: 200, semester: 1 },
    { code: "PSY262", title: "Cognitive Psychology", units: 3, level: 200, semester: 2 },
    { code: "PSY263", title: "Personality Psychology", units: 3, level: 200, semester: 1 },
    { code: "PSY264", title: "Research Methods in Psychology", units: 3, level: 200, semester: 2 },
    { code: "PSY361", title: "Abnormal Psychology", units: 3, level: 300, semester: 1 },
    { code: "PSY362", title: "Clinical Psychology", units: 3, level: 300, semester: 2 },
    { code: "PSY363", title: "Educational Psychology", units: 3, level: 300, semester: 1 },
    { code: "PSY364", title: "Industrial/Organizational Psychology", units: 3, level: 300, semester: 2 },
    { code: "PSY461", title: "Counseling Psychology", units: 3, level: 400, semester: 1 },
    { code: "PSY462", title: "Health Psychology", units: 3, level: 400, semester: 2 },
    { code: "PSY463", title: "Forensic Psychology", units: 3, level: 400, semester: 1, isElective: true },
    { code: "PSY464", title: "Neuropsychology", units: 3, level: 400, semester: 2, isElective: true },
    { code: "PSY465", title: "Child and Adolescent Psychology", units: 3, level: 400, semester: 1, isElective: true },
    { code: "PSY499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ],

  // Sociology (16 courses)
  "Sociology": [
    { code: "SOC171", title: "Introduction to Sociology", units: 3, level: 100, semester: 1 },
    { code: "SOC172", title: "Sociological Theory I", units: 3, level: 100, semester: 2 },
    { code: "PSY171", title: "Introduction to Psychology", units: 3, level: 100, semester: 1 },
    { code: "ANT171", title: "Introduction to Anthropology", units: 3, level: 100, semester: 2 },
    { code: "SOC271", title: "Social Research Methods", units: 3, level: 200, semester: 1 },
    { code: "SOC272", title: "African Social Institutions", units: 3, level: 200, semester: 2 },
    { code: "SOC273", title: "Social Statistics", units: 3, level: 200, semester: 1 },
    { code: "SOC274", title: "Urban Sociology", units: 3, level: 200, semester: 2 },
    { code: "SOC371", title: "Sociology of Development", units: 3, level: 300, semester: 1 },
    { code: "SOC372", title: "Criminology and Deviance", units: 3, level: 300, semester: 2 },
    { code: "SOC373", title: "Gender and Society", units: 3, level: 300, semester: 1 },
    { code: "SOC374", title: "Medical Sociology", units: 3, level: 300, semester: 2 },
    { code: "SOC471", title: "Industrial Sociology", units: 3, level: 400, semester: 1 },
    { code: "SOC472", title: "Environmental Sociology", units: 3, level: 400, semester: 2, isElective: true },
    { code: "SOC473", title: "Sociology of Education", units: 3, level: 400, semester: 1, isElective: true },
    { code: "SOC499", title: "Research Project", units: 6, level: 400, semester: 2 }
  ]
}

async function seedUniportData() {
  try {
    await connectDB()

    console.log('\n🏫 University of Port Harcourt Data Seeding\n')
    console.log('=' .repeat(60))

    // Step 1: Create Faculties
    console.log('\n📚 STEP 1: Creating Faculties...')
    const facultyMap = new Map()
    let facultiesCreated = 0

    for (const faculty of uniportData.faculties) {
      // Check by both code and name to avoid unique index conflicts
      const existing = await Faculty.findOne({
        $or: [
          { code: faculty.code },
          { name: faculty.name }
        ]
      })
      
      if (existing) {
        console.log(`⏭️  Exists: ${faculty.name}`)
        facultyMap.set(faculty.name, existing._id.toString())
      } else {
        const newFaculty = await Faculty.create(faculty)
        console.log(`✅ Created: ${faculty.name}`)
        facultyMap.set(faculty.name, newFaculty._id.toString())
        facultiesCreated++
      }
    }

    console.log(`\n📊 Faculties: ${facultiesCreated} created, ${uniportData.faculties.length - facultiesCreated} existed`)

    // Step 2: Create Departments
    console.log('\n🏛️  STEP 2: Creating Departments...')
    const departmentMap = new Map()
    let departmentsCreated = 0

    for (const [facultyName, departments] of Object.entries(uniportData.departments)) {
      const facultyId = facultyMap.get(facultyName)
      if (!facultyId) {
        console.log(`⚠️  Faculty not found: ${facultyName}`)
        continue
      }

      for (const dept of departments) {
        // Check by code globally (unique constraint) or name within faculty
        const existing = await Department.findOne({
          $or: [
            { code: dept.code },  // Check code globally
            { name: dept.name, facultyId }  // Check name within faculty
          ]
        })
        
        if (existing) {
          console.log(`⏭️  Exists: ${dept.name}`)
          departmentMap.set(dept.name, existing._id.toString())
        } else {
          const newDept = await Department.create({
            ...dept,
            facultyId,
            description: `Department of ${dept.name}`
          })
          console.log(`✅ Created: ${dept.name} (${facultyName})`)
          departmentMap.set(dept.name, newDept._id.toString())
          departmentsCreated++
        }
      }
    }

    const totalDepts = Object.values(uniportData.departments).flat().length
    console.log(`\n📊 Departments: ${departmentsCreated} created, ${totalDepts - departmentsCreated} existed`)

    // Step 3: Create Programmes
    console.log('\n🎓 STEP 3: Creating Programmes...')
    let programmesCreated = 0
    let programmesSkipped = 0

    for (const [deptName, programmes] of Object.entries(uniportData.programmes)) {
      const deptId = departmentMap.get(deptName)
      if (!deptId) {
        console.log(`⚠️  Department not found: ${deptName}`)
        programmesSkipped += programmes.length
        continue
      }

      for (const prog of programmes) {
        // Check by both code and name
        const existing = await Programme.findOne({
          $or: [
            { code: prog.code },
            { name: prog.name }
          ]
        })
        
        if (existing) {
          console.log(`⏭️  Exists: ${prog.name}`)
          programmesSkipped++
        } else {
          await Programme.create({
            name: prog.name,
            code: prog.code,
            departmentId: deptId,
            duration: prog.duration,
            totalCredits: prog.credits,
            description: `${prog.name} programme`
          })
          console.log(`✅ Created: ${prog.name} (${prog.code})`)
          programmesCreated++
        }
      }
    }

    console.log(`\n📊 Programmes: ${programmesCreated} created, ${programmesSkipped} existed/skipped`)

    // Step 4: Create Courses
    console.log('\n📖 STEP 4: Creating Courses...')
    let coursesCreated = 0
    let coursesSkipped = 0

    for (const [deptName, courses] of Object.entries(coursesByDepartment)) {
      const deptId = departmentMap.get(deptName)
      if (!deptId) {
        console.log(`⚠️  Department not found: ${deptName} (skipping ${courses.length} courses)`)
        coursesSkipped += courses.length
        continue
      }

      for (const course of courses) {
        const existing = await Course.findOne({ code: course.code })
        if (existing) {
          coursesSkipped++
        } else {
          await Course.create({
            code: course.code,
            title: course.title,
            creditUnits: course.units,
            level: course.level,
            semester: course.semester,
            departmentId: deptId,
            description: `${course.title} course`,
            isElective: course.isElective || false
          })
          console.log(`✅ Created: ${course.code} - ${course.title} (${deptName})`)
          coursesCreated++
        }
      }
    }

    console.log(`\n📊 Courses: ${coursesCreated} created, ${coursesSkipped} existed/skipped`)

    // Final Summary
    console.log('\n' + '='.repeat(60))
    console.log('\n✨ UNIPORT DATA SEEDING COMPLETE!\n')
    console.log('📊 Final Summary:')
    console.log(`   🏛️  Faculties: ${facultiesCreated} new`)
    console.log(`   🏫 Departments: ${departmentsCreated} new`)
    console.log(`   🎓 Programmes: ${programmesCreated} new`)
    console.log(`   📖 Courses: ${coursesCreated} new`)
    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('\n❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB\n')
    process.exit(0)
  }
}

seedUniportData()
