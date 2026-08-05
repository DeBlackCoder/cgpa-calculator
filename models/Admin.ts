import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin extends Document {
  _id: string
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

// Indexes
AdminSchema.index({ userId: 1 })

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
