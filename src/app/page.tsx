'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Hero from "@/components/Hero";
import About from "@/components/About";
import EducationHub from "@/components/EducationHub";
import InteractiveTools from "@/components/InteractiveTools";
import Locator from "@/components/Locator";
import Community from "@/components/Community";

const SECTIONS = [
  { id: 'Home', component: Hero },
  { id: 'About', component: About },
  { id: 'Education', component: EducationHub },
  { id: 'Tools', component: InteractiveTools },
  { id: 'Locator', component: Locator },
  { id: 'Community', component: Community },
]

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const isAnimating = useRef(false)
  const touchStart = useRef(0)

  const handleScroll = (direction: 'next' | 'prev') => {
    if (isAnimating.current) return

    if (direction === 'next' && activeIndex < SECTIONS.length - 1) {
      isAnimating.current = true
      setPrevIndex(activeIndex)
      setActiveIndex(prev => prev + 1)
      setTimeout(() => {
        isAnimating.current = false
      }, 1000)
    } else if (direction === 'prev' && activeIndex > 0) {
      isAnimating.current = true
      setPrevIndex(activeIndex)
      setActiveIndex(prev => prev - 1)
      setTimeout(() => {
        isAnimating.current = false
      }, 1000)
    }
  }

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 15) return // Filter small scroll wheel movements/drifts
      
      if (e.deltaY > 0) {
        handleScroll('next')
      } else {
        handleScroll('prev')
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        handleScroll('next')
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        handleScroll('prev')
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientY
      const diff = touchStart.current - touchEnd
      if (Math.abs(diff) > 50) { // Swipe threshold
        if (diff > 0) {
          handleScroll('next')
        } else {
          handleScroll('prev')
        }
      }
    }

    const container = document.getElementById('scroll-container')
    if (container) {
      container.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('keydown', onKeyDown, { passive: false })
      container.addEventListener('touchstart', onTouchStart, { passive: true })
      container.addEventListener('touchend', onTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', onWheel)
        window.removeEventListener('keydown', onKeyDown)
        container.removeEventListener('touchstart', onTouchStart)
        container.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [activeIndex])

  return (
    <main
      id="scroll-container"
      className="relative w-full h-screen overflow-hidden bg-[#080C10] select-none"
    >
      {SECTIONS.map((sec, idx) => {
        const Comp = sec.component
        const isActive = idx === activeIndex
        
        // Virtualization: Only render active, previous active (for transition), or adjacent sections
        const isRendered = idx === activeIndex || idx === prevIndex || Math.abs(idx - activeIndex) <= 1

        if (!isRendered) return null

        return (
          <motion.div
            key={sec.id}
            className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
            style={{
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 10 : 0,
            }}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.98,
              y: isActive ? 0 : (idx > activeIndex ? 15 : -15),
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier
            }}
          >
            <Comp />
          </motion.div>
        )
      })}

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => {
              if (idx === activeIndex) return
              setPrevIndex(activeIndex)
              setActiveIndex(idx)
            }}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Go to section ${sec.id}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'bg-[#4ADE80] scale-150 shadow-[0_0_10px_#4ADE80]'
                  : 'bg-white/20 group-hover:bg-white/50'
              }`}
            />
            {/* Tooltip */}
            <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-mono text-[9px] text-white/50 uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-white/5 whitespace-nowrap">
              {sec.id}
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}
