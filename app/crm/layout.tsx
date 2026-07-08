import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Venancor CRM - Painel de Leads',
  robots: { index: false, follow: false },
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
