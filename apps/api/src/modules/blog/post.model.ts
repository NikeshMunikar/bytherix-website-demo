import mongoose, { Schema, Model } from 'mongoose'

export interface IPost {
  _id:          mongoose.Types.ObjectId
  title:        string
  slug:         string
  excerpt:      string
  content:      string
  coverImage:   string
  author:       mongoose.Types.ObjectId
  tags:         string[]
  readTimeMins: number
  isPublished:  boolean
  publishedAt?: Date
  createdAt:    Date
  updatedAt:    Date
  deletedAt?:   Date
}

const postSchema = new Schema<IPost>(
  {
    title:        { type: String, required: true, trim: true, maxlength: 200 },
    slug:         { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt:      { type: String, required: true, maxlength: 500 },
    content:      { type: String, required: true },
    coverImage:   { type: String, required: true },
    author:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags:         [{ type: String, trim: true }],
    readTimeMins: { type: Number, default: 5, min: 1 },
    isPublished:  { type: Boolean, default: false, index: true },
    publishedAt:  Date,
    deletedAt:    { type: Date, default: null, index: true },
  },
  { timestamps: true },
)

postSchema.index({ isPublished: 1, publishedAt: -1 })
postSchema.index({ tags: 1, isPublished: 1 })
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' })

postSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<unknown, IPost>).where({ deletedAt: null });
  next()
})

export const Post: Model<IPost> =
  mongoose.models.Post as Model<IPost> || mongoose.model<IPost>('Post', postSchema)
