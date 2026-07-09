'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon,
  WhatsappIcon,
  Search01Icon,
  UserIcon
} from '@hugeicons/core-free-icons';
import { CRMProvider, useCRM, UserRole } from './crm-context';

// Custom inline SVG icons to ensure visual perfection and zero dependencies
const OverviewIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const KanbanIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16M4 12h10M4 19h16" />
    <circle cx="17" cy="12" r="2" />
  </svg>
);

function CRMMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole, searchQuery, setSearchQuery } = useCRM();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/crm', label: 'Overview', icon: <OverviewIcon /> },
    { href: '/crm/leads', label: 'Pipeline / Kanban', icon: <KanbanIcon /> },
    { href: '/crm/chat', label: 'Central de Chat', icon: <HugeiconsIcon icon={WhatsappIcon} className="size-5 text-emerald-500" /> },
    { href: '/crm/corretores', label: 'Corretores', icon: <HugeiconsIcon icon={UserGroupIcon} className="size-5" />, adminOnly: true }
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case '/crm': return 'Panorama Central';
      case '/crm/leads': return 'Funil de Vendas';
      case '/crm/chat': return 'Central de Atendimento (Omnichannel)';
      case '/crm/corretores': return 'Gerenciamento de Equipe';
      default: return 'CRM Leads';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 flex overflow-hidden">
      
      {/* 1. Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/60 flex-col shrink-0 select-none">
        {/* Logo Section */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-[#3b2dff] tracking-tight hover:scale-[1.01] transition-transform flex items-center gap-2">
            <span className="size-6 bg-[#3b2dff] text-white rounded-lg flex items-center justify-center font-bold text-xs select-none">V</span>
            <span className="text-slate-900 font-extrabold text-base">Venacor <span className="text-slate-400 font-light text-xs uppercase tracking-widest ml-0.5">CRM</span></span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            if (item.adminOnly && role !== 'ADMIN') return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10 shadow-[0_4px_12px_rgba(59,45,255,0.03)]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className={`${isActive ? 'text-[#3b2dff]' : 'text-slate-400'} shrink-0`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Role indicator / back to site) */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
            <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 select-none">
              <HugeiconsIcon icon={UserIcon} className="size-4" />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Perfil Ativo</span>
              <span className="font-extrabold text-slate-800 text-xs truncate mt-0.5">
                {role === 'ADMIN' ? 'Gerente Geral' : 'Corretor Comercial'}
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer block"
          >
            Voltar ao Site Principal
          </Link>
        </div>
      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        
        {/* Top Header bar */}
        <header className="h-20 bg-white border-b border-slate-200/50 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
          
          {/* Left info: Route name or Search bar */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            <div className="flex flex-col text-left">
              <span className="text-[9px] text-[#3b2dff] font-black uppercase tracking-wider leading-none hidden sm:block">Venacor CRM</span>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Right actions: Role toggler, search, indicators */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Input (Global-like filter) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Busca rápida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#3b2dff] text-xs font-semibold transition-all outline-none w-48 placeholder:text-slate-400 focus:w-60 shadow-2xs"
              />
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
            </div>

            {/* Role Switcher Toggler */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-2xl p-1 bg-slate-50 select-none shadow-3xs">
              <button
                onClick={() => setRole('ADMIN')}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-white text-[#3b2dff] shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setRole('USER')}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  role === 'USER'
                    ? 'bg-white text-[#3b2dff] shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Corretor
              </button>
            </div>

            {/* Notification Badge indicator */}
            <div className="relative size-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors select-none shrink-0 cursor-pointer">
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#3b2dff]" />
            </div>
          </div>
        </header>

        {/* 3. Screen Contents */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Mobile Sliding Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link href="/" className="font-extrabold text-[#3b2dff] tracking-tight flex items-center gap-2">
                  <span className="size-6 bg-[#3b2dff] text-white rounded-lg flex items-center justify-center font-bold text-xs select-none">V</span>
                  <span className="text-slate-900 font-extrabold text-base">Venacor <span className="text-slate-400 font-light text-xs uppercase tracking-widest ml-0.5">CRM</span></span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  if (item.adminOnly && role !== 'ADMIN') return null;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10 shadow-[0_4px_12px_rgba(59,45,255,0.03)]'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className={isActive ? 'text-[#3b2dff]' : 'text-slate-400'}>{item.icon}</div>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Profile & Back */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                  <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <HugeiconsIcon icon={UserIcon} className="size-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Perfil Ativo</span>
                    <span className="font-extrabold text-slate-800 text-xs mt-0.5">
                      {role === 'ADMIN' ? 'Gerente Geral' : 'Corretor Comercial'}
                    </span>
                  </div>
                </div>
                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Voltar ao Site
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <CRMMainLayout>{children}</CRMMainLayout>
    </CRMProvider>
  );
}
