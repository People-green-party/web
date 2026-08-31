import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "PGP",
  description: "Peoples Green Party",
  icons: {
    icon: "/icon.svg",
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
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${familjenGrotesk.variable} antialiased font-sans`}>
        <div className="min-h-screen min-w-0 flex flex-col overflow-x-hidden">
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
