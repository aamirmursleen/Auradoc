'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  HelpCircle,
  FileText,
  Building2,
  CheckCircle,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react'

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const contactOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
      availability: 'Business hours',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email for detailed inquiries',
      action: 'support@mamasign.com',
      availability: 'Response within 24 hours',
    },
    {
      icon: Phone,
      title: 'Request a Call',
      description: 'Submit a request and we\'ll call you back',
      action: 'Use form below',
      availability: 'Mon-Fri, 9AM-6PM EST',
    },
  ]

  const supportChannels = [
    { region: 'Americas', timezone: 'EST (UTC-5)', hours: 'Mon-Fri, 9AM-6PM' },
    { region: 'Europe', timezone: 'GMT (UTC+0)', hours: 'Mon-Fri, 9AM-6PM' },
    { region: 'Asia-Pacific', timezone: 'SGT (UTC+8)', hours: 'Mon-Fri, 9AM-6PM' },
  ]

  const faqs = [
    { question: 'How do I reset my password?', link: '/help/password-reset' },
    { question: 'How does the lifetime plan work?', link: '/help/lifetime-plan' },
    { question: 'How do I add team members?', link: '/help/team-members' },
    { question: 'Are e-signatures legally binding?', link: '/help/legal-validity' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Get in
              <span className="block mt-2 text-primary">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or need help? Our team is here to assist you. Reach out through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {contactOptions.map((option, index) => (
              <div key={index} className="p-8 bg-muted backdrop-blur-xl rounded-2xl text-center hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-border">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{option.title}</h3>
                <p className="text-muted-foreground mb-4">{option.description}</p>
                <p className="text-primary font-medium mb-2">{option.action}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {option.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-muted backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-border">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary font-medium hover:text-primary/80"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your Company"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Question</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-medium text-black bg-primary rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-300"
                    >
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Side Info */}
            <div className="space-y-8">
              {/* Quick Help */}
              <div className="bg-muted backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 text-primary mr-2" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Link
                      key={index}
                      href={faq.link}
                      className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-secondary transition-colors group"
                    >
                      <span className="text-muted-foreground group-hover:text-primary">{faq.question}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
                <Link href="/help" className="inline-flex items-center text-primary font-medium mt-6 hover:text-primary/80">
                  Visit Help Center
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* For Enterprise */}
              <div className="bg-muted rounded-2xl p-8 text-foreground border border-border">
                <Building2 className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">Enterprise Sales</h3>
                <p className="text-muted-foreground mb-6">
                  Looking for custom solutions for your organization? Our enterprise team can help with custom pricing, implementation, and support.
                </p>
                <Link href="/contact/enterprise" className="inline-flex items-center text-primary font-medium hover:text-primary/80">
                  Contact Enterprise Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Social Links */}
              <div className="bg-muted backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Global Support
            </h2>
            <p className="text-xl text-muted-foreground">
              We provide support across multiple time zones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="p-8 bg-muted backdrop-blur-xl rounded-2xl border border-border">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <span className="text-sm text-primary font-medium">{channel.timezone}</span>
                <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">{channel.region}</h3>
                <p className="text-muted-foreground">{channel.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
