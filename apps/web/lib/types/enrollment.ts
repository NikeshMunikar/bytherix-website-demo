import type { Course } from './course'

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface EnrollmentCourse extends Pick<Course, '_id' | 'title' | 'slug' | 'thumbnail' | 'category' | 'level' | 'duration'> {
  instructor?: string
}

export interface Enrollment {
  _id:              string
  user:             string
  course:           EnrollmentCourse
  progress:         number
  completedLessons: string[]
  status:           EnrollmentStatus
  enrolledAt:       string
  completedAt?:     string
  lastAccessedAt:   string
  createdAt:        string
  updatedAt:        string
}
