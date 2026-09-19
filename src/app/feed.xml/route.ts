import { getAllPostsWithContent } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants';

export const revalidate = 3600;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const forFeed = (html: string) =>
  html
    .replace(/]]>/g, ']]]]><![CDATA[>')
    .replace(/(href|src)="\//g, `$1="${SITE_URL}/`);

export async function GET() {
  const posts = await getAllPostsWithContent();
  const lastBuildDate = new Date(
    posts[0]?.updatedAt || Date.now(),
  ).toUTCString();

  const items = (
    await Promise.all(
      posts.map(async (post) => {
        const title = escapeXml(post.title);
        const description = escapeXml(
          post.excerpt ||
            post.subtitle ||
            `Read ${post.title} on ${SITE_NAME}.`,
        );
        const url = `${SITE_URL}/posts/${post.slug}`;
        const author = escapeXml(post.author.name || AUTHOR_NAME);
        const pubDate = new Date(post.publishedAt).toUTCString();
        const { html } = await markdownToHtml(post.content.markdown || '');

        return [
          '<item>',
          `<title>${title}</title>`,
          `<link>${url}</link>`,
          `<guid isPermaLink="true">${url}</guid>`,
          `<description>${description}</description>`,
          `<content:encoded><![CDATA[${forFeed(html)}]]></content:encoded>`,
          `<author>${author}</author>`,
          `<pubDate>${pubDate}</pubDate>`,
          ...post.tags.map(
            (tag) => `<category>${escapeXml(tag.title)}</category>`,
          ),
          '</item>',
        ].join('');
      }),
    )
  ).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
