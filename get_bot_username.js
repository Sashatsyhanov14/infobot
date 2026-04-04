const axios = require('axios');
const token = '7744149767:AAGtfpAcvrojNfJcgyxKV5up7D4_JhLZb8E';

async function getMe() {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
        console.log(response.data.result.username);
    } catch (error) {
        console.error('Error fetching bot username:', error.message);
    }
}

getMe();
