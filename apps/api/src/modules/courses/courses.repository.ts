import type { FilterQuery } from 'mongoose'
import { Course, type ICourse } from './course.model'

export interface CourseListFilters {
  q?:        string
  category?: string
  level?:    string
  featured?: boolean
  page:      number
  limit:     number
}

export class CoursesRepository {
  async findPublished(filters: CourseListFilters) {
    const query: FilterQuery<ICourse> = { isPublished: true }

    if (filters.category) query.category = new RegExp(`^${escapeRegex(filters.category)}$`, 'i')
    if (filters.level)    query.level    = filters.level
    if (filters.featured) query.isFeatured = true
    if (filters.q)        query.$text    = { $search: filters.q }

    const skip       = (filters.page - 1) * filters.limit
    const projection = filters.q ? { score: { $meta: 'textScore' } } : undefined
    const sort        = filters.q
      ? ({ score: { $meta: 'textScore' } } as Record<string, unknown>)
      : { createdAt: -1 as const }

    const [courses, total] = await Promise.all([
      Course.find(query, projection)
        .sort(sort as never)
        .skip(skip)
        .limit(filters.limit)
        .populate('instructor', 'firstName lastName avatar')
        .lean(),
      Course.countDocuments(query),
    ])

    return {
      courses,
      total,
      page:  filters.page,
      limit: filters.limit,
      pages: Math.max(Math.ceil(total / filters.limit), 1),
    }
  }

  async findAllForAdmin(filters: { q?: string; category?: string; page: number; limit: number }) {
    const query: FilterQuery<ICourse> = {}
    if (filters.category) query.category = new RegExp(`^${escapeRegex(filters.category)}$`, 'i')
    if (filters.q) query.$text = { $search: filters.q }

    const skip = (filters.page - 1) * filters.limit
    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .populate('instructor', 'firstName lastName avatar')
        .lean(),
      Course.countDocuments(query),
    ])

    return {
      courses,
      total,
      page:  filters.page,
      limit: filters.limit,
      pages: Math.max(Math.ceil(total / filters.limit), 1),
    }
  }

  findBySlug(slug: string) {
    return Course.findOne({ slug: slug.toLowerCase(), isPublished: true })
      .populate('instructor', 'firstName lastName avatar')
  }

  // Ignores publish state — used for slug-uniqueness checks and admin lookups
  findBySlugAny(slug: string) {
    return Course.findOne({ slug: slug.toLowerCase() })
  }

  findById(id: string) {
    return Course.findById(id)
  }

  create(data: Partial<ICourse>) {
    return Course.create(data)
  }

  update(id: string, data: Partial<ICourse>) {
    return Course.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  softDelete(id: string) {
    return Course.findByIdAndUpdate(id, { deletedAt: new Date(), isPublished: false }, { new: true })
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
