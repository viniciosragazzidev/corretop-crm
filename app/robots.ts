import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.venancor.com.br';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/crm', '/crm/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
