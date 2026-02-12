'use client'

import { useState } from "react";
import { Check, X, Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { name: "Price", mama: "$27 once", docu: "$10,000/year" },
  { name: "Setup time", mama: "2 minutes", docu: "2 weeks" },
  { name: "Unlimited signatures", mama: true, docu: true },
  { name: "Team seats", mama: "Unlimited free", docu: "$50/user/mo" },
  { name: "Custom domain", mama: true, docu: "$200/mo extra" },
  { name: "White-label", mama: true, docu: "Enterprise only" },
  { name: "API access", mama: true, docu: "$500/mo extra" },
  { name: "Resume builder", mama: true, docu: false },
  { name: "Invoice generator", mama: true, docu: false },
  { name: "Document verification", mama: true, docu: "$$$" },
];

const PricingComparison = () => {
  const [monthlySpend, setMonthlySpend] = useState(180); // Default DocuSign price
  const yearlySpend = monthlySpend * 12;
  const fiveYearSpend = yearlySpend * 5;
  const savings = fiveYearSpend - 27;

  const renderCell = (value: string | boolean) => {
    if (value === true) return <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />;
    if (value === false) return <X className="w-5 h-5 text-destructive/50 mx-auto" />;
    return <span>{value}</span>;
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main text-center">
        <h2 className="text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.05]" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }} data-heading="heading-2 mb-4">Pay $27 once. Not $10,000/year.</h2>
        <p className="body-regular text-muted-foreground mb-16 max-w-2xl mx-auto">
          DocuSign Enterprise: $10,000/year. HelloSign Business: $3,600/year. Adobe Sign: $2,400/year.
          MamaSign: <strong className="text-foreground">$27. Once. Lifetime.</strong>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full max-w-3xl mx-auto text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 pr-4 text-sm font-semibold text-muted-foreground">Feature</th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-primary">MamaSign</span>
                    <span className="text-xs text-muted-foreground">$27 lifetime</span>
                  </div>
                </th>
                <th className="py-4 pl-4 text-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-muted-foreground">DocuSign</span>
                    <span className="text-xs text-destructive">$10,000/year</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.name} className="border-b border-border/50">
                  <td className="py-4 pr-4 text-sm font-medium">{f.name}</td>
                  <td className="py-4 px-4 text-center text-sm font-semibold text-green-600 dark:text-green-400">
                    {renderCell(f.mama)}
                  </td>
                  <td className="py-4 pl-4 text-center text-sm text-muted-foreground">
                    {renderCell(f.docu)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INTERACTIVE ROI CALCULATOR - ENTERPRISE UPGRADE #2 */}
        <div className="mt-16 p-8 rounded-2xl bg-primary/5 border-2 border-primary/20 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <h3 className="heading-3">Calculate your savings</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              What do you currently pay per month for e-signatures?
            </label>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">$</span>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
                className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <span className="text-3xl font-black text-primary w-32 text-right">
                ${monthlySpend}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 p-6 rounded-xl bg-background/50 border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Year 1 Savings</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">
                ${(yearlySpend - 27).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">5-Year Savings</p>
              <p className="text-3xl font-black text-green-600 dark:text-green-400">
                ${savings.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-black text-primary flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5" />
                {Math.round((savings / 27) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-8 rounded-2xl bg-card border border-border max-w-2xl mx-auto">
          <p className="heading-3 mb-2">Save $9,973 in year one.</p>
          <p className="body-regular text-muted-foreground mb-6">
            Save $49,973 over 5 years. That's enough to hire a developer, run ad campaigns, or actually grow your business.
          </p>
          <Button variant="hero" size="lg" className="h-14 px-10 rounded-xl text-base">
            Get Enterprise Access — $27
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;
