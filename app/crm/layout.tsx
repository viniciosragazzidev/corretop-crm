'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Beautiful SVG Icons matching the AnVuro style
const CollapseIcon = () => (
  <svg className="size-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const ResumeIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const LeedsIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="13" x2="13" y2="13" />
  </svg>
);

const ChatIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CorretoresIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
    { category: 'Main', items: [
      { href: '/crm/resume', label: 'Dashboard', icon: <ResumeIcon /> },
      { href: '/crm/leeds', label: 'Leeds', icon: <LeedsIcon />, badge: 12 },
      { href: '/crm/chat', label: 'Chat', icon: <ChatIcon />, badge: 3 },
    ]},
    { category: 'General', items: [
      { href: '/crm/corretores', label: 'Corretores', icon: <CorretoresIcon /> },
      { href: '/crm/settings', label: 'Settings', icon: <SettingsIcon /> },
    ]}
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case '/crm/resume': return 'Dashboard';
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
      <aside className="hidden lg:flex w-60 bg-white border-r border-slate-200/60 flex-col shrink-0 select-none">
        {/* Brand Section */}
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-[#111827] tracking-tight flex items-center gap-1.5">
              <svg className="size-5.5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="font-extrabold text-base tracking-tight text-slate-900">Venacor</span>
            </span>
          </div>
          <button className="p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
            <CollapseIcon />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {navItems.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              {group.category !== 'Main' && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block pb-1">
                  {group.category}
                </span>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 shadow-3xs'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={isActive ? 'text-slate-900' : 'text-slate-400'}>
                          {item.icon}
                        </div>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          isActive 
                            ? 'bg-white text-slate-800' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-350 text-slate-550 hover:text-slate-850 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer block"
          >
            Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col overflow-hidden h-[100dvh]">
        
        {/* Top Header bar */}
        <header className="h-20 bg-white border-b border-slate-200/50 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40 shrink-0 select-none">
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

            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          </div>

          {/* Right Header items matching screenshot */}
          <div className="flex items-center gap-5">
            {/* Header icons: Link, Filter/Tune */}
            <div className="flex items-center gap-3 text-slate-400">
              <button className="p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-700 cursor-pointer">
                <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
              <button className="p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-700 cursor-pointer">
                <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </button>
            </div>

            {/* Overlapping active users avatar stack */}
            <div className="flex items-center -space-x-2">
              <div className="size-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black">JM</div>
              <div className="size-7 rounded-full bg-[#3b2dff]/10 border-2 border-white text-[#3b2dff] flex items-center justify-center text-[10px] font-black">TH</div>
              <div className="size-7 rounded-full bg-emerald-100 border-2 border-white text-emerald-700 flex items-center justify-center text-[10px] font-black">JU</div>
              <button className="size-7 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer select-none">
                +
              </button>
            </div>

            {/* CTA action button */}
            <button className="bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer active:scale-[0.98]">
              + Add Customer
            </button>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900 cursor-pointer"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col p-6 shadow-2xl z-10 text-left"
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
              <nav className="flex-1 py-6 space-y-6 overflow-y-auto">
                {navItems.map((group, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {group.category !== 'Main' && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block">
                        {group.category}
                      </span>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-slate-100 text-slate-900 shadow-3xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={isActive ? 'text-slate-900' : 'text-slate-400'}>{item.icon}</div>
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100">
                <Link
                  href="/"
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-350 text-slate-550 hover:text-slate-850 text-center text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer block"
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
