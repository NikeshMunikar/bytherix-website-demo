import mongoose, { Schema, Model } from 'mongoose'

export interface IContactMessage {
  _id:        mongoose.Types.ObjectId
  name:       string
  email:      string
  subject:    string
  message:    string
  type:       'general' | 'course' | 'project' | 'quote'
  isResolved: boolean
  createdAt:  Date
}

const contactSchema = new Schema<IContactMessage>(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, trim: true, lowercase: true, index: true },
    subject:    { type: String, required: true, trim: true },
    message:    { type: String, required: true },
    type:       { type: String, enum: ['general', 'course', 'project', 'quote'], default: 'general', index: true },
    isResolved: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

contactSchema.index({ createdAt: -1 })

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage as Model<IContactMessage> ||
  mongoose.model<IContactMessage>('ContactMessage', contactSchema)
