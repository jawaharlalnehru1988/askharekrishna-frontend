// Using global fetch
async function cleanupSignatures() {
    const API_BASE_URL = 'https://api.askharekrishna.com/api/v1/stories/articles/';
    const signature = '*கிரியே: ஸ்ரீ கிருஷ்ண-வாணி*';

    try {
        console.log('Fetching all Tamil stories...');
        const response = await fetch(`${API_BASE_URL}?language=ta`);
        const stories = await response.json();

        console.log(`Found ${stories.length} Tamil stories.`);

        for (const story of stories) {
            if (story.article.includes(signature)) {
                console.log(`Cleaning up story ID ${story.id}: ${story.subTopic}`);
                
                const updatedArticle = story.article.replace(new RegExp('\\n*' + signature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'm'), '').trim();
                
                // Also try a simpler replace if the above complex regex fails to match in some edge cases
                const finalArticle = updatedArticle.replace(signature, '').trim();

                const patchResponse = await fetch(`${API_BASE_URL}${story.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        article: finalArticle
                    })
                });

                if (patchResponse.ok) {
                    console.log(`Successfully updated story ${story.id}`);
                } else {
                    console.error(`Failed to update story ${story.id}. Status: ${patchResponse.status}`);
                }
            } else {
                console.log(`Story ID ${story.id} (${story.subTopic}) already clean.`);
            }
        }
    } catch (error) {
        console.error('An error occurred during cleanup:', error);
    }
}

cleanupSignatures();
