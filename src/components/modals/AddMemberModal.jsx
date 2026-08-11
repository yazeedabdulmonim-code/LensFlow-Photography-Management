import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const AddMemberModal = ({ isOpen, onClose }) => {
  const { setTeam, showToast } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123456',
    phone: '',
    role: 'Photographer',
    specialty: 'مصور فوتوغرافي احترافي',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
  });

  if (!isOpen) return null;

  const roleOptions = [
    { role: 'Admin', title: 'مشرف عام' },
    { role: 'Manager', title: 'مدير عمليات' },
    { role: 'Photographer', title: 'مصور فوتوغرافي' },
    { role: 'Videographer', title: 'مصور فيديو ومخرج' },
    { role: 'Editor', title: 'محرر صور وفيديو' },
    { role: 'Designer', title: 'مصمم جرافيك' },
    { role: 'Assistant', title: 'مساعد استوديو ومعدات' },
    { role: 'Social Media', title: 'مدير شبكات اجتماعية' },
    { role: 'Accountant', title: 'محاسب واستحقاقات' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMember = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      tasksCompleted: 0,
      tasksActive: 0,
      hoursWorked: 0,
      rating: 5.0,
      ...formData,
    };

    setTeam(prev => {
      const newTeam = [newMember, ...prev];
      localStorage.setItem('lensflow_team', JSON.stringify(newTeam));
      window.dispatchEvent(new Event('storage'));
      return newTeam;
    });
    showToast(`تم إنشاء حساب الموظف (${newMember.name}) وإدراج البريد الإلكتروني وكلمة المرور بنجاح!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-500" />
            إنشاء حساب موظف جديد (Add Staff User)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل للموظف *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: خالد العتيبي"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني المخصص *</label>
              <div className="relative">
                <Mail className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="khalid@lensflow.com"
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
                  placeholder="••••••••"
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الدور الوظيفي والصلاحيات *</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
              >
                {roleOptions.map(r => (
                  <option key={r.role} value={r.role}>{r.title} ({r.role})</option>
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
                placeholder="+966 50 000 0000"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التخصص والوصف الدقيق</label>
            <input 
              type="text" 
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="مثال: مصور زفاف وفيديو سينمائي"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رابط الصورة الشخصية (Avatar URL)</label>
            <input 
              type="text" 
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">إنشاء حساب الموظف</button>
          </div>

        </form>

      </div>
    </div>
  );
};
