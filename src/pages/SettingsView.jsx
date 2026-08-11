import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, RotateCcw, Shield, Building, Percent, DollarSign, Mail, Send, CheckCircle2, Sparkles, User } from 'lucide-react';

export const SettingsView = () => {
  const { studio, setStudio, team, emailLogs, sendEmailToStaff, resetToSeedData, showToast } = useApp();

  const [formData, setFormData] = useState({ ...studio });
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStudio(formData);
    showToast('تم حفظ إعدادات الاستوديو والبريد الإلكتروني بنجاح!');
  };

  const handleTestEmail = (member) => {
    sendEmailToStaff({
      toEmail: member.email,
      toName: member.name,
      subject: `[تجربة] تنبيه من نظام LensFlow - ${member.role}`,
      body: `مرحباً ${member.name}، هذا إشعار اختباري لتأكيد وصول التنبيهات البريدية لحسابك الرسمي (${member.email}).`,
      type: 'test'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          إعدادات الاستوديو والبريد الإلكتروني (Settings & Email Notifications)
        </h1>
        <p className="text-xs text-slate-500">تعديل بيانات المؤسسة وإدارة إشعارات البريد الإلكتروني الموجهة لكل موظف</p>
      </div>

      {/* Studio Info Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
        
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Building className="w-4 h-4 text-brand-500" />
          بيانات الاستوديو الرئيسية والهوية الضريبية
        </h3>

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

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </div>

      </form>

      {/* STAFF EMAIL NOTIFICATION SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-500" />
              إشعارات البريد الإلكتروني للموظفين (Employee Email Notifications)
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">يتم إرسال إشعار بريدي تلقائي لكل موظف عند إسناد مهمة جديدة أو حجز جديد</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <input 
              type="checkbox" 
              checked={autoEmailEnabled}
              onChange={(e) => setAutoEmailEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300">تفعيل الإشعارات البريدية التلقائية</span>
          </label>
        </div>

        {/* Staff Email Directory List */}
        <div className="space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200">قائمة البريد الإلكتروني للموظفين المعتمدة:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.map(m => (
              <div key={m.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/20" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleTestEmail(m)}
                  className="px-2.5 py-1.5 bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 text-brand-600 dark:text-brand-400 font-bold rounded-xl transition flex items-center gap-1 text-[10px]"
                  title="إرسال إشعار بريدي تجريبي لهذا الموظف"
                >
                  <Send className="w-3 h-3" />
                  <span>تلميح إرسال</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sent Email History Log */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              سجل الرسائل والإشعارات البريدية الكترونية المرسلة حديثاً:
            </span>
            <span className="text-[10px] font-mono text-slate-400">عدد الرسائل: {emailLogs.length}</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {emailLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{log.subject}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {log.status} ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    المستلم: <strong className="text-slate-800 dark:text-slate-200">{log.toName}</strong> ({log.toEmail})
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-1">{log.body}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-400 shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
