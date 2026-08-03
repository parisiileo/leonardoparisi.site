import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = SEO_CONFIG;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Only the form endpoint is off limits. The old blanket /api/ rule
        // also hid the share card, so every crawler that honours robots.txt —
        // Google and Twitterbot included — refused to fetch a preview image.
        disallow: ["/api/contact"],
      },
      // Explicitly welcome the bots that decide whether a shared link gets a
      // card, and the image bot that feeds Google Images.
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "AdsBot-Google",
          "Bingbot",
          "Twitterbot",
          "facebookexternalhit",
          "LinkedInBot",
          "Slackbot-LinkExpanding",
          "WhatsApp",
          "TelegramBot",
          "Discordbot",
        ],
        allow: "/",
        disallow: ["/api/contact"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
