import { Certificate, type ICertificate } from './certificate.model'

export class CertificatesRepository {
  findByEnrollment(enrollmentId: string) {
    return Certificate.findOne({ enrollment: enrollmentId })
  }

  findById(id: string) {
    return Certificate.findById(id).populate('user', 'firstName lastName').populate('course', 'title duration')
  }

  findByCertificateNumber(certificateNumber: string) {
    return Certificate.findOne({ certificateNumber })
      .populate('user', 'firstName lastName').populate('course', 'title duration')
  }

  findByNumberExists(certificateNumber: string) {
    return Certificate.exists({ certificateNumber })
  }

  create(data: Partial<ICertificate>) {
    return Certificate.create(data)
  }

  listForUser(userId: string) {
    return Certificate.find({ user: userId }).sort({ issuedAt: -1 }).populate('course', 'title thumbnail duration')
  }
}
