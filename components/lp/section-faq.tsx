'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: 'Eu tenho apenas um MEI ou CNPJ pequeno. Consigo contratar com desconto?',
    answer: 'Com certeza. Para garantir o menor preço através da tabela empresarial (com descontos de até 35%), basta possuir um CNPJ ou MEI ativo. Na modalidade MEI (de 2 a 29 vidas), o titular entra obrigatoriamente no contrato, mas os demais dependentes não precisam ter vínculo empregatício — você pode incluir parentes, colaboradores ou qualquer outra pessoa de sua escolha. Esta é a forma mais inteligente de pagar menos pelo mesmo atendimento.'
  },
  {
    question: 'Como funciona o processo de contratação? Preciso ir até uma agência física?',
    answer: 'Não há necessidade. Todo o processo de análise de documentos, preenchimento de propostas e assinatura do contrato é feito de forma 100% digital e segura para poupar o seu tempo. No entanto, como a Venancor é uma corretora consolidada com sede física estruturada no Centro de Nova Iguaçu, você tem a segurança extra de contar com suporte humano e presencial sempre que precisar no pós-venda, sem ficar preso a robôs de atendimento.'
  },
  {
    question: 'O plano cobre consultas e tratamentos fora da minha região?',
    answer: 'Isso depende estritamente do modelo e da abrangência que você escolher. Nós trabalhamos tanto com planos de abrangência regional (focados no atendimento de excelência na Baixada Fluminense e Grande Rio) quanto com planos de abrangência nacional premium. Além disso, opções como a Amep Saúde contam com projetos de expansão cobrindo mais de 21 cidades do estado, incluindo a Região dos Lagos. Nossa consultoria isenta avalia a rotina da sua família ou da sua equipe para indicar o modelo com o melhor custo-benefício.'
  },
  {
    question: 'Já tenho outro plano de saúde. Consigo migrar aproveitando minhas carências?',
    answer: 'Sim, é perfeitamente possível através do processo de compra ou redução de carência. Nós analisamos detalhadamente o tempo que você permaneceu no seu plano de saúde anterior (exigindo-se a permanência a partir de 6 meses no convênio anterior para determinadas operadoras) e a categoria dele para reduzir ou zerar os prazos de espera regulamentares na sua nova escolha.'
  },
  {
    question: 'O que está incluso em um plano de saúde ambulatorial e quais são as carências?',
    answer: 'O plano ambulatorial garante o direito completo a consultas nas especialidades médicas, exames complementares e atendimentos de urgência e emergência com repouso de até 12 horas em enfermaria, funcionando inteiramente sem franquia e sem coparticipação. Prazos regulamentares de carência incluem 24 horas para urgência/emergência, 30 dias para consultas e exames simples, e 180 dias para exames de alta complexidade — contudo, promovemos campanhas comerciais frequentes com o benefício de Carência ZERO para consultas nas redes próprias.'
  }
];

export default function SectionFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 md:py-32 font-sans bg-white relative">
      <div className="w-full max-w-[800px] mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Pílula / Tag Superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3b2dff]/5 border border-[#3b2dff]/10 text-[#3b2dff] mb-6">
          <span className="text-sm">💬</span>
          <span className="text-xs font-bold uppercase tracking-widest">Dúvidas Frequentes</span>
        </div>

        {/* Headlines */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-[1.15] mb-4">
            Tudo o que você precisa saber.
          </h2>
          <p className="text-sm md:text-base font-light text-slate-500 leading-relaxed max-w-xl mx-auto">
            Respostas diretas e transparentes sobre coberturas, carências e modelos de contratação.
          </p>
        </div>

        {/* Accordions */}
        <div className="w-full flex flex-col gap-3">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`w-full border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'border-[#3b2dff] bg-white shadow-md shadow-[#3b2dff]/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer focus:outline-none"
                >
                  <span className={`text-base md:text-lg font-bold pr-4 transition-colors duration-300 ${isOpen ? 'text-[#3b2dff]' : 'text-[#111827]'}`}>
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? 'bg-[#3b2dff]/10 text-[#3b2dff]' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 md:p-6 pt-0 text-sm md:text-base font-light text-slate-600 leading-relaxed border-t border-slate-100/50 mt-2">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
