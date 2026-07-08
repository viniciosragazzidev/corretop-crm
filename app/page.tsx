import SectionCotacao from '@/components/lp/section-cotacao';
import SectionHero from '@/components/lp/section-hero';
import Navbar from '@/components/navbar';
import React from 'react';

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center px-24">
      <div className="container h-full min-h-screen  ">
        <Navbar />
        <SectionHero />
        <SectionCotacao />
      </div>
    </main>
  );
}
