import mongoose, { Schema, Document } from 'mongoose'

export interface IAIPredictionHistory extends Document {
  studentId: string
  timestamp: Date
  currentCGPA: number
  creditsEarned: number
  predictedFinalCGPA: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  confidenceLevel: 'high' | 'medium' | 'low'
  projections: {
    optimistic: number
    realistic: number
    pessimistic: number
  }
  riskFactors: string[]
  recommendations: Array<{
    priority: string
    category: string
    title: string
    description: string
    actionItems: string[]
  }>
  milestones: Array<{
    semester: number
    targetGPA: number
    description: string
    achievable: boolean
  }>
  metadata: {
    semesterCount: number
    failedCourses: number
    level: number
    targetCGPA?: number
  }
}

const AIPredictionHistorySchema = new Schema<IAIPredictionHistory>({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  currentCGPA: {
    type: Number,
    required: true
  },
  creditsEarned: {
    type: Number,
    required: true
  },
  predictedFinalCGPA: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  confidenceLevel: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  projections: {
    optimistic: Number,
    realistic: Number,
    pessimistic: Number
  },
  riskFactors: [String],
  recommendations: [{
    priority: String,
    category: String,
    title: String,
    description: String,
    actionItems: [String]
  }],
  milestones: [{
    semester: Number,
    targetGPA: Number,
    description: String,
    achievable: Boolean
  }],
  metadata: {
    semesterCount: Number,
    failedCourses: Number,
    level: Number,
    targetCGPA: Number
  }
}, {
  timestamps: true
})

// Index for efficient querying
AIPredictionHistorySchema.index({ studentId: 1, timestamp: -1 })

export default mongoose.models.AIPredictionHistory || 
  mongoose.model<IAIPredictionHistory>('AIPredictionHistory', AIPredictionHistorySchema)
