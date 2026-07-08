import type { Metadata } from 'next';
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import SectionHero from '@/components/amep/section-hero';
import SectionDiferenciais from '@/components/amep/section-diferenciais';
import SectionVideo from '@/components/amep/section-video';
import SectionExpansao from '@/components/amep/section-expansao';
import SectionRede from '@/components/amep/section-rede';
import SectionPrecos from '@/components/amep/section-precos';
import SectionDepoimentos from '@/components/amep/section-depoimentos';
import SectionCta from '@/components/amep/section-cta';
import SectionSimulador from '@/components/amep/section-simulador';
import SectionCoberturas from '@/components/amep/section-coberturas';

export const metadata: Metadata = {
  title: 'Plano Amep Saúde — Venancor Corretora | Tabelas Ambulatoriais a partir de R$ 82,94',
  description: 'Consulte a tabela oficial de preços, carências e hospitais credenciados do plano Amep Saúde. Simulação rápida e consultoria isenta na Baixada Fluminense.',
};

export default function AmepPage() {
  return (
    <main className="flex flex-col items-center justify-center px-24">
      <div className="container h-full min-h-screen">
        <Navbar />
        <SectionHero />
        <SectionDiferenciais />
        <SectionVideo />
        <SectionExpansao />
        <SectionRede />
        <SectionPrecos />
        <SectionDepoimentos />
        <SectionCta variant="middle" />
        <SectionSimulador />
        <SectionCoberturas />
        <SectionCta variant="bottom" />
        <Footer />
      </div>
    </main>
  );
}
