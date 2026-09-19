type Props = {
  nodes: object[];
};

export function JsonLd({ nodes }: Props) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': nodes,
        }),
      }}
    />
  );
}
