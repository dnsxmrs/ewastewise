'use client'

import React, { useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'

interface ConstructNode {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
}

const NODES: ConstructNode[] = [
  { id: 'PE', name: 'Performance\nExpectancy', x: 15, y: 15, w: 110, h: 35 },
  { id: 'EE', name: 'Effort\nExpectancy', x: 15, y: 65, w: 110, h: 35 },
  { id: 'SI', name: 'Social\nInfluence', x: 15, y: 115, w: 110, h: 35 },
  { id: 'FC', name: 'Facilitating\nConditions', x: 15, y: 220, w: 110, h: 35 },
  { id: 'BI', name: 'Behavioral\nIntention', x: 175, y: 65, w: 80, h: 85 },
  { id: 'UB', name: 'Use\nBehavior', x: 305, y: 140, w: 80, h: 85 },
  { id: 'MOD', name: 'Demographic Moderators\n(Gender, Age, Experience, Voluntariness)', x: 60, y: 285, w: 280, h: 35 }
]

const CONSTRUCT_DETAILS: Record<string, {
  title: string
  score?: string
  pillar?: string
  description: string
  features: string
}> = {
  PE: {
    title: 'Performance Expectancy',
    score: 'Mean: 4.37 / Strongly Agree',
    pillar: 'Awareness Pillar (Education Hub & Quiz)',
    description: 'Students\' belief that using E-WasteWise enhances their capability and productivity in disposing of e-waste properly.',
    features: 'Interactive statistics, educational guides, and environmental hazard disclosures.'
  },
  EE: {
    title: 'Effort Expectancy',
    score: 'Mean: 4.40 / Strongly Agree',
    pillar: 'Engagement Pillar (UI & Navigation)',
    description: 'Perceived ease of use and user-friendliness of the platform, requiring minimal learning curve.',
    features: 'Responsive web interface, simple navigation, and automated e-waste impact calculators.'
  },
  SI: {
    title: 'Social Influence',
    score: 'Mean: 4.16 / Agree',
    pillar: 'Social Pillar (Community Pledge)',
    description: 'The degree of encouragement felt from classmates, professors, and peer communities to adopt proper recycling behaviors.',
    features: 'Community pledge forms, public commitment stats, and social influence tools.'
  },
  FC: {
    title: 'Facilitating Conditions',
    score: 'Mean: 4.28 / Strongly Agree',
    pillar: 'Facilitation Pillar (Bin Locator)',
    description: 'Confidence in external support systems, such as access to hardware/internet and physical e-waste bins.',
    features: 'Drop-off point locator directory, map visualizers, FAQs, and step-by-step documentation.'
  },
  BI: {
    title: 'Behavioral Intention',
    score: 'Mediating Variable',
    pillar: 'Platform Core Intent',
    description: 'The internal drive and intention of students to actively adopt and participate in e-waste recycling initiatives.',
    features: 'Translates high awareness (PE, EE, SI) into active willingness to recycle.'
  },
  UB: {
    title: 'Use Behavior',
    score: 'Outcome Variable',
    pillar: 'Sustained Practice',
    description: 'The actual, regular execution of proper e-waste disposal behaviors over the long term.',
    features: 'The final environmental impact: dropping off e-waste at designated bins and checking off recycling checklists.'
  },
  MOD: {
    title: 'Demographic Moderators',
    score: 'ANOVA: p < 0.001 (Significant)',
    pillar: 'Demographics',
    description: 'External factors altering relationships: Gender, Age, Experience, and Voluntariness of Use.',
    features: 'BSIT and Tech streams scored significantly higher in awareness than business streams (p < 0.001); Age/Year Level showed no variance.'
  }
}

const About: React.FC = () => {
    const [hovered, setHovered] = useState<string | null>(null)

    // Animation variants for staggered reveal
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
            },
        },
    }

    return (
        <section id="about" className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#080C10] overflow-y-auto lg:overflow-hidden py-16 lg:py-0">
            {/* ── Background Depth ── */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4ADE80] opacity-[0.03] blur-[120px] rounded-full -mr-64 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.02] blur-[100px] rounded-full -ml-32 -mb-32" />

            {/* Noise grain overlay for texture consistency */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="max-w-7xl mx-auto px-8 relative z-10 w-full my-auto">
                <motion.div 
                    className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* ── Text Column ── */}
                    <div className="flex flex-col gap-8">
                        <motion.div variants={itemVariants} className="flex flex-col gap-3">
                            <p className="font-tech text-[10px] tracking-[0.3em] text-[#4ADE80] uppercase">
                                Methodology & Research
                            </p>
                            <h2 className="font-display text-6xl md:text-7xl text-white leading-[0.9] tracking-tight">
                                ABOUT THE <br />
                                <span className="text-white/20">PROJECT</span>
                            </h2>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-6 font-body">
                            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
                                E-WasteWise is the culmination of research focused on <span className="text-white font-medium italic">bridging the gap</span> between low student awareness and proper e-waste disposal techniques.
                            </p>
                            <p className="text-white/50 text-base leading-relaxed max-w-lg">
                                Grounded in the <span className="text-[#4ADE80]/80 font-semibold tracking-wider font-tech text-xs border border-white/10 px-2 py-0.5 rounded-sm">UTAUT</span> framework, this platform addresses Personal, Behavioral, Social, and Environmental factors to drive real-world impact.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-8">
                            {[
                                { label: 'Personal', val: 'Awareness' },
                                { label: 'Behavioral', val: 'Intention' },
                                { label: 'Social', val: 'Influence' },
                                { label: 'Environmental', val: 'Sustainability' }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="font-tech text-[9px] text-[#4ADE80]/60 uppercase tracking-widest">{stat.label}</span>
                                    <span className="font-body text-sm text-white/40">{stat.val}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Visual Column ── */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative group w-full flex flex-col items-center justify-center mt-8 lg:mt-0"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -inset-4 bg-linear-to-tr from-[#4ADE80]/10 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="w-full max-w-[380px] lg:max-w-[420px] bg-white/2 border border-white/10 rounded-3xl relative overflow-hidden flex flex-col mx-auto shadow-2xl">
                            {/* Title of the Model */}
                            <div className="flex justify-between items-center px-5 pt-5 pb-2 border-b border-white/5 z-20">
                              <span className="font-tech text-[9px] text-white/40 uppercase tracking-[0.2em]">Theoretical Framework</span>
                              <span className="font-tech text-[9px] text-[#4ADE80]/60 uppercase tracking-[0.2em]">Interactive Map</span>
                            </div>

                            {/* SVG Diagram Area */}
                            <div className="p-4 flex items-center justify-center z-10">
                              <svg className="w-full h-full text-white/5" viewBox="0 0 400 330" fill="none">
                                <defs>
                                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255,255,255,0.2)" />
                                  </marker>
                                  <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4ADE80" />
                                  </marker>
                                </defs>

                                {/* ── Connectors/Pathways ── */}
                                {/* PE to BI */}
                                <line 
                                  x1="125" y1="32.5" x2="175" y2="80" 
                                  stroke={hovered === 'PE' || hovered === 'BI' ? '#4ADE80' : 'rgba(255,255,255,0.1)'} 
                                  strokeWidth={hovered === 'PE' || hovered === 'BI' ? 1.5 : 1}
                                  markerEnd={hovered === 'PE' || hovered === 'BI' ? 'url(#arrow-green)' : 'url(#arrow)'}
                                  className="transition-colors duration-300"
                                />

                                {/* EE to BI */}
                                <line 
                                  x1="125" y1="82.5" x2="175" y2="107.5" 
                                  stroke={hovered === 'EE' || hovered === 'BI' ? '#4ADE80' : 'rgba(255,255,255,0.1)'} 
                                  strokeWidth={hovered === 'EE' || hovered === 'BI' ? 1.5 : 1}
                                  markerEnd={hovered === 'EE' || hovered === 'BI' ? 'url(#arrow-green)' : 'url(#arrow)'}
                                  className="transition-colors duration-300"
                                />

                                {/* SI to BI */}
                                <line 
                                  x1="125" y1="132.5" x2="175" y2="135" 
                                  stroke={hovered === 'SI' || hovered === 'BI' ? '#4ADE80' : 'rgba(255,255,255,0.1)'} 
                                  strokeWidth={hovered === 'SI' || hovered === 'BI' ? 1.5 : 1}
                                  markerEnd={hovered === 'SI' || hovered === 'BI' ? 'url(#arrow-green)' : 'url(#arrow)'}
                                  className="transition-colors duration-300"
                                />

                                {/* BI to UB */}
                                <line 
                                  x1="255" y1="107.5" x2="305" y2="160" 
                                  stroke={hovered === 'BI' || hovered === 'UB' ? '#4ADE80' : 'rgba(255,255,255,0.1)'} 
                                  strokeWidth={hovered === 'BI' || hovered === 'UB' ? 1.5 : 1}
                                  markerEnd={hovered === 'BI' || hovered === 'UB' ? 'url(#arrow-green)' : 'url(#arrow)'}
                                  className="transition-colors duration-300"
                                />

                                {/* FC to UB */}
                                <line 
                                  x1="125" y1="237.5" x2="305" y2="205" 
                                  stroke={hovered === 'FC' || hovered === 'UB' ? '#4ADE80' : 'rgba(255,255,255,0.1)'} 
                                  strokeWidth={hovered === 'FC' || hovered === 'UB' ? 1.5 : 1}
                                  markerEnd={hovered === 'FC' || hovered === 'UB' ? 'url(#arrow-green)' : 'url(#arrow)'}
                                  className="transition-colors duration-300"
                                />

                                {/* Moderation dashed lines pointing up from Moderators box */}
                                {/* points to PE/EE/SI -> BI arrow cluster */}
                                <path 
                                  d="M 150 285 V 105" 
                                  stroke={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.06)'} 
                                  strokeWidth="1" 
                                  strokeDasharray="3 3" 
                                  className="transition-colors duration-300"
                                />
                                <circle cx="150" cy="105" r="3" fill={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.15)'} className="transition-colors duration-300" />

                                {/* points to BI -> UB arrow */}
                                <path 
                                  d="M 280 285 V 135" 
                                  stroke={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.06)'} 
                                  strokeWidth="1" 
                                  strokeDasharray="3 3" 
                                  className="transition-colors duration-300"
                                />
                                <circle cx="280" cy="135" r="3" fill={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.15)'} className="transition-colors duration-300" />

                                {/* points to FC -> UB arrow */}
                                <path 
                                  d="M 215 285 V 220" 
                                  stroke={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.06)'} 
                                  strokeWidth="1" 
                                  strokeDasharray="3 3" 
                                  className="transition-colors duration-300"
                                />
                                <circle cx="215" cy="220" r="3" fill={hovered === 'MOD' ? '#4ADE80' : 'rgba(255,255,255,0.15)'} className="transition-colors duration-300" />

                                {/* ── Render Node Boxes ── */}
                                {NODES.map((node) => {
                                  const isNodeHovered = hovered === node.id
                                  const cx = node.x + node.w / 2
                                  const cy = node.y + node.h / 2
                                  const lines = node.name.split('\n')

                                  return (
                                    <g 
                                      key={node.id} 
                                      className="cursor-pointer group/node"
                                      onMouseEnter={() => setHovered(node.id)}
                                      onMouseLeave={() => setHovered(null)}
                                    >
                                      {/* Outer rect border */}
                                      <rect
                                        x={node.x}
                                        y={node.y}
                                        width={node.w}
                                        height={node.h}
                                        rx={6}
                                        fill={isNodeHovered ? 'rgba(74,222,128,0.08)' : 'rgba(10,14,20,0.6)'}
                                        stroke={isNodeHovered ? '#4ADE80' : 'rgba(255,255,255,0.12)'}
                                        strokeWidth={isNodeHovered ? 1.5 : 1}
                                        className="transition-all duration-300"
                                      />
                                      {/* Render label lines */}
                                      {lines.length === 1 && (
                                        <text x={cx} y={cy} dominantBaseline="middle" textAnchor="middle" style={{ fontSize: node.id === 'MOD' ? 7.5 : 8.5, fontFamily: 'var(--font-tech)' }} className={`${isNodeHovered ? 'fill-[#4ADE80]' : 'fill-white/70'} font-semibold tracking-wide select-none transition-colors duration-300`}>
                                          {lines[0]}
                                        </text>
                                      )}
                                      {lines.length === 2 && (
                                        <text x={cx} y={cy} textAnchor="middle" style={{ fontSize: 8.5, fontFamily: 'var(--font-tech)' }} className={`${isNodeHovered ? 'fill-[#4ADE80]' : 'fill-white/70'} font-semibold tracking-wide select-none transition-colors duration-300`}>
                                          <tspan x={cx} y={cy - 4} dominantBaseline="middle">{lines[0]}</tspan>
                                          <tspan x={cx} y={cy + 8} dominantBaseline="middle">{lines[1]}</tspan>
                                        </text>
                                      )}
                                    </g>
                                  )
                                })}
                              </svg>
                            </div>

                            {/* Details Box below SVG (Stacked layout, no absolute overlay clashing) */}
                            <div className="border-t border-white/10 p-5 min-h-[145px] bg-white/[0.01] relative flex flex-col justify-center">
                              <AnimatePresence mode="wait">
                                {hovered ? (
                                  <motion.div
                                    key={hovered}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col h-full"
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-tech text-[10px] font-bold text-[#4ADE80] uppercase tracking-wider">
                                        {CONSTRUCT_DETAILS[hovered].title}
                                      </h4>
                                      {CONSTRUCT_DETAILS[hovered].score && (
                                        <span className="font-tech text-[8px] border border-[#4ADE80]/30 px-1.5 py-0.5 rounded bg-[#4ADE80]/5 text-[#4ADE80] font-semibold">
                                          {CONSTRUCT_DETAILS[hovered].score}
                                        </span>
                                      )}
                                    </div>
                                    <p className="font-body text-[10px] text-white/80 leading-normal mb-2">
                                      {CONSTRUCT_DETAILS[hovered].description}
                                    </p>
                                    {CONSTRUCT_DETAILS[hovered].pillar && (
                                      <div className="border-t border-white/5 pt-1.5 flex flex-col gap-0.5">
                                        <div className="flex gap-1 items-center">
                                          <span className="font-tech text-[8px] text-[#4ADE80]/60 uppercase">Pillar:</span>
                                          <span className="font-body text-[9px] text-white/50 font-medium">{CONSTRUCT_DETAILS[hovered].pillar}</span>
                                        </div>
                                        <div className="flex gap-1 items-start">
                                          <span className="font-tech text-[8px] text-[#4ADE80]/60 uppercase mt-0.5">Features:</span>
                                          <span className="font-body text-[9px] text-white/40 leading-normal flex-1">{CONSTRUCT_DETAILS[hovered].features}</span>
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="default"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col h-full"
                                  >
                                    <h4 className="font-tech text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                                      UTAUT Research Model
                                    </h4>
                                    <p className="font-body text-[10px] text-white/40 leading-relaxed">
                                      Hover over any construct box or pathway in the diagram to inspect its empirical mean score, operational definition, and corresponding website implementation pillar.
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                        </div>

                        {/* Asymmetric caption */}
                        <div className="absolute -bottom-6 -right-6 bg-[#080C10] border border-white/10 px-6 py-4 rounded-xl backdrop-blur-xl z-20">
                            <p className="font-tech text-[10px] text-[#4ADE80] mb-1 uppercase tracking-widest">Dataset Focus</p>
                            <p className="font-body text-white/60 text-xs">University Student Body</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default About
