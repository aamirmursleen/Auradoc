'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  Settings,
  Bell,
  Clock,
  Shield,
  User,
  Save,
  Loader2,
  CheckCircle2,
  Mail,
  Eye,
  FileSignature
} from 'lucide-react'

interface UserPreferences {
  emailNotificationsEnabled: boolean
  notifyOnView: boolean
  notifyOnSign: boolean
  notifyOnComplete: boolean
  defaultReminderEnabled: boolean
  defaultReminderIntervalDays: number
  defaultExpirationDays: number | null
  companyName: string
  companyLogo: string
}

const defaultPreferences: UserPreferences = {
  emailNotificationsEnabled: true,
  notifyOnView: true,
  notifyOnSign: true,
  notifyOnComplete: true,
  defaultReminderEnabled: true,
  defaultReminderIntervalDays: 3,
  defaultExpirationDays: null,
  companyName: '',
  companyLogo: '',
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'notifications' | 'signing' | 'profile'>('notifications')

  // Load preferences from localStorage (will migrate to Supabase later)
  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(`mamasign_prefs_${user.id}`)
    if (stored) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(stored) })
      } catch {}
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      // Save to localStorage for now
      localStorage.setItem(`mamasign_prefs_${user.id}`, JSON.stringify(preferences))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const updatePref = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted-foreground">Please sign in to access settings</p>
      </div>
    )
  }

  const sections = [
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'signing' as const, label: 'Signing Defaults', icon: FileSignature },
    { id: 'profile' as const, label: 'Company Profile', icon: User },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and account settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Email Notifications
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Configure when you receive email notifications</p>
              </div>
              <div className="p-6 space-y-6">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Email notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about your documents</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePref('emailNotificationsEnabled', !preferences.emailNotificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.emailNotificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                {preferences.emailNotificationsEnabled && (
                  <>
                    <div className="ml-8 space-y-4 border-l-2 border-border pl-6">
                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            Document viewed
                          </p>
                          <p className="text-sm text-muted-foreground">When a signer opens your document</p>
                        </div>
                        <button
                          onClick={() => updatePref('notifyOnView', !preferences.notifyOnView)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.notifyOnView ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.notifyOnView ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <FileSignature className="w-4 h-4 text-muted-foreground" />
                            Document signed
                          </p>
                          <p className="text-sm text-muted-foreground">When a signer completes their signature</p>
                        </div>
                        <button
                          onClick={() => updatePref('notifyOnSign', !preferences.notifyOnSign)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.notifyOnSign ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.notifyOnSign ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                            Document completed
                          </p>
                          <p className="text-sm text-muted-foreground">When all signers have completed signing</p>
                        </div>
                        <button
                          onClick={() => updatePref('notifyOnComplete', !preferences.notifyOnComplete)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.notifyOnComplete ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.notifyOnComplete ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Signing Defaults Section */}
          {activeSection === 'signing' && (
            <div className="bg-white rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-primary" />
                  Signing Defaults
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Default settings for new signing requests</p>
              </div>
              <div className="p-6 space-y-6">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Auto-reminders</p>
                      <p className="text-sm text-muted-foreground">Automatically remind pending signers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePref('defaultReminderEnabled', !preferences.defaultReminderEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.defaultReminderEnabled ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.defaultReminderEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                {preferences.defaultReminderEnabled && (
                  <div className="ml-8 border-l-2 border-border pl-6">
                    <label className="block">
                      <p className="text-sm font-medium text-foreground mb-2">Reminder interval (days)</p>
                      <select
                        value={preferences.defaultReminderIntervalDays}
                        onChange={(e) => updatePref('defaultReminderIntervalDays', Number(e.target.value))}
                        className="px-4 py-2.5 bg-muted border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm w-40"
                      >
                        <option value={1}>Every day</option>
                        <option value={2}>Every 2 days</option>
                        <option value={3}>Every 3 days</option>
                        <option value={5}>Every 5 days</option>
                        <option value={7}>Every week</option>
                      </select>
                    </label>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Default expiration</p>
                        <p className="text-sm text-muted-foreground">Auto-expire documents after this period</p>
                      </div>
                    </div>
                    <select
                      value={preferences.defaultExpirationDays ?? ''}
                      onChange={(e) => updatePref('defaultExpirationDays', e.target.value ? Number(e.target.value) : null)}
                      className="px-4 py-2.5 bg-muted border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm w-40 ml-8"
                    >
                      <option value="">No expiration</option>
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Company Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Company Profile
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Used in signing emails and document branding</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border text-muted-foreground rounded-lg text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Managed by your Clerk account</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.emailAddresses?.[0]?.emailAddress || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border text-muted-foreground rounded-lg text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Managed by your Clerk account</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                  <input
                    type="text"
                    value={preferences.companyName}
                    onChange={(e) => updatePref('companyName', e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full px-4 py-2.5 bg-muted border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-muted-foreground text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Displayed in signing emails sent to recipients</p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : saved ? (
                <><CheckCircle2 className="w-4 h-4" />Saved!</>
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </button>
            {saved && (
              <span className="text-sm text-emerald-600">Settings saved successfully</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
