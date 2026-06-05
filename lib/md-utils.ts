import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
}

export function getSortedPosts(): Post[] {
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace(/\.md$/, ''),
      path: path.join(POSTS_DIR, file)
    }))

  const posts = files.map(file => {
    const fileContent = fs.readFileSync(file.path, 'utf-8')
    const { data, content } = matter(fileContent)
    
    return {
      slug: file.slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: content.slice(0, 160).replace(/\n/g, ' ') + '...',
      content: content,
      tags: data.tags || [],
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    excerpt: content.slice(0, 160).replace(/\n/g, ' ') + '...',
    content: content,
    tags: data.tags || [],
  }
}
