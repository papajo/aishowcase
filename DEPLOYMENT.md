# Deployment Guide

This guide covers deploying your AI Showcase to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **PostgreSQL Database**: You'll need a production database (推荐 Supabase, Neon, or Railway)

## Step 1: Set Up Production Database

### Option A: Supabase (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the URI and update `DATABASE_URL`

### Option B: Neon
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Option C: Railway
1. Create account at [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy the connection string

## Step 2: Deploy to Vercel

1. **Import Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)

2. **Configure Build Settings**
   - Root Directory: `app`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
   RESEND_API_KEY=re_xxxxx
   FROM_EMAIL=noreply@yourdomain.com
   CONTACT_EMAIL=hello@yourdomain.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Step 3: Run Database Migrations

After first deploy, you need to set up the database:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Link to Your Project**
   ```bash
   vercel link
   ```

3. **Run Migrations**
   ```bash
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

4. **Seed Database** (optional)
   ```bash
   npx tsx prisma/seed.ts
   ```

## Step 4: Custom Domain

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record pointing to `76.76.21.21`

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait for certificate to be issued

## Step 5: Verify Deployment

1. **Check Site Loads**
   - Visit your domain
   - Verify all pages work

2. **Test Admin Panel**
   - Go to `/admin`
   - Login with your credentials
   - Test CRUD operations

3. **Test Forms**
   - Submit newsletter form
   - Submit contact form
   - Verify emails are sent

4. **Check Analytics**
   - Go to Vercel Dashboard → Analytics
   - Verify analytics are tracking

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |
| `FROM_EMAIL` | Sender email address | Yes |
| `CONTACT_EMAIL` | Your email for contact form | Yes |
| `ADMIN_USERNAME` | Admin panel username | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure `DATABASE_URL` is valid
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify database is accessible from Vercel
- Check connection string format
- Ensure database is running

### Emails Not Sending
- Verify `RESEND_API_KEY` is valid
- Check domain is verified in Resend
- Check email logs in Resend dashboard

### Admin Panel Not Working
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Clear browser cache
- Check middleware is working

## Performance Tips

1. **Enable ISR** (Incremental Static Regeneration)
   - Already configured in page components
   - Pages will be regenerated periodically

2. **Optimize Images**
   - Use Next.js Image component
   - Add image optimization in next.config.js

3. **Enable Caching**
   - Vercel automatically caches static assets
   - API routes can be cached with headers

## Monitoring

1. **Vercel Analytics**
   - Real-time analytics in dashboard
   - Core Web Vitals tracking

2. **Speed Insights**
   - Performance metrics
   - User experience data

3. **Function Logs**
   - Check serverless function logs
   - Monitor API route performance

## Updates

To update your deployment:

1. Push changes to GitHub
2. Vercel auto-deploys on push
3. Check deployment status in dashboard
4. Verify changes are live

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review build logs
3. Check environment variables
4. Verify database connectivity
