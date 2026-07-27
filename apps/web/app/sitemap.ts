import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

interface SlugItem { slug: string; updatedAt?: string }

async function fetchAllSlugs(path: string, limit = 100): Promise<SlugItem[]> {
  try {
    const res = await fetch(`${API_URL}${path}?limit=${limit}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data ?? []) as SlugItem[]
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://bytherix.com'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/services`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/training`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/training/ai-ml`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/cyber-security`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/web-development`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/app-development`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/robotics`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/certificates/verify`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`,                     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/privacy-policy`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms-of-service`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const [courses, posts] = await Promise.all([
    fetchAllSlugs('/courses'),
    fetchAllSlugs('/posts'),
  ])

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${base}/training/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...courseRoutes, ...postRoutes]
}
