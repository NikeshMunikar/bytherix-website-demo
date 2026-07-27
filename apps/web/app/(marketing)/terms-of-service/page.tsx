import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/common/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing your use of Bytherix courses and services.',
  alternates: { canonical: 'https://bytherix.com/terms-of-service' },
}

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="July 27, 2026">
      <p className="text-bx-slate leading-relaxed">
        These terms govern your use of bytherix.com and the courses, content, and services we provide
        (the &quot;Service&quot;). By creating an account or purchasing a course, you agree to these terms. This is
        a plain-language draft and should be reviewed by counsel before being relied on as a binding legal
        agreement.
      </p>

      <h2>1. Your account</h2>
      <p>You must provide accurate information when registering and keep your password secure. You&apos;re
        responsible for activity that happens under your account. Tell us right away at
        <a href="mailto:hello@bytherix.com"> hello@bytherix.com</a> if you suspect unauthorized access.</p>

      <h2>2. Course enrollment and payment</h2>
      <ul>
        <li>Prices are listed in Nepalese Rupees (NPR) unless stated otherwise.</li>
        <li>Payments are processed by eSewa. Enrollment is confirmed once payment is verified.</li>
        <li><strong>Refunds:</strong> you may request a full refund within 7 days of purchase, provided you have
          completed less than 20% of the course content. Refund requests after that window, or after substantial
          completion, are considered on a case-by-case basis. Contact <a href="mailto:hello@bytherix.com">hello@bytherix.com</a> to
          request one.</li>
        <li>Free courses require no payment; enrollment is immediate.</li>
      </ul>

      <h2>3. Certificates</h2>
      <p>Certificates are issued automatically upon course completion and are tied to your account. They are
        non-transferable and represent completion of course content at the time it was taken — they are not
        professional accreditation or a guarantee of employment outcomes. Certificate authenticity can be checked
        at <Link href="/certificates/verify">our verification page</Link> using the certificate number.</p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Share your account, or course/lesson access, with people who haven&apos;t enrolled.</li>
        <li>Copy, redistribute, or resell course video content or materials.</li>
        <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the Service.</li>
        <li>Upload unlawful, infringing, or harmful content through the contact form, profile, or any other input.</li>
      </ul>

      <h2>5. Content ownership</h2>
      <p>Course videos, materials, and the Bytherix brand are owned by Bytherix or its instructors and licensed to
        you for personal, non-commercial learning use. Enrolling in a course does not transfer ownership of its
        content to you.</p>

      <h2>6. Account termination</h2>
      <p>You may delete your own account at any time from <Link href="/settings">Settings</Link>. We may suspend or
        terminate accounts that violate these terms, including fraudulent payment activity or abuse of other
        users or staff.</p>

      <h2>7. Disclaimers and limitation of liability</h2>
      <p>The Service is provided &quot;as is&quot;. We work to keep course content accurate and the platform
        available, but we don&apos;t guarantee uninterrupted access or specific learning or career outcomes. To the
        extent permitted by law, Bytherix is not liable for indirect or consequential damages arising from your use
        of the Service.</p>

      <h2>8. Governing law</h2>
      <p>These terms are governed by the laws of Nepal, without regard to conflict-of-law principles.</p>

      <h2>9. Changes to these terms</h2>
      <p>We may update these terms from time to time. Continued use of the Service after an update constitutes
        acceptance of the revised terms.</p>

      <h2>10. Contact us</h2>
      <p>Questions about these terms? Reach us at <a href="mailto:hello@bytherix.com">hello@bytherix.com</a> or
        through our <Link href="/contact">contact page</Link>.</p>
    </LegalPage>
  )
}
