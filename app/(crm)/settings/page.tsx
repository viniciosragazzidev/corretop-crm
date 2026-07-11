'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link01Icon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  ExternalLinkIcon,
} from '@hugeicons/core-free-icons';

const WEBHOOK_BASE = typeof window !== 'undefined'
  ? `${window.location.origin}/api/webhooks/leads`
  : '/api/webhooks/leads';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  sourceParam: string;
  docsUrl: string;
  fields: { label: string; example: string }[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'meta',
    name: 'Meta Ads (Facebook / Instagram)',
    description: 'Receba leads automaticamente dos Formulários Nativos de Lead do Meta Ads (Instagram e Facebook). Configure o Webhook no Gerenciador de Negócios do Meta.',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877F2',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    sourceParam: 'meta',
    docsUrl: 'https://developers.facebook.com/docs/marketing-api/guides/lead-ads/setup/v2.19/webhook-integration',
    fields: [
      { label: 'full_name', example: 'Maria Silva' },
      { label: 'phone_number', example: '11999887766' },
      { label: 'qual_plano_de_interesse', example: 'Adesão' },
      { label: 'quantas_vidas', example: '3' },
    ],
  },
  {
    id: 'google',
    name: 'Google Ads (Lead Forms)',
    description: 'Receba leads dos Formulários de Lead do Google Ads. Configure o Webhook nas configurações de conversão do Google Ads.',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    color: '#4285F4',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    sourceParam: 'google',
    docsUrl: 'https://support.google.com/google-ads/answer/10415365',
    fields: [
      { label: 'user_column_data[0].string_value (nome)', example: 'Maria Silva' },
      { label: 'user_column_data[1].string_value (telefone)', example: '11999887766' },
      { label: 'campaign_id', example: '123456789' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads (Lead Forms)',
    description: 'Receba leads dos Formulários de Lead do TikTok Ads. Configure a integração de webhook no TikTok Ads Manager.',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    color: '#000000',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
    sourceParam: 'tiktok',
    docsUrl: 'https://ads.tiktok.com/help/article/tiktok-lead-gen-webhook-integration',
    fields: [
      { label: 'form.fields[full_name]', example: 'Maria Silva' },
      { label: 'form.fields[phone_number]', example: '11999887766' },
      { label: 'campaign_name', example: 'Amil_Saude_Baixada_LeadGen' },
    ],
  },
];

function WebhookUrlCard({ integration }: { integration: Integration }) {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `${WEBHOOK_BASE}?token=SEU_TOKEN&source=${integration.sourceParam}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">URL do Webhook</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-neutral-50/50 font-mono text-xs text-neutral-600 truncate h-9">
          <HugeiconsIcon icon={Link01Icon} className="size-3.5 text-neutral-400 shrink-0" />
          <span className="truncate">{webhookUrl}</span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 p-2 rounded-xl border border-slate-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-[#3b2dff] transition-all cursor-pointer"
          title="Copiar URL"
        >
          {copied ? (
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-emerald-500" />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} className="size-4" />
          )}
        </button>
        <a
          href={integration.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-xl border border-slate-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-[#3b2dff] transition-all cursor-pointer"
          title="Documentação"
        >
          <HugeiconsIcon icon={ExternalLinkIcon} className="size-4" />
        </a>
      </div>
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className={`size-10 rounded-xl ${integration.bgColor} border ${integration.borderColor} flex items-center justify-center shrink-0`}
          style={{ color: integration.color }}>
          {integration.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-800">{integration.name}</h4>
          <p className="text-xs font-normal text-neutral-400 mt-0.5 leading-relaxed">{integration.description}</p>
        </div>
      </div>

      <WebhookUrlCard integration={integration} />

      {/* Payload example */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Campos do Payload</span>
        <div className="bg-neutral-50/50 rounded-xl border border-neutral-100 p-3 space-y-1.5">
          {integration.fields.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-500">{f.label}</span>
              <span className="text-neutral-300 font-mono">ex: {f.example}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Setup instructions */}
      <div className="bg-[#3b2dff]/5 rounded-xl border border-[#3b2dff]/10 p-3.5 space-y-2">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5 text-[#3b2dff]" />
          <span className="text-[10px] font-semibold text-[#3b2dff] uppercase tracking-wider">Como Configurar</span>
        </div>
        <ol className="text-xs text-neutral-500 font-normal space-y-1 ml-5 list-decimal">
          <li>Acesse o gerenciador de anúncios da plataforma</li>
          <li>Vá em <strong>Integrações</strong> ou <strong>Webhooks</strong></li>
          <li>Cole a URL do webhook acima com seu token</li>
          <li>Mapeie os campos do formulário para os campos acima</li>
          <li>Ative o webhook e teste com um lead de teste</li>
        </ol>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState('Geral');
  const subTabs = ['Geral', 'Integrações', 'Segurança', 'Notificações'];

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">

      {/* Sub-navigation tabs */}
      <div className="t-tabs flex border-b border-neutral-200/60 pb-1.5 w-full gap-5">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              aria-selected={isActive}
              className={`t-tab pb-2.5 text-xs transition-all relative cursor-pointer ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-400 hover:text-neutral-600 font-normal'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'Geral' && (
          <motion.div
            key="geral"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-none py-16 mt-4">
              <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-none">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mt-4">Painel de Configurações</h3>
              <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-sm mt-1.5">
                Gerencie permissões, dados do perfil, integrações e notificações do seu CRM Corretop.
              </p>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'Integrações' && (
          <motion.div
            key="integracoes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-neutral-900 tracking-tight">Webhooks de Captação de Leads</h1>
              <p className="text-xs font-normal text-neutral-400 mt-0.5">
                Integre formulários nativos de anúncios (Meta, Google, TikTok) para enviar leads diretamente ao pipeline de vendas.
              </p>
            </div>

            {/* Status banner */}
            <div className="bg-[#3b2dff]/5 border border-[#3b2dff]/10 rounded-2xl p-4 flex items-start gap-3">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-[#3b2dff] mt-0.5 shrink-0" />
              <div className="text-xs text-neutral-600 leading-relaxed">
                <strong className="font-semibold text-neutral-800">Webhook Gateway ativo.</strong>{' '}
                Todos os leads recebidos via webhook são inseridos automaticamente na fila com status{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[9px] font-semibold uppercase tracking-wider">
                  Aguardando
                </span>
                {' '}e ficam visíveis imediatamente para os corretores no pipeline comercial.
              </div>
            </div>

            {/* Integration cards */}
            <div className="grid grid-cols-1 gap-4">
              {INTEGRATIONS.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>

            {/* Generic webhook info */}
            <div className="bg-neutral-50/50 border border-neutral-100 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-semibold text-neutral-800">Webhook Genérico</h4>
              <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                Se você usa outra plataforma de tráfego pago, basta enviar um POST para a URL abaixo com qualquer payload JSON contendo <code className="text-[10px] font-mono bg-neutral-100 px-1 py-0.5 rounded">nome</code>, <code className="text-[10px] font-mono bg-neutral-100 px-1 py-0.5 rounded">whatsapp</code> e opcionalmente <code className="text-[10px] font-mono bg-neutral-100 px-1 py-0.5 rounded">perfil_interesse</code>.
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono bg-white rounded-xl border border-neutral-200 px-3.5 py-2 h-9">
                <HugeiconsIcon icon={Link01Icon} className="size-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{WEBHOOK_BASE}?token=SEU_TOKEN</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'Segurança' && (
          <motion.div
            key="seguranca"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-none py-16 mt-4">
              <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-none">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mt-4">Segurança</h3>
              <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-sm mt-1.5">
                Gerencie senhas, autenticação de dois fatores e dispositivos conectados.
              </p>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'Notificações' && (
          <motion.div
            key="notificacoes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-none py-16 mt-4">
              <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-none">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mt-4">Notificações</h3>
              <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-sm mt-1.5">
                Configure alertas de novos leads, atualizações de status e lembretes de atendimento.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
