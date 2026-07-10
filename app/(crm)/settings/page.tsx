'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('Geral');
  const subTabs = ['Geral', 'Integrações', 'Segurança', 'Notificações'];

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">

      {/* Sub-navigation tabs */}
      <div className="flex border-b border-neutral-200/60 pb-1.5 w-full gap-5">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-2.5 text-xs transition-all relative cursor-pointer ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-600 font-normal'
                }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="settingsSubTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b2dff]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main clean area with styled card */}
      <div className="bg-[#f8f9fa73]/40 border border-slate-100 bg-[#f8f9fa73]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-none py-16 mt-4">
        <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-none">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-neutral-800 mt-4">Painel de Configurações</h3>
        <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-sm mt-1.5">
          Gerencie permissões, dados do perfil, integrações e notificações do seu CRM Corretop.
        </p>
      </div>

    </div>
  );
}
