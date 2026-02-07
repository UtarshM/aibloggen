/**
 * Social Media Models
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import mongoose from 'mongoose';

// Connected Social Account Schema
const connectedAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['twitter', 'instagram', 'facebook', 'linkedin'],
    required: true
  },
  // LinkedIn specific
  linkedinId: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  profileImage: {
    type: String
  },
  // OAuth tokens
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  // Facebook specific
  pageId: {
    type: String
  },
  pageName: {
    type: String
  },
  // Instagram specific
  instagramUserId: {
    type: String
  },
  connected: {
    type: Boolean,
    default: true
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  disconnectedAt: {
    type: Date
  }
}, { timestamps: true });

// Scheduled Post Schema
const scheduledPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String // URL or path to media
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  platforms: [{
    type: String,
    enum: ['twitter', 'instagram', 'facebook', 'linkedin']
  }],
  scheduledFor: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  publishResults: [{
    platform: String,
    success: Boolean,
    postId: String,
    error: String
  }],
  error: {
    type: String
  }
}, { timestamps: true });

export const ConnectedAccount = mongoose.model('ConnectedAccount', connectedAccountSchema);
export const ScheduledPost = mongoose.model('ScheduledPost', scheduledPostSchema);
