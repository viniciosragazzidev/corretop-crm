'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CorretoresPage() {
  const [activeSubTab, setActiveSubTab] = useState('Visão Geral');
  const subTabs = ['Visão Geral', 'Desempenho', 'Comissões'];

  return (
    <div className="p-6 lg:p-10 space-y-6 select-none text-left flex flex-col h-full bg-[#fafafa]">
      
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-neutral-200/60 pb-1.5 w-full gap-5">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                isActive ? 'text-neutral-900 font-extrabold' : 'text-neutral-400 hover:text-neutral-750'
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="corretoresSubTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b2dff]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main clean area with styled card */}
      <div className="bg-white border border-neutral-200/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-[0_1px_2px_rgba(0,0,0,0.01)] py-16 mt-4">
        <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-3xs">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="font-extrabold text-neutral-900 text-base mt-4">Nenhum Corretor Selecionado</h3>
        <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-sm mt-1">
          A lista e acompanhamento de metas dos corretores ativos aparecerá descrita de acordo com o filtro.
        </p>
      </div>

    </div>
  );
}
