'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon,
  WhatsappIcon,
  ZapIcon,
  Search01Icon,
  PlusSignIcon,
  Cancel01Icon,
  BriefcaseIcon,
  UserGroupIcon,
  Tick02Icon,
  AlertCircleIcon,
  FilterIcon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  phone: string;
  type: 'pme' | 'individual' | 'familiar';
  lives: number;
  status: 'Novo' | 'Em Contato' | 'Negociação' | 'Fechado' | 'Perdido';
  date: string;
  notes?: string;
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'pme' | 'individual' | 'familiar'>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Lead Form State
  const [newNome, setNewNome] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newType, setNewType] = useState<'pme' | 'individual' | 'familiar'>('pme');
  const [newLives, setNewLives] = useState(1);
  const [newNotes, setNewNotes] = useState('');

  // Initial mock data if localStorage is empty
  const defaultLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Carlos Silva',
      phone: '(21) 99999-9999',
      type: 'pme',
      lives: 2,
      status: 'Novo',
      date: 'Hoje, 14:32',
      notes: 'MEI ativo. Tem interesse na tabela Smart PME I de Nova Iguaçu.'
    },
    {
      id: 'lead-2',
      name: 'Aline de Souza',
      phone: '(21) 98888-8888',
      type: 'familiar',
      lives: 3,
      status: 'Em Contato',
      date: 'Ontem, 11:20',
      notes: 'Consultando carência zero para consultas e exames simples.'
    },
    {
      id: 'lead-3',
      name: 'João Paulo',
      phone: '(21) 97777-7777',
      type: 'pme',
      lives: 5,
      status: 'Fechado',
      date: '06/07/2026, 17:45',
      notes: 'Contrato fechado com Amil Saúde. 5 vidas inclusas.'
    },
    {
      id: 'lead-4',
      name: 'Maria Eduarda',
      phone: '(21) 96666-6666',
      type: 'individual',
      lives: 1,
      status: 'Negociação',
      date: '05/07/2026, 10:15',
      notes: 'Aguardando simulação de reembolso para plano Amep Saúde.'
    },
    {
      id: 'lead-5',
      name: 'Carlos Alberto',
      phone: '(21) 95555-5555',
      type: 'individual',
      lives: 1,
      status: 'Perdido',
      date: '03/07/2026, 09:30',
      notes: 'Achou o plano regional muito restrito. Desejava plano nacional premium.'
    }
  ];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('venancor_crm_leads');
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        setLeads(defaultLeads);
      }
    } else {
      setLeads(defaultLeads);
      localStorage.setItem('venancor_crm_leads', JSON.stringify(defaultLeads));
    }
  }, []);

  // Save to localStorage whenever leads state changes
  const saveLeads = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('venancor_crm_leads', JSON.stringify(updatedLeads));
  };

  // Handle phone format (XX) XXXXX-XXXX
  const formatPhone = (val: string) => {
    const input = val.replace(/\D/g, '');
    let formatted = '';
    if (input.length > 0) {
      formatted = `(${input.slice(0, 2)}`;
      if (input.length > 2) {
        formatted += `) ${input.slice(2, 7)}`;
      }
      if (input.length > 7) {
        formatted += `-${input.slice(7, 11)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhone(formatPhone(e.target.value));
  };

  // Add Lead
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || newPhone.length < 14) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newNome,
      phone: newPhone,
      type: newType,
      lives: newLives,
      status: 'Novo',
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      notes: newNotes
    };

    const updated = [newLead, ...leads];
    saveLeads(updated);

    // Reset Form
    setNewNome('');
    setNewPhone('');
    setNewType('pme');
    setNewLives(1);
    setNewNotes('');
    setShowAddModal(false);
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    saveLeads(updated);
  };

  // Cycle Status (Interactive)
  const cycleStatus = (id: string) => {
    const statuses: Lead['status'][] = ['Novo', 'Em Contato', 'Negociação', 'Fechado', 'Perdido'];
    const updated = leads.map(lead => {
      if (lead.id === id) {
        const currentIndex = statuses.indexOf(lead.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...lead, status: statuses[nextIndex] };
      }
      return lead;
    });
    saveLeads(updated);
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID;Nome;Telefone;Tipo de Plano;Vidas;Status;Data;Anotacoes\n';

    leads.forEach(l => {
      const typeLabel = l.type === 'pme' ? 'PME/MEI' : l.type === 'individual' ? 'Individual' : 'Familiar';
      csvContent += `${l.id};${l.name};${l.phone};${typeLabel};${l.lives};${l.status};${l.date};${(l.notes || '').replace(/;/g, ',')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_venancor_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Search logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.phone.includes(searchQuery) ||
                          (lead.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === 'todos' || lead.type === activeFilter;
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'Novo').length;
  const closedLeads = leads.filter(l => l.status === 'Fechado').length;
  const lostLeads = leads.filter(l => l.status === 'Perdido').length;
  
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
  
  // Potential Revenue (Mock calculation: PME average R$ 900/mo, Individual R$ 300/mo)
  const potentialRevenue = leads.reduce((sum, l) => {
    if (l.status === 'Perdido') return sum;
    const ticket = l.type === 'pme' ? 900 : l.type === 'familiar' ? 550 : 300;
    return sum + (ticket * (l.status === 'Fechado' ? 1.0 : 0.4)); // 100% of closed, 40% of pipeline
  }, 0);

  // Status Styling Helpers
  const getStatusStyle = (status: Lead['status']) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Em Contato':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Negociação':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Fechado':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Perdido':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-[#3b2dff] tracking-tight hover:scale-[1.01] transition-transform flex items-center gap-2">
            <span className="size-6 bg-[#3b2dff] text-white rounded-lg flex items-center justify-center font-bold text-xs select-none">V</span>
            <span>Venancor <span className="text-slate-450 font-light text-sm">CRM</span></span>
          </Link>
          <span className="h-4 w-px bg-slate-200 hidden md:block" />
          <nav className="hidden md:flex gap-4 text-xs font-bold text-slate-505">
            <span className="text-[#3b2dff] bg-[#3b2dff]/5 px-3 py-1.5 rounded-lg border border-[#3b2dff]/10">Painel de Leads</span>
            <Link href="/" className="hover:text-slate-800 px-3 py-1.5 transition-colors">Voltar ao Site</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-650 hover:text-slate-800 text-xs font-bold transition-all bg-white cursor-pointer"
          >
            <span>Exportar CSV</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] text-white text-xs font-bold shadow-md shadow-[#3b2dff]/10 cursor-pointer transition-all active:scale-[0.98]"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            <span>Novo Lead</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        {/* Dashboard Title & Quick Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Cotações</h1>
            <p className="text-slate-400 text-xs mt-1">Acompanhe contatos recebidos do simulador em tempo real e controle o pipeline de vendas.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#3b2dff]/5 border border-[#3b2dff]/10 px-3.5 py-2 rounded-2xl text-[#3b2dff]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3b2dff] opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-[#3b2dff]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider">Monitoramento Ativo</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total de Leads</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{totalLeads}</span>
              <span className="text-[10px] text-slate-400 font-bold">cadastrados</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-slate-400 h-full rounded-full w-full" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#3b2dff]">Novos / Sem Contato</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-[#3b2dff] leading-none">{newLeads}</span>
              <span className="text-[10px] text-[#3b2dff] font-bold">pendentes</span>
            </div>
            <div className="w-full bg-[#3b2dff]/10 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-[#3b2dff] h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalLeads > 0 ? (newLeads / totalLeads) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Taxa de Conversão</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-emerald-600 leading-none">{conversionRate}%</span>
              <span className="text-[10px] text-emerald-500 font-bold">{closedLeads} fechados</span>
            </div>
            <div className="w-full bg-emerald-50 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-600">Projeção Mensal</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-purple-600 leading-none">
                {potentialRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="w-full bg-purple-50 h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-purple-500 h-full rounded-full w-3/4" />
            </div>
          </div>
        </section>

        {/* Dashboard Analytics Graph (SVG representation) */}
        <section className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Estatísticas do Funil</h3>
            <p className="text-slate-400 text-[10px] sm:text-xs">Estágio de conversão de todos os leads cadastrados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
            {[
              { stage: 'Novos', count: newLeads, color: 'bg-blue-500' },
              { stage: 'Em Contato', count: leads.filter(l => l.status === 'Em Contato').length, color: 'bg-amber-500' },
              { stage: 'Negociação', count: leads.filter(l => l.status === 'Negociação').length, color: 'bg-purple-500' },
              { stage: 'Fechados (Vendas)', count: closedLeads, color: 'bg-emerald-500' },
              { stage: 'Perdidos', count: lostLeads, color: 'bg-slate-400' }
            ].map((item, idx) => {
              const pct = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.stage}</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-slate-800">{item.count}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{Math.round(pct)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <motion.div 
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: idx * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filters and List Controls */}
        <section className="flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            {/* Filter Tabs by Plan Type */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
              {[
                { id: 'todos', label: 'Todos os Leads' },
                { id: 'pme', label: 'Empresas (PME)' },
                { id: 'individual', label: 'Individual' },
                { id: 'familiar', label: 'Familiar' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-550 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter by Status & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
              {/* Status Select */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <option value="todos">Status: Todos</option>
                  <option value="Novo">Novo</option>
                  <option value="Em Contato">Em Contato</option>
                  <option value="Negociação">Negociação</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Perdido">Perdido</option>
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <input
                  type="text"
                  placeholder="Pesquisar leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#3b2dff] bg-white text-slate-700 outline-none text-xs font-medium transition-colors shadow-2xs placeholder:text-slate-400"
                />
                <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-3 size-3.5 text-slate-450" />
              </div>
            </div>
          </div>

          {/* List Table (Desktop) / Cards Grid (Mobile) */}
          <div className="w-full min-h-[300px] relative">
            {filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 py-16 bg-white border border-slate-200/60 rounded-3xl shadow-xs">
                <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />
                </div>
                <div>
                  <h4 className="text-slate-700 font-extrabold text-base">Nenhum Lead Encontrado</h4>
                  <p className="text-slate-400 text-xs mt-1">Refine seus filtros ou insira um novo lead manual.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block w-full overflow-x-auto border border-slate-200/60 rounded-3xl shadow-sm bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Lead</th>
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Contato</th>
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Perfil / Vidas</th>
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Data</th>
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-center">Status (Clique para alterar)</th>
                        <th className="py-4.5 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {filteredLeads.map(lead => (
                          <motion.tr
                            key={lead.id}
                            layoutId={lead.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors select-text"
                          >
                            {/* Lead Name Initial bubble */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full bg-[#3b2dff]/5 border border-[#3b2dff]/15 text-[#3b2dff] font-extrabold text-xs flex items-center justify-center shrink-0 select-none">
                                  {getInitials(lead.name)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-extrabold text-slate-800 text-sm leading-tight">{lead.name}</span>
                                  {lead.notes && (
                                    <span className="text-[10px] text-slate-450 font-light truncate max-w-[200px] mt-0.5" title={lead.notes}>
                                      {lead.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="py-4 px-6 text-xs font-bold text-slate-600">{lead.phone}</td>

                            {/* Type / Lives */}
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1">
                                  <HugeiconsIcon icon={lead.type === 'pme' ? BriefcaseIcon : UserGroupIcon} className="size-3.5 text-slate-450" />
                                  {lead.type === 'pme' ? 'Empresarial PME' : lead.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">{lead.lives} {lead.lives === 1 ? 'vida' : 'vidas'}</span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="py-4 px-6 text-xs text-slate-550 font-medium">{lead.date}</td>

                            {/* Status Badge */}
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => cycleStatus(lead.id)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer select-none active:scale-95 transition-all shadow-2xs hover:brightness-95 ${getStatusStyle(lead.status)}`}
                              >
                                {lead.status}
                              </button>
                            </td>

                            {/* Actions buttons */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                {/* WhatsApp Call */}
                                <button
                                  onClick={() => {
                                    const text = `Olá ${lead.name}, sou consultor de saúde na Venancor Corretora. Recebi sua simulação e gostaria de te apresentar as tabelas comerciais do plano de saúde.`;
                                    window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                                  }}
                                  className="size-7 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs cursor-pointer transition-colors"
                                  title="Iniciar WhatsApp"
                                >
                                  <HugeiconsIcon icon={WhatsappIcon} className="size-3.5" />
                                </button>
                                
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="size-7 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 flex items-center justify-center shadow-2xs cursor-pointer transition-colors"
                                  title="Excluir Lead"
                                >
                                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Cards list) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  <AnimatePresence initial={false}>
                    {filteredLeads.map(lead => (
                      <motion.div
                        key={lead.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col gap-4 text-left relative overflow-hidden"
                      >
                        {/* Header Details */}
                        <div className="flex justify-between items-start w-full">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-[#3b2dff]/5 border border-[#3b2dff]/15 text-[#3b2dff] font-extrabold text-xs flex items-center justify-center shrink-0 select-none">
                              {getInitials(lead.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-slate-800 text-sm leading-tight">{lead.name}</span>
                              <span className="text-[10px] text-slate-450 font-medium mt-0.5">{lead.phone}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => cycleStatus(lead.id)}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer select-none active:scale-95 transition-all shadow-2xs ${getStatusStyle(lead.status)}`}
                          >
                            {lead.status}
                          </button>
                        </div>

                        {/* Mid Details */}
                        <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-50 py-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium uppercase text-[8px] tracking-wider block">Perfil de Plano</span>
                            <span className="font-bold text-slate-700 mt-1 inline-flex items-center gap-1">
                              <HugeiconsIcon icon={lead.type === 'pme' ? BriefcaseIcon : UserGroupIcon} className="size-3.5 text-slate-450" />
                              {lead.type === 'pme' ? 'Empresarial PME' : lead.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium uppercase text-[8px] tracking-wider block">Vidas / Envio</span>
                            <span className="font-bold text-slate-700 mt-1 block">{lead.lives} {lead.lives === 1 ? 'vida' : 'vidas'} ({lead.date})</span>
                          </div>
                        </div>

                        {lead.notes && (
                          <div className="text-[10px] text-slate-500 font-light bg-slate-50 p-2.5 rounded-xl border border-slate-100 select-text">
                            {lead.notes}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2 w-full mt-1">
                          <button
                            onClick={() => {
                              const text = `Olá ${lead.name}, sou consultor de saúde na Venancor Corretora. Recebi sua simulação e gostaria de te apresentar as tabelas comerciais do plano de saúde.`;
                              window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                          >
                            <HugeiconsIcon icon={WhatsappIcon} className="size-4 shrink-0" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 flex items-center justify-center shadow-2xs cursor-pointer transition-colors"
                            title="Excluir Lead"
                          >
                            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center text-xs text-slate-400 mt-16 select-none">
        <span>© 2026 Venancor Corretora de Seguros. CRM Leads Panel. Todos os direitos reservados.</span>
      </footer>

      {/* NEW LEAD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Adicionar Novo Lead</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="size-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="flex flex-col gap-4">
                {/* Nome */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    placeholder="Ex: Carlos Silva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] outline-none text-xs font-bold placeholder:font-normal placeholder:text-slate-450 transition-colors shadow-2xs"
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">WhatsApp com DDD</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={handlePhoneChange}
                    placeholder="(21) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] outline-none text-xs font-bold placeholder:font-normal placeholder:text-slate-450 transition-colors shadow-2xs"
                  />
                </div>

                {/* Perfil & Vidas Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Perfil de Plano</label>
                    <div className="relative">
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-2xs focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff]"
                      >
                        <option value="pme">PME/MEI</option>
                        <option value="individual">Individual</option>
                        <option value="familiar">Familiar</option>
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-450">
                        <svg className="size-3.5 fill-none stroke-current" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Quantidade de Vidas</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newLives}
                      onChange={(e) => setNewLives(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] outline-none text-xs font-bold shadow-2xs"
                    />
                  </div>
                </div>

                {/* Anotações */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Anotações / Notas extras</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Adicione observações importantes sobre o contato..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] outline-none text-xs font-medium placeholder:font-normal placeholder:text-slate-400 transition-colors shadow-2xs resize-none"
                  />
                </div>

                {/* CTA Submit button */}
                <button
                  type="submit"
                  disabled={!newNome || newPhone.length < 14}
                  className="w-full py-3.5 mt-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-200 disabled:text-slate-450 text-white font-extrabold text-xs shadow-md shadow-[#3b2dff]/15 cursor-pointer transition-all active:scale-[0.98]"
                >
                  Salvar Lead no CRM
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
