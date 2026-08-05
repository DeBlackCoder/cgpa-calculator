import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IDepartment extends Document {
  _id: Types.ObjectId
  name: string
  code: string
  description?: string
  facultyId: string
  createdAt: Date
  updatedAt: Date
}

const DepartmentSchema = new Schema<IDepartment>(
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
    facultyId: {
      type: String,
      required: true,
      ref: 'Faculty'
    }
  },
  {
    timestamps: true
  }
)

// Indexes
DepartmentSchema.index({ facultyId: 1 })

const Department: Model<IDepartment> = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema)

export default Department
