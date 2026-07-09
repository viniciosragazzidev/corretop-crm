'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  Cancel01Icon,
  BriefcaseIcon,
  UserGroupIcon,
  WhatsappIcon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { useCRM, Lead } from '../crm-context';

export default function KanbanBoard() {
  const { leads, updateLeadStatus, deleteLead, addLead, searchQuery } = useCRM();
  const [activeFilter, setActiveFilter] = useState<'todos' | 'pme' | 'individual' | 'familiar'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead state
  const [newNome, setNewNome] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newType, setNewType] = useState<'pme' | 'individual' | 'familiar'>('pme');
  const [newLives, setNewLives] = useState(1);
  const [newNotes, setNewNotes] = useState('');

  const columns: { id: Lead['status']; title: string; color: string; border: string; text: string }[] = [
    { id: 'Novo', title: 'Novos', color: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-600' },
    { id: 'Em Contato', title: 'Em Contato', color: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-600' },
    { id: 'Negociação', title: 'Negociação', color: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-600' },
    { id: 'Fechado', title: 'Vendas Fechadas', color: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-600' },
    { id: 'Perdido', title: 'Perdidos', color: 'bg-slate-50/50', border: 'border-slate-200/60', text: 'text-slate-500' }
  ];

  // Helper for phone format
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || newPhone.length < 14) return;
    
    addLead({
      name: newNome,
      phone: newPhone,
      type: newType,
      lives: newLives,
      notes: newNotes,
      ages: Array.from({ length: newLives }, () => Math.floor(Math.random() * 50) + 1) // random ages for pricing calculator
    });

    setNewNome('');
    setNewPhone('');
    setNewType('pme');
    setNewLives(1);
    setNewNotes('');
    setShowAddModal(false);
  };

  // Filter logic
  const getFilteredLeadsForColumn = (status: Lead['status']) => {
    return leads.filter(lead => {
      const matchesStatus = lead.status === status;
      const matchesType = activeFilter === 'todos' || lead.type === activeFilter;
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lead.phone.includes(searchQuery) ||
                            (lead.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesType && matchesSearch;
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getCardHeaderColor = (type: Lead['type']) => {
    switch (type) {
      case 'pme': return 'border-l-4 border-l-blue-500';
      case 'familiar': return 'border-l-4 border-l-purple-500';
      case 'individual': return 'border-l-4 border-l-emerald-500';
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 flex flex-col h-full select-none">
      
      {/* 1. Header controls (Filters & Add Lead) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/50 shadow-2xs">
        
        {/* Filter Tab buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {[
            { id: 'todos', label: 'Todos os Perfis' },
            { id: 'pme', label: 'PME / MEI' },
            { id: 'individual', label: 'Individual' },
            { id: 'familiar', label: 'Familiar' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white text-slate-800 shadow-3xs border border-slate-200/30'
                  : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Add Lead button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] text-white text-xs font-bold shadow-md shadow-[#3b2dff]/10 cursor-pointer transition-all active:scale-[0.98] self-stretch sm:self-auto"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
          <span>Cadastrar Novo Lead</span>
        </button>
      </div>

      {/* 2. Kanban Board Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto min-h-[60vh] items-start pb-4">
        {columns.map(col => {
          const colLeads = getFilteredLeadsForColumn(col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col gap-4 p-4 rounded-3xl border ${col.border} ${col.color} min-w-[220px] max-h-[75vh] overflow-y-auto`}
            >
              {/* Column title and card count */}
              <div className="flex justify-between items-center px-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${col.text}`}>{col.title}</span>
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-3xs">{colLeads.length}</span>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {colLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      layoutId={lead.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`bg-white p-4 rounded-2xl border border-slate-200/50 shadow-3xs flex flex-col gap-3.5 text-left relative group ${getCardHeaderColor(lead.type)}`}
                    >
                      {/* Name & Type */}
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-xs tracking-tight truncate group-hover:text-[#3b2dff] transition-colors">{lead.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                          <HugeiconsIcon icon={lead.type === 'pme' ? BriefcaseIcon : UserGroupIcon} className="size-3 text-slate-400 shrink-0" />
                          <span>{lead.type === 'pme' ? 'PME' : lead.type} • {lead.lives} {lead.lives === 1 ? 'vida' : 'vidas'}</span>
                        </span>
                      </div>

                      {/* Notes (Truncated preview) */}
                      {lead.notes && (
                        <p className="text-[10px] text-slate-450 font-light line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                          {lead.notes}
                        </p>
                      )}

                      {/* Card actions: WhatsApp quicklink and status quick transition */}
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">{lead.date.split(',')[0]}</span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Move stage action */}
                          <button
                            onClick={() => {
                              const statuses: Lead['status'][] = ['Novo', 'Em Contato', 'Negociação', 'Fechado', 'Perdido'];
                              const nextStatus = statuses[(statuses.indexOf(lead.status) + 1) % statuses.length];
                              updateLeadStatus(lead.id, nextStatus);
                            }}
                            className="size-6 rounded-lg bg-slate-50 border border-slate-200 hover:bg-[#3b2dff]/5 hover:border-[#3b2dff] text-slate-400 hover:text-[#3b2dff] flex items-center justify-center cursor-pointer transition-all active:scale-90"
                            title="Avançar Estágio"
                          >
                            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                          </button>

                          {/* WhatsApp action */}
                          <a
                            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-6 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                            title="WhatsApp Link"
                          >
                            <HugeiconsIcon icon={WhatsappIcon} className="size-3" />
                          </a>

                          {/* Delete action */}
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="size-6 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 text-red-500 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                            title="Excluir Lead"
                          >
                            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {colLeads.length === 0 && (
                  <div className="py-6 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
                    Sem leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. NEW LEAD MODAL */}
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
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Novo Lead Manual</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="size-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newNome}
                    onChange={(e) => setNewNome(e.target.value)}
                    placeholder="Ex: Roberto Carlos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 focus:border-[#3b2dff] outline-none text-xs font-bold shadow-2xs transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">WhatsApp com DDD</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={handlePhoneChange}
                    placeholder="(21) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 focus:border-[#3b2dff] outline-none text-xs font-bold shadow-2xs transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Perfil de Plano</label>
                    <div className="relative">
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
                      >
                        <option value="pme">PME / MEI</option>
                        <option value="individual">Individual</option>
                        <option value="familiar">Familiar</option>
                      </select>
                      <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-450">
                        <svg className="size-3.5 fill-none stroke-current" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Vidas</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newLives}
                      onChange={(e) => setNewLives(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 focus:border-[#3b2dff] outline-none text-xs font-bold shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Notas do Lead</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Adicione observações de cotação..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-[#3b2dff] outline-none text-xs font-medium resize-none shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-extrabold text-xs shadow-md shadow-[#3b2dff]/15 cursor-pointer transition-all active:scale-[0.98]"
                >
                  Salvar Lead no Funil
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
