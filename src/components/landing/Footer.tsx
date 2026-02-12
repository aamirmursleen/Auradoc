'use client'

import { FileText, Mail, Phone, MapPin, ArrowUpRight, Linkedin, Github } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "E-Signatures", href: "#" },
    { label: "Resume Builder", href: "#" },
    { label: "Invoice Generator", href: "#" },
    { label: "Document Verification", href: "#" },
    { label: "Custom Domain", href: "#" },
    { label: "API Access", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#", badge: "Hiring" },
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Status Page", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Community", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container-main pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                MamaSign
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-[260px] mb-6">
              Enterprise-grade document signing, resume building, and invoicing — all for a one-time payment of $27.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@mamasign.com" className="flex items-center gap-2.5 text-sm opacity-50 hover:opacity-100 transition-opacity">
                <Mail className="w-4 h-4" />
                hello@mamasign.com
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2.5 text-sm opacity-50 hover:opacity-100 transition-opacity">
                <Phone className="w-4 h-4" />
                +1 (800) 123-4567
              </a>
              <span className="flex items-center gap-2.5 text-sm opacity-50">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] opacity-40 mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity inline-flex items-center gap-1.5"
                    >
                      {link.label}
                      {"badge" in link && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-main">
        <div className="border-t border-background/10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-40">
            © 2026 MamaSign. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" },
              { icon: ArrowUpRight, label: "Twitter / X" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-full border border-background/10 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-background/30 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
