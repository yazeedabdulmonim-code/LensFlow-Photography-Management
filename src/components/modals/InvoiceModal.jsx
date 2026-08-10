import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileText, Plus, Trash2, Printer } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, selectedInvoice = null }) => {
  const { clients, studio, createInvoice, recordPayment } = useApp();

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    clientName: clients[0]?.name || '',
    companyName: clients[0]?.companyName || '',
    clientTaxNumber: clients[0]?.taxNumber || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    items: [
      { description: 'خدمات تصوير وتغطية فوتوغرافي وفيديو', quantity: 1, unitPrice: 5000, total: 5000 }
    ],
    discount: 0,
    notes: 'شكراً لتعاملكم مع LensFlow. تسدد المبالغ خلال الفترة المحددة.',
  });

  if (!isOpen) return null;

  // View Existing Invoice Printable View Mode
  if (selectedInvoice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
          
          {/* Action buttons */}
          <div className="flex justify-between items-center no-print">
            <span className="text-xs font-mono text-slate-400">معاينة الفاتورة قبل الطباعة</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة / حفظ PDF</span>
              </button>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PRINTABLE INVOICE PAPER */}
          <div className="p-6 bg-white text-slate-900 border border-slate-200 rounded-2xl space-y-6 print-shadow-none font-sans">
            
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b pb-6 border-slate-200">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{studio.name}</h2>
                <p className="text-xs text-slate-500">{studio.tagline}</p>
                <div className="text-xs text-slate-500 mt-2">الرقم الضريبي: {studio.taxNumber}</div>
                <div className="text-xs text-slate-500">{studio.address}</div>
              </div>

              <div className="text-left">
                <div className="text-xl font-black text-brand-600">{selectedInvoice.invoiceNumber}</div>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedInvoice.status}
                </span>
                <div className="text-xs text-slate-500 mt-2">تاريخ الإصدار: {selectedInvoice.issueDate}</div>
                <div className="text-xs text-slate-500">تاريخ الاستحقاق: {selectedInvoice.dueDate}</div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">بيانات العميل:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedInvoice.clientName}</div>
                {selectedInvoice.companyName && <div className="text-slate-600">{selectedInvoice.companyName}</div>}
              </div>
              {selectedInvoice.clientTaxNumber && (
                <div className="text-left">
                  <span className="text-slate-400 font-bold block mb-1">الرقم الضريبي للعميل:</span>
                  <div className="font-mono text-slate-800 font-bold">{selectedInvoice.clientTaxNumber}</div>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-2.5">الوصف / الخدمة</th>
                  <th className="p-2.5 text-center">الكمية</th>
                  <th className="p-2.5 text-left">سعر الوحدة</th>
                  <th className="p-2.5 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-medium">{item.description}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-left font-mono">{Number(item.unitPrice).toLocaleString()} ريال</td>
                    <td className="p-2.5 text-left font-bold font-mono">{Number(item.total).toLocaleString()} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono">{selectedInvoice.subtotal?.toLocaleString()} ريال</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>الخصم:</span>
                    <span className="font-mono">-{selectedInvoice.discount?.toLocaleString()} ريال</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span className="font-mono">{selectedInvoice.vatAmount?.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t pt-2">
                  <span>الإجمالي النهائي:</span>
                  <span className="font-mono text-brand-600">{selectedInvoice.totalAmount?.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1">
                  <span>المبلغ المدفوع:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedInvoice.paidAmount?.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>المبلغ المتبقي:</span>
                  <span className="font-mono text-red-600">{selectedInvoice.dueAmount?.toLocaleString()} ريال</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
              <span className="font-bold block mb-1">ملاحظات:</span>
              <p>{selectedInvoice.notes}</p>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Create New Invoice Form Mode
  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index][field] = value;
      if (field === 'quantity' || field === 'unitPrice') {
        updatedItems[index].total = Number(updatedItems[index].quantity || 0) * Number(updatedItems[index].unitPrice || 0);
      }
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const subtotal = formData.items.reduce((sum, i) => sum + (i.total || 0), 0);
  const vatAmount = Math.round((subtotal - (formData.discount || 0)) * 0.15);
  const totalAmount = subtotal - (formData.discount || 0) + vatAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    createInvoice({
      ...formData,
      subtotal,
      vatAmount,
      totalAmount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            إنشاء فاتورة جديدة (Create Invoice)
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اختر العميل *</label>
            <select 
              value={formData.clientId}
              onChange={(e) => {
                const cli = clients.find(c => c.id === e.target.value);
                if (cli) {
                  setFormData({
                    ...formData,
                    clientId: cli.id,
                    clientName: cli.name,
                    companyName: cli.companyName || '',
                    clientTaxNumber: cli.taxNumber || '',
                  });
                }
              }}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'فرد'})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الإصدار</label>
              <input 
                type="date" 
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الاستحقاق *</label>
              <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">الخدمات والبنود:</label>
              <button type="button" onClick={handleAddItem} className="text-brand-600 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> بند جديد
              </button>
            </div>

            {formData.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="الوصف"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
                <input 
                  type="number"
                  placeholder="الكمية"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  className="w-16 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-center"
                />
                <input 
                  type="number"
                  placeholder="السعر"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                  className="w-24 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-left"
                />
                <span className="w-24 font-bold font-mono text-left">{item.total.toLocaleString()} SAR</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-mono font-bold">{subtotal.toLocaleString()} ريال</span>
            </div>
            <div className="flex justify-between text-brand-700 dark:text-brand-300">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span className="font-mono font-bold">{vatAmount.toLocaleString()} ريال</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-slate-100 pt-1 border-t border-brand-200">
              <span>الإجمالي النهائي:</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{totalAmount.toLocaleString()} ريال</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-md">حفظ وإصدار الفاتورة</button>
          </div>

        </form>

      </div>
    </div>
  );
};
