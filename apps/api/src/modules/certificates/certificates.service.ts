import crypto from 'crypto'
import { CertificatesRepository }                     from './certificates.repository'
import { Enrollment }                                  from '../enrollments/enrollment.model'
import { NotFoundError, ForbiddenError }                from '../../shared/errors/AppError'
import type { UserRole }                                from '../users/user.types'

const repo = new CertificatesRepository()
const STAFF_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN']

async function generateUniqueCertificateNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `BX-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    const exists = await repo.findByNumberExists(candidate)
    if (!exists) return candidate
  }
  throw new Error('Could not generate a unique certificate number')
}

export class CertificatesService {
  // Idempotent — safe to call every time an enrollment's progress is updated
  async issueForEnrollmentIfEligible(enrollmentId: string) {
    const enrollment = await Enrollment.findById(enrollmentId)
    if (!enrollment || enrollment.status !== 'COMPLETED') return null

    const existing = await repo.findByEnrollment(enrollmentId)
    if (existing) return existing

    const certificateNumber = await generateUniqueCertificateNumber()
    return repo.create({
      certificateNumber,
      user:       enrollment.user,
      course:     enrollment.course,
      enrollment: enrollment._id,
    })
  }

  listForUser(userId: string) {
    return repo.listForUser(userId)
  }

  async getForDownload(id: string, requesterId: string, role: UserRole) {
    const certificate = await repo.findById(id)
    if (!certificate) throw new NotFoundError('Certificate')

    const isStaff = STAFF_ROLES.includes(role)
    const isOwner = certificate.user._id.toString() === requesterId
    if (!isStaff && !isOwner) throw new ForbiddenError('This certificate does not belong to you')

    return certificate
  }

  async verify(certificateNumber: string) {
    const certificate = await repo.findByCertificateNumber(certificateNumber)
    if (!certificate) throw new NotFoundError('Certificate')
    return certificate
  }
}

export const certificatesService = new CertificatesService()
