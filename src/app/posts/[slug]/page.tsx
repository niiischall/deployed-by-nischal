import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, getAllPosts } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import { getLifetimePostViews } from '@/lib/posthog';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import DateFormatter from '@/app/_components/date-formatter';
import { JsonLd } from '@/app/_components/json-ld';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import { ReadingProgress } from '@/app/_components/reading-progress';
import { PostShare } from '@/app/_components/post-share';
import { PostToc } from '@/app/_components/post-toc';
import { calculateReadingTime, countWords, readingMinutes } from '@/lib/utils';
import {
  blogPostingNode,
  breadcrumbNode,
  personNode,
  websiteNode,
} from '@/lib/jsonLd';
import {
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/constants';

export const revalidate = 60;

const describe = (post: {
  seoDescription?: string;
  excerpt: string;
  subtitle: string;
  title: string;
}) =>
  post.seoDescription ||
  post.excerpt ||
  post.subtitle ||
  `Read ${post.title} on ${SITE_NAME}.`;

export default async function Post(props: Params) {
  const params = await props.params;
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const markdown = post.content.markdown || '';
  const { html, toc } = await markdownToHtml(markdown);
  const tocItems = toc.filter((item) => item.level <= 4) as {
    id: string;
    text: string;
    level: 2 | 3 | 4;
  }[];
  const readingTime = calculateReadingTime(markdown);
  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const lifetimeViews = await getLifetimePostViews(postUrl);
  const allPosts = await getAllPosts();
  const currentPostIndex = allPosts.findIndex(
    (entry) => entry.slug === post.slug,
  );
  const previousPost =
    currentPostIndex >= 0 ? allPosts[currentPostIndex + 1] : null;
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;
  const description = describe(post);
  const imageUrl = post.ogImageUrl || `${SITE_URL}/opengraph-image.png`;

  return (
    <main>
      <ReadingProgress
        contentSelector='#post-content'
        tracking={{ postSlug: post.slug, postTitle: post.title }}
      />
      <Container>
        <JsonLd
          nodes={[
            personNode(post.author.picture || undefined),
            websiteNode(),
            blogPostingNode({
              url: postUrl,
              title: post.title,
              description,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              image: imageUrl,
              tags: post.tags.map((tag) => tag.title),
              wordCount: countWords(markdown),
              readingMinutes: readingMinutes(markdown),
            }),
            breadcrumbNode([
              { name: 'Home', url: `${SITE_URL}/` },
              { name: post.title, url: postUrl },
            ]),
          ]}
        />
        <Header />
        <article className='mb-32'>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage.url}
            coverImageAlt={post.coverImage.alt}
            date={post.publishedAt}
            showDate={false}
          />
          <div className='max-w-2xl mx-auto'>
            <div className='mb-3 text-lg'>
              <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4'>
                <p className='inline-flex items-center gap-2'>
                  {post.author.picture ? (
                    <Image
                      src={post.author.picture}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className='h-7 w-7 rounded-full object-cover'
                    />
                  ) : null}
                  <span>{post.author.name}</span>
                </p>
                <p className='inline-flex items-center gap-2'>
                  <DateFormatter dateString={post.publishedAt} />
                </p>
                <p className='inline-flex items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    className='h-5 w-5'
                    aria-hidden='true'
                  >
                    <circle cx='12' cy='12' r='8.5' />
                    <path d='M12 7.5v5l3.5 2' />
                  </svg>
                  <span>{readingTime}</span>
                </p>
                {lifetimeViews !== null ? (
                  <p className='inline-flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.8'
                      className='h-5 w-5'
                      aria-hidden='true'
                    >
                      <path d='M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12Z' />
                      <circle cx='12' cy='12' r='3.25' />
                    </svg>
                    <span>{lifetimeViews.toLocaleString()} views</span>
                  </p>
                ) : null}
              </div>
            </div>
            {post.tags?.length ? (
              <div className='mb-6 flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className='rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-sky-600 hover:text-sky-700 dark:border-slate-500 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-400'
                  >
                    {tag.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {tocItems.length > 0 ? (
            <div className='max-w-2xl mx-auto mb-8'>
              <div className='max-w-xl rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80'>
                <p className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300'>
                  On this page
                </p>
                <nav aria-label='Table of contents'>
                  <PostToc
                    items={tocItems}
                    postSlug={post.slug}
                    postTitle={post.title}
                  />
                </nav>
              </div>
            </div>
          ) : null}
          <div className='mt-10'>
            <PostBody content={html} />
          </div>
          <PostShare
            title={post.title}
            postUrl={postUrl}
            postSlug={post.slug}
            coverImage={post.coverImage.url}
          />
          {previousPost || nextPost ? (
            <section className='mx-auto mt-12 max-w-2xl border-t border-slate-300/70 pt-8 dark:border-slate-700/80'>
              <h2 className='mb-4 text-3xl leading-snug'>Keep reading</h2>
              <nav
                aria-label='Post navigation'
                className='grid gap-4 md:grid-cols-2'
              >
                <div>
                  {previousPost ? (
                    <Link
                      href={`/posts/${previousPost.slug}`}
                      className='group block rounded-md border border-transparent p-3 transition-colors hover:border-slate-300 hover:bg-white/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
                    >
                      {previousPost.coverImage.url ? (
                        <div className='mb-3 overflow-hidden rounded-md'>
                          <Image
                            src={previousPost.coverImage.url}
                            alt={previousPost.coverImage.alt}
                            width={640}
                            height={360}
                            className='h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]'
                          />
                        </div>
                      ) : null}
                      <p className='text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300'>
                        Previous Post
                      </p>
                      <p className='mt-1 text-lg text-slate-800 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-400'>
                        ← {previousPost.title}
                      </p>
                    </Link>
                  ) : null}
                </div>
                <div className='md:text-right'>
                  {nextPost ? (
                    <Link
                      href={`/posts/${nextPost.slug}`}
                      className='group block rounded-md border border-transparent p-3 transition-colors hover:border-slate-300 hover:bg-white/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
                    >
                      {nextPost.coverImage.url ? (
                        <div className='mb-3 overflow-hidden rounded-md'>
                          <Image
                            src={nextPost.coverImage.url}
                            alt={nextPost.coverImage.alt}
                            width={640}
                            height={360}
                            className='h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]'
                          />
                        </div>
                      ) : null}
                      <p className='text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300'>
                        Next Post
                      </p>
                      <p className='mt-1 text-lg text-slate-800 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-400'>
                        {nextPost.title} →
                      </p>
                    </Link>
                  ) : null}
                </div>
              </nav>
            </section>
          ) : null}
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = post.seoTitle || post.title;
  const brandedTitle = `${title} | ${SITE_NAME}`;
  const description = describe(post);
  const canonicalUrl = `${SITE_URL}/posts/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      types: {
        'application/rss+xml': `${SITE_URL}/feed.xml`,
        'text/markdown': `${canonicalUrl}/raw`,
      },
    },
    openGraph: {
      type: 'article',
      title: brandedTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      authors: [post.author.name],
      tags: post.tags.map((tag) => tag.title),
      // Explicit images intentionally override the file-convention default card.
      ...(post.ogImageUrl
        ? {
            images: [
              {
                url: post.ogImageUrl,
                width: 1200,
                height: 630,
                alt: post.coverImage.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
