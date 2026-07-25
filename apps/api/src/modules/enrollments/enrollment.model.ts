import mongoose, { Schema, Model } from 'mongoose'

export interface IEnrollment {
  _id:              mongoose.Types.ObjectId
  user:             mongoose.Types.ObjectId
  course:           mongoose.Types.ObjectId
  progress:         number
  completedLessons: string[]
  status:           'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  enrolledAt:       Date
  completedAt?:     Date
  lastAccessedAt:   Date
  createdAt:        Date
  updatedAt:        Date
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user:             { type: Schema.Types.ObjectId, ref: 'User',   required: true, index: true },
    course:           { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    progress:         { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
    status:           { type: String, enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE', index: true },
    enrolledAt:       { type: Date, default: Date.now },
    completedAt:      Date,
    lastAccessedAt:   { type: Date, default: Date.now },
  },
  { timestamps: true },
)

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
enrollmentSchema.index({ user: 1, status: 1 })

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment as Model<IEnrollment> || mongoose.model<IEnrollment>('Enrollment', enrollmentSchema)
