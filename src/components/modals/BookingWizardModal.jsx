import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, AlertTriangle, Calendar, User, Camera, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';

export const BookingWizardModal = ({ isOpen, onClose, onOpenWhatsAppModal }) => {
  const { clients, team, equipment, addBooking, checkClash } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientType: 'Company',
    companyName: '',
    phone: '',
    email: '',
    serviceType: 'Wedding',
    serviceName: 'تصوير حفل زفاف',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '16:00',
    location: '',
    photographersCount: 1,
    videographersCount: 1,
    requiredEquipmentIds: [],
    assignedTeamIds: [],
    totalPrice: 5000,
    depositPaid: 1500,
    notes: '',
  });

  if (!isOpen) return null;

  const serviceOptions = [
    { type: 'Wedding', name: 'تصوير حفل زفاف' },
    { type: 'Event', name: 'تصوير فعالية' },
    { type: 'Conference', name: 'تصوير مؤتمر' },
    { type: 'Real Estate', name: 'تصوير عقار' },
    { type: 'Product', name: 'تصوير منتجات' },
    { type: 'Portrait', name: 'تصوير بورتريه' },
    { type: 'Sports', name: 'تصوير رياضي' },
    { type: 'Food', name: 'تصوير أطعمة' },
    { type: 'Commercial', name: 'تصوير تجاري وإعلانات' },
    { type: 'Video', name: 'إنتاج فيديو سينمائي' },
    { type: 'Social Media', name: 'محتوى مواقع تواصل' },
    { type: 'Other', name: 'خدمة أخرى' },
  ];

  // Auto fill client details if selected from list
  const handleSelectClient = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const cli = clients.find(c => c.id === selectedId);
    if (cli) {
      setFormData(prev => ({
        ...prev,
        clientId: cli.id,
        clientName: cli.name,
        clientType: cli.type,
        companyName: cli.companyName || '',
        phone: cli.phone,
        email: cli.email,
      }));
    }
  };

  // Perform real-time Clash Check for team & equipment
  const clashes = checkClash(
    formData.assignedTeamIds,
    formData.requiredEquipmentIds,
    formData.date,
    formData.startTime,
    formData.endTime
  );

  const hasClashes = clashes.memberConflicts.length > 0 || clashes.equipmentConflicts.length > 0;

  const toggleEquipmentSelection = (eqId) => {
    setFormData(prev => {
      const exists = prev.requiredEquipmentIds.includes(eqId);
      return {
        ...prev,
        requiredEquipmentIds: exists 
          ? prev.requiredEquipmentIds.filter(id => id !== eqId) 
          : [...prev.requiredEquipmentIds, eqId]
      };
    });
  };

  const toggleTeamSelection = (memId) => {
    setFormData(prev => {
      const exists = prev.assignedTeamIds.includes(memId);
      return {
        ...prev,
        assignedTeamIds: exists 
          ? prev.assignedTeamIds.filter(id => id !== memId) 
          : [...prev.assignedTeamIds, memId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create client ID if not selected
    let targetClientId = formData.clientId;
    if (!targetClientId) {
      targetClientId = `cli-${Date.now().toString().slice(-4)}`;
    }

    const createdBooking = addBooking({
      ...formData,
      clientId: targetClientId,
      clientName: formData.clientName || 'عميل جديد',
    });

    onClose();

    if (onOpenWhatsAppModal && createdBooking) {
      onOpenWhatsAppModal(createdBooking);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              إنشاء حجز تصوير جديد (Booking Wizard)
            </h2>
            <p className="text-xs text-slate-500">الخطوة {step} من 3: {step === 1 ? 'بيانات العميل والخدمة' : step === 2 ? 'الموعد والفريق والمعدات' : 'الأسعار والاعتماد'}</p>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-2 bg-brand-50/40 dark:bg-brand-950/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-brand-700 dark:text-brand-300">
          <div className={`flex items-center gap-1 ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">1</span>
            <span>بيانات العميل</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-700">
            <div className="h-full bg-brand-500 transition-all" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          </div>
          <div className={`flex items-center gap-1 ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">2</span>
            <span>الفريق والمعدات</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-700">
            <div className="h-full bg-brand-500 transition-all" style={{ width: step === 3 ? '100%' : '0%' }}></div>
          </div>
          <div className={`flex items-center gap-1 ${step === 3 ? 'text-brand-600' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">3</span>
            <span>التسعير والاعتماد</span>
          </div>
        </div>

        {/* Form Steps Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Client & Service */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اختر عميل مسجل سابقاً أو أنشئ جديداً:</label>
                <select 
                  onChange={handleSelectClient}
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                >
                  <option value="">-- اختيار من قائمة العملاء المسجلين --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'فرد'}) - {c.phone}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم العميل / الجهة *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="مثال: شركة الإبداع للفعاليات" 
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نوع العميل</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, clientType: 'Company' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${formData.clientType === 'Company' ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      شركة / مؤسسة
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, clientType: 'Individual' })}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${formData.clientType === 'Individual' ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      فرد
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 000 0000" 
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@domain.com" 
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نوع الخدمة المطلوب تصويرها *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {serviceOptions.map(s => (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: s.type, serviceName: s.name })}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition ${formData.serviceType === s.type ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 border-brand-500 font-bold' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">موقع التصوير / القاعة *</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مثال: فندق الريتز كارلتون - القاعة الكبرى" 
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date, Team & Gear Assignment */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ التصوير *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وقت البداية *</label>
                  <input 
                    type="time" 
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وقت الانتهاء *</label>
                  <input 
                    type="time" 
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Real-time Clash Alert Warning */}
              {hasClashes && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 space-y-1 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    تحذير تعارض مواعيد ومعدات!
                  </div>
                  {clashes.memberConflicts.map((mc, i) => (
                    <div key={i}>• هذا العضو ({mc.name}) لديه حجز آخر في نفس الموعد: {mc.conflictingBooking.serviceName}</div>
                  ))}
                  {clashes.equipmentConflicts.map((ec, i) => (
                    <div key={i}>• هذه المعدة ({ec.name}) محجوزة لحجز آخر في نفس التوقيت</div>
                  ))}
                </div>
              )}

              {/* Team Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">تعيين أفراد الفريق المطلوبين:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {team.map(m => {
                    const isSelected = formData.assignedTeamIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleTeamSelection(m.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition ${isSelected ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500 ring-1 ring-brand-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                      >
                        <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{m.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Equipment Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">حجز المعدات المطلوبة من المستودع:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 dark:border-slate-700 rounded-xl">
                  {equipment.map(eq => {
                    const isSelected = formData.requiredEquipmentIds.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => toggleEquipmentSelection(eq.id)}
                        className={`p-2 rounded-xl border cursor-pointer flex items-center gap-2 transition ${isSelected ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                      >
                        <Camera className="w-4 h-4 text-brand-500 shrink-0" />
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{eq.name}</div>
                          <div className="text-[10px] text-slate-400">{eq.typeName}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Pricing & Notes */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">السعر الإجمالي (ريال) *</label>
                  <input 
                    type="number" 
                    required
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المبلغ المدفوع مقدمًا / العربون (ريال)</label>
                  <input 
                    type="number" 
                    value={formData.depositPaid}
                    onChange={(e) => setFormData({ ...formData, depositPaid: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">المبلغ المتبقي على العميل:</span>
                  <div className="text-lg font-black text-brand-700 dark:text-brand-300">
                    {Math.max(0, formData.totalPrice - formData.depositPaid).toLocaleString()} ريال
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-brand-500 text-white font-bold text-xs">
                  {formData.depositPaid >= formData.totalPrice ? 'مدفوع بالكامل' : formData.depositPaid > 0 ? 'مؤكد بعربون' : 'غير مدفوع'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات وشروط خاصة بالحجز</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل أي طلبات خاصة للعميل أو تفاصيل الإضاءة والتسليم..." 
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد وإنشاء الحجز</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
