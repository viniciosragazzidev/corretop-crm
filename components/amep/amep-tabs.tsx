'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Hospital, ClipboardCheck, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

type TabKey = 'beneficio' | 'hospitais' | 'regras';

const tabsData = {
    beneficio: {
        id: 'beneficio',
        badge: 'Benefício Promocional',
        title: 'Aproveite a carência zero para consultas.',
        text: 'Durante todo o mês de junho, os novos beneficiários contarão com Carência Zero para consultas nas especialidades médicas da Rede Própria AMEP Saúde.',
        ctaText: 'Falar com Consultor no WhatsApp',
        ctaAction: 'whatsapp',
        imageSrc: '/image5.png',
        imageAlt: 'Atendimento e consultas Amep Saúde',
        imagePosition: 'object-center',
        highlights: ['Campanha válida apenas em Junho/2026', 'Carência Zero imediata', 'Rede Própria AMEP']
    },
    hospitais: {
        id: 'hospitais',
        badge: 'Rede de Atendimento',
        title: 'Atendimento rápido perto de você.',
        text: 'Cobertura de urgência e emergência nos principais hospitais do Rio. Destaque total na Baixada para o Hospital Geral Prontonil (Nova Iguaçu) com suporte Adulto e Pediátrico completo.',
        ctaText: 'Ver Lista de Hospitais Completa',
        ctaAction: 'scrollSimulador',
        imageSrc: '/image4.png',
        imageAlt: 'Hospital Geral Prontonil Nova Iguaçu AMEP',
        imagePosition: 'object-top',
        highlights: ['Hospital Prontonil Nova Iguaçu', 'Suporte Adulto & Pediátrico', 'Hospitais Caxias, Bangu, RJ']
    },
    regras: {
        id: 'regras',
        badge: 'Condições Flexíveis',
        title: 'Regras simples para você ou sua empresa.',
        text: 'Disponível a partir de 12 anos de idade (sem precisar de responsável atrelado ao contrato). Se você tem MEI ou CNPJ, pode incluir dependentes, familiares ou colaboradores sem complicação.',
        ctaText: 'Consultar Minha Idade / Perfil',
        ctaAction: 'scrollSimulador',
        imageSrc: '/image2.png',
        imageAlt: 'Contratação Amep Saúde para famílias e PME',
        imagePosition: 'object-center',
        highlights: ['Vendas a partir de 12 anos completos', 'Desconto MEI / CNPJ até 35%', 'Sem exigência de vínculo']
    }
};

export default function AmepTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>('beneficio');

    const handleCtaClick = (action: string) => {
        if (action === 'whatsapp') {
            window.open('https://wa.me/5521974450263?text=Olá!%20Gostaria%20de%20aproveitar%20a%20Carência%20Zero%20para%20consultas%20na%20Amep%20Saúde.', '_blank');
        } else {
            const el = document.getElementById('simulador');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const currentTab = tabsData[activeTab];

    return (
        <section className="w-full py-16 sm:py-24 bg-background border-b border-border/40 font-sans select-none">
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary dark:text-primary text-xs font-semibold tracking-wide">
                        <Zap className="size-3.5" />
                        <span>Por que escolher o Plano Amep Saúde?</span>
                    </div>

                    <SplitText
                        tag="h2"
                        textAlign="center"
                        className="text-3xl sm:text-4xl lg:text-[48px] font-semibold tracking-tighter text-foreground leading-[1.1] max-w-3xl"
                        delay={15}
                        duration={0.9}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 25 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                    >
                        Diferenciais Práticos do Plano Amep Saúde
                    </SplitText>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-light leading-relaxed">
                        Clique nas abas abaixo para explorar os benefícios, rede de hospitais e regras do plano Amep.
                    </p>
                </div>

                {/* Tab Menu Switcher */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1.5 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md shadow-inner gap-1">
                        <button
                            onClick={() => setActiveTab('beneficio')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                activeTab === 'beneficio' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'beneficio' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Zap className="size-4" />
                                <span>Benefício do Mês</span>
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('hospitais')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                activeTab === 'hospitais' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'hospitais' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Hospital className="size-4" />
                                <span>Hospitais e Rede</span>
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('regras')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                activeTab === 'regras' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'regras' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <ClipboardCheck className="size-4" />
                                <span>Quem Pode Contratar</span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Tab Content Display Container */}
                <div className="relative rounded-3xl bg-card border border-border/80 p-6 sm:p-10 shadow-sm overflow-hidden text-left">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/60" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                        >
                            {/* Text & Micro CTA (7 Cols) */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary dark:text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {currentTab.badge}
                                    </span>
                                    <Image src="/amep_saude_logo.png" alt="Amep Saúde" width={100} height={28} className="h-6 w-auto object-contain" />
                                </div>

                                <h3 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                                    {currentTab.title}
                                </h3>

                                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light">
                                    {currentTab.text}
                                </p>

                                {/* Highlights Bullets */}
                                <div className="space-y-2.5 pt-1">
                                    {currentTab.highlights.map((item) => (
                                        <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                                            <CheckCircle2 className="size-4 text-primary shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Micro-CTA Action */}
                                <div className="pt-3">
                                    <Button
                                        onClick={() => handleCtaClick(currentTab.ctaAction)}
                                        className="h-12 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-2 transition-all active:scale-[0.98]"
                                    >
                                        <span>{currentTab.ctaText}</span>
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Image Framed (5 Cols) */}
                            <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 shadow-md bg-muted">
                                <Image
                                    src={currentTab.imageSrc}
                                    alt={currentTab.imageAlt}
                                    fill
                                    priority
                                    className={`object-cover ${currentTab.imagePosition}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs font-semibold">
                                    <ShieldCheck className="size-4 text-primary shrink-0" />
                                    <span>Garantia oficial Amep Saúde</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>

            </div>
        </section>
    );
}
