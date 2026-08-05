import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudent extends Document {
  _id: string
  userId: string
  matricNumber: string
  facultyId: string
  departmentId: string
  programmeId: string
  level: number
  currentSession: string
  currentSemester: number
  admissionYear: number
  targetCGPA?: number
  creditsEarned: number
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User'
    },
    matricNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    facultyId: {
      type: String,
      required: true,
      ref: 'Faculty'
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department'
    },
    programmeId: {
      type: String,
      required: true,
      ref: 'Programme'
    },
    level: {
      type: Number,
      required: true,
      default: 100
    },
    currentSession: {
      type: String,
      required: true
    },
    currentSemester: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 2
    },
    admissionYear: {
      type: Number,
      required: true
    },
    targetCGPA: {
      type: Number,
      min: 0,
      max: 5
    },
    creditsEarned: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

// Indexes
StudentSchema.index({ userId: 1 })
StudentSchema.index({ matricNumber: 1 })
StudentSchema.index({ level: 1 })
StudentSchema.index({ facultyId: 1 })
StudentSchema.index({ departmentId: 1 })

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)

export default Student
