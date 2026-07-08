'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { Hospital02Icon, Location01Icon } from '@hugeicons/core-free-icons';

interface Region {
  id: string;
  name: string;
  sub: string;
  preview: string;
  clinics: string[];
}

export default function SectionRede() {
  const [activeRegion, setActiveRegion] = useState<string>('centro');

  const regions: Region[] = [
    {
      id: 'centro',
      name: 'Centro',
      sub: 'Centro e arredores',
      preview: 'Centro e arredores',
      clinics: [
        'CEGEMERJ CONSULTORIA E SERVICOS MEDICOS',
        'CLINICA DE MEDICINA NUCLEAR VILLELA PEDRAS',
        'ALERGO AR RIO',
        'RIO LABOR MEDICINA DIAGNÓSTICA',
        'UROLOGIC CENTRO DE DIAGNÓSTICO E TRATAMENTO',
        'GASTROENDO SERVICOS MEDICOS LTDA',
        'INSTITUTO HERMES PARDINI',
        'RX BANDEIRANTES',
        'URGÊNCIAS OFTALMOLÓGICAS NAÇÕES LTDA',
        'MEMORIAL BONSUCESSO',
        'CARDIOS ERGOS CENTRO CARDIOLÓGICO',
        'HOSPITAL MEMORIAL FUAD CHIDID',
        'FISIO PREST LTDA',
        'HOSPITAL IRAJÁ',
        'CONSULTÓRIO DE FONOAUDIOLOGIA PATRICIA GUERRA',
        'SD SUPORTE DIAGNOSTICO EM OFTALMOLOGIA',
        'FISIOLAR CLIN ATEN MED E FISIOTERAPICO',
        'VITTA MOVI REABILITAÇÃO LTDA',
        'CLINICAS REUNIDAS SAO VICTOR',
        'DIMAGEM DIAGNOSTICOS POR IMAGEM',
        'THERAPÊUTICA CLÍNICA E ESTUDOS'
      ]
    },
    {
      id: 'norte',
      name: 'Zona Norte',
      sub: 'Tijuca, Madureira, Méier, Vila da Penha, Cachambi...',
      preview: 'Tijuca, Rocha, Miranda, Madureira, Meier, Vila da Penha, Cachambi, Engenho da Rainha, Engenho de Dentro, Grajaú, Bonsucesso, Penha, Vila Isabel, Campinho...',
      clinics: [
        'CLINICAS REUNIDAS SAO VICTOR (TIJUCA)',
        'HOSPITAL IRAJÁ (IRAJÁ)',
        'LABORATÓRIO BRONSTEIN (MADUREIRA)',
        'CLINICA RADIOLÓGICA DE VILA ISABEL',
        'CENTRO MÉDICO PASTEUR (MÉIER)',
        'ALERGO AR ZONA NORTE',
        'CLINICA OFTALMOLÓGICA DA PENHA',
        'GASTRO CLÍNICA CACHAMBI'
      ]
    },
    {
      id: 'oeste',
      name: 'Zona Oeste',
      sub: 'Bangu, Barra da Tijuca, Campo Grande, Freguesia...',
      preview: 'Bangu, Barra da Tijuca, Campo Grande, Freguesia, Praça Seca, Recreio, Santa Cruz, Taquara, Tanque, Vila Valqueire',
      clinics: [
        'HOSPITAL SÃO MATHEUS (BANGU)',
        'HOSPITAL DE CLÍNICAS SANTA CRUZ',
        'CLINICA DE OLHOS BARRA DA TIJUCA',
        'CENTRO DIAGNÓSTICO CAMPO GRANDE',
        'UNIDADE INTEGRADA DE SAÚDE FREGUESIA',
        'CLINICA PEDIÁTRICA RECREIO',
        'LABORATÓRIO CDC TAQUARA'
      ]
    },
    {
      id: 'sul',
      name: 'Zona Sul',
      sub: 'Botafogo, Copacabana, Flamengo, Gávea, Laranjeiras',
      preview: 'Botafogo, Copacabana, Flamengo, Gávea, Laranjeiras',
      clinics: [
        'HOSPITAL ÊNIO SERRA (LARANJEIRAS)',
        'CLINICA CARDIOLÓGICA COPACABANA',
        'DIAGNOSTICO POR IMAGEM BOTAFOGO',
        'CENTRO OFTALMOLÓGICO IPANEMA',
        'LABORATÓRIO LÂMINA FLAMENGO'
      ]
    },
    {
      id: 'baixada',
      name: 'Baixada Fluminense',
      sub: 'São João de Meriti, Duque de Caxias, Nova Iguaçu...',
      preview: 'São João de Meriti, Duque de Caxias, Nova Iguaçu, Nilópolis, Belford Roxo',
      clinics: [
        'HOSPITAL GERAL PRONTONIL (NOVA IGUAÇU)',
        'HOSPITAL SANTA BRANCA (DUQUE DE CAXIAS)',
        'RIO LABOR MEDICINA DIAGNÓSTICA (NOVA IGUAÇU)',
        'CLINICA DE OLHOS DUQUE DE CAXIAS',
        'CENTRO MÉDICO LIFE IGUAÇU',
        'LABORATÓRIO CDC SÃO JOÃO DE MERITI',
        'CLINICA PEDIÁTRICA BELFORD ROXO'
      ]
    }
  ];

  const currentRegion = regions.find((r) => r.id === activeRegion) || regions[0];

  return (
    <motion.section
      id="rede-credenciada"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full py-16 md:py-24 bg-white font-sans select-none overflow-hidden will-change-transform"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col gap-10">
        
        {/* Top Capsule Badge */}
        <div className="flex justify-center w-full">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10 shadow-sm">
            <HugeiconsIcon icon={Location01Icon} className="size-3.5" />
            <span>Encontre um local credenciado próximo a você</span>
          </div>
        </div>

        {/* Header */}
        <div className="w-full text-center space-y-3 max-w-2xl mx-auto mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
            <div className="overflow-hidden py-0.5 inline-block">
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                className="inline-block"
              >
                Ampla Rede Credenciada
              </motion.span>
            </div>
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed">
            Hospitais, clínicas e laboratórios de excelência. Selecione a sua região para conferir algumas de nossas unidades e parceiros estratégicos do plano Amep Saúde.
          </p>
        </div>

        {/* Layout Grid: Sidebar + List Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full mt-2">
          
          {/* Sidebar Menu (30% width / 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 w-full text-left">
            {regions.map((region) => {
              const isActive = activeRegion === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => setActiveRegion(region.id)}
                  className={`p-5 rounded-2xl border text-left flex flex-col gap-1 transition-all duration-300 relative cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-white border-l-[3.5px] border-l-[#3b2dff] border-y-slate-200/70 border-r-slate-200/70 shadow-sm shadow-[#3b2dff]/3'
                      : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm sm:text-base font-black ${isActive ? 'text-[#3b2dff]' : 'text-slate-700'}`}>
                    {region.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-normal leading-relaxed truncate max-w-full">
                    {region.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List Panel (70% width / 8 cols) */}
          <div className="lg:col-span-8 w-full">
            <div className="w-full bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-6 text-left relative min-h-[420px]">
              
              {/* Header inside Panel */}
              <div className="flex flex-col border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-[#3b2dff]/5 flex items-center justify-center text-[#3b2dff]">
                    <HugeiconsIcon icon={Hospital02Icon} className="size-4.5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    Unidades em destaque: {currentRegion.name}
                  </h3>
                </div>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {currentRegion.preview}
                </p>
              </div>

              {/* Clinics List Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRegion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full"
                >
                  {currentRegion.clinics.map((clinic, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 py-1 select-text hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors duration-200"
                    >
                      <div className="size-5 rounded-full bg-[#3b2dff]/5 flex items-center justify-center text-[#3b2dff] shrink-0 mt-0.5">
                        <svg className="size-3 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-xs font-extrabold text-slate-700 tracking-wide leading-relaxed">
                        {clinic}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}
