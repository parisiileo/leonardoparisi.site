import Header from "@/components/Header/Header";
import "@/styles/global.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const url = new URL("https://leonardoparisi.site");
const title = "Leonardo Parisi - Portfolio";
const author = "Leonardo Parisi <parisii.leonardo@gmail.com>";
const today = new Date();
const birthDate = new Date("2007-02-15");
const age =
  today.getFullYear() -
  birthDate.getFullYear() -
  (today.getMonth() < birthDate.getMonth() ||
  (today.getMonth() === birthDate.getMonth() &&
    today.getDate() < birthDate.getDate())
    ? 1
    : 0);
const ageDescription = `I'm Leonardo Parisi. A ${age}-year-old junior frontend developer.`;

export const metadata: Metadata = {
  title,
  description: ageDescription,
  other: {
    image: "https://leonardoparisi.site/images/preview.png",
  },
  authors: [
    {
      name: author,
      url,
    },
  ],
  creator: author,
  publisher: author,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    title,
    description: ageDescription,
    siteName: "leonardo Parisi portfolio",
    url,
  },
  twitter: {
    title,
    description: ageDescription,
    site: "@_leoparisi",
    creator: "@_leoparisi",
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-[2520px] flex-col h-screen flex items-center justify-between mx-auto relative">
        <Header />
        <div className="w-full">{children}</div>
        <Footer />
        <Toaster position="bottom-left" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
