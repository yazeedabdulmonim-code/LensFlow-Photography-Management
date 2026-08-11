import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, MapPin, User, Clock, Camera, Plus, 
  Briefcase, CheckCircle2, ShieldAlert, Eye, MessageSquare, Send, Users, Phone
} from 'lucide-react';
import { sendWhatsAppNotification } from '../services/whatsappService';

export const BookingsView = ({ onOpenBookingModal, onOpenWhatsAppModal, setActiveTab }) => {
  const { bookings, team, convertBookingToProject, showToast, currentUser, userRole } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [onlyMyBookings, setOnlyMyBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesService = serviceFilter === 'All' || b.serviceType === serviceFilter;
    const matchesMyBookings = !onlyMyBookings || b.assignedTeamIds?.includes(currentUser?.id);

    return matchesSearch && matchesStatus && matchesService && matchesMyBookings;
  });

  const handleSendWhatsAppToTeam = (booking) => {
    const assignedMembers = team.filter(t => booking.assignedTeamIds?.includes(t.id));
    const targetMember = team.find(t => t.name.includes('يزيد')) || assignedMembers[0] || team[0];

    if (targetMember && targetMember.phone) {
      const waRes = sendWhatsAppNotification({
        phone: targetMember.phone,
        name: targetMember.name,
        role: targetMember.role,
        bookingId: booking.id,
        serviceName: booking.serviceName,
        clientName: booking.clientName,
        date: booking.date,
        time: `${booking.startTime} - ${booking.endTime}`,
        location: booking.location,
        notes: booking.notes,
      });

      if (navigator.clipboard) {
        navigator.clipboard.writeText(waRes.messageText);
      }

      if (typeof window !== 'undefined' && waRes.apiUrl) {
        window.open(waRes.apiUrl, '_blank');
      }

      showToast(`📲 تم تعبئة النص والمهام بالواتساب لـ (${targetMember.name}) تلقائياً! اضغط إرسال 💬`);
    }

    if (onOpenWhatsAppModal) {
      onOpenWhatsAppModal(booking);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in dir-rtl">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-500" />
            إدارة الحجوزات والمواعيد (Bookings & Schedule)
          </h1>
          <p className="text-xs text-slate-500">متابعة الحجوزات، المواعيد الميدانية، واستعراض طاقم العمل المشارك بالمهمة</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter ONLY My Bookings Button */}
          <button
            onClick={() => setOnlyMyBookings(!onlyMyBookings)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border ${
              onlyMyBookings 
                ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>حجوزاتي المخصصة لي</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ إنشاء حجز جديد</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="بحث بالعميل، اسم الخدمة، أو الموقع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع الحالات</option>
            <option value="Confirmed">مؤكد</option>
            <option value="In Progress">قيد المشروع</option>
            <option value="Pending">معلق</option>
            <option value="Completed">مكتمل</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع أنواع التصوير</option>
            <option value="Wedding">زفاف</option>
            <option value="Event">فعاليات</option>
            <option value="Real Estate">عقارات</option>
            <option value="Product">منتجات</option>
            <option value="Portrait">بورتريه</option>
            <option value="Conference">مؤتمرات</option>
            <option value="Commercial">تجاري</option>
          </select>
        </div>

      </div>

      {/* Bookings Table / Grid */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">لا توجد حجوزات تطابق البحث حتى الآن</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">أنشئ حجوزات جديدة لإدارتها وإسناد الفريق والمعدات</p>
          <button 
            onClick={onOpenBookingModal}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
          >
            + إنشاء حجز جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map(booking => {
            const assignedMembers = team.filter(t => booking.assignedTeamIds?.includes(t.id));

            return (
              <div 
                key={booking.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/40 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Status & Date */}
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{booking.id}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                      booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      booking.status === 'In Progress' ? 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300' :
                      booking.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {booking.status === 'Confirmed' ? 'مؤكد' : booking.status === 'In Progress' ? 'قيد المشروع' : booking.status === 'Pending' ? 'معلق' : booking.status}
                    </span>
                  </div>

                  {/* Title & Client */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{booking.serviceName}</h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">العميل: {booking.clientName}</div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-brand-500" />
                      <span>{booking.date} | من {booking.startTime} إلى {booking.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                  </div>

                  {/* Co-assigned Team Members list for this booking */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3 text-brand-500" />
                      <span>طاقم العمل المسند معي في هذه المهمة:</span>
                    </div>

                    <div className="space-y-1">
                      {assignedMembers.map(m => (
                        <div key={m.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                            <span className="text-[10px] text-brand-600 font-medium">({m.role})</span>
                          </div>

                          {m.phone && (
                            <a
                              href={`https://api.whatsapp.com/send?phone=${(m.phone || '').replace(/[^\d]/g, '').startsWith('05') ? '966' + (m.phone || '').replace(/[^\d]/g, '').slice(1) : (m.phone || '').replace(/[^\d]/g, '')}&text=${encodeURIComponent(`أهلاً ${m.name}، بخصوص حجز ${booking.serviceName} بتاريخ ${booking.date} ✨`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>مراسلة</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  
                  {/* Direct Auto-fill WhatsApp Trigger */}
                  <button
                    onClick={() => handleSendWhatsAppToTeam(booking)}
                    className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    title="تعبئة التكليف بالواتساب تلقائياً وإرساله"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>إرسال WhatsApp</span>
                  </button>

                  {/* Convert to Project Button */}
                  {booking.status !== 'In Progress' && booking.status !== 'Completed' && (
                    <button
                      onClick={() => {
                        convertBookingToProject(booking.id);
                        setActiveTab('projects');
                      }}
                      className="flex-1 py-2 px-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>مشروع</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>التفاصيل</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{selectedBooking.id}</span>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">{selectedBooking.serviceName}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div>العميل: <strong className="text-slate-900 dark:text-slate-100">{selectedBooking.clientName}</strong> ({selectedBooking.phone})</div>
                <div>الموعد: <strong>{selectedBooking.date}</strong> من {selectedBooking.startTime} إلى {selectedBooking.endTime}</div>
                <div>الموقع: <strong>{selectedBooking.location}</strong></div>
              </div>

              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">المصورين وطاقم العمل المخصصين:</div>
                <div className="flex flex-wrap gap-2">
                  {team.filter(t => selectedBooking.assignedTeamIds?.includes(t.id)).map(m => (
                    <div key={m.id} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                      <span className="text-[10px] text-brand-600">({m.role})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleSendWhatsAppToTeam(selectedBooking)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>إرسال تفاصيل الحجز بالواتساب تلقائياً</span>
              </button>

              <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">إغلاق</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
