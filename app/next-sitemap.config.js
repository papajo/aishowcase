/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aishowcase.dev",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/api/*"],
  additionalPaths: async (config) => {
    const paths = []

    // Static pages
    paths.push({
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    })

    paths.push({
      loc: "/tools",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    })

    paths.push({
      loc: "/projects",
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    })

    paths.push({
      loc: "/journal",
      changefreq: "daily",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })

    paths.push({
      loc: "/about",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })

    paths.push({
      loc: "/contact",
      changefreq: "monthly",
      priority: 0.6,
      lastmod: new Date().toISOString(),
    })

    return paths
  },
}
