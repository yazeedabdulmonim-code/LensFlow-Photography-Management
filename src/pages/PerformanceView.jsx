import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Award, Clock, CheckCircle2, AlertTriangle, Star, Calendar } from 'lucide-react';

export const PerformanceView = () => {
  const { team, tasks, projects } = useApp();

  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-500" />
            أداء الفريق والإنجازات (Team Performance Analytics)
          </h1>
          <p className="text-xs text-slate-500">تقييم سرعة الإنجاز، نسبة الالتزام بمواعيد التسليم، وكفاءة المصورين والمحررين</p>
        </div>

        {/* Time Range Filter */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1 text-xs font-bold self-start sm:self-auto">
          {['Today', 'This Week', 'This Month', 'This Year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg transition ${timeRange === range ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {range === 'Today' ? 'اليوم' : range === 'This Week' ? 'هذا الأسبوع' : range === 'This Month' ? 'هذا الشهر' : 'هذا العام'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Performers Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.slice(0, 3).map((member, index) => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const completedCount = memberTasks.filter(t => t.status === 'Completed').length;
          const totalCount = memberTasks.length || 1;
          const completionPct = Math.round((completedCount / totalCount) * 100);

          return (
            <div 
              key={member.id}
              className={`p-6 rounded-3xl border shadow-sm space-y-4 relative overflow-hidden ${
                index === 0 ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-amber-300 dark:border-amber-700/60' :
                'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                    <div className="text-xs text-slate-500">{member.role}</div>
                  </div>
                </div>

                <div className={`p-2 rounded-xl text-xs font-black flex items-center gap-1 ${
                  index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Award className="w-4 h-4" />
                  <span>المركز #{index + 1}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">نسبة كفاءة الإنجاز:</span>
                  <span className="text-brand-600 dark:text-brand-400 font-black">{completionPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-center">
                <div>
                  <div className="text-[10px] text-slate-400">إجمالي المهام</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{memberTasks.length} مهمة</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ساعات العمل</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{member.hoursWorked}h</div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Full Performance Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">جدول تقييم السرعة والأداء التكاملي</h3>
        
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <th className="p-3">عضو الفريق</th>
              <th className="p-3">التخصص</th>
              <th className="p-3 text-center">إجمالي المهام</th>
              <th className="p-3 text-center">المكتملة</th>
              <th className="p-3 text-center">نسبة الإنجاز</th>
              <th className="p-3 text-center">ساعات العمل</th>
              <th className="p-3 text-center">متوسط سرعة الإنجاز</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {team.map(m => {
              const mTasks = tasks.filter(t => t.assigneeId === m.id);
              const mComp = mTasks.filter(t => t.status === 'Completed').length;
              const pct = mTasks.length > 0 ? Math.round((mComp / mTasks.length) * 100) : 90;

              return (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                        <div className="text-[10px] text-slate-400">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{m.role}</td>
                  <td className="p-3 text-center font-bold font-mono">{mTasks.length}</td>
                  <td className="p-3 text-center font-bold text-emerald-600 font-mono">{mComp}</td>
                  <td className="p-3 text-center">
                    <span className="font-black text-brand-600 dark:text-brand-400 font-mono">{pct}%</span>
                  </td>
                  <td className="p-3 text-center font-bold font-mono">{m.hoursWorked} ساعة</td>
                  <td className="p-3 text-center text-slate-500 font-medium">سريعة جداً (1.5 يوم / مهمة)</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
