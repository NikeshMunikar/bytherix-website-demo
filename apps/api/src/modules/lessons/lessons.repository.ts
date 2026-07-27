import { Lesson, type ILesson } from './lesson.model'

export class LessonsRepository {
  findByCourse(courseId: string) {
    return Lesson.find({ course: courseId }).sort({ order: 1, createdAt: 1 })
  }

  findById(id: string) {
    return Lesson.findById(id)
  }

  create(data: Partial<ILesson>) {
    return Lesson.create(data)
  }

  update(id: string, data: Partial<ILesson>) {
    return Lesson.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  delete(id: string) {
    return Lesson.findByIdAndDelete(id)
  }

  async reorder(lessonIds: string[]): Promise<void> {
    await Promise.all(lessonIds.map((id, index) => Lesson.findByIdAndUpdate(id, { order: index })))
  }

  countByCourse(courseId: string) {
    return Lesson.countDocuments({ course: courseId })
  }
}
