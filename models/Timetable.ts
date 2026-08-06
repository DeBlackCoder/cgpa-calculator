import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITimeSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  startTime: string // e.g., "08:00"
  endTime: string // e.g., "10:00"
  courseCode: string
  courseTitle: string
  venue: string
  lecturer?: string
  color?: string
}

export interface ITimetable extends Document {
  userId: string
  semester: string // e.g., "2023/2024 - First Semester"
  slots: ITimeSlot[]
  isPublic: boolean
  shareLink?: string
  createdAt: Date
  updatedAt: Date
}

const TimeSlotSchema = new Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  venue: { type: String, required: true },
  lecturer: String,
  color: String
})

const TimetableSchema = new Schema<ITimetable>(
  {
    userId: { type: String, required: true },
    semester: { type: String, required: true },
    slots: [TimeSlotSchema],
    isPublic: { type: Boolean, default: false },
    shareLink: String
  },
  {
    timestamps: true
  }
)

const Timetable: Model<ITimetable> = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema)

export default Timetable
