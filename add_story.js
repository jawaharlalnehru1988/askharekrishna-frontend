// Using global fetch (available in Node.js 18+)
// const fetch = require('node-fetch');

const API_URL = 'https://api.askharekrishna.com/api/v1/stories/articles/';

const articleContent = `
# ஸ்ரீ சைதன்ய மகாபிரபுவின் சங்கீர்த்தன இயக்கம்: ஒரு புரட்சி

கிருஷ்ண நாமத்தை பாடுவதன் மூலம் உலகையே மாற்ற முடியும் என்று காட்டியவர் ஸ்ரீ சைதன்ய மகாபிரபு. 500 ஆண்டுகளுக்கு முன்பு அவர் தொடங்கிய இந்த சங்கீர்த்தன இயக்கம், இன்று அகில உலக கிருஷ்ண பக்தி இயக்கத்தின் (ISKCON) மூலம் உலகம் முழுவதும் பரவியுள்ளது.

## பிரபுபாதரின் தூது

ஸ்ரீல பிரபுபாதர் ஒருமுறை கூறினார், "நான் ஒன்றும் புதிதாகச் சொல்லவில்லை. என் குருநாதரின் கட்டளையையும், சைதன்ய மகாபிரபுவின் கொள்கைகளையும் அப்படியே வழங்கி வருகிறேன்." ஐந்தாயிரம் ஆண்டுகளுக்கு முன்பு பகவத் கீதையில் கிருஷ்ணர் கூறிய சரணாகதித் தத்துவத்தை, மகாபிரபு மிக எளிமையாக 'நாம சங்கீர்த்தனம்' மூலம் வழங்கினார்.

## பக்தி யோகத்தின் உச்சம்

திருநாமத்தை உச்சரிப்பது என்பது வெறும் மந்திரம் மட்டும் அல்ல; அது பகவானுடன் நேரடியாகத் தொடர்பு கொள்ளும் ஒரு ஆன்மீக அனுபவம். "கல்லூரிகளிலும் பல்கலைக்கழகங்களிலும் இதைக் கற்றுத் தருவதில்லை, ஆனால் ஒரு பக்தரின் சகவாசம் இருந்தால் மட்டுமே இது சாத்தியம்" என்று பிரபுபாதர் வலியுறுத்தினார்.

## கலியுகத்தின் ஒரே நதி

இந்தக் கலியுகத்தில் நம்மைத் தூய்மைப்படுத்த நாம சங்கீர்த்தனம் என்ற ஒரே நதி மட்டுமே உள்ளது. பிரபுபாதரின் கருணையினால், நாம் இன்று எந்தத் தடையுமின்றி கிருஷ்ண நாமத்தைப் பாட முடிகிறது. இதைப் பயன்படுத்திக் கொள்வதே புத்திசாலித்தனம்.

**வாழ்வின் நோக்கம்:**
நாம் எங்கே இருந்தாலும், எதைச் செய்தாலும், எப்போதும் பகவானை நினைவில் வைத்திருப்பதே பக்தி. அதுவே மகாபிரபுவின் விருப்பம்.

---
*கிரியே: ஸ்ரீ கிருஷ்ண-வாணி*
`;

async function addStory() {
    const payload = {
        language: 'ta',
        mainTopic: 'ஸ்ரீல பிரபுபாதரின் உபதேசங்கள்',
        subTopic: 'சைதன்ய மகாபிரபுவின் சங்கீர்த்தன இயக்கம்',
        slug: 'caitanya-mahaprabhu-sankirtana-mission',
        article: articleContent.trim(),
        order: 2
    };

    try {
        console.log('Sending POST request to:', API_URL);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add auth headers if known, but let's try without first
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 201) {
            const data = await response.json();
            console.log('Story added successfully!');
            console.log('Response:', JSON.stringify(data, null, 2));
        } else {
            const errorText = await response.text();
            console.error(`Failed to add story. Status: ${response.status}`);
            console.error('Error response:', errorText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

addStory();
