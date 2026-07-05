'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, MapPin, HeartPulse } from 'lucide-react';

const hospitals = [
    {
        name: "Hospital Prontonil",
        city: "Nova Iguaçu - Centro",
        region: "Baixada Fluminense (Destaque)",
        description: "Referência em atendimento Adulto e Pediátrico no coração da Baixada Fluminense. Estrutura completa de urgência, emergência e repouso até 12h AMEP.",
        badges: ["Adulto & Pediátrico", "Urgência 24h AMEP", "Baixada Fluminense"],
        featured: true
    },
    {
        name: "Hospital Santa Branca",
        city: "Duque de Caxias",
        region: "Baixada Fluminense",
        description: "Suporte completo e atendimento Adulto ágil na região de Caxias, com suporte médico para emergências AMEP.",
        badges: ["Atendimento Adulto", "Urgência & Emergência"],
        featured: false
    },
    {
        name: "Hospital São Matheus",
        city: "Bangu",
        region: "Zona Oeste RJ",
        description: "Estrutura moderna para suporte Adulto e Pediátrico com pronto-socorro estruturado credenciado AMEP Saúde.",
        badges: ["Adulto & Pediátrico", "Pronto-Socorro 24h"],
        featured: false
    },
    {
        name: "Hospital Énio Serra & São Victor",
        city: "Laranjeiras & Tijuca",
        region: "Zona Sul & Zona Norte RJ",
        description: "Cobertura de urgência estrategicamente localizada para socorro rápido AMEP na Zona Sul e Zona Norte da capital.",
        badges: ["Zona Sul & Zona Norte", "Urgência Adulto"],
        featured: false
    }
];

export default function AmepHospitals() {
    return (
        <section className="w-full py-16 sm:py-24 bg-background border-b border-border/40 font-sans select-none">
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-background border border-border/60 px-5 py-2 rounded-full shadow-2xs">
                        <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                            <Building2 className="size-4" />
                            <span>Rede de Atendimento</span>
                        </div>
                        <span className="text-muted-foreground font-bold text-xs">•</span>
                        <Image src="/amep_saude_logo.png" alt="AMEP Saúde Logo" width={140} height={42} className="h-8 sm:h-9 w-auto object-contain drop-shadow-xs" />
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight max-w-3xl">
                        Hospitais Credenciados e Rede Própria AMEP Saúde
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-light">
                        Atendimento médico de excelência no <strong className="text-foreground font-semibold">Hospital Prontonil no Centro de Nova Iguaçu</strong> e hospitais parceiros em todo o RJ.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hospitals.map((hospital, index) => (
                        <motion.div
                            key={hospital.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`rounded-3xl p-6 flex flex-col justify-between text-left transition-all duration-300 ${
                                hospital.featured
                                    ? 'bg-primary/10 border-2 border-primary/30 shadow-lg relative'
                                    : 'bg-card border border-border/70 hover:border-primary/40'
                            }`}
                        >
                            {hospital.featured && (
                                <div className="absolute -top-3 left-6 bg-primary text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                    Hospital Principal AMEP
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary shrink-0">
                                        <HeartPulse className="size-5" />
                                    </div>
                                    <span className="text-[11px] font-semibold text-primary dark:text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                        {hospital.region}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-foreground leading-snug">
                                        {hospital.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-medium">
                                        <MapPin className="size-3.5 text-primary shrink-0" />
                                        <span>{hospital.city}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {hospital.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-1.5">
                                {hospital.badges.map((b) => (
                                    <span key={b} className="text-[10px] font-medium text-foreground bg-muted px-2 py-1 rounded-md border border-border/40">
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
