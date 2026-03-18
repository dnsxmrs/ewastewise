'use client'

import React from 'react'

const Community: React.FC = () => {
  return (
    <section id="community" className="relative py-24 bg-[#0A0F14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col gap-4 mb-16 items-center text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#F59E0B] uppercase">
            Social Influence
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white">
            COMMUNITY <span className="text-[#F59E0B]">PLEDGE</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg font-light">
            Leveraging social commitment to drive collective change in e-waste management habits.
          </p>
        </div>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-40">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-32 border border-white/5 rounded-lg bg-white/2 flex items-center justify-center italic font-body text-white/30"
            >
              Pledge Wall Card {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Community
