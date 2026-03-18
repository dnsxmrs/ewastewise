'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useScroll, useSpring, animate } from 'framer-motion'

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
// Star of the show: a cracked/glitching PCB-circuit globe that represents
// the earth being poisoned by e-waste — every detail serves the story.
//
// Typography anchor: "Bebas Neue" for the hero headline (tall, industrial,
// urgent) paired with "DM Sans" for body (clean, readable, modern).
//
// Visual rhyme: hexagonal motif appears in the globe cells, background grid,
// and the floating item borders — repeated shape creates cohesion.
//
// Depth: noise grain overlay, frosted glass cards, layered radial glows.
//
// Hierarchy via opacity: headline 100% → subheadline 90% → body 60% → labels 40%
// ──────────────────────────────────────────────────────────────────────────────


// ── Types ─────────────────────────────────────────────────────────────────────
interface Particle {
    id: number
    x: number
    y: number
    size: number
    opacity: number
    duration: number
    delay: number
    color: string
}

// ── Hex grid "toxic globe" — the star of the show ────────────────────────────
const ToxicGlobe: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
    const cols = 9
    const rows = 9
    const cells = cols * rows
    const [lit, setLit] = useState<Set<number>>(new Set())

    // Randomly flicker cells to simulate a dying circuit board
    useEffect(() => {
        const flicker = () => {
            const count = Math.floor(Math.random() * 6) + 2
            const next = new Set<number>()
            for (let i = 0; i < count; i++) {
                next.add(Math.floor(Math.random() * cells))
            }
            setLit(next)
        }
        flicker()
        const id = setInterval(flicker, 900)
        return () => clearInterval(id)
    }, [cells])

    // Mouse tilt
    const rotateX = ((mouseY - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / (typeof window !== 'undefined' ? window.innerHeight : 1)) * -18
    const rotateY = ((mouseX - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 18

    // Circuit-trace colors echoing the palette
    const colors = ['#4ADE80', '#22D3EE', '#A78BFA', '#F59E0B', '#F87171']

    return (
        <motion.div
            className="relative"
            style={{ perspective: 900 }}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 40, damping: 25 }}
        >
            {/* Outer glow ring — visual rhyme: circle echoing hexagon cells */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    boxShadow: '0 0 80px 20px rgba(74,222,128,0.12), 0 0 160px 40px rgba(59,130,246,0.08)',
                    borderRadius: '50%',
                    transform: 'scale(1.08)',
                }}
            />

            {/* Globe ring border */}
            <div
                className="relative rounded-full overflow-hidden"
                style={{
                    width: 340,
                    height: 340,
                    border: '1.5px solid rgba(74,222,128,0.25)',
                    background: 'radial-gradient(circle at 35% 35%, rgba(74,222,128,0.06), rgba(10,14,20,0.85) 70%)',
                    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)',
                }}
            >
                {/* Hex cell grid */}
                <div
                    className="absolute inset-0 grid"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                        gap: 2,
                        padding: 12,
                    }}
                >
                    {Array.from({ length: cells }, (_, i) => {
                        const isLit = lit.has(i)
                        const color = colors[i % colors.length]
                        // Mask cells outside a rough circle
                        const col = i % cols
                        const row = Math.floor(i / cols)
                        const cx = col - cols / 2 + 0.5
                        const cy = row - rows / 2 + 0.5
                        const dist = Math.sqrt(cx * cx + cy * cy)
                        const inCircle = dist < cols / 2 - 0.3
                        if (!inCircle) return <div key={i} />
                        return (
                            <motion.div
                                key={i}
                                style={{
                                    background: isLit
                                        ? `${color}33`
                                        : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isLit ? color + '66' : 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: 3,
                                    boxShadow: isLit ? `0 0 6px ${color}55` : 'none',
                                }}
                                animate={{ opacity: isLit ? [0.6, 1, 0.6] : 0.4 }}
                                transition={{ duration: 0.9, ease: 'easeInOut' }}
                            />
                        )
                    })}
                </div>

                {/* Crack overlay — "broken earth" motif */}
                <svg
                    className="absolute inset-0 pointer-events-none"
                    viewBox="0 0 340 340"
                    style={{ opacity: 0.18 }}
                >
                    <path d="M170 60 L155 130 L175 150 L145 200 L165 220 L140 280" stroke="#4ADE80" strokeWidth="1.5" fill="none" />
                    <path d="M200 80 L185 140 L200 160 L215 200" stroke="#22D3EE" strokeWidth="1" fill="none" />
                    <path d="M130 100 L145 155 L125 175" stroke="#A78BFA" strokeWidth="1" fill="none" />
                </svg>

                {/* Center glow point */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 60,
                        height: 60,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        background: 'radial-gradient(circle, rgba(74,222,128,0.3), transparent 70%)',
                        filter: 'blur(4px)',
                    }}
                />

                {/* Scan line sweep */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(74,222,128,0.04) 50%, transparent 60%)',
                    }}
                    animate={{ y: [-340, 340] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            {/* Orbit ring — visual rhyme with the globe circle */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: 400,
                    height: 400,
                    top: '50%',
                    left: '50%',
                    marginTop: -200,
                    marginLeft: -200,
                    border: '1px dashed rgba(74,222,128,0.15)',
                    borderRadius: '50%',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                {/* Orbiting dot */}
                <div
                    className="absolute rounded-full"
                    style={{
                        width: 6,
                        height: 6,
                        top: 0,
                        left: '50%',
                        marginLeft: -3,
                        marginTop: -3,
                        background: '#4ADE80',
                        boxShadow: '0 0 10px #4ADE80',
                    }}
                />
            </motion.div>
        </motion.div>
    )
}

// ── Floating e-waste tags — minimal, icon-less, typographic ──────────────────
// TODO: Add real data
const tags = [
    { label: '53.6M tons/yr', sub: 'global e-waste', x: '8%', y: '20%', delay: 0 },
    { label: '17.4%', sub: 'recycled only', x: '75%', y: '12%', delay: 0.3 },
    { label: '70% toxic waste', sub: 'from electronics', x: '82%', y: '65%', delay: 0.6 },
    { label: '1,000 yrs', sub: 'battery decay', x: '5%', y: '68%', delay: 0.9 },
]

const FloatingTag: React.FC<{
    label: string
    sub: string
    x: string
    y: string
    delay: number
    mouseX: number
    mouseY: number
}> = ({ label, sub, x, y, delay, mouseX, mouseY }) => {
    const mx = (mouseX - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.012
    const my = (mouseY - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.012

    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{
                left: x,
                top: y,
                // glass card — depth technique
                background: 'rgba(10,14,20,0.55)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(74,222,128,0.18)',
                borderRadius: 8,
                padding: '8px 14px',
                // visual rhyme: same border-radius as buttons and globe ring
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: [0, -6, 0], x: mx, }}
            transition={{
                opacity: { delay, duration: 0.6 },
                y: { delay, duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' },
                x: { type: 'spring', stiffness: 40, damping: 20 },
            }}
        >
            {/* Hierarchy: label bright, sub dim */}
            <p style={{ fontFamily: "var(--font-tech)", fontSize: 13, fontWeight: 700, color: '#4ADE80', lineHeight: 1.2, margin: 0 }}>
                {label}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, marginTop: 2 }}>
                {sub}
            </p>
        </motion.div>
    )
}

// ── Particle field (noise depth) ─────────────────────────────────────────────
const ParticleField: React.FC = () => {
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            duration: Math.random() * 8 + 4,
            delay: Math.random() * 4,
            color: ['#4ADE80', '#22D3EE', '#A78BFA'][i % 3],
        }))
    )

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        opacity: p.opacity,
                    }}
                    animate={{ y: [-12, 12, -12], opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    )
}

// ── Hex background grid (visual rhyme) ───────────────────────────────────────
const HexGrid: React.FC = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke="#4ADE80" strokeWidth="1" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
)

// ── Noise grain overlay (depth / texture) ────────────────────────────────────
const NoiseOverlay: React.FC = () => (
    <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            mixBlendMode: 'overlay',
        }}
    />
)

// ── Main Hero ─────────────────────────────────────────────────────────────────
const AnimatedHero: React.FC = () => {
    const { scrollY } = useScroll()
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 })

    const bgY = useTransform(scrollY, [0, 800], [0, -120])
    const textY = useTransform(scrollY, [0, 800], [0, -40])
    const globeY = useTransform(scrollY, [0, 800], [0, 60])

    // useEffect(() => {
    //     const onMove = (e: MouseEvent) => {
    //         mouseX.set(e.clientX)
    //         mouseY.set(e.clientY)
    //         setMousePos({ x: e.clientX, y: e.clientY })
    //     }
    //     window.addEventListener('mousemove', onMove)
    //     return () => window.removeEventListener('mousemove', onMove)
    // }, [mouseX, mouseY])

    return (
        <>
            <section
                id="home"
                className="relative min-h-screen flex items-center overflow-hidden"
                style={{ background: '#080C10', fontFamily: "var(--font-body)" }}
            >
                {/* ── Depth layers ── */}
                <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                    {/* Radial glows — visual rhyme: same green/blue palette */}
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 65% 50%, rgba(74,222,128,0.07), transparent)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 60% at 20% 80%, rgba(59,130,246,0.06), transparent)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30% 40% at 80% 10%, rgba(167,139,250,0.05), transparent)' }} />
                    <HexGrid />
                    <ParticleField />
                </motion.div>

                <NoiseOverlay />

                {/* ── Floating stat tags ── */}
                {tags.map((t) => (
                    <FloatingTag key={t.label} {...t} mouseX={mousePos.x} mouseY={mousePos.y} />
                ))}

                {/* ── Main content: two-column layout ── */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-12 pt-20 pb-16">

                    {/* Left: Text column */}
                    <motion.div
                        className="flex-1 text-left max-w-xl"
                        style={{ y: textY }}
                    >
                        {/* Eyebrow — opacity 40% (hierarchy) */}
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            style={{
                                fontFamily: "var(--font-tech)",
                                fontSize: 11,
                                letterSpacing: '0.2em',
                                color: 'rgba(74,222,128,0.7)',   // 70% — dim but on-brand
                                textTransform: 'uppercase',
                                marginBottom: 20,
                            }}
                        >
                            The E-Waste Crisis
                        </motion.p>

                        {/* Anchor headline — Bebas Neue, 100% opacity */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 'clamp(64px, 8vw, 104px)',
                                lineHeight: 0.95,
                                color: '#FFFFFF',              // 100% — maximum weight
                                letterSpacing: '0.01em',
                                margin: 0,
                            }}
                        >
                            BE<br />
                            <span style={{ color: '#4ADE80' }}>E-WASTE</span><br />
                            WISE
                        </motion.h1>

                        {/* Sub-headline — DM Sans, 90% opacity */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 18,
                                fontWeight: 400,
                                color: 'rgba(255,255,255,0.9)', // 90%
                                marginTop: 20,
                                marginBottom: 0,
                                letterSpacing: '0.01em',
                            }}
                        >
                            Think Before You Throw.
                        </motion.h2>

                        {/* Body — 60% opacity */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 15,
                                fontWeight: 300,
                                color: 'rgba(255,255,255,0.55)', // 55% — supporting
                                marginTop: 16,
                                lineHeight: 1.7,
                                maxWidth: 420,
                            }}
                        >
                            Join our mission to educate, inspire, and take action against electronic waste pollution — before our planet pays the price.
                        </motion.p>

                        {/* CTA row */}
                        <motion.div
                            className="flex items-center gap-4 mt-10"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                        >
                            <motion.a
                                href="#about"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '12px 28px',
                                    background: '#4ADE80',
                                    color: '#080C10',
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    borderRadius: 8,          // visual rhyme: same 8px radius
                                    textDecoration: 'none',
                                    letterSpacing: '0.03em',
                                }}
                                whileHover={{ scale: 1.04, background: '#22D3EE' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                            >
                                Learn More
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.a>

                            <motion.a
                                href="#recycle"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '11px 24px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 400,
                                    fontSize: 14,
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    textDecoration: 'none',
                                    backdropFilter: 'blur(8px)',
                                }}
                                whileHover={{ borderColor: 'rgba(74,222,128,0.4)', color: '#fff' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.2 }}
                            >
                                Find a Drop-off
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Right: Globe — the star of the show */}
                    <motion.div
                        className="flex-1 flex justify-center items-center"
                        style={{ y: globeY }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <ToxicGlobe mouseX={mousePos.x} mouseY={mousePos.y} />
                    </motion.div>
                </div>

                {/* ── Scroll indicator ── */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <span style={{ fontFamily: "var(--font-tech)", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Scroll</span>
                    <motion.div
                        style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(74,222,128,0.5), transparent)' }}
                        animate={{ scaleY: [0, 1, 0], originY: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>

                {/* ── Custom cursor ── */}
                {/* <motion.div
                    className="fixed pointer-events-none z-50 rounded-full"
                    style={{
                        x: smoothX,
                        y: smoothY,
                        translateX: '-50%',
                        translateY: '-50%',
                        width: 32,
                        height: 32,
                        border: '1.5px solid rgba(74,222,128,0.5)',
                        mixBlendMode: 'screen',
                    }}
                /> */}
                {/* <motion.div
                    className="fixed pointer-events-none z-50 rounded-full"
                    style={{
                        x: mouseX,
                        y: mouseY,
                        translateX: '-50%',
                        translateY: '-50%',
                        width: 6,
                        height: 6,
                        background: '#4ADE80',
                    }}
                /> */}
            </section>
        </>
    )
}

export default AnimatedHero