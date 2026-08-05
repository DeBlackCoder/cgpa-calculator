import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFaculty extends Document {
  _id: string
  name: string
  code: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const FacultySchema = new Schema<IFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    }
  },
  {
    timestamps: true
  }
)

// Indexes
FacultySchema.index({ name: 1 })
FacultySchema.index({ code: 1 })

const Faculty: Model<IFaculty> = mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema)

export default Faculty
