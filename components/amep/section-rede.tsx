'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Hospital02Icon, MicroscopeIcon } from '@hugeicons/core-free-icons';

export default function SectionRede() {
  const hospitais = [
    {
      name: 'Hospital Geral Prontonil',
      region: 'Nova Iguaçu',
      desc: 'Pronto atendimento Adulto e Pediátrico com infraestrutura moderna na Baixada.'
    },
    {
      name: 'Hospital Santa Branca',
      region: 'Duque de Caxias',
      desc: 'Atendimento de emergência e consultas focado em Adultos.'
    },
    {
      name: 'Hospital São Matheus',
      region: 'Bangu',
      desc: 'Suporte clínico completo com urgência Adulto e Pediátrico 24h.'
    },
    {
      name: 'Hospital Ênio Serra & Hospital São Victor',
      region: 'Laranjeiras / Tijuca',
      desc: 'Pontos estratégicos de urgência e emergência na Zona Sul e Zona Norte.'
    },
    {
      name: 'Hospital de Clínicas Santa Cruz & Hospital Irajá',
      region: 'Santa Cruz / Irajá',
      desc: 'Urgência Adulto e Pediátrico com excelente cobertura e médicos locais.'
    }
  ];

  const laboratorios = [
    'Riolabor Medicina Diagnóstica',
    'Dimagem Diagnóstico por Imagem',
    'Centro Médico Life Lagos',
    'Laboratório CDC'
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 150,
        damping: 20
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full py-16 md:py-24 bg-white font-sans select-none overflow-hidden will-change-transform"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col gap-12 md:gap-16">
        
        {/* Header */}
        <div className="w-full text-left space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="size-2 rounded-full bg-[#3b2dff]" />
            <span>Rede Credenciada</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
            <div className="overflow-hidden py-0.5">
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="inline-block"
              >
                Parceiros de Urgência e Exames.
              </motion.span>
            </div>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-xl"
          >
            Rede selecionada de hospitais gerais e laboratórios de imagem para seu atendimento completo.
          </motion.p>
        </div>

        {/* Hospitais Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left: Hospitais (7 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5 text-left">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2">Hospitais de Destaque</h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
            >
              {hospitais.map((hosp, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white border border-slate-200/50 px-2 py-0.5 rounded-md">
                      {hosp.region}
                    </span>
                    <HugeiconsIcon icon={Hospital02Icon} className="size-4 text-[#3b2dff]/60" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight mt-1">{hosp.name}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed mt-0.5">{hosp.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Laboratórios (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5 text-left lg:sticky lg:top-24">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2">Laboratórios e Imagem</h3>
            
            <div className="flex flex-col gap-3.5 w-full">
              {laboratorios.map((lab, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 180, damping: 20 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100/50 rounded-xl"
                >
                  <div className="size-8 rounded-lg bg-[#3b2dff]/5 flex items-center justify-center text-[#3b2dff]/70 shrink-0">
                    <HugeiconsIcon icon={MicroscopeIcon} className="size-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-700">{lab}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}
