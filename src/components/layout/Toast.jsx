import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up max-w-sm">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all
        ${isSuccess 
          ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/80 shadow-emerald-950/30' 
          : 'bg-slate-900/90 text-slate-100 border-slate-700 shadow-slate-950/40'}
      `}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-brand-400 shrink-0" />
        )}
        <div className="text-xs font-semibold leading-relaxed">{toastMessage.message}</div>
      </div>
    </div>
  );
};
