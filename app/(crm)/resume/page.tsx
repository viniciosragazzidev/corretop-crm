'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { useDemoMode } from '@/lib/demo-mode';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  RefreshIcon,
  ArrowRight01Icon,
  UserGroupIcon,
  GridViewIcon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { getDashboardAction, DashboardData } from './actions';
import { getDemoDashboardData } from '@/lib/demo-data';

/* ─── Constants ──────────────────────────────────────────────── */

const STATUS_CLASSES: Record<string, string> = {
  Aguardando: 'text-neutral-500 border-neutral-200 bg-neutral-50',
  'Em Atendimento': 'text-blue-700 border-blue-200 bg-blue-50',
  'Proposta Enviada': 'text-amber-700 border-amber-200 bg-amber-50',
  'Venda Concluída': 'text-emerald-700 border-emerald-200 bg-emerald-50',
};

const DONUT_COLORS = ['#3b2dff', '#10b981', '#0070f3', '#f43f5e', '#f59e0b'];

const PIPELINE_STAGES = [
  { key: 'aguardando', label: 'Aguardando', color: '#71717a' },
  { key: 'emAtendimento', label: 'Em Atendimento', color: '#3b82f6' },
  { key: 'propostasEnviadas', label: 'Proposta Enviada', color: '#f59e0b' },
  { key: 'vendasConcluidas', label: 'Venda Concluída', color: '#10b981' },
] as const;

/* ─── Animation Variants ─────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Sub-components ─────────────────────────────────────────── */

/** Mini sparkline-style bar used inside KPI cards */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

/** KPI metric card — inspired by the "Saldo disponível / Volume / Aprovação" cards */
function MetricCard({
  label,
  value,
  pct,
  color,
  max,
  delay = 0,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  max: number;
  delay?: number;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: `${color}18`, color }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {pct.toFixed(0)}%
            </span>
          </div>
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-2">
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className="text-3xl font-bold tabular-nums tracking-tight mt-1"
            style={{ color }}
          >
            {value}
          </p>
          <MiniBar value={value} max={max} color={color} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Pipeline funnel with horizontal bars */
function PipelineFunnel({ data }: { data: DashboardData }) {
  const maxVal = Math.max(
    ...PIPELINE_STAGES.map((s) => data[s.key as keyof DashboardData] as number),
    1
  );

  if (data.totalLeads === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
        <HugeiconsIcon icon={GridViewIcon} className="size-8 opacity-30" />
        <span className="text-xs font-medium">Sem dados de pipeline</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {PIPELINE_STAGES.map((stage, i) => {
        const val = data[stage.key as keyof DashboardData] as number;
        const pct = data.totalLeads > 0 ? (val / data.totalLeads) * 100 : 0;
        const barPct = (val / maxVal) * 100;
        const prevVal =
          i > 0
            ? (data[PIPELINE_STAGES[i - 1].key as keyof DashboardData] as number)
            : null;
        const convPct = prevVal && prevVal > 0 ? (val / prevVal) * 100 : null;

        return (
          <div key={stage.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-xs font-medium text-foreground">
                  {stage.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {convPct !== null && (
                  <span className="text-[9px] text-muted-foreground tabular-nums flex items-center gap-0.5">
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-2.5" />
                    {convPct.toFixed(0)}%
                  </span>
                )}
                <span className="text-xs font-bold tabular-nums" style={{ color: stage.color }}>
                  {val}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  ({pct.toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${barPct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: stage.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Donut chart with legend — inspired by "Por método" section */
function DonutWithLegend({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, i) => s + i.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
        <span className="text-xs font-medium">Sem dados</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      {/* Donut */}
      <div className="relative shrink-0">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={54}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-card border border-border shadow-lg rounded-xl px-3 py-2 text-xs">
                    <span className="font-semibold text-card-foreground">
                      {item.name}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {item.value} ({pct}%)
                    </span>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tabular-nums tracking-tight text-foreground">
            {total}
          </span>
          <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-widest">
            Leads
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {data.map((item) => {
          const pct = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] text-foreground truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold tabular-nums text-foreground">
                  {item.value}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Performance horizontal bar chart */
function PerformanceChart({
  data,
  type,
}: {
  data: DashboardData;
  type: 'corretores' | 'operadoras';
}) {
  const items =
    type === 'corretores' ? data.leadsPorCorretor : data.leadsPorOperadora;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
        <span className="text-xs font-medium">Nenhum dado disponível.</span>
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

  const maxVal = Math.max(...chartData.map((d) => d.leads), 1);

  return (
    <div className="flex flex-col gap-4">
      {chartData.map((d, i) => (
        <div key={d.nome}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-foreground truncate">{d.nome}</span>
            <span className="font-bold tabular-nums text-foreground ml-2">{d.leads}</span>
          </div>
          <div className="relative h-5 bg-muted rounded-full overflow-hidden flex">
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
          <div className="flex items-center gap-3 mt-1 text-[9px] text-muted-foreground tabular-nums">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-blue-400" />
              Atend. {d.emAtendimento}
            </span>
            {d.propostas !== undefined && (
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Propostas {d.propostas}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Vendas {d.vendas}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton loader */
function SkeletonLoader() {
  return (
    <div className="p-6 lg:p-8 flex flex-col gap-5 select-none bg-background h-full">
      <div className="flex items-center justify-between animate-pulse">
        <div className="h-7 w-36 bg-muted rounded-lg" />
        <div className="h-8 w-28 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
        <div className="lg:col-span-2 h-52 bg-muted rounded-xl" />
        <div className="h-52 bg-muted rounded-xl" />
      </div>
      <div className="h-52 bg-muted rounded-xl animate-pulse" />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function ResumePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isDemoMode } = useDemoMode();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<'corretores' | 'operadoras'>(
    'corretores'
  );
  const [perfView, setPerfView] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending, router]);

  useEffect(() => {
    if (data) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 400));
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

  if (isPending || isLoading) return <SkeletonLoader />;

  const metrics = data
    ? [
        {
          label: 'Total de Leads',
          value: data.totalLeads,
          color: '#3b2dff',
          pct: 100,
        },
        {
          label: 'Em Atendimento',
          value: data.emAtendimento,
          color: '#3b82f6',
          pct:
            data.totalLeads > 0
              ? (data.emAtendimento / data.totalLeads) * 100
              : 0,
        },
        {
          label: 'Propostas',
          value: data.propostasEnviadas,
          color: '#f59e0b',
          pct:
            data.totalLeads > 0
              ? (data.propostasEnviadas / data.totalLeads) * 100
              : 0,
        },
        {
          label: 'Vendas Concluídas',
          value: data.vendasConcluidas,
          color: '#10b981',
          pct:
            data.totalLeads > 0
              ? (data.vendasConcluidas / data.totalLeads) * 100
              : 0,
        },
      ]
    : [];

  const operadoraDonutData = (data?.leadsPorOperadora ?? []).map((op, idx) => ({
    name: op.perfil || 'Sem operadora',
    value: op.total,
    color: DONUT_COLORS[idx % DONUT_COLORS.length],
  }));

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 select-none text-left min-w-0 w-full bg-background">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Resumo
          </h1>
          <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
            {isDemoMode
              ? 'Exibindo dados de demonstração'
              : 'Visão geral do pipeline comercial'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          aria-label="Recarregar dados"
        >
          <HugeiconsIcon icon={RefreshIcon} data-icon="inline-start" />
          Atualizar
        </Button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-medium">
          <svg
            className="size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* ── KPI Cards ── */}
      {data && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((m) => (
            <MetricCard
              key={m.label}
              label={m.label}
              value={m.value}
              pct={m.pct}
              color={m.color}
              max={data.totalLeads}
            />
          ))}
        </motion.div>
      )}

      {/* ── Charts Row: Pipeline (2/3) + Operadoras Donut (1/3) ── */}
      {data && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Pipeline Funnel */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Pipeline
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground mt-0.5">
                    Funil de Conversão
                  </CardTitle>
                </div>
                <CardAction>
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border"
                  >
                    {data.totalLeads} leads
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <PipelineFunnel data={data} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Operadoras Donut — "Por método" style */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Distribuição
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground mt-0.5">
                    Por Operadora
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DonutWithLegend data={operadoraDonutData} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── Recent Leads + Performance Row ── */}
      {data && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Recent Leads — styled like "Últimas transações" */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b border-border pb-3">
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Pipeline
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground mt-0.5">
                    Últimos Leads
                  </CardTitle>
                </div>
                <CardAction>
                   <Button variant="ghost" size="sm">
                    Todos
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {data.ultimosLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={UserGroupIcon} className="size-8 opacity-30" />
                    <span className="text-xs font-medium">Nenhum lead registrado.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[420px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Operadora
                          </th>
                          <th className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Corretor
                          </th>
                          <th className="h-9 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ultimosLeads.slice(0, 8).map((lead) => (
                          <tr
                            key={lead.id}
                            className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                          >
                            <td className="p-2 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="size-7 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                                  <span className="text-[10px] font-bold text-muted-foreground">
                                    {lead.nome.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                                  {lead.nome}
                                </span>
                              </div>
                            </td>
                            <td className="p-2 px-4 text-xs text-muted-foreground">
                              {lead.perfil || '—'}
                            </td>
                            <td className="p-2 px-4 text-xs text-muted-foreground">
                              {lead.corretorNome || '—'}
                            </td>
                            <td className="p-2 px-4 text-right">
                              <Badge
                                variant="outline"
                                className={`border ${STATUS_CLASSES[lead.status] ?? STATUS_CLASSES.Aguardando}`}
                              >
                                {lead.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Awaiting card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div>
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Aguardando
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground mt-0.5">
                    Sem Atendimento
                  </CardTitle>
                </div>
                <CardAction>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4.5 text-muted-foreground"
                  />
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold tabular-nums tracking-tight text-neutral-500">
                  {data.aguardando}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalLeads > 0
                    ? `${((data.aguardando / data.totalLeads) * 100).toFixed(0)}% do total de leads`
                    : 'Sem leads cadastrados'}
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Em Atendimento', value: data.emAtendimento, color: '#3b82f6' },
                      { label: 'Proposta Enviada', value: data.propostasEnviadas, color: '#f59e0b' },
                      { label: 'Venda Concluída', value: data.vendasConcluidas, color: '#10b981' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[11px] text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── Performance Section ── */}
      {data && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
        >
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div>
                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Desempenho
                </span>
                <CardTitle className="text-sm font-semibold text-foreground mt-0.5">
                  Distribuição Operacional
                </CardTitle>
              </div>
              <CardAction>
                <div className="flex items-center gap-2">
                  {/* Segmented control */}
                  <div className="inline-flex rounded-lg bg-muted p-0.5">
                    {(['corretores', 'operadoras'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setTableFilter(tab)}
                        className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          tableFilter === tab
                            ? 'bg-card text-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground font-normal'
                        }`}
                      >
                        {tab === 'corretores' ? 'Corretores' : 'Operadoras'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setPerfView((v) => (v === 'chart' ? 'table' : 'chart'))
                    }
                    className="px-3 py-1 rounded-lg border border-border text-[10px] font-medium text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                  >
                    {perfView === 'chart' ? 'Tabela' : 'Gráfico'}
                  </button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="pt-4">
              {perfView === 'chart' ? (
                <PerformanceChart data={data} type={tableFilter} />
              ) : (
                <div className="overflow-x-auto">
                  {tableFilter === 'corretores' ? (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border">
                          {['Corretor', 'Leads', 'Em Atend.', 'Propostas', 'Vendas'].map(
                            (h, i) => (
                              <th
                                key={h}
                                className={`h-9 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${i > 0 ? 'text-center' : ''}`}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {data.leadsPorCorretor.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-xs text-muted-foreground font-medium"
                            >
                              Nenhum lead atribuído a corretores.
                            </td>
                          </tr>
                        ) : (
                          data.leadsPorCorretor.map((corretor) => (
                            <tr
                              key={corretor.id}
                              className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                            >
                              <td className="p-2 px-3 text-xs font-medium text-foreground">
                                {corretor.nome}
                              </td>
                              <td className="p-2 px-3 text-center text-xs tabular-nums text-muted-foreground">
                                {corretor.total}
                              </td>
                              <td className="p-2 px-3 text-center text-xs tabular-nums text-blue-600 font-medium">
                                {corretor.emAtendimento}
                              </td>
                              <td className="p-2 px-3 text-center text-xs tabular-nums text-amber-600 font-medium">
                                {corretor.propostas}
                              </td>
                              <td className="p-2 px-3 text-center text-xs tabular-nums text-emerald-600 font-medium">
                                {corretor.vendas}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border">
                          {['Operadora', 'Leads', 'Em Atend.', 'Vendas', 'Conversão'].map(
                            (h, i) => (
                              <th
                                key={h}
                                className={`h-9 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ${i > 0 ? 'text-center' : ''}`}
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {data.leadsPorOperadora.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-xs text-muted-foreground font-medium"
                            >
                              Nenhum lead registrado por operadora.
                            </td>
                          </tr>
                        ) : (
                          data.leadsPorOperadora.map((op, idx) => {
                            const conv =
                              op.total > 0
                                ? Math.round((op.vendas / op.total) * 100)
                                : null;
                            return (
                              <tr
                                key={idx}
                                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                              >
                                <td className="p-2 px-3 text-xs font-medium text-foreground">
                                  {op.perfil}
                                </td>
                                <td className="p-2 px-3 text-center text-xs tabular-nums text-muted-foreground">
                                  {op.total}
                                </td>
                                <td className="p-2 px-3 text-center text-xs tabular-nums text-info font-medium">
                                  {op.emAtendimento}
                                </td>
                                <td className="p-2 px-3 text-center text-xs tabular-nums text-success font-medium">
                                  {op.vendas}
                                </td>
                                <td className="p-2 px-3 text-center">
                                  {conv !== null ? (
                                    <Badge
                                      variant="outline"
                                      className={
                                        conv >= 25
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                                      }
                                    >
                                      {conv}%
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
