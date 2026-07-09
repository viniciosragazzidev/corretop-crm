'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ResumePage() {
  return (
    <div className="p-6 lg:p-10 space-y-6 select-none text-left flex flex-col h-full bg-[#f8fafc]">
      
      {/* 1. Header description card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl bg-white border border-slate-200/50 rounded-2xl p-6 shadow-3xs space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
          Painel Geral
        </div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
          Esta é a página de visão geral do seu CRM. Em breve você poderá visualizar relatórios e resumos analíticos detalhados nesta seção.
        </p>
      </motion.div>

      {/* 2. Grid skeleton placeholders to resemble card structures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 h-40 flex flex-col justify-between shadow-3xs">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
          </div>
          <div>
            <div className="w-1/3 h-4 bg-slate-100 rounded-md" />
            <div className="w-2/3 h-3 bg-slate-50 rounded-md mt-2" />
          </div>
        </div>
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 h-40 flex flex-col justify-between shadow-3xs">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div>
            <div className="w-1/2 h-4 bg-slate-100 rounded-md" />
            <div className="w-1/3 h-3 bg-slate-50 rounded-md mt-2" />
          </div>
        </div>
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 h-40 flex flex-col justify-between shadow-3xs">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </div>
          <div>
            <div className="w-1/4 h-4 bg-slate-100 rounded-md" />
            <div className="w-1/2 h-3 bg-slate-50 rounded-md mt-2" />
          </div>
        </div>
      </div>

    </div>
  );
}
