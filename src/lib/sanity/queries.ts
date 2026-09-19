import { groq } from 'next-sanity';

const postFields = `
  _id,
  _updatedAt,
  title,
  slug,
  excerpt,
  seoTitle,
  seoDescription,
  publishedAt,
  coverImage,
  coverImageUrl,
  ogImage,
  author->{
    _id,
    name,
    picture
  },
  tags[]->{
    _id,
    title,
    "slug": slug.current
  }
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields}
  }
`;

export const allPostsWithContentQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${postFields},
    markdown
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    markdown
  }
`;
