'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BriefcaseIcon,
  UserGroupIcon,
  WhatsappIcon,
  ZapIcon
} from '@hugeicons/core-free-icons';
import { useCRM } from './crm-context';
import Link from 'next/link';

export default function CRMDashboard() {
  const { leads, role, corretores } = useCRM();

  // Metrics Calculations
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.status === 'Em Contato' || l.status === 'Negociação').length;
  const closedSales = leads.filter(l => l.status === 'Fechado').length;
  const productivity = totalLeads > 0 ? Math.round((closedSales / totalLeads) * 100) : 0;

  // Recent Lead Activities
  const recentActivities = leads.slice(0, 5).map((lead, idx) => {
    const assignedCorretor = corretores.find(c => c.id === lead.assignedCorretorId)?.name || 'Sem Corretor';
    return {
      id: lead.id,
      leadName: lead.name,
      action: lead.status === 'Novo' ? 'realizou uma simulação de cotação' : `foi movido para ${lead.status}`,
      time: lead.date,
      corretor: assignedCorretor,
      type: lead.type
    };
  });

  // Sales by Operator
  const operatorSales = [
    { name: 'Amep Saúde', sales: 14, percentage: 55, color: '#3b2dff' },
    { name: 'Assim Saúde', sales: 6, percentage: 24, color: '#0ea5e9' },
    { name: 'Unimed Nova Iguaçu', sales: 3, percentage: 12, color: '#10b981' },
    { name: 'Bradesco Saúde', sales: 2, percentage: 9, color: '#f43f5e' }
  ];

  // SVG Chart Mock Coordinates
  // Simulating daily lead flows: e.g. 5 days: Day 1: 4, Day 2: 7, Day 3: 5, Day 4: 9, Day 5: 12
  const points = "30,120 90,80 150,100 210,60 270,30";

  return (
    <div className="p-6 lg:p-10 space-y-8 select-none">
      
      {/* 1. Metric Cards Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: Leads Capturados */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Leads Capturados</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 leading-none">{totalLeads}</span>
            <span className="text-[10px] text-slate-400 font-bold">no mês</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-slate-400 h-full rounded-full w-full" />
          </div>
          <div className="absolute right-4 top-4 size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <HugeiconsIcon icon={BriefcaseIcon} className="size-5" />
          </div>
        </div>

        {/* Card 2: Leads em Atendimento */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#3b2dff]">Em Atendimento</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#3b2dff] leading-none">{activeLeads}</span>
            <span className="text-[10px] text-[#3b2dff] font-bold">ativos</span>
          </div>
          <div className="w-full bg-[#3b2dff]/10 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-[#3b2dff] h-full rounded-full transition-all duration-500" 
              style={{ width: `${totalLeads > 0 ? (activeLeads / totalLeads) * 100 : 0}%` }}
            />
          </div>
          <div className="absolute right-4 top-4 size-10 rounded-xl bg-[#3b2dff]/5 border border-[#3b2dff]/10 flex items-center justify-center text-[#3b2dff]">
            <HugeiconsIcon icon={WhatsappIcon} className="size-5" />
          </div>
        </div>

        {/* Card 3: Vendas Concluídas */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Vendas Concluídas</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 leading-none">{closedSales}</span>
            <span className="text-[10px] text-emerald-500 font-bold">fechados</span>
          </div>
          <div className="w-full bg-emerald-50 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalLeads > 0 ? (closedSales / totalLeads) * 100 : 0}%` }}
            />
          </div>
          <div className="absolute right-4 top-4 size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"/></svg>
          </div>
        </div>

        {/* Card 4: Produtividade Equipe */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2 relative overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">Taxa de Conversão</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 leading-none">{productivity}%</span>
            <span className="text-[10px] text-purple-500 font-bold">geral</span>
          </div>
          <div className="w-full bg-purple-50 h-1 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${productivity}%` }}
            />
          </div>
          <div className="absolute right-4 top-4 size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <HugeiconsIcon icon={ZapIcon} className="size-5" />
          </div>
        </div>

      </section>

      {/* 2. Analytical Section: Performance Chart and Division by Operator */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Performance Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Novos Leads Diários</h3>
              <p className="text-slate-400 text-[10px] sm:text-xs">Fluxo diário de simulações recebidas na Landing Page.</p>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">Últimos 5 Dias</span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 flex items-end px-6 pb-6 overflow-hidden">
            <svg className="w-full h-full absolute inset-0 pt-6 px-10" viewBox="0 0 300 150" preserveAspectRatio="none">
              {/* Gradient beneath the line */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b2dff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b2dff" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="300" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="120" x2="300" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />

              {/* Area path */}
              <path d={`M 30 150 L ${points} L 270 150 Z`} fill="url(#chartGradient)" />

              {/* Smooth trend Line */}
              <polyline
                fill="none"
                stroke="#3b2dff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              
              {/* Plot points */}
              <circle cx="30" cy="120" r="4.5" fill="#3b2dff" stroke="white" strokeWidth="2" />
              <circle cx="90" cy="80" r="4.5" fill="#3b2dff" stroke="white" strokeWidth="2" />
              <circle cx="150" cy="100" r="4.5" fill="#3b2dff" stroke="white" strokeWidth="2" />
              <circle cx="210" cy="60" r="4.5" fill="#3b2dff" stroke="white" strokeWidth="2" />
              <circle cx="270" cy="30" r="4.5" fill="#3b2dff" stroke="white" strokeWidth="2" />
            </svg>
            
            {/* X Axis Labels */}
            <div className="w-full flex justify-between text-[9px] font-black text-slate-400 px-6 uppercase tracking-wider relative z-10">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
            </div>
          </div>
        </div>

        {/* Right Column: Operator Share */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Share por Operadora</h3>
            <p className="text-slate-400 text-[10px] sm:text-xs">Distribuição de vendas fechadas no mês.</p>
          </div>

          <div className="space-y-4 py-2">
            {operatorSales.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{item.name}</span>
                  <span className="text-slate-500">{item.sales} contratos ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 3. Bottom Grid: Activity Feed & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Feed (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Atividade Recente</h3>
            <p className="text-slate-400 text-[10px] sm:text-xs">Log de cotações em tempo real.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((act, idx) => (
              <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  act.type === 'pme' 
                    ? 'bg-blue-50 text-blue-600'
                    : act.type === 'familiar'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {act.type === 'pme' ? 'PJ' : act.type === 'familiar' ? 'FA' : 'PF'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-655 font-medium leading-relaxed">
                    <span className="font-extrabold text-slate-900">{act.leadName}</span> {act.action}.
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1 inline-flex items-center gap-1.5">
                    <span>{act.time}</span>
                    <span className="size-1 rounded-full bg-slate-200" />
                    <span>Corretor: <strong className="text-slate-500">{act.corretor}</strong></span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Navegação Rápida</h3>
            <p className="text-slate-400 text-[10px] sm:text-xs">Links de atalho para ações comuns.</p>
          </div>

          <div className="flex flex-col gap-3.5 py-1">
            <Link
              href="/crm/leads"
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 hover:border-[#3b2dff] bg-slate-50/50 hover:bg-[#3b2dff]/5 transition-all text-xs font-extrabold text-slate-700 hover:text-[#3b2dff]"
            >
              <span>Gerenciar Funil / Kanban</span>
              <svg className="size-4 group-hover:translate-x-[2px] transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

            <Link
              href="/crm/chat"
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/50 transition-all text-xs font-extrabold text-slate-700 hover:text-emerald-600"
            >
              <span>Conversar com Leads (WhatsApp)</span>
              <svg className="size-4 group-hover:translate-x-[2px] transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

            {role === 'ADMIN' ? (
              <Link
                href="/crm/corretores"
                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 hover:border-[#3b2dff] bg-slate-50/50 hover:bg-[#3b2dff]/5 transition-all text-xs font-extrabold text-slate-700 hover:text-[#3b2dff]"
              >
                <span>Equipe de Corretores</span>
                <svg className="size-4 group-hover:translate-x-[2px] transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            ) : (
              <div
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/40 bg-slate-100/50 opacity-60 text-xs font-extrabold text-slate-400 select-none"
              >
                <span>Gestão Bloqueada (Corretor)</span>
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 6v6m0 4h.01"/></svg>
              </div>
            )}
          </div>
        </div>

      </section>

    </div>
  );
}
