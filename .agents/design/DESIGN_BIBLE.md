# 📐 Venancor CRM — Design Bible

> **Regras obrigatórias.** Todo novo componente, rota ou ajuste de UI deve seguir este documento sem exceção.
> Referência viva — atualize quando o design system evoluir.

---

## 1. Paleta de Cores

### Primária (Brand)
| Token | Valor | Uso |
|-------|-------|-----|
| `brand` | `#3b2dff` | CTAs, botões primários, links ativos, focos |
| `brand-hover` | `#2d20e0` | Hover de brand |
| `brand-subtle` | `#3b2dff/8` | Fundos de badge ativo, anel de foco |
| `brand-ring` | `focus:ring-[#3b2dff]/10` | Ring de foco em inputs |

### Neutros (Superfície)
| Token | Valor | Uso |
|-------|-------|-----|
| `surface-page` | `bg-white` | Fundo da página inteira |
| `surface-card` | `bg-[#f8f9fa73]/40` | Cards, painéis secundários, blocos de seção |
| `surface-card-hover` | `bg-[#f8f9fa73]/60` | Hover de card |
| `surface-white` | `bg-white` | Cards internos aninhados (dentro de surface-card) |

### Bordas
| Token | Valor | Uso |
|-------|-------|-----|
| `border-default` | `border-slate-100` | Borda padrão de cards e painéis |
| `border-subtle` | `border-slate-200/60` | Borda muito suave, separadores |
| `border-input` | `border-slate-200` | Borda padrão de inputs |
| `border-active` | `border-[#3b2dff]` | Borda de item ativo/selecionado |

### Texto
| Token | Valor | Uso |
|-------|-------|-----|
| `text-primary` | `text-neutral-800` | Títulos e valores de destaque |
| `text-secondary` | `text-neutral-500` | Corpo, descrições |
| `text-muted` | `text-neutral-400` | Labels, metadados, placeholders |
| `text-ultra-muted` | `text-neutral-400 uppercase tracking-widest` | Labels de categorias/tabelas |
| `text-brand` | `text-[#3b2dff]` | Links e labels de destaque |

---

## 2. Tipografia

### Hierarquia de Peso (OBRIGATÓRIA)

```
font-semibold   → Títulos de seção, nomes de registros, valores de destaque
font-medium     → Labels de tabela, subtítulos, labels de input, metadados
font-normal     → Corpo de texto, descrições, valores de campos, placeholders
```

> NUNCA USE font-extrabold ou font-black em texto de UI, labels ou dados.
> Reserve font-semibold apenas para: nome de registro ativo, valor métrico, título de card.

### Escalas de Tamanho

| Contexto | Classe |
|----------|--------|
| Título de rota (h2) | `text-base lg:text-lg font-bold text-neutral-800 tracking-tight` |
| Subtítulo de rota | `text-[11px] lg:text-xs font-normal text-neutral-400` |
| Título de card/seção | `text-sm font-semibold text-neutral-700` |
| Label de tabela/categoria | `text-[9px] font-medium text-neutral-400 uppercase tracking-widest` |
| Label de input | `text-[9px] font-medium uppercase tracking-wider text-slate-400` |
| Valor métrico grande | `text-2xl font-semibold text-neutral-800 tracking-tight` |
| Corpo / texto de dados | `text-xs font-normal text-neutral-700` |
| Metadado / timestamp | `text-[9px] font-normal text-neutral-400` |

---

## 3. Componentes Canônicos

### 3.1 — Card de Seção (Surface Card)
```tsx
<div className="bg-[#f8f9fa73]/40 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-5 shadow-none">
  {/* conteúdo */}
</div>
```
- rounded-3xl sempre
- shadow-none — sem sombra pesada
- border-slate-100 para bordas de primeiro nível

### 3.2 — Card Interno (Nested White Card)
```tsx
<div className="bg-white rounded-2xl p-4 border border-slate-100/50 shadow-[0_1px_4px_rgba(0,0,0,0.005)]">
  {/* conteúdo aninhado dentro de surface-card */}
</div>
```

### 3.3 — Botão Primário (CTA)
```tsx
<Button className="bg-[#3b2dff] hover:bg-[#2d20e0] text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-none transition-all active:scale-[0.98] cursor-pointer border-transparent h-9">
  Ação Principal
</Button>
```

### 3.4 — Botão Outline / Secundário
```tsx
<Button variant="outline" className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 cursor-pointer transition-colors shadow-none">
  Ação Secundária
</Button>
```

### 3.5 — Pill de Filtro / Ordenação (PADRÃO OBRIGATÓRIO)
```tsx
{/* Label */}
<span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest shrink-0">
  Ordenar:
</span>

{/* Botão Ativo */}
<button className="px-3 py-1.5 rounded-lg border text-[10px] cursor-pointer transition-all bg-[#3b2dff] text-white border-[#3b2dff] font-semibold">
  Mais Recente
</button>

{/* Botão Inativo */}
<button className="px-3 py-1.5 rounded-lg border text-[10px] cursor-pointer transition-all border-neutral-200 text-neutral-500 hover:border-neutral-300 font-normal">
  Nome A-Z
</button>
```
REGRA: px-3 py-1.5 text-[10px] — nunca menor que isso.
Ativo: fundo brand + texto white. Inativo: borda slate, texto neutral-500.

### 3.6 — Badge de Status
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
  <span className="size-1.5 rounded-full bg-emerald-500" />
  Concluída
</span>
```
Paleta:
- Online/Concluído: bg-emerald-50 text-emerald-700 border-emerald-200
- Aguardando: bg-violet-50 text-violet-700 border-violet-200
- Negociando: bg-blue-50 text-blue-700 border-blue-200
- Proposta: bg-amber-50 text-amber-700 border-amber-200
- Inativo: bg-neutral-50 text-neutral-600 border-neutral-200

### 3.7 — Input de Formulário
```tsx
<div className="space-y-1 text-left">
  <label className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
    Nome do Campo
  </label>
  <input
    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900
      focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10
      outline-none text-xs font-normal placeholder:text-slate-400
      transition-all duration-200 shadow-none h-8.5"
  />
</div>
```
REGRA: h-8.5, font-normal no valor, foco suave (ring-1 não ring-4).

### 3.8 — Select / Dropdown
```tsx
<div className="relative">
  <select className="w-full pl-3.5 pr-8 py-1 rounded-xl border border-slate-200 bg-white
    text-slate-900 outline-none text-xs font-normal appearance-none cursor-pointer
    focus:border-[#3b2dff]/30 focus:ring-1 focus:ring-[#3b2dff]/10 shadow-none h-8.5">
    <option>Opção</option>
  </select>
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
</div>
```

### 3.9 — Cabeçalho de Tabela
```tsx
<th className="text-left px-5 py-3 text-[9px] font-medium text-neutral-400 uppercase tracking-widest whitespace-nowrap">
  Coluna
</th>
```

### 3.10 — Modal / Drawer
```tsx
<div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 w-full max-w-md shadow-lg space-y-5">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="text-base font-semibold text-neutral-800 tracking-tight">Título</h3>
      <p className="text-[10px] text-neutral-400 font-normal mt-1">Descrição</p>
    </div>
    <button className="p-1.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-neutral-600">
      {/* X icon */}
    </button>
  </div>
</div>
```

### 3.11 — Mini Gráficos (Sparklines SVG)
```tsx
{/* Area Chart */}
<svg viewBox="0 0 100 30" className="w-full h-full text-[#3b2dff]" preserveAspectRatio="none">
  <defs>
    <linearGradient id="gradient-id" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
      <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"/>
    </linearGradient>
  </defs>
  <path d="..." fill="url(#gradient-id)" />
  <path d="..." fill="none" stroke="currentColor" strokeWidth="2" />
</svg>
```

---

## 4. Layout

### Página
```tsx
<div className="p-6 lg:p-8 space-y-6 select-none text-left bg-white">
```
- Padding: p-6 lg:p-8
- Gap vertical: space-y-6
- Fundo: bg-white

### Grid de Bento (Dashboard)
```
grid grid-cols-1 lg:grid-cols-3 gap-6
  lg:col-span-2 → cards de métricas (2/3)
  lg:col-span-1 → painel lateral (1/3)
```

### Sidebar + Conteúdo
```
grid lg:grid-cols-12 gap-6
  lg:col-span-5 → sidebar/lista
  lg:col-span-7 → área de detalhe
```

---

## 5. Sombras

| Uso | Classe |
|-----|--------|
| Cards de superfície | `shadow-none` |
| Cards nested elevados | `shadow-[0_1px_4px_rgba(0,0,0,0.005)]` |
| Modais | `shadow-lg` |
| Inputs / Botões | `shadow-none` |

NUNCA USE shadow-xl, shadow-2xl, drop-shadow em UI cotidiana.

---

## 6. Border Radius

| Componente | Radius |
|------------|--------|
| Cards de página / seção | `rounded-3xl` |
| Cards internos / nested | `rounded-2xl` |
| Botões de ação (CTA) | `rounded-2xl` |
| Pills de filtro/ordenação | `rounded-lg` |
| Inputs e selects | `rounded-xl` |
| Badges de status | `rounded-full` |
| Avatares de pessoa | `rounded-full` |
| Avatares de logo/marca | `rounded-xl` |

---

## 7. Animações

```tsx
{/* Entrada de página / tab */}
initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
transition={{ duration: 0.15 }}

{/* Entrada de item em lista */}
initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.18, delay: index * 0.02 }}

{/* Modal */}
initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 300, damping: 25 }}
```
- Sempre envolva em AnimatePresence mode="wait"
- duration máximo: 0.25
- Botões: active:scale-[0.98] transition-all

---

## 8. Scroll (CRÍTICO)

NUNCA: element.scrollIntoView() — rola o window inteiro
SEMPRE: container.scrollTop = container.scrollHeight

```tsx
// Correto
containerRef.current.scrollTop = containerRef.current.scrollHeight;
```

---

## 9. Checklist Obrigatório (Todo PR de UI)

- [ ] Nenhum font-extrabold ou font-black em labels/dados
- [ ] Títulos de rota: text-base lg:text-lg font-bold text-neutral-800
- [ ] Cards de seção: bg-[#f8f9fa73]/40 border-slate-100 rounded-3xl shadow-none
- [ ] Inputs: h-8.5, font-normal, focus ring-1 suave
- [ ] Pills: px-3 py-1.5 text-[10px] no mínimo
- [ ] CTAs: rounded-2xl font-semibold shadow-none
- [ ] Scroll interno: scrollTop = scrollHeight (nunca scrollIntoView)
- [ ] npx tsc --noEmit --skipLibCheck passa sem erros
- [ ] Animações com duration <= 0.2

---

## 10. Anti-Padrões Proibidos

| Proibido | Use |
|----------|-----|
| font-extrabold em labels | font-medium |
| font-black em texto UI | font-semibold (destaque) / font-normal (dado) |
| text-neutral-900 em dados | text-neutral-800 ou text-neutral-700 |
| shadow-xl em cards | shadow-none |
| scrollIntoView em containers | scrollTop = scrollHeight |
| px-2 py-0.5 text-[8px] em pills | px-3 py-1.5 text-[10px] |
| focus:ring-4 agressivo | focus:ring-1 ring-[#3b2dff]/10 |
| dark:bg-white hardcoded | Remover — CRM é light mode only |
| hover:border-[#3b2dff] em pill inativo | hover:border-neutral-300 neutro |

---

## 11. Referência de Arquivos Canônicos

| Arquivo | Papel |
|---------|-------|
| app/crm/resume/page.tsx | REFERÊNCIA PRINCIPAL — tipografia, bento, sparklines |
| app/crm/clients/page.tsx | Pills, tabelas, badges, paginação |
| app/crm/corretores/page.tsx | Modal, tabela de equipe, stat cards |
| app/crm/planos/page.tsx | Sub-tabs, formulários, seletor |
| app/crm/chat/page.tsx | Chat, scroll, bubbles |
| app/crm/layout.tsx | Sidebar, navegação global |

---

Última atualização: 2026-07-10 — Venancor CRM Design Bible v1.0
