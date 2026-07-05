'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Clock, ShieldCheck, CheckCircle2, ArrowRight, Stethoscope, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AmepPromo() {
    const handleActionClick = () => {
        const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            window.open('https://wa.me/5521974450263?text=Olá!%20Quero%20aproveitar%20a%20promoção%20Carência%20Zero%20para%20consultas%20na%20AMEP%20Saúde.', '_blank');
        }
    };

    return (
        <section className="w-full py-16 sm:py-20 bg-background border-b border-border/40 font-sans select-none relative">
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
                
                {/* Main Clean Card Container */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl bg-card border border-border/80 p-6 sm:p-10 md:p-12 shadow-sm overflow-hidden"
                >
                    {/* Subtle Orange Accent Top Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/60" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center text-left">
                        
                        {/* Image Column - Spacious & Natural Ratio (5 Cols) */}
                        <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 shadow-md">
                            <Image 
                                src="/image5.png" 
                                alt="Atendimento Família Amep Saúde" 
                                fill 
                                priority
                                className="object-cover object-center" 
                            />
                            {/* Overlay Badge */}
                            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-background/90 backdrop-blur-md border border-border/60 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-primary">
                                        <Hospital className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Rede Própria AMEP</p>
                                        <p className="text-[10px] text-muted-foreground">Hospital Prontonil Nova Iguaçu</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-extrabold uppercase bg-primary text-white px-2.5 py-1 rounded-md">
                                    Liberado
                                </span>
                            </div>
                        </div>

                        {/* Content Column (7 Cols) */}
                        <div className="lg:col-span-7 flex flex-col items-start space-y-5">
                            
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary text-xs font-bold uppercase tracking-wider">
                                    <Zap className="size-3.5 fill-primary" />
                                    <span>Campanha Promocional AMEP</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <Image src="/amep_saude_logo.png" alt="Amep Saúde" width={65} height={20} className="h-4 w-auto object-contain" />
                                    <span>Tabela Oficial</span>
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                                Contrate AMEP Saúde Hoje e Tenha <span className="text-primary dark:text-primary">Carência ZERO para Consultas</span>.
                            </h2>

                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                                Durante a vigência desta campanha especial, os novos beneficiários do plano <strong className="text-foreground font-semibold">AMEP Saúde</strong> contam com liberação imediata (Carência Zero) para consultas nas especialidades médicas da Rede Própria AMEP. Sem burocracia, sem fila e sem coparticipação.
                            </p>

                            {/* Benefit Bullets */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1">
                                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-2.5">
                                    <Stethoscope className="size-4 text-primary shrink-0" />
                                    <span className="text-xs font-semibold text-foreground">Consultas Sem Espera</span>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-2.5">
                                    <Clock className="size-4 text-primary shrink-0" />
                                    <span className="text-xs font-semibold text-foreground">Carência Zero Imediata</span>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-2.5">
                                    <ShieldCheck className="size-4 text-primary shrink-0" />
                                    <span className="text-xs font-semibold text-foreground">Sem Coparticipação</span>
                                </div>
                            </div>

                            {/* Action CTA Row */}
                            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                                <Button 
                                    onClick={handleActionClick}
                                    size="lg"
                                    className="h-12 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>Garantir Carência Zero na AMEP</span>
                                    <ArrowRight className="size-4" />
                                </Button>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                                    <span>Vagas promocionais ativas na Baixada.</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
