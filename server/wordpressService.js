/**
 * WordPress Publishing Service
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Test WordPress connection
 */
export async function testWordPressConnection(siteUrl, username, applicationPassword) {
    try {
        console.log('[WordPress Service] ========== TESTING CONNECTION ==========');
        console.log('[WordPress Service] Site URL:', siteUrl);
        console.log('[WordPress Service] Username:', username);
        console.log('[WordPress Service] Password provided:', !!applicationPassword);
        console.log('[WordPress Service] Password length:', applicationPassword?.length);
        console.log('[WordPress Service] Password first 4 chars:', applicationPassword?.substring(0, 4) + '...');
        
        // Check if password has spaces (application passwords should have spaces)
        const hasSpaces = applicationPassword?.includes(' ');
        console.log('[WordPress Service] Password has spaces:', hasSpaces);
        
        const auth = Buffer.from(`${username}:${applicationPassword}`).toString('base64');
        const testUrl = `${siteUrl}/wp-json/wp/v2/users/me`;
        
        console.log('[WordPress Service] Test URL:', testUrl);
        console.log('[WordPress Service] Auth header (first 20 chars):', auth.substring(0, 20) + '...');
        
        const response = await axios.get(testUrl, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'User-Agent': 'ContentPublishingTool/1.0'
            },
            timeout: 15000,
            validateStatus: function (status) {
                return status < 500; // Don't throw on 4xx errors
            }
        });

        if (response.status === 200) {
            console.log('[WordPress Service] ✅ SUCCESS! User:', response.data.name);
            return {
                success: true,
                siteName: response.data.name,
                user: response.data
            };
        } else {
            console.log('[WordPress Service] ❌ FAILED! Status:', response.status);
            console.log('[WordPress Service] Response:', JSON.stringify(response.data));
            return {
                success: false,
                error: response.data?.message || `HTTP ${response.status}: ${response.statusText}`
            };
        }
    } catch (error) {
        console.log('[WordPress Service] ❌ EXCEPTION!');
        console.log('[WordPress Service] Error type:', error.code || error.name);
        console.log('[WordPress Service] Error message:', error.message);
        if (error.response) {
            console.log('[WordPress Service] Response status:', error.response.status);
            console.log('[WordPress Service] Response data:', JSON.stringify(error.response.data));
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}

/**
 * Check if WordPress REST API is accessible
 */
export async function checkWordPressAPI(siteUrl) {
    try {
        const response = await axios.get(`${siteUrl}/wp-json/`, {
            timeout: 10000
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Upload image to WordPress media library with retry logic
 */
export async function uploadImageToWordPress(siteUrl, username, applicationPassword, imageUrl, altText = '', retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`[WordPress] Uploading image (attempt ${attempt}/${retries}):`, imageUrl.substring(0, 80) + '...');
            
            const auth = Buffer.from(`${username}:${applicationPassword}`).toString('base64');

            // Handle Unsplash source URLs - they redirect, so follow redirects
            let finalUrl = imageUrl;
            
            // Download image first with timeout and follow redirects
            const imageResponse = await axios.get(finalUrl, {
                responseType: 'arraybuffer',
                timeout: 45000, // 45 second timeout
                maxContentLength: 15 * 1024 * 1024, // 15MB max
                maxRedirects: 5, // Follow up to 5 redirects
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
                }
            });

            const imageBuffer = Buffer.from(imageResponse.data);
            
            // Check if we got a valid image
            if (imageBuffer.length < 1000) {
                console.log(`[WordPress] Image too small (${imageBuffer.length} bytes), might be an error page`);
                throw new Error('Downloaded image is too small, might be an error page');
            }
            
            const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
            let extension = 'jpg';
            if (contentType.includes('png')) extension = 'png';
            else if (contentType.includes('webp')) extension = 'webp';
            else if (contentType.includes('gif')) extension = 'gif';
            
            const filename = `wp-image-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

            console.log(`[WordPress] Image downloaded, size: ${imageBuffer.length} bytes, type: ${contentType}`);

            // Create form data
            const formData = new FormData();
            formData.append('file', imageBuffer, {
                filename,
                contentType: contentType.split(';')[0] // Remove charset if present
            });
            if (altText) {
                formData.append('alt_text', altText);
            }

            // Upload to WordPress with timeout
            const response = await axios.post(
                `${siteUrl}/wp-json/wp/v2/media`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Basic ${auth}`
                    },
                    timeout: 90000, // 90 second timeout for upload
                    maxContentLength: 15 * 1024 * 1024
                }
            );

            console.log(`[WordPress] ✅ Image uploaded successfully! Media ID: ${response.data.id}`);

            return {
                success: true,
                mediaId: response.data.id,
                mediaUrl: response.data.source_url
            };
        } catch (error) {
            console.error(`[WordPress] ❌ Image upload failed (attempt ${attempt}/${retries}):`, error.message);
            
            if (attempt < retries) {
                console.log(`[WordPress] Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.error('[WordPress] All retry attempts failed for this image');
                // Return success: false but don't throw - let the post continue without this image
                return {
                    success: false,
                    error: error.response?.data?.message || error.message
                };
            }
        }
    }
    
    return {
        success: false,
        error: 'Failed after all retry attempts'
    };
}

/**
 * Generate SEO metadata from content
 */
function generateSEOMetadata(title, content) {
    // Generate SEO-friendly slug
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
    
    // Generate meta description (first 155 characters of content)
    const plainText = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '') // Remove markdown images
        .replace(/\n+/g, ' ')
        .trim();
    
    const metaDescription = plainText.substring(0, 155) + (plainText.length > 155 ? '...' : '');
    
    // Extract keywords from title and content
    const keywords = title
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5)
        .join(', ');
    
    return {
        slug,
        metaDescription,
        keywords
    };
}

/**
 * Convert markdown content to SEO-optimized HTML with proper structure
 */
function convertToSEOHTML(content, title) {
    let html = content;
    
    // Convert markdown headings to proper HTML headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Convert markdown images to HTML with proper alt tags and classes
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
        '<figure class="wp-block-image size-large"><img src="$2" alt="$1" class="wp-image" loading="lazy" /><figcaption>$1</figcaption></figure>');
    
    // Convert markdown bold to HTML
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Convert markdown italic to HTML
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Convert markdown links to HTML
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Convert markdown lists to HTML
    html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Convert paragraphs (double newlines) to <p> tags
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';
        // Don't wrap if already has HTML tags
        if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<figure') || para.startsWith('<p>')) {
            return para;
        }
        return `<p>${para}</p>`;
    }).join('\n\n');
    
    // Clean up extra newlines
    html = html.replace(/\n{3,}/g, '\n\n');
    
    return html;
}

/**
 * Post content to WordPress with images and SEO optimization
 * Images are automatically uploaded and embedded in the content
 */
export async function postToWordPress(siteUrl, username, applicationPassword, title, content, images = [], seoOptions = {}) {
    try {
        console.log('[WordPress] ========== STARTING POST CREATION ==========');
        console.log('[WordPress] Title:', title);
        console.log('[WordPress] Content length:', content.length);
        console.log('[WordPress] Images to upload:', images.length);
        
        const auth = Buffer.from(`${username}:${applicationPassword}`).toString('base64');

        // Generate SEO metadata
        const seoData = generateSEOMetadata(title, content);
        console.log('[WordPress] Generated SEO data:', seoData);

        // Upload ALL images first and get WordPress URLs
        const uploadedImages = [];
        console.log('[WordPress] ===== UPLOADING IMAGES =====');
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            console.log(`[WordPress] Uploading image ${i + 1}/${images.length}...`);
            
            const result = await uploadImageToWordPress(
                siteUrl, 
                username, 
                applicationPassword, 
                image.url, 
                image.alt || image.caption || title
            );
            
            if (result.success) {
                uploadedImages.push({
                    id: result.mediaId,
                    url: result.mediaUrl,
                    originalUrl: image.url,
                    alt: image.alt || image.caption || title
                });
                console.log(`[WordPress] ✅ Image ${i + 1} uploaded: ${result.mediaUrl}`);
            } else {
                console.log(`[WordPress] ❌ Image ${i + 1} failed: ${result.error}`);
            }
        }
        
        console.log(`[WordPress] ===== UPLOADED ${uploadedImages.length}/${images.length} IMAGES =====`);

        // Replace ALL image URLs in content with WordPress URLs
        let processedContent = content;
        
        for (const uploadedImage of uploadedImages) {
            // Replace the original URL with WordPress URL
            processedContent = processedContent.replace(
                new RegExp(uploadedImage.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                uploadedImage.url
            );
        }

        // Ensure content is proper HTML (not markdown)
        if (!processedContent.includes('<')) {
            // Content is markdown, convert to HTML
            processedContent = convertToSEOHTML(processedContent, title);
        }
        
        console.log('[WordPress] Content processed with embedded images');
        console.log('[WordPress] Final content length:', processedContent.length);

        // Set featured image (first uploaded image)
        const featuredMedia = uploadedImages.length > 0 ? uploadedImages[0].id : null;
        if (featuredMedia) {
            console.log('[WordPress] Featured image set:', featuredMedia);
        }

        // Create post - simplified without meta fields that might cause errors
        const postData = {
            title,
            content: processedContent,
            status: 'publish',
            slug: seoOptions.slug || seoData.slug,
            excerpt: (seoOptions.metaDescription || seoData.metaDescription || '').substring(0, 150)
        };
        
        // Only add featured_media if we have one
        if (featuredMedia) {
            postData.featured_media = featuredMedia;
        }

        console.log('[WordPress] ===== POSTING TO WORDPRESS =====');
        console.log('[WordPress] Post status: publish');
        console.log('[WordPress] Featured media:', featuredMedia || 'none');
        
        const response = await axios.post(
            `${siteUrl}/wp-json/wp/v2/posts`,
            postData,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                timeout: 90000 // 90 second timeout
            }
        );

        console.log('[WordPress] ========== ✅ POST CREATED SUCCESSFULLY ==========');
        console.log('[WordPress] Post ID:', response.data.id);
        console.log('[WordPress] Post URL:', response.data.link);
        
        return {
            success: true,
            postId: response.data.id,
            postUrl: response.data.link,
            uploadedImages: uploadedImages.length
        };
    } catch (error) {
        console.error('[WordPress] ========== ❌ POST CREATION FAILED ==========');
        console.error('[WordPress] Error type:', error.code || error.name);
        console.error('[WordPress] Error message:', error.message);
        if (error.response) {
            console.error('[WordPress] Response status:', error.response.status);
            console.error('[WordPress] Response data:', JSON.stringify(error.response.data));
        }
        
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Unknown error'
        };
    }
}

/**
 * Get WordPress posts
 */
export async function getWordPressPosts(siteUrl, username, applicationPassword, page = 1, perPage = 10) {
    try {
        const auth = Buffer.from(`${username}:${applicationPassword}`).toString('base64');

        const response = await axios.get(
            `${siteUrl}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );

        return {
            success: true,
            posts: response.data,
            total: parseInt(response.headers['x-wp-total'] || '0'),
            totalPages: parseInt(response.headers['x-wp-totalpages'] || '0')
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}
