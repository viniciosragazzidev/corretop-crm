import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://meucrm.com.br';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/resume',
          '/clients',
          '/planos',
          '/corretores',
          '/chat',
          '/dev-roadmap',
          '/settings',
          '/login'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
