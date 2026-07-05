'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { UserCheck, Building2, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

const rules = [
    {
        icon: UserCheck,
        title: "Sem Limite de Idade na AMEP",
        subtitle: "A partir de 12 Anos Completos",
        description: "Na AMEP Saúde a contratação é liberada a partir de 12 anos completos. Jovens de 12 a 14 anos podem aderir individualmente sem a necessidade de estar atrelados a um responsável no contrato.",
        badge: "Individual / Adesão",
        imageSrc: "/image2.png",
        imageAlt: "Jovem e estudante aderindo ao plano AMEP Saúde"
    },
    {
        icon: Building2,
        title: "Flexibilidade MEI & CNPJ AMEP",
        subtitle: "Qualquer Vínculo Liberado",
        description: "Possui MEI ou CNPJ? Garanta a tabela AMEP Smart com até 35% de desconto. O titular pode incluir parentes, amigos ou colaboradores sem qualquer exigência de vínculo empregatício.",
        badge: "Smart PME / MEI",
        imageSrc: "/image3.png",
        imageAlt: "Equipe e dependentes no plano empresarial AMEP Saúde"
    },
    {
        icon: ShieldCheck,
        title: "Sem Surpresas no Fim do Mês",
        subtitle: "100% Sem Franquia & Sem Coparticipação",
        description: "O plano AMEP Saúde cobre todo o rol ambulatorial da ANS para consultas, exames, urgências e emergências (com repouso de até 12h no Hospital Prontonil), inteiramente sem franquia e sem coparticipação.",
        badge: "Zero Coparticipação",
        imageSrc: "/image4.png",
        imageAlt: "Atendimento médico tranquilo sem surpresas AMEP Saúde"
    }
];

export default function AmepRules() {
    return (
        <section className="w-full py-16 sm:py-24 bg-background border-b border-border/40 font-sans select-none">
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary dark:text-primary text-xs font-bold uppercase tracking-wider">
                            <HelpCircle className="size-3.5" />
                            <span>Regras do Contrato AMEP Saúde</span>
                        </div>
                        <Image src="/amep_saude_logo.png" alt="Amep Saúde Logo" width={65} height={20} className="h-5 w-auto object-contain" />
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight max-w-3xl">
                        Regras Claras para Você Adquirir o Plano AMEP Sem Dúvidas
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                        Entenda como funciona a contratação descomplicada e direta para a Baixada Fluminense.
                    </p>
                </div>

                {/* 3 Columns Grid with Naturally Framed Photos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rules.map((rule, idx) => {
                        const IconComp = rule.icon;
                        return (
                            <motion.div
                                key={rule.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="rounded-3xl p-6 bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between text-left shadow-xs group space-y-6"
                            >
                                <div className="space-y-5">
                                    {/* Image Container - Fixed Aspect Ratio (Never crops faces) */}
                                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 bg-muted">
                                        <Image 
                                            src={rule.imageSrc} 
                                            alt={rule.imageAlt} 
                                            fill 
                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        />
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-white/10">
                                                {rule.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-primary shrink-0">
                                                <IconComp className="size-4.5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-foreground leading-tight">
                                                    {rule.title}
                                                </h3>
                                                <span className="text-[11px] font-semibold text-primary dark:text-primary block">
                                                    {rule.subtitle}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                                            {rule.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                                    <span>Garantia oficial de contrato AMEP Saúde</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
