import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Calendar, CalendarCheck, Briefcase, ClipboardCheck, 
  Users, Building2, UserCheck, Camera, FileText, Wallet, Receipt, 
  TrendingUp, Bell, Settings, LogOut, ChevronRight, Sparkles, Sliders
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onResetData }) => {
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
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 p-2 shadow-lg shadow-brand-500/20 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                LensFlow
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Photography Management</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
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
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
                `}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Reset Data */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-800/50 flex items-center gap-3 mb-2">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-brand-400 font-medium truncate">{userRole}</div>
            </div>
          </div>

          <button
            onClick={onResetData}
            className="w-full py-1.5 text-[11px] text-slate-400 hover:text-red-400 hover:bg-slate-800/40 rounded-lg flex items-center justify-center gap-1.5 transition"
            title="إعادة ضبط كافة البيانات الافتراضية"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>إعادة ضبط البيانات Seed Data</span>
          </button>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex justify-around items-center">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-1.5 text-[10px] ${activeTab === 'dashboard' ? 'text-brand-600 font-bold' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>الرئيسية</span>
        </button>

        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center p-1.5 text-[10px] ${activeTab === 'tasks' ? 'text-brand-600 font-bold' : 'text-slate-500'}`}
        >
          <ClipboardCheck className="w-5 h-5 mb-0.5" />
          <span>مهامي اليوم</span>
        </button>

        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center p-1.5 text-[10px] ${activeTab === 'bookings' ? 'text-brand-600 font-bold' : 'text-slate-500'}`}
        >
          <CalendarCheck className="w-5 h-5 mb-0.5" />
          <span>الحجوزات</span>
        </button>

        <button 
          onClick={() => setActiveTab('equipment')}
          className={`flex flex-col items-center p-1.5 text-[10px] ${activeTab === 'equipment' ? 'text-brand-600 font-bold' : 'text-slate-500'}`}
        >
          <Camera className="w-5 h-5 mb-0.5" />
          <span>المعدات</span>
        </button>

        <button 
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center p-1.5 text-[10px] text-slate-500"
        >
          <Sliders className="w-5 h-5 mb-0.5" />
          <span>المزيد</span>
        </button>
      </div>
    </>
  );
};
