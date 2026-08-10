import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, ChevronRight, ChevronLeft, Plus, Clock, MapPin, 
  ShieldAlert, Eye, User, Camera, CheckCircle2
} from 'lucide-react';

export const CalendarView = ({ onOpenBookingModal }) => {
  const { bookings, team, equipment, checkClash } = useApp();

  const [currentView, setCurrentView] = useState('Month'); // Month | Week | Day | Agenda
  const [selectedDate, setSelectedDate] = useState(new Date('2026-08-12'));
  const [activeBookingModal, setActiveBookingModal] = useState(null);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthName = selectedDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });

  // Generate Month Days Grid (35 cells)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarGridDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGridDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGridDays.push(new Date(year, month, day));
  }

  // Get color by service type
  const getEventBadgeStyle = (serviceType) => {
    switch (serviceType) {
      case 'Wedding': return 'bg-emerald-500 text-white';
      case 'Real Estate': return 'bg-purple-500 text-white';
      case 'Product': return 'bg-amber-500 text-white';
      case 'Portrait': return 'bg-pink-500 text-white';
      case 'Conference': return 'bg-blue-500 text-white';
      default: return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-500" />
            التقويم التفاعلي (Interactive Calendar)
          </h1>
          <p className="text-xs text-slate-500">استعرض مواعيد التصوير، الجلسات الميدانية، وتفادي تعارض الأطقم</p>
        </div>

        <div className="flex items-center gap-2">
          
          {/* View Toggles */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1 text-xs font-bold">
            {['Month', 'Week', 'Day', 'Agenda'].map(v => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`px-3 py-1.5 rounded-lg transition ${currentView === v ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {v === 'Month' ? 'الشهر' : v === 'Week' ? 'الأسبوع' : v === 'Day' ? 'اليوم' : 'جدول الأعمال'}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenBookingModal}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>+ حجز جديد</span>
          </button>
        </div>
      </div>

      {/* Month Navigator Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="text-base font-black text-slate-900 dark:text-slate-100 min-w-36 text-center">
            {monthName}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> زفاف</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> عقارات</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> منتجات</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> مؤتمرات</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> بورتريه</span>
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {currentView === 'Month' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-xs font-bold text-slate-500 py-3">
            <div>الأحد</div>
            <div>الإثنين</div>
            <div>الثلاثاء</div>
            <div>الأربعاء</div>
            <div>الخميس</div>
            <div>الجمعة</div>
            <div>السبت</div>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-x-reverse divide-slate-100 dark:divide-slate-800/60 text-xs min-h-[500px]">
            {calendarGridDays.map((dateObj, idx) => {
              if (!dateObj) return <div key={idx} className="bg-slate-50/40 dark:bg-slate-950/20 p-2 min-h-24"></div>;

              const dateStr = dateObj.toISOString().split('T')[0];
              const dayBookings = bookings.filter(b => b.date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div key={idx} className={`p-2 min-h-24 space-y-1.5 transition ${isToday ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      isToday ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dateObj.getDate()}
                    </span>
                    {dayBookings.length > 0 && <span className="text-[10px] text-slate-400 font-mono">({dayBookings.length})</span>}
                  </div>

                  {/* Booking Badges */}
                  <div className="space-y-1">
                    {dayBookings.map(bk => (
                      <div 
                        key={bk.id}
                        onClick={() => setActiveBookingModal(bk)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer hover:opacity-90 transition truncate shadow-xs flex items-center justify-between ${getEventBadgeStyle(bk.serviceType)}`}
                      >
                        <span className="truncate">{bk.serviceName}</span>
                        <span className="text-[9px] opacity-80 shrink-0">{bk.startTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* AGENDA / DAY / WEEK VIEW FALLBACK LIST */}
      {currentView !== 'Month' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">جدول الحجوزات والمواعيد القادمة</h3>
          
          <div className="space-y-3">
            {bookings.map(bk => {
              const clashes = checkClash(bk.assignedTeamIds, bk.requiredEquipmentIds, bk.date, bk.startTime, bk.endTime, bk.id);
              const hasClash = clashes.memberConflicts.length > 0 || clashes.equipmentConflicts.length > 0;

              return (
                <div key={bk.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getEventBadgeStyle(bk.serviceType)}`}>
                        {bk.serviceType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bk.serviceName}</h4>
                      {hasClash && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          تحذير تعارض!
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">العميل: {bk.clientName} | {bk.location}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{bk.date}</div>
                      <div className="text-slate-400">{bk.startTime} - {bk.endTime}</div>
                    </div>

                    <button
                      onClick={() => setActiveBookingModal(bk)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition"
                    >
                      التفاصيل
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Quick Detail Drawer Modal */}
      {activeBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 space-y-4">
            
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getEventBadgeStyle(activeBookingModal.serviceType)}`}>
                  {activeBookingModal.serviceType}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">{activeBookingModal.serviceName}</h3>
                <div className="text-xs text-slate-500">العميل: {activeBookingModal.clientName}</div>
              </div>

              <button onClick={() => setActiveBookingModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>التاريخ: <strong>{activeBookingModal.date}</strong> (من {activeBookingModal.startTime} إلى {activeBookingModal.endTime})</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>الموقع: <strong>{activeBookingModal.location}</strong></span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center text-xs">
              <span>الإجمالي: <strong className="text-brand-600 dark:text-brand-400">{activeBookingModal.totalPrice.toLocaleString()} ريال</strong></span>
              <span>حالة الدفع: <strong>{activeBookingModal.paymentStatus}</strong></span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveBookingModal(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
