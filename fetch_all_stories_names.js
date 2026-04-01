const fs = require('fs');

async function dumpStories() {
    const API_BASE_URL = 'https://api.askharekrishna.com/api/v1/stories/articles/';
    let allStories = [];
    let nextUrl = API_BASE_URL + "?language=ta";
    
    try {
        while (nextUrl) {
            console.log("Fetching: " + nextUrl);
            const res = await fetch(nextUrl);
            const data = await res.json();
            
            if (data.results) {
                allStories = allStories.concat(data.results.map(s => s.subTopic));
                nextUrl = data.next;
            } else {
                allStories = allStories.concat(data.map(s => s.subTopic));
                nextUrl = null;
            }
        }
        
        fs.writeFileSync('all_subtopics.txt', allStories.join('\n'));
        console.log("Successfully dumped " + allStories.length + " subtopics to all_subtopics.txt");
    } catch (e) {
        console.error(e);
    }
}

dumpStories();
