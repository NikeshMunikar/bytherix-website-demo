import { HydratedDocument, Types } from 'mongoose'

export type UserRole =
  | 'USER'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export interface IUser {
  _id: Types.ObjectId

  email: string
  password?: string

  firstName: string
  lastName: string

  role: UserRole

  isActive: boolean
  isEmailVerified: boolean

  emailVerificationToken?: string
  emailVerificationExpiry?: Date

  passwordResetToken?: string
  passwordResetExpiry?: Date

  avatar?: string
  lastLoginAt?: Date

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type UserDocument = HydratedDocument<IUser>

export interface UserListFilters {
  q?:    string
  role?: UserRole
}