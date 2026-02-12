'use client'

const logos = [
  "Figma", "Vercel", "OpenAI", "Stripe", "Linear", "Notion", "Slack", "Shopify"
];

const TrustedBy = () => {
  // INFINITE SCROLL CAROUSEL - ENTERPRISE UPGRADE #5
  const allLogos = [...logos, ...logos, ...logos]; // Triple for seamless loop

  return (
    <section className="section-padding-sm bg-section-alt overflow-hidden">
      <div className="container-main">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-10">
          Trusted by 4,891+ teams at
        </p>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Fade masks on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-section-alt to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-section-alt to-transparent z-10" />

          {/* Scrolling logos */}
          <div className="flex gap-16 animate-infinite-scroll">
            {allLogos.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center justify-center min-w-[140px] group"
              >
                <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-all duration-300 select-none whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedBy;
