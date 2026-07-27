import { Payment, type IPayment } from './payment.model'

export class PaymentsRepository {
  findByTransactionUuid(transactionUuid: string) {
    return Payment.findOne({ transactionUuid })
  }

  create(data: Partial<IPayment>) {
    return Payment.create(data)
  }

  update(transactionUuid: string, data: Partial<IPayment>) {
    return Payment.findOneAndUpdate({ transactionUuid }, data, { new: true })
  }

  findPendingForUserAndCourse(userId: string, courseId: string) {
    return Payment.findOne({ user: userId, course: courseId, status: 'PENDING' }).sort({ createdAt: -1 })
  }

  listForUser(userId: string) {
    return Payment.find({ user: userId }).sort({ createdAt: -1 }).populate('course', 'title thumbnail slug')
  }
}
