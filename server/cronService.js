/**
 * Cron Service - Scheduled Post Publishing
 * Runs every minute to check for posts that need to be published
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import cron from 'node-cron';
import { ScheduledPost } from './socialModels.js';
import { postToMultiplePlatforms } from './postingService.js';

/**
 * Check and publish scheduled posts
 */
async function checkScheduledPosts() {
    // Safety check - don't run if MongoDB is not connected
    if (!global.mongoConnected) {
        return;
    }

    try {
        const now = new Date();

        // Find posts scheduled for now or earlier
        const postsToPublish = await ScheduledPost.find({
            status: 'scheduled',
            scheduledFor: { $lte: now }
        });

        console.log(`[CRON] Found ${postsToPublish.length} posts to publish`);

        for (const post of postsToPublish) {
            try {
                console.log(`[CRON] Publishing post ${post._id} to ${post.platforms.join(', ')}`);

                // Post to all selected platforms
                const results = await postToMultiplePlatforms(
                    post.userId,
                    post.content,
                    post.mediaUrl,
                    post.platforms
                );

                // Check if all posts succeeded
                const allSucceeded = results.every(r => r.success);

                // Update post status
                post.status = allSucceeded ? 'published' : 'failed';
                post.publishedAt = new Date();
                post.publishResults = results;

                if (!allSucceeded) {
                    const errors = results.filter(r => !r.success).map(r => r.error).join('; ');
                    post.error = errors;
                }

                await post.save();

                console.log(`[CRON] Post ${post._id} ${allSucceeded ? 'published' : 'failed'}`);
            } catch (error) {
                console.error(`[CRON] Error publishing post ${post._id}:`, error);
                post.status = 'failed';
                post.error = error.message;
                await post.save();
            }
        }
    } catch (error) {
        console.error('[CRON] Error checking scheduled posts:', error);
    }
}

/**
 * Start cron job - runs every minute
 */
export function startCronJobs() {
    // Run every minute
    cron.schedule('* * * * *', () => {
        checkScheduledPosts();
    });

    console.log('✅ Cron jobs started - checking for scheduled posts every minute');
}

/**
 * Manual trigger for testing
 */
export async function triggerScheduledPostsNow() {
    await checkScheduledPosts();
}
