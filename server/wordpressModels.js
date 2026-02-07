/**
 * WordPress Integration Models
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import mongoose from 'mongoose';

// WordPress Site Connection Schema
const wordpressSiteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    siteName: {
        type: String,
        required: true
    },
    siteUrl: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    applicationPassword: {
        type: String,
        required: true
    },
    connected: {
        type: Boolean,
        default: false
    },
    lastTested: {
        type: Date
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// WordPress Post Queue Schema
const wordpressPostQueueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wordpressSiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WordPressSite',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        url: String,
        alt: String
    }],
    status: {
        type: String,
        enum: ['pending', 'processing', 'published', 'failed'],
        default: 'pending'
    },
    wordpressPostId: {
        type: Number
    },
    wordpressPostUrl: {
        type: String
    },
    error: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    scheduledFor: {
        type: Date
    }
}, { timestamps: true });

// Bulk Import Job Schema with detailed tracking
const bulkImportJobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wordpressSiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WordPressSite',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    totalPosts: {
        type: Number,
        required: true
    },
    processedPosts: {
        type: Number,
        default: 0
    },
    successfulPosts: {
        type: Number,
        default: 0
    },
    failedPosts: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    currentStep: {
        type: String,
        default: ''
    },
    posts: [{
        title: String,
        hTags: String, // Original H-tags from Excel
        keywords: String, // Original keywords from Excel
        references: String, // Original references from Excel
        eeat: String, // Original E-E-A-T from Excel
        scheduleDate: String, // Original date from Excel
        scheduleTime: String, // Original time from Excel
        status: String, // pending, generating, publishing, published, failed
        wordpressPostId: Number,
        wordpressPostUrl: String,
        contentLength: Number,
        imageCount: Number,
        uploadedImages: Number,
        publishedAt: Date,
        error: String
    }],
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

export const WordPressSite = mongoose.model('WordPressSite', wordpressSiteSchema);
export const WordPressPostQueue = mongoose.model('WordPressPostQueue', wordpressPostQueueSchema);
export const BulkImportJob = mongoose.model('BulkImportJob', bulkImportJobSchema);
