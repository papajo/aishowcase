---
title: "Why Your Local Web App Keeps Losing Your Login Session (And Why Your PDFs Come Out Empty)"
date: "2026-07-25T18:00:00+00:00"
published: true
tags: "Web Development, Authentication, Debugging, DevOps"
---

You set up a local web app. You log in. It works. You click around, everything looks fine. Then you try to export a PDF — and it comes out as a 0-byte empty file. Or you refresh the page and suddenly you're logged out again. You clear your browser cookies, and now you can't log in at all.

Sound familiar? This is one of the most common and confusing issues in local web development, and it has a surprisingly simple root cause: the `Secure` cookie flag.

### The Problem: Secure Cookies on Plain HTTP

When a web server sets a session cookie with the `Secure` flag, it's telling the browser: "Only send this cookie over HTTPS connections." This is a security best practice for production — you never want session tokens traveling over unencrypted connections.

But here's the catch: if your local development server runs on plain HTTP (which it almost always does — `http://localhost:3000`, `http://127.0.0.1:8080`, etc.), the browser will **refuse to store the cookie entirely**. Not just refuse to send it — it won't even save it.

The result? Your login appears to succeed (the server responds with a 200 and sets the cookie), but the browser drops it immediately. Every subsequent request is unauthenticated. The user sees a login page loop, or worse — authenticated pages load partially while API calls fail silently.

### Why PDFs Come Out Empty

This is where it gets insidious. If your app uses browser-based PDF generation (like `window.print()` or a library like html2pdf.js), the print dialog opens and the browser tries to render the page. But if the session cookie is dropped:

1. The main page loads (it's just HTML/CSS served from the same origin)
2. Authenticated resources fail — API calls for data, images served behind auth, dynamic content
3. The browser renders what it can (often just the shell/layout)
4. The user clicks "Save as PDF" and gets a 0-byte or nearly empty file

The PDF export doesn't throw an error — it just silently produces garbage. The user blames the PDF library, the print CSS, or the browser. The real culprit is a single boolean flag in a cookie.

### How to Diagnose

Open your browser's developer tools and check the `Set-Cookie` header on the login response:

```
# Broken (Secure flag on HTTP):
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/

# Working (no Secure flag):
Set-Cookie: session=abc123; HttpOnly; SameSite=Lax; Path=/
```

If you see `Secure` on a `http://` connection, that's your problem.

You can also check the Application/Storage tab — if the cookie isn't listed at all after login, the browser rejected it.

### The Fix

Make the `Secure` flag conditional on whether you're actually running HTTPS:

```python
# Python / Flask / FastAPI
secure_cookie = os.getenv("SECURE_COOKIES", "false").lower() == "true"
response.set_cookie("session", token, secure=secure_cookie, httponly=True, samesite="Lax")
```

```javascript
// Node.js / Express
app.use(session({
  cookie: {
    secure: process.env.SECURE_COOKIES === "true",  // false for local HTTP
    httpOnly: true,
    sameSite: "lax"
  }
}));
```

```env
# .env
SECURE_COOKIES=false  # Set to true behind HTTPS reverse proxy
```

For local development: `SECURE_COOKIES=false`.
For production behind HTTPS: `SECURE_COOKIES=true`.

### The Browser Quirk That Makes It Worse

Browsers treat `localhost` and `127.0.0.1` as **separate origins** for cookie purposes. If you log in via `http://localhost:3000` and then navigate to `http://127.0.0.1:3000`, you'll appear logged out — the cookie was set on `localhost` and doesn't apply to `127.0.0.1`.

This means clearing cookies for one address doesn't clear them for the other. It also means testing auth flows requires consistent use of one address. Pick `localhost` and stick with it.

### Print CSS: The Second Problem

Even after fixing the cookie, PDF export might still produce poor results if your print CSS doesn't handle complex visual effects. Common offenders:

- **Fixed positioning** — elements with `position: fixed` don't appear in print (they're viewport-relative, and print has no viewport in the traditional sense)
- **CSS animations** — `@keyframes` run once during page load but don't replay for print
- **Backdrop effects** — `backdrop-filter`, gradients on `::before`/`::after` pseudo-elements, and `filter: blur()` can cause rendering failures or massive PDF file sizes
- **Negative margins/insets** — elements positioned outside the viewport (`inset: -20vh`) can cause the print renderer to expand the page bounds

A minimal print stylesheet that fixes most issues:

```css
@media print {
  /* Remove decorative effects */
  body::before, body::after { display: none !important; }
  * { animation: none !important; transition: none !important; }

  /* Reset fixed positioning */
  [style*="position: fixed"] { position: static !important; }

  /* Prevent breaks inside content blocks */
  pre, table, blockquote { break-inside: avoid; }

  /* Set reasonable margins */
  @page { margin: 1.5cm; }
}
```

### The Complete Checklist

If you're debugging local auth + PDF export issues:

1. **Check the `Set-Cookie` header** — no `Secure` flag on HTTP
2. **Check the Application tab** — cookie must be stored after login
3. **Use consistent addresses** — stick to `localhost` or `127.0.0.1`, not both
4. **Check Network tab during PDF export** — any 401/403 responses?
5. **Test print CSS** — open DevTools, press Cmd+P, check "Simplified" vs "Original"
6. **Check for `position: fixed`** in print — breaks page layout
7. **Verify the cookie arrives** on API calls during print (some browsers strip cookies for print-triggered requests)

### TL;DR

Your local web app loses sessions and produces empty PDFs because the server sets `Secure` cookies over plain HTTP. The browser silently drops them. Fix: make `Secure` conditional on HTTPS. Also clean up your print CSS to handle fixed positioning and decorative effects. One boolean flag and a handful of CSS rules — that's all it takes.
