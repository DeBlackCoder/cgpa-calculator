import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICourse extends Document {
  _id: string
  code: string
  title: string
  creditUnits: number
  level: number
  semester: number
  departmentId: string
  description?: string
  isElective: boolean
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    creditUnits: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    level: {
      type: Number,
      required: true,
      enum: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    semester: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department'
    },
    description: {
      type: String
    },
    isElective: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Indexes
CourseSchema.index({ code: 1 })
CourseSchema.index({ level: 1, semester: 1 })
CourseSchema.index({ departmentId: 1 })

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)

export default Course
