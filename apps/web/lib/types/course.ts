export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type CourseBadge = 'BESTSELLER' | 'TOP_RATED' | 'POPULAR' | 'NEW'

export interface CourseInstructor {
  _id:       string
  firstName: string
  lastName:  string
  avatar?:   string
}

export interface Course {
  _id:             string
  title:           string
  slug:            string
  description:     string
  thumbnail:       string
  category:        string
  instructor:      CourseInstructor
  price:           number
  originalPrice:   number
  currency:        string
  rating:          number
  reviewCount:     number
  enrollmentCount: number
  duration:        number
  level:           CourseLevel
  tags:            string[]
  badge?:          CourseBadge
  isPublished:     boolean
  isFeatured:      boolean
  createdAt:       string
  updatedAt:       string
}

export interface PaginatedMeta {
  total: number
  page:  number
  limit: number
  pages: number
}

export interface CourseFilters {
  q?:        string
  category?: string
  level?:    CourseLevel
  featured?: boolean
  page?:     number
  limit?:    number
}
