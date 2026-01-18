import tellme_logo from '@/assets/images/tellme_logo.png';
import { Organization, WebSite, WithContext } from 'schema-dts';

export const organizationJsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tellme Digiinfotech Private Limited',
  legalName: 'Tellme Digiinfotech Private Limited',
  url: 'https://tellmemediahub.com',
  logo: `https://tellmemediahub.com${tellme_logo.src}`,
  telephone: '+917030238122',
  email: 'tellmedigi@outlook.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office No. 228, B Wing, Akshay Complex, Dhole Patil Road',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '411001',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+917030238122',
      email: 'tellmedigi@outlook.com',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
  ],
  // "faxNumber": "( 33 1) 42 68 53 01",
  // "member": [
  //   {
  //     "@type": "Organization"
  //   },
  //   {
  //     "@type": "Organization"
  //   }
  // ],
  // "alumni": [
  //   {
  //     "@type": "Person",
  //     "name": "Jack Dan"
  //   },
  //   {
  //     "@type": "Person",
  //     "name": "John Smith"
  //   }
  // ],
};

export const websiteJsonLd: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tellme Media Hub',
  url: 'https://tellmemediahub.com',
  copyrightHolder: organizationJsonLd,
  sameAs: [
    'https://www.facebook.com/Tellme360/',
    'https://x.com/TeamIndiacom',
    'https://www.instagram.com/tellme360/',
    'https://www.youtube.com/channel/UCtp_qdzendr0tf5_tpR9vPg',
    'https://www.linkedin.com/company/tellme-digiinfotech-private-limited/',
    'https://www.pinterest.co.uk/Tellme360/',
  ],
  keywords:
    'tellme,360,mediahub,videohub,tellme360mediahub,tellme Media Hub,videos,tellme360,stock videos,nature',
  description:
    'Welcome to TellMe Media Hub, the ultimate resource for high-quality. diverse, and captivating stock footage of all travel and tourism points across the nation.We provide RAW footage straight from the camera to give you the entire editorial control. Search below to find your desired footage.',
  video: {
    '@type': 'VideoObject',
    name: 'Tellme 360 WebSite Video',
    description:
      'Welcome to TellMe Media Hub, the ultimate resource for high-quality. diverse, and captivating stock footage of all travel and tourism points across the nation.We provide RAW footage straight from the camera to give you the entire editorial control. Search below to find your desired footage.',
    contentUrl: 'https://tellmemediahub.com/bg_video.mp4',
  },
  // potentialAction: {
  //   '@type': 'SearchAction',
  //   target: {
  //     '@type': 'EntryPoint',
  //     urlTemplate: 'https://tellmemediahub.com/search/videos?query={search_term_string}',
  //   },
  //   'query-input': 'required name=search_term_string',
  // },
  // potentialAction: {
  //   '@type': 'SearchAction',
  //   target: {
  //     '@type': 'EntryPoint',
  //     urlTemplate:
  //       'https://tellmemediahub.com/yellow-pages/{search_term_string}',
  //     // 'target': "https://tellmemediahub.com/yellow-pages/{query}",
  //   },
  //   'query-input': 'required name=search_term_string',
  // },
};
