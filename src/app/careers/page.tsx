'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Zap,
  Globe,
  Users,
  Coffee,
  Laptop,
  Plane,
  DollarSign,
  GraduationCap,
  Star,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react'

const CareersPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedJob, setExpandedJob] = useState<number | null>(null)

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage for you and your family' },
    { icon: DollarSign, title: 'Competitive Pay', description: 'Top-of-market salary, equity, and performance bonuses' },
    { icon: Laptop, title: 'Remote First', description: 'Work from anywhere in the world with flexible hours' },
    { icon: Plane, title: 'Unlimited PTO', description: 'Take the time you need to rest and recharge' },
    { icon: GraduationCap, title: 'Learning Budget', description: '$2,000 annual budget for courses, books, and conferences' },
    { icon: Coffee, title: 'Home Office', description: '$1,500 stipend to set up your perfect workspace' },
    { icon: Users, title: 'Team Events', description: 'Annual retreats and regular virtual team activities' },
    { icon: Star, title: '401(k) Match', description: 'We match 4% of your salary for retirement savings' },
  ]

  const departments = [
    { id: 'all', name: 'All Departments', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 5 },
    { id: 'product', name: 'Product', count: 2 },
    { id: 'design', name: 'Design', count: 2 },
    { id: 'sales', name: 'Sales', count: 2 },
    { id: 'marketing', name: 'Marketing', count: 1 },
  ]

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'engineering',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$150k - $200k',
      description: 'Build beautiful, performant user interfaces for our e-signature platform. Work with React, TypeScript, and modern web technologies.',
      requirements: [
        '5+ years of frontend development experience',
        'Expert knowledge of React and TypeScript',
        'Experience with design systems and component libraries',
        'Strong understanding of web performance optimization',
      ],
    },
    {
      id: 2,
      title: 'Backend Engineer',
      department: 'engineering',
      location: 'Remote (US/EU)',
      type: 'Full-time',
      salary: '$140k - $180k',
      description: 'Design and build scalable backend systems that power millions of document signatures. Work with Node.js, PostgreSQL, and cloud infrastructure.',
      requirements: [
        '4+ years of backend development experience',
        'Proficiency in Node.js or similar backend technologies',
        'Experience with relational databases and SQL',
        'Knowledge of cloud services (AWS, GCP, or Azure)',
      ],
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'Remote (Global)',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Manage our cloud infrastructure and ensure 99.99% uptime. Build CI/CD pipelines and implement security best practices.',
      requirements: [
        '3+ years of DevOps/SRE experience',
        'Experience with Kubernetes and Docker',
        'Knowledge of Infrastructure as Code (Terraform)',
        'Understanding of security and compliance requirements',
      ],
    },
    {
      id: 4,
      title: 'Security Engineer',
      department: 'engineering',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$150k - $190k',
      description: 'Protect our customers\' sensitive documents. Lead security initiatives, conduct audits, and implement security controls.',
      requirements: [
        '5+ years of security engineering experience',
        'Experience with SOC 2, GDPR, and HIPAA compliance',
        'Knowledge of application security best practices',
        'Strong background in cryptography and encryption',
      ],
    },
    {
      id: 5,
      title: 'Staff Engineer',
      department: 'engineering',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$200k - $250k',
      description: 'Technical leadership role driving architecture decisions and mentoring engineers. Shape the future of our platform.',
      requirements: [
        '8+ years of software engineering experience',
        'Track record of leading large technical projects',
        'Experience with distributed systems at scale',
        'Strong communication and mentoring skills',
      ],
    },
    {
      id: 6,
      title: 'Product Manager',
      department: 'product',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$140k - $180k',
      description: 'Own the roadmap for key product areas. Work closely with engineering, design, and customers to deliver great features.',
      requirements: [
        '4+ years of product management experience',
        'Experience with B2B SaaS products',
        'Strong analytical and communication skills',
        'Track record of shipping successful products',
      ],
    },
    {
      id: 7,
      title: 'Technical Product Manager',
      department: 'product',
      location: 'Remote (US/EU)',
      type: 'Full-time',
      salary: '$150k - $190k',
      description: 'Lead our API and developer platform. Define the vision for how developers integrate with MamaSign.',
      requirements: [
        '5+ years of technical product management',
        'Software engineering background preferred',
        'Experience with developer-focused products',
        'Understanding of API design and documentation',
      ],
    },
    {
      id: 8,
      title: 'Senior Product Designer',
      department: 'design',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Design intuitive experiences that make document signing delightful. Own the end-to-end design process.',
      requirements: [
        '5+ years of product design experience',
        'Strong portfolio showcasing B2B product work',
        'Proficiency in Figma and design systems',
        'Experience with user research and testing',
      ],
    },
    {
      id: 9,
      title: 'UX Researcher',
      department: 'design',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$110k - $140k',
      description: 'Understand our users deeply and translate insights into product improvements. Lead research initiatives.',
      requirements: [
        '3+ years of UX research experience',
        'Experience with qualitative and quantitative methods',
        'Strong presentation and storytelling skills',
        'Background in SaaS or enterprise software',
      ],
    },
    {
      id: 10,
      title: 'Account Executive',
      department: 'sales',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$80k - $120k + Commission',
      description: 'Drive new business by selling MamaSign to mid-market and enterprise companies. Manage full sales cycle.',
      requirements: [
        '3+ years of B2B SaaS sales experience',
        'Track record of meeting/exceeding quota',
        'Experience with consultative selling',
        'Strong presentation and negotiation skills',
      ],
    },
    {
      id: 11,
      title: 'Sales Development Rep',
      department: 'sales',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$50k - $70k + Commission',
      description: 'Generate qualified leads for our sales team. Perfect role to start your career in SaaS sales.',
      requirements: [
        '1+ years of SDR or sales experience',
        'Excellent communication skills',
        'Self-motivated and goal-oriented',
        'Interest in growing into an AE role',
      ],
    },
    {
      id: 12,
      title: 'Content Marketing Manager',
      department: 'marketing',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Create compelling content that educates and converts. Own our blog, guides, and thought leadership.',
      requirements: [
        '4+ years of content marketing experience',
        'Excellent writing and editing skills',
        'Experience with SEO and content strategy',
        'Background in B2B technology marketing',
      ],
    },
  ]

  const filteredJobs = jobs.filter(job =>
    activeCategory === 'all' || job.department === activeCategory
  )

  const values = [
    { icon: Zap, title: 'Move Fast', description: 'We ship quickly and iterate based on feedback' },
    { icon: Users, title: 'Customer Obsessed', description: 'Every decision starts with the customer' },
    { icon: Heart, title: 'Care Deeply', description: 'We care about our work, team, and community' },
    { icon: Globe, title: 'Think Global', description: 'We build for users everywhere in the world' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/50 mb-6">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">We're Hiring!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Build the Future of
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Document Signing
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join our remote-first team and help millions of people sign documents faster. We're looking for passionate people to grow with us.
            </p>
            <a href="#jobs" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-300">
              The principles that guide how we work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Benefits & Perks
            </h2>
            <p className="text-xl text-gray-300">
              We take care of our team so they can do their best work
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-300">
              Find your next opportunity
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveCategory(dept.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === dept.id
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                }`}
              >
                {dept.name} ({dept.count})
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/careers/${job.id}/apply`}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply Now
                      </Link>
                      {expandedJob === job.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedJob === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-700/50">
                    <div className="pt-6">
                      <p className="text-gray-300 mb-6">{job.description}</p>
                      <h4 className="font-semibold text-white mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start text-gray-300">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll reach out when we have a role that matches your skills.
          </p>
          <Link href="/careers/general" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300">
            Submit General Application
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default CareersPage
