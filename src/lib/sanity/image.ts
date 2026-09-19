import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';
import { SanityImage } from './types';

const builder = createImageUrlBuilder(sanityClient);

export const resolveSanityImageUrl = (
  image: SanityImage | undefined,
  fallbackUrl?: string,
) => {
  if (image?.asset?._ref) {
    return builder.image(image).width(1300).height(630).fit('crop').url();
  }

  return fallbackUrl || '';
};

export const resolveOgImageUrl = (
  ogImage: SanityImage | undefined,
  coverImage: SanityImage | undefined,
  fallbackUrl?: string,
) => {
  const image = ogImage?.asset?._ref ? ogImage : coverImage;

  if (image?.asset?._ref) {
    return builder.image(image).width(1200).height(630).fit('crop').url();
  }

  return fallbackUrl || '';
};

export const resolveAvatarUrl = (image: SanityImage | undefined) => {
  if (image?.asset?._ref) {
    return builder.image(image).width(96).height(96).fit('crop').url();
  }

  return '';
};
