import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Faculty from '../models/Faculty'
import Department from '../models/Department'

dotenv.config()

// ---------------------------------------------------------------------------
// Faculty data
// ---------------------------------------------------------------------------
const facultyData: { name: string; code: string; description?: string }[] = [
  { code: 'FAGRIC', name: 'Faculty of Agriculture' },
  { code: 'FBMS',   name: 'Faculty of Basic Medical Sciences' },
  { code: 'FCMS',   name: 'Faculty of Communication and Media Studies' },
  { code: 'FCOMP',  name: 'Faculty of Computing' },
  { code: 'FEDU',   name: 'Faculty of Education' },
  { code: 'FENG',   name: 'Faculty of Engineering' },
  { code: 'FHUM',   name: 'Faculty of Humanities' },
  { code: 'FLAW',   name: 'Faculty of Law' },
  { code: 'FMS',    name: 'Faculty of Management Sciences' },
  { code: 'FSCI',   name: 'Faculty of Science' },
  { code: 'FSOC',   name: 'Faculty of Social Sciences' },
]

// ---------------------------------------------------------------------------
// Department data (name, code, facultyCode)
// ---------------------------------------------------------------------------
const departmentsData: { name: string; code: string; facultyCode: string }[] = [
  // FAGRIC — Faculty of Agriculture
  { code: 'AEAM',   name: 'Agricultural Economics and Agribusiness Management', facultyCode: 'FAGRIC' },
  { code: 'AEDS',   name: 'Agricultural Extension and Development Studies',      facultyCode: 'FAGRIC' },
  { code: 'ANS',    name: 'Animal Science',                                      facultyCode: 'FAGRIC' },
  { code: 'CSS',    name: 'Crop and Soil Science',                               facultyCode: 'FAGRIC' },
  { code: 'FSH',    name: 'Fisheries',                                           facultyCode: 'FAGRIC' },
  { code: 'FNHS',   name: 'Food Nutrition and Home Science',                     facultyCode: 'FAGRIC' },
  { code: 'FWM',    name: 'Forestry and Wildlife Management',                    facultyCode: 'FAGRIC' },

  // FBMS — Faculty of Basic Medical Sciences
  { code: 'ANA',    name: 'Anatomy',               facultyCode: 'FBMS' },
  { code: 'BCH',    name: 'Biochemistry',           facultyCode: 'FBMS' },
  { code: 'PCL',    name: 'Pharmacology',           facultyCode: 'FBMS' },
  { code: 'PHY',    name: 'Physiology',             facultyCode: 'FBMS' },
  { code: 'DPT',    name: 'Division of Pathology',  facultyCode: 'FBMS' },

  // FCMS — Faculty of Communication and Media Studies
  { code: 'MCS',    name: 'Mass Communication / Communication and Media Studies', facultyCode: 'FCMS' },

  // FCOMP — Faculty of Computing
  { code: 'CSC',    name: 'Computer Science',       facultyCode: 'FCOMP' },
  { code: 'ITE',    name: 'Information Technology', facultyCode: 'FCOMP' },
  { code: 'CYB',    name: 'Cyber Security',         facultyCode: 'FCOMP' },

  // FEDU — Faculty of Education
  { code: 'ANFE',   name: 'Adult and Non-Formal Education',                         facultyCode: 'FEDU' },
  { code: 'CSET',   name: 'Curriculum Studies and Educational Technology',           facultyCode: 'FEDU' },
  { code: 'ECPE',   name: 'Early Childhood and Primary Education',                   facultyCode: 'FEDU' },
  { code: 'EDF',    name: 'Educational Foundations',                                 facultyCode: 'FEDU' },
  { code: 'EMP',    name: 'Educational Management and Planning',                     facultyCode: 'FEDU' },
  { code: 'EPGC',   name: 'Educational Psychology, Guidance and Counselling',        facultyCode: 'FEDU' },
  { code: 'HKHE',   name: 'Human Kinetics and Health Education',                     facultyCode: 'FEDU' },
  { code: 'LIS',    name: 'Library and Information Science',                         facultyCode: 'FEDU' },
  { code: 'SED',    name: 'Science Education',                                       facultyCode: 'FEDU' },

  // FENG — Faculty of Engineering
  { code: 'CHE',    name: 'Chemical Engineering',            facultyCode: 'FENG' },
  { code: 'CVE',    name: 'Civil and Environmental Engineering', facultyCode: 'FENG' },
  { code: 'EEE',    name: 'Electrical/Electronics Engineering',  facultyCode: 'FENG' },
  { code: 'MEE',    name: 'Mechanical Engineering',           facultyCode: 'FENG' },
  { code: 'MCT',    name: 'Mechatronics Engineering',         facultyCode: 'FENG' },
  { code: 'PGE',    name: 'Petroleum and Gas Engineering',    facultyCode: 'FENG' },

  // FHUM — Faculty of Humanities
  { code: 'ENS',    name: 'English Studies',                  facultyCode: 'FHUM' },
  { code: 'FAD',    name: 'Fine Arts and Design',             facultyCode: 'FHUM' },
  { code: 'FLL',    name: 'Foreign Languages and Literature', facultyCode: 'FHUM' },
  { code: 'HDS',    name: 'History and Diplomatic Studies',   facultyCode: 'FHUM' },
  { code: 'LCS',    name: 'Linguistics and Communication Studies', facultyCode: 'FHUM' },
  { code: 'MUS',    name: 'Music',                            facultyCode: 'FHUM' },
  { code: 'PHI',    name: 'Philosophy',                       facultyCode: 'FHUM' },
  { code: 'RCS',    name: 'Religious and Cultural Studies',   facultyCode: 'FHUM' },
  { code: 'TFS',    name: 'Theatre and Film Studies',         facultyCode: 'FHUM' },

  // FLAW — Faculty of Law
  { code: 'PBL',    name: 'Public Law',                    facultyCode: 'FLAW' },
  { code: 'PPL',    name: 'Private and Property Law',       facultyCode: 'FLAW' },
  { code: 'JIL',    name: 'Jurisprudence and International Law', facultyCode: 'FLAW' },
  { code: 'CIL',    name: 'Commercial and Industrial Law',  facultyCode: 'FLAW' },

  // FMS — Faculty of Management Sciences
  { code: 'ACC',    name: 'Accounting',                      facultyCode: 'FMS' },
  { code: 'FNB',    name: 'Finance and Banking',             facultyCode: 'FMS' },
  { code: 'MGT',    name: 'Management',                      facultyCode: 'FMS' },
  { code: 'MKT',    name: 'Marketing',                       facultyCode: 'FMS' },
  { code: 'HMT',    name: 'Hospitality Management and Tourism', facultyCode: 'FMS' },

  // FSCI — Faculty of Science
  { code: 'AEB',    name: 'Animal and Environmental Biology', facultyCode: 'FSCI' },
  { code: 'BCHSCI', name: 'Biochemistry',                     facultyCode: 'FSCI' },
  { code: 'GEO',    name: 'Geology',                          facultyCode: 'FSCI' },
  { code: 'MTS',    name: 'Mathematics and Statistics',       facultyCode: 'FSCI' },
  { code: 'MCB',    name: 'Microbiology',                     facultyCode: 'FSCI' },
  { code: 'PHS',    name: 'Physics',                          facultyCode: 'FSCI' },
  { code: 'PSB',    name: 'Plant Science and Biotechnology',  facultyCode: 'FSCI' },
  { code: 'PIC',    name: 'Pure and Industrial Chemistry',    facultyCode: 'FSCI' },

  // FSOC — Faculty of Social Sciences
  { code: 'ECO',    name: 'Economics',                              facultyCode: 'FSOC' },
  { code: 'GEM',    name: 'Geography and Environmental Management', facultyCode: 'FSOC' },
  { code: 'PAS',    name: 'Political and Administrative Studies',   facultyCode: 'FSOC' },
  { code: 'SOC',    name: 'Sociology',                              facultyCode: 'FSOC' },
]

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------
async function seedFacultiesAndDepartments() {
  try {
    console.log('[*] Connecting to MongoDB...')
    await mongoose.connect(process.env.DATABASE_URL!)
    console.log('[+] Connected to MongoDB')

    // -----------------------------------------------------------------------
    // Upsert faculties
    // -----------------------------------------------------------------------
    console.log(`\n[*] Upserting ${facultyData.length} faculties...`)

    let facultiesCreated = 0
    let facultiesSkipped = 0
    const facultyIdMap: Record<string, string> = {}

    for (const f of facultyData) {
      const existing = await Faculty.findOne({ $or: [{ code: f.code }, { name: f.name }] })

      const doc = await Faculty.findOneAndUpdate(
        { $or: [{ code: f.code }, { name: f.name }] },
        { $set: { name: f.name, code: f.code, ...(f.description ? { description: f.description } : {}) } },
        { upsert: true, new: true }
      )

      facultyIdMap[f.code] = doc!._id.toString()

      if (existing) {
        console.log(`[-] Skipped faculty: ${f.code} - ${f.name} (already exists)`)
        facultiesSkipped++
      } else {
        console.log(`[+] Created faculty: ${f.code} - ${f.name}`)
        facultiesCreated++
      }
    }

    // -----------------------------------------------------------------------
    // Upsert departments
    // -----------------------------------------------------------------------
    console.log(`\n[*] Upserting ${departmentsData.length} departments...`)

    let departmentsCreated = 0
    let departmentsSkipped = 0

    for (const d of departmentsData) {
      const existing = await Department.findOne({ $or: [{ code: d.code }, { name: d.name }] })

      await Department.findOneAndUpdate(
        { $or: [{ code: d.code }, { name: d.name }] },
        { $set: { name: d.name, code: d.code, facultyId: facultyIdMap[d.facultyCode] } },
        { upsert: true, new: true }
      )

      if (existing) {
        console.log(`[-] Skipped department: ${d.code} - ${d.name} (already exists)`)
        departmentsSkipped++
      } else {
        console.log(`[+] Created department: ${d.code} - ${d.name}`)
        departmentsCreated++
      }
    }

    // -----------------------------------------------------------------------
    // Summary
    // -----------------------------------------------------------------------
    console.log('\n[=] Seeding Summary:')
    console.log(`[+] Faculties created:    ${facultiesCreated}`)
    console.log(`[-] Faculties skipped:    ${facultiesSkipped}`)
    console.log(`[#] Faculties total:      ${facultyData.length}`)
    console.log(`[+] Departments created:  ${departmentsCreated}`)
    console.log(`[-] Departments skipped:  ${departmentsSkipped}`)
    console.log(`[#] Departments total:    ${departmentsData.length}`)
    console.log('\n[!] Faculties and departments seeding completed successfully!')

  } catch (error) {
    console.error('[X] Error seeding faculties/departments:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('[*] Database connection closed')
  }
}

// Run the seed function
seedFacultiesAndDepartments()
