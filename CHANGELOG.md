# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Honduras software-development SEO cluster (Spanish, hub & spoke): pillar page `/hn/desarrollo-de-software-honduras` plus cluster pages `/hn/desarrollo-de-crm-honduras`, `/hn/sistemas-empresariales-honduras`, and `/hn/equipo-de-desarrollo-dedicado-honduras` — all fully cross-linked, with Service + FAQPage schema, and a dedicated-team offer (5 developers + PM) from $11,900/mo with weekly sprints and a 6-month minimum. Linked from the `/hn/desarrollo-web-honduras` services hub.
- Team profile pages for Catherine Morel (UX/UI Expert) and Iris Gomez (Project Coordinator) at `/team/catherine-morel` and `/team/iris-gomez`, mirroring the Ramon Nuila profile (placeholder bio copy with TODOs pending real details)
- "View Profile" links on team cards (`Ourteam.astro`), wiring Ramon, Catherine, and Iris cards to their profile pages via a new optional `profileUrl` field
- `.env.example` documenting the required environment variables (Turso, Resend, contact recipient)

### Changed
- Renamed the "Larisa Lopez" team card to "Catherine Morel" (its photo `Cmorel.webp` already belonged to Catherine) across `Ourteam.astro` and the team page schema
- WhatsApp floating widget now opens chats via `api.whatsapp.com/send/` (phone_number link) instead of `wa.me`
- Improved copy readability (shorter sentences, plainer wording, scannable lists) on the Digital Marketing, E-commerce, Healthcare, Law Firms, Travel Agency, and Terms pages, per SEO audit — no structural, component, or legal-meaning changes
- Synced README.md and CLAUDE.md to the real stack (Astro 7, React 19, GSAP + Lenis, Node 22)

### Removed
- Stray root-level `07167689-03ae-426e-8cfd-6632529e8319.html` artifact that had been committed accidentally

### Fixed
- Updated all background gradient classes from `bg-linear-to-*` to `bg-gradient-to-*` for Tailwind CSS v4 compatibility
- Resolved Git merge conflicts in all service pages
- Fixed styling issues across service pages

## [1.2.0] - 2025-10-21

### Added
- New service pages:
  - 3D Rendering services page with comprehensive features and pricing
  - Animation services page showcasing 2D/3D animation capabilities
  - Promotional Products page with sublimation and printing services
  - Video Production services page with production workflow
- TechStack component for displaying technology logos
- Web Development services page with detailed service offerings
- ProcessSteps component for visualizing workflow processes

### Changed
- Restored service pages without GSAP components for better stability
- Updated Tailwind CSS gradient syntax to v4 standards
- Enhanced Contact Page with improved SEO metadata and user-friendly form design
- Improved code structure and readability across components

### Fixed
- Corrected Tailwind CSS gradient classes throughout the application
- Fixed background styling inconsistencies
- Resolved dependency conflicts

## [1.1.0] - 2025-10-20

### Added
- Enhanced Team Page with creative design and improved member profiles
- New blog posts:
  - Website costs and pricing guide
  - Advertising strategies for digital marketing
  - Landing page analysis and optimization
  - SEO checklist for website optimization
  - Platform comparisons (WordPress, Shopify, etc.)
  - Sales funnels and conversion optimization
  - Introduction to Large Language Models (LLMs)
  - Common pitfalls when hiring agencies
  - Introduction to Astro framework
- Service Areas Page with improved layout and content
- Updated 404 error page

### Changed
- Refactored component structure for better maintainability
- Improved code consistency across the application
- Updated dependencies for better performance
- Enhanced SEO metadata across pages

### Fixed
- Corrected typo in testimonials section heading
- Improved code formatting throughout the project
- Fixed module resolution with updated tsconfig.json

## [1.0.0] - 2025-10-15

### Added
- Initial release of Codebrand Solutions website
- Core service pages (UX/UI, Branding, SEO, Social Media)
- Contact form with email integration
- Team section with member profiles
- FAQ component
- Responsive navigation
- Mobile-first design approach

### Changed
- Updated build script to include legacy-peer-deps
- Added .npmrc configuration for dependency management

### Removed
- Unused @vercel functions and OIDC dependencies from package-lock.json

---

## Version History Summary

- **v1.2.0** - Service pages expansion, Tailwind CSS v4 updates
- **v1.1.0** - Team page enhancement, blog content addition, SEO improvements
- **v1.0.0** - Initial release with core features

## Links

- [Repository](https://github.com/antonionuila22/solutions)
- [Issues](https://github.com/antonionuila22/solutions/issues)
- [Discussions](https://github.com/antonionuila22/solutions/discussions)
