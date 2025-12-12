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
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

        // Get WordPress site
        const site = await WordPressSite.findById(siteId);
        if (!site) {
            return res.status(404).json({ error: 'WordPress site not found' });
        }

        // Post to WordPress
        const result = await postToWordPress(
            site.siteUrl,
            site.username,
            site.applicationPassword,
            title,
            content,
            images || []
        );

        if (result.success) {
            // Save to queue as published
            const queueItem = new WordPressPostQueue({
                userId: req.user.userId,
                wordpressSiteId: siteId,
                title,
                content,
                images: images || [],
                status: 'published',
                wordpressPostId: result.postId,
                wordpressPostUrl: result.postUrl,
                publishedAt: new Date()
            });
            await queueItem.save();
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const job = await BulkImportJob.findOne({
            _id: req.params.jobId,
            userId: req.user.userId
        });
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Create Excel workbook
        const workbook = xlsx.utils.book_new();

        // Prepare data for Excel with ALL original data + live links
        const excelData = job.posts.map((post, index) => {
            const row = {
                'No.': index + 1,
                'Title': post.title,
                'H tags': post.hTags || '',
                'keywords': post.keywords || '',
                'refrance': post.references || '',
                'EEAT': post.eeat || '',
                'Date': post.scheduleDate || '',
                'time': post.scheduleTime || '',
                'Link': post.wordpressPostUrl || '',
                'Status': post.status === 'published' ? '✅ Published' : post.status === 'failed' ? '❌ Failed' : '⏳ Pending',
                'Word Count': post.contentLength || 0,
                'Images Uploaded': post.uploadedImages || 0,
                'Published Date': post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'N/A',
                'Error': post.error || 'None'
            };
            return row;
        });

        // Add summary at the top
        const summaryData = [
            { 'Summary': 'Total Posts', 'Value': job.totalPosts },
            { 'Summary': 'Successful', 'Value': job.successfulPosts },
            { 'Summary': 'Failed', 'Value': job.failedPosts },
            { 'Summary': 'Processing Time', 'Value': job.completedAt ? `${Math.round((job.completedAt - job.startedAt) / 1000)}s` : 'In Progress' },
            { 'Summary': '', 'Value': '' } // Empty row
        ];

        // Create summary sheet
        const summarySheet = xlsx.utils.json_to_sheet(summaryData);
        xlsx.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Create posts sheet
        const postsSheet = xlsx.utils.json_to_sheet(excelData);
        
        // Set column widths for better readability
        postsSheet['!cols'] = [
            { wch: 5 },  // No.
            { wch: 45 }, // Title
            { wch: 30 }, // H tags
            { wch: 25 }, // keywords
            { wch: 30 }, // refrance
            { wch: 35 }, // EEAT
            { wch: 12 }, // Date
            { wch: 10 }, // time
            { wch: 70 }, // Link (LIVE BLOG LINK)
            { wch: 15 }, // Status
            { wch: 12 }, // Word Count
            { wch: 12 }, // Images Uploaded
            { wch: 20 }, // Published Date
            { wch: 30 }  // Error
        ];

        xlsx.utils.book_append_sheet(workbook, postsSheet, 'Posts');

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

// Generate ULTRA-HUMAN content
async function generateContentForTitle(title, excelRow = {}) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'ultra_human_writer.py');
        const python = spawn('python', [pythonScript], {
            cwd: __dirname
        });

        let result = '';
        let error = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
            console.log('[Python]', data.toString());
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error('[Python] Process exited with code:', code);
                console.error('[Python] Error output:', error);
                reject(new Error(error || 'Content generation failed'));
            } else {
                try {
                    // Try to parse JSON from output
                    const jsonMatch = result.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) {
                        console.error('[Python] No JSON found in output:', result.substring(0, 500));
                        reject(new Error('Failed to parse generated content - no JSON found'));
                        return;
                    }
                    const data = JSON.parse(jsonMatch[0]);
                    
                    // Check if there's an error in the response
                    if (data.error) {
                        console.error('[Python] Error in response:', data.error);
                        reject(new Error(data.error));
                        return;
                    }
                    
                    console.log('[Python] ✅ Successfully generated advanced content with TOC');
                    resolve(data);
                } catch (e) {
                    console.error('[Python] JSON parse error:', e.message);
                    console.error('[Python] Output:', result.substring(0, 500));
                    reject(new Error('Failed to parse generated content: ' + e.message));
                }
            }
        });

        python.on('error', (err) => {
            reject(new Error('Python not found'));
        });

        // Parse Excel row data
        const hTags = excelRow['H tags'] || excelRow['h tags'] || excelRow['htags'] || '';
        const keywords = excelRow['keywords'] || excelRow['Keywords'] || '';
        const references = excelRow['reference'] || excelRow['Reference'] || excelRow['references'] || '';
        const eeatRaw = excelRow['EEAT'] || excelRow['eeat'] || '';
        const scheduleDate = excelRow['Date'] || excelRow['date'] || '';
        const scheduleTime = excelRow['time'] || excelRow['Time'] || '';

        // Parse H-tags (semicolon-separated)
        const hTagsArray = hTags ? hTags.split(';').map(tag => tag.trim()).filter(Boolean) : [];

        // Parse keywords (comma-separated)
        const keywordsArray = keywords ? keywords.split(',').map(kw => kw.trim()).filter(Boolean) : [];

        // Parse references (semicolon-separated)
        const referencesArray = references ? references.split(';').map(ref => ref.trim()).filter(Boolean) : [];

        // Parse E-E-A-T data (format: Author Name: X;Credentials: Y;Experience: Z)
        const eeatInfo = {};
        if (eeatRaw) {
            const eeatParts = eeatRaw.split(';');
            eeatParts.forEach(part => {
                const [key, value] = part.split(':').map(s => s.trim());
                if (key && value) {
                    if (key.toLowerCase().includes('author') || key.toLowerCase().includes('name')) {
                        eeatInfo.authorName = value;
                    } else if (key.toLowerCase().includes('credential')) {
                        eeatInfo.credentials = value;
                    } else if (key.toLowerCase().includes('experience')) {
                        eeatInfo.experienceYears = value;
                    }
                }
            });
        }

        // Send config to Python for ULTRA-HUMAN content
        const config = {
            topic: title,
            hTags: hTagsArray,
            keywords: keywordsArray,
            references: referencesArray,
            eeat: eeatInfo,
            scheduleDate: scheduleDate,
            scheduleTime: scheduleTime
        };

        console.log('[Ultra Human] Config:', JSON.stringify(config, null, 2));

        python.stdin.write(JSON.stringify(config));
        python.stdin.end();
    });
}

export default router;
