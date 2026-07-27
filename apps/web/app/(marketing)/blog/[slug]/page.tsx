import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft } from 'lucide-react'
import type { Post } from '@/lib/types/post'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Props = { params: Promise<{ slug: string }> }

async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as Post
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://bytherix.com/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, images: [post.coverImage] },
  }
}

// The actual data fetch is isolated in this inner async component so it can
// be wrapped in <Suspense> below — required by Next 16 Cache Components so
// this route's dynamic fetch doesn't block the shared marketing layout
// (Navbar reads usePathname) from prerendering statically.
async function BlogDetailContent({ params }: Props) {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) notFound()

  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean)

  return (
    <article className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-bx-slate hover:text-bx-white transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
        </Link>

        {post.tags[0] && <p className="text-xs text-bx-blue-light font-semibold mb-3 uppercase tracking-wide">{post.tags[0]}</p>}
        <h1 className="text-3xl sm:text-4xl font-bold text-bx-white mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-bx-muted mb-8">
          <span>{post.author.firstName} {post.author.lastName}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTimeMins} min read</span>
          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
        </div>

        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-bx-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-bx-slate leading-relaxed">{p}</p>
          ))}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-bx-border">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-bx-card border border-bx-border text-bx-slate">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function BlogDetailSkeleton() {
  return (
    <div className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 animate-pulse">
        <div className="h-64 sm:h-96 rounded-2xl bg-bx-border mb-10" />
        <div className="h-8 w-2/3 bg-bx-border rounded mb-4" />
        <div className="h-4 w-full bg-bx-border rounded mb-2" />
        <div className="h-4 w-5/6 bg-bx-border rounded" />
      </div>
    </div>
  )
}

export default function BlogDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailContent params={params} />
    </Suspense>
  )
}
