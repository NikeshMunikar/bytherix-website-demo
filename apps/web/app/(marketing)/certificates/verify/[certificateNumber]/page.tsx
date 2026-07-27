import type { Metadata } from 'next'
import { CheckCircle2, XCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Props = { params: Promise<{ certificateNumber: string }> }

interface VerifyResult {
  valid: boolean
  studentName: string
  courseTitle: string
  certificateNumber: string
  issuedAt: string
}

async function verifyCertificate(certificateNumber: string): Promise<VerifyResult | null> {
  try {
    const res = await fetch(`${API_URL}/certificates/verify/${encodeURIComponent(certificateNumber)}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as VerifyResult
  } catch {
    return null
  }
}

export const metadata: Metadata = { title: 'Verify Certificate', robots: { index: false, follow: false } }

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificateNumber } = await params
  const result = await verifyCertificate(certificateNumber)

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-24 px-4 bg-bx-navy">
      <div className="bx-card rounded-2xl p-8 max-w-md w-full text-center">
        {result?.valid ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-bx-green/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-bx-green-light" />
            </div>
            <p className="text-bx-white font-semibold text-lg mb-1">Certificate Verified</p>
            <p className="text-bx-slate text-sm mb-6">This is a valid Bytherix certificate.</p>
            <div className="text-left space-y-3 border-t border-bx-border pt-5">
              <div>
                <p className="text-xs text-bx-muted">Awarded to</p>
                <p className="text-bx-white font-medium">{result.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-bx-muted">Course</p>
                <p className="text-bx-white font-medium">{result.courseTitle}</p>
              </div>
              <div>
                <p className="text-xs text-bx-muted">Issued</p>
                <p className="text-bx-white font-medium">
                  {new Date(result.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-bx-muted">Certificate number</p>
                <p className="text-bx-white font-mono text-sm">{result.certificateNumber}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-bx-red/15 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-bx-red" />
            </div>
            <p className="text-bx-white font-semibold text-lg mb-1">Certificate Not Found</p>
            <p className="text-bx-slate text-sm">We couldn&apos;t verify a certificate with that number.</p>
          </>
        )}
      </div>
    </div>
  )
}
