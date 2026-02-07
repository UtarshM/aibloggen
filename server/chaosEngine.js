/**
 * SCALEZIX CHAOS ENGINE v2.0
 * 
 * Advanced Human Content Generation System
 * Focus: Randomization, Symmetry Breaking, and 100% Human Detection Bypass
 * 
 * This engine takes 2-4 minutes per blog post to ensure:
 * - Multi-pass content refinement
 * - Randomized word replacement (prevents fingerprinting)
 * - Symmetry breaking (brain jumps)
 * - High perplexity and burstiness
 * - E-E-A-T authority signals
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════
// RANDOMIZED SYNONYM DICTIONARY (Prevents AI Fingerprinting)
// ═══════════════════════════════════════════════════════════════
export const HUMAN_SYNONYMS = {
  // High-frequency AI markers with multiple replacements
  'delve': ['dig into', 'look at', 'explore', 'get into the weeds of', 'examine', 'investigate'],
  'delving': ['digging into', 'looking at', 'exploring', 'examining', 'investigating'],
  'delved': ['dug into', 'looked at', 'explored', 'examined', 'investigated'],
  'tapestry': ['mix', 'collection', 'setup', 'reality', 'blend', 'combination'],
  'realm': ['area', 'space', 'field', 'world', 'domain'],
  'realms': ['areas', 'spaces', 'fields', 'worlds', 'domains'],
  'landscape': ['scene', 'picture', 'situation', 'state of things', 'environment'],
  'landscapes': ['scenes', 'pictures', 'situations', 'environments'],
  'testament': ['proof', 'evidence', 'sign', 'indicator', 'demonstration'],
  'vibrant': ['lively', 'active', 'energetic', 'dynamic', 'buzzing'],
  'bustling': ['busy', 'active', 'hectic', 'packed', 'crowded'],
  'pivotal': ['key', 'huge', 'massive', 'vital', 'critical', 'essential'],
  'crucial': ['important', 'key', 'vital', 'essential', 'necessary'],
  'comprehensive': ['complete', 'full', 'thorough', 'detailed', 'in-depth'],
  'meticulous': ['careful', 'detailed', 'thorough', 'precise', 'exact'],
  'meticulously': ['carefully', 'thoroughly', 'precisely', 'exactly'],

  // Corporate/Marketing jargon
  'leverage': ['use', 'rely on', 'work with', 'take advantage of', 'tap into'],
  'leveraging': ['using', 'relying on', 'working with', 'tapping into'],
  'leveraged': ['used', 'relied on', 'worked with', 'tapped into'],
  'utilize': ['use', 'rely on', 'work with', 'employ'],
  'utilizing': ['using', 'relying on', 'working with', 'employing'],
  'utilized': ['used', 'relied on', 'worked with', 'employed'],
  'utilization': ['use', 'usage', 'application'],
  'implement': ['set up', 'start', 'do', 'put in place', 'roll out'],
  'implementing': ['setting up', 'starting', 'doing', 'putting in place', 'rolling out'],
  'implemented': ['set up', 'started', 'did', 'put in place', 'rolled out'],
  'implementation': ['setup', 'rollout', 'launch', 'execution'],
  'facilitate': ['help', 'enable', 'make easier', 'support'],
  'facilitating': ['helping', 'enabling', 'making easier', 'supporting'],
  'facilitated': ['helped', 'enabled', 'made easier', 'supported'],
  'streamline': ['simplify', 'speed up', 'make easier', 'smooth out'],
  'streamlined': ['simplified', 'sped up', 'made easier', 'smoothed out'],
  'streamlining': ['simplifying', 'speeding up', 'making easier'],
  'optimize': ['improve', 'fine-tune', 'tweak', 'boost', 'enhance'],
  'optimizing': ['improving', 'fine-tuning', 'tweaking', 'boosting'],
  'optimized': ['improved', 'fine-tuned', 'tweaked', 'boosted'],
  'optimal': ['best', 'ideal', 'perfect', 'top'],
  'optimally': ['ideally', 'perfectly', 'at best'],
  
  // Buzzwords
  'robust': ['solid', 'strong', 'reliable', 'sturdy', 'dependable'],
  'seamless': ['smooth', 'easy', 'effortless', 'fluid', 'natural'],
  'seamlessly': ['smoothly', 'easily', 'effortlessly', 'naturally'],
  'cutting-edge': ['latest', 'newest', 'modern', 'advanced', 'fresh'],
  'game-changer': ['big shift', 'major change', 'breakthrough', 'turning point'],
  'game-changing': ['significant', 'major', 'breakthrough', 'transformational'],
  'revolutionary': ['new', 'groundbreaking', 'innovative', 'fresh'],
  'revolutionize': ['change', 'shake up', 'overhaul', 'reinvent'],
  'revolutionizing': ['changing', 'shaking up', 'overhauling', 'reinventing'],
  'revolutionized': ['changed', 'shook up', 'overhauled', 'reinvented'],
  'transform': ['change', 'shift', 'alter', 'reshape', 'modify'],
  'transforming': ['changing', 'shifting', 'altering', 'reshaping'],
  'transformed': ['changed', 'shifted', 'altered', 'reshaped'],
  'transformative': ['major', 'significant', 'impactful', 'meaningful'],
  'empower': ['enable', 'help', 'give power to', 'equip'],
  'empowering': ['enabling', 'helping', 'equipping'],
  'empowered': ['enabled', 'helped', 'equipped'],
  'elevate': ['raise', 'lift', 'boost', 'improve', 'upgrade'],
  'elevating': ['raising', 'lifting', 'boosting', 'improving'],
  'elevated': ['raised', 'lifted', 'boosted', 'improved'],
  'enhance': ['improve', 'boost', 'strengthen', 'upgrade', 'better'],
  'enhancing': ['improving', 'boosting', 'strengthening', 'upgrading'],
  'enhanced': ['improved', 'boosted', 'strengthened', 'upgraded'],
  'synergy': ['teamwork', 'collaboration', 'combined effort', 'partnership'],
  'synergies': ['combined efforts', 'partnerships', 'collaborations'],
  'holistic': ['complete', 'full', 'whole', 'overall', 'total'],
  'holistically': ['completely', 'fully', 'overall', 'totally'],
  'paradigm': ['model', 'approach', 'framework', 'way of thinking'],
  'paradigms': ['models', 'approaches', 'frameworks'],
  'ecosystem': ['system', 'environment', 'network', 'setup'],
  'ecosystems': ['systems', 'environments', 'networks', 'setups'],
  'scalable': ['growable', 'expandable', 'flexible', 'adaptable'],

  // Formal transitions (AI overuses these)
  'furthermore': ['plus', 'also', 'on top of that', 'besides that', 'and'],
  'moreover': ['also', 'plus', 'on top of that', 'besides', 'and'],
  'additionally': ['also', 'plus', 'on top of that', 'and', 'besides'],
  'subsequently': ['then', 'after that', 'next', 'later'],
  'nevertheless': ['still', 'but', 'yet', 'even so', 'however'],
  'consequently': ['so', 'as a result', 'because of this', 'therefore'],
  'therefore': ['so', 'because of this', 'for this reason', 'that\'s why'],
  'hence': ['so', 'that\'s why', 'because of this'],
  'thus': ['so', 'this way', 'because of this'],
  'accordingly': ['so', 'because of this', 'as a result'],
  'henceforth': ['from now on', 'going forward', 'from here on'],
  
  // Pompous vocabulary
  'paramount': ['critical', 'essential', 'vital', 'key', 'top priority'],
  'plethora': ['many', 'lots of', 'plenty of', 'a bunch of', 'loads of'],
  'myriad': ['countless', 'many', 'tons of', 'loads of', 'numerous'],
  'endeavor': ['effort', 'attempt', 'try', 'project', 'work'],
  'endeavors': ['efforts', 'attempts', 'tries', 'projects', 'work'],
  'endeavour': ['effort', 'attempt', 'try', 'project'],
  'ascertain': ['find out', 'figure out', 'determine', 'discover', 'learn'],
  'commence': ['start', 'begin', 'kick off', 'launch', 'get going'],
  'commencing': ['starting', 'beginning', 'kicking off', 'launching'],
  'commenced': ['started', 'began', 'kicked off', 'launched'],
  'embark': ['start', 'begin', 'set out', 'launch into'],
  'embarking': ['starting', 'beginning', 'setting out', 'launching into'],
  'embarked': ['started', 'began', 'set out', 'launched into'],
  'foster': ['build', 'grow', 'develop', 'encourage', 'nurture'],
  'fostering': ['building', 'growing', 'developing', 'encouraging'],
  'fostered': ['built', 'grew', 'developed', 'encouraged'],
  'integrate': ['combine', 'merge', 'blend', 'mix', 'bring together'],
  'integrating': ['combining', 'merging', 'blending', 'mixing'],
  'integrated': ['combined', 'merged', 'blended', 'mixed'],
  'underscore': ['highlight', 'show', 'emphasize', 'point out', 'stress'],
  'underscores': ['highlights', 'shows', 'emphasizes', 'points out'],
  'underscored': ['highlighted', 'showed', 'emphasized', 'pointed out'],
  
  // Wordy phrases
  'prior to': ['before', 'ahead of', 'earlier than'],
  'in order to': ['to', 'so that', 'for'],
  'due to the fact that': ['because', 'since', 'as'],
  'at the end of the day': ['ultimately', 'in the end', 'when it comes down to it'],
  'it is important to note': ['note that', 'keep in mind', 'remember'],
  'it goes without saying': ['obviously', 'clearly', 'of course'],
  'needless to say': ['obviously', 'clearly', 'of course'],
  'first and foremost': ['first', 'mainly', 'above all'],
  'last but not least': ['finally', 'lastly', 'and also'],
  'in today\'s world': ['now', 'today', 'these days', 'currently'],
  'in today\'s digital age': ['today', 'now', 'these days'],
  'in this day and age': ['today', 'now', 'these days', 'currently'],
  'at this point in time': ['now', 'currently', 'at this point', 'right now'],
  'for all intents and purposes': ['basically', 'essentially', 'pretty much'],
  'in the event that': ['if', 'when', 'should'],
  'in light of the fact that': ['because', 'since', 'given that'],
  'on the grounds that': ['because', 'since', 'as'],
  'with regard to': ['about', 'regarding', 'on', 'concerning'],
  'with respect to': ['about', 'regarding', 'on', 'concerning'],
  'in terms of': ['for', 'regarding', 'when it comes to', 'about'],
  'as a matter of fact': ['actually', 'in fact', 'really'],
  'by virtue of': ['because of', 'due to', 'thanks to'],
  'in spite of the fact that': ['although', 'even though', 'despite'],
  'for the purpose of': ['to', 'for', 'in order to'],
  'in the process of': ['while', 'during', 'as'],
  'in the near future': ['soon', 'shortly', 'before long'],
  'at the present time': ['now', 'currently', 'at the moment'],
  'in the final analysis': ['finally', 'ultimately', 'in the end'],
  'take into consideration': ['consider', 'think about', 'factor in'],
  'make a decision': ['decide', 'choose', 'pick'],
  'come to a conclusion': ['conclude', 'decide', 'figure out'],
  'give consideration to': ['consider', 'think about', 'look at'],
  'have the ability to': ['can', 'be able to', 'have the power to'],
  'is able to': ['can', 'has the power to'],
  'has the capacity to': ['can', 'is able to'],
  'in a manner that': ['so that', 'in a way that', 'such that'],
  'on a daily basis': ['daily', 'every day', 'each day'],
  'on a regular basis': ['regularly', 'often', 'frequently'],
  'a large number of': ['many', 'lots of', 'plenty of', 'numerous'],
  'a significant amount of': ['much', 'a lot of', 'plenty of'],
  'the vast majority of': ['most', 'nearly all', 'almost all'],
  'in close proximity to': ['near', 'close to', 'next to', 'by'],
  'despite the fact that': ['although', 'even though', 'despite'],
  'owing to the fact that': ['because', 'since', 'as'],
  'for the reason that': ['because', 'since', 'as'],
  'with the exception of': ['except', 'besides', 'apart from'],
  'in the absence of': ['without', 'lacking', 'missing'],
  'in conjunction with': ['with', 'along with', 'together with'],
  'in accordance with': ['following', 'per', 'according to'],
  'subsequent to': ['after', 'following', 'once'],
  'in excess of': ['more than', 'over', 'above'],
  'in the amount of': ['for', 'totaling', 'worth'],
  'at such time as': ['when', 'once', 'as soon as'],
  'in the majority of instances': ['usually', 'mostly', 'often'],
  'it is essential that': ['must', 'need to', 'have to'],
  'it is necessary that': ['must', 'need to', 'have to'],
  'it is imperative that': ['must', 'need to', 'have to'],
  'it should be noted that': ['note that', 'keep in mind', ''],
  'it is worth mentioning that': ['also', 'note that', ''],
  'it is interesting to note that': ['interestingly', 'notably', ''],
  'as previously mentioned': ['as I said', 'like I mentioned', ''],
  'as stated earlier': ['as I said', 'like I mentioned', ''],
  'as discussed above': ['as I covered', 'like I said', '']
};


// ═══════════════════════════════════════════════════════════════
// SYMMETRY BREAKING INTERJECTIONS (Brain Jumps)
// ═══════════════════════════════════════════════════════════════
export const INTERJECTIONS = [
  " (which, let's be honest, is rare)",
  " — and this is important — ",
  ". It's just the reality.",
  ". No doubt about it.",
  " (and I've seen this firsthand)",
  " — trust me on this one — ",
  ". That's the uncomfortable truth.",
  " (something most people miss)",
  ". Full stop.",
  " — here's the kicker — ",
  " (I learned this the hard way)",
  ". Period.",
  " — and I can't stress this enough — ",
  " (which surprised even me)",
  ". That's not up for debate.",
  " — this is where it gets interesting — ",
  " (and yes, I've tested this)",
  ". End of story.",
  " — pay attention here — ",
  " (contrary to popular belief)",
  ". That's the bottom line.",
  " — and here's why that matters — ",
  " (which most guides won't tell you)",
  ". Simple as that.",
  " — this is crucial — ",
  " (and the data backs this up)",
  ". No exceptions.",
  " — mark my words — ",
  " (something I wish I knew earlier)",
  ". That's non-negotiable."
];

// ═══════════════════════════════════════════════════════════════
// HUMAN VOICE STARTERS (Randomized)
// ═══════════════════════════════════════════════════════════════
export const VOICE_STARTERS = [
  "Look,", "Here's the thing:", "Real talk:", "Honestly,", "I mean,",
  "Here's what nobody tells you:", "The industry gets this wrong.",
  "Most guides skip this part.", "You've probably heard this before, but",
  "I made this mistake.", "Forget what you've read elsewhere.",
  "Let me be blunt:", "Here's the uncomfortable truth:",
  "I've tested this. Multiple times.", "This might sound counterintuitive, but",
  "Fair warning:", "Quick reality check:", "Between you and me,",
  "I'll be honest with you:", "Here's what actually works:",
  "Spoiler alert:", "Plot twist:", "Hot take:", "Unpopular opinion:",
  "Controversial take:", "My two cents:", "From my experience,",
  "What I've found is", "After years of doing this,",
  "I learned this the hard way:", "Nobody talks about this, but",
  "The dirty secret is", "Here's what the experts won't tell you:",
  "Can we be real for a second?", "I'm going to level with you:",
  "Straight up:", "No sugarcoating:", "Cards on the table:",
  "Bottom line:", "The short version:", "Long story short:",
  "Cut to the chase:", "Here's the deal:", "Truth bomb:",
  "Wake-up call:", "Reality check:", "Pro tip:", "Word of warning:", "Heads up:"
];

// ═══════════════════════════════════════════════════════════════
// RHETORICAL QUESTIONS (For engagement)
// ═══════════════════════════════════════════════════════════════
export const RHETORICAL_QUESTIONS = [
  "Sound familiar?", "Makes sense, right?", "See where I'm going with this?",
  "Why does this matter?", "What's the catch?", "So what changed?",
  "The result?", "The problem?", "Why?", "How?", "What happened next?",
  "Surprised?", "Confused yet?", "Still with me?", "Notice anything?",
  "See the pattern?", "Get the picture?", "Ring any bells?",
  "Sound too good to be true?", "What's the takeaway?",
  "Crazy, right?", "Wild, isn't it?", "Who knew?", "Go figure.",
  "Shocking? Not really.", "The kicker?", "The twist?",
  "Guess what happened?", "Want to know the secret?", "Ready for this?"
];

// ═══════════════════════════════════════════════════════════════
// HEDGING PHRASES (Shows human uncertainty)
// ═══════════════════════════════════════════════════════════════
export const HEDGING_PHRASES = [
  "probably", "might", "could be", "seems like", "from what I've seen",
  "in my experience", "I think", "I believe", "I'd argue", "arguably",
  "maybe", "perhaps", "sort of", "kind of", "more or less", "roughly",
  "approximately", "around", "about", "somewhere around", "give or take",
  "ballpark", "if I had to guess", "my gut says", "I suspect",
  "chances are", "odds are", "likely", "unlikely", "doubtful",
  "questionable", "debatable", "it depends", "that said", "then again",
  "on the other hand", "to be fair", "granted", "admittedly",
  "I could be wrong, but", "don't quote me on this, but",
  "take this with a grain of salt", "your mileage may vary",
  "results may vary", "not always, but", "usually", "typically",
  "generally", "often", "sometimes", "occasionally", "rarely", "seldom"
];


// ═══════════════════════════════════════════════════════════════
// CONTRACTION MAP (Human speech uses contractions)
// ═══════════════════════════════════════════════════════════════
export const CONTRACTION_MAP = {
  'I am': "I'm", 'I have': "I've", 'I had': "I'd", 'I would': "I'd",
  'I will': "I'll", 'you are': "you're", 'you have': "you've",
  'you had': "you'd", 'you would': "you'd", 'you will': "you'll",
  'he is': "he's", 'he has': "he's", 'he had': "he'd", 'he would': "he'd",
  'he will': "he'll", 'she is': "she's", 'she has': "she's",
  'she had': "she'd", 'she would': "she'd", 'she will': "she'll",
  'it is': "it's", 'it has': "it's", 'it had': "it'd", 'it would': "it'd",
  'it will': "it'll", 'we are': "we're", 'we have': "we've",
  'we had': "we'd", 'we would': "we'd", 'we will': "we'll",
  'they are': "they're", 'they have': "they've", 'they had': "they'd",
  'they would': "they'd", 'they will': "they'll", 'that is': "that's",
  'that has': "that's", 'that had': "that'd", 'that would': "that'd",
  'that will': "that'll", 'there is': "there's", 'there has': "there's",
  'there had': "there'd", 'there would': "there'd", 'there will': "there'll",
  'here is': "here's", 'what is': "what's", 'what has': "what's",
  'what had': "what'd", 'what would': "what'd", 'what will': "what'll",
  'who is': "who's", 'who has': "who's", 'who had': "who'd",
  'who would': "who'd", 'who will': "who'll", 'where is': "where's",
  'where has': "where's", 'where had': "where'd", 'where would': "where'd",
  'where will': "where'll", 'when is': "when's", 'when has': "when's",
  'why is': "why's", 'why has': "why's", 'how is': "how's",
  'how has': "how's", 'how had': "how'd", 'how would': "how'd",
  'how will': "how'll", 'is not': "isn't", 'are not': "aren't",
  'was not': "wasn't", 'were not': "weren't", 'has not': "hasn't",
  'have not': "haven't", 'had not': "hadn't", 'do not': "don't",
  'does not': "doesn't", 'did not': "didn't", 'will not': "won't",
  'would not': "wouldn't", 'could not': "couldn't", 'should not': "shouldn't",
  'might not': "mightn't", 'must not': "mustn't", 'can not': "can't",
  'cannot': "can't", 'let us': "let's"
};

// ═══════════════════════════════════════════════════════════════
// SENSORY DETAILS (For E-E-A-T anecdotes)
// ═══════════════════════════════════════════════════════════════
export const SENSORY_DETAILS = [
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
  "my back aching from hours in the chair",
  "the sound of keyboards clicking nearby",
  "the smell of fresh coffee brewing",
  "sunlight streaming through the blinds",
  "my notebook filled with crossed-out ideas",
  "the deadline looming on my calendar"
];

// ═══════════════════════════════════════════════════════════════
// DATE GENERATORS (For E-E-A-T signals)
// ═══════════════════════════════════════════════════════════════
export function generatePastDate() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025', 'late 2023', 'early 2024', 'mid-2024', 'late 2024', 'early 2025'];
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  const timeRefs = ['last quarter', 'a few months back', 'earlier this year', 'last year'];
  
  const type = Math.random();
  if (type < 0.25) {
    return `${months[Math.floor(Math.random() * months.length)]} ${years[Math.floor(Math.random() * 4)]}`;
  } else if (type < 0.5) {
    return `the ${seasons[Math.floor(Math.random() * seasons.length)]} of ${years[Math.floor(Math.random() * 4)]}`;
  } else if (type < 0.75) {
    return years[Math.floor(Math.random() * years.length)];
  } else {
    return timeRefs[Math.floor(Math.random() * timeRefs.length)];
  }
}

export function generateSensoryDetail() {
  return SENSORY_DETAILS[Math.floor(Math.random() * SENSORY_DETAILS.length)];
}


// ═══════════════════════════════════════════════════════════════
// CORE CHAOS ENGINE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * STEP A: Randomized Word Replacement (Prevents Fingerprinting)
 * Uses random selection from synonym arrays so detectors can't find patterns
 */
export function randomizedWordReplacement(content) {
  let text = content;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedEntries = Object.entries(HUMAN_SYNONYMS)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [word, replacements] of sortedEntries) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(regex, (match) => {
      // Random selection from replacements array
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      // Preserve case of first letter
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  
  return text;
}

/**
 * STEP B: Symmetry Breaking (Injecting "Brain Jumps")
 * Adds natural human interruptions to break AI's perfect flow
 */
export function symmetryBreaking(content) {
  let paragraphs = content.split('\n\n');
  
  paragraphs = paragraphs.map((para, index) => {
    // Skip headings, lists, and short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.length < 100) {
      return para;
    }
    
    // Every 3-4 paragraphs, inject a brain jump
    if ((index % 3 === 0 || index % 4 === 0) && para.length > 80) {
      let sentences = para.split(/(?<=[.!?])\s+/);
      if (sentences.length > 1) {
        // Pick a random sentence (not the first or last)
        const targetIndex = Math.min(
          Math.floor(Math.random() * (sentences.length - 1)) + 1,
          sentences.length - 2
        );
        
        if (targetIndex > 0 && targetIndex < sentences.length) {
          const interjection = INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
          
          // Insert interjection at end of sentence (before period)
          const sentence = sentences[targetIndex];
          if (sentence.endsWith('.')) {
            sentences[targetIndex] = sentence.slice(0, -1) + interjection;
          }
        }
      }
      return sentences.join(' ');
    }
    
    return para;
  });
  
  return paragraphs.join('\n\n');
}

/**
 * STEP C: Apply Contractions
 * Makes text more conversational
 */
export function applyContractions(content) {
  let text = content;
  
  // Sort by length (longest first)
  const sortedEntries = Object.entries(CONTRACTION_MAP)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [full, contracted] of sortedEntries) {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    text = text.replace(regex, (match) => {
      // Preserve case of first letter
      if (match[0] === match[0].toUpperCase()) {
        return contracted.charAt(0).toUpperCase() + contracted.slice(1);
      }
      return contracted;
    });
  }
  
  return text;
}

/**
 * STEP D: Fix Rule of Three
 * AI loves listing exactly 3 items - we break this pattern
 */
export function fixRuleOfThree(content) {
  let text = content;
  
  // Replace "three" with "four" or "two" randomly
  const threePattern = /three\s+(things|items|points|factors|reasons|ways|steps|tips|elements|aspects|components|features|benefits|advantages|principles|strategies|methods|techniques|approaches|considerations|criteria|requirements|qualities|characteristics|attributes|properties|keys|pillars|areas|parts|sections|categories|types|kinds|forms|examples|cases|instances|scenarios|situations|options|choices|alternatives|solutions|answers|responses|reactions|outcomes|results|effects|impacts|consequences|implications|applications|uses|functions|roles|purposes|goals|objectives|targets|aims|priorities|concerns|issues|problems|challenges|obstacles|barriers|limitations|constraints|restrictions|conditions|circumstances|factors|variables|parameters|dimensions|levels|stages|phases|steps|processes|procedures|practices|habits|behaviors|actions|activities|tasks|duties|responsibilities|functions|operations|mechanisms|systems|structures|frameworks|models|patterns|trends|developments|changes|shifts|movements|directions|paths|routes|ways|means|methods|approaches|strategies|tactics|techniques|tools|instruments|resources|assets|capabilities|competencies|skills|abilities|talents|strengths|weaknesses|opportunities|threats)/gi;
  
  text = text.replace(threePattern, (match, noun) => {
    const replacement = Math.random() > 0.5 ? 'four' : 'two';
    return `${replacement} ${noun}`;
  });
  
  return text;
}


/**
 * STEP E: Inject Human Voice Markers
 * Adds natural speech patterns throughout
 */
export function injectHumanVoice(content, frequency = 0.12) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, and short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.length < 100) {
      return para;
    }
    
    // Skip first paragraph (usually has its own hook)
    if (index === 0) return para;
    
    // Randomly inject voice markers
    if (Math.random() < frequency) {
      const marker = VOICE_STARTERS[Math.floor(Math.random() * VOICE_STARTERS.length)];
      
      // Insert after opening tag if present
      if (para.startsWith('<p>')) {
        return `<p>${marker} ${para.slice(3)}`;
      }
      return `${marker} ${para}`;
    }
    
    return para;
  }).join('\n\n');
}

/**
 * STEP F: Add Rhetorical Questions
 * Increases engagement and human feel
 */
export function addRhetoricalQuestions(content, frequency = 0.08) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip headings, lists, short paragraphs
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<li') ||
        para.startsWith('<div') || para.length < 150) {
      return para;
    }
    
    // Don't add to first paragraph
    if (index === 0) return para;
    
    // Randomly add rhetorical question
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
 * STEP G: Add Hedging Phrases
 * Reduces AI's overconfident tone
 */
export function addHedging(content, frequency = 0.06) {
  const sentences = content.split(/(?<=[.!?])\s+/);
  
  return sentences.map((sentence) => {
    // Skip short sentences, questions, and sentences with existing hedging
    if (sentence.length < 60 || sentence.includes('?') ||
        HEDGING_PHRASES.some(h => sentence.toLowerCase().includes(h))) {
      return sentence;
    }
    
    // Randomly add hedging
    if (Math.random() < frequency) {
      const hedge = HEDGING_PHRASES[Math.floor(Math.random() * HEDGING_PHRASES.length)];
      
      // Insert hedge after first few words
      const words = sentence.split(' ');
      if (words.length > 6) {
        const insertPoint = Math.floor(Math.random() * 3) + 2;
        words.splice(insertPoint, 0, hedge);
        return words.join(' ');
      }
    }
    
    return sentence;
  }).join(' ');
}

/**
 * STEP H: Fix AI Conclusion Patterns
 * Removes "In conclusion" and similar AI markers
 */
export function fixConclusions(content) {
  let text = content;
  
  // Replace AI conclusion headings
  const conclusionReplacements = {
    'In Conclusion': 'Parting Thoughts',
    'Conclusion': 'Where This Leaves You',
    'To Summarize': 'Final Words',
    'Summary': 'The Bottom Line',
    'Final Thoughts': 'Parting Words',
    'Wrapping Up': 'Before You Go',
    'Key Takeaways': 'What Matters Most',
    'Takeaways': 'What Sticks',
    'To Wrap Up': 'One Last Thing'
  };
  
  for (const [ai, human] of Object.entries(conclusionReplacements)) {
    const regex = new RegExp(`<h2[^>]*>${ai}</h2>`, 'gi');
    text = text.replace(regex, `<h2 id="final-words">${human}</h2>`);
  }
  
  // Remove inline conclusion phrases
  const inlinePhrases = [
    'In conclusion,', 'To conclude,', 'To summarize,', 'In summary,',
    'To sum up,', 'All in all,', 'In the final analysis,',
    'When all is said and done,', 'At the end of the day,',
    'To wrap things up,', 'In closing,', 'To bring this to a close,'
  ];
  
  for (const phrase of inlinePhrases) {
    const regex = new RegExp(phrase, 'gi');
    text = text.replace(regex, '');
  }
  
  return text;
}


/**
 * STEP I: Add Punctuation Friction
 * Em-dashes and ellipses for conversational flow
 */
export function addPunctuationFriction(content) {
  let text = content;
  
  // Add em-dashes for parenthetical remarks (sparingly)
  text = text.replace(/, which (is|was|are|were) ([^,]+),/gi, (match, verb, content) => {
    if (Math.random() < 0.25) {
      return `—which ${verb} ${content}—`;
    }
    return match;
  });
  
  // Add ellipses for trailing thoughts (very sparingly)
  const sentences = text.split(/(?<=[.!])\s+/);
  text = sentences.map((sentence) => {
    if (Math.random() < 0.03 && sentence.length > 60 && 
        !sentence.includes('...') && !sentence.includes('?') &&
        sentence.endsWith('.')) {
      return sentence.slice(0, -1) + '...';
    }
    return sentence;
  }).join(' ');
  
  return text;
}

/**
 * STEP J: Improve Burstiness (Sentence Length Variation)
 * Human writing has high variance in sentence length
 */
export function improveBurstiness(content) {
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map(para => {
    // Skip non-paragraph content
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<div') || 
        para.length < 100) {
      return para;
    }
    
    const sentences = para.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 3) return para;
    
    // Calculate sentence lengths
    const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
    
    // Find consecutive sentences with similar length and vary them
    const modified = sentences.map((sentence, i) => {
      if (i === 0) return sentence;
      
      const prevLen = lengths[i - 1];
      const currLen = lengths[i];
      
      // If lengths are too similar (within 5 words), try to vary
      if (Math.abs(prevLen - currLen) < 5 && prevLen > 15 && currLen > 15) {
        const words = sentence.trim().split(' ');
        if (words.length > 12) {
          // Create a fragment from first part
          const breakPoint = Math.min(7, Math.floor(words.length / 3));
          const fragment = words.slice(0, breakPoint).join(' ');
          const rest = words.slice(breakPoint).join(' ');
          
          // Only if it makes grammatical sense
          if (fragment.length > 15 && rest.length > 25) {
            return `${fragment}. ${rest.charAt(0).toUpperCase()}${rest.slice(1)}`;
          }
        }
      }
      
      return sentence;
    });
    
    return modified.join(' ');
  }).join('\n\n');
}

/**
 * Calculate burstiness score (for analysis)
 */
export function analyzeBurstiness(content) {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  
  if (lengths.length < 2) return { score: 0, isHumanLike: false };
  
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100; // Coefficient of variation
  
  return {
    score: cv,
    mean,
    stdDev,
    variance,
    isHumanLike: cv > 40 // Human writing typically has CV > 40%
  };
}


// ═══════════════════════════════════════════════════════════════
// MASTER CHAOS ENGINE - MULTI-PASS HUMANIZATION
// ═══════════════════════════════════════════════════════════════

/**
 * Advanced Humanization with Chaos Engine
 * Takes 2-4 minutes per article for thorough processing
 * 
 * @param {string} content - The AI-generated content
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Humanized content with analysis
 */
export async function advancedHumanize(content, options = {}) {
  const {
    passes = 3,           // Number of humanization passes
    delayBetweenPasses = 15000, // 15 seconds between passes
    voiceFrequency = 0.12,
    hedgeFrequency = 0.06,
    questionFrequency = 0.08,
    verbose = true
  } = options;
  
  const startTime = Date.now();
  let result = content;
  const logs = [];
  
  const log = (msg) => {
    if (verbose) console.log(`[ChaosEngine] ${msg}`);
    logs.push({ time: Date.now() - startTime, message: msg });
  };
  
  log('Starting multi-pass humanization...');
  
  // ═══════════════════════════════════════════════════════════════
  // PASS 1: Core Vocabulary & Structure Cleanup
  // ═══════════════════════════════════════════════════════════════
  log('Pass 1: Core vocabulary replacement...');
  
  // Step 1A: Randomized word replacement
  result = randomizedWordReplacement(result);
  log('  - Randomized AI vocabulary replacement complete');
  
  // Step 1B: Apply contractions
  result = applyContractions(result);
  log('  - Contractions applied');
  
  // Step 1C: Fix Rule of Three
  result = fixRuleOfThree(result);
  log('  - Rule of Three patterns fixed');
  
  // Step 1D: Fix conclusions
  result = fixConclusions(result);
  log('  - AI conclusion patterns removed');
  
  // Delay between passes (simulates human editing time)
  if (passes > 1) {
    log(`Waiting ${delayBetweenPasses/1000}s before next pass...`);
    await delay(delayBetweenPasses);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PASS 2: Voice & Personality Injection
  // ═══════════════════════════════════════════════════════════════
  if (passes >= 2) {
    log('Pass 2: Voice and personality injection...');
    
    // Step 2A: Symmetry breaking (brain jumps)
    result = symmetryBreaking(result);
    log('  - Symmetry breaking (brain jumps) injected');
    
    // Step 2B: Human voice markers
    result = injectHumanVoice(result, voiceFrequency);
    log('  - Human voice markers added');
    
    // Step 2C: Rhetorical questions
    result = addRhetoricalQuestions(result, questionFrequency);
    log('  - Rhetorical questions inserted');
    
    // Step 2D: Hedging phrases
    result = addHedging(result, hedgeFrequency);
    log('  - Hedging phrases added');
    
    if (passes > 2) {
      log(`Waiting ${delayBetweenPasses/1000}s before next pass...`);
      await delay(delayBetweenPasses);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // PASS 3: Flow & Rhythm Optimization
  // ═══════════════════════════════════════════════════════════════
  if (passes >= 3) {
    log('Pass 3: Flow and rhythm optimization...');
    
    // Step 3A: Punctuation friction
    result = addPunctuationFriction(result);
    log('  - Punctuation friction added');
    
    // Step 3B: Burstiness improvement
    result = improveBurstiness(result);
    log('  - Sentence length variation improved');
    
    // Step 3C: Second pass of randomized replacement (catch any remaining)
    result = randomizedWordReplacement(result);
    log('  - Final vocabulary cleanup');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FINAL CLEANUP
  // ═══════════════════════════════════════════════════════════════
  log('Final cleanup...');
  
  // Clean up whitespace
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s+\./g, '.');
  result = result.replace(/\s+,/g, ',');
  result = result.replace(/\.\s*\./g, '.');
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  result = result.trim();
  
  // Analyze final burstiness
  const burstiness = analyzeBurstiness(result);
  
  const totalTime = Date.now() - startTime;
  log(`Humanization complete in ${(totalTime/1000).toFixed(1)}s`);
  log(`Burstiness score: ${burstiness.score.toFixed(1)}% (${burstiness.isHumanLike ? 'HUMAN-LIKE' : 'needs improvement'})`);
  
  return {
    content: result,
    processingTime: totalTime,
    passes,
    burstiness,
    logs
  };
}

/**
 * Helper: Delay function
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ═══════════════════════════════════════════════════════════════
// THE "HUMAN SIGNATURE" MEGA-PROMPT GENERATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Generate the ultimate human-like content prompt
 * Based on the 2026 Blueprint for 100% human detection bypass
 */
export function generateHumanSignaturePrompt(config) {
  const {
    topic,
    keywords = topic,
    targetAudience = 'professional peers',
    tone = 'conversational',
    minWords = 5000,
    headings = [],
    references = '',
    eeat = '',
    persona = 'journalist'
  } = config;

  const pastDate = generatePastDate();
  const sensoryDetail = generateSensoryDetail();
  
  // Build headings section
  const headingsList = headings.length > 0 
    ? headings.map((h, i) => `${i + 1}. ${h}`).join('\n')
    : `Create 8-12 detailed section headings appropriate for "${topic}". Make them specific, actionable, and avoid generic titles.`;

  return `ACT AS: A senior industry analyst and investigative journalist with 20+ years of field experience.

TONE: Conversational, slightly opinionated, and highly specific. You're skeptical, blunt, and have a profound distaste for corporate jargon.

═══════════════════════════════════════════════════════════════
STRICT WRITING RULES (NON-NEGOTIABLE)
═══════════════════════════════════════════════════════════════

1. THE "STAT & FACT" RULE:
   - Include at least one specific statistic (e.g., "60% of users", "37% improvement")
   - Mention 2-3 real-world brands, tools, or companies naturally
   - Reference specific dates: "Back in ${pastDate}..."

2. STRUCTURAL CHAOS:
   - Do NOT use a predictable rhythm
   - Mix short, punchy sentences (under 5 words) with longer, descriptive ones (35-50 words)
   - Use fragments for emphasis: "Not exactly a shocker."
   - NEVER let 3+ consecutive sentences have similar length

3. FORBIDDEN TRANSITIONS (NEVER USE):
   - In conclusion, Moreover, Furthermore, Additionally, Notably, In summary
   - Subsequently, Nevertheless, Consequently, Hence, Thus
   - It is important to note, It goes without saying, Needless to say
   
   USE INSTEAD:
   - But here's the thing, Plus, Honestly, To be fair, The bottom line is
   - Look, Here's what nobody tells you, Real talk, I mean

4. NO AI VOCABULARY (STRICTLY AVOID):
   - delve, realm, tapestry, landscape, pivotal, vibrant, bustling
   - bespoke, meticulously, comprehensive, robust, seamless
   - leverage, utilize, implement, facilitate, optimize
   - cutting-edge, game-changer, revolutionary, transformative
   - paramount, plethora, myriad, endeavor, ascertain, commence

5. DIRECT ADDRESS:
   - Use "I," "We," and "You" throughout
   - Talk to the reader like you're sitting across from them at a coffee shop
   - Share opinions: "I think...", "In my experience...", "My take:"

6. HUMAN IMPERFECTION:
   - Use sentence fragments occasionally for emphasis
   - Include hedging: "probably", "might", "seems like", "from what I've seen"
   - Show uncertainty: "I could be wrong, but", "your mileage may vary"

7. CONTRACTIONS (MANDATORY):
   - Always use: don't, it's, can't, won't, you're, they're, I've, I'd, we're, that's
   - NEVER use: do not, it is, cannot, will not, you are, they are

8. NO RULE OF THREE:
   - NEVER list exactly 3 items (AI loves this pattern)
   - Always list 2, 4, 5, or 7 items instead

═══════════════════════════════════════════════════════════════
CONTENT REQUIREMENTS
═══════════════════════════════════════════════════════════════

TOPIC: ${topic}
TARGET KEYWORD: ${keywords}
WORD COUNT: ${minWords}+ words (this is a DEEP DIVE article)
TARGET AUDIENCE: ${targetAudience}
TONE: ${tone} with journalistic skepticism

STRUCTURE & HEADINGS:
${headingsList}

Format headings as:
- Main sections: <h2 id="section-N">Heading Text</h2>
- Sub-sections: <h3>Sub-heading Text</h3>

After the opening paragraph, include a Table of Contents:
<div class="toc">
<h3>What's Inside</h3>
<ul>
<li><a href="#section-1">First Heading</a></li>
...continue for all sections...
</ul>
</div>

═══════════════════════════════════════════════════════════════
E-E-A-T AUTHORITY SIGNALS (CRITICAL)
═══════════════════════════════════════════════════════════════

${eeat || `You MUST inject specific, niche "anecdotal data" into every major section:

1. SPECIFIC DATES: "Back in ${pastDate}...", "Last November...", "During Q3 2024..."
2. SENSORY DETAILS: "${sensoryDetail}"
3. NAMED TOOLS/COMPANIES: Reference real tools, real companies, real products
4. QUANTIFIED RESULTS: "37% improvement" not "significant improvement"
5. PERSONAL FAILURES: "I made this mistake. Cost me X."
6. CONTRARIAN TAKES: "Most experts say X. They're missing Y."`}

═══════════════════════════════════════════════════════════════
REFERENCE MATERIAL
═══════════════════════════════════════════════════════════════

${references || 'Draw from your expertise. Cite specific studies, tools, or industry reports where relevant.'}

═══════════════════════════════════════════════════════════════
SECTION STRUCTURE (EACH H2 MUST FOLLOW THIS)
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

═══════════════════════════════════════════════════════════════
ENDING REQUIREMENTS (NO AI CONCLUSIONS)
═══════════════════════════════════════════════════════════════

FORBIDDEN endings:
- "In conclusion...", "To summarize...", "In summary..."
- "To wrap up...", "Key takeaways...", "I hope this helps"
- Any bullet point summaries

ALLOWED endings:
- "Parting Thoughts", "Final Words", "Where This Leaves You"
- "Before You Go", "One Last Thing"

End with:
- A personal reflection
- One piece of hard-won advice
- A provocative question
- A call to action that feels genuine, not salesy

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
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

═══════════════════════════════════════════════════════════════
BEGIN WRITING NOW
═══════════════════════════════════════════════════════════════

Write a ${minWords}+ word article about "${topic}".

Start with an engaging opening paragraph that hooks the reader immediately.
No "Here is..." or any meta-commentary.
Just begin as if you're a seasoned journalist sharing hard-won knowledge.

Your first sentence should be punchy, direct, and make the reader want to continue.

GO.`;
}


// ═══════════════════════════════════════════════════════════════
// FULL CONTENT GENERATION PIPELINE
// ═══════════════════════════════════════════════════════════════

/**
 * Generate 100% Human Content - Full Pipeline
 * Takes 2-4 minutes for thorough processing
 * 
 * @param {object} config - Content configuration
 * @param {function} aiGenerator - AI content generation function
 * @returns {Promise<object>} - Generated and humanized content
 */
export async function generateHumanContent(config, aiGenerator) {
  const startTime = Date.now();
  const logs = [];
  
  const log = (msg) => {
    console.log(`[HumanContent] ${msg}`);
    logs.push({ time: Date.now() - startTime, message: msg });
  };
  
  log('Starting human content generation pipeline...');
  log(`Target: ${config.topic}`);
  log(`Word count: ${config.minWords || 5000}+ words`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: Generate Mega-Prompt (5-10 seconds)
  // ═══════════════════════════════════════════════════════════════
  log('Phase 1: Generating Human Signature mega-prompt...');
  const prompt = generateHumanSignaturePrompt(config);
  log(`  - Prompt generated (${prompt.length} characters)`);
  
  // Small delay to simulate human thinking
  await delay(3000);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: AI Content Generation (30-60 seconds)
  // ═══════════════════════════════════════════════════════════════
  log('Phase 2: Generating raw content with AI...');
  
  let rawContent;
  try {
    rawContent = await aiGenerator(prompt);
    log(`  - Raw content generated (${countWords(rawContent)} words)`);
  } catch (error) {
    log(`  - AI generation failed: ${error.message}`);
    throw error;
  }
  
  // Delay to simulate review time
  await delay(5000);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Multi-Pass Humanization (60-120 seconds)
  // ═══════════════════════════════════════════════════════════════
  log('Phase 3: Multi-pass humanization with Chaos Engine...');
  
  const humanizeResult = await advancedHumanize(rawContent, {
    passes: 3,
    delayBetweenPasses: 20000, // 20 seconds between passes
    voiceFrequency: 0.12,
    hedgeFrequency: 0.06,
    questionFrequency: 0.08,
    verbose: true
  });
  
  log(`  - Humanization complete`);
  log(`  - Burstiness: ${humanizeResult.burstiness.score.toFixed(1)}%`);
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Final Quality Check (10-15 seconds)
  // ═══════════════════════════════════════════════════════════════
  log('Phase 4: Final quality check...');
  await delay(5000);
  
  // Count final words
  const finalWordCount = countWords(humanizeResult.content);
  
  // Analyze AI risk
  const aiRisk = analyzeAIRisk(humanizeResult.content);
  
  const totalTime = Date.now() - startTime;
  
  log('═══════════════════════════════════════════════════════════════');
  log(`GENERATION COMPLETE`);
  log(`  - Total time: ${(totalTime/1000/60).toFixed(1)} minutes`);
  log(`  - Word count: ${finalWordCount}`);
  log(`  - Human score: ${aiRisk.score}/100`);
  log(`  - Risk level: ${aiRisk.riskLevel}`);
  log(`  - Burstiness: ${humanizeResult.burstiness.score.toFixed(1)}%`);
  log('═══════════════════════════════════════════════════════════════');
  
  return {
    content: humanizeResult.content,
    wordCount: finalWordCount,
    processingTime: totalTime,
    processingMinutes: (totalTime/1000/60).toFixed(1),
    humanScore: aiRisk.score,
    riskLevel: aiRisk.riskLevel,
    burstiness: humanizeResult.burstiness,
    issues: aiRisk.issues,
    recommendations: aiRisk.recommendations,
    logs
  };
}

/**
 * Count words in content
 */
function countWords(content) {
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  return textOnly.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Analyze content for AI detection risk
 */
export function analyzeAIRisk(content) {
  const results = {
    score: 100,
    issues: [],
    recommendations: []
  };
  
  // Check for forbidden words
  let forbiddenCount = 0;
  const forbiddenWords = Object.keys(HUMAN_SYNONYMS);
  
  for (const word of forbiddenWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      forbiddenCount += matches.length;
    }
  }
  
  if (forbiddenCount > 0) {
    results.score -= Math.min(30, forbiddenCount * 2);
    results.issues.push(`Found ${forbiddenCount} AI vocabulary markers`);
    results.recommendations.push('Run additional humanization pass');
  }
  
  // Check burstiness
  const burstiness = analyzeBurstiness(content);
  if (!burstiness.isHumanLike) {
    results.score -= 15;
    results.issues.push(`Low burstiness (CV: ${burstiness.score.toFixed(1)}%, need >40%)`);
    results.recommendations.push('Vary sentence lengths more');
  }
  
  // Check for Rule of Three
  const threeMatches = content.match(/(\b\w+),\s+(\b\w+),\s+and\s+(\b\w+)\b/gi);
  if (threeMatches && threeMatches.length > 3) {
    results.score -= 10;
    results.issues.push(`Found ${threeMatches.length} "Rule of Three" patterns`);
    results.recommendations.push('Use 2 or 4 items in lists');
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
      results.recommendations.push('Replace formal conclusions');
      break;
    }
  }
  
  // Determine risk level
  if (results.score >= 85) {
    results.riskLevel = 'LOW';
    results.riskColor = 'green';
  } else if (results.score >= 70) {
    results.riskLevel = 'MEDIUM';
    results.riskColor = 'yellow';
  } else {
    results.riskLevel = 'HIGH';
    results.riskColor = 'red';
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  // Core functions
  advancedHumanize,
  generateHumanContent,
  generateHumanSignaturePrompt,
  analyzeAIRisk,
  analyzeBurstiness,
  
  // Individual transformation functions
  randomizedWordReplacement,
  symmetryBreaking,
  applyContractions,
  fixRuleOfThree,
  injectHumanVoice,
  addRhetoricalQuestions,
  addHedging,
  fixConclusions,
  addPunctuationFriction,
  improveBurstiness,
  
  // Utilities
  generatePastDate,
  generateSensoryDetail,
  
  // Data exports
  HUMAN_SYNONYMS,
  INTERJECTIONS,
  VOICE_STARTERS,
  RHETORICAL_QUESTIONS,
  HEDGING_PHRASES,
  CONTRACTION_MAP,
  SENSORY_DETAILS
};
