'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Impact Calculator Data ──────────────────────────────────────────────────
interface DeviceType {
  name: string
  icon: React.ReactNode
  leadG: number       // grams of lead per unit
  mercuryMg: number   // mg of mercury per unit
  copperG: number     // grams of recoverable copper
  co2Kg: number       // kg CO₂ saved by recycling vs mining
}

const DEVICES: DeviceType[] = [
  { name: 'Smartphones', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, leadG: 0.3, mercuryMg: 0, copperG: 15, co2Kg: 45 },
  { name: 'Laptops', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H4z" /><path d="M2 20h20" /></svg>, leadG: 1.5, mercuryMg: 3, copperG: 100, co2Kg: 200 },
  { name: 'CRT Monitors', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>, leadG: 3000, mercuryMg: 50, copperG: 450, co2Kg: 120 },
  { name: 'Tablets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, leadG: 0.5, mercuryMg: 1, copperG: 30, co2Kg: 55 },
  { name: 'Batteries', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2" /><line x1="23" y1="13" x2="23" y2="11" /></svg>, leadG: 5, mercuryMg: 0, copperG: 2, co2Kg: 8 },
]

// ── Quiz Data ───────────────────────────────────────────────────────────────
interface QuizQuestion {
  question: string
  options: string[]
  correct: number // index
  explanation: string
}

const QUIZ_POOL: QuizQuestion[] = [
  {
    question: 'How much e-waste does the Philippines generate annually?',
    options: ['~50,000 tons', '~250,000 tons', '~537,000 tons', '~1,000,000 tons'],
    correct: 2,
    explanation: 'The Philippines generates approximately 537,000 metric tons of e-waste per year as of 2022, according to DENR-EMB and UNIDO data.'
  },
  {
    question: 'Which heavy metal found in old CRT monitors is a potent neurotoxin?',
    options: ['Iron', 'Cadmium', 'Lead', 'Aluminum'],
    correct: 2,
    explanation: 'Lead is the primary toxic metal in CRT monitors, with a single unit containing up to 3 kg. It causes neurological and kidney damage.'
  },
  {
    question: 'What percentage of Philippine e-waste is formally recycled?',
    options: ['About 30%', 'About 17%', 'About 10%', 'Less than 5%'],
    correct: 3,
    explanation: 'Less than 5% of e-waste in the Philippines is formally collected and recycled through DENR-EMB accredited facilities.'
  },
  {
    question: 'What should you do BEFORE disposing of an old phone?',
    options: ['Throw it in the trash immediately', 'Remove the battery and factory reset', 'Bury it in the backyard', 'Microwave it to destroy data'],
    correct: 1,
    explanation: 'You should always remove the battery (fire hazard) and factory reset your device (data privacy) before handing it to a recycler.'
  },
  {
    question: 'Which law governs solid waste management in the Philippines?',
    options: ['RA 7160', 'RA 9003', 'RA 10173', 'RA 8749'],
    correct: 1,
    explanation: 'Republic Act 9003, the Ecological Solid Waste Management Act, provides the overarching framework for proper waste disposal in the Philippines.'
  },
  {
    question: 'What is the fastest-growing solid waste stream in the world?',
    options: ['Plastic bottles', 'Food waste', 'E-waste', 'Textiles'],
    correct: 2,
    explanation: 'According to the UN, e-waste is the fastest-growing municipal waste stream in the world, fueled by higher consumption rates, short life cycles, and few repair options.'
  },
  {
    question: 'What toxic element is commonly found in the backlights of older LCD screens and laptops?',
    options: ['Mercury', 'Gold', 'Silver', 'Iron'],
    correct: 0,
    explanation: 'Mercury is often used in cold cathode fluorescent lamps (CCFLs) that backlit older LCD screens. It can damage the nervous system when released.'
  },
  {
    question: 'What is the term for manufacturers deliberately designing products with a limited useful life?',
    options: ['Planned obsolescence', 'Greenwashing', 'Eco-design', 'Resource recovery'],
    correct: 0,
    explanation: 'Planned obsolescence is a business strategy where products are designed to become obsolete or non-functional after a certain period, forcing consumers to buy new ones.'
  },
  {
    question: 'Approximately how much gold can be recovered from one metric ton of smartphones compared to one ton of gold ore?',
    options: ['Less than gold ore', 'About the same', 'Up to 100 times more', 'Gold cannot be recovered from smartphones'],
    correct: 2,
    explanation: 'A ton of smartphones contains about 80 to 100 times more gold than a ton of standard gold ore, making "urban mining" highly efficient.'
  },
  {
    question: 'Which international treaty, signed by the Philippines, restricts the transboundary movement of hazardous wastes, including e-waste?',
    options: ['Kyoto Protocol', 'Paris Agreement', 'Basel Convention', 'Montreal Protocol'],
    correct: 2,
    explanation: 'The Basel Convention regulates the international transit of hazardous wastes to prevent developed nations from dumping toxic waste (like e-waste) in developing countries.'
  }
]

const getRandomQuestions = (pool: QuizQuestion[], count: number) => {
  const shuffled = [...pool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// ── Calculator Component ────────────────────────────────────────────────────
const Calculator: React.FC = () => {
  const [counts, setCounts] = useState<number[]>(DEVICES.map(() => 0))

  const update = (idx: number, delta: number) => {
    setCounts(prev => {
      const next = [...prev]
      next[idx] = Math.max(0, Math.min(99, next[idx] + delta))
      return next
    })
  }

  const totalLead = counts.reduce((sum, c, i) => sum + c * DEVICES[i].leadG, 0)
  const totalMercury = counts.reduce((sum, c, i) => sum + c * DEVICES[i].mercuryMg, 0)
  const totalCopper = counts.reduce((sum, c, i) => sum + c * DEVICES[i].copperG, 0)
  const totalCo2 = counts.reduce((sum, c, i) => sum + c * DEVICES[i].co2Kg, 0)
  const hasItems = counts.some(c => c > 0)

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start">
      {/* Left: Device Selector */}
      <div className="flex flex-col gap-3">
        <p className="font-body text-base text-white/60 mb-2">
          Add your old electronics to see their combined environmental footprint.
        </p>
        {DEVICES.map((d, idx) => (
          <div
            key={d.name}
            className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 group hover:border-white/10 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/50">{d.icon}</span>
              <span className="font-body text-base text-white/90">{d.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update(idx, -1)}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 flex items-center justify-center font-body text-lg transition-all duration-200"
                aria-label={`Decrease ${d.name}`}
              >
                −
              </button>
              <span className="font-tech text-lg text-white w-9 text-center tabular-nums">
                {counts[idx]}
              </span>
              <button
                onClick={() => update(idx, 1)}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#22D3EE]/40 flex items-center justify-center font-body text-lg transition-all duration-200"
                aria-label={`Increase ${d.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Impact Results */}
      <div className="flex flex-col gap-4">
        <h4 className="font-display text-3xl lg:text-4xl text-white tracking-wide mb-2">
          YOUR <span className="text-[#22D3EE]">IMPACT</span>
        </h4>

        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Lead Released', value: totalLead >= 1000 ? `${(totalLead / 1000).toFixed(1)} kg` : `${totalLead.toFixed(1)} g`, color: '#F87171', desc: 'Toxic to soil & water' },
                { label: 'Mercury Released', value: totalMercury >= 1000 ? `${(totalMercury / 1000).toFixed(1)} g` : `${totalMercury.toFixed(1)} mg`, color: '#A78BFA', desc: 'Neurotoxin' },
                { label: 'Copper Recoverable', value: totalCopper >= 1000 ? `${(totalCopper / 1000).toFixed(1)} kg` : `${totalCopper.toFixed(0)} g`, color: '#F59E0B', desc: 'Valuable material saved' },
                { label: 'CO₂ Saved by Recycling', value: `${totalCo2.toFixed(0)} kg`, color: '#4ADE80', desc: 'vs. mining new materials' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-1.5"
                >
                  <span className="font-tech text-xs uppercase tracking-wider" style={{ color: stat.color }}>{stat.label}</span>
                  <span className="font-display text-3xl lg:text-4xl text-white">{stat.value}</span>
                  <span className="font-body text-sm text-white/40">{stat.desc}</span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 flex items-center justify-center"
            >
              <p className="font-body text-base text-white/40 text-center">
                Add devices on the left to calculate<br />your environmental impact.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {hasItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-[#22D3EE]/20 bg-[#22D3EE]/5 rounded-xl p-4 flex items-start gap-3 mt-2"
          >
            <span className="text-[#22D3EE] mt-0.5 flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2v1M12 8a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.4V17h4v-1.6c1.2-.6 2-1.9 2-3.4a4 4 0 0 0-4-4z" /></svg></span>
            <p className="font-body text-sm text-white/70 leading-relaxed">
              Recycling these devices properly instead of landfilling them prevents heavy metals from entering the water supply and recovers valuable raw materials.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Quiz Component ──────────────────────────────────────────────────────────
const QuizTool: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [stats, setStats] = useState({ bestScore: 0, attempts: 0 })
  const [hasNewBest, setHasNewBest] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    setQuestions(getRandomQuestions(QUIZ_POOL, 5))

    const savedBest = localStorage.getItem('ewastewise_quiz_best_score')
    const savedAttempts = localStorage.getItem('ewastewise_quiz_attempts')
    setStats({
      bestScore: savedBest ? parseInt(savedBest, 10) : 0,
      attempts: savedAttempts ? parseInt(savedAttempts, 10) : 0
    })
  }, [])

  if (!mounted || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[300px]">
        <p className="font-body text-base text-white/40">Loading quiz questions...</p>
      </div>
    )
  }

  const q = questions[currentQ]

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) setScore(prev => prev + 1)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
      const nextAttempts = stats.attempts + 1
      const isNewBest = score > stats.bestScore || (stats.attempts === 0 && score > 0)
      const nextBest = Math.max(stats.bestScore, score)
      localStorage.setItem('ewastewise_quiz_best_score', nextBest.toString())
      localStorage.setItem('ewastewise_quiz_attempts', nextAttempts.toString())
      setHasNewBest(isNewBest)
      setStats({ bestScore: nextBest, attempts: nextAttempts })
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
    setHasNewBest(false)
    setQuestions(getRandomQuestions(QUIZ_POOL, 5))
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto flex flex-col items-center text-center gap-6"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center" style={{ borderColor: pct >= 60 ? '#4ADE80' : '#F87171' }}>
            <span className="font-display text-4xl text-white">{pct}%</span>
          </div>
          {hasNewBest && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-6 bg-[#22D3EE] text-[#080C10] text-[10px] font-tech font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              NEW BEST!
            </motion.span>
          )}
        </div>
        <div>
          <h3 className="font-display text-3xl text-white mb-2">
            {pct >= 80 ? 'EXCELLENT!' : pct >= 60 ? 'GOOD JOB!' : 'KEEP LEARNING!'}
          </h3>
          <p className="font-body text-lg text-white/60">
            You scored {score} out of {questions.length} questions correctly.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm font-tech text-white/40">
            <span>Total Attempts: {stats.attempts}</span>
            <span>Best Score: {stats.bestScore}/{questions.length}</span>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="px-8 py-3.5 bg-[#22D3EE] text-[#080C10] font-body font-semibold text-base rounded-xl hover:bg-[#22D3EE]/80 transition-colors duration-200"
        >
          Retake Quiz
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar & Stats */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#22D3EE] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="font-tech text-sm text-white/50">{currentQ + 1}/{questions.length}</span>
        </div>
        {stats.attempts > 0 && (
          <div className="flex gap-4 text-xs font-tech text-white/40">
            <span>ATTEMPTS: {stats.attempts}</span>
            <span>BEST SCORE: {stats.bestScore}/{questions.length}</span>
          </div>
        )}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-body text-xl lg:text-2xl font-medium text-white mb-8 leading-relaxed">
            {q.question}
          </h3>

          <div className="flex flex-col gap-3 mb-6">
            {q.options.map((opt, idx) => {
              let borderColor = 'border-white/[0.06]'
              let bgColor = 'bg-white/[0.02]'
              let textColor = 'text-white/70'

              if (answered) {
                if (idx === q.correct) {
                  borderColor = 'border-[#4ADE80]/50'
                  bgColor = 'bg-[#4ADE80]/5'
                  textColor = 'text-[#4ADE80]'
                } else if (idx === selected && idx !== q.correct) {
                  borderColor = 'border-[#F87171]/50'
                  bgColor = 'bg-[#F87171]/5'
                  textColor = 'text-[#F87171]'
                }
              } else if (idx === selected) {
                borderColor = 'border-[#22D3EE]/40'
                bgColor = 'bg-[#22D3EE]/5'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`text-left px-6 py-4.5 rounded-xl border ${borderColor} ${bgColor} ${textColor} font-body text-base transition-all duration-200 ${!answered ? 'hover:border-white/15 hover:bg-white/[0.03] cursor-pointer' : 'cursor-default'}`}
                >
                  <span className="font-tech text-xs text-white/40 mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Explanation + Next */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="border border-white/5 bg-white/[0.02] rounded-xl p-5">
                  <p className="font-body text-base text-white/70 leading-relaxed">
                    <span className="font-semibold text-white">Explanation: </span>
                    {q.explanation}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="self-end px-7 py-3 bg-[#22D3EE] text-[#080C10] font-body font-semibold text-base rounded-xl hover:bg-[#22D3EE]/80 transition-colors duration-200"
                >
                  {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Main InteractiveTools ───────────────────────────────────────────────────
const TOOLS: { id: string; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'calc', name: 'Impact Calculator', color: '#22D3EE', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
  { id: 'quiz', name: 'Awareness Quiz', color: '#22D3EE', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
]

const InteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="tools" className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#0A0F14] overflow-y-auto lg:overflow-hidden py-16 lg:py-0">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#22D3EE] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 relative z-10 w-full my-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-10 lg:mb-14">
          <p className="font-tech text-[10px] tracking-[0.3em] text-[#22D3EE] uppercase">
            Engagement Pillar
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[0.95]">
            INTERACTIVE <span className="text-[#22D3EE]">TOOLS</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-base lg:text-lg font-light leading-relaxed">
            Measure your personal e-waste footprint and test your knowledge with hands-on modules.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 lg:mb-10">
          {TOOLS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 border ${activeTab === idx
                  ? 'bg-white/5 border-[#22D3EE]/30 text-white shadow-lg shadow-[#22D3EE]/5'
                  : 'bg-transparent border-white/5 text-white/40 hover:text-white/70 hover:border-white/10'
                }`}
            >
              <span style={{ color: activeTab === idx ? t.color : undefined }} className="transition-colors duration-300">
                {t.icon}
              </span>
              {t.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 0 ? <Calculator /> : <QuizTool />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default InteractiveTools
