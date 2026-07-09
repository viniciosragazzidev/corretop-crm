'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PlusSignIcon,
  Cancel01Icon,
  UserGroupIcon,
  AlertCircleIcon
} from '@hugeicons/core-free-icons';
import { useCRM, Corretor } from '../crm-context';

export default function CorretoresManagement() {
  const { corretores, setCorretores, role } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);

  // New Corretor Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'USER'>('USER');

  // RBAC Permission check
  if (role !== 'ADMIN') {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center p-6 bg-slate-50 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-lg text-center flex flex-col items-center gap-4"
        >
          <div className="size-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-2xs">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-slate-800 tracking-tight">Área Restrita ao Gerente</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              O seu perfil de acesso atual de <strong>Corretor Comercial</strong> não possui autorização administrativa para gerenciar a equipe.
            </p>
          </div>
          <div className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">
            Altere para perfil &quot;Admin&quot; na Topbar para testar esta tela.
          </div>
        </motion.div>
      </div>
    );
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newCorretor: Corretor = {
      id: `corretor-${Date.now()}`,
      name: newName,
      email: newEmail,
      activeLeads: 0,
      closeRate: 0,
      status: 'Ativo',
      role: newRole
    };

    setCorretores(prev => [...prev, newCorretor]);
    setNewName('');
    setNewEmail('');
    setNewRole('USER');
    setShowAddModal(false);
  };

  const toggleStatus = (id: string) => {
    setCorretores(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Ativo' ? 'Inativo' : 'Ativo' };
      }
      return c;
    }));
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 select-none text-left">
      
      {/* Header card info */}
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-200/60 shadow-3xs">
        <div>
          <h3 className="text-base font-black text-slate-800 tracking-tight">Equipe de Vendas</h3>
          <p className="text-slate-400 text-[10px] sm:text-xs">Monitore os consultores ativos, taxa de conversão e leads atribuídos.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] text-white text-xs font-bold shadow-md shadow-[#3b2dff]/10 cursor-pointer transition-all active:scale-[0.98]"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
          <span>Cadastrar Consultor</span>
        </button>
      </div>

      {/* Corretores Table List */}
      <div className="w-full overflow-x-auto border border-slate-200/60 rounded-3xl shadow-3xs bg-white">
        <table className="w-full border-collapse text-left min-w-[650px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Nome / Email</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450">Função</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-center">Leads Ativos</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-center">Taxa de Fechamento</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-center">Status</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-wider text-slate-450 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {corretores.map(c => (
                <motion.tr
                  key={c.id}
                  layoutId={c.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-slate-50 border border-slate-200/65 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={UserGroupIcon} className="size-4 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-xs tracking-tight">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4.5 px-6">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
                      c.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-650 border-purple-100'
                        : 'bg-blue-50 text-blue-650 border-blue-100'
                    }`}>
                      {c.role === 'ADMIN' ? 'Gerente' : 'Consultor'}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-center font-mono text-xs font-bold text-slate-700">
                    {c.activeLeads}
                  </td>
                  <td className="py-4.5 px-6 text-center font-mono text-xs font-bold text-slate-700">
                    {c.closeRate}%
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      c.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-450 border-slate-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          c.status === 'Ativo'
                            ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            : 'bg-[#3b2dff]/5 text-[#3b2dff] border-[#3b2dff]/10 hover:bg-[#3b2dff]/10'
                        }`}
                      >
                        {c.status === 'Ativo' ? 'Desativar' : 'Reativar'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* NEW CORRETOR MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Cadastrar Consultor</h3>
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
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: João Ferreira"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 focus:border-[#3b2dff] outline-none text-xs font-bold shadow-2xs transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Email Corporativo</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="joao@venacorseguros.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 focus:border-[#3b2dff] outline-none text-xs font-bold shadow-2xs transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Nível de Permissão (RBAC)</label>
                  <div className="relative">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      <option value="USER">Consultor Comercial (USER)</option>
                      <option value="ADMIN">Gerente Geral (ADMIN)</option>
                    </select>
                    <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-455">
                      <svg className="size-3.5 fill-none stroke-current" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-extrabold text-xs shadow-md shadow-[#3b2dff]/15 cursor-pointer transition-all active:scale-[0.98]"
                >
                  Confirmar Cadastro
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
