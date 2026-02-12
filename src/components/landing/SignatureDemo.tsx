'use client'

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Check, FileText, Lock, PenTool, Send, Mail, Sparkles,
  User, Calendar, Type, Shield, ChevronDown
} from "lucide-react";

// ─── FIELD WIDGET DEFINITIONS ────────────────────────────────────
const fieldWidgets = [
  { id: "firstName", label: "First Name", icon: User, color: "hsl(263, 84%, 57%)" },
  { id: "lastName", label: "Last Name", icon: Type, color: "hsl(280, 80%, 55%)" },
  { id: "date", label: "Date", icon: Calendar, color: "hsl(217, 91%, 60%)" },
  { id: "signature", label: "Signature", icon: PenTool, color: "hsl(340, 82%, 52%)" },
];

const SignatureDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [landedWidgets, setLandedWidgets] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const resetAll = useCallback(() => {
    setPhase(0);
    setActiveWidget(null);
    setLandedWidgets([]);
    setFirstName("");
    setLastName("");
    setDateValue("");
    setHasSignature(false);
    setDragProgress(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const typeText = useCallback((text: string, setter: (v: string) => void, onDone: () => void) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setter(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 80);
    return interval;
  }, []);

  const drawSignature = useCallback((onDone: () => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = 440;
    canvas.height = 60;

    const points = [
      { x: 20, y: 40 }, { x: 25, y: 22 }, { x: 30, y: 14 }, { x: 36, y: 18 },
      { x: 33, y: 34 }, { x: 28, y: 46 }, { x: 22, y: 48 }, { x: 20, y: 40 },
      { x: 40, y: 30 },
      { x: 48, y: 26 }, { x: 56, y: 22 }, { x: 60, y: 26 }, { x: 56, y: 32 },
      { x: 48, y: 32 },
      { x: 64, y: 18 }, { x: 66, y: 32 }, { x: 72, y: 22 }, { x: 76, y: 32 },
      { x: 96, y: 32 }, { x: 104, y: 14 }, { x: 112, y: 10 }, { x: 116, y: 18 },
      { x: 108, y: 26 }, { x: 104, y: 28 }, { x: 112, y: 34 }, { x: 124, y: 38 },
      { x: 132, y: 32 },
      { x: 140, y: 22 }, { x: 144, y: 32 }, { x: 148, y: 22 }, { x: 152, y: 32 },
      { x: 160, y: 22 }, { x: 164, y: 32 }, { x: 172, y: 22 },
      { x: 184, y: 32 }, { x: 210, y: 36 }, { x: 236, y: 32 },
    ];

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let idx = 1;
    const interval = setInterval(() => {
      if (idx < points.length) {
        const pt = points[idx];
        const prev = points[idx - 1];
        const cpX = (prev.x + pt.x) / 2;
        const cpY = (prev.y + pt.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        ctx.stroke();
        idx++;
      } else {
        clearInterval(interval);
        onDone();
      }
    }, 40);

    return interval;
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

    const animateDrag = (widgetId: string): Promise<void> => {
      return new Promise(resolve => {
        setActiveWidget(widgetId);
        setDragProgress(0);
        let start: number | null = null;
        const animate = (ts: number) => {
          if (cancelled) return;
          if (!start) start = ts;
          const elapsed = ts - start;
          const progress = Math.min(elapsed / 700, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDragProgress(eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setLandedWidgets(prev => [...prev, widgetId]);
            setActiveWidget(null);
            setDragProgress(0);
            resolve();
          }
        };
        requestAnimationFrame(animate);
      });
    };

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();
      await delay(1200);
      if (cancelled) return;

      setPhase(1);
      await animateDrag("firstName");
      if (cancelled) return;
      await delay(200);
      const int1 = typeText("John", setFirstName, () => {});
      intervals.push(int1);
      await delay(500);
      if (cancelled) return;

      setPhase(2);
      await animateDrag("lastName");
      if (cancelled) return;
      await delay(200);
      const int2 = typeText("Smith", setLastName, () => {});
      intervals.push(int2);
      await delay(500);
      if (cancelled) return;

      setPhase(3);
      await animateDrag("date");
      if (cancelled) return;
      await delay(200);
      const int3 = typeText("Feb 12, 2026", setDateValue, () => {});
      intervals.push(int3);
      await delay(1000);
      if (cancelled) return;

      setPhase(4);
      await animateDrag("signature");
      if (cancelled) return;
      await delay(300);
      await new Promise<void>(resolve => {
        const int4 = drawSignature(() => {
          setHasSignature(true);
          resolve();
        });
        if (int4) intervals.push(int4);
      });
      if (cancelled) return;

      setPhase(5);
      await delay(700);
      if (cancelled) return;

      setPhase(6);
      await delay(1200);
      if (cancelled) return;

      setPhase(7);
      await delay(3500);
      if (cancelled) return;

      runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [resetAll, typeText, drawSignature]);

  const isLanded = (id: string) => landedWidgets.includes(id);
  const isDragging = (id: string) => activeWidget === id;

  // Inline field highlight style
  const fieldStyle = (id: string, color: string) => {
    const landed = isLanded(id);
    return {
      borderColor: landed ? color : 'transparent',
      background: landed ? `${color}08` : 'transparent',
      boxShadow: landed ? `0 0 0 2px ${color}20` : 'none',
    };
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Copy */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                REPLACES DOCUSIGN ($2,160/YEAR)
              </span>
            </div>

            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]" style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em'
            }}>
              Drag. Drop. Signed.
              <br />
              <span className="italic text-primary/80">In 3 minutes flat.</span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Watch fields land on a real contract. Names, dates, signatures — placed and filled automatically on your PDF.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                { icon: PenTool, text: "Drag & drop signature fields onto any PDF" },
                { icon: FileText, text: "Auto-fill names, dates, and signatures" },
                { icon: Send, text: "Instant email delivery to all signers" },
                { icon: Shield, text: "Legally binding in 180+ countries" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg text-foreground/80">{text}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="h-16 px-12 rounded-2xl text-lg">
              Start Signing Free
            </Button>
          </div>

          {/* RIGHT: PDF DOCUMENT WITH FIELDS */}
          <div className="relative">
            {/* ── FIELD TOOLBAR ── */}
            <div className="absolute -left-2 top-20 z-20 flex flex-col gap-3" style={{ width: '52px' }}>
              {fieldWidgets.map((widget) => {
                const Icon = widget.icon;
                const landed = isLanded(widget.id);
                const dragging = isDragging(widget.id);
                return (
                  <div
                    key={widget.id}
                    className="relative transition-all duration-500"
                    style={{
                      opacity: dragging ? 0.3 : landed ? 0.35 : 1,
                      transform: dragging ? 'scale(0.85)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="w-[52px] h-[52px] rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-300"
                      style={{
                        borderColor: landed ? 'hsl(var(--border))' : widget.color,
                        background: landed ? 'hsl(var(--muted))' : `${widget.color}10`,
                        boxShadow: !landed && !dragging ? `0 4px 16px ${widget.color}25` : 'none',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: landed ? 'hsl(var(--muted-foreground))' : widget.color }} />
                      <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: landed ? 'hsl(var(--muted-foreground))' : widget.color }}>
                        {widget.label.split(' ')[0]}
                      </span>
                    </div>
                    {landed && (
                      <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shadow-md" style={{ animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── FLYING WIDGET ── */}
            {activeWidget && (() => {
              const w = fieldWidgets.find(fw => fw.id === activeWidget);
              if (!w) return null;
              const Icon = w.icon;
              const idx = fieldWidgets.findIndex(fw => fw.id === activeWidget);
              const startTop = 80 + idx * 64;
              const targetOffsets: Record<string, number> = { firstName: 60, lastName: 80, date: 120, signature: 140 };
              return (
                <div
                  className="absolute z-30 pointer-events-none"
                  style={{
                    left: `${-2 + dragProgress * 72}px`,
                    top: `${startTop + dragProgress * (targetOffsets[activeWidget] - startTop + 80)}px`,
                    transform: `scale(${1 + dragProgress * 0.1}) rotate(${dragProgress * -2}deg)`,
                    opacity: 1,
                    transition: 'none',
                  }}
                >
                  <div
                    className="w-[52px] h-[52px] rounded-xl border-2 flex flex-col items-center justify-center gap-0.5"
                    style={{
                      borderColor: w.color,
                      background: `${w.color}18`,
                      boxShadow: `0 8px 32px ${w.color}40`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: w.color }} />
                    <span className="text-[7px] font-bold uppercase" style={{ color: w.color }}>
                      {w.label.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* ── PDF DOCUMENT ── */}
            <div className="ml-14 rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
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
                    <span className="text-[10px] font-medium text-white/50">sign.yourcompany.com</span>
                  </div>
                </div>
              </div>

              {/* Toolbar bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-semibold">Enterprise_Agreement.pdf</span>
                  {phase >= 1 && phase < 7 && (
                    <span className="text-[10px] text-primary flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Placing fields...
                    </span>
                  )}
                  {phase === 7 && (
                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Signed
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {fieldWidgets.map((w) => (
                    <div key={w.id} className="w-1.5 h-1.5 rounded-full transition-all duration-500" style={{
                      background: isLanded(w.id) ? 'hsl(142, 76%, 46%)' : 'hsl(var(--border))',
                    }} />
                  ))}
                </div>
              </div>

              {/* ── ACTUAL PDF CONTENT ── */}
              <div className="relative bg-white dark:bg-gray-50" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {/* Page shadow effect */}
                <div className="mx-3 my-3 bg-white shadow-lg border border-gray-200" style={{ minHeight: '520px' }}>
                  <div className="px-8 py-6">
                    {/* PDF Header - Company Logo Area */}
                    <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-gray-800">
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>ACME CORPORATION</p>
                        <p className="text-[9px] text-gray-500 mt-0.5" style={{ fontFamily: 'Arial, sans-serif' }}>1200 Innovation Drive, Suite 400 &bull; San Francisco, CA 94107</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>Doc ID: EA-2026-0847</p>
                        <p className="text-[9px] text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>Page 1 of 3</p>
                      </div>
                    </div>

                    {/* Document Title */}
                    <h3 className="text-center text-[16px] font-bold text-gray-900 mb-1 tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                      ENTERPRISE SOFTWARE LICENSE AGREEMENT
                    </h3>
                    <p className="text-center text-[9px] text-gray-500 mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                      Confidential — For Authorized Parties Only
                    </p>

                    {/* Contract Text - Section 1 */}
                    <p className="text-[10px] text-gray-700 leading-[1.6] mb-3">
                      This Enterprise Software License Agreement (&ldquo;Agreement&rdquo;) is entered into as of the date last
                      signed below, by and between <strong>Acme Corporation</strong>, a Delaware corporation with its
                      principal place of business at 1200 Innovation Drive, Suite 400, San Francisco, CA 94107
                      (&ldquo;Licensor&rdquo;), and the undersigned party (&ldquo;Licensee&rdquo;).
                    </p>

                    {/* Section 2 */}
                    <p className="text-[10px] font-bold text-gray-900 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                      1. GRANT OF LICENSE
                    </p>
                    <p className="text-[10px] text-gray-700 leading-[1.6] mb-3">
                      Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a
                      non-exclusive, non-transferable, worldwide license to use the Software and Documentation
                      for Licensee&apos;s internal business purposes. This license includes access for an unlimited
                      number of authorized users within Licensee&apos;s organization.
                    </p>

                    {/* Section 3 */}
                    <p className="text-[10px] font-bold text-gray-900 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                      2. TERM AND PAYMENT
                    </p>
                    <p className="text-[10px] text-gray-700 leading-[1.6] mb-4">
                      The license fee shall be a one-time payment of Twenty-Seven Dollars ($27.00 USD), granting
                      perpetual access to all current and future features of the Software. No recurring fees,
                      per-user charges, or hidden costs shall apply. Licensee acknowledges this replaces annual
                      enterprise agreements typically valued at $10,000–$15,000/year.
                    </p>

                    {/* ── SIGNER INFORMATION SECTION ── */}
                    <div className="border-t border-gray-300 pt-3 mt-2">
                      <p className="text-[10px] font-bold text-gray-900 mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
                        3. AUTHORIZED SIGNATORY
                      </p>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                        {/* First Name Field */}
                        <div>
                          <p className="text-[8px] text-gray-500 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>First Name</p>
                          <div
                            className="relative h-7 border-b-2 transition-all duration-500 flex items-end"
                            style={{
                              borderColor: isLanded("firstName") ? 'hsl(263, 84%, 57%)' : '#d1d5db',
                              background: isLanded("firstName") && !firstName ? 'hsla(263, 84%, 57%, 0.04)' : 'transparent',
                            }}
                          >
                            {firstName ? (
                              <span className="text-[13px] text-gray-900 pb-0.5 font-medium" style={{ fontFamily: 'Georgia, serif' }}>{firstName}</span>
                            ) : isLanded("firstName") ? (
                              <span className="w-0.5 h-4 bg-primary animate-pulse mb-0.5" />
                            ) : (
                              <span className="text-[9px] text-gray-300 pb-1 italic">Drop here</span>
                            )}
                            {firstName && (
                              <Check className="absolute right-0 bottom-1 w-3 h-3 text-green-500" style={{ animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} />
                            )}
                          </div>
                        </div>

                        {/* Last Name Field */}
                        <div>
                          <p className="text-[8px] text-gray-500 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>Last Name</p>
                          <div
                            className="relative h-7 border-b-2 transition-all duration-500 flex items-end"
                            style={{
                              borderColor: isLanded("lastName") ? 'hsl(280, 80%, 55%)' : '#d1d5db',
                              background: isLanded("lastName") && !lastName ? 'hsla(280, 80%, 55%, 0.04)' : 'transparent',
                            }}
                          >
                            {lastName ? (
                              <span className="text-[13px] text-gray-900 pb-0.5 font-medium" style={{ fontFamily: 'Georgia, serif' }}>{lastName}</span>
                            ) : isLanded("lastName") ? (
                              <span className="w-0.5 h-4 bg-purple-500 animate-pulse mb-0.5" />
                            ) : (
                              <span className="text-[9px] text-gray-300 pb-1 italic">Drop here</span>
                            )}
                            {lastName && (
                              <Check className="absolute right-0 bottom-1 w-3 h-3 text-green-500" style={{ animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date Field */}
                      <div className="mb-3">
                        <p className="text-[8px] text-gray-500 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>Date of Execution</p>
                        <div
                          className="relative h-7 border-b-2 transition-all duration-500 flex items-end max-w-[200px]"
                          style={{
                            borderColor: isLanded("date") ? 'hsl(217, 91%, 60%)' : '#d1d5db',
                            background: isLanded("date") && !dateValue ? 'hsla(217, 91%, 60%, 0.04)' : 'transparent',
                          }}
                        >
                          {dateValue ? (
                            <span className="text-[13px] text-gray-900 pb-0.5 font-medium" style={{ fontFamily: 'Georgia, serif' }}>{dateValue}</span>
                          ) : isLanded("date") ? (
                            <span className="w-0.5 h-4 bg-blue-500 animate-pulse mb-0.5" />
                          ) : (
                            <span className="text-[9px] text-gray-300 pb-1 italic">Drop here</span>
                          )}
                          {dateValue && (
                            <Check className="absolute right-0 bottom-1 w-3 h-3 text-green-500" style={{ animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} />
                          )}
                        </div>
                      </div>

                      {/* Legal text above signature */}
                      <p className="text-[9px] text-gray-600 leading-[1.5] mb-2 italic">
                        By signing below, I acknowledge that I have read, understand, and agree to be bound
                        by all terms and conditions set forth in this Enterprise Software License Agreement.
                      </p>

                      {/* Signature Field */}
                      <div className="mb-2">
                        <p className="text-[8px] text-gray-500 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>Authorized Signature</p>
                        <div
                          className="relative border-b-2 transition-all duration-500"
                          style={{
                            borderColor: isLanded("signature") ? 'hsl(340, 82%, 52%)' : '#d1d5db',
                            background: isLanded("signature") && !hasSignature ? 'hsla(340, 82%, 52%, 0.03)' : 'transparent',
                            minHeight: '60px',
                          }}
                        >
                          <canvas
                            ref={canvasRef}
                            className="w-full"
                            style={{
                              height: '60px',
                              display: isLanded("signature") ? 'block' : 'none',
                            }}
                          />
                          {!isLanded("signature") && (
                            <div className="flex items-center justify-center h-[60px]">
                              <span className="text-[9px] text-gray-300 italic">Drop signature here</span>
                            </div>
                          )}
                          {isLanded("signature") && !hasSignature && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[9px] text-pink-400 animate-pulse flex items-center gap-1">
                                <PenTool className="w-2.5 h-2.5" /> Signing...
                              </span>
                            </div>
                          )}
                          {hasSignature && (
                            <Check className="absolute right-0 bottom-1 w-3 h-3 text-green-500" style={{ animation: 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} />
                          )}
                        </div>
                      </div>

                      {/* Printed Name line */}
                      <div className="flex items-end gap-1 mb-1">
                        <p className="text-[8px] text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>Printed Name:</p>
                        <p className="text-[11px] text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                          {firstName && lastName ? `${firstName} ${lastName}` : ''}
                        </p>
                      </div>
                      <div className="flex items-end gap-1">
                        <p className="text-[8px] text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>Title:</p>
                        <p className="text-[11px] text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                          {firstName ? 'Chief Executive Officer' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Page footer */}
                  <div className="px-8 py-2 border-t border-gray-200 flex justify-between">
                    <p className="text-[7px] text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>Enterprise Software License Agreement — Confidential</p>
                    <p className="text-[7px] text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>Page 1 of 3</p>
                  </div>
                </div>

                {/* Submit / Success Overlay */}
                {phase >= 6 && (
                  <div className="absolute inset-0 flex items-center justify-center z-10" style={{
                    background: phase === 7 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
                    animation: 'fadeIn 0.3s ease-out',
                  }}>
                    {phase === 6 && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm font-semibold text-primary">Sending to john.smith@company.com...</p>
                      </div>
                    )}
                    {phase === 7 && (
                      <div className="flex flex-col items-center gap-4 text-center px-8" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30" style={{ animation: 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s both' }}>
                          <Check className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">Document Signed & Delivered!</p>
                          <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                            <Mail className="w-4 h-4" />
                            Email sent to john.smith@company.com
                          </p>
                        </div>
                        <div className="flex gap-6 mt-2">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Signed by</p>
                            <p className="text-sm font-semibold text-gray-800">John Smith</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-sm font-semibold text-gray-800">Feb 12, 2026</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
                            <p className="text-sm font-semibold text-green-600">Complete</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

export default SignatureDemo;
