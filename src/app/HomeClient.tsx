'use client'

import React, { useState, useEffect, useRef } from 'react'
import Hero from "@/components/Hero";
import About from "@/components/About";
import EducationHub from "@/components/EducationHub";
import InteractiveTools from "@/components/InteractiveTools";
import Locator from "@/components/Locator";
import Community from "@/components/Community";

const SECTIONS = [
  { id: 'Home' },
  { id: 'About' },
  { id: 'Education' },
  { id: 'Tools' },
  { id: 'Locator' },
  { id: 'Community' },
]

export default function HomeClient() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex(sec => sec.id === entry.target.id)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        root: container,
        threshold: 0.5 // Trigger when 50% of the section is visible
      }
    )

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main
      ref={containerRef}
      id="scroll-container"
      className="w-full h-screen overflow-y-auto snap-y snap-mandatory bg-[#080C10] scroll-smooth"
    >
      <style>{`
        #scroll-container::-webkit-scrollbar {
          display: none;
        }
        #scroll-container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      <div id="Home" className="w-full h-screen snap-start snap-always">
        <Hero />
      </div>
      <div id="About" className="w-full h-screen snap-start snap-always">
        <About />
      </div>
      <div id="Education" className="w-full h-screen snap-start snap-always">
        <EducationHub />
      </div>
      <div id="Tools" className="w-full h-screen snap-start snap-always">
        <InteractiveTools />
      </div>
      <div id="Locator" className="w-full h-screen snap-start snap-always">
        <Locator />
      </div>
      <div id="Community" className="w-full h-screen snap-start snap-always">
        <Community />
      </div>

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className="group relative flex items-center justify-center p-2 cursor-pointer"
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
