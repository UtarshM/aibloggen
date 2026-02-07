/**
 * Real SEO Analysis Engine
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function analyzeWebsite(url, targetKeyword = '') {
  try {
    // Fetch the actual website
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract SEO elements
    const title = $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((i, el) => $(el).text()).get();
    const h2Tags = $('h2').length;
    const images = $('img').length;
    const imagesWithoutAlt = $('img:not([alt])').length;
    const links = $('a').length;
    const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
    const externalLinks = links - internalLinks;
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').length;
    
    // Calculate keyword density if keyword provided
    let keywordDensity = 0;
    if (targetKeyword) {
      const keywordCount = (bodyText.toLowerCase().match(new RegExp(targetKeyword.toLowerCase(), 'g')) || []).length;
      keywordDensity = ((keywordCount / wordCount) * 100).toFixed(2);
    }

    // Analyze and score
    const issues = [];
    let score = 100;

    // Title analysis
    if (!title) {
      issues.push({ type: 'error', text: 'Missing page title - Critical for SEO' });
      score -= 15;
    } else if (title.length < 30) {
      issues.push({ type: 'warning', text: `Title is too short (${title.length} chars) - Recommended: 50-60 characters` });
      score -= 5;
    } else if (title.length > 60) {
      issues.push({ type: 'warning', text: `Title is too long (${title.length} chars) - May be truncated in search results` });
      score -= 3;
    } else {
      issues.push({ type: 'success', text: `Title length is optimal (${title.length} characters)` });
    }

    // Meta description analysis
    if (!metaDescription) {
      issues.push({ type: 'error', text: 'Missing meta description - Important for click-through rates' });
      score -= 10;
    } else if (metaDescription.length < 120) {
      issues.push({ type: 'warning', text: `Meta description is too short (${metaDescription.length} chars) - Recommended: 150-160 characters` });
      score -= 5;
    } else if (metaDescription.length > 160) {
      issues.push({ type: 'warning', text: `Meta description is too long (${metaDescription.length} chars) - May be truncated` });
      score -= 3;
    } else {
      issues.push({ type: 'success', text: `Meta description length is optimal (${metaDescription.length} characters)` });
    }

    // H1 analysis
    if (h1Tags.length === 0) {
      issues.push({ type: 'error', text: 'Missing H1 tag - Essential for page structure and SEO' });
      score -= 10;
    } else if (h1Tags.length > 1) {
      issues.push({ type: 'warning', text: `Multiple H1 tags found (${h1Tags.length}) - Best practice is one H1 per page` });
      score -= 5;
    } else {
      issues.push({ type: 'success', text: 'Single H1 tag found - Good practice' });
    }

    // Heading structure
    if (h2Tags === 0) {
      issues.push({ type: 'warning', text: 'No H2 tags found - Use headings to structure content' });
      score -= 3;
    } else {
      issues.push({ type: 'success', text: `${h2Tags} H2 tags found - Good content structure` });
    }

    // Image optimization
    if (imagesWithoutAlt > 0) {
      issues.push({ type: 'warning', text: `${imagesWithoutAlt} images missing alt text - Important for accessibility and SEO` });
      score -= Math.min(imagesWithoutAlt * 2, 10);
    } else if (images > 0) {
      issues.push({ type: 'success', text: `All ${images} images have alt text - Excellent!` });
    }

    // Content length
    if (wordCount < 300) {
      issues.push({ type: 'warning', text: `Content is thin (${wordCount} words) - Aim for at least 300 words` });
      score -= 5;
    } else if (wordCount > 1000) {
      issues.push({ type: 'success', text: `Comprehensive content (${wordCount} words) - Great for SEO` });
    } else {
      issues.push({ type: 'success', text: `Good content length (${wordCount} words)` });
    }

    // Keyword optimization
    if (targetKeyword) {
      if (keywordDensity < 0.5) {
        issues.push({ type: 'warning', text: `Low keyword density (${keywordDensity}%) for "${targetKeyword}" - Consider adding more mentions` });
        score -= 5;
      } else if (keywordDensity > 3) {
        issues.push({ type: 'warning', text: `High keyword density (${keywordDensity}%) for "${targetKeyword}" - May appear as keyword stuffing` });
        score -= 5;
      } else {
        issues.push({ type: 'success', text: `Optimal keyword density (${keywordDensity}%) for "${targetKeyword}"` });
      }
    }

    // Internal linking
    if (internalLinks < 3) {
      issues.push({ type: 'warning', text: `Few internal links (${internalLinks}) - Add more to improve site structure` });
      score -= 3;
    } else {
      issues.push({ type: 'success', text: `Good internal linking (${internalLinks} links)` });
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.min(100, score));

    // Generate recommendations
    const recommendations = [];
    if (score < 80) {
      if (!title || title.length < 30) recommendations.push('Optimize page title with target keywords (50-60 characters)');
      if (!metaDescription || metaDescription.length < 120) recommendations.push('Write compelling meta description (150-160 characters)');
      if (h1Tags.length === 0) recommendations.push('Add a clear H1 heading with your main keyword');
      if (imagesWithoutAlt > 0) recommendations.push('Add descriptive alt text to all images');
      if (wordCount < 300) recommendations.push('Expand content to at least 300-500 words');
      if (internalLinks < 3) recommendations.push('Add more internal links to related pages');
      if (targetKeyword && keywordDensity < 0.5) recommendations.push(`Increase mentions of "${targetKeyword}" naturally in content`);
      recommendations.push('Ensure mobile responsiveness and fast page load speed');
      recommendations.push('Add schema markup for rich snippets');
      recommendations.push('Optimize images for web (compress and use modern formats)');
    }

    return {
      score: Math.round(score),
      issues,
      recommendations,
      details: {
        title,
        titleLength: title.length,
        metaDescription,
        metaDescriptionLength: metaDescription.length,
        h1Count: h1Tags.length,
        h2Count: h2Tags,
        wordCount,
        imageCount: images,
        imagesWithoutAlt,
        internalLinks,
        externalLinks,
        keywordDensity: targetKeyword ? keywordDensity : null
      }
    };

  } catch (error) {
    console.error('SEO Analysis Error:', error.message);
    
    // Return fallback analysis
    return {
      score: 50,
      issues: [
        { type: 'error', text: 'Unable to fetch website - Please check the URL' },
        { type: 'warning', text: 'Analysis performed with limited data' }
      ],
      recommendations: [
        'Ensure the website is publicly accessible',
        'Check for any firewall or security restrictions',
        'Verify the URL is correct and includes http:// or https://'
      ],
      details: {
        error: error.message
      }
    };
  }
}

/* Copyright © 2025 HARSH J KUHIKAR */


// Technical SEO Analysis
export async function checkTechnicalSEO(url) {
  const results = {
    https: url.startsWith('https://'),
    hasRobotsTxt: false,
    hasSitemap: false,
    hasViewport: false,
    hasCanonical: false,
    hasOpenGraph: false,
    hasTwitterCard: false,
    hasStructuredData: false,
    pageLoadTime: 0,
    score: 0
  };

  try {
    const startTime = Date.now();
    
    // Fetch main page
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    results.pageLoadTime = Date.now() - startTime;
    const $ = cheerio.load(response.data);
    
    // Check viewport
    results.hasViewport = $('meta[name="viewport"]').length > 0;
    
    // Check canonical
    results.hasCanonical = $('link[rel="canonical"]').length > 0;
    
    // Check Open Graph
    results.hasOpenGraph = $('meta[property^="og:"]').length > 0;
    
    // Check Twitter Card
    results.hasTwitterCard = $('meta[name^="twitter:"]').length > 0;
    
    // Check structured data
    results.hasStructuredData = $('script[type="application/ld+json"]').length > 0;
    
    // Check robots.txt
    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      await axios.get(robotsUrl, { timeout: 5000 });
      results.hasRobotsTxt = true;
    } catch {}
    
    // Check sitemap
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).href;
      await axios.get(sitemapUrl, { timeout: 5000 });
      results.hasSitemap = true;
    } catch {}
    
    // Calculate score
    let score = 0;
    if (results.https) score += 15;
    if (results.hasRobotsTxt) score += 10;
    if (results.hasSitemap) score += 10;
    if (results.hasViewport) score += 15;
    if (results.hasCanonical) score += 10;
    if (results.hasOpenGraph) score += 10;
    if (results.hasTwitterCard) score += 10;
    if (results.hasStructuredData) score += 10;
    if (results.pageLoadTime < 2000) score += 10;
    else if (results.pageLoadTime < 4000) score += 5;
    
    results.score = score;
    
    return results;
    
  } catch (error) {
    console.error('Technical SEO Check Error:', error.message);
    return {
      ...results,
      error: error.message,
      score: results.https ? 15 : 0
    };
  }
}

// Competitor Comparison
export async function compareWithCompetitor(yourUrl, competitorUrl, keyword = '') {
  try {
    const [yourAnalysis, competitorAnalysis] = await Promise.all([
      analyzeWebsite(yourUrl, keyword),
      analyzeWebsite(competitorUrl, keyword)
    ]);
    
    const comparison = {
      seoScore: {
        yours: yourAnalysis.score,
        competitor: competitorAnalysis.score,
        winner: yourAnalysis.score > competitorAnalysis.score ? 'yours' : 'competitor',
        difference: yourAnalysis.score - competitorAnalysis.score
      },
      wordCount: {
        yours: yourAnalysis.details.wordCount,
        competitor: competitorAnalysis.details.wordCount,
        winner: yourAnalysis.details.wordCount > competitorAnalysis.details.wordCount ? 'yours' : 'competitor'
      },
      internalLinks: {
        yours: yourAnalysis.details.internalLinks,
        competitor: competitorAnalysis.details.internalLinks,
        winner: yourAnalysis.details.internalLinks > competitorAnalysis.details.internalLinks ? 'yours' : 'competitor'
      },
      images: {
        yours: yourAnalysis.details.imageCount,
        competitor: competitorAnalysis.details.imageCount
      }
    };
    
    if (keyword) {
      comparison.keywordDensity = {
        yours: yourAnalysis.details.keywordDensity,
        competitor: competitorAnalysis.details.keywordDensity
      };
    }
    
    // Generate recommendations
    const recommendations = [];
    if (comparison.seoScore.difference < 0) {
      recommendations.push(`Competitor has a higher SEO score by ${Math.abs(comparison.seoScore.difference)} points`);
    }
    if (comparison.wordCount.winner === 'competitor') {
      recommendations.push(`Add more content - competitor has ${competitorAnalysis.details.wordCount - yourAnalysis.details.wordCount} more words`);
    }
    if (comparison.internalLinks.winner === 'competitor') {
      recommendations.push(`Improve internal linking - competitor has ${competitorAnalysis.details.internalLinks - yourAnalysis.details.internalLinks} more internal links`);
    }
    if (yourAnalysis.details.imagesWithoutAlt > competitorAnalysis.details.imagesWithoutAlt) {
      recommendations.push('Optimize image alt tags - competitor has better image optimization');
    }
    
    return {
      comparison,
      recommendations,
      yourAnalysis,
      competitorAnalysis
    };
    
  } catch (error) {
    console.error('Competitor Analysis Error:', error.message);
    throw error;
  }
}

/* Copyright © 2025 HARSH J KUHIKAR */
