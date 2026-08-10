import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

export const CompaniesView = () => {
  const { companies, projects, invoices } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-500" />
          إدارة شركات القطاع والتجارية (Companies)
        </h1>
        <p className="text-xs text-slate-500">سجل الشركات والهيئات المتعاقدة لتغطية الفعاليات والمشاريع العقارية والتجارية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map(cmp => (
          <div key={cmp.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img src={cmp.logo} alt={cmp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{cmp.name}</h3>
                <div className="text-xs text-slate-500">المسؤول: {cmp.contactPerson}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                <span>{cmp.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-500" />
                <span>{cmp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="truncate">{cmp.address}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">الرقم الضريبي: {cmp.taxNumber}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
              ملاحظات: {cmp.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
