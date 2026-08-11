import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, Save, Upload, Image, CheckCircle2 } from 'lucide-react';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, setTeam, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    specialty: currentUser?.specialty || '',
    avatar: currentUser?.avatar || '',
  });

  if (!isOpen || !currentUser) return null;

  // Preset Photography Avatars list for 1-click selection
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  ];

  // Local File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        showToast('تم تحميل الصورة من جهازك بنجاح!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTeam(prev => {
      const updated = prev.map(m => {
        if (m.id === currentUser.id) {
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
          bc.postMessage({ type: 'profile_updated', timestamp: Date.now(), userId: currentUser.id });
          bc.close();
        } catch (err) {}
      }

      return updated;
    });

    showToast('✨ تم حفظ صورة البروفايل والمعلومات وتحديثها لحظياً عند المسؤول والفريق!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-500" />
            تعديل صورة البروفايل والبيانات الشخصية
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* PROFILE IMAGE SECTION */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">الصورة الشخصية الحالية (Profile Picture):</label>
            
            <div className="flex items-center gap-4">
              <img 
                src={formData.avatar || currentUser.avatar} 
                alt="Profile Preview" 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/30 shadow-md shrink-0" 
              />
              
              <div className="space-y-2 flex-1 min-w-0">
                {/* Upload Button */}
                <label className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة جديدة من الجوال / الكومبيوتر</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                </label>

                <div className="text-[10px] text-slate-400">يمكنك رفع صورة JPG, PNG أو اختيار صورة من القائمة بالأسفل</div>
              </div>
            </div>

            {/* Ready Preset Avatars */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[11px] font-bold text-slate-500">أو اختر صورة جاهزة بنقرة واحدة:</div>
              <div className="flex flex-wrap gap-2">
                {presetAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${formData.avatar === url ? 'border-brand-500 ring-2 ring-brand-500/50 scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Name & Role Details */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المسمى والتخصص</label>
            <input 
              type="text" 
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
