// Email Notification Service for LensFlow Staff with Direct Personal Portal Links

export const sendStaffEmailNotification = ({ toEmail, toName, subject, body, type = 'task' }) => {
  console.log(`[Email Dispatcher] Sending email to ${toName} <${toEmail}>...`);
  
  const directLink = `https://lensflow-photography-management.vercel.app/?staff=${encodeURIComponent(toEmail)}&tab=tasks`;

  const fullEmailBody = `${body}

---------------------------------------------------
🔗 رابط الدخول المباشر لجدول مهامك وتأكيد الاستلام:
${directLink}
---------------------------------------------------
مع تحيات فريق إدارة استوديو LensFlow`;

  const emailLogItem = {
    id: `eml-${Date.now().toString().slice(-4)}`,
    toEmail,
    toName,
    subject,
    body: fullEmailBody,
    directLink,
    type,
    status: 'Delivered',
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
  };

  return emailLogItem;
};
