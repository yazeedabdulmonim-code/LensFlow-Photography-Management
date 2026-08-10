import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, RotateCcw, Shield, Building, Percent, DollarSign } from 'lucide-react';

export const SettingsView = () => {
  const { studio, setStudio, resetToSeedData, showToast } = useApp();

  const [formData, setFormData] = useState({ ...studio });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStudio(formData);
    showToast('تم حفظ إعدادات الاستوديو بنجاح!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          إعدادات الاستوديو والهوية (Settings & Studio Preferences)
        </h1>
        <p className="text-xs text-slate-500">تعديل بيانات المؤسسة، الهوية الضريبية، والعملات المعاملية</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
        
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الاستوديو / الشركة *</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الشعار التسويقي (Tagline)</label>
          <input 
            type="text" 
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الرقم الضريبي VAT ID *</label>
            <input 
              type="text" 
              required
              value={formData.taxNumber}
              onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نسبة ضريبة القيمة المضافة (%)</label>
            <input 
              type="number" 
              value={formData.vatRate}
              onChange={(e) => setFormData({ ...formData, vatRate: Number(e.target.value) })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال والواتساب</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني الرسمي</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">العنوان الرئيسي</label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={resetToSeedData}
            className="px-4 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold rounded-xl flex items-center gap-1.5 hover:bg-red-100"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط البيانات Seed Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </div>

      </form>
    </div>
  );
};
