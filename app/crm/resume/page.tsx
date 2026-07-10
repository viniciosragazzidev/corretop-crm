'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon,
  Download01Icon,
  InformationCircleIcon,
  ArrowUp02Icon,
  Alert02Icon,
  CircleDotIcon,
  UserIcon,
  ArrowRight01Icon,
  BankIcon
} from '@hugeicons/core-free-icons';

// �€�€�€ TYPES & MOCK DATA �€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€
interface BrokerPerformance {
  id: string;
  name: string;
  role: string;
  avatar: string;
  leads: number;
  conversion: number;
  responseTime: string;
  revenue: number;
}

const BROKERS_DATA: BrokerPerformance[] = [
  { id: '1', name: 'Dra. Andressa Lima', role: 'Corretora Sênior', avatar: 'AL', leads: 22, conversion: 94, responseTime: '32min', revenue: 6100 },
  { id: '2', name: 'Vinicios Ragazzi', role: 'Corretor Comercial', avatar: 'VR', leads: 16, conversion: 84, responseTime: '28min', revenue: 5654 },
  { id: '3', name: 'Lucas Pinheiro', role: 'Parceiro Externo', avatar: 'LP', leads: 19, conversion: 92, responseTime: '15min', revenue: 5800 },
  { id: '4', name: 'Mariana Costa', role: 'Corretora PME', avatar: 'MC', leads: 12, conversion: 78, responseTime: '42min', revenue: 3900 },
  { id: '5', name: 'Bruno Mendes', role: 'Vendas Adesão', avatar: 'BM', leads: 8, conversion: 37, responseTime: '65min', revenue: 1250 }
];

const LATEST_PROPOSALS = [
  { id: '1', client: 'Diogo Martins', product: 'Amil PME Fácil S80', value: 'R$ 1.864,65', time: '10:00 - 11:00', type: 'amil' },
  { id: '2', client: 'Beatriz Vasconcelos', product: 'Bradesco Saúde Ideal', value: 'R$ 3.240,00', time: '11:15 - 12:00', type: 'bradesco' },
  { id: '3', client: 'Marcelo Melo', product: 'Unimed Adesão Premium', value: 'R$ 1.450,00', time: '14:30 - 15:30', type: 'unimed' },
  { id: '4', client: 'Clara Rodrigues', product: 'Amep Saúde Smart 100', value: 'R$ 890,00', time: '16:00 - 17:00', type: 'amep' }
];

// ─── SVG DONUT CHART COMPONENT ────────────────────────────────────────────────
const DonutChart = () => {
  const data = [
    { name: 'Amil Saúde', value: 42, color: '#3b2dff', revenue: 'R$ 14.500' },
    { name: 'Unimed Saúde', value: 35, color: '#10b981', revenue: 'R$ 9.800' },
    { name: 'Bradesco Saúde', value: 28, color: '#0070f3', revenue: 'R$ 11.200' },
    { name: 'Amep Saúde', value: 15, color: '#f43f5e', revenue: 'R$ 3.800' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Circumference for r=36 is 2 * PI * 36 = 226.195
  const circumference = 226.195;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-2">
      {/* SVG Donut */}
      <div className="relative size-28 flex items-center justify-center shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            className="fill-transparent stroke-slate-100"
            strokeWidth="8"
          />
          {data.map((item, idx) => {
            const percent = item.value / total;
            const strokeLength = percent * circumference;
            const strokeOffset = circumference - (accumulatedPercent * circumference);
            accumulatedPercent += percent;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="36"
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

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold text-neutral-800 tracking-tight">{total}</span>
          <span className="text-[8px] font-medium text-neutral-450 uppercase tracking-widest mt-0.5">Leads</span>
        </div>
      </div>

      {/* Legends list */}
      <div className="flex-1 space-y-1.5 w-full text-left">
        {data.map((item, idx) => {
          const pct = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={idx} className="flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-normal text-neutral-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-right">
                <span className="text-neutral-400 text-[10px]">{pct}% ({item.value})</span>
                <span className="font-medium text-neutral-700 text-[10px] min-w-[55px]">{item.revenue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ResumePage() {
  const [selectedMonth, setSelectedMonth] = useState('Março 2026');
  const [tableFilter, setTableFilter] = useState<'corretores' | 'operadoras'>('corretores');
  const [aiMessageIndex, setAiMessageIndex] = useState(0);

  const aiMessages = [
    'Amep Saúde está com conversão 15% acima da média da filial este mês. Foco em PME.',
    'Identificados 4 leads aguardando primeiro contato por mais de 1 hora. Sugiro ação imediata.',
    'Campanha da Unimed Adesão gerou R$ 12.000 em receitas nas últimas 48h.',
    'Vinicios Ragazzi está a 2 fechamentos de atingir a meta mensal.'
  ];

  // Componente visual de medidor de bateria para porcentagem de conversão
  const BatteryMeter = ({ value }: { value: number }) => {
    const totalTicks = 15;
    const activeTicks = Math.round((value / 100) * totalTicks);

    let colorClass = "bg-emerald-500";
    let textColorClass = "text-emerald-600";
    if (value < 50) {
      colorClass = "bg-red-500";
      textColorClass = "text-red-655";
    } else if (value < 90) {
      colorClass = "bg-blue-500";
      textColorClass = "text-blue-600";
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-[2px] items-center text-left">
          {Array.from({ length: totalTicks }).map((_, i) => {
            const isActive = i < activeTicks;
            return (
              <div
                key={i}
                className={`w-[3px] h-3.5 rounded-[1px] transition-all duration-300 ${isActive ? colorClass : "bg-slate-200"
                  }`}
              />
            );
          })}
        </div>
        <span className={`text-[10px] font-bold ${textColorClass}`}>{value}%</span>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col min-w-0 w-full bg-white">

      {/* �€�€�€ HEADER CONTROLS �€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month Selector */}
        <div className="relative inline-block text-left">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-neutral-50 hover:bg-slate-100 text-xs font-medium text-neutral-700 cursor-pointer outline-none shadow-[0_1px_2px_rgba(0,0,0,0.015)] appearance-none transition-colors"
          >
            <option value="Março 2026">Março 2026</option>
            <option value="Fevereiro 2026">Fevereiro 2026</option>
            <option value="Janeiro 2026">Janeiro 2026</option>
          </select>
          <div className="absolute right-2.5 top-2.5 pointer-events-none text-neutral-400">
            <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 cursor-pointer transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
        >
          <HugeiconsIcon icon={Download01Icon} className="size-3.5 text-neutral-400" />
          <span>Exportar Relatório</span>
        </Button>
      </div>

      {/* �€�€�€ BENTO GRID & ACTIVITIES ROW �€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€�€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Metrics Bento Cells (2/3 width) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Card 1: Receita Estimada (Destacado Azul Suave) */}
          <div className="sm:col-span-2 p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)] hover:bg-[#f8f9fa73]/60">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-medium text-neutral-500">Receita prevista</span>
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4.5 text-neutral-400" />
            </div>

            {/* White nested value block */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100/50 shadow-[0_1px_4px_rgba(0,0,0,0.005)] z-10 w-full mt-2 flex items-center justify-between gap-4">
              <div className="flex items-baseline">
                <span className="text-sm font-normal text-neutral-400 mr-1.5">R$</span>
                <span className="text-2xl font-semibold text-neutral-800 tracking-tight">18.864,65</span>
              </div>
              {/* Mini area/line chart */}
              <div className="w-32 h-9 shrink-0">
                <svg viewBox="0 0 100 30" className="w-full h-full text-[#3b2dff]" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-receita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,25 C15,22 25,10 40,15 C55,20 70,5 85,12 L100,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,25 C15,22 25,10 40,15 C55,20 70,5 85,12 L100,2 L100,30 L0,30 Z"
                    fill="url(#gradient-receita)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between z-10 mt-3">
              <span className="text-xs font-normal text-neutral-400">6 aguardam confirmação</span>
              <Button
                variant="default"
                size="sm"
                className="px-3.5 py-1.5 rounded-xl  border   text-xs font-medium  transition-colors shadow-none cursor-pointer"
              >
                <HugeiconsIcon icon={BankIcon} />
                Ir para financeiro
              </Button>
            </div>

          </div>

          {/* Card 2: Atendimentos Hoje */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between h-40 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <span className="text-xs font-medium text-neutral-500">Consultas hoje</span>

            {/* White nested value block */}
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-none">
              <div className="flex flex-col text-left">
                <span className="text-2xl font-semibold text-neutral-800">86</span>
                <span className="text-[10px] font-normal text-neutral-400 mt-0.5">14 em andamento</span>
              </div>
              {/* Mini vertical bars representing hourly consultations */}
              <div className="flex items-end gap-1 h-8 shrink-0 pb-0.5">
                {[4, 8, 12, 10, 15, 18, 14, 22].map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${(val / 22) * 100}%` }}
                    className="w-1 rounded-full bg-[#3b2dff]/20 hover:bg-[#3b2dff] transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Leads em Espera */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between h-40 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <span className="text-xs font-medium text-neutral-500">Em espera</span>

            {/* White nested value block */}
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-none">
              <div className="flex flex-col text-left">
                <span className="text-2xl font-semibold text-neutral-800">12</span>
                <span className="text-[10px] font-normal text-neutral-400 mt-0.5">Tempo médio • 18min</span>
              </div>
              {/* Mini wave chart */}
              <div className="w-16 h-8 shrink-0">
                <svg viewBox="0 0 60 25" className="w-full h-full text-amber-500" preserveAspectRatio="none">
                  <path
                    d="M0,20 C10,22 15,10 25,12 C35,14 45,5 60,18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Taxa de Conversão */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between h-40 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Comparecimento</span>
              <span className="size-4.5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[9px] font-medium shadow-none shrink-0">
                <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 5 5 10-10" /></svg>
              </span>
            </div>

            {/* White nested value block */}
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-none">
              <div className="flex flex-col text-left">
                <span className="text-2xl font-semibold text-neutral-800">91%</span>
                <span className="text-[10px] font-medium text-emerald-600 mt-0.5">
                  +4% <span className="font-normal text-neutral-400">vs mês passado</span>
                </span>
              </div>
              {/* Circular progress / SVG curve */}
              <div className="w-16 h-8 shrink-0">
                <svg viewBox="0 0 60 25" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
                  <path
                    d="M0,18 C15,8 35,5 60,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Leads em Atraso */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between h-40 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">Atrasos</span>
              <HugeiconsIcon icon={Alert02Icon} className="size-4 text-red-500 shrink-0" />
            </div>

            {/* White nested value block */}
            <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100/50 shadow-none">
              <div className="flex flex-col text-left">
                <span className="text-2xl font-semibold text-neutral-800">4</span>
                <span className="text-[10px] font-medium text-red-650 underline cursor-pointer hover:text-red-700 mt-0.5">
                  3 críticos agora
                </span>
              </div>
              {/* Alert level indicator or mini horizontal spark */}
              <div className="w-16 h-8 shrink-0 flex items-center justify-end">
                <svg viewBox="0 0 60 25" className="w-full h-full text-red-500" preserveAspectRatio="none">
                  <path
                    d="M0,5 L15,22 L30,12 L45,18 L60,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 6: Distribuição por Operadora (Donut Chart) */}
          <div className="sm:col-span-2 p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col justify-between min-h-[200px] transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500">Distribuição por Operadora</span>
              <HugeiconsIcon icon={InformationCircleIcon} className="size-4.5 text-neutral-450 shrink-0" />
            </div>
            <DonutChart />
          </div>

        </div>

        {/* Right Column: Today's Proposals Feed (1/3 width) */}
        <div className="p-5 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 flex flex-col h-full min-h-[400px] transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.005)]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100/50">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-medium text-neutral-450 uppercase tracking-wider">Negociações Recentes</span>
              <span className="text-xs font-semibold text-neutral-700 mt-0.5">Últimas Propostas</span>
            </div>
            <div className="px-2 py-0.5 rounded-lg border border-slate-200/50 text-[10px] font-normal text-neutral-400 bg-white shadow-none">
              10/03
            </div>
          </div>

          {/* Visual Proposals List */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3.5 pr-1">
            {LATEST_PROPOSALS.map((proposal) => {
              // Estilo visual da borda esquerda colorida baseada no plano comercial
              let borderClass = 'border-l-indigo-500';
              let textAccentClass = 'text-indigo-950';
              if (proposal.type === 'bradesco') {
                borderClass = 'border-l-blue-500';
                textAccentClass = 'text-blue-950';
              } else if (proposal.type === 'unimed') {
                borderClass = 'border-l-rose-500';
                textAccentClass = 'text-rose-950';
              } else if (proposal.type === 'amep') {
                borderClass = 'border-l-emerald-500';
                textAccentClass = 'text-emerald-950';
              }

              return (
                <div
                  key={proposal.id}
                  className={`p-3.5 rounded-2xl border-l-4 border border-slate-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.003)] flex flex-col justify-between gap-1 transition-all hover:-translate-y-[0.5px] hover:shadow-xs ${borderClass} ${textAccentClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-tight">{proposal.client}</span>
                    <span className="text-[9px] font-normal opacity-60">{proposal.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[9px] font-normal opacity-75">{proposal.product}</span>
                    <span className="text-[10px] font-semibold">{proposal.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── AI RECOMMENDATION BANNER ────────────────────────────────────────── */}
      <div
        onClick={() => setAiMessageIndex((prev) => (prev + 1) % aiMessages.length)}
        className="p-4 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 hover:bg-[#f8f9fa73]/60 shadow-[0_1px_3px_rgba(0,0,0,0.003)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all duration-300"
      >
        <div className="flex items-center gap-3.5">
          {/* Avatar com cara moderna de IA */}
          <div className="size-9 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shadow-none shrink-0">
            <span className="text-[10px] font-medium text-white tracking-wider">AI</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-neutral-700">Sugestões • Allan IA</span>
              <span className="size-1.5 rounded-full bg-[#3b2dff] animate-ping" />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={aiMessageIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] font-normal text-neutral-450 mt-0.5"
              >
                {aiMessages[aiMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-normal text-[#3b2dff] shrink-0">
          <HugeiconsIcon icon={CircleDotIcon} className="size-3.5 animate-spin" />
          <span>Analisando dados comerciais...</span>
        </div>
      </div>

      {/* ─── PERFORMANCE TABLE (DISTRIBUIÇÃO OPERACIONAL) ───────────────────── */}
      <div className="p-6 rounded-3xl border border-slate-100 bg-[#f8f9fa73]/40 shadow-[0_1px_3px_rgba(0,0,0,0.003)]">

        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100/50">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-medium text-neutral-450 uppercase tracking-wider">Desempenho Comercial</span>
            <span className="text-sm font-semibold text-neutral-700 mt-0.5">Distribuição Operacional</span>
          </div>

          {/* Segmented Controller filter */}
          <div className="inline-flex rounded-xl bg-white border border-slate-200/40 p-0.5 self-start sm:self-center shadow-none">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setTableFilter('corretores')}
              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'corretores'
                ? 'bg-slate-100 text-neutral-800 font-semibold'
                : 'text-neutral-400 hover:text-neutral-600 font-normal'
                }`}
            >
              Corretores
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setTableFilter('operadoras')}
              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'operadoras'
                ? 'bg-slate-100 text-neutral-800 font-semibold'
                : 'text-neutral-400 hover:text-neutral-600 font-normal'
                }`}
            >
              Operadoras
            </Button>
          </div>
        </div>

        {/* Table Body Card Container */}
        <div className="bg-white rounded-2xl border border-slate-100/70 p-4 shadow-none overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-medium text-neutral-450 uppercase tracking-wider">
                <th className="pb-3 pt-1 px-4">Nome</th>
                <th className="pb-3 pt-1 px-4 text-center">Atendimentos</th>
                <th className="pb-3 pt-1 px-4">Taxa de Conversão</th>
                <th className="pb-3 pt-1 px-4 text-center">Tempo Médio</th>
                <th className="pb-3 pt-1 px-4 text-right">Receita Gerada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {tableFilter === 'corretores' ? (
                BROKERS_DATA.map((broker) => (
                  <tr key={broker.id} className="text-xs text-neutral-600 hover:bg-slate-50/20 transition-colors">
                    {/* User profile info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/50 font-semibold text-[10px] text-neutral-600">
                          {broker.avatar}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-medium text-neutral-800">{broker.name}</span>
                          <span className="text-[9px] font-normal text-neutral-400 mt-0.5">{broker.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-neutral-650 font-normal">{broker.leads}</td>
                    <td className="py-3 px-4">
                      <BatteryMeter value={broker.conversion} />
                    </td>
                    <td className="py-3 px-4 text-center text-neutral-400 font-normal">{broker.responseTime}</td>
                    <td className="py-3 px-4 text-right text-neutral-700 font-medium">R$ {broker.revenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                // Simple Operadoras aggregation mock
                [
                  { name: 'Amil Saúde', leads: 42, conversion: 89, time: '22min', revenue: 14500 },
                  { name: 'Bradesco Saúde', leads: 28, conversion: 78, time: '35min', revenue: 11200 },
                  { name: 'Unimed Saúde', leads: 35, conversion: 92, time: '18min', revenue: 9800 },
                  { name: 'Amep Saúde', leads: 15, conversion: 94, time: '12min', revenue: 3800 }
                ].map((op, idx) => (
                  <tr key={idx} className="text-xs text-neutral-600 hover:bg-slate-50/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-neutral-800">{op.name}</td>
                    <td className="py-3.5 px-4 text-center text-neutral-650 font-normal">{op.leads}</td>
                    <td className="py-3.5 px-4">
                      <BatteryMeter value={op.conversion} />
                    </td>
                    <td className="py-3.5 px-4 text-center text-neutral-400 font-normal">{op.time}</td>
                    <td className="py-3.5 px-4 text-right text-neutral-700 font-medium">R$ {op.revenue.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 mt-5 pt-4 border-t border-slate-100 text-[9px] font-normal text-neutral-450 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Excelente ( &gt;90% )</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-blue-500" />
            <span>Bom ( 50-89% )</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-red-500" />
            <span>Atenção ( 0-49% )</span>
          </div>
        </div>

      </div>

    </div>
  );
}

