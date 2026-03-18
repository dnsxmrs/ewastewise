'use client'

import React from 'react'

const InteractiveTools: React.FC = () => {
  return (
    <section id="tools" className="relative py-24 bg-[#0A0F14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col gap-4 mb-16 items-center text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#22D3EE] uppercase">
            Engagement Pillar
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            INTERACTIVE <span className="text-[#22D3EE]">TOOLS</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg font-light">
            Interactive modules designed to measure and improve your electronic waste management behavior.
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="w-full max-w-4xl mx-auto aspect-video border border-[#22D3EE]/20 rounded-2xl bg-[#22D3EE]/5 flex items-center justify-center italic font-body text-white/30 opacity-40">
          Placeholder: Quiz & Impact Calculator Module
        </div>
      </div>
    </section>
  )
}

export default InteractiveTools
