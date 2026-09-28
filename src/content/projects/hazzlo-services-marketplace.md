---
title: Hazzlo - Verified Services Marketplace
description: A two sided marketplace for hiring verified companies and contractors in Honduras, built on Next.js, Supabase and Netlify. Codebrand's own product.
seoTitle: Hazzlo, a Verified Services Marketplace Built in Honduras
author: Codebrand Team
img: /photos/projects/hazzlo.avif
category: Web Development
tags:
  - Marketplace
  - Next.js
  - React Server Components
  - Supabase
  - Identity Verification
  - Product Engineering
  - Honduras
client: Codebrand (in-house product)
date: 2026-09-28
featured: true
link: https://hazzlo.app/
results:
  metric1: 265 service slugs across 22 sectors
  metric2: 0 third party tracking scripts on the public site
  metric3: 0 raster images on the home page
resultsLabel: Scope delivered
resultsNote: >-
  These are scope figures counted from the live product on 28 September 2026,
  not performance outcomes. Hazzlo launched days before this page was written,
  with one verified company in the directory and an empty job board, so no
  traffic, usage, conversion or revenue data exists for it yet. Nothing of that
  kind is published here, and nothing will be until it has been measured.
# TODO(métricas): cuando la plataforma lleve un trimestre operando, pedir al equipo:
#   1) empresas y contratistas verificados, y cuántos fueron rechazados en la revisión
#   2) solicitudes aceptadas y proyectos publicados por mes
#   3) tiempo medio entre el registro y la aprobación de la verificación
#   Ninguna de esas cifras existe hoy. No publicar estimaciones.
draft: false
---

## Context

Hiring someone in Honduras usually starts in a WhatsApp group or under a Facebook post. A number gets passed along, a price is settled in messages, a deposit changes hands. There is no contract, no invoice, and when the work goes wrong there is nobody to complain to.

The same problem runs in the other direction. Professionals who do careful work compete against profiles that do not exist, against prices that cannot be real, and against reviews the seller wrote. Doing the job properly does not show up anywhere, because nobody can check it.

Hazzlo is our answer to that. It is a directory of verified companies and contractors, live in San Pedro Sula and built to open city by city.

One thing belongs at the top, before anything else. Hazzlo is not client work. Codebrand designed it, built it and owns it, and at the time of writing Codebrand is the only verified company listed on it. Every page says so in the footer. It appears in this portfolio because it is the most complete system we have shipped, not because a client paid for it.

## The challenge

The obvious way to build a hiring marketplace is to sit in the middle of the money. Take the payment, hold it in escrow, release it when both sides agree, and charge a percentage. That model funds itself, and it is what almost every platform in this category does.

We did not build that, and the reason is the market. In Honduras the scarce thing is not payment infrastructure. It is knowing who you are dealing with. A buyer does not need help moving money to a contractor; they need to know the contractor is a real company with a real tax ID and a real history before the deposit leaves their hands.

So Hazzlo never touches the payment for the work. It is not a party to the contract, it does not set the price, and it takes no commission on the job. That decision removes escrow disputes and chargeback fraud from the threat model entirely, and it concentrates the entire engineering investment in one place: proving identity and protecting reputation.

It also sets a harder bar. A platform that holds no money has exactly two sanctions available, delisting a provider and withdrawing its seal, so both had to be designed from the first day to be taken away.

## How we worked

**Verification built on the instruments the country actually uses.** For a company: the RTN, a current operating permit, and the legal representative's identity document. For an independent contractor: the national ID. Each one is read by a person, and the date of that review is published on the profile. This is not a translated template with the field names changed.

**Verification that runs both ways.** The buyer confirms their identity before their contact details are released to anyone. Verifying the buyer, and not only the side that pays, protects providers from fake requests, which is the abuse that drives good providers off a platform.

**Reviews that cannot be written by the wrong person.** The review form only opens when a job record already links that buyer to that provider. A company cannot review itself and a competitor cannot review it either. When a review is disputed it stays visible and is labelled as under review, rather than disappearing while the case is open, so disputing an honest bad review is not a way to hide it.

**Contact exchange as the moment of trust.** Details are published only when a provider accepts a request, inside a chat where neither side can delete messages. That conversation is the thing a WhatsApp thread never gives either party: a record that survives the disagreement.

**A premium seal that refuses to overclaim.** The higher tier requires a video meeting with the team and a review of documentation and history, and it can be revoked. The product states in the same words on three separate pages that it is a review and not insurance, not a bond, and not a refund guarantee.

**Security treated as a deliverable.** The content security policy starts from `default-src 'self'` and names exactly three outside parties, one for payments, one for the captcha and one for the database. Plugins, framing and base URI rewriting are blocked outright. Transport security is set to two years with preload. Camera, microphone, geolocation and payment are switched off by policy. Sign in is passwordless, using a six digit code sent by email, so there is no password to phish and no reset flow to abuse.

**No tracking, and consent that means something.** The public site loads no analytics, no tag manager and no third party tracking script at all, and sets no cookie before the visitor chooses. Both claims are the kind anyone can check in a browser devtools panel, which is the only kind of privacy promise worth making.

## Scope delivered

The taxonomy is the part that took longest and is easiest to underestimate: 22 sectors covering construction, electrical, plumbing, climate control, finishes, architecture and engineering, technology, marketing, legal, accounting, health and logistics, broken into 265 named specialities. Today each one is a filter on the search route rather than a page of its own, which is a deliberate first step and a gap we name below.

The interface carries no raster images. Every graphic on the home page is inline vector or CSS, which takes image weight and layout shift out of the critical path instead of optimizing around them. The font is self hosted and subset, with a single preload, and there is no external font or stylesheet origin anywhere on the site.

The whole product is written in Honduran Spanish, using voseo in every call to action. That is a decision, not a default. It is the kind of thing only a team actually operating in the market bothers to get right.

## An honest word about results

There are none yet, and this page is not going to invent any.

Hazzlo launched days before this was written. The directory holds one verified company, which is us. The job board is empty. The blog has no posts. No traffic, usage, conversion or revenue figure exists for this product, so none appears above.

What can be judged today is the architecture, the security posture, the legal groundwork and the quality of the judgment calls.

Two open defects belong here too, because a reader who inspects the site will find them and should not find them first. Routes that do not exist answer with HTTP 200 and the not found view instead of a 404 status, which lets a search engine index pages that are not there. And the 265 specialities exist only as filters on the search route, so the taxonomy that should be the product's largest indexable surface currently produces nine listed URLs. Both are on the queue.

When there are real numbers, they will be added here with the date they were measured and who measured them.

## Tech stack

Next.js App Router with Partial Prerendering, React Server Components, TypeScript, Tailwind CSS, Supabase, PayPal, Cloudflare Turnstile, Netlify.

## What we delivered

- Two sided marketplace with separate buyer, contractor and company account types
- Manual identity verification flow for tax ID, operating permit and government ID
- Public directory with category, speciality and city filtering
- Company and contractor profile templates with structured data
- Job board where buyers publish projects and providers apply with proposals
- In platform messaging where contact details are released on acceptance
- Subscription and quota system for provider access, billed through PayPal
- Premium verification seal with its own application and review workflow
- Review system gated on completed, recorded engagements
- Passwordless authentication with emailed one time codes
- Granular cookie consent with no tracking scripts behind it
- Hand written security header and content security policy layer
- Honduran Spanish interface throughout, written in voseo
