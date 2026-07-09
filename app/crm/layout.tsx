'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Icons for top right matching screenshot
const ChatIcon = () => (
  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BellIcon = () => (
  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CloudIcon = () => (
  <svg className="size-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58" />
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
    { href: '/crm/resume', label: 'Dashboard' },
    { href: '/crm/leeds', label: 'Leeds' },
    { href: '/crm/chat', label: 'Chat' },
    { href: '/crm/corretores', label: 'Corretores' },
    { href: '/crm/settings', label: 'Settings' },
  ];

  const getPageLabel = () => {
    switch (pathname) {
      case '/crm/resume': return 'Dashboard';
      case '/crm/leeds': return 'Leeds';
      case '/crm/chat': return 'Chat';
      case '/crm/corretores': return 'Corretores';
      case '/crm/settings': return 'Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 flex flex-col overflow-x-hidden select-none">
      
      {/* 1. Horizontal Navbar on Top */}
      <nav className="h-16 bg-white border-b border-slate-200/60 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0 w-full">
        {/* Brand & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-black text-slate-900 tracking-tight hover:scale-[1.01] transition-all flex items-center gap-1">
            <span className="text-[#3b2dff] font-extrabold text-lg">Venacor</span>
            <span className="text-[#3b2dff] font-black text-lg">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold transition-all py-1.5 relative ${
                    isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="topNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b2dff]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden lg:flex items-center w-80 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-4 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#3b2dff] text-xs font-semibold outline-none transition-colors"
          />
          <svg className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>

          {/* Action Icons */}
          <div className="hidden sm:flex items-center gap-3.5 text-slate-400">
            <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-750 cursor-pointer">
              <ChatIcon />
            </button>
            <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-750 relative cursor-pointer">
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
            </button>
            <button className="p-1 rounded-lg hover:bg-slate-50 hover:text-slate-750 cursor-pointer">
              <SettingsIcon />
            </button>
          </div>

          {/* Add Widget Button (primary color `#3b2dff`) */}
          <button className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer select-none active:scale-[0.98]">
            Add Widget
          </button>

          {/* Avatar bubble */}
          <div className="size-8 rounded-full bg-[#3b2dff] text-white border border-[#3b2dff]/20 font-black text-xs flex items-center justify-center shadow-3xs cursor-pointer select-none">
            V
          </div>
        </div>
      </nav>

      {/* 2. Secondary breadcrumbs bar */}
      <div className="bg-white border-b border-slate-200/50 py-2.5 px-6 lg:px-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Home</span>
          <span className="text-slate-300">/</span>
          <span>CRM</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#3b2dff] font-extrabold">{getPageLabel()}</span>
        </div>

        <div className="flex items-center text-[10px] font-bold text-slate-400">
          <CloudIcon />
          <span>Updated 2 minutes ago</span>
        </div>
      </div>

      {/* 3. Main content area */}
      <main className="flex-1 w-full bg-[#f8fafc]">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900 cursor-pointer"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full bg-white max-h-[60vh] flex flex-col p-6 shadow-2xl z-10 text-left rounded-b-3xl border-b border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="text-[#3b2dff] font-black text-base">Venacor.</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Mobile links */}
              <nav className="flex flex-col py-4 gap-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer block"
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
