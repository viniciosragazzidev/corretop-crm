'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
    UserGroupIcon, 
    Briefcase01Icon, 
    PlusSignIcon, 
    Cancel01Icon, 
    WhatsappIcon, 
    UserIcon 
} from '@hugeicons/core-free-icons';

type ProfileType = 'individual' | 'corporate' | null;

export default function SectionSimulador() {
    const [step, setStep] = useState<number>(1);
    const [profileType, setProfileType] = useState<ProfileType>(null);
    const [titularAge, setTitularAge] = useState<string>('');
    const [dependents, setDependents] = useState<string[]>([]);
    const [nome, setNome] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');

    // Format WhatsApp phone mask: (XX) XXXXX-XXXX
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        let formatted = '';
        if (value.length > 0) {
            formatted = `(${value.slice(0, 2)}`;
        }
        if (value.length > 2) {
            formatted += `) ${value.slice(2, 7)}`;
        }
        if (value.length > 7) {
            formatted += `-${value.slice(7)}`;
        }
        setWhatsapp(formatted);
    };

    // Calculate dynamic progress percent
    const progressPercent = (step / 4) * 100;

    // Is step 2 valid to progress
    const isStep2Valid = titularAge.trim() !== '' && Number(titularAge) > 0;

    // Is step 3 valid (WhatsApp fully filled: 11 digits)
    const rawPhoneDigits = whatsapp.replace(/\D/g, '');
    const isPhoneValid = rawPhoneDigits.length === 11;
    const isStep3Valid = nome.trim().length > 2 && isPhoneValid;

    // Handle profile selection card click
    const handleSelectProfile = (type: ProfileType) => {
        setProfileType(type);
        setTimeout(() => {
            setStep(2);
        }, 250);
    };

    // Reset simulator
    const handleReset = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep(1);
        setProfileType(null);
        setTitularAge('');
        setDependents([]);
        setNome('');
        setWhatsapp('');
    };

    return (
        <section className="w-full bg-[#faf9f7] py-16 md:py-20 font-sans select-none overflow-hidden">
            <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col gap-8 md:gap-10">
                
                {/* 1. Cabeçalho */}
                <div className="w-full text-left space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span className="size-2 rounded-full bg-[#3b2dff]" />
                        <span>Simulador Inteligente</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-[1.15] max-w-2xl">
                        Calcule o valor do seu plano de saúde em segundos.
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed max-w-xl">
                        Selecione seu perfil, adicione as idades e receba o comparativo de preços atualizado diretamente no seu WhatsApp.
                    </p>
                </div>

                {/* 2. Container Elástico do Simulador */}
                <div className="w-full max-w-[620px] mx-auto bg-white border border-slate-200/80 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(59,45,255,0.06)] overflow-hidden relative">
                    
                    {/* Barra de Progresso Neon */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                        <div 
                            className="h-full bg-[#3b2dff] transition-all duration-300 ease-linear"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="p-8 sm:p-10">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -30, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="flex flex-col gap-8 text-center"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                            O que você busca hoje?
                                        </h3>
                                        <p className="text-slate-400 text-xs sm:text-sm font-medium">
                                            Selecione a opção ideal para o seu perfil.
                                        </p>
                                    </div>

                                    {/* Cards de Seleção */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <motion.button
                                            whileHover={{ y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectProfile('individual')}
                                            className={`p-6 rounded-3xl border-2 text-left cursor-pointer transition-all duration-200 flex flex-col gap-4 ${
                                                profileType === 'individual'
                                                    ? 'border-[#3b2dff] bg-[#3b2dff]/5'
                                                    : 'border-slate-100 hover:border-[#3b2dff]/30 bg-slate-50/50'
                                            }`}
                                        >
                                            <div className="size-10 rounded-2xl bg-[#3b2dff]/5 text-[#3b2dff] flex items-center justify-center border border-[#3b2dff]/10">
                                                <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-extrabold text-slate-800">Para Mim ou Família</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">Contratação rápida via CPF</span>
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSelectProfile('corporate')}
                                            className={`p-6 rounded-3xl border-2 text-left cursor-pointer transition-all duration-200 flex flex-col gap-4 ${
                                                profileType === 'corporate'
                                                    ? 'border-[#3b2dff] bg-[#3b2dff]/5'
                                                    : 'border-slate-100 hover:border-[#3b2dff]/30 bg-slate-50/50'
                                            }`}
                                        >
                                            <div className="size-10 rounded-2xl bg-[#3b2dff]/5 text-[#3b2dff] flex items-center justify-center border border-[#3b2dff]/10">
                                                <HugeiconsIcon icon={Briefcase01Icon} className="size-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-extrabold text-slate-800">Para Minha Empresa ou MEI</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">Economia automática com CNPJ</span>
                                            </div>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -30, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="flex flex-col gap-6 text-left"
                                >
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                            Quem será incluído no plano?
                                        </h3>
                                        <p className="text-slate-400 text-xs sm:text-sm font-medium">
                                            Adicione as idades para calcular as faixas etárias exatas.
                                        </p>
                                    </div>

                                    {/* Inputs Container */}
                                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                                        {/* Titular */}
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                Sua Idade
                                            </label>
                                            <input 
                                                type="number"
                                                placeholder="Ex: 34"
                                                value={titularAge}
                                                onChange={(e) => setTitularAge(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] text-slate-800 font-extrabold text-sm outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Dependents list */}
                                        <AnimatePresence>
                                            {dependents.map((dep, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                                    className="flex flex-col gap-1.5 overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                            Idade do Dependente {idx + 1}
                                                        </label>
                                                        <button 
                                                            onClick={() => {
                                                                const updated = [...dependents];
                                                                updated.splice(idx, 1);
                                                                setDependents(updated);
                                                            }}
                                                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                                                        >
                                                            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                                                        </button>
                                                    </div>
                                                    <input 
                                                        type="number"
                                                        placeholder="Ex: 28"
                                                        value={dep}
                                                        onChange={(e) => {
                                                            const updated = [...dependents];
                                                            updated[idx] = e.target.value;
                                                            setDependents(updated);
                                                        }}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] text-slate-800 font-extrabold text-sm outline-none transition-colors"
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Add dependent button */}
                                    <button
                                        onClick={() => setDependents([...dependents, ''])}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b2dff] hover:text-[#2d20e0] transition-colors cursor-pointer self-start"
                                    >
                                        <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                                        <span>Adicionar Dependente</span>
                                    </button>

                                    {/* CTA Button */}
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            disabled={!isStep2Valid}
                                            className="flex-1 py-3.5 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <span>Continuar para o Resultado</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -30, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="flex flex-col gap-6 text-left"
                                >
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                            Onde quer receber o seu estudo personalizado?
                                        </h3>
                                        <p className="text-slate-400 text-xs sm:text-sm font-medium">
                                            Enviamos as tabelas comerciais organizadas direto no seu celular.
                                        </p>
                                    </div>

                                    {/* Form fields */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5 relative">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                Seu Nome Completo
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type="text"
                                                    placeholder="Digite seu nome"
                                                    value={nome}
                                                    onChange={(e) => setNome(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff] text-slate-800 font-extrabold text-sm outline-none transition-colors"
                                                />
                                                <HugeiconsIcon icon={UserIcon} className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5 relative">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                WhatsApp com DDD
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type="text"
                                                    placeholder="(00) 00000-0000"
                                                    value={whatsapp}
                                                    onChange={handlePhoneChange}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-slate-800 font-extrabold text-sm outline-none transition-colors ${
                                                        isPhoneValid 
                                                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                                                            : 'border-slate-200 focus:border-[#3b2dff] focus:ring-1 focus:ring-[#3b2dff]'
                                                    }`}
                                                />
                                                <HugeiconsIcon icon={WhatsappIcon} className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Online Badge Validator */}
                                    <AnimatePresence>
                                        {isPhoneValid && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="flex items-center gap-1.5 justify-center py-1 select-none"
                                            >
                                                <span className="relative flex size-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">Consultores Online</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer transition-colors"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            onClick={() => setStep(4)}
                                            disabled={!isStep3Valid}
                                            className="flex-1 py-3.5 rounded-xl bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs shadow-sm cursor-pointer hover:shadow-md hover:shadow-[#3b2dff]/10 hover:scale-[1.01] transition-all flex items-center justify-center"
                                        >
                                            <span>Gerar Minha Simulação Gratuita</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="flex flex-col gap-6 text-center py-4 items-center"
                                >
                                    {/* Animated check circle drawing itself */}
                                    <div className="size-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-xs">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                            <motion.path 
                                                d="M20 6L9 17L4 12" 
                                                stroke="currentColor" 
                                                strokeWidth="3.5" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />
                                        </svg>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                            Simulação gerada com sucesso!
                                        </h3>
                                        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed max-w-sm mx-auto select-text">
                                            Olá! Nós já começamos a processar as tabelas para o seu perfil. Um especialista da Venancor entrará em contato em instantes no seu WhatsApp.
                                        </p>
                                    </div>

                                    {/* Reset button link */}
                                    <button 
                                        onClick={handleReset}
                                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mt-4 underline underline-offset-4"
                                    >
                                        Fazer nova simulação
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>
        </section>
    );
}
