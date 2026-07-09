'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ChatPage() {
  return (
    <div className="p-8 lg:p-12 min-h-full flex flex-col items-start gap-4 text-left select-none">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 bg-[#3b2dff]/5 text-[#3b2dff] border border-[#3b2dff]/10 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
          Central de Conversas
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Chat</h2>
        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
          Esta é a página de comunicação com os contatos. Em breve você poderá interagir com chats em tempo real nesta seção.
        </p>
      </motion.div>
    </div>
  );
}
