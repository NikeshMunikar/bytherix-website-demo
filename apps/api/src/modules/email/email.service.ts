import { enqueueEmail } from './email.queue'
import { config }        from '../../config'

interface EmailableUser {
  email:     string
  firstName: string
}

export const emailService = {
  sendVerificationEmail(user: EmailableUser, token: string) {
    const verifyUrl = `${config.CLIENT_URL}/verify-email?token=${token}`
    return enqueueEmail({ type: 'verification', to: user.email, data: { firstName: user.firstName, verifyUrl } })
  },

  sendPasswordResetEmail(user: EmailableUser, token: string) {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`
    return enqueueEmail({ type: 'password-reset', to: user.email, data: { firstName: user.firstName, resetUrl } })
  },

  sendWelcomeEmail(user: EmailableUser) {
    return enqueueEmail({ type: 'welcome', to: user.email, data: { firstName: user.firstName } })
  },

  notifyTeamOfContactMessage(data: { name: string; email: string; subject: string; message: string; type: string }) {
    return enqueueEmail({
      type: 'contact-notify',
      to:   'hello@bytherix.com',
      data: { name: data.name, email: data.email, subject: data.subject, message: data.message, contactType: data.type },
    })
  },
}
