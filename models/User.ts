import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  name: string
  role: 'STUDENT' | 'ADMIN'
  adminRole?: 'SUPER_ADMIN' | 'SENIOR_ADMIN' | 'REGULAR_ADMIN'
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['STUDENT', 'ADMIN'],
      default: 'STUDENT'
    },
    adminRole: {
      type: String,
      enum: ['SUPER_ADMIN', 'SENIOR_ADMIN', 'REGULAR_ADMIN'],
      required: false
    },
    image: {
      type: String
    },
    emailVerified: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes
UserSchema.index({ role: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
