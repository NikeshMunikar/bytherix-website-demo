import { CoursesRepository, type CourseListFilters } from './courses.repository'
import { NotFoundError, ConflictError }               from '../../shared/errors/AppError'
import type { ICourse }                                from './course.model'

const repo = new CoursesRepository()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export class CoursesService {
  list(filters: CourseListFilters) {
    return repo.findPublished(filters)
  }

  listForAdmin(filters: { q?: string; category?: string; page: number; limit: number }) {
    return repo.findAllForAdmin(filters)
  }

  async getBySlug(slug: string) {
    const course = await repo.findBySlug(slug)
    if (!course) throw new NotFoundError('Course')
    return course
  }

  async getById(id: string) {
    const course = await repo.findById(id)
    if (!course) throw new NotFoundError('Course')
    return course
  }

  async create(data: Partial<ICourse>, instructorId: string) {
    const slug     = slugify(data.slug ?? data.title ?? '')
    const existing = await repo.findBySlugAny(slug)
    if (existing) throw new ConflictError('A course with this slug already exists')

    return repo.create({ ...data, slug, instructor: instructorId as never })
  }

  async update(id: string, data: Partial<ICourse>) {
    const course = await repo.findById(id)
    if (!course) throw new NotFoundError('Course')

    if (data.slug || data.title) {
      const nextSlug = slugify(data.slug ?? data.title ?? course.slug)
      if (nextSlug !== course.slug) {
        const existing = await repo.findBySlugAny(nextSlug)
        if (existing) throw new ConflictError('A course with this slug already exists')
        data.slug = nextSlug
      } else {
        data.slug = nextSlug
      }
    }

    return repo.update(id, data)
  }

  async remove(id: string): Promise<void> {
    const course = await repo.findById(id)
    if (!course) throw new NotFoundError('Course')
    await repo.softDelete(id)
  }
}

export const coursesService = new CoursesService()
