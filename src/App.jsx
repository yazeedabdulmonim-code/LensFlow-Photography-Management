import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/layout/Toast';

// Modals
import { BookingWizardModal } from './components/modals/BookingWizardModal';
import { TaskModal } from './components/modals/TaskModal';
import { EquipmentModal } from './components/modals/EquipmentModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { PublicClientPortalModal } from './components/modals/PublicClientPortalModal';
import { AddMemberModal } from './components/modals/AddMemberModal';
import { EditMemberModal } from './components/modals/EditMemberModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';

// Pages
import { LoginView } from './pages/LoginView';
import { DashboardView } from './pages/DashboardView';
import { BookingsView } from './pages/BookingsView';
import { CalendarView } from './pages/CalendarView';
import { ProjectsView } from './pages/ProjectsView';
import { TasksView } from './pages/TasksView';
import { ClientsView } from './pages/ClientsView';
import { CompaniesView } from './pages/CompaniesView';
import { TeamView } from './pages/TeamView';
import { EquipmentView } from './pages/EquipmentView';
import { InvoicesView } from './pages/InvoicesView';
import { PaymentsView } from './pages/PaymentsView';
import { AccountStatementView } from './pages/AccountStatementView';
import { PerformanceView } from './pages/PerformanceView';
import { NotificationsView } from './pages/NotificationsView';
import { SettingsView } from './pages/SettingsView';

function AppContent() {
  const { resetToSeedData, setUserRole, team, showToast } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lensflow_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [staffPortalTarget, setStaffPortalTarget] = useState(null);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isClientPortalModalOpen, setIsClientPortalModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null);

  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [paymentInvoiceTarget, setPaymentInvoiceTarget] = useState(null);
  const [whatsAppBookingTarget, setWhatsAppBookingTarget] = useState(null);

  // Read URL query parameters for direct email links (e.g. ?staff=usr-yazeed or ?staff=yazeed@lensflow.com)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const staffParam = urlParams.get('staff') || urlParams.get('member') || urlParams.get('email');
    const tabParam = urlParams.get('tab');

    if (staffParam && team && team.length > 0) {
      const matched = team.find(m => 
        m.id.toLowerCase() === staffParam.toLowerCase() ||
        m.email.toLowerCase() === staffParam.toLowerCase() ||
        m.name.toLowerCase().includes(staffParam.toLowerCase())
      );

      if (matched) {
        setIsAuthenticated(true);
        localStorage.setItem('lensflow_auth', 'true');
        setUserRole(matched.role);
        setStaffPortalTarget(matched);
        setActiveTab(tabParam || 'tasks');
        showToast(`🔗 تم الدخول المباشر برابط الإيميل كـ (${matched.name})!`);
      }
    } else if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [team]);

  const handleLoginSuccess = (memberObj) => {
    setIsAuthenticated(true);
    localStorage.setItem('lensflow_auth', 'true');
    setUserRole(memberObj.role);
    setStaffPortalTarget(memberObj);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('lensflow_auth', 'false');
    setStaffPortalTarget(null);
  };

  const handleOpenPaymentModal = (invoice) => {
    setPaymentInvoiceTarget(invoice);
    setIsPaymentModalOpen(true);
  };

  // If not authenticated, render full Login View
  if (!isAuthenticated) {
    return (
      <>
        <LoginView onLoginSuccess={handleLoginSuccess} />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onResetData={resetToSeedData}
        onLogout={handleLogout}
      />

      {/* Main Workspace Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:mr-64 transition-all duration-300 pb-16 md:pb-0">
        
        {/* Top Header */}
        <Header 
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenClientPortal={() => setIsClientPortalModalOpen(true)}
          onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
          onLogout={handleLogout}
          onNavigateToCalendar={() => setActiveTab('calendar')}
        />

        {/* Dynamic Page Container */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView 
              setActiveTab={setActiveTab} 
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsView 
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onOpenWhatsAppModal={(booking) => setWhatsAppBookingTarget(booking)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView 
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
              staffTarget={staffPortalTarget}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'companies' && (
            <CompaniesView />
          )}

          {activeTab === 'team' && (
            <TeamView 
              onOpenAddMemberModal={() => setIsAddMemberModalOpen(true)}
              onOpenEditMemberModal={(member) => setSelectedMemberForEdit(member)}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentView 
              onOpenEquipmentModal={() => setIsEquipmentModalOpen(true)}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoicesView 
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
              setSelectedInvoiceForView={setSelectedInvoiceForView}
              onOpenPaymentModal={handleOpenPaymentModal}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView />
          )}

          {activeTab === 'statements' && (
            <AccountStatementView />
          )}

          {activeTab === 'performance' && (
            <PerformanceView />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView 
              onNavigateToCalendar={() => setActiveTab('calendar')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <BookingWizardModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        onOpenWhatsAppModal={(booking) => setWhatsAppBookingTarget(booking)}
      />

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />

      <EquipmentModal 
        isOpen={isEquipmentModalOpen} 
        onClose={() => setIsEquipmentModalOpen(false)} 
      />

      <InvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
      />

      {/* Viewing Existing Invoice Modal */}
      {selectedInvoiceForView && (
        <InvoiceModal 
          isOpen={true} 
          onClose={() => setSelectedInvoiceForView(null)}
          selectedInvoice={selectedInvoiceForView}
        />
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentInvoiceTarget(null);
        }}
        selectedInvoice={paymentInvoiceTarget}
      />

      <PublicClientPortalModal 
        isOpen={isClientPortalModalOpen} 
        onClose={() => setIsClientPortalModalOpen(false)} 
      />

      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />

      <EditMemberModal 
        isOpen={Boolean(selectedMemberForEdit)} 
        onClose={() => setSelectedMemberForEdit(null)} 
        member={selectedMemberForEdit}
      />

      <EditProfileModal 
        isOpen={isEditProfileModalOpen} 
        onClose={() => setIsEditProfileModalOpen(false)} 
      />

      <WhatsAppModal 
        isOpen={Boolean(whatsAppBookingTarget)} 
        onClose={() => setWhatsAppBookingTarget(null)} 
        booking={whatsAppBookingTarget}
      />

      {/* Global Toast Alert */}
      <Toast />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
