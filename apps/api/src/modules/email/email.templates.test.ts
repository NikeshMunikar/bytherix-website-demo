import { describe, it, expect } from 'vitest'
import { renderEmail } from './email.templates'

describe('renderEmail', () => {
  it('renders a verification email with the verify link and subject', () => {
    const { subject, html } = renderEmail({
      type: 'verification', to: 'a@b.com',
      data: { firstName: 'Ada', verifyUrl: 'https://bytherix.com/verify-email?token=abc' },
    })
    expect(subject).toMatch(/verify/i)
    expect(html).toContain('Ada')
    expect(html).toContain('https://bytherix.com/verify-email?token=abc')
  })

  it('renders a password-reset email with the reset link', () => {
    const { subject, html } = renderEmail({
      type: 'password-reset', to: 'a@b.com',
      data: { firstName: 'Grace', resetUrl: 'https://bytherix.com/reset-password?token=xyz' },
    })
    expect(subject).toMatch(/reset/i)
    expect(html).toContain('Grace')
    expect(html).toContain('https://bytherix.com/reset-password?token=xyz')
  })

  it('renders a welcome email', () => {
    const { subject, html } = renderEmail({ type: 'welcome', to: 'a@b.com', data: { firstName: 'Linus' } })
    expect(subject).toMatch(/welcome/i)
    expect(html).toContain('Linus')
  })

  it('renders a contact-notify email with all fields', () => {
    const { subject, html } = renderEmail({
      type: 'contact-notify', to: 'hello@bytherix.com',
      data: { name: 'Jane Doe', email: 'jane@example.com', subject: 'Question', message: 'Hi there', contactType: 'general' },
    })
    expect(subject).toContain('Question')
    expect(html).toContain('Jane Doe')
    expect(html).toContain('jane@example.com')
    expect(html).toContain('Hi there')
  })

  it('HTML-escapes user-supplied contact fields to prevent injection', () => {
    const { html } = renderEmail({
      type: 'contact-notify', to: 'hello@bytherix.com',
      data: {
        name:    '<script>alert(1)</script>',
        email:   'evil@example.com',
        subject: '<img src=x onerror=alert(2)>',
        message: 'Hello <b>world</b> & "quotes"',
        contactType: 'general',
      },
    })
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).not.toContain('<img src=x onerror=alert(2)>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;img src=x onerror=alert(2)&gt;')
    expect(html).toContain('&amp;')
    expect(html).toContain('&quot;quotes&quot;')
  })
})
