import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAcademicSession extends Document {
  _id: string
  name: string
  startDate: Date
  endDate: Date
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
}

const AcademicSessionSchema = new Schema<IAcademicSession>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Indexes
AcademicSessionSchema.index({ name: 1 })
AcademicSessionSchema.index({ isCurrent: 1 })

const AcademicSession: Model<IAcademicSession> = mongoose.models.AcademicSession || mongoose.model<IAcademicSession>('AcademicSession', AcademicSessionSchema)

export default AcademicSession
