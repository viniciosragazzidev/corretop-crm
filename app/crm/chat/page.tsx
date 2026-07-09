'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  const [activeSubTab, setActiveSubTab] = useState('Não Lidos');
  const subTabs = ['Não Lidos', 'Em Andamento', 'Agendados', 'Histórico'];

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
                  layoutId="chatSubTabUnderline"
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
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="font-extrabold text-neutral-900 text-base mt-4">Nenhuma Conversa Ativa</h3>
        <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-sm mt-1">
          As conversas integradas do WhatsApp aparecerão listadas de acordo com as abas superiores selecionadas.
        </p>
      </div>

    </div>
  );
}
