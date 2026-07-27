import type { Metadata } from 'next'
import { VerifyLookupForm } from '@/components/common/VerifyLookupForm'

export const metadata: Metadata = {
  title: 'Verify a Certificate',
  description: 'Verify the authenticity of a Bytherix course completion certificate.',
  alternates: { canonical: 'https://bytherix.com/certificates/verify' },
}

export default function VerifyCertificateIndexPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-24 px-4 bg-bx-navy">
      <VerifyLookupForm />
    </div>
  )
}
