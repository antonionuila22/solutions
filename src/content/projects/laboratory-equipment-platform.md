---
title: Laboratory Equipment B2B Platform
description: Custom WooCommerce B2B platform for a laboratory equipment distributor - 7,900+ products across 6 categories, quote-only checkout and a custom CRM plugin.
author: Codebrand Team
img: /photos/projects/Laboratory.avif
category: Web Development
tags:
  - E-commerce
  - WooCommerce
  - Custom Plugin
  - API Integration
  - B2B Platform
  - CRM Integration
client: Laboratory & Tech
date: 2024-08-15
featured: true
# TODO(link): https://laboratory.codebrand.es/ ya no resuelve (NXDOMAIN, verificado 2026-07-24).
#   Pedirle al cliente la URL de producción actual y restaurar el campo `link:` aquí.
#   Mientras tanto queda comentado para no publicar un CTA "View Live Project" roto.
results:
  metric1: 7,900+ products uploaded
  metric2: 6 product categories
  metric3: 1 custom CRM plugin, built from scratch
resultsLabel: Scope delivered
resultsNote: >-
  These figures describe the platform we built in 2024, not outcomes we
  measured. The URL we had on file no longer resolves (checked 24 July 2026),
  so the scope above comes from our delivery record rather than from a live page.
# TODO(URL viva) — pedir la URL de producción actual de Laboratory & Tech. Sin ella este caso
#   no tiene prueba pública y el stack de abajo tampoco se puede verificar desde fuera.
# TODO(métricas de negocio) — pedirle a Laboratory & Tech para cerrar el caso:
#   1) quote requests recibidos por mes a través de la plataforma, y desde qué fecha
#   2) tiempo promedio de respuesta a una cotización antes vs. después de la sincronización con el CRM
#   3) horas/semana que el equipo dedicaba a copiar datos al CRM manualmente antes del plugin
#   4) número de SKUs vivos hoy (para actualizar el 7,900+) y número de países facturados
#   5) confirmar el nombre del CRM con el que integró el plugin (hoy se publica sin nombrarlo)
#   Sin esos números NO se publica ningún % de aumento de ventas o de leads.
draft: false
---

## Context

Laboratory & Tech distributes laboratory and industrial equipment from its Florida base to clients across Latin America and the United States. Their catalogue runs into the thousands of SKUs, from consumables to instruments.

In their market almost nothing sells at a listed price. A buyer specifies, asks for a quote, and the quote gets negotiated — often against a purchase order, a tender, or an institutional budget. The sale is a conversation, not a checkout.

## The challenge

Standard e-commerce assumes a cart and a card. B2B laboratory equipment assumes neither, and that mismatch was the whole problem.

Three business constraints made the off-the-shelf route impossible:

- **The catalogue had to be browsable, not just searchable.** Thousands of products are useless if a buyer cannot narrow down to the right family of equipment in a few clicks.
- **The CRM was not up for replacement.** Their sales process already lived there. Any platform we built had to bend around it, not the other way round.
- **Every enquiry was being re-typed by hand.** A quote request arriving by web form and then copied into the CRM is a delay, and a delay in a quote is a lost deal.

## How we worked

**1. Catalogue architecture first.** Before touching code we defined the product taxonomy: six top-level categories and the attribute structure underneath them, so the catalogue could grow without a rebuild.

**2. WooCommerce, stripped of its checkout.** We kept WooCommerce for its product model and admin, and replaced the buy flow with a quote request flow. No cart, no payment, no prices forced into public view.

**3. A custom plugin built from scratch.** Their CRM had no ready-made WooCommerce connector, so we wrote one in PHP — mapping products, contacts and quote requests between both systems.

**4. Automated sync via webhooks and REST API.** A quote request submitted on the site lands in the CRM without anyone re-typing it. That removed the manual step that was costing response time.

**5. Data load and localisation.** We uploaded and organised 7,900+ products across the six categories, with multilingual content for the international markets they serve.

**6. Performance tuning.** Search, filtering and navigation were optimised for a catalogue of that size, and the whole experience was built to work on mobile for buyers browsing away from a desk.

## What we built

- **7,900+ products** loaded, categorised and searchable on the platform.
- **6 product categories** structured with an attribute model that absorbs new SKUs without restructuring.
- **Quote requests sync into the existing CRM** through the custom plugin, webhooks and REST API — no manual data entry between systems.
- **Zero checkout, by design**: the platform captures specifications and routes them to a salesperson, matching how the business actually closes.
- **Multilingual catalogue** serving Latin America and the United States from one installation.

This is scope, not outcome. Laboratory & Tech has not shared quote volume, response time or sales figures with us, so none are published here.

## Tech stack

WooCommerce, WordPress, custom PHP plugin, REST API, webhooks, CRM integration, multilingual setup.

## What we delivered

- WooCommerce installation converted into a B2B quote request system
- Custom WordPress plugin, written from scratch, connecting the store to their existing CRM
- Webhook and REST API layer for automatic two-way data sync
- Full product taxonomy across 6 categories, plus attribute structure
- 7,900+ products uploaded, categorised and localised
- UX/UI design for complex B2B catalogue navigation
- Multilingual configuration for international markets
- Performance optimisation for a catalogue-heavy, mobile-accessed site
