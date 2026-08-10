import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Camera, Calculator, Upload, CheckCircle2, Copy, Sparkles, Building, Phone, Mail, Clock, DollarSign } from 'lucide-react';

export const PublicClientPortalModal = ({ isOpen, onClose }) => {
  const { addClientRequest, showToast } = useApp();

  const [submitted, setSubmitted] = useState(false);
  const [createdQuotation, setCreatedQuotation] = useState(null);

  // Client Public Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    companyName: '',
    shootType: 'Commercial',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    startTime: '10:00',
    location: '',
    hoursCount: 4,
    photographersCount: 1,
    videographersCount: 1,
    services: ['تصوير فوتوغرافي', 'مونتاج سريع'],
    deliverablesCount: 30,
    hasDrone: false,
    hasColorCorrection: true,
    budgetExpected: '10,000 SAR',
    notes: '',
  });

  if (!isOpen) return null;

  // Real-time Automated Cost Estimator (Quotation Calculator)
  const calculateEstimatedCost = () => {
    let basePrice = 2000;
    
    // Shoot type base
    if (formData.shootType === 'Wedding') basePrice += 3500;
    else if (formData.shootType === 'Commercial' || formData.shootType === 'Conference') basePrice += 3000;
    else if (formData.shootType === 'Real Estate') basePrice += 2000;

    // Hours multiplier
    basePrice += (formData.hoursCount - 2) * 400;

    // Photographers & Videographers
    basePrice += (formData.photographersCount - 1) * 1200;
    basePrice += formData.videographersCount * 1500;

    // Addons
    if (formData.hasDrone) basePrice += 1500;
    if (formData.hasColorCorrection) basePrice += 800;

    return Math.max(1500, basePrice);
  };

  const estimatedCost = calculateEstimatedCost();

  const handleToggleService = (service) => {
    setFormData(prev => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists ? prev.services.filter(s => s !== service) : [...prev.services, service]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const req = addClientRequest({
      ...formData,
      estimatedCost,
    });

    setCreatedQuotation(req);
    setSubmitted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href + '#client-request-form');
    showToast('تم نسخ رابط نموذج العميل الحقيقي إلى الحافظة!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Portal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black flex items-center gap-2">
                LensFlow – بوابة طلبات العملاء (Client Portal)
              </h2>
              <p className="text-xs text-brand-200">نموذج حجز طلب وتوليد العرض المبدئي (Quotation Generator)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-brand-500/30 hover:bg-brand-500/50 text-xs font-bold rounded-xl text-brand-100 flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ الرابط</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-5 animate-scale-in my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">تم استلام طلب الحجز بنجاح!</h3>
              <p className="text-xs text-slate-500 mt-1">رقم الطلب التقديري: <span className="font-mono font-bold text-brand-600">{createdQuotation?.id}</span></p>
            </div>

            {/* Calculated Quotation Summary Box */}
            <div className="p-5 max-w-md mx-auto rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right space-y-3">
              <div className="text-xs font-bold text-slate-400 border-b pb-2 dark:border-slate-700 flex justify-between">
                <span>التكلفة التقديرية المبدئية (Quotation Estimate)</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-300">نوع الخدمة: {createdQuotation?.shootType}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{createdQuotation?.hoursCount} ساعات تصوير</span>
              </div>

              <div className="flex justify-between items-center text-lg font-black text-emerald-600 dark:text-emerald-400 pt-2 border-t dark:border-slate-700">
                <span>الإجمالي التقديري:</span>
                <span>{createdQuotation?.estimatedCost.toLocaleString()} ريال</span>
              </div>

              <p className="text-[11px] text-slate-400">
                * ملاحظة: هذا العرض يعتبر تقديرياً مبدئياً ولا يعتبر فاتورة نهائية حتى يتم اعتماده وتأكيده من قِبل إدارة LensFlow.
              </p>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition"
            >
              العودة إلى لوحة التحكم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Real-time Quotation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950/60 dark:to-slate-800 border border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">الحاسبة التلقائية للتكلفة التقديرية</div>
                  <div className="text-[10px] text-slate-500">يتغير السعر ديناميكياً مع الساعات، المصورين، والخدمات الإضافية</div>
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs text-slate-500">التكلفة التقديرية:</div>
                <div className="text-xl font-black text-brand-700 dark:text-brand-300">{estimatedCost.toLocaleString()} SAR</div>
              </div>
            </div>

            {/* Section 1: Client Data */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">1. بيانات التواصل والشركة</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="مثال: عبد الله السعد" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الشركة / الجهة (اختياري)</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="مثال: شركة الرواد" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 000 0000" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@company.sa" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shoot Scope */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">2. تفاصيل الجلسة والتغطية</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نوع التصوير *</label>
                  <select 
                    value={formData.shootType}
                    onChange={(e) => setFormData({ ...formData, shootType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
                  >
                    <option value="Commercial">إعلاني / تجاري</option>
                    <option value="Wedding">حفل زفاف</option>
                    <option value="Conference">مؤتمر / فعالية</option>
                    <option value="Real Estate">عقارات ومعمار</option>
                    <option value="Product">منتجات</option>
                    <option value="Portrait">بورتريه</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الجلسة *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عدد الساعات المتوقعة</label>
                  <input 
                    type="number" 
                    min={1} max={24}
                    value={formData.hoursCount}
                    onChange={(e) => setFormData({ ...formData, hoursCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الموقع / المدينة *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="الرياض - برح المجدول" 
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عدد المصورين</label>
                    <input 
                      type="number" 
                      min={0} max={10}
                      value={formData.photographersCount}
                      onChange={(e) => setFormData({ ...formData, photographersCount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عدد الفيديوغرافيين</label>
                    <input 
                      type="number" 
                      min={0} max={10}
                      value={formData.videographersCount}
                      onChange={(e) => setFormData({ ...formData, videographersCount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Section 3: Addons & Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <h3 className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">3. الإضافات والملاحظات</h3>
              
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input 
                    type="checkbox"
                    checked={formData.hasDrone}
                    onChange={(e) => setFormData({ ...formData, hasDrone: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>تصوير درون جوي 4K (+1,500 SAR)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input 
                    type="checkbox"
                    checked={formData.hasColorCorrection}
                    onChange={(e) => setFormData({ ...formData, hasColorCorrection: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>معالجة وتصحيح ألوان احترافي (+800 SAR)</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات ورغبات العميل</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="اكتب أي شروط خاصة أو أفكار ملهمة..." 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب وحساب العرض المبدئي</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
