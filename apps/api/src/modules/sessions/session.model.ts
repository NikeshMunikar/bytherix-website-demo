import mongoose, { Schema , Model} from 'mongoose'

export interface ISession {
  userId: mongoose.Types.ObjectId
  tokenHash: string
  userAgent: string
  ip: string
  deviceFingerprint: string
  isRevoked: boolean
  expiresAt: Date
  lastUsedAt: Date
  createdAt: Date
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    userAgent: { type: String, required: true },
    ip: { type: String, required: true },
    deviceFingerprint: { type: String, required: true },
    isRevoked: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

sessionSchema.index({ userId: 1, isRevoked: 1 })
sessionSchema.index({ tokenHash: 1, isRevoked: 1 })

export const Session: Model<ISession> =
  mongoose.models.Session as Model<ISession> || mongoose.model<ISession>('Session', sessionSchema)