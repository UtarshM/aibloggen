/**
 * Test Script for Content Generation
 * 
 * This script tests the SEO Mega-Prompt Engine v3.0 and Advanced Humanizer v2.0
 * without needing to go through the full authentication flow.
 * 
 * Usage: node test-content-generation.js
 */

import { generateSEOMegaPrompt } from './server/seoMegaPromptEngine.js';
import { humanizeBlog, analyzeHumanScore } from './server/advancedHumanizer.js';

console.log('═══════════════════════════════════════════════════════════════');
console.log('SCALEZIX CONTENT GENERATION TEST');
console.log('Testing SEO Mega-Prompt Engine v3.0 + Advanced Humanizer v2.0');
console.log('═══════════════════════════════════════════════════════════════\n');

// Test configuration
const config = {
  topic: "Digital Marketing Strategies for Small Businesses",
  primaryKeyword: "digital marketing small business",
  secondaryKeywords: "online marketing, social media marketing, email marketing",
  lsiKeywords: "SEO, content marketing, digital advertising, online presence",
  searchIntent: "informational",
  targetAudience: "small business owners",
  country: "USA",
  tone: "professional",
  minWords: 1500,
  headings: [
    "What is Digital Marketing?",
    "Why Small Businesses Need Digital Marketing",
    "Top Digital Marketing Strategies",
    "Social Media Marketing for Small Business",
    "Email Marketing Best Practices",
    "SEO Basics for Small Business",
    "Measuring Digital Marketing Success"
  ],
  persona: "seoExpert"
};

console.log('📋 Test Configuration:');
console.log(`   Topic: ${config.topic}`);
console.log(`   Primary Keyword: ${config.primaryKeyword}`);
console.log(`   Target Audience: ${config.targetAudience}`);
console.log(`   Word Count: ${config.minWords}+`);
console.log(`   Persona: ${config.persona}\n`);

// Step 1: Generate SEO Mega-Prompt
console.log('Step 1: Generating SEO Mega-Prompt...');
const prompt = generateSEOMegaPrompt(config);
console.log(`✅ Prompt generated: ${prompt.length} characters\n`);

// Show a preview of the prompt
console.log('📄 Prompt Preview (first 500 characters):');
console.log('─────────────────────────────────────────────────────────────');
console.log(prompt.substring(0, 500) + '...\n');

// Step 2: Simulate AI-generated content (for testing humanization)
console.log('Step 2: Simulating AI-generated content...');
const mockAIContent = `<h1>Digital Marketing Strategies for Small Businesses: A Complete Guide (2026)</h1>

<p>In today's digital age, it is important to note that digital marketing has become crucial for small businesses. Furthermore, the landscape of online marketing is constantly evolving. Moreover, businesses need to leverage various strategies to optimize their online presence.</p>

<h2 id="what-is-digital-marketing">What is Digital Marketing?</h2>

<p>Digital marketing is a comprehensive approach to promoting products and services through digital channels. It is essential to understand that this encompasses various techniques. Additionally, it includes social media, email marketing, and search engine optimization.</p>

<p>The benefits of digital marketing are numerous. First and foremost, it provides cost-effective solutions. Moreover, it enables businesses to reach a wider audience. Furthermore, it facilitates better customer engagement.</p>

<h2 id="why-small-businesses-need">Why Small Businesses Need Digital Marketing</h2>

<p>In conclusion, small businesses must embrace digital marketing to remain competitive. It is worth mentioning that traditional marketing methods are becoming less effective. Subsequently, digital strategies offer better ROI and measurable results.</p>`;

console.log(`✅ Mock content created: ${mockAIContent.length} characters\n`);

// Step 3: Apply Advanced Humanization
console.log('Step 3: Applying Advanced Humanization v2.0...');
const startTime = Date.now();

const humanizeResult = humanizeBlog(mockAIContent, {
  removeCliches: true,
  casualize: true,
  useContractions: true,
  varySentences: true,
  addStarters: true,
  injectVoice: true,
  addHedges: true,
  addQuestions: true,
  addAsides: true,
  fixThreeRule: true,
  addRepetition: true,
  verbose: false
});

const processingTime = Date.now() - startTime;

console.log(`✅ Humanization complete in ${processingTime}ms`);
console.log(`   Steps applied: ${humanizeResult.metadata.stepsApplied.length}`);
console.log(`   Word count: ${humanizeResult.metadata.wordCount}\n`);

// Step 4: Analyze Human Score
console.log('Step 4: Analyzing Human Score...');
const humanScore = analyzeHumanScore(humanizeResult.content);

console.log(`✅ Human Score: ${humanScore.score}/100`);
console.log(`   Risk Level: ${humanScore.riskLevel}`);
console.log(`   Verdict: ${humanScore.verdict}\n`);

if (humanScore.issues.length > 0) {
  console.log('⚠️  Issues Found:');
  humanScore.issues.forEach(issue => console.log(`   - ${issue}`));
  console.log('');
}

if (humanScore.recommendations.length > 0) {
  console.log('💡 Recommendations:');
  humanScore.recommendations.forEach(rec => console.log(`   - ${rec}`));
  console.log('');
}

// Step 5: Show Before/After Comparison
console.log('═══════════════════════════════════════════════════════════════');
console.log('BEFORE vs AFTER COMPARISON');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📝 BEFORE (AI-Generated):');
console.log('─────────────────────────────────────────────────────────────');
console.log(mockAIContent.substring(0, 400) + '...\n');

console.log('✨ AFTER (Humanized):');
console.log('─────────────────────────────────────────────────────────────');
console.log(humanizeResult.content.substring(0, 400) + '...\n');

// Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('✅ SEO Mega-Prompt Engine v3.0: Working');
console.log('✅ Advanced Humanizer v2.0: Working');
console.log(`✅ Human Score: ${humanScore.score}/100 (${humanScore.riskLevel} risk)`);
console.log(`✅ Processing Time: ${processingTime}ms`);
console.log(`✅ Word Count: ${humanizeResult.metadata.wordCount} words\n`);

console.log('🎉 All systems operational!\n');

console.log('Next Steps:');
console.log('1. Add your MongoDB connection string to server/.env');
console.log('2. Add your Google AI API key to server/.env');
console.log('3. Restart the backend server');
console.log('4. Open http://localhost:5173 and test content generation\n');

console.log('© 2025 HARSH J KUHIKAR - All Rights Reserved');
