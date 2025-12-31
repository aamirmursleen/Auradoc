'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  Users,
  Settings,
  Mail,
  ArrowRight,
  Search,
  MessageCircle,
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  name: string
  icon: React.ElementType
  faqs: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    name: 'E-Signatures',
    icon: FileText,
    faqs: [
      {
        question: 'Are electronic signatures legally binding?',
        answer: 'Yes! Electronic signatures are legally recognized and enforceable in most countries worldwide, including the US (ESIGN Act), EU (eIDAS), UK, Canada, Australia, and many others. MamaSign e-signatures meet all legal requirements for electronic signatures and can be used for most business and personal documents.',
      },
      {
        question: 'What types of documents can I sign with MamaSign?',
        answer: 'You can sign virtually any document including contracts, agreements, NDAs, employment forms, rental agreements, invoices, purchase orders, and more. The only exceptions are documents that legally require wet signatures, such as wills, certain court documents, or specific government forms.',
      },
      {
        question: 'How do I create my signature?',
        answer: 'MamaSign offers three ways to create your signature: 1) Draw it using your mouse or touchscreen, 2) Type your name and choose from beautiful font styles, or 3) Upload an image of your existing signature. Your signature is saved securely for future use.',
      },
      {
        question: 'Can multiple people sign the same document?',
        answer: 'Yes! You can send documents to multiple signers. Each signer receives an email invitation and can sign in their preferred order. You can track the status of each signature in real-time.',
      },
      {
        question: 'How do I verify a signed document?',
        answer: 'Every document signed with MamaSign includes a unique verification code and digital certificate. You can verify any document using our Verify tool by entering the verification code or uploading the signed PDF.',
      },
    ],
  },
  {
    name: 'PDF Tools',
    icon: Settings,
    faqs: [
      {
        question: 'Are the PDF tools really free?',
        answer: 'Yes! All our PDF tools including PDF to Word, PDF compression, merge, split, watermark, and image to PDF are completely free to use. There are no hidden charges, no registration required, and no file limits for basic usage.',
      },
      {
        question: 'Are my files secure when using PDF tools?',
        answer: 'Absolutely! Your files are processed entirely in your browser and never uploaded to our servers. This means your documents stay private and secure on your device. Once you close the browser tab, all file data is cleared.',
      },
      {
        question: 'What file size limits apply to PDF tools?',
        answer: 'For free usage, each file can be up to 50MB. Pro users enjoy unlimited file sizes and batch processing capabilities. Large files may take longer to process depending on your device capabilities.',
      },
      {
        question: 'What PDF tools are available?',
        answer: 'We offer: PDF to Word conversion, Word to PDF, Image to PDF, PDF Compression, PDF Merge (combine multiple PDFs), PDF Split (separate pages), Watermark PDF, and our Signature Generator. More tools are being added regularly!',
      },
      {
        question: 'Why is my PDF to Word conversion not perfect?',
        answer: 'PDF to Word conversion works best with text-based PDFs. Scanned documents (image-based PDFs) may have limited text extraction. Complex layouts, tables, and special fonts may also affect conversion quality. For best results, use PDFs with selectable text.',
      },
    ],
  },
  {
    name: 'Security & Privacy',
    icon: Shield,
    faqs: [
      {
        question: 'How does MamaSign protect my documents?',
        answer: 'We use bank-level 256-bit AES encryption for all documents. Additionally, our PDF tools process files locally in your browser, so sensitive documents never leave your device. For cloud-stored documents, we use encrypted storage with strict access controls.',
      },
      {
        question: 'Is MamaSign GDPR compliant?',
        answer: 'Yes, MamaSign is fully GDPR compliant. We only collect necessary data, provide data export and deletion options, and never sell user data to third parties. You can request deletion of your account and all associated data at any time.',
      },
      {
        question: 'Who can access my signed documents?',
        answer: 'Only you and the people you explicitly share documents with can access them. Each document has unique access permissions. Team admins can set organization-wide access policies for business accounts.',
      },
      {
        question: 'How long are documents stored?',
        answer: 'Free accounts: Documents are stored for 30 days after signing. Pro accounts: Documents are stored indefinitely. Business accounts: Custom retention policies available. You can always download your documents before they expire.',
      },
    ],
  },
  {
    name: 'Pricing & Plans',
    icon: CreditCard,
    faqs: [
      {
        question: 'What features are free?',
        answer: 'Free accounts include: unlimited e-signatures for personal use, all PDF tools, 3 documents per month, basic templates, email support, and 30-day document storage. Perfect for individuals with occasional signing needs.',
      },
      {
        question: 'What does Pro include?',
        answer: 'Pro ($12/month) includes everything in Free plus: unlimited documents, custom branding, advanced templates, team collaboration (up to 5 users), priority support, unlimited document storage, and API access.',
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes! You can cancel your subscription at any time. Your Pro features remain active until the end of your billing period. After cancellation, your account reverts to the free plan, and you can still access your documents.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 14-day money-back guarantee for new subscriptions. If you are not satisfied with MamaSign Pro, contact us within 14 days of purchase for a full refund. No questions asked.',
      },
      {
        question: 'Are there discounts for annual billing?',
        answer: 'Yes! Annual billing saves you 20% compared to monthly billing. Pro annual is $115/year (equivalent to $9.58/month). Business plans also offer annual discounts.',
      },
    ],
  },
  {
    name: 'Teams & Business',
    icon: Users,
    faqs: [
      {
        question: 'How do I add team members?',
        answer: 'Go to Settings > Team Management > Invite Members. Enter their email addresses and select their role (Admin, Member, or Viewer). They will receive an invitation email to join your team.',
      },
      {
        question: 'Can I set different permissions for team members?',
        answer: 'Yes! You can assign roles with different permissions: Admins have full access, Members can create and sign documents, Viewers can only view documents. You can also create custom roles with specific permissions.',
      },
      {
        question: 'Do you offer enterprise plans?',
        answer: 'Yes! Our Business plan includes unlimited users, SSO/SAML authentication, dedicated account manager, custom integrations, SLA guarantees, and advanced security features. Contact our sales team for custom pricing.',
      },
      {
        question: 'Can I use my company branding?',
        answer: 'Pro and Business plans include custom branding options. Add your logo, brand colors, and custom email templates. Business plans also support white-label options with custom domains.',
      },
    ],
  },
]

function FAQAccordion({ faq, isOpen, onClick }: { faq: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-[#3a3a3a] last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-[#1e1e1e] transition-colors"
      >
        <span className="font-medium text-white pr-8">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="px-6 text-gray-300 leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('E-Signatures')
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleQuestion = (question: string) => {
    const newOpen = new Set(openQuestions)
    if (newOpen.has(question)) {
      newOpen.delete(question)
    } else {
      newOpen.add(question)
    }
    setOpenQuestions(newOpen)
  }

  // Filter FAQs based on search
  const filteredCategories = searchQuery
    ? faqData.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.faqs.length > 0)
    : faqData

  const currentCategory = filteredCategories.find(cat => cat.name === activeCategory) || filteredCategories[0]

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-[#c4ff0e]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-black/90 max-w-2xl mx-auto mb-8">
            Find answers to common questions about MamaSign, e-signatures, and PDF tools.
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-black/20 outline-none"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {searchQuery ? (
            // Search Results View
            <div>
              <p className="text-gray-300 mb-8">
                Found {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} results for &quot;{searchQuery}&quot;
              </p>
              {filteredCategories.length > 0 ? (
                <div className="space-y-8">
                  {filteredCategories.map((category) => (
                    <div key={category.name}>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <category.icon className="w-5 h-5 text-[#c4ff0e]" />
                        {category.name}
                      </h3>
                      <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] overflow-hidden">
                        {category.faqs.map((faq) => (
                          <FAQAccordion
                            key={faq.question}
                            faq={faq}
                            isOpen={openQuestions.has(faq.question)}
                            onClick={() => toggleQuestion(faq.question)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-300 mb-4">No results found. Try a different search term.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#c4ff0e] font-medium hover:text-[#b3e60d]"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Category View
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] p-4 sticky top-24">
                  <h3 className="font-semibold text-white mb-4">Categories</h3>
                  <nav className="space-y-1">
                    {faqData.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setActiveCategory(category.name)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeCategory === category.name
                            ? 'bg-[#c4ff0e]/20 text-[#c4ff0e] font-medium'
                            : 'text-gray-300 hover:bg-[#1e1e1e]'
                        }`}
                      >
                        <category.icon className="w-5 h-5" />
                        {category.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* FAQ List */}
              <div className="lg:col-span-3">
                {currentCategory && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-[#c4ff0e]/20 rounded-xl flex items-center justify-center">
                        <currentCategory.icon className="w-6 h-6 text-[#c4ff0e]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{currentCategory.name}</h2>
                        <p className="text-gray-300">{currentCategory.faqs.length} questions</p>
                      </div>
                    </div>

                    <div className="bg-[#252525] rounded-xl border border-[#2a2a2a] overflow-hidden">
                      {currentCategory.faqs.map((faq) => (
                        <FAQAccordion
                          key={faq.question}
                          faq={faq}
                          isOpen={openQuestions.has(faq.question)}
                          onClick={() => toggleQuestion(faq.question)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help? */}
      <section className="py-20 px-4 bg-[#1e1e1e]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#c4ff0e] rounded-2xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">
              Still have questions?
            </h2>
            <p className="text-black/90 mb-8 max-w-lg mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-[#c4ff0e] font-semibold rounded-xl hover:shadow-xl transition-all"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black/10 backdrop-blur-sm text-black font-semibold rounded-xl hover:bg-black/20 transition-all"
              >
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
