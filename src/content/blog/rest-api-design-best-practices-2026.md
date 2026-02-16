---
title: "REST API Design Best Practices (2026)"
description: "Complete guide to REST API design best practices in 2026. Learn URL structure, HTTP methods, status codes, versioning, pagination, error handling, and documentation. Build professional, maintainable APIs."
author: "Ramon Nuila"
readtime: 24
img: /photos/blog/team-of-developers-talking-in-office-analyzing-co-2026-01-08-02-32-00-utc.webp
imageAlt: "REST API design architecture and best practices"
date: 2025-12-15
draft: false
categories:
  - Web Development
  - Technology
  - Backend
tags:
  - REST API
  - API design
  - backend development
  - web services
  - HTTP
  - API best practices
---

## REST API Design Best Practices 2026: Build APIs Developers Love

A well-designed API is a joy to use. A poorly designed one creates frustration, bugs, and endless support tickets. The difference often comes down to following established patterns and conventions.

This guide covers everything you need to design REST APIs that developers actually enjoy working with—clear URL structures, proper HTTP methods, meaningful status codes, and robust error handling.

---

## Part 1: URL Structure

### 1. Resource Naming

URLs should represent resources (nouns), not actions (verbs).

**Good URL Design:**

```text
GET    /users              # List all users
GET    /users/123          # Get user 123
POST   /users              # Create a new user
PUT    /users/123          # Update user 123
DELETE /users/123          # Delete user 123

GET    /users/123/orders   # List orders for user 123
GET    /orders/456         # Get order 456
```

**Bad URL Design:**

```text
GET    /getUsers           # Verb in URL
POST   /createUser         # Verb in URL
GET    /getUserById?id=123 # Query param for resource ID
POST   /deleteUser/123     # Wrong HTTP method
```

### 2. Plural vs Singular

Use plural nouns for consistency:

```text
✅ /users        (not /user)
✅ /products     (not /product)
✅ /orders       (not /order)
✅ /categories   (not /category)
```

### 3. Hierarchical Resources

Express relationships through URL hierarchy:

```text
# User's orders
GET /users/123/orders

# Specific order for a user
GET /users/123/orders/456

# Order items
GET /orders/456/items

# Alternative: filter approach (also valid)
GET /orders?user_id=123
```

**When to Use Hierarchy vs Query Parameters:**

| Use Hierarchy When | Use Query Params When |
|-------------------|----------------------|
| Strong parent-child relationship | Filtering/searching |
| Resource can't exist without parent | Optional criteria |
| Always accessed in context | Cross-resource queries |

### 4. URL Conventions

```text
# Use lowercase
✅ /users/123/orders
❌ /Users/123/Orders

# Use hyphens for multi-word resources
✅ /user-profiles
❌ /userProfiles
❌ /user_profiles

# No trailing slashes
✅ /users/123
❌ /users/123/

# No file extensions
✅ /users/123
❌ /users/123.json
```

---

## Part 2: HTTP Methods

### 5. Method Semantics

Each HTTP method has specific semantics—use them correctly:

| Method | Purpose | Idempotent | Safe | Request Body |
|--------|---------|------------|------|--------------|
| GET | Retrieve resource | Yes | Yes | No |
| POST | Create resource | No | No | Yes |
| PUT | Replace resource | Yes | No | Yes |
| PATCH | Partial update | Yes* | No | Yes |
| DELETE | Remove resource | Yes | No | Optional |

**Idempotent**: Same request repeated = same result
**Safe**: Doesn't modify server state

### 6. Method Usage Examples

**GET - Retrieve Resources:**

```http
GET /users HTTP/1.1
Host: api.example.com
Authorization: Bearer token123

# Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    { "id": 1, "name": "John", "email": "john@example.com" },
    { "id": 2, "name": "Jane", "email": "jane@example.com" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**POST - Create Resource:**

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token123

{
  "name": "New User",
  "email": "newuser@example.com",
  "role": "member"
}

# Response
HTTP/1.1 201 Created
Location: /users/3
Content-Type: application/json

{
  "data": {
    "id": 3,
    "name": "New User",
    "email": "newuser@example.com",
    "role": "member",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**PUT - Replace Resource:**

```http
PUT /users/3 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "Updated User",
  "email": "updated@example.com",
  "role": "admin"
}

# Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "id": 3,
    "name": "Updated User",
    "email": "updated@example.com",
    "role": "admin",
    "updatedAt": "2026-01-15T11:00:00Z"
  }
}
```

**PATCH - Partial Update:**

```http
PATCH /users/3 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "role": "admin"
}

# Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "id": 3,
    "name": "Updated User",
    "email": "updated@example.com",
    "role": "admin",
    "updatedAt": "2026-01-15T11:05:00Z"
  }
}
```

**DELETE - Remove Resource:**

```http
DELETE /users/3 HTTP/1.1
Host: api.example.com
Authorization: Bearer token123

# Response
HTTP/1.1 204 No Content
```

---

## Part 3: HTTP Status Codes

### 7. Success Codes (2xx)

| Code | Name | When to Use |
|------|------|-------------|
| 200 | OK | GET, PUT, PATCH success |
| 201 | Created | POST created new resource |
| 204 | No Content | DELETE success, no body |
| 202 | Accepted | Async processing started |

### 8. Client Error Codes (4xx)

| Code | Name | When to Use |
|------|------|-------------|
| 400 | Bad Request | Invalid request body/params |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |

### 9. Server Error Codes (5xx)

| Code | Name | When to Use |
|------|------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service failed |
| 503 | Service Unavailable | Temporarily unavailable |
| 504 | Gateway Timeout | Upstream timeout |

### 10. Status Code Decision Tree

```text
Request received
    │
    ├── Valid authentication?
    │   ├── No → 401 Unauthorized
    │   └── Yes → Continue
    │
    ├── Has permission?
    │   ├── No → 403 Forbidden
    │   └── Yes → Continue
    │
    ├── Resource exists? (for GET/PUT/PATCH/DELETE)
    │   ├── No → 404 Not Found
    │   └── Yes → Continue
    │
    ├── Request valid?
    │   ├── No → 400 Bad Request
    │   └── Yes → Continue
    │
    ├── Validation passes?
    │   ├── No → 422 Unprocessable Entity
    │   └── Yes → Continue
    │
    ├── Business rules pass?
    │   ├── No → 409 Conflict (or appropriate 4xx)
    │   └── Yes → Continue
    │
    └── Process request
        ├── Success → 200/201/204
        └── Error → 500
```

---

## Part 4: Request & Response Design

### 11. Request Body Structure

**Consistent JSON Structure:**

```typescript
// POST /users
{
  "name": "John Doe",
  "email": "john@example.com",
  "profile": {
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg"
  },
  "preferences": {
    "newsletter": true,
    "theme": "dark"
  }
}
```

**Conventions:**
- Use camelCase for property names
- Use ISO 8601 for dates: `2026-01-15T10:30:00Z`
- Use consistent null handling
- Avoid deeply nested structures (3 levels max)

### 12. Response Envelope

Wrap responses in a consistent structure:

```typescript
// Success response
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  }
}

// List response
{
  "data": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "links": {
    "self": "/users?page=1",
    "next": "/users?page=2",
    "last": "/users?page=5"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-15T10:30:00Z"
  }
}
```

### 13. TypeScript Implementation

```typescript
// Response types
interface ApiResponse<T> {
  data: T;
  meta: ResponseMeta;
}

interface ListResponse<T> {
  data: T[];
  meta: ListMeta;
  links: PaginationLinks;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
  meta: ResponseMeta;
}

interface ResponseMeta {
  requestId: string;
  timestamp: string;
}

interface ListMeta extends ResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginationLinks {
  self: string;
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

// Usage
function success<T>(data: T, meta?: Partial<ResponseMeta>): ApiResponse<T> {
  return {
    data,
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

function error(code: string, message: string, details?: ValidationError[]): ErrorResponse {
  return {
    error: { code, message, details },
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
  };
}
```

---

## Part 5: Pagination, Filtering & Sorting

### 14. Pagination

**Offset-Based Pagination (Simple):**

```http
GET /users?page=2&limit=20

# Response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 20,
    "totalPages": 5
  },
  "links": {
    "first": "/users?page=1&limit=20",
    "prev": "/users?page=1&limit=20",
    "self": "/users?page=2&limit=20",
    "next": "/users?page=3&limit=20",
    "last": "/users?page=5&limit=20"
  }
}
```

**Cursor-Based Pagination (Better for Large Datasets):**

```http
GET /users?cursor=eyJpZCI6MTAwfQ&limit=20

# Response
{
  "data": [...],
  "meta": {
    "limit": 20,
    "hasMore": true
  },
  "cursors": {
    "next": "eyJpZCI6MTIwfQ",
    "prev": "eyJpZCI6MTAwfQ"
  }
}
```

**When to Use Each:**

| Pagination Type | Use When |
|-----------------|----------|
| Offset | Small datasets, need page numbers |
| Cursor | Large datasets, real-time data, infinite scroll |

### 15. Filtering

Use query parameters for filtering:

```http
# Single filter
GET /products?category=electronics

# Multiple filters
GET /products?category=electronics&brand=apple&minPrice=100&maxPrice=1000

# Array filter
GET /products?tags=featured,sale,new

# Date range
GET /orders?createdAfter=2026-01-01&createdBefore=2026-01-31

# Search
GET /products?search=iphone
```

**Implementation:**

```typescript
interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

function buildProductQuery(filters: ProductFilters) {
  let query = db.select().from(products);

  if (filters.category) {
    query = query.where(eq(products.category, filters.category));
  }

  if (filters.minPrice) {
    query = query.where(gte(products.price, filters.minPrice));
  }

  if (filters.maxPrice) {
    query = query.where(lte(products.price, filters.maxPrice));
  }

  if (filters.search) {
    query = query.where(
      or(
        like(products.name, `%${filters.search}%`),
        like(products.description, `%${filters.search}%`)
      )
    );
  }

  return query;
}
```

### 16. Sorting

```http
# Single sort
GET /products?sort=price

# Descending sort
GET /products?sort=-price

# Multiple sorts
GET /products?sort=-createdAt,name

# Alternative syntax
GET /products?sortBy=price&sortOrder=desc
```

**Implementation:**

```typescript
function applySorting(query: Query, sort: string) {
  const fields = sort.split(',');

  for (const field of fields) {
    const isDescending = field.startsWith('-');
    const fieldName = isDescending ? field.slice(1) : field;

    if (isDescending) {
      query = query.orderBy(desc(products[fieldName]));
    } else {
      query = query.orderBy(asc(products[fieldName]));
    }
  }

  return query;
}
```

---

## Part 6: Versioning

### 17. Versioning Strategies

**URL Path Versioning (Recommended):**

```text
GET /v1/users
GET /v2/users
```

Pros: Clear, easy to implement, cacheable
Cons: URL changes between versions

**Header Versioning:**

```http
GET /users HTTP/1.1
Accept: application/vnd.api+json; version=2
```

Pros: Clean URLs
Cons: Harder to test, less visible

**Query Parameter Versioning:**

```text
GET /users?version=2
```

Pros: Easy to implement
Cons: Not RESTful, caching issues

### 18. Version Implementation

```typescript
// Express.js route organization
// /routes/v1/users.ts
const v1Router = express.Router();

v1Router.get('/users', async (req, res) => {
  // V1 implementation
});

// /routes/v2/users.ts
const v2Router = express.Router();

v2Router.get('/users', async (req, res) => {
  // V2 implementation with breaking changes
});

// app.ts
app.use('/v1', v1Router);
app.use('/v2', v2Router);
```

---

## Part 7: Error Handling

### 19. Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: ErrorDetail[]; // Specific errors
    help?: string;          // Link to documentation
  };
}

interface ErrorDetail {
  field?: string;
  code: string;
  message: string;
}
```

**Example Error Responses:**

```json
// 400 Bad Request
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is not valid JSON",
    "help": "https://docs.api.com/errors/invalid-request"
  }
}

// 422 Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields failed validation",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      },
      {
        "field": "password",
        "code": "TOO_SHORT",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}

// 404 Not Found
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 123 not found"
  }
}

// 429 Rate Limited
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds",
    "details": [
      {
        "code": "RETRY_AFTER",
        "message": "60"
      }
    ]
  }
}
```

### 20. Error Handler Implementation

```typescript
// Custom error classes
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: ErrorDetail[]
  ) {
    super(message);
  }
}

class ValidationError extends ApiError {
  constructor(details: ErrorDetail[]) {
    super(422, 'VALIDATION_ERROR', 'Validation failed', details);
  }
}

class NotFoundError extends ApiError {
  constructor(resource: string, id: string | number) {
    super(404, 'RESOURCE_NOT_FOUND', `${resource} with ID ${id} not found`);
  }
}

// Global error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Log error for debugging
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Unknown error - don't expose details
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}

// Usage
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);

    if (!user) {
      throw new NotFoundError('User', req.params.id);
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});
```

---

## Part 8: Authentication & Security

### 21. Authentication Methods

**Bearer Token (Recommended):**

```http
GET /users HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**API Key:**

```http
GET /users HTTP/1.1
X-API-Key: sk_live_xxxxxxxxxxxxx
```

### 22. Security Headers

```typescript
// Security middleware
app.use((req, res, next) => {
  // Prevent caching of authenticated responses
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');

  // Security headers
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');

  next();
});
```

### 23. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    });
  },
});

app.use('/api/', apiLimiter);
```

---

## Part 9: Documentation

### 24. OpenAPI/Swagger

```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0
  description: API for managing users

servers:
  - url: https://api.example.com/v1

paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

    post:
      summary: Create a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time

    CreateUserRequest:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email

    UserResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/User'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

---

## Part 10: API Design Checklist

### Before Publishing Your API

**URL Design:**
- [ ] Use plural nouns for resources
- [ ] Use lowercase with hyphens
- [ ] Hierarchical structure for relationships
- [ ] No trailing slashes

**HTTP Methods:**
- [ ] GET for retrieval (no body)
- [ ] POST for creation
- [ ] PUT for full replacement
- [ ] PATCH for partial updates
- [ ] DELETE for removal

**Status Codes:**
- [ ] 200/201/204 for success
- [ ] 400 for bad requests
- [ ] 401 for authentication issues
- [ ] 403 for authorization issues
- [ ] 404 for not found
- [ ] 422 for validation errors

**Response Format:**
- [ ] Consistent envelope structure
- [ ] Meaningful error messages
- [ ] Pagination for lists
- [ ] ISO 8601 dates

**Security:**
- [ ] HTTPS only
- [ ] Authentication implemented
- [ ] Rate limiting
- [ ] Input validation

**Documentation:**
- [ ] OpenAPI spec
- [ ] Example requests/responses
- [ ] Error code reference

---

## How Codebrand Builds APIs

At **Codebrand**, we apply these best practices to every API we build. Our clients get APIs that are easy to use, well-documented, and built to scale.

### Our API Development Services

- **API Design**: Architect clean, intuitive APIs from scratch
- **API Development**: Build robust, secure APIs with modern technologies
- **API Documentation**: Create comprehensive documentation developers love
- **API Integration**: Connect your systems with third-party APIs
- **API Optimization**: Improve performance and scalability of existing APIs

### Technologies We Use

- **Frameworks**: Node.js, Astro, Next.js
- **Databases**: Turso, PostgreSQL, MongoDB
- **Documentation**: OpenAPI/Swagger, Redoc
- **Hosting**: Cloudflare Workers, Netlify Functions, Vercel

**Need a professional API for your project?**

[Contact us for a free consultation](/contact) and let's discuss how we can build an API developers will love.

---

*Have questions about API design? [Reach out to our team](/contact)—we're passionate about building great APIs.*
