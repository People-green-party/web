import type { Metadata } from "next";
import { Caveat, Familjen_Grotesk } from "next/font/google";
import "./globals.css";

import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { LanguageProvider } from "../components/LanguageContext";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://peoplesgreen.org"
  ),
  title: {
    default: "Indian Peoples Green Party",
    template: "%s | Indian Peoples Green Party",
  },
  description:
    "Official website of the Indian Peoples Green Party: its vision, public activities, membership, programmes and voluntary contributions.",
  applicationName: "Indian Peoples Green Party",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Indian Peoples Green Party",
    title: "Indian Peoples Green Party",
    description:
      "Official website of the Indian Peoples Green Party: its vision, public activities, membership and programmes.",
    images: [{ url: "/PGPlogo.svg", alt: "Indian Peoples Green Party logo" }],
  },
  twitter: {
    card: "summary",
    title: "Indian Peoples Green Party",
    description:
      "Official website of the Indian Peoples Green Party: its vision, public activities, membership and programmes.",
    images: ["/PGPlogo.svg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/PGPlogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/PGPlogo.svg" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${familjenGrotesk.variable} ${caveat.variable} antialiased font-sans`}>
        <div className="min-h-screen min-w-0 flex flex-col overflow-x-clip">
          <main className="flex-1 min-w-0">
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </main>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
