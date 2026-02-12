'use client'

import { useEffect, useRef, useState } from "react";
import {
  FileSignature, Users, Shield, Layout, Smartphone, ClipboardList, Check,
  PenTool, Star, Download, Bell, Lock, Zap
} from "lucide-react";

// ─── ANIMATED COUNTER FOR SIGNATURES CARD ────────────────────────
const AnimatedStat = ({ target, label, inView }: { target: number; label: string; inView: boolean }) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [inView, target]);

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-foreground">{count.toLocaleString()}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
};

const BentoGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Staggered entrance animation via IntersectionObserver
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-bento-card]");
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(32px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            const el = entry.target as HTMLElement;
            const allCards = grid.querySelectorAll<HTMLElement>("[data-bento-card]");
            const idx = Array.from(allCards).indexOf(el);
            setTimeout(() => {
              el.style.animation = `popInCard 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
            }, idx * 120);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-section-alt relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[200px] pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 mb-8">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              All included for $27
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
          >
            Everything you need.{" "}
            <span className="italic text-primary/80">Nothing you don&apos;t.</span>
          </h2>
          <p className="body-regular text-muted-foreground max-w-2xl mx-auto">
            Enterprise features at a price that makes CFOs smile.
          </p>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">

          {/* ── Card 1: Unlimited Signatures (lg:col-span-2) ── */}
          <div
            data-bento-card
            className="lg:col-span-2 group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Gradient accent top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="p-8">
              {/* Illustration area */}
              <div className="relative h-40 rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent mb-6 overflow-hidden">
                {/* Mini document with live signature */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[280px]">
                    {/* Document */}
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
                      <div className="space-y-1.5 mb-3">
                        <div className="h-1.5 bg-gray-200 rounded w-3/4" />
                        <div className="h-1.5 bg-gray-100 rounded w-full" />
                        <div className="h-1.5 bg-gray-100 rounded w-5/6" />
                      </div>
                      <div className="border-t border-dashed border-primary/30 pt-3">
                        <p className="text-[8px] text-gray-400 uppercase tracking-wider mb-1">Signature</p>
                        <svg viewBox="0 0 200 35" className="w-full h-8">
                          <path
                            d="M10,28 Q20,5 35,18 T60,15 Q70,12 80,22 T110,15 Q130,8 150,20 T180,18 L190,20"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="signature-path"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Floating signed badge */}
                    <div className="signed-badge absolute -top-2 -right-2 bg-green-500 text-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow-lg shadow-green-500/30">
                      <Check className="w-3 h-3" />
                      <span className="text-[10px] font-bold">Signed</span>
                    </div>
                  </div>
                </div>
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
                  <FileSignature className="w-5 h-5 text-primary" />
                </div>
                <h3 className="heading-3">Unlimited Signatures</h3>
              </div>

              {/* Live stats row */}
              <div className="flex items-center gap-6 mb-3">
                <AnimatedStat target={12847} label="This month" inView={inView} />
                <AnimatedStat target={98} label="% Success" inView={inView} />
                <AnimatedStat target={180} label="Countries" inView={inView} />
              </div>

              <p className="text-muted-foreground text-sm">
                No limits. No overage fees. Sign as many documents as you need, forever.
              </p>
            </div>
          </div>

          {/* ── Card 2: Team Collaboration (lg:col-span-2) ── */}
          <div
            data-bento-card
            className="lg:col-span-2 group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-blue-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            <div className="p-8">
              {/* Illustration area */}
              <div className="relative h-40 rounded-xl bg-gradient-to-br from-blue-50 via-primary/3 to-transparent dark:from-blue-950/30 mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Stacked avatars with activity indicators */}
                    <div className="flex items-center -space-x-4">
                      {[
                        { initials: "SC", color: "hsl(var(--primary))", name: "Sarah C." },
                        { initials: "MR", color: "hsl(340,82%,52%)", name: "Mike R." },
                        { initials: "EP", color: "hsl(217,91%,60%)", name: "Emily P." },
                        { initials: "JW", color: "hsl(142,76%,46%)", name: "James W." },
                        { initials: "AK", color: "hsl(38,92%,50%)", name: "Ana K." },
                      ].map((user, i) => (
                        <div
                          key={i}
                          className="avatar-circle relative flex items-center justify-center rounded-full border-3 border-card shadow-lg"
                          style={{
                            width: 48,
                            height: 48,
                            background: user.color,
                            animationDelay: `${i * 0.3}s`,
                            borderWidth: 3,
                            borderColor: 'hsl(var(--card))',
                          }}
                        >
                          <span className="text-white text-xs font-bold">{user.initials}</span>
                          {/* Online dot */}
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card"
                            style={{
                              background: '#22c55e',
                              animation: `pulseOnline 2s ease-in-out infinite ${i * 0.5}s`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {/* +N more badge */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full w-12 h-12 flex items-center justify-center shadow-md plus-badge">
                      <span className="text-sm font-bold text-muted-foreground">+∞</span>
                    </div>
                    {/* Live typing indicator */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1 shadow-sm typing-indicator">
                      <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" style={{ animationDelay: '0.15s' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 typing-dot" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground font-medium">3 editing now</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center border border-blue-500/10">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="heading-3">Team Collaboration</h3>
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] font-bold text-green-600 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Free
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">Unlimited seats</p>
              <p className="text-muted-foreground text-sm">
                Add your entire company. 5 or 500 people, same $27. No per-user pricing ever.
              </p>
            </div>
          </div>

          {/* ── Card 3: Security & Compliance ── */}
          <div
            data-bento-card
            className="group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-green-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />

            <div className="p-7">
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-green-50 via-green-50/30 to-transparent dark:from-green-950/20 mb-5 overflow-hidden flex items-center justify-center">
                <div className="shield-anim relative">
                  <svg width="56" height="64" viewBox="0 0 44 52" fill="none">
                    <path
                      d="M22 2L4 10V24C4 36.36 11.84 47.54 22 50C32.16 47.54 40 36.36 40 24V10L22 2Z"
                      className="shield-outline"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L4 10V24C4 36.36 11.84 47.54 22 50C32.16 47.54 40 36.36 40 24V10L22 2Z"
                      className="shield-fill"
                      fill="#22c55e"
                    />
                  </svg>
                  <div className="shield-check absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Orbiting certification badges */}
                {["SOC2", "HIPAA", "GDPR", "ISO"].map((badge, i) => (
                  <div
                    key={badge}
                    className="cert-badge absolute text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/20"
                    style={{
                      top: `${20 + i * 18}%`,
                      right: i % 2 === 0 ? '8%' : undefined,
                      left: i % 2 !== 0 ? '8%' : undefined,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/15 to-green-500/5 flex items-center justify-center border border-green-500/10">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="heading-3">Security</h3>
              </div>
              <p className="text-xs font-bold text-foreground mb-1">SOC 2 · HIPAA · GDPR · ISO 27001</p>
              <p className="text-muted-foreground text-sm">
                Bank-level 256-bit encryption. Your data, always protected.
              </p>
            </div>
          </div>

          {/* ── Card 4: Template Library ── */}
          <div
            data-bento-card
            className="group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="p-7">
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent dark:from-primary/5 mb-5 overflow-hidden flex items-center justify-center">
                {/* Template card stack */}
                <div className="template-stack relative" style={{ width: 120, height: 80 }}>
                  {[
                    { label: "NDA", color: "hsl(var(--primary))", delay: "0s" },
                    { label: "Contract", color: "hsl(205,80%,55%)", delay: "0.15s" },
                    { label: "Invoice", color: "hsl(190,65%,50%)", delay: "0.3s" },
                  ].map((tpl, i) => (
                    <div
                      key={tpl.label}
                      className={`template-card template-card-${i + 1} absolute rounded-lg border bg-white shadow-md`}
                      style={{
                        width: 72,
                        height: 80,
                        borderColor: `${tpl.color}30`,
                      }}
                    >
                      <div className="p-2">
                        <div className="h-1 rounded w-2/3 mb-1.5" style={{ background: `${tpl.color}40` }} />
                        <div className="h-0.5 rounded w-full bg-gray-100 mb-0.5" />
                        <div className="h-0.5 rounded w-5/6 bg-gray-100 mb-0.5" />
                        <div className="h-0.5 rounded w-4/6 bg-gray-100 mb-2" />
                        <div className="h-0.5 rounded w-full bg-gray-50 mb-0.5" />
                        <div className="h-0.5 rounded w-3/4 bg-gray-50" />
                      </div>
                      <div className="absolute bottom-1.5 left-2">
                        <span className="text-[6px] font-bold uppercase tracking-wider" style={{ color: tpl.color }}>{tpl.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Count badge */}
                <div className="absolute top-3 right-3 bg-primary text-white rounded-full px-2 py-0.5 text-[9px] font-bold shadow-lg shadow-primary/25 count-badge">
                  247+
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
                  <Layout className="w-5 h-5 text-primary" />
                </div>
                <h3 className="heading-3">Templates</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">247 ready</p>
              <p className="text-muted-foreground text-sm">
                Contracts, NDAs, invoices — professional and ready to use.
              </p>
            </div>
          </div>

          {/* ── Card 5: Mobile Apps ── */}
          <div
            data-bento-card
            className="group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-orange-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

            <div className="p-7">
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-orange-50 via-orange-50/30 to-transparent dark:from-orange-950/20 mb-5 overflow-hidden flex items-center justify-center">
                {/* Phone mockup */}
                <div className="phone-anim">
                  <div className="relative" style={{ width: 52, height: 90 }}>
                    <div
                      className="absolute inset-0 rounded-xl border-2 border-gray-300 bg-white shadow-lg overflow-hidden"
                    >
                      {/* Notch */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gray-200" />
                      {/* Screen content */}
                      <div className="mt-4 px-1.5 space-y-1">
                        <div className="h-1 bg-gray-100 rounded w-full" />
                        <div className="h-1 bg-gray-100 rounded w-3/4" />
                        <div className="h-6 bg-primary/10 rounded mt-1.5 flex items-center justify-center">
                          <PenTool className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <div className="h-1 bg-gray-100 rounded w-full" />
                        <div className="h-1 bg-gray-100 rounded w-2/3" />
                      </div>
                      {/* Phone check overlay */}
                      <div className="phone-checkmark absolute inset-0 bg-white/90 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      {/* Home bar */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gray-300" />
                    </div>
                  </div>
                </div>
                {/* Notification bubbles */}
                <div className="notif-1 absolute top-4 right-4 bg-white rounded-lg shadow-md border border-gray-100 px-2 py-1 flex items-center gap-1">
                  <Bell className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[7px] font-medium text-gray-600">Signed!</span>
                </div>
                <div className="notif-2 absolute bottom-6 left-4 bg-white rounded-lg shadow-md border border-gray-100 px-2 py-1 flex items-center gap-1">
                  <Download className="w-2.5 h-2.5 text-green-500" />
                  <span className="text-[7px] font-medium text-gray-600">PDF ready</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-500/5 flex items-center justify-center border border-orange-500/10">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="heading-3">Mobile Apps</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">iOS & Android</p>
              <p className="text-muted-foreground text-sm">
                Sign from anywhere. Full-featured, included free.
              </p>
            </div>
          </div>

          {/* ── Card 6: Audit Logs ── */}
          <div
            data-bento-card
            className="group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-cyan-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="p-7">
              <div className="relative h-36 rounded-xl bg-gradient-to-br from-cyan-50 via-cyan-50/30 to-transparent dark:from-cyan-950/20 mb-5 overflow-hidden">
                {/* Terminal-style log */}
                <div className="absolute inset-0 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[7px] text-muted-foreground ml-1 font-mono">audit.log</span>
                  </div>
                  <div className="log-feed overflow-hidden" style={{ height: 80 }}>
                    <div className="log-scroll">
                      {[
                        { time: "09:41", event: "Contract signed", user: "John S.", color: "text-green-500", icon: "✓" },
                        { time: "09:38", event: "Document viewed", user: "Sarah K.", color: "text-blue-500", icon: "◉" },
                        { time: "09:35", event: "NDA sent to", user: "legal team", color: "text-primary", icon: "→" },
                        { time: "09:32", event: "Template updated", user: "Admin", color: "text-orange-500", icon: "✎" },
                        { time: "09:28", event: "New signer added", user: "Mike R.", color: "text-cyan-500", icon: "+" },
                        { time: "09:25", event: "Audit exported", user: "Finance", color: "text-gray-500", icon: "↓" },
                        { time: "09:41", event: "Contract signed", user: "John S.", color: "text-green-500", icon: "✓" },
                        { time: "09:38", event: "Document viewed", user: "Sarah K.", color: "text-blue-500", icon: "◉" },
                        { time: "09:35", event: "NDA sent to", user: "legal team", color: "text-primary", icon: "→" },
                        { time: "09:32", event: "Template updated", user: "Admin", color: "text-orange-500", icon: "✎" },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center gap-1.5 leading-[18px]">
                          <span className="text-[8px] font-mono text-muted-foreground/50 w-7 shrink-0">{log.time}</span>
                          <span className={`text-[8px] ${log.color} w-2.5 shrink-0`}>{log.icon}</span>
                          <span className="text-[8px] font-mono text-foreground/70 truncate">
                            {log.event} <span className="text-muted-foreground/50">by {log.user}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Fade edges */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-cyan-50 dark:from-cyan-950/20 to-transparent pointer-events-none" />
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 flex items-center justify-center border border-cyan-500/10">
                  <ClipboardList className="w-5 h-5 text-cyan-500" />
                </div>
                <h3 className="heading-3">Audit Logs</h3>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">Every action</p>
              <p className="text-muted-foreground text-sm">
                Complete history. Tamper-proof. Court-ready records.
              </p>
            </div>
          </div>

          {/* ── Card 7: 5-Star Reviews (bonus full-width) ── */}
          <div
            data-bento-card
            className="lg:col-span-4 group rounded-2xl border border-border/60 bg-card relative overflow-hidden hover:border-yellow-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/5"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                {/* Stars */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400 star-pop" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">4.9</p>
                    <p className="text-[10px] text-muted-foreground">2,847 reviews</p>
                  </div>
                </div>

                {/* Quotes marquee */}
                <div className="flex-1 overflow-hidden relative">
                  <div className="flex gap-6 review-scroll">
                    {[
                      { text: "Saved us $14,000/year switching from DocuSign", author: "Sarah C., TechFlow" },
                      { text: "ROI in 2 weeks. The best SaaS deal I've ever seen", author: "Mike R., GrowthLabs" },
                      { text: "White-label is incredible. Clients think we built it", author: "Emily P., InnovateCorp" },
                      { text: "Unlimited seats for $27? Still can't believe it's real", author: "James W., ScaleUp" },
                      { text: "Saved us $14,000/year switching from DocuSign", author: "Sarah C., TechFlow" },
                      { text: "ROI in 2 weeks. The best SaaS deal I've ever seen", author: "Mike R., GrowthLabs" },
                    ].map((review, i) => (
                      <div key={i} className="shrink-0 w-[280px] bg-yellow-50/50 dark:bg-yellow-950/10 rounded-xl border border-yellow-200/30 p-4">
                        <p className="text-sm text-foreground/80 mb-2">&ldquo;{review.text}&rdquo;</p>
                        <p className="text-[11px] text-muted-foreground font-medium">— {review.author}</p>
                      </div>
                    ))}
                  </div>
                  {/* Fade edges */}
                  <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
                  <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Entrance ── */
        @keyframes popInCard {
          0% { opacity: 0; transform: translateY(32px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Signature draw ── */
        .signature-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawLine 3.5s ease-in-out infinite;
        }
        @keyframes drawLine {
          0% { stroke-dashoffset: 400; }
          40% { stroke-dashoffset: 0; }
          65% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 400; }
        }

        /* ── Signed badge ── */
        .signed-badge {
          opacity: 0;
          transform: scale(0);
          animation: badgePop 3.5s ease-in-out infinite;
        }
        @keyframes badgePop {
          0% { opacity: 0; transform: scale(0); }
          42% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.15); }
          55% { opacity: 1; transform: scale(1); }
          65% { opacity: 1; transform: scale(1); }
          75% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Shimmer ── */
        .shimmer-effect {
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* ── Avatar pop-in ── */
        .avatar-circle {
          opacity: 0;
          transform: scale(0);
          animation: avatarPop 3s ease-in-out infinite;
        }
        @keyframes avatarPop {
          0% { opacity: 0; transform: scale(0) rotate(-10deg); }
          12% { opacity: 1; transform: scale(1.1) rotate(2deg); }
          20% { opacity: 1; transform: scale(1) rotate(0deg); }
          72% { opacity: 1; transform: scale(1) rotate(0deg); }
          85% { opacity: 0; transform: scale(0.8) rotate(5deg); }
          100% { opacity: 0; transform: scale(0) rotate(-10deg); }
        }

        /* ── Online pulse ── */
        @keyframes pulseOnline {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        /* ── Plus badge ── */
        .plus-badge {
          opacity: 0;
          animation: plusFade 3s ease-in-out infinite;
        }
        @keyframes plusFade {
          0% { opacity: 0; transform: translate(0, -50%) scale(0.8); }
          25% { opacity: 1; transform: translate(0, -50%) scale(1); }
          72% { opacity: 1; transform: translate(0, -50%) scale(1); }
          85% { opacity: 0; transform: translate(0, -50%) scale(0.8); }
          100% { opacity: 0; transform: translate(0, -50%) scale(0.8); }
        }

        /* ── Typing dots ── */
        .typing-indicator {
          opacity: 0;
          animation: typingFade 3s ease-in-out infinite;
        }
        @keyframes typingFade {
          0% { opacity: 0; }
          30% { opacity: 1; }
          72% { opacity: 1; }
          85% { opacity: 0; }
          100% { opacity: 0; }
        }
        .typing-dot {
          animation: typingBounce 1s ease-in-out infinite;
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-3px); }
        }

        /* ── Shield ── */
        .shield-outline {
          fill: none;
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: shieldDraw 4s ease-in-out infinite;
        }
        .shield-fill {
          opacity: 0;
          animation: shieldFillIn 4s ease-in-out infinite;
        }
        .shield-check {
          opacity: 0;
          animation: shieldCheckIn 4s ease-in-out infinite;
        }
        @keyframes shieldDraw {
          0% { stroke-dashoffset: 160; }
          25% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes shieldFillIn {
          0% { opacity: 0; }
          25% { opacity: 0; }
          35% { opacity: 0.9; }
          75% { opacity: 0.9; }
          90% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes shieldCheckIn {
          0% { opacity: 0; transform: scale(0); }
          32% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1.2); }
          45% { opacity: 1; transform: scale(1); }
          75% { opacity: 1; transform: scale(1); }
          90% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Cert badges ── */
        .cert-badge {
          opacity: 0;
          animation: certFade 4s ease-in-out infinite;
        }
        @keyframes certFade {
          0% { opacity: 0; transform: translateY(4px); }
          30% { opacity: 0; transform: translateY(4px); }
          40% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          88% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 0; transform: translateY(4px); }
        }

        /* ── Template shuffle ── */
        .template-card-1 { animation: shuffleA 3.5s ease-in-out infinite; }
        .template-card-2 { animation: shuffleB 3.5s ease-in-out infinite; }
        .template-card-3 { animation: shuffleC 3.5s ease-in-out infinite; }

        @keyframes shuffleA {
          0%, 100% { left: 0px; z-index: 3; transform: rotate(-3deg); }
          33% { left: 48px; z-index: 1; transform: rotate(2deg); }
          66% { left: 24px; z-index: 2; transform: rotate(0deg); }
        }
        @keyframes shuffleB {
          0%, 100% { left: 24px; z-index: 2; transform: rotate(0deg); }
          33% { left: 0px; z-index: 3; transform: rotate(-3deg); }
          66% { left: 48px; z-index: 1; transform: rotate(2deg); }
        }
        @keyframes shuffleC {
          0%, 100% { left: 48px; z-index: 1; transform: rotate(2deg); }
          33% { left: 24px; z-index: 2; transform: rotate(0deg); }
          66% { left: 0px; z-index: 3; transform: rotate(-3deg); }
        }

        /* ── Count badge ── */
        .count-badge {
          animation: countPulse 2s ease-in-out infinite;
        }
        @keyframes countPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* ── Phone slide-up ── */
        .phone-anim {
          animation: phoneSlide 4s ease-in-out infinite;
        }
        .phone-checkmark {
          opacity: 0;
          animation: phoneCheck 4s ease-in-out infinite;
        }
        @keyframes phoneSlide {
          0% { transform: translateY(40px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          72% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(-8px); opacity: 0; }
          100% { transform: translateY(40px); opacity: 0; }
        }
        @keyframes phoneCheck {
          0% { opacity: 0; transform: scale(0); }
          35% { opacity: 0; transform: scale(0); }
          42% { opacity: 1; transform: scale(1.15); }
          47% { opacity: 1; transform: scale(1); }
          72% { opacity: 1; transform: scale(1); }
          85% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0; transform: scale(0); }
        }

        /* ── Notification bubbles ── */
        .notif-1 {
          opacity: 0;
          animation: notifSlide 4s ease-in-out infinite;
        }
        .notif-2 {
          opacity: 0;
          animation: notifSlide 4s ease-in-out infinite 0.5s;
        }
        @keyframes notifSlide {
          0% { opacity: 0; transform: translateX(8px); }
          28% { opacity: 0; transform: translateX(8px); }
          35% { opacity: 1; transform: translateX(0); }
          70% { opacity: 1; transform: translateX(0); }
          80% { opacity: 0; transform: translateX(-4px); }
          100% { opacity: 0; transform: translateX(8px); }
        }

        /* ── Log scroll ── */
        .log-scroll {
          animation: logScroll 8s linear infinite;
        }
        @keyframes logScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-108px); }
        }

        /* ── Star pop ── */
        .star-pop {
          animation: starPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
        }
        @keyframes starPop {
          0% { opacity: 0; transform: scale(0) rotate(-20deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        /* ── Review scroll ── */
        .review-scroll {
          animation: reviewMarquee 25s linear infinite;
        }
        @keyframes reviewMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BentoGrid;
