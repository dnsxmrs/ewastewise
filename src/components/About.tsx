'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'

const About: React.FC = () => {
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
        <section id="about" className="relative py-32 bg-[#080C10] overflow-hidden">
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

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <motion.div 
                    className="grid lg:grid-cols-2 gap-20 items-center"
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
                                Grounded in the <span className="text-[#4ADE80]/80 font-semibold tracking-wider font-tech text-xs border border-white/10 px-2 py-0.5 rounded-sm">UTAUT</span> framework, this platform addresses Personal, Behavioral, and Environmental factors to drive real-world impact.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                            {[
                                { label: 'Personal', val: 'Awareness' },
                                { label: 'Behavioral', val: 'Intention' },
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
                        className="relative group"
                    >
                        {/* Decorative background element */}
                        <div className="absolute -inset-4 bg-linear-to-tr from-[#4ADE80]/10 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="aspect-4/5 bg-white/2 border border-white/10 rounded-3xl relative overflow-hidden flex items-center justify-center p-12">
                            {/* Research Abstract Graphic */}
                            <svg className="w-full h-full text-white/10" viewBox="0 0 400 500" fill="none">
                                <motion.path 
                                    d="M100 100 L300 100 L300 400 L100 400 Z" 
                                    stroke="currentColor" 
                                    strokeWidth="1" 
                                    animate={{ pathLength: [0, 1] }} 
                                    transition={{ duration: 1.5, delay: 1 }}
                                />
                                <motion.circle cx="200" cy="250" r="80" stroke="#4ADE80" strokeWidth="0.5" strokeDasharray="4 4" 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                />
                                {/* Circuit lines */}
                                <path d="M50 150 H150 M250 150 H350 M50 350 H150 M250 350 H350" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                <path d="M200 50 V150 M200 350 V450" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                                
                                {/* Labels */}
                                <text x="200" y="245" fill="white" fillOpacity="0.4" fontSize="12" textAnchor="middle" className="font-tech tracking-wider">UTAUT</text>
                                <text x="200" y="265" fill="#4ADE80" fillOpacity="0.6" fontSize="10" textAnchor="middle" className="font-tech">MODEL</text>
                            </svg>

                            {/* Floating nodes */}
                            <motion.div 
                                className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#4ADE80] rounded-full blur-[2px]"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <motion.div 
                                className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-[1px]"
                                animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            />
                            
                            {/* Abstract Text Labels */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                                <div className="flex justify-between items-start">
                                    <div className="font-tech text-white/5 text-[9px] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">System Archi</div>
                                    <div className="font-tech text-white/5 text-[9px] uppercase tracking-[0.4em]">v.1.0.23</div>
                                </div>
                                <div className="font-tech text-white/10 text-[10px] uppercase tracking-[0.5em] text-center">Theoretical Framework Analysis</div>
                            </div>
                        </div>

                        {/* Asymmetric caption */}
                        <div className="absolute -bottom-6 -right-6 bg-[#080C10] border border-white/10 px-6 py-4 rounded-xl backdrop-blur-xl">
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
