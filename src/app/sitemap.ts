import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { isSanityConfigured } from '@/lib/sanity/client';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  if (isSanityConfigured && posts.length === 0) {
    throw new Error('Refusing to emit an empty sitemap');
  }

  const latest = posts
    .map((post) => post.updatedAt)
    .sort()
    .at(-1);

  const tagLastModified = new Map<string, string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const current = tagLastModified.get(tag.slug);
      if (!current || post.updatedAt > current) {
        tagLastModified.set(tag.slug, post.updatedAt);
      }
    });
  });

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latest,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...Array.from(tagLastModified.entries()).map(([slug, lastModified]) => ({
      url: `${SITE_URL}/tags/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
