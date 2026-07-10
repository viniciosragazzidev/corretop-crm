'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useDemoMode } from '@/lib/demo-mode';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  RefreshIcon,
  UserIcon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { getDashboardAction, DashboardData } from './actions';
import { getDemoDashboardData } from '@/lib/demo-data';

const STATUS_STYLES = {
  Aguardando: 'bg-neutral-100 text-neutral-600',
  'Em Atendimento': 'bg-blue-50 text-blue-700',
  'Proposta Enviada': 'bg-amber-50 text-amber-700',
  'Venda Concluída': 'bg-emerald-50 text-emerald-700',
} as Record<string, string>;

const STATUS_LABELS = {
  Aguardando: 'Aguardando',
  'Em Atendimento': 'Em Atendimento',
  'Proposta Enviada': 'Proposta',
  'Venda Concluída': 'Concluído',
} as Record<string, string>;

function DonutChart({ data: items }: { data: { name: string; value: number; color: string }[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const circumference = 226.195;
  let accumulatedPercent = 0;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-28">
        <span className="text-xs text-neutral-400 font-medium">Sem dados</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-2">
      <div className="relative size-28 flex items-center justify-center shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" className="fill-transparent stroke-slate-100" strokeWidth="8" />
          {items.map((item, idx) => {
            const percent = item.value / total;
            const strokeLength = percent * circumference;
            const strokeOffset = circumference - (accumulatedPercent * circumference);
            accumulatedPercent += percent;
            return (
              <circle
                key={idx}
                cx="50" cy="50" r="36"
                className="fill-transparent transition-all duration-300 hover:stroke-[9px]"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold text-neutral-800 tracking-tight">{total}</span>
          <span className="text-[8px] font-medium text-neutral-450 uppercase tracking-widest mt-0.5">Leads</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5 w-full text-left">
        {items.map((item, idx) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
          return (
            <div key={idx} className="flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-normal text-neutral-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-right">
                <span className="text-neutral-400 text-[10px]">{pct}% ({item.value})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniSparkline({ trend, color }: { trend: 'up' | 'neutral' | 'down'; color: string }) {
  const paths = {
    up: 'M0,20 C15,22 25,10 40,15 C55,20 70,5 85,12 L100,2',
    neutral: 'M0,15 C20,18 40,12 60,16 C80,10 90,14 100,12',
    down: 'M0,5 C15,8 25,15 40,12 C55,8 70,20 85,18 L100,22',
  };

  return (
    <svg viewBox="0 0 100 25" className="w-full h-full" preserveAspectRatio="none">
      <path
        d={paths[trend]}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ResumePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isDemoMode } = useDemoMode();

  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2026');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<'corretores' | 'operadoras'>('corretores');

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push('/crm/login');
      return;
    }
    loadData();
  }, [session, isPending, router]);

  useEffect(() => {
    if (data) loadData();
  }, [isDemoMode]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 400));
      setData(getDemoDashboardData());
      setIsLoading(false);
      return;
    }

    const res = await getDashboardAction();
    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setData(res.data);
    }
    setIsLoading(false);
  }

  const donutColors = ['#3b2dff', '#10b981', '#0070f3', '#f43f5e', '#f59e0b'];

  if (isPending || isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 select-none text-left h-full bg-white">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 w-40 bg-slate-100 rounded-lg" />
          <div className="h-8 w-32 bg-slate-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-slate-50 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-50 rounded-3xl animate-pulse" />
          <div className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
        </div>
        <div className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col min-w-0 w-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">Resumo</h1>
          <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">
            {isDemoMode ? 'Exibindo dados de demonstração' : 'Visão geral do pipeline comercial'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-neutral-50 hover:bg-slate-100 text-xs font-medium text-neutral-700 cursor-pointer outline-none appearance-none transition-colors"
          >
            <option value="Janeiro 2026">Janeiro 2026</option>
            <option value="Fevereiro 2026">Fevereiro 2026</option>
            <option value="Março 2026">Março 2026</option>
          </select>
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
            title="Recarregar"
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total de Leads', value: data.totalLeads, color: '#3b2dff', trend: 'up' as const, bg: 'bg-[#f8f9fa73]/40' },
            { label: 'Aguardando', value: data.aguardando, color: '#71717a', trend: 'up' as const, bg: 'bg-[#f8f9fa73]/40' },
            { label: 'Em Atendimento', value: data.emAtendimento, color: '#3b82f6', trend: 'neutral' as const, bg: 'bg-[#f8f9fa73]/40' },
            { label: 'Propostas', value: data.propostasEnviadas, color: '#f59e0b', trend: 'up' as const, bg: 'bg-[#f8f9fa73]/40' },
            { label: 'Vendas', value: data.vendasConcluidas, color: '#10b981', trend: 'up' as const, bg: 'bg-[#f8f9fa73]/40' },
          ].map((metric) => (
            <div
              key={metric.label}
              className={`p-5 rounded-3xl border border-slate-100 ${metric.bg} flex flex-col justify-between h-32 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]`}
            >
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{metric.label}</span>
              <div className="flex items-end justify-between">
                <div className={`text-3xl font-semibold tracking-tight`}>
                  {metric.value}
                </div>
                <div className="w-16 h-8 shrink-0">
                  <MiniSparkline trend={metric.trend} color={metric.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bento Grid: Donut + Recent Leads */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart - 2/3 width */}
          <div className="lg:col-span-2 p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between min-h-[260px] transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500">Distribuição por Operadora</span>
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4.5 text-neutral-450 shrink-0" />
            </div>
            <DonutChart
              data={data.leadsPorOperadora.map((op, idx) => ({
                name: op.perfil,
                value: op.total,
                color: donutColors[idx % donutColors.length],
              }))}
            />
          </div>

          {/* Recent Leads - 1/3 width */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col h-full min-h-[260px] transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/50">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-medium text-neutral-450 uppercase tracking-wider">Pipeline</span>
                <span className="text-xs font-semibold text-neutral-700 mt-0.5">Últimos Leads</span>
              </div>
              <span className="text-[10px] font-medium text-neutral-400">{data.ultimosLeads.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
              {data.ultimosLeads.length === 0 ? (
                <p className="text-xs text-neutral-400 font-medium py-8 text-center">Nenhum lead registrado.</p>
              ) : (
                data.ultimosLeads.slice(0, 6).map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.003)] transition-all hover:shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/50 shrink-0">
                        <HugeiconsIcon icon={UserIcon} className="size-3.5 text-neutral-500" />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-semibold text-neutral-800 truncate">{lead.nome}</span>
                        <span className="text-[9px] text-neutral-400 mt-0.5">{lead.perfil}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold border ${STATUS_STYLES[lead.status] || 'bg-neutral-100 text-neutral-600'} border-transparent shrink-0`}>
                      {STATUS_LABELS[lead.status] || lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tables */}
      {data && (
        <div className="p-6 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100/50">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-medium text-neutral-450 uppercase tracking-wider">Desempenho</span>
              <span className="text-sm font-semibold text-neutral-700 mt-0.5">Distribuição Operacional</span>
            </div>
            <div className="inline-flex rounded-xl bg-white border border-slate-200/40 p-0.5 self-start sm:self-center">
              <button
                onClick={() => setTableFilter('corretores')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'corretores'
                  ? 'bg-slate-100 text-neutral-800 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-600 font-normal'
                  }`}
              >
                Corretores
              </button>
              <button
                onClick={() => setTableFilter('operadoras')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'operadoras'
                  ? 'bg-slate-100 text-neutral-800 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-600 font-normal'
                  }`}
              >
                Operadoras
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100/70 p-4 overflow-x-auto mt-4">
            {tableFilter === 'corretores' ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-medium text-neutral-450 uppercase tracking-wider">
                    <th className="pb-3 pt-1 px-4">Corretor</th>
                    <th className="pb-3 pt-1 px-4 text-center">Leads</th>
                    <th className="pb-3 pt-1 px-4 text-center">Em Atend.</th>
                    <th className="pb-3 pt-1 px-4 text-center">Propostas</th>
                    <th className="pb-3 pt-1 px-4 text-center">Vendas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {data.leadsPorCorretor.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-neutral-400 font-medium">
                        Nenhum lead atribuído a corretores.
                      </td>
                    </tr>
                  ) : (
                    data.leadsPorCorretor.map((corretor) => (
                      <tr key={corretor.id} className="text-xs text-neutral-600 hover:bg-slate-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-neutral-800">{corretor.nome}</td>
                        <td className="py-3.5 px-4 text-center text-neutral-650 font-normal">{corretor.total}</td>
                        <td className="py-3.5 px-4 text-center text-blue-600 font-medium">{corretor.emAtendimento}</td>
                        <td className="py-3.5 px-4 text-center text-amber-600 font-medium">{corretor.propostas}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-600 font-medium">{corretor.vendas}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-medium text-neutral-450 uppercase tracking-wider">
                    <th className="pb-3 pt-1 px-4">Operadora</th>
                    <th className="pb-3 pt-1 px-4 text-center">Leads</th>
                    <th className="pb-3 pt-1 px-4 text-center">Em Atend.</th>
                    <th className="pb-3 pt-1 px-4 text-center">Vendas</th>
                    <th className="pb-3 pt-1 px-4 text-center">Conversão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {data.leadsPorOperadora.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-neutral-400 font-medium">
                        Nenhum lead registrado por operadora.
                      </td>
                    </tr>
                  ) : (
                    data.leadsPorOperadora.map((op, idx) => (
                      <tr key={idx} className="text-xs text-neutral-600 hover:bg-slate-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-neutral-800">{op.perfil}</td>
                        <td className="py-3.5 px-4 text-center text-neutral-650 font-normal">{op.total}</td>
                        <td className="py-3.5 px-4 text-center text-blue-600 font-medium">{op.emAtendimento}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-600 font-medium">{op.vendas}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] font-bold ${op.total > 0 && (op.vendas / op.total) >= 0.25 ? 'text-emerald-600' : 'text-neutral-400'}`}>
                            {op.total > 0 ? `${Math.round((op.vendas / op.total) * 100)}%` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
