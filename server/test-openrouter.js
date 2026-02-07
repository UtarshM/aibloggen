/**
 * Test OpenRouter API Key
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_KEY';

console.log('Testing OpenRouter API Key...');
console.log('API Key:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 15)}...` : 'NOT SET');

async function testOpenRouter() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Scalezix Test'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ 
          role: 'user', 
          content: 'Write a short 50-word paragraph about AI technology.' 
        }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      console.log('✅ OpenRouter API Key is VALID and working!');
      console.log('\nGenerated content:');
      console.log(data.choices[0].message.content);
      console.log('\n✅ You can now generate content in the web interface!');
    } else {
      console.error('❌ OpenRouter API returned unexpected response:');
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error testing OpenRouter:', error.message);
  }
}

testOpenRouter();
