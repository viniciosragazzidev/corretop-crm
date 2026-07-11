'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  BubbleChatIcon,
  ArrowLeft01Icon,
  Tick02Icon,
  Clock01Icon,
  UserIcon,
  MailSend01Icon,
  AttachmentIcon,
  MoreHorizontalIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'client';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  isAudio?: boolean;
  audioDuration?: string;
}

interface Chat {
  id: string;
  clientName: string;
  clientInitials: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'active' | 'waiting' | 'closed';
  // qual corretor está atendendo
  brokerId: string;
  brokerName: string;
  brokerInitials: string;
  messages: Message[];
  product?: string;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const ALL_CHATS: Chat[] = [
  {
    id: '1',
    clientName: 'Diogo Martins',
    clientInitials: 'DM',
    lastMessage: 'Perfeito, aguardo o retorno.',
    time: '10:32',
    unread: 2,
    status: 'active',
    brokerId: 'vr',
    brokerName: 'Vinicios Ragazzi',
    brokerInitials: 'VR',
    product: 'Amil PME Fácil S80',
    messages: [
      { id: 'm1', text: 'Olá Diogo, tudo bem? Sou o Vinicios da Corretop.', sender: 'user', time: '09:45', status: 'read' },
      { id: 'm2', text: 'Oi! Tudo bem sim, pode falar.', sender: 'client', time: '09:47' },
      { id: 'm3', text: 'Ótimo! Queria apresentar o plano Amil PME Fácil S80 que ficou dentro do orçamento que você informou.', sender: 'user', time: '09:48', status: 'read' },
      { id: 'm4', text: 'Pode me mandar os detalhes e o valor mensal?', sender: 'client', time: '09:52' },
      { id: 'm5', text: 'Claro! O valor para 3 vidas (titular + 2 dependentes) fica em R$ 1.864,65/mês. Inclui cobertura ambulatorial e hospitalar.', sender: 'user', time: '09:54', status: 'read' },
      { id: 'm6', text: 'Perfeito, aguardo o retorno.', sender: 'client', time: '10:32' },
    ]
  },
  {
    id: '2',
    clientName: 'Beatriz Vasconcelos',
    clientInitials: 'BV',
    lastMessage: 'Obrigada, vou analisar com meu marido.',
    time: '11:15',
    unread: 0,
    status: 'active',
    brokerId: 'al',
    brokerName: 'Dra. Andressa Lima',
    brokerInitials: 'AL',
    product: 'Bradesco Saúde Ideal',
    messages: [
      { id: 'm1', text: 'Boa tarde Beatriz, aqui é a Andressa da Corretop!', sender: 'user', time: '10:00', status: 'read' },
      { id: 'm2', text: 'Boa tarde!', sender: 'client', time: '10:02' },
      { id: 'm3', text: 'Gostaria de apresentar o Bradesco Saúde Ideal. Para sua família de 4 pessoas o valor seria R$ 3.240,00/mês com cobertura completa.', sender: 'user', time: '10:05', status: 'read' },
      { id: 'm4', text: 'Obrigada, vou analisar com meu marido.', sender: 'client', time: '11:15' },
    ]
  },
  {
    id: '3',
    clientName: 'Marcelo Melo',
    clientInitials: 'MM',
    lastMessage: 'Digitando...',
    time: '14:30',
    unread: 1,
    status: 'waiting',
    brokerId: 'lp',
    brokerName: 'Lucas Pinheiro',
    brokerInitials: 'LP',
    product: 'Unimed Adesão Premium',
    messages: [
      { id: 'm1', text: 'Marcelo, bom dia! Lucas Pinheiro aqui, da Corretop.', sender: 'user', time: '14:00', status: 'read' },
      { id: 'm2', text: 'Oi Lucas! Esperava seu contato.', sender: 'client', time: '14:05' },
      { id: 'm3', text: 'Ótimo! Tenho uma proposta incrível da Unimed Adesão Premium para você. Posso detalhar?', sender: 'user', time: '14:08', status: 'read' },
    ]
  },
  {
    id: '4',
    clientName: 'Clara Rodrigues',
    clientInitials: 'CR',
    lastMessage: 'Prefiro o plano com dental incluso.',
    time: 'Ontem',
    unread: 0,
    status: 'closed',
    brokerId: 'vr',
    brokerName: 'Vinicios Ragazzi',
    brokerInitials: 'VR',
    product: 'Amep Saúde Smart 100',
    messages: [
      { id: 'm1', text: 'Clara, boa tarde! Aqui é o Vinicios.', sender: 'user', time: '16:00', status: 'read' },
      { id: 'm2', text: 'Oi Vinicios!', sender: 'client', time: '16:02' },
      { id: 'm3', text: 'Prefiro o plano com dental incluso.', sender: 'client', time: '16:10' },
    ]
  },
  {
    id: '5',
    clientName: 'Roberto Alves',
    clientInitials: 'RA',
    lastMessage: 'Qual o prazo de carência?',
    time: '09:10',
    unread: 3,
    status: 'active',
    brokerId: 'mc',
    brokerName: 'Mariana Costa',
    brokerInitials: 'MC',
    product: 'Amil Individual Flex',
    messages: [
      { id: 'm1', text: 'Roberto, bom dia! Sou a Mariana da Corretop.', sender: 'user', time: '09:00', status: 'read' },
      { id: 'm2', text: 'Bom dia Mariana!', sender: 'client', time: '09:03' },
      { id: 'm3', text: 'Qual o prazo de carência?', sender: 'client', time: '09:10' },
    ]
  }
];

// O ID do corretor logado (mock – em produção vem da sessão)
const BROKER_MAP: Record<string, string> = {
  'Vinicios Ragazzi': 'vr',
  'Dra. Andressa Lima': 'al',
  'Lucas Pinheiro': 'lp',
  'Mariana Costa': 'mc',
  'Bruno Mendes': 'bm',
};

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: Chat['status'] }) {
  const colors = {
    active: 'bg-emerald-500',
    waiting: 'bg-amber-400',
    closed: 'bg-slate-300',
  };
  return <span className={`size-2 rounded-full shrink-0 ${colors[status]}`} />;
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { data: session } = useSession();
  const isAdmin = session && (session.user as any).role === 'ADMIN';
  const currentUserName = session?.user?.name || 'Vinicios Ragazzi';
  const currentBrokerId = BROKER_MAP[currentUserName] ?? 'vr';

  // Filter chats by role
  const visibleChats = isAdmin
    ? ALL_CHATS
    : ALL_CHATS.filter(c => c.brokerId === currentBrokerId);

  const [filter, setFilter] = useState<'todos' | 'ativos' | 'aguardando' | 'encerrados'>('todos');
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync messages when chat changes
  useEffect(() => {
    if (selectedChat) {
      setLocalMessages(selectedChat.messages);
      // Scroll container locally without jumping page window
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [selectedChat?.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Filter + search
  const filteredChats = visibleChats.filter(c => {
    const matchFilter =
      filter === 'todos' ? true :
        filter === 'ativos' ? c.status === 'active' :
          filter === 'aguardando' ? c.status === 'waiting' :
            c.status === 'closed';
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.product?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function handleSend() {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setLocalMessages(prev => [...prev, msg]);
    setNewMessage('');
  }

  const FILTER_TABS = [
    { key: 'todos', label: 'Todos' },
    { key: 'ativos', label: 'Ativos' },
    { key: 'aguardando', label: 'Aguardando' },
    { key: 'encerrados', label: 'Encerrados' },
  ] as const;

  return (
    <div className="flex h-[calc(100dvh-0px)] overflow-hidden bg-white">

      {/* ── LEFT: Chat List ─────────────────────────────────────────────────── */}
      <div className={`flex flex-col border-r border-slate-100 bg-white shrink-0 transition-all duration-300
        ${selectedChat ? 'hidden md:flex md:w-[320px] lg:w-[360px]' : 'flex w-full md:w-[320px] lg:w-[360px]'}
      `}>

        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-slate-100/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Conversas</h2>
              {isAdmin && (
                <span className="text-xs font-normal text-neutral-400 mt-0.5 block">
                  Visão administrador — todos os atendimentos
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {visibleChats.filter(c => c.unread > 0).length > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {visibleChats.filter(c => c.unread > 0).reduce((sum, c) => sum + c.unread, 0)}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 z-10" />
            <Input
              type="text"
              placeholder="Buscar conversa ou cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-xl border border-slate-200/50 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal text-neutral-700 placeholder:text-neutral-400 outline-none transition-all h-8.5"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-3 overflow-x-auto pb-0.5 scrollbar-none">
            {FILTER_TABS.map(tab => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'secondary'}
                size="xs"
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all cursor-pointer shrink-0 border-transparent ${filter === tab.key
                    ? 'bg-[#3b2dff] text-white hover:bg-[#3b2dff] font-semibold shadow-none'
                    : 'bg-slate-100/60 text-neutral-500 hover:bg-slate-100 font-normal shadow-none'
                  }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto py-2">
          <AnimatePresence>
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="size-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={BubbleChatIcon} className="size-5 text-neutral-300" />
                </div>
                <p className="text-sm font-semibold text-neutral-800">Nenhuma conversa encontrada</p>
              </div>
            ) : (
              filteredChats.map((chat, idx) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, delay: idx * 0.04 }}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors cursor-pointer hover:bg-slate-50/80 ${selectedChat?.id === chat.id ? 'bg-slate-50 border-r-2 border-r-[#3b2dff]' : ''
                    }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 flex items-center justify-center text-xs font-bold text-neutral-600">
                      {chat.clientInitials}
                    </div>
                    <StatusDot status={chat.status} />
                    <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white ${chat.status === 'active' ? 'bg-emerald-500' :
                        chat.status === 'waiting' ? 'bg-amber-400' : 'bg-slate-300'
                      }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-700'}`}>
                        {chat.clientName}
                      </span>
                      <span className="text-[10px] font-normal text-neutral-400 shrink-0">{chat.time}</span>
                    </div>

                    {/* Admin: mostra qual corretor está atendendo */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 mt-0.5 mb-0.5">
                        <span className="inline-flex items-center rounded-md border border-primary/15 bg-primary/8 px-1.5 py-px text-[9px] font-semibold text-primary/70 truncate">
                          {chat.brokerName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className={`text-xs truncate ${chat.unread > 0 ? 'font-medium text-neutral-600' : 'font-normal text-neutral-400'}`}>
                        {chat.status === 'waiting' && chat.lastMessage === 'Digitando...'
                          ? <span className="italic text-emerald-500">Digitando...</span>
                          : chat.lastMessage
                        }
                      </span>
                      {chat.unread > 0 && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary p-0 text-[9px] font-bold text-primary-foreground">
                          {chat.unread}
                        </span>
                      )}
                    </div>

                    {chat.product && (
                      <span className="text-[9px] font-normal text-neutral-350 truncate block mt-0.5">{chat.product}</span>
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: Message Panel ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedChat ? (
          <motion.div
            key={selectedChat.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col min-w-0 bg-white"
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white shrink-0">
              {/* Back button (mobile) */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-neutral-400 transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4.5" />
              </Button>

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="size-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                  {selectedChat.clientInitials}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white ${selectedChat.status === 'active' ? 'bg-emerald-500' :
                    selectedChat.status === 'waiting' ? 'bg-amber-400' : 'bg-slate-300'
                  }`} />
              </div>

              {/* Name + info */}
              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="text-sm font-semibold text-neutral-900 truncate">{selectedChat.clientName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-normal text-neutral-400 truncate">
                    {selectedChat.status === 'active' ? 'Online' :
                      selectedChat.status === 'waiting' ? 'Digitando...' : 'Offline'}
                  </span>
                  {selectedChat.product && (
                    <>
                      <span className="text-neutral-300 text-[10px]">•</span>
                      <span className="text-[10px] font-normal text-neutral-400 truncate">{selectedChat.product}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Admin badge: quem está atendendo */}
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary/12 bg-primary/5 px-2.5 py-1.5 shrink-0 hover:bg-primary/5 transition-colors">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {selectedChat.brokerInitials}
                  </span>
                  <span className="text-[10px] font-semibold text-primary hidden sm:block">{selectedChat.brokerName}</span>
                </span>
              )}

              <Button variant="ghost" size="icon-sm">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4.5" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-[#f8f9fa73]/40">

              {/* Date divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200/60" />
                        <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider px-2">Hoje</span>
                <div className="flex-1 h-px bg-slate-200/60" />
              </div>

              {localMessages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.02 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Client avatar (only if not user) */}
                    {!isUser && (
                      <div className="size-6 rounded-full bg-slate-200 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-neutral-600 shrink-0 mr-2 mt-1">
                        {selectedChat.clientInitials}
                      </div>
                    )}

                    <div className={`max-w-[72%] sm:max-w-[60%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-xs font-normal leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${isUser
                          ? 'bg-[#3b2dff] text-white rounded-br-sm'
                          : 'bg-white text-neutral-800 border border-slate-100/80 rounded-bl-sm'
                        }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[9px] font-normal text-neutral-400">{msg.time}</span>
                        {isUser && msg.status && (
                          <HugeiconsIcon
                            icon={msg.status === 'read' ? CheckmarkCircle01Icon : Tick02Icon}
                            className={`size-3 ${msg.status === 'read' ? 'text-[#3b2dff]' : 'text-neutral-400'}`}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            {/* Admin vê os chats mas não pode digitar (apenas monitoramento) */}
            {isAdmin ? (
              <div className="px-5 py-4 border-t border-slate-100 bg-white flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#3b2dff]/5 border border-[#3b2dff]/12">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-[#3b2dff] shrink-0" />
                  <span className="text-xs font-normal text-[#3b2dff]/70">
                    Modo monitoramento — somente leitura.
                    <span className="font-semibold"> {selectedChat.brokerName}</span> está atendendo.
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="icon">
                    <HugeiconsIcon icon={AttachmentIcon} className="size-4.5" />
                  </Button>
                  <div className="flex-1 relative">
                    <textarea
                      rows={1}
                      placeholder="Digite uma mensagem..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal text-neutral-800 placeholder:text-neutral-400 outline-none resize-none leading-relaxed transition-all max-h-32 overflow-y-auto"
                    />
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${newMessage.trim()
                        ? 'bg-[#3b2dff] text-white hover:bg-[#2d20e0] shadow-sm'
                        : 'bg-slate-100 text-neutral-400 cursor-not-allowed border-transparent'
                      }`}
                  >
                    <HugeiconsIcon icon={MailSend01Icon} className="size-4.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Empty state when no chat is selected */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f8f9fa73]/40 text-center p-8"
          >
            <div className="size-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4">
              <HugeiconsIcon icon={BubbleChatIcon} className="size-7 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">Selecione uma conversa</h3>
            <p className="text-xs font-normal text-neutral-400 mt-1 max-w-xs leading-relaxed">
              {isAdmin
                ? 'Escolha um atendimento para monitorar em tempo real.'
                : 'Selecione um chat para continuar o atendimento do seu lead.'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
