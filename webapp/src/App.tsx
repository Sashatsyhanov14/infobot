import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AdminStats from './components/AdminStats';
import AdminFaq from './components/AdminFaq';
import AdminRequests from './components/AdminRequests';
import PublicCatalog from './components/PublicCatalog';

const translations: Record<string, any> = {
  ru: {
    tabReferral: "Партнёрам",
    tabStats: "Статистика",
    tabFaq: "FAQ",
    tabCatalog: "Каталог",
    loading: "Загрузка...",
    bonusBalance: "Твой баланс",
    invitedCount: "Приглашено друзей",
    inviteTitle: "Твоя ссылка для приглашения",
    promoLabel: "ПРОМОКОД",
    copyBtn: "Копировать",
    getQrBtn: "Получить QR в чате",
    loginTitle: "Вход в систему",
    loginDesc: "Введите ваш Telegram ID для доступа к панели управления.",
    loginPlaceholder: "Ваш ID",
    loginBtn: "Войти",
    roleFounder: "Владелец",
    roleManager: "Менеджер",
    roleUser: "Клиент",
    ownerBadge: "Founder",
    statsTotalUsers: "Всего клиентов",
    activeReferrers: "Активных рефереров",
    userDatabase: "База пользователей",
    searchPlaceholder: "Поиск...",
    payoutsTitle: "Выплаты и Аналитика",
    balanceLabel: "баланс",
    invitedLabel: "друзей",
    paidLabel: "выплачено",
    payoutBtn: "Выплатить $",
    payoutSuccess: "✅ Выплачено ${amount}",
    payoutHistory: "История выплат:",
    notePlaceholder: "Заметка...",
    fromReferrer: "От: {id}",
    noResults: "Ничего не найдено",
    linkCopied: "Скопировано!",
    withdrawBtn: "Вывести бонусы",
    manageManagers: "Менеджеры",
    assignEmployee: "+ Добавить",
    enterTgId: "Telegram ID",
    activeEmployees: "Сотрудники",
    managerAddError: "❌ Не найден. Попросите его нажать /start.",
    managerAddSuccess: "✅ ID {id} теперь Менеджер.",
    managerRemoveSuccess: "🗑️ Удалено.",
    analyzing: "Анализ...",
    manageFaq: "Управление FAQ",
    deleteFaqConfirm: "Удалить?",
    addFaq: "Добавить",
    newFaq: "Новый FAQ",
    editFaq: "Изменить FAQ",
    faqTopic: "Вопрос",
    faqContent: "Ответ",
    saveBtn: "Сохранить",
    cancelBtn: "Отмена",
    myReferrals: "Мои рефералы",
    friendLabel: "Друг",
    priceLabel: "Стоимость",
    durationLabel: "Длительность",
    descriptionLabel: "Описание",
    includedLabel: "Что включено",
    meetingPointLabel: "Место встречи",
    bookNowBtn: "Забронировать",
    detailsLabel: "Заявки",
    contactedBtn: "Связан",
    doneBtn: "Готово",
    searchCatalog: "Поиск по городу или названию...",
    cancelLabel: "Отмена",
    fillAllFields: "Пожалуйста, заполните все поля",
    quickBooking: "Быстрое бронирование",
    quickBookingDesc: "Оставьте ваши контакты, и наш менеджер сразу свяжется с вами для подтверждения.",
    yourName: "Ваше имя",
    namePlaceholder: "Иван Иванов",
    yourPhone: "Телефон (WhatsApp)",
    desiredDate: "Желаемая дата",
    datePlaceholder: "25 мая или 'Завтра'",
    sendBtn: "Отправить"
  },
  en: {
    tabReferral: "Partners",
    tabStats: "Stats",
    tabFaq: "FAQ",
    tabCatalog: "Catalog",
    loading: "Loading...",
    bonusBalance: "Your balance",
    invitedCount: "Friends invited",
    inviteTitle: "Your invitation link",
    promoLabel: "PROMO CODE",
    copyBtn: "Copy",
    getQrBtn: "Get QR in Chat",
    loginTitle: "Login",
    loginDesc: "Enter your Telegram ID.",
    loginPlaceholder: "Your ID",
    loginBtn: "Login",
    roleFounder: "Owner",
    roleManager: "Manager",
    roleUser: "Client",
    ownerBadge: "Founder",
    statsTotalUsers: "Total Clients",
    activeReferrers: "Active Referrers",
    userDatabase: "User Database",
    searchPlaceholder: "Search...",
    payoutsTitle: "Payouts & Analytics",
    balanceLabel: "balance",
    invitedLabel: "friends",
    paidLabel: "paid",
    payoutBtn: "Payout $",
    payoutSuccess: "✅ Paid ${amount}",
    payoutHistory: "Payout History:",
    notePlaceholder: "Note...",
    fromReferrer: "From: {id}",
    noResults: "Nothing found",
    linkCopied: "Copied!",
    withdrawBtn: "Withdraw Bonuses",
    manageManagers: "Managers",
    assignEmployee: "+ Add",
    enterTgId: "Telegram ID",
    activeEmployees: "Staff",
    managerAddError: "❌ Not found.",
    managerAddSuccess: "✅ ID {id} is Manager.",
    managerRemoveSuccess: "🗑️ Removed.",
    analyzing: "Analyzing...",
    manageFaq: "Manage FAQ",
    deleteFaqConfirm: "Delete?",
    addFaq: "Add",
    newFaq: "New FAQ",
    editFaq: "Edit FAQ",
    faqTopic: "Question",
    faqContent: "Answer",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    myReferrals: "My Referrals",
    friendLabel: "Friend",
    priceLabel: "Price",
    durationLabel: "Duration",
    descriptionLabel: "Description",
    includedLabel: "Included",
    meetingPointLabel: "Meeting Point",
    bookNowBtn: "Book Now",
    detailsLabel: "Requests",
    contactedBtn: "Contacted",
    doneBtn: "Done",
    searchCatalog: "Search by city or title...",
    cancelLabel: "Cancel",
    fillAllFields: "Please fill in all fields",
    quickBooking: "Quick Booking",
    quickBookingDesc: "Leave your contacts, and our manager will contact you immediately for confirmation.",
    yourName: "Your Name",
    namePlaceholder: "John Doe",
    yourPhone: "Phone (WhatsApp)",
    desiredDate: "Desired Date",
    datePlaceholder: "May 25 or 'Tomorrow'",
    sendBtn: "Send"
  },
  tr: {
    tabReferral: "Ortaklar",
    tabStats: "İstatistik",
    tabFaq: "SSS",
    tabCatalog: "Katalog",
    loading: "Yükleniyor...",
    bonusBalance: "Bakiyeniz",
    invitedCount: "Davet edilen arkadaşlar",
    inviteTitle: "Davet bağlantınız",
    promoLabel: "PROMOSYON KODU",
    copyBtn: "Kopyala",
    getQrBtn: "Sohbette QR Al",
    loginTitle: "Giriş",
    loginDesc: "Telegram ID'nizi girin.",
    loginPlaceholder: "ID'niz",
    loginBtn: "Giriş Yap",
    roleFounder: "Sahibi",
    roleManager: "Yönetici",
    roleUser: "Müşteri",
    ownerBadge: "Kurucu",
    statsTotalUsers: "Toplam Müşteri",
    activeReferrers: "Aktif Referanslar",
    userDatabase: "Kullanıcı Veritabanı",
    searchPlaceholder: "Ara...",
    payoutsTitle: "Ödemeler ve Analizler",
    balanceLabel: "bakiye",
    invitedLabel: "arkadaşlar",
    paidLabel: "ödenen",
    payoutBtn: "Ödeme Yap $",
    payoutSuccess: "✅ ${amount} ödendi",
    payoutHistory: "Ödeme Geçmişi:",
    notePlaceholder: "Not...",
    fromReferrer: "Kimden: {id}",
    noResults: "Bulunamadı",
    linkCopied: "Kopyalandı!",
    withdrawBtn: "Bonusları Çek",
    manageManagers: "Yöneticiler",
    assignEmployee: "+ Ekle",
    enterTgId: "Telegram ID",
    activeEmployees: "Personel",
    managerAddError: "❌ Bulunamadı.",
    managerAddSuccess: "✅ ID {id} artık Yönetici.",
    managerRemoveSuccess: "🗑️ Kaldırıldı.",
    analyzing: "Analiz ediliyor...",
    manageFaq: "SSS Yönetimi",
    deleteFaqConfirm: "Silinsin mi?",
    addFaq: "SSS Ekle",
    newFaq: "Yeni SSS",
    editFaq: "SSS Düzenle",
    faqTopic: "Soru",
    faqContent: "Cevap",
    saveBtn: "Kaydet",
    cancelBtn: "İptal",
    myReferrals: "Referanslarım",
    friendLabel: "Arkadaş",
    priceLabel: "Fiyat",
    durationLabel: "Süre",
    descriptionLabel: "Açıklama",
    includedLabel: "Dahil olanlar",
    meetingPointLabel: "Buluşma Noktası",
    bookNowBtn: "Hemen Rezervasyon Yap",
    detailsLabel: "Talepler",
    contactedBtn: "İletişime Geçildi",
    doneBtn: "Tamamlandı",
    searchCatalog: "Şehir veya başlığa göre ara...",
    cancelLabel: "İptal",
    fillAllFields: "Lütfen tüm alanları doldurun",
    quickBooking: "Hızlı Rezervasyon",
    quickBookingDesc: "İletişim bilgilerinizi bırakın, onay için yöneticimiz sizinle hemen iletişime geçecektir.",
    yourName: "Adınız",
    namePlaceholder: "John Doe",
    yourPhone: "Telefon (WhatsApp)",
    desiredDate: "İstenilen Tarih",
    datePlaceholder: "25 Mayıs veya 'Yarın'",
    sendBtn: "Gönder"
  },
  de: {
    tabReferral: "Partner",
    tabStats: "Statistik",
    tabFaq: "FAQ",
    tabCatalog: "Katalog",
    loading: "Laden...",
    bonusBalance: "Kontostand",
    invitedCount: "Eingeladene Freunde",
    inviteTitle: "Ihr Einladungslink",
    promoLabel: "PROMOCODE",
    copyBtn: "Kopieren",
    getQrBtn: "QR im Chat erhalten",
    loginTitle: "Login",
    loginDesc: "Geben Sie Ihre Telegram-ID ein.",
    loginPlaceholder: "Ihre ID",
    loginBtn: "Anmelden",
    roleFounder: "Besitzer",
    roleManager: "Manager",
    roleUser: "Kunde",
    ownerBadge: "Gründer",
    statsTotalUsers: "Gesamt Kunden",
    activeReferrers: "Aktive Empfehlungen",
    userDatabase: "Benutzerdatenbank",
    searchPlaceholder: "Suche...",
    payoutsTitle: "Auszahlungen & Analysen",
    balanceLabel: "Konto",
    invitedLabel: "Freunde",
    paidLabel: "Bezahlt",
    payoutBtn: "Auszahlen $",
    payoutSuccess: "✅ Ausgezahlt: ${amount}",
    payoutHistory: "Auszahlungshistorie:",
    notePlaceholder: "Notiz...",
    fromReferrer: "Von: {id}",
    noResults: "Nichts gefunden",
    linkCopied: "Kopiert!",
    withdrawBtn: "Auszahlen",
    manageManagers: "Manager",
    assignEmployee: "+ Hinzufügen",
    enterTgId: "Telegram ID",
    activeEmployees: "Personal",
    managerAddError: "❌ Nicht gefunden.",
    managerAddSuccess: "✅ ID {id} ist Manager.",
    managerRemoveSuccess: "🗑️ Entfernt.",
    analyzing: "Analyse...",
    manageFaq: "FAQ verwalten",
    deleteFaqConfirm: "Löschen?",
    addFaq: "Hinzufügen",
    newFaq: "Neu",
    editFaq: "Bearbeiten",
    faqTopic: "Frage",
    faqContent: "Antwort",
    saveBtn: "Speichern",
    cancelBtn: "Abbrechen",
    myReferrals: "Meine Empfehlungen",
    friendLabel: "Freund",
    priceLabel: "Preis",
    durationLabel: "Dauer",
    descriptionLabel: "Beschreibung",
    includedLabel: "Inklusive",
    meetingPointLabel: "Treffpunkt",
    bookNowBtn: "Jetzt buchen",
    detailsLabel: "Anfragen",
    contactedBtn: "Kontaktiert",
    doneBtn: "Fertig",
    searchCatalog: "Suche nach Stadt oder Titel...",
    cancelLabel: "Abbrechen",
    fillAllFields: "Bitte füllen Sie alle Felder aus",
    quickBooking: "Schnellbuchung",
    quickBookingDesc: "Hinterlassen Sie Ihre Kontaktdaten, unser Manager wird Sie umgehend zur Bestätigung kontaktieren.",
    yourName: "Ihr Name",
    namePlaceholder: "Max Mustermann",
    yourPhone: "Telefon (WhatsApp)",
    desiredDate: "Gewünschtes Datum",
    datePlaceholder: "25. Mai oder 'Morgen'",
    sendBtn: "Senden"
  },
  pl: {
    tabReferral: "Partnerzy",
    tabStats: "Statystyki",
    tabFaq: "FAQ",
    tabCatalog: "Katalog",
    loading: "Ładowanie...",
    bonusBalance: "Twoje saldo",
    invitedCount: "Zaproszeni znajomi",
    inviteTitle: "Twój link polecający",
    promoLabel: "KOD PROMO",
    copyBtn: "Kopiuj",
    getQrBtn: "Odbierz QR na czacie",
    loginTitle: "Logowanie",
    loginDesc: "Wpisz swój Telegram ID.",
    loginPlaceholder: "Twój ID",
    loginBtn: "Zaloguj",
    roleFounder: "Właściciel",
    roleManager: "Menedżer",
    roleUser: "Klient",
    ownerBadge: "Founder",
    statsTotalUsers: "Suma klientów",
    activeReferrers: "Aktywni polecający",
    userDatabase: "Baza użytkowników",
    searchPlaceholder: "Szukaj...",
    payoutsTitle: "Wypłaty i Analityka",
    balanceLabel: "saldo",
    invitedLabel: "znajomych",
    paidLabel: "wypłacono",
    payoutBtn: "Wypłać $",
    payoutSuccess: "✅ Wypłacono ${amount}",
    payoutHistory: "Historia wypłat:",
    notePlaceholder: "Notatka...",
    fromReferrer: "Od: {id}",
    noResults: "Nic nie znaleziono",
    linkCopied: "Skopiowano!",
    withdrawBtn: "Wypłać bonusy",
    manageManagers: "Menedżerowie",
    assignEmployee: "+ Dodaj",
    enterTgId: "Telegram ID",
    activeEmployees: "Kadr",
    managerAddError: "❌ Nie znaleziono.",
    managerAddSuccess: "✅ ID {id} jest menedżerem.",
    managerRemoveSuccess: "🗑️ Usunięto.",
    analyzing: "Analiza...",
    manageFaq: "Zarządzaj FAQ",
    deleteFaqConfirm: "Usunąć?",
    addFaq: "Dodaj",
    newFaq: "Nowy",
    editFaq: "Edytuj",
    faqTopic: "Pytanie",
    faqContent: "Odpowiedź",
    saveBtn: "Zapisz",
    cancelBtn: "Anuluj",
    myReferrals: "Moi poleceni",
    friendLabel: "Znajomy",
    priceLabel: "Cena",
    durationLabel: "Czas trwania",
    descriptionLabel: "Opis",
    includedLabel: "W cenie",
    meetingPointLabel: "Miejsce spotkania",
    bookNowBtn: "Zarezerwuj teraz",
    detailsLabel: "Zgłoszenia",
    contactedBtn: "Skontaktowano się",
    doneBtn: "Gotowe",
    searchCatalog: "Szukaj miasta lub nazwy...",
    cancelLabel: "Anuluj",
    fillAllFields: "Proszę wypełnić wszystkie pola",
    quickBooking: "Szybka rezerwacja",
    quickBookingDesc: "Zostaw swoje dane kontaktowe, a nasz menedżer skontaktuje się z Tobą natychmiast w celu potwierdzenia.",
    yourName: "Twoje imię",
    namePlaceholder: "Jan Kowalski",
    yourPhone: "Telefon (WhatsApp)",
    desiredDate: "Żądana data",
    datePlaceholder: "25 maja lub 'Jutro'",
    sendBtn: "Wyślij"
  },
  ar: {
    tabReferral: "الإحالة",
    tabStats: "الإحصائيات",
    tabFaq: "الأسئلة الشائعة",
    tabCatalog: "الكتالوج",
    loading: "تحميل...",
    bonusBalance: "رصيدك",
    invitedCount: "الأصدقاء المدعوون",
    inviteTitle: "رابط الدعوة الخاص بك",
    promoLabel: "كود الخصم",
    copyBtn: "نسخ",
    getQrBtn: "احصل على QR في الدردشة",
    loginTitle: "تسجيل الدخول",
    loginDesc: "أدخل معرف تليجرام الخاص بك.",
    loginPlaceholder: "معرفك",
    loginBtn: "دخول",
    roleFounder: "المالك",
    roleManager: "مدير",
    roleUser: "عميل",
    ownerBadge: "المؤسس",
    statsTotalUsers: "إجمالي العملاء",
    activeReferrers: "المحيلون النشطون",
    userDatabase: "قاعدة بيانات المستخدمين",
    searchPlaceholder: "بحث...",
    payoutsTitle: "المدفوعات والتحليلات",
    balanceLabel: "رصيد",
    invitedLabel: "أصدقاء",
    paidLabel: "مدفوع",
    payoutBtn: "صرف المكافأة $",
    payoutSuccess: "✅ تم صرف ${amount}",
    payoutHistory: "سجل المدفوعات:",
    notePlaceholder: "ملاحظة...",
    fromReferrer: "من: {id}",
    noResults: "لم يتم العثور على شيء",
    linkCopied: "تم النسخ!",
    withdrawBtn: "سحب المكافآت",
    manageManagers: "المدراء",
    assignEmployee: "+ إضافة",
    enterTgId: "معرف تليجرام",
    activeEmployees: "الموظفون",
    managerAddError: "❌ غير موجود.",
    managerAddSuccess: "✅ أصبح {id} مديراً.",
    managerRemoveSuccess: "🗑️ تمت الإزالة.",
    analyzing: "جاري التحليل...",
    manageFaq: "إدارة الأسئلة",
    deleteFaqConfirm: "هل تريد الحذف؟",
    addFaq: "إضافة سؤال",
    newFaq: "سؤال جديد",
    editFaq: "تعديل السؤال",
    faqTopic: "السؤال",
    faqContent: "الإجابة",
    saveBtn: "حفظ",
    cancelBtn: "إلغاء",
    myReferrals: "إحالاتي",
    friendLabel: "صديق",
    priceLabel: "السعر",
    durationLabel: "المدة",
    descriptionLabel: "الوصف",
    includedLabel: "ما يشتمل عليه",
    meetingPointLabel: "نقطة اللقاء",
    bookNowBtn: "احجز الآن",
    detailsLabel: "الطلبات",
    contactedBtn: "تم الاتصال",
    doneBtn: "تم التنفيذ",
    searchCatalog: "البحث عن مدينة أو عنوان...",
    cancelLabel: "إلغاء",
    fillAllFields: "يرجى ملء جميع الخانات",
    quickBooking: "حجز سريع",
    quickBookingDesc: "اترك بيانات الاتصال الخاصة بك، وسيتصل بك مديرنا على الفور للتأكيد.",
    yourName: "اسمك",
    namePlaceholder: "فلان الفلاني",
    yourPhone: "الهاتف (واتساب)",
    desiredDate: "التاريخ المطلوب",
    datePlaceholder: "25 مايو أو 'غداً'",
    sendBtn: "إرسال"
  },
  fa: {
    tabReferral: "همکاری",
    tabStats: "آمار",
    tabFaq: "سوالات متداول",
    tabCatalog: "کاتالوگ",
    loading: "بارگذاری...",
    bonusBalance: "موجودی شما",
    invitedCount: "دوستان دعوت شده",
    inviteTitle: "لینک دعوت شما",
    promoLabel: "کد تخفیف",
    copyBtn: "کپی",
    getQrBtn: "دریافت QR در چت",
    loginTitle: "ورود",
    loginDesc: "آیدی تلگرام خود را وارد کنید.",
    loginPlaceholder: "آیدی شما",
    loginBtn: "ورود",
    roleFounder: "مالک",
    roleManager: "مدیر",
    roleUser: "مشتری",
    ownerBadge: "بنیان‌گذار",
    statsTotalUsers: "کل مشتریان",
    activeReferrers: "معرف‌های فعال",
    userDatabase: "بانک اطلاعات کاربران",
    searchPlaceholder: "جستجو...",
    payoutsTitle: "پرداختی‌ها و آنالیز",
    balanceLabel: "موجودی",
    invitedLabel: "دوستان",
    paidLabel: "پرداخت شده",
    payoutBtn: "پرداخت جایزه $",
    payoutSuccess: "✅ ${amount} پرداخت شد",
    payoutHistory: "تاریخچه پرداختی‌ها:",
    notePlaceholder: "یادداشت...",
    fromReferrer: "توسط: {id}",
    noResults: "چیزی یافت نشد",
    linkCopied: "کپی شد!",
    withdrawBtn: "برداشت پاداش",
    manageManagers: "مدیران",
    assignEmployee: "+ افزودن",
    enterTgId: "آیدی تلگرام",
    activeEmployees: "کارکنان",
    managerAddError: "❌ پیدا نشد.",
    managerAddSuccess: "✅ آیدی {id} مدیر شد.",
    managerRemoveSuccess: "🗑️ حذف شد.",
    analyzing: "در حال تحلیل...",
    manageFaq: "مدیریت سوالات",
    deleteFaqConfirm: "حذف شود؟",
    addFaq: "افزودن سوال",
    newFaq: "سوال جدید",
    editFaq: "ویرایش سوال",
    faqTopic: "سوال",
    faqContent: "پاسخ",
    saveBtn: "ذخیره",
    cancelBtn: "لغو",
    myReferrals: "زیرمجموعه‌های من",
    friendLabel: "دوست",
    priceLabel: "قیمت",
    durationLabel: "مدت زمان",
    descriptionLabel: "توضیحات",
    includedLabel: "شامل خدمات",
    meetingPointLabel: "محل ملاقات",
    bookNowBtn: "رزرو آنی",
    detailsLabel: "درخواست‌ها",
    contactedBtn: "تماس گرفته شد",
    doneBtn: "انجام شد",
    searchCatalog: "جستجو بر اساس شهر یا عنوان...",
    cancelLabel: "لغو",
    fillAllFields: "لطفاً تمام فیلدها را پر کنید",
    quickBooking: "رزرو سریع",
    quickBookingDesc: "اطلاعات تماس خود را بگذارید، مدیر ما بلافاصله برای تایید با شما تماس خواهد گرفت.",
    yourName: "نام شما",
    namePlaceholder: "نام و نام خانوادگی",
    yourPhone: "تلفن (واتس‌اپ)",
    desiredDate: "تاریخ مورد نظر",
    datePlaceholder: "۲۵ می یا 'فردا'",
    sendBtn: "ارسال"
  }
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState('referral');
  const [lang, setLang] = useState('ru');
  const [loginId, setLoginId] = useState('');
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState(false);

  const tg = window.Telegram?.WebApp;
  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (tg) {
      tg.expand();
      const rawLang = tg.initDataUnsafe?.user?.language_code || 'en';
      setLang(translations[rawLang] ? rawLang : 'en');
      
      const tid = tg.initDataUnsafe?.user?.id;
      if (tid) fetchUser(tid);
      else setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (tid: number) => {
    const { data } = await supabase.from('users').select('*').eq('telegram_id', tid).single();
    if (data) {
      setUser(data);
      if (data.role === 'founder' || data.role === 'manager') setTab('stats');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!loginId) return;
    setLoading(true);
    await fetchUser(parseInt(loginId));
  };

  const handleCopy = () => {
    const link = `https://t.me/aiemedeoapp_bot?start=${user?.telegram_id}`;
    navigator.clipboard.writeText(link);
    setCopyMsg(true);
    setTimeout(() => setCopyMsg(false), 2000);
  };

  const handleWithdraw = () => {
    tg?.sendData(JSON.stringify({ type: 'withdraw_request' }));
    tg?.close();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 glass-card p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">{t.loginTitle}</h2>
            <p className="text-xs text-slate-500">{t.loginDesc}</p>
          </div>
          <div className="space-y-4">
            <input 
              type="number"
              placeholder={t.loginPlaceholder}
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-center text-lg font-black text-white outline-none focus:border-primary transition-all"
            />
            <button 
              onClick={handleLogin}
              className="w-full bg-primary text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              {t.loginBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'founder' || user.role === 'manager';

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col p-4">
      {/* Header Profile */}
      <header className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">account_circle</span>
          </div>
          <div>
            <h1 className="text-base font-black text-white truncate max-w-[150px]">@{user.username || 'user'}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isAdmin ? t[user.role === 'founder' ? 'roleFounder' : 'roleManager'] : t.roleUser}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-right">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{t.bonusBalance}</p>
          <p className="text-lg font-black text-primary leading-none tracking-tight">${user.balance || 0}</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'referral' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            {/* Referral Stats Overlay */}
            <div className="relative overflow-hidden bg-primary rounded-[32px] p-8 text-black shadow-[0_20px_50px_rgba(208,188,255,0.3)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10 space-y-1">
                <p className="text-[11px] font-black uppercase tracking-widest opacity-60">{t.invitedCount}</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tracking-tighter">0</h2>
                  <span className="text-sm font-black opacity-50 uppercase">{t.friendLabel}</span>
                </div>
              </div>
              <div className="mt-8 relative z-10">
                <button onClick={handleWithdraw} className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  {t.withdrawBtn}
                </button>
              </div>
            </div>

            {/* Invite Link Card */}
            <div className="bg-[#1a1a1d] p-6 rounded-[32px] border border-white/5 space-y-5 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-200 pl-1">{t.inviteTitle}</h3>
              <div className="relative">
                <div className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-xs font-black text-primary truncate">
                  t.me/aiemedeoapp_bot?start={user.telegram_id}
                </div>
                <button 
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-black flex items-center justify-center active:scale-90 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
              {copyMsg && <p className="text-[10px] text-primary font-bold text-center animate-bounce">{t.linkCopied}</p>}
            </div>

            {/* My Referrals List (Placeholder) */}
            <div className="pt-2">
               <h3 className="text-sm font-bold text-slate-400 pl-3 mb-3 uppercase tracking-widest">{t.myReferrals}</h3>
               <div className="space-y-3">
                  <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[32px]">
                    <span className="material-symbols-outlined text-slate-600 text-[40px] mb-2 opacity-30">diversity_3</span>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">{t.noResults}</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {tab === 'stats' && isAdmin && <AdminStats t={t} />}
        {tab === 'faq' && <AdminFaq t={t} />}
        {tab === 'requests' && isAdmin && <AdminRequests t={t} />}
        {tab === 'catalog' && <PublicCatalog t={t} lang={lang} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50">
        <div className="glass-card bg-[#1a1a1dbf] border border-white/10 rounded-[28px] p-2 flex items-center justify-around shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          {isAdmin ? (
            <>
              <button onClick={() => setTab('stats')} className={`flex flex-col items-center gap-1 p-2 transition-all ${tab === 'stats' ? 'text-primary scale-110' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[24px]">analytics</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.tabStats}</span>
              </button>
              <button onClick={() => setTab('requests')} className={`flex flex-col items-center gap-1 p-2 transition-all ${tab === 'requests' ? 'text-primary scale-110' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[24px]">assignment</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.detailsLabel}</span>
              </button>
              <button onClick={() => setTab('faq')} className={`flex flex-col items-center gap-1 p-2 transition-all ${tab === 'faq' ? 'text-primary scale-110' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[24px]">help_center</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.tabFaq}</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setTab('referral')} className={`flex flex-col items-center gap-1 p-3 transition-all ${tab === 'referral' ? 'text-primary scale-110' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[24px]">group</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.tabReferral}</span>
              </button>
              <button onClick={() => setTab('catalog')} className={`flex flex-col items-center gap-1 p-3 transition-all ${tab === 'catalog' ? 'text-primary scale-110' : 'text-slate-500'}`}>
                <span className="material-symbols-outlined text-[24px]">explore</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.tabCatalog}</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
