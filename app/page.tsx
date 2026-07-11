import Link from 'next/link';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corretop CRM | O Software para Corretores de Seguros de Sucesso',
  description: 'Aumente suas vendas de planos de saúde e seguros com o CRM completo da Corretop. Leads integrados, controle de equipe e relatórios em tempo real.',
};

export default function CRMLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-[#3b2dff]/15 selection:text-[#3b2dff]">
      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Corretop" className="h-9" />
        </div>
        <Link
          href="/login"
          className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#3b2dff]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Acessar CRM
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto px-6 py-12 md:py-20 text-center gap-12">
        <div className="flex flex-col gap-6 items-center">
          <div className="inline-flex items-center gap-2 bg-[#3b2dff]/5 border border-[#3b2dff]/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#3b2dff] animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
            <span>✨</span> Novo CRM Corretop 1.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 max-w-3xl leading-[1.1] animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            Venda mais seguros e gerencie sua corretora em <span className="text-[#3b2dff]">um só lugar</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl font-medium leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.35s_both]">
            O Corretop é a plataforma de CRM ideal para corretores individuais e grandes equipes. Controle leads, automatize propostas e acompanhe o desempenho em tempo real.
          </p>
        </div>

        {/* CTA Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-[#3b2dff] hover:bg-[#2d20e0] text-white text-sm font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-[#3b2dff]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Entrar no Painel
          </Link>
          <a
            href="#recursos"
            className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Conhecer Recursos
          </a>
        </div>

        {/* Features Preview */}
        <div id="recursos" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              emoji: '🎯',
              title: 'Funil de Leads',
              desc: 'Distribua leads qualificados entre seus corretores e acompanhe o progresso de cada atendimento com facilidade.',
              color: 'blue',
              delay: '0.6s',
            },
            {
              emoji: '📊',
              title: 'Desempenho da Equipe',
              desc: 'Monitore o fechamento de propostas, produtividade de corretores e ganho mensal detalhado por períodos.',
              color: 'amber',
              delay: '0.75s',
            },
            {
              emoji: '💬',
              title: 'Central de Conversas',
              desc: 'Mantenha o histórico de mensagens, propostas enviadas e dados dos segurados sempre organizados.',
              color: 'purple',
              delay: '0.9s',
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-[fadeInUp_0.6s_ease-out_${card.delay}_both]`}
            >
              <div className={`size-12 rounded-2xl bg-${card.color}-50 flex items-center justify-center text-${card.color}-600 mb-6 font-bold text-lg`}>
                {card.emoji}
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">{card.title}</h3>
              <p className="text-slate-400 text-xs font-normal leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-8 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-semibold">
            Corretop © 2026. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-xs text-slate-400 font-bold">
            <a href="#" className="hover:text-slate-600 transition-colors">Termos</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
