"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClipboardListIcon, Table01Icon } from "@hugeicons/core-free-icons";
import {
  getOperadorasWithPlansCountAction,
  getPlanosForOperadoraAction,
  getPlanoDetailsAction,
  savePlanoAction,
  createOperadoraAction,
  Operadora,
  Plano,
  Precos,
} from "./actions";

// Mapeamento local de logos por nome de operadora (case-insensitive partial match)
const LOCAL_LOGOS: { keywords: string[]; src: string }[] = [
  { keywords: ['amil'], src: '/amil_logo.webp' },
  { keywords: ['amep'], src: '/amep_saude_logo.png' },
  { keywords: ['unimed'], src: '/unimed_logo.webp' },
  { keywords: ['notre', 'dame'], src: '/NotreDame_logo.webp' },
  { keywords: ['porto'], src: '/PortoSaude_logo.webp' },
  { keywords: ['sulamerica', 'sul america', 'sulamérica'], src: '/sulamerica_logo.png' },
  { keywords: ['leve'], src: '/LEVESaude__logo.webp' },
  { keywords: ['assim'], src: '/assim-saude_logo.png' },
  { keywords: ['cemeru'], src: '/cemeru_logo.png' },
]

function getOperadoraLogo(nome: string, dbLogoUrl: string | null): string | null {
  const lower = nome.toLowerCase()
  // Primeiro tenta match local pelo nome
  const match = LOCAL_LOGOS.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw))
  )
  if (match) return match.src
  // Caso não encontre local, usa o que está no banco (pode ser URL externa válida)
  return dbLogoUrl || null
}

export default function PlanosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isPendingAction, startTransition] = useTransition();

  const [operadoras, setOperadoras] = useState<Operadora[]>([]);
  const [selectedOpId, setSelectedOpId] = useState<number | null>(null);

  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(null);

  // Sub-tabs navigation for Right Panel
  const [activeTab, setActiveTab] = useState<"categories" | "pricing">("categories");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Loading and Error States
  const [isLoadingOps, setIsLoadingOps] = useState(true);
  const [isLoadingPlanos, setIsLoadingPlanos] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Brand Modal/Form State
  const [isOpModalOpen, setIsOpModalOpen] = useState(false);
  const [newOpNome, setNewOpNome] = useState("");
  const [newOpLogoUrl, setNewOpLogoUrl] = useState("");
  const [isCreatingOp, setIsCreatingOp] = useState(false);

  // Category Form State (Metadata)
  const [planoNome, setPlanoNome] = useState("");
  const [tipoContratacao, setTipoContratacao] = useState<"ADESAO" | "CNPJ">("CNPJ");
  const [segmentacao, setSegmentacao] = useState<"AMBULATORIAL" | "HOSPITALAR" | "GLOBAL">("GLOBAL");
  const [abrangencia, setAbrangencia] = useState<"REGIONAL" | "NACIONAL">("REGIONAL");
  const [coparticipacao, setCoparticipacao] = useState<boolean>(false);
  const [cidades, setCidades] = useState("");
  const [beneficios, setBeneficios] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Pricing Form State (Carencias)
  const [carenciaUrgencia, setCarenciaUrgencia] = useState<number>(24);
  const [carenciaConsultas, setCarenciaConsultas] = useState<number>(30);
  const [carenciaExamesSimples, setCarenciaExamesSimples] = useState<number>(30);
  const [carenciaAltaComplexidade, setCarenciaAltaComplexidade] = useState<number>(180);
  const [carenciaPreexistencias, setCarenciaPreexistencias] = useState<number>(720);

  // Pricing Form State (Preços Faixas ANS)
  const [faixa0a18, setFaixa0a18] = useState<string>("0");
  const [faixa19a23, setFaixa19a23] = useState<string>("0");
  const [faixa24a28, setFaixa24a28] = useState<string>("0");
  const [faixa29a33, setFaixa29a33] = useState<string>("0");
  const [faixa34a38, setFaixa34a38] = useState<string>("0");
  const [faixa39a43, setFaixa39a43] = useState<string>("0");
  const [faixa44a48, setFaixa44a48] = useState<string>("0");
  const [faixa49a53, setFaixa49a53] = useState<string>("0");
  const [faixa54a58, setFaixa54a58] = useState<string>("0");
  const [faixa59mais, setFaixa59mais] = useState<string>("0");

  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // Fetch Brands
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    const role = (session.user as any).role;
    if (role !== "ADMIN") {
      setIsLoadingOps(false);
      return;
    }

    async function fetchOperadoras() {
      setIsLoadingOps(true);
      setError(null);
      const res = await getOperadorasWithPlansCountAction();
      if (res.error) {
        setError(res.error);
      } else if (res.data && res.data.length > 0) {
        setOperadoras(res.data);
        setSelectedOpId(res.data[0].id);
      }
      setIsLoadingOps(false);
    }

    fetchOperadoras();
  }, [session, isPending, router]);

  // Fetch plans of selected Operadora
  useEffect(() => {
    if (selectedOpId === null) return;
    const opId = selectedOpId;

    async function fetchPlanos() {
      setIsLoadingPlanos(true);
      setError(null);
      const res = await getPlanosForOperadoraAction(opId);
      if (res.error) {
        setError(res.error);
      } else {
        setPlanos(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedPlanoId(res.data[0].id);
          setIsCreatingCategory(false);
        } else {
          setSelectedPlanoId(null);
          setIsCreatingCategory(false);
          resetForm();
        }
      }
      setIsLoadingPlanos(false);
    }

    fetchPlanos();
  }, [selectedOpId]);

  // Fetch details of selected Plan
  useEffect(() => {
    if (selectedPlanoId === null) {
      // only reset form if we are not actively creating
      if (!isCreatingCategory) {
        resetForm();
      }
      return;
    }
    setIsCreatingCategory(false);
    const planoId = selectedPlanoId;

    async function fetchDetails() {
      setIsLoadingDetails(true);
      setError(null);
      const res = await getPlanoDetailsAction(planoId);
      if (res.error) {
        setError(res.error);
      } else if (res.plano) {
        const { plano, precos } = res;
        // Populate metadata
        setPlanoNome(plano.nome);
        setTipoContratacao(plano.tipoContratacao);
        setSegmentacao(plano.segmentacao);
        setAbrangencia(plano.abrangencia);
        setCoparticipacao(plano.coparticipacao || false);
        setCidades(plano.cidades || "");
        setBeneficios(plano.beneficios || "");
        setCarenciaUrgencia(plano.carenciaUrgencia);
        setCarenciaConsultas(plano.carenciaConsultas);
        setCarenciaExamesSimples(plano.carenciaExamesSimples);
        setCarenciaAltaComplexidade(plano.carenciaAltaComplexidade);
        setCarenciaPreexistencias(plano.carenciaPreexistencias);

        // Populate prices
        if (precos) {
          setFaixa0a18(precos.faixa0a18.toString());
          setFaixa19a23(precos.faixa19a23.toString());
          setFaixa24a28(precos.faixa24a28.toString());
          setFaixa29a33(precos.faixa29a33.toString());
          setFaixa34a38(precos.faixa34a38.toString());
          setFaixa39a43(precos.faixa39a43.toString());
          setFaixa44a48(precos.faixa44a48.toString());
          setFaixa49a53(precos.faixa49a53.toString());
          setFaixa54a58(precos.faixa54a58.toString());
          setFaixa59mais(precos.faixa59mais.toString());
        } else {
          clearPrices();
        }
      }
      setIsLoadingDetails(false);
    }

    fetchDetails();
  }, [selectedPlanoId]);

  const resetForm = () => {
    setPlanoNome("");
    setTipoContratacao("CNPJ");
    setSegmentacao("GLOBAL");
    setAbrangencia("REGIONAL");
    setCoparticipacao(false);
    setCidades("");
    setBeneficios("");
    setCarenciaUrgencia(24);
    setCarenciaConsultas(30);
    setCarenciaExamesSimples(30);
    setCarenciaAltaComplexidade(180);
    setCarenciaPreexistencias(720);
    clearPrices();
  };

  const clearPrices = () => {
    setFaixa0a18("0");
    setFaixa19a23("0");
    setFaixa24a28("0");
    setFaixa29a33("0");
    setFaixa34a38("0");
    setFaixa39a43("0");
    setFaixa44a48("0");
    setFaixa49a53("0");
    setFaixa54a58("0");
    setFaixa59mais("0");
  };

  // Create Brand Action
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsCreatingOp(true);

    const res = await createOperadoraAction(newOpNome, newOpLogoUrl || null);
    setIsCreatingOp(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg(`Operadora "${newOpNome}" cadastrada com sucesso!`);
      setNewOpNome("");
      setNewOpLogoUrl("");
      setIsOpModalOpen(false);

      // Refresh list
      const freshOps = await getOperadorasWithPlansCountAction();
      if (freshOps.data) {
        setOperadoras(freshOps.data);
        // Automatically select the new operadora if it is at the end or sorting order
        const found = freshOps.data.find(o => o.nome === newOpNome);
        if (found) setSelectedOpId(found.id);
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // Save Category Metadata
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOpId === null) return;

    setIsSavingCategory(true);
    setError(null);
    setSuccessMsg(null);

    const planoPayload: any = {
      operadoraId: selectedOpId,
      nome: planoNome,
      tipoContratacao,
      segmentacao,
      abrangencia,
      coparticipacao,
      cidades: cidades || null,
      beneficios: beneficios || null,
      carenciaUrgencia: Number(carenciaUrgencia),
      carenciaConsultas: Number(carenciaConsultas),
      carenciaExamesSimples: Number(carenciaExamesSimples),
      carenciaAltaComplexidade: Number(carenciaAltaComplexidade),
      carenciaPreexistencias: Number(carenciaPreexistencias),
    };

    if (selectedPlanoId !== null) {
      planoPayload.id = selectedPlanoId;
    }

    const precosPayload = {
      faixa0a18: parseFloat(faixa0a18) || 0,
      faixa19a23: parseFloat(faixa19a23) || 0,
      faixa24a28: parseFloat(faixa24a28) || 0,
      faixa29a33: parseFloat(faixa29a33) || 0,
      faixa34a38: parseFloat(faixa34a38) || 0,
      faixa39a43: parseFloat(faixa39a43) || 0,
      faixa44a48: parseFloat(faixa44a48) || 0,
      faixa49a53: parseFloat(faixa49a53) || 0,
      faixa54a58: parseFloat(faixa54a58) || 0,
      faixa59mais: parseFloat(faixa59mais) || 0,
    };

    const res = await savePlanoAction(planoPayload, precosPayload);
    setIsSavingCategory(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg("Categoria salva com sucesso!");
      setIsCreatingCategory(false);

      const opsRes = await getOperadorasWithPlansCountAction();
      if (opsRes.data) setOperadoras(opsRes.data);

      const planosRes = await getPlanosForOperadoraAction(selectedOpId);
      if (planosRes.data) {
        setPlanos(planosRes.data);
        if (res.planoId) setSelectedPlanoId(res.planoId);
      }
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // Save Pricing Matrix & Carencias
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOpId === null || selectedPlanoId === null) return;

    setIsSavingPricing(true);
    setError(null);
    setSuccessMsg(null);

    const planoPayload: any = {
      id: selectedPlanoId,
      operadoraId: selectedOpId,
      nome: planoNome,
      tipoContratacao,
      segmentacao,
      abrangencia,
      coparticipacao,
      cidades: cidades || null,
      beneficios: beneficios || null,
      carenciaUrgencia: Number(carenciaUrgencia),
      carenciaConsultas: Number(carenciaConsultas),
      carenciaExamesSimples: Number(carenciaExamesSimples),
      carenciaAltaComplexidade: Number(carenciaAltaComplexidade),
      carenciaPreexistencias: Number(carenciaPreexistencias),
    };

    const precosPayload = {
      faixa0a18: parseFloat(faixa0a18) || 0,
      faixa19a23: parseFloat(faixa19a23) || 0,
      faixa24a28: parseFloat(faixa24a28) || 0,
      faixa29a33: parseFloat(faixa29a33) || 0,
      faixa34a38: parseFloat(faixa34a38) || 0,
      faixa39a43: parseFloat(faixa39a43) || 0,
      faixa44a48: parseFloat(faixa44a48) || 0,
      faixa49a53: parseFloat(faixa49a53) || 0,
      faixa54a58: parseFloat(faixa54a58) || 0,
      faixa59mais: parseFloat(faixa59mais) || 0,
    };

    const res = await savePlanoAction(planoPayload, precosPayload);
    setIsSavingPricing(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg("Tabela de preços e carências atualizada com sucesso!");
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const isUserAdmin = session && (session.user as any).role === "ADMIN";

  if (isPending || isLoadingOps) {
    return (
      <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">
        {/* Header Skeleton */}
        <div className="space-y-3 animate-pulse">
          <div className="h-5 bg-neutral-200 rounded-full w-28" />
          <div className="h-8 bg-neutral-200 rounded-lg w-48" />
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-3 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-7 h-96 bg-neutral-200 rounded-2xl animate-pulse" />
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
            Apenas administradores do Corretop possuem permissão para configurar tabelas de planos e matrizes de preços.
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

  return (
    <div className="p-6 lg:p-8 space-y-6 select-none text-left flex flex-col h-full bg-white">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
          Criação e Gerenciamento de Planos
        </h1>
        <p className="text-xs font-normal text-neutral-400 mt-0.5">
          Centralize a matriz de tabelas de preços, carências ANS e rede credenciada por operadora.
        </p>
      </div>

      {/* Grid Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

        {/* Left Column: Operadoras Navigation & Creation (35%) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center pl-1">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              Operadoras
            </span>

            <Button
              variant="link"
              size="xs"
              onClick={() => setIsOpModalOpen(true)}
              className="text-[10px] font-semibold uppercase text-[#3b2dff] hover:text-[#2d20e0] flex items-center gap-1 cursor-pointer transition-colors border-transparent bg-transparent hover:bg-transparent px-0"
            >
              + Nova Operadora
            </Button>
          </div>

          {/* List of Operadoras */}
          <div className="flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-1">
            {operadoras.map((op) => {
              const isSelected = selectedOpId === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => {
                    setSelectedOpId(op.id);
                    setSelectedPlanoId(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-2xs group relative ${isSelected
                    ? "bg-white border-[#3b2dff] ring-4 ring-[#3b2dff]/5"
                    : "bg-[#f8f9fa73]/40 border-slate-200/20 hover:bg-[#f8f9fa73]/60"
                    }`}
                >
                  {/* Left Side Accent Line */}
                  {isSelected && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r bg-[#3b2dff]" />
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`size-9 rounded-xl border flex items-center justify-center font-semibold text-xs transition-colors overflow-hidden ${isSelected
                      ? "bg-[#3b2dff]/5 border-[#3b2dff]/15 text-[#3b2dff]"
                      : "bg-neutral-50 border-neutral-100 text-neutral-400 group-hover:bg-neutral-100"
                      }`}>
                      {(() => {
                        const logoSrc = getOperadoraLogo(op.nome, op.logo_url)
                        return logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={op.nome}
                            className="size-7 object-contain"
                            onError={(e) => {
                              // Se a imagem falhar, esconde e mostra as iniciais
                              const target = e.currentTarget
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                parent.textContent = op.nome.slice(0, 2).toUpperCase()
                              }
                            }}
                          />
                        ) : (
                          op.nome.slice(0, 2).toUpperCase()
                        )
                      })()}
                    </div>
                    <span className={`text-xs tracking-tight ${isSelected ? "font-semibold text-neutral-900" : "font-normal text-neutral-500 group-hover:text-neutral-700"}`}>
                      {op.nome}
                    </span>
                  </div>

                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${isSelected
                    ? "bg-[#3b2dff] text-white font-semibold"
                    : "bg-neutral-50 text-neutral-400 border border-neutral-200/50 font-normal"
                    }`}>
                    {op.planosCount || 0} planos
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Central Dashboard Area (65%) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOpId}
              initial={{ x: 12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="space-y-6"
            >
              {/* Category Selector Box (Fixo no topo da área direita) */}
              <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-5 space-y-4 shadow-none">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100/50">
                  <div className="text-left">
                    <h3 className="font-semibold text-neutral-800 text-sm tracking-tight">Categorias de Planos</h3>
                    <p className="text-xs text-neutral-400 font-normal mt-0.5">Selecione uma categoria técnica para configurar os detalhes e preços.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setSelectedPlanoId(null);
                      resetForm();
                      setIsCreatingCategory(true);
                      setActiveTab("categories");
                      setError(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[9px] font-semibold uppercase tracking-wider border-dashed cursor-pointer transition-all ${selectedPlanoId === null && isCreatingCategory
                      ? "bg-[#3b2dff]/5 text-[#3b2dff] border-[#3b2dff]"
                      : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                      }`}
                  >
                    + Nova Categoria
                  </Button>
                </div>

                {/* Horizontal list of category selection */}
                {planos.length > 0 ? (
                  <div className="flex flex-wrap gap-2 text-left">
                    {planos.map((p) => {
                      const isPSelected = selectedPlanoId === p.id;
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => {
                            setSelectedPlanoId(p.id);
                            setIsCreatingCategory(false);
                            setError(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${isPSelected
                            ? "bg-[#3b2dff] text-white border-[#3b2dff]"
                            : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                            }`}
                        >
                          {p.nome}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[10px] font-normal text-neutral-400 italic text-left">Nenhuma categoria cadastrada para esta operadora. Clique em "+ Nova Categoria" acima para criar.</p>
                )}
              </div>

              {/* Empty state when no category is selected and we are not creating */}
              {selectedPlanoId === null && !isCreatingCategory ? (
                <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center py-16 shadow-none">
                  <div className="size-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                    <HugeiconsIcon icon={ClipboardListIcon} className="size-5 text-neutral-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-800">Nenhuma Categoria Selecionada</h4>
                  <p className="text-xs font-normal text-neutral-400 leading-relaxed max-w-xs mt-1">
                    Selecione uma categoria de plano acima ou crie uma nova para iniciar as configurações técnicas e tabelas de valores.
                  </p>
                </div>
              ) : (
                <>
                  {/* Sub-Abas Nav */}
                  <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-3 flex items-center justify-between gap-4 shadow-none">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveTab("categories");
                          setError(null);
                        }}
                        className={`pb-1 text-xs transition-all relative cursor-pointer border-transparent bg-transparent hover:bg-transparent ${activeTab === "categories" ? "text-neutral-900 font-semibold" : "text-neutral-400 hover:text-neutral-700 font-normal"
                          }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <HugeiconsIcon icon={ClipboardListIcon} className="size-3.5" />
                          Dados da Categoria
                        </span>
                        {activeTab === "categories" && (
                          <motion.div
                            layoutId="planosSubTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b2dff]"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (selectedPlanoId === null) {
                            setError("Salve os dados da categoria primeiro para habilitar a precificação.");
                            return;
                          }
                          setActiveTab("pricing");
                          setError(null);
                        }}
                        className={`pb-1 text-xs transition-all relative cursor-pointer border-transparent bg-transparent hover:bg-transparent ${selectedPlanoId === null ? "opacity-50 cursor-not-allowed" : ""} ${activeTab === "pricing" ? "text-neutral-900 font-semibold" : "text-neutral-400 hover:text-neutral-700 font-normal"
                          }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <HugeiconsIcon icon={Table01Icon} className="size-3.5" />
                          Tabelas de Preços & Carências
                        </span>
                        {activeTab === "pricing" && selectedPlanoId !== null && (
                          <motion.div
                            layoutId="planosSubTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b2dff]"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                      </Button>
                    </div>

                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider select-none">
                      {selectedPlanoId !== null ? `Editando: ${planoNome}` : "Novo Produto"}
                    </span>
                  </div>

                  {/* Status notifications */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      <span>{error}</span>
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Dynamic Content switching based on Sub-Abas */}
                  <AnimatePresence mode="wait">
                    {activeTab === "categories" ? (
                      <motion.div
                        key="categories-subtab"
                        initial={{ x: 8, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-6"
                      >
                        {/* Form Bloco A: Category Metadata Setup */}
                        <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-6 md:p-8 space-y-6 shadow-none">
                          <form onSubmit={handleSaveCategory} className="space-y-5">
                            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                              {selectedPlanoId !== null ? "Editar Categoria Técnica" : "Cadastrar Nova Categoria Técnica"}
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Nome da Categoria */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Nome da Categoria</label>
                                <input
                                  type="text"
                                  required
                                  value={planoNome}
                                  onChange={(e) => setPlanoNome(e.target.value)}
                                  placeholder="Ex: Smart PME I, Ideal Adesão"
                                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5"
                                />
                              </div>

                              {/* Tipo de Contratacao Toggle Switch */}
                              <div className="space-y-2 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">Tipo de Contratação</label>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-normal transition-colors ${tipoContratacao === "ADESAO" ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>Adesão (CPF)</span>
                                  <button
                                    type="button"
                                    onClick={() => setTipoContratacao(prev => prev === "ADESAO" ? "CNPJ" : "ADESAO")}
                                    className="w-10 h-5 bg-neutral-200 rounded-full relative transition-colors shadow-none"
                                  >
                                    <motion.div
                                      layout
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      className="size-4 rounded-full bg-[#3b2dff] absolute top-0.5"
                                      style={{ left: tipoContratacao === "CNPJ" ? "22px" : "2px" }}
                                    />
                                  </button>
                                  <span className={`text-[10px] font-normal transition-colors ${tipoContratacao === "CNPJ" ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>PME / MEI (CNPJ)</span>
                                </div>
                              </div>

                              {/* Segmentacao Dropdown */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Tipo de Plano (Segmentação)</label>
                                <div className="relative">
                                  <select
                                    value={segmentacao}
                                    onChange={(e) => setSegmentacao(e.target.value as any)}
                                    className="w-full pl-3.5 pr-8 py-1 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none text-xs font-normal appearance-none cursor-pointer transition-all duration-200 shadow-none focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 h-8.5"
                                  >
                                    <option value="GLOBAL">Ambulatorial + Hospitalar + Obstetrícia (Global)</option>
                                    <option value="AMBULATORIAL">Apenas Ambulatorial</option>
                                    <option value="HOSPITALAR">Apenas Hospitalar</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                  </div>
                                </div>
                              </div>

                              {/* Coparticipacao Toggle Switch */}
                              <div className="space-y-2 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">Coparticipação</label>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-normal transition-colors ${!coparticipacao ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>Não</span>
                                  <button
                                    type="button"
                                    onClick={() => setCoparticipacao(prev => !prev)}
                                    className="w-10 h-5 bg-neutral-200 rounded-full relative transition-colors shadow-none"
                                  >
                                    <motion.div
                                      layout
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      className="size-4 rounded-full bg-[#3b2dff] absolute top-0.5"
                                      style={{ left: coparticipacao ? "22px" : "2px" }}
                                    />
                                  </button>
                                  <span className={`text-[10px] font-normal transition-colors ${coparticipacao ? "text-neutral-900 font-semibold" : "text-neutral-400"}`}>Sim</span>
                                </div>
                              </div>

                              {/* Abrangência */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Abrangência Geográfica</label>
                                <div className="relative">
                                  <select
                                    value={abrangencia}
                                    onChange={(e) => setAbrangencia(e.target.value as any)}
                                    className="w-full pl-3.5 pr-8 py-1 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none text-xs font-normal appearance-none cursor-pointer transition-all duration-200 shadow-none focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 h-8.5"
                                  >
                                    <option value="REGIONAL">Regional (Cidades Específicas)</option>
                                    <option value="NACIONAL">Nacional (Todo o Brasil)</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                  </div>
                                </div>
                              </div>

                              {/* Cidades Atendidas Tags */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Cidades Atendidas (separadas por vírgula)</label>
                                <input
                                  type="text"
                                  value={cidades}
                                  onChange={(e) => setCidades(e.target.value)}
                                  placeholder="Ex: Rio de Janeiro, Niterói, Duque de Caxias"
                                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5"
                                />
                              </div>

                            </div>

                            {/* Rede de Beneficios */}
                            <div className="space-y-1 text-left">
                              <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Rede de Benefícios Extras / Vantagens</label>
                              <textarea
                                value={beneficios}
                                onChange={(e) => setBeneficios(e.target.value)}
                                placeholder="Descontos em drogarias, atendimento domiciliar, suporte 24h..."
                                rows={3}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none"
                              />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-2">
                              <motion.button
                                type="submit"
                                whileTap={{ scale: 0.98 }}
                                disabled={isSavingCategory}
                                className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-none disabled:bg-slate-100 disabled:text-slate-400 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                {isSavingCategory ? (
                                  <>
                                    <svg className="animate-spin size-4 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Salvando Categoria...</span>
                                  </>
                                ) : (
                                  <span>Salvar Categoria Técnica</span>
                                )}
                              </motion.button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pricing-subtab"
                        initial={{ x: 8, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-6"
                      >
                        {/* Form Bloco B & C: Prices matrix and Carencias */}
                        <form onSubmit={handleSavePricing} className="space-y-6">
                          {selectedPlanoId !== null && (
                            <>
                              {/* Bloco B: Prices Grid */}
                                  <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-6 md:p-8 space-y-5 shadow-none">
                            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block text-left">
                              Matriz Dinâmica de Valores (Faixas ANS)
                            </span>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                              {/* 0-18 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">0 a 18 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa0a18}
                                    onChange={(e) => setFaixa0a18(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 19-23 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">19 a 23 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa19a23}
                                    onChange={(e) => setFaixa19a23(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 24-28 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">24 a 28 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa24a28}
                                    onChange={(e) => setFaixa24a28(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 29-33 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">29 a 33 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa29a33}
                                    onChange={(e) => setFaixa29a33(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 34-38 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">34 a 38 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa34a38}
                                    onChange={(e) => setFaixa34a38(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 39-43 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">39 a 43 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa39a43}
                                    onChange={(e) => setFaixa39a43(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 44-48 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">44 a 48 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa44a48}
                                    onChange={(e) => setFaixa44a48(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 49-53 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">49 a 53 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa49a53}
                                    onChange={(e) => setFaixa49a53(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 54-58 */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">54 a 58 anos</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa54a58}
                                    onChange={(e) => setFaixa54a58(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>

                              {/* 59mais */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">59 anos ou +</label>
                                <div className="relative">
                                  <span className="absolute left-3 top-2.5 text-xs font-extrabold text-neutral-400">R$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={faixa59mais}
                                    onChange={(e) => setFaixa59mais(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bloco C: Carencias */}
                                  <div className="bg-[#f8f9fa73]/40 border border-slate-200/20 rounded-3xl p-6 md:p-8 space-y-5 shadow-none">
                            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                              Bloco C: Carências Regulamentares (Prazos de Recuo)
                            </span>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {/* Urgência */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Urgência (Horas)</label>
                                <input
                                  type="number"
                                  required
                                  value={carenciaUrgencia}
                                  onChange={(e) => setCarenciaUrgencia(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none h-8.5"
                                />
                              </div>

                              {/* Consultas */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Consultas (Dias)</label>
                                <input
                                  type="number"
                                  required
                                  value={carenciaConsultas}
                                  onChange={(e) => setCarenciaConsultas(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none h-8.5"
                                />
                              </div>

                              {/* Exames */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Exames (Dias)</label>
                                <input
                                  type="number"
                                  required
                                  value={carenciaExamesSimples}
                                  onChange={(e) => setCarenciaExamesSimples(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none h-8.5"
                                />
                              </div>

                              {/* Alta Complexidade */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Alta Complex. (Dias)</label>
                                <input
                                  type="number"
                                  required
                                  value={carenciaAltaComplexidade}
                                  onChange={(e) => setCarenciaAltaComplexidade(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none h-8.5"
                                />
                              </div>

                              {/* Doenças Preexistentes */}
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Preexistências (Dias)</label>
                                <input
                                  type="number"
                                  required
                                  value={carenciaPreexistencias}
                                  onChange={(e) => setCarenciaPreexistencias(Number(e.target.value))}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal shadow-none h-8.5"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Submit Actions Button */}
                          <div className="flex justify-end pt-2">
                            <motion.button
                              type="submit"
                              whileTap={{ scale: 0.98 }}
                              disabled={isSavingPricing}
                              className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold text-xs px-6 py-3.5 rounded-2xl shadow-3xs hover:shadow-[#3b2dff]/10 disabled:bg-slate-100 disabled:text-slate-400 transition-all cursor-pointer flex items-center gap-2 select-none"
                            >
                              {isSavingPricing ? (
                                <>
                                  <svg className="animate-spin size-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  <span>Salvando Matriz...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                  <span>Salvar Alterações da Tabela</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Operadora Creation Modal */}
      <AnimatePresence>
        {isOpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpModalOpen(false)}
              className="absolute inset-0 bg-neutral-900 cursor-pointer"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 w-full max-w-md shadow-lg relative z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 tracking-tight">
                    Cadastrar Nova Operadora
                  </h3>
          <p className="text-xs font-normal text-neutral-400 mt-1">
            Adicione uma nova marca operadora ao Corretop.
          </p>
                </div>
                <button
                  onClick={() => setIsOpModalOpen(false)}
                  className="p-1.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateBrand} className="space-y-4">

                {/* Nome da Operadora */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Nome da Marca</label>
                  <input
                    type="text"
                    required
                    value={newOpNome}
                    onChange={(e) => setNewOpNome(e.target.value)}
                    placeholder="Ex: SulAmérica Saúde"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5"
                  />
                </div>

                {/* Logo URL */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Caminho / URL do Logotipo</label>
                  <input
                    type="text"
                    value={newOpLogoUrl}
                    onChange={(e) => setNewOpLogoUrl(e.target.value)}
                    placeholder="Ex: /logos/sulamerica.svg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 outline-none text-xs font-normal placeholder:font-normal placeholder:text-slate-400 transition-all duration-200 shadow-none h-8.5"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isCreatingOp}
                  className="w-full py-3 mt-4 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-xs shadow-sm hover:shadow-md hover:shadow-[#3b2dff]/10 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isCreatingOp ? (
                    <>
                      <svg className="animate-spin size-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <span>Cadastrar Operadora</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

