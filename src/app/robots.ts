import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/studio',
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: '/studio',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
