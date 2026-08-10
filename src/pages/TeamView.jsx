import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Star, Phone, Mail, Camera, ClipboardCheck, Clock, ShieldCheck, ChevronLeft } from 'lucide-react';

export const TeamView = () => {
  const { team, tasks, equipment, bookings } = useApp();
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-brand-500" />
          إدارة فريق العمل (Team Management)
        </h1>
        <p className="text-xs text-slate-500">المصورين، المحررين، مساعدين الاستوديو، وإدارة التخصصات والعهدة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const memberGear = equipment.filter(e => e.assignedToMemberId === member.id);

          return (
            <div key={member.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition">
              
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600">{member.role}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{member.specialty}</div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{member.rating}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-center">
                <div>
                  <div className="text-[10px] text-slate-400">مهام مكتملة</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400">{member.tasksCompleted}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">مهام نشطة</div>
                  <div className="font-black text-brand-600 dark:text-brand-400">{memberTasks.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ساعات العمل</div>
                  <div className="font-black text-slate-800 dark:text-slate-200">{member.hoursWorked}h</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">معدات بحوزته: <strong className="text-slate-800 dark:text-slate-200">{memberGear.length} قطعة</strong></span>
                <button
                  onClick={() => setSelectedMember(member)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
                >
                  الملف الكامل
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Member Profile Drawer Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden p-6 space-y-4">
            
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">{selectedMember.name}</h3>
                  <div className="text-xs text-slate-500">{selectedMember.specialty}</div>
                </div>
              </div>

              <button onClick={() => setSelectedMember(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">المعدات المسلمة عهدة حالياً:</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {equipment.filter(e => e.assignedToMemberId === selectedMember.id).map(eq => (
                  <div key={eq.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{eq.name}</span>
                    <span className="text-slate-400 font-mono">S/N: {eq.serialNumber}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedMember(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">إغلاق</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
