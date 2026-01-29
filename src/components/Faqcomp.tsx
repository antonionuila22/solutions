/**
 * @deprecated Use FAQ component instead: import FAQ from "./FAQ.tsx"
 * This file is kept for backwards compatibility
 */
import FAQ, { type FAQItem } from "./FAQ";

export type { FAQItem };

export default function Faqcomp({ faqs }: { faqs: FAQItem[] }) {
  return <FAQ faqs={faqs} theme="light" />;
}
