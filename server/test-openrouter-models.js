/**
 * Test OpenRouter with different free models
 */

const OPENROUTER_API_KEY = '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';

console.log('Testing OpenRouter with different models...\n');

const modelsToTry = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.2-1b-instruct:free',
  'google/gemini-flash-1.5:free',
  'google/gemini-flash-1.5-8b:free',
  'qwen/qwen-2-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

async function testModel(model) {
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
        model: model,
        messages: [{ 
          role: 'user', 
          content: 'Write one sentence about AI.' 
        }],
        max_tokens: 50
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      console.log(`✅ ${model}`);
      console.log(`   Response: ${data.choices[0].message.content.substring(0, 100)}\n`);
      return model;
    } else {
      console.log(`❌ ${model}`);
      console.log(`   Error: ${data.error?.message || JSON.stringify(data).substring(0, 100)}\n`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${model}`);
    console.log(`   Error: ${error.message}\n`);
    return null;
  }
}

async function findWorkingModel() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Testing Free Models on OpenRouter');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  for (const model of modelsToTry) {
    const working = await testModel(model);
    if (working) {
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`✅ FOUND WORKING MODEL: ${working}`);
      console.log('═══════════════════════════════════════════════════════════════');
      return;
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('❌ No working free models found');
  console.log('═══════════════════════════════════════════════════════════════');
}

findWorkingModel();
