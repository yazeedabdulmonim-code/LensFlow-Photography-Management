// WhatsApp Short & Concise Staff Assignment Generator

export const generateWhatsAppMessage = ({ 
  phone, 
  name, 
  role, 
  serviceName, 
  clientName, 
  date, 
  time, 
  location, 
  bookingId,
  equipmentList = [],
  tasksList = [], 
  notes 
}) => {
  // Clean phone number format (Saudi international 966)
  let cleanPhone = (phone || '').replace(/[^\d]/g, '');
  if (cleanPhone.startsWith('05')) {
    cleanPhone = `966${cleanPhone.slice(1)}`;
  } else if (cleanPhone.startsWith('5') && cleanPhone.length === 9) {
    cleanPhone = `966${cleanPhone}`;
  }

  // Concise tasks summary
  const finalTasks = (tasksList && tasksList.length > 0) 
    ? tasksList.slice(0, 3)
    : [
        'تجهيز الكاميرات والمعدات والبطاريات',
        'الحضور بالموقع قبل الموعد بـ 30 دقيقة',
        'التوثيق الميداني وتسليم بطاقات الذاكرة'
      ];

  const tasksFormatted = finalTasks.map((t, idx) => `${idx + 1}. ${t}`).join('\n');

  // Location Google Maps link helper
  const isUrlLocation = location && (location.startsWith('http://') || location.startsWith('https://'));
  const mapsLocationLink = isUrlLocation 
    ? location 
    : `https://maps.google.com/?q=${encodeURIComponent(location || 'الرياض')}`;

  // Concise & Punchy Summarized Message
  const rawLines = [
    `📸 *حجز وتكليف جديد* 📸`,
    ``,
    `أهلاً *${name || 'عضو الفريق'}*، تم تكليفك بـ:`,
    `🎯 *الخدمة:* ${serviceName || 'جلسة تصوير'} (#${bookingId || 'BK-101'})`,
    `👤 *العميل:* ${clientName || 'عميل الاستوديو'}`,
    `📅 *الموعد:* ${date || ''} (${time || ''})`,
    `📍 *الموقع:* ${location || 'الرياض'}`,
    `🗺️ *اللوكيشن:* ${mapsLocationLink}`,
    ``,
    `📋 *المهام:*`,
    `${tasksFormatted}`,
    notes ? `📌 *ملاحظة:* ${notes}` : ``,
    ``,
    `بالتوفيق ✨`
  ].filter(line => line !== null && line !== undefined);

  const rawMessageText = rawLines.join('\n');

  // URL Encoding for 100% WhatsApp auto-fill
  const encodedText = encodeURIComponent(rawMessageText).replace(/%0A/g, '%0A');

  const apiUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  const waMeUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  const nativeUrl = cleanPhone
    ? `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`
    : `whatsapp://send?text=${encodedText}`;

  return {
    cleanPhone,
    name,
    role,
    messageText: rawMessageText,
    tasksList: finalTasks,
    mapsLocationLink,
    apiUrl,
    waMeUrl: apiUrl,
    nativeUrl,
    waUrl: apiUrl,
  };
};

export const sendWhatsAppNotification = generateWhatsAppMessage;
