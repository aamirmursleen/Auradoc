'use client'

import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Switched from DocuSign. Saved $14,000 in year one. Same features, zero regrets. The one-time payment is a game-changer.",
    name: "Sarah Chen",
    role: "VP Operations",
    company: "TechFlow Inc.",
    metric: "Saved $14,000/year",
    initials: "SC",
  },
  {
    quote: "ROI was 2 weeks. TWO WEEKS. We were paying DocuSign $180/month for 3 users. MamaSign gave us unlimited seats for $27 total.",
    name: "Michael Rodriguez",
    role: "CEO",
    company: "GrowthLabs",
    metric: "ROI in 2 weeks",
    initials: "MR",
  },
  {
    quote: "The custom branding alone justified the switch. Our clients see OUR brand, not 'Powered by MamaSign'. Feels premium.",
    name: "Emily Park",
    role: "Legal Director",
    company: "Innovate Corp",
    metric: "100% white-label",
    initials: "EP",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05]" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }} data-heading="heading-2 mb-4">Loved by teams everywhere.</h2>
          <p className="body-regular text-muted-foreground">
            4,891 teams switched from DocuSign this month
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="body-regular italic mb-6">"{t.quote}"</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                  </div>
                </div>
                <span className="inline-flex px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-xs font-semibold text-green-700 dark:text-green-400">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
