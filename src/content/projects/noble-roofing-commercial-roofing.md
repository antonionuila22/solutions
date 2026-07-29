---
title: Noble Roofing — Commercial Roofing Website Redesign in The Woodlands, TX
description: WordPress redesign and content architecture for Noble Roofing, a commercial roofing contractor in Greater Houston — 209 pages, 21 cities and 13 building types published.
author: Codebrand Team
img: /photos/projects/nobleroofing.jpg
category: Web Development
tags:
  - WordPress
  - Elementor
  - Roofing
  - Texas
  - Commercial Roofing
  - SEO
  - Redesign
client: Noble Roofing
date: 2026-07-01
featured: false
link: https://nobleroofing.co/
results:
  metric1: 209 pages published
  metric2: 21 cities with their own pages
  metric3: 13 building types covered
resultsLabel: Scope delivered
resultsNote: >-
  Counted by Codebrand from nobleroofing.co/page-sitemap.xml on 25 July 2026.
  These are scope figures — how much was built — not performance metrics and not
  business outcomes. We publish no traffic, ranking, lead or conversion data for
  this project because we do not have any.
draft: true
# TODO(usuario) — POR QUÉ ESTE CASO ESTÁ EN BORRADOR Y QUÉ FALTA PARA PUBLICARLO
#
# 1) Estado del sitio medido el 25 de julio de 2026 (Lighthouse 12, emulación móvil):
#    Performance 36, FCP 2.9 s, LCP 16.3 s, TBT 1,200 ms, CLS 0.038.
#    Peso total 85.8 MB en 194 peticiones. La causa principal es el video de fondo
#    /wp-content/uploads/2026/07/HERO_BACKGROUND_VIDEO_NOBLE.webm, cuyo content-length
#    real es 106,608,861 bytes (101.7 MB), con autoplay y background_play_on_mobile:"yes",
#    es decir también sobre datos celulares. Además ~40.7 MB de imágenes en 72 peticiones,
#    la mayoría originales de img.companycam.com sin redimensionar, y dos de ellas cargadas
#    duplicadas en la misma página. Publicar un caso de estudio de un sitio en ese estado
#    nos expone a que cualquiera lo mida en dos minutos.
#
# 2) Para publicarlo hace falta, en este orden:
#    a. Sustituir el video del hero por un poster + versión corta (objetivo por debajo de
#       3 MB), quitar el autoplay en móvil y volver a medir.
#    b. Pipeline de imágenes: redimensionar y servir en formato de nueva generación las
#       imágenes de CompanyCam, y eliminar las dos duplicadas.
#    c. Añadir schema LocalBusiness / RoofingContractor con NAP, horario y área de
#       servicio: hoy solo hay WebSite, WebPage, Organization, BreadcrumbList, ImageObject,
#       SearchAction y ReadAction.
#    d. Limpiar el sitemap: 19 de las 209 URLs de page-sitemap.xml responden 301 hacia su
#       versión canónica (medido el 25-jul-2026), y el author-sitemap sobra en un sitio de
#       un solo autor.
#    e. Volver a correr Lighthouse. Solo con números decentes se puede añadir una sección
#       de rendimiento; si no, este caso se queda sin ella.
#
# 3) Datos que hay que pedirle a Noble Roofing antes de publicar:
#    - Fecha real de lanzamiento del sitio (la del frontmatter, 2026-07-01, es aproximada).
#    - Qué partes del programa de contenido (las 209 páginas, las 21 ciudades, los 28
#      artículos) construimos nosotros y qué partes hizo su equipo o el proveedor anterior.
#      No publicar el caso hasta tener esa línea clara.
#    - Autorización para nombrarlos como cliente y usar la captura de pantalla.
#    - Si quieren compartirlas: llamadas y solicitudes de estimado recibidas desde el sitio,
#      por mes y desde qué fecha. Sin esos datos el caso no puede afirmar ningún resultado
#      de negocio, y hoy no afirma ninguno.
---

## Context

Noble Roofing is a roofing contractor based in The Woodlands, Texas, serving the Greater Houston area. Most of their revenue is commercial work — industrial plants, warehouses, retail, healthcare buildings, schools, hotels and senior housing — with a residential line running alongside it.

They came to us for a redesign. They were not happy with the site they had, and they wanted a new one built on WordPress, with the search work done properly this time.

The brief was not "make it look better". A roofing contractor with a commercial book of business has a specific problem, and it is not a visual one.

## The challenge

Three things made this harder than a normal contractor website.

**Two buyers who behave nothing alike.** The person authorising a roof replacement on a distribution centre is a property manager or a facilities director. They work on budget cycles, they need to know how much of the building keeps operating during the work, and they will forward the page to someone else before anyone picks up a phone. A homeowner with a leak is a different person on a different clock. Put both on one undifferentiated "Services" page and the commercial buyer — the one who is worth more — assumes the company is a residential shop that also does flat roofs.

**A market that is geographically fragmented.** "Greater Houston" is a convenient phrase and a useless one for search. It is dozens of separate municipalities, and demand in this category almost always arrives with a city attached to it and a service in front of it. One page that lists twenty city names in a paragraph does not compete with a page that is actually about one of them.

**Trust is the product.** A commercial roof is a capital expense with a long tail of consequences. The buyer is not comparing designs; they are looking for reasons to believe. Manufacturer certifications, named product partners, real reviews with real names, and a written process all do more work than any amount of styling.

## How we worked

**1. Content architecture before design.** We started by deciding what the site is made of, not what it looks like. The result is four axes that stay separate all the way down: what you need done (services), where you are (locations), what kind of building you own (who we serve), and what system goes on it (roofing systems).

**2. Commercial and residential split at the top level.** The separation is structural, not cosmetic. `/services/commercial/` and `/services/residential/` each have their own installation, replacement, repair and coatings-and-maintenance pages, and the same split repeats inside the location pages. A property manager never lands in homeowner content, and vice versa.

**3. One page per city, per segment, per service.** Twenty-one cities have their own pages — The Woodlands, Houston, Conroe, Spring, Cypress, Tomball, Magnolia, Willis, Montgomery, Shenandoah, Sugar Land, League City, Humble, Kingwood, Atascocita, Baytown, Deer Park, La Porte, Missouri City, New Caney and Porter. Below the city, the tree continues into commercial and residential, and below that into individual services: roof repair, roof replacement, roof installation, roof inspection, coatings and maintenance, flat-roof repair. Every page we checked carries its own title tag, its own meta description and its own H1 with the service and the city in it. `Commercial Roof Repair in Humble, TX | Noble Roofing` is a different page, with different copy, from the Houston one.

**4. Building type as its own axis.** Thirteen pages under `/who-we-serve/` address the buyer by what they are responsible for: warehouse, industrial plant, retail, office, healthcare, school, college and university, government, hotel and hospitality, church, stadium, aviation and senior housing. This is the part of the architecture that most roofing sites skip, and it is the part that speaks directly to the commercial buyer. The healthcare page, for example, is about working around patients and operations, not about membranes.

**5. A systems layer to answer the technical questions.** Five roofing systems have dedicated pages — TPO, PVC, metal, modified bitumen and coatings — with three further pages under TPO for single-ply, 60-mil and overlays. Twenty-eight blog articles sit behind them, and they are unusually specific for a contractor blog: TPO versus PVC versus EPDM, TPO cost in Texas, how to repair a TPO membrane, roof permits in The Woodlands, UL 790 Class A roofs, ICC 500 storm-resistant construction, NFRC skylight compliance. That is content written for someone doing their homework before a six-figure decision.

**6. Proof, assembled with attribution.** The homepage review carousel is a custom component, not a plugin. It holds 29 reviews with the reviewer's name and date, and each one is tagged with its source: 22 come from Google and 7 from NiceJob. The Google badge only renders on the ones that actually came from Google. That distinction is enforced in the code, and it exists because a review wall that implies a source it does not have is worth less than no review wall at all. Alongside it sit 13 product-partner logos — Carlisle SynTec, GAF, Sika Sarnafil, Siplast, CertainTeed, Malarkey, PAC-CLAD, Elevate, Gaco, Everest, Drexel Metals, Berridge and TAMKO — and a footer accreditation list that includes a link out to Noble's GAF contractor profile, so the claim can be checked rather than taken on faith.

**7. Message hierarchy on the homepage.** The H1 is `Commercial Roofing Contractor In The Woodlands, TX & The Greater Houston Area` — service, qualifier, city, region, in that order, with commercial named first. Below it the page runs a three-step process (Schedule Your Inspection, Review Your Proposal, Watch It Get Done Right), six commercial services against three residential ones, five reasons-to-choose, and three stated values. Commercial appears before residential everywhere on the page. That ordering is the business decision the whole site rests on.

## What we built

- **209 pages** in the page sitemap, plus 28 published articles
- **21 cities** with their own pages, extending into commercial, residential and storm-damage sub-pages
- **13 building-type pages** aimed at the commercial buyer by asset class
- **5 roofing-system pages** with three additional TPO sub-pages
- **Service pages split between commercial and residential** — installation, replacement, repair and coatings-and-maintenance on both sides — plus roof maintenance and storm damage
- **A 29-review carousel** with per-review source attribution
- **13 product partners** and a linked accreditation list
- Sitemap index, per-page titles and meta descriptions, and structured data for WebSite, WebPage, Organization, BreadcrumbList and ImageObject

## Why WordPress, and what it costs

WordPress was the right call here, and it is worth saying why instead of pretending the decision was free.

Noble Roofing publishes. They add cities, they add articles, they update service pages when a manufacturer certification changes. A site with 209 pages that can only be edited by a developer becomes a bottleneck within a month, and the content programme quietly dies because every change needs a ticket. WordPress with Elementor hands that back to the client: their team edits pages the same day they decide to, with no deploy and no invoice.

The bill for that autonomy is page weight. A visual page builder ships CSS and JavaScript for the general case, not for this page, and a media library will happily accept a photograph at whatever size the camera produced. Nothing about that is a surprise, and none of it is an argument against WordPress — it is an argument for treating performance as ongoing maintenance rather than a launch-day checkbox. On this site that work is not finished. The homepage still carries heavy media, and reducing it is the open item on this project, not something we are claiming credit for.

## Tech stack

WordPress with Elementor 4.2.0 and Elementor Pro on the hello-elementor theme, Gravity Forms for the estimate requests, Yoast SEO for metadata and sitemaps, SiteGround Optimizer for caching, served over nginx. Site language declared as `en-US`. The review carousel is custom HTML, CSS and JavaScript written for this project rather than an off-the-shelf widget.

## What this case study does not claim

No rankings, no traffic, no leads, no revenue. We have not been given business data for this project, and we are not going to estimate it. There are no Core Web Vitals numbers here either: performance work on the homepage media is still open, and until it is done and measured, publishing a speed claim would be a lie with a stopwatch next to it.

Everything above is scope — what exists on nobleroofing.co today, counted from the site itself on 25 July 2026, and checkable by anyone who wants to open it.
