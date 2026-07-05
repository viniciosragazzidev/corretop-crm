'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, User, ArrowLeft, ArrowRight, Send, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

export default function AmepSimulator() {
    const [step, setStep] = useState(1);

    // Form Data
    const [modalidade, setModalidade] = useState<'pme' | 'individual'>('pme');
    const [qtdVidas, setQtdVidas] = useState(2);
    const [mediaIdade, setMediaIdade] = useState(30);
    const [faixaEtaria, setFaixaEtaria] = useState('00 a 18 anos');
    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

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

    const getEstimativa = () => {
        if (modalidade === 'pme') {
            let valorBase = 82.94;
            if (mediaIdade >= 19 && mediaIdade <= 23) valorBase = 87.09;
            else if (mediaIdade >= 24 && mediaIdade <= 28) valorBase = 95.80;
            else if (mediaIdade >= 29 && mediaIdade <= 33) valorBase = 105.37;
            else if (mediaIdade >= 34 && mediaIdade <= 38) valorBase = 118.02;
            else if (mediaIdade >= 39) valorBase = 132.18;

            const total = valorBase * qtdVidas;
            return { valorUnitario: valorBase.toFixed(2).replace('.', ','), total: total.toFixed(2).replace('.', ',') };
        } else {
            let valorBase = 138.74;
            if (faixaEtaria === '19 a 23 anos') valorBase = 145.67;
            else if (faixaEtaria === '24 a 28 anos') valorBase = 160.24;
            else if (faixaEtaria === '29 a 33 anos') valorBase = 176.26;
            else if (faixaEtaria === '34 a 38 anos') valorBase = 197.42;
            else if (faixaEtaria === '39 a 43 anos') valorBase = 221.11;

            const total = valorBase;
            return { valorUnitario: valorBase.toFixed(2).replace('.', ','), total: total.toFixed(2).replace('.', ',') };
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length >= 10 && nome) {
            const estimativa = getEstimativa();
            const modStr = modalidade === 'pme' ? `Empresarial/MEI (${qtdVidas} vidas, média ${mediaIdade} anos)` : `Individual (${faixaEtaria})`;
            const msg = `Olá! Realizei uma simulação no site da AMEP Saúde:\n- Nome: ${nome}\n- Modalidade: ${modStr}\n- Estimativa Mensal: R$ ${estimativa.total}\nGostaria de finalizar a contratação!`;
            window.open(`https://wa.me/5521974450263?text=${encodeURIComponent(msg)}`, '_blank');
        }
    };

    return (
        <section id="simulador" className="w-full py-16 sm:py-24 bg-gradient-to-b from-background via-muted/30 to-background border-b border-border/40 font-sans select-none">
            <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-background border border-border/60 px-5 py-2 rounded-full shadow-2xs">
                        <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                            <Calculator className="size-4" />
                            <span>Cotação Online</span>
                        </div>
                        <span className="text-muted-foreground font-bold text-xs">•</span>
                        <Image src="/amep_saude_logo.png" alt="AMEP Saúde Logo" width={150} height={45} className="h-8 sm:h-9.5 w-auto object-contain drop-shadow-xs" />
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
                        Simulador Oficial Plano AMEP Saúde
                    </SplitText>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-light leading-relaxed">
                        Calcule em 3 passos o valor exato para você, sua família ou empresa no plano <strong className="text-primary font-bold">AMEP Saúde</strong>.
                    </p>
                </div>

                {/* Card Container */}
                <div className="rounded-3xl bg-background border border-border/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/60" />

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/40">
                        <div className="flex items-center gap-2">
                            <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>1</span>
                            <span className="text-xs font-semibold text-foreground hidden sm:inline">Modalidade</span>
                        </div>
                        <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-primary' : 'bg-border/60'}`} />
                        <div className="flex items-center gap-2">
                            <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</span>
                            <span className="text-xs font-semibold text-foreground hidden sm:inline">Perfil & Vidas</span>
                        </div>
                        <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-primary' : 'bg-border/60'}`} />
                        <div className="flex items-center gap-2">
                            <span className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>3</span>
                            <span className="text-xs font-semibold text-foreground hidden sm:inline">Resultado & Envio</span>
                        </div>
                    </div>

                    {/* Steps Content */}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Passo 1: Qual é o seu tipo de contratação?</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Escolha entre Ideal Adesão / Lagos ou Empresarial (PME / MEI).</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setModalidade('pme')}
                                        className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                                            modalidade === 'pme'
                                                ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/20'
                                                : 'bg-muted/30 border-border/60 hover:border-border'
                                        }`}
                                    >
                                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                            <Building2 className="size-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-foreground">Empresarial (PME / MEI)</h4>
                                                <span className="text-[10px] font-black uppercase bg-primary text-white px-2 py-0.5 rounded-full">A partir de 2 Vidas</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Valores com até 35% de desconto a partir de R$ 82,94/mês.</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setModalidade('individual')}
                                        className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                                            modalidade === 'individual'
                                                ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/20'
                                                : 'bg-muted/30 border-border/60 hover:border-border'
                                        }`}
                                    >
                                        <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                            <User className="size-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-foreground">Ideal Adesão / Lagos</h4>
                                                <span className="text-[10px] font-semibold bg-muted text-foreground px-2 py-0.5 rounded-full">Individual</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Contratação para pessoa física a partir de R$ 138,74/mês.</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={() => setStep(2)}
                                        className="h-11 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-2"
                                    >
                                        <span>Próximo Passo</span>
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        Passo 2: {modalidade === 'pme' ? 'Perfil da Empresa (Vidas & Idade)' : 'Faixa Etária do Titular'}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">Vendas individuais a partir de 12 anos. Entrevista médica obrigatória por telemedicina de 12 a 18 anos e de 49 anos em diante.</p>
                                </div>

                                {modalidade === 'pme' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantidade de Colaboradores / Vidas</label>
                                            <input
                                                type="number"
                                                min={2}
                                                max={99}
                                                value={qtdVidas}
                                                onChange={(e) => setQtdVidas(Math.max(2, parseInt(e.target.value) || 2))}
                                                className="w-full p-3 rounded-xl border border-border/80 bg-background text-foreground text-sm font-bold focus:border-primary outline-none shadow-2xs"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Média de Idade da Equipe (Anos)</label>
                                            <input
                                                type="number"
                                                min={12}
                                                max={65}
                                                value={mediaIdade}
                                                onChange={(e) => setMediaIdade(parseInt(e.target.value) || 30)}
                                                className="w-full p-3 rounded-xl border border-border/80 bg-background text-foreground text-sm font-bold focus:border-primary outline-none shadow-2xs"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selecione a Faixa Etária</label>
                                        <select
                                            value={faixaEtaria}
                                            onChange={(e) => setFaixaEtaria(e.target.value)}
                                            className="w-full p-3.5 rounded-xl border border-border/80 bg-background text-foreground text-sm font-bold focus:border-primary outline-none cursor-pointer shadow-2xs"
                                        >
                                            <option value="00 a 18 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">00 a 18 anos - R$ 138,74</option>
                                            <option value="19 a 23 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">19 a 23 anos - R$ 145,67</option>
                                            <option value="24 a 28 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">24 a 28 anos - R$ 160,24</option>
                                            <option value="29 a 33 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">29 a 33 anos - R$ 176,26</option>
                                            <option value="34 a 38 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">34 a 38 anos - R$ 197,42</option>
                                            <option value="39 a 43 anos" className="bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">39 a 43 anos - R$ 221,11</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="h-11 px-5 rounded-xl cursor-pointer flex items-center gap-2"
                                    >
                                        <ArrowLeft className="size-4" />
                                        <span>Voltar</span>
                                    </Button>

                                    <Button
                                        onClick={() => setStep(3)}
                                        className="h-11 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-2"
                                    >
                                        <span>Ver Resultado</span>
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-primary dark:text-primary">
                                        <span>Estimativa de Cotação Amep</span>
                                        <span>Sem Franquia</span>
                                    </div>
                                    <div className="flex items-baseline justify-between pt-1">
                                        <span className="text-sm font-semibold text-foreground">Valor Estimado Total:</span>
                                        <span className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary">
                                            R$ {getEstimativa().total} <span className="text-xs text-muted-foreground font-normal">/mês</span>
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleFinalSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seu Nome</label>
                                            <input
                                                type="text"
                                                required
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                placeholder="Nome completo"
                                                className="w-full p-3 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground text-sm font-medium focus:border-primary outline-none shadow-2xs"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seu WhatsApp</label>
                                            <input
                                                type="tel"
                                                required
                                                value={whatsapp}
                                                onChange={handlePhoneChange}
                                                placeholder="(21) 99999-9999"
                                                className="w-full p-3 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground text-sm font-medium focus:border-primary outline-none shadow-2xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                            className="h-11 px-5 rounded-xl cursor-pointer flex items-center gap-2"
                                        >
                                            <ArrowLeft className="size-4" />
                                            <span>Alterar Dados</span>
                                        </Button>

                                        <Button
                                            type="submit"
                                            disabled={!nome || whatsapp.length < 14}
                                            className="h-12 px-6 rounded-xl bg-primary hover:bg-primary text-white font-bold text-sm shadow-lg cursor-pointer flex items-center gap-2"
                                        >
                                            <span>Gerar Minha Simulação Gratuita</span>
                                            <Send className="size-4" />
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            </div>
        </section>
    );
}
