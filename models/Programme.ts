import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IProgramme extends Document {
  _id: Types.ObjectId
  name: string
  code: string
  description?: string
  duration: number
  totalCredits: number
  departmentId: string
  createdAt: Date
  updatedAt: Date
}

const ProgrammeSchema = new Schema<IProgramme>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    totalCredits: {
      type: Number,
      required: true,
      min: 0
    },
    departmentId: {
      type: String,
      required: true,
      ref: 'Department'
    }
  },
  {
    timestamps: true
  }
)

// Indexes
ProgrammeSchema.index({ code: 1 })
ProgrammeSchema.index({ departmentId: 1 })

const Programme: Model<IProgramme> = mongoose.models.Programme || mongoose.model<IProgramme>('Programme', ProgrammeSchema)

export default Programme
