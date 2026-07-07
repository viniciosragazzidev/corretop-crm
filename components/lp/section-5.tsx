'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserPlus, Trash2, ArrowLeft, Loader2, CheckCircle2, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

interface Props {}

interface Dependant {
    id: number;
    age: string;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 120 : -120,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 } as const
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 120 : -120,
        opacity: 0,
        transition: { ease: 'easeInOut', duration: 0.25 } as const
    })
};

const SectionFive: React.FC<Props> = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    
    // Form Data
    const [categoria, setCategoria] = useState<'saude' | 'odonto' | 'ambos' | null>(null);
    const [contratacao, setContratacao] = useState<'individual' | 'corporate' | null>(null);
    
    // Individual Form State
    const [idadeTitular, setIdadeTitular] = useState('');
    const [dependants, setDependants] = useState<Dependant[]>([]);
    
    // Corporate Form State (Media de idade e Quantidade de colaboradores)
    const [qtdColaboradores, setQtdColaboradores] = useState('');
    const [mediaIdade, setMediaIdade] = useState('');

    const [nome, setNome] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    
    // Status State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Dependant Counter
    const [nextDepId, setNextDepId] = useState(1);

    // Phone Number Mask
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

    // Age Input Validator
    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setIdadeTitular(val);
    };

    // Add Dependant Row
    const addDependant = () => {
        setDependants([...dependants, { id: nextDepId, age: '' }]);
        setNextDepId(nextDepId + 1);
    };

    // Remove Dependant Row
    const removeDependant = (id: number) => {
        setDependants(dependants.filter(dep => dep.id !== id));
    };

    // Update Dependant Age
    const handleDepAgeChange = (id: number, ageVal: string) => {
        const val = ageVal.replace(/\D/g, '');
        setDependants(dependants.map(dep => dep.id === id ? { ...dep, age: val } : dep));
    };

    const nextStep = () => {
        setDirection(1);
        setStep(step + 1);
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(step - 1);
    };

    const selectCategoria = (cat: 'saude' | 'odonto' | 'ambos') => {
        setCategoria(cat);
        nextStep();
    };

    const selectContratacao = (type: 'individual' | 'corporate') => {
        setContratacao(type);
        nextStep();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || whatsapp.length < 14) return;

        setIsSubmitting(true);
        // Simulate data post & WhatsApp format
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            
            const detailText = contratacao === 'corporate'
                ? `Empresa (CNPJ/MEI) - ${qtdColaboradores} colaboradores, média de idade: ${mediaIdade} anos`
                : `Individual/Família - Titular: ${idadeTitular} anos${dependants.length > 0 ? `, Dependentes: ${dependants.map(d => d.age).join(', ')} anos` : ''}`;

            const msg = `Olá! Me chamo ${nome}. Gostaria de receber a cotação do plano ${categoria?.toUpperCase()}.\nPerfil: ${detailText}`;
            window.open(`https://wa.me/5521964469750?text=${encodeURIComponent(msg)}`, '_blank');
        }, 1500);
    };

    return (
        <section className="relative w-full bg-background py-16 md:py-24 font-sans overflow-hidden border-t border-border/20 flex flex-col items-center justify-center">
            {/* Premium Glowing Background Accents */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/5 blur-[100px] pointer-events-none" />
            </div>

            <div className="w-full max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 w-full">
                    
                    {/* COLUNA 1: TEXTOS E BENEFÍCIOS */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full md:w-1/2 flex flex-col items-start text-left space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            <span>Simulação Rápida</span>
                        </div>
                        
                        <SplitText
                            tag="h2"
                            className="text-3xl sm:text-5xl font-medium tracking-tight text-foreground leading-tight"
                            textAlign="left"
                            delay={20}
                        >
                            Receba sua cotação na hora
                        </SplitText>

                        <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed max-w-xl">
                            Simule preços e carências em poucos cliques. Nosso sistema analisa as melhores operadoras para o seu perfil.
                        </p>
                        
                        <div className="space-y-5 pt-2 w-full">
                            <div className="flex items-start gap-3">
                                <span className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                <div className="space-y-1">
                                    <h4 className="text-sm sm:text-base font-semibold text-foreground">
                                        Desconto CNPJ Automático
                                    </h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                                        Use seu CNPJ ou MEI e garanta até 35% de desconto no valor final.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                <div className="space-y-1">
                                    <h4 className="text-sm sm:text-base font-semibold text-foreground">
                                        Cálculo Exato
                                    </h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
                                        Adicione familiares ou a média de idade da sua equipe para valores consolidados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* COLUNA 2: CARD DO SIMULADOR */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                        className="w-full md:w-1/2 flex justify-center md:justify-end"
                    >
                        <motion.div 
                            layout
                            className="w-full max-w-xl bg-background/80 backdrop-blur-md border border-border/40 rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col items-center text-center py-6 select-none"
                                    >
                                        <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5">
                                            <CheckCircle2 className="size-8" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                                            Simulação Gerada com Sucesso!
                                        </h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-light mb-6">
                                            Olá, <span className="font-bold text-foreground">{nome}</span>! Nós já preparamos a tabela comparativa das melhores operadoras. Nosso consultor enviará tudo no WhatsApp <span className="font-semibold text-foreground">{whatsapp}</span>.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setStep(1);
                                                setCategoria(null);
                                                setContratacao(null);
                                                setIdadeTitular('');
                                                setDependants([]);
                                                setQtdColaboradores('');
                                                setMediaIdade('');
                                                setNome('');
                                                setWhatsapp('');
                                                setIsSuccess(false);
                                            }}
                                            className="rounded-full px-6 h-9 font-medium"
                                        >
                                            Fazer Nova Simulação
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={step}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="w-full flex flex-col"
                                    >
                                        {/* Step Tracker Indicator */}
                                        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold mb-6 select-none">
                                            <div className="flex items-center gap-1.5 min-h-[16px]">
                                                {step > 1 && (
                                                    <button 
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="hover:text-foreground flex items-center gap-0.5 transition-colors cursor-pointer"
                                                    >
                                                        <ArrowLeft className="size-3" />
                                                        <span>Voltar</span>
                                                    </button>
                                                )}
                                            </div>
                                            <span>Passo {step} de 4</span>
                                        </div>

                                        {/* Step 1: Categoria */}
                                        {step === 1 && (
                                            <div className="space-y-6">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight text-left">
                                                    Qual plano você deseja simular?
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => selectCategoria('saude')}
                                                        className="border border-border/40 hover:border-primary/60 bg-muted/30 hover:bg-muted/50 p-5 rounded-2xl text-left flex flex-col justify-between transition-all duration-300 cursor-pointer"
                                                    >
                                                        <h4 className="text-sm sm:text-base font-semibold text-foreground">Planos de Saúde</h4>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => selectCategoria('odonto')}
                                                        className="border border-border/40 hover:border-primary/60 bg-muted/30 hover:bg-muted/50 p-5 rounded-2xl text-left flex flex-col justify-between transition-all duration-300 cursor-pointer"
                                                    >
                                                        <h4 className="text-sm sm:text-base font-semibold text-foreground">Planos Odonto</h4>
                                                    </motion.button>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => selectCategoria('ambos')}
                                                    className="w-full border border-border/40 hover:border-primary/60 bg-muted/30 hover:bg-muted/50 p-5 rounded-2xl text-center transition-all duration-300 cursor-pointer"
                                                >
                                                    <h4 className="text-sm sm:text-base font-semibold text-foreground">Quero cotar ambos</h4>
                                                </motion.button>
                                            </div>
                                        )}

                                        {/* Step 2: Perfil de Contratação */}
                                        {step === 2 && (
                                            <div className="space-y-6">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight text-left">
                                                    Tipo de contratação:
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Card A: CPF */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => selectContratacao('individual')}
                                                        className="border border-border/40 hover:border-primary/60 bg-muted/30 hover:bg-muted/50 p-5 rounded-2xl text-left flex flex-col justify-between transition-all duration-300 group cursor-pointer min-h-[130px]"
                                                    >
                                                        <div className="space-y-1.5">
                                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Para você</span>
                                                            <h4 className="text-sm sm:text-base font-semibold text-foreground">
                                                                Para mim ou minha família
                                                            </h4>
                                                        </div>
                                                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal font-light mt-4">
                                                            Contratação via CPF
                                                        </p>
                                                    </motion.button>

                                                    {/* Card B: CNPJ */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => selectContratacao('corporate')}
                                                        className="border border-border/40 hover:border-primary/60 bg-muted/30 hover:bg-muted/50 p-5 rounded-2xl text-left flex flex-col justify-between transition-all duration-300 group relative cursor-pointer min-h-[130px]"
                                                    >
                                                        <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold select-none">
                                                            Mais Econômico
                                                        </span>
                                                        <div className="space-y-1.5">
                                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Para empresas</span>
                                                            <h4 className="text-sm sm:text-base font-semibold text-foreground pr-10">
                                                                Para minha empresa ou MEI
                                                            </h4>
                                                        </div>
                                                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal font-light mt-4">
                                                            Descontos de até 35% com CNPJ
                                                        </p>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Dados dos Integrantes / Empresa */}
                                        {step === 3 && (
                                            <div className="space-y-6 text-left">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                                                    {contratacao === 'corporate' ? 'Perfil da Empresa e Colaboradores' : 'Quem será incluído no plano?'}
                                                </h3>
                                                
                                                {contratacao === 'corporate' ? (
                                                    /* EMPRESA / MEI: Quantidade de colaboradores e média de idade */
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                                <Users className="size-3.5 text-primary" />
                                                                <span>Quantidade de colaboradores / vidas</span>
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                pattern="[0-9]*"
                                                                value={qtdColaboradores}
                                                                onChange={(e) => setQtdColaboradores(e.target.value.replace(/\D/g, ''))}
                                                                placeholder="Digite o total de pessoas (ex: 5)"
                                                                className="w-full px-4 py-3 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                                <Building2 className="size-3.5 text-primary" />
                                                                <span>Média de idade da equipe</span>
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                pattern="[0-9]*"
                                                                value={mediaIdade}
                                                                onChange={(e) => setMediaIdade(e.target.value.replace(/\D/g, ''))}
                                                                placeholder="Digite a média estimada de idade (ex: 32)"
                                                                className="w-full px-4 py-3 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* INDIVIDUAL / FAMÍLIA: Idade titular + dependentes individuais */
                                                    <div className="space-y-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                                Sua idade
                                                            </label>
                                                            <input 
                                                                type="text" 
                                                                pattern="[0-9]*"
                                                                value={idadeTitular}
                                                                onChange={handleAgeChange}
                                                                placeholder="Digite sua idade (ex: 34)"
                                                                className="w-full px-4 py-3 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                            />
                                                        </div>

                                                        {dependants.length > 0 && (
                                                            <div className="space-y-3 pt-2">
                                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                                                    Dependentes
                                                                </span>
                                                                <AnimatePresence>
                                                                    {dependants.map((dep, index) => (
                                                                        <motion.div
                                                                            key={dep.id}
                                                                            initial={{ scale: 0.85, opacity: 0 }}
                                                                            animate={{ scale: 1, opacity: 1 }}
                                                                            exit={{ scale: 0.85, opacity: 0 }}
                                                                            className="flex items-center gap-3"
                                                                        >
                                                                            <input 
                                                                                type="text" 
                                                                                pattern="[0-9]*"
                                                                                value={dep.age}
                                                                                onChange={(e) => handleDepAgeChange(dep.id, e.target.value)}
                                                                                placeholder={`Idade do dependente ${index + 1}`}
                                                                                className="flex-1 px-4 py-2.5 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="icon"
                                                                                onClick={() => removeDependant(dep.id)}
                                                                                className="rounded-xl h-10 w-10 shrink-0"
                                                                            >
                                                                                <Trash2 className="size-4" />
                                                                            </Button>
                                                                        </motion.div>
                                                                    ))}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={addDependant}
                                                            className="w-fit rounded-full px-4 h-9 font-medium text-xs flex items-center gap-1.5"
                                                        >
                                                            <UserPlus className="size-3.5" />
                                                            <span>Adicionar dependente</span>
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Next button */}
                                                <Button
                                                    disabled={contratacao === 'corporate' ? (!qtdColaboradores || !mediaIdade) : !idadeTitular}
                                                    onClick={nextStep}
                                                    className="w-full h-11 rounded-full font-medium text-sm mt-6 shadow-sm cursor-pointer"
                                                >
                                                    Continuar para o resultado
                                                </Button>
                                            </div>
                                        )}

                                        {/* Step 4: Contato & Envio */}
                                        {step === 4 && (
                                            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                                                    Onde enviamos sua cotação?
                                                </h3>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                            Seu Nome
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            value={nome}
                                                            onChange={(e) => setNome(e.target.value)}
                                                            placeholder="Digite seu nome completo"
                                                            className="w-full px-4 py-3 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                            WhatsApp com DDD
                                                        </label>
                                                        <input 
                                                            type="tel" 
                                                            required
                                                            value={whatsapp}
                                                            onChange={handlePhoneChange}
                                                            placeholder="(99) 99999-9999"
                                                            className="w-full px-4 py-3 rounded-xl border border-border/70 focus:border-primary bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting || !nome || whatsapp.length < 14}
                                                    className="w-full h-12 rounded-full font-bold text-base mt-2 shadow-md cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="size-5 animate-spin" />
                                                            <span>Processando tabelas...</span>
                                                        </>
                                                    ) : (
                                                        <span>Ver Preços Agora</span>
                                                    )}
                                                </Button>

                                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/80 font-medium select-none mt-2">
                                                    <ShieldCheck className="size-3.5 text-primary shrink-0" />
                                                    <span>Seus dados estão protegidos pela LGPD. Não enviamos spam.</span>
                                                </div>
                                            </form>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default SectionFive;