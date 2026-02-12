'use client'

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield, ShieldCheck, ShieldX, FileText, Upload, Lock,
  Check, X, AlertTriangle, Search, Scale, Link2, Fingerprint,
} from "lucide-react";

// ─── CONSTANTS ──────────────────────────────────────────────────
const FULL_HASH = "a7f3b2c9d8e1f4a6b5c3d7e9f2a8b4c6d1e5f3a9b7c2d4e6f8a1b3c5d9e7f2a4";

const BULLET_POINTS = [
  { icon: Link2, text: "Public verification link — no login required" },
  { icon: Shield, text: "SHA-256 fingerprint on every signed PDF" },
  { icon: Search, text: "Detects any change — even a single comma" },
  { icon: Scale, text: "Accepted by courts & law enforcement" },
];

const STEPS = [
  { label: "Analyzing structure", icon: Search },
  { label: "Computing fingerprint", icon: Fingerprint },
  { label: "Verifying authenticity", icon: ShieldCheck },
];

// ─── COMPONENT ──────────────────────────────────────────────────
const DocumentVerification = () => {
  const [phase, setPhase] = useState(0);
  const [scanStep, setScanStep] = useState(0); // 0=idle, 1/2/3=active, 4=all success, -1=step3 failed
  const [hashRevealed, setHashRevealed] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [fileDropped, setFileDropped] = useState(false);
  const [dropProgress, setDropProgress] = useState(0);

  const resetAll = useCallback(() => {
    setPhase(0);
    setScanStep(0);
    setHashRevealed("");
    setShowResult(false);
    setFileDropped(false);
    setDropProgress(0);
  }, []);

  // ─── MAIN ANIMATION LOOP ───────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;
    let rafId: number | null = null;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timeouts.push(t);
      });

    const animateFileDrop = (): Promise<void> => {
      return new Promise((resolve) => {
        setDropProgress(0);
        let start: number | null = null;
        const animate = (ts: number) => {
          if (cancelled) return;
          if (!start) start = ts;
          const elapsed = ts - start;
          const progress = Math.min(elapsed / 800, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          setDropProgress(eased);
          if (progress < 1) {
            rafId = requestAnimationFrame(animate);
          } else {
            setFileDropped(true);
            setDropProgress(1);
            resolve();
          }
        };
        rafId = requestAnimationFrame(animate);
      });
    };

    const revealHash = (
      hash: string,
      setter: (v: string) => void,
      speed = 18
    ): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (cancelled) {
            clearInterval(interval);
            return;
          }
          if (i < hash.length) {
            setter(hash.substring(0, i + 1));
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, speed);
        intervals.push(interval);
      });
    };

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();

      // ── Phase 0: Idle drop zone ──
      setPhase(0);
      await delay(1200);
      if (cancelled) return;

      // ── Phase 1: File flies in (verified) ──
      setPhase(1);
      await animateFileDrop();
      if (cancelled) return;
      await delay(200);
      if (cancelled) return;

      // ── Phase 2: 3-step stepper (all pass) ──
      setPhase(2);

      // Step 1: Analyzing structure
      setScanStep(1);
      await delay(1200);
      if (cancelled) return;
      setScanStep(1.5); // step 1 complete marker
      await delay(300);
      if (cancelled) return;

      // Step 2: Computing fingerprint + hash reveal
      setScanStep(2);
      await revealHash(FULL_HASH, setHashRevealed, 22);
      if (cancelled) return;
      setScanStep(2.5); // step 2 complete marker
      await delay(300);
      if (cancelled) return;

      // Step 3: Verifying authenticity
      setScanStep(3);
      await delay(800);
      if (cancelled) return;
      setScanStep(4); // all steps complete

      // ── Phase 3: Show verified result ──
      setPhase(3);
      setShowResult(true);
      await delay(100);
      if (cancelled) return;

      // ── Phase 4: Hold verified result ──
      setPhase(4);
      await delay(2500);
      if (cancelled) return;

      // ── Phase 5: Reset for tampered flow ──
      setPhase(5);
      setShowResult(false);
      setScanStep(0);
      setHashRevealed("");
      setFileDropped(false);
      setDropProgress(0);
      await delay(400);
      if (cancelled) return;

      // File flies in (tampered)
      await animateFileDrop();
      if (cancelled) return;
      await delay(200);
      if (cancelled) return;

      // ── Phase 6: 3-step stepper (step 3 fails) ──
      setPhase(6);

      // Step 1
      setScanStep(1);
      await delay(1200);
      if (cancelled) return;
      setScanStep(1.5);
      await delay(300);
      if (cancelled) return;

      // Step 2
      setScanStep(2);
      await revealHash(FULL_HASH.substring(0, 32), setHashRevealed, 22);
      if (cancelled) return;
      setScanStep(2.5);
      await delay(300);
      if (cancelled) return;

      // Step 3 — FAIL
      setScanStep(3);
      await delay(800);
      if (cancelled) return;
      setScanStep(-1); // failed

      // ── Phase 7: Show tampered result ──
      setPhase(7);
      setShowResult(true);
      await delay(100);
      if (cancelled) return;

      // ── Phase 8: Hold tampered result ──
      setPhase(8);
      await delay(2500);
      if (cancelled) return;

      // ── Phase 9: Fade out and loop ──
      setPhase(9);
      setShowResult(false);
      await delay(600);
      if (cancelled) return;

      runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [resetAll]);

  // ─── DERIVED STATE ──────────────────────────────────────────────
  const isTampered = phase >= 5 && phase <= 9;
  const isVerified = phase >= 1 && phase <= 4;
  const fileName = isTampered
    ? "Contract_Agreement_v2_EDITED.pdf"
    : "Contract_Agreement.pdf";
  const fileSize = isTampered ? "2.4 MB" : "1.8 MB";
  const isScanning = phase === 2 || phase === 6;
  const showStepper = isScanning || scanStep === 4 || scanStep === -1 || showResult;

  const getStepState = (stepNum: number) => {
    if (scanStep === 4) return "complete";
    if (scanStep === -1 && stepNum < 3) return "complete";
    if (scanStep === -1 && stepNum === 3) return "failed";
    const wholeStep = Math.floor(scanStep);
    const isHalf = scanStep % 1 !== 0;
    if (isHalf && wholeStep === stepNum) return "complete";
    if (wholeStep === stepNum && !isHalf) return "active";
    if (stepNum < wholeStep) return "complete";
    if (isHalf && stepNum < wholeStep) return "complete";
    return "pending";
  };

  // ─── GLOW COLOR ─────────────────────────────────────────────────
  const glowBg = (() => {
    if (phase >= 3 && phase <= 4)
      return "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.3), transparent 70%)";
    if (phase >= 7 && phase <= 8)
      return "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.3), transparent 70%)";
    return "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15), transparent 70%)";
  })();

  // ─── RENDER ─────────────────────────────────────────────────────
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* ── LEFT: Copy ── */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                PUBLIC VERIFICATION — FREE FOR ANYONE
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.03em",
              }}
            >
              Anyone can verify.
              <br />
              Courts. Lawyers. Police.
              <br />
              <span className="italic text-primary/80">One click. Public proof.</span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Every signed document gets a public verification link. Share it with
              anyone — clients, lawyers, courts, even law enforcement. They&apos;ll
              see instantly if the PDF is the original or has been tampered with.
              No account needed. No login. Just truth.
            </p>

            <ul className="space-y-5 mb-12">
              {BULLET_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg text-foreground/80">{text}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="hero"
              size="lg"
              className="h-16 px-12 rounded-2xl text-lg"
            >
              Try Public Verification
            </Button>
          </div>

          {/* ── RIGHT: Browser Mockup ── */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-background">
              {/* Browser Chrome */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-border/40"
                style={{ background: "hsl(var(--browser-chrome))" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md"
                    style={{ background: "hsl(var(--browser-bar))" }}
                  >
                    <Lock className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-medium text-white/50">
                      verify.auradoc.com/check
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="relative bg-white dark:bg-gray-50" style={{ minHeight: "480px" }}>
                {/* Branding bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-gray-800 tracking-wide">
                    AuraDoc Verify
                  </span>
                </div>

                {/* Main content area */}
                <div className="px-6 py-6">
                  {/* Drop Zone */}
                  <div
                    className="relative rounded-xl border-2 transition-all duration-500 flex flex-col items-center justify-center overflow-hidden"
                    style={{
                      minHeight: "140px",
                      borderStyle: fileDropped ? "solid" : "dashed",
                      borderColor: fileDropped
                        ? "hsl(var(--primary) / 0.3)"
                        : "hsl(var(--border))",
                      background: fileDropped
                        ? "hsl(var(--primary) / 0.02)"
                        : "transparent",
                      animation:
                        phase === 0 ? "pulseBorder 2s ease-in-out infinite" : "none",
                    }}
                  >
                    {/* Idle state */}
                    {!fileDropped && dropProgress === 0 && (
                      <div className="flex flex-col items-center gap-2 py-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
                        <Upload className="w-8 h-8 text-gray-300" />
                        <p className="text-sm text-gray-400 font-medium">
                          Drop your PDF here to verify
                        </p>
                      </div>
                    )}

                    {/* Flying file (during animation) */}
                    {dropProgress > 0 && !fileDropped && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          right: `${50 - dropProgress * 50}%`,
                          top: `${-20 + dropProgress * 55}%`,
                          transform: `translate(50%, 0) rotate(${(1 - dropProgress) * 12}deg) scale(${0.8 + dropProgress * 0.2})`,
                          opacity: 0.3 + dropProgress * 0.7,
                          transition: "none",
                        }}
                      >
                        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                          <FileText className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{fileName}</p>
                            <p className="text-[10px] text-gray-400">{fileSize}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Landed file */}
                    {fileDropped && (
                      <div className="flex items-center gap-3 py-3" style={{ animation: "fadeIn 0.2s ease-out" }}>
                        <div className="relative">
                          <FileText className="w-6 h-6 text-red-400" />
                          <div
                            className="absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center"
                            style={{ animation: "popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
                          >
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{fileName}</p>
                          <p className="text-[10px] text-gray-400">{fileSize}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3-Step Stepper */}
                  {showStepper && (
                    <div className="mt-6" style={{ animation: "fadeIn 0.3s ease-out" }}>
                      {/* Step indicators */}
                      <div className="flex items-center justify-between mb-4">
                        {STEPS.map((step, i) => {
                          const stepNum = i + 1;
                          const state = getStepState(stepNum);
                          const StepIcon = step.icon;
                          return (
                            <div key={step.label} className="flex items-center" style={{ flex: i < 2 ? 1 : "none" }}>
                              {/* Step circle */}
                              <div className="flex flex-col items-center" style={{ width: "64px" }}>
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300"
                                  style={{
                                    border:
                                      state === "complete"
                                        ? "2px solid #22c55e"
                                        : state === "failed"
                                        ? "2px solid #ef4444"
                                        : state === "active"
                                        ? "2px solid hsl(var(--primary))"
                                        : "2px solid #d1d5db",
                                    background:
                                      state === "complete"
                                        ? "#22c55e"
                                        : state === "failed"
                                        ? "#ef4444"
                                        : "white",
                                    animation:
                                      state === "complete"
                                        ? "popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                                        : state === "failed"
                                        ? "shakeIn 0.4s ease-out"
                                        : "none",
                                  }}
                                >
                                  {state === "complete" ? (
                                    <Check className="w-5 h-5 text-white" />
                                  ) : state === "failed" ? (
                                    <X className="w-5 h-5 text-white" />
                                  ) : (
                                    <StepIcon
                                      className="w-4 h-4"
                                      style={{
                                        color:
                                          state === "active"
                                            ? "hsl(var(--primary))"
                                            : "#9ca3af",
                                      }}
                                    />
                                  )}

                                  {/* Spinning ring for active */}
                                  {state === "active" && (
                                    <div
                                      className="absolute inset-[-3px] rounded-full border-2 border-transparent"
                                      style={{
                                        borderTopColor: "hsl(var(--primary))",
                                        animation: "spin 1s linear infinite",
                                      }}
                                    />
                                  )}
                                </div>
                                <p
                                  className="text-[10px] mt-1.5 text-center leading-tight font-medium"
                                  style={{
                                    color:
                                      state === "complete"
                                        ? "#16a34a"
                                        : state === "failed"
                                        ? "#dc2626"
                                        : state === "active"
                                        ? "hsl(var(--primary))"
                                        : "#9ca3af",
                                  }}
                                >
                                  {step.label}
                                </p>
                              </div>

                              {/* Connecting line */}
                              {i < 2 && (
                                <div
                                  className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                                  style={{
                                    background:
                                      getStepState(stepNum) === "complete"
                                        ? "#22c55e"
                                        : "#e5e7eb",
                                    marginBottom: "22px",
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Hash reveal below stepper */}
                      {hashRevealed && (
                        <div
                          className="mt-3 px-3 py-2 rounded-lg border border-gray-100"
                          style={{
                            background: "#f9fafb",
                            animation: "fadeIn 0.3s ease-out",
                          }}
                        >
                          <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wider">
                            SHA-256 Fingerprint
                          </p>
                          <p
                            className="text-[11px] text-gray-600 break-all leading-relaxed"
                            style={{ fontFamily: "var(--font-mono, monospace)" }}
                          >
                            {hashRevealed}
                            {(scanStep === 2) && (
                              <span className="inline-block w-0.5 h-3 bg-primary ml-0.5 align-middle" style={{ animation: "blink 0.8s step-end infinite" }} />
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Result Overlay ── */}
                {showResult && (phase === 3 || phase === 4) && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                      background: "rgba(255, 255, 255, 0.92)",
                      animation: "fadeIn 0.3s ease-out",
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-4 text-center px-8"
                      style={{ animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      {/* Green shield */}
                      <div
                        className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                        style={{
                          animation: "popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s both",
                        }}
                      >
                        <ShieldCheck className="w-8 h-8 text-white" />
                      </div>

                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Document Verified
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Original &amp; Untampered
                        </p>
                      </div>

                      {/* Certificate card */}
                      <div
                        className="w-full max-w-xs rounded-lg border-2 overflow-hidden"
                        style={{
                          background: "#f0fdf4",
                          borderColor: "#bbf7d0",
                        }}
                      >
                        <div className="px-4 py-2 flex items-center gap-2" style={{ background: "#dcfce7", borderBottom: "1px solid #bbf7d0" }}>
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                            Authentic
                          </span>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          {[
                            { label: "Signer", value: "john.smith@acme.corp" },
                            { label: "Date", value: "Feb 12, 2026, 14:32 UTC" },
                            { label: "Hash", value: FULL_HASH.substring(0, 24) + "...", mono: true },
                          ].map(({ label, value, mono }) => (
                            <div key={label} className="flex items-start gap-3">
                              <span className="text-[10px] text-gray-500 w-12 shrink-0 text-right font-medium">
                                {label}
                              </span>
                              <span
                                className={`text-[11px] text-gray-700 ${mono ? "break-all" : ""}`}
                                style={mono ? { fontFamily: "var(--font-mono, monospace)" } : {}}
                              >
                                {value}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-center pt-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-[10px] font-bold text-green-700 uppercase tracking-wider">
                              <Check className="w-3 h-3" /> Authentic
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tampered Result Overlay ── */}
                {showResult && (phase === 7 || phase === 8) && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                      background: "rgba(255, 255, 255, 0.92)",
                      animation: "fadeIn 0.3s ease-out",
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-4 text-center px-8"
                      style={{ animation: "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      {/* Red shield */}
                      <div
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                        style={{
                          animation: "shakeIn 0.5s ease-out 0.1s both",
                        }}
                      >
                        <ShieldX className="w-8 h-8 text-white" />
                      </div>

                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Document Tampered
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Integrity Compromised
                        </p>
                      </div>

                      {/* Alert card */}
                      <div
                        className="w-full max-w-xs rounded-lg border-2 overflow-hidden"
                        style={{
                          background: "#fef2f2",
                          borderColor: "#fecaca",
                        }}
                      >
                        <div className="px-4 py-2 flex items-center gap-2" style={{ background: "#fee2e2", borderBottom: "1px solid #fecaca" }}>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                            Tamper Alert
                          </span>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          {[
                            { label: "Page", value: "Page 3, Clause 4.2" },
                            { label: "Change", value: "Payment terms altered" },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-start gap-3">
                              <span className="text-[10px] text-gray-500 w-12 shrink-0 text-right font-medium">
                                {label}
                              </span>
                              <span className="text-[11px] text-gray-700">
                                {value}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-start gap-3">
                            <span className="text-[10px] text-gray-500 w-12 shrink-0 text-right font-medium">
                              Amount
                            </span>
                            <span className="text-[11px] text-gray-700">
                              $50,000 →{" "}
                              <span
                                className="font-bold text-red-600 px-1 py-0.5 rounded"
                                style={{ background: "#fee2e2" }}
                              >
                                $75,000
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center justify-center pt-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                              <X className="w-3 h-3" /> Tampered
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Glow effect behind browser */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{
                background: glowBg,
                transition: "background 1s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          70% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shakeIn {
          0% {
            opacity: 0;
            transform: translateX(-8px);
          }
          20% {
            transform: translateX(6px);
          }
          40% {
            transform: translateX(-4px);
          }
          60% {
            transform: translateX(2px);
          }
          80% {
            transform: translateX(-1px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulseBorder {
          0%,
          100% {
            border-color: hsl(var(--border));
          }
          50% {
            border-color: hsl(var(--primary) / 0.3);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default DocumentVerification;
