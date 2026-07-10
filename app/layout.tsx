import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { DemoModeProvider } from "@/lib/demo-mode";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const amilFont = localFont({
  src: "../public/fonts/Amil Typeface Bold.ttf",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://meucrm.com.br'),
  title: {
    default: 'Corretop | CRM SaaS para Corretores de Seguros',
    template: '%s | Corretop'
  },
  description: 'O CRM definitivo para corretores de seguros. Gerencie clientes, propostas, planos e otimize suas vendas.',
  keywords: [
    'CRM corretor de seguros',
    'Corretop CRM',
    'CRM de planos de saúde',
    'Gestão de clientes corretores',
    'Software para corretores',
    'Plano de saúde PME MEI'
  ],
  authors: [{ name: 'Corretop' }],
  creator: 'Corretop',
  publisher: 'Corretop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://meucrm.com.br',
  },
  openGraph: {
    title: 'Corretop | CRM SaaS para Corretores de Seguros',
    description: 'O CRM definitivo para corretores de seguros. Gerencie clientes, propostas, planos e otimize suas vendas.',
    url: 'https://meucrm.com.br',
    siteName: 'Corretop',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corretop | CRM SaaS para Corretores de Seguros',
    description: 'O CRM definitivo para corretores de seguros. Gerencie clientes, propostas, planos e otimize suas vendas.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${amilFont.variable} ${plusJakartaSans.className}`}>
      <body className="antialiased">
        <DemoModeProvider>
          {children}
        </DemoModeProvider>
        <Toaster closeButton position="top-right" richColors />
      </body>
    </html>
  );
}
