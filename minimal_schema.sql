-- =============================================
-- МИНИМАЛЬНАЯ СТРУКТУРА (Консультант + Рефералка)
-- =============================================

-- Включаем генерацию UUID
create extension if not exists "uuid-ossp";

-- 1. ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ (users)
-- Хранит баланс, роль и кто кого пригласил
CREATE TABLE IF NOT EXISTS users (
    telegram_id BIGINT PRIMARY KEY,
    username TEXT,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'founder', 'manager')),
    referrer_id BIGINT REFERENCES users(telegram_id),
    invited_count INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ТАБЛИЦА FAQ / БАЗА ЗНАНИЙ (faq)
-- Сюда записывай всю информацию, по которой бот должен консультировать
CREATE TABLE IF NOT EXISTS faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ИСТОРИЯ ДИАЛОГОВ (chat_history)
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ТАБЛИЦА ЭКСКУРСИЙ (excursions) — оставляем пустой для совместимости кода
CREATE TABLE IF NOT EXISTS excursions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sort_number INTEGER DEFAULT 1,
    city TEXT DEFAULT '',
    title TEXT DEFAULT '',
    description TEXT,
    price_rub INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_users_referrer ON users(referrer_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
