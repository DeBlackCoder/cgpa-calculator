import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IResult extends Document {
  _id: string
  studentId: string
  courseId: string
  sessionId: string
  semester: number
  level: number
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  gradePoint: number
  creditUnits: number
  qualityPoints: number
  createdAt: Date
  updatedAt: Date
}

const ResultSchema = new Schema<IResult>(
  {
    studentId: {
      type: String,
      required: true,
      ref: 'Student'
    },
    courseId: {
      type: String,
      required: true,
      ref: 'Course'
    },
    sessionId: {
      type: String,
      required: true,
      ref: 'AcademicSession'
    },
    semester: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    level: {
      type: Number,
      required: true,
      enum: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D', 'E', 'F']
    },
    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    creditUnits: {
      type: Number,
      required: true,
      min: 0
    },
    qualityPoints: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes
ResultSchema.index({ studentId: 1, courseId: 1, sessionId: 1, semester: 1 }, { unique: true })
ResultSchema.index({ studentId: 1, level: 1, semester: 1 })
ResultSchema.index({ studentId: 1 })

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema)

export default Result
