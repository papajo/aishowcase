import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Globe, Mail } from "lucide-react"

export const metadata = {
  title: "About — AI Showcase",
  description: "Learn about my background, skills, and experience in AI development.",
}

const skills = [
  { name: "LLMs & Prompt Engineering", level: 90 },
  { name: "RAG Systems", level: 85 },
  { name: "Python", level: 95 },
  { name: "TypeScript / Next.js", level: 90 },
  { name: "Agent Frameworks", level: 80 },
  { name: "Vector Databases", level: 85 },
  { name: "Machine Learning", level: 75 },
  { name: "DevOps & Deployment", level: 70 },
]

const experience = [
  {
    title: "AI Developer",
    company: "Independent",
    period: "2024 - Present",
    description: "Building AI-powered applications and contributing to open-source projects.",
  },
  {
    title: "Full Stack Developer",
    company: "Tech Corp",
    period: "2022 - 2024",
    description: "Led development of customer-facing applications using React and Node.js.",
  },
  {
    title: "Software Engineer",
    company: "Startup Inc",
    period: "2020 - 2022",
    description: "Built and maintained microservices architecture handling 10M+ requests daily.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Profile */}
      <section className="mb-12">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold shrink-0">
            [YN]
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              [Your Name]
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              AI developer passionate about building intelligent systems.
              Currently exploring the frontiers of LLM applications, RAG architectures,
              and multi-agent workflows.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@yourdomain.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="grid gap-4">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="text-sm text-muted-foreground">{exp.period}</span>
                </div>
                <div className="text-sm text-primary mb-2">{exp.company}</div>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Python",
            "TypeScript",
            "Next.js",
            "React",
            "Node.js",
            "OpenAI",
            "LangChain",
            "CrewAI",
            "Pinecone",
            "PostgreSQL",
            "Prisma",
            "Docker",
            "Vercel",
            "AWS",
            "Git",
          ].map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  )
}
