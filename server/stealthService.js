/**
 * StealthGPT Integration Service - AI Detection Bypass
 * 
 * Uses StealthGPT API to humanize AI-generated content and bypass
 * AI detectors like Originality.ai, GPTZero, Turnitin, etc.
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import axios from 'axios';

// StealthGPT API Configuration
const STEALTHGPT_API_URL = 'https://stealthgpt.ai/api/stealthify';
const STEALTHGPT_ARTICLES_URL = 'https://stealthgpt.ai/api/stealthify/articles';

/**
 * Humanize/Rephrase content using StealthGPT API
 * This is the PRIMARY method to bypass AI detection
 * 
 * @param {string} text - The AI-generated text to humanize
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Humanized content with detection score
 */
export async function humanizeWithStealth(text, options = {}) {
  const apiToken = process.env.STEALTHGPT_API_KEY;
  
  if (!apiToken) {
    console.log('[StealthGPT] API key not configured, skipping humanization');
    return { success: false, error: 'StealthGPT API key not configured', content: text };
  }

  const {
    tone = 'Standard',      // Standard, HighSchool, College, PhD
    mode = 'High',          // High, Medium, Low (detail level)
    business = true,        // Use business mode (10x more powerful)
    isMultilingual = true   // Keep original language
  } = options;

  try {
    console.log('[StealthGPT] Humanizing content, length:', text.length);
    
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
      timeout: 120000 // 2 minute timeout for long content
    });

    if (response.data && response.data.result) {
      console.log('[StealthGPT] Success! Detection likelihood:', response.data.howLikelyToBeDetected);
      console.log('[StealthGPT] Words spent:', response.data.wordsSpent);
      console.log('[StealthGPT] Remaining credits:', response.data.remainingCredits);
      
      return {
        success: true,
        content: response.data.result,
        detectionScore: response.data.howLikelyToBeDetected || 0,
        wordsUsed: response.data.wordsSpent || 0,
        creditsRemaining: response.data.remainingCredits || 0
      };
    }
    
    return { success: false, error: 'No result from StealthGPT', content: text };
  } catch (error) {
    console.error('[StealthGPT] Error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      content: text 
    };
  }
}

/**
 * Generate a complete undetectable article using StealthGPT
 * 
 * @param {string} topic - The topic for the article
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Generated article with images
 */
export async function generateStealthArticle(topic, options = {}) {
  const apiToken = process.env.STEALTHGPT_API_KEY;
  
  if (!apiToken) {
    console.log('[StealthGPT] API key not configured');
    return { success: false, error: 'StealthGPT API key not configured' };
  }

  const {
    withImages = true,
    size = 'long',          // small, medium, long
    isMultilingual = true
  } = options;

  try {
    console.log('[StealthGPT] Generating article for topic:', topic);
    
    const response = await axios.post(STEALTHGPT_ARTICLES_URL, {
      prompt: topic,
      withImages,
      size,
      isMultilingual
    }, {
      headers: {
        'api-token': apiToken,
        'Content-Type': 'application/json'
      },
      timeout: 180000 // 3 minute timeout for article generation
    });

    if (response.data && response.data.result) {
      console.log('[StealthGPT] Article generated successfully');
      
      return {
        success: true,
        content: response.data.result,
        wordsUsed: response.data.wordsSpent || 0,
        creditsRemaining: response.data.remainingCredits || 0
      };
    }
    
    return { success: false, error: 'No result from StealthGPT' };
  } catch (error) {
    console.error('[StealthGPT] Article generation error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}


/**
 * Humanize content in chunks for very long content
 * StealthGPT has limits, so we process in sections
 * 
 * @param {string} content - Full content to humanize
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Fully humanized content
 */
export async function humanizeLongContent(content, options = {}) {
  const apiToken = process.env.STEALTHGPT_API_KEY;
  
  if (!apiToken) {
    return { success: false, error: 'StealthGPT API key not configured', content };
  }

  // Split content into sections by H2 headings
  const sections = content.split(/(<h2[^>]*>.*?<\/h2>)/gi);
  const humanizedSections = [];
  let totalWordsUsed = 0;
  let creditsRemaining = 0;

  console.log('[StealthGPT] Processing', sections.length, 'sections');

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    // Skip empty sections or very short ones
    if (!section || section.trim().length < 50) {
      humanizedSections.push(section);
      continue;
    }

    // Skip headings (just keep them as-is)
    if (section.match(/^<h2[^>]*>.*<\/h2>$/i)) {
      humanizedSections.push(section);
      continue;
    }

    // Humanize this section
    console.log(`[StealthGPT] Processing section ${i + 1}/${sections.length}`);
    
    const result = await humanizeWithStealth(section, options);
    
    if (result.success) {
      humanizedSections.push(result.content);
      totalWordsUsed += result.wordsUsed;
      creditsRemaining = result.creditsRemaining;
    } else {
      // If humanization fails, keep original
      humanizedSections.push(section);
      console.log(`[StealthGPT] Section ${i + 1} failed, keeping original`);
    }

    // Small delay between requests to avoid rate limiting
    if (i < sections.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return {
    success: true,
    content: humanizedSections.join(''),
    totalWordsUsed,
    creditsRemaining
  };
}

/**
 * Check StealthGPT API balance
 * 
 * @returns {Promise<object>} - Balance information
 */
export async function checkStealthBalance() {
  const apiToken = process.env.STEALTHGPT_API_KEY;
  
  if (!apiToken) {
    return { success: false, error: 'StealthGPT API key not configured' };
  }

  try {
    // StealthGPT returns balance in the response of any request
    // We'll make a minimal request to check
    const response = await axios.post(STEALTHGPT_API_URL, {
      prompt: 'test',
      rephrase: true
    }, {
      headers: {
        'api-token': apiToken,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return {
      success: true,
      creditsRemaining: response.data.remainingCredits || 0
    };
  } catch (error) {
    // Even on error, we might get balance info
    if (error.response?.data?.remainingCredits !== undefined) {
      return {
        success: true,
        creditsRemaining: error.response.data.remainingCredits
      };
    }
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

export default {
  humanizeWithStealth,
  generateStealthArticle,
  humanizeLongContent,
  checkStealthBalance
};
