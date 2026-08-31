import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
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
