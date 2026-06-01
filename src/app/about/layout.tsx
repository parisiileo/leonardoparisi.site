import type { Metadata } from "next";

const domain = process.env.NEXT_PUBLIC_DOMAIN || "imleo.it";
const baseUrl = `https://${domain}`;

export const metadata: Metadata = {
  title: "About Leonardo Parisi | Frontend Developer",
  description:
    "Learn about Leonardo Parisi, a passionate Frontend developer specializing in React, Next.js, and modern web technologies. Based in Italy with experience in full-stack development and UI/UX design.",
  keywords:
    "about, Leonardo Parisi, frontend developer, React, Next.js, experience",
  openGraph: {
    title: "About Leonardo Parisi | Frontend Developer",
    description:
      "Learn about Leonardo Parisi, a passionate Frontend developer specializing in React, Next.js, and modern web technologies.",
    type: "website",
    url: `${baseUrl}/about`,
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "Leonardo Parisi - About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Leonardo Parisi | Frontend Developer",
    description:
      "Learn about Leonardo Parisi, a passionate Frontend developer specializing in React, Next.js, and modern web technologies.",
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
