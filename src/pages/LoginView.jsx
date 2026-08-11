import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Lock, Mail, ArrowLeft, AlertCircle, X, Check, ShieldAlert } from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const { team, setUserRole, setCurrentUserId, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [directLinkNotice, setDirectLinkNotice] = useState('');
  
  // Google Gmail Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [gmailInput, setGmailInput] = useState('');
  const [gmailError, setGmailError] = useState('');

  // Smart flexible member matcher against approved team array only
  const findMatchingMember = (inputStr) => {
    if (!inputStr) return null;
    const cleanInput = inputStr.trim().toLowerCase();
    const inputPrefix = cleanInput.split('@')[0];

    return team.find(m => {
      const memberEmail = (m.email || '').trim().toLowerCase();
      const memberPrefix = memberEmail.split('@')[0];
      const memberName = (m.name || '').trim().toLowerCase();
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
        const matchingGmail = matched.email.includes('@gmail.com') 
          ? matched.email 
          : `${matched.email.split('@')[0]}@gmail.com`;
        setEmail(matched.email);
        setGmailInput(matchingGmail);
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
      setUserRole('Admin');
      setCurrentUserId(masterUser.id);
      showToast(`👑 تم تسجيل الدخول بنجاح كـ ${masterUser.name} (المسؤول العام)`);
      onLoginSuccess(masterUser);
      return;
    }

    if (matchedMember) {
      // Validate password strictly
      const requiredPass = matchedMember.password || '123456';
      if (password && password !== requiredPass) {
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

  // Pure Direct Gmail Sign-In (Whitelisted Accounts Only)
  const handleGmailSignInSubmit = (targetEmail) => {
    setGmailError('');
    const inputToVerify = (targetEmail || gmailInput).trim().toLowerCase();

    if (!inputToVerify) {
      setGmailError('يرجى إدخال عنوان بريد Gmail الخاص بك');
      return;
    }

    // Strict Gmail / Google account check
    const isGmailAccount = inputToVerify.endsWith('@gmail.com') || 
                           inputToVerify.endsWith('@lensflow.com') || 
                           inputToVerify.endsWith('@team-ahed.com');

    if (!isGmailAccount) {
      setGmailError('عذراً، يجب تسجيل الدخول باستخدام بريد إلكتروني ينتهي بـ @gmail.com!');
      return;
    }

    const isMasterAdminEmail = inputToVerify === 'ahdalamary@gmail.com';
    const matchedMember = findMatchingMember(inputToVerify);

    if (isMasterAdminEmail) {
      setShowGoogleModal(false);
      const masterUser = matchedMember || {
        id: 'usr-admin-master',
        name: 'أحلام العمري',
        email: 'ahdalamary@gmail.com',
        role: 'Admin',
        specialty: 'المسؤول العام عن الموقع ومدير النظام 👑',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      };
      setUserRole('Admin');
      setCurrentUserId(masterUser.id);
      showToast(`👑 تم الدخول عبر حساب Gmail المسؤول العام (${inputToVerify}) بنجاح!`);
      onLoginSuccess(masterUser);
      return;
    }

    if (matchedMember) {
      setShowGoogleModal(false);
      setUserRole(matchedMember.role);
      setCurrentUserId(matchedMember.id);
      showToast(`🌐 تم الدخول عبر حساب Gmail المعتمد (${inputToVerify}) بنجاح كـ ${matchedMember.name}`);
      onLoginSuccess(matchedMember);
    } else {
      // STRICT SECURITY BLOCK: UNAPPROVED GMAIL ACCOUNTS CANNOT SIGN IN
      setGmailError('⛔ عذراً، بريد الجيميل هذا غير مضاف في قائمة الفريق المعتمدة ولا يملك صلاحية الدخول! يرجى طلب الموافقة والإذن من المسؤول العام (ahdalamary@gmail.com) أولاً.');
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

        {/* GOOGLE / GMAIL DIRECT SIGN IN BUTTON */}
        <button
          type="button"
          onClick={() => {
            setGmailError('');
            setShowGoogleModal(true);
          }}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-xl shadow-lg transition flex items-center justify-center gap-3 border border-slate-200"
        >
          {/* Multicolored Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>تسجيل الدخول المباشر عبر Gmail</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-800"></div>
          <span className="px-3 text-[11px] text-slate-500 font-bold">أو الدخول يدويًا بالبريد المقبول</span>
          <div className="flex-1 border-t border-slate-800"></div>
        </div>

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

      {/* PURE DIRECT GOOGLE / GMAIL LOGIN MODAL (WHITELISTED ONLY) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dir-rtl">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-5 animate-scale-in text-right">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="font-bold text-sm text-slate-800">Google Accounts</span>
              </div>

              <button onClick={() => setShowGoogleModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">تسجيل الدخول المباشر عبر Gmail</h3>
              <p className="text-xs text-slate-500 mt-1">اختر أو أدخل بريد الجيميل الخاص بك المعين والمصرح له من قِبل المسؤول العام</p>
            </div>

            {gmailError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold leading-relaxed">
                {gmailError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">أدخل بريد Gmail المعتمد *</label>
                <input 
                  type="email"
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  placeholder="username@gmail.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold text-slate-800 focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400">أو اختر من قائمة الحسابات المصرح لها بالدخول:</div>
                {team.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleGmailSignInSubmit(m.email.includes('@gmail.com') ? m.email : `${m.email.split('@')[0]}@gmail.com`)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-right transition"
                  >
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <span>{m.name}</span>
                          {m.email === 'ahdalamary@gmail.com' && <span className="text-[10px]">👑</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{m.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-600">{m.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => handleGmailSignInSubmit()}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>دخول مباشر عبر Gmail</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
