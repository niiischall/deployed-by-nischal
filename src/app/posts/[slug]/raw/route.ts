import { REVALIDATE_SECONDS, fetchPostBySlug, getAllPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/constants';

export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const canonical = `${SITE_URL}/posts/${post.slug}`;

  const frontMatter = [
    '---',
    `title: ${post.title}`,
    `url: ${canonical}`,
    `published: ${post.publishedAt}`,
    `updated: ${post.updatedAt}`,
    `author: ${post.author.name}`,
    post.tags.length
      ? `tags: ${post.tags.map((tag) => tag.title).join(', ')}`
      : '',
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  return new Response(`${frontMatter}\n\n${post.content.markdown}`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Link: `<${canonical}>; rel="canonical"`,
      'Cache-Control': `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
    },
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
