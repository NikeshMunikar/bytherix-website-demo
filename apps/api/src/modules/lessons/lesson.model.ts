import mongoose, { Schema, Model } from 'mongoose'

export interface ILesson {
  _id:          mongoose.Types.ObjectId
  course:       mongoose.Types.ObjectId
  title:        string
  description?: string
  order:        number
  durationMins: number
  videoSource:  'youtube' | 'vimeo' | 'upload' | 'external'
  videoUrl:     string
  isPreview:    boolean
  createdAt:    Date
  updatedAt:    Date
}

const lessonSchema = new Schema<ILesson>(
  {
    course:       { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title:        { type: String, required: true, trim: true, maxlength: 200 },
    description:  { type: String, maxlength: 2000 },
    order:        { type: Number, required: true, default: 0 },
    durationMins: { type: Number, required: true, min: 0, default: 5 },
    videoSource:  { type: String, enum: ['youtube', 'vimeo', 'upload', 'external'], required: true },
    videoUrl:     { type: String, required: true },
    isPreview:    { type: Boolean, default: false },
  },
  { timestamps: true },
)

lessonSchema.index({ course: 1, order: 1 })

export const Lesson: Model<ILesson> =
  mongoose.models.Lesson as Model<ILesson> || mongoose.model<ILesson>('Lesson', lessonSchema)
