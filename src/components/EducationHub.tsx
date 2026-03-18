'use client'

import React from 'react'

const EducationHub: React.FC = () => {
  return (
    <section id="education" className="relative py-24 bg-[#080C10] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col gap-4 mb-16">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#4ADE80] uppercase">
            Awareness Pillar
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            EDUCATIONAL <span className="text-[#4ADE80]">HUB</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg font-light">
            Bridging the gap in e-waste awareness through detailed hazard analysis and environmental impact reports.
          </p>
        </div>

        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-32 border border-white/5 rounded-lg bg-white/2 flex items-center justify-center italic font-body text-white/30"
            >
              Placeholder: Awareness Module {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EducationHub
