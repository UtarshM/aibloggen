/**
 * Undetectable.ai Integration Service - AI Detection Bypass
 * 
 * Uses Undetectable.ai API to humanize AI-generated content and bypass
 * AI detectors like Originality.ai, GPTZero, Turnitin, etc.
 * 
 * API Documentation: https://help.undetectable.ai/en/article/humanization-api-v2-p28b2n
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import axios from 'axios';

// Undetectable.ai API Configuration
const UNDETECTABLE_API_URL = 'https://humanize.undetectable.ai';

/**
 * Submit content for humanization
 * 
 * @param {string} content - The AI-generated text to humanize (min 50 chars)
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Document ID for polling
 */
export async function submitForHumanization(content, options = {}) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    console.log('[Undetectable] API key not configured');
    return { success: false, error: 'Undetectable.ai API key not configured' };
  }

  if (!content || content.length < 50) {
    return { success: false, error: 'Content must be at least 50 characters' };
  }

  const {
    readability = 'Journalist',  // High School, University, Doctorate, Journalist, Marketing
    purpose = 'Article',          // General Writing, Essay, Article, Marketing Material, Story, Cover Letter, Report, Business Material, Legal Material
    strength = 'More Human',      // Quality, Balanced, More Human
    model = 'v11sr'               // v2 (multilingual), v11 (best English), v11sr (best humanization)
  } = options;

  try {
    console.log('[Undetectable] Submitting content for humanization, length:', content.length);
    
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
      },
      timeout: 30000
    });

    if (response.data && response.data.id) {
      console.log('[Undetectable] Document submitted, ID:', response.data.id);
      return {
        success: true,
        documentId: response.data.id,
        status: response.data.status
      };
    }
    
    return { success: false, error: 'No document ID returned' };
  } catch (error) {
    console.error('[Undetectable] Submit error:', error.response?.data || error.message);
    
    if (error.response?.status === 402) {
      return { success: false, error: 'Insufficient credits. Please add more words to your Undetectable.ai account.' };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

/**
 * Retrieve humanized document
 * 
 * @param {string} documentId - The document ID from submit
 * @returns {Promise<object>} - Humanized content or status
 */
export async function retrieveDocument(documentId) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'Undetectable.ai API key not configured' };
  }

  try {
    const response = await axios.post(`${UNDETECTABLE_API_URL}/document`, {
      id: documentId
    }, {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data) {
      const doc = response.data;
      
      // Check if processing is complete (output exists)
      if (doc.output) {
        console.log('[Undetectable] Document ready, output length:', doc.output.length);
        return {
          success: true,
          ready: true,
          content: doc.output,
          originalContent: doc.input,
          readability: doc.readability,
          purpose: doc.purpose,
          createdDate: doc.createdDate
        };
      } else {
        // Still processing
        return {
          success: true,
          ready: false,
          status: 'processing'
        };
      }
    }
    
    return { success: false, error: 'No document data returned' };
  } catch (error) {
    console.error('[Undetectable] Retrieve error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

/**
 * Humanize content with polling (waits for completion)
 * 
 * @param {string} content - The AI-generated text to humanize
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Humanized content
 */
export async function humanizeWithUndetectable(content, options = {}) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    console.log('[Undetectable] API key not configured, skipping humanization');
    return { success: false, error: 'Undetectable.ai API key not configured', content };
  }

  // Submit the document
  const submitResult = await submitForHumanization(content, options);
  
  if (!submitResult.success) {
    return { success: false, error: submitResult.error, content };
  }

  const documentId = submitResult.documentId;
  const maxAttempts = options.maxAttempts || 60; // Max 5 minutes (60 * 5 seconds)
  const pollInterval = options.pollInterval || 5000; // 5 seconds

  console.log('[Undetectable] Polling for document:', documentId);

  // Poll for completion
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    
    const result = await retrieveDocument(documentId);
    
    if (!result.success) {
      console.log(`[Undetectable] Poll attempt ${attempt + 1} failed:`, result.error);
      continue;
    }
    
    if (result.ready) {
      console.log('[Undetectable] Humanization complete!');
      return {
        success: true,
        content: result.content,
        originalContent: result.originalContent,
        documentId,
        readability: result.readability,
        purpose: result.purpose
      };
    }
    
    console.log(`[Undetectable] Still processing... attempt ${attempt + 1}/${maxAttempts}`);
  }

  return { 
    success: false, 
    error: 'Humanization timed out. Document may still be processing.',
    documentId,
    content 
  };
}

/**
 * Humanize long content by splitting into chunks
 * 
 * @param {string} content - Full content to humanize
 * @param {object} options - Configuration options
 * @returns {Promise<object>} - Fully humanized content
 */
export async function humanizeLongContentUndetectable(content, options = {}) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'Undetectable.ai API key not configured', content };
  }

  // Split content into sections by H2 headings or paragraphs
  // Undetectable.ai works best with chunks of 500-2000 words
  const maxChunkSize = options.maxChunkSize || 3000; // characters
  
  // Try to split by H2 headings first
  let sections = content.split(/(<h2[^>]*>.*?<\/h2>)/gi);
  
  // If no H2 headings, split by paragraphs
  if (sections.length <= 1) {
    sections = content.split(/\n\n+/);
  }

  const humanizedSections = [];
  let currentChunk = '';
  let totalProcessed = 0;

  console.log('[Undetectable] Processing', sections.length, 'sections');

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    // Skip empty sections
    if (!section || section.trim().length < 10) {
      humanizedSections.push(section);
      continue;
    }

    // If adding this section would exceed chunk size, process current chunk first
    if (currentChunk.length + section.length > maxChunkSize && currentChunk.length >= 50) {
      console.log(`[Undetectable] Processing chunk ${totalProcessed + 1}, length: ${currentChunk.length}`);
      
      const result = await humanizeWithUndetectable(currentChunk, {
        ...options,
        maxAttempts: 30 // Shorter timeout per chunk
      });
      
      if (result.success) {
        humanizedSections.push(result.content);
        totalProcessed++;
      } else {
        // If humanization fails, keep original
        humanizedSections.push(currentChunk);
        console.log(`[Undetectable] Chunk ${totalProcessed + 1} failed, keeping original`);
      }
      
      currentChunk = section;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + section;
    }
  }

  // Process remaining chunk
  if (currentChunk.length >= 50) {
    console.log(`[Undetectable] Processing final chunk, length: ${currentChunk.length}`);
    
    const result = await humanizeWithUndetectable(currentChunk, {
      ...options,
      maxAttempts: 30
    });
    
    if (result.success) {
      humanizedSections.push(result.content);
      totalProcessed++;
    } else {
      humanizedSections.push(currentChunk);
    }
  } else if (currentChunk) {
    humanizedSections.push(currentChunk);
  }

  console.log(`[Undetectable] Processed ${totalProcessed} chunks successfully`);

  return {
    success: totalProcessed > 0,
    content: humanizedSections.join('\n\n'),
    chunksProcessed: totalProcessed,
    totalChunks: sections.length
  };
}

/**
 * Check Undetectable.ai API credits
 * 
 * @returns {Promise<object>} - Credit balance information
 */
export async function checkUndetectableCredits() {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'Undetectable.ai API key not configured' };
  }

  try {
    const response = await axios.get(`${UNDETECTABLE_API_URL}/check-user-credits`, {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data) {
      console.log('[Undetectable] Credits:', response.data);
      return {
        success: true,
        baseCredits: response.data.baseCredits || 0,
        boostCredits: response.data.boostCredits || 0,
        totalCredits: response.data.credits || 0
      };
    }
    
    return { success: false, error: 'No credit data returned' };
  } catch (error) {
    console.error('[Undetectable] Credits check error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

/**
 * Rehumanize a document (one free retry)
 * 
 * @param {string} documentId - The document ID to rehumanize
 * @returns {Promise<object>} - New document ID
 */
export async function rehumanizeDocument(documentId) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'Undetectable.ai API key not configured' };
  }

  try {
    const response = await axios.post(`${UNDETECTABLE_API_URL}/rehumanize`, {
      id: documentId
    }, {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data && response.data.id) {
      console.log('[Undetectable] Rehumanize submitted, new ID:', response.data.id);
      return {
        success: true,
        documentId: response.data.id,
        status: response.data.status
      };
    }
    
    return { success: false, error: 'No document ID returned' };
  } catch (error) {
    console.error('[Undetectable] Rehumanize error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
}

export default {
  submitForHumanization,
  retrieveDocument,
  humanizeWithUndetectable,
  humanizeLongContentUndetectable,
  checkUndetectableCredits,
  rehumanizeDocument
};
