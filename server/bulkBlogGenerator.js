/**
 * Bulk Blog Generator - SaaS Backend Service
 * 
 * Processes Excel/CSV files uploaded by clients through the web UI.
 * Uses client's WordPress sites stored in database.
 * Generates 10,000+ word human-like content using Chaos Engine v2.0.
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import axios from 'axios';
import { WordPressSite, BulkImportJob } from './wordpressModels.js';
import { 
  advancedHumanize, 
  generateHumanSignaturePrompt,
  randomizedWordReplacement,
  symmetryBreaking,
  analyzeAIRisk
} from './chaosEngine.js';

// Configuration
const CONFIG = {
  DELAY_BETWEEN_POSTS: 5000, // 5 seconds between API calls
  MAX_RETRIES: 3,
  WORD_TARGET: 10000, // 10,000 words minimum
  WORDS_PER_SECTION: 1200, // 1200 words per H2 section
  CHAOS_ENGINE_PASSES: 3, // Number of humanization passes
  DELAY_BETWEEN_PASSES: 15000 // 15 seconds between passes
};

/**
 * THE ULTIMATE HUMAN CONTENT PROMPT - PROFESSIONAL JOURNALIST STYLE
 * Designed to generate content that passes AI detection
 */
function buildHumanPrompt(row) {
  const { title, hTags, keywords, reference, eeat } = row;
  
  // Parse H-tags (separated by | or newlines)
  const headings = hTags ? hTags.split(/[|\n]/).map(h => h.trim()).filter(h => h) : [];
  const headingsList = headings.length > 0 
    ? headings.map((h, i) => `${i + 1}. ${h}`).join('\n')
    : 'Create 8-12 detailed section headings appropriate for this topic. Make them specific and actionable.';
  
  return `<system_instructions>
Act as a high-level technical journalist and field researcher with 20 years of experience. Your voice is defined by skepticism, blunt honesty, and a profound distaste for corporate jargon and "clean" AI-style writing. You do not explain basic concepts; you write for professional peers who value nuance and evidence-based field experience. You never identify as an AI and you do not use the supportive, helpful, or balanced tone common in synthetic outputs.

<mandatory_stylistic_constraints>
1. ACTIVE VOICE ONLY: Never say "The meeting was canceled." Say "Management canceled the meeting".
2. DIRECT ADDRESS: Speak directly to the reader using "you" and "your".
3. NO FLUFF: Avoid marketing language like "cutting-edge" or "unparalleled results." Use plain and simple English.
4. CONTRACTIONS: Use contractions (don't, it's, can't, won't, you're, they're, I've, I'd) consistently to mirror natural speech.
5. PUNCTUATION FRICTION: Use em-dashes (—) and ellipses (...) sparingly to create conversational flow. Avoid semicolons entirely.
6. SENTENCE VARIETY (BURSTINESS): You MUST manually vary sentence length without repeating patterns. Start a paragraph with a 3-word sentence. Follow it with a 45-word complex period with multiple dependent clauses. Then use a 12-word declarative sentence. Use fragments for emphasis.
7. NO RULE OF THREE: AI lists exactly three items for rhythmic effect. You MUST list two or four items, but NEVER exactly three.
</mandatory_stylistic_constraints>

<forbidden_vocabulary>
DO NOT use ANY of these high-frequency AI markers:
- delve, tapestry, unlock, realm, pivotal, landscape, testament, vibrant, bustling
- comprehensive, meticulous, foster, integrate, streamline
- furthermore, moreover, additionally, in conclusion, it is important to note, crucial to understand
- navigating the complexities, leverage, utilize, implement, facilitate
- robust, seamless, cutting-edge, game-changer, optimal, subsequently
- paramount, plethora, myriad, endeavor, ascertain, commence
- prior to, in order to, due to the fact that, it goes without saying
- at the end of the day, when all is said and done, needless to say
- first and foremost, last but not least, in today's world
- revolutionize, transform, empower, elevate, enhance
- synergy, holistic, paradigm, ecosystem, scalable
</forbidden_vocabulary>

<content_requirements>
1. EEAT INJECTION: Inject specific, niche "anecdotal data." Describe a specific, fictional but realistic scenario from the winter of 2024. Use sensory details (smell, touch, sight). Reference real companies, real tools, real numbers.

2. ANSWER-FIRST STRUCTURE: Open EVERY section with a direct, concise answer (under 50 words). Then expand with context. Don't build up to the point—start with it.

3. HIGH PERPLEXITY: Use unexpected synonyms and non-standard syntactic arrangements. Avoid the most predictable word choices.

4. OPINION INJECTION: State opinions boldly. "I think X is overrated." "Most experts get this wrong." "Here's what nobody tells you."

5. IMPERFECTION MARKERS: Include natural speech patterns like "Look," "Here's the thing," "I mean," "Honestly," "Real talk."
</content_requirements>
</system_instructions>

<context>
Topic: ${title}
Target Keyword: ${keywords || title}
Word Count: 10,000+ words (this is a DEEP DIVE article)
Formatting: Use H1 for title, H2 for main sections, H3 for sub-questions.
</context>

You are a professional human ghostwriter with 20 years of experience. Write an extremely detailed, 10,000-word blog post about "${title}".

═══════════════════════════════════════════════════════════════
STRUCTURE & HEADINGS (USE EXACTLY THESE IN ORDER)
═══════════════════════════════════════════════════════════════

${headingsList}

Format each main heading as: <h2 id="section1">Heading Text</h2>
Format sub-headings as: <h3>Sub-heading Text</h3>

After the opening paragraph, add a Table of Contents:
<div class="toc">
<h3>What's Inside</h3>
<ul>
<li><a href="#section1">First Heading</a></li>
<li><a href="#section2">Second Heading</a></li>
...continue for all sections...
</ul>
</div>

═══════════════════════════════════════════════════════════════
KEYWORDS TO WEAVE NATURALLY
═══════════════════════════════════════════════════════════════

${keywords || title}

Don't force keywords. Let them appear where they make sense.

═══════════════════════════════════════════════════════════════
E-E-A-T AUTHORITY SIGNALS
═══════════════════════════════════════════════════════════════

${eeat || 'Write as a field researcher who has spent years testing, failing, and learning. Reference specific dates, specific tools, specific outcomes. "In November 2024, I tested X and found Y."'}

Include:
- Specific dates and timeframes
- Named tools, products, or companies
- Quantified results ("37% improvement" not "significant improvement")
- Personal failures and lessons learned
- Contrarian takes that challenge conventional wisdom

═══════════════════════════════════════════════════════════════
REFERENCE MATERIAL
═══════════════════════════════════════════════════════════════

${reference || 'Draw from your expertise. Cite specific studies, tools, or industry reports where relevant.'}

═══════════════════════════════════════════════════════════════
BURSTINESS ENGINE (CRITICAL FOR HUMAN DETECTION)
═══════════════════════════════════════════════════════════════

Your sentence rhythm MUST follow this pattern throughout:

SHORT (3-7 words): "This changes everything."
LONG (35-50 words): "When I first encountered this problem back in 2023, I spent three weeks testing every solution on the market, burning through my budget, losing sleep, and ultimately discovering that the answer was simpler than anyone in the industry wanted to admit."
MEDIUM (12-20 words): "The solution wasn't complicated. It just required abandoning what everyone else was doing."
FRAGMENT: "Counterintuitive? Absolutely."

Repeat this rhythm variation throughout. Never let two consecutive sentences have similar length.

═══════════════════════════════════════════════════════════════
VOICE MARKERS (USE THROUGHOUT)
═══════════════════════════════════════════════════════════════

Sentence starters to use:
- "Look, here's what nobody tells you..."
- "I've tested this. Multiple times."
- "The industry gets this wrong."
- "Real talk:"
- "Here's the uncomfortable truth..."
- "Most guides skip this part."
- "You've probably heard X. It's wrong."
- "I made this mistake. Cost me Y."
- "Forget what you've read elsewhere."

Opinion markers:
- "In my experience..."
- "I think..."
- "What I've found is..."
- "My take:"
- "Unpopular opinion:"

Hedging (shows human uncertainty):
- "probably"
- "might"
- "seems like"
- "from what I've seen"
- "could be"

═══════════════════════════════════════════════════════════════
SECTION STRUCTURE (EACH H2)
═══════════════════════════════════════════════════════════════

Each section MUST follow this pattern:

1. ANSWER FIRST (50 words max): State the key point immediately. No buildup.

2. CONTEXT & EVIDENCE (300-500 words): Expand with specifics, data, examples.

3. ANECDOTE (150-250 words): A specific story—yours or observed. Include sensory details.

4. CONTRARIAN TAKE (100-150 words): Challenge conventional wisdom.

5. PRACTICAL APPLICATION (200-300 words): Concrete steps. Not generic advice.

6. COMMON MISTAKES (100-200 words): What people get wrong. Be specific.

Total per section: 900-1,400 words minimum.

═══════════════════════════════════════════════════════════════
LISTS RULE (CRITICAL - NO RULE OF THREE)
═══════════════════════════════════════════════════════════════

NEVER list exactly 3 items. AI loves the rule of three.

Always list 2 items, 4 items, 5 items, or 7 items.

Bad: "Three key factors: A, B, and C."
Good: "Four factors matter here: A, B, C, and D."
Good: "Two things drive this: A and B."

═══════════════════════════════════════════════════════════════
LENGTH REQUIREMENTS (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════

TOTAL: At least 10,000 words (this is a DEEP DIVE article)

Each H2 section: 1,000-1,500 words minimum

DO NOT SUMMARIZE. Go deep. Explain everything thoroughly.

═══════════════════════════════════════════════════════════════
ENDING (NO "IN CONCLUSION")
═══════════════════════════════════════════════════════════════

End with "Parting Thoughts" or "Final Words" or "Where This Leaves You"
- Make it personal and memorable
- Share one last piece of hard-won advice
- NO bullet point summaries
- NO "In conclusion" or "To summarize" or "In summary"

═══════════════════════════════════════════════════════════════
HTML FORMAT
═══════════════════════════════════════════════════════════════

<h2 id="section1">Heading</h2>
<h3>Sub-heading</h3>
<p>Paragraph text</p>
<ul><li>List item</li></ul>
<strong>Bold text</strong>
<em>Italic text</em>
<blockquote>Important quote or callout</blockquote>

═══════════════════════════════════════════════════════════════
SELF-AUDIT BEFORE SUBMITTING
═══════════════════════════════════════════════════════════════

Before finalizing, evaluate your draft:
1. Find sections that feel too "smooth" or predictable
2. Add friction: a qualifying remark, changed word order, or short staccato sentence
3. Check for forbidden vocabulary—replace any that slipped through
4. Verify no section has three-item lists
5. Confirm sentence length varies dramatically

═══════════════════════════════════════════════════════════════
START WRITING NOW
═══════════════════════════════════════════════════════════════

Begin directly with an engaging opening paragraph. No "Here is..." or any meta-commentary.
Just start the article as if you're a seasoned journalist sharing hard-won knowledge.
Your first sentence should hook the reader immediately.`;
}

/**
 * Forbidden AI word replacements - post-processing to remove AI markers
 */
const FORBIDDEN_REPLACEMENTS = {
  'delve': 'dig into',
  'delving': 'digging into',
  'delved': 'dug into',
  'tapestry': 'mix',
  'realm': 'area',
  'realms': 'areas',
  'landscape': 'scene',
  'landscapes': 'scenes',
  'robust': 'solid',
  'leverage': 'use',
  'leveraging': 'using',
  'leveraged': 'used',
  'comprehensive': 'complete',
  'seamless': 'smooth',
  'seamlessly': 'smoothly',
  'cutting-edge': 'latest',
  'game-changer': 'big shift',
  'game-changing': 'significant',
  'utilize': 'use',
  'utilizing': 'using',
  'utilized': 'used',
  'utilization': 'use',
  'implement': 'set up',
  'implementing': 'setting up',
  'implemented': 'set up',
  'implementation': 'setup',
  'facilitate': 'help',
  'facilitating': 'helping',
  'facilitated': 'helped',
  'optimal': 'best',
  'optimally': 'ideally',
  'paramount': 'critical',
  'plethora': 'many',
  'myriad': 'countless',
  'furthermore': 'plus',
  'moreover': 'also',
  'subsequently': 'then',
  'nevertheless': 'still',
  'consequently': 'so',
  'endeavor': 'effort',
  'endeavors': 'efforts',
  'ascertain': 'find out',
  'commence': 'start',
  'commencing': 'starting',
  'commenced': 'started',
  'prior to': 'before',
  'in order to': 'to',
  'due to the fact that': 'because',
  'at the end of the day': 'ultimately',
  'it is important to note': 'note that',
  'it goes without saying': '',
  'needless to say': '',
  'first and foremost': 'first',
  'last but not least': 'finally',
  'in today\'s world': 'now',
  'in today\'s digital age': 'today',
  'vibrant': 'lively',
  'bustling': 'busy',
  'meticulous': 'careful',
  'meticulously': 'carefully',
  'streamline': 'simplify',
  'streamlined': 'simplified',
  'streamlining': 'simplifying',
  'synergy': 'teamwork',
  'synergies': 'combined efforts',
  'holistic': 'complete',
  'holistically': 'completely',
  'paradigm': 'model',
  'paradigms': 'models',
  'ecosystem': 'system',
  'ecosystems': 'systems',
  'scalable': 'growable',
  'pivotal': 'key',
  'testament': 'proof',
  'foster': 'build',
  'fostering': 'building',
  'fostered': 'built',
  'integrate': 'combine',
  'integrating': 'combining',
  'integrated': 'combined',
  'embark': 'start',
  'embarking': 'starting',
  'embarked': 'started',
  'revolutionize': 'change',
  'revolutionizing': 'changing',
  'revolutionized': 'changed',
  'transform': 'change',
  'transforming': 'changing',
  'transformed': 'changed',
  'empower': 'enable',
  'empowering': 'enabling',
  'empowered': 'enabled',
  'elevate': 'raise',
  'elevating': 'raising',
  'elevated': 'raised',
  'enhance': 'improve',
  'enhancing': 'improving',
  'enhanced': 'improved'
};

/**
 * Clean forbidden AI words from content
 */
function cleanForbiddenWords(content) {
  let cleaned = content;
  
  for (const [forbidden, replacement] of Object.entries(FORBIDDEN_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
    cleaned = cleaned.replace(regex, replacement);
  }
  
  // Remove "In conclusion" type endings
  cleaned = cleaned.replace(/<h2[^>]*>In Conclusion<\/h2>/gi, '<h2 id="final-words">Parting Thoughts</h2>');
  cleaned = cleaned.replace(/<h2[^>]*>Conclusion<\/h2>/gi, '<h2 id="final-words">Parting Thoughts</h2>');
  cleaned = cleaned.replace(/<h2[^>]*>To Summarize<\/h2>/gi, '<h2 id="final-words">Final Words</h2>');
  cleaned = cleaned.replace(/<h2[^>]*>Summary<\/h2>/gi, '<h2 id="final-words">Where This Leaves You</h2>');
  cleaned = cleaned.replace(/In conclusion,?\s*/gi, '');
  cleaned = cleaned.replace(/To summarize,?\s*/gi, '');
  cleaned = cleaned.replace(/In summary,?\s*/gi, '');
  
  return cleaned;
}

/**
 * Generate content using Google AI (Gemini 2.0) with OpenRouter fallback
 * Uses the same API logic as server.js for consistency
 */
async function generateContent(prompt, retries = 0) {
  const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  let content = null;
  let apiUsed = '';

  // Try Google AI first (Gemini 2.0 Flash)
  if (GOOGLE_AI_KEY) {
    console.log('[BulkGen] Trying Google AI (Gemini 2.0 Flash)...');
    try {
      const googleResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.92, // Higher for more creative/human output
              maxOutputTokens: 8192, // Safe limit for Gemini 2.0
              topP: 0.95,
              topK: 40
            }
          })
        }
      );

      const googleData = await googleResponse.json();
      
      if (googleData.candidates?.[0]?.content?.parts?.[0]?.text) {
        content = googleData.candidates[0].content.parts[0].text;
        apiUsed = 'Google AI (Gemini 2.0)';
        console.log('[BulkGen] Google AI success');
      } else {
        console.log('[BulkGen] Google AI response:', JSON.stringify(googleData).substring(0, 500));
      }
    } catch (err) {
      console.log('[BulkGen] Google AI error:', err.message);
    }
  }

  // Fallback to OpenRouter with free models
  if (!content && OPENROUTER_API_KEY) {
    console.log('[BulkGen] Trying OpenRouter API...');
    try {
      // Try free models first, then paid
      const modelsToTry = [
        'google/gemini-2.0-flash-exp:free',  // Free Gemini
        'meta-llama/llama-3.2-3b-instruct:free', // Free Llama
        'anthropic/claude-3-haiku' // Paid fallback
      ];
      
      for (const model of modelsToTry) {
        console.log(`[BulkGen] Trying model: ${model}`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'https://aiblog.scalezix.com',
            'X-Title': 'AI Marketing Platform - Bulk Generator'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 4000, // Reduced to fit free tier
            temperature: 0.92
          })
        });

        const data = await response.json();
        console.log(`[BulkGen] ${model} response status:`, response.status);
        
        if (data.choices?.[0]?.message?.content) {
          content = data.choices[0].message.content;
          apiUsed = `OpenRouter (${model})`;
          console.log(`[BulkGen] ${model} success`);
          break; // Exit loop on success
        } else if (data.error) {
          console.log(`[BulkGen] ${model} error:`, data.error.message?.substring(0, 200));
        }
      }
    } catch (err) {
      console.log('[BulkGen] OpenRouter error:', err.message);
    }
  }

  // If all APIs fail, retry or throw error
  if (!content) {
    if (retries < CONFIG.MAX_RETRIES) {
      console.log(`[BulkGen] All APIs failed, retrying (${retries + 1}/${CONFIG.MAX_RETRIES})...`);
      await delay(3000);
      return generateContent(prompt, retries + 1);
    }
    throw new Error('AI services unavailable. Please check your API keys (GOOGLE_AI_KEY or OPENROUTER_API_KEY).');
  }

  // Clean the content
  content = cleanContent(content);
  
  // Remove forbidden AI words (critical for human detection)
  content = cleanForbiddenWords(content);
  
  // ═══════════════════════════════════════════════════════════════
  // CHAOS ENGINE v2.0 - Multi-Pass Humanization
  // ═══════════════════════════════════════════════════════════════
  console.log('[BulkGen] Applying Chaos Engine v2.0 humanization...');
  console.log('[BulkGen] This will take 60-90 seconds for thorough processing...');
  
  try {
    const humanizeResult = await advancedHumanize(content, {
      passes: CONFIG.CHAOS_ENGINE_PASSES,
      delayBetweenPasses: CONFIG.DELAY_BETWEEN_PASSES,
      voiceFrequency: 0.12,
      hedgeFrequency: 0.06,
      questionFrequency: 0.08,
      verbose: true
    });
    
    content = humanizeResult.content;
    
    // Analyze final AI risk
    const aiRisk = analyzeAIRisk(content);
    console.log(`[BulkGen] Chaos Engine complete - Human Score: ${aiRisk.score}/100 (${aiRisk.riskLevel})`);
    console.log(`[BulkGen] Burstiness: ${humanizeResult.burstiness.score.toFixed(1)}%`);
    
    // If risk is still high, apply additional cleanup
    if (aiRisk.score < 75) {
      console.log('[BulkGen] Risk elevated, applying final cleanup...');
      content = randomizedWordReplacement(content);
      content = symmetryBreaking(content);
    }
  } catch (humanizeError) {
    console.log('[BulkGen] Chaos Engine error, using basic cleanup:', humanizeError.message);
    // Fallback to basic cleanup if Chaos Engine fails
    content = cleanForbiddenWords(content);
  }
  
  // Count words
  const wordCount = countWords(content);
  console.log(`[BulkGen] Generated ${wordCount} words using ${apiUsed}`);
  
  return { content, wordCount, apiUsed };
}

/**
 * Clean generated content
 */
function cleanContent(content) {
  let cleaned = content;
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```html\n?/gi, '');
  cleaned = cleaned.replace(/```\n?/gi, '');
  
  // Remove "Here is..." intro lines
  cleaned = cleaned.replace(/^<p>Here is[\s\S]*?<\/p>\n*/i, '');
  cleaned = cleaned.replace(/^Here is[\s\S]*?\n\n/i, '');
  cleaned = cleaned.replace(/^<p>I've written[\s\S]*?<\/p>\n*/i, '');
  
  // Remove metadata blocks
  cleaned = cleaned.replace(/---[\s\S]*?---\n*/gi, '');
  
  // Remove JSON-LD schema
  cleaned = cleaned.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  
  // Remove word count mentions
  cleaned = cleaned.replace(/\(?\d+,?\d*\s*words?\)?/gi, '');
  
  return cleaned.trim();
}

/**
 * Count words in content
 */
function countWords(content) {
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  return textOnly.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Publish to WordPress using client's stored credentials
 */
async function publishToWordPress(siteId, title, content, scheduleDate) {
  // Get WordPress site from database
  const site = await WordPressSite.findById(siteId);
  
  if (!site) {
    throw new Error('WordPress site not found');
  }
  
  const { siteUrl, username, applicationPassword } = site;
  
  // Create auth header
  const auth = Buffer.from(`${username}:${applicationPassword}`).toString('base64');
  
  // Prepare post data
  const postData = {
    title: title,
    content: content,
    status: scheduleDate ? 'future' : 'draft'
  };
  
  if (scheduleDate) {
    postData.date = scheduleDate;
  }
  
  try {
    const response = await axios.post(
      `${siteUrl}/wp-json/wp/v2/posts`,
      postData,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    return {
      success: true,
      postId: response.data.id,
      link: response.data.link,
      status: response.data.status
    };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    throw new Error(`WordPress error: ${errorMsg}`);
  }
}

/**
 * Format schedule date for WordPress
 */
function formatScheduleDate(dateStr, timeStr) {
  if (!dateStr) return null;
  
  let date;
  
  // Handle various date formats
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts[0].length === 4) {
      date = new Date(dateStr);
    } else if (parseInt(parts[0]) > 12) {
      // DD/MM/YYYY
      date = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
    } else {
      // MM/DD/YYYY
      date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
    }
  } else if (dateStr.includes('-')) {
    date = new Date(dateStr);
  } else {
    date = new Date(dateStr);
  }
  
  // Add time
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':');
    date.setHours(parseInt(hours) || 0);
    date.setMinutes(parseInt(minutes) || 0);
    date.setSeconds(0);
  }
  
  return date.toISOString();
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process a single post in a bulk import job
 */
async function processPost(post, wordpressSiteId, jobId) {
  const row = {
    title: post.title,
    hTags: post.hTags,
    keywords: post.keywords,
    reference: post.references,
    eeat: post.eeat
  };
  
  try {
    // Update status to generating
    await BulkImportJob.updateOne(
      { _id: jobId, 'posts.title': post.title },
      { 
        $set: { 
          'posts.$.status': 'generating',
          currentStep: `Generating content for: ${post.title}`
        }
      }
    );
    
    // Build prompt and generate content
    const prompt = buildHumanPrompt(row);
    const { content, wordCount } = await generateContent(prompt);
    
    // Update status to publishing
    await BulkImportJob.updateOne(
      { _id: jobId, 'posts.title': post.title },
      { 
        $set: { 
          'posts.$.status': 'publishing',
          'posts.$.contentLength': wordCount,
          currentStep: `Publishing to WordPress: ${post.title}`
        }
      }
    );
    
    // Format schedule date
    const scheduleDate = formatScheduleDate(post.scheduleDate, post.scheduleTime);
    
    // Publish to WordPress
    const result = await publishToWordPress(wordpressSiteId, post.title, content, scheduleDate);
    
    // Update success
    await BulkImportJob.updateOne(
      { _id: jobId, 'posts.title': post.title },
      { 
        $set: { 
          'posts.$.status': 'published',
          'posts.$.wordpressPostId': result.postId,
          'posts.$.wordpressPostUrl': result.link,
          'posts.$.publishedAt': new Date()
        },
        $inc: { processedPosts: 1, successfulPosts: 1 }
      }
    );
    
    console.log(`[BulkGen] ✅ Published: ${post.title} → ${result.link}`);
    
    return { success: true, link: result.link, wordCount };
    
  } catch (error) {
    console.error(`[BulkGen] ❌ Failed: ${post.title} - ${error.message}`);
    
    // Update failure
    await BulkImportJob.updateOne(
      { _id: jobId, 'posts.title': post.title },
      { 
        $set: { 
          'posts.$.status': 'failed',
          'posts.$.error': error.message
        },
        $inc: { processedPosts: 1, failedPosts: 1 }
      }
    );
    
    return { success: false, error: error.message };
  }
}

/**
 * Process entire bulk import job
 * Called from the web UI bulk import endpoint
 */
async function processBulkImportJob(jobId) {
  console.log(`[BulkGen] Starting job: ${jobId}`);
  
  try {
    // Get job from database
    const job = await BulkImportJob.findById(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Update job status
    await BulkImportJob.updateOne(
      { _id: jobId },
      { 
        $set: { 
          status: 'processing',
          startedAt: new Date()
        }
      }
    );
    
    // Process each post
    for (let i = 0; i < job.posts.length; i++) {
      const post = job.posts[i];
      
      if (post.status === 'published') {
        console.log(`[BulkGen] Skipping already published: ${post.title}`);
        continue;
      }
      
      console.log(`[BulkGen] Processing ${i + 1}/${job.posts.length}: ${post.title}`);
      
      await processPost(post, job.wordpressSiteId, jobId);
      
      // Delay between posts
      if (i < job.posts.length - 1) {
        await delay(CONFIG.DELAY_BETWEEN_POSTS);
      }
    }
    
    // Mark job as completed
    await BulkImportJob.updateOne(
      { _id: jobId },
      { 
        $set: { 
          status: 'completed',
          completedAt: new Date(),
          currentStep: 'All posts processed'
        }
      }
    );
    
    console.log(`[BulkGen] ✅ Job completed: ${jobId}`);
    
  } catch (error) {
    console.error(`[BulkGen] Job failed: ${error.message}`);
    
    await BulkImportJob.updateOne(
      { _id: jobId },
      { 
        $set: { 
          status: 'failed',
          currentStep: `Error: ${error.message}`
        }
      }
    );
  }
}

/**
 * Generate single post content (for API endpoint)
 */
async function generateSinglePost(config) {
  const row = {
    title: config.topic || config.title,
    hTags: config.headings || config.hTags || '',
    keywords: config.keywords || config.topic || config.title,
    reference: config.references || config.reference || '',
    eeat: config.eeat || ''
  };
  
  const prompt = buildHumanPrompt(row);
  const { content, wordCount } = await generateContent(prompt);
  
  return {
    content,
    wordCount,
    title: row.title
  };
}

export { 
  processBulkImportJob, 
  generateSinglePost, 
  buildHumanPrompt, 
  generateContent,
  publishToWordPress,
  CONFIG
};
