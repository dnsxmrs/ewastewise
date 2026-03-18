'use client'

import React from 'react'

const Locator: React.FC = () => {
  return (
    <section id="recycle" className="relative py-24 bg-[#080C10] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="lg:flex lg:items-end lg:justify-between mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#A78BFA] uppercase">
              Facilitation Pillar
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-white">
              LOCATOR & <br/><span className="text-[#A78BFA]">ACTION</span> CENTER
            </h2>
            <p className="font-body text-white/50 text-lg font-light">
              Providing environmental facilitation through a centralized directory of drop-off points.
            </p>
          </div>
          
          <div className="mt-8 lg:mt-0 font-mono text-[11px] text-[#A78BFA] border border-[#A78BFA]/30 px-4 py-2 rounded-full uppercase tracking-wider">
            Coming Soon: Map API Integration
          </div>
        </div>

        {/* Placeholder Map Area */}
        <div className="w-full h-[500px] border border-white/10 rounded-xl bg-white/5 flex items-center justify-center italic font-body text-white/20 opacity-40">
          Placeholder: Interactive Collection Point Map
        </div>
      </div>
    </section>
  )
}

export default Locator
