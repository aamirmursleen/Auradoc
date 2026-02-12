'use client'

import { useEffect, useRef } from "react";
import {
  FileSignature, Users, Shield, Layout, Smartphone, ClipboardList, Check
} from "lucide-react";

const BentoGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Staggered entrance animation via IntersectionObserver
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-bento-card]");
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(24px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const cards = grid.querySelectorAll<HTMLElement>("[data-bento-card]");
            const idx = Array.from(cards).indexOf(el);
            setTimeout(() => {
              el.style.animation = `popInCard 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
            }, idx * 100);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
          >
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="body-regular text-muted-foreground max-w-2xl mx-auto">
            Enterprise features at a price that makes CFOs smile.
          </p>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* ── Card 1: Unlimited Signatures (lg:col-span-2) ── */}
          <div
            data-bento-card
            className="lg:col-span-2 rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-24 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <svg width="200" height="50" viewBox="0 0 200 50" fill="none" className="signature-svg">
                <path
                  d="M10,40 Q20,10 35,25 T60,20 Q70,15 80,25 T100,20 Q115,10 130,30 T160,25 Q170,20 185,35"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  className="signature-path"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Unlimited Signatures</h3>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">12,847 signed last month</p>
            <p className="text-muted-foreground body-regular">
              No limits. No overage fees. Sign as many documents as you need.
            </p>
          </div>

          {/* ── Card 2: Team Collaboration (lg:col-span-2) ── */}
          <div
            data-bento-card
            className="lg:col-span-2 rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-24 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <div className="flex items-center -space-x-3">
                {["hsl(263,84%,57%)", "hsl(340,82%,52%)", "hsl(217,91%,60%)", "hsl(142,76%,46%)", "hsl(38,92%,50%)"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="avatar-circle rounded-full border-2 border-card flex items-center justify-center"
                      style={{
                        width: 36,
                        height: 36,
                        background: color,
                        animationDelay: `${i * 0.4}s`,
                      }}
                    >
                      <span className="text-white text-xs font-bold">
                        {["J", "A", "M", "S", "K"][i]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Team Collaboration</h3>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">Unlimited seats</p>
            <p className="text-muted-foreground body-regular">
              Add your entire company. 5 or 500 people, same $27.
            </p>
          </div>

          {/* ── Card 3: Security & Compliance ── */}
          <div
            data-bento-card
            className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-20 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <div className="shield-anim relative">
                <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
                  <path
                    d="M22 2L4 10V24C4 36.36 11.84 47.54 22 50C32.16 47.54 40 36.36 40 24V10L22 2Z"
                    className="shield-outline"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L4 10V24C4 36.36 11.84 47.54 22 50C32.16 47.54 40 36.36 40 24V10L22 2Z"
                    className="shield-fill"
                    fill="hsl(var(--primary))"
                  />
                </svg>
                <div className="shield-check absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Security &amp; Compliance</h3>
            </div>
            <p className="text-sm font-bold text-foreground mb-1">SOC 2, HIPAA, GDPR, ISO 27001</p>
            <p className="text-muted-foreground body-regular">
              Bank-level encryption. Enterprise compliance. Your data, protected.
            </p>
          </div>

          {/* ── Card 4: Template Library ── */}
          <div
            data-bento-card
            className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-20 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <div className="template-stack relative" style={{ width: 56, height: 48 }}>
                <div className="template-card template-card-1 absolute rounded border border-primary/30 bg-primary/10" style={{ width: 40, height: 48 }} />
                <div className="template-card template-card-2 absolute rounded border border-primary/20 bg-primary/8" style={{ width: 40, height: 48 }} />
                <div className="template-card template-card-3 absolute rounded border border-primary/15 bg-primary/5" style={{ width: 40, height: 48 }} />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Layout className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Template Library</h3>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">247 templates</p>
            <p className="text-muted-foreground body-regular">
              Contracts, NDAs, offers, invoices — professionally designed and ready to use.
            </p>
          </div>

          {/* ── Card 5: Mobile Apps ── */}
          <div
            data-bento-card
            className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-20 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <div className="phone-anim">
                <div className="relative" style={{ width: 32, height: 52 }}>
                  <div
                    className="absolute inset-0 rounded-lg border-2 border-primary/60 bg-card"
                    style={{ borderRadius: 8 }}
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-primary/30" />
                    <div className="phone-checkmark absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Mobile Apps</h3>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">iOS &amp; Android</p>
            <p className="text-muted-foreground body-regular">
              Sign from anywhere. Full-featured mobile apps included free.
            </p>
          </div>

          {/* ── Card 6: Audit Logs ── */}
          <div
            data-bento-card
            className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-20 overflow-hidden bg-primary/5 rounded-lg mb-4 flex items-center justify-center">
              <div className="log-feed relative overflow-hidden" style={{ width: "100%", height: 56 }}>
                <div className="log-scroll absolute left-4 right-4">
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:41</span> Contract signed by John S.
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:38</span> Document viewed by Sarah K.
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:35</span> NDA sent to legal team
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:32</span> Template updated by Admin
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:28</span> New signer added: Mike R.
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:25</span> Audit export downloaded
                  </p>
                  {/* Duplicate for seamless loop */}
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:41</span> Contract signed by John S.
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:38</span> Document viewed by Sarah K.
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:35</span> NDA sent to legal team
                  </p>
                  <p className="text-[10px] font-mono text-primary/70 whitespace-nowrap leading-5">
                    <span className="text-primary/40">09:32</span> Template updated by Admin
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <h3 className="heading-3">Audit Logs</h3>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">Every action tracked</p>
            <p className="text-muted-foreground body-regular">
              Complete history. Legal compliance. Tamper-proof records.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Entrance animation ── */
        @keyframes popInCard {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Card 1: Signature draw ── */
        .signature-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawLine 3s ease-in-out infinite;
        }

        @keyframes drawLine {
          0% { stroke-dashoffset: 400; }
          45% { stroke-dashoffset: 0; }
          65% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 400; }
        }

        /* ── Card 2: Avatar pop-in ── */
        .avatar-circle {
          opacity: 0;
          transform: scale(0);
          animation: avatarPop 2.5s ease-in-out infinite;
        }

        @keyframes avatarPop {
          0% { opacity: 0; transform: scale(0); }
          15% { opacity: 1; transform: scale(1.15); }
          25% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          85% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Card 3: Shield lock ── */
        .shield-outline {
          fill: none;
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: shieldDraw 3.5s ease-in-out infinite;
        }

        .shield-fill {
          opacity: 0;
          animation: shieldFillIn 3.5s ease-in-out infinite;
        }

        .shield-check {
          opacity: 0;
          animation: shieldCheckIn 3.5s ease-in-out infinite;
        }

        @keyframes shieldDraw {
          0% { stroke-dashoffset: 160; }
          30% { stroke-dashoffset: 0; }
          45% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes shieldFillIn {
          0% { opacity: 0; }
          30% { opacity: 0; }
          45% { opacity: 0.85; }
          75% { opacity: 0.85; }
          90% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes shieldCheckIn {
          0% { opacity: 0; transform: scale(0); }
          40% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          55% { opacity: 1; transform: scale(1); }
          75% { opacity: 1; transform: scale(1); }
          90% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Card 4: Template shuffle ── */
        .template-card-1 {
          animation: shuffleA 3s ease-in-out infinite;
        }
        .template-card-2 {
          animation: shuffleB 3s ease-in-out infinite;
        }
        .template-card-3 {
          animation: shuffleC 3s ease-in-out infinite;
        }

        @keyframes shuffleA {
          0% { left: 0px; top: 0px; z-index: 3; }
          33% { left: 16px; top: 0px; z-index: 1; }
          66% { left: 8px; top: 0px; z-index: 2; }
          100% { left: 0px; top: 0px; z-index: 3; }
        }

        @keyframes shuffleB {
          0% { left: 8px; top: 0px; z-index: 2; }
          33% { left: 0px; top: 0px; z-index: 3; }
          66% { left: 16px; top: 0px; z-index: 1; }
          100% { left: 8px; top: 0px; z-index: 2; }
        }

        @keyframes shuffleC {
          0% { left: 16px; top: 0px; z-index: 1; }
          33% { left: 8px; top: 0px; z-index: 2; }
          66% { left: 0px; top: 0px; z-index: 3; }
          100% { left: 16px; top: 0px; z-index: 1; }
        }

        /* ── Card 5: Phone slide-up ── */
        .phone-anim {
          animation: phoneSlide 3s ease-in-out infinite;
        }

        .phone-checkmark {
          opacity: 0;
          animation: phoneCheck 3s ease-in-out infinite;
        }

        @keyframes phoneSlide {
          0% { transform: translateY(60px); opacity: 0; }
          25% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(60px); opacity: 0; }
        }

        @keyframes phoneCheck {
          0% { opacity: 0; transform: scale(0); }
          30% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1.2); }
          45% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          85% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Card 6: Log scroll ── */
        .log-scroll {
          animation: logScroll 6s linear infinite;
        }

        @keyframes logScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-120px); }
        }

        /* ── Shared utility keyframes ── */
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default BentoGrid;
