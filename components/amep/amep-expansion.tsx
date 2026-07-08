'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Map } from 'lucide-react';
import SplitText from '@/components/split-text';

const cities = [
    { name: 'Rio de Janeiro', highlight: true },
    { name: 'Nova Iguaçu', highlight: true },
    { name: 'Duque de Caxias', highlight: true },
    { name: 'Cabo Frio', highlight: true },
    { name: 'Arraial do Cabo', highlight: false },
    { name: 'São Pedro da Aldeia', highlight: false },
    { name: 'Armação de Búzios', highlight: false },
    { name: 'Niterói', highlight: false },
    { name: 'São Gonçalo', highlight: false },
    { name: 'Belford Roxo', highlight: false },
    { name: 'Nilópolis', highlight: false },
    { name: 'São João de Meriti', highlight: false },
    { name: 'Itaboraí', highlight: false },
    { name: 'Maricá', highlight: false },
    { name: 'Rio das Ostras', highlight: false },
    { name: 'Casimiro de Abreu', highlight: false },
    { name: 'Campos dos Goytacazes', highlight: false },
    { name: 'Petrópolis', highlight: false },
    { name: 'Saquarema', highlight: false },
    { name: 'Rio Bonito', highlight: false },
    { name: 'Iguaba Grande', highlight: false },
];

export default function AmepExpansion() {
    return (
        <section className="w-full py-16 sm:py-24 bg-card border-b border-border/40 font-sans select-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
                <Globe className="w-[600px] h-[600px] text-primary" />
            </div>

            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10">
                
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                    
                    {/* Text Column */}
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
                            <Map className="size-4" />
                            <span>A Força Fluminense</span>
                        </div>

                        <SplitText
                            tag="h2"
                            textAlign="left"
                            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight max-w-xl mx-auto lg:mx-0"
                            delay={10}
                            duration={0.8}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 20 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                        >
                            Projeto de Expansão: Presente em <span className="text-primary">21 Cidades</span>.
                        </SplitText>

                        <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Sua rotina tem vista para o paraíso? Sua saúde também precisa estar à altura. Seja na <strong className="text-foreground font-medium">Região dos Lagos</strong> ou no <strong className="text-foreground font-medium">Grande Rio</strong>, viver bem também é se cuidar com a excelência da Amep Saúde.
                        </p>
                    </div>

                    {/* Grid Column */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-3xl -z-10" />
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 sm:p-8 bg-background/50 border border-border/50 rounded-3xl backdrop-blur-sm shadow-sm">
                            {cities.map((city, idx) => (
                                <motion.div
                                    key={city.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-colors
                                        ${city.highlight 
                                            ? 'bg-primary text-primary-foreground font-bold shadow-md' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground font-medium'
                                        }`}
                                >
                                    <MapPin className={`size-3.5 shrink-0 ${city.highlight ? 'text-primary-foreground/80' : 'text-primary/60'}`} />
                                    <span className="truncate leading-tight">{city.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
