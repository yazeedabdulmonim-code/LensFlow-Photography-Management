import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera } from 'lucide-react';

export const EquipmentModal = ({ isOpen, onClose }) => {
  const { addEquipment } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Camera',
    typeName: 'كاميرا',
    brand: '',
    model: '',
    serialNumber: '',
    value: 5000,
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyUntil: new Date(Date.now() + 86400000 * 365 * 2).toISOString().split('T')[0],
    storageLocation: 'المستودع الرئيسي - رف 1',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80',
  });

  if (!isOpen) return null;

  const equipmentTypeOptions = [
    { type: 'Camera', name: 'كاميرا' },
    { type: 'Lens', name: 'عدسة' },
    { type: 'Flash', name: 'فلاش' },
    { type: 'Light', name: 'كشاف إضاءة' },
    { type: 'Tripod', name: 'حامل ثلاثي' },
    { type: 'Gimbal', name: 'مانع اهتزاز' },
    { type: 'Drone', name: 'طائرة درون' },
    { type: 'Microphone', name: 'ميكروفون' },
    { type: 'Recorder', name: 'مسجل صوت' },
    { type: 'Memory Card', name: 'بطاقة ذاكرة' },
    { type: 'Battery', name: 'بطارية' },
    { type: 'Computer', name: 'جهاز محمول' },
    { type: 'Other', name: 'ملحقات أخرى' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const typeObj = equipmentTypeOptions.find(t => t.type === formData.type);
    
    addEquipment({
      ...formData,
      typeName: typeObj ? typeObj.name : 'معدة',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 space-y-4">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-500" />
            إضافة معدة جديدة للمستودع (Add Equipment)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المعدة *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: Canon EOS R5 Body"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نوع المعدة *</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
              >
                {equipmentTypeOptions.map(t => (
                  <option key={t.type} value={t.type}>{t.name} ({t.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الماركة (Brand) *</label>
              <input 
                type="text" 
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="مثال: Canon, Sony, DJI"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الرقم التسلسلي Serial Number *</label>
              <input 
                type="text" 
                required
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="CN-8829104"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">القيمة التقريبية (ريال)</label>
              <input 
                type="number" 
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">مكان التخزين والاستحواذ</label>
            <input 
              type="text" 
              value={formData.storageLocation}
              onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
              placeholder="خزانة A1، رف الإضاءة"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/20"
            >
              إدراج في المستودع
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
