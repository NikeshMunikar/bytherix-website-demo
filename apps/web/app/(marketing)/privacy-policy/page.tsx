import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/common/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bytherix collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://bytherix.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 27, 2026">
      <p className="text-bx-slate leading-relaxed">
        This policy explains what personal information Bytherix (&quot;we&quot;, &quot;us&quot;) collects when you use
        bytherix.com and our related services (the &quot;Service&quot;), how we use it, and the choices you have.
        It is a plain-language summary and not a substitute for legal advice — if you need this reviewed for
        compliance with a specific jurisdiction&apos;s law (e.g. Nepal&apos;s Individual Privacy Act, GDPR, or others),
        please have it reviewed by counsel before relying on it.
      </p>

      <h2>1. Information we collect</h2>
      <p><strong>Account information:</strong> name, email address, and a securely hashed password (we never
        store your password in plain text — it is hashed with Argon2id before it touches our database).</p>
      <p><strong>Profile information:</strong> anything you choose to add, such as an avatar image.</p>
      <p><strong>Course activity:</strong> enrollments, lesson progress, quiz/completion status, and certificates
        earned.</p>
      <p><strong>Payment information:</strong> when you pay for a course, your payment is processed directly by
        eSewa. We receive confirmation of a successful transaction (amount, a transaction reference, and status) —
        we do not receive or store your eSewa password, PIN, or full payment credentials.</p>
      <p><strong>Communications:</strong> messages you send us through the contact form, and the content of any
        support emails you send us.</p>
      <p><strong>Technical data:</strong> IP address, browser/device information, and session identifiers, used for
        security (e.g. detecting suspicious logins) and to keep you signed in.</p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and manage your account, and to let you enroll in and complete courses.</li>
        <li>To process payments and issue enrollment confirmations and certificates.</li>
        <li>To send account-related emails: verification, password reset, and enrollment confirmations. You can
          turn off non-essential notifications in <Link href="/settings">Settings</Link>.</li>
        <li>To respond to messages sent through our contact form.</li>
        <li>To keep the Service secure — for example, rate-limiting login attempts and detecting unusual account
          activity.</li>
        <li>To improve the Service based on aggregate, non-identifying usage patterns.</li>
      </ul>

      <h2>3. Who we share information with</h2>
      <p>We do not sell your personal information. We share it only as needed to run the Service:</p>
      <ul>
        <li><strong>eSewa</strong> — to process course payments.</li>
        <li><strong>Our email delivery provider</strong> — to send transactional emails (verification, password
          reset, receipts).</li>
        <li><strong>Error monitoring tooling</strong> — to help us diagnose bugs; this may include limited technical
          context about an error, not your course content or messages.</li>
        <li>If required to comply with a valid legal request.</li>
      </ul>

      <h2>4. Cookies and sessions</h2>
      <p>We use a small number of cookies and browser storage mechanisms required for the Service to function: a
        secure, HttpOnly session cookie that keeps you signed in, and in-memory storage for your active session
        token (cleared when you close your browser). We do not use third-party advertising or tracking cookies.</p>

      <h2>5. Data retention</h2>
      <p>We keep your account information for as long as your account is active. If you delete your account (see
        <Link href="/settings"> Settings → Danger Zone</Link>), we deactivate it immediately and remove it from
        active use; some records (such as payment transaction logs) may be retained for a limited period where
        required for accounting, fraud-prevention, or legal purposes.</p>

      <h2>6. Your rights and choices</h2>
      <ul>
        <li>You can view and update your profile information at any time from your <Link href="/profile">Profile</Link> page.</li>
        <li>You can review and revoke active sign-in sessions from <Link href="/settings">Settings</Link>.</li>
        <li>You can turn off non-essential email notifications from <Link href="/settings">Settings</Link>.</li>
        <li>You can request deletion of your account and associated personal data at any time.</li>
      </ul>

      <h2>7. Children&apos;s privacy</h2>
      <p>The Service is not directed at children under 13, and we do not knowingly collect personal information
        from children under that age.</p>

      <h2>8. Changes to this policy</h2>
      <p>We may update this policy from time to time. If we make material changes, we&apos;ll update the date at
        the top of this page.</p>

      <h2>9. Contact us</h2>
      <p>Questions about this policy? Reach us at <a href="mailto:hello@bytherix.com">hello@bytherix.com</a> or
        through our <Link href="/contact">contact page</Link>.</p>
    </LegalPage>
  )
}
