import mongoose, { Schema, Model } from 'mongoose'

export interface ICourse {
  _id:             string
  title:           string
  slug:            string
  description:     string
  thumbnail:       string
  category:        string
  instructor:      mongoose.Types.ObjectId
  price:           number
  originalPrice:   number
  currency:        string
  rating:          number
  reviewCount:     number
  enrollmentCount: number
  duration:        number
  level:           'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags:            string[]
  badge?:          'BESTSELLER' | 'TOP_RATED' | 'POPULAR' | 'NEW'
  isPublished:     boolean
  isFeatured:      boolean
  deletedAt?:      Date
  createdAt:       Date
  updatedAt:       Date
}

const courseSchema = new Schema<ICourse>(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true, index: true },
    description:     { type: String, required: true },
    thumbnail:       { type: String, required: true },
    category:        { type: String, required: true, index: true },
    instructor:      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price:           { type: Number, required: true, min: 0 },
    originalPrice:   { type: Number, required: true },
    currency:        { type: String, default: 'NPR' },
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:     { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    duration:        { type: Number, required: true },
    level:           { type: String, enum: ['BEGINNER','INTERMEDIATE','ADVANCED'], required: true },
    tags:            [{ type: String, index: true }],
    badge:           { type: String, enum: ['BESTSELLER','TOP_RATED','POPULAR','NEW'] },
    isPublished:     { type: Boolean, default: false, index: true },
    isFeatured:      { type: Boolean, default: false, index: true },
    deletedAt:       Date,
  },
  { timestamps: true },
)

courseSchema.index({ category: 1, isPublished: 1 })
courseSchema.index({ isFeatured: 1, isPublished: 1 })
courseSchema.index({ title: 'text', description: 'text', tags: 'text' })

export const Course:Model<ICourse> =
  mongoose.models.Course as Model<ICourse> || mongoose.model<ICourse>('Course', courseSchema)
