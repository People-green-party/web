import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // Registration is handled by ServiceWorkerRegister so that local builds can
  // reliably unregister old workers and clear stale caches.
  register: false,
  // Keep the install small. Large media and statutory PDFs remain available
  // online and may be cached at runtime, but must not be downloaded on install.
  publicExcludes: [
    "!**/*.pdf",
    "!**/*.PDF",
    "!**/*.{svg,SVG,png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,webp,WEBP,avif,AVIF,mp4,MP4,mov,MOV}",
  ],
  workboxOptions: {
    cleanupOutdatedCaches: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Required: next-pwa injects webpack config; Next 16 needs an explicit
  // turbopack key. Also pin root to this app — a stray ~/package-lock.json
  // otherwise makes Turbopack treat /Users/apple as the workspace root.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Dev mock with hardcoded fake member data — never expose publicly
      {
        source: "/preview-idcard",
        destination: "/login",
        permanent: false,
      },
      // Renamed Leadership Academy → Internship
      {
        source: "/leadership-academy",
        destination: "/internship",
        permanent: true,
      },
      {
        source: "/leadership-academy/:path*",
        destination: "/internship/:path*",
        permanent: true,
      },
      {
        source: "/admin/leadership-academy",
        destination: "/admin/internships",
        permanent: true,
      },
      {
        source: "/admin/leadership-academy/:path*",
        destination: "/admin/internships/:path*",
        permanent: true,
      },
      {
        source: "/jinda-youth",
        destination: "/zinda-youth",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Only use public URL if it's an absolute URL (starts with http), otherwise default to localhost for the proxy
    const backendUrl = process.env.BACKEND_URL ||
      (process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith('http') ? process.env.NEXT_PUBLIC_API_BASE_URL : 'http://localhost:3002');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  }
};

export default withPWA(nextConfig);
