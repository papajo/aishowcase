import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
