'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Phone, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
    }),
};

const formReveal = {
    hidden: { opacity: 0, y: 80, scale: 0.95, rotateX: 10 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: { type: "spring" as const, stiffness: 70, damping: 20, delay: 0.4 },
    },
};

const priceCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero: React.FC = () => {
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [tipo, setTipo] = useState('cnpj');
    const [isFocused, setIsFocused] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, '');
        let formatted = '';
        if (input.length > 0) {
            formatted = `(${input.slice(0, 2)}`;
            if (input.length > 2) {
                formatted += `) ${input.slice(2, 7)}`;
            }
            if (input.length > 7) {
                formatted += `-${input.slice(7, 11)}`;
            }
        }
        setWhatsapp(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length >= 10 && nome) {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                window.open(`https://wa.me/5521964469750?text=${encodeURIComponent(`Olá! Me chamo ${nome} e gostaria de uma cotação rápida via ${tipo.toUpperCase()}.`)}`, '_blank');
            }, 600);
        }
    };

    return (
        <section className="relative w-full overflow-hidden bg-background pt-24 pb-20 md:pt-32 md:pb-28 font-sans flex items-center min-h-[100dvh]" style={{ perspective: '1000px' }}>

            {/* Background Image with Cinematic Blend */}
            <div
                className="absolute inset-0 -z-20 bg-[url('/bg_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 mix-blend-luminosity grayscale contrast-125 pointer-events-none"
            />

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
            </div>

            {/* Grid Principal */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-28 relative z-10 grid lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.2fr_1fr] gap-12 items-center">
                {/* ESQUERDA: Copy & Social Proof */}
                <div className="flex flex-col items-start text-left w-full">
                    {/* Tag Superior */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeLeft}
                        custom={0}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary text-[11px] sm:text-xs font-semibold mb-8 select-none shadow-sm backdrop-blur-sm"
                    >
                        <span className="relative flex size-2 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                        </span>
                        <span>Tabelas de Saúde e Odonto Atualizadas 2026</span>
                    </motion.div>

                    {/* Headline Principal using SplitText */}
                    <SplitText
                        tag="h1"
                        textAlign="left"
                        className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tighter text-foreground leading-[1.05] mb-6"
                        delay={15}
                        duration={0.9}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 30 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                    >
                        Planos de Saúde Completos com o Menor Preço do Mercado.
                    </SplitText>

                    {/* Subheadline */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeLeft}
                        custom={0.3}
                        className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-light mb-10"
                    >
                        Economize até <span className="font-semibold text-foreground">35%</span> comparando Amil, Bradesco, SulAmérica, Unimed e mais. Cobertura ideal para você, sua família ou empresa.
                    </motion.p>

                    {/* Blocos de Preço / Badges (Staggered) */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.45 } }
                        }}
                        className="flex flex-col sm:flex-row gap-4 w-full"
                    >
                        {/* Card Saúde */}
                        <motion.div
                            variants={priceCardVariants}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-background/80 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 w-full sm:w-auto min-w-[240px]"
                        >
                            <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                <Stethoscope className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Saúde Individual/PME</span>
                                <span className="text-sm font-semibold text-foreground">a partir de <span className="text-primary font-bold text-lg">R$ 89,90</span></span>
                            </div>
                        </motion.div>

                        {/* Card Odonto */}
                        <motion.div
                            variants={priceCardVariants}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-background/80 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 w-full sm:w-auto min-w-[240px]"
                        >
                            <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                <Sparkles className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Odonto Completo</span>
                                <span className="text-sm font-semibold text-foreground">a partir de <span className="text-primary font-bold text-lg">R$ 21,90</span></span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* DIREITA: Formulário de Conversão */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={formReveal}
                    className="w-full flex justify-center lg:justify-end mt-12 lg:mt-0"
                >
                    <div className="w-full max-w-[420px] bg-background/80 dark:bg-background/70 backdrop-blur-2xl border border-border/40 rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">

                        {/* Subtle internal glow */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-[length:200%_auto] animate-gradient" />

                        <div className="mb-8">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                                Faça sua cotação rápida
                            </h3>
                            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Preencha abaixo e receba as tabelas completas no WhatsApp em minutos.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nome */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Seu Nome</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within/input:text-primary">
                                        <User className="size-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Nome completo"
                                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border/70 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-foreground placeholder:font-normal placeholder:text-muted-foreground/60"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Seu WhatsApp</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within/input:text-primary">
                                        <Phone className="size-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={whatsapp}
                                        onChange={handlePhoneChange}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        placeholder="(21) 99999-9999"
                                        className={`w-full pl-10 pr-4 py-3.5 rounded-xl border transition-all text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/60 ${isFocused ? 'bg-background border-primary ring-2 ring-primary/20' : 'bg-muted/20 border-border/70'}`}
                                    />
                                </div>
                            </div>

                            {/* Dropdown CNPJ/CPF */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Possui CNPJ ou MEI?</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within/input:text-primary">
                                        <Building2 className="size-4" />
                                    </div>
                                    <select
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-border/70 bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium text-foreground appearance-none cursor-pointer"
                                    >
                                        <option value="cnpj">Sim, quero +35% de desconto</option>
                                        <option value="cpf">Não, quero plano pessoa física (CPF)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-3">
                                <Button
                                    type="submit"
                                    disabled={!nome || whatsapp.length < 14 || isSubmitting}
                                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    {isSubmitting ? 'Processando...' : 'Falar com Consultor Agora'}
                                </Button>
                            </div>

                            {/* Antifriction */}
                            <div className="flex justify-center items-center gap-2 pt-2 select-none">
                                <ShieldCheck className="size-4 text-primary shrink-0" />
                                <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">
                                    Resposta em menos de <span className="font-bold text-foreground">5 minutos</span> via WhatsApp.
                                </span>
                            </div>
                        </form>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
