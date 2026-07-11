import { z } from 'zod'

const passwordSchema = z
  .string().min(8).max(72)
  .regex(/[A-Z]/,          'Must include an uppercase letter')
  .regex(/[a-z]/,          'Must include a lowercase letter')
  .regex(/[0-9]/,          'Must include a number')
  .regex(/[^A-Za-z0-9]/,  'Must include a special character')

export const registerSchema = {
  body: z.object({
    firstName: z.string().min(2).max(50).trim(),
    lastName:  z.string().min(2).max(50).trim(),
    email:     z.string().email().toLowerCase(),
    password:  passwordSchema,
  }),
}

export const loginSchema = {
  body: z.object({
    email:    z.string().email().toLowerCase(),
    password: z.string().min(1),
  }),
}

export const forgotPasswordSchema = {
  body: z.object({ email: z.string().email().toLowerCase() }),
}

export const resetPasswordSchema = {
  body: z.object({
    token:    z.string().min(1),
    password: passwordSchema,
  }),
}

export const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword:     passwordSchema,
  }),
}

export const verifyEmailSchema = {
  query: z.object({ token: z.string().min(1) }),
}