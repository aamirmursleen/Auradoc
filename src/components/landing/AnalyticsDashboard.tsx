'use client'

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Eye, TrendingUp, BarChart3, Download,
  FileText, Clock, DollarSign, CheckCircle2,
  Activity,
} from "lucide-react";

// ─── STAT CARD DEFINITIONS ──────────────────────────────────────
const statCards = [
  { id: "docs", label: "Documents Sent", target: 12847, format: "int", icon: FileText, color: "hsl(217, 91%, 60%)" },
  { id: "rate", label: "Completion Rate", target: 98.2, format: "percent", icon: CheckCircle2, color: "hsl(142, 76%, 46%)" },
  { id: "time", label: "Avg. Sign Time", target: 3.4, format: "min", icon: Clock, color: "hsl(200, 70%, 55%)" },
  { id: "revenue", label: "Revenue Secured", target: 2.4, format: "money", icon: DollarSign, color: "hsl(38, 92%, 50%)" },
];

// ─── ACTIVITY FEED DATA ─────────────────────────────────────────
const activityEntries = [
  { name: "Sarah Chen", action: "signed", doc: "NDA_v2.pdf", time: "2 min ago", dotColor: "hsl(142, 76%, 46%)" },
  { name: "Mike R.", action: "opened", doc: "Proposal_Q2.pdf", time: "5 min ago", dotColor: "hsl(217, 91%, 60%)" },
  { name: "Emily P.", action: "completed", doc: "onboarding docs", time: "12 min ago", dotColor: "hsl(142, 76%, 46%)" },
  { name: "Contract #847", action: "awaiting", doc: "signature", time: "18 min ago", dotColor: "hsl(45, 93%, 47%)" },
  { name: "James W.", action: "declined", doc: "Amendment.pdf", time: "24 min ago", dotColor: "hsl(0, 72%, 51%)" },
];

// ─── SVG CHART DATA POINTS (upward trend) ───────────────────────
const chartPoints = [
  { x: 0, y: 72 }, { x: 1, y: 58 }, { x: 2, y: 64 },
  { x: 3, y: 42 }, { x: 4, y: 30 }, { x: 5, y: 12 },
];

const chartWidth = 360;
const chartHeight = 120;
const chartPadX = 40;
const chartPadTop = 10;
const chartPadBottom = 25;
const plotW = chartWidth - chartPadX - 10;
const plotH = chartHeight - chartPadTop - chartPadBottom;

const toSvgX = (i: number) => chartPadX + (i / 5) * plotW;
const toSvgY = (y: number) => chartPadTop + (y / 80) * plotH;

const linePath = chartPoints
  .map((p, i) => `${i === 0 ? "M" : "L"} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
  .join(" ");
const areaPath =
  linePath +
  ` L ${toSvgX(5)} ${chartPadTop + plotH} L ${toSvgX(0)} ${chartPadTop + plotH} Z`;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// ─── NUMBER FORMATTING ──────────────────────────────────────────
const formatValue = (val: number, format: string): string => {
  switch (format) {
    case "int":
      return Math.round(val).toLocaleString();
    case "percent":
      return val.toFixed(1) + "%";
    case "min":
      return val.toFixed(1) + " min";
    case "money":
      return "$" + val.toFixed(1) + "M";
    default:
      return String(val);
  }
};

// ─── COMPONENT ──────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const [phase, setPhase] = useState(0);
  const [statValues, setStatValues] = useState<number[]>([0, 0, 0, 0]);
  const [chartDrawn, setChartDrawn] = useState(false);
  const [visibleActivities, setVisibleActivities] = useState(0);
  const rafRef = useRef<number | null>(null);

  const resetAll = useCallback(() => {
    setPhase(0);
    setStatValues([0, 0, 0, 0]);
    setChartDrawn(false);
    setVisibleActivities(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── MAIN ANIMATION LOOP ─────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timeouts.push(t);
      });

    const animateCounters = (): Promise<void> => {
      return new Promise((resolve) => {
        const duration = 1500;
        let start: number | null = null;

        const tick = (ts: number) => {
          if (cancelled) return;
          if (!start) start = ts;
          const elapsed = ts - start;
          const t = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);

          setStatValues(
            statCards.map((s) => eased * s.target)
          );

          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setStatValues(statCards.map((s) => s.target));
            resolve();
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      });
    };

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();

      // Phase 0: visible but zeros
      await delay(800);
      if (cancelled) return;

      // Phase 1: counters animate
      setPhase(1);
      await animateCounters();
      if (cancelled) return;
      await delay(400);

      // Phase 2: chart draws
      setPhase(2);
      setChartDrawn(true);
      await delay(1200);
      if (cancelled) return;

      // Phase 3: activity entries slide in
      setPhase(3);
      for (let i = 1; i <= activityEntries.length; i++) {
        if (cancelled) return;
        setVisibleActivities(i);
        await delay(300);
      }
      if (cancelled) return;
      await delay(200);

      // Phase 4: hold
      setPhase(4);
      await delay(3000);
      if (cancelled) return;

      // Phase 5: reset & loop
      setPhase(5);
      await delay(600);
      if (cancelled) return;

      runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [resetAll]);

  // Approximate total line length for dasharray animation
  const totalLineLength = 520;

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* ─── LEFT COPY ────────────────────────────────────── */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                REPLACES MIXPANEL ($4,800/YEAR)
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.03em",
              }}
            >
              See exactly where deals die.
              <br />
              <span className="italic text-primary/80">
                Like a detective for your documents.
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Every open, every view, every hesitation — tracked. Know which
              page made them pause. Know when to follow up. Know everything.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                { icon: Eye, text: "See who opened, when, and from where" },
                { icon: TrendingUp, text: "Real-time signing progress tracking" },
                { icon: BarChart3, text: "Team performance leaderboards" },
                { icon: Download, text: "One-click CSV/PDF report exports" },
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
              See Your Analytics
            </Button>
          </div>

          {/* ─── RIGHT: DASHBOARD PANEL ─────────────────────── */}
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
              {/* ── Dark Header Bar ── */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: "hsl(222, 47%, 11%)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-white/70" />
                  <span className="text-sm font-semibold text-white/90 tracking-wide">
                    Analytics Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 livePulse" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-[11px] font-medium text-green-400">
                    Live
                  </span>
                </div>
              </div>

              {/* ── Dashboard Body ── */}
              <div className="p-5 space-y-5 bg-muted/20">
                {/* ── Stat Cards 2x2 ── */}
                <div className="grid grid-cols-2 gap-3">
                  {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        className="rounded-xl border border-border/40 bg-background p-4 transition-all duration-500"
                        style={{
                          opacity: phase >= 1 ? 1 : 0.5,
                          animation:
                            phase >= 1
                              ? `popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${idx * 0.08}s both`
                              : "none",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${card.color}15` }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: card.color }}
                            />
                          </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight mb-0.5">
                          {formatValue(statValues[idx], card.format)}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {card.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* ── SVG Area Chart ── */}
                <div
                  className="rounded-xl border border-border/40 bg-background p-4 transition-opacity duration-500"
                  style={{ opacity: phase >= 2 ? 1 : 0.5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-foreground/80">
                      Document Volume
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Last 6 months
                    </p>
                  </div>

                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full"
                    style={{ height: "auto" }}
                  >
                    <defs>
                      <linearGradient
                        id="areaGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(217, 91%, 60%)"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(217, 91%, 60%)"
                          stopOpacity="0.02"
                        />
                      </linearGradient>
                    </defs>

                    {/* Y-axis grid lines */}
                    {[0, 1, 2, 3].map((i) => {
                      const y = chartPadTop + (i / 3) * plotH;
                      return (
                        <g key={`grid-${i}`}>
                          <line
                            x1={chartPadX}
                            y1={y}
                            x2={chartPadX + plotW}
                            y2={y}
                            stroke="hsl(var(--border))"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                            opacity={0.5}
                          />
                          <text
                            x={chartPadX - 6}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="8"
                            fill="hsl(var(--muted-foreground))"
                          >
                            {Math.round(80 - (i * 80) / 3)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area fill */}
                    <path
                      d={areaPath}
                      fill="url(#areaGrad)"
                      className="transition-opacity duration-700"
                      style={{
                        opacity: chartDrawn ? 1 : 0,
                      }}
                    />

                    {/* Line stroke with draw animation */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={totalLineLength}
                      strokeDashoffset={chartDrawn ? 0 : totalLineLength}
                      style={{
                        transition: chartDrawn
                          ? "stroke-dashoffset 1s ease-out"
                          : "none",
                      }}
                    />

                    {/* Data dots */}
                    {chartPoints.map((p, i) => (
                      <circle
                        key={`dot-${i}`}
                        cx={toSvgX(p.x)}
                        cy={toSvgY(p.y)}
                        r="3.5"
                        fill="hsl(217, 91%, 60%)"
                        stroke="white"
                        strokeWidth="1.5"
                        className="transition-all duration-700"
                        style={{
                          opacity: chartDrawn ? 1 : 0,
                          transform: chartDrawn ? "scale(1)" : "scale(0)",
                          transformOrigin: `${toSvgX(p.x)}px ${toSvgY(p.y)}px`,
                          transitionDelay: chartDrawn
                            ? `${0.15 * i + 0.3}s`
                            : "0s",
                        }}
                      />
                    ))}

                    {/* X-axis labels */}
                    {months.map((m, i) => (
                      <text
                        key={m}
                        x={toSvgX(i)}
                        y={chartHeight - 4}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="500"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {m}
                      </text>
                    ))}
                  </svg>
                </div>

                {/* ── Activity Feed ── */}
                <div
                  className="rounded-xl border border-border/40 bg-background overflow-hidden transition-opacity duration-500"
                  style={{ opacity: phase >= 3 ? 1 : 0.5 }}
                >
                  <div className="px-4 pt-3 pb-2 border-b border-border/30">
                    <p className="text-xs font-semibold text-foreground/80">
                      Recent Activity
                    </p>
                  </div>

                  <div className="divide-y divide-border/20">
                    {activityEntries.map((entry, idx) => {
                      const isVisible = idx < visibleActivities;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-2.5 transition-all duration-400"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible
                              ? "translateX(0)"
                              : "translateX(24px)",
                            transition:
                              "opacity 0.35s ease-out, transform 0.35s ease-out",
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: entry.dotColor }}
                          />
                          <p className="text-[11px] text-foreground/80 flex-1 truncate">
                            <span className="font-semibold">{entry.name}</span>{" "}
                            {entry.action}{" "}
                            <span className="text-foreground/60">
                              {entry.doc}
                            </span>
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {entry.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle shimmer overlay during phase transitions */}
            {phase === 5 && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, hsl(var(--background) / 0.6) 50%, transparent 100%)",
                    animation: "shimmer 0.8s ease-in-out",
                  }}
                />
              </div>
            )}
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
            transform: scale(1.05);
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
        @keyframes livePulse {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(2);
          }
        }
        .livePulse {
          animation: livePulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AnalyticsDashboard;
