'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Clean inline SVG icons matching system taste
const ResumeIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const LeedsIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="13" x2="13" y2="13" />
  </svg>
);

const ChatIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CorretoresIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/crm/resume', label: 'Resume', icon: <ResumeIcon /> },
    { href: '/crm/leeds', label: 'Leeds', icon: <LeedsIcon /> },
    { href: '/crm/chat', label: 'Chat', icon: <ChatIcon /> },
    { href: '/crm/corretores', label: 'Corretores', icon: <CorretoresIcon /> },
    { href: '/crm/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case '/crm/resume': return 'Resume';
      case '/crm/leeds': return 'Leeds';
      case '/crm/chat': return 'Chat';
      case '/crm/corretores': return 'Corretores';
      case '/crm/settings': return 'Settings';
      default: return 'CRM';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 flex overflow-hidden">
      
      {/* 1. Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/60 flex-col shrink-0 select-none">
        {/* Logo Section */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center">
          <Link href="/" className="font-extrabold text-[#3b2dff] tracking-tight hover:scale-[1.01] transition-transform flex items-center gap-2">
            <span className="size-6 bg-[#3b2dff] text-white rounded-lg flex items-center justify-center font-bold text-xs select-none">V</span>
            <span className="text-slate-900 font-extrabold text-base">Venacor <span className="text-slate-400 font-light text-xs uppercase tracking-widest ml-0.5">CRM</span></span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-550 hover:text-slate-850 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer block"
          >
            Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        
        {/* Top Header bar */}
        <header className="h-20 bg-white border-b border-slate-200/50 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-555 hover:text-slate-800 shrink-0 cursor-pointer"
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

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
              Sistema Ativo
            </span>
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
                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-550 hover:text-slate-850 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
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
