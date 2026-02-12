'use client'

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, X } from "lucide-react";

const faqs = [
  {
    q: "Is this really a one-time payment?",
    a: "Yes. $27 once. No subscriptions, no hidden fees, no surprises. You get lifetime access to all features, including future updates.",
  },
  {
    q: "How is this so much cheaper than DocuSign?",
    a: "We built MamaSign from the ground up with modern technology that costs us 90% less to operate. We pass those savings directly to you.",
  },
  {
    q: "Are the signatures legally binding?",
    a: "Absolutely. MamaSign signatures comply with ESIGN Act, UETA, and eIDAS regulations. They're legally equivalent to wet signatures in 180+ countries.",
  },
  {
    q: "Can I migrate from DocuSign?",
    a: "Yes! Most teams migrate in under 20 minutes. We provide a one-click import tool that brings over all your templates and contacts.",
  },
  {
    q: "Is there a limit on signatures or documents?",
    a: "No limits whatsoever. Send unlimited signatures, create unlimited documents, add unlimited team members. $27 covers everything.",
  },
  {
    q: "What about security?",
    a: "Enterprise-grade security including SOC 2 Type II compliance, 256-bit AES encryption, and HIPAA-ready infrastructure. Your data is safer than at the big providers.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes — 30-day no-questions-asked money-back guarantee. If MamaSign isn't the best $27 you've ever spent, we'll refund you instantly.",
  },
  {
    q: "Will the price go up?",
    a: "Yes. This $27 lifetime deal is introductory pricing. The regular price will be $497. Lock in $27 now and keep it forever.",
  },
];

const FaqSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05]" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }} data-heading="heading-2 mb-4">Frequently asked questions</h2>
          <p className="body-regular text-muted-foreground">
            Everything you need to know about MamaSign
          </p>
        </div>

        {/* SEARCH BAR - ENTERPRISE UPGRADE #1 */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found. Try a different search term.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-xl bg-card px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground body-regular pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
