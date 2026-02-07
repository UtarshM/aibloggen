/**
 * Human Content Engine - Advanced AI Detection Bypass System
 * 
 * Based on research into perplexity, burstiness, and linguistic markers
 * that distinguish human writing from AI-generated content.
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════
// FORBIDDEN AI VOCABULARY - Words that trigger detection
// ═══════════════════════════════════════════════════════════════
export const FORBIDDEN_AI_WORDS = {
  // High-frequency AI markers (immediate flags)
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
  
  // Pompous vocabulary
  'paramount': 'critical',
  'plethora': 'many',
  'myriad': 'countless',
  'endeavor': 'effort',
  'endeavors': 'efforts',
  'endeavour': 'effort',
  'ascertain': 'find out',
  'commence': 'start',
  'commencing': 'starting',
  'commenced': 'started',
  'embark': 'start',
  'embarking': 'starting',
  'embarked': 'started',
  'foster': 'build',
  'fostering': 'building',
  'fostered': 'built',
  'integrate': 'combine',
  'integrating': 'combining',
  'integrated': 'combined',
  'underscore': 'highlight',
  'underscores': 'highlights',
  'underscored': 'highlighted',
  'underscore': 'show',
  
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
  'at this point in time': 'now',
  'for all intents and purposes': 'basically',
  'in the event that': 'if',
  'in light of the fact that': 'because',
  'on the grounds that': 'because',
  'with regard to': 'about',
  'with respect to': 'about',
  'in terms of': 'for',
  'as a matter of fact': 'actually',
  'by virtue of': 'because of',
  'in spite of the fact that': 'although',
  'for the purpose of': 'to',
  'in the process of': 'while',
  'in the near future': 'soon',
  'at the present time': 'now',
  'in the final analysis': 'finally',
  'take into consideration': 'consider',
  'make a decision': 'decide',
  'come to a conclusion': 'conclude',
  'give consideration to': 'consider',
  'have the ability to': 'can',
  'is able to': 'can',
  'has the capacity to': 'can',
  'in a manner that': 'so that',
  'on a daily basis': 'daily',
  'on a regular basis': 'regularly',
  'a large number of': 'many',
  'a significant amount of': 'much',
  'the vast majority of': 'most',
  'in close proximity to': 'near',
  'despite the fact that': 'although',
  'owing to the fact that': 'because',
  'for the reason that': 'because',
  'with the exception of': 'except',
  'in the absence of': 'without',
  'in conjunction with': 'with',
  'in accordance with': 'following',
  'subsequent to': 'after',
  'in excess of': 'more than',
  'in the amount of': 'for',
  'at such time as': 'when',
  'in the majority of instances': 'usually',
  'it is essential that': 'must',
  'it is necessary that': 'must',
  'it is imperative that': 'must',
  'it should be noted that': '',
  'it is worth mentioning that': '',
  'it is interesting to note that': '',
  'as previously mentioned': '',
  'as stated earlier': '',
  'as discussed above': ''
};


// ═══════════════════════════════════════════════════════════════
// HUMAN VOICE MARKERS - Phrases that signal human writing
// ═══════════════════════════════════════════════════════════════
export const HUMAN_VOICE_STARTERS = [
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


// ═══════════════════════════════════════════════════════════════
// HEDGING PHRASES - Show human uncertainty (AI is too confident)
// ═══════════════════════════════════════════════════════════════
export const HEDGING_PHRASES = [
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

// ═══════════════════════════════════════════════════════════════
// CONTRACTIONS - Human speech uses contractions naturally
// ═══════════════════════════════════════════════════════════════
export const CONTRACTION_MAP = {
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
  'he has': "he's",
  'he had': "he'd",
  'he would': "he'd",
  'he will': "he'll",
  'she is': "she's",
  'she has': "she's",
  'she had': "she'd",
  'she would': "she'd",
  'she will': "she'll",
  'it is': "it's",
  'it has': "it's",
  'it had': "it'd",
  'it would': "it'd",
  'it will': "it'll",
  'we are': "we're",
  'we have': "we've",
  'we had': "we'd",
  'we would': "we'd",
  'we will': "we'll",
  'they are': "they're",
  'they have': "they've",
  'they had': "they'd",
  'they would': "they'd",
  'they will': "they'll",
  'that is': "that's",
  'that has': "that's",
  'that had': "that'd",
  'that would': "that'd",
  'that will': "that'll",
  'there is': "there's",
  'there has': "there's",
  'there had': "there'd",
  'there would': "there'd",
  'there will': "there'll",
  'here is': "here's",
  'what is': "what's",
  'what has': "what's",
  'what had': "what'd",
  'what would': "what'd",
  'what will': "what'll",
  'who is': "who's",
  'who has': "who's",
  'who had': "who'd",
  'who would': "who'd",
  'who will': "who'll",
  'where is': "where's",
  'where has': "where's",
  'where had': "where'd",
  'where would': "where'd",
  'where will': "where'll",
  'when is': "when's",
  'when has': "when's",
  'why is': "why's",
  'why has': "why's",
  'how is': "how's",
  'how has': "how's",
  'how had': "how'd",
  'how would': "how'd",
  'how will': "how'll",
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
  'might not': "mightn't",
  'must not': "mustn't",
  'can not': "can't",
  'cannot': "can't",
  'let us': "let's",
  'that would': "that'd",
  'there would': "there'd",
  'who would': "who'd"
};


// ═══════════════════════════════════════════════════════════════
// BURSTINESS PATTERNS - Sentence length variation templates
// ═══════════════════════════════════════════════════════════════
export const BURSTINESS_PATTERNS = [
  { type: 'short', minWords: 2, maxWords: 7, description: 'Punchy statement' },
  { type: 'long', minWords: 35, maxWords: 55, description: 'Complex with clauses' },
  { type: 'medium', minWords: 12, maxWords: 22, description: 'Standard declarative' },
  { type: 'fragment', minWords: 1, maxWords: 4, description: 'Emphatic fragment' },
  { type: 'medium', minWords: 15, maxWords: 25, description: 'Explanatory' },
  { type: 'short', minWords: 3, maxWords: 8, description: 'Direct point' },
  { type: 'long', minWords: 30, maxWords: 50, description: 'Narrative with detail' },
  { type: 'question', minWords: 5, maxWords: 15, description: 'Rhetorical question' }
];

// ═══════════════════════════════════════════════════════════════
// ANECDOTE TEMPLATES - For E-E-A-T signals
// ═══════════════════════════════════════════════════════════════
export const ANECDOTE_TEMPLATES = [
  "Back in {month} {year}, I was working on {project} when {discovery}. The {sensory_detail} still sticks with me.",
  "I remember sitting in my {location}—{sensory_detail}—when I finally figured out {insight}.",
  "A client of mine, {fake_name}, came to me with {problem}. What we discovered changed how I approach {topic}.",
  "During a {event} in {year}, I watched {observation}. That's when it clicked.",
  "I spent {time_period} testing {thing}. The results? {outcome}. Not what I expected.",
  "My first attempt at {task} was a disaster. {failure_detail}. But that failure taught me {lesson}.",
  "Last {time_reference}, I ran an experiment: {experiment}. The data showed {finding}.",
  "A colleague once told me, '{quote}.' I didn't believe it until {experience}.",
  "The turning point came when {event}. Before that, I was doing {old_approach}. Now I know better.",
  "I've made this mistake {number} times. Each time, {consequence}. Here's how to avoid it."
];

// ═══════════════════════════════════════════════════════════════
// OPINION INJECTION TEMPLATES
// ═══════════════════════════════════════════════════════════════
export const OPINION_TEMPLATES = [
  "I think {common_belief} is overrated. Here's why:",
  "Most experts get {topic} wrong. The real issue is {insight}.",
  "Unpopular opinion: {contrarian_view}.",
  "The industry loves to talk about {buzzword}. I call BS.",
  "Everyone says {common_advice}. I disagree.",
  "Here's what nobody wants to admit about {topic}:",
  "The conventional wisdom on {topic}? Mostly wrong.",
  "{popular_approach} sounds great in theory. In practice? Not so much.",
  "I've seen too many people fail because they believed {myth}.",
  "Let me be controversial for a second: {hot_take}."
];


// ═══════════════════════════════════════════════════════════════
// CORE HUMANIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Remove forbidden AI vocabulary and replace with human alternatives
 */
export function removeForbiddenWords(text) {
  let result = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedEntries = Object.entries(FORBIDDEN_AI_WORDS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [forbidden, replacement] of sortedEntries) {
    // Use word boundary regex for accurate replacement
    const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
    result = result.replace(regex, replacement);
  }
  
  // Clean up double spaces
  result = result.replace(/\s+/g, ' ');
  
  return result;
}

/**
 * Apply contractions to make text more conversational
 */
export function applyContractions(text) {
  let result = text;
  
  // Sort by length (longest first)
  const sortedEntries = Object.entries(CONTRACTION_MAP)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [full, contracted] of sortedEntries) {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Preserve case of first letter
      if (match[0] === match[0].toUpperCase()) {
        return contracted.charAt(0).toUpperCase() + contracted.slice(1);
      }
      return contracted;
    });
  }
  
  return result;
}

/**
 * Fix "Rule of Three" - AI loves listing exactly 3 items
 */
export function fixRuleOfThree(text) {
  // Pattern to find lists of exactly 3 items
  const threeItemPatterns = [
    // "A, B, and C" pattern
    /(\b\w+),\s+(\b\w+),\s+and\s+(\b\w+)\b/gi,
    // "three things: A, B, C" pattern
    /three\s+(things|items|points|factors|reasons|ways|steps|tips|elements|aspects|components|features|benefits|advantages|principles|strategies|methods|techniques|approaches|considerations|criteria|requirements|qualities|characteristics|attributes|properties)/gi
  ];
  
  let result = text;
  
  // Replace "three" with "four" or "two" randomly
  result = result.replace(threeItemPatterns[1], (match, noun) => {
    const replacement = Math.random() > 0.5 ? 'four' : 'two';
    return `${replacement} ${noun}`;
  });
  
  return result;
}

/**
 * Calculate sentence length for burstiness analysis
 */
export function getSentenceLength(sentence) {
  return sentence.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Analyze burstiness of text (sentence length variation)
 */
export function analyzeBurstiness(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const lengths = sentences.map(getSentenceLength);
  
  if (lengths.length < 2) return { score: 0, variance: 0, lengths };
  
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation (higher = more bursty = more human)
  const cv = (stdDev / mean) * 100;
  
  return {
    score: cv,
    variance,
    stdDev,
    mean,
    lengths,
    isHumanLike: cv > 40 // Human writing typically has CV > 40%
  };
}


/**
 * Inject human voice markers into paragraphs
 */
export function injectHumanVoice(text, frequency = 0.15) {
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip very short paragraphs, headings, and lists
    if (para.length < 100 || para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || para.startsWith('<li')) {
      return para;
    }
    
    // Randomly inject voice markers
    if (Math.random() < frequency && index > 0) {
      const marker = HUMAN_VOICE_STARTERS[Math.floor(Math.random() * HUMAN_VOICE_STARTERS.length)];
      
      // Find first sentence and prepend marker
      const firstSentenceEnd = para.search(/[.!?]/);
      if (firstSentenceEnd > 0 && firstSentenceEnd < 200) {
        // Insert after opening tag if present
        if (para.startsWith('<p>')) {
          return `<p>${marker} ${para.slice(3)}`;
        }
        return `${marker} ${para}`;
      }
    }
    
    return para;
  }).join('\n\n');
}

/**
 * Add hedging phrases to reduce AI confidence patterns
 */
export function addHedging(text, frequency = 0.1) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence, index) => {
    // Skip short sentences, questions, and sentences with existing hedging
    if (sentence.length < 50 || sentence.includes('?') || 
        HEDGING_PHRASES.some(h => sentence.toLowerCase().includes(h))) {
      return sentence;
    }
    
    // Randomly add hedging
    if (Math.random() < frequency) {
      const hedge = HEDGING_PHRASES[Math.floor(Math.random() * HEDGING_PHRASES.length)];
      
      // Insert hedge after first few words
      const words = sentence.split(' ');
      if (words.length > 5) {
        const insertPoint = Math.floor(Math.random() * 3) + 2;
        words.splice(insertPoint, 0, hedge);
        return words.join(' ');
      }
    }
    
    return sentence;
  }).join(' ');
}

/**
 * Remove AI conclusion patterns
 */
export function fixConclusions(text) {
  let result = text;
  
  // Replace AI conclusion headings
  const conclusionReplacements = {
    'In Conclusion': 'Parting Thoughts',
    'Conclusion': 'Where This Leaves You',
    'To Summarize': 'Final Words',
    'Summary': 'The Bottom Line',
    'Final Thoughts': 'Parting Words',
    'Wrapping Up': 'Before You Go',
    'Key Takeaways': 'What Matters Most'
  };
  
  for (const [ai, human] of Object.entries(conclusionReplacements)) {
    const regex = new RegExp(`<h2[^>]*>${ai}</h2>`, 'gi');
    result = result.replace(regex, `<h2 id="final-words">${human}</h2>`);
  }
  
  // Remove inline conclusion phrases
  const inlinePhrases = [
    'In conclusion,',
    'To conclude,',
    'To summarize,',
    'In summary,',
    'To sum up,',
    'All in all,',
    'In the final analysis,',
    'When all is said and done,',
    'At the end of the day,',
    'To wrap things up,',
    'In closing,'
  ];
  
  for (const phrase of inlinePhrases) {
    const regex = new RegExp(phrase, 'gi');
    result = result.replace(regex, '');
  }
  
  return result;
}

/**
 * Add em-dashes and ellipses for conversational flow
 */
export function addPunctuationFriction(text) {
  let result = text;
  
  // Add em-dashes for parenthetical remarks (sparingly)
  // Pattern: ", which is X," -> "—which is X—"
  result = result.replace(/, which (is|was|are|were) ([^,]+),/gi, (match, verb, content) => {
    if (Math.random() < 0.3) {
      return `—which ${verb} ${content}—`;
    }
    return match;
  });
  
  // Add ellipses for trailing thoughts (very sparingly)
  // Only at end of certain sentences
  const sentences = result.split(/(?<=[.!])\s+/);
  result = sentences.map((sentence, i) => {
    if (Math.random() < 0.05 && sentence.length > 50 && !sentence.includes('...') && !sentence.includes('?')) {
      // Replace period with ellipsis occasionally
      if (sentence.endsWith('.')) {
        return sentence.slice(0, -1) + '...';
      }
    }
    return sentence;
  }).join(' ');
  
  return result;
}


/**
 * Vary sentence structure to increase burstiness
 */
export function improveBurstiness(text) {
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map(para => {
    // Skip non-paragraph content
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || para.length < 100) {
      return para;
    }
    
    const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 3) return para;
    
    // Analyze current burstiness
    const lengths = sentences.map(getSentenceLength);
    const analysis = analyzeBurstiness(para);
    
    // If already bursty enough, skip
    if (analysis.isHumanLike) return para;
    
    // Find consecutive sentences with similar length and vary them
    const modified = sentences.map((sentence, i) => {
      if (i === 0) return sentence;
      
      const prevLen = lengths[i - 1];
      const currLen = lengths[i];
      
      // If lengths are too similar (within 5 words), try to vary
      if (Math.abs(prevLen - currLen) < 5) {
        // If previous was long, make this short
        if (prevLen > 20 && currLen > 15) {
          // Try to split or shorten
          const words = sentence.trim().split(' ');
          if (words.length > 10) {
            // Create a fragment from first part
            const breakPoint = Math.min(6, Math.floor(words.length / 3));
            const fragment = words.slice(0, breakPoint).join(' ');
            const rest = words.slice(breakPoint).join(' ');
            
            // Only if it makes grammatical sense
            if (fragment.length > 10 && rest.length > 20) {
              return `${fragment}. ${rest.charAt(0).toUpperCase()}${rest.slice(1)}`;
            }
          }
        }
      }
      
      return sentence;
    });
    
    return modified.join(' ');
  }).join('\n\n');
}

/**
 * Add rhetorical questions for engagement
 */
export function addRhetoricalQuestions(text, frequency = 0.08) {
  const paragraphs = text.split(/\n\n+/);
  
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
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol') || para.length < 150) {
      return para;
    }
    
    // Don't add to first paragraph
    if (index === 0) return para;
    
    // Randomly add rhetorical question
    if (Math.random() < frequency) {
      const question = questions[Math.floor(Math.random() * questions.length)];
      
      // Add at end of paragraph
      if (para.endsWith('</p>')) {
        return para.slice(0, -4) + ` ${question}</p>`;
      } else if (para.endsWith('.')) {
        return para + ` ${question}`;
      }
    }
    
    return para;
  }).join('\n\n');
}

/**
 * Generate a random date in the past for anecdotes
 */
export function generatePastDate() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', 'late 2023', 'early 2024', 'mid-2024'];
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  
  const type = Math.random();
  if (type < 0.33) {
    return `${months[Math.floor(Math.random() * months.length)]} ${years[Math.floor(Math.random() * 3)]}`;
  } else if (type < 0.66) {
    return `the ${seasons[Math.floor(Math.random() * seasons.length)]} of ${years[Math.floor(Math.random() * 3)]}`;
  } else {
    return years[Math.floor(Math.random() * years.length)];
  }
}

/**
 * Generate sensory details for anecdotes
 */
export function generateSensoryDetail() {
  const details = [
    "the coffee had gone cold hours ago",
    "my screen glowing in the dark office",
    "the hum of the AC the only sound",
    "papers scattered across my desk",
    "the smell of takeout containers piling up",
    "rain tapping against the window",
    "my third energy drink of the day",
    "the cursor blinking mockingly",
    "sticky notes covering every surface",
    "the clock showing 2 AM",
    "my phone buzzing with another notification",
    "the whiteboard covered in half-erased ideas",
    "empty coffee cups forming a small army",
    "the fluorescent lights flickering overhead",
    "my back aching from hours in the chair"
  ];
  
  return details[Math.floor(Math.random() * details.length)];
}


// ═══════════════════════════════════════════════════════════════
// MASTER HUMANIZATION FUNCTION
// ═══════════════════════════════════════════════════════════════

/**
 * Apply all humanization techniques to content
 * @param {string} content - The AI-generated content
 * @param {object} options - Configuration options
 * @returns {string} - Humanized content
 */
export function humanizeContent(content, options = {}) {
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
  if (removeForbidden) {
    result = removeForbiddenWords(result);
  }
  
  // Step 2: Apply contractions
  if (useContractions) {
    result = applyContractions(result);
  }
  
  // Step 3: Fix Rule of Three
  if (fixThreeRule) {
    result = fixRuleOfThree(result);
  }
  
  // Step 4: Fix conclusion patterns
  if (fixEndings) {
    result = fixConclusions(result);
  }
  
  // Step 5: Add punctuation friction (em-dashes, ellipses)
  if (addPunctuation) {
    result = addPunctuationFriction(result);
  }
  
  // Step 6: Improve burstiness (sentence length variation)
  if (improveBurst) {
    result = improveBurstiness(result);
  }
  
  // Step 7: Inject human voice markers
  if (injectVoice) {
    result = injectHumanVoice(result, voiceFrequency);
  }
  
  // Step 8: Add hedging phrases
  if (addHedges) {
    result = addHedging(result, hedgeFrequency);
  }
  
  // Step 9: Add rhetorical questions
  if (addQuestions) {
    result = addRhetoricalQuestions(result, questionFrequency);
  }
  
  // Final cleanup
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s+\./g, '.');
  result = result.replace(/\s+,/g, ',');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return result.trim();
}

/**
 * Analyze content for AI detection risk
 * @param {string} content - Content to analyze
 * @returns {object} - Analysis results with score and recommendations
 */
export function analyzeAIRisk(content) {
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
    if (matches) {
      forbiddenCount += matches.length;
    }
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
    results.recommendations.push('Use 2 or 4 items in lists instead of 3');
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
  
  if (noContractionCount > 5) {
    results.score -= 10;
    results.issues.push(`Found ${noContractionCount} uncontracted phrases`);
    results.recommendations.push('Use contractions for natural speech');
  }
  
  // Check for AI conclusion patterns
  const conclusionPatterns = ['in conclusion', 'to summarize', 'in summary', 'to conclude'];
  for (const pattern of conclusionPatterns) {
    if (content.toLowerCase().includes(pattern)) {
      results.score -= 5;
      results.issues.push(`Found AI conclusion pattern: "${pattern}"`);
      results.recommendations.push('Replace formal conclusions with natural endings');
      break;
    }
  }
  
  // Determine risk level
  if (results.score >= 80) {
    results.riskLevel = 'LOW';
    results.riskColor = 'green';
  } else if (results.score >= 60) {
    results.riskLevel = 'MEDIUM';
    results.riskColor = 'yellow';
  } else {
    results.riskLevel = 'HIGH';
    results.riskColor = 'red';
  }
  
  return results;
}

export default {
  humanizeContent,
  analyzeAIRisk,
  removeForbiddenWords,
  applyContractions,
  fixRuleOfThree,
  analyzeBurstiness,
  injectHumanVoice,
  addHedging,
  fixConclusions,
  addPunctuationFriction,
  improveBurstiness,
  addRhetoricalQuestions,
  generatePastDate,
  generateSensoryDetail,
  FORBIDDEN_AI_WORDS,
  HUMAN_VOICE_STARTERS,
  HEDGING_PHRASES,
  CONTRACTION_MAP,
  BURSTINESS_PATTERNS,
  ANECDOTE_TEMPLATES,
  OPINION_TEMPLATES
};
