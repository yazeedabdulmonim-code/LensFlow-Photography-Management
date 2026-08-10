import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, Plus, Search, Filter, MapPin, Users, Clock, 
  CheckCircle2, ArrowUpRight, Briefcase, Eye, ChevronLeft, Calendar as CalendarIcon, ShieldAlert
} from 'lucide-react';

export const BookingsView = ({ onOpenBookingModal, setActiveTab }) => {
  const { bookings, convertBookingToProject, team, equipment, clients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesService = serviceFilter === 'All' || b.serviceType === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-brand-500" />
            إدارة الحجوزات (Bookings)
          </h1>
          <p className="text-xs text-slate-500">إدارة كافة حجز الجلسات، المواقع، وأطقم العمل والمعدات</p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ حجز جديد</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث بالاسم، الخدمة، رقم الحجز..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="All">جميع الحالات</option>
            <option value="Confirmed">مؤكد</option>
            <option value="Pending">معلق</option>
            <option value="In Progress">قيد التنفيذ</option>
            <option value="Completed">مكتمل</option>
            <option value="Cancelled">ملغى</option>
          </select>

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
            const isConfirmed = booking.status === 'Confirmed';
            const isInProgress = booking.status === 'In Progress';

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

                  {/* Assigned Team Avatars */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2 space-x-reverse">
                      {assignedMembers.map(m => (
                        <img 
                          key={m.id} 
                          src={m.avatar} 
                          alt={m.name} 
                          title={`${m.name} (${m.role})`}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900" 
                        />
                      ))}
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 dark:text-slate-100">{booking.totalPrice.toLocaleString()} ريال</div>
                      <div className="text-[10px] text-slate-400 font-medium">{booking.paymentStatus}</div>
                    </div>
                  </div>

                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  
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
                      <span>تحويل إلى مشروع</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden p-6 space-y-5">
            
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400">{selectedBooking.id}</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{selectedBooking.serviceName}</h2>
                <div className="text-xs text-slate-500">العميل: {selectedBooking.clientName}</div>
              </div>

              <button onClick={() => setSelectedBooking(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">الموعد والتوقيت:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBooking.date} ({selectedBooking.startTime} - {selectedBooking.endTime})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">الموقع:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBooking.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">إجمالي السعر والعربون:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBooking.totalPrice.toLocaleString()} ريال (عربون: {selectedBooking.depositPaid.toLocaleString()} ريال)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">حالة الدفع:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{selectedBooking.paymentStatus}</span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold block mb-1 text-slate-800 dark:text-slate-200">ملاحظات:</span>
                {selectedBooking.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  convertBookingToProject(selectedBooking.id);
                  setSelectedBooking(null);
                  setActiveTab('projects');
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
              >
                تحويل إلى مشروع مباشر
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
