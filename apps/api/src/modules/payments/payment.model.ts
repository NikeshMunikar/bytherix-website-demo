import mongoose, { Schema, Model } from 'mongoose'

export type PaymentStatus = 'PENDING' | 'COMPLETE' | 'FAILED' | 'CANCELED'

export interface IPayment {
  _id:              mongoose.Types.ObjectId
  user:             mongoose.Types.ObjectId
  course:           mongoose.Types.ObjectId
  transactionUuid:  string
  amount:           number
  currency:         string
  gateway:          'esewa'
  gatewayRef?:      string
  status:           PaymentStatus
  createdAt:        Date
  completedAt?:     Date
}

const paymentSchema = new Schema<IPayment>(
  {
    user:            { type: Schema.Types.ObjectId, ref: 'User',   required: true, index: true },
    course:          { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    transactionUuid: { type: String, required: true, unique: true, index: true },
    amount:          { type: Number, required: true, min: 0 },
    currency:        { type: String, default: 'NPR' },
    gateway:         { type: String, enum: ['esewa'], default: 'esewa' },
    gatewayRef:      String,
    status:          { type: String, enum: ['PENDING', 'COMPLETE', 'FAILED', 'CANCELED'], default: 'PENDING', index: true },
    completedAt:     Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Payment: Model<IPayment> =
  mongoose.models.Payment as Model<IPayment> || mongoose.model<IPayment>('Payment', paymentSchema)
