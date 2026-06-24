import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],

  // Dev server on port 3003
  devIndicators: false,

  // Proxy configuration for admin auth
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
        // Basic auth is handled client-side for simplicity
        // In production, use Vercel Edge Middleware or a server component
      },
    ]
  },
}

export default nextConfig
