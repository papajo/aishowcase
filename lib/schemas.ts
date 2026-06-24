import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  websiteUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
})

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  content: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const reviewSchema = z.object({
  toolId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, "Review must be at least 10 characters"),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  authorName: z.string().min(1, "Name is required"),
})
