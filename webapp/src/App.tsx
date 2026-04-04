import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AdminStats from './components/AdminStats';
import AdminFaq from './components/AdminFaq';
import WithdrawModal from './components/WithdrawModal';

declare global {
  interface Window {
    Telegram: any;
  }
}

const translations: any = {
  ru: {
    adminTitle: "Админ-панель",
    adminSubtitle: "Глобал�    tabReferral: "Партнёрам",
    tabStats: "Статистика",
    tabFaq: "FAQ",
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
    searchPlaceholder: "Поиск по ID или @username...",
    payoutsTitle: "Выплаты и Аналитика",
    balanceLabel: "баланс",
    invitedLabel: "друзей",
    paidLabel: "выплачено",
    payoutBtn: "Выплатить $",
    payoutSuccess: "✅ Выплачено ${amount}",
    payoutHistory: "История выплат (последние 3):",
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
    friendLabel: "Друг"
  },
ер.",
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
    cancelBtn: "Отмена"
  },
  en: {
    adminTitle: "Admin Panel",
    adminSubtitle: "Global Stats",
    tabReferral: "Referral",
    tabStats: "Statistics",
    tabFaq: "FAQ",
    loading: "Loading...",
    bonusBalance: "Your balance",
    invitedCount: "Invited friends",
    inviteTitle: "Your invitation link",
    promoLabel: "PROMO CODE",
    copyBtn: "Copy",
    getQrBtn: "Get QR in Chat",
    loginTitle: "Login",
    loginDesc: "Enter your Telegram ID to access the panel.",
    loginPlaceholder: "Your ID",
    loginBtn: "Login",
    roleFounder: "Owner",
    roleManager: "Manager",
    roleUser: "Client",
    ownerBadge: "Founder",
    statsTotalUsers: "Total Clients",
    activeReferrers: "Active Referrers",
    userDatabase: "User Database",
    searchPlaceholder: "Search ID or @username...",
    payoutsTitle: "Payouts & Analytics",
    balanceLabel: "balance",
    invitedLabel: "friends",
    paidLabel: "paid",
    payoutBtn: "Payout $",
    payoutSuccess: "✅ Paid ${amount}",
    payoutHistory: "Payout History (last 3):",
    notePlaceholder: "Note...",
    fromReferrer: "From: {id}",
    noResults: "Nothing found",
    linkCopied: "Copied!",
    withdrawBtn: "Withdraw Bonuses",
    manageManagers: "Managers",
    assignEmployee: "+ Add",
    enterTgId: "Telegram ID",
    activeEmployees: "Staff",
    managerAddError: "❌ Not found. Ask them to /start first.",
    managerAddSuccess: "✅ ID {id} is now a Manager.",
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
    friendLabel: "Friend"
  },
  tr: {
    adminTitle: "Yönetim Paneli",
    adminSubtitle: "Genel İstatistikler",
    tabReferral: "Referans",
    tabStats: "İstatistik",
    tabFaq: "SSS",
    loading: "Yükleniyor...",
    bonusBalance: "Bakiyeniz",
    invitedCount: "Davet edilen arkadaşlar",
    inviteTitle: "Davet bağlantınız",
    promoLabel: "PROMOSYON KODU",
    copyBtn: "Kopyala",
    getQrBtn: "Sohbette QR Al",
    loginTitle: "Giriş",
    loginDesc: "Kontrol paneline erişmek için Telegram ID'nizi girin.",
    loginPlaceholder: "ID'niz",
    loginBtn: "Giriş Yap",
    roleFounder: "Sahibi",
    roleManager: "Yönetici",
    roleUser: "Müşteri",
    ownerBadge: "Kurucu",
    statsTotalUsers: "Toplam Müşteri",
    activeReferrers: "Aktif Referanslar",
    userDatabase: "Kullanıcı Veritabanı",
    searchPlaceholder: "ID veya @username ara...",
    payoutsTitle: "Ödemeler ve Analizler",
    balanceLabel: "bakiye",
    invitedLabel: "arkadaşlar",
    paidLabel: "ödenen",
    payoutBtn: "Ödeme Yap $",
    payoutSuccess: "✅ ${amount} ödendi",
    payoutHistory: "Ödeme Geçmişi (son 3):",
    notePlaceholder: "Not...",
    fromReferrer: "Kimden: {id}",
    noResults: "Bulunamadı",
    linkCopied: "Kopyalandı!",
    withdrawBtn: "Bonusları Çek",
    manageManagers: "Yöneticiler",
    assignEmployee: "+ Ekle",
    enterTgId: "Telegram ID",
    activeEmployees: "Personel",
    managerAddError: "❌ Bulunamadı. Önce /start yapmalı.",
    managerAddSuccess: "✅ ID {id} artık Yönetici.",
    managerRemoveSuccess: "🗑️ Kaldırıldı.",
    analyzing: "Analiz ediliyor...",
    manageFaq: "SSS Yönetimi",
    deleteFaqConfirm: "Silinsin mi?",
    addFaq: "Ekle",
    newFaq: "Yeni SSS",
    editFaq: "Düzenle",
    faqTopic: "Soru",
    faqContent: "Cevap",
    saveBtn: "Kaydet",
    cancelBtn: "İptal",
    myReferrals: "Referanslarım",
    friendLabel: "Arkadaş"
  },
  de: {
    adminTitle: "Admin-Bereich",
    adminSubtitle: "Statistiken",
    tabReferral: "Empfehlung",
    tabStats: "Statistik",
    tabFaq: "FAQ",
    loading: "Laden...",
    bonusBalance: "Kontostand",
    invitedCount: "Freunde eingeladen",
    inviteTitle: "Einladungslink",
    promoLabel: "PROMO-CODE",
    copyBtn: "Kopieren",
    getQrBtn: "QR im Chat",
    loginTitle: "Login",
    loginDesc: "Geben Sie Ihre Telegram-ID ein.",
    loginPlaceholder: "Ihre ID",
    loginBtn: "Login",
    roleFounder: "Besitzer",
    roleManager: "Manager",
    roleUser: "Kunde",
    ownerBadge: "Gründer",
    statsTotalUsers: "Gesamt Kunden",
    activeReferrers: "Aktive Empfehlungen",
    userDatabase: "Benutzerdatenbank",
    searchPlaceholder: "Suche ID oder @username...",
    payoutsTitle: "Auszahlungen & Analysen",
    balanceLabel: "konto",
    invitedLabel: "freunde",
    paidLabel: "bezahlt",
    payoutBtn: "Auszahlen $",
    payoutSuccess: "✅ ${amount} ausgezahlt",
    payoutHistory: "Auszahlungshistorie (letzte 3):",
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
    friendLabel: "Freund"
  },
  pl: {
    adminTitle: "Panel Admina",
    adminSubtitle: "Statystyki",
    tabReferral: "Polecenia",
    tabStats: "Statystyka",
    tabFaq: "FAQ",
    loading: "Ładowanie...",
    bonusBalance: "Saldo",
    invitedCount: "Zaproszeni",
    inviteTitle: "Link polecający",
    promoLabel: "KOD PROMO",
    copyBtn: "Kopiuj",
    getQrBtn: "Odbierz QR",
    loginTitle: "Logowanie",
    loginDesc: "Wpisz Telegram ID.",
    loginPlaceholder: "Twój ID",
    loginBtn: "Zaloguj",
    roleFounder: "Właściciel",
    roleManager: "Menedżer",
    roleUser: "Klient",
    ownerBadge: "Founder",
    statsTotalUsers: "Suma użytkowników",
    activeReferrers: "Aktywni polecający",
    userDatabase: "Baza użytkowników",
    searchPlaceholder: "Szukaj ID lub @username...",
    payoutsTitle: "Wypłaty i Analityka",
    balanceLabel: "saldo",
    invitedLabel: "znajomych",
    paidLabel: "wypłacono",
    payoutBtn: "Wypłać $",
    payoutSuccess: "✅ Wypłacono ${amount}",
    payoutHistory: "Historia wypłat (ostatnie 3):",
    notePlaceholder: "Notatka...",
    fromReferrer: "Od: {id}",
    noResults: "Nic nie znaleziono",
    linkCopied: "Skopiowano!",
    withdrawBtn: "Wypłać",
    manageManagers: "Menedżerowie",
    assignEmployee: "+ Dodaj",
    enterTgId: "Telegram ID",
    activeEmployees: "Kadr",
    managerAddError: "❌ Nie znaleziono.",
    managerAddSuccess: "✅ ID {id} menedżerem.",
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
    friendLabel: "Znajomy"
  },
  ar: {
    adminTitle: "لوحة التحكم",
    adminSubtitle: "الإحصائيات",
    tabReferral: "الإحالة",
    tabStats: "الإحصائيات",
    tabFaq: "الأسئلة",
    loading: "تحميل...",
    bonusBalance: "رصيدك",
    invitedCount: "الأصدقاء المدعوون",
    inviteTitle: "رابط الدعوة",
    promoLabel: "كود الخصم",
    copyBtn: "نسخ",
    getQrBtn: "احصل على QR",
    loginTitle: "دخول",
    loginDesc: "أدخل معرف تليجرام.",
    loginPlaceholder: "معرفك",
    loginBtn: "دخول",
    roleFounder: "المالك",
    roleManager: "مدير",
    roleUser: "عميل",
    ownerBadge: "المؤسس",
    statsTotalUsers: "إجمالي العملاء",
    activeReferrers: "المحيلون النشطون",
    userDatabase: "قاعدة بيانات المستخدمين",
    searchPlaceholder: "بحث عن المعرف أو @username...",
    payoutsTitle: "المدفوعات والتحليلات",
    balanceLabel: "رصيد",
    invitedLabel: "أصدقاء",
    paidLabel: "مدفوع",
    payoutBtn: "صرف المكافأة $",
    payoutSuccess: "✅ تم صرف ${amount}",
    payoutHistory: "سجل المدفوعات (آخر 3):",
    notePlaceholder: "ملاحظة...",
    fromReferrer: "من: {id}",
    noResults: "لم يتم العثور على شيء",
    linkCopied: "تم النسخ!",
    withdrawBtn: "سحب",
    manageManagers: "المدراء",
    assignEmployee: "+ إضافة",
    enterTgId: "معرف تليجرام",
    activeEmployees: "الموظفون",
    managerAddError: "❌ غير موجود.",
    managerAddSuccess: "✅ أصبح {id} مديراً.",
    managerRemoveSuccess: "🗑️ تمت الإزالة.",
    analyzing: "تحليل...",
    manageFaq: "إدارة الأسئلة",
    deleteFaqConfirm: "حذف؟",
    addFaq: "إضافة",
    newFaq: "سؤال جديد",
    editFaq: "تعديل",
    faqTopic: "السؤال",
    faqContent: "الإجابة",
    saveBtn: "حفظ",
    cancelBtn: "إلغاء",
    myReferrals: "إحالاتي",
    friendLabel: "صديق"
  },
  fa: {
    adminTitle: "پنل مدیریت",
    adminSubtitle: "آمار",
    tabReferral: "دعوت",
    tabStats: "آمار",
    tabFaq: "سوالات",
    loading: "بارگذاری...",
    bonusBalance: "موجودی",
    invitedCount: "دوستان دعوت شده",
    inviteTitle: "لینک دعوت",
    promoLabel: "کد تخفیف",
    copyBtn: "کپی",
    getQrBtn: "دریافت QR",
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
    searchPlaceholder: "جستجوی آیدی یا @username...",
    payoutsTitle: "پرداختی‌ها و آنالیز",
    balanceLabel: "موجودی",
    invitedLabel: "دوستان",
    paidLabel: "پرداخت شده",
    payoutBtn: "پرداخت جایزه $",
    payoutSuccess: "✅ ${amount} پرداخت شد",
    payoutHistory: "تاریخچه پرداختی‌ها (۳ مورد آخر):",
    notePlaceholder: "یادداشت...",
    fromReferrer: "توسط: {id}",
    noResults: "چیزی یافت نشد",
    linkCopied: "کپی شد!",
    withdrawBtn: "برداشت",
    manageManagers: "مدیران",
    assignEmployee: "+ افزودن",
    enterTgId: "آیدی تلگرام",
    activeEmployees: "کارکنان",
    managerAddError: "❌ پیدا نشد.",
    managerAddSuccess: "✅ آیدی {id} مدیر شد.",
    managerRemoveSuccess: "🗑️ حذف شد.",
    analyzing: "تحلیل...",
    manageFaq: "مدیریت سوالات",
    deleteFaqConfirm: "حذف؟",
    addFaq: "افزودن",
    newFaq: "سوال جدید",
    editFaq: "ویرایش",
    faqTopic: "سوال",
    faqContent: "پاسخ",
    saveBtn: "ذخیره",
    cancelBtn: "لغو",
    myReferrals: "زیرمجموعه‌های من",
    friendLabel: "دوست"
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loginInputId, setLoginInputId] = useState('');
  const [lang, setLang] = useState<'ru' | 'en' | 'tr' | 'de' | 'pl' | 'ar' | 'fa'>('ru');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'referral' | 'stats' | 'excursions' | 'requests' | 'faq'>('referral');
  const [referralStats, setReferralStats] = useState({ invited: 0, requests: 0, earned: 0 });
  const [referralDetails, setReferralDetails] = useState<any[]>([]);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const tg = window.Telegram?.WebApp;

  const fetchUserData = async (tgId: number, firstName?: string, username?: string) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const { data: userData, error: fetchErr } = await supabase.from('users').select('*').eq('telegram_id', tgId).single();

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        setErrorMsg(`Database Error: ${fetchErr.message}`);
      }

      let currentUser = userData;

      // САМОРЕГ: Если пользователя нет в БД — создаем его
      if (!userData && (fetchErr?.code === 'PGRST116' || !fetchErr)) {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        const newUser = {
          telegram_id: tgId,
          username: username || firstName || tgUser?.first_name || `user_${tgId}`,
          balance: 0,
          role: 'user',
          invited_count: 0,
          created_at: new Date().toISOString()
        };
        const { data: created, error: regError } = await supabase.from('users').insert(newUser).select().single();
        if (regError) {
          setErrorMsg(`Creation Error: ${regError.message}`);
          console.error(regError);
        }
        if (created) currentUser = created;
      }

      if (currentUser) {
        setUser(currentUser);
        if (currentUser.role === 'founder' || currentUser.role === 'manager') {
          setActiveTab('stats');
        }
        // Fetch invited users
        const { data: invitedUsers } = await supabase
          .from('users')
          .select('telegram_id, username')
          .eq('referrer_id', tgId);

        if (invitedUsers && invitedUsers.length > 0) {
          const details = invitedUsers.map((u: any) => ({
            telegram_id: u.telegram_id,
            username: u.username || `user_${u.telegram_id}`
          }));
          setReferralDetails(details);
          setReferralStats({ invited: invitedUsers.length, requests: 0, earned: currentUser.balance || 0 });
        } else {
          setReferralStats({ invited: 0, requests: 0, earned: currentUser.balance || 0 });
        }
      }
    } catch (err: any) {
      setErrorMsg(`System Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }

      // 1. Check URL parameters first (most reliable if coming from bot button)
      const params = new URLSearchParams(window.location.search);
      const uid = params.get('uid');
      if (uid && !isNaN(parseInt(uid))) {
        await fetchUserData(parseInt(uid));
        return;
      }

      // 2. Try to get ID from Telegram WebApp SDK with more retries
      let tgUser: any = null;
      for (let i = 0; i < 15; i++) { // Increased retries to 3 seconds
        tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser?.id) break;
        
        // Try parsing initData if object is missing
        if (window.Telegram?.WebApp?.initData) {
          try {
            const paramsRaw = new URLSearchParams(window.Telegram.WebApp.initData);
            const userStr = paramsRaw.get('user');
            if (userStr) {
               tgUser = JSON.parse(decodeURIComponent(userStr));
               if (tgUser?.id) break;
            }
          } catch(e) {}
        }
        await new Promise(r => setTimeout(r, 200));
      }

      if (tgUser?.id) {
        const supported = ['ru', 'en', 'tr', 'de', 'pl', 'ar', 'fa'];
        const userLang = supported.includes(tgUser.language_code) ? tgUser.language_code : 'en';
        setLang(userLang as any);
        await fetchUserData(tgUser.id, tgUser.first_name, tgUser.username);
      } else {
        // Only stop loading if we truly can't find a user
        setLoading(false);
      }
    };
    init();
  }, []);

  const t = translations[lang] || translations.en;

if (loading) return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-medium animate-pulse">{t.loading}</p>
    </div>
  );

  if (!user) {
    return (
      <div className="bg-[#0f0f11] min-h-screen flex items-center justify-center p-6 text-slate-200">
        <div className="glass-card p-8 rounded-3xl w-full max-w-sm space-y-6 shadow-2xl border border-white/5">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold">{t.loginTitle}</h1>
            <p className="text-sm text-slate-400">{t.loginDesc}</p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-xs text-red-400 text-center animate-in fade-in zoom-in duration-300">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="number"
              value={loginInputId}
              onChange={(e) => setLoginInputId(e.target.value)}
              placeholder={t.loginPlaceholder}
              className="w-full bg-[#1a1a1d] border border-white/10 rounded-2xl p-4 text-center text-lg focus:border-primary/50 outline-none transition-all"
            />
            <button
              disabled={loading || !loginInputId}
              onClick={async () => { 
                if (loginInputId) {
                  const id = parseInt(loginInputId);
                  if (!isNaN(id)) await fetchUserData(id); 
                }
              }}
              className="w-full bg-primary/20 text-primary border border-primary/30 py-4 rounded-2xl font-bold hover:bg-primary/30 transition-all active:scale-95 shadow-lg shadow-primary/5 disabled:opacity-50"
            >
              {loading ? (lang === 'ru' ? 'Загрузка...' : 'Loading...') : t.loginBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.role === 'founder' || user?.role === 'manager';
  const botUsername = window.Telegram?.WebApp?.initDataUnsafe?.receiver?.username || 'aiemedeoapp_bot';
  const refLink = user?.telegram_id ? `https://t.me/${botUsername}?start=${user.telegram_id}` : '';

  const renderContent = () => {
    switch (activeTab) {
      case 'referral':
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Balance card */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 rounded-3xl border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -z-10" />
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2">{t.bonusBalance}</p>
              <h2 className="text-5xl font-black text-white mb-1">{user.balance?.toLocaleString() || '0'} <span className="text-primary">$</span></h2>
              <p className="text-[10px] text-slate-500 mb-4">Приглашайте друзей и получайте бонусы!</p>
              <button
                onClick={() => setIsWithdrawOpen(true)}
                className="px-8 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-primary/30"
              >
                {t.withdrawBtn}
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t.invitedCount, value: referralStats.invited, icon: 'group_add', color: 'text-blue-400' },
                { label: t.bonusBalance, value: referralStats.earned + ' $', icon: 'payments', color: 'text-primary' },
              ].map((s) => (
                <div key={s.label} className="bg-[#1a1a1d] p-4 rounded-2xl border border-white/5 text-center">
                  <span className={`material-symbols-outlined ${s.color} text-[20px]`}>{s.icon}</span>
                  <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Per-referral detail list */}
            {referralDetails.length > 0 && (
              <div className="bg-[#1a1a1d] rounded-3xl border border-white/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                  <h3 className="text-sm font-bold text-slate-200">
                    {lang === 'ru' ? 'Мои рефералы' : lang === 'tr' ? 'Referanslarım' : 'My Referrals'}
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {referralDetails.map((ref, idx) => (
                    <div key={ref.telegram_id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-black text-primary">#{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">@{ref.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{ref.telegram_id}</p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-slate-500">
                          {lang === 'ru' ? 'Друг' : 'Friend'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referral link block */}
            <div className="bg-[#1a1a1d] p-5 rounded-3xl border border-primary/20 space-y-4 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] -z-10" />
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">share</span>
                {t.inviteTitle}
              </h3>
              <div className="flex gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/5">
                <input readOnly value={refLink} className="flex-1 bg-transparent px-3 text-xs font-mono text-primary outline-none min-w-0" />
                <button
                  onClick={() => { navigator.clipboard.writeText(refLink); tg?.showAlert(t.linkCopied); }}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-[11px] font-bold whitespace-nowrap active:scale-95 transition-all hover:bg-primary/30"
                >
                  {t.copyBtn}
                </button>
              </div>
              {/* Promo code */}
              <div className="flex items-center gap-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.promoLabel}:</span>
                <span className="font-black text-primary font-mono flex-1">{user.telegram_id}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(String(user.telegram_id)); tg?.showAlert(t.linkCopied); }}
                  className="text-[10px] px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-bold active:scale-95 transition-all"
                >
                  {t.copyBtn}
                </button>
              </div>
              {/* QR */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="bg-white p-3 rounded-2xl w-fit shadow-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(refLink)}&margin=8`} alt="QR" className="block rounded-lg" />
                </div>
                <button
                  onClick={() => {
                    // openTelegramLink triggers the bot with a start payload — most reliable method
                    const link = `https://t.me/${botUsername}?start=getqr_${user.telegram_id}`;
                    try {
                      tg?.openTelegramLink(link);
                    } catch {
                      window.open(link, '_blank');
                    }
                  }}
                  className="w-full py-3 bg-primary/15 border border-primary/30 rounded-2xl text-xs font-black text-primary uppercase tracking-widest active:scale-95 transition-all hover:bg-primary/25 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                  {t.getQrBtn}
                </button>
              </div>
            </div>
          </div>
        );
      case 'stats': return <AdminStats t={t} />;
      case 'faq': return <AdminFaq t={t} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-slate-100 font-sans pb-32">
      {/* Header */}
      <header className="px-6 pt-10 pb-5 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
            {activeTab === 'referral' ? (lang === 'ru' ? 'Профиль' : lang === 'tr' ? 'Profil' : 'Profile') : t.adminSubtitle}
          </p>
          <h1 className="text-2xl font-black text-white">
            {activeTab === 'referral' ? `@${user.username || 'User'}` : t.adminTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${
            user.role === 'founder' ? 'bg-yellow-500/20 text-yellow-400' :
            user.role === 'manager' ? 'bg-primary/20 text-primary' :
            'bg-white/5 text-slate-500'
          }`}>
            {user.role === 'founder' ? (t.ownerBadge || 'Owner') : user.role === 'manager' ? t.roleManager : t.roleUser}
          </span>
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-[#1a1a1d] px-3 py-1.5 rounded-full border border-white/10 active:scale-95 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-primary text-[16px]">language</span>
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{lang}</span>
              <span className={`material-symbols-outlined text-[14px] text-slate-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-28 bg-[#1a1a1d] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {(['ru', 'en', 'tr', 'de', 'pl', 'ar', 'fa'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setIsLangOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between ${
                        lang === l ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {l}
                      {lang === l && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 max-w-2xl mx-auto">
        {(() => {
          try {
            return renderContent();
          } catch (e) {
            console.error("Render Error:", e);
            return <div className="p-10 text-center text-red-400">Ошибка отображения. Пожалуйста, перезапустите приложение.</div>;
          }
        })()}
      </main>

      {/* Nav */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center px-2 py-2 bg-[#1a1a1d]/90 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl">
        <button
          onClick={() => setActiveTab('referral')}
          className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all ${
            activeTab === 'referral' ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'referral' ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">{lang === 'ru' ? 'Бонусы' : lang === 'tr' ? 'Bonus' : 'Bonus'}</span>
        </button>


        {isOwner && (
          <>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all ${
                activeTab === 'stats' ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'stats' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
              <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">{t.tabStats}</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all ${
                activeTab === 'faq' ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'faq' ? "'FILL' 1" : "'FILL' 0" }}>help</span>
              <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">{t.tabFaq}</span>
            </button>
          </>
        )}
      </nav>

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={user.balance || 0}
        lang={lang === 'en' ? 'ru' : lang as any} // Fallback to ru for tr/en if needed, or update modal
      />
    </div>
  );
};

export default App;
