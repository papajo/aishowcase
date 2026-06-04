"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-muted-foreground leading-7 mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground mb-4">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,
        code: ({ className, children, ...props }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          }
          return (
            <div className="relative">
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4">
                <code className="text-sm font-mono" {...props}>
                  {children}
                </code>
              </pre>
            </div>
          )
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-4 py-2 text-left text-sm font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-4 py-2 text-sm text-muted-foreground">
            {children}
          </td>
        ),
        hr: () => <hr className="my-8 border-border" />,
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
