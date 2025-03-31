
import React from 'react';
import { Helmet } from 'react-helmet';
import { Poem } from '@/types/poem-types';

interface PoemsLandSEOProps {
  selectedPoem: Poem | null;
  host: string;
}

const PoemsLandSEO: React.FC<PoemsLandSEOProps> = ({ selectedPoem, host }) => {
  if (selectedPoem) {
    // Individual poem SEO is handled by PoemSEO component
    return null;
  }

  return (
    <Helmet>
      <title>PoemsLand - Sammlung personalisierter Gedichte</title>
      <meta name="description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen. Finde inspirierende Gedichte oder erstelle dein eigenes personalisiertes Gedicht." />
      <meta name="keywords" content="Gedichte, Poesie, personalisierte Gedichte, Geburtstag, Liebe, Hochzeit, PoemsLand" />
      <link rel="canonical" href={`${host}/poemsland`} />
      <meta property="og:title" content="PoemsLand - Sammlung personalisierter Gedichte" />
      <meta property="og:description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen." />
      <meta property="og:url" content={`${host}/poemsland`} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content="PoemsLand - Sammlung personalisierter Gedichte" />
      <meta name="twitter:description" content="Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen." />
      
      {/* Structured data for collection page */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "PoemsLand - Sammlung personalisierter Gedichte",
        "description": "Entdecke eine Sammlung wunderschöner Gedichte zu verschiedenen Anlässen und Themen.",
        "url": `${host}/poemsland`,
        "isPartOf": {
          "@type": "WebSite",
          "name": "PoemsLand",
          "url": host
        }
      })}</script>
    </Helmet>
  );
};

export default PoemsLandSEO;
