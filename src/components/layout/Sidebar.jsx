import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Calendar, CalendarCheck, Briefcase, ClipboardCheck, 
  Users, Building2, UserCheck, Camera, FileText, Wallet, Receipt, 
  TrendingUp, Bell, Settings, LogOut, ChevronRight, Sparkles, Sliders
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onResetData, onLogout }) => {
  const { userRole, currentUser, studio } = useApp();

  const navigationItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor', 'Assistant', 'Accountant'] },
    { id: 'calendar', label: 'التقويم', icon: Calendar, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor'] },
    { id: 'bookings', label: 'الحجوزات', icon: CalendarCheck, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Accountant'] },
    { id: 'projects', label: 'المشاريع', icon: Briefcase, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor'] },
    { id: 'tasks', label: 'المهام', icon: ClipboardCheck, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor', 'Assistant'] },
    { id: 'clients', label: 'العملاء', icon: Users, roles: ['Admin', 'Manager', 'Accountant'] },
    { id: 'companies', label: 'الشركات', icon: Building2, roles: ['Admin', 'Manager', 'Accountant'] },
    { id: 'team', label: 'الفريق', icon: UserCheck, roles: ['Admin', 'Manager'] },
    { id: 'equipment', label: 'المعدات', icon: Camera, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Assistant'] },
    { id: 'invoices', label: 'الفواتير', icon: FileText, roles: ['Admin', 'Manager', 'Accountant'] },
    { id: 'payments', label: 'المدفوعات', icon: Wallet, roles: ['Admin', 'Manager', 'Accountant'] },
    { id: 'statements', label: 'كشف الحساب', icon: Receipt, roles: ['Admin', 'Manager', 'Accountant'] },
    { id: 'performance', label: 'أداء الفريق', icon: TrendingUp, roles: ['Admin', 'Manager'] },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, roles: ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor', 'Assistant', 'Accountant'] },
    { id: 'settings', label: 'الإعدادات', icon: Settings, roles: ['Admin', 'Manager'] },
  ];

  // Filter menu items by user role
  const allowedItems = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside className={`
        fixed top-0 bottom-0 right-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between
        transition-transform duration-300 ease-in-out border-l border-slate-800
        md:translate-x-0 ${mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        
        {/* Brand Header with Float Micro-animation */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 p-2 shadow-lg shadow-brand-500/30 flex items-center justify-center animate-float">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                تيم عاهد
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Team Ahed Photography</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List with Dynamic Hover Effects */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-bold scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-125 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Reset Data */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          
          {/* Logged in User Profile snippet */}
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.name} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-100 truncate">{currentUser?.name}</div>
                <div className="text-[10px] text-brand-400 font-semibold truncate">{currentUser?.specialty || userRole}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
