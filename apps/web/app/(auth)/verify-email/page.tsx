import type { Metadata } from 'next'
import { VerifyEmailView } from '@/components/auth/VerifyEmailView'

export const metadata: Metadata = { title: 'Verify Email', robots: { index: false, follow: false } }

type Props = { searchParams: Promise<{ token?: string }> }

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams
  return (
    <div className="w-full max-w-md text-center">
      <VerifyEmailView token={token ?? ''} />
    </div>
  )
}