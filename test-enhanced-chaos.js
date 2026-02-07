/**
 * Test Enhanced Chaos Engine v2.0
 * Verifies that the new aggressive humanization settings are working
 */

import fetch from 'node-fetch';
import 'dotenv/config';

const API_BASE = 'http://localhost:3001/api';

// Test user credentials (you'll need to create a test account or use existing)
const TEST_EMAIL = 'test@scalezix.com';
const TEST_PASSWORD = 'test123';

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 Testing Enhanced Chaos Engine v2.0');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

async function testEnhancedChaos() {
  try {
    // Step 1: Login to get token
    console.log('Step 1: Logging in...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    });
    
    if (!loginRes.ok) {
      console.log('❌ Login failed. Please create a test account first or update credentials.');
      console.log('   You can skip login and test the endpoint directly if you have a token.');
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    console.log('');
    
    // Step 2: Generate content with Enhanced Chaos Engine
    console.log('Step 2: Generating content with Enhanced Chaos Engine...');
    console.log('⏱️  This will take 2-4 minutes...');
    console.log('');
    
    const startTime = Date.now();
    
    const contentRes = await fetch(`${API_BASE}/content/generate-chaos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        topic: 'Best AI Tools for Content Marketing in 2026',
        keywords: 'AI tools, content marketing, automation',
        minWords: 1500,
        tone: 'conversational',
        targetAudience: 'marketing professionals'
      })
    });
    
    const endTime = Date.now();
    const processingTime = (endTime - startTime) / 1000;
    
    if (!contentRes.ok) {
      const error = await contentRes.json();
      console.log('❌ Content generation failed:', error.error);
      return;
    }
    
    const contentData = await contentRes.json();
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ CONTENT GENERATION SUCCESSFUL!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Results:');
    console.log(`  • Processing Time: ${processingTime.toFixed(1)}s (${contentData.processingMinutes} min)`);
    console.log(`  • Word Count: ${contentData.wordCount} words`);
    console.log(`  • Human Score: ${contentData.humanScore}/100 (${contentData.humanizationLevel})`);
    console.log(`  • Burstiness: ${contentData.burstinessScore}% (${contentData.burstinessHumanLike ? 'HUMAN-LIKE ✅' : 'needs improvement ❌'})`);
    console.log(`  • Humanizer Used: ${contentData.humanizerUsed}`);
    console.log(`  • Chaos Engine Passes: ${contentData.chaosEnginePasses}`);
    console.log('');
    
    // Check if results meet expectations
    const humanScore = contentData.humanScore;
    const burstiness = parseFloat(contentData.burstinessScore);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎯 Quality Check:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (humanScore >= 85) {
      console.log('✅ Human Score: EXCELLENT (85+)');
    } else if (humanScore >= 70) {
      console.log('⚠️  Human Score: GOOD (70-84) - Could be better');
    } else {
      console.log('❌ Human Score: NEEDS IMPROVEMENT (<70)');
    }
    
    if (burstiness >= 45) {
      console.log('✅ Burstiness: EXCELLENT (45+)');
    } else if (burstiness >= 40) {
      console.log('⚠️  Burstiness: GOOD (40-44) - Could be better');
    } else {
      console.log('❌ Burstiness: NEEDS IMPROVEMENT (<40)');
    }
    
    if (contentData.aiRiskIssues && contentData.aiRiskIssues.length > 0) {
      console.log('');
      console.log('⚠️  AI Risk Issues Found:');
      contentData.aiRiskIssues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    } else {
      console.log('✅ No AI Risk Issues Found');
    }
    
    if (contentData.aiRiskRecommendations && contentData.aiRiskRecommendations.length > 0) {
      console.log('');
      console.log('💡 Recommendations:');
      contentData.aiRiskRecommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📝 Content Preview (first 500 characters):');
    console.log('═══════════════════════════════════════════════════════════════');
    const preview = contentData.content.replace(/<[^>]*>/g, '').substring(0, 500);
    console.log(preview + '...');
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🧪 Test Complete!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('Next Steps:');
    console.log('  1. Copy the full content from the API response');
    console.log('  2. Test at: https://originality.ai');
    console.log('  3. Expected result: 80-100% Human');
    console.log('');
    console.log('If results are good, deploy to AWS:');
    console.log('  bash deploy-to-aws.sh');
    console.log('');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('  • Make sure backend server is running: cd server && node server.js');
    console.log('  • Check API keys in server/.env');
    console.log('  • Verify test credentials are correct');
    console.log('');
  }
}

// Run the test
testEnhancedChaos();
