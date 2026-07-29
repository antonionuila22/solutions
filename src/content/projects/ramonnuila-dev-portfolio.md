---
title: ramonnuila.dev — A Dynamic Developer Portfolio at 100/100
description: An interactive portfolio built with Astro islands and smooth-scroll motion that still scores 100/100 on mobile performance. LCP 0.9s, 10ms blocking time, 204 KB total. How interactivity and speed stop being a trade-off.
author: Codebrand Team
img: /photos/projects/ramonnuila-dev.jpg
category: Web Development
tags:
  - Astro
  - Portfolio
  - Astro Islands
  - Core Web Vitals
  - Performance
  - Motion Design
  - Netlify
client: Codebrand (in-house build)
date: 2026-06-15
featured: true
link: https://ramonnuila.dev/
results:
  metric1: 100/100 mobile performance
  metric2: 0.9 s Largest Contentful Paint
  metric3: 204 KB total page weight
resultsLabel: Measured on the live site
resultsNote: >-
  Measured by Codebrand against ramonnuila.dev on 25 July 2026 using Lighthouse
  12 with mobile emulation, plus curl for transfer timings. Performance 100,
  Best Practices 100, SEO 100, Accessibility 96. These are properties of the
  build that anyone can reproduce today — not business metrics.
# TODO(usuario) — para cerrar este caso:
#   1) confirmar la fecha real de publicación (hoy: 15 de junio de 2026, aproximada)
#   2) decidir si este caso debe ir en el portafolio de la agencia: es un sitio
#      PROPIO (portafolio personal del fundador), no trabajo de cliente. Está
#      declarado como tal en el frontmatter y en el cuerpo, pero es una decisión
#      de posicionamiento, no técnica. Ver la nota al final del caso.
---

## Context

This one is ours. `ramonnuila.dev` is the personal portfolio of Ramon Nuila, Codebrand's founder — an in-house build, not client work, and it is labelled that way here because a portfolio that quietly passes off its own site as a client case is not a portfolio worth trusting.

We are including it for a specific reason: it is the cleanest proof we have that **an interactive site does not have to be a slow one.**

## The problem worth solving

Developer portfolios tend to fail in one of two directions.

The first failure is the static résumé — fast, correct, and completely forgettable. It loads instantly and convinces nobody, because a developer who builds interfaces for a living has just demonstrated that they cannot build an interesting one.

The second failure is the showreel. Smooth scroll, staggered reveals, a cursor that follows you, WebGL somewhere it does not belong. It looks extraordinary on the designer's laptop and takes six seconds to become useful on a phone on mobile data — which is where a real client will open it, usually once.

The brief was to refuse both. Full motion design, real interactivity, and a perfect mobile performance score. Not a compromise between them.

## How we built it

**Islands, not a single-page app.** The page is Astro, and every interactive piece is an island hydrated with `client:visible` — it ships its JavaScript only when it scrolls into view. On first paint the browser gets finished HTML; the interactive parts wake up as you reach them. That is why the page carries eight islands and still records **10 ms of total blocking time**. Nothing is competing for the main thread while the visitor is trying to read.

**Motion that costs nothing upfront.** Smooth scrolling runs on Lenis, and section reveals are tied to scroll position rather than to a timeline that must run before content appears. The distinction matters: animation that *gates* content makes a fast site feel slow and breaks entirely if the script fails. Animation that *accompanies* content does not.

**Structure as navigation.** Five numbered destinations — Home, Work, About, Lab, Contact — and six sections in one continuous document. Services are enumerated 01 through 06, each with its own stack listed underneath: web development, backend and APIs, e-commerce, DevOps and cloud, technical SEO, and software engineering. The featured work links out to Codebrand Solutions, Support Labs, Nail Your Marketing and Work Ninjas. The process is four steps: Discovery, Architect, Engineer, Ship and Scale.

**Structured data.** The page emits a `Person` schema with role, employer, education, location in San Pedro Sula, and topics of expertise. Small, unglamorous, and the reason a search engine can describe the page correctly instead of guessing.

**Weight discipline.** The whole page — markup, styles, scripts, fonts and imagery — comes to **204 KB**. The document itself travels in about 58 KB. That budget is what makes the performance score possible, and it was a constraint held throughout, not an optimization pass bolted on at the end.

## Measured results

Lighthouse 12, mobile emulation, run against the live site on 25 July 2026:

| Metric | Result |
|---|---|
| Performance | **100 / 100** |
| Best Practices | **100 / 100** |
| SEO | **100 / 100** |
| Accessibility | 96 / 100 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 0.9 s |
| Total Blocking Time | 10 ms |
| Cumulative Layout Shift | 0.016 |
| Total page weight | 204 KB |

Time to first byte from Honduras is 356 ms, with the full document delivered in 507 ms from Netlify's edge.

A perfect mobile performance score is uncommon on any site with real motion design. It is not a trick — it is the direct consequence of shipping HTML first and JavaScript last.

## What we delivered

- Single-page interactive portfolio with five numbered destinations
- Six enumerated service areas, each with its own technology list
- Featured work section linking four projects
- Four-step process section
- Live availability status in the header
- Continuous technology marquee
- Smooth-scroll motion system with scroll-linked section reveals
- `Person` structured data with role, employer, education and location
- Deployed on Netlify behind its CDN

## Tech stack

Astro 6 with islands architecture and `client:visible` hydration, Lenis for smooth scrolling, custom CSS, JSON-LD structured data, deployed to Netlify. Dark theme, single accent colour, editorial display typography.

## A note on including our own site

Listing your own site as portfolio work is a move worth being honest about. We include it because the measurement is reproducible by anyone in about sixty seconds, and because the point it proves — interactivity and Core Web Vitals are not opposites — is one we make on client projects constantly and can rarely demonstrate this cleanly.

If you want the same result on your own site, the method is not a secret: ship HTML, hydrate on visibility, hold a weight budget, and never let an animation be the thing that decides whether your content appears.
