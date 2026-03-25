#!/bin/bash

# Скрипт настройки .env для BOT #4
echo "---------------------------------------------------"
echo "🛠 Настройка .env для BOT #4 (Порт 3004)..."
echo "---------------------------------------------------"

ENV_FILE="bot/.env"
mkdir -p bot

read -p "BOT_TOKEN: " bot_token
read -p "OPENAI_API_KEY: " openai_key
read -p "SUPABASE_URL: " sb_url
read -p "SUPABASE_ANON_KEY: " sb_anon
read -p "SUPABASE_SERVICE_ROLE_KEY: " sb_service
read -p "WEBAPP_URL: " webapp_url
port=3004

cat <<EOF > $ENV_FILE
BOT_TOKEN=$bot_token
OPENAI_API_KEY=$openai_key
SUPABASE_URL=$sb_url
SUPABASE_ANON_KEY=$sb_anon
SUPABASE_SERVICE_ROLE_KEY=$sb_service
WEBAPP_URL=$webapp_url
PORT=$port
EOF

echo ""
echo "✅ Файл $ENV_FILE успешно создан!"
echo "---------------------------------------------------"
echo "Команды для запуска:"
echo "cd bot && npm install"
echo "cd .. && pm2 start ecosystem.config.js --name bot4"
echo "---------------------------------------------------"
