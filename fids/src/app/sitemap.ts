import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://agri-flow-self.vercel.app'
  const currentDate = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
  
  const staticPages = [
    '',
    '/login',
    '/forgot-password',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return staticPages
}
