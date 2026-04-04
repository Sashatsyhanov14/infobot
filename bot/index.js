const { Telegraf, session, Markup } = require('telegraf');
const dotenv = require('dotenv');
const path = require('path');
const { supabase, getUser, createUser, updateUser, getItems, saveMessage, getHistory, getFaq, clearHistory } = require('./src/supabase');
const { getChatResponse, getLocalizedText } = require('./src/openai');

dotenv.config({ path: path.resolve(__dirname, './.env') });

const bot = new Telegraf(process.env.BOT_TOKEN);

const userLangCache = {};

bot.use(session());

// --- CLIENT FLOW ---
bot.start(async (ctx) => {
    const telegramId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'User';
    const startPayload = ctx.payload;

    try {
        await clearHistory(telegramId);

        let { data: user } = await getUser(telegramId);
        if (!user) {
            const referrerId = startPayload && !isNaN(startPayload) ? parseInt(startPayload) : null;
            const { data: newUser } = await createUser({
                telegram_id: telegramId,
                username,
                role: 'client',
                lang_code: ctx.from.language_code || 'ru',
                referrer_id: (referrerId && referrerId !== telegramId) ? referrerId : null,
                balance: 0
            });
            user = newUser;
        }

        const lang = ctx.from.language_code || user?.lang_code || 'ru';
        userLangCache[telegramId] = lang;

        if (user && user.lang_code !== lang) {
            try { await updateUser(telegramId, { lang_code: lang }); } catch (e) {}
        }

        const welcomeRu = process.env.WELCOME_MESSAGE ||
            `Привет, ${username}! 🌍\n\nЯ твой персональный ИИ-ассистент. Отвечу на любые вопросы и помогу найти нужную информацию.\n\nС чего начнём? 👇`;

        const welcomeText = await getLocalizedText(lang, welcomeRu);
        const webappBtnRu = process.env.WEBAPP_BUTTON_TEXT || '📱 Открыть Дашборд';
        const webappBtn = await getLocalizedText(lang, webappBtnRu);

        // Cleanup stale keyboards
        try {
            const k = await ctx.reply('…', Markup.removeKeyboard());
            await bot.telegram.deleteMessage(ctx.chat.id, k.message_id);
        } catch (e) {}

        await ctx.reply(welcomeText,
            Markup.keyboard([
                [Markup.button.webApp(webappBtn, `${process.env.WEBAPP_URL || ''}?uid=${telegramId}`)]
            ]).resize()
        );
    } catch (err) {
        console.error('[START] Error:', err.message);
        try { await ctx.reply('Привет! Напиши свой вопрос, и я постараюсь помочь.'); } catch (e) {}
    }
});

// /ref command
bot.command('ref', async (ctx) => {
    const telegramId = ctx.from.id;
    const lang = userLangCache[telegramId] || ctx.from.language_code || 'ru';
    const botUsername = process.env.BOT_USERNAME || ctx.botInfo.username;
    const refLink = `https://t.me/${botUsername}?start=${telegramId}`;

    const textRu = `🎁 Вот твоя пригласительная ссылка и QR-код:\n\n${refLink}\n\nТвой промокод (для ввода вручную): \`${telegramId}\``;
    const text = await getLocalizedText(lang, textRu);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(refLink)}&margin=10`;

    try {
        await ctx.replyWithPhoto(qrUrl, { caption: text, parse_mode: 'Markdown' });
    } catch (err) {
        await ctx.reply(text, { parse_mode: 'Markdown', disable_web_page_preview: true });
    }
});

// WebApp data handler (for /ref via webapp)
bot.on('message', async (ctx, next) => {
    if (ctx.message?.web_app_data) {
        const data = ctx.message.web_app_data.data;
        if (data === '/ref') {
            const telegramId = ctx.from.id;
            const lang = userLangCache[telegramId] || ctx.from.language_code || 'ru';
            const botUsername = process.env.BOT_USERNAME || ctx.botInfo.username;
            const refLink = `https://t.me/${botUsername}?start=${telegramId}`;
            const textRu = `🎁 Вот твоя пригласительная ссылка:\n\n${refLink}`;
            const text = await getLocalizedText(lang, textRu);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(refLink)}&margin=10`;
            try {
                await ctx.replyWithPhoto(qrUrl, { caption: text, parse_mode: 'Markdown' });
            } catch (e) {
                await ctx.reply(text, { parse_mode: 'Markdown', disable_web_page_preview: true });
            }
        }
        return;
    }
    return next();
});

// AI Chat handler
bot.on('text', async (ctx) => {
    const telegramId = ctx.from.id;
    const userText = ctx.message.text.trim();

    try {
        let { data: user } = await getUser(telegramId);
        const systemLang = ctx.from.language_code || 'ru';

        if (!userLangCache[telegramId]) {
            userLangCache[telegramId] = user?.lang_code || systemLang;
        }

        const uiLang = userLangCache[telegramId];

        if (!user) {
            const msgRu = 'Нажми /start для начала.';
            const msg = await getLocalizedText(systemLang, msgRu);
            return ctx.reply(msg, Markup.removeKeyboard());
        }

        // Promo code logic
        if (!user.referrer_id && /^\d{6,15}$/.test(userText)) {
            const promoId = parseInt(userText);
            if (promoId !== telegramId) {
                const { data: promoUser } = await getUser(promoId);
                if (promoUser) {
                    await supabase.from('users').update({ referrer_id: promoId }).eq('telegram_id', telegramId);
                    user.referrer_id = promoId;
                    const successRu = '✅ Промокод успешно применён! Спасибо.\n\nА теперь задай свой вопрос — я помогу 🌍';
                    const successText = await getLocalizedText(uiLang, successRu);
                    return ctx.reply(successText);
                }
            }
            const failRu = '❌ Неверный или недействительный промокод.';
            const failText = await getLocalizedText(uiLang, failRu);
            return ctx.reply(failText);
        }

        await saveMessage(telegramId, 'user', userText);
        const { data: history } = await getHistory(telegramId);
        const { data: items } = await getItems();
        const { data: faqRows } = await getFaq();
        const faqText = faqRows ? faqRows.map(f => `- ${f.topic}: ${f.content_ru}`).join('\n') : '';

        try { await ctx.sendChatAction('typing'); } catch (e) {}

        const aiResponse = await getChatResponse(items || [], faqText, history || [], userText);

        // Parse lang tag
        const langMatch = aiResponse.match(/\[LANG:\s*(ru|tr|en|fa|ar|de|pl)\]/i);
        if (langMatch) {
            const newLang = langMatch[1].toLowerCase();
            if (newLang !== userLangCache[telegramId]) {
                userLangCache[telegramId] = newLang;
                try { await updateUser(telegramId, { lang_code: newLang }); } catch (e) {}
            }
        }

        let finalResponse = aiResponse.replace(/\[LANG:.*?\]/gi, '').trim();
        const targetLang = userLangCache[telegramId] || 'ru';

        if (!finalResponse) finalResponse = 'Пожалуйста, подожди минуту или переформулируй вопрос.';

        await saveMessage(telegramId, 'assistant', finalResponse);
        try {
            await ctx.reply(finalResponse, { parse_mode: 'Markdown' });
        } catch (e) {
            await ctx.reply(finalResponse);
        }

    } catch (error) {
        console.error('[OpenAI Fatal Error]:', error.message);
        if (error.response) {
            console.error('[OpenAI Status]:', error.response.status);
            console.error('[OpenAI Data]:', error.response.data);
        }
        try { await ctx.reply('Извини, произошла ошибка. Попробуй чуть позже. 🙏'); } catch (e) {}
    }
});

// Launch
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    bot.launch().then(() => console.log('InfoBot is running (Long Polling)...'));
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
