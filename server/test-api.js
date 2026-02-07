/**
 * Test Google AI API Key
 */

const GOOGLE_AI_KEY = 'AIzaSyC0njMbAR2pM4SeIQfUi3PpBziX75TTjJk';

console.log('Testing Google AI API Key...');
console.log('API Key:', GOOGLE_AI_KEY ? `${GOOGLE_AI_KEY.substring(0, 10)}...` : 'NOT SET');

async function testGoogleAI() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: 'Write a short 50-word paragraph about AI technology.' }] 
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('✅ Google AI API Key is VALID and working!');
      console.log('\nGenerated content:');
      console.log(data.candidates[0].content.parts[0].text);
      console.log('\n✅ You can now generate content in the web interface!');
    } else {
      console.error('❌ Google AI API returned unexpected response:');
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error testing Google AI:', error.message);
  }
}

testGoogleAI();
