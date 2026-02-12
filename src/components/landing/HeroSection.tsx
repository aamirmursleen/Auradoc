'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  PenTool, ShieldCheck, Globe, FileText, Receipt,
  Lock, Check, ArrowRight, Zap,
} from "lucide-react";

// ─── FEATURE DEFINITIONS ────────────────────────────────────────
const FEATURES = [
  { id: "esign", label: "E-Signatures", icon: PenTool, url: "sign.yourbrand.com" },
  { id: "verify", label: "Verification", icon: ShieldCheck, url: "verify.auradoc.com" },
  { id: "domain", label: "Custom Domain", icon: Globe, url: "yourbrand.com" },
  { id: "cv", label: "CV Builder", icon: FileText, url: "cv.auradoc.com" },
  { id: "invoice", label: "Invoicing", icon: Receipt, url: "invoice.yourbrand.com" },
] as const;

const STATS = [
  { value: 10_000_000, suffix: "+", label: "Documents Created", prefix: "" },
  { value: 50_000, suffix: "+", label: "Happy Users", prefix: "" },
  { value: 99.9, suffix: "%", label: "Uptime", prefix: "" },
  { value: 180, suffix: "+", label: "Countries", prefix: "" },
] as const;

const CYCLE_MS = 4000;

// ─── ANIMATED COUNTER ───────────────────────────────────────────
const AnimatedCounter = ({ target, suffix, prefix, started }: {
  target: number; suffix: string; prefix: string; started: boolean;
}) => {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, target]);

  const display = target >= 1_000_000
    ? `${(current / 1_000_000).toFixed(current >= target ? 0 : 1)}M`
    : target >= 1_000
    ? `${(current / 1_000).toFixed(current >= target ? 0 : 1)}K`
    : target % 1 !== 0
    ? current.toFixed(1)
    : Math.round(current).toString();

  return <span>{prefix}{display}{suffix}</span>;
};

// ─── FEATURE CONTENT RENDERERS ──────────────────────────────────

// Tab 1 — E-Signatures
const ESignContent = ({ progress }: { progress: number }) => {
  const pathLength = 200;
  const drawn = progress * pathLength;
  const showCheck = progress > 0.85;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-4">
      {/* Mini document */}
      <div className="w-full max-w-[280px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-3">
        <div className="space-y-2 mb-4">
          <div className="h-2 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
          <div className="h-2 bg-gray-200 rounded w-2/3" />
        </div>
        {/* Signature field */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 relative" style={{
          borderColor: progress > 0 ? 'hsl(263, 84%, 57%)' : undefined,
        }}>
          <svg viewBox="0 0 200 40" className="w-full h-10" style={{ overflow: 'visible' }}>
            <path
              d="M10,30 Q20,5 35,20 T60,15 Q70,12 80,25 T110,18 Q130,10 150,22 T180,20 L190,22"
              fill="none"
              stroke="hsl(263, 84%, 45%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength - drawn}
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>
          {progress === 0 && (
            <p className="text-[10px] text-gray-400 text-center absolute inset-0 flex items-center justify-center">
              Sign here
            </p>
          )}
        </div>
      </div>
      {/* Signed badge */}
      <div className="flex items-center gap-1.5 transition-all duration-300" style={{
        opacity: showCheck ? 1 : 0,
        transform: showCheck ? 'scale(1)' : 'scale(0.8)',
      }}>
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center" style={{
          animation: showCheck ? 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
        }}>
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-semibold text-green-600">Signed</span>
      </div>
    </div>
  );
};

// Tab 2 — Verification
const VerifyContent = ({ progress }: { progress: number }) => {
  const barFill = Math.min(progress * 1.4, 1);
  const showShield = progress > 0.75;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-4 gap-4">
      {/* File icon + name */}
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
        <FileText className="w-8 h-8 text-red-400" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Contract.pdf</p>
          <p className="text-[11px] text-gray-400">1.8 MB</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[240px]">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-100" style={{
            width: `${barFill * 100}%`,
            background: showShield ? '#22c55e' : 'hsl(263, 84%, 57%)',
          }} />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          {showShield ? 'Complete' : 'Verifying...'}
        </p>
      </div>

      {/* Verified badge */}
      <div className="flex flex-col items-center gap-1 transition-all duration-300" style={{
        opacity: showShield ? 1 : 0,
        transform: showShield ? 'translateY(0)' : 'translateY(8px)',
      }}>
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center" style={{
          animation: showShield ? 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
        }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-bold text-green-600">VERIFIED</p>
        <p className="text-[10px] text-gray-500">Original & Untampered</p>
      </div>
    </div>
  );
};

// Tab 3 — Custom Domain
const DomainContent = ({ progress }: { progress: number }) => {
  const domain = "yourbrand";
  const revealed = Math.min(Math.floor(progress * 2.5 * domain.length), domain.length);
  const showLock = progress > 0.5;
  const showText = progress > 0.7;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-4 gap-5">
      {/* URL bar mockup */}
      <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-4 py-2.5 shadow-sm w-full max-w-[280px]">
        <Lock className="w-4 h-4 transition-colors duration-300" style={{
          color: showLock ? '#22c55e' : '#9ca3af',
        }} />
        <span className="text-sm text-gray-800 font-medium">
          <span className="text-primary font-semibold">{domain.substring(0, revealed)}</span>
          {revealed < domain.length && <span className="w-0.5 h-4 bg-primary inline-block animate-pulse" />}
          <span className="text-gray-400">.com</span>
        </span>
      </div>

      {/* SSL indicator */}
      <div className="flex items-center gap-2 transition-all duration-300" style={{
        opacity: showLock ? 1 : 0,
        transform: showLock ? 'scale(1)' : 'scale(0.9)',
      }}>
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-green-600">SSL Certificate Active</span>
      </div>

      {/* Tagline */}
      <p className="text-center text-sm text-gray-600 font-medium transition-all duration-500 max-w-[220px]" style={{
        opacity: showText ? 1 : 0,
        transform: showText ? 'translateY(0)' : 'translateY(8px)',
      }}>
        Your brand. Your domain. Your trust.
      </p>
    </div>
  );
};

// Tab 4 — CV Builder
const CvContent = ({ progress }: { progress: number }) => {
  const showResume = progress > 0.1;
  const showBadge = progress > 0.8;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-4">
      {/* Resume template */}
      <div className="w-full max-w-[260px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-500" style={{
        opacity: showResume ? 1 : 0,
        transform: showResume ? 'translateY(0)' : 'translateY(12px)',
      }}>
        {/* Header */}
        <div className="bg-gray-900 px-4 py-3">
          <div className="h-2.5 bg-white/90 rounded w-1/2 mb-1.5" />
          <div className="h-1.5 bg-white/40 rounded w-1/3" />
        </div>
        <div className="p-3 space-y-3">
          {/* Experience */}
          <div>
            <div className="h-1.5 bg-primary/60 rounded w-1/4 mb-2" />
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-200 rounded w-full" />
              <div className="h-1.5 bg-gray-200 rounded w-5/6" />
              <div className="h-1.5 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
          {/* Skills */}
          <div>
            <div className="h-1.5 bg-primary/60 rounded w-1/5 mb-2" />
            <div className="flex gap-1.5 flex-wrap">
              {[40, 32, 48, 36, 28].map((w, i) => (
                <div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download badge */}
      <div className="mt-3 flex items-center gap-1.5 transition-all duration-300" style={{
        opacity: showBadge ? 1 : 0,
        transform: showBadge ? 'scale(1)' : 'scale(0.8)',
      }}>
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center" style={{
          animation: showBadge ? 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
        }}>
          <Check className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-semibold text-primary">Download Ready</span>
      </div>
    </div>
  );
};

// Tab 5 — Invoicing
const InvoiceContent = ({ progress }: { progress: number }) => {
  const showInvoice = progress > 0.05;
  const showStamp = progress > 0.8;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-4">
      {/* Invoice */}
      <div className="w-full max-w-[280px] bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative transition-all duration-500" style={{
        opacity: showInvoice ? 1 : 0,
        transform: showInvoice ? 'translateX(0)' : 'translateX(20px)',
      }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-bold text-gray-800">INVOICE</p>
            <p className="text-[10px] text-gray-400">#INV-2026-0042</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Feb 13, 2026</p>
          </div>
        </div>

        {/* Line items */}
        <div className="border-t border-gray-100 pt-2 space-y-1.5">
          {[
            { item: "Web Design", amount: "$2,400" },
            { item: "Development", amount: "$4,800" },
            { item: "Hosting (1yr)", amount: "$300" },
          ].map((row, i) => (
            <div key={i} className="flex justify-between text-[11px]">
              <span className="text-gray-600">{row.item}</span>
              <span className="text-gray-800 font-medium">{row.amount}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
          <span className="text-xs font-bold text-gray-800">Total</span>
          <span className="text-xs font-bold text-gray-900">$7,500.00</span>
        </div>

        {/* PAID stamp */}
        {showStamp && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] pointer-events-none" style={{
            animation: 'stampBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div className="border-4 border-green-500 rounded-lg px-4 py-1.5">
              <span className="text-2xl font-black text-green-500 tracking-widest">PAID</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CONTENT_RENDERERS = [ESignContent, VerifyContent, DomainContent, CvContent, InvoiceContent];

// ─── MAIN COMPONENT ─────────────────────────────────────────────
const HeroSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [animProgress, setAnimProgress] = useState(0);
  const [tabProgress, setTabProgress] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [entrancePhase, setEntrancePhase] = useState(0);

  // ─── ENTRANCE ANIMATION ─────────────────────────────────────
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const steps = [0, 200, 400, 600, 800, 1000, 1200];
    steps.forEach((ms, i) => {
      timeouts.push(setTimeout(() => setEntrancePhase(i + 1), ms));
    });
    timeouts.push(setTimeout(() => setStatsVisible(true), 1400));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // ─── FEATURE CAROUSEL ───────────────────────────────────────
  useEffect(() => {
    if (entrancePhase < 6) return; // Wait for entrance to reach browser mockup

    let cancelled = false;
    let animRaf: number | null = null;
    let progressRaf: number | null = null;

    const runCycle = () => {
      if (cancelled) return;

      // Animate progress within current feature
      let startTime: number | null = null;

      const tick = (ts: number) => {
        if (cancelled) return;
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / CYCLE_MS, 1);

        // Content animation: ramp 0→1 between 500ms and 3000ms of the 4s cycle
        const contentProgress = elapsed < 500
          ? 0
          : elapsed > 3000
          ? 1
          : (elapsed - 500) / 2500;

        setAnimProgress(contentProgress);
        setTabProgress(progress);

        if (progress < 1) {
          animRaf = requestAnimationFrame(tick);
        } else {
          // Move to next feature
          setActiveFeature(prev => (prev + 1) % FEATURES.length);
          setAnimProgress(0);
          setTabProgress(0);
          // Small gap then next cycle
          setTimeout(() => { if (!cancelled) runCycle(); }, 300);
        }
      };

      animRaf = requestAnimationFrame(tick);
    };

    // Start first cycle after a brief pause
    const startTimeout = setTimeout(runCycle, 500);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      if (animRaf) cancelAnimationFrame(animRaf);
      if (progressRaf) cancelAnimationFrame(progressRaf);
    };
  }, [entrancePhase]);

  const ActiveContent = CONTENT_RENDERERS[activeFeature];
  const activeUrl = FEATURES[activeFeature].url;

  const entrance = (phase: number) => ({
    opacity: entrancePhase >= phase ? 1 : 0,
    transform: entrancePhase >= phase ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/8 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/6 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[150px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="container-main relative z-10 text-center py-20 lg:py-28">
        {/* ── Badge ── */}
        <div style={entrance(1)}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
              Lifetime Deal — One Payment, Forever
            </span>
          </div>
        </div>

        {/* ── Headline ── */}
        <div style={entrance(2)}>
          <h1 className="heading-1 max-w-4xl mx-auto mb-2">
            Everything DocuSign charges{" "}
            <span className="text-muted-foreground line-through decoration-muted-foreground/40">$2,160/yr</span>{" "}
            for.
          </h1>
        </div>

        <div style={{
          ...entrance(3),
          transitionDelay: '0.1s',
        }}>
          <p className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8" style={{
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(280, 80%, 55%), hsl(var(--primary)))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.3))',
          }}>
            $27. Once. Forever.
          </p>
        </div>

        {/* ── Subheadline ── */}
        <div style={entrance(4)}>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto mb-12">
            E-signatures, verification, custom domains, CV builder, invoicing — all included.
            No subscriptions. No per-user fees. No limits.
          </p>
        </div>

        {/* ── CTAs ── */}
        <div style={entrance(5)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button variant="hero" size="lg" className="h-14 px-10 rounded-xl text-base">
            <Zap className="w-4 h-4 mr-2" />
            Get Everything — $27
          </Button>
          <Button variant="hero-secondary" size="lg" className="h-14 px-10 rounded-xl text-base group">
            See Features
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* ── Feature Carousel ── */}
        <div style={entrance(6)} className="max-w-3xl mx-auto mb-16">
          {/* Feature tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              const isActive = activeFeature === i;
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveFeature(i);
                    setAnimProgress(0);
                    setTabProgress(0);
                  }}
                  className="relative rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                  style={{
                    background: isActive ? 'hsl(var(--primary))' : 'transparent',
                    color: isActive ? 'white' : 'hsl(var(--muted-foreground))',
                    boxShadow: isActive ? '0 4px 20px hsl(var(--primary) / 0.25)' : 'none',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{feat.label}</span>
                  {/* Progress bar under active tab */}
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/60 rounded-full" style={{
                        width: `${tabProgress * 100}%`,
                        transition: 'none',
                      }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Browser mockup */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-background">
            {/* Browser Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40" style={{ background: 'hsl(263, 84%, 10%)' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md" style={{ background: 'hsl(263, 84%, 16%)' }}>
                  <Lock className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] font-medium text-white/50 transition-all duration-300">
                    {activeUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="relative bg-gray-50 dark:bg-gray-50" style={{ height: '320px' }}>
              <ActiveContent progress={animProgress} />
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div style={entrance(7)} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'sm:border-l sm:border-border/40' : ''}`}>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    started={statsVisible}
                  />
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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
        @keyframes stampBounce {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(-12deg) scale(2); }
          50% { opacity: 1; transform: translate(-50%, -50%) rotate(-12deg) scale(0.9); }
          70% { transform: translate(-50%, -50%) rotate(-12deg) scale(1.05); }
          100% { opacity: 1; transform: translate(-50%, -50%) rotate(-12deg) scale(1); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
