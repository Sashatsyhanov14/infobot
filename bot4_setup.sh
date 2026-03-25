#!/bin/bash

# Скрипт настройки BOT #4 (Медтуризм / Medical Tourism)
# Инструкция:
# 1. Положите файл в корневую папку 4-го бота
# 2. Выполните: chmod +x bot4_setup.sh
# 3. Запустите: ./bot4_setup.sh

echo "---------------------------------------------------"
echo "🏥 Настройка проекта BOT #4 (Медтуризм)..."
echo "---------------------------------------------------"

# Путь к файлу .env
ENV_FILE="bot/.env"

# Если папки bot нет (на всякий случай), создадим
mkdir -p bot

echo "📝 Введите настройки для этого экземпляра бота:"
echo ""

# 1. Брендирование
read -p "Название приложения (APP_TITLE) [Medicine Guide]: " app_title
app_title=${app_title:-"Medicine Guide"}

read -p "Юзернейм бота без @ (BOT_USERNAME): " bot_username
read -p "Тип ниши (NICHE_TYPE) [medical]: " niche_type
niche_type=${niche_type:-"medical"}

read -p "Приветствие (/start): " welcome_msg
welcome_msg=${welcome_msg:-"Привет! Я твой медицинский ассистент. Помогу найти клинику или врача. С чего начнем?"}

read -p "Текст кнопки WebApp [🏥 Каталог услуг]: " webapp_btn
webapp_btn=${webapp_btn:-"🏥 Каталог услуг"}

# 2. Роль AI
read -p "Имя роли AI (SYSTEM_ROLE_NAME) [Медицинский координатор]: " role_name
role_name=${role_name:-"Медицинский координатор"}

read -p "Описание сферы (SYSTEM_NICHE_DESCRIPTION) [медицинского туризма и клиник]: " niche_desc
niche_desc=${niche_desc:-"медицинского туризма и клиник"}

# 3. Ключи и токены
read -p "Telegram BOT_TOKEN: " bot_token
read -p "OPENAI_API_KEY: " openai_key
read -p "SUPABASE_URL: " sb_url
read -p "SUPABASE_SERVICE_ROLE_KEY: " sb_key
read -p "WEBAPP_URL (URL этого бота на VPS): " webapp_url

# 4. Порт
port=3004

# Сохранение в .env
cat <<EOF > $ENV_FILE
# Настройки проекта (Брендирование)
APP_TITLE="$app_title"
BOT_USERNAME="$bot_username"
NICHE_TYPE="$niche_type"
WELCOME_MESSAGE="$welcome_msg"
WEBAPP_BUTTON_TEXT="$webapp_btn"

# Роль AI (Промпты)
SYSTEM_ROLE_NAME="$role_name"
SYSTEM_NICHE_DESCRIPTION="$niche_desc"

# Данные Telegram
BOT_TOKEN=$bot_token

# Данные OpenAI / OpenRouter
OPENAI_API_KEY=$openai_key

# Данные Supabase (Серверные)
SUPABASE_URL=$sb_url
SUPABASE_SERVICE_ROLE_KEY=$sb_key

# Настройки WebApp
WEBAPP_URL=$webapp_url

# Настройка порта (для PM2)
PORT=$port
EOF

echo ""
echo "✅ Файл $ENV_FILE успешно создан!"
echo "---------------------------------------------------"
echo "🚀 Теперь вы можете запустить бота:"
echo "pm2 start ecosystem.config.js --name bot_medical"
echo "---------------------------------------------------"
