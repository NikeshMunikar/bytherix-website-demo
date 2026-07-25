export interface AdminStats {
  totalUsers:         number
  newUsersThisWeek:   number
  totalCourses:       number
  publishedCourses:   number
  totalEnrollments:   number
  activeEnrollments:  number
  unresolvedMessages: number
  estimatedRevenue:   number
}

export interface AdminUser {
  _id:              string
  email:            string
  firstName:        string
  lastName:         string
  role:             'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
  isActive:         boolean
  isEmailVerified:  boolean
  avatar?:          string
  createdAt:        string
}

export interface AuditLogEntry {
  _id:         string
  userId?:     { _id: string; firstName: string; lastName: string; email: string } | string
  action:      string
  resource:    string
  resourceId?: string
  ip:          string
  userAgent?:  string
  success:     boolean
  createdAt:   string
}

export interface AdminSession {
  _id:               string
  userId:            { _id: string; firstName: string; lastName: string; email: string } | string
  userAgent:         string
  ip:                string
  isRevoked:         boolean
  expiresAt:         string
  lastUsedAt:        string
  createdAt:         string
}
