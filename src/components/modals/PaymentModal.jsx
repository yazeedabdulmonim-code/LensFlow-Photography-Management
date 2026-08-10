import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wallet } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, selectedInvoice = null }) => {
  const { recordPayment } = useApp();

  const [amount, setAmount] = useState(selectedInvoice ? selectedInvoice.dueAmount : 1000);
  const [method, setMethod] = useState('Bank Transfer');
  const [referenceNumber, setReferenceNumber] = useState('TRF-' + Math.floor(Math.random() * 900000 + 100000));
  const [notes, setNotes] = useState('سداد دفعة حساب فاتورة');

  if (!isOpen || !selectedInvoice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    recordPayment({
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.invoiceNumber,
      clientId: selectedInvoice.clientId,
      clientName: selectedInvoice.clientName,
      amount: Number(amount),
      method,
      referenceNumber,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            تسجيل دفعة مالية (Record Payment)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
            <div className="text-slate-500">الفاتورة: <strong className="text-brand-600">{selectedInvoice.invoiceNumber}</strong></div>
            <div className="text-slate-500">العميل: <strong>{selectedInvoice.clientName}</strong></div>
            <div className="text-slate-500">المبلغ المتبقي: <strong className="text-red-600 font-mono">{selectedInvoice.dueAmount.toLocaleString()} ريال</strong></div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المبلغ المحصل (ريال) *</label>
            <input 
              type="number" 
              required
              max={selectedInvoice.dueAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-black text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">طريقة الدفع *</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold"
            >
              <option value="Bank Transfer">تحويل بنكي</option>
              <option value="Mada">مدى Mada</option>
              <option value="Credit Card">بطاقة ائتمانية</option>
              <option value="Cash">نقداً Cash</option>
              <option value="Cheque">شيك</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم مرجع الحوالة / الإيصال</label>
            <input 
              type="text" 
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md">تسجيل وتعديل كشف الحساب</button>
          </div>

        </form>

      </div>
    </div>
  );
};
