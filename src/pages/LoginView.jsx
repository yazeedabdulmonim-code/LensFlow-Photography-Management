import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Lock, Mail, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { team, setUserRole, setCurrentUserId, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [directLinkNotice, setDirectLinkNotice] = useState('');

  // Smart flexible member matcher against approved team array only
  const findMatchingMember = (inputStr) => {
    if (!inputStr) return null;
    const cleanInput = inputStr.trim().toLowerCase();
    const inputPrefix = cleanInput.split('@')[0];

    return team.find(m => {
      const memberEmail = (m.email || '').trim().toLowerCase();
      const memberPrefix = memberEmail.split('@')[0];
      const memberId = (m.id || '').trim().toLowerCase();

      return (
        memberEmail === cleanInput ||
        memberPrefix === inputPrefix ||
        memberId === cleanInput
      );
    });
  };

  // Read URL params to prefill staff email when arriving from email links
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const staffQuery = urlParams.get('staff') || urlParams.get('email') || urlParams.get('member');

    if (staffQuery) {
      const matched = findMatchingMember(staffQuery);

      if (matched) {
        setEmail(matched.email);
        setDirectLinkNotice(`👋 أهلاً بك يا ${matched.name} (${matched.role})، يرجى تأكيد الدخول ببريدك المعتمد بالمنظومة.`);
      }
    }
  }, [team]);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني الخاص بك');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isMasterAdminEmail = cleanEmail === 'ahdalamary@gmail.com';
    const matchedMember = findMatchingMember(cleanEmail);
    
    if (isMasterAdminEmail) {
      const masterUser = matchedMember || {
        id: 'usr-admin-master',
        name: 'أحلام العمري',
        email: 'ahdalamary@gmail.com',
        role: 'Admin',
        specialty: 'المسؤول العام عن الموقع ومدير النظام 👑',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      };
      
      // Strict password validation for admin
      const requiredPass = masterUser.password || 'admin';
      if (!password || String(password).trim() !== String(requiredPass).trim()) {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى التأكد من الرمز الخاص بحسابك');
        return;
      }

      setUserRole('Admin');
      setCurrentUserId(masterUser.id);
      showToast(`👑 تم تسجيل الدخول بنجاح كـ ${masterUser.name} (المسؤول العام)`);
      onLoginSuccess(masterUser);
      return;
    }

    if (matchedMember) {
      // Validate password strictly
      const requiredPass = matchedMember.password || '123456';
      if (!password || String(password).trim() !== String(requiredPass).trim()) {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى التأكد من الرمز الخاص بحسابك');
        return;
      }

      setUserRole(matchedMember.role);
      setCurrentUserId(matchedMember.id);
      showToast(`تم تسجيل الدخول بنجاح كـ ${matchedMember.name} (${matchedMember.role})`);
      onLoginSuccess(matchedMember);
    } else {
      // STRICT SECURITY BLOCK: NO UNAPPROVED EMAILS ALLOWED
      setErrorMessage('⛔ عذراً، هذا البريد غير مسجل بالفريق ولا يملك إذن الدخول للموقع! تواصل مع المسؤول العام (ahdalamary@gmail.com) للموافقة وإضافة حسابك.');
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans dir-rtl">
      
      {/* Background Gradients & Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10 animate-scale-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-3 shadow-xl shadow-brand-500/30 mx-auto flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            تيم عاهد
            <span className="w-2 h-2 rounded-full bg-brand-400"></span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">تسجيل دخول الموظفين المصرح لهم فقط عبر Google (Gmail)</p>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-[11px] text-amber-200 flex items-center gap-2 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>الدخول مقتصر حصرياً على الحسابات المعتمدة بإذن من المسؤول العام (ahdalamary@gmail.com).</span>
        </div>

        {directLinkNotice && (
          <div className="p-3.5 bg-brand-950/80 border border-brand-800 text-brand-200 rounded-xl text-xs font-bold leading-relaxed">
            {directLinkNotice}
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-950/90 border border-red-800 text-red-200 rounded-2xl text-xs font-bold flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}



        {/* Standard Email / Password Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني المعتمد *</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com" 
                className="w-full pl-4 pr-10 py-3 bg-slate-800/80 border border-slate-700 text-white rounded-xl outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">رمز المرور الخاص بالحساب *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-4 pr-10 py-3 bg-slate-800/80 border border-slate-700 text-white rounded-xl outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>تذكر حسابي على هذا الجهاز</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-black rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2"
          >
            <span>دخول بالبريد الإلكتروني المعتمد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

        </form>

      </div>



    </div>
  );
};
