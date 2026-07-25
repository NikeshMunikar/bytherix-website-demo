import { Enrollment, type IEnrollment } from './enrollment.model'

export class EnrollmentsRepository {
  findByUserAndCourse(userId: string, courseId: string) {
    return Enrollment.findOne({ user: userId, course: courseId })
  }

  findById(id: string) {
    return Enrollment.findById(id)
  }

  create(data: Partial<IEnrollment>) {
    return Enrollment.create(data)
  }

  update(id: string, data: Partial<IEnrollment>) {
    return Enrollment.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  listForUser(userId: string) {
    return Enrollment.find({ user: userId })
      .sort({ lastAccessedAt: -1 })
      .populate('course', 'title slug thumbnail category level duration instructor')
  }
}
