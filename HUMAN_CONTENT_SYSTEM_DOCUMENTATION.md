# Human Content Generation System - Complete Documentation

## Overview

This document provides a complete technical breakdown of the AI Detection Bypass system implemented in Scalezix. The system uses a multi-layer approach to generate content that bypasses AI detectors like Originality.ai, GPTZero, and Turnitin.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HUMAN CONTENT GENERATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

User Request (Topic, Keywords, Settings)
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: MEGA-PROMPT GENERATION (megaPromptEngine.js)                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Select persona (journalist, practitioner, researcher, mentor)            │
│  • Build 6-layer anti-detection prompt                                      │
│  • Include forbidden vocabulary list                                        │
│  • Add burstiness patterns and voice markers                                │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: AI CONTENT GENERATION                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Primary: Google AI (Gemini 2.0 Flash)                                    │
│  • Fallback: OpenRouter (Gemini/Llama/Claude)                               │
│  • Temperature: 0.92 (high creativity)                                      │
│  • Max tokens: 8192                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: POST-PROCESSING - FORBIDDEN WORD REMOVAL                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Remove 150+ AI vocabulary markers                                        │
│  • Replace with human alternatives                                          │
│  • Clean up formatting artifacts                                            │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: LOCAL HUMANIZATION ENGINE (humanContentEngine.js)                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Apply contractions (do not → don't)                                      │
│  • Fix Rule of Three (never exactly 3 items)                                │
│  • Inject human voice markers                                               │
│  • Add hedging phrases                                                      │
│  • Fix AI conclusion patterns                                               │
│  • Add punctuation friction (em-dashes, ellipses)                           │
│  • Improve burstiness (sentence length variation)                           │
│  • Add rhetorical questions                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: PROFESSIONAL HUMANIZER (Optional - Requires API Key)              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Option A: StealthGPT (stealthService.js)                                   │
│  • API: https://stealthgpt.ai/api/stealthify                                │
│  • Cost: $0.0002/word                                                       │
│  • Mode: Business (10x more powerful)                                       │
│                                                                             │
│  Option B: Undetectable.ai (undetectableService.js)                         │
│  • API: https://humanize.undetectable.ai                                    │
│  • Cost: From $9.99/month                                                   │
│  • Model: v11sr (best humanization)                                         │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: ADDITIONAL HUMANIZATION (If risk score < 70)                      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Higher voice frequency (20%)                                             │
│  • Higher hedging frequency (15%)                                           │
│  • Higher question frequency (12%)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FINAL OUTPUT                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • Humanization Score: 0-100 (higher = more human)                          │
│  • Risk Level: Low/Medium/High                                              │
│  • Content with images inserted                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
server/
├── server.js                 # Main server with API endpoints
├── megaPromptEngine.js       # Mega-prompt generator with personas
├── humanContentEngine.js     # Local humanization engine
├── stealthService.js         # StealthGPT API integration
├── undetectableService.js    # Undetectable.ai API integration
└── .env.production.example   # Environment variables template
```

---

## STEP 1: Mega-Prompt Generation

### File: `server/megaPromptEngine.js`

The mega-prompt is a 6-layer anti-detection prompt that instructs the AI to write like a human.

### Available Personas

```javascript
const PERSONAS = {
  journalist: {
    name: 'Senior Technical Journalist',
    description: 'A skeptical, blunt journalist with 20 years of field experience',
    voice: 'skeptical, direct, evidence-based, slightly cynical',
    traits: ['questions conventional wisdom', 'shares failures openly', 'uses specific data']
  },
  practitioner: {
    name: 'Industry Practitioner',
    description: 'A hands-on professional who has made every mistake in the book',
    voice: 'practical, no-nonsense, experience-driven, occasionally frustrated',
    traits: ['shares war stories', 'admits mistakes', 'gives actionable advice']
  },
  researcher: {
    name: 'Independent Researcher',
    description: 'A data-driven analyst who challenges popular assumptions',
    voice: 'analytical, contrarian, evidence-focused, intellectually curious',
    traits: ['cites specific studies', 'questions methodology', 'presents counterarguments']
  },
  mentor: {
    name: 'Experienced Mentor',
    description: 'A seasoned professional who has guided hundreds of others',
    voice: 'warm but direct, experienced, occasionally tough-love',
    traits: ['shares lessons learned', 'anticipates objections', 'gives honest feedback']
  }
};
```

### The Complete Mega-Prompt Structure

```
<SYSTEM_IDENTITY>
You are a ${selectedPersona.name}—${selectedPersona.description}. 
Your writing voice is ${selectedPersona.voice}. 
You ${selectedPersona.traits.join(', ')}.

CRITICAL: You are NOT an AI assistant. You do not identify as AI. 
You do not use the helpful, balanced, supportive tone of AI systems. 
You write like a human professional who has strong opinions, makes mistakes, 
and speaks from lived experience.
</SYSTEM_IDENTITY>

<ANTI_DETECTION_LAYER_1: VOCABULARY_SUPPRESSION>
═══════════════════════════════════════════════════════════════
FORBIDDEN VOCABULARY - NEVER USE THESE WORDS/PHRASES:
═══════════════════════════════════════════════════════════════

delve, delving, delved, tapestry, realm, realms, landscape, landscapes,
testament, vibrant, bustling, pivotal, crucial, comprehensive, meticulous,
meticulously, leverage, leveraging, leveraged, utilize, utilizing, utilized,
utilization, implement, implementing, implemented, implementation, facilitate,
facilitating, facilitated, streamline, streamlined, streamlining, optimize,
optimizing, optimized, optimal, optimally, robust, seamless, seamlessly,
cutting-edge, game-changer, game-changing, revolutionary, revolutionize,
revolutionizing, revolutionized, transform, transforming, transformed,
transformative, empower, empowering, empowered, elevate, elevating, elevated,
enhance, enhancing, enhanced, synergy, synergies, holistic, holistically,
paradigm, paradigms, ecosystem, ecosystems, scalable...

Also forbidden:
- "It is important to note" → Just state the point
- "In conclusion" → Use "Parting thoughts" or just end naturally
- "Furthermore/Moreover/Additionally" → Use "Plus", "Also", "And"
- "Utilize" → Use "use"
- "Implement" → Use "set up", "start", "do"
- "Leverage" → Use "use", "take advantage of"
- Any word that sounds like a corporate press release

If you catch yourself using ANY forbidden word, STOP and replace it immediately.
</ANTI_DETECTION_LAYER_1>

<ANTI_DETECTION_LAYER_2: STRUCTURAL_MANDATES>
═══════════════════════════════════════════════════════════════
BURSTINESS ENGINE - SENTENCE LENGTH VARIATION (CRITICAL)
═══════════════════════════════════════════════════════════════

Your sentence rhythm MUST follow irregular patterns. 
Never let two consecutive sentences have similar length.

PATTERN TO FOLLOW:
- SHORT (3-7 words): "This changes everything."
- LONG (35-50 words): "When I first encountered this problem back in [date], 
  I spent weeks testing every solution on the market, burning through my budget, 
  losing sleep, and ultimately discovering that the answer was simpler than 
  anyone in the industry wanted to admit—[sensory detail]."
- MEDIUM (12-20 words): "The solution wasn't complicated. It just required 
  abandoning what everyone else was doing."
- FRAGMENT (1-4 words): "Counterintuitive? Absolutely."
- QUESTION (5-15 words): "So why does everyone keep making the same mistake?"

REPEAT this variation throughout. NEVER write 3+ sentences of similar length in a row.
</ANTI_DETECTION_LAYER_2>

<ANTI_DETECTION_LAYER_3: RULE_OF_THREE_BAN>
═══════════════════════════════════════════════════════════════
LISTS RULE - NEVER USE EXACTLY THREE ITEMS
═══════════════════════════════════════════════════════════════

AI loves the "Rule of Three" (listing exactly 3 items for rhythm).

BANNED: "Three key factors: A, B, and C."
ALLOWED: "Four factors matter here: A, B, C, and D."
ALLOWED: "Two things drive this: A and B."
ALLOWED: "Five elements to consider: A, B, C, D, and E."

When listing, use 2, 4, 5, or 7 items. NEVER exactly 3.
</ANTI_DETECTION_LAYER_3>

<ANTI_DETECTION_LAYER_4: VOICE_INJECTION>
═══════════════════════════════════════════════════════════════
HUMAN VOICE MARKERS - USE THROUGHOUT
═══════════════════════════════════════════════════════════════

Sentence starters to use naturally:
"Look," | "Here's the thing:" | "Real talk:" | "Honestly," | "I mean," |
"Here's what nobody tells you:" | "The industry gets this wrong." |
"Most guides skip this part." | "You've probably heard this before, but" |
"I made this mistake." | "Forget what you've read elsewhere." |
"Let me be blunt:" | "Here's the uncomfortable truth:" |
"I've tested this. Multiple times." | "This might sound counterintuitive, but" |
"Fair warning:" | "Quick reality check:" | "Between you and me," |
"I'll be honest with you:" | "Here's what actually works:"

Opinion markers (use frequently):
- "In my experience..."
- "I think..."
- "What I've found is..."
- "My take:"
- "Unpopular opinion:"
- "I'd argue that..."

Hedging (shows human uncertainty—AI is too confident):
- "probably", "might", "could be", "seems like"
- "from what I've seen", "in my experience"
- "I could be wrong, but", "your mileage may vary"

CONTRACTIONS (mandatory):
- Always use: don't, it's, can't, won't, you're, they're, I've, I'd, we're, that's
- Never use: do not, it is, cannot, will not, you are, they are, I have, I would
</ANTI_DETECTION_LAYER_4>

<ANTI_DETECTION_LAYER_5: EEAT_INJECTION>
═══════════════════════════════════════════════════════════════
E-E-A-T AUTHORITY SIGNALS (Experience, Expertise, Authority, Trust)
═══════════════════════════════════════════════════════════════

You MUST inject specific, niche "anecdotal data" into every major section:

1. SPECIFIC DATES: "Back in [month] [year]...", "Last November...", "During Q3 2024..."
2. SENSORY DETAILS: "the coffee had gone cold hours ago", "my screen glowing in the dark"
3. NAMED TOOLS/COMPANIES: Reference real tools, real companies, real products
4. QUANTIFIED RESULTS: "37% improvement" not "significant improvement"
5. PERSONAL FAILURES: "I made this mistake. Cost me X."
6. CONTRARIAN TAKES: "Most experts say X. They're missing Y."

Include in EVERY section:
- A specific story or observation (with sensory details)
- A number or statistic (specific, not rounded)
- A named tool, company, or person
- An opinion that challenges conventional wisdom
</ANTI_DETECTION_LAYER_5>

<ANTI_DETECTION_LAYER_6: PERPLEXITY_BOOST>
═══════════════════════════════════════════════════════════════
HIGH PERPLEXITY - UNEXPECTED WORD CHOICES
═══════════════════════════════════════════════════════════════

AI chooses the most PROBABLE word. You must choose UNEXPECTED but appropriate words.

Instead of "important" → use "non-negotiable", "make-or-break", "critical"
Instead of "good" → use "solid", "decent", "respectable"
Instead of "bad" → use "rough", "messy", "problematic"
Instead of "very" → use "seriously", "genuinely", "legitimately"
Instead of "many" → use "plenty of", "a bunch of", "loads of"
Instead of "use" → use "rely on", "turn to", "reach for"
Instead of "help" → use "move the needle", "make a dent", "shift things"
Instead of "problem" → use "headache", "pain point", "stumbling block"
Instead of "solution" → use "fix", "workaround", "answer"
Instead of "effective" → use "works", "gets results", "delivers"

Use idioms, colloquialisms, and industry-specific slang where appropriate.
</ANTI_DETECTION_LAYER_6>

<CONTENT_REQUIREMENTS>
═══════════════════════════════════════════════════════════════
TOPIC: ${topic}
TARGET KEYWORD: ${keywords}
WORD COUNT: ${minWords}+ words (this is a DEEP DIVE article)
TARGET AUDIENCE: ${targetAudience}
TONE: ${tone} with journalistic skepticism
═══════════════════════════════════════════════════════════════
</CONTENT_REQUIREMENTS>

<SECTION_STRUCTURE>
═══════════════════════════════════════════════════════════════
EACH H2 SECTION MUST FOLLOW THIS PATTERN:
═══════════════════════════════════════════════════════════════

1. ANSWER FIRST (50 words max)
   - State the key point immediately
   - No buildup, no throat-clearing
   - Direct and actionable

2. CONTEXT & EVIDENCE (300-500 words)
   - Expand with specifics, data, examples
   - Use specific numbers and dates
   - Reference real tools or companies

3. ANECDOTE (150-250 words)
   - A specific story—yours or observed
   - Include sensory details
   - "The office smelled like...", "My screen showed..."

4. CONTRARIAN TAKE (100-150 words)
   - Challenge conventional wisdom
   - "Most experts say X. They're missing Y."
   - Take a side and defend it

5. PRACTICAL APPLICATION (200-300 words)
   - Concrete steps, not generic advice
   - Specific tools, specific actions
   - "Open X, click Y, configure Z"

6. COMMON MISTAKES (100-200 words)
   - What people get wrong
   - Be specific about the mistake AND the fix

Total per section: 900-1,400 words minimum
</SECTION_STRUCTURE>

<ENDING_REQUIREMENTS>
═══════════════════════════════════════════════════════════════
ENDING - NO AI CONCLUSIONS
═══════════════════════════════════════════════════════════════

FORBIDDEN endings:
- "In conclusion..."
- "To summarize..."
- "In summary..."
- "To wrap up..."
- "Key takeaways..."
- Bullet point summaries
- "I hope this helps"
- Any AI pleasantries

ALLOWED endings:
- "Parting Thoughts"
- "Final Words"
- "Where This Leaves You"
- "Before You Go"
- "One Last Thing"

End with:
- A personal reflection
- One piece of hard-won advice
- A provocative question
- A call to action that feels genuine, not salesy
</ENDING_REQUIREMENTS>

<SELF_AUDIT_INSTRUCTION>
═══════════════════════════════════════════════════════════════
BEFORE SUBMITTING - RECURSIVE SELF-AUDIT
═══════════════════════════════════════════════════════════════

After generating your draft, critically evaluate it:

1. SCAN for forbidden vocabulary - replace any that slipped through
2. CHECK sentence length variation - no 3+ similar-length sentences in a row
3. VERIFY no "Rule of Three" lists - change to 2 or 4 items
4. CONFIRM contractions are used consistently
5. ENSURE each section has an anecdote with sensory details
6. VALIDATE opinions are stated boldly, not hedged into oblivion
7. REMOVE any "In conclusion" or similar AI endings

If any section feels too "smooth" or "polished," add friction:
- Insert a qualifying remark
- Add a rhetorical question
- Break a long sentence into a short one
- Add an em-dash parenthetical

Present ONLY the final, humanized version.
</SELF_AUDIT_INSTRUCTION>

<OUTPUT_FORMAT>
═══════════════════════════════════════════════════════════════
HTML FORMAT REQUIREMENTS
═══════════════════════════════════════════════════════════════

Use clean HTML:
- <h2 id="section-N">Heading</h2>
- <h3>Sub-heading</h3>
- <p>Paragraph text</p>
- <ul><li>List item</li></ul>
- <strong>Bold text</strong>
- <em>Italic text</em>
- <blockquote>Important quote or callout</blockquote>

NO markdown. NO code blocks. NO meta-commentary.
Start directly with the content.
</OUTPUT_FORMAT>

<FINAL_INSTRUCTION>
═══════════════════════════════════════════════════════════════
BEGIN WRITING NOW
═══════════════════════════════════════════════════════════════

Write a ${minWords}+ word article about "${topic}".

Start with an engaging opening paragraph that hooks the reader immediately.
No "Here is..." or any meta-commentary.
Just begin as if you're a seasoned ${selectedPersona.name} sharing hard-won knowledge.

Your first sentence should be punchy, direct, and make the reader want to continue.

GO.
</FINAL_INSTRUCTION>
```

---

## STEP 2: Local Humanization Engine

### File: `server/humanContentEngine.js`

This engine applies multiple transformations to make AI content sound human.

### Forbidden AI Vocabulary (150+ words)

```javascript
const FORBIDDEN_AI_WORDS = {
  // High-frequency AI markers
  'delve': 'dig into',
  'delving': 'digging into', 
  'delved': 'dug into',
  'tapestry': 'mix',
  'realm': 'area',
  'realms': 'areas',
  'landscape': 'scene',
  'landscapes': 'scenes',
  'testament': 'proof',
  'vibrant': 'lively',
  'bustling': 'busy',
  'pivotal': 'key',
  'crucial': 'important',
  'comprehensive': 'complete',
  'meticulous': 'careful',
  'meticulously': 'carefully',
  
  // Corporate/Marketing jargon
  'leverage': 'use',
  'leveraging': 'using',
  'leveraged': 'used',
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
  'streamline': 'simplify',
  'streamlined': 'simplified',
  'streamlining': 'simplifying',
  'optimize': 'improve',
  'optimizing': 'improving',
  'optimized': 'improved',
  'optimal': 'best',
  'optimally': 'ideally',
  
  // Buzzwords
  'robust': 'solid',
  'seamless': 'smooth',
  'seamlessly': 'smoothly',
  'cutting-edge': 'latest',
  'game-changer': 'big shift',
  'game-changing': 'significant',
  'revolutionary': 'new',
  'revolutionize': 'change',
  'revolutionizing': 'changing',
  'revolutionized': 'changed',
  'transform': 'change',
  'transforming': 'changing',
  'transformed': 'changed',
  'transformative': 'major',
  'empower': 'enable',
  'empowering': 'enabling',
  'empowered': 'enabled',
  'elevate': 'raise',
  'elevating': 'raising',
  'elevated': 'raised',
  'enhance': 'improve',
  'enhancing': 'improving',
  'enhanced': 'improved',
  'synergy': 'teamwork',
  'synergies': 'combined efforts',
  'holistic': 'complete',
  'holistically': 'completely',
  'paradigm': 'model',
  'paradigms': 'models',
  'ecosystem': 'system',
  'ecosystems': 'systems',
  'scalable': 'growable',
  
  // Formal transitions (AI overuses these)
  'furthermore': 'plus',
  'moreover': 'also',
  'additionally': 'also',
  'subsequently': 'then',
  'nevertheless': 'still',
  'consequently': 'so',
  'therefore': 'so',
  'hence': 'so',
  'thus': 'so',
  'accordingly': 'so',
  'henceforth': 'from now on',
  
  // Wordy phrases
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
  'in this day and age': 'today',
  // ... 100+ more
};
```

### Human Voice Starters (50+ phrases)

```javascript
const HUMAN_VOICE_STARTERS = [
  "Look,",
  "Here's the thing:",
  "Real talk:",
  "Honestly,",
  "I mean,",
  "Here's what nobody tells you:",
  "The industry gets this wrong.",
  "Most guides skip this part.",
  "You've probably heard this before, but",
  "I made this mistake.",
  "Forget what you've read elsewhere.",
  "Let me be blunt:",
  "Here's the uncomfortable truth:",
  "I've tested this. Multiple times.",
  "This might sound counterintuitive, but",
  "Fair warning:",
  "Quick reality check:",
  "Between you and me,",
  "I'll be honest with you:",
  "Here's what actually works:",
  "Spoiler alert:",
  "Plot twist:",
  "Hot take:",
  "Unpopular opinion:",
  "Controversial take:",
  "My two cents:",
  "From my experience,",
  "What I've found is",
  "After years of doing this,",
  "I learned this the hard way:",
  "Nobody talks about this, but",
  "The dirty secret is",
  "Here's what the experts won't tell you:",
  "Can we be real for a second?",
  "I'm going to level with you:",
  "Straight up:",
  "No sugarcoating:",
  "Cards on the table:",
  "Bottom line:",
  "The short version:",
  "Long story short:",
  "Cut to the chase:",
  "Here's the deal:",
  "Truth bomb:",
  "Wake-up call:",
  "Reality check:",
  "Pro tip:",
  "Word of warning:",
  "Heads up:"
];
```

### Hedging Phrases (Shows Human Uncertainty)

```javascript
const HEDGING_PHRASES = [
  "probably",
  "might",
  "could be",
  "seems like",
  "from what I've seen",
  "in my experience",
  "I think",
  "I believe",
  "I'd argue",
  "arguably",
  "maybe",
  "perhaps",
  "sort of",
  "kind of",
  "more or less",
  "roughly",
  "approximately",
  "around",
  "about",
  "somewhere around",
  "give or take",
  "ballpark",
  "if I had to guess",
  "my gut says",
  "I suspect",
  "chances are",
  "odds are",
  "likely",
  "unlikely",
  "doubtful",
  "questionable",
  "debatable",
  "it depends",
  "that said",
  "then again",
  "on the other hand",
  "to be fair",
  "granted",
  "admittedly",
  "I could be wrong, but",
  "don't quote me on this, but",
  "take this with a grain of salt",
  "your mileage may vary",
  "results may vary",
  "not always, but",
  "usually",
  "typically",
  "generally",
  "often",
  "sometimes",
  "occasionally",
  "rarely",
  "seldom"
];
```

### Contraction Mapping (80+ conversions)

```javascript
const CONTRACTION_MAP = {
  'I am': "I'm",
  'I have': "I've",
  'I had': "I'd",
  'I would': "I'd",
  'I will': "I'll",
  'you are': "you're",
  'you have': "you've",
  'you had': "you'd",
  'you would': "you'd",
  'you will': "you'll",
  'he is': "he's",
  'she is': "she's",
  'it is': "it's",
  'we are': "we're",
  'we have': "we've",
  'they are': "they're",
  'they have': "they've",
  'that is': "that's",
  'there is': "there's",
  'what is': "what's",
  'who is': "who's",
  'where is': "where's",
  'is not': "isn't",
  'are not': "aren't",
  'was not': "wasn't",
  'were not': "weren't",
  'has not': "hasn't",
  'have not': "haven't",
  'had not': "hadn't",
  'do not': "don't",
  'does not': "doesn't",
  'did not': "didn't",
  'will not': "won't",
  'would not': "wouldn't",
  'could not': "couldn't",
  'should not': "shouldn't",
  'can not': "can't",
  'cannot': "can't",
  'let us': "let's",
  // ... 40+ more
};
```

### Humanization Functions

```javascript
// 1. Remove forbidden AI vocabulary
function removeForbiddenWords(text) {
  let result = text;
  for (const [forbidden, replacement] of Object.entries(FORBIDDEN_AI_WORDS)) {
    const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
    result = result.replace(regex, replacement);
  }
  return result;
}

// 2. Apply contractions
function applyContractions(text) {
  let result = text;
  for (const [full, contracted] of Object.entries(CONTRACTION_MAP)) {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, contracted);
  }
  return result;
}

// 3. Fix Rule of Three (AI loves exactly 3 items)
function fixRuleOfThree(text) {
  // Replace "three things" with "four things" or "two things"
  return text.replace(/three\s+(things|items|points|factors|reasons|ways|steps|tips)/gi, 
    (match, noun) => {
      const replacement = Math.random() > 0.5 ? 'four' : 'two';
      return `${replacement} ${noun}`;
    });
}

// 4. Analyze burstiness (sentence length variation)
function analyzeBurstiness(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  const cv = (Math.sqrt(variance) / mean) * 100;
  return {
    score: cv,
    isHumanLike: cv > 40 // Human writing typically has CV > 40%
  };
}

// 5. Inject human voice markers
function injectHumanVoice(text, frequency = 0.15) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, index) => {
    if (para.length < 100 || index === 0) return para;
    if (Math.random() < frequency) {
      const marker = HUMAN_VOICE_STARTERS[Math.floor(Math.random() * HUMAN_VOICE_STARTERS.length)];
      return `${marker} ${para}`;
    }
    return para;
  }).join('\n\n');
}

// 6. Add hedging phrases
function addHedging(text, frequency = 0.1) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.map(sentence => {
    if (sentence.length < 50 || Math.random() > frequency) return sentence;
    const hedge = HEDGING_PHRASES[Math.floor(Math.random() * HEDGING_PHRASES.length)];
    const words = sentence.split(' ');
    if (words.length > 5) {
      const insertPoint = Math.floor(Math.random() * 3) + 2;
      words.splice(insertPoint, 0, hedge);
      return words.join(' ');
    }
    return sentence;
  }).join(' ');
}

// 7. Fix AI conclusion patterns
function fixConclusions(text) {
  const replacements = {
    'In Conclusion': 'Parting Thoughts',
    'Conclusion': 'Where This Leaves You',
    'To Summarize': 'Final Words',
    'Summary': 'The Bottom Line',
    'Final Thoughts': 'Parting Words',
    'Wrapping Up': 'Before You Go',
    'Key Takeaways': 'What Matters Most'
  };
  let result = text;
  for (const [ai, human] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`<h2[^>]*>${ai}</h2>`, 'gi'), 
      `<h2 id="final-words">${human}</h2>`);
  }
  return result;
}

// 8. Add punctuation friction (em-dashes, ellipses)
function addPunctuationFriction(text) {
  let result = text;
  // Add em-dashes for parenthetical remarks
  result = result.replace(/, which (is|was|are|were) ([^,]+),/gi, (match, verb, content) => {
    if (Math.random() < 0.3) return `—which ${verb} ${content}—`;
    return match;
  });
  return result;
}

// 9. Improve burstiness (vary sentence lengths)
function improveBurstiness(text) {
  // Split long similar-length sentences
  // Add fragments for emphasis
  // Break up monotonous rhythm
}

// 10. Add rhetorical questions
function addRhetoricalQuestions(text, frequency = 0.08) {
  const questions = [
    "Sound familiar?",
    "Makes sense, right?",
    "See where I'm going with this?",
    "Why does this matter?",
    "What's the catch?",
    "So what changed?",
    "The result?",
    "The problem?",
    "Why?",
    "How?",
    "What happened next?",
    "Surprised?",
    "Confused yet?",
    "Still with me?",
    "Notice anything?",
    "See the pattern?",
    "Get the picture?",
    "Ring any bells?",
    "Sound too good to be true?",
    "What's the takeaway?"
  ];
  // Insert at end of paragraphs randomly
}
```

### Master Humanization Function

```javascript
function humanizeContent(content, options = {}) {
  const {
    removeForbidden = true,
    useContractions = true,
    fixThreeRule = true,
    injectVoice = true,
    addHedges = true,
    fixEndings = true,
    addPunctuation = true,
    improveBurst = true,
    addQuestions = true,
    voiceFrequency = 0.12,
    hedgeFrequency = 0.08,
    questionFrequency = 0.06
  } = options;
  
  let result = content;
  
  // Step 1: Remove forbidden AI vocabulary
  if (removeForbidden) result = removeForbiddenWords(result);
  
  // Step 2: Apply contractions
  if (useContractions) result = applyContractions(result);
  
  // Step 3: Fix Rule of Three
  if (fixThreeRule) result = fixRuleOfThree(result);
  
  // Step 4: Fix conclusion patterns
  if (fixEndings) result = fixConclusions(result);
  
  // Step 5: Add punctuation friction
  if (addPunctuation) result = addPunctuationFriction(result);
  
  // Step 6: Improve burstiness
  if (improveBurst) result = improveBurstiness(result);
  
  // Step 7: Inject human voice markers
  if (injectVoice) result = injectHumanVoice(result, voiceFrequency);
  
  // Step 8: Add hedging phrases
  if (addHedges) result = addHedging(result, hedgeFrequency);
  
  // Step 9: Add rhetorical questions
  if (addQuestions) result = addRhetoricalQuestions(result, questionFrequency);
  
  return result.trim();
}
```

---

## STEP 3: Professional Humanizer APIs

### Option A: StealthGPT Integration

**File:** `server/stealthService.js`

```javascript
// StealthGPT API Configuration
const STEALTHGPT_API_URL = 'https://stealthgpt.ai/api/stealthify';
const STEALTHGPT_ARTICLES_URL = 'https://stealthgpt.ai/api/stealthify/articles';

/**
 * Humanize content using StealthGPT API
 * 
 * @param {string} text - The AI-generated text to humanize
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Humanized content with detection score
 */
async function humanizeWithStealth(text, options = {}) {
  const apiToken = process.env.STEALTHGPT_API_KEY;
  
  const {
    tone = 'Standard',      // Standard, HighSchool, College, PhD
    mode = 'High',          // High, Medium, Low (detail level)
    business = true,        // Use business mode (10x more powerful)
    isMultilingual = true   // Keep original language
  } = options;

  const response = await axios.post(STEALTHGPT_API_URL, {
    prompt: text,
    rephrase: true,       // TRUE = rephrase existing content
    tone,
    mode,
    business,
    isMultilingual
  }, {
    headers: {
      'api-token': apiToken,
      'Content-Type': 'application/json'
    },
    timeout: 120000 // 2 minute timeout
  });

  return {
    success: true,
    content: response.data.result,
    detectionScore: response.data.howLikelyToBeDetected || 0,
    wordsUsed: response.data.wordsSpent || 0,
    creditsRemaining: response.data.remainingCredits || 0
  };
}
```

**Pricing:** $0.0002/word (~$1 per 5,000 words)
**Get API Key:** https://stealthgpt.ai/stealthapi

---

### Option B: Undetectable.ai Integration

**File:** `server/undetectableService.js`

```javascript
// Undetectable.ai API Configuration
const UNDETECTABLE_API_URL = 'https://humanize.undetectable.ai';

/**
 * Submit content for humanization
 * 
 * @param {string} content - The AI-generated text (min 50 chars)
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Document ID for polling
 */
async function submitForHumanization(content, options = {}) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;

  const {
    readability = 'Journalist',  // High School, University, Doctorate, Journalist, Marketing
    purpose = 'Article',          // General Writing, Essay, Article, Marketing Material, etc.
    strength = 'More Human',      // Quality, Balanced, More Human
    model = 'v11sr'               // v2 (multilingual), v11 (best English), v11sr (best humanization)
  } = options;

  const response = await axios.post(`${UNDETECTABLE_API_URL}/submit`, {
    content,
    readability,
    purpose,
    strength,
    model
  }, {
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    }
  });

  return {
    success: true,
    documentId: response.data.id
  };
}

/**
 * Retrieve humanized document (poll until ready)
 */
async function retrieveDocument(documentId) {
  const response = await axios.post(`${UNDETECTABLE_API_URL}/document`, {
    id: documentId
  }, {
    headers: { 'apikey': apiKey }
  });

  if (response.data.output) {
    return {
      success: true,
      ready: true,
      content: response.data.output
    };
  }
  return { success: true, ready: false, status: 'processing' };
}

/**
 * Full humanization with polling
 */
async function humanizeWithUndetectable(content, options = {}) {
  // 1. Submit document
  const submitResult = await submitForHumanization(content, options);
  
  // 2. Poll for completion (every 5 seconds, max 60 attempts)
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const result = await retrieveDocument(submitResult.documentId);
    if (result.ready) return result;
  }
  
  return { success: false, error: 'Timeout' };
}
```

**Pricing:** From $9.99/month (10,000 words)
**Get API Key:** https://undetectable.ai/pricing

**Models Available:**
- `v2` - Supports every language, medium humanization
- `v11` - Best for English, high humanization
- `v11sr` - Slightly slower, best for English, BEST humanization (recommended)

---

## AI Risk Analysis

### File: `server/humanContentEngine.js`

```javascript
/**
 * Analyze content for AI detection risk
 * @param {string} content - Content to analyze
 * @returns {object} - Analysis results with score and recommendations
 */
function analyzeAIRisk(content) {
  const results = {
    score: 100, // Start at 100 (human), deduct for AI markers
    issues: [],
    recommendations: []
  };
  
  // Check for forbidden words
  let forbiddenCount = 0;
  for (const word of Object.keys(FORBIDDEN_AI_WORDS)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) forbiddenCount += matches.length;
  }
  
  if (forbiddenCount > 0) {
    results.score -= Math.min(30, forbiddenCount * 3);
    results.issues.push(`Found ${forbiddenCount} AI vocabulary markers`);
    results.recommendations.push('Replace forbidden AI words with human alternatives');
  }
  
  // Check burstiness
  const burstiness = analyzeBurstiness(content);
  if (!burstiness.isHumanLike) {
    results.score -= 20;
    results.issues.push(`Low burstiness (CV: ${burstiness.score.toFixed(1)}%, need >40%)`);
    results.recommendations.push('Vary sentence lengths more dramatically');
  }
  
  // Check for Rule of Three
  const threeMatches = content.match(/(\b\w+),\s+(\b\w+),\s+and\s+(\b\w+)\b/gi);
  if (threeMatches && threeMatches.length > 2) {
    results.score -= 10;
    results.issues.push(`Found ${threeMatches.length} "Rule of Three" patterns`);
    results.recommendations.push('Change lists to 2 or 4 items instead of 3');
  }
  
  // Check for contractions
  const noContractions = ['do not', 'does not', 'did not', 'will not', 'would not', 
                          'could not', 'should not', 'can not', 'cannot', 'is not', 
                          'are not', 'was not', 'were not', 'has not', 'have not'];
  let noContractionCount = 0;
  for (const phrase of noContractions) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) noContractionCount += matches.length;
  }
  
  if (noContractionCount > 3) {
    results.score -= 15;
    results.issues.push(`Found ${noContractionCount} uncontracted phrases`);
    results.recommendations.push('Use contractions (don\'t, isn\'t, won\'t, etc.)');
  }
  
  // Determine risk level
  if (results.score >= 80) {
    results.riskLevel = 'Low';
    results.riskColor = 'green';
  } else if (results.score >= 60) {
    results.riskLevel = 'Medium';
    results.riskColor = 'yellow';
  } else {
    results.riskLevel = 'High';
    results.riskColor = 'red';
  }
  
  return results;
}
```

---

## API Endpoints

### Generate Human Content
```
POST /api/content/generate-human
Authorization: Bearer <token>

Body:
{
  "topic": "How to Start a Blog in 2025",
  "keywords": "blogging, start a blog, blog tips",
  "tone": "conversational",           // conversational, academic, professional
  "minWords": 5000,
  "numImages": 4,
  "headings": "Introduction|Getting Started|Choosing a Platform|...",
  "references": "Optional reference material",
  "eeat": "Optional E-E-A-T signals",
  "targetAudience": "beginner bloggers",
  "persona": "journalist",            // journalist, practitioner, researcher, mentor
  "humanizer": "auto"                 // auto, stealthgpt, undetectable, local
}

Response:
{
  "content": "<h2>...</h2><p>...</p>...",
  "title": "How to Start a Blog in 2025",
  "wordCount": 5234,
  "images": [...],
  "humanizationScore": 85,
  "humanizationLevel": "Low",
  "humanizerUsed": "Undetectable.ai",
  "stealthGPTUsed": false,
  "undetectableUsed": true
}
```

### Humanize Existing Content
```
POST /api/content/humanize
Authorization: Bearer <token>

Body:
{
  "content": "Your AI-generated content here...",
  "options": {
    "humanizer": "undetectable",      // auto, stealthgpt, undetectable, local
    "readability": "Journalist",
    "purpose": "Article",
    "strength": "More Human"
  }
}

Response:
{
  "content": "Humanized content...",
  "humanizerUsed": "Undetectable.ai",
  "analysis": {
    "originalScore": 45,
    "humanizedScore": 88,
    "improvement": 43,
    "issues": [...],
    "recommendations": [...]
  }
}
```

### Check Humanizer Status
```
GET /api/content/humanizer-status
Authorization: Bearer <token>

Response:
{
  "stealthGPT": {
    "configured": true,
    "name": "StealthGPT",
    "pricing": "$0.0002/word",
    "balance": { "creditsRemaining": 50000 }
  },
  "undetectable": {
    "configured": true,
    "name": "Undetectable.ai",
    "pricing": "From $9.99/month",
    "balance": { "totalCredits": 10000 }
  },
  "localEngine": {
    "configured": true,
    "name": "Local Humanization Engine",
    "pricing": "Free (included)",
    "note": "Less effective against advanced detectors"
  }
}
```

---

## Environment Variables

```bash
# AI Content Generation (need at least one)
GOOGLE_AI_KEY=your-google-ai-key
OPENROUTER_API_KEY=your-openrouter-key

# AI Humanizers (need at least one for Originality.ai bypass)
STEALTHGPT_API_KEY=your-stealthgpt-key      # $0.0002/word
UNDETECTABLE_API_KEY=your-undetectable-key  # From $9.99/month
```

---

## Why Free Humanizers Don't Work

Based on extensive testing:

1. **Free humanizers** only do basic synonym replacement
2. **Originality.ai** uses advanced pattern detection that catches:
   - Sentence structure patterns
   - Vocabulary distribution
   - Burstiness (sentence length variation)
   - Perplexity (word predictability)
   - Semantic coherence patterns

3. **Paid services** like Undetectable.ai and StealthGPT use:
   - Advanced neural rewriting
   - Multiple model passes
   - Pattern disruption algorithms
   - Human writing style injection

**Bottom line:** To bypass Originality.ai, you need a paid humanizer API.

---

## Recommended Setup

1. **Best Results:** Use Undetectable.ai with `v11sr` model
2. **Budget Option:** Use StealthGPT (pay-per-word)
3. **Fallback:** Local engine provides basic humanization

The system automatically uses the best available humanizer based on your configured API keys.
