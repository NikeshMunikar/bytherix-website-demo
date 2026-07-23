import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://bytherix.com'
  const now = new Date()
  return [
    { url: base,                                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/services`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/training`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/training/ai-ml`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/cyber-security`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/web-development`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/app-development`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/training/robotics`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projects`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`,                     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
  ]
}