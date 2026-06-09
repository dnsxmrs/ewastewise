'use client'

import React, { useState, useEffect, useActionState } from 'react'
import { createPledgeAction, getPledgeStats, PledgeStats, ActionState } from '@/actions/pledge-actions'

const PLEDGE_TYPES = [
  { id: 'recycle', label: 'Recycle Old Electronics', color: '#A78BFA' },
  { id: 'batteries', label: 'Separate Waste Batteries', color: '#4ADE80' },
  { id: 'awareness', label: 'Spread E-Waste Awareness', color: '#F59E0B' },
  { id: 'donate', label: 'Wipe & Donate Devices', color: '#22D3EE' }
]

const Community: React.FC = () => {
  const [stats, setStats] = useState<PledgeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // Form states (controlled for easy reset on success)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [selectedPledge, setSelectedPledge] = useState(PLEDGE_TYPES[0].label)
  const [comment, setComment] = useState('')

  // Fetch stats on client mount
  useEffect(() => {
    let active = true
    const fetchStats = async () => {
      try {
        const data = await getPledgeStats()
        if (active) {
          setStats(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load pledge stats:', err)
      }
    }
    fetchStats()
    return () => {
      active = false
    }
  }, [])

  // Action state with re-fetch of stats inside the transition
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData) => {
      const result = await createPledgeAction(prevState, formData)
      if (result.success) {
        setSubmitted(true)
        try {
          const updatedStats = await getPledgeStats()
          setStats(updatedStats)
        } catch (err) {
          console.error('Failed to refresh stats:', err)
        }
        // Reset form fields
        setName('')
        setCity('')
        setComment('')
        setSelectedPledge(PLEDGE_TYPES[0].label)
      }
      return result
    },
    null
  )

  // Environmental Impact Calculations
  const divertedKg = stats
    ? ((stats.recycleCount * 5.4) + (stats.batteriesCount * 0.4) + (stats.donateCount * 8.5)).toFixed(1)
    : '0.0'

  return (
    <section
      id="community"
      className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#0A0F14] overflow-y-auto lg:overflow-hidden py-16 lg:py-0 border-t border-white/5"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F59E0B] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10 w-full my-auto flex flex-col gap-6 lg:gap-8">
        {/* Section Header */}
        <div className="flex flex-col gap-3 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <p className="font-tech text-[10px] tracking-[0.3em] text-[#F59E0B] uppercase">
            Social Influence
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-[0.95] uppercase">
            COMMUNITY <span className="text-[#F59E0B]">PLEDGE</span>
          </h2>
          <p className="font-body text-white/50 text-base lg:text-lg font-light leading-relaxed">
            Commit to responsible e-waste habits and track our collective community impact in real time.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center justify-center max-w-5xl mx-auto w-full">
          {/* Left Panel: Take the Pledge Form */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col justify-center min-h-[440px] w-full max-w-md mx-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center p-4 gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="font-body text-lg font-medium text-white">Pledge Registered!</h4>
                <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
                  Thank you for taking action toward circular waste sustainability! Your commitment has been added to our live stats.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#F59E0B]/85 text-[#080C10] font-body font-semibold text-xs rounded-lg transition-all duration-200 cursor-pointer"
                >
                  Submit Another Pledge
                </button>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <h3 className="font-body text-base font-semibold text-white border-b border-white/[0.06] pb-2">
                  Take the Pledge
                </h3>

                {state?.error && <p className="font-body text-xs text-red-400 font-medium">{state.error}</p>}

                {/* Input: Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name-input" className="font-tech text-[9px] uppercase tracking-wider text-white/40">
                    Your Name / Alias
                  </label>
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    maxLength={50}
                    className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#F59E0B]/40 focus:bg-white/[0.04] text-white rounded-xl px-4 py-2.5 text-xs font-body outline-none transition-all duration-200 placeholder-white/20"
                    required
                  />
                </div>

                {/* Input: City */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city-input" className="font-tech text-[9px] uppercase tracking-wider text-white/40">
                    City / Location
                  </label>
                  <input
                    id="city-input"
                    name="city"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. San Jose, CA"
                    maxLength={50}
                    className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#F59E0B]/40 focus:bg-white/[0.04] text-white rounded-xl px-4 py-2.5 text-xs font-body outline-none transition-all duration-200 placeholder-white/20"
                    required
                  />
                </div>

                {/* Dropdown: Pledge Type */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pledge-select" className="font-tech text-[9px] uppercase tracking-wider text-white/40">
                    Select Your Pledge
                  </label>
                  <div className="relative">
                    <select
                      id="pledge-select"
                      name="pledge_type"
                      value={selectedPledge}
                      onChange={e => setSelectedPledge(e.target.value)}
                      className="w-full bg-[#080C10] border border-white/[0.06] focus:border-[#F59E0B]/40 text-white rounded-xl px-4 py-2.5 text-xs font-body outline-none appearance-none transition-all duration-200 cursor-pointer"
                    >
                      {PLEDGE_TYPES.map(type => (
                        <option key={type.id} value={type.label} className="bg-[#0A0F14] text-white py-2">
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[8px]">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Input: Comment */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="comment-input" className="font-tech text-[9px] uppercase tracking-wider text-white/40">
                    Commitment Note (Optional)
                  </label>
                  <textarea
                    id="comment-input"
                    name="comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="e.g. I promise to recycle my old laptops at an accredited center."
                    maxLength={150}
                    rows={2}
                    className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#F59E0B]/40 focus:bg-white/[0.04] text-white rounded-xl px-4 py-2.5 text-xs font-body outline-none resize-none transition-all duration-200 placeholder-white/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 bg-[#F59E0B] text-[#080C10] hover:bg-[#F59E0B]/85 rounded-xl font-body font-semibold text-xs transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Registering...' : 'Sign E-Waste Pledge'}
                </button>
              </form>
            )}
          </div>

          {/* Right Panel: Analytics Dashboard */}
          <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[440px] w-full max-w-md mx-auto">
            {/* Header */}
            <div className="border-b border-white/[0.06] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                <span className="font-tech text-[10px] uppercase tracking-wider text-white/60">
                  Community Impact Metrics
                </span>
              </div>
            </div>

            {/* Glowing Big Numbers Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-center">
                <span className="font-tech text-[8px] uppercase tracking-wider text-white/40">Total Pledges</span>
                <span className="text-2xl font-bold font-display text-white mt-1 flex items-baseline gap-1">
                  {loading ? '---' : stats?.total}
                  <span className="text-[10px] text-[#F59E0B] font-mono font-normal">citizens</span>
                </span>
              </div>
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3 flex flex-col justify-center">
                <span className="font-tech text-[8px] uppercase tracking-wider text-white/40">Est. E-Waste Diverted</span>
                <span className="text-2xl font-bold font-display text-white mt-1 flex items-baseline gap-1">
                  {loading ? '---' : divertedKg}
                  <span className="text-[10px] text-[#4ADE80] font-mono font-normal">kg</span>
                </span>
              </div>
            </div>

            {/* Progress Gauges */}
            <div className="flex flex-col gap-3.5">
              <h4 className="font-tech text-[9px] uppercase tracking-wider text-white/40 border-b border-white/[0.04] pb-1.5 mb-1">
                Pledge Type Distribution
              </h4>
              {loading ? (
                <div className="flex items-center justify-center py-6 opacity-30 text-xs text-white">
                  Loading metrics...
                </div>
              ) : (
                PLEDGE_TYPES.map(type => {
                  let count = 0
                  if (type.id === 'recycle') count = stats?.recycleCount || 0
                  else if (type.id === 'batteries') count = stats?.batteriesCount || 0
                  else if (type.id === 'awareness') count = stats?.awarenessCount || 0
                  else if (type.id === 'donate') count = stats?.donateCount || 0

                  const percentage = stats && stats.total > 0 ? (count / stats.total) * 100 : 0

                  return (
                    <div key={type.id} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-body">
                        <span className="text-white/60 truncate pr-2">{type.label}</span>
                        <span className="font-tech text-white/80 shrink-0">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: type.color,
                            boxShadow: `0 0 8px ${type.color}`
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Community
