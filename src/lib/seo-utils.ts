import type { Metadata } from 'next';

export function generateInspiredContentMetadata(content: any): Metadata {
  const title = content.title + ' | MediFly Healthcare';
  const description = content.meta_description || content.excerpt || content.subtitle || 
    `Discover ${content.title.toLowerCase()} with MediFly's curated healthcare recommendations.`;
  
  const url = `https://medifly.com/inspired/${content.slug}`;
  const imageUrl = content.featured_image_url || 'https://medifly.com/images/og-image.jpg';

  return {
    title,
    description,
    keywords: generateKeywords(content),
    openGraph: {
      title,
      description,
      url,
      siteName: 'MediFly Healthcare',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@MediFly',
    },
    alternates: {
      canonical: url,
    },
    other: {
      'article:published_time': content.published_at || content.created_at,
      'article:modified_time': content.updated_at,
      'article:author': 'MediFly Editorial Team',
      'article:section': 'Healthcare',
    },
  };
}

function generateKeywords(content: any): string {
  const keywords = ['medical tourism', 'healthcare', 'hospitals'];
  
  // Add location-based keywords
  if (content.target_country) {
    keywords.push(content.target_country.replace('_', ' '));
  }
  if (content.target_city) {
    keywords.push(content.target_city);
  }
  
  // Add specialty keywords
  if (content.target_specialty) {
    keywords.push(content.target_specialty);
  }
  
  // Add category keywords
  if (content.category) {
    keywords.push(content.category.name.toLowerCase());
  }
  
  // Add content type keywords
  if (content.content_type) {
    const typeKeywords: Record<string, string[]> = {
      hospital_list: ['best hospitals', 'top hospitals', 'hospital ranking'],
      treatment_guide: ['medical treatment', 'procedures', 'treatment options'],
      specialty_guide: ['medical specialties', 'specialized care'],
      location_guide: ['medical destinations', 'healthcare travel'],
      comparison_guide: ['hospital comparison', 'treatment comparison'],
    };
    keywords.push(...(typeKeywords[content.content_type] || []));
  }
  
  return keywords.join(', ');
}

export function generateBreadcrumbs(content: any) {
  return [
    { name: 'Home', href: '/' },
    { name: 'Get Inspired', href: '/inspired' },
    { 
      name: content.category?.name || 'Healthcare', 
      href: `/inspired?category=${content.category?.id}` 
    },
    { name: content.title, href: `/inspired/${content.slug}` },
  ];
}

export function generateStructuredData(content: any) {
  const baseUrl = 'https://medifly.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.meta_description || content.excerpt || content.subtitle,
    image: content.featured_image_url || `${baseUrl}/images/og-image.jpg`,
    author: {
      '@type': 'Organization',
      name: 'MediFly Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MediFly',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    datePublished: content.published_at || content.created_at,
    dateModified: content.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/inspired/${content.slug}`,
    },
    articleSection: 'Healthcare',
    keywords: generateKeywords(content).split(', '),
    about: content.target_specialty ? {
      '@type': 'MedicalSpecialty',
      name: content.target_specialty,
    } : undefined,
    locationCreated: content.target_country && content.target_city ? {
      '@type': 'Place',
      name: `${content.target_city}, ${content.target_country.replace('_', ' ')}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: content.target_city,
        addressCountry: content.target_country.replace('_', ' '),
      },
    } : undefined,
  };
}