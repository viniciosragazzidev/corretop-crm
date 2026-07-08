'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronRight, Stethoscope, Building2 } from 'lucide-react';

const networkData = [
    {
        id: "centro",
        region: "Centro",
        neighborhoods: "Centro e arredores",
        clinics: [
            "CEGEMERJ CONSULTORIA E SERVICOS MEDICOS",
            "CLINICA DE MEDICINA NUCLEAR VILLELA PEDRAS",
            "ALERGO AR RIO",
            "RIO LABOR MEDICINA DIAGNÓSTICA",
            "UROLOGIC CENTRO DE DIAGNOSTICO E TRATAMENTO",
            "GASTROENDO SERVICOS MEDICOS LTDA",
            "INSTITUTO HERMES PARDINI",
            "RX BANDEIRANTES",
            "URGÊNCIAS OFTALMOLÓGICAS NAÇÕES LTDA",
            "MEMORIAL BONSUCESSO",
            "CARDIOS ERGOS CENTRO CARDIOLÓGICO",
            "HOSPITAL MEMORIAL FUAD CHIDID",
            "FISIO PREST LTDA",
            "HOSPITAL IRAJÁ",
            "CONSULTÓRIO DE FONOAUDIOLOGIA PATRICIA GUERRA",
            "SD SUPORTE DIAGNOSTICO EM OFTALMOLOGIA",
            "FISIOLAR CLIN ATEN MED E FISIOTERAPICO",
            "VITTAMOVI REABILITAÇÃO LTDA",
            "CLINICAS REUNIDAS SAO VICTOR",
            "DIMAGEM DIAGNÓSTICOS POR IMAGEM",
            "THERAPÊUTICA CLÍNICA E ESTUDOS"
        ]
    },
    {
        id: "zonanorte",
        region: "Zona Norte",
        neighborhoods: "Tijuca, Rocha Miranda, Madureira, Meier, Vila da Penha, Cachambi, Engenho da Rainha, Engenho de Dentro, Grajaú, Bonsucesso, Penha, Vila Isabel, Campinho, Taua",
        clinics: [
            "ARB RIO",
            "ALERGO AR",
            "AMEP MADUREIRA",
            "DIALISA SERVIÇOS NEFROLÓGICOS",
            "CLÍNICA DE FISIOTERAPIA",
            "MEDITRAUMA",
            "RIO LABOR MEDICINA DIAGNÓSTICA",
            "HOSPITAL GRAJAÚ",
            "CLÍNICA ENDOSFERA",
            "CLÍNICA SÃO JOÃO",
            "CLINICA DOS OLHOS",
            "OFTALMOCLINICA GRIMOND",
            "DAVITA RIEN SERVIÇOS MÉDICOS NEFROLÓGICOS",
            "RX BANDEIRANTES",
            "CLINICA DO SONO",
            "FISIORADIO DIAGNÓSTICO GERENCIAMENTO"
        ]
    },
    {
        id: "zonaoeste",
        region: "Zona Oeste",
        neighborhoods: "Bangu, Barra da Tijuca, Campo Grande, Freguesia, Praça Seca, Recreio, Santa Cruz, Taquara, Tanque, Vila Valqueire",
        clinics: [
            "HOSPITAL SÃO MATHEUS",
            "REABILITA SAUDE FISIOTERAPIA E TERAPIA",
            "ECOR ECOCARDIOGRAFIA LTDA",
            "GASTROENDO SERVIÇOS MÉDICOS S/C LTDA",
            "RIO LABOR MEDICINA DIAGNÓSTICA",
            "DAVITA SERVIÇOS DE NEFROLOGIA",
            "INSTITUTO HERMES PARDINI S/A",
            "FISIORADIO DIAGNÓSTICO GERENCIAMENTO",
            "RX BANDEIRANTES",
            "AMEP ASSISTÊNCIA MEDICA ESPECIALIZADA",
            "PLANETA FISIOTERAPIA",
            "SOLANGE CRISTINA SERVIÇOS DE FONOAUDIOLOGIA",
            "MEMORIAL CENTRO MÉDICO",
            "FISIOWAY LTDA",
            "HOSPITAL DE CLINICAS",
            "DIMAGEM DIAGNÓSTICO POR IMAGEM",
            "CHAJ – CENTRO HOSPITALAR AMEP JACAREPAGUÁ",
            "CIM - CENTRO INFANTIL MULTITERAPÊUTICO",
            "ASSIM CENTRO MÉDICO"
        ]
    },
    {
        id: "zonasul",
        region: "Zona Sul",
        neighborhoods: "Botafogo, Copacabana, Flamengo, Gávea, Laranjeiras",
        clinics: [
            "CEMOL",
            "CARDIOKIDS CLINICA CARDIOLOGICA INFANTIL",
            "CLINICA SÃO CARLOS",
            "COB - CENTRO ORTOPÉDICO BOTAFOGO",
            "DAVITA RIEN SERVIÇOS MÉDICOS NEFROLÓGICOS",
            "CLINICA DO SONO",
            "INSTITUTO HERMES PARDINI",
            "RIO LABOR MEDICINA DIAGNÓSTICA",
            "NEUROLIFE LABORATÓRIOS",
            "CLINICA DA GÁVEA",
            "CLÍNICA ÊNIO SERRA",
            "CLINICA DOS OLHOS"
        ]
    },
    {
        id: "baixada",
        region: "Baixada Fluminense",
        neighborhoods: "São João de Meriti, Duque de Caxias, Nova Iguaçu, Nilópolis, Belford Roxo",
        clinics: [
            "RIO LABOR MEDICINA DIAGNÓSTICA",
            "DIMAGEM DIAGNÓSTICO POR IMAGEM",
            "INSTITUTO HERMES PARDINI",
            "CTS CENTRO DE TRANSFUSÃO SANGUÍNEA",
            "HOSPITAL SANTA BRANCA",
            "CORPO E MOVIMENTO",
            "DAVITA SERVIÇOS DE NEFROLOGIA",
            "HOSPITAL CLINICO CIRÚRGICO CATARINA",
            "HOSPITAL GERAL PRONTONIL"
        ]
    }
];

export default function AmepAccreditedNetwork() {
    const [activeRegion, setActiveRegion] = useState(networkData[0].id);

    const activeData = networkData.find(d => d.id === activeRegion) || networkData[0];

    return (
        <section className="w-full py-16 sm:py-24 bg-muted/30 border-y border-border/40 font-sans select-none overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        <MapPin className="size-4" />
                        <span>Encontre um local credenciado próximo a você</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight max-w-3xl">
                        Ampla Rede Credenciada
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-light">
                        Hospitais, clínicas e laboratórios de excelência. Selecione a sua região para conferir algumas de nossas unidades e parceiros estratégicos.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar / Tabs */}
                    <div className="lg:w-1/3 flex flex-col gap-2 relative">
                        <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-px bg-border/50 -z-10" />
                        
                        {/* Mobile horizontal scroll container */}
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 snap-x scrollbar-hide">
                            {networkData.map((item) => {
                                const isActive = activeRegion === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveRegion(item.id)}
                                        className={`relative flex-shrink-0 snap-center lg:w-full text-left p-4 rounded-2xl transition-all duration-300 border
                                            ${isActive 
                                                ? 'bg-card border-primary/40 shadow-sm' 
                                                : 'bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeNetworkTab" 
                                                className="absolute inset-0 bg-card rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-border"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        {isActive && (
                                            <div className="hidden lg:block absolute left-[-1.5px] top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r-full z-10" />
                                        )}
                                        
                                        <div className="relative z-10 flex flex-col">
                                            <span className={`font-bold text-base sm:text-lg ${isActive ? 'text-foreground' : ''}`}>
                                                {item.region}
                                            </span>
                                            <span className={`text-[11px] sm:text-xs mt-1 line-clamp-2 ${isActive ? 'text-primary/80' : 'opacity-70'}`}>
                                                {item.neighborhoods}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-2/3 bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeRegion}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex flex-col"
                            >
                                <div className="mb-6 pb-6 border-b border-border/50">
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                                        <Building2 className="text-primary size-6" />
                                        Unidades em destaque: {activeData.region}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2 font-light">
                                        {activeData.neighborhoods}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    {activeData.clinics.map((clinic, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                                            className="flex items-start gap-3 group"
                                        >
                                            <div className="mt-0.5 size-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Stethoscope className="size-3" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug">
                                                {clinic}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground/70 max-w-md text-center sm:text-left leading-relaxed">
                                        **Rede credenciada até 26/04/2025. No portal da operadora AMEP Saúde você encontra a rede completa e suas atualizações.
                                    </p>
                                    <a href="https://www.amepsaude.com.br" target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                                        Acesse o portal oficial
                                        <ChevronRight className="size-3" />
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </section>
    );
}
