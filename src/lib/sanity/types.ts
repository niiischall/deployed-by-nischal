export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
};

export type SanityAuthor = {
  _id: string;
  name: string;
  picture?: SanityImage;
};

export type SanityTag = {
  _id: string;
  title: string;
  slug?: string;
};

export type SanityPost = {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  coverImageUrl?: string;
  ogImage?: SanityImage;
  markdown?: string;
  author?: SanityAuthor;
  tags?: SanityTag[];
};
