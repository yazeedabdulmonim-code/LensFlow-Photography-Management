import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Phone, Mail, MapPin, Briefcase, Plus, MessageSquare, Search } from 'lucide-react';
import { AddCompanyModal } from '../components/modals/AddCompanyModal';

export const CompaniesView = () => {
  const { companies } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in dir-rtl">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-500" />
            إدارة شركات القطاع والتجارية (Companies)
          </h1>
          <p className="text-xs text-slate-500">سجل الشركات والهيئات المتعاقدة لتغطية الفعاليات والمشاريع العقارية والتجارية</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة شركة جديدة</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="بحث باسم الشركة، المسئول، البريد، أو الرقم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent outline-none font-medium"
        />
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">لا توجد شركات مطابقة للبحث</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">يمكنك إضافة شركة جديدة لسجل الشركات لتسهيل إصدار الفواتير والعقود</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
          >
            + إضافة شركة جديدة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(cmp => (
            <div key={cmp.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={cmp.logo} alt={cmp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{cmp.name}</h3>
                    <div className="text-xs text-slate-500">المسؤول: <strong>{cmp.contactPerson}</strong></div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-500" />
                    <span>{cmp.phone}</span>
                  </div>
                  {cmp.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-brand-500" />
                      <span className="font-mono">{cmp.email}</span>
                    </div>
                  )}
                  {cmp.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span className="truncate">{cmp.address}</span>
                    </div>
                  )}
                  {cmp.taxNumber && (
                    <div className="text-[11px] font-mono text-slate-400">الرقم الضريبي: {cmp.taxNumber}</div>
                  )}
                </div>

                {cmp.notes && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300">
                    ملاحظات: {cmp.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {cmp.phone && (
                  <a
                    href={`https://wa.me/${(cmp.phone || '').replace(/[^\d]/g, '').startsWith('05') ? '966' + (cmp.phone || '').replace(/[^\d]/g, '').slice(1) : (cmp.phone || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(`أهلاً شركة ${cmp.name}، بخصوص حجز وتغطية التصوير القادمة ✨`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};
