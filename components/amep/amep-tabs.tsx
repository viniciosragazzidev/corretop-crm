'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Hospital, ClipboardCheck, ArrowRight, CheckCircle2, ShieldCheck, Building, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

type TabKey = 'unidades' | 'empresarial' | 'idade';

const tabsData = {
    unidades: {
        id: 'unidades',
        badge: 'Rede Própria',
        title: 'Estrutura planejada para oferecer conforto e tecnologia.',
        text: 'A Amep Saúde conta com centros médicos modernos e atendimento humanizado espalhados estrategicamente:',
        ctaText: 'Consultar Unidade Próxima',
        ctaAction: 'scrollUnidades',
        imageSrc: '/image5.png',
        imageAlt: 'Unidades Próprias Amep Saúde',
        imagePosition: 'object-center',
        highlights: [
            'Unidade Freguesia: Ambulatório e exames',
            'Unidade Madureira: Ambulatório, exames e terapias',
            'Hospital CHAJ Jacarepaguá: Urgência 24h e cirurgias',
            'Unidade Taquara e CIM: Terapias e consultas'
        ]
    },
    empresarial: {
        id: 'empresarial',
        badge: 'Plano Empresarial',
        title: 'Benefício bom é aquele que o colaborador realmente valoriza e pode usar!',
        text: 'Proteja sua equipe com um plano empresarial com atendimento humanizado, rede própria, credenciada e benefícios reais para a rotina do dia a dia.',
        ctaText: 'Cotar para Minha Empresa',
        ctaAction: 'scrollSimulador',
        imageSrc: '/image4.png',
        imageAlt: 'Plano de Saúde Empresarial AMEP',
        imagePosition: 'object-top',
        highlights: ['Rede própria e credenciada completa', 'Excelente custo-benefício para RH', 'Atendimento humanizado']
    },
    idade: {
        id: 'idade',
        badge: 'Melhor Idade',
        title: 'Investir em você não tem idade!',
        text: 'Aqui na Amep tem saúde de verdade para quem deseja viver mais e melhor, oferecendo a segurança necessária em todas as fases da vida.',
        ctaText: 'Solicitar Atendimento Especializado',
        ctaAction: 'whatsapp',
        imageSrc: '/image2.png',
        imageAlt: 'Saúde na Melhor Idade Amep',
        imagePosition: 'object-center',
        highlights: ['Acompanhamento contínuo', 'Programas de prevenção e bem-estar', 'Segurança em todas as fases da vida']
    }
};

export default function AmepTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>('unidades');

    const handleCtaClick = (action: string) => {
        if (action === 'whatsapp') {
            window.open('https://wa.me/5521964469750?text=Olá!%20Gostaria%20de%20aproveitar%20a%20Carência%20Zero%20para%20consultas%20na%20Amep%20Saúde.', '_blank');
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
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-background border border-border/60 px-5 py-2 rounded-full shadow-2xs">
                        <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                            <Zap className="size-4" />
                            <span>Vantagens Exclusivas</span>
                        </div>
                        <span className="text-muted-foreground font-bold text-xs">•</span>
                        <Image src="/amep_saude_logo.png" alt="AMEP Saúde Logo" width={140} height={42} className="h-8 sm:h-9 w-auto object-contain drop-shadow-xs" />
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
                        Diferenciais do Plano AMEP Saúde
                    </SplitText>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-light leading-relaxed">
                        Navegue pelas abas para conhecer a carência zero, rede credenciada e flexibilidade da <strong className="text-primary font-bold">AMEP Saúde</strong>.
                    </p>
                </div>

                {/* Tab Menu Switcher */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1.5 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md shadow-inner gap-1">
                        <button
                            onClick={() => setActiveTab('unidades')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'unidades' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'unidades' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Building className="size-4" />
                                <span>Unidades Próprias</span>
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('empresarial')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'empresarial' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'empresarial' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Briefcase className="size-4" />
                                <span>Plano Empresarial</span>
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('idade')}
                            className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                                activeTab === 'idade' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {activeTab === 'idade' && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Heart className="size-4" />
                                <span>Viver Mais e Melhor</span>
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
                            initial={{ opacity: 0, scale: 0.98, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
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
                                        className="h-12 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-2 transition-[transform,background-color] duration-200 ease-out active:scale-[0.98]"
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
