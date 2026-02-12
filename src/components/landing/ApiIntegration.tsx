'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Terminal, BookOpen } from "lucide-react";

// ─── CODE SAMPLES PER LANGUAGE ──────────────────────────────────
const codeSamples: Record<string, string> = {
  JavaScript: `const response = await fetch(
  'https://api.auradoc.com/v1/documents',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk_live_...a7f3',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signer: 'john@acme.com',
      template: 'enterprise-nda',
      deadline: '2026-02-15'
    })
  }
);`,
  Python: `import requests

response = requests.post(
    'https://api.auradoc.com/v1/documents',
    headers={
        'Authorization': 'Bearer sk_live_...a7f3',
        'Content-Type': 'application/json'
    },
    json={
        'signer': 'john@acme.com',
        'template': 'enterprise-nda',
        'deadline': '2026-02-15'
    }
)`,
  cURL: `curl -X POST \\
  https://api.auradoc.com/v1/documents \\
  -H 'Authorization: Bearer sk_live_...a7f3' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "signer": "john@acme.com",
    "template": "enterprise-nda",
    "deadline": "2026-02-15"
  }'`,
};

const tabOrder: string[] = ["JavaScript", "Python", "cURL"];

// ─── JSON RESPONSE (rendered with syntax highlighting) ──────────
const responseLines = [
  '{',
  '  "status": "sent",',
  '  "document_id": "doc_8a7f3b2c",',
  '  "signer": "john@acme.com",',
  '  "signing_url": "https://sign.auradoc.com/s/8a7f3b2c",',
  '  "expires_at": "2026-02-15T00:00:00Z"',
  '}',
];

// Syntax-highlight a single JSON line
const highlightJsonLine = (line: string, idx: number) => {
  const keyColor = '#7dd3fc';
  const stringColor = '#86efac';
  const punctuationColor = '#94a3b8';

  // Pure braces
  if (line.trim() === '{' || line.trim() === '}') {
    return <span key={idx} style={{ color: punctuationColor }}>{line}</span>;
  }

  // Key-value lines
  const match = line.match(/^(\s*)"([^"]+)":\s*"([^"]*)"(,?)$/);
  if (match) {
    const [, indent, key, value, comma] = match;
    return (
      <span key={idx}>
        <span>{indent}</span>
        <span style={{ color: punctuationColor }}>&quot;</span>
        <span style={{ color: keyColor }}>{key}</span>
        <span style={{ color: punctuationColor }}>&quot;</span>
        <span style={{ color: punctuationColor }}>: </span>
        <span style={{ color: punctuationColor }}>&quot;</span>
        <span style={{ color: stringColor }}>{value}</span>
        <span style={{ color: punctuationColor }}>&quot;</span>
        <span style={{ color: punctuationColor }}>{comma}</span>
      </span>
    );
  }

  return <span key={idx} style={{ color: punctuationColor }}>{line}</span>;
};

// ─── COMPONENT ──────────────────────────────────────────────────
const ApiIntegration = () => {
  const [activeTab, setActiveTab] = useState("JavaScript");
  const [typedCode, setTypedCode] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [visibleResponseLines, setVisibleResponseLines] = useState<number>(0);
  const [showStatus, setShowStatus] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  const resetAll = useCallback(() => {
    setTypedCode("");
    setShowSpinner(false);
    setVisibleResponseLines(0);
    setShowStatus(false);
    setCursorVisible(true);
    setPhase(0);
  }, []);

  // ─── MAIN ANIMATION LOOP ────────────────────────────────────
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: ReturnType<typeof setInterval>[] = [];
    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timeouts.push(t);
      });

    const typeCode = (code: string): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (cancelled) {
            clearInterval(interval);
            return;
          }
          if (i < code.length) {
            i++;
            setTypedCode(code.substring(0, i));
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 30);
        intervals.push(interval);
      });
    };

    const showResponseLines = (): Promise<void> => {
      return new Promise((resolve) => {
        let line = 0;
        const interval = setInterval(() => {
          if (cancelled) {
            clearInterval(interval);
            return;
          }
          line++;
          setVisibleResponseLines(line);
          if (line >= responseLines.length) {
            clearInterval(interval);
            resolve();
          }
        }, 120);
        intervals.push(interval);
      });
    };

    const runLanguageCycle = async (lang: string) => {
      if (cancelled) return;

      // Switch to the tab
      setActiveTab(lang);
      resetAll();
      setPhase(0);

      // Phase 0: cursor blinks, terminal visible
      await delay(800);
      if (cancelled) return;

      // Phase 1: type code
      setPhase(1);
      await typeCode(codeSamples[lang]);
      if (cancelled) return;

      // Phase 2: "enter" — spinner
      setPhase(2);
      setShowSpinner(true);
      await delay(1500);
      if (cancelled) return;
      setShowSpinner(false);

      // Phase 3: JSON response appears line by line
      setPhase(3);
      await showResponseLines();
      if (cancelled) return;

      // Phase 4: status line
      setPhase(4);
      setShowStatus(true);
      await delay(400);
      if (cancelled) return;

      // Phase 5: hold
      setPhase(5);
      await delay(2000);
      if (cancelled) return;
    };

    const runWorkflow = async () => {
      while (!cancelled) {
        for (const lang of tabOrder) {
          if (cancelled) return;
          await runLanguageCycle(lang);
        }
      }
    };

    runWorkflow();

    // Blinking cursor interval
    const cursorInterval = setInterval(() => {
      if (!cancelled) {
        setCursorVisible((prev) => !prev);
      }
    }, 530);
    intervals.push(cursorInterval);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [resetAll]);

  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* ── LEFT SIDE: COPY ── */}
          <div>
            <div className="inline-flex items-center rounded-full bg-primary/8 px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                47 API ENDPOINTS &bull; WEBHOOKS IN &lt;100MS
              </span>
            </div>

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-normal mb-10 leading-[1.05]"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.03em',
              }}
            >
              Ship document signing tonight.
              <br />
              <span className="italic text-primary/80">Not next quarter.</span>
            </h2>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
              14 lines of code. That&apos;s all it takes. Our REST API handles the
              complexity — you focus on your product. SDKs for every major
              language.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                { icon: Code2, text: "14 lines to send your first document" },
                { icon: Zap, text: "Webhooks fire in <100ms" },
                { icon: Terminal, text: "SDKs for JavaScript, Python, Ruby, Go" },
                { icon: BookOpen, text: "Interactive API docs with live testing" },
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
              Read the Docs
            </Button>
          </div>

          {/* ── RIGHT SIDE: TERMINAL ── */}
          <div
            className="rounded-2xl border border-white/[0.06] shadow-2xl overflow-hidden"
            style={{ background: '#0d1117' }}
          >
            {/* Terminal header bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
              style={{ background: '#161b22' }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              <div className="flex-1 text-center">
                <span
                  className="text-xs font-medium"
                  style={{ color: '#8b949e', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                >
                  Terminal — bash
                </span>
              </div>
            </div>

            {/* Tab bar */}
            <div
              className="flex border-b border-white/[0.06]"
              style={{ background: '#0d1117' }}
            >
              {tabOrder.map((lang) => (
                <button
                  key={lang}
                  className="relative px-5 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    color: activeTab === lang ? '#e6edf3' : '#8b949e',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                    background: activeTab === lang ? '#161b22' : 'transparent',
                  }}
                >
                  {lang}
                  {activeTab === lang && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: '#58a6ff' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Terminal body */}
            <div
              className="p-5 overflow-x-auto"
              style={{
                minHeight: '420px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {/* Prompt + typed code */}
              <div className="mb-1">
                <span style={{ color: '#7ee787' }}>$ </span>
                <span style={{ color: '#c9d1d9', whiteSpace: 'pre-wrap' }}>
                  {typedCode}
                </span>
                {(phase === 0 || phase === 1) && (
                  <span
                    className="terminal-cursor"
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: cursorVisible ? '#58a6ff' : 'transparent',
                      verticalAlign: 'text-bottom',
                      marginLeft: '1px',
                    }}
                  />
                )}
              </div>

              {/* Spinner / loading */}
              {showSpinner && (
                <div
                  className="flex items-center gap-2 mt-3"
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#58a6ff', borderTopColor: 'transparent' }}
                  />
                  <span style={{ color: '#8b949e', fontSize: '12px' }}>
                    Sending request...
                  </span>
                </div>
              )}

              {/* JSON Response */}
              {phase >= 3 && visibleResponseLines > 0 && (
                <div className="mt-3" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                  <span
                    style={{
                      color: '#8b949e',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Response:
                  </span>
                  <pre className="mt-1" style={{ margin: 0 }}>
                    {responseLines.slice(0, visibleResponseLines).map((line, i) => (
                      <div
                        key={i}
                        style={{ animation: 'fadeIn 0.15s ease-out' }}
                      >
                        {highlightJsonLine(line, i)}
                      </div>
                    ))}
                  </pre>
                </div>
              )}

              {/* Status line */}
              {showStatus && (
                <div
                  className="flex items-center gap-2 mt-4 pt-3"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    animation: 'popIn 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  }}
                >
                  <span style={{ color: '#28c840', fontSize: '13px' }}>
                    &#10003; 200 OK
                  </span>
                  <span style={{ color: '#484f58', fontSize: '13px' }}>—</span>
                  <span style={{ color: '#8b949e', fontSize: '13px' }}>142ms</span>
                </div>
              )}
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
        .terminal-cursor {
          animation: blink 1.06s step-end infinite;
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
      `}</style>
    </section>
  );
};

export default ApiIntegration;
