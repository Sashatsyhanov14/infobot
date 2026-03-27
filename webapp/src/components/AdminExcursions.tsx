import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Excursion {
    id?: string;
    sort_number: number;
    city: string;
    title: string;
    description: string;
    price_rub: number;
    duration: string;
    included: string;
    meeting_point: string;
    image_url: string;
    is_active: boolean;
}

export default function AdminExcursions({ t }: { t: any }) {
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Excursion>>({});

    useEffect(() => {
        fetchExcursions();
    }, []);

    const fetchExcursions = async () => {
        setLoading(true);
        const { data } = await supabase.from('excursions').select('*').order('sort_number', { ascending: true });
        if (data) setExcursions(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.city) return;

        if (editingId === 'new') {
            await supabase.from('excursions').insert([{ ...formData, is_active: true }]);
        } else {
            await supabase.from('excursions').update(formData).eq('id', editingId);
        }
        setEditingId(null);
        setFormData({});
        fetchExcursions();
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from('excursions').update({ is_active: !current }).eq('id', id);
        fetchExcursions();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Точно удалить эту позицию?')) {
            await supabase.from('excursions').delete().eq('id', id);
            fetchExcursions();
        }
    };

    if (loading) return <div className="text-center p-4 animate-pulse text-on-surface-variant">Загрузка каталога...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center pl-1">
                <h3 className="text-lg font-headline font-bold text-on-surface">Управление каталогом</h3>
                <button
                    onClick={() => { setEditingId('new'); setFormData({ sort_number: (excursions[excursions.length - 1]?.sort_number || 0) + 10 }); }}
                    className="flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-all hover:bg-primary/30"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Добавить
                </button>
            </div>

            {editingId && (
                <div className="glass-card p-4 rounded-xl space-y-3 border border-primary/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    <h4 className="font-bold text-primary mb-3 text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined">{editingId === 'new' ? 'add_circle' : 'edit_square'}</span>
                        {editingId === 'new' ? 'Новая позиция' : 'Редактировать позицию'}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Сортировка</label>
                            <input type="number" placeholder="10" value={formData.sort_number || ''} onChange={e => setFormData({ ...formData, sort_number: parseInt(e.target.value) })}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Город/Категория</label>
                            <input type="text" placeholder="Dubai" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Название</label>
                        <input type="text" placeholder="Сафари тур" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Описание</label>
                        <textarea placeholder="Опишите услугу..." value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3}
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Цена (RUB)</label>
                            <input type="number" placeholder="5000" value={formData.price_rub || ''} onChange={e => setFormData({ ...formData, price_rub: parseInt(e.target.value) })}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Длительность</label>
                            <input type="text" placeholder="3 часа" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Включено</label>
                        <textarea placeholder="Трансфер, гид..." value={formData.included || ''} onChange={e => setFormData({ ...formData, included: e.target.value })} rows={2}
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">Точка сбора</label>
                        <input type="text" placeholder="Отель Мариотт" value={formData.meeting_point || ''} onChange={e => setFormData({ ...formData, meeting_point: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider pl-1 mb-1 block">URL Картинки</label>
                        <input type="text" placeholder="https://..." value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-2 text-sm text-on-surface focus:border-primary/50 focus:outline-none" />
                    </div>

                    <div className="flex gap-3 pt-3">
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-xl font-bold transition-colors hover:bg-surface-container-highest">
                            Отмена
                        </button>
                        <button onClick={handleSave} className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(208,188,255,0.3)] hover:brightness-110 active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Сохранить
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {excursions.map(exc => (
                    <div key={exc.id} className={`glass-card p-4 rounded-xl relative overflow-hidden transition-all ${exc.is_active ? 'border-primary/20' : 'border-outline-variant/10 opacity-60'}`}>
                        <div className="flex items-start gap-4">
                            {exc.image_url && (
                                <img src={exc.image_url} alt="img" className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                            )}
                            <div className="flex-1">
                                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{exc.city}</span>
                                <h4 className="font-headline font-bold text-on-surface text-sm mb-1 line-clamp-2">{exc.title}</h4>
                                <div className="text-xs text-on-surface-variant mt-2 flex justify-between pr-2 border-t border-white/5 pt-2">
                                    <span>{exc.duration}</span>
                                    <span className="font-bold text-green-400">{exc.price_rub} RUB</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1">
                            <button onClick={() => toggleActive(exc.id!, exc.is_active)} className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors active:scale-90 ${exc.is_active ? 'bg-secondary/20 text-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                                <span className="material-symbols-outlined text-[16px]">{exc.is_active ? 'visibility' : 'visibility_off'}</span>
                            </button>
                            <button onClick={() => { setEditingId(exc.id!); setFormData(exc); }} className="w-7 h-7 rounded-md bg-surface-container-high text-on-surface flex items-center justify-center transition-colors hover:bg-surface-container-highest active:scale-90">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button onClick={() => handleDelete(exc.id!)} className="w-7 h-7 rounded-md bg-error/10 text-error flex items-center justify-center transition-all hover:bg-error hover:text-white active:scale-90">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
