'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCcw, Clock, AlertCircle } from "lucide-react";

const FinalCta = () => {
  // COUNTDOWN TIMER - ENTERPRISE UPGRADE #3
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it hits zero
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.03]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-float" style={{ animationDelay: "5s" }} />

      <div className="container-narrow relative z-10 text-center">
        {/* COUNTDOWN TIMER */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/20 mb-8">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="text-sm font-bold text-destructive uppercase tracking-wider">
            Deal ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        <h2 className="heading-1 mb-6">Ready to stop overpaying?</h2>
        <p className="body-large text-muted-foreground mb-10 max-w-xl mx-auto">
          Join 4,891 teams who switched this month. Enterprise features for $27 — once, forever.
          <br />
          <strong className="text-foreground">This deal won't last. Lock in $27 now before it goes back to $497.</strong>
        </p>

        <Button variant="hero" size="lg" className="h-16 px-12 rounded-2xl text-xl mb-8">
          Get Enterprise Access — $27
        </Button>

        <p className="text-sm text-muted-foreground mb-10">
          No credit card required · 30-day money-back guarantee
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Shield, label: "30-Day Guarantee" },
            { icon: RefreshCcw, label: "Instant Refunds" },
            { icon: Clock, label: "Lifetime Access" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
