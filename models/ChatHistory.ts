import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IChatHistory extends Document {
  _id: string
  studentId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    studentId: {
      type: String,
      required: true,
      ref: 'Student'
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant']
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
)

// Indexes
ChatHistorySchema.index({ studentId: 1, timestamp: -1 })

const ChatHistory: Model<IChatHistory> = mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema)

export default ChatHistory
