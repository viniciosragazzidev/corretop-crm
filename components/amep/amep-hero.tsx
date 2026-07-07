'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Phone, Building2, Send, Sparkles, Zap, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
    }),
};

const priceCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function AmepHero() {
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [tipo, setTipo] = useState('pme');
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
                const modalidadeText = tipo === 'pme' ? 'CNPJ / MEI (a partir de R$ 82,94)' : 'Individual (a partir de R$ 138,74)';
                const msg = `Olá! Me chamo ${nome} e gostaria de consultar a tabela de preços do plano Amep Saúde (${modalidadeText}).`;
                window.open(`https://wa.me/5521964469750?text=${encodeURIComponent(msg)}`, '_blank');
            }, 600);
        }
    };

    return (
        <section className="relative w-full min-h-[100dvh] pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center bg-background overflow-hidden border-b border-border/40 font-sans select-none" style={{ perspective: '1000px' }}>
            
            {/* Background Image Overlay (Cinema Blend like Home Page) */}
            <div className="absolute inset-0 -z-20 bg-[url('/bg_hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 mix-blend-luminosity grayscale contrast-125 pointer-events-none" />

            {/* Ambient Background Gradient Wash */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Value Proposition & SplitText Title (7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                        
                        {/* Status Tag */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeLeft}
                            custom={0}
                            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary text-xs font-semibold shadow-2xs backdrop-blur-sm"
                        >
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                            </span>
                            <span>Tabela Promocional Disponível</span>
                        </motion.div>

                        {/* Co-Branding Header Badge (Amep Logo Larger) */}
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={fadeLeft}
                            custom={0.1}
                            className="flex flex-wrap items-center gap-3.5 p-2.5 pr-5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-md shadow-xs"
                        >
                            <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-full border border-border/50 shadow-2xs">
                                <Image src="/logo.webp" alt="Venacor Corretora" width={95} height={30} className="h-6 sm:h-7 w-auto object-contain dark:brightness-0 dark:invert" priority />
                                <span className="text-sm font-extrabold text-primary">×</span>
                                <Image src="/amep_saude_logo.png" alt="AMEP Saúde" width={150} height={45} className="h-8 sm:h-9.5 w-auto object-contain drop-shadow-xs" priority />
                            </div>
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <ShieldCheck className="size-4 text-primary shrink-0" />
                                Operadora Oficial AMEP Saúde
                            </span>
                        </motion.div>

                        <SplitText
                            tag="h1"
                            textAlign="left"
                            className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tighter text-foreground leading-[1.05]"
                            delay={15}
                            duration={0.9}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 30 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                        >
                            Plano AMEP Saúde: Excelência e Custo-Benefício no RJ. Adquira agora!
                        </SplitText>

                        {/* Subheadline (Exact Home Page Font Styles) */}
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeLeft}
                            custom={0.3}
                            className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-light"
                        >
                            Garanta consultas e exames de qualidade com os planos da <strong className="text-primary font-bold">AMEP Saúde</strong> em todo o estado do Rio de Janeiro. Cotação imediata com a Venacor Corretora!
                        </motion.p>

                        {/* Cards Horizontais de Preço Sutil (Staggered Entrance) */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2"
                        >
                            {/* Card Individual */}
                            <motion.div 
                                variants={priceCardVariants}
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-background/80 backdrop-blur-md border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Card Individual</span>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-xs font-medium text-muted-foreground">a partir de</span>
                                        <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">R$ 138<span className="text-lg font-bold">,74</span></span>
                                        <span className="text-xs text-muted-foreground">/mês</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs text-primary dark:text-primary font-medium">
                                    <CheckCircle2 className="size-3.5 shrink-0" />
                                    <span>Vendas a partir de 12 anos</span>
                                </div>
                            </motion.div>

                            {/* Card CNPJ / MEI */}
                            <motion.div 
                                variants={priceCardVariants}
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-primary/10 backdrop-blur-md border border-primary/30 hover:border-primary/30 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-2xs">
                                    Economia PME
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-primary dark:text-primary uppercase tracking-wider">Card CNPJ / MEI</span>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-xs font-medium text-primary dark:text-primary">a partir de</span>
                                        <span className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary tracking-tight">R$ 82<span className="text-lg font-bold">,94</span></span>
                                        <span className="text-xs text-primary dark:text-primary">/mês</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-primary/20 flex items-center gap-1.5 text-xs text-primary dark:text-primary font-medium">
                                    <Zap className="size-3.5 shrink-0 fill-primary" />
                                    <span>Inclua dependentes sem vínculo</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Customer Visual Feature Strip */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="w-full p-4 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-center gap-4 shadow-2xs backdrop-blur-md"
                        >
                            <div className="flex -space-x-3 shrink-0">
                                <div className="relative size-11 rounded-full border-2 border-background overflow-hidden shadow-xs">
                                    <Image src="/image1.png" alt="Cliente AMEP Saúde" fill className="object-cover object-center" />
                                </div>
                                <div className="relative size-11 rounded-full border-2 border-background overflow-hidden shadow-xs">
                                    <Image src="/image3.png" alt="Equipe AMEP PME" fill className="object-cover object-center" />
                                </div>
                                <div className="relative size-11 rounded-full border-2 border-background overflow-hidden shadow-xs">
                                    <Image src="/image4.png" alt="Atendimento AMEP" fill className="object-cover object-center" />
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-foreground">
                                    Mais de 15.000 vidas protegidas pelo AMEP SAÚDE
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 font-light">
                                    Suporte completo da operadora e consultoria especializada da Venacor Saúde no Rio de Janeiro.
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column: Glassmorphic Lead Form (5 Cols) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.3 }}
                        className="lg:col-span-5 w-full max-w-md mx-auto"
                    >
                        <div className="relative rounded-3xl bg-background/80 dark:bg-background/70 backdrop-blur-2xl border border-border/40 p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
                            
                            {/* Subtle internal gradient bar */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/60 via-primary/60 to-primary/60" />

                            <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-border/40">
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1">
                                        <Sparkles className="size-3" />
                                        Cotação Oficial 2026
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                        Tabela AMEP Saúde
                                    </h3>
                                </div>
                                <Image src="/amep_saude_logo.png" alt="AMEP Saúde Logo" width={140} height={42} className="h-9 sm:h-10 w-auto object-contain drop-shadow-xs" />
                            </div>

                            <div className="flex flex-col items-start text-left space-y-1 mb-6">
                                <p className="text-xs sm:text-sm text-muted-foreground font-light">
                                    Informe seus dados abaixo para receber os valores oficiais do <strong className="text-foreground font-semibold">Plano AMEP Saúde</strong> no seu WhatsApp.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                {/* Nome */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Seu Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            required
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Ex: Carlos Oliveira"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-muted/20 focus:bg-background focus:border-primary outline-none transition-all text-sm font-medium text-foreground placeholder:font-normal placeholder:text-muted-foreground/60 shadow-2xs"
                                        />
                                    </div>
                                </div>

                                {/* WhatsApp */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Seu WhatsApp com DDD</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            required
                                            value={whatsapp}
                                            onChange={handlePhoneChange}
                                            placeholder="(21) 99999-9999"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-muted/20 focus:bg-background focus:border-primary outline-none transition-all text-sm font-medium text-foreground placeholder:font-normal placeholder:text-muted-foreground/60 shadow-2xs"
                                        />
                                    </div>
                                </div>

                                {/* Seletor de Perfil */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Perfil de Contratação</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <select
                                            value={tipo}
                                            onChange={(e) => setTipo(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-muted/20 focus:bg-background focus:border-primary outline-none transition-all text-sm font-medium text-foreground appearance-none cursor-pointer shadow-2xs"
                                        >
                                            <option value="pme" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">
                                                Tenho CNPJ / MEI (a partir de R$ 82,94)
                                            </option>
                                            <option value="individual" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">
                                                Para Mim / Família (a partir de R$ 138,74)
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit CTA */}
                                <Button
                                    type="submit"
                                    disabled={!nome || whatsapp.length < 14 || isSubmitting}
                                    className="w-full h-14 rounded-xl bg-primary hover:bg-primary text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? (
                                        <span>Consultando Tabela...</span>
                                    ) : (
                                        <>
                                            <span>Ver Tabela de Preços</span>
                                            <Send className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                                <span>Consultoria sem compromisso da Venacor Saúde.</span>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
