/**
 * ADVANCED HUMANIZER ENGINE v2.0
 * 
 * Professional Blog Humanization System
 * Based on expert-level humanization methodology
 * 
 * Purpose: Transform AI-written content to feel 100% human-written
 * 
 * Key Features:
 * - Natural human tone with light imperfections
 * - Varied sentence lengths (short + long mixed)
 * - Casual connectors (And, But, So)
 * - Mild repetition (humans do this)
 * - Remove AI clichés
 * - Pass AI detection as human-written
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025-2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════
// HUMAN WRITING PATTERNS (Based on Real Human Mistakes)
// ═══════════════════════════════════════════════════════════════

/**
 * Common mistakes humans make in blog writing:
 * 1. Sentence structure - sometimes long, sometimes abrupt
 * 2. Minor grammar errors - missing articles, slight tense issues
 * 3. Punctuation issues - extra commas, missing commas, overuse of "..."
 * 4. Word repetition - humans repeat words subconsciously
 * 5. Casual/spoken language - "you know", "honestly", "kind of"
 * 6. Starting with And/But/So - grammatically allowed but informal
 * 7. Incomplete thoughts - context clear but thought not fully expressed
 * 8. Opinionated statements - without proof
 * 9. Inconsistent formatting - paragraph length varies
 * 10. Over/under explaining - sometimes too much detail, sometimes assumes knowledge
 */

// AI Clichés to Remove (These scream "AI wrote this")
export const AI_CLICHES = [
  'In conclusion',
  'To summarize',
  'In summary',
  'To wrap up',
  'Furthermore',
  'Moreover',
  'Additionally',
  'It is important to note',
  'It should be noted',
  'It is worth mentioning',
  'It is interesting to note',
  'As previously mentioned',
  'As stated earlier',
  'As discussed above',
  'In today\'s digital age',
  'In today\'s world',
  'In this day and age',
  'At the end of the day',
  'First and foremost',
  'Last but not least',
  'Without further ado',
  'Let\'s dive in',
  'Let\'s get started',
  'In this article',
  'In this blog post',
  'In this guide',
  'I hope this helps',
  'I hope you found this helpful',
  'Thank you for reading',
  'Feel free to',
  'Don\'t hesitate to',
  'Please note that',
  'It goes without saying',
  'Needless to say',
  'As you can see',
  'As we all know',
  'It is clear that',
  'It is evident that',
  'It is obvious that',
  'There is no doubt that',
  'It cannot be denied that',
  'One cannot help but',
  'It is safe to say',
  'For all intents and purposes'
];

// Human-like replacements for AI phrases
export const HUMANIZE_REPLACEMENTS = {
  'Furthermore': ['Plus', 'Also', 'And', 'On top of that'],
  'Moreover': ['Also', 'Plus', 'And', 'Besides'],
  'Additionally': ['Also', 'And', 'Plus', 'On top of that'],
  'However': ['But', 'Though', 'Still', 'That said'],
  'Therefore': ['So', 'That\'s why', 'Because of this'],
  'Consequently': ['So', 'As a result', 'Because of this'],
  'Nevertheless': ['Still', 'But', 'Even so', 'That said'],
  'Subsequently': ['Then', 'After that', 'Next', 'Later'],
  'Utilize': ['Use', 'Work with', 'Rely on'],
  'Implement': ['Set up', 'Start', 'Put in place', 'Do'],
  'Leverage': ['Use', 'Take advantage of', 'Work with'],
  'Optimize': ['Improve', 'Fine-tune', 'Boost', 'Make better'],
  'Facilitate': ['Help', 'Make easier', 'Enable'],
  'Comprehensive': ['Complete', 'Full', 'Thorough', 'Detailed'],
  'Robust': ['Solid', 'Strong', 'Reliable'],
  'Seamless': ['Smooth', 'Easy', 'Effortless'],
  'Cutting-edge': ['Latest', 'Modern', 'New'],
  'Game-changer': ['Big shift', 'Major change', 'Breakthrough'],
  'Revolutionary': ['New', 'Fresh', 'Innovative'],
  'Transformative': ['Major', 'Significant', 'Big'],
  'Paramount': ['Critical', 'Essential', 'Key', 'Vital'],
  'Plethora': ['Many', 'Lots of', 'Plenty of', 'A bunch of'],
  'Myriad': ['Many', 'Countless', 'Tons of', 'Loads of']
};

// Casual connectors humans use
export const CASUAL_CONNECTORS = [
  'And',
  'But',
  'So',
  'Plus',
  'Also',
  'Though',
  'Still',
  'Yet',
  'Now',
  'See',
  'Look',
  'Thing is',
  'Here\'s the deal',
  'The reality is',
  'Truth is',
  'Fact is',
  'Point is'
];

// Human voice markers
export const HUMAN_VOICE_MARKERS = [
  'honestly',
  'actually',
  'basically',
  'really',
  'pretty much',
  'kind of',
  'sort of',
  'you know',
  'I mean',
  'to be fair',
  'in my experience',
  'from what I\'ve seen',
  'I think',
  'I believe',
  'I\'d say',
  'I\'d argue',
  'my take is',
  'the way I see it'
];

// Self-correction phrases (humans do this)
export const SELF_CORRECTIONS = [
  'Actually, let me rephrase that.',
  'Wait, that\'s not quite right.',
  'Scratch that—here\'s what I mean:',
  'Let me back up for a second.',
  'Or rather,',
  'Well, not exactly.',
  'To be more precise,',
  'What I really mean is'
];

// Personal asides (humans add these)
export const PERSONAL_ASIDES = [
  '(I learned this the hard way)',
  '(don\'t ask how I know this)',
  '(yes, I made this mistake too)',
  '(spoiler: it didn\'t go well)',
  '(trust me on this one)',
  '(been there, done that)',
  '(speaking from experience here)',
  '(and I\'ve tested this multiple times)'
];

// Hedging phrases (AI is too confident, humans hedge)
export const HEDGING_PHRASES = [
  'probably',
  'might',
  'could be',
  'seems like',
  'I think',
  'I believe',
  'in my experience',
  'from what I\'ve seen',
  'usually',
  'typically',
  'generally',
  'often',
  'sometimes',
  'arguably',
  'perhaps',
  'maybe'
];

// Rhetorical questions (for engagement)
export const RHETORICAL_QUESTIONS = [
  'Sound familiar?',
  'Makes sense, right?',
  'See where I\'m going with this?',
  'Why does this matter?',
  'What\'s the catch?',
  'So what changed?',
  'The result?',
  'The problem?',
  'Surprised?',
  'See the pattern?',
  'Get the picture?',
  'Ring any bells?',
  'Crazy, right?',
  'Wild, isn\'t it?',
  'Who knew?'
];



// ═══════════════════════════════════════════════════════════════
// CORE HUMANIZATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Remove AI clichés from content
 */
export function removeAIClichés(content) {
  let result = content;
  
  for (const cliche of AI_CLICHES) {
    // Case-insensitive replacement
    const regex = new RegExp(cliche + '[,.]?\\s*', 'gi');
    result = result.replace(regex, '');
  }
  
  // Clean up double spaces and empty paragraphs
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/<p>\s*<\/p>/g, '');
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return result;
}

/**
 * Replace formal AI words with casual human alternatives
 */
export function casualizeVocabulary(content) {
  let result = content;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedEntries = Object.entries(HUMANIZE_REPLACEMENTS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [formal, replacements] of sortedEntries) {
    const regex = new RegExp(`\\b${formal}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Random selection from replacements
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      // Preserve case
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  
  return result;
}

/**
 * Apply contractions to make text conversational
 */
export function applyContractions(content) {
  const contractionMap = {
    'I am': "I'm",
    'I have': "I've",
    'I had': "I'd",
    'I would': "I'd",
    'I will': "I'll",
    'you are': "you're",
    'you have': "you've",
    'you will': "you'll",
    'he is': "he's",
    'she is': "she's",
    'it is': "it's",
    'we are': "we're",
    'we have': "we've",
    'we will': "we'll",
    'they are': "they're",
    'they have': "they've",
    'they will': "they'll",
    'that is': "that's",
    'there is': "there's",
    'here is': "here's",
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
    'let us': "let's"
  };
  
  let result = content;
  
  // Sort by length (longest first)
  const sortedEntries = Object.entries(contractionMap)
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
 * Vary sentence lengths for natural flow
 * AI writes uniform sentences; humans vary dramatically
 */
export function varySentenceLengths(content) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map(para => {
    // Skip headings, lists, and short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || para.length < 100) {
      return para;
    }
    
    const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 3) return para;
    
    // Check for consecutive similar-length sentences
    const modified = sentences.map((sentence, i) => {
      if (i === 0) return sentence;
      
      const prevLen = sentences[i - 1].split(' ').length;
      const currLen = sentence.split(' ').length;
      
      // If lengths are too similar (within 5 words), try to vary
      if (Math.abs(prevLen - currLen) < 5 && currLen > 12) {
        // Occasionally break a long sentence into two
        if (Math.random() < 0.3) {
          const words = sentence.trim().split(' ');
          if (words.length > 15) {
            // Find a good break point (after conjunctions or commas)
            const breakPoints = [];
            words.forEach((word, idx) => {
              if (idx > 5 && idx < words.length - 5) {
                if (['and', 'but', 'so', 'which', 'that', 'because'].includes(word.toLowerCase())) {
                  breakPoints.push(idx);
                }
              }
            });
            
            if (breakPoints.length > 0) {
              const breakAt = breakPoints[Math.floor(Math.random() * breakPoints.length)];
              const firstPart = words.slice(0, breakAt).join(' ');
              const secondPart = words.slice(breakAt).join(' ');
              return `${firstPart}. ${secondPart.charAt(0).toUpperCase()}${secondPart.slice(1)}`;
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
 * Add casual sentence starters (And, But, So)
 * Humans start sentences with these; AI avoids them
 */
export function addCasualStarters(content, frequency = 0.08) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, paraIndex) => {
    // Skip headings, lists, first paragraph
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || paraIndex === 0 ||
        para.length < 100) {
      return para;
    }
    
    const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 2) return para;
    
    const modified = sentences.map((sentence, i) => {
      // Don't modify first sentence of paragraph
      if (i === 0) return sentence;
      
      // Random chance to add casual starter
      if (Math.random() < frequency) {
        const starters = ['And ', 'But ', 'So '];
        const starter = starters[Math.floor(Math.random() * starters.length)];
        
        // Only if sentence doesn't already start with these
        const trimmed = sentence.trim();
        if (!trimmed.match(/^(And|But|So|Or|Yet|Now)\s/i)) {
          // Handle HTML tags
          if (trimmed.startsWith('<p>')) {
            return `<p>${starter}${trimmed.slice(3, 4).toLowerCase()}${trimmed.slice(4)}`;
          }
          return `${starter}${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
        }
      }
      
      return sentence;
    });
    
    return modified.join(' ');
  }).join('\n\n');
}

/**
 * Inject human voice markers naturally
 */
export function injectHumanVoice(content, frequency = 0.1) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs, first paragraph
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || index === 0 ||
        para.length < 150) {
      return para;
    }
    
    // Random chance to inject voice marker
    if (Math.random() < frequency) {
      const markers = [
        'Honestly, ',
        'Look, ',
        'Here\'s the thing: ',
        'Real talk: ',
        'The reality is, ',
        'Truth is, ',
        'From my experience, ',
        'I\'ve found that ',
        'What I\'ve learned is ',
        'Here\'s what actually works: '
      ];
      const marker = markers[Math.floor(Math.random() * markers.length)];
      
      // Insert at start of paragraph
      if (para.startsWith('<p>')) {
        return `<p>${marker}${para.slice(3, 4).toLowerCase()}${para.slice(4)}`;
      }
      return `${marker}${para.charAt(0).toLowerCase()}${para.slice(1)}`;
    }
    
    return para;
  }).join('\n\n');
}

/**
 * Add hedging phrases to reduce AI's overconfident tone
 */
export function addHedging(content, frequency = 0.06) {
  const sentences = content.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence) => {
    // Skip short sentences, questions, and sentences with existing hedging
    if (sentence.length < 80 || sentence.includes('?') ||
        HEDGING_PHRASES.some(h => sentence.toLowerCase().includes(h))) {
      return sentence;
    }
    
    // Random chance to add hedging
    if (Math.random() < frequency) {
      const hedges = ['probably ', 'usually ', 'typically ', 'generally ', 'often '];
      const hedge = hedges[Math.floor(Math.random() * hedges.length)];
      
      // Insert hedge after first few words
      const words = sentence.split(' ');
      if (words.length > 8) {
        const insertPoint = Math.floor(Math.random() * 3) + 2;
        words.splice(insertPoint, 0, hedge.trim());
        return words.join(' ');
      }
    }
    
    return sentence;
  }).join(' ');
}

/**
 * Add rhetorical questions for engagement
 */
export function addRhetoricalQuestions(content, frequency = 0.06) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs, first few paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || index < 2 ||
        para.length < 200) {
      return para;
    }
    
    // Random chance to add rhetorical question
    if (Math.random() < frequency) {
      const question = RHETORICAL_QUESTIONS[Math.floor(Math.random() * RHETORICAL_QUESTIONS.length)];
      
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
 * Add personal asides occasionally
 */
export function addPersonalAsides(content, frequency = 0.04) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || index < 3 ||
        para.length < 200) {
      return para;
    }
    
    // Random chance to add personal aside
    if (Math.random() < frequency) {
      const aside = PERSONAL_ASIDES[Math.floor(Math.random() * PERSONAL_ASIDES.length)];
      
      // Find a sentence to add aside to
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length > 2) {
        const targetIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        const sentence = sentences[targetIndex];
        
        // Add aside before the period
        if (sentence.endsWith('.')) {
          sentences[targetIndex] = sentence.slice(0, -1) + ` ${aside}.`;
          return sentences.join(' ');
        }
      }
    }
    
    return para;
  }).join('\n\n');
}

/**
 * Fix Rule of Three (AI loves exactly 3 items)
 */
export function fixRuleOfThree(content) {
  let result = content;
  
  // Replace "three" with "four" or "two" randomly
  const threePattern = /\bthree\s+(things|items|points|factors|reasons|ways|steps|tips|elements|aspects|components|features|benefits|advantages|principles|strategies|methods|techniques|approaches|keys|areas|parts)\b/gi;
  
  result = result.replace(threePattern, (match, noun) => {
    const replacement = Math.random() > 0.5 ? 'four' : 'two';
    return `${replacement} ${noun}`;
  });
  
  return result;
}

/**
 * Add mild word repetition (humans repeat words)
 */
export function addMildRepetition(content, frequency = 0.03) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.startsWith('<nav') ||
        para.startsWith('<table') || para.length < 200) {
      return para;
    }
    
    // Random chance to add emphasis repetition
    if (Math.random() < frequency) {
      const emphasisPatterns = [
        { find: /\b(important)\b/gi, replace: 'important. Really important' },
        { find: /\b(matters)\b/gi, replace: 'matters. It really matters' },
        { find: /\b(works)\b/gi, replace: 'works. Actually works' },
        { find: /\b(helps)\b/gi, replace: 'helps. Genuinely helps' }
      ];
      
      const pattern = emphasisPatterns[Math.floor(Math.random() * emphasisPatterns.length)];
      
      // Only replace once per paragraph
      let replaced = false;
      return para.replace(pattern.find, (match) => {
        if (!replaced && Math.random() < 0.5) {
          replaced = true;
          return pattern.replace;
        }
        return match;
      });
    }
    
    return para;
  }).join('\n\n');
}



// ═══════════════════════════════════════════════════════════════
// MASTER HUMANIZATION FUNCTION
// ═══════════════════════════════════════════════════════════════

/**
 * Apply all humanization techniques to content
 * 
 * This is the main function that transforms AI-written content
 * to feel 100% human-written while keeping the same meaning.
 * 
 * @param {string} content - The AI-generated content
 * @param {object} options - Configuration options
 * @returns {object} - Humanized content with metadata
 */
export function humanizeBlog(content, options = {}) {
  const {
    removeCliches = true,
    casualize = true,
    useContractions = true,
    varySentences = true,
    addStarters = true,
    injectVoice = true,
    addHedges = true,
    addQuestions = true,
    addAsides = true,
    fixThreeRule = true,
    addRepetition = true,
    // Frequency controls
    starterFrequency = 0.08,
    voiceFrequency = 0.10,
    hedgeFrequency = 0.06,
    questionFrequency = 0.06,
    asideFrequency = 0.04,
    repetitionFrequency = 0.03,
    verbose = false
  } = options;
  
  const startTime = Date.now();
  let result = content;
  const steps = [];
  
  // Step 1: Remove AI clichés
  if (removeCliches) {
    result = removeAIClichés(result);
    steps.push('Removed AI clichés');
    if (verbose) console.log('[Humanizer] Step 1: Removed AI clichés');
  }
  
  // Step 2: Casualize vocabulary
  if (casualize) {
    result = casualizeVocabulary(result);
    steps.push('Casualized vocabulary');
    if (verbose) console.log('[Humanizer] Step 2: Casualized vocabulary');
  }
  
  // Step 3: Apply contractions
  if (useContractions) {
    result = applyContractions(result);
    steps.push('Applied contractions');
    if (verbose) console.log('[Humanizer] Step 3: Applied contractions');
  }
  
  // Step 4: Fix Rule of Three
  if (fixThreeRule) {
    result = fixRuleOfThree(result);
    steps.push('Fixed Rule of Three');
    if (verbose) console.log('[Humanizer] Step 4: Fixed Rule of Three');
  }
  
  // Step 5: Vary sentence lengths
  if (varySentences) {
    result = varySentenceLengths(result);
    steps.push('Varied sentence lengths');
    if (verbose) console.log('[Humanizer] Step 5: Varied sentence lengths');
  }
  
  // Step 6: Add casual starters (And, But, So)
  if (addStarters) {
    result = addCasualStarters(result, starterFrequency);
    steps.push('Added casual starters');
    if (verbose) console.log('[Humanizer] Step 6: Added casual starters');
  }
  
  // Step 7: Inject human voice markers
  if (injectVoice) {
    result = injectHumanVoice(result, voiceFrequency);
    steps.push('Injected human voice');
    if (verbose) console.log('[Humanizer] Step 7: Injected human voice');
  }
  
  // Step 8: Add hedging phrases
  if (addHedges) {
    result = addHedging(result, hedgeFrequency);
    steps.push('Added hedging');
    if (verbose) console.log('[Humanizer] Step 8: Added hedging');
  }
  
  // Step 9: Add rhetorical questions
  if (addQuestions) {
    result = addRhetoricalQuestions(result, questionFrequency);
    steps.push('Added rhetorical questions');
    if (verbose) console.log('[Humanizer] Step 9: Added rhetorical questions');
  }
  
  // Step 10: Add personal asides
  if (addAsides) {
    result = addPersonalAsides(result, asideFrequency);
    steps.push('Added personal asides');
    if (verbose) console.log('[Humanizer] Step 10: Added personal asides');
  }
  
  // Step 11: Add mild repetition
  if (addRepetition) {
    result = addMildRepetition(result, repetitionFrequency);
    steps.push('Added mild repetition');
    if (verbose) console.log('[Humanizer] Step 11: Added mild repetition');
  }
  
  // Final cleanup
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s+\./g, '.');
  result = result.replace(/\s+,/g, ',');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  result = result.replace(/<p>\s*<\/p>/g, '');
  
  const processingTime = Date.now() - startTime;
  
  // Calculate word count
  const textOnly = result.replace(/<[^>]*>/g, ' ');
  const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;
  
  return {
    content: result.trim(),
    metadata: {
      processingTime,
      wordCount,
      stepsApplied: steps,
      options: {
        removeCliches,
        casualize,
        useContractions,
        varySentences,
        addStarters,
        injectVoice,
        addHedges,
        addQuestions,
        addAsides,
        fixThreeRule,
        addRepetition
      }
    }
  };
}

/**
 * Generate the humanization prompt for AI rewriting
 * Use this when you want AI to rewrite content in human style
 */
export function generateHumanizePrompt(blogContent) {
  return `You are rewriting an already written blog to make it sound naturally human-written.

Do NOT change the structure, intent, or information. Only adjust the language and flow so it feels like a real person wrote it.

Follow these rules carefully:

1. Keep the same meaning, facts, and message
2. Make tone conversational, natural, and slightly imperfect
3. Add very light human-like imperfections (minor grammar or flow issues only where natural)
4. Vary sentence length (mix short + long sentences)
5. Allow mild repetition of words (humans do this)
6. Use casual connectors like "and", "but", "so" naturally
7. Avoid robotic or overly polished wording
8. No marketing buzzwords
9. No AI clichés (no "In conclusion", "Furthermore", etc.)
10. Do NOT add new ideas or remove any
11. Do NOT correct everything to perfection

Style reference:
- Write as if a real person is explaining from experience
- Slightly informal but still professional
- Readable and SEO-safe
- Write like someone typed this naturally, not trying to sound perfect

Output requirement:
- Only return the humanized version of the blog
- No explanations, no comments
- Keep all HTML formatting intact

Blog to humanize:

${blogContent}`;
}

/**
 * Analyze content for AI detection risk
 */
export function analyzeHumanScore(content) {
  const results = {
    score: 100, // Start at 100 (human), deduct for AI markers
    issues: [],
    recommendations: []
  };
  
  // Check for AI clichés
  let clicheCount = 0;
  for (const cliche of AI_CLICHES) {
    if (content.toLowerCase().includes(cliche.toLowerCase())) {
      clicheCount++;
    }
  }
  
  if (clicheCount > 0) {
    results.score -= Math.min(25, clicheCount * 5);
    results.issues.push(`Found ${clicheCount} AI clichés`);
    results.recommendations.push('Remove AI clichés like "In conclusion", "Furthermore", etc.');
  }
  
  // Check for formal vocabulary
  let formalCount = 0;
  for (const formal of Object.keys(HUMANIZE_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${formal}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      formalCount += matches.length;
    }
  }
  
  if (formalCount > 5) {
    results.score -= Math.min(20, formalCount * 2);
    results.issues.push(`Found ${formalCount} formal/AI vocabulary words`);
    results.recommendations.push('Replace formal words with casual alternatives');
  }
  
  // Check for contractions (lack of = AI)
  const noContractions = ['do not', 'does not', 'did not', 'will not', 'would not', 
                          'could not', 'should not', 'is not', 'are not', 'was not',
                          'it is', 'that is', 'there is', 'here is'];
  let noContractionCount = 0;
  for (const phrase of noContractions) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      noContractionCount += matches.length;
    }
  }
  
  if (noContractionCount > 3) {
    results.score -= Math.min(15, noContractionCount * 3);
    results.issues.push(`Found ${noContractionCount} uncontracted phrases`);
    results.recommendations.push('Use contractions (don\'t, isn\'t, it\'s, etc.)');
  }
  
  // Check sentence length variation
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length > 5) {
    const lengths = sentences.map(s => s.split(' ').length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / avgLength) * 100;
    
    if (cv < 30) {
      results.score -= 15;
      results.issues.push(`Low sentence length variation (CV: ${cv.toFixed(1)}%)`);
      results.recommendations.push('Vary sentence lengths more (mix short and long)');
    }
  }
  
  // Check for Rule of Three
  const threeMatches = content.match(/\bthree\s+(things|items|points|factors|reasons|ways|steps|tips)\b/gi);
  if (threeMatches && threeMatches.length > 1) {
    results.score -= 10;
    results.issues.push(`Found ${threeMatches.length} "Rule of Three" patterns`);
    results.recommendations.push('Use 2, 4, or 5 items instead of exactly 3');
  }
  
  // Determine risk level
  if (results.score >= 85) {
    results.riskLevel = 'LOW';
    results.verdict = 'Content appears human-written';
  } else if (results.score >= 70) {
    results.riskLevel = 'MEDIUM';
    results.verdict = 'Content may trigger some AI detectors';
  } else {
    results.riskLevel = 'HIGH';
    results.verdict = 'Content likely to be flagged as AI-written';
  }
  
  return results;
}

export default {
  humanizeBlog,
  generateHumanizePrompt,
  analyzeHumanScore,
  removeAIClichés,
  casualizeVocabulary,
  applyContractions,
  varySentenceLengths,
  addCasualStarters,
  injectHumanVoice,
  addHedging,
  addRhetoricalQuestions,
  addPersonalAsides,
  fixRuleOfThree,
  addMildRepetition,
  AI_CLICHES,
  HUMANIZE_REPLACEMENTS,
  CASUAL_CONNECTORS,
  HUMAN_VOICE_MARKERS,
  SELF_CORRECTIONS,
  PERSONAL_ASIDES,
  HEDGING_PHRASES,
  RHETORICAL_QUESTIONS
};
