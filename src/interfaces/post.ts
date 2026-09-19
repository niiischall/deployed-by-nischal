import { type Author } from './author';

export type PostTag = {
  title: string;
  slug: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  updatedAt: string;
  coverImage: {
    url: string;
    alt: string;
  };
  ogImageUrl: string;
  author: Author;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  content: {
    markdown: string;
  };
  tags: PostTag[];
  preview?: boolean;
};
