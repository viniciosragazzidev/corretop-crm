'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { WhatsappIcon, ArrowRight01Icon, ZapIcon } from '@hugeicons/core-free-icons';

interface SectionCtaProps {
  variant?: 'middle' | 'bottom';
  title?: string;
  description?: string;
}

export default function SectionCta({ variant = 'middle', title, description }: SectionCtaProps) {
  const isBottom = variant === 'bottom';

  // Smooth scroll helper
  const handleScrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('cotacao') || document.getElementById('simulador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // WhatsApp link
  const whatsappUrl = `https://wa.me/5521964469750?text=${encodeURIComponent(
    'Olá! Estava navegando no site da Venacor e gostaria de falar com um consultor sobre os planos de saúde.'
  )}`;

  // Default content based on variant
  const defaultTitle = isBottom
    ? 'Tome a melhor decisão para sua saúde e bolso.'
    : 'Pronto para simular seu plano em segundos?';

  const defaultDesc = isBottom
    ? 'Nossa equipe de consultores especializados está pronta para analisar seu perfil e propor a melhor combinação de preço e cobertura.'
    : 'Compare preços de forma 100% online ou receba suporte personalizado de quem realmente entende do assunto.';

  const displayTitle = title || defaultTitle;
  const displayDesc = description || defaultDesc;

  return (
    <section className="w-full py-16 md:py-20 font-sans select-none overflow-hidden bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className={`relative rounded-[2.5rem] p-10 md:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 ${
            isBottom
              ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]'
              : 'bg-slate-50/50 border border-slate-100/80 text-slate-900 shadow-[0_20px_50px_-25px_rgba(59,45,255,0.05)]'
          }`}
        >
          {/* Background decorative glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {isBottom ? (
              <>
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#3b2dff]/20 blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-slate-800/30 blur-[100px]" />
              </>
            ) : (
              <>
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#3b2dff]/5 blur-[80px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-slate-100 blur-[80px]" />
              </>
            )}
          </div>

          {/* Left Column: Text */}
          <div className="relative z-10 flex flex-col items-start text-left max-w-2xl space-y-4">
            {/* Standard tag badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className={`size-2 rounded-full ${isBottom ? 'bg-white' : 'bg-[#3b2dff]'}`} />
              <span className={isBottom ? 'text-slate-400' : 'text-slate-500'}>
                {isBottom ? 'Atendimento Exclusivo' : 'Cotação Imediata'}
              </span>
            </div>

            <h3
              className={`text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] ${
                isBottom ? 'text-white' : 'text-[#111827]'
              }`}
            >
              {displayTitle}
            </h3>

            <p
              className={`text-sm md:text-base font-light leading-relaxed ${
                isBottom ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {displayDesc}
            </p>
          </div>

          {/* Right Column: CTA Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            {/* Button 1: Quotation */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={handleScrollToQuote}
              className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm cursor-pointer transition-shadow duration-200 w-full sm:w-auto ${
                isBottom
                  ? 'bg-white text-slate-950 hover:bg-slate-50 shadow-lg shadow-white/5'
                  : 'bg-[#3b2dff] text-white hover:bg-[#2d20e0] shadow-lg shadow-[#3b2dff]/25'
              }`}
            >
              <span>Fazer Cotação Rápida</span>
              <HugeiconsIcon icon={ZapIcon} className="size-4 shrink-0" />
            </motion.button>

            {/* Button 2: Consultant */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => window.open(whatsappUrl, '_blank')}
              className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-200 w-full sm:w-auto border ${
                isBottom
                  ? 'border-slate-800 bg-slate-900/50 text-white hover:bg-slate-950'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <HugeiconsIcon icon={WhatsappIcon} className="size-4 shrink-0 text-emerald-500" />
              <span>Falar com Consultores</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 shrink-0 opacity-40" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
