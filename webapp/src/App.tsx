import React, { useState, useEffect } from 'react';
import { supabase, botConfig } from './lib/supabase';
import WithdrawModal from './components/WithdrawModal';
import AdminStats from './components/AdminStats';
import AdminExcursions from './components/AdminExcursions';
import AdminFaq from './components/AdminFaq';

declare global {
  interface Window { Telegram: any; }
}

const translations = {
  ru: {
    adminTitle: "Панель Основателя",
    adminSubtitle: "Управление",
    userTitle: "Бонусы",
    userSubtitle: "Твоя статистика",
    bonusBalance: "Твой бонусный баланс",
    withdraw: "Вывести",
    invitedLabel: "Приглашено",
    tabReferral: "Бонусы",
    tabStats: "Статистика",
    tabCatalog: "Каталог",
    tabFaq: "FAQ",
    loading: "Загрузка...",
    loginTitle: "Вход в панель",
    loginDesc: "Введите Telegram ID для доступа.",
    loginPlaceholder: "Telegram ID",
    loginBtn: "Войти",
    linkCopied: "Ссылка скопирована!",
    promoTitle: "Поделитесь ссылкой или промокодом:",
    promoLabel: "ПРОМОКОД",
    getQrChat: "Получить QR в чат",
    ownerBadge: "Владелец",
    balance: "Баланс",
    totalUsers: "Всего юзеров",
    totalReferrals: "По рефкам",
    manageManagers: "Управление доступом",
    assignEmployee: "Назначить сотрудника",
    enterTgId: "Telegram ID",
    activeEmployees: "Действующие сотрудники",
    managerAddError: "ОШИБКА: Пользователь не запускал бота! Пусть нажмёт /start.",
    managerAddSuccess: "ID {id} теперь Менеджер.",
    managerRemoveSuccess: "Сотрудник {id} удалён.",
    managerAddFail: "Ошибка при добавлении.",
    tabUsers: "Юзеры",
    analyzing: "Анализ базы...",
    noActivity: "Нет активных рефералов",
    invitedLabelStats: "ПРИГЛАСИЛ:",
    hideAll: "Скрыть ⬆",
    showAll: "Показать все ({count}) ⬇",
    saveBtn: "Сохранить",
    cancelBtn: "Отмена",
    manageFaq: "Управление FAQ",
    addFaq: "Добавить",
    newFaq: "Новый FAQ",
    editFaq: "Редактировать",
    faqTopic: "Тема / Вопрос",
    faqContent: "Ответ...",
    deleteFaqConfirm: "Удалить этот вопрос?"
  },
  tr: {
    adminTitle: "Kurucu Paneli",
    adminSubtitle: "Yönetim",
    userTitle: "Bonuslar",
    userSubtitle: "İstatistiklerin",
    bonusBalance: "Bonus Bakiyen",
    withdraw: "Para Çek",
    invitedLabel: "Davet Edildi",
    tabReferral: "Bonuslar",
    tabStats: "İstatistik",
    tabCatalog: "Katalog",
    tabFaq: "SSS",
    loading: "Yükleniyor...",
    loginTitle: "Panele Giriş",
    loginDesc: "Erişim için Telegram ID'nizi girin.",
    loginPlaceholder: "Telegram ID",
    loginBtn: "Giriş Yap",
    linkCopied: "Bağlantı kopyalandı!",
    promoTitle: "Bağlantınızı veya kodunuzu paylaşın:",
    promoLabel: "PROMO",
    getQrChat: "QR'ı Sohbete Al",
    ownerBadge: "Sahibi",
    balance: "Bakiye",
    totalUsers: "Toplam Kullanıcı",
    totalReferrals: "Referans",
    manageManagers: "Erişim Yönetimi",
    assignEmployee: "Çalışan Ata",
    enterTgId: "Telegram ID",
    activeEmployees: "Aktif Çalışanlar",
    managerAddError: "HATA: Kullanıcı botu başlatmamış!",
    managerAddSuccess: "ID {id} artık Yönetici.",
    managerRemoveSuccess: "Çalışan {id} kaldırıldı.",
    managerAddFail: "Ekleme hatası.",
    tabUsers: "Kullanıcılar",
    analyzing: "Veritabanı Analizi...",
    noActivity: "Aktif referans yok",
    invitedLabelStats: "DAVET ETTİ:",
    hideAll: "Gizle ⬆",
    showAll: "Tümünü Göster ({count}) ⬇",
    saveBtn: "Kaydet",
    cancelBtn: "İptal",
    manageFaq: "SSS Yönetimi",
    addFaq: "Ekle",
    newFaq: "Yeni SSS",
    editFaq: "Düzenle",
    faqTopic: "Konu / Soru",
    faqContent: "Cevap...",
    deleteFaqConfirm: "Bu soruyu silmek istiyor musunuz?"
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loginInputId, setLoginInputId] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState({ totalUsers: 0, totalReferrals: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang, setLang] = useState<'ru' | 'tr'>('ru');
  const [activeTab, setActiveTab] = useState<'referral' | 'stats' | 'catalog' | 'faq'>('referral');

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    const init = async () => {
      if (tg) { tg.ready(); tg.expand(); }

      const params = new URLSearchParams(window.location.search);
      const uid = params.get('uid');
      if (uid && !isNaN(parseInt(uid))) {
        await fetchUserData(parseInt(uid));
        return;
      }

      let tgUser: any = null;
      for (let i = 0; i < 5; i++) {
        tgUser = tg?.initDataUnsafe?.user;
        if (tgUser?.id) break;
        await new Promise(r => setTimeout(r, 200));
      }

      if (!tgUser?.id && tg?.initData) {
        try {
          const paramsRaw = new URLSearchParams(tg.initData);
          const userStr = paramsRaw.get('user');
          if (userStr) tgUser = JSON.parse(decodeURIComponent(userStr));
        } catch {}
      }

      if (tgUser?.id) {
        if (tgUser.language_code === 'tr') setLang('tr');
        await fetchUserData(tgUser.id, tgUser.first_name, tgUser.username);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const t = translations[lang];

  const toggleLang = () => setLang(lang === 'ru' ? 'tr' : 'ru');

  const fetchUserData = async (tgId: number, firstName?: string, username?: string) => {
    try {
      setLoading(true);
      const { data: userData, error: fetchErr } = await supabase.from('users').select('*').eq('telegram_id', tgId).single();
      let currentUser = userData;

      if (!userData && (fetchErr?.code === 'PGRST116' || !fetchErr)) {
        const newUser = { telegram_id: tgId, username: username || firstName || `user_${tgId}`, role: 'client', balance: 0 };
        const { data: created } = await supabase.from('users').insert(newUser).select().single();
        if (created) currentUser = created;
      }

      if (currentUser) {
        setUser(currentUser);
        if (currentUser.role === 'founder' || currentUser.role === 'manager') {
          setActiveTab('stats');
        }

        const { data: refs } = await supabase.from('users').select('telegram_id, username, created_at').eq('referrer_id', tgId);
        setReferrals(refs || []);

        if (currentUser.role === 'founder' || currentUser.role === 'manager') {
          const { count: uCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
          const { count: rCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).not('referrer_id', 'is', null);
          setGlobalStats({ totalUsers: uCount || 0, totalReferrals: rCount || 0 });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const botUsername = botConfig?.bot_username || 'your_bot_username';
  const refLink = user ? `https://t.me/${botUsername}?start=${user.telegram_id}` : '';

  const copyRefLink = () => {
    navigator.clipboard.writeText(refLink);
    tg?.showAlert(t.linkCopied);
  };

  const handleManualLogin = async () => {
    if (!loginInputId) return;
    await fetchUserData(parseInt(loginInputId));
  };

  const renderLangSwitcher = () => (
    <button onClick={toggleLang} className="bg-surface-container-high hover:bg-surface-container-highest px-3 py-1.5 rounded-full text-[10px] font-extrabold text-on-surface flex items-center gap-1 transition-colors border border-white/5 active:scale-95">
      <span className="material-symbols-outlined text-[14px]">language</span>
      {lang.toUpperCase()}
    </button>
  );

  if (loading) return <div className="p-8 text-center text-on-surface-variant font-body animate-pulse mt-20">{t.loading}</div>;

  if (!user) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-6 rounded-2xl w-full max-w-sm space-y-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary-container/20 border border-primary/20 rounded-full mx-auto flex items-center justify-center mb-4 neon-glow">
              <span className="material-symbols-outlined text-primary text-3xl">login</span>
            </div>
            <h1 className="text-2xl font-headline font-bold text-slate-100">{t.loginTitle}</h1>
            <p className="text-sm font-body text-on-surface-variant">{t.loginDesc}</p>
          </div>
          <div className="space-y-4">
            <input type="number" value={loginInputId} onChange={(e) => setLoginInputId(e.target.value)} placeholder={t.loginPlaceholder}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary/50 text-center font-mono" />
            <button onClick={handleManualLogin} className="w-full bg-primary/20 text-primary border border-primary/30 py-3 rounded-xl font-bold hover:bg-primary/30 transition-all active:scale-95">
              {t.loginBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFounder = user?.role === 'founder' || user?.role === 'manager';

  const renderHeader = () => (
    <header className="px-6 pt-10 pb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] -z-10 -translate-x-1/2 translate-y-1/4 pointer-events-none"></div>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary tracking-widest uppercase">
            {isFounder && activeTab !== 'referral' ? t.adminSubtitle : t.userSubtitle}
          </p>
          <h1 className="text-3xl font-headline font-extrabold text-slate-100">
            {isFounder && activeTab !== 'referral' ? t.adminTitle : t.userTitle}
          </h1>
        </div>
        {renderLangSwitcher()}
      </div>
    </header>
  );

  const renderUserContent = () => (
    <div className="space-y-6">
      {/* Balance */}
      <div className="bg-[#201f22] p-5 rounded-3xl relative overflow-hidden flex flex-col items-center text-center border border-white/5 mx-2">
        <div className="w-14 h-14 bg-secondary-container/20 border border-secondary/20 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-secondary text-2xl">account_balance_wallet</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.bonusBalance}</p>
        <h2 className="text-4xl font-headline font-extrabold text-slate-100 mb-3">${user?.balance?.toFixed(2) || '0.00'}</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-secondary/10 text-secondary border border-secondary/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
          {t.withdraw}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 mx-2">
        <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg"><span className="material-symbols-outlined text-primary text-[20px]">group_add</span></div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">{t.invitedLabel}</p>
            <span className="text-2xl font-headline font-extrabold text-slate-200">{referrals.length}</span>
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <div className="glass-card p-5 rounded-3xl mx-2 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <h3 className="text-lg font-headline font-bold text-on-surface mb-2">🎁 Реферальная программа</h3>
        <p className="text-sm font-medium text-on-surface-variant mb-4">{t.promoTitle}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-xl border border-outline-variant/10">
            <input type="text" readOnly value={refLink} className="flex-1 bg-transparent text-sm text-on-surface outline-none px-2 font-mono" />
            <button onClick={copyRefLink} className="w-[42px] h-[42px] bg-primary/20 text-primary rounded-lg flex items-center justify-center active:scale-90 transition-transform hover:bg-primary/30">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-xl border border-outline-variant/10">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2 border-r border-outline-variant/10 mr-1">{t.promoLabel}</span>
            <input type="text" readOnly value={user?.telegram_id || ''} className="flex-1 bg-transparent font-bold text-primary outline-none px-2 font-mono text-[15px]" />
            <button onClick={() => { navigator.clipboard.writeText(String(user?.telegram_id)); tg?.showAlert(t.linkCopied); }}
              className="w-[42px] h-[42px] bg-primary/20 text-primary rounded-lg flex items-center justify-center active:scale-90 transition-transform hover:bg-primary/30">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-outline-variant/10 pt-5 flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl w-fit mx-auto shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(refLink)}`} alt="QR Code" width={180} height={180} className="rounded-xl block" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminContent = () => {
    if (activeTab === 'catalog') return <AdminExcursions t={t} />;
    if (activeTab === 'faq') return <AdminFaq t={t} />;
    return <AdminStats t={t} globalStats={globalStats} />;
  };

  return (
    <>
      {renderHeader()}
      <main className="px-4 pt-2 space-y-8 max-w-2xl mx-auto pb-24">
        {isFounder && activeTab !== 'referral' ? renderAdminContent() : renderUserContent()}
      </main>

      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-[#131315]/80 backdrop-blur-2xl rounded-t-[1.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-t border-white/5">
        <button onClick={() => setActiveTab('referral')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'referral' ? 'text-secondary scale-110' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'referral' ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          <span className="font-['Inter'] text-[9px] font-extrabold uppercase tracking-widest mt-1">{t.tabReferral}</span>
        </button>

        {isFounder && (
          <>
            <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'stats' ? 'text-primary scale-110' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'stats' ? "'FILL' 1" : "'FILL' 0" }}>bar_chart</span>
              <span className="font-['Inter'] text-[9px] font-extrabold uppercase tracking-widest mt-1">{t.tabStats}</span>
            </button>
            <button onClick={() => setActiveTab('catalog')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'catalog' ? 'text-primary scale-110' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'catalog' ? "'FILL' 1" : "'FILL' 0" }}>menu_book</span>
              <span className="font-['Inter'] text-[9px] font-extrabold uppercase tracking-widest mt-1">{t.tabCatalog}</span>
            </button>
            <button onClick={() => setActiveTab('faq')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'faq' ? 'text-primary scale-110' : 'text-on-surface-variant'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'faq' ? "'FILL' 1" : "'FILL' 0" }}>help</span>
              <span className="font-['Inter'] text-[9px] font-extrabold uppercase tracking-widest mt-1">{t.tabFaq}</span>
            </button>
          </>
        )}
      </nav>

      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={user?.balance || 0}
        lang={lang}
      />
    </>
  );
};

export default App;
