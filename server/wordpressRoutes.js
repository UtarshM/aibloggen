/**
 * WordPress Integration Routes
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import { WordPressSite, WordPressPostQueue, BulkImportJob } from './wordpressModels.js';
import { testWordPressConnection, postToWordPress, checkWordPressAPI } from './wordpressService.js';

// NO dotenv here - env is loaded ONCE in server.js
const router = express.Router();

// Configure multer for Excel uploads
const upload = multer({
    dest: 'uploads/excel/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'));
        }
    }
});

// Get all WordPress sites for user
router.get('/sites', async (req, res) => {
    try {
        if (!global.mongoConnected) {
            console.log('[WordPress] MongoDB not connected, returning empty array');
            return res.json([]);
        }
        
        console.log('[WordPress] Fetching sites for user:', req.user.userId);
        
        // Try both string and ObjectId formats
        const sites = await WordPressSite.find({ 
            $or: [
                { userId: req.user.userId },
                { userId: req.user.userId.toString() }
            ]
        });
        
        console.log('[WordPress] Found sites:', sites.length);
        res.json(sites);
    } catch (error) {
        console.error('[WordPress] Error fetching sites:', error.message);
        res.json([]);
    }
});

// Add WordPress site
router.post('/sites', async (req, res) => {
    try {
        const { siteName, siteUrl, username, applicationPassword } = req.body;

        console.log('[WordPress] Add site request:', { siteName, siteUrl, username });

        // Validate required fields
        if (!siteName || !siteUrl || !username || !applicationPassword) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { siteName: !!siteName, siteUrl: !!siteUrl, username: !!username, applicationPassword: !!applicationPassword }
            });
        }

        // First check if WordPress REST API is accessible
        console.log('[WordPress] Checking REST API accessibility...');
        const apiCheck = await checkWordPressAPI(siteUrl);
        if (!apiCheck.success) {
            console.log('[WordPress] REST API not accessible:', apiCheck.error);
            return res.status(400).json({ 
                error: `WordPress REST API not accessible: ${apiCheck.error}. Make sure the URL is correct and the site is online.`
            });
        }
        console.log('[WordPress] REST API is accessible!');

        // Test connection first
        console.log('[WordPress] Testing connection with credentials...');
        const testResult = await testWordPressConnection(siteUrl, username, applicationPassword);

        if (!testResult.success) {
            console.log('[WordPress] Connection failed:', testResult.error);
            return res.status(400).json({ error: `Connection failed: ${testResult.error}` });
        }

        console.log('[WordPress] Connection successful!');

        // Create site - ensure userId is stored correctly
        const mongoose = await import('mongoose');
        let userIdToSave = req.user.userId;
        
        // Convert to ObjectId if it's a valid ObjectId string
        if (typeof userIdToSave === 'string' && mongoose.default.Types.ObjectId.isValid(userIdToSave)) {
            userIdToSave = new mongoose.default.Types.ObjectId(userIdToSave);
        }
        
        console.log('[WordPress] Saving site for userId:', userIdToSave);
        
        const site = new WordPressSite({
            userId: userIdToSave,
            siteName,
            siteUrl,
            username,
            applicationPassword,
            connected: true,
            lastTested: new Date()
        });

        await site.save();
        console.log('[WordPress] Site saved successfully:', site._id);

        res.json({
            success: true,
            site,
            message: 'WordPress site connected successfully!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test WordPress connection
router.post('/sites/test', async (req, res) => {
    try {
        const { siteUrl, username, applicationPassword } = req.body;

        const result = await testWordPressConnection(siteUrl, username, applicationPassword);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete WordPress site
router.delete('/sites/:siteId', async (req, res) => {
    try {
        await WordPressSite.findByIdAndDelete(req.params.siteId);
        res.json({ success: true, message: 'Site deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post single content to WordPress
router.post('/publish', async (req, res) => {
    try {
        const { siteId, title, content, images } = req.body;

        console.log('[WordPress Publish] Request received');
        console.log('[WordPress Publish] Site ID:', siteId);
        console.log('[WordPress Publish] Title:', title);
        console.log('[WordPress Publish] Content length:', content?.length || 0);
        console.log('[WordPress Publish] Images:', images?.length || 0);

        if (!siteId) {
            return res.status(400).json({ success: false, error: 'Site ID is required' });
        }

        if (!title || !content) {
            return res.status(400).json({ success: false, error: 'Title and content are required' });
        }

        // Get WordPress site
        const site = await WordPressSite.findById(siteId);
        if (!site) {
            console.log('[WordPress Publish] Site not found:', siteId);
            return res.status(404).json({ success: false, error: 'WordPress site not found' });
        }

        console.log('[WordPress Publish] Site found:', site.siteName, site.siteUrl);

        // Process images - extract URLs if they're objects
        const processedImages = (images || []).map(img => {
            if (typeof img === 'string') {
                return { url: img, alt: title };
            }
            return {
                url: img.url || img,
                alt: img.alt || img.caption || title
            };
        }).filter(img => img.url);

        console.log('[WordPress Publish] Processed images:', processedImages.length);

        // Post to WordPress
        const result = await postToWordPress(
            site.siteUrl,
            site.username,
            site.applicationPassword,
            title,
            content,
            processedImages
        );

        console.log('[WordPress Publish] Result:', JSON.stringify(result));

        if (result.success) {
            // Save to queue as published
            try {
                const queueItem = new WordPressPostQueue({
                    userId: req.user.userId,
                    wordpressSiteId: siteId,
                    title,
                    content,
                    images: processedImages,
                    status: 'published',
                    wordpressPostId: result.postId,
                    wordpressPostUrl: result.postUrl,
                    publishedAt: new Date()
                });
                await queueItem.save();
            } catch (queueError) {
                console.log('[WordPress Publish] Queue save error (non-critical):', queueError.message);
            }
        }

        res.json(result);
    } catch (error) {
        console.error('[WordPress Publish] Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Unknown error occurred' });
    }
});

// Upload Excel and create bulk import job
router.post('/bulk-import', upload.single('excel'), async (req, res) => {
    try {
        const { siteId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No Excel file uploaded' });
        }

        // Get WordPress site
        const site = await WordPressSite.findById(siteId);
        if (!site) {
            return res.status(404).json({ error: 'WordPress site not found' });
        }

        // Read Excel file
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Extract titles and full row data
        const posts = data.map(row => {
            const title = row.Title || row.title || row.TITLE;
            if (!title) return null;
            
            return {
                title,
                rowData: row // Keep full row for H-tags, keywords, references, etc.
            };
        }).filter(Boolean);

        if (posts.length === 0) {
            return res.status(400).json({ error: 'No titles found in Excel file. Make sure there is a "Title" column.' });
        }

        // Create bulk import job with original Excel data
        const job = new BulkImportJob({
            userId: req.user.userId,
            wordpressSiteId: siteId,
            fileName: file.originalname,
            totalPosts: posts.length,
            posts: posts.map(post => ({
                title: post.title,
                hTags: post.rowData['H tags'] || post.rowData['h tags'] || '',
                keywords: post.rowData['keywords'] || post.rowData['Keywords'] || '',
                references: post.rowData['refrance'] || post.rowData['reference'] || '',
                eeat: post.rowData['EEAT'] || post.rowData['eeat'] || '',
                scheduleDate: post.rowData['Date'] || post.rowData['date'] || '',
                scheduleTime: post.rowData['time'] || post.rowData['Time'] || '',
                status: 'pending'
            }))
        });

        await job.save();

        // Start processing in background
        processBulkImport(job._id, site, posts);

        res.json({
            success: true,
            jobId: job._id,
            totalPosts: posts.length,
            message: `Started processing ${posts.length} posts`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bulk import job status
router.get('/bulk-import/:jobId', async (req, res) => {
    try {
        const job = await BulkImportJob.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bulk import jobs for user
router.get('/bulk-import', async (req, res) => {
    try {
        const jobs = await BulkImportJob.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete bulk import job
router.delete('/bulk-import/:jobId', async (req, res) => {
    try {
        const job = await BulkImportJob.findOne({
            _id: req.params.jobId,
            userId: req.user.userId
        });
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        await BulkImportJob.findByIdAndDelete(req.params.jobId);
        
        res.json({ 
            success: true, 
            message: 'Bulk import job deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete single post from WordPress
router.delete('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { siteId, wordpressPostId } = req.body;

        console.log('[Delete Post] Request:', { postId, siteId, wordpressPostId });

        if (!siteId || !wordpressPostId) {
            return res.status(400).json({ error: 'Missing siteId or wordpressPostId' });
        }

        // Get WordPress site
        const site = await WordPressSite.findById(siteId);
        if (!site) {
            return res.status(404).json({ error: 'WordPress site not found' });
        }

        console.log('[Delete Post] Site found:', site.siteUrl);

        // Delete from WordPress
        const auth = Buffer.from(`${site.username}:${site.applicationPassword}`).toString('base64');
        const deleteUrl = `${site.siteUrl}/wp-json/wp/v2/posts/${wordpressPostId}?force=true`;

        console.log('[Delete Post] Deleting from:', deleteUrl);

        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('[Delete Post] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Delete Post] Error response:', errorText);
            throw new Error(`Failed to delete post from WordPress (${response.status}): ${response.statusText}`);
        }

        console.log('[Delete Post] ✅ Successfully deleted');

        res.json({
            success: true,
            message: 'Post deleted from WordPress successfully'
        });
    } catch (error) {
        console.error('[Delete Post] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete multiple posts from WordPress (bulk delete)
router.post('/posts/bulk-delete', async (req, res) => {
    try {
        const { siteId, postIds } = req.body; // postIds is array of {wordpressPostId, title}

        if (!siteId || !postIds || !Array.isArray(postIds)) {
            return res.status(400).json({ error: 'Missing siteId or postIds array' });
        }

        // Get WordPress site
        const site = await WordPressSite.findById(siteId);
        if (!site) {
            return res.status(404).json({ error: 'WordPress site not found' });
        }

        const auth = Buffer.from(`${site.username}:${site.applicationPassword}`).toString('base64');
        const results = {
            successful: 0,
            failed: 0,
            errors: []
        };

        // Delete each post
        for (const post of postIds) {
            try {
                const deleteUrl = `${site.siteUrl}/wp-json/wp/v2/posts/${post.wordpressPostId}?force=true`;
                
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    results.successful++;
                } else {
                    results.failed++;
                    results.errors.push({
                        title: post.title,
                        error: `HTTP ${response.status}: ${response.statusText}`
                    });
                }
            } catch (error) {
                results.failed++;
                results.errors.push({
                    title: post.title,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download bulk import report as JSON
router.get('/bulk-import/:jobId/report', async (req, res) => {
    try {
        const job = await BulkImportJob.findOne({
            _id: req.params.jobId,
            userId: req.user.userId
        });
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Generate report data
        const report = {
            jobId: job._id,
            fileName: job.fileName,
            status: job.status,
            totalPosts: job.totalPosts,
            successfulPosts: job.successfulPosts,
            failedPosts: job.failedPosts,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            duration: job.completedAt ? Math.round((job.completedAt - job.startedAt) / 1000) : null,
            posts: job.posts.map(post => ({
                title: post.title,
                status: post.status,
                wordpressPostUrl: post.wordpressPostUrl,
                contentLength: post.contentLength,
                imageCount: post.imageCount,
                uploadedImages: post.uploadedImages,
                publishedAt: post.publishedAt,
                error: post.error
            }))
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download bulk import report as Excel with live blog links
router.get('/bulk-import/:jobId/export-excel', async (req, res) => {
    try {
        console.log('[Excel Export] Starting export for job:', req.params.jobId);
        
        const job = await BulkImportJob.findOne({
            _id: req.params.jobId,
            userId: req.user.userId
        });
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        console.log('[Excel Export] Job found, posts count:', job.posts?.length || 0);

        // Create Excel workbook
        const workbook = xlsx.utils.book_new();

        // POSTS SHEET FIRST (Main data with all details)
        const postsData = [];
        
        if (job.posts && job.posts.length > 0) {
            for (let i = 0; i < job.posts.length; i++) {
                const post = job.posts[i];
                postsData.push({
                    'Sr No': i + 1,
                    'Title': post.title || 'Untitled',
                    'Status': post.status === 'published' ? 'Published ✅' : post.status === 'failed' ? 'Failed ❌' : 'Pending ⏳',
                    'Live Blog Link': post.wordpressPostUrl || 'Not Published',
                    'Word Count': post.contentLength || 0,
                    'Images': post.uploadedImages || 0,
                    'Published Date': post.publishedAt ? new Date(post.publishedAt).toLocaleString() : '-',
                    'Error': post.error || '-'
                });
            }
        }
        
        console.log('[Excel Export] Posts data prepared:', postsData.length, 'rows');

        // Create Posts sheet first (main sheet)
        const postsSheet = xlsx.utils.json_to_sheet(postsData);
        
        // Set column widths
        postsSheet['!cols'] = [
            { wch: 8 },   // Sr No
            { wch: 50 },  // Title
            { wch: 15 },  // Status
            { wch: 80 },  // Live Blog Link
            { wch: 12 },  // Word Count
            { wch: 10 },  // Images
            { wch: 22 },  // Published Date
            { wch: 40 }   // Error
        ];

        xlsx.utils.book_append_sheet(workbook, postsSheet, 'Posts');

        // SUMMARY SHEET (Overview)
        const summaryData = [
            { 'Metric': 'File Name', 'Value': job.fileName || 'Unknown' },
            { 'Metric': 'Total Posts', 'Value': job.totalPosts || 0 },
            { 'Metric': 'Successful', 'Value': job.successfulPosts || 0 },
            { 'Metric': 'Failed', 'Value': job.failedPosts || 0 },
            { 'Metric': 'Success Rate', 'Value': job.totalPosts > 0 ? `${Math.round((job.successfulPosts / job.totalPosts) * 100)}%` : '0%' },
            { 'Metric': 'Processing Time', 'Value': job.completedAt && job.startedAt ? `${Math.round((new Date(job.completedAt) - new Date(job.startedAt)) / 1000)} seconds` : 'In Progress' },
            { 'Metric': 'Started At', 'Value': job.startedAt ? new Date(job.startedAt).toLocaleString() : '-' },
            { 'Metric': 'Completed At', 'Value': job.completedAt ? new Date(job.completedAt).toLocaleString() : '-' }
        ];

        const summarySheet = xlsx.utils.json_to_sheet(summaryData);
        summarySheet['!cols'] = [
            { wch: 20 },  // Metric
            { wch: 50 }   // Value
        ];
        
        xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Generate Excel file
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="wordpress-bulk-import-report-${job._id}.xlsx"`);
        
        res.send(excelBuffer);
    } catch (error) {
        console.error('Excel export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Background processing function with detailed progress and ADVANCED SEO
async function processBulkImport(jobId, site, posts) {
    try {
        console.log(`[Bulk Import] Starting job ${jobId} with ${posts.length} posts`);
        
        const job = await BulkImportJob.findById(jobId);
        job.status = 'processing';
        job.startedAt = new Date();
        job.currentStep = 'Starting advanced SEO bulk import...';
        await job.save();

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const title = post.title;
            const rowData = post.rowData || {};
            const postNum = i + 1;

            try {
                console.log(`[Bulk Import] Processing post ${postNum}/${posts.length}: "${title}"`);
                console.log(`[Bulk Import] Row data:`, JSON.stringify(rowData, null, 2));
                
                // Update progress: Generating ultra-human content
                job.currentStep = `Post ${postNum}/${posts.length}: Writing human-like content for "${title}"`;
                job.posts[i].status = 'generating';
                await job.save();

                // Generate ULTRA-HUMAN content (1500+ words with images)
                console.log(`[Bulk Import] Generating ultra-human content (1500+ words)...`);
                const content = await generateContentForTitle(title, rowData);
                
                // Calculate word count
                const wordCount = content.content ? content.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
                console.log(`[Bulk Import] Content generated: ${content.content?.length || 0} characters, ${wordCount} words, ${content.images?.length || 0} images, TOC: ${!!content.toc}, Schema: ${!!content.schema}`);

                // Update progress: Publishing to WordPress
                job.currentStep = `Post ${postNum}/${posts.length}: Publishing "${title}" to WordPress`;
                job.posts[i].status = 'publishing';
                job.posts[i].contentLength = content.content?.length || 0;
                job.posts[i].imageCount = content.images?.length || 0;
                await job.save();

                // Post to WordPress with SEO data
                console.log(`[Bulk Import] Publishing to WordPress with SEO optimization...`);
                const result = await postToWordPress(
                    site.siteUrl,
                    site.username,
                    site.applicationPassword,
                    title,
                    content.content,
                    content.images || [],
                    content.seo || {}
                );

                // Update job with result
                job.posts[i].status = result.success ? 'published' : 'failed';
                job.posts[i].wordpressPostId = result.postId;
                job.posts[i].wordpressPostUrl = result.postUrl;
                job.posts[i].error = result.error;
                job.posts[i].uploadedImages = result.uploadedImages || 0;
                job.posts[i].publishedAt = result.success ? new Date() : null;

                job.processedPosts++;
                if (result.success) {
                    job.successfulPosts++;
                    console.log(`[Bulk Import] ✅ Post ${postNum} published successfully: ${result.postUrl}`);
                } else {
                    job.failedPosts++;
                    console.log(`[Bulk Import] ❌ Post ${postNum} failed: ${result.error}`);
                }

                job.currentStep = `Post ${postNum}/${posts.length}: ${result.success ? 'Published ✅' : 'Failed ❌'}`;
                await job.save();

                // Small delay to avoid overwhelming WordPress
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(`[Bulk Import] ❌ Error processing post ${postNum}:`, error.message);
                job.posts[i].status = 'failed';
                job.posts[i].error = error.message;
                job.processedPosts++;
                job.failedPosts++;
                job.currentStep = `Post ${postNum}/${posts.length}: Failed - ${error.message}`;
                await job.save();
            }
        }

        job.status = 'completed';
        job.completedAt = new Date();
        job.currentStep = `✅ Completed! ${job.successfulPosts}/${job.totalPosts} posts published successfully`;
        await job.save();
    } catch (error) {
        console.error('Bulk import error:', error);
        try {
            const job = await BulkImportJob.findById(jobId);
            if (job) {
                job.status = 'failed';
                job.currentStep = `❌ Failed: ${error.message}`;
                await job.save();
            } else {
                console.error('Bulk import job not found:', jobId);
            }
        } catch (saveError) {
            console.error('Error saving failed job status:', saveError.message);
        }
    }
}

// Generate content using JavaScript (no Python dependency)
async function generateContentForTitle(title, excelRow = {}) {
    console.log(`[Bulk Content] Generating content for: "${title}"`);
    
    const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const SERPAPI_KEY = process.env.SERPAPI_KEY;
    
    // Build the prompt with topic-specific headings
    const prompt = `You are an expert content writer. Write a comprehensive, detailed article about "${title}".

CRITICAL REQUIREMENTS:
- Write at least 1500 words
- Create 6-8 sections with TOPIC-SPECIFIC headings
- Each section: 200-300 words with detailed information

IMPORTANT - HEADINGS MUST BE SPECIFIC TO "${title}":
DO NOT use generic headings like "Introduction", "Background", "Benefits", "How It Works".
INSTEAD, create headings that are UNIQUE and SPECIFIC to "${title}".

CONTENT REQUIREMENTS:
- Include real facts, statistics, and specific details about ${title}
- Add examples, comparisons, and expert insights
- Use bullet points and numbered lists where appropriate
- Make content informative, engaging, and valuable
- Write like a human expert, not AI

HTML FORMAT:
- Use <h2> for main section headings (topic-specific!)
- Use <h3> for subsections
- Use <p> for paragraphs
- Use <ul><li> for bullet lists
- Use <strong> for emphasis

Write the complete article now with TOPIC-SPECIFIC headings:`;

    let content = null;
    
    // Try OpenRouter first
    if (OPENROUTER_API_KEY) {
        try {
            console.log('[Bulk Content] Trying OpenRouter API...');
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
                    'X-Title': 'AI Marketing Platform'
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3-haiku',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 8000,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices?.[0]?.message?.content) {
                    content = data.choices[0].message.content;
                    console.log('[Bulk Content] ✅ OpenRouter success');
                }
            }
        } catch (err) {
            console.log('[Bulk Content] OpenRouter error:', err.message);
        }
    }
    
    // Fallback to Google AI
    if (!content && GOOGLE_AI_KEY) {
        try {
            console.log('[Bulk Content] Trying Google AI API...');
            const googleResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_AI_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8000
                        }
                    })
                }
            );

            const googleData = await googleResponse.json();
            
            if (googleData.candidates?.[0]?.content?.parts?.[0]?.text) {
                content = googleData.candidates[0].content.parts[0].text;
                console.log('[Bulk Content] ✅ Google AI success');
            }
        } catch (err) {
            console.log('[Bulk Content] Google AI error:', err.message);
        }
    }
    
    if (!content) {
        throw new Error('All AI services failed. Check API keys in your server .env file.');
    }
    
    // Fetch images using SerpAPI
    let images = [];
    if (SERPAPI_KEY) {
        try {
            console.log(`[Bulk Content] Fetching images for: "${title}"`);
            const searchQuery = encodeURIComponent(title);
            const serpUrl = `https://serpapi.com/search.json?engine=google_images&q=${searchQuery}&num=4&api_key=${SERPAPI_KEY}&safe=active`;
            
            const imgResponse = await fetch(serpUrl);
            
            if (imgResponse.ok) {
                const imgData = await imgResponse.json();
                
                if (imgData.images_results && imgData.images_results.length > 0) {
                    images = imgData.images_results.slice(0, 4).map(img => ({
                        url: img.original || img.thumbnail,
                        alt: img.title || title
                    })).filter(img => img.url);
                    
                    console.log(`[Bulk Content] ✅ Found ${images.length} images`);
                }
            }
        } catch (err) {
            console.log('[Bulk Content] Image fetch error:', err.message);
        }
    }
    
    // Insert images into content
    if (images.length > 0) {
        const sections = content.split(/<\/h2>/gi);
        if (sections.length > 1) {
            let result = '';
            let imageIndex = 0;
            const step = Math.max(1, Math.floor(sections.length / images.length));
            
            for (let i = 0; i < sections.length; i++) {
                result += sections[i] + (i < sections.length - 1 ? '</h2>' : '');
                
                if (imageIndex < images.length && (i + 1) % step === 0 && i < sections.length - 1) {
                    const img = images[imageIndex];
                    result += `\n<figure style="margin: 20px 0; text-align: center;">
                        <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; height: auto; border-radius: 8px;" />
                        <figcaption style="font-size: 14px; color: #666; margin-top: 8px;">${img.alt}</figcaption>
                    </figure>\n`;
                    imageIndex++;
                }
            }
            content = result;
        }
    }
    
    return {
        content: content,
        images: images,
        title: title
    };
}

export default router;
