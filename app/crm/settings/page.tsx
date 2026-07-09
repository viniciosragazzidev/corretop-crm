'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('Geral');
  const subTabs = ['Geral', 'Integrações', 'Segurança', 'Notificações'];

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
                  layoutId="settingsSubTabUnderline"
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
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <h3 className="font-extrabold text-slate-900 text-base mt-4">Painel de Configurações</h3>
        <p className="text-slate-400 text-xs font-light leading-relaxed max-w-sm mt-1">
          Gerencie permissões, dados do perfil, integrações e notificações do seu CRM Venacor.
        </p>
      </div>

    </div>
  );
}
