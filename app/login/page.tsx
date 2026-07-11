'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CRMLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const toastId = toast.loading('Validando suas credenciais...');

    try {
      await signIn.email({
        email,
        password,
      }, {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success('Login realizado com sucesso.', {
            id: toastId,
            description: 'Você será direcionado ao painel CRM.',
          });
          router.replace('/resume');
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error('Não foi possível entrar.', {
            id: toastId,
            description: ctx.error.status === 403
              ? 'Sua conta não está autorizada para este acesso.'
              : 'Verifique seu e-mail e senha e tente novamente.',
          });
          setError(ctx.error.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
        }
      });
    } catch (err: any) {
      setIsLoading(false);
      toast.error('Não foi possível conectar ao serviço de login.', {
        id: toastId,
        description: 'Tente novamente em instantes.',
      });
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src="/logo.svg" alt="Corretop" className="h-10 mx-auto" />
          </div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
            Painel CRM
          </h1>
          <p className="text-xs font-normal text-neutral-400 mt-0.5">
            Entre com suas credenciais de acesso
          </p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@venacorseguros.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal outline-none transition-all placeholder:text-neutral-400 h-8.5"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal outline-none transition-all placeholder:text-neutral-400 h-8.5"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-all cursor-pointer select-none active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin size-4 text-neutral-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Acessar Painel</span>
              )}
            </button>
          </form>
        </motion.div>

        <div className="text-center mt-6">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Exclusivo para administradores e corretores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}

