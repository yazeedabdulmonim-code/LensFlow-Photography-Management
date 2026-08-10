import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Plus, Search, Filter, Printer, Eye, Wallet, CheckCircle2, AlertTriangle
} from 'lucide-react';

export const InvoicesView = ({ onOpenInvoiceModal, setSelectedInvoiceForView, onOpenPaymentModal }) => {
  const { invoices, clients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-500" />
            إدارة الفواتير (Invoices System)
          </h1>
          <p className="text-xs text-slate-500">متابعة الفواتير الضريبية، المبالغ المحصلة، والاستحقاقات المالية</p>
        </div>

        <button
          onClick={onOpenInvoiceModal}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ إنشاء فاتورة</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث برقم الفاتورة، اسم العميل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          />
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-semibold"
        >
          <option value="All">جميع الفواتير</option>
          <option value="Paid">مدفوعة بالكامل</option>
          <option value="Partially Paid">مدفوعة جزئياً</option>
          <option value="Sent">مرسلة</option>
          <option value="Overdue">متأخرة الدفع</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <th className="p-4">رقم الفاتورة</th>
              <th className="p-4">العميل</th>
              <th className="p-4">تاريخ الإصدار</th>
              <th className="p-4">تاريخ الاستحقاق</th>
              <th className="p-4">الإجمالي شامل الضريبة</th>
              <th className="p-4">المستحق</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <td className="p-4 font-mono font-bold text-brand-600 dark:text-brand-400">{inv.invoiceNumber}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{inv.clientName}</div>
                  {inv.companyName && <div className="text-[10px] text-slate-400">{inv.companyName}</div>}
                </td>
                <td className="p-4 text-slate-500 font-mono">{inv.issueDate}</td>
                <td className="p-4 text-slate-500 font-mono">{inv.dueDate}</td>
                <td className="p-4 font-black text-slate-900 dark:text-slate-100 font-mono">{inv.totalAmount.toLocaleString()} ريال</td>
                <td className="p-4 font-bold text-red-600 dark:text-red-400 font-mono">{inv.dueAmount.toLocaleString()} ريال</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                    inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    inv.status === 'Partially Paid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    inv.status === 'Overdue' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {inv.status === 'Paid' ? 'مدفوعة' : inv.status === 'Partially Paid' ? 'جزئية' : inv.status === 'Overdue' ? 'متأخرة' : 'مستحقة'}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => setSelectedInvoiceForView(inv)}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition"
                    title="طباعة ومعاينة الفاتورة"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  {inv.dueAmount > 0 && (
                    <button
                      onClick={() => onOpenPaymentModal(inv)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                    >
                      تسجيل دفعة
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
