import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, Clock, CalendarCheck, ShieldAlert, Camera, Receipt, Calendar, Sparkles } from 'lucide-react';

export const NotificationsView = ({ onNavigateToCalendar }) => {
  const { notifications, markNotificationRead, triggerDateHighlight } = useApp();

  const handleNotifClick = (n) => {
    markNotificationRead(n.id);
    triggerDateHighlight(n.targetDate);
    if (onNavigateToCalendar) {
      onNavigateToCalendar();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            مركز الإشعارات والتنبيهات (Notifications)
          </h1>
          <p className="text-xs text-slate-500">اضغط على أي إشعار للانتقال المباشر للتقويم والتأشير على اليوم لثانيتين 🎯</p>
        </div>

        <button 
          onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition"
        >
          تعليم الكل كـ مقروء
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">لا توجد إشعارات حالياً</div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id}
              onClick={() => handleNotifClick(n)}
              className={`p-4 flex items-start gap-3 cursor-pointer transition ${!n.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
            >
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                <div className="text-[10px] font-bold text-amber-500 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>انتقال وتأشير اليوم المحدد على التقويم لمدة ثانيتين 🎯</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
