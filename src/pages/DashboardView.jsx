import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, CheckCircle2, Briefcase, Wallet, ArrowUpRight, ArrowDownRight,
  Users, Camera, ChevronLeft, Check, Plus, Layers, Package, Clock, MapPin
} from 'lucide-react';

export const DashboardView = ({ setActiveTab, onOpenBookingModal, onOpenTaskModal }) => {
  const { userRole, currentUser, team, bookings, projects, tasks, equipment, invoices, clients, updateTaskStatus } = useApp();

  const todayStr = '2026-05-11';
  const formattedTodayDate = '11 مايو 2026';

  // Calculated Stats
  const totalBookingsCount = bookings.length || 24;
  const todayTasksCount = tasks.length || 18;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length || 6;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0) || 58750;

  const isEmployeeRole = ['Photographer', 'Videographer', 'Editor', 'Assistant'].includes(userRole);
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id || t.assigneeName?.includes(currentUser?.name || ''));

  return (
    <div className="space-y-6 animate-fade-in dir-rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-l from-slate-900 via-slate-900 to-brand-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
              {userRole === 'Admin' || userRole === 'Manager' ? 'نظام الإدارة الشامل' : `لوحة الموظف: ${currentUser?.specialty || userRole}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            صباح الخير، {currentUser?.name?.split(' ')[0] || 'عاهد'} 👋
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            مرحباً بك في لوحة التحكم - نظام إدارة استوديو التصوير LensFlow
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/30 transition flex items-center gap-2"
          >
            <span>+ حجز جديد</span>
          </button>

          <button
            onClick={onOpenTaskModal}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <span>+ مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* TOP 4 STAT CARDS (مأخوذة بالظبط بنفس تصميم الصورة) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: إجمالي الحجوزات */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-brand-500/40 transition">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-bold">إجمالي الحجوزات</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalBookingsCount}</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% من الشهر الماضي</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: المهام اليوم */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-brand-500/40 transition">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-bold">المهام اليوم</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{todayTasksCount}</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8% من أمس</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: المشاريع النشطة */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-brand-500/40 transition">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-bold">المشاريع النشطة</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{activeProjectsCount}</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3% من الأسبوع الماضي</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: إجمالي الإيرادات */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-brand-500/40 transition">
          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-bold">إجمالي الإيرادات</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ريال</span></div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+15% من الشهر الماضي</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* MAIN DASHBOARD 3-COLUMN GRID (طابق تصميم الصورة بالكامل) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: التقويم اليوم */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">التقويم اليوم</h3>
                <p className="text-[11px] text-slate-400 font-medium">{formattedTodayDate}</p>
              </div>
              <Calendar className="w-5 h-5 text-brand-500" />
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-r-4 border-r-blue-500 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">تصوير حفل زفاف</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">شركة الإبداع</div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-500">10:00 ص</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-r-4 border-r-purple-500 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">تصوير لايف ستايل</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">متجر أيلين ستايل</div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-500">01:00 م</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-r-4 border-r-amber-500 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">مؤتمر تقني</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">شركة التقنيات الحديثة</div>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-500">04:00 م</div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('calendar')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition text-center"
          >
            عرض التقويم الكامل
          </button>
        </div>

        {/* Column 2: مهام الفريق اليوم */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">مهام الفريق اليوم</h3>
              <button onClick={() => setActiveTab('team')} className="text-xs font-bold text-brand-600 hover:underline">
                عرض جميع المهام
              </button>
            </div>

            <div className="space-y-4">
              {team.slice(0, 4).map((m, idx) => {
                const completed = idx === 0 ? 2 : idx === 1 ? 1 : idx === 2 ? 1 : 0;
                const total = idx === 0 ? 3 : 2;
                const pct = Math.round((completed / total) * 100);

                return (
                  <div key={m.id} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                          <div className="text-[10px] text-slate-400">{m.specialty}</div>
                        </div>
                      </div>

                      <div className="text-[11px] font-bold text-slate-500">
                        <span>{completed}/{total}</span>
                        <span className="text-brand-600 dark:text-brand-400 mr-2 font-black">{pct}%</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('tasks')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition text-center"
          >
            عرض جميع المهام
          </button>
        </div>

        {/* Column 3: الحجوزات القادمة */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">الحجوزات القادمة</h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-brand-600 hover:underline">
                عرض الكل
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">تصوير حفل زفاف</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">فندق الريتز</div>
                </div>
                <div className="text-left text-[11px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200">12 مايو</div>
                  <div className="text-slate-400 font-mono">10:00 ص</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">تصوير عقار</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">مجمع النخيل</div>
                </div>
                <div className="text-left text-[11px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200">13 مايو</div>
                  <div className="text-slate-400 font-mono">02:00 م</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">تصوير منتج</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">متجر أكيسترا</div>
                </div>
                <div className="text-left text-[11px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200">14 مايو</div>
                  <div className="text-slate-400 font-mono">01:00 م</div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('bookings')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition text-center"
          >
            عرض الكل
          </button>
        </div>

      </div>

      {/* BOTTOM 3 WIDGETS (حالة المعدات، المدفوعات المستحقة، آخر الحجوزات) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: حالة المعدات */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">حالة المعدات</h3>
            <button onClick={() => setActiveTab('equipment')} className="text-xs font-bold text-brand-600 hover:underline">
              عرض الكل
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-8 border-emerald-500 border-t-blue-500 border-l-amber-500 border-r-red-500 flex items-center justify-center flex-col shrink-0">
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">15</span>
              <span className="text-[9px] text-slate-400">إجمالي المعدات</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>متاحة</span>
                <span className="font-bold">7</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>قيد الاستخدام</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>محجوزة</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>صيانة</span>
                <span className="font-bold">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: المدفوعات المستحقة */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">المدفوعات المستحقة</h3>
              <p className="text-[11px] font-bold text-red-500">24,500 ريال إجمالي</p>
            </div>
            <button onClick={() => setActiveTab('invoices')} className="text-xs font-bold text-brand-600 hover:underline">
              عرض الكل
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">شركة الإبداع</div>
                <div className="text-[10px] text-slate-400">حجز حفل زفاف</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">10,000 ريال</div>
                <div className="text-[10px] font-bold text-red-500">مستحقة</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">متجر ليل ستايل</div>
                <div className="text-[10px] text-slate-400">تصوير منتجات</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">7,500 ريال</div>
                <div className="text-[10px] font-bold text-red-500">مستحقة</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">مؤسسة البناء الحديث</div>
                <div className="text-[10px] text-slate-400">تصوير مشروع</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">7,000 ريال</div>
                <div className="text-[10px] font-bold text-red-500">مستحقة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: آخر الحجوزات */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">آخر الحجوزات</h3>
            <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-brand-600 hover:underline">
              عرض الكل
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">شركة الإبداع</div>
                <div className="text-[10px] text-slate-400">تصوير حفل زفاف</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">10,000 ريال</div>
                <div className="text-[10px] text-slate-400">قبل دقيقتين</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">متجر ليل ستايل</div>
                <div className="text-[10px] text-slate-400">تصوير لايف ستايل</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">5,000 ريال</div>
                <div className="text-[10px] text-slate-400">قبل ساعتين</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">مؤسسة البناء الحديث</div>
                <div className="text-[10px] text-slate-400">تصوير مشروع</div>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 dark:text-slate-200">8,500 ريال</div>
                <div className="text-[10px] text-slate-400">قبل 5 ساعات</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
