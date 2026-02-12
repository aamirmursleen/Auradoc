'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Check, FileText, Lock, Shield, Sparkles, Download
} from "lucide-react";

const experienceEntries = [
  {
    company: "Apple Inc.",
    role: "Lead Product Designer",
    dates: "2022 - Present",
    description: "Led redesign of Apple Music discovery experience, increasing engagement by 34%.",
  },
  {
    company: "Airbnb",
    role: "Senior UX Designer",
    dates: "2019 - 2022",
    description: "Designed the host onboarding flow used by 2M+ new hosts worldwide.",
  },
  {
    company: "Spotify",
    role: "Product Designer",
    dates: "2017 - 2019",
    description: "Shipped Wrapped campaign experience reaching 150M+ users annually.",
  },
];

const skillsList = [
  { label: "Product Strategy", color: "hsl(var(--primary))" },
  { label: "Figma", color: "hsl(340, 82%, 52%)" },
  { label: "User Research", color: "hsl(217, 91%, 60%)" },
  { label: "Design Systems", color: "hsl(160, 84%, 40%)" },
  { label: "Prototyping", color: "hsl(30, 90%, 50%)" },
  { label: "A/B Testing", color: "hsl(205, 80%, 55%)" },
];

const ResumeBuilder = () => {
  const [phase, setPhase] = useState(0);
  const [templateApplied, setTemplateApplied] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [visibleExperience, setVisibleExperience] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState(0);
  const [educationVisible, setEducationVisible] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const resetAll = useCallback(() => {
    setPhase(0);
    setTemplateApplied(false);
    setName("");
    setTitle("");
    setVisibleExperience(0);
    setVisibleSkills(0);
    setEducationVisible(false);
    setDownloadReady(false);
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
      }, 70);
      return interval;
    },
    []
  );

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

      setPhase(1);
      setTemplateApplied(true);
      await delay(900);
      if (cancelled) return;

      setPhase(2);
      await new Promise<void>((resolve) => {
        const int1 = typeText("Sarah Johnson", setName, resolve);
        intervals.push(int1);
      });
      if (cancelled) return;
      await delay(400);
      if (cancelled) return;

      setPhase(3);
      await new Promise<void>((resolve) => {
        const int2 = typeText("Senior Product Designer", setTitle, resolve);
        intervals.push(int2);
      });
      if (cancelled) return;
      await delay(500);
      if (cancelled) return;

      setPhase(4);
      for (let i = 1; i <= 3; i++) {
        await delay(600);
        if (cancelled) return;
        setVisibleExperience(i);
      }
      await delay(400);
      if (cancelled) return;

      setPhase(5);
      for (let i = 1; i <= 6; i++) {
        await delay(350);
        if (cancelled) return;
        setVisibleSkills(i);
      }
      await delay(400);
      if (cancelled) return;

      setPhase(6);
      setEducationVisible(true);
      await delay(800);
      if (cancelled) return;

      setPhase(7);
      setDownloadReady(true);
      await delay(3500);
      if (cancelled) return;

      setPhase(8);
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
  }, [resetAll, typeText]);

  const accentColor = templateApplied ? "hsl(var(--primary))" : "#d1d5db";

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT: Copy */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                REPLACES RESUME.IO ($99/YEAR)
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.03em",
              }}
            >
              Land interviews 93% faster.
              <br />
              <span className="italic text-primary/80">
                ATS-optimized. Recruiter-approved.
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              Recruiters spend 6 seconds on your resume. Our AI-designed
              templates make every second count. ATS-optimized to pass 97% of
              screening filters.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                {
                  icon: FileText,
                  text: "93% faster than building from scratch",
                },
                {
                  icon: Shield,
                  text: "ATS-optimized: passes 97% of screening",
                },
                {
                  icon: Sparkles,
                  text: "Designed by ex-Apple UX researchers",
                },
                {
                  icon: Download,
                  text: "One-click PDF export, print-ready",
                },
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
              Build Your Resume Free
            </Button>
          </div>

          {/* RIGHT: PDF Resume Mockup */}
          <div className="relative order-1 lg:order-2">
            <div className="rounded-2xl border border-border/60 bg-background shadow-2xl overflow-hidden">
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
                      Resume_SarahJohnson.pdf
                    </span>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-semibold">
                    Resume_SarahJohnson.pdf
                  </span>
                  {phase >= 1 && phase < 7 && (
                    <span className="text-[10px] text-primary flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 animate-pulse" />{" "}
                      Building...
                    </span>
                  )}
                  {phase === 7 && (
                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Ready
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground">
                    {templateApplied ? "Modern" : "Template"}
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      background: templateApplied
                        ? "hsl(142, 76%, 46%)"
                        : "hsl(var(--border))",
                    }}
                  />
                </div>
              </div>

              {/* PDF CONTENT */}
              <div
                className="relative bg-white dark:bg-gray-50"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                <div
                  className="mx-3 my-3 bg-white shadow-lg border border-gray-200"
                  style={{ minHeight: "560px" }}
                >
                  {/* Colored Accent Bar */}
                  <div
                    className="h-2 transition-all duration-700 ease-in-out"
                    style={{ background: accentColor }}
                  />

                  <div className="px-8 py-6">
                    {/* Header: Name + Title + Contact */}
                    <div className="mb-4 pb-3 border-b border-gray-300">
                      <div className="min-h-[28px]">
                        {name ? (
                          <h3
                            className="text-[22px] font-bold text-gray-900 tracking-wide"
                            style={{
                              fontFamily: 'Georgia, "Times New Roman", serif',
                            }}
                          >
                            {name}
                            {phase === 2 && (
                              <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5 align-middle" />
                            )}
                          </h3>
                        ) : (
                          <div className="h-6 w-48 bg-gray-100 rounded" />
                        )}
                      </div>
                      <div className="min-h-[20px] mt-1">
                        {title ? (
                          <p
                            className="text-[12px] font-medium uppercase tracking-widest"
                            style={{
                              color: templateApplied
                                ? "hsl(var(--primary))"
                                : "#6b7280",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            {title}
                            {phase === 3 && (
                              <span className="inline-block w-0.5 h-3 bg-primary animate-pulse ml-0.5 align-middle" />
                            )}
                          </p>
                        ) : (
                          <div className="h-4 w-36 bg-gray-100 rounded mt-1" />
                        )}
                      </div>
                      <p
                        className="text-[8px] text-gray-400 mt-2 tracking-wide"
                        style={{ fontFamily: "Arial, sans-serif" }}
                      >
                        sarah.johnson@email.com &bull; (415) 555-0192 &bull; San
                        Francisco, CA &bull; linkedin.com/in/sarahjohnson
                      </p>
                    </div>

                    {/* EXPERIENCE Section */}
                    <div className="mb-4">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b"
                        style={{
                          color: templateApplied
                            ? "hsl(var(--primary))"
                            : "#374151",
                          borderColor: templateApplied
                            ? "hsl(var(--primary))"
                            : "#d1d5db",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        Experience
                      </p>
                      <div className="space-y-2.5">
                        {experienceEntries.map((entry, idx) => (
                          <div
                            key={entry.company}
                            className="transition-all duration-500"
                            style={{
                              opacity: idx < visibleExperience ? 1 : 0,
                              transform:
                                idx < visibleExperience
                                  ? "translateY(0)"
                                  : "translateY(8px)",
                            }}
                          >
                            {idx < visibleExperience ? (
                              <div
                                style={{
                                  animation:
                                    "fadeIn 0.4s ease-out",
                                }}
                              >
                                <div className="flex items-baseline justify-between">
                                  <p
                                    className="text-[11px] font-bold text-gray-900"
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                    }}
                                  >
                                    {entry.role}
                                  </p>
                                  <p
                                    className="text-[8px] text-gray-400"
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                    }}
                                  >
                                    {entry.dates}
                                  </p>
                                </div>
                                <p
                                  className="text-[9px] font-medium mb-0.5"
                                  style={{
                                    color: templateApplied
                                      ? "hsl(var(--primary))"
                                      : "#6b7280",
                                    fontFamily: "Arial, sans-serif",
                                  }}
                                >
                                  {entry.company}
                                </p>
                                <p className="text-[9px] text-gray-600 leading-[1.5]">
                                  &bull; {entry.description}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="h-3 w-3/4 bg-gray-100 rounded" />
                                <div className="h-2 w-1/2 bg-gray-50 rounded" />
                                <div className="h-2 w-full bg-gray-50 rounded" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SKILLS Section */}
                    <div className="mb-4">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b"
                        style={{
                          color: templateApplied
                            ? "hsl(var(--primary))"
                            : "#374151",
                          borderColor: templateApplied
                            ? "hsl(var(--primary))"
                            : "#d1d5db",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsList.map((skill, idx) => (
                          <span
                            key={skill.label}
                            className="transition-all duration-300"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "8px",
                              fontWeight: 600,
                              fontFamily: "Arial, sans-serif",
                              letterSpacing: "0.03em",
                              opacity: idx < visibleSkills ? 1 : 0,
                              transform:
                                idx < visibleSkills
                                  ? "scale(1)"
                                  : "scale(0.5)",
                              background:
                                idx < visibleSkills
                                  ? `${skill.color}15`
                                  : "transparent",
                              color:
                                idx < visibleSkills
                                  ? skill.color
                                  : "transparent",
                              border:
                                idx < visibleSkills
                                  ? `1px solid ${skill.color}30`
                                  : "1px solid transparent",
                              animation:
                                idx < visibleSkills
                                  ? "popIn 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
                                  : "none",
                            }}
                          >
                            {skill.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* EDUCATION Section */}
                    <div className="mb-2">
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b"
                        style={{
                          color: templateApplied
                            ? "hsl(var(--primary))"
                            : "#374151",
                          borderColor: templateApplied
                            ? "hsl(var(--primary))"
                            : "#d1d5db",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        Education
                      </p>
                      <div
                        className="transition-all duration-500"
                        style={{
                          opacity: educationVisible ? 1 : 0,
                          transform: educationVisible
                            ? "translateY(0)"
                            : "translateY(8px)",
                        }}
                      >
                        {educationVisible ? (
                          <div
                            style={{
                              animation: "fadeIn 0.4s ease-out",
                            }}
                          >
                            <div className="flex items-baseline justify-between">
                              <p
                                className="text-[11px] font-bold text-gray-900"
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                }}
                              >
                                B.S. Human-Computer Interaction
                              </p>
                              <p
                                className="text-[8px] text-gray-400"
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                }}
                              >
                                2013 - 2017
                              </p>
                            </div>
                            <p
                              className="text-[9px] font-medium"
                              style={{
                                color: templateApplied
                                  ? "hsl(var(--primary))"
                                  : "#6b7280",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              Stanford University
                            </p>
                            <p className="text-[9px] text-gray-600 leading-[1.5]">
                              &bull; Summa Cum Laude, Dean&apos;s List all
                              semesters
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="h-3 w-2/3 bg-gray-100 rounded" />
                            <div className="h-2 w-1/3 bg-gray-50 rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Page footer */}
                  <div className="px-8 py-2 border-t border-gray-200 flex justify-between">
                    <p
                      className="text-[7px] text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Sarah Johnson &mdash; Resume
                    </p>
                    <p
                      className="text-[7px] text-gray-400"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Page 1 of 1
                    </p>
                  </div>
                </div>

                {/* Download Ready Overlay */}
                {phase === 7 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      animation: "fadeIn 0.3s ease-out",
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
                          Download Ready
                        </p>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                          <Download className="w-4 h-4" />
                          PDF Generated Successfully
                        </p>
                      </div>
                      <div className="flex gap-6 mt-2">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Template
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            Modern
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Sections
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            4 / 4
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            ATS Score
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            97%
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

export default ResumeBuilder;
