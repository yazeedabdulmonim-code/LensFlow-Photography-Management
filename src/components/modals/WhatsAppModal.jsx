import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, Send, Copy, Smartphone, User, PhoneCall, ListTodo, FileText } from 'lucide-react';
import { generateWhatsAppMessage } from '../../services/whatsappService';

export const WhatsAppModal = ({ isOpen, onClose, booking }) => {
  const { team, tasks, showToast } = useApp();

  const [customPhone, setCustomPhone] = useState('');
  const [customRecipientName, setCustomRecipientName] = useState('');

  if (!isOpen || !booking) return null;

  const assignedMembers = team.filter(t => booking.assignedTeamIds?.includes(t.id));

  // Find related tasks for this booking
  const relatedTasks = tasks.filter(t => t.bookingId === booking.id || t.projectId === booking.projectId || t.projectName?.includes(booking.serviceName));
  const taskTitles = relatedTasks.map(t => t.title);

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    showToast('📋 تم نسخ كليشة تفاصيل الحجز والمهام (بدون أسعار)!');
  };

  const handleSendCustomWhatsApp = (e) => {
    e.preventDefault();
    if (!customPhone) {
      showToast('يرجى إدخال رقم الجوال إرسال الواتساب إليه');
      return;
    }

    const waData = generateWhatsAppMessage({
      phone: customPhone,
      name: customRecipientName || 'عضو الفريق',
      bookingId: booking.id,
      serviceName: booking.serviceName,
      clientName: booking.clientName,
      date: booking.date,
      time: `${booking.startTime} - ${booking.endTime}`,
      location: booking.location,
      tasksList: taskTitles,
      notes: booking.notes,
    });

    window.open(waData.waMeUrl, '_blank');
    showToast(`📲 تم إرسال نص الأوردر والمهام كاملاً للرقم (${customPhone})!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in dir-rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                إرسال تفاصيل الحجز والمهام للطاقم عبر WhatsApp 💬
              </h2>
              <div className="text-xs text-slate-500">{booking.serviceName} | العميل: {booking.clientName}</div>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Direct WhatsApp Dispatch */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                إرسال تفاصيل الجلسة للعميل: <strong className="text-emerald-700 dark:text-emerald-300">{booking.clientName}</strong>
              </span>
            </div>

            {booking.phone && (
              <a
                href={generateWhatsAppMessage({
                  phone: booking.phone,
                  name: booking.clientName,
                  bookingId: booking.id,
                  serviceName: booking.serviceName,
                  clientName: booking.clientName,
                  date: booking.date,
                  time: `${booking.startTime} - ${booking.endTime}`,
                  location: booking.location,
                  tasksList: taskTitles,
                }).waMeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال للعميل</span>
              </a>
            )}
          </div>
        </div>

        {/* Staff Members List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>طاقم العمل المسند والمهام التفصيلية (بدون عرض الأسعار):</span>
            <span className="text-[10px] text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <FileText className="w-3 h-3" />
              تعبئة تلقائية للمهام بدون أسعار
            </span>
          </div>

          {assignedMembers.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              لم يتم تعيين مصور مخصص حتى الآن. يمكنك إرسال المهام عبر حقل الرقم المخصص أدناه.
            </div>
          ) : (
            assignedMembers.map(m => {
              const waData = generateWhatsAppMessage({
                phone: m.phone,
                name: m.name,
                role: m.role,
                bookingId: booking.id,
                serviceName: booking.serviceName,
                clientName: booking.clientName,
                date: booking.date,
                time: `${booking.startTime} - ${booking.endTime}`,
                location: booking.location,
                tasksList: taskTitles,
                notes: booking.notes,
              });

              return (
                <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.phone || 'لا يوجد رقم'} ({m.role})</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(waData.messageText)}
                        className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1"
                        title="نسخ نص التكليف والمهام"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </button>

                      <a
                        href={waData.waMeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال لـ {m.name}</span>
                      </a>
                    </div>
                  </div>

                  {/* Pure Text Order Details Preview Box (No Prices) */}
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-sans text-slate-800 dark:text-slate-200 whitespace-pre-wrap relative leading-relaxed">
                    {waData.messageText}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Custom Number Dispatcher */}
        <form onSubmit={handleSendCustomWhatsApp} className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-brand-500" />
            <span>إرسال تفاصيل الجلسة والمهام لـ يزيد أو أي رقم مخصص:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <input
              type="text"
              placeholder="اسم المستقبل (مثال: يزيد)"
              value={customRecipientName}
              onChange={(e) => setCustomRecipientName(e.target.value)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
            <input
              type="tel"
              required
              placeholder="رقم الجوال (0501234567)"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>إرسال التكليف والمهام بالواتساب 💬</span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">إغلاق</button>
        </div>

      </div>
    </div>
  );
};
