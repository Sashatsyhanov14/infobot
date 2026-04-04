import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const PAYOUT_PREFIX = 'PAYOUT_RECORD:';

const AdminStats: React.FC<{ t: any }> = ({ t }) => {
    const [stats, setStats] = useState({ totalUsers: 0 });
    const [referralRows, setReferralRows] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [managers, setManagers] = useState<any[]>([]);
    const [newManagerId, setNewManagerId] = useState('');
    const [newManagerNote, setNewManagerNote] = useState('');
    const [managerMsg, setManagerMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [payoutMsg, setPayoutMsg] = useState<{ [id: number]: string }>({});
    const [userSearchQuery, setUserSearchQuery] = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchStats(), fetchReferralRows(), fetchManagers(), fetchAllUsers()]);
        setLoading(false);
    };

    const fetchStats = async () => {
        const { count: uCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        setStats({ totalUsers: uCount || 0 });
    };

    const fetchAllUsers = async () => {
        const { data } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        setAllUsers(data || []);
    };

    const fetchReferralRows = async () => {
        // 1. Get all users who have been referred
        const { data: invitedUsers } = await supabase
            .from('users')
            .select('telegram_id, username, referrer_id')
            .not('referrer_id', 'is', null);

        if (!invitedUsers) return;

        // 2. Get unique referrer IDs
        const referrerIds = [...new Set(invitedUsers.map((u: any) => u.referrer_id))];

        // 3. Fetch referrer profiles
        const { data: referrers } = await supabase
            .from('users')
            .select('telegram_id, username, balance, note')
            .in('telegram_id', referrerIds);

        if (!referrers) return;

        // 4. Fetch all payout history
        const { data: allPayouts } = await supabase
            .from('chat_history')
            .select('user_id, content, created_at')
            .in('user_id', referrerIds)
            .like('content', `${PAYOUT_PREFIX}%`)
            .order('created_at', { ascending: false });

        // 5. Build rows
        const rows = referrers.map((ref: any) => {
            const myInvitees = invitedUsers.filter((u: any) => u.referrer_id === ref.telegram_id);
            const myPayouts = (allPayouts || []).filter((p: any) => p.user_id === ref.telegram_id);
            const totalPaid = myPayouts.reduce((sum: number, p: any) => {
                const match = p.content.match(/\$?([\d.]+)/);
                return sum + (match ? parseFloat(match[1]) : 0);
            }, 0);

            return {
                telegram_id: ref.telegram_id,
                username: ref.username,
                balance: ref.balance || 0,
                invitedCount: myInvitees.length,
                totalPaid,
                note: ref.note || '',
                payouts: myPayouts
            };
        });

        setReferralRows(rows.sort((a: any, b: any) => b.invitedCount - a.invitedCount));
    };

    const fetchManagers = async () => {
        const { data } = await supabase.from('users').select('telegram_id, username, role, note').in('role', ['manager', 'founder']);
        setManagers(data || []);
    };

    const handlePayout = async (ref: any) => {
        if (ref.balance <= 0) {
            setPayoutMsg(prev => ({ ...prev, [ref.telegram_id]: '⚠️ ' + (t.noResults || 'Баланс 0') }));
            return;
        }
        const amount = ref.balance;
        await supabase.from('users').update({ balance: 0 }).eq('telegram_id', ref.telegram_id);
        await supabase.from('chat_history').insert({
            user_id: ref.telegram_id,
            role: 'assistant',
            content: `${PAYOUT_PREFIX} $${amount} — Paid ${new Date().toLocaleDateString()}`
        });
        setPayoutMsg(prev => ({ ...prev, [ref.telegram_id]: (t.payoutSuccess || '✅ Paid').replace('{amount}', String(amount)) }));
        fetchReferralRows();
    };

    const handleAddManager = async () => {
        if (!newManagerId || isNaN(parseInt(newManagerId))) return;
        const id = parseInt(newManagerId);
        const { data: existing } = await supabase.from('users').select('*').eq('telegram_id', id).single();
        if (!existing) { setManagerMsg(t.managerAddError || '❌ Не найден'); return; }
        await supabase.from('users').update({ role: 'manager', note: newManagerNote }).eq('telegram_id', id);
        setManagerMsg((t.managerAddSuccess || '✅ OK').replace('{id}', String(id)));
        setNewManagerId('');
        setNewManagerNote('');
        fetchManagers();
    };

    const handleUpdateNote = async (tgId: number, newNote: string) => {
        await supabase.from('users').update({ note: newNote }).eq('telegram_id', tgId);
        fetchAll();
    };

    const handleRemoveManager = async (id: number) => {
        await supabase.from('users').update({ role: 'user' }).eq('telegram_id', id);
        setManagerMsg((t.managerRemoveSuccess || '🗑️ User removed').replace('{id}', String(id)));
        fetchManagers();
    };

    if (loading) return <div className="text-center py-20 opacity-50 animate-pulse">{t.analyzing || 'Анализ...'}</div>;

    const filteredUsers = allUsers.filter(u => 
        String(u.telegram_id).includes(userSearchQuery) || 
        u.username?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1d] p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-white">{stats.totalUsers}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.statsTotalUsers}</p>
                </div>
                <div className="bg-[#1a1a1d] p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-2xl font-black text-primary">{referralRows.length}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.activeReferrers}</p>
                </div>
            </div>

            {/* FULL USER DATABASE */}
            <div className="bg-[#1a1a1d] rounded-3xl border border-white/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">database</span>
                        <h3 className="text-sm font-bold text-slate-200">{t.userDatabase}</h3>
                    </div>
                    <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-full text-slate-500 uppercase">{filteredUsers.length}</span>
                </div>
                
                {/* Search in user list */}
                <div className="px-5 py-3 bg-black/20">
                    <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto no-scrollbar divide-y divide-white/5">
                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                        <div key={u.telegram_id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-200 truncate">@{u.username || 'user'}</p>
                                    <span className="text-[9px] font-mono text-slate-500">{u.telegram_id}</span>
                                </div>
                                <div className="flex gap-2 mt-1">
                                    {u.referrer_id && (
                                        <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                                            {t.fromReferrer.replace('{id}', String(u.referrer_id))}
                                        </span>
                                    )}
                                    <span className="text-[8px] bg-white/5 text-slate-600 px-1.5 py-0.5 rounded">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-primary">${u.balance}</p>
                                <p className="text-[8px] text-slate-500 uppercase font-black uppercase">{u.role}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="p-10 text-center text-xs text-slate-600 uppercase tracking-widest font-black">{t.noResults}</p>
                    )}
                </div>
            </div>


            {/* Referral Analytics + Payouts */}
            {referralRows.length > 0 && (
                <div className="bg-[#1a1a1d] rounded-3xl border border-white/5 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                        <h3 className="text-sm font-bold text-slate-200">{t.payoutsTitle}</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {referralRows.map(ref => (
                            <div key={ref.telegram_id} className="p-4 space-y-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-black text-white truncate">@{ref.username}</p>
                                            <span className="bg-white/5 text-[8px] font-mono text-slate-500 px-1.5 py-0.5 rounded border border-white/5">{ref.telegram_id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-2 py-1 max-w-[180px]">
                                            <span className="material-symbols-outlined text-[12px] text-primary/60">label</span>
                                            <input 
                                                className="text-[10px] font-bold text-primary bg-transparent border-none outline-none w-full placeholder:text-primary/30"
                                                placeholder={t.notePlaceholder}
                                                defaultValue={ref.note}
                                                onBlur={(e) => handleUpdateNote(ref.telegram_id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-primary tracking-tighter">${ref.balance}</p>
                                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none">{t.balanceLabel}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-black/20 p-2 rounded-xl text-center">
                                        <p className={`text-sm font-black text-blue-400`}>{ref.invitedCount}</p>
                                        <p className="text-[8px] text-slate-600 uppercase">{t.invitedLabel}</p>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded-xl text-center">
                                        <p className={`text-sm font-black text-slate-400`}>${ref.totalPaid.toFixed(0)}</p>
                                        <p className="text-[8px] text-slate-600 uppercase">{t.paidLabel}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePayout(ref)}
                                    disabled={ref.balance <= 0}
                                    className="w-full py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all disabled:opacity-30"
                                >
                                    {t.payoutBtn} ${ref.balance}
                                </button>

                                {payoutMsg[ref.telegram_id] && (
                                    <p className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 p-2 rounded-xl text-center">{payoutMsg[ref.telegram_id]}</p>
                                )}

                                {ref.payouts.length > 0 && (
                                    <details className="text-[9px]">
                                        <summary className="text-slate-500 cursor-pointer hover:text-slate-300 font-bold uppercase tracking-wider">{t.payoutHistory || 'Payouts'} ({ref.payouts.length})</summary>
                                        <div className="mt-2 space-y-1 pl-2 border-l border-white/5">
                                            {ref.payouts.map((p: any, i: number) => (
                                                <p key={i} className="text-slate-400 font-mono truncate">{p.content.replace(PAYOUT_PREFIX, '').trim()}</p>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Manager Management */}
            <div className="bg-[#1a1a1d] p-5 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">manage_accounts</span>
                    {t.manageManagers || 'Управление Менеджерами'}
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={newManagerId}
                            onChange={e => setNewManagerId(e.target.value)}
                            placeholder={t.enterTgId}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-primary/50 transition-all"
                        />
                        <button onClick={handleAddManager} className="px-5 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95">
                            {t.assignEmployee || 'Добавить'}
                        </button>
                    </div>
                </div>
                {managerMsg && <p className="text-[10px] text-primary/80 bg-primary/10 border border-primary/20 p-3 rounded-xl">{managerMsg}</p>}
                {managers.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.activeEmployees}</p>
                        {managers.map(m => (
                            <div key={m.telegram_id} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-black text-slate-200">@{m.username || '—'}</p>
                                        <span className="text-[8px] font-mono text-slate-600">{m.telegram_id}</span>
                                    </div>
                                    <input 
                                        className="text-[9px] font-bold text-secondary bg-transparent border-none outline-none w-full placeholder:text-secondary/30"
                                        placeholder={t.notePlaceholder}
                                        defaultValue={m.note}
                                        onBlur={(e) => handleUpdateNote(m.telegram_id, e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    {m.role === 'founder' && <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 uppercase">{t.ownerBadge}</span>}
                                    {m.role !== 'founder' && (
                                        <button onClick={() => handleRemoveManager(m.telegram_id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10">
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStats;
