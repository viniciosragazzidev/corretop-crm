'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Hospital, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SplitText from '@/components/split-text';

export default function AmepVideoDemo() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <section className="w-full py-16 sm:py-24 bg-muted/20 border-b border-border/40 font-sans select-none">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary dark:text-primary text-xs font-semibold tracking-wide">
                        <Hospital className="size-3.5" />
                        <span>Conheça as Instalações do Plano Amep</span>
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
                        Hospital Prontonil & Atendimento Amep Saúde em Nova Iguaçu
                    </SplitText>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl font-light leading-relaxed">
                        Veja na prática a estrutura de atendimento médico de urgência e consultas do plano Amep Saúde.
                    </p>
                </div>

                {/* Video Preview Card with Spatial Depth */}
                <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => setIsVideoOpen(true)}
                    className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-border/80 shadow-2xl cursor-pointer group bg-slate-950"
                >
                    <Image 
                        src="/video_bg.jpg" 
                        alt="Apresentação Amep Saúde Nova Iguaçu" 
                        fill 
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="size-16 sm:size-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-4 ring-primary/30">
                            <Play className="size-8 sm:size-10 fill-white ml-1" />
                        </div>
                        <div className="text-center space-y-1">
                            <span className="text-white text-base sm:text-xl font-bold block drop-shadow-md">
                                Assista ao Vídeo de Apresentação Amep Saúde
                            </span>
                            <span className="text-primary text-xs sm:text-sm font-medium block">
                                Conheça a rede própria e os hospitais em Nova Iguaçu
                            </span>
                        </div>
                    </div>

                    {/* Bottom Bar Badges */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                            <ShieldCheck className="size-4 text-primary" />
                            <span>Atendimento Adulto & Pediátrico</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                            <CheckCircle2 className="size-4 text-primary" />
                            <span>Registro ANS nº 413330</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Video Modal Trigger */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer backdrop-blur-md"
                            >
                                <X className="size-6" />
                            </button>
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube-nocookie.com/embed/BquV_PV8upw?autoplay=1"
                                title="Apresentação Amep Saúde Nova Iguaçu"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
