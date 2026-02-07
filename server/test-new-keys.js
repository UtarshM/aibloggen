/**
 * Test All API Keys
 */

const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY || 'YOUR_GOOGLE_AI_KEY';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'YOUR_ANTHROPIC_KEY';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_KEY';

console.log('═══════════════════════════════════════════════════════════════');
console.log('Testing All API Keys');
console.log('═══════════════════════════════════════════════════════════════\n');

// Test Google AI
async function testGoogleAI() {
  console.log('1. Testing Google AI...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: 'Write one sentence about AI.' }] 
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 50
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('   ✅ Google AI is WORKING!');
      console.log('   Response:', data.candidates[0].content.parts[0].text.substring(0, 100));
      return true;
    } else {
      console.log('   ❌ Google AI failed:', JSON.stringify(data).substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Google AI error:', error.message);
    return false;
  }
}

// Test Anthropic
async function testAnthropic() {
  console.log('\n2. Testing Anthropic API...');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Write one sentence about AI.'
        }]
      })
    });

    const data = await response.json();
    
    if (data.content?.[0]?.text) {
      console.log('   ✅ Anthropic API is WORKING!');
      console.log('   Response:', data.content[0].text.substring(0, 100));
      return true;
    } else {
      console.log('   ❌ Anthropic failed:', JSON.stringify(data).substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Anthropic error:', error.message);
    return false;
  }
}

// Test OpenRouter
async function testOpenRouter() {
  console.log('\n3. Testing OpenRouter...');
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
          content: 'Write one sentence about AI.' 
        }],
        max_tokens: 50
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      console.log('   ✅ OpenRouter is WORKING!');
      console.log('   Response:', data.choices[0].message.content.substring(0, 100));
      return true;
    } else {
      console.log('   ❌ OpenRouter failed:', JSON.stringify(data).substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('   ❌ OpenRouter error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const googleWorks = await testGoogleAI();
  const anthropicWorks = await testAnthropic();
  const openrouterWorks = await testOpenRouter();
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Google AI:    ${googleWorks ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Anthropic:    ${anthropicWorks ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`OpenRouter:   ${openrouterWorks ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (googleWorks || anthropicWorks || openrouterWorks) {
    console.log('\n✅ At least one API is working! You can generate content now.');
    console.log('   Go to: http://localhost:5173');
  } else {
    console.log('\n❌ All APIs failed. Please check your API keys.');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

runTests();
