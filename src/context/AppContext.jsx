import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSeedData } from '../data/seedData';
import confetti from 'canvas-confetti';
import { sendWhatsAppNotification } from '../services/whatsappService';
import { fetchTeamFromCloud, saveTeamToCloud } from '../services/cloudSyncService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme & Language state
  const [language, setLanguage] = useState(() => localStorage.getItem('lensflow_lang') || 'ar');
  const [theme, setTheme] = useState(() => localStorage.getItem('lensflow_theme') || 'light');
  
  // Auth Role state
  const [userRole, setUserRole] = useState(() => localStorage.getItem('lensflow_role') || 'Admin');
  
  // Data Collections with LocalStorage fallback
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [studio, setStudio] = useState(() => {
    const saved = localStorage.getItem('lensflow_studio');
    return saved ? JSON.parse(saved) : initialSeedData.studio;
  });

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('lensflow_team');
    return saved ? JSON.parse(saved) : initialSeedData.team;
  });

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('lensflow_companies');
    return saved ? JSON.parse(saved) : initialSeedData.companies;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('lensflow_clients');
    return saved ? JSON.parse(saved) : initialSeedData.clients;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('lensflow_bookings');
    return saved ? JSON.parse(saved) : initialSeedData.bookings;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('lensflow_projects');
    return saved ? JSON.parse(saved) : initialSeedData.projects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lensflow_tasks');
    return saved ? JSON.parse(saved) : initialSeedData.tasks;
  });

  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem('lensflow_equipment');
    return saved ? JSON.parse(saved) : initialSeedData.equipment;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('lensflow_invoices');
    return saved ? JSON.parse(saved) : initialSeedData.invoices;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('lensflow_payments');
    return saved ? JSON.parse(saved) : initialSeedData.payments;
  });

  const [clientRequests, setClientRequests] = useState(() => {
    const saved = localStorage.getItem('lensflow_client_requests');
    return saved ? JSON.parse(saved) : initialSeedData.clientRequests;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('lensflow_notifications');
    return saved ? JSON.parse(saved) : initialSeedData.notifications;
  });

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync Language & RTL to HTML
  useEffect(() => {
    localStorage.setItem('lensflow_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync Theme to HTML
  useEffect(() => {
    localStorage.setItem('lensflow_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Role
  useEffect(() => {
    localStorage.setItem('lensflow_role', userRole);
  }, [userRole]);

  // Persist State Changes
  useEffect(() => localStorage.setItem('lensflow_studio', JSON.stringify(studio)), [studio]);
  // Initial Cloud Sync Mount
  useEffect(() => {
    const initCloudSync = async () => {
      const cloudTeam = await fetchTeamFromCloud();
      if (cloudTeam && Array.isArray(cloudTeam) && cloudTeam.length > 0) {
        setTeam(cloudTeam);
        localStorage.setItem('lensflow_team', JSON.stringify(cloudTeam));
      } else {
        // Seed cloud if empty or fails
        await saveTeamToCloud(team);
      }
      setIsCloudLoaded(true);
    };
    initCloudSync();
  }, []);

  useEffect(() => {
    if (!isCloudLoaded) return; // Prevent overwriting cloud with initial state
    localStorage.setItem('lensflow_team', JSON.stringify(team));
    saveTeamToCloud(team); // Persist live update to Cloud
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('lensflow_live_sync_channel');
        bc.postMessage({ type: 'team_updated', timestamp: Date.now() });
        bc.close();
      } catch (err) {}
    }
  }, [team]);

  useEffect(() => {
    localStorage.setItem('lensflow_tasks', JSON.stringify(tasks));
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('lensflow_live_sync_channel');
        bc.postMessage({ type: 'tasks_updated', timestamp: Date.now() });
        bc.close();
      } catch (err) {}
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lensflow_bookings', JSON.stringify(bookings));
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('lensflow_live_sync_channel');
        bc.postMessage({ type: 'bookings_updated', timestamp: Date.now() });
        bc.close();
      } catch (err) {}
    }
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('lensflow_projects', JSON.stringify(projects));
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('lensflow_live_sync_channel');
        bc.postMessage({ type: 'projects_updated', timestamp: Date.now() });
        bc.close();
      } catch (err) {}
    }
  }, [projects]);

  useEffect(() => localStorage.setItem('lensflow_companies', JSON.stringify(companies)), [companies]);
  useEffect(() => localStorage.setItem('lensflow_clients', JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem('lensflow_equipment', JSON.stringify(equipment)), [equipment]);
  useEffect(() => localStorage.setItem('lensflow_invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem('lensflow_payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('lensflow_client_requests', JSON.stringify(clientRequests)), [clientRequests]);
  useEffect(() => localStorage.setItem('lensflow_notifications', JSON.stringify(notifications)), [notifications]);

  // LIGHTNING-FAST INSTANT LIVE REAL-TIME SYNC ENGINE (BroadcastChannel + Storage + Cloud Sync Heartbeat)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncAllStatesFromStorage = () => {
      try {
        const sTeam = localStorage.getItem('lensflow_team');
        if (sTeam) setTeam(prev => JSON.stringify(prev) !== sTeam ? JSON.parse(sTeam) : prev);

        const sTasks = localStorage.getItem('lensflow_tasks');
        if (sTasks) setTasks(prev => JSON.stringify(prev) !== sTasks ? JSON.parse(sTasks) : prev);

        const sBookings = localStorage.getItem('lensflow_bookings');
        if (sBookings) setBookings(prev => JSON.stringify(prev) !== sBookings ? JSON.parse(sBookings) : prev);

        const sProjects = localStorage.getItem('lensflow_projects');
        if (sProjects) setProjects(prev => JSON.stringify(prev) !== sProjects ? JSON.parse(sProjects) : prev);

        const sEquipment = localStorage.getItem('lensflow_equipment');
        if (sEquipment) setEquipment(prev => JSON.stringify(prev) !== sEquipment ? JSON.parse(sEquipment) : prev);

        const sCompanies = localStorage.getItem('lensflow_companies');
        if (sCompanies) setCompanies(prev => JSON.stringify(prev) !== sCompanies ? JSON.parse(sCompanies) : prev);

        const sInvoices = localStorage.getItem('lensflow_invoices');
        if (sInvoices) setInvoices(prev => JSON.stringify(prev) !== sInvoices ? JSON.parse(sInvoices) : prev);
      } catch (err) {
        console.error('Error during live sync execution:', err);
      }
    };

    const syncCloudTeam = async () => {
      try {
        const cloudTeam = await fetchTeamFromCloud();
        if (cloudTeam && Array.isArray(cloudTeam) && cloudTeam.length > 0) {
          const localTeamStr = localStorage.getItem('lensflow_team');
          const cloudTeamStr = JSON.stringify(cloudTeam);
          if (localTeamStr !== cloudTeamStr) {
            setTeam(cloudTeam);
            localStorage.setItem('lensflow_team', cloudTeamStr);
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (err) {
        console.warn('Silent cloud sync update check failed:', err);
      }
    };

    // 1. Storage Event Listener
    const handleStorageUpdate = (e) => {
      syncAllStatesFromStorage();
    };
    window.addEventListener('storage', handleStorageUpdate);

    // 2. BroadcastChannel Live Listener
    let bc = null;
    if (window.BroadcastChannel) {
      try {
        bc = new BroadcastChannel('lensflow_live_sync_channel');
        bc.onmessage = () => syncAllStatesFromStorage();
      } catch (err) {}
    }

    // 3. Fast 1.5s Background Heartbeat Pulse for Tabs, and 3s Cloud Poll
    const localIntervalId = setInterval(syncAllStatesFromStorage, 1500);
    const cloudIntervalId = setInterval(syncCloudTeam, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      if (bc) bc.close();
      clearInterval(localIntervalId);
      clearInterval(cloudIntervalId);
    };
  }, []);

  // Current User ID State
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('lensflow_current_user_id') || '');

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('lensflow_current_user_id', currentUserId);
    }
  }, [currentUserId]);

  // Currently logged in member based on currentUserId or active role
  const currentUser = team.find(m => m.id === currentUserId) || team.find(m => m.role === userRole) || team[0];

  // Helper: Clash Detection
  const checkClash = (memberIds = [], equipmentIds = [], date, startTime, endTime, excludeBookingId = null) => {
    const conflicts = { memberConflicts: [], equipmentConflicts: [] };
    if (!date) return conflicts;

    const sameDayBookings = bookings.filter(b => b.date === date && b.id !== excludeBookingId && b.status !== 'Cancelled');

    sameDayBookings.forEach(b => {
      // Check time overlap
      const hasTimeOverlap = !(endTime <= b.startTime || startTime >= b.endTime);
      if (hasTimeOverlap) {
        // Check member clashes
        b.assignedTeamIds?.forEach(memId => {
          if (memberIds.includes(memId)) {
            const memberObj = team.find(t => t.id === memId);
            if (memberObj && !conflicts.memberConflicts.some(c => c.id === memberObj.id)) {
              conflicts.memberConflicts.push({
                ...memberObj,
                conflictingBooking: b,
              });
            }
          }
        });

        // Check equipment clashes
        b.requiredEquipmentIds?.forEach(eqId => {
          if (equipmentIds.includes(eqId)) {
            const eqObj = equipment.find(e => e.id === eqId);
            if (eqObj && !conflicts.equipmentConflicts.some(c => c.id === eqObj.id)) {
              conflicts.equipmentConflicts.push({
                ...eqObj,
                conflictingBooking: b,
              });
            }
          }
        });
      }
    });

    return conflicts;
  };

  // Action: Add Booking
  const addBooking = (newBookingData) => {
    const id = `bk-${Date.now().toString().slice(-4)}`;
    const newBooking = {
      id,
      createdAt: new Date().toISOString().split('T')[0],
      paymentStatus: newBookingData.depositPaid >= newBookingData.totalPrice ? 'Paid' : newBookingData.depositPaid > 0 ? 'Partially Paid' : 'Unpaid',
      remainingAmount: Math.max(0, newBookingData.totalPrice - (newBookingData.depositPaid || 0)),
      status: 'Confirmed',
      ...newBookingData,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update equipment statuses to 'Reserved' or 'In Use'
    if (newBooking.requiredEquipmentIds && newBooking.requiredEquipmentIds.length > 0) {
      setEquipment(prev => prev.map(eq => {
        if (newBooking.requiredEquipmentIds.includes(eq.id)) {
          return { ...eq, status: 'Reserved', currentBookingId: id };
        }
        return eq;
      }));
    }

    // Send Email & WhatsApp notification to all assigned team members for this booking
    if (newBooking.assignedTeamIds && newBooking.assignedTeamIds.length > 0) {
      newBooking.assignedTeamIds.forEach(memberId => {
        const teamMember = team.find(t => t.id === memberId);
        if (teamMember) {
          // 1. Email Notification
          sendEmailToStaff({
            toEmail: teamMember.email,
            toName: teamMember.name,
            subject: `حجز تصوير جديد مخصص لك: ${newBooking.serviceName}`,
            body: `مرحباً ${teamMember.name}، تم إسناد حجز تصوير (${newBooking.serviceName}) لك في موقع (${newBooking.location}) بتاريخ ${newBooking.date} الساعة ${newBooking.startTime}.`,
            type: 'booking',
          });

          // 2. WhatsApp Notification Link & Trigger
          const waResult = sendWhatsAppNotification({
            phone: teamMember.phone,
            name: teamMember.name,
            serviceName: newBooking.serviceName,
            clientName: newBooking.clientName,
            date: newBooking.date,
            time: `${newBooking.startTime} - ${newBooking.endTime}`,
            location: newBooking.location,
          });

          // Open WhatsApp web window in background if on desktop
          if (typeof window !== 'undefined' && waResult.waUrl) {
            window.open(waResult.waUrl, '_blank');
          }
        }
      });
    }

    // Add Audit Notification with targetDate for calendar highlight
    addNotification({
      title: 'حجز جديد تم إنشاؤه',
      message: `تم إنشاء حجز جديد للعميل ${newBooking.clientName} بتاريخ ${newBooking.date}`,
      type: 'booking',
      targetDate: newBooking.date,
    });

    showToast(`📲 تم إرسال الإشعار، الإيميل، ورسالة الواتساب 💬 لكافة طاقم العمل بتاريخ (${newBooking.date})!`);
    return newBooking;
  };

  // Action: Convert Booking to Project
  const convertBookingToProject = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const projectId = `prj-${Date.now().toString().slice(-4)}`;
    const newProject = {
      id: projectId,
      bookingId: booking.id,
      name: `مشروع: ${booking.serviceName} - ${booking.clientName}`,
      clientId: booking.clientId,
      clientName: booking.clientName,
      serviceType: booking.serviceType,
      status: 'In Progress',
      progress: 10,
      budget: booking.totalPrice,
      startDate: booking.date,
      deliveryDate: new Date(new Date(booking.date).setDate(new Date(booking.date).getDate() + 7)).toISOString().split('T')[0],
      assignedTeamIds: booking.assignedTeamIds || [],
      assignedEquipmentIds: booking.requiredEquipmentIds || [],
      description: booking.notes || `مشروع جديد ناتج عن الحجز رقم ${booking.id}`,
    };

    setProjects(prev => [newProject, ...prev]);

    // Generate Standard Workflow Tasks for Project
    const initialTasks = [
      {
        id: `tsk-${Date.now()}-1`,
        title: `تجهيز معدات والكاميرات لمشروع ${booking.serviceName}`,
        projectId: newProject.id,
        projectName: newProject.name,
        clientId: newProject.clientId,
        assigneeId: booking.assignedTeamIds[0] || team[0].id,
        assigneeName: team.find(t => t.id === booking.assignedTeamIds[0])?.name || team[0].name,
        startDate: booking.date,
        dueDate: booking.date,
        priority: 'High',
        status: 'Pending',
        notes: 'فحص شحن البطاريات، تهيئة بطاقات الذاكرة',
        startedAt: null,
        completedAt: null,
        checklist: [
          { id: `ck-a`, title: 'فحص وتجهيز الكاميرات والعدسات', done: false },
          { id: `ck-b`, title: 'شحن البطاريات بالكامل', done: false }
        ]
      },
      {
        id: `tsk-${Date.now()}-2`,
        title: `تصوير الجلسة والتغطية الميدانية`,
        projectId: newProject.id,
        projectName: newProject.name,
        clientId: newProject.clientId,
        assigneeId: booking.assignedTeamIds[0] || team[1].id,
        assigneeName: team.find(t => t.id === booking.assignedTeamIds[0])?.name || team[1].name,
        startDate: booking.date,
        dueDate: booking.date,
        priority: 'High',
        status: 'Pending',
        notes: 'حسب الخطة والموقع المعتمد',
        startedAt: null,
        completedAt: null,
        checklist: []
      },
      {
        id: `tsk-${Date.now()}-3`,
        title: `رفع الملفات وإنشاء النسخ الاحتياطي (Backup)`,
        projectId: newProject.id,
        projectName: newProject.name,
        clientId: newProject.clientId,
        assigneeId: booking.assignedTeamIds[1] || team[2].id,
        assigneeName: team.find(t => t.id === booking.assignedTeamIds[1])?.name || team[2].name,
        startDate: booking.date,
        dueDate: new Date(new Date(booking.date).setDate(new Date(booking.date).getDate() + 1)).toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Pending',
        notes: 'تخزين المواد الخام RAW',
        startedAt: null,
        completedAt: null,
        checklist: []
      },
      {
        id: `tsk-${Date.now()}-4`,
        title: `معالجة وتعديل الصور / المونتاج`,
        projectId: newProject.id,
        projectName: newProject.name,
        clientId: newProject.clientId,
        assigneeId: team.find(t => t.role === 'Editor')?.id || team[3].id,
        assigneeName: team.find(t => t.role === 'Editor')?.name || team[3].name,
        startDate: new Date(new Date(booking.date).setDate(new Date(booking.date).getDate() + 1)).toISOString().split('T')[0],
        dueDate: newProject.deliveryDate,
        priority: 'Medium',
        status: 'Pending',
        notes: 'التسليم بالتنسيق المعتمد',
        startedAt: null,
        completedAt: null,
        checklist: []
      }
    ];

    setTasks(prev => [...initialTasks, ...prev]);

    // Update booking status
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'In Progress' } : b));

    addNotification({
      title: 'تحويل حجز إلى مشروع',
      message: `تم تحويل الحجز ${booking.id} إلى مشروع جديد ومُزامنة المهام والمعدات تلقائياً`,
      type: 'project',
    });

    showToast('تم تحويل الحجز إلى مشروع بنجاح!');
    return newProject;
  };

  // Action: Update Task Status with Auto Progress Calculation
  const updateTaskStatus = (taskId, newStatus) => {
    const now = new Date().toISOString();
    
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const isCompleting = newStatus === 'Completed' && t.status !== 'Completed';
          if (isCompleting) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            showToast('تم إنجاز المهمة بنجاح ✓', 'success');
          }
          return {
            ...t,
            status: newStatus,
            startedAt: newStatus === 'In Progress' && !t.startedAt ? now : t.startedAt,
            completedAt: newStatus === 'Completed' ? now : (newStatus === 'Pending' ? null : t.completedAt),
          };
        }
        return t;
      });

      // Recalculate linked project progress %
      const targetTask = updated.find(t => t.id === taskId);
      if (targetTask && targetTask.projectId) {
        const projectTasks = updated.filter(t => t.projectId === targetTask.projectId);
        const completedCount = projectTasks.filter(t => t.status === 'Completed').length;
        const totalCount = projectTasks.length;
        const calcProgress = Math.round((completedCount / totalCount) * 100);

        setProjects(pList => pList.map(p => {
          if (p.id === targetTask.projectId) {
            return {
              ...p,
              progress: calcProgress,
              status: calcProgress === 100 ? 'Completed' : p.status,
            };
          }
          return p;
        }));
      }

      return updated;
    });
  };

  // Action: Add Company
  const addCompany = (companyData) => {
    const id = `cmp-${Date.now().toString().slice(-4)}`;
    const newCompany = {
      id,
      logo: companyData.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      ...companyData,
    };
    setCompanies(prev => [newCompany, ...prev]);
    showToast(`تمت إضافة الشركة (${newCompany.name}) بنجاح إلى سجل الشركات!`);
    return newCompany;
  };

  // Action: Toggle Checklist Item
  const toggleChecklistItem = (taskId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c)
        };
      }
      return t;
    }));
  };

  // Action: Create Task
  const addTask = (newTaskData) => {
    const newTask = {
      id: `tsk-${Date.now()}`,
      status: 'Pending',
      startedAt: null,
      completedAt: null,
      checklist: [],
      ...newTaskData,
    };
    setTasks(prev => [newTask, ...prev]);

    // Send notification & Email to assignee
    const assigneeMember = team.find(t => t.id === newTask.assigneeId);
    if (assigneeMember) {
      sendEmailToStaff({
        toEmail: assigneeMember.email,
        toName: assigneeMember.name,
        subject: `مهمة جديدة مُسندة إليك: ${newTask.title}`,
        body: `مرحباً ${assigneeMember.name}، تم إسناد المهمة (${newTask.title}) لك بموعد تسليم ${newTask.dueDate || 'قريباً'}.`,
        type: 'task',
      });
    }

    addNotification({
      title: 'مهمة جديدة مُسندة إليك',
      message: `تم تعيين المهمة "${newTask.title}" للموظف ${assigneeMember?.name || ''}`,
      type: 'task',
      targetDate: newTask.dueDate || '2026-08-15',
    });

    showToast('تم إضافة المهمة وإرسال إشعار بريدي للموظف بنجاح');
  };

  // Action: Add Equipment
  const addEquipment = (eqData) => {
    const newEq = {
      id: `eq-${Date.now().toString().slice(-4)}`,
      status: 'Available',
      assignedToMemberId: null,
      assignedToMemberName: '',
      currentBookingId: null,
      ...eqData,
    };
    setEquipment(prev => [newEq, ...prev]);
    showToast('تم إدراج المعدة بنجاح في المستودع');
  };

  // Action: Checkout / Check-in Equipment
  const updateEquipmentStatus = (equipmentId, status, assigneeId = null, bookingId = null) => {
    const assigneeName = team.find(t => t.id === assigneeId)?.name || '';
    setEquipment(prev => prev.map(e => {
      if (e.id === equipmentId) {
        return {
          ...e,
          status,
          assignedToMemberId: assigneeId,
          assignedToMemberName: assigneeName,
          currentBookingId: bookingId,
        };
      }
      return e;
    }));

    showToast(`تم تحديث حالة المعدة إلى ${status}`);
  };

  // Action: Create Invoice
  const createInvoice = (invData) => {
    const invId = `inv-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const newInv = {
      id: invId,
      invoiceNumber: `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`,
      status: 'Sent',
      paidAmount: 0,
      dueAmount: invData.totalAmount,
      ...invData,
    };
    setInvoices(prev => [newInv, ...prev]);

    // Update client total spent / outstanding
    setClients(prev => prev.map(c => {
      if (c.id === newInv.clientId) {
        return {
          ...c,
          outstandingAmount: (c.outstandingAmount || 0) + newInv.totalAmount,
        };
      }
      return c;
    }));

    showToast('تم اصدار الفاتورة بنجاح');
    return newInv;
  };

  // Action: Record Payment
  const recordPayment = (payData) => {
    const payId = `pay-${Date.now().toString().slice(-4)}`;
    const newPay = {
      id: payId,
      date: new Date().toISOString().split('T')[0],
      ...payData,
    };

    setPayments(prev => [newPay, ...prev]);

    // Update invoice amount & status
    setInvoices(prev => prev.map(inv => {
      if (inv.id === payData.invoiceId) {
        const newPaid = (inv.paidAmount || 0) + Number(payData.amount);
        const newDue = Math.max(0, inv.totalAmount - newPaid);
        const newStatus = newDue <= 0 ? 'Paid' : 'Partially Paid';
        return {
          ...inv,
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus,
        };
      }
      return inv;
    }));

    // Update client balance
    setClients(prev => prev.map(c => {
      if (c.id === payData.clientId) {
        return {
          ...c,
          totalSpent: (c.totalSpent || 0) + Number(payData.amount),
          outstandingAmount: Math.max(0, (c.outstandingAmount || 0) - Number(payData.amount)),
        };
      }
      return c;
    }));

    showToast('تم تسجيل الدفعة المالية وتحديث كشف الحساب بنجاح');
  };

  // Action: Submit Public Client Request
  const addClientRequest = (reqData) => {
    const reqId = `req-${Date.now().toString().slice(-4)}`;
    const newReq = {
      id: reqId,
      status: 'Pending Approval',
      createdAt: new Date().toISOString(),
      ...reqData,
    };

    setClientRequests(prev => [newReq, ...prev]);

    addNotification({
      title: 'طلب حجز خارجي جديد (Quotation)',
      message: `قام العميل ${newReq.clientName} بتعبئة نموذج الطلب برقم تقديري ${newReq.estimatedCost} ريال`,
      type: 'booking',
    });

    showToast('تم تقديم طلبك بنجاح! سيتواصل معك فريق LensFlow قريباً.');
    return newReq;
  };

  // Action: Approve Client Request -> Converts to Booking & Invoice
  const approveClientRequest = (requestId) => {
    const req = clientRequests.find(r => r.id === requestId);
    if (!req) return;

    // Check or create client
    let targetClient = clients.find(c => c.phone === req.phone || c.name === req.clientName);
    if (!targetClient) {
      targetClient = {
        id: `cli-${Date.now().toString().slice(-4)}`,
        type: req.companyName ? 'Company' : 'Individual',
        name: req.clientName,
        companyName: req.companyName || '',
        phone: req.phone,
        email: req.email,
        address: req.location || '',
        taxNumber: '',
        totalSpent: 0,
        outstandingAmount: req.estimatedCost,
        notes: req.notes,
      };
      setClients(prev => [targetClient, ...prev]);
    }

    // Create Booking
    const newBooking = addBooking({
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientType: targetClient.type,
      phone: req.phone,
      email: req.email,
      serviceType: req.shootType,
      serviceName: `طلب خارجي: ${req.shootType}`,
      date: req.date,
      startTime: req.startTime || '10:00',
      endTime: '16:00',
      location: req.location,
      photographersCount: req.photographersCount || 1,
      videographersCount: req.videographersCount || 1,
      requiredEquipmentIds: [],
      assignedTeamIds: [team[0].id],
      totalPrice: req.estimatedCost,
      depositPaid: 0,
      remainingAmount: req.estimatedCost,
      notes: req.notes,
    });

    // Update request status
    setClientRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));

    showToast('تم اعتماد الطلب وتحويله إلى حجز مؤكد وفاتورة مبدئية');
  };

  // Helper: Add System Notification
  const addNotification = (ntf) => {
    const newNtf = {
      id: `ntf-${Date.now()}`,
      read: false,
      timestamp: 'الآن',
      ...ntf,
    };
    setNotifications(prev => [newNtf, ...prev]);
  };

  const markNotificationRead = (ntfId) => {
    setNotifications(prev => prev.map(n => n.id === ntfId ? { ...n, read: true } : n));
  };

  // Email Dispatcher Logs State
  const [emailLogs, setEmailLogs] = useState([
    {
      id: "eml-101",
      toEmail: "m.otaibi@lensflow.com",
      toName: "محمد العتيبي",
      subject: "جلسة تصوير زفاف جديدة مسندة إليك",
      body: "مرحباً محمد، تم إسناد حجز تصوير زفاف فندق الريتز لك بتاريخ 12 أغسطس.",
      type: "booking",
      status: "Delivered",
      timestamp: "10:30 ص",
      date: "2026-08-10"
    },
    {
      id: "eml-102",
      toEmail: "a.shehri@lensflow.com",
      toName: "أحمد الشهري",
      subject: "مهمة مونتاج جديدة: عقار مجمع النخيل",
      body: "مرحباً أحمد، تم إضافة مهمة تعديل لقطات الـ HDR لك للبدء بالعمل.",
      type: "task",
      status: "Delivered",
      timestamp: "11:15 ص",
      date: "2026-08-10"
    }
  ]);

  const sendEmailToStaff = ({ toEmail, toName, subject, body, type = 'general' }) => {
    const newLog = {
      id: `eml-${Date.now().toString().slice(-4)}`,
      toEmail: toEmail || 'staff@lensflow.com',
      toName: toName || 'عضو الفريق',
      subject: subject || 'تنبيه من LensFlow',
      body: body || 'تم إصدار إشعار جديد بحسابك.',
      type,
      status: 'Delivered',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    setEmailLogs(prev => [newLog, ...prev]);
    showToast(`📧 تم إرسال إشعار بريدي إلى البريد الإلكتروني (${toEmail || 'الموظف'})`);
    return newLog;
  };

  // Highlighted Date for Notifications
  const [highlightedDate, setHighlightedDate] = useState(null);

  const triggerDateHighlight = (dateStr) => {
    const target = dateStr || '2026-08-12';
    setHighlightedDate(target);
    setTimeout(() => {
      setHighlightedDate(null);
    }, 2000);
  };

  // Action: Delete Team Member (Admin Only)
  const deleteTeamMember = (memberId) => {
    if (userRole !== 'Admin') {
      showToast('⛔ عذراً، حظر وحذف أعضاء الفريق متاح حصرياً للمسؤول عن الموقع (Admin) فقط!', 'error');
      return;
    }
    setTeam(prev => {
      const updated = prev.filter(t => t.id !== memberId);
      localStorage.setItem('lensflow_team', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      return updated;
    });
    showToast('تم حذف العضو من الفريق بنجاح');
  };

  // Reset to Seed Data
  const resetToSeedData = () => {
    localStorage.clear();
    setStudio(initialSeedData.studio);
    setTeam(initialSeedData.team);
    setCompanies(initialSeedData.companies);
    setClients(initialSeedData.clients);
    setBookings(initialSeedData.bookings);
    setProjects(initialSeedData.projects);
    setTasks(initialSeedData.tasks);
    setEquipment(initialSeedData.equipment);
    setInvoices(initialSeedData.invoices);
    setPayments(initialSeedData.payments);
    setClientRequests(initialSeedData.clientRequests);
    setNotifications(initialSeedData.notifications);
    showToast('تم استعادة البيانات الافتراضية بنجاح!');
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      userRole,
      setUserRole,
      currentUserId,
      setCurrentUserId,
      currentUser,
      studio,
      setStudio,
      team,
      setTeam,
      companies,
      setCompanies,
      addCompany,
      clients,
      setClients,
      bookings,
      setBookings,
      projects,
      setProjects,
      tasks,
      setTasks,
      equipment,
      setEquipment,
      invoices,
      setInvoices,
      payments,
      setPayments,
      clientRequests,
      setClientRequests,
      notifications,
      toastMessage,
      showToast,
      checkClash,
      addBooking,
      convertBookingToProject,
      updateTaskStatus,
      toggleChecklistItem,
      addTask,
      addEquipment,
      updateEquipmentStatus,
      createInvoice,
      recordPayment,
      addClientRequest,
      approveClientRequest,
      markNotificationRead,
      emailLogs,
      sendEmailToStaff,
      highlightedDate,
      triggerDateHighlight,
      deleteTeamMember,
      resetToSeedData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
