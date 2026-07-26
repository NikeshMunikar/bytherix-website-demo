import crypto from 'crypto'
import { PaymentsRepository }        from './payments.repository'
import { Course }                     from '../courses/course.model'
import { enrollmentsService }         from '../enrollments/enrollments.service'
import {
  buildEsewaPaymentForm, decodeEsewaCallback, verifyEsewaSignature, checkEsewaTransactionStatus,
} from './esewa.client'
import { NotFoundError, ConflictError, ValidationError } from '../../shared/errors/AppError'
import { config } from '../../config'

const repo = new PaymentsRepository()

export class PaymentsService {
  async initiate(userId: string, courseId: string) {
    const course = await Course.findById(courseId)
    if (!course || !course.isPublished) throw new NotFoundError('Course')

    // Free course — skip the payment gateway entirely
    if (course.price <= 0) {
      const enrollment = await this.enrollIdempotently(userId, courseId)
      return { free: true as const, enrollment }
    }

    const existingEnrollment = await enrollmentsService.findByUserAndCourse(userId, courseId)
    if (existingEnrollment) throw new ConflictError('Already enrolled in this course')

    const transactionUuid = crypto.randomUUID()
    await repo.create({ user: userId as never, course: courseId as never, transactionUuid, amount: course.price })

    const { formUrl, fields } = buildEsewaPaymentForm({
      amount:      course.price,
      transactionUuid,
      successUrl:  `${config.CLIENT_URL}/checkout/success`,
      failureUrl:  `${config.CLIENT_URL}/checkout/failure?transactionUuid=${transactionUuid}`,
    })

    return { free: false as const, formUrl, fields }
  }

  async verifyEsewaCallback(base64Data: string, requesterId: string) {
    let payload
    try {
      payload = decodeEsewaCallback(base64Data)
    } catch {
      throw new ValidationError('Malformed payment callback')
    }

    if (!verifyEsewaSignature(payload)) throw new ValidationError('Payment signature verification failed')

    const payment = await repo.findByTransactionUuid(payload.transaction_uuid)
    if (!payment) throw new NotFoundError('Payment')
    if (payment.user.toString() !== requesterId) throw new ValidationError('This payment does not belong to you')

    // Already finalized (e.g. the success page was reloaded) — idempotent
    if (payment.status === 'COMPLETE') {
      const enrollment = await this.enrollIdempotently(requesterId, payment.course.toString())
      return { payment, enrollment }
    }

    if (Number(payload.total_amount) !== payment.amount) {
      throw new ValidationError('Payment amount mismatch')
    }

    // Defense in depth: never trust the browser redirect alone
    const statusCheck = await checkEsewaTransactionStatus({
      transactionUuid: payment.transactionUuid,
      totalAmount:     payment.amount,
    })

    if (payload.status !== 'COMPLETE' || !statusCheck || statusCheck.status !== 'COMPLETE') {
      await repo.update(payment.transactionUuid, { status: 'FAILED' })
      throw new ValidationError('Payment was not completed')
    }

    const updated = await repo.update(payment.transactionUuid, {
      status: 'COMPLETE', gatewayRef: payload.transaction_code, completedAt: new Date(),
    })
    const enrollment = await this.enrollIdempotently(requesterId, payment.course.toString())

    return { payment: updated, enrollment }
  }

  async markFailed(transactionUuid: string): Promise<void> {
    const payment = await repo.findByTransactionUuid(transactionUuid)
    if (payment && payment.status === 'PENDING') {
      await repo.update(transactionUuid, { status: 'FAILED' })
    }
  }

  listForUser(userId: string) {
    return repo.listForUser(userId)
  }

  private async enrollIdempotently(userId: string, courseId: string) {
    try {
      return await enrollmentsService.enroll(userId, courseId)
    } catch (err) {
      if (err instanceof ConflictError) {
        return enrollmentsService.findByUserAndCourse(userId, courseId)
      }
      throw err
    }
  }
}

export const paymentsService = new PaymentsService()
