import { EnrollmentsRepository }                             from './enrollments.repository'
import { Course }                                             from '../courses/course.model'
import { NotFoundError, ConflictError, ForbiddenError }      from '../../shared/errors/AppError'
import type { IEnrollment }                                   from './enrollment.model'
import type { UserRole }                                      from '../users/user.types'

const repo = new EnrollmentsRepository()

function assertOwnership(enrollment: IEnrollment, userId: string, role: UserRole) {
  const isOwner = enrollment.user.toString() === userId
  const isStaff = role === 'ADMIN' || role === 'SUPER_ADMIN'
  if (!isOwner && !isStaff) throw new ForbiddenError()
}

export class EnrollmentsService {
  async enroll(userId: string, courseId: string) {
    const course = await Course.findById(courseId)
    if (!course || !course.isPublished) throw new NotFoundError('Course')

    const existing = await repo.findByUserAndCourse(userId, courseId)
    if (existing) throw new ConflictError('Already enrolled in this course')

    const enrollment = await repo.create({ user: userId as never, course: courseId as never })
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })
    return enrollment
  }

  listForUser(userId: string) {
    return repo.listForUser(userId)
  }

  async getProgress(enrollmentId: string, userId: string, role: UserRole) {
    const enrollment = await repo.findById(enrollmentId)
    if (!enrollment) throw new NotFoundError('Enrollment')
    assertOwnership(enrollment, userId, role)
    return enrollment
  }

  async updateProgress(
    enrollmentId: string,
    userId: string,
    role: UserRole,
    data: { progress?: number; completedLessons?: string[] },
  ) {
    const enrollment = await repo.findById(enrollmentId)
    if (!enrollment) throw new NotFoundError('Enrollment')
    assertOwnership(enrollment, userId, role)

    const patch: Partial<IEnrollment> = { lastAccessedAt: new Date() }
    if (data.completedLessons) patch.completedLessons = data.completedLessons
    if (data.progress !== undefined) {
      patch.progress = data.progress
      if (data.progress >= 100) {
        patch.status = 'COMPLETED'
        patch.completedAt = new Date()
      }
    }

    return repo.update(enrollmentId, patch)
  }
}

export const enrollmentsService = new EnrollmentsService()
