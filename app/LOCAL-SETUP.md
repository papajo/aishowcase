# Local Development Setup

Step-by-step guide to run the AI Showcase app locally with PostgreSQL.

## Prerequisites

- Node.js 18+
- Homebrew (macOS)
- PostgreSQL 16 (installed via Homebrew)

## 1. Start PostgreSQL

```bash
brew services start postgresql@16
```

Verify it's running:

```bash
psql --version
```

## 2. Create Database

```bash
createdb aishowcase
```

Verify the connection:

```bash
psql -d aishowcase -c "SELECT 1;"
```

## 3. Install Dependencies

```bash
cd app
npm install
```

## 4. Configure Environment

The `.env.local` and `.env` files are pre-configured for local development:

```
DATABASE_URL="postgresql://padoshi@localhost:5432/aishowcase?schema=public"
```

If your macOS username differs from `padoshi`, update both files:

```bash
# Get your username
whoami

# Then update .env and .env.local with:
DATABASE_URL="postgresql://<your-username>@localhost:5432/aishowcase?schema=public"
```

## 5. Run Migration

Creates all database tables:

```bash
npm run db:migrate
```

This runs `npx prisma migrate dev` which applies the schema to your local database.

## 6. Seed Sample Data

Populates the database with 12 tools, 3 projects, 5 journal posts, and reviews:

```bash
npm run db:seed
```

## 7. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:seed` | Re-seed sample data |
| `npm run db:reset` | Drop all tables, re-migrate, and re-seed |
| `npm run db:push` | Push schema changes without migration |
| `npm run db:migrate` | Create and apply a new migration |

## Troubleshooting

### "Connection refused" on startup

PostgreSQL isn't running. Start it:

```bash
brew services start postgresql@16
```

### "Authentication failed"

Your username doesn't match the connection string. Check:

```bash
whoami
```

Then update `DATABASE_URL` in both `.env` and `.env.local`.

### "Database does not exist"

Create it:

```bash
createdb aishowcase
```

### Prisma Client errors

Regenerate the client after schema changes:

```bash
npx prisma generate
```

### Build fails with ECONNREFUSED

The app builds fine without a database (pages show empty states). To build with data, ensure PostgreSQL is running and the database is seeded.

## Project Structure

```
app/
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed script (12 tools, 3 projects, 5 posts)
│   └── migrations/          # Migration files
├── lib/
│   ├── db.ts                # Prisma client singleton
│   └── generated/prisma/    # Generated Prisma client (do not edit)
├── .env                     # Prisma CLI env (DATABASE_URL)
├── .env.local               # Next.js runtime env (DATABASE_URL)
└── package.json             # Scripts: db:migrate, db:seed, db:studio, etc.
```

## Seeded Data Summary

- **12 AI Tools**: OpenAI GPT-4, Claude, Pinecone, LangChain, CrewAI, Cursor, Vercel AI SDK, Weaviate, Groq, LlamaIndex, Weights & Biases, Replicate
- **3 Projects**: RAG Pipeline, Multi-Agent Research, AI Code Review Bot
- **5 Journal Posts**: RAG from scratch, CrewAI exploration, Cursor review, Vector DB comparison, LLM observability
- **20+ Reviews**: 1-3 reviews per tool
