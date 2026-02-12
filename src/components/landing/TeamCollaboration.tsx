'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Users, Shield, MessageSquare, Activity,
  Check, Eye, PenTool, MessageCircle,
} from "lucide-react";

// ─── TEAM MEMBER DEFINITIONS ─────────────────────────────────────
const members = [
  { name: "Sarah C.", initials: "SC", color: "hsl(263, 84%, 57%)", cursorColor: "hsl(263, 84%, 65%)" },
  { name: "Mike R.", initials: "MR", color: "hsl(217, 91%, 60%)", cursorColor: "hsl(217, 91%, 68%)" },
  { name: "Emily P.", initials: "EP", color: "hsl(142, 76%, 40%)", cursorColor: "hsl(142, 76%, 50%)" },
  { name: "James W.", initials: "JW", color: "hsl(34, 100%, 50%)", cursorColor: "hsl(34, 100%, 58%)" },
  { name: "Priya P.", initials: "PP", color: "hsl(340, 82%, 52%)", cursorColor: "hsl(340, 82%, 60%)" },
];

// ─── DOCUMENT LINES (simulated content) ──────────────────────────
const docLines = [
  { text: "Enterprise Agreement — Section 1", bold: true },
  { text: "This agreement is entered into as of the date last signed below..." },
  { text: "1. GRANT OF LICENSE" },
  { text: "Subject to the terms and conditions herein, the Licensor grants..." },
  { text: "2. PAYMENT TERMS" },
  { text: "A one-time fee of $27.00 applies to all seats." },
  { text: "3. TEAM ACCESS POLICY" },
  { text: "All authorized users within the organization may access the platform..." },
  { text: "4. CONFIDENTIALITY" },
  { text: "Both parties agree to maintain confidentiality of all shared materials..." },
  { text: "5. SIGNATURES" },
  { text: "The undersigned parties agree to all terms stated above." },
];

const TeamCollaboration = () => {
  const [phase, setPhase] = useState(0);
  const [visibleMembers, setVisibleMembers] = useState<number[]>([]);
  const [activities, setActivities] = useState<number[]>([]);
  const [cursorPositions, setCursorPositions] = useState<{ line: number; left: number; member: number }[]>([]);
  const [highlights, setHighlights] = useState<{ line: number; member: number }[]>([]);
  const [counterText, setCounterText] = useState("5 online");

  const resetAll = useCallback(() => {
    setPhase(0);
    setVisibleMembers([]);
    setActivities([]);
    setCursorPositions([]);
    setHighlights([]);
    setCounterText("5 online");
  }, []);

  // ─── MAIN ANIMATION LOOP ────────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;

    const delay = (ms: number) => new Promise<void>(resolve => {
      const t = setTimeout(resolve, ms);
      timeouts.push(t);
    });

    const runWorkflow = async () => {
      if (cancelled) return;
      resetAll();
      await delay(800);
      if (cancelled) return;

      // Phase 1: Team members join one by one
      setPhase(1);
      for (let i = 0; i < members.length; i++) {
        if (cancelled) return;
        setVisibleMembers(prev => [...prev, i]);
        await delay(350);
      }
      if (cancelled) return;
      await delay(400);

      // Phase 2: Sarah is editing — typing indicator
      setPhase(2);
      setActivities([0]);
      setCursorPositions([{ line: 7, left: 42, member: 0 }]);
      setHighlights([{ line: 7, member: 0 }]);
      await delay(1200);
      if (cancelled) return;

      // Phase 3: Cursor moves on document
      setPhase(3);
      setCursorPositions(prev => [...prev, { line: 3, left: 68, member: 1 }]);
      await delay(600);
      if (cancelled) return;

      // Phase 4: Mike left a comment
      setPhase(4);
      setActivities(prev => [...prev, 1]);
      setHighlights(prev => [...prev, { line: 3, member: 1 }]);
      await delay(1100);
      if (cancelled) return;

      // Phase 5: Emily approved
      setPhase(5);
      setActivities(prev => [...prev, 2]);
      await delay(1100);
      if (cancelled) return;

      // Phase 6: James is viewing
      setPhase(6);
      setActivities(prev => [...prev, 3]);
      setCursorPositions(prev => [...prev, { line: 9, left: 25, member: 3 }]);
      await delay(1100);
      if (cancelled) return;

      // Phase 7: Priya signed
      setPhase(7);
      setActivities(prev => [...prev, 4]);
      setHighlights(prev => [...prev, { line: 11, member: 4 }]);
      await delay(1200);
      if (cancelled) return;

      // Phase 8: Counter updates
      setPhase(8);
      setCounterText("5 members online | $0/seat");
      await delay(1500);
      if (cancelled) return;

      // Phase 9: Hold and reset
      setPhase(9);
      await delay(2000);
      if (cancelled) return;

      runWorkflow();
    };

    runWorkflow();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [resetAll]);

  // ─── ACTIVITY ITEM RENDERER ──────────────────────────────────────
  const renderActivity = (index: number) => {
    const configs = [
      {
        member: members[0],
        text: "is editing Section 3...",
        icon: null,
        typing: true,
      },
      {
        member: members[1],
        text: "left a comment on page 2",
        icon: <MessageCircle className="w-3 h-3 text-blue-400" />,
        typing: false,
      },
      {
        member: members[2],
        text: "approved the document",
        icon: <Check className="w-3 h-3 text-green-500" />,
        typing: false,
      },
      {
        member: members[3],
        text: "is viewing page 4",
        icon: <Eye className="w-3 h-3 text-amber-400" />,
        typing: false,
      },
      {
        member: members[4],
        text: "signed the document",
        icon: <PenTool className="w-3 h-3 text-pink-400" />,
        typing: false,
      },
    ];

    const config = configs[index];
    if (!config) return null;

    return (
      <div
        key={index}
        className="flex items-start gap-2.5 py-2 px-2.5 rounded-lg"
        style={{
          animation: 'fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: index === 2 ? 'hsla(142, 76%, 40%, 0.06)' : index === 4 ? 'hsla(340, 82%, 52%, 0.06)' : 'transparent',
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
          style={{ background: config.member.color }}
        >
          {config.member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] leading-snug">
            <span className="font-semibold text-foreground">{config.member.name}</span>{" "}
            <span className="text-muted-foreground">{config.text}</span>
            {config.typing && (
              <span className="inline-flex ml-1 gap-[2px] align-middle">
                <span className="w-1 h-1 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.2s infinite 0s' }} />
                <span className="w-1 h-1 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.2s infinite 0.2s' }} />
                <span className="w-1 h-1 rounded-full bg-primary/60" style={{ animation: 'typingDot 1.2s infinite 0.4s' }} />
              </span>
            )}
          </p>
          {config.icon && (
            <span className="inline-flex items-center gap-1 mt-0.5">
              {config.icon}
            </span>
          )}
          {index === 4 && (
            <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-pink-500 font-medium">
              <PenTool className="w-2.5 h-2.5" /> Completed
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Copy */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                DOCUSIGN CHARGES $50/USER/MO
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Your whole company.
              <br />
              For the price of
              <br />
              <span className="italic text-primary/80">one latte.</span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Add everyone. Sales, legal, HR, finance — unlimited seats, same $27. DocuSign would charge you $3,000/year for a 5-person team.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                { icon: Users, text: "Unlimited seats — no per-user pricing" },
                { icon: Shield, text: "Role-based permissions (Admin, Manager, Viewer)" },
                { icon: MessageSquare, text: "Real-time comments and @mentions" },
                { icon: Activity, text: "Live collaboration — see who's where" },
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
              Add Your Team Free
            </Button>
          </div>

          {/* RIGHT: COLLABORATION PANEL MOCKUP */}
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
              {/* ── HEADER BAR ── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-foreground">Team Workspace</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ animation: 'pulse-glow 2s infinite' }} />
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400 transition-all duration-500">
                      {counterText}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Member avatars — overlapping circles */}
                  <div className="flex -space-x-2">
                    {members.map((m, i) => (
                      <div
                        key={m.initials}
                        className="relative"
                        style={{
                          opacity: visibleMembers.includes(i) ? 1 : 0,
                          animation: visibleMembers.includes(i) ? 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
                          zIndex: members.length - i,
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-background"
                          style={{ background: m.color }}
                        >
                          {m.initials}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-primary/8 text-[10px] font-semibold text-primary uppercase tracking-wider">
                    Free
                  </div>
                </div>
              </div>

              {/* ── MAIN AREA: DOCUMENT PREVIEW + ACTIVITY SIDEBAR ── */}
              <div className="flex" style={{ minHeight: '420px' }}>
                {/* ── LEFT: MINI DOCUMENT PREVIEW ── */}
                <div className="flex-1 p-4 border-r border-border/30">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4 h-full relative overflow-hidden">
                    {/* Document header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/50">
                      <div className="w-3 h-3 rounded bg-primary/30" />
                      <div className="h-2 w-28 rounded-full bg-gray-300 dark:bg-gray-700" />
                      <div className="ml-auto h-2 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>

                    {/* Document lines with cursors and highlights */}
                    <div className="space-y-[6px]">
                      {docLines.map((line, lineIdx) => {
                        const highlight = highlights.find(h => h.line === lineIdx);
                        const cursor = cursorPositions.find(c => c.line === lineIdx);
                        const highlightMember = highlight ? members[highlight.member] : null;

                        return (
                          <div key={lineIdx} className="relative group">
                            {/* Highlight background */}
                            {highlightMember && (
                              <div
                                className="absolute inset-0 rounded-sm"
                                style={{
                                  background: `${highlightMember.color}12`,
                                  borderLeft: `2px solid ${highlightMember.color}`,
                                  animation: 'fadeIn 0.3s ease-out',
                                }}
                              />
                            )}

                            <div className="relative flex items-center px-1.5 py-0.5">
                              <span
                                className="text-[9px] leading-relaxed truncate"
                                style={{
                                  fontFamily: 'Georgia, "Times New Roman", serif',
                                  fontWeight: line.bold ? 600 : 400,
                                  color: line.bold
                                    ? 'hsl(var(--foreground))'
                                    : 'hsl(var(--muted-foreground))',
                                }}
                              >
                                {line.text}
                              </span>

                              {/* Animated cursor */}
                              {cursor && (
                                <div
                                  className="absolute top-0 flex flex-col items-center"
                                  style={{
                                    left: `${cursor.left}%`,
                                    animation: 'cursorAppear 0.3s ease-out',
                                  }}
                                >
                                  {/* Cursor flag */}
                                  <div
                                    className="px-1 py-[1px] rounded-t-sm text-[6px] font-bold text-white leading-none"
                                    style={{ background: members[cursor.member].cursorColor }}
                                  >
                                    {members[cursor.member].initials}
                                  </div>
                                  {/* Cursor line */}
                                  <div
                                    className="w-[1.5px] h-3"
                                    style={{
                                      background: members[cursor.member].cursorColor,
                                      animation: 'cursorBlink 1s step-end infinite',
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shimmer overlay during phase transitions */}
                    {phase >= 2 && phase <= 7 && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                        <div
                          className="absolute inset-0 opacity-[0.03]"
                          style={{
                            background: 'linear-gradient(90deg, transparent, white, transparent)',
                            animation: 'shimmer 3s infinite',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── RIGHT: ACTIVITY SIDEBAR ── */}
                <div className="w-[220px] p-3 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Activity</span>
                    <span className="text-[10px] text-muted-foreground">
                      {activities.length > 0 ? `${activities.length} event${activities.length > 1 ? 's' : ''}` : 'Waiting...'}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    {activities.length === 0 && phase >= 1 && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-[10px] text-muted-foreground/50 italic">Team members joining...</p>
                      </div>
                    )}
                    {activities.map((actIdx) => renderActivity(actIdx))}
                  </div>

                  {/* Bottom status bar */}
                  {phase >= 5 && (
                    <div
                      className="mt-3 pt-3 border-t border-border/30"
                      style={{ animation: 'fadeIn 0.4s ease-out' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                            {phase >= 7 ? 'All tasks complete' : 'In progress...'}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground">
                          {phase >= 7 ? '5/5' : `${activities.length}/5`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${(activities.length / 5) * 100}%`,
                            background: phase >= 7
                              ? 'hsl(142, 76%, 40%)'
                              : 'hsl(var(--primary))',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── BOTTOM STATUS BAR ── */}
              {phase >= 8 && (
                <div
                  className="flex items-center justify-between px-5 py-2.5 border-t border-border/40 bg-green-500/5"
                  style={{ animation: 'fadeIn 0.4s ease-out' }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Team fully synced
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      5 members online | $0/seat
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="px-2 py-0.5 rounded bg-green-500/10 text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                      Unlimited Plan
                    </div>
                  </div>
                </div>
              )}

              {/* Celebration overlay for Phase 7 */}
              {phase === 7 && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
                  style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{
                        background: members[i % members.length].color,
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                        animation: `celebrateDot 1.5s ease-out ${i * 0.1}s forwards`,
                        opacity: 0,
                      }}
                    />
                  ))}
                </div>
              )}
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
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cursorAppear {
          0% { opacity: 0; transform: scale(0.5) translateY(4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes celebrateDot {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0.5) translateY(-30px); }
        }
      `}</style>
    </section>
  );
};

export default TeamCollaboration;
