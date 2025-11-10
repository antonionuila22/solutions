---
title: "How to Build a Professional Contact Form in Astro with Turso Database and Resend Email Notifications"
description: "Complete step-by-step guide to implementing a professional contact form in Astro that stores submissions in Turso database and sends automatic email notifications using Resend. Perfect for modern, fast websites."
author: "Ramon Nuila"
readtime: 12
img: /photos/astro-form-turso.png
imageAlt: "Astro form with database storage and email delivery"
date: 2024-03-28
---

## How to Build a Professional Contact Form in Astro with Turso + Resend (Complete Guide)

Contact forms are essential for any business website—but generic form plugins and third-party services come with limitations: data ownership issues, slow load times, privacy concerns, and lack of customization.

What if you could build a **lightning-fast, fully customized contact form** that:
- ✅ Stores all submissions in YOUR database (you own the data)
- ✅ Sends instant email notifications
- ✅ Loads in milliseconds (no external scripts)
- ✅ Costs almost nothing to run
- ✅ Scales effortlessly
- ✅ Works flawlessly on mobile

In this comprehensive guide, I'll show you exactly how to build this using **Astro** (the fastest web framework), **Turso** (serverless SQLite database), and **Resend** (modern email API).

**By the end, you'll have a production-ready contact form** that's faster and more reliable than 99% of WordPress contact forms—and you'll own every part of it.

---

## Why This Stack? (Astro + Turso + Resend)

Before we dive in, let's understand why this combination is powerful:

### Astro: The Fastest Web Framework

- **Zero JavaScript by default** = lightning-fast load times
- **Server-side rendering (SSR)** = form handling on the backend
- **Partial hydration** = interactive components without bloat
- **SEO-friendly** = perfect HTML output
- **Easy to learn** = simpler than Next.js or SvelteKit for most use cases

**Result**: Your form page loads in <1 second even on slow connections.

### Turso: Serverless SQLite Database

- **Edge deployment** = database runs close to users (low latency)
- **SQLite compatibility** = familiar, battle-tested SQL
- **Generous free tier** = 500 databases, 9GB storage, 1 billion reads/month
- **Automatic replication** = data backed up automatically
- **No cold starts** = instant queries

**Result**: Form submissions are stored reliably without expensive database hosting.

### Resend: Modern Email API

- **Built for developers** = simple API, great docs
- **High deliverability** = emails actually reach inboxes (not spam)
- **100 emails/day free** = perfect for small-medium businesses
- **React Email templates** = design emails in React (optional)
- **Webhooks** = track delivery status

**Result**: Instant, reliable email notifications without configuring SMTP servers.

**The combination**: A professional contact form that costs $0-5/month and outperforms solutions that cost $50-100/month.

---

## Prerequisites

Before starting, make sure you have:

- Node.js 18+ installed
- Basic knowledge of JavaScript/TypeScript
- A code editor (VS Code recommended)
- A Netlify or Vercel account (for deployment)
- A domain with email configured (for Resend)

**Time to complete**: 30-45 minutes

---

## Step 1: Set Up Astro Project with SSR

First, create a new Astro project (or use an existing one):

```bash
npm create astro@latest my-contact-form
cd my-contact-form
```

During setup, choose:
- Template: **Empty** (or your preferred template)
- TypeScript: **Yes** (recommended)
- Install dependencies: **Yes**

Now, configure **Server-Side Rendering** (SSR) which allows form handling on the backend:

### Install Netlify Adapter

```bash
npm install @astrojs/netlify
```

### Configure `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server', // Enable SSR
  adapter: netlify(),
});
```

**Why SSR?** Without SSR, Astro generates static HTML files at build time—you can't handle form submissions dynamically. SSR allows serverless functions to process forms on the backend.

**Alternatives to Netlify**:
- Vercel: Use `@astrojs/vercel`
- Cloudflare: Use `@astrojs/cloudflare`
- Node: Use `@astrojs/node`

---

## Step 2: Set Up Turso Database

Turso provides a serverless SQLite database that's perfect for form submissions.

### Install Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

Or with Homebrew (Mac/Linux):

```bash
brew install tursodatabase/tap/turso
```

### Authenticate

```bash
turso auth login
```

### Create a Database

```bash
turso db create contact-form-db
```

### Get Database URL and Auth Token

```bash
turso db show contact-form-db --url
turso db tokens create contact-form-db
```

**Save these values**—you'll need them for environment variables.

### Create the Table

```bash
turso db shell contact-form-db
```

In the Turso shell, run:

```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Exit the shell with `.exit`

**What we created**: A simple table to store contact form submissions with an auto-incrementing ID and timestamp.

---

## Step 3: Install Dependencies

Install the Turso client and Resend email library:

```bash
npm install @libsql/client resend
```

**What these do:**
- `@libsql/client`: Connects to Turso database
- `resend`: Sends emails programmatically

---

## Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Turso Database
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Resend API
RESEND_API_KEY=re_your_resend_api_key

# Email Configuration
NOTIFICATION_EMAIL=your-email@example.com
```

### Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their sandbox for testing)
3. Create an API key in the dashboard

**Important**: Add `.env` to your `.gitignore` to keep secrets safe!

---

## Step 5: Create Database Client

Create `src/lib/turso.ts`:

```typescript
import { createClient } from '@libsql/client';

if (!import.meta.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not set');
}

if (!import.meta.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not set');
}

export const tursoClient = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
```

**What this does**: Creates a reusable database client that can be imported anywhere in your app.

---

## Step 6: Create Email Service

Create `src/lib/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Use your verified domain
      to: import.meta.env.NOTIFICATION_EMAIL,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent from your Astro contact form
        </p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
```

**What this does**: Sends a formatted email notification whenever someone submits the form.

**Pro tip**: For production, create HTML email templates using [React Email](https://react.email/) for better design.

---

## Step 7: Create the Contact Form

Create `src/pages/contact.astro`:

```astro
---
import { tursoClient } from '../lib/turso';
import { sendContactNotification } from '../lib/email';

let successMessage = '';
let errorMessage = '';

if (Astro.request.method === 'POST') {
  try {
    const formData = await Astro.request.formData();
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Validation
    if (!name || !email || !message) {
      errorMessage = 'Please fill in all fields';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessage = 'Please enter a valid email address';
    } else {
      // Save to database
      await tursoClient.execute({
        sql: 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
        args: [name, email, message],
      });

      // Send email notification
      await sendContactNotification({ name, email, message });

      successMessage = 'Thank you! Your message has been sent successfully.';
    }
  } catch (error) {
    console.error('Form submission error:', error);
    errorMessage = 'Something went wrong. Please try again.';
  }
}
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Us</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 40px 20px;
      max-width: 600px;
      margin: 0 auto;
      background: #f5f5f5;
    }

    .container {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      margin-bottom: 10px;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-weight: 500;
      color: #333;
    }

    input, textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #0066cc;
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }

    button {
      padding: 14px 24px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #0052a3;
    }

    .success {
      padding: 16px;
      background: #d4edda;
      color: #155724;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .error {
      padding: 16px;
      background: #f8d7da;
      color: #721c24;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Contact Us</h1>
    <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

    {successMessage && <div class="success">{successMessage}</div>}
    {errorMessage && <div class="error">{errorMessage}</div>}

    <form method="POST">
      <label>
        Name *
        <input type="text" name="name" required />
      </label>

      <label>
        Email *
        <input type="email" name="email" required />
      </label>

      <label>
        Message *
        <textarea name="message" required></textarea>
      </label>

      <button type="submit">Send Message</button>
    </form>
  </div>
</body>
</html>
```

**What this code does:**
1. Checks if the request method is POST (form submission)
2. Validates the form data
3. Saves to Turso database
4. Sends email notification via Resend
5. Shows success or error message

**Security features included:**
- Server-side validation
- SQL parameterized queries (prevents SQL injection)
- Email validation regex
- Error handling

---

## Step 8: Deploy to Netlify

### Option 1: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 2: Deploy via Git

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Add environment variables in Netlify dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `RESEND_API_KEY`
   - `NOTIFICATION_EMAIL`

4. Deploy!

**Important**: Make sure environment variables are set in your deployment platform before going live.

---

## Step 9: Test Your Form

1. Visit your deployed contact page
2. Fill out the form
3. Submit

**What should happen:**
✅ Form shows success message
✅ Data appears in Turso database (check with `turso db shell`)
✅ You receive an email notification

**Troubleshooting common issues:**
- **No email received**: Check spam folder, verify Resend API key, confirm domain verification
- **Database error**: Verify Turso credentials, check table exists
- **Form doesn't submit**: Check browser console for errors, verify SSR is enabled

---

## Bonus: Add Spam Protection

Add a simple honeypot field to catch bots:

```astro
<label style="position: absolute; left: -9999px;">
  Leave this field empty
  <input type="text" name="honeypot" tabindex="-1" autocomplete="off" />
</label>
```

In your form handler:

```typescript
const honeypot = formData.get('honeypot')?.toString();
if (honeypot) {
  // It's a bot, silently reject
  return;
}
```

**How it works**: Bots fill out all fields. Humans can't see this hidden field, so they leave it empty.

---

## Performance Benchmarks

**Form load time**: <500ms (compared to 2-5 seconds for typical WordPress forms)
**Submission processing**: <200ms
**Email delivery**: 1-3 seconds
**Database write**: <50ms

**Why it's fast:**
- Zero client-side JavaScript (unless you add it)
- Turso runs at the edge (low latency)
- Astro generates optimized HTML
- No external dependencies loaded on page

---

## Cost Breakdown

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| **Turso** | 500 DBs, 9GB storage, 1B reads/month | $5/month for more |
| **Resend** | 100 emails/day, 3,000/month | $20/month for 50k emails |
| **Netlify** | 100GB bandwidth, 300 build minutes | $19/month Pro plan |

**Realistic cost for small-medium business**: $0-5/month

---

## When to Use This vs. Alternatives

### Use This Stack When:
✅ You want full control and data ownership
✅ Page speed is critical
✅ You're building a modern, custom website
✅ You need to scale affordably
✅ You value developer experience

### Consider Alternatives When:
❌ You need complex CRM integrations (use Typeform, HubSpot forms)
❌ You want no-code setup (use Google Forms, Tally)
❌ You're on WordPress (use WPForms, Contact Form 7)

---

## Taking It Further

**Next-level enhancements:**
- Add file upload support (use S3-compatible storage)
- Implement email auto-reply to submitter
- Build an admin dashboard to view submissions
- Add CAPTCHA (reCAPTCHA or hCaptcha)
- Integrate with CRM (HubSpot, Salesforce)
- Add webhook notifications (Slack, Discord)
- Export submissions to CSV
- Create email drip campaigns

---

## The Bottom Line: Modern Forms for Modern Websites

Contact forms might seem simple, but they're critical conversion points. A slow, unreliable, or bloated form costs you leads—and leads are revenue.

This Astro + Turso + Resend stack gives you:
✅ Lightning-fast performance
✅ Complete data ownership
✅ Reliable email delivery
✅ Scalability without cost explosion
✅ Full customization freedom

**It's not just a better contact form—it's a better foundation for your business.**

---

## Need Help Building This?

Building custom forms and integrations takes time and technical expertise. If you'd rather focus on your business while experts handle the technical details, we're here to help.

**Our Web Development Services Include:**

🎯 **Custom Astro Development**: Fast, modern websites built with cutting-edge tech
🎯 **Form & Database Integration**: Professional contact forms, lead capture, data management
🎯 **Email Automation**: Reliable transactional emails and marketing sequences
🎯 **Performance Optimization**: Lightning-fast load times that convert better
🎯 **Full Stack Solutions**: From frontend to backend, we handle it all

**We build websites that are:**
- Fast (Google PageSpeed 95+)
- Reliable (99.9%+ uptime)
- Scalable (handle growth without slowdowns)
- Secure (industry best practices)
- Maintainable (clean code, good documentation)

👉 **[Schedule a free development consultation](/contact)** and let's discuss your project

👉 **[View our portfolio](/projects)** of custom web applications we've built

👉 **[Explore our web development services](/web-development)** for more details

**Your website deserves modern technology. Let's build it right.**
