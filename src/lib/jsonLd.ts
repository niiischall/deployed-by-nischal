import {
  AUTHOR_NAME,
  AUTHOR_SAME_AS,
  AUTHOR_URL,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
} from './constants';

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const personNode = (image?: string) => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
  sameAs: AUTHOR_SAME_AS,
  ...(image ? { image } : {}),
});

export const organizationNode = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
});

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: SITE_LANGUAGE,
  publisher: { '@id': ORGANIZATION_ID },
});

export const blogPostingNode = (post: {
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  tags: string[];
  wordCount: number;
  readingMinutes: number;
}) => ({
  '@type': 'BlogPosting',
  '@id': `${post.url}#article`,
  headline: post.title,
  description: post.description,
  url: post.url,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  image: [post.image],
  inLanguage: SITE_LANGUAGE,
  wordCount: post.wordCount,
  timeRequired: `PT${post.readingMinutes}M`,
  ...(post.tags.length
    ? {
        keywords: post.tags.join(', '),
        articleSection: post.tags[0],
        about: post.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
      }
    : {}),
  author: { '@id': PERSON_ID },
  publisher: { '@id': ORGANIZATION_ID },
  isPartOf: { '@id': WEBSITE_ID },
  mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
});

export const collectionPageNode = (collection: {
  url: string;
  name: string;
  description: string;
  items: { url: string; name: string }[];
}) => ({
  '@type': 'CollectionPage',
  '@id': `${collection.url}#collection`,
  url: collection.url,
  name: collection.name,
  description: collection.description,
  inLanguage: SITE_LANGUAGE,
  isPartOf: { '@id': WEBSITE_ID },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: collection.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  },
});

export const breadcrumbNode = (items: { name: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
