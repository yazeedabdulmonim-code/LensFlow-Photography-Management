import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, Save, Upload, Lock, Mail, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const EditMemberModal = ({ isOpen, onClose, member }) => {
  const { setTeam, showToast, userRole } = useApp();

  const isAdminOrManager = userRole === 'Admin' || userRole === 'Manager';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123456',
    phone: '',
    role: 'Photographer',
    specialty: '',
    avatar: '',
    status: 'Active',
    rating: 5.0,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        password: member.password || '123456',
        phone: member.phone || '',
        role: member.role || 'Photographer',
        specialty: member.specialty || '',
        avatar: member.avatar || '',
        status: member.status || 'Active',
        rating: member.rating || 5.0,
      });
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const roleOptions = [
    { role: 'Admin', title: 'مشرف عام (Admin)' },
    { role: 'Manager', title: 'مدير عمليات (Manager)' },
    { role: 'Photographer', title: 'مصور فوتوغرافي' },
    { role: 'Videographer', title: 'مصور فيديو ومخرج' },
    { role: 'Editor', title: 'محرر صور وفيديو' },
    { role: 'Designer', title: 'مصمم جرافيك' },
    { role: 'Assistant', title: 'مساعد استوديو ومعدات' },
    { role: 'Social Media', title: 'مدير شبكات اجتماعية' },
    { role: 'Accountant', title: 'محاسب واستحقاقات' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        showToast('تم تحديث صورة الموظف من الملفات!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTeam(prev => {
      const updated = prev.map(m => {
        if (m.id === member.id) {
          return {
            ...m,
            ...formData,
          };
        }
        return m;
      });
      localStorage.setItem('lensflow_team', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));

      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        try {
          const bc = new BroadcastChannel('lensflow_live_sync_channel');
          bc.postMessage({ type: 'profile_updated', timestamp: Date.now(), userId: member.id });
          bc.close();
        } catch (err) {}
      }

      return updated;
    });

    showToast(`✨ تم تحديث بيانات وصورة الموظف (${formData.name}) وانعكاسها حياً عند الجميع!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in dir-rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-500" />
            تعديل بيانات وحساب الموظف (Edit Staff Account)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <img src={formData.avatar || member.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30 shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <label className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1 text-[11px]">
                <Upload className="w-3 h-3" />
                <span>تغيير صورة الموظف</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني للإشعارات *</label>
              <div className="relative">
                <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور *</label>
              <div className="relative">
                <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-8 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>الدور الوظيفي والصلاحية *</span>
                {!isAdminOrManager && (
                  <span className="text-[10px] text-amber-600 font-normal">للمدير فقط</span>
                )}
              </label>
              <select 
                disabled={!isAdminOrManager}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={`w-full p-2.5 rounded-xl outline-none font-bold ${
                  isAdminOrManager 
                    ? 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700' 
                    : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {roleOptions.map(r => (
                  <option key={r.role} value={r.role}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال *</label>
              <input 
                type="text" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          {!isAdminOrManager && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>تغيير الصلاحيات والأدوار الوظيفية متاح للمدراء والمشرفين فقط.</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التخصص والوصف الوظيفي</label>
            <input 
              type="text" 
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1">
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
