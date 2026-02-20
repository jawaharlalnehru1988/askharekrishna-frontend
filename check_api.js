const fetch = require('node-fetch');

const API_URL = 'https://api.askharekrishna.com/api/api/v1/audio-bg/';

async function checkApi() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(`Total items: ${data.length}`);

        const counts = {};
        data.forEach(item => {
            const id = item.audioListId;
            counts[id] = (counts[id] || 0) + 1;
        });

        console.log('Counts by audioListId:', counts);

        // check sample for bgm
        const bgmSample = data.find(item => item.audioListId === 'bgm');
        if (bgmSample) {
            console.log('Sample bgm item:', JSON.stringify(bgmSample, null, 2));
        } else {
            console.log('No bgm items found');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkApi();
