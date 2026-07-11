import mongoose, { Schema, Model } from 'mongoose'

export interface IAuditLog {
  userId?:     mongoose.Types.ObjectId
  action:      string
  resource:    string
  resourceId?: string
  details?:    Record<string, unknown>
  ip:          string
  userAgent:   string
  success:     boolean
  createdAt:   Date
}

const auditSchema = new Schema<IAuditLog>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action:     { type: String, required: true, index: true },
    resource:   { type: String, required: true },
    resourceId: String,
    details:    Schema.Types.Mixed,
    ip:         { type: String, required: true },
    userAgent:  String,
    success:    { type: Boolean, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

auditSchema.index({ userId: 1, createdAt: -1 })
auditSchema.index({ action: 1, createdAt: -1 })

export const AuditLog:Model<IAuditLog> = mongoose.models.AuditLog as Model<IAuditLog>||mongoose.model<IAuditLog>('AuditLog', auditSchema)