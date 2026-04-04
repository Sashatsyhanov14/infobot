const OpenAI = require('openai');
const axios = require('axios');
const dotenv = require('dotenv');
const { ANALYZER_PROMPT, WRITER_PROMPT, LOCALIZER_PROMPT } = require('./prompts');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '').trim(),
    timeout: 120000,
    defaultHeaders: {
        'HTTP-Referer': process.env.WEBAPP_URL || 'https://info-bot.com',
        'X-Title': process.env.APP_TITLE || 'Info Bot',
    }
});

module.exports = {
    async getChatResponse(items, faqText, history, userMessage) {
        try {
            // === AGENT 1: ANALYZER ===
            const analyzerMessages = [
                { role: 'system', content: ANALYZER_PROMPT(items) },
                ...history,
                { role: 'user', content: userMessage }
            ];

            const analyzerResponse = await openai.chat.completions.create({
                model: 'openai/gpt-4o-mini',
                messages: analyzerMessages,
                temperature: 0.1
            });

            const rawJsonStr = analyzerResponse.choices[0].message.content;

            let analysis;
            try {
                const cleanJsonStr = rawJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
                analysis = JSON.parse(cleanJsonStr);
            } catch (e) {
                analysis = {
                    lang_code: 'ru',
                    intent: 'consultation',
                    writer_instruction: 'Произошла ошибка анализа. Ответь кратко на вопрос пользователя на основе FAQ.'
                };
            }

            // === AGENT 2: WRITER ===
            const writerMessages = [
                { role: 'system', content: WRITER_PROMPT(items, faqText) },
                {
                    role: 'user',
                    content: `Инструкции Аналитика:\nОтвечай строго на языке: ${analysis.lang_code}\nНамерение: ${analysis.intent}\n\nЧто именно сказать клиенту:\n${analysis.writer_instruction}`
                }
            ];

            const writerResponse = await openai.chat.completions.create({
                model: 'openai/gpt-4o-mini',
                messages: writerMessages,
                temperature: 0.7,
            });

            const finalMessage = writerResponse.choices[0].message.content;
            const embeddedTags = `[LANG:${analysis.lang_code}]`;

            return finalMessage + '\n' + embeddedTags;

        } catch (error) {
            console.error('[OpenAI Fatal Error]:', error.message);
            if (error.response) {
                console.error('[OpenAI Status]:', error.response.status);
                console.error('[OpenAI Data]:', error.response.data);
            }
            return 'Извини, произошла ошибка. Попробуй позже. 🙏';
        }
    },

    async getLocalizedText(langCode, russianText, retries = 2) {
        if (!langCode || langCode === 'ru') return russianText;

        const attempt = async () => {
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Localizer timeout')), 8000)
            );
            const translate = openai.chat.completions.create({
                model: 'openai/gpt-4o-mini',
                messages: [
                    { role: 'system', content: LOCALIZER_PROMPT },
                    { role: 'user', content: `Язык: ${langCode}\nТекст:\n${russianText}` }
                ],
                temperature: 0.2,
            });
            const response = await Promise.race([translate, timeout]);
            return response.choices[0].message.content.trim();
        };

        for (let i = 0; i < retries; i++) {
            try {
                return await attempt();
            } catch (e) {
                if (i < retries - 1) await new Promise(r => setTimeout(r, 1000));
            }
        }

        // Fallback: MyMemory
        try {
            const chunks = russianText.match(/[\s\S]{1,400}/g) || [russianText];
            const translated = [];
            for (const chunk of chunks) {
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ru|${langCode}`;
                const res = await axios.get(url, { timeout: 5000 });
                translated.push(res.data?.responseData?.translatedText || chunk);
            }
            return translated.join('');
        } catch (e) {
            return russianText;
        }
    }
};
