const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { Telegraf } = require('telegraf');
const OpenAI = require('openai');

dotenv.config();

async function check() {
    console.log("-----------------------------------------");
    console.log("🛠  Checking InfoBot Environment...");
    console.log("-----------------------------------------");

    const required = ['BOT_TOKEN', 'OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'PORT'];
    let allOk = true;

    for (const key of required) {
        if (!process.env[key]) {
            console.error(`❌ Missing: ${key}`);
            allOk = false;
        } else {
            const val = process.env[key];
            const masked = val.length > 10 ? val.substring(0, 4) + "..." + val.substring(val.length - 4) : val;
            console.log(`✅ Found: ${key} (${masked})`);
        }
    }

    if (!allOk) {
        console.error("\n🛑 Critical error: Some keys are missing. Check your .env file.");
        process.exit(1);
    }

    // 1. Check Supabase
    console.log("\n📡 Testing Supabase connection...");
    try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log(`✅ Supabase OK. Total users in DB: ${data || 0}`);
    } catch (e) {
        console.error(`❌ Supabase Failed: ${e.message}`);
    }

    // 2. Check Telegraf
    console.log("\n🤖 Testing Telegram Bot Token...");
    try {
        const bot = new Telegraf(process.env.BOT_TOKEN);
        const me = await bot.telegram.getMe();
        console.log(`✅ Telegram OK. Bot Username: @${me.username}`);
    } catch (e) {
        console.error(`❌ Telegram Failed: ${e.message}`);
    }

    // 3. Check OpenAI / OpenRouter
    console.log("\n🧠 Testing OpenAI/OpenRouter Connection...");
    try {
        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 10000
        });
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 5
        });
        console.log(`✅ OpenAI OK. Response received.`);
    } catch (e) {
        console.error(`❌ OpenAI Failed: ${e.message}`);
    }

    console.log("\n-----------------------------------------");
    console.log("🏁 Verification Completed.");
    console.log("-----------------------------------------");
}

check();
