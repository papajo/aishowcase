import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { Providers } from "@/components/shared/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aishowcase.qzz.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Showcase — Building with AI Daily",
    template: "%s — AI Showcase",
  },
  description:
    "AI developer building, testing, and sharing tools and projects daily. Explore my tools directory, projects, and journal.",
  keywords: [
    "AI", "artificial intelligence", "machine learning", "LLM", "developer",
    "showcase", "tools", "projects", "RAG", "agents", "Next.js",
  ],
  authors: [{ name: "PJ" }],
  creator: "PJ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AI Showcase",
    title: "AI Showcase — Building with AI Daily",
    description: "AI developer building, testing, and sharing tools and projects daily.",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "AI Showcase" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Showcase — Building with AI Daily",
    description: "AI developer building, testing, and sharing tools and projects daily.",
    images: [`${siteUrl}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true, follow: true,
      "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title="AI Showcase RSS" href="/feed.xml" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
