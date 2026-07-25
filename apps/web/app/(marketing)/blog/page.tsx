import type { Metadata } from 'next'
import { BlogGrid } from '@/components/blog/BlogGrid'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on software development, cyber security, and technology from the Bytherix team.',
  alternates: { canonical: 'https://bytherix.com/blog' },
}

type Props = { searchParams: Promise<{ q?: string; tag?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const filters = await searchParams
  return (
    <section className="pt-28 pb-16 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-mono font-semibold text-bx-blue uppercase tracking-[0.2em] mb-3">Blog</p>
          <h1 className="text-4xl font-bold text-bx-white mb-4">Insights & Updates</h1>
          <p className="text-bx-slate">Tutorials, industry insights, and news from the Bytherix team.</p>
        </div>
        <BlogGrid filters={filters} />
      </div>
    </section>
  )
}
