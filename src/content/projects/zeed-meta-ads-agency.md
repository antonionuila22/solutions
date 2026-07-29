---
title: Zeed - Meta Ads Marketing Agency Website
description: Astro and React landing page for a Meta Ads agency with no website. It went from 0 to 50 daily visitors in the first 30 days, per Zeed's analytics.
author: Codebrand Team
img: /photos/projects/zeed.avif
category: Web Development
tags:
  - Digital Marketing
  - Meta Ads
  - Lead Generation
  - Landing Page
  - Agency Website
  - Astro
  - React
client: Zeed Marketing Agency
date: 2024-12-10
featured: true
link: https://zeedst.netlify.app/
results:
  metric1: 0 → 50 daily visitors in 30 days
resultsNote: >-
  Figure reported by Zeed from their own analytics, covering the first 30 days
  after the December 2024 launch. Codebrand did not have access to the property
  and has not independently verified it. Zeed has since replaced this page with
  their current Signal Grid offer.
# TODO(139%) — el rewrite anterior publicaba "139% traffic growth" junto a "0 → 50 daily
#   visitors". Las dos no pueden ser ciertas a la vez: si la base era 0 (Zeed no tenía sitio),
#   el crecimiento porcentual no está definido. Se conservó el 0 → 50 por ser el dato
#   coherente con un lanzamiento desde cero. Si Zeed confirma que el 139% era un mes contra
#   otro (p. ej. semana 1 vs. semana 4), se puede restaurar EN LUGAR del 0 → 50, nunca junto a él.
# TODO(evidencia) — pedirle a Zeed la captura de Analytics o el export que respalda el
#   "0 → 50 daily visitors" del primer mes, con las fechas exactas del rango medido.
# TODO(métricas de negocio) — pedirle a Zeed para cerrar el caso:
#   1) strategy calls agendadas por Calendly desde el sitio, por mes, desde dic-2024
#   2) cuántas de esas llamadas se convirtieron en cliente
#   3) sesiones/mes actuales en Analytics (el 0 → 50 es solo del primer mes)
#   4) permiso explícito para citar el nombre y las cifras de sus propios clientes
#   Las cifras que hoy publica su sitio ($5.8M en ventas, 322x ROAS) son resultados de
#   campañas de Zeed para SUS clientes, NO resultados de nuestro trabajo: no se usan aquí.
draft: false
---

## Context

Zeed is a digital marketing agency that runs Meta Ads for high-ticket service businesses — coaches, consultants, lawyers and other agencies, where a single client is worth thousands of dollars, not tens.

They had the operational side handled and a roster of clients. What they did not have was a website. Their entire acquisition ran on referrals and cold outreach.

## The challenge

Selling a high-ticket retainer with no website is a credibility problem before it is a marketing problem. A prospect who has just been cold-emailed by an ads agency does one thing next: they look it up. If there is nothing to find, the conversation ends there, silently, and the agency never learns it happened.

There was a second, subtler cost. Without published pricing, every enquiry — including the ones with no budget — turned into a call. Zeed's most limited resource is the time of the people who run the campaigns, and it was being spent disqualifying prospects one by one.

## How we worked

**1. Positioning before layout.** We started from who they wanted on a call and who they did not, and built the page structure around that filter rather than around a generic agency template.

**2. Proof up front.** A case studies section with real client results, so the page answers "does this actually work?" before it asks for anything.

**3. Pricing published on purpose.** A transparent pricing table that pre-qualifies visitors. Anyone who books after seeing the numbers has already accepted the ballpark.

**4. Two paths to contact.** Calendly for prospects ready to schedule, a WhatsApp widget for the ones who want to ask one question first.

**5. Built for speed.** Astro with React islands: interactive components load only where they are needed, so a paid-traffic landing page does not pay a framework tax on first render.

**6. Analytics from day one.** Instrumented at launch — which is the only reason the first-month figure below exists at all.

## Results

- **0 → 50 daily visitors in the first 30 days after launch**, with no paid advertising driving them. Figure reported by Zeed from their own analytics; we did not have access to the property.
- **A qualification filter that runs without a human**: published pricing means the calls that get booked start further along.

Two caveats a prospect deserves up front. The visitor figure covers the first month after the December 2024 launch and nothing since. And Zeed has replaced that page with their current Signal Grid offer, so what loads at the link above is no longer the site described here.

## Tech stack

Astro, React, Tailwind CSS, Framer Motion, Netlify CDN.

## What we delivered

- High-converting landing page built on Astro with React islands
- Case studies section presenting real client results
- Transparent pricing table for lead pre-qualification
- Calendly integration for strategy call booking
- WhatsApp widget for instant contact
- Trust section with client results and FAQ
- Dark, premium visual system matched to their high-ticket positioning
- Netlify CDN deployment
