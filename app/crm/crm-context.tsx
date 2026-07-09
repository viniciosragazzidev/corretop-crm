'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'USER';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: 'pme' | 'individual' | 'familiar';
  lives: number;
  status: 'Novo' | 'Em Contato' | 'Negociação' | 'Fechado' | 'Perdido';
  date: string;
  notes?: string;
  assignedCorretorId?: string;
  ages?: number[]; // Simulating client ages for price calculation
}

export interface Corretor {
  id: string;
  name: string;
  email: string;
  activeLeads: number;
  closeRate: number;
  status: 'Ativo' | 'Inativo';
  role: UserRole;
}

export interface Message {
  id: string;
  sender: 'lead' | 'corretor';
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  leadId: string;
  leadName: string;
  corretorId: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

interface CRMContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  corretores: Corretor[];
  setCorretores: React.Dispatch<React.SetStateAction<Corretor[]>>;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');

  // Default Mock Leads
  const defaultLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Carlos Henrique Silva',
      phone: '(21) 96446-9012',
      type: 'pme',
      lives: 4,
      status: 'Novo',
      date: 'Hoje, 14:32',
      notes: 'MEI ativo. Tem interesse na tabela Amep Saúde para a família e funcionários.',
      assignedCorretorId: 'corretor-1',
      ages: [32, 28, 4, 1]
    },
    {
      id: 'lead-2',
      name: 'Aline de Souza Mendes',
      phone: '(21) 98123-4567',
      type: 'familiar',
      lives: 3,
      status: 'Em Contato',
      date: 'Hoje, 11:20',
      notes: 'Buscando carência zero para exames laboratoriais na Baixada Fluminense.',
      assignedCorretorId: 'corretor-2',
      ages: [45, 42, 16]
    },
    {
      id: 'lead-3',
      name: 'João Paulo Santos',
      phone: '(21) 97000-8888',
      type: 'pme',
      lives: 5,
      status: 'Fechado',
      date: 'Ontem, 17:45',
      notes: 'Contrato fechado com Amep Saúde. 5 vidas ativas. PME em Nova Iguaçu.',
      assignedCorretorId: 'corretor-1',
      ages: [29, 27, 25, 23, 22]
    },
    {
      id: 'lead-4',
      name: 'Maria Eduarda Costa',
      phone: '(21) 99122-3344',
      type: 'individual',
      lives: 1,
      status: 'Negociação',
      date: '07/07/2026, 10:15',
      notes: 'Deseja plano individual básico. Aguardando simulação final.',
      assignedCorretorId: 'corretor-3',
      ages: [24]
    },
    {
      id: 'lead-5',
      name: 'Carlos Alberto Rezende',
      phone: '(21) 97455-6677',
      type: 'individual',
      lives: 1,
      status: 'Perdido',
      date: '06/07/2026, 09:30',
      notes: 'Achou o plano regional restrito. Preferiu fechar plano nacional premium.',
      assignedCorretorId: 'corretor-2',
      ages: [50]
    }
  ];

  // Default Mock Corretores
  const defaultCorretores: Corretor[] = [
    { id: 'corretor-1', name: 'Thiago Martins', email: 'thiago.consultor@venacor.com', activeLeads: 8, closeRate: 42, status: 'Ativo', role: 'USER' },
    { id: 'corretor-2', name: 'Juliana Barbosa', email: 'juliana.saude@venacor.com', activeLeads: 6, closeRate: 35, status: 'Ativo', role: 'USER' },
    { id: 'corretor-3', name: 'Marcos Aurelio (Você)', email: 'marcos.gerente@venacor.com', activeLeads: 3, closeRate: 50, status: 'Ativo', role: 'ADMIN' }
  ];

  // Default Mock Chats
  const defaultChats: Chat[] = [
    {
      id: 'chat-1',
      leadId: 'lead-1',
      leadName: 'Carlos Henrique Silva',
      corretorId: 'corretor-1',
      lastMessage: 'Vou enviar a tabela do Amep Saúde em PDF para você analisar.',
      time: '14:35',
      unreadCount: 1,
      messages: [
        { id: 'm1', sender: 'lead', text: 'Boa tarde! Gostaria de cotar o plano Amep Saúde para minha empresa.', time: '14:30' },
        { id: 'm2', sender: 'corretor', text: 'Olá Carlos! Com certeza. Quantas vidas seriam no total?', time: '14:32' },
        { id: 'm3', sender: 'lead', text: 'Seriam 4 vidas: eu, minha esposa e meus dois filhos.', time: '14:33' },
        { id: 'm4', sender: 'corretor', text: 'Perfeito. Vou enviar a tabela do Amep Saúde em PDF para você analisar.', time: '14:35' }
      ]
    },
    {
      id: 'chat-2',
      leadId: 'lead-2',
      leadName: 'Aline de Souza Mendes',
      corretorId: 'corretor-2',
      lastMessage: 'Temos opções com carência reduzida sim.',
      time: '11:22',
      unreadCount: 0,
      messages: [
        { id: 'm5', sender: 'lead', text: 'Vocês têm plano com carência zero?', time: '11:18' },
        { id: 'm6', sender: 'corretor', text: 'Temos opções com carência reduzida sim.', time: '11:22' }
      ]
    },
    {
      id: 'chat-4',
      leadId: 'lead-4',
      leadName: 'Maria Eduarda Costa',
      corretorId: 'corretor-3',
      lastMessage: 'A tabela individual do Amep começa em R$ 82,94 para crianças.',
      time: 'Ontem',
      unreadCount: 0,
      messages: [
        { id: 'm7', sender: 'lead', text: 'Qual o valor do plano individual mais em conta?', time: '10:10' },
        { id: 'm8', sender: 'corretor', text: 'A tabela individual do Amep começa em R$ 82,94 para crianças.', time: '10:15' }
      ]
    }
  ];

  const [leads, setLeads] = useState<Lead[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  // Load / Initialize local storage states
  useEffect(() => {
    const savedRole = localStorage.getItem('venancor_crm_role') as UserRole;
    if (savedRole) setRoleState(savedRole);

    const savedLeads = localStorage.getItem('venancor_crm_leads');
    if (savedLeads) {
      try { setLeads(JSON.parse(savedLeads)); } catch (e) { setLeads(defaultLeads); }
    } else {
      setLeads(defaultLeads);
      localStorage.setItem('venancor_crm_leads', JSON.stringify(defaultLeads));
    }

    const savedCorretores = localStorage.getItem('venancor_crm_corretores');
    if (savedCorretores) {
      try { setCorretores(JSON.parse(savedCorretores)); } catch (e) { setCorretores(defaultCorretores); }
    } else {
      setCorretores(defaultCorretores);
      localStorage.setItem('venancor_crm_corretores', JSON.stringify(defaultCorretores));
    }

    const savedChats = localStorage.getItem('venancor_crm_chats');
    if (savedChats) {
      try { setChats(JSON.parse(savedChats)); } catch (e) { setChats(defaultChats); }
    } else {
      setChats(defaultChats);
      localStorage.setItem('venancor_crm_chats', JSON.stringify(defaultChats));
    }
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    localStorage.setItem('venancor_crm_role', r);
  };

  // Sync back to storage on edit
  useEffect(() => {
    if (leads.length > 0) localStorage.setItem('venancor_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    if (corretores.length > 0) localStorage.setItem('venancor_crm_corretores', JSON.stringify(corretores));
  }, [corretores]);

  useEffect(() => {
    if (chats.length > 0) localStorage.setItem('venancor_crm_chats', JSON.stringify(chats));
  }, [chats]);

  const addLead = (newLeadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newL: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      status: 'Novo',
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setLeads(prev => [newL, ...prev]);

    // Create a new blank chat for it
    const newC: Chat = {
      id: `chat-${Date.now()}`,
      leadId: newL.id,
      leadName: newL.name,
      corretorId: newL.assignedCorretorId || 'corretor-1',
      lastMessage: 'Nenhuma mensagem trocada ainda.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      messages: []
    };
    setChats(prev => [newC, ...prev]);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setChats(prev => prev.filter(c => c.leadId !== id));
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <CRMContext.Provider value={{
      role, setRole,
      leads, setLeads,
      corretores, setCorretores,
      chats, setChats,
      searchQuery, setSearchQuery,
      addLead, deleteLead, updateLeadStatus
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
}
