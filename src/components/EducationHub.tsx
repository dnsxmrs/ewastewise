'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Module {
    id: number
    title: string
    subtitle: string
    color: string
    icon: React.ReactNode
    details: { heading: string; body: string }[]
    trivia: string
}

const MODULES: Module[] = [
    {
        id: 1,
        title: 'Toxic Hazards',
        subtitle: 'Chemical threats hiding inside your devices',
        color: '#F87171',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 9v5m0 4h.01" strokeLinecap="round" strokeWidth="2" />
            </svg>
        ),
        details: [
            {
                heading: 'Lead in Solder & CRTs',
                body: 'Accumulates in body tissue over time, causing neurological damage and kidney failure — especially dangerous for children and pregnant women.'
            },
            {
                heading: 'Mercury in Flat Screens',
                body: 'A powerful neurotoxin that bioaccumulates through aquatic food chains, contaminating fish and eventually reaching human diets.'
            },
            {
                heading: 'Cadmium in Batteries & Chips',
                body: 'Classified as a Group 1 human carcinogen by the WHO. When burned or crushed, cadmium dust damages lungs and kidneys irreversibly.'
            }
        ],
        trivia: 'A single old CRT computer monitor contains up to 3 kg of pure lead — enough to contaminate thousands of liters of groundwater.'
    },
    {
        id: 2,
        title: 'The Recycling Gap',
        subtitle: 'Why most e-waste never reaches proper facilities',
        color: '#A78BFA',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        details: [
            {
                heading: 'Open-Air Cable Burning',
                body: 'Informal scrap workers burn plastic insulation off copper wires in open air, releasing toxic dioxins and furans that cause respiratory disease and cancer.'
            },
            {
                heading: 'Acid-Bath Metal Recovery',
                body: 'Circuit boards are bathed in raw hydrochloric acid to extract trace gold. The toxic chemical runoff is dumped directly into rivers and drainage canals.'
            },
            {
                heading: 'Landfill Heavy Metal Seepage',
                body: 'E-waste mixed into general municipal landfills slowly decomposes, allowing lead, mercury, and cadmium to leach into local groundwater tables.'
            }
        ],
        trivia: 'Informal e-waste recycling hubs in Caloocan and Tondo expose workers to lead levels up to 100× higher than WHO safety limits.'
    },
    {
        id: 3,
        title: 'Disposal Guide',
        subtitle: 'Four steps to safely recycle your old electronics',
        color: '#4ADE80',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        details: [
            {
                heading: 'Step 1 — Separate & Store',
                body: 'Never mix electronic devices with organic waste or household plastic. Keep them in a dry container until you can drop them off.'
            },
            {
                heading: 'Step 2 — Wipe Personal Data',
                body: 'Perform a factory reset on phones and laptops. For extra security, physically remove and destroy hard drives before disposal.'
            },
            {
                heading: 'Step 3 — Remove Batteries',
                body: 'Extract rechargeable lithium-ion batteries if possible. They present a severe fire and explosion hazard inside sealed collection bins.'
            },
            {
                heading: 'Step 4 — Find an Accredited Facility',
                body: 'Deliver your accumulated items to a DENR-EMB accredited treatment facility. Use our Locator section below to find the nearest one.'
            }
        ],
        trivia: 'Recycling 1 million mobile phones recovers roughly 16,000 kg of copper, 350 kg of silver, and 34 kg of gold — reducing dependency on destructive mining.'
    }
]

const EducationHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0)
    const active = MODULES[activeTab]

    return (
        <section id="education" className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#080C10] overflow-y-auto lg:overflow-hidden py-16 lg:py-0">
            {/* Background radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4ADE80] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-8 relative z-10 w-full my-auto">
                {/* Section Header */}
                <div className="flex flex-col gap-3 mb-10 lg:mb-14">
                    <p className="font-tech text-[10px] tracking-[0.3em] text-[#4ADE80] uppercase">
                        Awareness Pillar
                    </p>
                    <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[0.95]">
                        EDUCATIONAL <span className="text-[#4ADE80]">HUB</span>
                    </h2>
                    <p className="font-body text-white/50 max-w-2xl text-base lg:text-lg font-light leading-relaxed">
                        Understand the real dangers of e-waste, why recycling systems fail, and what you can do about it.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 lg:mb-10">
                    {MODULES.map((m, idx) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveTab(idx)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-body text-sm font-medium transition-all duration-300 border ${
                                activeTab === idx
                                    ? 'bg-white/5 border-white/15 text-white shadow-lg'
                                    : 'bg-transparent border-white/5 text-white/40 hover:text-white/70 hover:border-white/10'
                            }`}
                        >
                            <span style={{ color: activeTab === idx ? m.color : undefined }}>{m.icon}</span>
                            <span className="hidden sm:inline">{m.title}</span>
                            <span className="sm:hidden font-tech text-[10px]">0{m.id}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 items-start"
                    >
                        {/* Left: Title + Trivia */}
                        <div className="flex flex-col gap-6">
                            <div>
                                {/* <span className="font-tech text-[10px] uppercase tracking-widest text-white/30 mb-2 block">
                                    Module 0{active.id}
                                </span> */}
                                <h3 className="font-display text-4xl lg:text-5xl text-white tracking-wide leading-[1.05] mb-3">
                                    {active.title}
                                </h3>
                                <p className="font-body text-base lg:text-lg text-white/60 leading-relaxed">
                                    {active.subtitle}
                                </p>
                            </div>

                            {/* Trivia card */}
                            <div className="border rounded-2xl p-5 flex items-start gap-4" style={{ borderColor: `${active.color}33`, backgroundColor: `${active.color}08` }}>
                                <div className="mt-0.5 flex-shrink-0" style={{ color: active.color }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="font-tech text-[10px] uppercase tracking-wider mb-1 font-bold" style={{ color: active.color }}>
                                        Did You Know?
                                    </h5>
                                    <p className="font-body text-sm text-white/60 leading-relaxed">
                                        {active.trivia}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Detail Points */}
                        <div className="flex flex-col gap-4">
                            {active.details.map((d, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                                    className="bg-white/[0.02] border border-white/[0.06] hover:border-white/10 rounded-xl p-5 transition-colors duration-300 group/item"
                                >
                                    <div className="flex items-start gap-4">
                                        <span
                                            className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: active.color }}
                                        />
                                        <div>
                                            <h4 className="font-body text-sm lg:text-base font-semibold text-white mb-1.5 group-hover/item:text-[#4ADE80] transition-colors duration-300">
                                                {d.heading}
                                            </h4>
                                            <p className="font-body text-sm text-white/50 leading-relaxed group-hover/item:text-white/70 transition-colors duration-300">
                                                {d.body}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default EducationHub
