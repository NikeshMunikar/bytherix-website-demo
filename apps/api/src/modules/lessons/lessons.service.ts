import { LessonsRepository }   from './lessons.repository'
import { Enrollment }           from '../enrollments/enrollment.model'
import { NotFoundError }        from '../../shared/errors/AppError'
import type { ILesson }         from './lesson.model'
import type { UserRole }        from '../users/user.types'

const repo = new LessonsRepository()

const STAFF_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN']

function toPlain(lesson: ILesson) {
  return {
    _id: lesson._id, course: lesson.course, title: lesson.title, description: lesson.description,
    order: lesson.order, durationMins: lesson.durationMins, videoSource: lesson.videoSource,
    isPreview: lesson.isPreview, createdAt: lesson.createdAt, updatedAt: lesson.updatedAt,
  }
}

async function isEnrolled(userId: string | undefined, courseId: string): Promise<boolean> {
  if (!userId) return false
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId, status: { $ne: 'CANCELLED' } })
  return !!enrollment
}

export class LessonsService {
  async listForCourse(courseId: string, userId: string | undefined, role: UserRole | undefined) {
    const lessons  = await repo.findByCourse(courseId)
    const isStaff  = !!role && STAFF_ROLES.includes(role)
    const enrolled = isStaff ? true : await isEnrolled(userId, courseId)

    return lessons.map((lesson) => {
      const unlocked = isStaff || enrolled || lesson.isPreview
      return { ...toPlain(lesson), ...(unlocked ? { videoUrl: lesson.videoUrl } : {}), locked: !unlocked }
    })
  }

  async getById(id: string, userId: string | undefined, role: UserRole | undefined) {
    const lesson = await repo.findById(id)
    if (!lesson) throw new NotFoundError('Lesson')

    const isStaff  = !!role && STAFF_ROLES.includes(role)
    const enrolled = isStaff ? true : await isEnrolled(userId, lesson.course.toString())
    const unlocked = isStaff || enrolled || lesson.isPreview

    return { ...toPlain(lesson), ...(unlocked ? { videoUrl: lesson.videoUrl } : {}), locked: !unlocked }
  }

  async create(data: Partial<ILesson>) {
    if (data.order === undefined) {
      data.order = await repo.countByCourse(data.course as unknown as string)
    }
    return repo.create(data)
  }

  async update(id: string, data: Partial<ILesson>) {
    const lesson = await repo.findById(id)
    if (!lesson) throw new NotFoundError('Lesson')
    return repo.update(id, data)
  }

  async remove(id: string): Promise<void> {
    const lesson = await repo.findById(id)
    if (!lesson) throw new NotFoundError('Lesson')
    await repo.delete(id)
  }

  reorder(lessonIds: string[]) {
    return repo.reorder(lessonIds)
  }
}

export const lessonsService = new LessonsService()
