'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useDemoMode } from '@/lib/demo-mode';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  RefreshIcon,
  UserIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { getDashboardAction, DashboardData } from './actions';
import { getDemoDashboardData } from '@/lib/demo-data';

const STATUS_VARIANTS = {
  Aguardando: 'outline',
  'Em Atendimento': 'default',
  'Proposta Enviada': 'secondary',
  'Venda Concluída': 'default',
} as Record<string, 'outline' | 'default' | 'secondary'>;

const STATUS_CLASSES = {
  Aguardando: 'text-neutral-500 border-neutral-200 bg-neutral-50',
  'Em Atendimento': 'text-blue-700 border-blue-200 bg-blue-50',
  'Proposta Enviada': 'text-amber-700 border-amber-200 bg-amber-50',
  'Venda Concluída': 'text-emerald-700 border-emerald-200 bg-emerald-50',
} as Record<string, string>;

const donutColors = ['#3b2dff', '#10b981', '#0070f3', '#f43f5e', '#f59e0b'];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

function PipelineFunnel({ data }: { data: DashboardData }) {
  const stages = [
    { label: 'Aguardando', value: data.aguardando, color: '#71717a' },
    { label: 'Em Atendimento', value: data.emAtendimento, color: '#3b82f6' },
    { label: 'Proposta Enviada', value: data.propostasEnviadas, color: '#f59e0b' },
    { label: 'Venda Concluída', value: data.vendasConcluidas, color: '#10b981' },
  ];

  const maxVal = Math.max(...stages.map(s => s.value), 1);

  if (data.totalLeads === 0) {
    return (
      <div className="flex items-center justify-center h-28 text-xs text-neutral-400 font-medium">
        Sem dados de pipeline
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stages.map((stage, i) => {
        const pct = (stage.value / maxVal) * 100;
        const overallPct = data.totalLeads > 0 ? (stage.value / data.totalLeads) * 100 : 0;
        const conversionPct =
          i > 0 && stages[i - 1].value > 0
            ? (stage.value / stages[i - 1].value) * 100
            : null;

        return (
          <div key={stage.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-neutral-600">{stage.label}</span>
              <span className="font-semibold text-neutral-800 tabular-nums">
                {stage.value}
                <span className="text-neutral-400 font-normal ml-1">
                  ({overallPct.toFixed(0)}%)
                </span>
              </span>
            </div>
            <div className="relative h-5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: stage.color }}
              />
            </div>
            {conversionPct !== null && (
              <div className="flex items-center gap-1 ml-1 mt-0.5 mb-1">
                <span className="text-[9px] text-neutral-400 tabular-nums">
                  {conversionPct.toFixed(0)}%
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-2.5 text-neutral-300" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, i) => s + i.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-neutral-400 font-medium">
        Sem dados
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative shrink-0">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={64}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-white border border-slate-200 shadow-lg rounded-xl px-3 py-2 text-xs">
                    <span className="font-semibold text-neutral-800">{item.name}</span>
                    <span className="text-neutral-500 ml-2">{item.value} ({pct}%)</span>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-neutral-800 tracking-tight">{total}</span>
          <span className="text-[7px] font-medium text-neutral-400 uppercase tracking-widest">Leads</span>
        </div>
      </div>
      <div className="flex-1 w-full space-y-1 min-w-0">
        {data.map((item) => {
          const pct = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-neutral-600 truncate">{item.name}</span>
              </div>
              <span className="text-[9px] text-neutral-400 tabular-nums whitespace-nowrap ml-2">
                {pct}% · {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PerformanceChart({
  data,
  type,
}: {
  data: DashboardData;
  type: 'corretores' | 'operadoras';
}) {
  const items = type === 'corretores' ? data.leadsPorCorretor : data.leadsPorOperadora;

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-xs text-neutral-400 font-medium">
        Nenhum dado disponível.
      </div>
    );
  }

  const chartData = items.map((item: any) => ({
    nome: item.nome ?? item.perfil,
    leads: item.total,
    emAtendimento: item.emAtendimento ?? 0,
    vendas: item.vendas ?? 0,
    propostas: item.propostas ?? 0,
  }));

  const maxVal = Math.max(...chartData.map(d => d.leads), 1);

  return (
    <div className="space-y-3 pt-2">
      {chartData.map((d) => (
        <div key={d.nome} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-700 truncate">{d.nome}</span>
            <span className="font-semibold text-neutral-800 tabular-nums">{d.leads}</span>
          </div>
          <div className="relative h-6 bg-neutral-100 rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.emAtendimento / maxVal) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-blue-400 rounded-l-full"
              style={{ minWidth: d.emAtendimento > 0 ? '4px' : 0 }}
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${((d.propostas ?? 0) / maxVal) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-amber-400"
              style={{ minWidth: (d.propostas ?? 0) > 0 ? '4px' : 0 }}
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.vendas / maxVal) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-emerald-400 rounded-r-full"
              style={{ minWidth: d.vendas > 0 ? '4px' : 0 }}
            />
          </div>
          <div className="flex items-center gap-3 text-[9px] text-neutral-400 tabular-nums">
            <span>Em atend. {d.emAtendimento}</span>
            {d.propostas !== undefined && <span>Propostas {d.propostas}</span>}
            <span>Vendas {d.vendas}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResumePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isDemoMode } = useDemoMode();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<'corretores' | 'operadoras'>('corretores');
  const [perfView, setPerfView] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push('/login');
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

  if (isPending || isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-5 select-none text-left h-full bg-white">
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-8 w-40 bg-slate-100 rounded-lg" />
          <div className="h-8 w-32 bg-slate-100 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-52 bg-slate-50 rounded-2xl animate-pulse" />
          <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" />
        </div>
        <div className="h-52 bg-slate-50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const metrics = data ? [
    { label: 'Total de Leads', value: data.totalLeads, color: '#3b2dff', bg: 'bg-[#f8f9fa73]/40' },
    { label: 'Aguardando', value: data.aguardando, color: '#71717a', bg: 'bg-[#f8f9fa73]/40' },
    { label: 'Em Atendimento', value: data.emAtendimento, color: '#3b82f6', bg: 'bg-[#f8f9fa73]/40' },
    { label: 'Propostas', value: data.propostasEnviadas, color: '#f59e0b', bg: 'bg-[#f8f9fa73]/40' },
    { label: 'Vendas', value: data.vendasConcluidas, color: '#10b981', bg: 'bg-[#f8f9fa73]/40' },
  ] : [];

  return (
    <div className="p-6 lg:p-8 space-y-5 select-none text-left flex flex-col min-w-0 w-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">Resumo</h1>
          <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">
            {isDemoMode ? 'Exibindo dados de demonstração' : 'Visão geral do pipeline comercial'}
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
          title="Recarregar"
        >
          <HugeiconsIcon icon={RefreshIcon} className="size-4" />
        </button>
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {metrics.map((metric) => {
            const pctTotal = data.totalLeads > 0 ? (metric.value / data.totalLeads) * 100 : 0;
            return (
              <motion.div
                key={metric.label}
                variants={cardVariants}
                className="group p-4 rounded-2xl border border-slate-100 bg-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
                </div>
                <div className="flex items-end justify-between mt-3">
                  <span
                    className="text-2xl font-bold tracking-tight tabular-nums"
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </span>
                  <span className="text-[9px] text-neutral-400 tabular-nums font-medium">
                    {pctTotal.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pctTotal}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pipeline Funnel */}
      {data && (
        <div className="p-5 rounded-2xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">Pipeline</span>
              <h2 className="text-sm font-semibold text-neutral-800 mt-0.5">Funil de Conversão</h2>
            </div>
            <span className="text-[10px] font-medium text-neutral-400 tabular-nums">
              {data.totalLeads} leads
            </span>
          </div>
          <PipelineFunnel data={data} />
        </div>
      )}

      {/* Bento: Donut + Recent Leads */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                  Distribuição
                </span>
                <h2 className="text-sm font-semibold text-neutral-800 mt-0.5">Por Operadora</h2>
              </div>
            </div>
            <DonutChart
              data={data.leadsPorOperadora.map((op, idx) => ({
                name: op.perfil || 'Sem operadora',
                value: op.total,
                color: donutColors[idx % donutColors.length],
              }))}
            />
          </div>

          {/* Recent Leads */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-white flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                  Pipeline
                </span>
                <h2 className="text-xs font-semibold text-neutral-800 mt-0.5">Últimos Leads</h2>
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
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-white transition-all hover:shadow-sm hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <span className="text-[10px] font-bold text-neutral-500">
                          {lead.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-semibold text-neutral-800 truncate">{lead.nome}</span>
                        <span className="text-[9px] text-neutral-400 mt-0.5">{lead.perfil}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[8px] font-bold border shrink-0 ${STATUS_CLASSES[lead.status] || STATUS_CLASSES.Aguardando}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance */}
      {data && (
        <div className="p-5 rounded-2xl border border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">Desempenho</span>
              <h2 className="text-sm font-semibold text-neutral-800 mt-0.5">Distribuição Operacional</h2>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
                <button
                  onClick={() => setTableFilter('corretores')}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'corretores'
                    ? 'bg-white text-neutral-800 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-600 font-normal'
                    }`}
                >
                  Corretores
                </button>
                <button
                  onClick={() => setTableFilter('operadoras')}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider transition-all cursor-pointer ${tableFilter === 'operadoras'
                    ? 'bg-white text-neutral-800 font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-600 font-normal'
                    }`}
                >
                  Operadoras
                </button>
              </div>
              <button
                onClick={() => setPerfView(v => v === 'chart' ? 'table' : 'chart')}
                className="px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-medium text-neutral-500 hover:bg-slate-50 transition-all cursor-pointer"
              >
                {perfView === 'chart' ? 'Tabela' : 'Gráfico'}
              </button>
            </div>
          </div>

          {perfView === 'chart' ? (
            <div className="mt-4">
              <PerformanceChart data={data} type={tableFilter} />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-4 overflow-x-auto mt-4">
              {tableFilter === 'corretores' ? (
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                      <th className="pb-3 pt-1 px-4">Corretor</th>
                      <th className="pb-3 pt-1 px-4 text-center">Leads</th>
                      <th className="pb-3 pt-1 px-4 text-center">Em Atend.</th>
                      <th className="pb-3 pt-1 px-4 text-center">Propostas</th>
                      <th className="pb-3 pt-1 px-4 text-center">Vendas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {data.leadsPorCorretor.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-xs text-neutral-400 font-medium">Nenhum lead atribuído a corretores.</td></tr>
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
                    <tr className="border-b border-slate-100 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                      <th className="pb-3 pt-1 px-4">Operadora</th>
                      <th className="pb-3 pt-1 px-4 text-center">Leads</th>
                      <th className="pb-3 pt-1 px-4 text-center">Em Atend.</th>
                      <th className="pb-3 pt-1 px-4 text-center">Vendas</th>
                      <th className="pb-3 pt-1 px-4 text-center">Conversão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {data.leadsPorOperadora.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-xs text-neutral-400 font-medium">Nenhum lead registrado por operadora.</td></tr>
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
          )}
        </div>
      )}

    </div>
  );
}
