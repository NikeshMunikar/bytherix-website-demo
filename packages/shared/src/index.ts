export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'

export interface AuthUser {
  _id:             string
  email:           string
  firstName:       string
  lastName:        string
  role:            UserRole
  avatar?:         string
  isEmailVerified: boolean
  createdAt:       string
  updatedAt:       string
}

export interface ApiResponse<T = unknown> {
  success:       boolean
  data?:         T
  error?:        string
  code?:         string
  correlationId?:string
}

export interface PaginatedResponse<T> {
  items:   T[]
  total:   number
  page:    number
  limit:   number
  pages:   number
}