const domain = process.env.NEXT_PUBLIC_DOMAIN || "imleo.it";

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
    location: {
      "@type": "Place",
      name: SEO_CONFIG.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: "IT",
      },
    },
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

export function generateProjectSchema(
  projectTitle: string,
  projectDescription: string,
  projectUrl: string,
  technologies: string[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: projectDescription,
    url: projectUrl,
    applicationCategory: "WebApplication",
    creator: {
      "@type": "Person",
      name: SEO_CONFIG.author,
    },
    keywords: [...technologies, "web development"],
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "0",
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
