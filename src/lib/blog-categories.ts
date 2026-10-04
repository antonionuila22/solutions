/**
 * Editorial copy for the ten blog category listings.
 *
 * Why this file exists: before the September 2026 consolidation the blog had 34
 * categories for 78 posts, and every listing page opened with the same
 * generated sentence, "N articles in this category", above a grid of cards.
 * Ten pages differing only by a word in the heading is thin content whichever
 * way you measure it, and the categories competed with each other for the same
 * queries.
 *
 * Each entry below is written for its own category, from the posts actually in
 * it. The `intro` renders under the heading; `description` replaces the
 * templated meta description.
 *
 * Adding a category means adding an entry here. A category with no entry still
 * renders, it just falls back to the generated line, so a missing entry
 * degrades rather than breaks.
 */

export interface CategoryCopy {
  /** Shown under the h1. Paragraphs are separated by a blank line. */
  intro: string;
  /** Meta description. Under 160 characters, and specific to this category. */
  description: string;
}

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  "web-development": {
    description:
      "React vs Next.js vs Astro, Vercel vs Netlify vs Cloudflare, Turso at the edge, and how to vet a dev agency. Comparisons that pick a side.",
    intro: `The posts here answer three different kinds of question. The first is which stack to pick. React against Next.js against Astro. Vercel against Netlify against Cloudflare Pages. Squarespace against WordPress against Webflow. A Turso guide that spends as much space on replication lag, the single writer primary, and the workloads where edge SQLite is the wrong answer as it does on setup. These are written to settle an argument rather than to praise every option, and several end in a decision matrix, because the useful part of a comparison is the constraint that rules one out.

The second thread is implementation. A step by step build of an Astro contact form that stores submissions in Turso and sends mail through Resend. A React performance case study that lists the changes in the order they were made. Posts on REST API design, progressive web apps, security headers and content security policy, and WCAG and ADA compliance, including why accessibility overlays do not fix anything.

The third is buying. How to evaluate a development agency, which questions to ask, and which answers should end the conversation. What drives the cost of custom work and how the common pricing models differ from each other. The difference between web design and web development, so you do not hire for the wrong half. How far AI builders such as v0 and Cursor actually get before a developer takes over. Several of the posts are in Spanish. If you came here for one decision, the comparisons are the fastest way in.`,
  },
  "business-strategy": {
    description:
      "Vet a nearshore partner, choose between staff augmentation and a dedicated team, weigh a custom CRM against Salesforce. Decision guides, not overviews.",
    intro: `Business Strategy here means the decisions that come before anyone writes code: who builds the thing, how the relationship is structured, and whether to build at all.

Three threads run through these posts. The first is sourcing. How to vet a nearshore development partner, what to ask their references, and which answers get slippery under pressure. Whether staff augmentation or a dedicated team fits the management capacity you actually have. How LATAM and Eastern Europe differ once you stop comparing rate cards, and why a company in Austin and a company in Amsterdam should reach different conclusions from the same facts.

The second is build against buy. A custom CRM measured against Salesforce and HubSpot, per seat rent against an asset you own and maintain. What sits inside a web development estimate and which decisions move it, so you can read a proposal instead of comparing bottom lines.

The third is the cost of choosing badly. What a cheap agency cuts to stay solvent, who owns your domain, analytics and source code when the relationship ends, and why an AI generated site can look finished and still sell nothing.

Around those sit posts on where AI automation and agents change operations rather than headcount slides, what contractors and healthcare practices get wrong online, and how payments work when you sell into Latin America. Several are written in Spanish for readers in Honduras and the region.

These are decision documents, not overviews. If you are not currently choosing between options, most of them will not earn your time.`,
  },
  "technology": {
    description:
      "Astro vs Next.js, Vercel vs Netlify, Turso at the edge, and which AI tools earn a place. Stack decisions argued with code, not feature lists.",
    intro: `Three threads run through this category, and they do not overlap much.

Stack choice is the first. Astro against Next.js, React against both, micro frontends, progressive web apps, React Native against Flutter, and the combination worth reaching for when a site is mostly content. These posts take positions and show code rather than listing features. The Astro pieces explain what shipping no JavaScript by default does to a first render, and where that tradeoff stops paying off.

Infrastructure is the second. Where to deploy, which database belongs at the edge, how to design a REST API you will not have to version twice, what website security actually asks of a small team. The hosting comparison covers Vercel, Netlify and Cloudflare Pages, including the framework bias each one carries. The Turso guide goes past setup into replication lag, the single writer primary, and the workloads where Postgres is still the better answer.

AI is the third thread and the largest. Model comparisons across Claude, GPT and Gemini. Coding assistants, Cursor against Copilot. What a large language model actually is, written for an owner rather than an engineer. How to attach a chatbot or an agent to an operation that already runs. And one post on why AI assistants reach for React when modern CSS would do the same job with less.

Several of these posts are in Spanish. The technical guides carry a review date, because a stack recommendation ages fast and a stale one costs you a rewrite.`,
  },
  "web-design": {
    description:
      "Visual hierarchy, what makes a site look cheap, landing pages that convert, and designer versus developer. Half of these posts are in Spanish.",
    intro: `This category runs in three threads, and knowing which one you are in saves scrolling.

The first is craft. One post works through the principles themselves: visual hierarchy, proximity, consistency, feedback, affordance, then the usability laws underneath them, Fitts's Law, Hick's Law, cognitive load, the peak-end rule. Two others take the same material from the practical end. One names the five things that make a site read as cheap, clashing color, weak typography, clutter, low quality images, and sections that do not match each other. The other puts landing pages that convert next to landing pages that do not, and gets specific about form length, how many calls to action a page should carry, and where the value proposition belongs.

The second thread is hiring. Web design and web development are different jobs, and the post on that difference exists so you can tell which one your project actually needs, both, or neither, and understand the handoff problem between the two. Around it sit guides on evaluating a design or UX agency, the questions worth asking before you sign, and why a site generated cheaply in a day tends not to sell anything.

The third thread is Latin America. Close to half of what is here is written in Spanish and addresses the Honduran and Central American market head on: how a company in Honduras gets a site built, what moves a quote up or down, the state of web development there in 2026, and how the regional picture now reads across Honduras, Guatemala, El Salvador, Costa Rica and Panama.

No trend roundups. Each post is trying to settle a decision.`,
  },
  "guides": {
    description:
      "Long guides on vetting a web agency, choosing between Squarespace, WordPress and Webflow, and building an Astro contact form with Turso and Resend.",
    intro: `The guides in this category are long on purpose. Each one answers a question that cannot be settled in a paragraph, and three distinct threads run through them.

The first is choosing who builds the thing. Those posts work through what to ask an agency before you sign, how to read a portfolio against an actual track record, who ends up owning your domain, your code and your analytics accounts, and what happens when the cheapest quote turns into a second agency cleaning up after the first. Several are framed as "best agency in 2026" pieces, but what they really contain is a list of questions and red flags you can take into a sales call.

The second thread is choosing the tools. The Squarespace, WordPress and Webflow comparison sorts the three by who each one is built for and where each one stops being enough, then answers the part most comparisons skip, which is whether you can move later and what the move costs you in work.

The third is execution after the decision. One post takes apart five design habits that make a site read as cheap, covering color, type, spacing, imagery and consistency between pages, with the fix for each. Another does the same for advertising people do not scroll past. One is a full build: an Astro contact form wired to Turso for storage and Resend for delivery, with the code, the environment variables and the deploy.

Three of these guides are in Spanish, written for readers in Honduras who are getting a company's first site built.

If you are vetting a quote or comparing platforms, start at the top. If you want quick news, this is the wrong page.`,
  },
  "digital-marketing": {
    description:
      "SEO checklists, Google algorithm updates, landing page comparisons, ad copy, and funnel walkthroughs for small businesses, contractors, and clinics.",
    intro: `What is here splits into three threads. The first is search visibility. One is a checklist written for a small business owner with no technical team: keyword choice, page titles, clean URLs, the things you can fix yourself inside your own platform's settings fields. Another tracks Google's 2025 core updates, what the algorithm started rewarding, what stopped working, and how to read a traffic drop instead of panicking about it.

The second thread is conversion, meaning what happens after someone arrives. There is a comparison of landing pages that convert against pages that do not, organized around one page and one goal. There is a piece on writing ads that read as content rather than interruption. And there is a walkthrough of the four-stage funnel Codebrand runs on itself, from attraction through nurture to close, with the tools named at each stage. The third thread is industry specific. Two long posts examine why construction contractors and medical practices in particular struggle online, each sourced from published industry research rather than agency opinion. Read those if you work in one of those fields. Skip them if you do not.

Two broader posts sit across all of it, a full digital marketing strategy for small businesses and a guide to assembling website, branding, search, social, and content into one presence. One post is in Spanish, on using AI image generation tools for marketing work. If you want tactics you can execute this week, start with the checklist and the landing page comparison. If you are deciding where a budget should go, start with the strategy post.`,
  },
  "outsourcing": {
    description:
      "Nearshore vs offshore, LATAM vs Eastern Europe, and how to vet a partner before you sign. Picking the model, the region and the vendor.",
    intro: `What sits here answers three different questions. Knowing which one you are actually asking is the fastest way through the page.

The first is what shape the relationship should take. Nearshore against offshore. Staff augmentation against a dedicated team. What a build really costs once you count rework, slow feedback loops, the hours your own managers spend directing other people, and the knowledge lost to turnover. The engagement models piece argues the dividing line is not team size or contract length but who owns delivery management, and the cost guide treats the hourly rate as an input rather than an answer.

The second question is where. The LATAM and Eastern Europe comparison takes the position that rate bands overlap enough that timezone should decide it, and it reaches opposite conclusions for a buyer in Austin and a buyer in Amsterdam. A companion guide written for European companies covers senior scarcity, GDPR, contract terms, and what an afternoon overlap window actually feels like to work in. Several posts look at Honduras and Central America specifically, because that is where US Central Time alignment comes from.

The third question is how to check one vendor before you sign. The vetting checklist is built from things you can test in an afternoon: ask to walk through a real pull request and the review thread around it, send a deliberately ambiguous requirement and see whether anyone asks a clarifying question, hold the sales call at the edge of the overlap window you are being promised, read the IP assignment and subcontracting clauses, and ask references what went wrong instead of whether they were satisfied.

If you already have a shortlist, the vetting checklist is the one to read. If the model is still being argued internally, start with engagement models.`,
  },
  "ai": {
    description:
      "What LLMs actually do, how Claude, GPT-4 and Gemini differ, what AI agents automate, and why AI coding tools keep defaulting to React.",
    intro: `AI shows up on this blog as four separate arguments, not one topic. The first is the explainer thread, written for someone who needs the vocabulary before the next vendor call: what a large language model actually is, what a context window buys you, and a direct comparison of Claude, GPT-4 and Gemini covering context size, coding, writing, analysis and where each one is weak. The question it answers is which model you standardize on.

The second thread is agents. There is a real difference between a chatbot that answers a question and an agent that reads a request, checks a system of record, acts, and reports back. The post here walks that loop step by step, perceive, reason, plan, execute, evaluate, and contrasts it with the if-then automation most teams already have.

The third is AI inside one industry at a time. Two long pieces, one on construction contractors and one on independent medical practices, look at where AI is actually being adopted in those sectors, lead scoring, follow-up, scheduling, review monitoring, and what stops smaller firms from starting.

The fourth is the skeptical one. AI React Bias argues that coding assistants recommend React for nearly everything because React dominates their training data, and that for a marketing site or a blog you inherit JavaScript you never needed. Read it before you let an assistant pick your stack.

No AI strategy abstractions here. Keep scrolling if you want to know what these tools do and where they already work.`,
  },
  "codebrand": {
    description:
      "Codebrand writing about Codebrand: the agency comparisons, the Astro build behind this site, and the Zeed alliance. Read with that in mind.",
    intro: `Everything here is Codebrand writing about Codebrand. Read them that way. The category earns a visit because two of the four get specific enough to argue with. The first thread is comparison. One post sets big US agencies, cheap offshore shops, freelancers and Codebrand side by side on the factors that decide a project: who is actually on your team versus who sold it to you, how communication gets routed, what happens when a one person shop goes quiet, and who owns the code when you leave. A companion post narrows that to a US buyer, covering the Central Time overlap, the stack, and why there is no price list on this site, only a fixed price built from the budget you bring.

The second thread is the build. The post on companies using Astro walks through how Google's Firebase documentation, Porsche's design system, Netlify's marketing site and The Guardian's interactive projects use the framework, then opens up this site's own architecture: content collections, React islands that load on visibility, a contact form wired to Turso, bilingual routing. It is the most technical post in the category and the only one where the claims turn into code you can read.

The third is a single announcement: the alliance with Zeed Agency, a Honduras design and performance marketing firm. It reads like the press release it is. Skip it unless partner news is what you came for. If you want neutral analysis of frameworks or nearshore hiring, other categories here are the better stop.`,
  },
  "e-commerce": {
    description:
      "Choosing a store platform, going headless, and getting paid in Brazil, Mexico, Colombia and Chile. Three e-commerce guides, two of them in Spanish.",
    intro: `These sit at three different decision points in an online store's life. The first is the platform question. The e-commerce development guide walks through Shopify, WooCommerce, BigCommerce, Squarespace, Wix, Magento and a custom build, what each one is actually good at and where it starts to fight you, then moves on to the features a store cannot ship without, product page and checkout structure, product schema markup, and a pre-launch checklist. Read it if you have not chosen a platform yet, or if you suspect you chose wrong.

The second is architecture. The headless commerce guide explains what separating the storefront from the commerce backend buys you, which is control over the front end and speed, and it is unusually direct about when headless is the wrong call: you are just starting, your team has no technical capacity, you have no unusual requirements, you need to launch soon. It also maps stacks by company size and lays out an implementation timeline in phases.

The third is payments, and it is specific to Latin America. If you are selling into Brazil, Mexico, Argentina, Colombia or Chile, card acceptance alone is not a checkout. That post goes country by country through PIX, OXXO, SPEI, PSE and installment culture, compares Mercado Pago, Stripe, PayU and dLocal, and covers the local regulatory requirements for each market. Two of them are written in Spanish.`,
  },
};

/** Paragraphs of a category intro, ready to render. */
export function introParagraphs(slug: string): string[] {
  const copy = CATEGORY_COPY[slug];
  if (!copy) return [];
  return copy.intro
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function categoryDescription(slug: string, fallback: string): string {
  return CATEGORY_COPY[slug]?.description || fallback;
}
