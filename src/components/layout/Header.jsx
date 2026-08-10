import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, Bell, Sun, Moon, Globe, Shield, User, ExternalLink, 
  X, Calendar, Briefcase, Camera, FileText, CheckCircle2, Building, Receipt
} from 'lucide-react';

export const Header = ({ onOpenMobileMenu, onOpenClientPortal }) => {
  const { 
    language, setLanguage, 
    theme, setTheme, 
    userRole, setUserRole, 
    currentUser, 
    notifications, markNotificationRead,
    clients, companies, bookings, projects, tasks, equipment, invoices
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Global Search Filter Logic
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    const results = [];

    clients.filter(c => c.name.toLowerCase().includes(q) || c.companyName?.toLowerCase().includes(q)).forEach(c => {
      results.push({ type: 'client', title: c.name, subtitle: c.companyName || 'عميل فردي', icon: User, data: c });
    });

    companies.filter(c => c.name.toLowerCase().includes(q)).forEach(c => {
      results.push({ type: 'company', title: c.name, subtitle: c.contactPerson, icon: Building, data: c });
    });

    bookings.filter(b => b.clientName.toLowerCase().includes(q) || b.serviceName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)).forEach(b => {
      results.push({ type: 'booking', title: `${b.serviceName} - ${b.clientName}`, subtitle: `${b.date} | ${b.status}`, icon: Calendar, data: b });
    });

    projects.filter(p => p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q)).forEach(p => {
      results.push({ type: 'project', title: p.name, subtitle: `إنجاز ${p.progress}% | ${p.status}`, icon: Briefcase, data: p });
    });

    tasks.filter(t => t.title.toLowerCase().includes(q) || t.assigneeName.toLowerCase().includes(q)).forEach(t => {
      results.push({ type: 'task', title: t.title, subtitle: `المكلف: ${t.assigneeName}`, icon: CheckCircle2, data: t });
    });

    equipment.filter(e => e.name.toLowerCase().includes(q) || e.brand.toLowerCase().includes(q) || e.serialNumber.toLowerCase().includes(q)).forEach(e => {
      results.push({ type: 'equipment', title: `${e.name} (${e.brand})`, subtitle: `الحالة: ${e.status}`, icon: Camera, data: e });
    });

    invoices.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.clientName.toLowerCase().includes(q)).forEach(i => {
      results.push({ type: 'invoice', title: i.invoiceNumber, subtitle: `${i.clientName} | ${i.totalAmount} SAR`, icon: Receipt, data: i });
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Side (Search Bar & Mobile Menu Trigger) */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            aria-label="القائمة الجانبية"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Global Search Input */}
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={language === 'ar' ? 'بحث عن عميل، شركة، حجز، مشروع، مهمة، معدات، فاتورة...' : 'Search clients, bookings, projects, tasks, gear...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchModal(true)}
              className="w-full pl-4 pr-10 py-2 text-sm bg-slate-100 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Search Results Dropdown */}
            {showSearchModal && searchQuery.trim() && (
              <div className="absolute right-0 top-full mt-2 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
                  <span>نتائج البحث ({searchResults.length})</span>
                  <span>اضغط خارجاً للإغلاق</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">لا توجد نتائج تطابق "{searchQuery}"</div>
                  ) : (
                    searchResults.map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            setShowSearchModal(false);
                            setSearchQuery('');
                          }}
                          className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center gap-3 transition"
                        >
                          <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Actions & Switchers) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Public Client Form Portal Button */}
          <button 
            onClick={onOpenClientPortal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-xl transition"
            title="معاينة نموذج طلب العميل لحساب التكلفة التقديرية"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>رابط طلب للعميل</span>
          </button>

          {/* Role Simulator Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
            >
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden md:inline">الصلاحية:</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">{userRole}</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  تبديل الصلاحية للتجربة
                </div>
                {['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor', 'Accountant'].map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setUserRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-right px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 ${userRole === role ? 'font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>{role}</span>
                    {userRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1 text-xs font-bold"
            title="تغيير اللغة"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Toggle (Dark/Light) */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="تبديل الوضع الليلي"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
          </button>

          {/* Notification Center Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">مركز الإشعارات</span>
                  <span className="text-xs text-brand-600 font-medium cursor-pointer" onClick={() => notifications.forEach(n => markNotificationRead(n.id))}>
                    تعليم الكل كـ مقروء
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">لا توجد إشعارات حالياً</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition ${!n.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''}`}
                      >
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-r border-slate-200 dark:border-slate-800 mr-1 pr-1">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30" 
            />
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{currentUser?.name}</div>
              <div className="text-[10px] text-slate-500">{currentUser?.specialty?.slice(0, 18)}</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
