import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ClipboardCheck, Plus, Trash2 } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose }) => {
  const { projects, team, clients, addTask } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    clientId: '',
    assigneeId: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'Medium',
    notes: '',
    checklist: [
      { id: 'ck-1', title: 'فحص وتجهيز المواد المطلوبة', done: false }
    ],
  });

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, { id: `ck-${Date.now()}`, title: '', done: false }]
    }));
  };

  const handleUpdateChecklistItem = (id, val) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(c => c.id === id ? { ...c, title: val } : c)
    }));
  };

  const handleRemoveChecklistItem = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(c => c.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedProj = projects.find(p => p.id === formData.projectId);
    const selectedAssignee = team.find(t => t.id === formData.assigneeId);

    addTask({
      ...formData,
      projectName: selectedProj ? selectedProj.name : 'عام',
      assigneeName: selectedAssignee ? selectedAssignee.name : 'غير محدد',
      clientId: selectedProj ? selectedProj.clientId : formData.clientId,
      checklist: formData.checklist.filter(c => c.title.trim() !== ''),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden p-6 space-y-4">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-brand-500" />
            إضافة مهمة جديدة للفريق (Create Task)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المهمة *</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: تعديل صور الزفاف ومعالجة الألوان"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المشروع التابع له</label>
              <select 
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              >
                <option value="">-- مهمة عامة بدون مشروع --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الموظف المسؤول *</label>
              <select 
                required
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
              >
                <option value="">-- اختيار الموظف --</option>
                {team.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ البداية</label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">موعد التسليم *</label>
              <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأولوية</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
              >
                <option value="High">عالية جداً</option>
                <option value="Medium">متوسطة</option>
                <option value="Low">منخفضة</option>
              </select>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">قائمة التحقق (Checklist):</label>
              <button 
                type="button" 
                onClick={handleAddChecklistItem}
                className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة عنصر
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {formData.checklist.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={item.title}
                    onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)}
                    placeholder={`عنصر الفرعي ${idx + 1}`}
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف المهمة والملاحظات</label>
            <textarea 
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="اكتب أي توجيهات محددة للموظف..."
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
              حفظ وتعيين المهمة
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
