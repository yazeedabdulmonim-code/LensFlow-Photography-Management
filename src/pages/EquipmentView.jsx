import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, Plus, Search, Filter, Wrench, CheckCircle2, AlertTriangle, 
  UserCheck, Shield, ChevronLeft, RotateCcw
} from 'lucide-react';

export const EquipmentView = ({ onOpenEquipmentModal }) => {
  const { equipment, team, updateEquipmentStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [checkoutModalEq, setCheckoutModalEq] = useState(null);
  const [assigneeId, setAssigneeId] = useState('');

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || e.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutModalEq) return;

    updateEquipmentStatus(checkoutModalEq.id, 'In Use', assigneeId);
    setCheckoutModalEq(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-6 h-6 text-brand-500" />
            إدارة المعدات والمستودع (Equipment Inventory)
          </h1>
          <p className="text-xs text-slate-500">متابعة الكاميرات، العدسات، الإضاءات، ممتلكات الاستوديو وتسليمها للموظفين</p>
        </div>

        <button
          onClick={onOpenEquipmentModal}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة معدة</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالاسم، الماركة، الرقم التسلسلي..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع الحالات</option>
            <option value="Available">متاحة بالاستوديو</option>
            <option value="In Use">قيد الاستخدام الميداني</option>
            <option value="Reserved">محجوزة لحجز قادم</option>
            <option value="Maintenance">في الصيانة</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع الفئات</option>
            <option value="Camera">كاميرات</option>
            <option value="Lens">عدسات</option>
            <option value="Flash">فلاشات</option>
            <option value="Light">إضاءة مستمرة</option>
            <option value="Drone">درون</option>
            <option value="Gimbal">مانع اهتزاز</option>
            <option value="Microphone">صوتيات</option>
            <option value="Computer">أجهزة مونتاج</option>
          </select>
        </div>
      </div>

      {/* Equipment Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map(item => (
          <div 
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              <div className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.typeName}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      item.status === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      item.status === 'In Use' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      item.status === 'Reserved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {item.status === 'Available' ? 'متاحة' : item.status === 'In Use' ? 'قيد الاستخدام' : item.status === 'Reserved' ? 'محجوزة' : 'صيانة'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">{item.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">S/N: {item.serialNumber}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>الموقع في المستودع:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.storageLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>القيمة المسجلة:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.value.toLocaleString()} ريال</span>
                </div>
                {item.assignedToMemberName && (
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 font-bold text-brand-600 dark:text-brand-400">
                    <span>مستلمة حالياً بواسطة:</span>
                    <span>{item.assignedToMemberName}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              {item.status === 'Available' ? (
                <button
                  onClick={() => {
                    setCheckoutModalEq(item);
                    setAssigneeId(team[0]?.id || '');
                  }}
                  className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>تسليم لموظف</span>
                </button>
              ) : item.status === 'In Use' ? (
                <button
                  onClick={() => updateEquipmentStatus(item.id, 'Available', null)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تأكيد الإرجاع للمستودع</span>
                </button>
              ) : (
                <button
                  onClick={() => updateEquipmentStatus(item.id, 'Available', null)}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  تغيير إلى متاحة
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {checkoutModalEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">تسليم المعدة لموظف</h3>
            <p className="text-xs text-slate-500">المعدة: <strong className="text-brand-600">{checkoutModalEq.name}</strong></p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اختر الموظف المستلم:</label>
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                >
                  {team.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCheckoutModalEq(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">إلغاء</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl">تأكيد التسليم وتسجيل العهدة</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
