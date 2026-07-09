'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LeedsPage() {
  const [activeSubTab, setActiveSubTab] = useState('Ativos');
  const subTabs = ['Ativos', 'Novos', 'Perdidos', 'Em Negociação'];

  return (
    <div className="p-6 lg:p-10 space-y-6 select-none text-left flex flex-col h-full bg-[#f8fafc]">
      
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200/60 pb-1.5 w-full gap-5">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="leedsSubTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main clean area with styled card */}
      <div className="bg-white border border-slate-200/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-3xs py-16 mt-4">
        <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-3xs">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="13" y2="13" />
          </svg>
        </div>
        <h3 className="font-extrabold text-slate-900 text-base mt-4">Nenhum Lead Selecionado</h3>
        <p className="text-slate-400 text-xs font-light leading-relaxed max-w-sm mt-1">
          Selecione uma aba ou utilize a barra de pesquisa superior para gerenciar seus contatos comerciais.
        </p>
      </div>

    </div>
  );
}
