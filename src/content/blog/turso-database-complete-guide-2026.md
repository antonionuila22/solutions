---
title: "Turso Database Guide 2026: The Edge Database Revolution"
description: "Complete guide to Turso, the SQLite-based edge database. Learn setup, replication, Drizzle ORM integration, and why companies are switching from traditional databases. Includes real implementation examples."
author: "Ramon Nuila"
readtime: 20
img: /photos/blog/young-serious-female-programmer-using-tablet-again-2026-01-09-01-21-14-utc.webp
imageAlt: "Turso edge database architecture and global replication"
date: 2025-12-15
draft: false
categories:
  - Web Development
  - Technology
  - Databases
tags:
  - Turso
  - SQLite
  - edge database
  - libSQL
  - database
  - serverless
---

## Turso Database Guide 2026: The Edge Database Revolution

Traditional databases have a problem: they live in one place. Your users are everywhere. Every database query travels across the globe, adding latency that modern users won't tolerate.

Turso solves this by bringing your database to the edge—replicating data across 35+ locations worldwide. The result? Database queries that complete in single-digit milliseconds, no matter where your users are.

After implementing Turso in production projects, we've seen dramatic improvements in application performance. This guide shows you everything you need to know.

---

## What is Turso?

Turso is an edge-hosted, distributed database built on **libSQL**, an open-source fork of SQLite. It combines SQLite's simplicity and reliability with global replication and modern cloud infrastructure.

### Key Features

- **Global Replication**: Data replicated across 35+ edge locations
- **SQLite Compatible**: Use familiar SQL syntax and tooling
- **Embedded Replicas**: Local SQLite replicas for zero-latency reads
- **Branching**: Create database branches for testing and development
- **Serverless**: No server management, automatic scaling
- **Low Latency**: Single-digit millisecond queries from edge locations

### How Turso Works

```text
Traditional Database:
User (Tokyo) → Database (Virginia) → Response
Latency: 150-300ms

Turso Edge Database:
User (Tokyo) → Edge Replica (Tokyo) → Response
Latency: 5-20ms
```

Turso maintains a primary database and automatically replicates data to edge locations. Reads are served from the nearest replica; writes go to the primary and propagate globally.

---

## Getting Started with Turso

### Installation

```bash
# Install Turso CLI
# macOS
brew install tursodatabase/tap/turso

# Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (WSL)
curl -sSfL https://get.tur.so/install.sh | bash
```

### Authentication

```bash
# Login (opens browser for authentication)
turso auth login

# Check authentication status
turso auth status
```

### Creating Your First Database

```bash
# Create a database
turso db create my-app-db

# Create in a specific region
turso db create my-app-db --location ord  # Chicago

# List your databases
turso db list

# Get database URL
turso db show my-app-db --url

# Get authentication token
turso db tokens create my-app-db
```

### Using the Turso Shell

```bash
# Open interactive shell
turso db shell my-app-db

# Execute SQL
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, name) VALUES ('john@example.com', 'John Doe');

SELECT * FROM users;

# Exit shell
.quit
```

---

## Connecting from Your Application

### JavaScript/TypeScript (libSQL Client)

```bash
npm install @libsql/client
```

```typescript
// db.ts
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Simple query
const result = await db.execute("SELECT * FROM users");
console.log(result.rows);

// Parameterized query (prevents SQL injection)
const user = await db.execute({
  sql: "SELECT * FROM users WHERE email = ?",
  args: ["john@example.com"],
});

// Insert with returning
const newUser = await db.execute({
  sql: "INSERT INTO users (email, name) VALUES (?, ?) RETURNING *",
  args: ["jane@example.com", "Jane Doe"],
});

// Transaction
await db.batch([
  {
    sql: "INSERT INTO orders (user_id, total) VALUES (?, ?)",
    args: [1, 99.99],
  },
  {
    sql: "UPDATE users SET order_count = order_count + 1 WHERE id = ?",
    args: [1],
  },
]);
```

### Using with Drizzle ORM

Drizzle is our recommended ORM for Turso—type-safe, performant, and excellent developer experience.

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

**Define Your Schema:**

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["user", "admin"] }).default("user"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
```

**Initialize Drizzle:**

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

**Query with Full Type Safety:**

```typescript
import { db } from "./db";
import { users, posts } from "./db/schema";
import { eq, desc, and } from "drizzle-orm";

// Select all users
const allUsers = await db.select().from(users);

// Select with conditions
const admins = await db
  .select()
  .from(users)
  .where(eq(users.role, "admin"));

// Insert
const newUser = await db
  .insert(users)
  .values({
    email: "new@example.com",
    name: "New User",
  })
  .returning();

// Update
await db
  .update(users)
  .set({ role: "admin" })
  .where(eq(users.email, "john@example.com"));

// Delete
await db.delete(users).where(eq(users.id, 5));

// Join queries
const postsWithAuthors = await db
  .select({
    postTitle: posts.title,
    authorName: users.name,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.published, true))
  .orderBy(desc(posts.createdAt));
```

**Drizzle Kit Configuration:**

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
```

**Run Migrations:**

```bash
# Generate migration
npx drizzle-kit generate:sqlite

# Push changes directly (development)
npx drizzle-kit push:sqlite

# View database in Drizzle Studio
npx drizzle-kit studio
```

---

## Embedded Replicas: Zero-Latency Reads

Turso's killer feature is embedded replicas—a local SQLite file that syncs with your Turso database. Reads are instant; writes sync automatically.

```typescript
import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:local-replica.db",
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Sync replica with remote
await db.sync();

// Reads are now instant (local SQLite)
const users = await db.execute("SELECT * FROM users");

// Writes go to primary and sync
await db.execute({
  sql: "INSERT INTO users (email, name) VALUES (?, ?)",
  args: ["local@example.com", "Local User"],
});

// Sync again to get latest changes
await db.sync();
```

### When to Use Embedded Replicas

| Scenario | Use Remote | Use Embedded Replica |
|----------|------------|---------------------|
| Serverless functions | ✅ | ❌ (no persistent storage) |
| Long-running servers | ✅ | ✅ |
| Desktop apps | ❌ | ✅ |
| Mobile apps | ❌ | ✅ |
| Read-heavy workloads | ✅ | ✅ (faster) |
| Edge workers | ✅ | Depends on platform |

---

## Database Branching

Turso lets you create database branches—perfect for testing, staging, and development.

```bash
# Create a branch from production
turso db create my-app-staging --from-db my-app-production

# List branches
turso db list

# Use branch in development
export TURSO_DATABASE_URL=$(turso db show my-app-staging --url)
```

### Branching Workflow

```text
Production Database
       │
       ├── Staging Branch (for QA)
       │
       ├── Feature Branch (for development)
       │
       └── PR Branch (for pull request testing)
```

Each branch is a full copy of the database at the time of branching. Changes don't affect the parent.

---

## Global Replication

### Adding Replicas

```bash
# List available locations
turso db locations

# Add replica location
turso db replicate my-app-db nrt  # Tokyo
turso db replicate my-app-db lhr  # London
turso db replicate my-app-db syd  # Sydney

# Check replication status
turso db show my-app-db
```

### Choosing Locations

Place replicas where your users are:

| Region | Code | Location |
|--------|------|----------|
| Americas | ord | Chicago |
| Americas | dfw | Dallas |
| Americas | sea | Seattle |
| Americas | gru | São Paulo |
| Europe | lhr | London |
| Europe | ams | Amsterdam |
| Europe | fra | Frankfurt |
| Asia Pacific | nrt | Tokyo |
| Asia Pacific | sin | Singapore |
| Asia Pacific | syd | Sydney |

### Automatic Location Selection

The libSQL client automatically routes to the nearest replica:

```typescript
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!, // Routes to nearest
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

---

## Real-World Implementation: Contact Form

Here's a complete example using Turso with Astro and Drizzle:

**Schema:**

```typescript
// src/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  status: text("status", {
    enum: ["new", "read", "replied", "archived"]
  }).default("new"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
```

**API Endpoint (Astro):**

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { db } from "../../db";
import { contacts } from "../../db/schema";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, company, message } = data;

    // Validate
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Insert into Turso
    const result = await db
      .insert(contacts)
      .values({ name, email, company, message })
      .returning();

    // Send notification email (optional)
    // await sendNotificationEmail(result[0]);

    return new Response(
      JSON.stringify({ success: true, id: result[0].id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
```

**Admin Dashboard Query:**

```typescript
// Get all contacts with pagination
import { desc } from "drizzle-orm";

const page = 1;
const limit = 20;

const allContacts = await db
  .select()
  .from(contacts)
  .orderBy(desc(contacts.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);

// Get unread count
const unreadCount = await db
  .select({ count: sql`count(*)` })
  .from(contacts)
  .where(eq(contacts.status, "new"));
```

---

## Performance Optimization

### Connection Pooling

For serverless environments, reuse connections:

```typescript
// db.ts - Singleton pattern
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    db = drizzle(client);
  }
  return db;
}
```

### Indexing

Add indexes for frequently queried columns:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published, created_at);
```

With Drizzle:

```typescript
import { index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email),
}));
```

### Query Optimization

```typescript
// Bad: Select all columns
const users = await db.select().from(users);

// Good: Select only needed columns
const users = await db
  .select({ id: users.id, name: users.name })
  .from(users);

// Bad: N+1 queries
for (const user of users) {
  const posts = await db.select().from(posts).where(eq(posts.authorId, user.id));
}

// Good: Single join query
const usersWithPosts = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId));
```

---

## Turso vs Traditional Databases

| Feature | Turso | PostgreSQL | PlanetScale |
|---------|-------|------------|-------------|
| Edge replication | ✅ 35+ locations | ❌ | ✅ Limited |
| Embedded replicas | ✅ | ❌ | ❌ |
| Serverless | ✅ | Requires setup | ✅ |
| SQL dialect | SQLite | PostgreSQL | MySQL |
| Free tier | 9GB storage | Varies | 5GB storage |
| Branching | ✅ | ❌ | ✅ |
| Cold starts | None | Possible | None |

### When to Choose Turso

**Choose Turso when:**
- Global users need low latency
- Building edge-first applications
- Using serverless architecture
- Need simple, SQLite-compatible database
- Want embedded replicas for offline support

**Consider alternatives when:**
- Need advanced PostgreSQL features (JSONB, full-text search)
- Require complex transactions
- Already invested in MySQL/PostgreSQL ecosystem

---

## Pricing

### Free Tier (Starter)

- 9GB total storage
- 500 databases
- 3 locations per database
- 1 billion row reads/month
- 25 million row writes/month

### Scaler ($29/month)

- 24GB storage (then $0.75/GB)
- Unlimited databases
- 6 locations per database
- Embedded replicas
- Point-in-time recovery

### Enterprise

- Custom storage
- Unlimited locations
- Dedicated support
- SLA guarantees

---

## Common Patterns

### Soft Deletes

```typescript
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  deletedAt: text("deleted_at"),
});

// "Delete" a user
await db
  .update(users)
  .set({ deletedAt: new Date().toISOString() })
  .where(eq(users.id, 1));

// Query only active users
const activeUsers = await db
  .select()
  .from(users)
  .where(isNull(users.deletedAt));
```

### Audit Logging

```typescript
export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey(),
  tableName: text("table_name").notNull(),
  recordId: integer("record_id").notNull(),
  action: text("action", { enum: ["create", "update", "delete"] }).notNull(),
  oldData: text("old_data"),
  newData: text("new_data"),
  userId: integer("user_id"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Log changes
async function logChange(table: string, id: number, action: string, oldData?: any, newData?: any) {
  await db.insert(auditLog).values({
    tableName: table,
    recordId: id,
    action,
    oldData: oldData ? JSON.stringify(oldData) : null,
    newData: newData ? JSON.stringify(newData) : null,
  });
}
```

### Full-Text Search

SQLite has built-in FTS5:

```sql
-- Create FTS table
CREATE VIRTUAL TABLE posts_fts USING fts5(title, content, content=posts, content_rowid=id);

-- Populate FTS index
INSERT INTO posts_fts(posts_fts) VALUES('rebuild');

-- Search
SELECT * FROM posts_fts WHERE posts_fts MATCH 'javascript tutorial';
```

---

## Why We Use Turso at Codebrand

At **Codebrand**, we've adopted Turso as our primary database for new projects. Here's why:

**Performance**: Our clients' users are global. Turso's edge replication means fast database queries regardless of location.

**Simplicity**: SQLite is battle-tested and simple. No complex configuration, no connection pooling headaches.

**Cost-Effective**: The free tier handles most small-to-medium projects. Pay only when you scale.

**Developer Experience**: Combined with Drizzle ORM, we get type-safe queries with excellent autocomplete and error checking.

**Serverless-Ready**: Perfect for our Astro + Netlify stack. No cold start penalties, no connection limits.

### How We Can Help

Whether you're migrating to Turso or building a new application, we can help you:

- **Architecture**: Design your database schema for optimal performance
- **Migration**: Move from PostgreSQL, MySQL, or other databases to Turso
- **Integration**: Connect Turso with Astro, Next.js, or your framework of choice
- **Optimization**: Index tuning, query optimization, and replication strategy

**Ready to supercharge your database performance?**

[Contact us for a free consultation](/contact) and let's discuss how Turso can transform your application.

---

*Need help implementing Turso? [Reach out to our team](/contact)—we've built production applications with Turso and know every optimization trick.*
