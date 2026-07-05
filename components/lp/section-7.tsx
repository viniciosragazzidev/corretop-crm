'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/split-text';

const ctaContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.25
        }
    }
};

const ctaItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const
    }
};

const SectionSeven: React.FC = () => {
    return (
        <section className="w-full bg-background py-16 md:py-24 font-sans flex flex-col items-center justify-center">
            <div className="w-full max-w-[1200px] mx-auto px-6">
                
                {/* Wrapped CTA Container in Light Soft Design */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-gradient-to-tr from-muted/40 via-background to-muted/20 border border-border/40 rounded-[2rem] md:rounded-[3rem] py-16 px-6 md:px-12 text-center relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col items-center"
                >
                    {/* Visual glowing backing accent inside card */}
                    <div className="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px]" />
                    </div>

                    {/* Staggered Content Container */}
                    <motion.div 
                        variants={ctaContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="relative z-10 max-w-2xl flex flex-col items-center space-y-6"
                    >
                        
                        {/* Microtag */}
                        <motion.div 
                            variants={ctaItemVariants}
                            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground select-none"
                        >
                            <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            <span>Solicite Seu Estudo</span>
                        </motion.div>

                        {/* Headline with SplitText */}
                        <motion.div variants={ctaItemVariants} className="w-full">
                            <SplitText
                                tag="h2"
                                className="text-2xl sm:text-4xl font-medium tracking-tight text-foreground leading-tight"
                                delay={20}
                            >
                                Garanta o plano ideal hoje mesmo.
                            </SplitText>
                        </motion.div>

                        {/* Subheadline */}
                        <motion.p 
                            variants={ctaItemVariants}
                            className="text-muted-foreground text-sm sm:text-base font-light max-w-lg leading-relaxed"
                        >
                            Fale com um especialista agora e descubra a melhor opção para você ou sua empresa.
                        </motion.p>

                        {/* Pulsing CTA Action Button */}
                        <motion.div variants={ctaItemVariants} className="pt-4">
                            <motion.div
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                            >
                                <Button
                                    className="rounded-full px-8 h-12 text-sm sm:text-base font-semibold shadow-md group relative overflow-hidden flex items-center gap-2 cursor-pointer"
                                >
                                    <MessageCircle className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                    <span>Falar no WhatsApp</span>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Friction Reducer */}
                        <motion.div 
                            variants={ctaItemVariants}
                            className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-medium select-none pt-4"
                        >
                            <ShieldCheck className="size-3.5 text-primary shrink-0" />
                            <span>Estudo 100% gratuito e sem compromisso.</span>
                        </motion.div>

                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default SectionSeven;
