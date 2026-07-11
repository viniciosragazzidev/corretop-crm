"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  getCorretoresAction,
  createCorretorAction,
  updateCorretorStatusAction,
  desativarCorretorAction,
  Corretor,
} from "./actions";

export default function CorretoresPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isPendingAction, startTransition] = useTransition();

  const [activeSubTab, setActiveSubTab] = useState("Visão Geral");
  const subTabs = ["Visão Geral", "Desempenho", "Comissões"];

  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "CORRETOR">("CORRETOR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Brokers
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN") {
      setIsLoading(false);
      return;
    }

    async function fetchCorretores() {
      setIsLoading(true);
      setError(null);
      const res = await getCorretoresAction();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setCorretores(res.data);
      }
      setIsLoading(false);
    }

    fetchCorretores();
  }, [session, isPending, router]);

  // Handle Create Broker
  const handleCreateCorretor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await createCorretorAction({
      name: newName,
      email: newEmail,
      passwordHash: newPassword,
      role: newRole,
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      // Clear inputs and close modal
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("CORRETOR");
      setIsModalOpen(false);

      // Refresh list
      const updated = await getCorretoresAction();
      if (updated.data) {
        setCorretores(updated.data);
      }
    }
  };

  // Handle Status Update
  const handleStatusChange = (corretorId: string, status: Corretor["status"]) => {
    setError(null);

    // Optimistic UI Update
    setCorretores((prev) =>
      prev.map((c) => (c.id === corretorId ? { ...c, status } : c))
    );

    startTransition(async () => {
      const res = await updateCorretorStatusAction(corretorId, status);
      if (res.error) {
        setError(res.error);
        // Revert on error
        const updated = await getCorretoresAction();
        if (updated.data) setCorretores(updated.data);
      }
    });
  };

  // Handle Deactivate Broker
  const handleDesativar = (corretorId: string) => {
    if (confirm("Tem certeza que deseja desativar este corretor? Ele não conseguirá mais logar ou receber leads.")) {
      setError(null);

      // Optimistic UI Update
      setCorretores((prev) =>
        prev.map((c) => (c.id === corretorId ? { ...c, status: "INATIVO" as const } : c))
      );

      startTransition(async () => {
        const res = await desativarCorretorAction(corretorId);
        if (res.error) {
          setError(res.error);
          // Revert on error
          const updated = await getCorretoresAction();
          if (updated.data) setCorretores(updated.data);
        }
      });
    }
  };

  // Filtered Brokers
  const filteredCorretores = corretores.filter((c) => {
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Check Role Authorization
  const isUserAdmin = session && (session.user as any).role === "ADMIN";

  if (isPending || isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-neutral-200/60 rounded-full w-28 animate-pulse" />
          <div className="h-8 bg-neutral-200/60 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-neutral-200/60 rounded-md w-96 animate-pulse" />
        </div>
        {/* Table skeleton */}
        <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-6 space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-0">
              <div className="flex items-center gap-3 w-1/3">
                <div className="size-8 rounded-full bg-neutral-100 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-neutral-100 rounded w-2/3" />
                  <div className="h-2.5 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3.5 bg-neutral-100 rounded w-20" />
                  <div className="h-6 bg-neutral-100 rounded-xl w-24" />
              <div className="h-8 bg-neutral-100 rounded-lg w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Non-Admin Restricted Access Screen
  if (session && !isUserAdmin) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center h-[70vh] bg-white select-none">
          <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-md shadow-none py-12">
          <div className="size-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-3xs mb-4">
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-neutral-800">Acesso Restrito</h3>
          <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-xs mt-2">
            Apenas administradores da Venacor possuem permissões para visualizar e gerenciar a equipe de corretores.
          </p>
          <button
            onClick={() => router.push("/resume")}
            className="mt-6 bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-3xs transition-all cursor-pointer select-none active:scale-[0.98]"
          >
            Voltar para o Painel
          </button>
        </div>
      </div>
    );
  }

  const activeBrokersCount = corretores.filter((c) => c.status !== "INATIVO").length;
  const onlineBrokersCount = corretores.filter((c) => c.status === "ONLINE").length;

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">

      {/* Sub-navigation tabs */}
      <div className="t-tabs flex gap-1 bg-neutral-100/50 p-1 rounded-xl w-fit">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSubTab(tab)}
              className={`t-tab px-3 py-1.5 rounded-lg text-[11px] cursor-pointer ${isActive ? "bg-white text-neutral-900 shadow-sm font-semibold" : "text-neutral-500 hover:text-neutral-700 font-normal"}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "Visão Geral" ? (
          <motion.div
            key="visao-geral"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header / Meta overview */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                  Gerenciamento de Equipe
                </h1>
                <p className="text-xs font-normal text-neutral-400 mt-0.5">
                  Cadastre novos corretores, controle permissões e acompanhe o status de disponibilidade em tempo real.
                </p>
              </div>

              {/* Action and stats row */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-2xl py-2.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-center gap-3.5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Ativos</span>
                    <span className="text-sm font-semibold text-slate-700">{activeBrokersCount}</span>
                  </div>
                  <div className="w-px h-6 bg-neutral-100" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Online</span>
                    <span className="text-sm font-semibold text-emerald-600">{onlineBrokersCount}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-3xs transition-all cursor-pointer select-none flex items-center gap-1.5 h-10 border-transparent"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  <span>Novo Corretor</span>
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-normal flex items-center gap-2 max-w-2xl">
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="w-full max-w-md relative">
              <Input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 rounded-xl border border-slate-200/50 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal outline-none transition-all shadow-none h-8.5 text-neutral-700 placeholder:text-neutral-400"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>

            {/* Minimalist List Container */}
            <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-5 shadow-none overflow-hidden">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/40 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Nome / E-mail</th>
                      <th className="py-3.5 px-4 text-center">Permissão</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <motion.tbody layout className="divide-y divide-neutral-100">
                    <AnimatePresence mode="popLayout">
                      {filteredCorretores.map((corretor) => {
                        const isSelf = corretor.id === session?.user.id;
                        return (
                          <motion.tr
                            key={corretor.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`hover:bg-neutral-50/20 transition-colors ${corretor.status === "INATIVO" ? "opacity-60" : ""
                              }`}
                          >
                            {/* Left: Name & Initials */}
                            <td className="py-4 px-6 flex items-center gap-3">
                              <div className="size-8 rounded-full bg-[#3b2dff]/5 border border-[#3b2dff]/15 text-[#3b2dff] font-semibold text-[10px] flex items-center justify-center shadow-3xs shrink-0 select-none">
                                {corretor.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-neutral-800 text-xs tracking-tight truncate max-w-[180px] sm:max-w-xs">
                                  {corretor.name} {isSelf && <span className="text-[10px] font-semibold text-[#3b2dff] bg-[#3b2dff]/5 px-1.5 py-0.5 rounded-md ml-1 select-none">VOCÊ</span>}
                                </span>
                                <span className="text-[10px] font-semibold text-neutral-400 truncate max-w-[180px] sm:max-w-xs mt-0.5">
                                  {corretor.email}
                                </span>
                              </div>
                            </td>

                            {/* Center Left: Role Badge */}
                            <td className="py-4 px-4 text-center align-middle">
                              {corretor.role === "ADMIN" ? (
                                <Badge variant="info" size="sm">
                                  Administrador
                                </Badge>
                              ) : (
                                <Badge variant="outline" size="sm">
                                  Corretor
                                </Badge>
                              )}
                            </td>

                            {/* Center Right: Status dropdown */}
                            <td className="py-4 px-4 text-center align-middle">
                              <div className="relative inline-flex items-center text-left">
                                <span className={`size-1.5 rounded-full absolute left-2.5 pointer-events-none ${corretor.status === "ONLINE"
                                  ? "bg-emerald-500"
                                  : corretor.status === "PAUSADO"
                                    ? "bg-amber-500"
                                    : "bg-neutral-400"
                                  }`} />
                                <select
                                  value={corretor.status}
                                  onChange={(e) => handleStatusChange(corretor.id, e.target.value as any)}
                                  className={`pl-6 pr-7 py-1.5 rounded-xl border text-[10px] font-semibold uppercase tracking-wider appearance-none cursor-pointer transition-all outline-none ${corretor.status === "ONLINE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 focus:border-emerald-500"
                                    : corretor.status === "PAUSADO"
                                      ? "bg-amber-50 text-amber-700 border-amber-100 focus:border-amber-500"
                                      : "bg-neutral-100 text-neutral-600 border-neutral-200 focus:border-neutral-500"
                                    }`}
                                >
                                  <option value="ONLINE">Online</option>
                                  <option value="PAUSADO">Pausado</option>
                                  <option value="INATIVO">Inativo</option>
                                </select>
                                <div className="absolute right-2 top-2.5 pointer-events-none text-neutral-400">
                                  <svg className="size-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                              </div>
                            </td>

                            {/* Right: Quick actions */}
                            <td className="py-4 px-6 text-right align-middle">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleDesativar(corretor.id)}
                                  disabled={isSelf || corretor.status === "INATIVO"}
                                  className="p-1.5 rounded-lg border border-neutral-100 hover:border-red-100 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                  title="Desativar Corretor"
                                >
                                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                                  </svg>
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredCorretores.length === 0 && (
              <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto shadow-none py-16 mt-8">
                <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-none mb-4">
                  <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800">Nenhum Corretor Cadastrado</h3>
                <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-xs mt-1">
                  Nenhum registro corresponde aos filtros ou à pesquisa no momento.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="coming-soon"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto shadow-none py-16 mt-4"
          >
            <div className="size-12 rounded-2xl bg-[#3b2dff]/5 border border-[#3b2dff]/10 flex items-center justify-center text-[#3b2dff] shadow-3xs">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 mt-4">Módulo em Desenvolvimento</h3>
            <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-sm mt-1">
              As seções de Desempenho e Comissões estão sendo preparadas para integração. Fique atento às próximas atualizações.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creation Modal Overlay */}
      {/* Creation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPopup showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Corretor</DialogTitle>
            <DialogDescription>
              Insira as credenciais básicas para habilitar o acesso ao CRM.
            </DialogDescription>
          </DialogHeader>

          <DialogPanel>
            <form onSubmit={handleCreateCorretor} className="space-y-4">

              {/* Nome Completo */}
              <div className={`t-input-wrap space-y-2 text-left${error ? ' is-error' : ''}`}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Gabriel Vasconcelos"
                  className={`t-input w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5${error ? ' is-shaking' : ''}`}
                />
              </div>

              {/* E-mail Corporativo */}
              <div className={`t-input-wrap space-y-2 text-left${error ? ' is-error' : ''}`}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="exemplo@venacorseguros.com"
                  className={`t-input w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5${error ? ' is-shaking' : ''}`}
                />
              </div>

              {/* Senha Inicial */}
              <div className={`t-input-wrap space-y-2 text-left${error ? ' is-error' : ''}`}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Senha Inicial</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={`t-input w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5${error ? ' is-shaking' : ''}`}
                />
              </div>

              {/* Permissão */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nível de Permissão</label>
                <div className="relative">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full pl-3.5 pr-8 py-1 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none text-xs font-normal appearance-none cursor-pointer transition-all duration-200 shadow-none focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 h-8.5"
                  >
                    <option value="CORRETOR">Corretor (Visualização de Aguardando)</option>
                    <option value="ADMIN">Administrador (Controle Total + Abas)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-normal flex items-center gap-2">
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </form>
          </DialogPanel>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" size="sm" />}>
              Cancelar
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isPendingAction}
              onClick={handleCreateCorretor}
              className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Corretor"}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  );
}

