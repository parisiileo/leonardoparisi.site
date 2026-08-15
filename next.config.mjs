import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
  // A stray lockfile in the home directory makes Next infer the wrong workspace
  // root, which throws off file tracing for the deployed bundle. Pin it here.
  turbopack: { root: import.meta.dirname },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Deliberately NOT a blanket `Cache-Control` on `/:path*`: that pattern
      // also matches `/_next/static/*`, and the custom header wins over the
      // `immutable` one Next sets there — so every hashed chunk, stylesheet
      // and font expired after an hour and was refetched. It also stamped
      // `public` on the locale-negotiating redirect at `/`, which varies by
      // Accept-Language and must never be shared between visitors.
      // Content-hashed assets under `/_next/` keep Next's own immutable
      // header; prerendered HTML keeps the host's SSG caching.
      {
        source: "/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // The standalone /about route folded into the one-pager's #about section.
      { source: "/about", destination: "/#about", permanent: true },
      {
        source: "/:locale(it|de|es)/about",
        destination: "/:locale#about",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
