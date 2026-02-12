'use client'

import { useEffect, useRef, useState } from "react";
import { Star, Quote, TrendingUp, Award, BadgeCheck, ArrowRight } from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "Switched from DocuSign. Saved $14,000 in year one. Same features, zero regrets. The one-time payment is a game-changer.",
    name: "Sarah Chen",
    role: "VP Operations",
    company: "TechFlow Inc.",
    metric: "Saved $14,000/year",
    initials: "SC",
    color: "hsl(var(--primary))",
    featured: true,
  },
  {
    quote: "ROI was 2 weeks. TWO WEEKS. We were paying DocuSign $180/month for 3 users. MamaSign gave us unlimited seats for $27 total.",
    name: "Michael Rodriguez",
    role: "CEO",
    company: "GrowthLabs",
    metric: "ROI in 2 weeks",
    initials: "MR",
    color: "hsl(340, 82%, 52%)",
    featured: false,
  },
  {
    quote: "The custom branding alone justified the switch. Our clients see OUR brand, not 'Powered by MamaSign'. Feels premium.",
    name: "Emily Park",
    role: "Legal Director",
    company: "Innovate Corp",
    metric: "100% white-label",
    initials: "EP",
    color: "hsl(217, 91%, 60%)",
    featured: false,
  },
  {
    quote: "We process 500+ contracts monthly. Zero downtime, instant signatures. The audit trail saved us in a compliance review.",
    name: "James Wilson",
    role: "CFO",
    company: "ScaleUp HQ",
    metric: "500+ docs/month",
    initials: "JW",
    color: "hsl(142, 76%, 36%)",
    featured: false,
  },
  {
    quote: "Set up custom domain in 5 minutes. Our clients sign on contracts.ourfirm.com — they have no idea it's MamaSign. Pure magic.",
    name: "Ana Kim",
    role: "Founder",
    company: "LegalBridge",
    metric: "5-min setup",
    initials: "AK",
    color: "hsl(38, 92%, 50%)",
    featured: true,
  },
  {
    quote: "I compared 12 e-sign tools before choosing MamaSign. Nothing else comes close at this price point. Or any price point, honestly.",
    name: "David Okafor",
    role: "CTO",
    company: "FinSecure",
    metric: "Best value overall",
    initials: "DO",
    color: "hsl(205, 80%, 55%)",
    featured: false,
  },
];

const platforms = [
  { name: "G2", rating: "4.9", reviews: "847" },
  { name: "Capterra", rating: "4.8", reviews: "1,203" },
  { name: "TrustPilot", rating: "4.9", reviews: "797" },
];

const ratingBreakdown = [
  { stars: 5, pct: 89 },
  { stars: 4, pct: 8 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

// ─── ANIMATED COUNTER ─────────────────────────────────────────
const AnimatedNum = ({ target, inView }: { target: number; inView: boolean }) => {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const dur = 2200;
    let s: number | null = null;
    const tick = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [inView, target]);

  return <>{count.toLocaleString()}</>;
};

// ─── COMPONENT ────────────────────────────────────────────────
const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Stagger card entrances
    const cards = section.querySelectorAll<HTMLElement>("[data-testimonial]");
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(40px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            setTimeout(() => setBarsVisible(true), 800);
            const el = entry.target as HTMLElement;
            if (el.hasAttribute("data-testimonial")) {
              const allCards = section.querySelectorAll<HTMLElement>("[data-testimonial]");
              const idx = Array.from(allCards).indexOf(el);
              setTimeout(() => {
                el.style.animation = `testimonialIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
              }, idx * 150);
              observer.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[120px] pointer-events-none" />

      <div className="container-main relative z-10">
        {/* ── HEADER ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 mb-8">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Trusted by 4,891+ teams
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
          >
            Loved by teams{" "}
            <span className="italic text-primary/80">everywhere.</span>
          </h2>
          <p className="body-regular text-muted-foreground max-w-xl mx-auto">
            Don&apos;t take our word for it — hear from teams who made the switch.
          </p>
        </div>

        {/* ── STATS ROW ── */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-16">
          {/* Overall rating card */}
          <div className="flex items-center gap-5 bg-card rounded-2xl border border-border/60 px-8 py-6 shadow-sm">
            <div>
              <p className="text-5xl font-bold text-foreground leading-none">
                <span className="tabular-nums">{inView ? "4.9" : "0.0"}</span>
              </p>
              <div className="flex gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 star-anim" style={{ animationDelay: `${0.8 + i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <AnimatedNum target={2847} inView={inView} /> reviews
              </p>
            </div>
            <div className="h-14 w-px bg-border" />
            {/* Rating bars */}
            <div className="space-y-1">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-3 text-right tabular-nums">{r.stars}</span>
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: barsVisible ? `${r.pct}%` : "0%" }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-6 tabular-nums">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform badges */}
          <div className="flex items-center gap-3">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="group bg-card rounded-xl border border-border/60 px-5 py-4 text-center hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-0.5">{p.name}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-foreground tabular-nums">{p.rating}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{p.reviews} reviews</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TESTIMONIAL CARDS ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              data-testimonial
              className={`group relative rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-xl transition-all duration-500 ${
                t.featured
                  ? "hover:border-primary/30 hover:shadow-primary/5"
                  : "hover:border-border hover:shadow-black/5"
              }`}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${t.color}40, transparent)`,
                }}
              />

              {/* Featured glow */}
              {t.featured && (
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none" style={{ background: t.color }} />
              )}

              <div className="p-7 flex flex-col h-full">
                {/* Quote icon + Stars row */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${t.color}12` }}
                  >
                    <Quote className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote text */}
                <blockquote className="text-[15px] leading-relaxed text-foreground/85 mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Divider */}
                <div className="h-px bg-border/60 mb-5" />

                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                      <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>

                {/* Metric tag */}
                <div className="mt-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: `${t.color}08`,
                      color: t.color,
                      border: `1px solid ${t.color}18`,
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {t.metric}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="text-center mt-14">
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            Join 4,891+ teams who switched
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes testimonialIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .star-anim {
          opacity: 0;
          animation: starFlip 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        @keyframes starFlip {
          0% { opacity: 0; transform: scale(0) rotate(-30deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
