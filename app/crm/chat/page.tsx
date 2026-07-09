'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  WhatsappIcon,
  Search01Icon,
  ZapIcon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { useCRM, Chat, Message, Lead } from '../crm-context';

// Amep Saúde Pricing reference
const getAmepPrice = (age: number, planType: 'adesao' | 'mei1' | 'pme2' | 'premium') => {
  if (age <= 18) {
    if (planType === 'adesao') return 138.74;
    if (planType === 'mei1') return 93.19;
    if (planType === 'pme2') return 82.94;
    return 128.97;
  } else if (age <= 23) {
    if (planType === 'adesao') return 145.67;
    if (planType === 'mei1') return 97.85;
    if (planType === 'pme2') return 87.09;
    return 135.42;
  } else if (age <= 28) {
    if (planType === 'adesao') return 160.24;
    if (planType === 'mei1') return 107.64;
    if (planType === 'pme2') return 95.80;
    return 148.96;
  } else if (age <= 33) {
    if (planType === 'adesao') return 176.26;
    if (planType === 'mei1') return 118.40;
    if (planType === 'pme2') return 105.37;
    return 163.86;
  } else if (age <= 38) {
    if (planType === 'adesao') return 197.42;
    if (planType === 'mei1') return 132.60;
    if (planType === 'pme2') return 118.02;
    return 183.52;
  } else if (age <= 43) {
    if (planType === 'adesao') return 221.11;
    if (planType === 'mei1') return 148.51;
    if (planType === 'pme2') return 132.18;
    return 205.55;
  } else if (age <= 48) {
    if (planType === 'adesao') return 276.38;
    if (planType === 'mei1') return 185.64;
    if (planType === 'pme2') return 165.22;
    return 256.94;
  } else if (age <= 53) {
    if (planType === 'adesao') return 317.84;
    if (planType === 'mei1') return 213.49;
    if (planType === 'pme2') return 190.00;
    return 295.47;
  } else if (age <= 58) {
    if (planType === 'adesao') return 365.52;
    if (planType === 'mei1') return 245.51;
    if (planType === 'pme2') return 218.50;
    return 339.79;
  } else {
    if (planType === 'adesao') return 493.45;
    if (planType === 'mei1') return 331.44;
    if (planType === 'pme2') return 294.98;
    return 458.71;
  }
};

export default function ChatOmnichannel() {
  const { leads, setLeads, chats, setChats, role, corretores } = useCRM();
  const [activeChatTab, setActiveChatTab] = useState<'minhas' | 'aguardando' | 'todas'>('minhas');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto fallback to 'todas' if user changes role to ADMIN and is not currently on it
  useEffect(() => {
    if (role !== 'ADMIN' && activeChatTab === 'todas') {
      setActiveChatTab('minhas');
    }
  }, [role]);

  // Select first chat on load if none selected
  useEffect(() => {
    const visible = getVisibleChats();
    if (visible.length > 0 && !selectedChatId) {
      setSelectedChatId(visible[0].id);
    }
  }, [chats, activeChatTab]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatId, chats]);

  const activeChat = chats.find(c => c.id === selectedChatId);
  const associatedLead = leads.find(l => l.id === activeChat?.leadId);
  const activeCorretor = corretores.find(c => c.id === activeChat?.corretorId);

  // Get current active user corretor (Thiago if Corretor/USER, Marcos if ADMIN)
  const currentCorretorId = role === 'ADMIN' ? 'corretor-3' : 'corretor-1';

  const getVisibleChats = () => {
    return chats.filter(chat => {
      const lead = leads.find(l => l.id === chat.leadId);
      if (!lead) return false;

      const matchesSearch = lead.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                            lead.phone.includes(chatSearchQuery);

      if (!matchesSearch) return false;

      if (activeChatTab === 'minhas') {
        return chat.corretorId === currentCorretorId;
      }
      if (activeChatTab === 'aguardando') {
        return chat.unreadCount > 0 || !chat.corretorId;
      }
      // 'todas' tab is only for admin
      return true;
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !selectedChatId) return;

    const timeString = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'corretor',
      text: text,
      time: timeString
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMessage: text,
          time: timeString,
          unreadCount: 0,
          messages: [...chat.messages, newMsg]
        };
      }
      return chat;
    }));

    if (!textToSend) setInputText('');
  };

  // Add/remove ages inside right context panel
  const handleAddAge = () => {
    if (!associatedLead) return;
    const defaultNewAge = 30;
    const updatedAges = [...(associatedLead.ages || []), defaultNewAge];
    
    setLeads(prev => prev.map(l => {
      if (l.id === associatedLead.id) {
        return { ...l, ages: updatedAges, lives: updatedAges.length };
      }
      return l;
    }));
  };

  const handleAgeChange = (idx: number, ageVal: number) => {
    if (!associatedLead || !associatedLead.ages) return;
    const updated = [...associatedLead.ages];
    updated[idx] = Math.max(0, ageVal);
    setLeads(prev => prev.map(l => l.id === associatedLead.id ? { ...l, ages: updated } : l));
  };

  const handleRemoveAge = (idx: number) => {
    if (!associatedLead || !associatedLead.ages) return;
    const updated = associatedLead.ages.filter((_, i) => i !== idx);
    setLeads(prev => prev.map(l => l.id === associatedLead.id ? { ...l, ages: updated, lives: Math.max(1, updated.length) } : l));
  };

  // Pricing calculations based on selected lead's ages
  const calculateTotalPlanPrice = (planType: 'adesao' | 'mei1' | 'pme2' | 'premium') => {
    if (!associatedLead || !associatedLead.ages) return 0;
    return associatedLead.ages.reduce((sum, age) => sum + getAmepPrice(age, planType), 0);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden select-none">
      
      {/* COLUMN 1: Conversations list (Left, width 80 / 320px) */}
      <div className="w-80 border-r border-slate-200/50 bg-white flex flex-col shrink-0 h-full">
        {/* Tab Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            <button
              onClick={() => setActiveChatTab('minhas')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeChatTab === 'minhas'
                  ? 'bg-white text-slate-800 shadow-3xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Minhas
            </button>
            <button
              onClick={() => setActiveChatTab('aguardando')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeChatTab === 'aguardando'
                  ? 'bg-white text-slate-800 shadow-3xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Aguardando
            </button>
            {role === 'ADMIN' && (
              <button
                onClick={() => setActiveChatTab('todas')}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeChatTab === 'todas'
                    ? 'bg-white text-slate-800 shadow-3xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Todas
              </button>
            )}
          </div>

          {/* Search bar inside list */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#3b2dff] text-xs font-semibold outline-none transition-all shadow-3xs"
            />
            <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
          </div>
        </div>

        {/* Chats list scrolling */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {getVisibleChats().map(chat => {
            const isSelected = chat.id === selectedChatId;
            const lead = leads.find(l => l.id === chat.leadId);
            const corretorName = corretores.find(c => c.id === chat.corretorId)?.name || 'Sem Responsável';
            if (!lead) return null;

            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-4 flex items-start gap-3 text-left border-l-4 transition-all hover:bg-slate-50/60 cursor-pointer ${
                  isSelected
                    ? 'bg-[#3b2dff]/3 border-l-[#3b2dff]'
                    : 'border-l-transparent'
                }`}
              >
                <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-xs text-slate-500 shrink-0">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-800 text-xs truncate max-w-[120px]">{lead.name}</span>
                    <span className="text-[8px] font-bold text-slate-400">{chat.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-450 truncate mt-1 leading-normal font-medium">{chat.lastMessage}</p>
                  
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                      Resp: {corretorName}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="size-4 bg-[#3b2dff] text-white font-mono text-[8px] font-black rounded-full flex items-center justify-center shadow-3xs">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {getVisibleChats().length === 0 && (
            <div className="py-12 px-4 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
              Nenhuma conversa
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: Chat active window (Center, flex-1) */}
      <div className="flex-1 bg-slate-50 flex flex-col h-full border-r border-slate-200/50">
        {activeChat && associatedLead ? (
          <>
            {/* Header info */}
            <div className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 shadow-3xs">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-3xs">
                  <HugeiconsIcon icon={WhatsappIcon} className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-slate-800 text-xs leading-none">{associatedLead.name}</span>
                  <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-1 inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>WhatsApp Conectado</span>
                  </span>
                </div>
              </div>

              {/* Status indicator on header */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Corretor:</span>
                <span className="text-slate-655 font-bold text-xs">{activeCorretor?.name || 'Não vinculado'}</span>
              </div>
            </div>

            {/* Messages scrolling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.map(msg => {
                const isMe = msg.sender === 'corretor';
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-3xs ${
                        isMe
                          ? 'bg-[#3b2dff] text-white rounded-tr-none text-right'
                          : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none text-left'
                      }`}
                    >
                      <p className="select-text whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[8px] font-bold mt-1.5 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick template macros and Message typing bar */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0">
              
              {/* Preset macros */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest shrink-0 select-none mr-1">Ações rápidas:</span>
                <button
                  onClick={() => handleSendMessage('📄 Tabela Amep Saude 2026.pdf (Enviado com sucesso)')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#3b2dff] bg-slate-50 hover:bg-[#3b2dff]/5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-[#3b2dff] transition-all shrink-0 cursor-pointer"
                >
                  Enviar Tabela Amep (PDF)
                </button>
                <button
                  onClick={() => handleSendMessage('Olá! Recebi sua simulação e vou te apresentar os melhores planos para o seu perfil.')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#3b2dff] bg-slate-50 hover:bg-[#3b2dff]/5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-[#3b2dff] transition-all shrink-0 cursor-pointer"
                >
                  Mensagem Boas-vindas
                </button>
                <button
                  onClick={() => handleSendMessage('Olá! Vamos agendar uma ligação rápida hoje às 16h?')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#3b2dff] bg-slate-50 hover:bg-[#3b2dff]/5 text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-[#3b2dff] transition-all shrink-0 cursor-pointer"
                >
                  Agendar Ligação
                </button>
              </div>

              {/* Typing inputs */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-3 w-full"
              >
                <input
                  type="text"
                  placeholder="Escreva sua resposta..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#3b2dff] outline-none text-xs font-semibold shadow-3xs"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="size-10 rounded-2xl bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center shadow-md shadow-[#3b2dff]/10 shrink-0 cursor-pointer transition-all active:scale-[0.96]"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center gap-3 select-none">
            <div className="size-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
              <HugeiconsIcon icon={WhatsappIcon} className="size-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Selecione uma Conversa</h4>
              <p className="text-[10px] mt-1">Escolha um lead na lista lateral para iniciar o atendimento.</p>
            </div>
          </div>
        )}
      </div>

      {/* COLUMN 3: Lead Context & Dynamic Pricing Calculator (Right, width 80 / 320px) */}
      <div className="w-80 border-l border-slate-200/50 bg-white flex flex-col shrink-0 h-full overflow-y-auto p-5 space-y-6 text-left">
        {associatedLead ? (
          <>
            {/* Header Profiler */}
            <div className="flex flex-col items-center text-center gap-2.5 pb-5 border-b border-slate-100">
              <div className="size-14 rounded-full bg-[#3b2dff]/5 border border-[#3b2dff]/15 text-[#3b2dff] font-extrabold text-lg flex items-center justify-center select-none shadow-3xs">
                {getInitials(associatedLead.name)}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm leading-tight">{associatedLead.name}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{associatedLead.phone}</span>
              </div>
            </div>

            {/* Lead Status Tag */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Status da Negociação</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Novo', 'Em Contato', 'Negociação', 'Fechado', 'Perdido'] as Lead['status'][]).map(st => {
                  const isCurrent = associatedLead.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        setLeads(prev => prev.map(l => l.id === associatedLead.id ? { ...l, status: st } : l));
                      }}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        isCurrent
                          ? st === 'Fechado'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 font-black'
                            : st === 'Perdido'
                              ? 'bg-slate-100 text-slate-500 border-slate-200'
                              : 'bg-[#3b2dff]/5 text-[#3b2dff] border-[#3b2dff]/15 font-black'
                          : 'bg-white text-slate-450 border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Corretor Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Corretor Vinculado</label>
              <div className="relative">
                <select
                  value={associatedLead.assignedCorretorId || ''}
                  onChange={(e) => {
                    const corrId = e.target.value;
                    setLeads(prev => prev.map(l => l.id === associatedLead.id ? { ...l, assignedCorretorId: corrId } : l));
                    // Also update chat assigned corretor
                    setChats(prev => prev.map(c => c.leadId === associatedLead.id ? { ...c, corretorId: corrId } : c));
                  }}
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-slate-300 transition-colors shadow-3xs"
                >
                  {corretores.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="size-3 fill-none stroke-current" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            {/* Dynamic Ages Section */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Faixas Etárias (Vidas)</label>
                <button
                  onClick={handleAddAge}
                  className="text-[#3b2dff] hover:text-[#2d20e0] text-[10px] font-black uppercase tracking-wider cursor-pointer"
                >
                  + Add Idade
                </button>
              </div>

              {/* Ages inputs list */}
              <div className="flex flex-wrap gap-2">
                {(associatedLead.ages || []).map((age, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 rounded-xl px-2 py-1">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => handleAgeChange(idx, parseInt(e.target.value) || 0)}
                      className="w-8 bg-transparent text-xs font-black text-slate-700 outline-none text-center"
                    />
                    <button
                      onClick={() => handleRemoveAge(idx)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {(associatedLead.ages || []).length === 0 && (
                  <span className="text-[10px] text-slate-400 font-bold block">Nenhuma idade informada</span>
                )}
              </div>
            </div>

            {/* Dynamic Pricing Calculator display */}
            <div className="space-y-3 bg-[#3b2dff]/3 border border-[#3b2dff]/10 p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-[#3b2dff]">
                <HugeiconsIcon icon={ZapIcon} className="size-4" />
                <span className="text-[9px] font-black uppercase tracking-wider">Simulador Amep Saúde</span>
              </div>

              <div className="space-y-2 py-1">
                {/* PME2 */}
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Smart PME II (Recomendado)</span>
                  <span className="font-mono text-[#3b2dff] font-black">
                    {calculateTotalPlanPrice('pme2').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                {/* MEI1 */}
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Smart MEI / PME I</span>
                  <span className="font-mono">
                    {calculateTotalPlanPrice('mei1').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                {/* Adesao */}
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Ideal Adesão</span>
                  <span className="font-mono">
                    {calculateTotalPlanPrice('adesao').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block text-center border-t border-[#3b2dff]/5 pt-2">
                Valores calculados em tempo real
              </span>
            </div>
          </>
        ) : (
          <div className="py-24 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            Sem contexto
          </div>
        )}
      </div>

    </div>
  );
}
