-- =============================================
-- InfoBot / Excursion Bot — ПОЛНАЯ СТРУКТУРА БАЗЫ
-- =============================================

-- Включаем генерацию UUID
create extension if not exists "uuid-ossp";

-- 1. ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ (users)
CREATE TABLE IF NOT EXISTS users (
    telegram_id BIGINT PRIMARY KEY,
    username TEXT,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'founder', 'manager')),
    referrer_id BIGINT REFERENCES users(telegram_id),
    invited_count INTEGER DEFAULT 0,
    note TEXT,                                   -- Заметки менеджера о пользователе
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ТАБЛИЦА ЭКСКУРСИЙ / КАТАЛОГА (excursions)
CREATE TABLE IF NOT EXISTS excursions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sort_number INTEGER DEFAULT 1,
    city TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_rub INTEGER NOT NULL,                  -- Базовая цена за человека
    duration TEXT,                               -- Длительность (текст)
    included TEXT,                               -- Что включено
    meeting_point TEXT,                          -- Точка сбора
    image_url TEXT,                              -- Главное фото
    image_urls TEXT[] DEFAULT '{}',              -- Галерея доп. фото
    is_active BOOLEAN DEFAULT true,
    
    -- Мультиязычные поля
    city_en TEXT, title_en TEXT, description_en TEXT, duration_en TEXT, included_en TEXT, meeting_point_en TEXT,
    city_tr TEXT, title_tr TEXT, description_tr TEXT, duration_tr TEXT, included_tr TEXT, meeting_point_tr TEXT,
    city_de TEXT, title_de TEXT, description_de TEXT, duration_de TEXT, included_de TEXT, meeting_point_de TEXT,
    city_pl TEXT, title_pl TEXT, description_pl TEXT, duration_pl TEXT, included_pl TEXT, meeting_point_pl TEXT,
    city_ar TEXT, title_ar TEXT, description_ar TEXT, duration_ar TEXT, included_ar TEXT, meeting_point_ar TEXT,
    city_fa TEXT, title_fa TEXT, description_fa TEXT, duration_fa TEXT, included_fa TEXT, meeting_point_fa TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ТАБЛИЦА ЗАЯВОК / БРОНИРОВАНИЙ (requests)
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
    excursion_id UUID REFERENCES excursions(id) ON DELETE SET NULL,
    excursion_title TEXT,                       -- Название на момент заказа
    full_name TEXT,                             -- Имя клиента
    phone TEXT,                                 -- Телефон/WhatsApp
    tour_date TEXT,                             -- Желаемая дата (текст)
    hotel_name TEXT,                            -- Отель/место
    price_rub INTEGER,                          -- Итоговая цена
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'done', 'cancelled')),
    assigned_manager BIGINT REFERENCES users(telegram_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ИСТОРИЯ ДИАЛОГОВ (chat_history) — для контекста AI
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. FAQ / БАЗА ЗНАНИЙ (faq)
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    content_ru TEXT NOT NULL,                   -- Основной контент (переводится AI на лету)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ИНДЕКСЫ (для скорости работы)
CREATE INDEX IF NOT EXISTS idx_users_referrer ON users(referrer_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_excursions_active ON excursions(is_active);
CREATE INDEX IF NOT EXISTS idx_excursions_sort ON excursions(sort_number);
