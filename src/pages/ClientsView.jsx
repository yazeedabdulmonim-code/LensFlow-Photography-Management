import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, Search, Building, Phone, Mail, Receipt, ExternalLink } from 'lucide-react';

export const ClientsView = ({ setActiveTab }) => {
  const { clients } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" />
            إدارة العملاء (Clients Directory)
          </h1>
          <p className="text-xs text-slate-500">سجل العملاء الأفراد والشركات والتفاصيل المالية المستحقة</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو الجوال..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(c => (
          <div key={c.id} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">{c.type === 'Company' ? 'شركة' : 'فرد'}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{c.name}</h3>
                {c.companyName && <div className="text-xs text-slate-500">{c.companyName}</div>}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>الجوال: <strong className="text-slate-800 dark:text-slate-200">{c.phone}</strong></div>
              <div>البريد: <strong className="text-slate-800 dark:text-slate-200">{c.email}</strong></div>
              {c.taxNumber && <div>الرقم الضريبي: <strong className="font-mono">{c.taxNumber}</strong></div>}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs flex justify-between">
              <div>
                <div className="text-[10px] text-slate-400">إجمالي التعاملات:</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">{c.totalSpent.toLocaleString()} ريال</div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400">المستحق:</div>
                <div className="font-bold text-red-600 font-mono">{c.outstandingAmount.toLocaleString()} ريال</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('statements')}
              className="w-full py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>عرض كشف الحساب</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
