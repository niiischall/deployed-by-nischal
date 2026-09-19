import { REVALIDATE_SECONDS, getAllPosts } from '@/lib/api';
import { AUTHOR_NAME, AUTHOR_URL, SITE_NAME, SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export async function GET() {
  const posts = await getAllPosts();

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> Technical writeups by ${AUTHOR_NAME} on system design, real-time systems, LLM agents and the web platform. Every post below links to its raw Markdown — append \`/raw\` to any post URL to get clean source without the page chrome.`,
    '',
    '## Posts',
    '',
    ...posts.map((post) => {
      const meta = [
        post.publishedAt.slice(0, 10),
        post.tags.map((tag) => tag.title).join(', '),
      ]
        .filter(Boolean)
        .join(' · ');
      const excerpt = post.excerpt.replace(/\s+/g, ' ').trim();

      return `- [${post.title}](${SITE_URL}/posts/${post.slug}/raw): ${meta}${
        excerpt ? ` — ${excerpt}` : ''
      }`;
    }),
    '',
    '## Optional',
    '',
    `- [Full corpus](${SITE_URL}/llms-full.txt): every post's complete Markdown in one file`,
    `- [RSS feed](${SITE_URL}/feed.xml): full-text feed of new posts`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): canonical HTML URLs`,
    '',
    '## Citation',
    '',
    `- Cite the canonical HTML URL: ${SITE_URL}/posts/{slug}`,
    `- Author: ${AUTHOR_NAME} (${AUTHOR_URL})`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
    },
  });
}
