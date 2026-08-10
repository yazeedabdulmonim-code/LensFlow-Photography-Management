import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, Clock, CheckCircle2, AlertTriangle, Wallet, ArrowUpRight, 
  Users, Briefcase, Camera, TrendingUp, ChevronLeft, Play, Check, ChevronRight
} from 'lucide-react';

export const DashboardView = ({ setActiveTab, onOpenBookingModal, onOpenTaskModal }) => {
  const { userRole, currentUser, team, bookings, projects, tasks, equipment, invoices, clients, updateTaskStatus } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculated Stats
  const totalBookingsCount = bookings.length;
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const upcomingBookings = bookings.filter(b => b.date >= todayStr && b.status !== 'Cancelled');
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const overdueTasksCount = tasks.filter(t => t.dueDate < todayStr && t.status !== 'Completed').length;
  const todayTasksCount = tasks.filter(t => t.startDate === todayStr || t.dueDate === todayStr).length;

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);
  const equipmentInUseToday = equipment.filter(e => e.status === 'In Use').length;

  // Filter tasks for logged in member if non-Admin
  const isEmployeeRole = ['Photographer', 'Videographer', 'Editor', 'Assistant'].includes(userRole);
  const myTasksToday = tasks.filter(t => t.assigneeId === currentUser?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-l from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
              {userRole === 'Admin' ? 'نظام الإدارة الشامل' : `لوحة الموظف: ${currentUser?.specialty || userRole}`}
            </span>
            <span className="text-xs text-slate-400">| {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            صباح الخير، {currentUser?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            مرحباً بك في LensFlow. تابع أعمال التصوير، الحجوزات، إنجازات الفريق، ومستجدات اليوم.
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

      {/* Admin SaaS Metrics Grid */}
      {!isEmployeeRole && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total & Today Bookings */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-brand-500/40 transition">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                اليوم: {todayBookings.length}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalBookingsCount}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">إجمالي الحجوزات</div>
            </div>
          </div>

          {/* Card 2: Active Projects & Overdue Tasks */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-brand-500/40 transition">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
              {overdueTasksCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {overdueTasksCount} متأخرة
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{activeProjectsCount}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">المشاريع النشطة ({completedProjectsCount} مكتمل)</div>
            </div>
          </div>

          {/* Card 3: Revenue & Outstanding */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-brand-500/40 transition">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                مستحق: {totalOutstanding.toLocaleString()} ريال
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalRevenue.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ريال</span></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">إجمالي الإيرادات المحصلة</div>
            </div>
          </div>

          {/* Card 4: Equipment & Team */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-brand-500/40 transition">
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                معدات اليوم: {equipmentInUseToday}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{team.length}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">أفراد الفريق ({clients.length} عملاء)</div>
            </div>
          </div>

        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Team Daily Progress & Today Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Team Daily Progress Widget (مهام الفريق اليوم) */}
          {!isEmployeeRole && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-500" />
                    مهام الفريق اليوم
                  </h3>
                  <p className="text-xs text-slate-500">نسب الإنجاز المباشرة لأعضاء الفريق</p>
                </div>
                <button onClick={() => setActiveTab('team')} className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  <span>عرض الكل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {team.map(member => {
                  const memberTasks = tasks.filter(t => t.assigneeId === member.id);
                  const memberCompleted = memberTasks.filter(t => t.status === 'Completed').length;
                  const totalMTasks = memberTasks.length;
                  const progressPct = totalMTasks > 0 ? Math.round((memberCompleted / totalMTasks) * 100) : 0;

                  return (
                    <div key={member.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{member.name}</div>
                            <div className="text-[10px] text-slate-500">{member.specialty}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-brand-600 dark:text-brand-400">{progressPct}%</span>
                          <span className="text-[10px] text-slate-400 mr-2">({memberCompleted}/{totalMTasks} مهمة)</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500" 
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      {/* Recent tasks snippet */}
                      <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                        {memberTasks.slice(0, 2).map(t => (
                          <div key={t.id} className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            {t.status === 'Completed' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate max-w-[180px]">{t.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employee Dedicated Mobile / Desktop Section: "مهامي اليوم" */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  مهامي اليوم ({myTasksToday.length})
                </h3>
                <p className="text-xs text-slate-500">مهامك المباشرة وسير العمل الميداني</p>
              </div>
              <button onClick={() => setActiveTab('tasks')} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                جدول المهام الكامل
              </button>
            </div>

            {myTasksToday.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">ممتاز! لا توجد مهام معلقة اليوم 🎉</div>
                <div className="text-xs text-slate-500 mt-1">يمكنك الاطلاع على جدول الحجوزات أو القادمة</div>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasksToday.map(task => (
                  <div key={task.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {task.priority === 'High' ? 'عالية' : 'متوسطة'}
                          </span>
                          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{task.projectName}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{task.title}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">العميل: {task.clientId ? (clients.find(c=>c.id===task.clientId)?.name || 'عام') : 'عام'}</div>
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        task.status === 'In Progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {task.status === 'Completed' ? 'مكتملة' : task.status === 'In Progress' ? 'قيد التنفيذ' : 'معلقة'}
                      </span>
                    </div>

                    {/* Work Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[11px] text-slate-500">
                        {task.startedAt ? `بدأت: ${new Date(task.startedAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}` : `تاريخ الاستحقاق: ${task.dueDate}`}
                      </div>

                      <div className="flex items-center gap-2">
                        {task.status === 'Pending' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>بدء المهمة</span>
                          </button>
                        )}

                        {task.status === 'In Progress' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>إكمال المهمة</span>
                          </button>
                        )}

                        {task.status === 'Completed' && (
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تم الإنجاز</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Column: Today's Schedule & Equipment Status & Upcoming Bookings */}
        <div className="space-y-6">
          
          {/* Upcoming Bookings Widget */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-brand-500" />
                الحجوزات القادمة
              </h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                عرض الكل
              </button>
            </div>

            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map(bk => (
                <div key={bk.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{bk.serviceName}</div>
                    <div className="text-[11px] text-slate-500">{bk.clientName}</div>
                    <div className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold mt-1">{bk.date} ({bk.startTime})</div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300">
                    {bk.totalPrice.toLocaleString()} ريال
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Quick Status Widget */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" />
                حالة المعدات
              </h3>
              <button onClick={() => setActiveTab('equipment')} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                المستودع
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-600 dark:text-slate-400">المتاحة في الاستوديو:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{equipment.filter(e => e.status === 'Available').length} معدة</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-600 dark:text-slate-400">قيد الاستخدام الميداني:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{equipment.filter(e => e.status === 'In Use').length} معدة</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-600 dark:text-slate-400">محجوزة لحجوزات قادمة:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{equipment.filter(e => e.status === 'Reserved').length} معدة</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-600 dark:text-slate-400">في الصيانة والتنظيف:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{equipment.filter(e => e.status === 'Maintenance').length} معدة</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
