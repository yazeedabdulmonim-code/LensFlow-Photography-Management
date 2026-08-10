import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, Printer, Download, Share2, User, Building } from 'lucide-react';

export const AccountStatementView = () => {
  const { clients, invoices, payments, studio, showToast } = useApp();

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Get invoices & payments for selected client
  const clientInvoices = invoices.filter(i => i.clientId === selectedClientId);
  const clientPayments = payments.filter(p => p.clientId === selectedClientId);

  // Generate Ledger Entries sorted by date
  const ledgerEntries = [];

  clientInvoices.forEach(inv => {
    ledgerEntries.push({
      date: inv.issueDate,
      type: 'Invoice',
      description: `فاتورة ضريبية رقم ${inv.invoiceNumber}`,
      debit: inv.totalAmount, // مدين (يُضاف لحساب العميل)
      credit: 0,
    });
  });

  clientPayments.forEach(pay => {
    ledgerEntries.push({
      date: pay.date,
      type: 'Payment',
      description: `دفعة محصلة (${pay.method}) - مرجع ${pay.referenceNumber}`,
      debit: 0,
      credit: pay.amount, // دائن (يُخصم من حساب العميل)
    });
  });

  // Sort chronological
  ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute running balance
  let runningBalance = 0;
  const ledgerWithBalance = ledgerEntries.map(entry => {
    runningBalance += (entry.debit - entry.credit);
    return { ...entry, balance: runningBalance };
  });

  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
  const netBalance = totalInvoiced - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    showToast('تم إرسال كشف الحساب إلى البريد الإلكتروني للعميل!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-brand-500" />
            كشف حساب العميل (Client Account Statement)
          </h1>
          <p className="text-xs text-slate-500">كشف مالي دقيق يوضح جميع الفواتير الصادرة والدفعات المحصلة والرصيد النهائي</p>
        </div>

        {/* Client Selector & Print Actions */}
        <div className="flex items-center gap-2">
          <select 
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-800 dark:text-slate-200 shadow-sm"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'فرد'})</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة / PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl transition"
            title="مشاركة الكشف مع العميل"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRINTABLE ACCOUNT STATEMENT SHEET */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 print-shadow-none">
        
        {/* Statement Header */}
        <div className="flex justify-between items-start border-b pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{studio.name}</h2>
            <div className="text-xs text-slate-500 mt-1">الرقم الضريبي: {studio.taxNumber}</div>
            <div className="text-xs text-slate-500">{studio.address}</div>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-black text-brand-600 dark:text-brand-400">كشف حساب مالـي</h3>
            <div className="text-xs text-slate-500 mt-1">التاريخ: {new Date().toLocaleDateString('ar-SA')}</div>
          </div>
        </div>

        {/* Client Details Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-bold block mb-1">صادر إلى العميل:</span>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{activeClient?.name}</div>
            {activeClient?.companyName && <div className="text-slate-600 dark:text-slate-400">{activeClient.companyName}</div>}
            <div className="text-slate-500 mt-1">الجوال: {activeClient?.phone} | {activeClient?.email}</div>
          </div>

          <div className="text-right sm:text-left font-mono">
            <span className="text-slate-400 font-bold block mb-1">الرقم الضريبي للعميل:</span>
            <div className="font-bold text-slate-800 dark:text-slate-200">{activeClient?.taxNumber || 'غير مسجل'}</div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-slate-400">إجمالي الفواتير</div>
            <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-1">{totalInvoiced.toLocaleString()} SAR</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-emerald-600 dark:text-emerald-400">إجمالي المدفوعات</div>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">+{totalPaid.toLocaleString()} SAR</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-center">
            <div className="text-red-600 dark:text-red-400">المبالغ المستحقة</div>
            <div className="text-base font-black text-red-600 dark:text-red-400 font-mono mt-1">{netBalance.toLocaleString()} SAR</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-center">
            <div className="text-brand-600 dark:text-brand-400">الرصيد النهائي</div>
            <div className="text-base font-black text-brand-600 dark:text-brand-400 font-mono mt-1">{netBalance.toLocaleString()} SAR</div>
          </div>
        </div>

        {/* Detailed Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3">التاريخ</th>
                <th className="p-3">البيان والحركة</th>
                <th className="p-3 text-left">مدين (Debit)</th>
                <th className="p-3 text-left">دائن (Credit)</th>
                <th className="p-3 text-left">الرصيد النهائي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {ledgerWithBalance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">لا توجد حركات مالية مسجلة لهذا العميل حتى الآن</td>
                </tr>
              ) : (
                ledgerWithBalance.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-3 text-slate-500">{entry.date}</td>
                    <td className="p-3 font-sans font-semibold text-slate-800 dark:text-slate-200">{entry.description}</td>
                    <td className="p-3 text-left font-bold text-slate-900 dark:text-slate-100">
                      {entry.debit > 0 ? `${entry.debit.toLocaleString()} ريال` : '-'}
                    </td>
                    <td className="p-3 text-left font-bold text-emerald-600 dark:text-emerald-400">
                      {entry.credit > 0 ? `${entry.credit.toLocaleString()} ريال` : '-'}
                    </td>
                    <td className="p-3 text-left font-black text-brand-600 dark:text-brand-400">
                      {entry.balance.toLocaleString()} ريال
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
