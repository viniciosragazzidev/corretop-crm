'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock data exactly matching the screenshot
const initialProducts = [
  { id: '1', name: 'Air Jordan 1 Retro High OG', price: '$121,65', sales: '217 pcs', stock: 120, status: 'In Stock', revenue: '$921.90', date: 'Oct 21, 2025', checked: false },
  { id: '2', name: 'Air Jordan 1 Low', price: '$314,15', sales: '297 pcs', stock: 2, status: 'Restock', revenue: '$1,800.90', date: 'Jul 21, 2025', checked: true },
  { id: '3', name: 'Air Jordan 1 mid SE', price: '$275,65', sales: '107 pcs', stock: 41, status: 'In Stock', revenue: '$1,211.90', date: 'Aug 21, 2025', checked: false },
  { id: '4', name: 'Air Jordan 1 Retro High OG \'UNC\'', price: '$176,65', sales: '227 pcs', stock: 27, status: 'Out of Stock', revenue: '$2,871.90', date: 'Sep 11, 2025', checked: false },
  { id: '5', name: 'Air Jordan 1 Retro High OG', price: '$321,15', sales: '147 pcs', stock: 1, status: 'In Stock', revenue: '$911.90', date: 'Sep 15, 2025', checked: false },
  { id: '6', name: 'Air Jordan 4 RM', price: '$241,45', sales: '447 pcs', stock: 0, status: 'Restock', revenue: '$4,811.90', date: 'Sep 22, 2025', checked: false },
  { id: '7', name: 'Jordan Trunner LX', price: '$321,25', sales: '403 pcs', stock: 19, status: 'Out of Stock', revenue: '$511.90', date: 'Sep 25, 2025', checked: true },
  { id: '8', name: 'Jordan DAY1 EO', price: '$210,43', sales: '259 pcs', stock: 21, status: 'In Stock', revenue: '$981.90', date: 'Sep 27, 2025', checked: false },
  { id: '9', name: 'Air Jordan 1 Mid', price: '$250,95', sales: '156 pcs', stock: 15, status: 'Out of Stock', revenue: '$1,711.90', date: 'Sep 28, 2025', checked: false },
  { id: '10', name: 'Nike SB x Air Jordan 4', price: '$280,99', sales: '714 pcs', stock: 7, status: 'Restock', revenue: '$1,243.90', date: 'Oct 21, 2025', checked: false }
];

export default function ResumePage() {
  const [products, setProducts] = useState(initialProducts);
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [searchVal, setSearchVal] = useState('');

  const subTabs = ['Overview', 'Table', 'List view', 'Segment', 'Custom'];

  const metrics = [
    { label: 'Total Product', value: '275', delta: '+10%' },
    { label: 'Active Company', value: '25', delta: '+10%' },
    { label: 'Produk Revenue', value: '$15,235', delta: '+10%' },
    { label: 'Members', value: '1,500', delta: '+10%' }
  ];

  const handleCheckboxToggle = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-purple-50 text-purple-650';
      case 'Restock': return 'bg-amber-50 text-amber-650';
      case 'Out of Stock': return 'bg-rose-50 text-rose-550';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 select-none text-left flex flex-col h-full bg-[#f8fafc]">
      
      {/* 1. Sub-navigation tabs */}
      <div className="flex border-b border-slate-200/60 pb-1.5 w-full gap-5">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="subTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Metric Cards Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between shadow-3xs relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">{card.value}</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>Vs Last Month</span>
                <span className="text-emerald-500 font-bold">▲ {card.delta}</span>
              </div>
            </div>
            {/* Options vertical three dots */}
            <button className="absolute right-4 top-4 text-slate-350 hover:text-slate-600 cursor-pointer">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        ))}
      </section>

      {/* 3. Filter and Controls bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200/50 shadow-3xs">
        {/* Left Side: Filter button + Active pills */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800 text-xs font-bold bg-white cursor-pointer shadow-3xs transition-colors">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
            <span>Filters</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600">
            <span>All Product</span>
            <button className="hover:text-slate-800 cursor-pointer">×</button>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600">
            <svg className="size-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
            <span>Company</span>
            <button className="hover:text-slate-800 cursor-pointer">×</button>
          </span>
        </div>

        {/* Right Side: Search & Toggler list/grid */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-4 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#3b2dff] text-xs font-semibold outline-none shadow-3xs"
            />
            <svg className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>

          {/* Toggle button */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0">
            <button className="px-2.5 py-1 rounded-lg bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              <span>List</span>
            </button>
            <button className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Products Data Table */}
      <div className="w-full overflow-x-auto border border-slate-200/50 rounded-2xl bg-white shadow-3xs">
        <table className="w-full border-collapse text-left text-xs font-bold text-slate-700 min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400">
              <th className="py-3 px-4 w-10">
                <input type="checkbox" className="accent-slate-900 scale-105 cursor-pointer" readOnly />
              </th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Product</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Price</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Sales</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Stock</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Status</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Revenue</th>
              <th className="py-3 px-4 font-extrabold uppercase tracking-wider text-[9px]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${p.checked ? 'bg-slate-50/30' : ''}`}>
                <td className="py-3.5 px-4">
                  <input
                    type="checkbox"
                    checked={p.checked}
                    onChange={() => handleCheckboxToggle(p.id)}
                    className="accent-slate-900 scale-105 cursor-pointer"
                  />
                </td>
                <td className={`py-3.5 px-4 ${p.checked ? 'text-slate-950 font-black' : 'text-slate-800'}`}>
                  {p.name}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{p.price}</td>
                <td className="py-3.5 px-4 text-slate-500">{p.sales}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{p.stock}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-transparent ${getStatusStyle(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700">{p.revenue}</td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Footer pagination controls */}
      <div className="flex justify-center items-center gap-2 pt-2 select-none text-[10px] font-black uppercase tracking-wider text-slate-400 pb-4">
        <button className="px-3 py-1.5 rounded-lg hover:text-slate-850 cursor-pointer">
          &lt; Prev
        </button>
        <button className="size-6 rounded-full bg-slate-950 text-white flex items-center justify-center font-black">
          1
        </button>
        <button className="size-6 rounded-full hover:bg-slate-100 hover:text-slate-850 flex items-center justify-center cursor-pointer">
          2
        </button>
        <button className="size-6 rounded-full hover:bg-slate-100 hover:text-slate-850 flex items-center justify-center cursor-pointer">
          3
        </button>
        <span className="px-1 text-slate-300">...</span>
        <button className="size-6 rounded-full hover:bg-slate-100 hover:text-slate-850 flex items-center justify-center cursor-pointer">
          12
        </button>
        <button className="px-3 py-1.5 rounded-lg hover:text-slate-850 cursor-pointer">
          Next &gt;
        </button>
      </div>

    </div>
  );
}
