import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDeadline extends Document {
  userId: string
  title: string
  description?: string
  courseCode?: string
  courseTitle?: string
  type: 'Assignment' | 'Exam' | 'Project' | 'Quiz' | 'Presentation' | 'Other'
  dueDate: Date
  isCompleted: boolean
  priority: 'Low' | 'Medium' | 'High'
  createdAt: Date
  updatedAt: Date
}

const DeadlineSchema = new Schema<IDeadline>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    courseCode: String,
    courseTitle: String,
    type: {
      type: String,
      enum: ['Assignment', 'Exam', 'Project', 'Quiz', 'Presentation', 'Other'],
      required: true
    },
    dueDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  },
  {
    timestamps: true
  }
)

DeadlineSchema.index({ userId: 1, dueDate: 1 })

const Deadline: Model<IDeadline> = mongoose.models.Deadline || mongoose.model<IDeadline>('Deadline', DeadlineSchema)

export default Deadline
