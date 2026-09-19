import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { JsonLd } from '@/app/_components/json-ld';
import { PostPreview } from '@/app/_components/post-preview';
import { TagFilters } from '@/app/_components/tag-filters';
import { getAllPosts } from '@/lib/api';
import { breadcrumbNode, collectionPageNode } from '@/lib/jsonLd';
import { AUTHOR_NAME, SITE_URL } from '@/lib/constants';
import { Post, PostTag } from '@/interfaces/post';

export const revalidate = 60;

type Params = {
  params: Promise<{ slug: string }>;
};

const describeTag = (tag: PostTag, count: number) =>
  `${count} ${count === 1 ? 'writeup' : 'writeups'} on ${tag.title} by ${AUTHOR_NAME}.`;

const findTagged = (posts: Post[], slug: string) => {
  const tagged = posts.filter((post) =>
    post.tags.some((tag) => tag.slug === slug),
  );
  const tag = tagged[0]?.tags.find((entry) => entry.slug === slug);
  return { tagged, tag };
};

const sortedTags = (posts: Post[]) =>
  Array.from(
    new Map(
      posts.flatMap((post) => post.tags).map((tag) => [tag.slug, tag]),
    ).values(),
  ).sort((first, second) => first.title.localeCompare(second.title));

export default async function TagPage(props: Params) {
  const { slug } = await props.params;
  const allPosts = await getAllPosts();
  const { tagged, tag } = findTagged(allPosts, slug);

  if (!tag) {
    return notFound();
  }

  const tagUrl = `${SITE_URL}/tags/${slug}`;

  return (
    <main>
      <Container>
        <JsonLd
          nodes={[
            collectionPageNode({
              url: tagUrl,
              name: tag.title,
              description: describeTag(tag, tagged.length),
              items: tagged.map((post) => ({
                url: `${SITE_URL}/posts/${post.slug}`,
                name: post.title,
              })),
            }),
            breadcrumbNode([
              { name: 'Home', url: `${SITE_URL}/` },
              { name: tag.title, url: tagUrl },
            ]),
          ]}
        />
        <Header />
        <h1 className='mb-6 text-5xl font-bold tracking-tighter leading-tight'>
          {tag.title}
        </h1>
        <p className='mb-12 text-lg text-neutral-600 dark:text-slate-300'>
          {describeTag(tag, tagged.length)}
        </p>
        <TagFilters tags={sortedTags(allPosts)} activeTag={slug} />
        <div className='grid grid-cols-1 gap-y-20 mb-32'>
          {tagged.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage.url}
              coverImageAlt={post.coverImage.alt}
              date={post.publishedAt}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { slug } = await props.params;
  const { tagged, tag } = findTagged(await getAllPosts(), slug);

  if (!tag) {
    return {};
  }

  const description = describeTag(tag, tagged.length);

  return {
    title: tag.title,
    description,
    alternates: { canonical: `/tags/${slug}` },
    openGraph: {
      type: 'website',
      url: `/tags/${slug}`,
      title: tag.title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return sortedTags(posts).map((tag) => ({ slug: tag.slug }));
}
