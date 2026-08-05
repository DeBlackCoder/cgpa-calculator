import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IAdmin extends Document {
  _id: Types.ObjectId
  userId: string
  isSuperAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User'
    },
    isSuperAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Indexes (userId already has unique: true)

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
