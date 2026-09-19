import { Post } from '@/interfaces/post';
import {
  allPostsQuery,
  allPostsWithContentQuery,
  postBySlugQuery,
} from './sanity/queries';
import { isSanityConfigured, sanityClient } from './sanity/client';
import { SanityPost } from './sanity/types';
import {
  resolveAvatarUrl,
  resolveOgImageUrl,
  resolveSanityImageUrl,
} from './sanity/image';

export const REVALIDATE_SECONDS = 60;

const mapSanityPostToPost = (post: SanityPost): Post => ({
  id: post._id,
  slug: post.slug?.current || '',
  title: post.title,
  subtitle: post.excerpt || '',
  publishedAt: post.publishedAt || new Date(0).toISOString(),
  updatedAt: post._updatedAt || post.publishedAt || new Date(0).toISOString(),
  coverImage: {
    url: resolveSanityImageUrl(post.coverImage, post.coverImageUrl),
    alt: post.coverImage?.alt || `Cover image for ${post.title}`,
  },
  ogImageUrl: resolveOgImageUrl(
    post.ogImage,
    post.coverImage,
    post.coverImageUrl,
  ),
  excerpt: post.excerpt || '',
  seoTitle: post.seoTitle,
  seoDescription: post.seoDescription,
  author: {
    name: post.author?.name || 'Unknown author',
    picture: resolveAvatarUrl(post.author?.picture),
  },
  content: {
    markdown: post.markdown || '',
  },
  tags:
    post.tags
      ?.filter((tag) => Boolean(tag.slug))
      .map((tag) => ({ title: tag.title, slug: tag.slug as string })) || [],
});

const fetchPosts = async (query: string): Promise<Post[]> => {
  if (!isSanityConfigured) {
    console.warn(
      'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.',
    );
    return [];
  }

  try {
    const posts = await sanityClient.fetch<SanityPost[]>(
      query,
      {},
      {
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    return posts.map(mapSanityPostToPost).filter((post) => Boolean(post.slug));
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error);
    return [];
  }
};

export const getAllPosts = async (): Promise<Post[]> =>
  fetchPosts(allPostsQuery);

// Carries every post body. Only for /feed.xml and /llms-full.txt.
export const getAllPostsWithContent = async (): Promise<Post[]> =>
  fetchPosts(allPostsWithContentQuery);

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    const post = await sanityClient.fetch<SanityPost | null>(
      postBySlugQuery,
      { slug },
      {
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    return post ? mapSanityPostToPost(post) : null;
  } catch (error) {
    console.error(`Failed to fetch post "${slug}" from Sanity:`, error);
    return null;
  }
};
