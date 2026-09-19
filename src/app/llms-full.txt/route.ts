import { getAllPostsWithContent } from '@/lib/api';
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPostsWithContent();

  const body = [
    `# ${SITE_NAME} — full corpus`,
    '',
    `> Every published post by ${AUTHOR_NAME}, complete Markdown, newest first. Each post carries its canonical URL — cite that, not this file.`,
    '',
    ...posts.map((post) =>
      [
        '---',
        '',
        `# ${post.title}`,
        `URL: ${SITE_URL}/posts/${post.slug}`,
        `Published: ${post.publishedAt.slice(0, 10)}`,
        post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10)
          ? `Updated: ${post.updatedAt.slice(0, 10)}`
          : '',
        post.tags.length
          ? `Tags: ${post.tags.map((tag) => tag.title).join(', ')}`
          : '',
        '',
        post.content.markdown,
        '',
      ]
        .filter(Boolean)
        .join('\n'),
    ),
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
