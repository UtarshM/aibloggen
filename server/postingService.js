/**
 * Social Media Posting Service
 * Handles actual posting to Twitter, Facebook, and Instagram using OAuth tokens
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import { ConnectedAccount } from './socialModels.js';
import fs from 'fs';
import path from 'path';

/**
 * Post to Twitter with media
 */
export async function postToTwitter(userId, content, mediaPath) {
    try {
        // Get Twitter account
        const account = await ConnectedAccount.findOne({
            userId,
            platform: 'twitter',
            connected: true
        });

        if (!account) {
            throw new Error('Twitter account not connected');
        }

        // Check if token expired
        if (account.tokenExpiry && new Date() > account.tokenExpiry) {
            throw new Error('Twitter token expired. Please reconnect your account.');
        }

        // Initialize Twitter client
        const client = new TwitterApi(account.accessToken);

        let mediaId = null;

        // Upload media if provided
        if (mediaPath) {
            const mediaBuffer = fs.readFileSync(mediaPath);
            mediaId = await client.v1.uploadMedia(mediaBuffer, {
                mimeType: mediaPath.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
            });
        }

        // Post tweet
        const tweet = mediaId
            ? await client.v2.tweet({ text: content, media: { media_ids: [mediaId] } })
            : await client.v2.tweet({ text: content });

        return {
            success: true,
            postId: tweet.data.id,
            platform: 'twitter'
        };
    } catch (error) {
        console.error('Twitter posting error:', error);
        return {
            success: false,
            error: error.message,
            platform: 'twitter'
        };
    }
}

/**
 * Post to Facebook Page with media
 */
export async function postToFacebook(userId, content, mediaPath) {
    try {
        // Get Facebook account
        const account = await ConnectedAccount.findOne({
            userId,
            platform: 'facebook',
            connected: true
        });

        if (!account) {
            throw new Error('Facebook account not connected');
        }

        if (!account.pageId) {
            throw new Error('No Facebook page selected');
        }

        const pageAccessToken = account.accessToken;
        const pageId = account.pageId;

        let response;

        if (mediaPath) {
            // Check if mediaPath is a URL or local file
            const isUrl = mediaPath.startsWith('http://') || mediaPath.startsWith('https://');
            
            if (isUrl) {
                // Post with photo URL - Facebook can fetch from URL directly
                response = await axios.post(
                    `https://graph.facebook.com/v18.0/${pageId}/photos`,
                    {
                        message: content,
                        url: mediaPath,
                        access_token: pageAccessToken
                    }
                );
            } else {
                // Post with local file using FormData
                const FormData = (await import('form-data')).default;
                const formData = new FormData();
                
                formData.append('message', content);
                formData.append('access_token', pageAccessToken);
                formData.append('source', fs.createReadStream(mediaPath));

                response = await axios.post(
                    `https://graph.facebook.com/v18.0/${pageId}/photos`,
                    formData,
                    {
                        headers: formData.getHeaders()
                    }
                );
            }
        } else {
            // Post text only
            response = await axios.post(
                `https://graph.facebook.com/v18.0/${pageId}/feed`,
                {
                    message: content,
                    access_token: pageAccessToken
                }
            );
        }

        return {
            success: true,
            postId: response.data.id || response.data.post_id,
            platform: 'facebook'
        };
    } catch (error) {
        console.error('Facebook posting error:', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            platform: 'facebook'
        };
    }
}

/**
 * Post to Instagram with media (media is required for Instagram)
 */
export async function postToInstagram(userId, content, mediaPath) {
    try {
        if (!mediaPath) {
            throw new Error('Instagram requires media (image or video)');
        }

        // Get Instagram account
        const account = await ConnectedAccount.findOne({
            userId,
            platform: 'instagram',
            connected: true
        });

        if (!account) {
            throw new Error('Instagram account not connected');
        }

        if (!account.instagramUserId) {
            throw new Error('Instagram user ID not found');
        }

        const accessToken = account.accessToken;
        const instagramUserId = account.instagramUserId;

        // Upload media to a public URL (Instagram requires a public URL)
        // In production, you would upload to S3 or similar
        // For now, we'll use a placeholder
        const mediaUrl = `https://your-domain.com/uploads/${path.basename(mediaPath)}`;

        // Step 1: Create media container
        const containerResponse = await axios.post(
            `https://graph.instagram.com/v18.0/${instagramUserId}/media`,
            {
                image_url: mediaUrl,
                caption: content,
                access_token: accessToken
            }
        );

        const creationId = containerResponse.data.id;

        // Step 2: Publish media
        const publishResponse = await axios.post(
            `https://graph.instagram.com/v18.0/${instagramUserId}/media_publish`,
            {
                creation_id: creationId,
                access_token: accessToken
            }
        );

        return {
            success: true,
            postId: publishResponse.data.id,
            platform: 'instagram'
        };
    } catch (error) {
        console.error('Instagram posting error:', error);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            platform: 'instagram'
        };
    }
}

/**
 * Post to LinkedIn
 */
export async function postToLinkedIn(userId, content, mediaPath) {
    try {
        // Get LinkedIn account
        const account = await ConnectedAccount.findOne({
            userId,
            platform: 'linkedin',
            connected: true
        });

        if (!account) {
            throw new Error('LinkedIn account not connected');
        }

        const accessToken = account.accessToken;
        let linkedinId = account.linkedinId;

        // If linkedinId is missing, try to get it from the API
        if (!linkedinId) {
            console.log('[LinkedIn] linkedinId missing, fetching from API...');
            try {
                const userInfoResponse = await axios.get(
                    'https://api.linkedin.com/v2/userinfo',
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
                linkedinId = userInfoResponse.data.sub;
                
                // Save it for future use
                if (linkedinId) {
                    await ConnectedAccount.findByIdAndUpdate(account._id, { linkedinId });
                    console.log('[LinkedIn] linkedinId saved:', linkedinId);
                }
            } catch (apiError) {
                console.error('[LinkedIn] Failed to get user info:', apiError.message);
            }
        }

        if (!linkedinId) {
            throw new Error('LinkedIn user ID not found. Please reconnect your LinkedIn account.');
        }
        
        console.log('[LinkedIn] Posting with linkedinId:', linkedinId);

        // Check if mediaPath is a URL
        const isUrl = mediaPath && (mediaPath.startsWith('http://') || mediaPath.startsWith('https://'));

        // Build the post data for LinkedIn API
        let postData;
        
        if (mediaPath && isUrl) {
            // Try to upload image to LinkedIn first
            try {
                console.log('[LinkedIn] Attempting to upload image...');
                
                // Step 1: Register the image upload
                const registerResponse = await axios.post(
                    'https://api.linkedin.com/v2/assets?action=registerUpload',
                    {
                        registerUploadRequest: {
                            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                            owner: `urn:li:person:${linkedinId}`,
                            serviceRelationships: [{
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent'
                            }]
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
                const asset = registerResponse.data.value.asset;

                // Step 2: Download the image and upload to LinkedIn
                const imageResponse = await axios.get(mediaPath, { responseType: 'arraybuffer' });
                
                await axios.put(uploadUrl, imageResponse.data, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'image/jpeg'
                    }
                });

                console.log('[LinkedIn] Image uploaded successfully!');

                // Step 3: Create post with uploaded image
                postData = {
                    author: `urn:li:person:${linkedinId}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: {
                                text: content
                            },
                            shareMediaCategory: 'IMAGE',
                            media: [{
                                status: 'READY',
                                media: asset
                            }]
                        }
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                    }
                };
            } catch (uploadError) {
                console.error('[LinkedIn] Image upload failed, posting with link preview:', uploadError.message);
                // Fallback to link preview
                postData = {
                    author: `urn:li:person:${linkedinId}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: {
                                text: content
                            },
                            shareMediaCategory: 'ARTICLE',
                            media: [{
                                status: 'READY',
                                originalUrl: mediaPath
                            }]
                        }
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                    }
                };
            }
        } else {
            // Text-only post
            postData = {
                author: `urn:li:person:${linkedinId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: content
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            };
        }

        const response = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            postData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                }
            }
        );

        return {
            success: true,
            postId: response.data.id,
            platform: 'linkedin'
        };
    } catch (error) {
        console.error('LinkedIn posting error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            platform: 'linkedin'
        };
    }
}

/**
 * Post to multiple platforms
 */
export async function postToMultiplePlatforms(userId, content, mediaPath, platforms) {
    const results = [];

    for (const platform of platforms) {
        let result;

        switch (platform) {
            case 'twitter':
                result = await postToTwitter(userId, content, mediaPath);
                break;
            case 'facebook':
                result = await postToFacebook(userId, content, mediaPath);
                break;
            case 'instagram':
                result = await postToInstagram(userId, content, mediaPath);
                break;
            case 'linkedin':
                result = await postToLinkedIn(userId, content, mediaPath);
                break;
            default:
                result = {
                    success: false,
                    error: `Unknown platform: ${platform}`,
                    platform
                };
        }

        results.push(result);
    }

    return results;
}
