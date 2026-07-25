import type { EmailJobData } from './email.types'

const COLORS = {
  navy:       '#0A1628',
  card:       '#0D1A2E',
  border:     '#1E2D4A',
  slate:      '#8B9DC3',
  white:      '#F8FAFF',
  blue:       '#1452CC',
  blueLight:  '#2D6EEF',
  green:      '#16A34A',
  footerBg:   '#0b0f1a',
}

function layout(preheader: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:${COLORS.navy};font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;font-size:1px;color:${COLORS.navy};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.navy};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
            <tr>
              <td style="padding-bottom:24px;text-align:center;">
                <span style="font-size:20px;font-weight:bold;">
                  <span style="color:${COLORS.white};">By</span><span style="color:${COLORS.blueLight};">the</span><span style="color:${COLORS.green};">rix</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding-top:24px;text-align:center;">
                <p style="margin:0;color:${COLORS.slate};font-size:12px;">© ${new Date().getFullYear()} Bytherix. Build. Learn. Secure. Innovate.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function button(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${COLORS.blue};color:${COLORS.white};text-decoration:none;font-weight:bold;font-size:14px;padding:12px 24px;border-radius:12px;margin-top:16px;">${label}</a>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 12px;color:${COLORS.white};font-size:20px;">${text}</h1>`
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 12px;color:${COLORS.slate};font-size:14px;line-height:1.6;">${text}</p>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderEmail(job: EmailJobData): { subject: string; html: string } {
  switch (job.type) {
    case 'verification': {
      const body = `
        ${heading(`Welcome, ${job.data.firstName}!`)}
        ${paragraph('Confirm your email address to activate your Bytherix account and start learning.')}
        ${button('Verify email address', job.data.verifyUrl)}
        ${paragraph('This link expires in 24 hours. If you didn\'t create this account, you can ignore this email.')}
      `
      return { subject: 'Verify your Bytherix account', html: layout('Verify your email to activate your Bytherix account', body) }
    }

    case 'password-reset': {
      const body = `
        ${heading('Reset your password')}
        ${paragraph(`Hi ${job.data.firstName}, we received a request to reset your password.`)}
        ${button('Reset password', job.data.resetUrl)}
        ${paragraph('This link expires in 1 hour. If you didn\'t request this, you can safely ignore this email — your password won\'t change.')}
      `
      return { subject: 'Reset your Bytherix password', html: layout('Reset your Bytherix password', body) }
    }

    case 'welcome': {
      const body = `
        ${heading(`You're all set, ${job.data.firstName}!`)}
        ${paragraph('Your email is verified and your Bytherix account is ready. Explore courses in software development, cyber security, robotics and more.')}
        ${button('Browse courses', 'https://bytherix.com/training')}
      `
      return { subject: 'Welcome to Bytherix', html: layout('Your Bytherix account is ready', body) }
    }

    case 'contact-notify': {
      const body = `
        ${heading('New contact message')}
        ${paragraph(`<strong style="color:${COLORS.white}">From:</strong> ${escapeHtml(job.data.name)} (${escapeHtml(job.data.email)})`)}
        ${paragraph(`<strong style="color:${COLORS.white}">Type:</strong> ${escapeHtml(job.data.contactType)}`)}
        ${paragraph(`<strong style="color:${COLORS.white}">Subject:</strong> ${escapeHtml(job.data.subject)}`)}
        ${paragraph(escapeHtml(job.data.message).replace(/\n/g, '<br />'))}
      `
      return { subject: `New contact message: ${job.data.subject}`, html: layout('New contact message received', body) }
    }
  }
}
