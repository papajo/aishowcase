import { getMarkdownAbout } from "@/lib/md-utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Globe, Mail } from "lucide-react"
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/shared/ScrollReveal"
import { MDXContent } from "@/components/shared/MDXContent"

export const metadata = {
  title: "About — AI Showcase",
  description: "Learn about my background, skills, and experience in AI development.",
}

// Fallback data when no about.md exists
const fallback = {
  name: "PJ",
  bio: "AI developer passionate about building intelligent systems. Currently exploring the frontiers of LLM applications, RAG architectures, and multi-agent workflows.",
  githubUrl: "https://github.com/papajo",
  linkedinUrl: "https://www.linkedin.com/in/pajo",
  email: "joshipv2@gmail.com",
  skills: [
    { name: "LLMs & Prompt Engineering", level: 90 },
    { name: "RAG Systems", level: 85 },
    { name: "Python", level: 95 },
    { name: "TypeScript / Next.js", level: 90 },
    { name: "Agent Frameworks", level: 80 },
    { name: "Vector Databases", level: 85 },
    { name: "Machine Learning", level: 75 },
    { name: "DevOps & Deployment", level: 70 },
  ],
  experience: [
    { title: "AI Developer", company: "Independent", period: "2024 - Present", description: "Building AI-powered applications and contributing to open-source projects." },
    { title: "Full Stack Developer", company: "Tech Corp", period: "2022 - 2024", description: "Led development of customer-facing applications using React and Node.js." },
    { title: "Software Engineer", company: "Startup Inc", period: "2020 - 2022", description: "Built and maintained microservices architecture handling 10M+ requests daily." },
  ],
  techStack: ["Python", "TypeScript", "Next.js", "React", "Node.js", "OpenAI", "LangChain", "CrewAI", "Pinecone", "PostgreSQL", "Prisma", "Docker", "Vercel", "AWS", "Git"],
}

export default function AboutPage() {
  const mdAbout = getMarkdownAbout()

  const name = mdAbout?.name || fallback.name
  const bio = mdAbout?.bio || fallback.bio
  const githubUrl = mdAbout?.githubUrl || fallback.githubUrl
  const linkedinUrl = mdAbout?.linkedinUrl || fallback.linkedinUrl
  const email = mdAbout?.email || fallback.email
  const skills = (mdAbout?.skills?.length ? mdAbout.skills : fallback.skills)
  const experience = (mdAbout?.experience?.length ? mdAbout.experience : fallback.experience)
  const techStack = (mdAbout?.techStack?.length ? mdAbout.techStack : fallback.techStack)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <section className="mb-12">
        <ScrollReveal>
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold shrink-0">{name.slice(0, 2)}</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{name}</h1>
              {mdAbout?.tagline && <p className="text-primary text-base mb-2">{mdAbout.tagline}</p>}
              <p className="text-lg text-muted-foreground mb-4">{bio}</p>
              <div className="flex gap-3">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Code className="h-5 w-5" /></a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Globe className="h-5 w-5" /></a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="h-5 w-5" /></a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <ScrollStagger className="grid gap-4" staggerDelay={0.05}>
            {skills.map((skill) => (
              <ScrollStaggerItem key={skill.name}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <ScrollStagger className="space-y-6" staggerDelay={0.1}>
            {experience.map((exp, i) => (
              <ScrollStaggerItem key={i}>
                <Card><CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <div className="text-sm text-primary mb-2">{exp.company}</div>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </CardContent></Card>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Markdown content (from about.md body) */}
      {mdAbout?.content && (
        <ScrollReveal>
          <section className="mb-12">
            <article className="prose prose-invert max-w-none">
              <MDXContent content={mdAbout.content} />
            </article>
          </section>
        </ScrollReveal>
      )}
    </div>
  )
}
