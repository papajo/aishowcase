import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aishowcase.dev"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Showcase — Building with AI Daily",
    template: "%s — AI Showcase",
  },
  description:
    "AI developer building, testing, and sharing tools and projects daily. Explore my tools directory, projects, and journal.",
  keywords: [
    "AI",
    "artificial intelligence",
    "machine learning",
    "LLM",
    "developer",
    "showcase",
    "tools",
    "projects",
    "RAG",
    "agents",
    "Next.js",
  ],
  authors: [{ name: "[Your Name]" }],
  creator: "[Your Name]",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AI Showcase",
    title: "AI Showcase — Building with AI Daily",
    description:
      "AI developer building, testing, and sharing tools and projects daily.",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "AI Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Showcase — Building with AI Daily",
    description:
      "AI developer building, testing, and sharing tools and projects daily.",
    images: [`${siteUrl}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AI Showcase RSS"
          href="/feed.xml"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pb-20 md:pb-0 md:ml-64">
              {children}
            </main>
            <MobileNav />
          </div>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
