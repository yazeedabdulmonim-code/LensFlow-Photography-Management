import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Star, Phone, Mail, Camera, ClipboardCheck, Clock, ShieldCheck, ChevronLeft, Plus, UserPlus, Trash2, Edit3, Lock, Eye, EyeOff, KeyRound, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';

export const TeamView = ({ onOpenAddMemberModal, onOpenEditMemberModal }) => {
  const { team, tasks, equipment, deleteTeamMember, userRole } = useApp();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPasswordsMap, setShowPasswordsMap] = useState({});

  const isAdmin = userRole === 'Admin';
  const isAdminOrManager = userRole === 'Admin' || userRole === 'Manager';

  const togglePasswordVisibility = (id) => {
    setShowPasswordsMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (memberId, memberName) => {
    if (!isAdmin) {
      alert('⛔ عذراً، لا يمكن لأي شخص حذف أعضاء الفريق غير المسؤول (Admin) فقط!');
      return;
    }
    if (window.confirm(`هل أنت تأكد من إزالة العضو (${memberName}) من الفريق؟`)) {
      deleteTeamMember(memberId);
      if (selectedMember?.id === memberId) {
        setSelectedMember(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in dir-rtl">
      
      {/* Top Header & Permission Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-500" />
            إدارة فريق العمل وحسابات الموظفين (Team & Staff Accounts)
          </h1>
          <p className="text-xs text-slate-500">استعراض الموظفين والتخصصات والمهام المسندة</p>
        </div>

        {/* Add Member Button: ONLY visible to Admin or Manager */}
        {isAdminOrManager ? (
          <button
            onClick={onOpenAddMemberModal}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ إضافة حساب موظف جديد</span>
          </button>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-bold rounded-xl flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>تعديل وإضافة الصلاحيات متاح فقط للمشرف والمدير</span>
          </div>
        )}
      </div>

      {/* Role Legend Guide Card */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-500" />
          دليل تصنيف صلاحيات النظام (System Role Guide)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-black">
              <span>المسؤول عن الموقع 👑 (Admin)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              له الصلاحيات الكاملة والمطلقة لإدارة النظام وتعديل الصلاحيات وإضافة/حذف حسابات الفريق واستعراض كلمات المرور.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/10 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1">
            <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-black">
              <span>المشرف 🛡️ (Manager)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              مشرف العمليات اليومية؛ يملك صلاحيات تعديل بيانات الموظفين وإسناد المهام والحجوزات وإضافتهم للفريق.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-500/5 dark:bg-slate-950/10 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1 text-slate-750 dark:text-slate-300 font-black">
              <span>الموظف 📸 (Staff / Employee)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              طاقم العمل الميداني (مصور، محرر، مساعد)؛ يستعرض فقط مهامه وجدول أعماله عبر رابط الدخول المباشر المرفق بالبريد.
            </p>
          </div>

        </div>
      </div>

      {/* STAFF CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const memberGear = equipment.filter(e => e.assignedToMemberId === member.id);

          return (
            <div key={member.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                      {member.role === 'Admin' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">المسؤول عن الموقع 👑</span>
                      ) : member.role === 'Manager' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60">المشرف 🛡️</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">الموظف 📸</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{member.specialty}</div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                {isAdminOrManager && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditMemberModal(member)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-xl transition"
                      title="تعديل بيانات وحساب الموظف"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
                        title="حذف العضو من الفريق (متاح للمسؤول فقط)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Account Credentials Summary Pill: Passwords ONLY visible if Admin or Manager */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 text-[10px] font-bold">
                    <Mail className="w-3 h-3 text-brand-500" />
                    البريد:
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold truncate max-w-44">{member.email}</span>
                </div>

                {isAdminOrManager && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 text-[10px] font-bold">
                      <Lock className="w-3 h-3 text-brand-500" />
                      كلمة المرور:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {showPasswordsMap[member.id] ? (member.password || '123456') : '••••••••'}
                      </span>
                      <button onClick={() => togglePasswordVisibility(member.id)} className="text-slate-400 hover:text-slate-600">
                        {showPasswordsMap[member.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}
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
                
                <div className="flex items-center gap-1.5">
                  {member.phone && (
                    <a
                      href={`https://wa.me/${(member.phone || '').replace(/[^\d]/g, '').startsWith('05') ? '966' + (member.phone || '').replace(/[^\d]/g, '').slice(1) : (member.phone || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(`أهلاً ${member.name}، تذكير بمتابعة مهام وحجوزات استوديو LensFlow ✨`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 transition flex items-center gap-1"
                      title={`مراسلة ${member.name} على الواتساب`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {isAdminOrManager && (
                    <button
                      onClick={() => onOpenEditMemberModal(member)}
                      className="px-2.5 py-1.5 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold rounded-xl hover:bg-brand-100 transition"
                    >
                      تعديل
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedMember(member)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
                  >
                    الملف
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* STAFF CREDENTIALS DIRECTORY TABLE: ONLY visible to Admin or Manager */}
      {isAdminOrManager && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                سجل حسابات وصلاحيات دخول الموظفين (Staff Credentials Directory)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">مخصص للمشرفين والمدراء فقط</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3 pr-2">الموظف</th>
                  <th className="pb-3">الدور الوظيفي والصلاحية</th>
                  <th className="pb-3">البريد الإلكتروني</th>
                  <th className="pb-3">كلمة المرور</th>
                  <th className="pb-3 pl-2 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {team.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 pr-2 flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                    </td>
                    <td className="py-3 font-bold text-brand-600 dark:text-brand-400">{m.role}</td>
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{m.email}</td>
                    <td className="py-3 font-mono text-slate-800 dark:text-slate-200 font-bold">
                      <div className="flex items-center gap-2">
                        <span>{showPasswordsMap[m.id] ? (m.password || '123456') : '••••••••'}</span>
                        <button onClick={() => togglePasswordVisibility(m.id)} className="text-slate-400 hover:text-slate-600">
                          {showPasswordsMap[m.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 pl-2 text-left">
                      <button
                        onClick={() => onOpenEditMemberModal(m)}
                        className="px-3 py-1 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-lg font-bold hover:bg-brand-100 transition"
                      >
                        تعديل الصلاحية
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member Details Drawer */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedMember.name}</h3>
                  <div className="text-xs text-brand-600 font-bold">{selectedMember.role} - {selectedMember.specialty}</div>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div>📧 البريد الإلكتروني: <strong className="font-mono text-slate-900 dark:text-slate-100">{selectedMember.email}</strong></div>
              <div>📱 رقم التواصل: <strong className="font-mono text-slate-900 dark:text-slate-100">{selectedMember.phone}</strong></div>
              <div>⭐ التقييم العام: <strong className="text-amber-500">{selectedMember.rating} / 5.0</strong></div>
              <div>💼 إجمالي الساعات: <strong>{selectedMember.hoursWorked} ساعة</strong></div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onClick={() => setSelectedMember(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">إغلاق</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
