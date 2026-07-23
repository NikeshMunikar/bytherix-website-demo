import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard/', '/my-learning/', '/profile/', '/settings/', '/api/'] }],
    sitemap: 'https://bytherix.com/sitemap.xml',
    host: 'https://bytherix.com',
  }
}