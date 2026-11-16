---
title: "Resend is Now a GitHub Secret Scanning Partner"
date: "2026-07-23T14:45:27.767951+00:00"
published: true
source: research_and_post.py
tags: "GitHub, Resend, Secret Scanning, Security, API Keys"
---

Resend has joined GitHub's Secret Scanning Partner Program. When a `re_...` API key is accidentally pushed to a public GitHub repository, GitHub detects the token pattern and notifies Resend automatically so the leaked credential can be handled before it is abused.

### Why This Matters for Developers

Email API keys are a high-value target in leaked `.env` commits because attackers can use them for phishing or quota abuse within minutes of scraping GitHub's public event stream.

With partner secret scanning enabled:

1. **Automated Detection on Push:** GitHub scans public commits, issues, and gists for Resend's token format.
2. **Immediate Mitigation:** Resend receives the alert directly from GitHub and can revoke or flag the exposed key and notify the account owner.
3. **Reduced Blast Radius:** Even if you catch a mistake and force-push a commit, automated scanners often grab secrets in seconds — partner-level revocation closes that window.

### Best Practices Alongside Secret Scanning

- **Enable Push Protection:** Turn on GitHub Push Protection so commits containing recognized API keys are blocked locally before they ever reach `origin`.
- **Scope Keys Tightly:** Use separate Resend API keys per environment (local, staging, production) and restrict sending-only keys to specific domains.
- **Rotate Immediately:** Treat any key that ever touches a public commit history as permanently compromised and rotate it immediately.

---

**References:**

1. [GitHub Changelog: Improvements to secret scanning and public monitoring](https://github.blog/changelog/2026-07-15-improvements-to-secret-scanning-and-public-monitoring/)
2. [Resend Changelog: GitHub Secret Scanner](https://resend.com/changelog/github-secret-scanner)
3. [Resend Documentation](https://resend.com/)
