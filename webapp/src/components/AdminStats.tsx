import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminStats({ t, globalStats }: { t: any, globalStats: any }) {
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);
    const [usersInfo, setUsersInfo] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newManagerId, setNewManagerId] = useState('');
    const [managersList, setManagersList] = useState<any[]>([]);
    const tg = window.Telegram?.WebApp;

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);

        const { data: allUsers } = await supabase
            .from('users')
            .select('telegram_id, username, referrer_id, balance, role, created_at');

        if (allUsers) {
            const uMap: Record<string, any> = {};
            allUsers.forEach((u: any) => {
                uMap[u.telegram_id] = { ...u, invitedCount: 0 };
            });

            allUsers.forEach((u: any) => {
                if (u.referrer_id && uMap[u.referrer_id]) {
                    uMap[u.referrer_id].invitedCount++;
                }
            });

            const sortedUsers = Object.values(uMap)
                .filter((u: any) => u.invitedCount > 0 || (u.balance || 0) > 0)
                .sort((a: any, b: any) => b.invitedCount - a.invitedCount);

            setUsersInfo(sortedUsers);
        }

        const { data: mUsers } = await supabase.from('users').select('*').in('role', ['manager', 'founder']);
        if (mUsers) setManagersList(mUsers);

        setLoading(false);
    };

    const handleAddManager = async () => {
        if (!newManagerId) return;
        const tgId = parseInt(newManagerId);
        const { data: existingUser } = await supabase.from('users').select('*').eq('telegram_id', tgId).single();
        if (!existingUser) {
            tg?.showAlert(t.managerAddError);
            return;
        }
        const { error } = await supabase.from('users').update({ role: 'manager' }).eq('telegram_id', tgId);
        if (!error) {
            setManagersList(prev => {
                if (prev.find(m => m.telegram_id === tgId)) return prev;
                return [...prev, { ...existingUser, role: 'manager' }];
            });
            tg?.showAlert(t.managerAddSuccess?.replace('{id}', String(tgId)) || 'Успешно!');
            setNewManagerId('');
        } else {
            tg?.showAlert(t.managerAddFail);
        }
    };

    const handleRemoveManager = async (tgId: number) => {
        const { error } = await supabase.from('users').update({ role: 'client' }).eq('telegram_id', tgId);
        if (!error) {
            setManagersList(prev => prev.filter(m => m.telegram_id !== tgId));
            tg?.showAlert(t.managerRemoveSuccess?.replace('{id}', String(tgId)) || 'Удален.');
        }
    };

    const handleMarkPaid = async (tgId: number, currentBalance: number) => {
        if (!window.confirm(`Выплатить $${currentBalance.toFixed(2)} пользователю?\nБаланс будет обнулен.`)) return;
        const { error } = await supabase.from('users').update({ balance: 0 }).eq('telegram_id', tgId);
        if (!error) {
            alert('Выплата зафиксирована!');
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            {/* Manager Management */}
            <section className="space-y-4 border-b border-white/5 pb-6">
                <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">engineering</span>
                    {t.manageManagers}
                </h3>
                <div className="glass-card p-4 rounded-xl space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={newManagerId}
                            onChange={(e) => setNewManagerId(e.target.value)}
                            className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 min-h-[42px] text-sm text-on-surface focus:outline-none focus:border-primary/50"
                            placeholder={t.enterTgId}
                        />
                        <button onClick={handleAddManager} className="w-[42px] h-[42px] bg-primary/20 text-primary border border-primary/30 flex items-center justify-center rounded-lg active:scale-95">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>

                    {managersList.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-outline-variant/10 space-y-2">
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t.activeEmployees}</p>
                            {managersList.map((m) => (
                                <div key={m.telegram_id} className="flex justify-between items-center bg-surface-container-lowest p-2 px-3 rounded-lg border border-outline-variant/10">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-tertiary">{m.role === 'founder' ? 'shield_person' : 'badge'}</span>
                                        <span className="text-sm text-on-surface font-medium truncate w-36">@{m.username || String(m.telegram_id)}</span>
                                        {m.role === 'founder' && <span className="text-[8px] uppercase tracking-widest bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm font-bold">{t.ownerBadge}</span>}
                                    </div>
                                    {m.role !== 'founder' && (
                                        <button onClick={() => handleRemoveManager(m.telegram_id)} className="text-error hover:bg-error/10 p-1.5 rounded-md transition-colors active:scale-95">
                                            <span className="material-symbols-outlined text-[16px]">person_remove</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Global Stats */}
            <section className="grid grid-cols-2 gap-3">
                <div className="bg-[#201f22] p-4 rounded-xl flex flex-col justify-between min-h-[100px] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg"><span className="material-symbols-outlined text-primary text-[18px]">group</span></div>
                        <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">{t.totalUsers}</p>
                    </div>
                    <span className="text-3xl font-headline font-extrabold text-on-surface">{globalStats.totalUsers}</span>
                </div>
                <div className="bg-[#201f22] p-4 rounded-xl flex flex-col justify-between min-h-[100px] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-secondary/10 p-1.5 rounded-lg"><span className="material-symbols-outlined text-secondary text-[18px]">person_add</span></div>
                        <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">{t.totalReferrals}</p>
                    </div>
                    <span className="text-3xl font-headline font-extrabold text-on-surface">{globalStats.totalReferrals}</span>
                </div>
            </section>

            {/* Users / Referral Activity */}
            <section>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">leaderboard</span>
                    {t.tabUsers}
                </h3>
                {loading ? (
                    <div className="text-center p-4 animate-pulse text-on-surface-variant">{t.analyzing}</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {usersInfo.length === 0 && <p className="text-sm text-center text-on-surface-variant py-4">{t.noActivity}</p>}
                        {usersInfo.slice(0, isUsersExpanded ? undefined : 6).map(u => (
                            <div key={u.telegram_id} className="glass-card p-4 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-headline font-semibold text-on-surface text-sm">{u.username ? `@${u.username}` : String(u.telegram_id)}</p>
                                        <div className="flex gap-3 text-[10px] text-on-surface-variant uppercase mt-1">
                                            <span>{t.invitedLabelStats} <b className="text-primary">{u.invitedCount}</b></span>
                                        </div>
                                    </div>
                                    {(u.balance || 0) > 0 && (
                                        <div className="text-right">
                                            <p className="text-[10px] text-on-surface-variant uppercase">{t.balance}</p>
                                            <p className="font-headline font-bold text-green-400">${(u.balance || 0).toFixed(2)}</p>
                                            <button onClick={() => handleMarkPaid(u.telegram_id, u.balance)} className="mt-1 bg-tertiary/20 text-tertiary border border-tertiary/30 px-2 py-0.5 text-[9px] rounded font-bold uppercase active:scale-95">
                                                Выплатить
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {usersInfo.length > 6 && (
                            <button onClick={() => setIsUsersExpanded(!isUsersExpanded)} className="w-full py-3 bg-surface-container-high rounded-xl text-primary text-sm font-bold active:scale-95 border border-white/5">
                                {isUsersExpanded ? t.hideAll : t.showAll.replace('{count}', usersInfo.length)}
                            </button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
