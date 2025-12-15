---
title: "Website Security Best Practices 2026: The Complete Protection Guide"
description: "Comprehensive website security guide for 2026. Learn HTTPS, CSP, authentication, SQL injection prevention, XSS protection, and security headers. Protect your website from modern threats."
author: "Ramon Nuila"
readtime: 25
img: /photos/blog/placeholder-security.avif
imageAlt: "Website security best practices and protection measures"
date: 2025-12-15
draft: true
categories:
  - Web Development
  - Security
tags:
  - website security
  - cybersecurity
  - HTTPS
  - OWASP
  - SQL injection
  - XSS
  - authentication
---

## Website Security Best Practices 2026: The Complete Protection Guide

Website security isn't optional—it's essential. In 2026, cyberattacks are more sophisticated than ever, and the consequences of a breach can be devastating: financial loss, legal liability, and irreparable reputation damage.

This guide covers everything you need to protect your website, from fundamental practices to advanced security measures. Whether you're building a simple blog or a complex e-commerce platform, these principles apply.

---

## Part 1: Foundation Security

### 1. HTTPS Everywhere

HTTPS encrypts data between users and your server. In 2026, there's no excuse for not using it.

**Why HTTPS Matters:**
- Encrypts sensitive data (passwords, payment info)
- Prevents man-in-the-middle attacks
- Required for modern browser features (geolocation, camera)
- Google ranking factor
- Builds user trust

**Implementation:**

```nginx
# Nginx - Force HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
}
```

**For Static Sites (Netlify/Vercel):**
HTTPS is automatic. Ensure you redirect HTTP to HTTPS:

```toml
# netlify.toml
[[redirects]]
  from = "http://example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true
```

---

### 2. Security Headers

HTTP security headers instruct browsers how to handle your content securely.

**Essential Headers:**

```toml
# netlify.toml or _headers file
[[headers]]
  for = "/*"
  [headers.values]
    # Prevent clickjacking
    X-Frame-Options = "DENY"

    # Prevent MIME type sniffing
    X-Content-Type-Options = "nosniff"

    # Enable XSS filter (legacy browsers)
    X-XSS-Protection = "1; mode=block"

    # Control referrer information
    Referrer-Policy = "strict-origin-when-cross-origin"

    # Permissions Policy (formerly Feature-Policy)
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=()"

    # Strict Transport Security (HSTS)
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

**Content Security Policy (CSP):**

CSP is your most powerful header—it controls which resources can load:

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://analytics.example.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**CSP Breakdown:**

| Directive | Purpose | Example |
|-----------|---------|---------|
| `default-src` | Fallback for all resources | `'self'` |
| `script-src` | JavaScript sources | `'self' https://cdn.com` |
| `style-src` | CSS sources | `'self' 'unsafe-inline'` |
| `img-src` | Image sources | `'self' data: https:` |
| `connect-src` | Fetch/XHR/WebSocket | `'self' https://api.com` |
| `frame-ancestors` | Who can embed your site | `'none'` |

**Testing Headers:**
Use [securityheaders.com](https://securityheaders.com) to grade your headers.

---

### 3. Input Validation

Never trust user input. Validate everything on both client and server.

**Client-Side Validation (UX, not security):**

```html
<form>
  <input
    type="email"
    name="email"
    required
    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    title="Please enter a valid email address"
  />

  <input
    type="text"
    name="username"
    required
    minlength="3"
    maxlength="20"
    pattern="[a-zA-Z0-9_]+"
    title="Username can only contain letters, numbers, and underscores"
  />

  <input
    type="tel"
    name="phone"
    pattern="[0-9]{10,15}"
    title="Please enter a valid phone number"
  />
</form>
```

**Server-Side Validation (Security):**

```typescript
// Using Zod for validation
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid characters in username'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  age: z.number().min(13).max(120).optional(),
});

// Usage
function validateUser(data: unknown) {
  const result = userSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  return { data: result.data };
}
```

---

## Part 2: Common Vulnerabilities (OWASP Top 10)

### 4. SQL Injection Prevention

SQL injection occurs when user input is directly concatenated into SQL queries.

**Vulnerable Code (NEVER DO THIS):**

```javascript
// DANGEROUS - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// Attacker input: ' OR '1'='1
// Resulting query: SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns ALL users!
```

**Safe Code (Parameterized Queries):**

```typescript
// Safe - Using Drizzle ORM
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

async function getUser(email: string) {
  // Drizzle automatically parameterizes queries
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email));
}

// Safe - Using raw parameterized query
const result = await db.execute({
  sql: 'SELECT * FROM users WHERE email = ?',
  args: [email], // Value is safely parameterized
});
```

**ORM Usage (Recommended):**

ORMs like Drizzle, Prisma, or TypeORM automatically prevent SQL injection:

```typescript
// Drizzle - Always safe
const user = await db.query.users.findFirst({
  where: eq(users.email, untrustedInput),
});

// Prisma - Always safe
const user = await prisma.user.findUnique({
  where: { email: untrustedInput },
});
```

---

### 5. Cross-Site Scripting (XSS) Prevention

XSS allows attackers to inject malicious scripts into pages viewed by other users.

**Types of XSS:**

| Type | Description | Example |
|------|-------------|---------|
| Stored | Script saved in database | Comment with `<script>` tag |
| Reflected | Script in URL parameters | Search results displaying query |
| DOM-based | Script manipulates DOM | Client-side URL parsing |

**Vulnerable Code:**

```javascript
// DANGEROUS - XSS vulnerable
document.getElementById('output').innerHTML = userInput;

// Attacker input: <script>alert('XSS')</script>
// Or: <img src="x" onerror="stealCookies()">
```

**Safe Code:**

```javascript
// Safe - Use textContent for plain text
document.getElementById('output').textContent = userInput;

// Safe - Use sanitization library for HTML
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
document.getElementById('output').innerHTML = cleanHTML;
```

**Framework Protections:**

Modern frameworks auto-escape by default:

```jsx
// React - Auto-escapes by default
function Comment({ text }) {
  return <p>{text}</p>; // Safe - text is escaped
}

// Dangerous - Only use with trusted content
function Comment({ html }) {
  return <p dangerouslySetInnerHTML={{ __html: html }} />; // DANGEROUS
}
```

```astro
<!-- Astro - Auto-escapes by default -->
<p>{userInput}</p> <!-- Safe -->

<!-- Dangerous - Only use with sanitized content -->
<p set:html={sanitizedHTML}></p>
```

**CSP for XSS Mitigation:**

```text
Content-Security-Policy: script-src 'self';
```

This prevents inline scripts from executing, blocking most XSS attacks.

---

### 6. Cross-Site Request Forgery (CSRF) Prevention

CSRF tricks users into performing unwanted actions on sites where they're authenticated.

**How CSRF Works:**

```html
<!-- Attacker's site -->
<img src="https://yourbank.com/transfer?to=attacker&amount=1000" />

<!-- If user is logged into yourbank.com, transfer happens! -->
```

**Prevention Methods:**

**1. CSRF Tokens:**

```html
<!-- Include token in forms -->
<form method="POST" action="/transfer">
  <input type="hidden" name="csrf_token" value="abc123xyz" />
  <input type="text" name="amount" />
  <button type="submit">Transfer</button>
</form>
```

```typescript
// Server-side validation
function handleTransfer(request) {
  const sessionToken = getSessionCSRFToken(request);
  const formToken = request.body.csrf_token;

  if (sessionToken !== formToken) {
    throw new Error('CSRF token mismatch');
  }

  // Process transfer...
}
```

**2. SameSite Cookies:**

```typescript
// Set cookies with SameSite attribute
response.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict', // Or 'lax' for less strict
  maxAge: 3600000,
});
```

**3. Check Origin Header:**

```typescript
function validateOrigin(request) {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');

  const allowedOrigins = ['https://yourdomain.com'];

  if (!allowedOrigins.includes(origin)) {
    throw new Error('Invalid origin');
  }
}
```

---

## Part 3: Authentication Security

### 7. Password Security

**Password Requirements (NIST Guidelines 2024):**
- Minimum 8 characters (12+ recommended)
- No complexity requirements (they don't help)
- Check against breached password databases
- No forced periodic changes
- Allow paste into password fields

**Implementation:**

```typescript
import bcrypt from 'bcrypt';

// Hash password before storing
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher = more secure but slower
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Check against breached passwords (using HaveIBeenPwned API)
async function isPasswordBreached(password: string): Promise<boolean> {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  return text.includes(suffix);
}
```

**Password Storage:**

| Method | Security | Recommendation |
|--------|----------|----------------|
| Plain text | None | NEVER |
| MD5/SHA1 | Weak | NEVER |
| SHA256 | Better | Not recommended |
| bcrypt | Good | Recommended |
| Argon2 | Best | Highly recommended |

---

### 8. Session Management

**Secure Session Configuration:**

```typescript
// Express.js session configuration
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET, // Long, random string
  name: 'sessionId', // Don't use default 'connect.sid'
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // Prevent JavaScript access
    secure: true,       // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000,    // 1 hour
    domain: '.example.com',
  },
}));
```

**Session Security Practices:**
- Regenerate session ID after login
- Expire sessions on logout (server-side)
- Implement idle timeout
- Limit concurrent sessions

```typescript
// Regenerate session after authentication
async function login(request, response) {
  const user = await authenticateUser(request.body);

  if (user) {
    // Regenerate session to prevent fixation
    request.session.regenerate((err) => {
      request.session.userId = user.id;
      request.session.loginTime = Date.now();
      response.redirect('/dashboard');
    });
  }
}

// Logout - Destroy session
async function logout(request, response) {
  request.session.destroy((err) => {
    response.clearCookie('sessionId');
    response.redirect('/');
  });
}
```

---

### 9. Multi-Factor Authentication (MFA)

MFA significantly reduces account compromise risk.

**TOTP Implementation:**

```typescript
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Generate secret for user
function generateMFASecret(userEmail: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userEmail, 'YourApp', secret);

  return { secret, otpauth };
}

// Generate QR code for authenticator app
async function generateQRCode(otpauth: string) {
  return await QRCode.toDataURL(otpauth);
}

// Verify TOTP code
function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

// Usage in login flow
async function loginWithMFA(request) {
  const { email, password, totpCode } = request.body;

  // Step 1: Verify password
  const user = await verifyCredentials(email, password);
  if (!user) throw new Error('Invalid credentials');

  // Step 2: Verify TOTP if enabled
  if (user.mfaEnabled) {
    const isValid = verifyTOTP(totpCode, user.mfaSecret);
    if (!isValid) throw new Error('Invalid MFA code');
  }

  // Step 3: Create session
  return createSession(user);
}
```

---

## Part 4: API Security

### 10. Rate Limiting

Prevent brute force attacks and API abuse:

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for authentication
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts per hour
  message: { error: 'Too many login attempts, please try again later.' },
  skipSuccessfulRequests: true, // Only count failures
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

---

### 11. API Authentication

**JWT Best Practices:**

```typescript
import jwt from 'jsonwebtoken';

// Generate token
function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',      // Short-lived access tokens
      issuer: 'yourapp.com',
      audience: 'yourapp.com',
    }
  );
}

// Verify token
function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'yourapp.com',
    audience: 'yourapp.com',
  });
}

// Refresh token (longer-lived, stored securely)
function generateRefreshToken(userId: string) {
  const token = crypto.randomBytes(64).toString('hex');

  // Store in database with expiration
  await db.insert(refreshTokens).values({
    token: hashToken(token),
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return token;
}
```

**Token Storage:**

| Location | Access Token | Refresh Token |
|----------|--------------|---------------|
| localStorage | Vulnerable to XSS | Never |
| sessionStorage | Vulnerable to XSS | Never |
| HttpOnly Cookie | Recommended | Recommended |
| Memory | Good for SPAs | Not persistent |

---

## Part 5: Infrastructure Security

### 12. Environment Variables

Never commit secrets to version control:

```bash
# .env (NEVER commit this)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your-256-bit-secret
API_KEY=sk_live_xxxxxxxxxxxxx
```

```bash
# .gitignore
.env
.env.local
.env.production
*.pem
*.key
```

**Accessing Secrets:**

```typescript
// Always validate required env vars at startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

validateEnv();
```

---

### 13. Dependency Security

**Audit Dependencies Regularly:**

```bash
# npm
npm audit
npm audit fix

# yarn
yarn audit

# pnpm
pnpm audit
```

**Automate with Dependabot:**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      production-dependencies:
        dependency-type: "production"
      development-dependencies:
        dependency-type: "development"
```

**Lock Files:**
Always commit lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) to ensure consistent installations.

---

## Part 6: Security Checklist

### Pre-Launch Security Checklist

**Transport Security:**
- [ ] HTTPS enabled and enforced
- [ ] HSTS header configured
- [ ] TLS 1.2+ only

**Headers:**
- [ ] CSP configured
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy configured

**Authentication:**
- [ ] Passwords hashed with bcrypt/Argon2
- [ ] MFA available
- [ ] Session management secure
- [ ] Rate limiting on auth endpoints

**Data Protection:**
- [ ] Input validation (client + server)
- [ ] Output encoding (XSS prevention)
- [ ] Parameterized queries (SQL injection)
- [ ] CSRF protection

**Infrastructure:**
- [ ] Secrets in environment variables
- [ ] Dependencies audited
- [ ] Error messages don't leak info
- [ ] Logging (without sensitive data)

---

## How Codebrand Secures Websites

At **Codebrand**, security is built into every project from day one. We don't bolt on security at the end—we design for it from the start.

### Our Security Practices

**Architecture:**
- Static-first sites reduce attack surface
- Edge hosting with built-in DDoS protection
- Minimal server-side code exposure

**Implementation:**
- Security headers on every deployment
- Input validation at all entry points
- Parameterized database queries
- Regular dependency audits

**Process:**
- Security review before launch
- Continuous monitoring
- Incident response planning
- Regular security updates

### Our Services

- **Security Audits**: Evaluate your existing website's security posture
- **Secure Development**: Build new projects with security best practices
- **Remediation**: Fix vulnerabilities in existing applications
- **Training**: Help your team understand security principles

**Worried about your website's security?**

[Contact us for a free security consultation](/contact) and let's ensure your website is protected.

---

*Have questions about website security? [Reach out to our team](/contact)—we're here to help you stay secure.*
