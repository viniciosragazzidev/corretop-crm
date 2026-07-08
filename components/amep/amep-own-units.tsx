'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Stethoscope, Activity, Heart, Shield, Clock, ArrowUpRight } from 'lucide-react';

const ownUnits = [
    {
        name: "Hospital CHAJ Jacarepaguá",
        services: ["Urgência 24h", "Atendimento Ambulatorial", "Exames Diagnósticos", "Centro Cirúrgico"],
        desc: "Nossa principal infraestrutura hospitalar com suporte completo para procedimentos de alta e média complexidade.",
        icon: Building2,
        highlight: true,
        span: "md:col-span-2",
        tag: "Principal Unidade 24h"
    },
    {
        name: "CIM Centro Infantil",
        services: ["Terapias Especializadas", "Acompanhamento Multidisciplinar"],
        desc: "Espaço dedicado exclusivamente ao cuidado, desenvolvimento e bem-estar das crianças.",
        icon: Heart,
        highlight: false,
        span: "md:col-span-1",
        tag: "Infantil"
    },
    {
        name: "Unidade Freguesia",
        services: ["Consultas Médicas", "Exames Laboratoriais"],
        desc: "Ambiente moderno e aconchegante focado em exames e consultas preventivas de rotina.",
        icon: Stethoscope,
        highlight: false,
        span: "md:col-span-1",
        tag: "Ambulatorial"
    },
    {
        name: "Unidade Madureira",
        services: ["Consultas de Especialidade", "Exames", "Terapias"],
        desc: "Centro de atendimento multidisciplinar projetado para garantir conforto no dia a dia.",
        icon: Activity,
        highlight: false,
        span: "md:col-span-1",
        tag: "Completa"
    },
    {
        name: "Unidade Taquara",
        services: ["Atendimento Clínico", "Exames Rápidos"],
        desc: "Praticidade e rapidez com profissionais altamente qualificados para sua família.",
        icon: Shield,
        highlight: false,
        span: "md:col-span-1",
        tag: "Ambulatorial"
    }
];

export default function AmepOwnUnits() {
    return (
        <section className="w-full py-20 sm:py-28 bg-[#f9fafb] border-y border-slate-200/50 font-sans select-none overflow-hidden relative">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col items-start text-left space-y-4 mb-16 max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Building2 className="size-3.5" />
                        <span>Infraestrutura Própria</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
                        Unidades Próprias <span className="text-primary">AMEP Saúde</span>
                    </h2>

                    <p className="text-base sm:text-lg text-slate-500 font-light leading-relaxed">
                        Cada centro médico foi estrategicamente planejado para oferecer acolhimento, alta tecnologia e excelência no atendimento.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ownUnits.map((unit, index) => {
                        const Icon = unit.icon;
                        const isPrimary = unit.highlight;
                        
                        return (
                            <motion.div
                                key={unit.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 100, 
                                    damping: 20,
                                    delay: index * 0.08 
                                }}
                                className={`group flex flex-col justify-between p-8 rounded-[2rem] border transition-[border-color,box-shadow] duration-300 relative overflow-hidden
                                    ${unit.span}
                                    ${isPrimary 
                                        ? 'bg-gradient-to-br from-primary via-primary to-primary/90 border-primary text-white shadow-xl shadow-primary/10' 
                                        : 'bg-white border-slate-200/60 hover:border-primary/30 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)]'
                                    }`}
                            >
                                {/* Inner glow for highlighted card */}
                                {isPrimary && (
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
                                )}

                                <div>
                                    {/* Card Header Info */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`p-3.5 rounded-2xl transition-transform duration-250 ease-out group-hover:scale-105
                                            ${isPrimary ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
                                            <Icon className="size-6" strokeWidth={1.75} />
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {isPrimary && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/25 rounded-full text-[10px] font-extrabold tracking-wide uppercase">
                                                    <Clock className="size-3" />
                                                    24 Horas
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                ${isPrimary ? 'bg-white/15 text-white/90' : 'bg-slate-100 text-slate-500'}`}>
                                                {unit.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Titles */}
                                    <h3 className={`text-2xl font-bold tracking-tight mb-2 flex items-center gap-1.5
                                        ${isPrimary ? 'text-white' : 'text-slate-900 group-hover:text-primary transition-colors duration-200'}`}>
                                        {unit.name}
                                        {!isPrimary && (
                                            <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-250 ease-out translate-y-1 group-hover:translate-y-0 text-primary" />
                                        )}
                                    </h3>
                                    
                                    <p className={`text-sm leading-relaxed mb-6 font-light
                                        ${isPrimary ? 'text-white/80' : 'text-slate-500'}`}>
                                        {unit.desc}
                                    </p>
                                </div>

                                {/* Services list as elegant tag system */}
                                <div className={`pt-6 border-t border-dashed ${isPrimary ? 'border-white/15' : 'border-slate-100'}`}>
                                    <div className="flex flex-wrap gap-1.5">
                                        {unit.services.map((service) => (
                                            <span 
                                                key={service} 
                                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg tracking-wide
                                                    ${isPrimary 
                                                        ? 'bg-white/10 text-white border border-white/5' 
                                                        : 'bg-slate-50 text-slate-600 border border-slate-100 group-hover:border-primary/10'}`}
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
