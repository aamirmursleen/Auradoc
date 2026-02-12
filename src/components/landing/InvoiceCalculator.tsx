'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Check, FileText, Lock, DollarSign, Globe,
  Zap, BarChart3, CreditCard
} from "lucide-react";

// ─── LINE ITEM DEFINITIONS ────────────────────────────────────
const lineItems = [
  { description: "Website Redesign", qty: 1, rate: 8500.00, amount: 8500.00 },
  { description: "Brand Identity Package", qty: 1, rate: 3200.00, amount: 3200.00 },
  { description: "SEO Optimization (3 months)", qty: 3, rate: 1500.00, amount: 4500.00 },
  { description: "Hosting & Maintenance", qty: 12, rate: 99.00, amount: 1188.00 },
];

const SUBTOTAL = 17388.00;
const TAX_RATE = 0.085;
const TAX = Math.round(SUBTOTAL * TAX_RATE * 100) / 100;
const TOTAL = Math.round((SUBTOTAL + TAX) * 100) / 100;

const formatCurrency = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InvoiceCalculator = () => {
  const [phase, setPhase] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCityState, setClientCityState] = useState("");
  const [visibleItems, setVisibleItems] = useState(0);
  const [animatedSubtotal, setAnimatedSubtotal] = useState(0);
  const [animatedTax, setAnimatedTax] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [showPaid, setShowPaid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetAll = useCallback(() => {
    setPhase(0);
    setClientName("");
    setClientAddress("");
    setClientCityState("");
    setVisibleItems(0);
    setAnimatedSubtotal(0);
    setAnimatedTax(0);
    setAnimatedTotal(0);
    setShowPaid(false);
    setShowSuccess(false);
  }, []);

  const typeText = useCallback(
    (text: string, setter: (v: string) => void, onDone: () => void) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setter(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          onDone();
        }
      }, 55);
      return interval;
    },
    []
  );

  // ─── ANIMATED NUMBER COUNTER ─────────────────────────────────
  const animateNumber = useCallback(
    (target: number, setter: (v: number) => void, duration: number): Promise<void> => {
      return new Promise((resolve) => {
        let start: number | null = null;
        const step = (ts: number) => {
          if (!start) start = ts;
          const elapsed = ts - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setter(Math.round(eased * target * 100) / 100);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setter(target);
            resolve();
          }
        };
        requestAnimationFrame(step);
      });
    },
    []
  );

  // ─── MAIN ANIMATION LOOP ──────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timeouts.push(t);
      });

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();
      await delay(1200);
      if (cancelled) return;

      // Phase 1: Type client info
      setPhase(1);
      await new Promise<void>((resolve) => {
        const int1 = typeText("Globex Corporation", setClientName, resolve);
        intervals.push(int1);
      });
      if (cancelled) return;
      await delay(200);

      await new Promise<void>((resolve) => {
        const int2 = typeText("742 Evergreen Terrace, Suite 200", setClientAddress, resolve);
        intervals.push(int2);
      });
      if (cancelled) return;
      await delay(200);

      await new Promise<void>((resolve) => {
        const int3 = typeText("Springfield, IL 62704", setClientCityState, resolve);
        intervals.push(int3);
      });
      if (cancelled) return;
      await delay(600);

      // Phase 2: Line items slide in one by one
      setPhase(2);
      for (let i = 1; i <= 4; i++) {
        if (cancelled) return;
        setVisibleItems(i);
        await delay(500);
      }
      if (cancelled) return;
      await delay(400);

      // Phase 3: Animated totals count up
      setPhase(3);
      await animateNumber(SUBTOTAL, setAnimatedSubtotal, 800);
      if (cancelled) return;
      await delay(200);
      await animateNumber(TAX, setAnimatedTax, 600);
      if (cancelled) return;
      await delay(200);
      await animateNumber(TOTAL, setAnimatedTotal, 900);
      if (cancelled) return;
      await delay(600);

      // Phase 4: PAID watermark stamps in
      setPhase(4);
      setShowPaid(true);
      await delay(1800);
      if (cancelled) return;

      // Phase 5: Success overlay
      setPhase(5);
      setShowSuccess(true);
      await delay(4000);
      if (cancelled) return;

      // Phase 6: Reset and loop
      setPhase(6);
      await delay(500);
      if (cancelled) return;

      runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [resetAll, typeText, animateNumber]);

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Copy */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                REPLACES FRESHBOOKS ($264/YEAR)
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
            >
              Get paid 3x faster.
              <br />
              <span className="italic text-primary/80">
                Auto-calculate. Auto-send. Auto-remind.
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Stop chasing payments. Professional invoices that calculate taxes
              for 190+ countries, send automatically, and make clients pay 3x
              faster.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                { icon: DollarSign, text: "Clients pay 3x faster (proven)" },
                { icon: Globe, text: "Auto-calculate taxes for 190+ countries" },
                { icon: Zap, text: "Send professional invoices in 60 seconds" },
                { icon: BarChart3, text: "Real-time payment tracking dashboard" },
              ].map(({ icon: Icon, text }) => (
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
              Create Your First Invoice
            </Button>
          </div>

          {/* RIGHT: PDF INVOICE DOCUMENT */}
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-border/40"
                style={{ background: "hsl(263, 84%, 10%)" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md"
                    style={{ background: "hsl(263, 84%, 16%)" }}
                  >
                    <Lock className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-medium text-white/50">
                      invoices.yourcompany.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-semibold">
                    Invoice_INV-2026-0847.pdf
                  </span>
                  {phase >= 1 && phase <= 3 && (
                    <span className="text-[10px] text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Generating...
                    </span>
                  )}
                  {phase >= 4 && phase < 6 && (
                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Paid
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        background:
                          phase >= step
                            ? "hsl(142, 76%, 46%)"
                            : "hsl(var(--border))",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── ACTUAL PDF CONTENT ── */}
              <div
                className="relative bg-white dark:bg-gray-50"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <div
                  className="mx-3 my-3 bg-white shadow-lg border border-gray-200 relative overflow-hidden"
                  style={{ minHeight: "600px" }}
                >
                  <div className="px-8 py-6">
                    {/* ── COMPANY HEADER ── */}
                    <div className="flex items-start justify-between mb-5 pb-3 border-b-2 border-gray-800">
                      <div>
                        <p
                          className="text-[15px] font-bold text-gray-900 tracking-wide"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          ACME CORPORATION
                        </p>
                        <p
                          className="text-[8px] text-gray-500 mt-0.5"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          1200 Innovation Drive, Suite 400 &bull; San Francisco,
                          CA 94107
                        </p>
                        <p
                          className="text-[8px] text-gray-500"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          (415) 555-0198 &bull; www.acmecorp.com
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-[20px] font-bold text-gray-900 tracking-widest"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          INVOICE
                        </p>
                      </div>
                    </div>

                    {/* ── INVOICE META ── */}
                    <div className="flex justify-between mb-5">
                      <div>
                        <p
                          className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          Bill To:
                        </p>
                        <div style={{ minHeight: "38px" }}>
                          {clientName && (
                            <p
                              className="text-[11px] font-bold text-gray-900"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {clientName}
                              {phase >= 1 && !clientAddress && (
                                <span className="inline-block w-0.5 h-3 bg-primary animate-pulse ml-0.5 align-middle" />
                              )}
                            </p>
                          )}
                          {clientAddress && (
                            <p
                              className="text-[9px] text-gray-600"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {clientAddress}
                              {phase >= 1 && !clientCityState && (
                                <span className="inline-block w-0.5 h-2.5 bg-primary animate-pulse ml-0.5 align-middle" />
                              )}
                            </p>
                          )}
                          {clientCityState && (
                            <p
                              className="text-[9px] text-gray-600"
                              style={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {clientCityState}
                            </p>
                          )}
                          {!clientName && phase === 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-gray-300 italic">
                                Client info...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex justify-end gap-4">
                          <p
                            className="text-[8px] font-bold text-gray-500 uppercase tracking-wider"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Invoice #:
                          </p>
                          <p
                            className="text-[9px] text-gray-800 font-semibold"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            INV-2026-0847
                          </p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <p
                            className="text-[8px] font-bold text-gray-500 uppercase tracking-wider"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Date:
                          </p>
                          <p
                            className="text-[9px] text-gray-800"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Feb 12, 2026
                          </p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <p
                            className="text-[8px] font-bold text-gray-500 uppercase tracking-wider"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Due Date:
                          </p>
                          <p
                            className="text-[9px] text-gray-800"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Mar 14, 2026
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── LINE ITEMS TABLE ── */}
                    <div className="mb-4">
                      {/* Table Header */}
                      <div
                        className="grid gap-2 px-3 py-2 rounded-sm"
                        style={{
                          gridTemplateColumns: "2fr 0.5fr 1fr 1fr",
                          background: "#f3f4f6",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider">
                          Description
                        </p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center">
                          Qty
                        </p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-right">
                          Rate
                        </p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-right">
                          Amount
                        </p>
                      </div>

                      {/* Table Rows */}
                      {lineItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid gap-2 px-3 py-2 border-b border-gray-100"
                          style={{
                            gridTemplateColumns: "2fr 0.5fr 1fr 1fr",
                            opacity: idx < visibleItems ? 1 : 0,
                            transform:
                              idx < visibleItems
                                ? "translateX(0)"
                                : "translateX(30px)",
                            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <p
                            className="text-[10px] text-gray-800"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            {item.description}
                          </p>
                          <p
                            className="text-[10px] text-gray-700 text-center"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {item.qty}
                          </p>
                          <p
                            className="text-[10px] text-gray-700 text-right"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {formatCurrency(item.rate)}
                          </p>
                          <p
                            className="text-[10px] font-semibold text-gray-900 text-right"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {formatCurrency(item.amount)}
                          </p>
                        </div>
                      ))}

                      {/* Empty row placeholders when items haven't appeared */}
                      {visibleItems === 0 && phase === 0 && (
                        <div className="px-3 py-6 text-center">
                          <span className="text-[9px] text-gray-300 italic">
                            Line items...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── TOTALS SECTION ── */}
                    <div className="flex justify-end mb-5">
                      <div className="w-[220px]">
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <p
                            className="text-[9px] text-gray-600"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Subtotal
                          </p>
                          <p
                            className="text-[10px] font-semibold text-gray-800 tabular-nums"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {phase >= 3
                              ? formatCurrency(animatedSubtotal)
                              : phase >= 2 && visibleItems === 4
                                ? "..."
                                : "—"}
                          </p>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-gray-100">
                          <p
                            className="text-[9px] text-gray-600"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Tax (8.5%)
                          </p>
                          <p
                            className="text-[10px] font-semibold text-gray-800 tabular-nums"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {phase >= 3 && animatedTax > 0
                              ? formatCurrency(animatedTax)
                              : phase >= 3
                                ? "..."
                                : "—"}
                          </p>
                        </div>
                        <div className="flex justify-between py-2 border-t-2 border-gray-800 mt-1">
                          <p
                            className="text-[11px] font-bold text-gray-900"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            Total Due
                          </p>
                          <p
                            className="text-[13px] font-bold text-gray-900 tabular-nums"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {phase >= 3 && animatedTotal > 0
                              ? formatCurrency(animatedTotal)
                              : phase >= 3
                                ? "..."
                                : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ── PAYMENT INFO ── */}
                    <div className="border-t border-gray-200 pt-3">
                      <p
                        className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        Payment Method
                      </p>
                      <p
                        className="text-[9px] text-gray-600"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        ACH Transfer &bull; Account ending in 4821 &bull; Routing
                        #021000021
                      </p>
                    </div>
                  </div>

                  {/* Page footer */}
                  <div className="px-8 py-2 border-t border-gray-200 flex justify-between mt-auto">
                    <p
                      className="text-[7px] text-gray-400 italic"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Thank you for your business
                    </p>
                    <p
                      className="text-[7px] text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Page 1 of 1
                    </p>
                  </div>

                  {/* ── PAID WATERMARK ── */}
                  {showPaid && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <div
                        className="border-[6px] border-green-500 rounded-lg px-10 py-3"
                        style={{
                          transform: "rotate(-30deg)",
                          opacity: 0.15,
                        }}
                      >
                        <p
                          className="text-[72px] font-black text-green-500 tracking-[0.2em] leading-none"
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          PAID
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SUCCESS OVERLAY ── */}
                {showSuccess && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      animation: "fadeIn 0.4s ease-out",
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-4 text-center px-8"
                      style={{
                        animation:
                          "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                        style={{
                          animation:
                            "popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s both",
                        }}
                      >
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          Invoice Sent & Paid!
                        </p>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                          <CreditCard className="w-4 h-4" />
                          {formatCurrency(TOTAL)} received
                        </p>
                      </div>
                      <div className="flex gap-6 mt-2">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Client
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            Globex Corporation
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Payment
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            ACH Transfer
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Status
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            Complete
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
            transform: scale(0.9) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default InvoiceCalculator;
