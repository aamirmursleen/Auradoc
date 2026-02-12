'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/8 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/6 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="container-main relative z-10 text-center py-32">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 mb-10">
          <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
            More elegant than DocuSign, more affordable than HelloSign
          </span>
        </div>

        {/* Headline */}
        <h1 className="heading-1 max-w-4xl mx-auto mb-8">
          Stop paying $10,000/year{" "}
          <span className="text-primary italic">for e-signatures.</span>
        </h1>

        {/* Subheadline */}
        <p className="body-large text-muted-foreground max-w-2xl mx-auto mb-14">
          What used to cost enterprises thousands now costs $27. Once. Forever.
          Same features. Same security. <strong className="text-foreground">99.7% less expensive.</strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button variant="hero" size="lg" className="h-14 px-10 rounded-xl text-base">
            Get Enterprise Access — $27
          </Button>
          <Button variant="hero-secondary" size="lg" className="h-14 px-10 rounded-xl text-base group">
            See it in action
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust line */}
        <p className="text-sm text-muted-foreground">
          No credit card required · Free forever · 4,891 teams switched this month
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
