import type { Metadata } from 'next'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } }

type Props = { params: Promise<{ slug: string }> }

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params
  return (
    <div className="pt-28 pb-20 bg-bx-navy min-h-screen">
      <div className="px-4">
        <h1 className="text-2xl font-bold text-bx-white text-center mb-8">Checkout</h1>
        <CheckoutSummary slug={slug} />
      </div>
    </div>
  )
}
