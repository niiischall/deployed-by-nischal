import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { JsonLd } from '@/app/_components/json-ld';
import { Pagination } from '@/app/_components/pagination';
import { HeroPost } from '@/app/_components/hero-post';
import { MoreStories } from '@/app/_components/more-stories';
import { SectionSeparator } from '@/app/_components/section-separator';
import { TagFilters } from '@/app/_components/tag-filters';
import { getAllPosts } from '@/lib/api';
import { organizationNode, personNode, websiteNode } from '@/lib/jsonLd';
import { SITE_NAME } from '@/lib/constants';

export const revalidate = 60;

const POSTS_PER_PAGE = 5;

const HOME_TITLE = `${SITE_NAME} — engineering writeups`;
const HOME_DESCRIPTION =
  'Technical writeups by Nischal Nikit on system design, real-time systems, LLM agents and the web platform — built from hands-on experiments, not summaries.';

type SearchParams = Record<string, string | string[] | undefined>;

const parsePageValue = (value: string | string[] | undefined): number => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const parsedPage = Number.parseInt(firstValue || '1', 10);

  return Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
};

const parseTagValue = (value: string | string[] | undefined): string | null => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue?.trim() ? firstValue.trim() : null;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}): Promise<Metadata> {
  const page = parsePageValue((await searchParams)?.page);

  return {
    title: { absolute: HOME_TITLE },
    description: HOME_DESCRIPTION,
    alternates: {
      canonical: page > 1 ? `/?page=${page}` : '/',
      types: {
        'application/rss+xml': '/feed.xml',
        'text/plain': '/llms.txt',
      },
    },
  };
}

export default async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const resolvedSearchParams = (await searchParams) || {};
  const requestedPage = parsePageValue(resolvedSearchParams?.page);
  const requestedTag = parseTagValue(resolvedSearchParams?.tag);
  const allPosts = await getAllPosts();

  if (requestedTag) {
    const match = allPosts
      .flatMap((post) => post.tags)
      .find((tag) => tag.title === requestedTag || tag.slug === requestedTag);
    permanentRedirect(match ? `/tags/${match.slug}` : '/');
  }

  const heroPost = allPosts[0];
  const earlierDeployments = allPosts.length > 1 ? allPosts.slice(1) : [];
  const allTags = Array.from(
    new Map(
      allPosts.flatMap((post) => post.tags).map((tag) => [tag.slug, tag]),
    ).values(),
  ).sort((firstTag, secondTag) =>
    firstTag.title.localeCompare(secondTag.title),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(earlierDeployments.length / POSTS_PER_PAGE),
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const postsForCurrentPage = earlierDeployments.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  );

  const shouldRenderEarlierDeploymentsSection = earlierDeployments.length > 0;

  return (
    <main>
      <Container>
        <JsonLd
          nodes={[
            personNode(heroPost?.author.picture || undefined),
            organizationNode(),
            websiteNode(),
          ]}
        />
        <h1 className='sr-only'>{HOME_TITLE}</h1>
        <Header />
        {heroPost ? (
          <HeroPost
            title={heroPost.title}
            slug={heroPost.slug}
            coverImage={heroPost.coverImage.url}
            coverImageAlt={heroPost.coverImage.alt}
            date={heroPost.publishedAt}
            excerpt={heroPost.subtitle}
          />
        ) : (
          <p className='mb-16 text-lg'>No posts published yet.</p>
        )}
        {shouldRenderEarlierDeploymentsSection ? (
          <>
            <SectionSeparator />
            <MoreStories
              posts={postsForCurrentPage}
              filters={<TagFilters tags={allTags} activeTag={null} />}
            />
          </>
        ) : null}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Container>
    </main>
  );
};
