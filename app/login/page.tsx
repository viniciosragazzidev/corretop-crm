'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <img src="/logo.svg" alt="Corretop" className="h-10 mx-auto" />
          </div>
          <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
            Painel CRM
          </h1>
          <p className="text-xs font-normal text-neutral-400 mt-0.5">
            Entre com suas credenciais de acesso
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-normal flex items-center gap-2"
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <label htmlFor="email" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@venacorseguros.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal outline-none transition-all duration-200 placeholder:text-neutral-400 h-8.5"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <label htmlFor="password" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 text-xs font-normal outline-none transition-all duration-200 placeholder:text-neutral-400 h-8.5"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#3b2dff] hover:bg-[#2d20e0] disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer select-none flex items-center justify-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="animate-spin size-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Entrando...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Acessar Painel
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Exclusivo para administradores e corretores autorizados.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
