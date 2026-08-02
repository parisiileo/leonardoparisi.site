const domain = process.env.NEXT_PUBLIC_DOMAIN || "imleo.it";

/** English lives at the root; every other locale gets a path prefix. */
export function localeUrl(locale: string) {
  const base = `https://${domain}`;
  return locale === "en" ? base : `${base}/${locale}`;
}

export const SEO_CONFIG = {
  baseUrl: `https://${domain}`,
  domain,
  title: "Leonardo Parisi - Frontend Developer & Portfolio",
  description:
    "Portfolio of Leonardo Parisi, a Frontend developer specializing in React, Next.js, and modern web technologies. Based in Italy.",
  keywords:
    "frontend developer, React, Next.js, TypeScript, web development, portfolio, Italy",
  author: "Leonardo Parisi",
  email: "parisii.leonardo@gmail.com",
  twitter: "@_leoparisi",
  location: "Italy",
  socialLinks: {
    github: "https://github.com/parisiileo",
    twitter: "https://twitter.com/_leoparisi",
  },
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "CSS",
    "HTML",
    "Tailwind CSS",
    "Framer Motion",
    "Web Development",
    "Frontend Architecture",
    "UI/UX Implementation",
  ],
};

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SEO_CONFIG.author,
    email: SEO_CONFIG.email,
    url: SEO_CONFIG.baseUrl,
    jobTitle: "Frontend Developer",
    image: `${SEO_CONFIG.baseUrl}/api/og`,
    sameAs: Object.values(SEO_CONFIG.socialLinks),
    knowsAbout: SEO_CONFIG.skills,
    // Matches the address published in the legal pages, which is what search
    // engines cross-check for a business entity.
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Palermo 46",
      postalCode: "39100",
      addressLocality: "Bolzano",
      addressRegion: "BZ",
      addressCountry: "IT",
    },
    vatID: "IT03356630214",
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Leonardo Parisi Portfolio",
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.baseUrl,
  };
}
