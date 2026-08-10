import React from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const PaymentsView = () => {
  const { payments } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            سجل المدفوعات التحصيلية (Payments Log)
          </h1>
          <p className="text-xs text-slate-500">سجل كامل بجميع الحوالات والمدفوعات البنكية والنقدية المستلمة</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              <th className="p-4">رقم الحركة</th>
              <th className="p-4">الفاتورة والمرجع</th>
              <th className="p-4">العميل</th>
              <th className="p-4">المبلغ المستلم</th>
              <th className="p-4">طريقة الدفع</th>
              <th className="p-4">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <td className="p-4 font-mono font-bold text-slate-400">{p.id}</td>
                <td className="p-4">
                  <div className="font-bold text-brand-600 font-mono">{p.invoiceNumber}</div>
                  <div className="text-[10px] text-slate-400 font-mono">مرجع: {p.referenceNumber}</div>
                </td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{p.clientName}</td>
                <td className="p-4 font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">+{p.amount.toLocaleString()} ريال</td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{p.method}</td>
                <td className="p-4 text-slate-500 font-mono">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
