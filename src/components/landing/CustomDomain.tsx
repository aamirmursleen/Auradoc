'use client'

import { useState, useEffect, useCallback } from "react";
import { Lock, Check, Shield } from "lucide-react";

// ─── COMPANY DEFINITIONS ─────────────────────────────────────
const companies = [
  { slug: "techflow", name: "TechFlow", color: "hsl(217, 91%, 60%)" },
  { slug: "acmecorp", name: "AcmeCorp", color: "hsl(340, 82%, 52%)" },
  { slug: "growthlab", name: "GrowthLab", color: "hsl(142, 76%, 36%)" },
  { slug: "designco", name: "DesignCo", color: "hsl(var(--primary))" },
];

const CustomDomain = () => {
  const [phase, setPhase] = useState(0);
  const [domain, setDomain] = useState("");
  const [companyIndex, setCompanyIndex] = useState(0);
  const [lockGreen, setLockGreen] = useState(false);
  const [sslText, setSslText] = useState(false);
  const [checks, setChecks] = useState<number[]>([]);

  const displayDomain = domain || "yourcompany";
  const currentCompany = companies[companyIndex];

  const resetAll = useCallback(() => {
    setPhase(0);
    setDomain("");
    setLockGreen(false);
    setSslText(false);
    setChecks([]);
  }, []);

  // ─── MAIN ANIMATION LOOP ──────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;

    const delay = (ms: number) => new Promise<void>(resolve => {
      const t = setTimeout(resolve, ms);
      timeouts.push(t);
    });

    const typeIn = (text: string): Promise<void> => {
      return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
          if (cancelled) { clearInterval(interval); return; }
          if (i < text.length) {
            setDomain(text.substring(0, i + 1));
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 90);
        intervals.push(interval);
      });
    };

    const deleteOut = (): Promise<void> => {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (cancelled) { clearInterval(interval); return; }
          setDomain(prev => {
            if (prev.length <= 1) {
              clearInterval(interval);
              setTimeout(() => { setDomain(""); resolve(); }, 40);
              return "";
            }
            return prev.substring(0, prev.length - 1);
          });
        }, 50);
        intervals.push(interval);
      });
    };

    const runSSLSequence = async () => {
      // Lock turns green
      setPhase(3);
      setLockGreen(true);
      await delay(600);
      if (cancelled) return;

      // SSL text appears
      setPhase(4);
      setSslText(true);
      await delay(500);
      if (cancelled) return;

      // Checkmarks appear one by one
      setPhase(5);
      setChecks([0]);
      await delay(450);
      if (cancelled) return;
      setChecks([0, 1]);
      await delay(450);
      if (cancelled) return;
      setChecks([0, 1, 2]);
      await delay(300);
      if (cancelled) return;
    };

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();
      await delay(800);
      if (cancelled) return;

      // Cycle through each company
      for (let ci = 0; ci < companies.length; ci++) {
        if (cancelled) return;

        setCompanyIndex(ci);
        setLockGreen(false);
        setSslText(false);
        setChecks([]);

        // Phase 1: Type domain in
        setPhase(1);
        await typeIn(companies[ci].slug);
        if (cancelled) return;
        await delay(300);
        if (cancelled) return;

        // Phase 2: Browser updates with branding
        setPhase(2);
        await delay(500);
        if (cancelled) return;

        // Phase 3-5: SSL sequence
        await runSSLSequence();
        if (cancelled) return;

        // Phase 6: Hold
        setPhase(6);
        await delay(2200);
        if (cancelled) return;

        // Phase 7: Delete domain
        setPhase(7);
        await deleteOut();
        if (cancelled) return;
        await delay(400);
        if (cancelled) return;
      }

      // Loop
      if (!cancelled) runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [resetAll]);

  const sslChecks = [
    "Domain verified",
    "SSL active \u2014 256-bit encryption",
    "DNS configured \u2014 propagated worldwide",
  ];

  return (
    <section className="section-padding">
      <div className="container-narrow text-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            WHITE-LABEL INCLUDED (COMPETITORS CHARGE $200+/MO)
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-6 leading-[1.05]"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
        >
          Your domain. Your brand.
          <br />
          <span className="italic text-primary/80">Your rules.</span>
        </h2>

        {/* Body */}
        <p className="text-xl lg:text-2xl text-muted-foreground mb-14 leading-relaxed max-w-2xl mx-auto">
          Zero &ldquo;Powered by&rdquo; badges. Your clients see YOUR brand.
          Looks like you built it yourself. SSL certificate provisioned automatically.
        </p>

        {/* ── BROWSER MOCKUP ── */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40" style={{ background: 'hsl(var(--secondary))' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-background/80 border border-border/30">
                  <Lock
                    className="w-3 h-3 transition-colors duration-500"
                    style={{ color: lockGreen ? 'hsl(142, 76%, 46%)' : 'hsl(var(--muted-foreground))' }}
                  />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    sign.<strong className="text-foreground transition-all">{displayDomain}</strong>.com
                  </span>
                </div>
              </div>
            </div>

            {/* ── MINI SIGNING PAGE ── */}
            <div className="bg-white dark:bg-gray-50 px-6 py-8 sm:px-10 sm:py-10" style={{ minHeight: '340px' }}>
              {/* Company Logo Area */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-colors duration-500"
                  style={{
                    background: phase >= 2 ? currentCompany.color : 'hsl(var(--muted))',
                  }}
                >
                  {phase >= 2 ? currentCompany.name.charAt(0) : "Y"}
                </div>
                <span
                  className="text-lg font-bold text-gray-900 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {phase >= 2 ? currentCompany.name : "YourCompany"}
                </span>
              </div>

              {/* Instruction text */}
              <p className="text-sm text-gray-500 mb-6 text-center">
                Please review and sign the document below
              </p>

              {/* Mini document preview */}
              <div className="max-w-sm mx-auto bg-gray-50 dark:bg-gray-100 rounded-xl border border-gray-200 p-5 mb-6">
                {/* Fake document lines */}
                <div className="space-y-2.5 mb-5">
                  <div className="h-2 bg-gray-300/60 rounded-full w-full" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-11/12" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-4/5" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-full" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-9/12" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-3/4" />
                </div>
                <div className="h-px bg-gray-200 mb-4" />
                {/* Fake document lines - second paragraph */}
                <div className="space-y-2.5">
                  <div className="h-2 bg-gray-300/60 rounded-full w-full" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-10/12" />
                  <div className="h-2 bg-gray-300/60 rounded-full w-2/3" />
                </div>
              </div>

              {/* Signature field */}
              <div className="max-w-sm mx-auto mb-5">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 text-left font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Sign here
                </p>
                <div className="h-14 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {phase >= 2 ? (
                    <span
                      className="text-xl italic text-gray-800"
                      style={{
                        fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                        animation: 'fadeIn 0.4s ease-out',
                      }}
                    >
                      {phase >= 2 ? currentCompany.name.split(/(?=[A-Z])/).join(" ") : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Signature</span>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="max-w-sm mx-auto">
                <button
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors duration-500"
                  style={{
                    background: phase >= 2 ? currentCompany.color : 'hsl(var(--primary))',
                    cursor: 'default',
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* ── SSL CERTIFICATE ANIMATION ── */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Lock + SSL Provisioned text */}
            <div className="flex items-center gap-3 h-8">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-600"
                style={{
                  background: lockGreen ? 'hsl(142, 76%, 46%)' : 'hsl(var(--muted))',
                  transform: lockGreen ? 'scale(1)' : 'scale(0.9)',
                  animation: lockGreen ? 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
                }}
              >
                {lockGreen ? (
                  <Shield className="w-4 h-4 text-white" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              {sslText && (
                <span
                  className="text-sm font-semibold text-green-600 dark:text-green-400"
                  style={{ animation: 'fadeIn 0.4s ease-out' }}
                >
                  SSL Certificate Provisioned
                </span>
              )}
            </div>

            {/* Checkmarks */}
            <div className="flex flex-col items-start gap-2.5 min-h-[96px]">
              {sslChecks.map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 transition-all"
                  style={{
                    opacity: checks.includes(i) ? 1 : 0,
                    transform: checks.includes(i) ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default CustomDomain;
