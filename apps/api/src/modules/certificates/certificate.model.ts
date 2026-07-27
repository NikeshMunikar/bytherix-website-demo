import mongoose, { Schema, Model } from 'mongoose'

export interface ICertificate {
  _id:               mongoose.Types.ObjectId
  certificateNumber: string
  user:              mongoose.Types.ObjectId
  course:            mongoose.Types.ObjectId
  enrollment:        mongoose.Types.ObjectId
  issuedAt:          Date
  createdAt:         Date
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: { type: String, required: true, unique: true, index: true },
    user:              { type: Schema.Types.ObjectId, ref: 'User',       required: true, index: true },
    course:            { type: Schema.Types.ObjectId, ref: 'Course',     required: true },
    enrollment:        { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, unique: true },
    issuedAt:          { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate as Model<ICertificate> || mongoose.model<ICertificate>('Certificate', certificateSchema)
