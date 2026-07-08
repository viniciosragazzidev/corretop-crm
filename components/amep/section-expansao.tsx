'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SectionExpansao() {
  const cidades = [
    'Nova Iguaçu',
    'Duque de Caxias',
    'Rio de Janeiro',
    'Cabo Frio',
    'Arraial do Cabo',
    'São Pedro da Aldeia',
    'Armação de Búzios',
    'Niterói',
    'São Gonçalo',
    'Belford Roxo',
    'Nilópolis',
    'São João de Meriti',
    'Itaboraí',
    'Maricá',
    'Rio das Ostras',
    'Casimiro de Abreu',
    'Campos dos Goytacazes',
    'Petrópolis',
    'Saquarema',
    'Rio Bonito',
    'Iguaba Grande'
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 150,
        damping: 18
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full py-16 md:py-24 bg-slate-50/50 border-t border-b border-slate-100 font-sans select-none overflow-hidden will-change-transform"
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col gap-10">
        
        {/* Header */}
        <div className="w-full text-left space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="size-2 rounded-full bg-[#3b2dff]" />
            <span>Cobertura Completa</span>
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
                Amep Saúde: Expansão em 21 Cidades no Rio
              </motion.span>
            </div>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-2xl"
          >
            Sua rotina tem vista pro paraíso? Sua saúde também precisa estar à altura com o plano Amep Saúde. Na Região dos Lagos ou no Grande Rio, viver bem também é se cuidar.
          </motion.p>
        </div>

        {/* Grid de Cidades */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap gap-2.5 w-full justify-start max-w-5xl"
        >
          {cidades.map((cidade, index) => (
            <motion.span
              key={index}
              variants={badgeVariants}
              whileHover={{ scale: 1.03 }}
              className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#3b2dff] hover:border-[#3b2dff]/30 shadow-sm cursor-default transition-colors duration-200"
            >
              {cidade}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}
