export type EmailJobData =
  | { type: 'verification';   to: string; data: { firstName: string; verifyUrl: string } }
  | { type: 'password-reset'; to: string; data: { firstName: string; resetUrl: string } }
  | { type: 'welcome';        to: string; data: { firstName: string } }
  | { type: 'contact-notify'; to: string; data: { name: string; email: string; subject: string; message: string; contactType: string } }
