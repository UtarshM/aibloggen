/**
 * Affiliate System Models
 * Production-ready models for affiliate tracking, earnings, and withdrawals
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import mongoose from 'mongoose';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
// AFFILIATE MODEL
// ═══════════════════════════════════════════════════════════════
const affiliateSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  
  // Unique referral slug (used in URL: ?ref=slug)
  slug: {
    type: String,
    unique: true
  },
  
  // Commission settings
  commissionPercent: {
    type: Number,
    default: 20, // 20% commission
    min: 0,
    max: 100
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'banned'],
    default: 'pending'
  },
  
  // Rejection/Ban reason
  rejectionReason: {
    type: String
  },
  banReason: {
    type: String
  },
  
  // Profile & Social Info
  website: {
    type: String,
    trim: true
  },
  youtube: {
    type: String,
    trim: true
  },
  tiktok: {
    type: String,
    trim: true
  },
  instagram: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  
  // Audience & Promotion
  audienceSize: {
    type: String,
    enum: ['<1k', '1k-10k', '10k-50k', '50k-100k', '100k+'],
    default: '<1k'
  },
  promotionChannels: [{
    type: String,
    enum: ['YouTube', 'TikTok', 'Instagram', 'Blog', 'Email', 'Twitter/X', 'Facebook', 'Reddit', 'Other']
  }],
  whyJoin: {
    type: String,
    trim: true,
    maxlength: 500
  },
  agreedToTerms: {
    type: Boolean,
    default: false
  },
  
  // Legacy field for backward compatibility
  promotionMethod: {
    type: String,
    trim: true
  },
  
  // Financial balances (in INR, stored as paise for precision)
  totalEarnings: {
    type: Number,
    default: 0 // Total lifetime earnings
  },
  availableBalance: {
    type: Number,
    default: 0 // Available for withdrawal
  },
  pendingBalance: {
    type: Number,
    default: 0 // Locked in pending withdrawal
  },
  withdrawnBalance: {
    type: Number,
    default: 0 // Total withdrawn
  },
  
  // Stats
  totalClicks: {
    type: Number,
    default: 0
  },
  totalConversions: {
    type: Number,
    default: 0
  },
  
  // Admin notes
  adminNotes: {
    type: String
  },
  
  // Timestamps
  approvedAt: Date,
  rejectedAt: Date,
  lastLoginAt: Date
  
}, { timestamps: true });

// Generate unique slug before saving
affiliateSchema.pre('save', async function(next) {
  if (!this.slug) {
    // Generate slug from name + random string
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    this.slug = `${baseSlug}${randomSuffix}`;
  }
  next();
});

// Virtual for conversion rate
affiliateSchema.virtual('conversionRate').get(function() {
  if (this.totalClicks === 0) return 0;
  return ((this.totalConversions / this.totalClicks) * 100).toFixed(2);
});

// Virtual for referral link
affiliateSchema.virtual('referralLink').get(function() {
  return `https://aiblog.scalezix.com/?ref=${this.slug}`;
});

// Ensure virtuals are included in JSON
affiliateSchema.set('toJSON', { virtuals: true });
affiliateSchema.set('toObject', { virtuals: true });

// ═══════════════════════════════════════════════════════════════
// AFFILIATE CLICK MODEL
// Tracks every click on referral links
// ═══════════════════════════════════════════════════════════════
const affiliateClickSchema = new mongoose.Schema({
  affiliateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true,
    index: true
  },
  
  // Visitor info
  ip: {
    type: String,
    required: true
  },
  ipHash: {
    type: String // Hashed IP for privacy
  },
  userAgent: {
    type: String
  },
  
  // Page visited
  page: {
    type: String,
    default: '/'
  },
  referrer: {
    type: String
  },
  
  // Geo info (optional)
  country: String,
  city: String,
  
  // Conversion tracking
  converted: {
    type: Boolean,
    default: false
  },
  convertedAt: Date,
  
  // Prevent duplicate clicks from same IP within timeframe
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for finding recent clicks from same IP
affiliateClickSchema.index({ affiliateId: 1, ipHash: 1, createdAt: -1 });

// ═══════════════════════════════════════════════════════════════
// INTERNAL EARNING MODEL
// Records each commission earned by affiliate
// ═══════════════════════════════════════════════════════════════
const internalEarningSchema = new mongoose.Schema({
  affiliateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true,
    index: true
  },
  
  // Revenue that generated this commission
  revenueAmount: {
    type: Number,
    required: true // Amount in INR (paise)
  },
  
  // Commission earned (20% of revenue)
  commissionAmount: {
    type: Number,
    required: true // Amount in INR (paise)
  },
  
  // Commission percentage at time of earning
  commissionPercent: {
    type: Number,
    default: 20
  },
  
  // Source of earning
  source: {
    type: String,
    default: 'subscription' // subscription, one-time, etc.
  },
  
  // Reference to what generated this earning
  referenceId: {
    type: String // Could be subscription ID, order ID, etc.
  },
  referenceType: {
    type: String // 'subscription', 'purchase', etc.
  },
  
  // Status
  status: {
    type: String,
    enum: ['available', 'locked', 'withdrawn'],
    default: 'available'
  },
  
  // Description
  description: {
    type: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// ═══════════════════════════════════════════════════════════════
// WITHDRAWAL MODEL
// Tracks withdrawal requests and their status
// ═══════════════════════════════════════════════════════════════
const withdrawalSchema = new mongoose.Schema({
  affiliateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true,
    index: true
  },
  
  // Amount requested (in INR)
  amount: {
    type: Number,
    required: true,
    min: 5000000 // Minimum ₹50,000 (stored as paise)
  },
  
  // Currency
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Status flow: requested → completed/rejected
  status: {
    type: String,
    enum: ['requested', 'processing', 'completed', 'rejected'],
    default: 'requested'
  },
  
  // Payment details (filled by affiliate)
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'paypal'],
    default: 'bank_transfer'
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    upiId: String,
    paypalEmail: String
  },
  
  // Admin processing
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  
  // Notes
  affiliateNote: String,
  adminNote: String,
  rejectionReason: String,
  
  // Transaction reference (for completed withdrawals)
  transactionId: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Prevent multiple pending withdrawals
withdrawalSchema.index(
  { affiliateId: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: 'requested' }
  }
);

// ═══════════════════════════════════════════════════════════════
// AFFILIATE AUDIT LOG
// Tracks all important actions for security
// ═══════════════════════════════════════════════════════════════
const affiliateAuditLogSchema = new mongoose.Schema({
  // Who performed the action
  actorType: {
    type: String,
    enum: ['affiliate', 'admin', 'system'],
    required: true
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // What was affected
  targetType: {
    type: String,
    enum: ['affiliate', 'withdrawal', 'earning'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Action performed
  action: {
    type: String,
    required: true
    // Examples: 'withdrawal_requested', 'withdrawal_approved', 'withdrawal_rejected',
    // 'affiliate_approved', 'affiliate_rejected', 'earning_added', etc.
  },
  
  // Details
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  
  // Before/After state for financial changes
  previousState: mongoose.Schema.Types.Mixed,
  newState: mongoose.Schema.Types.Mixed,
  
  // Request info
  ip: String,
  userAgent: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Export models
export const Affiliate = mongoose.model('Affiliate', affiliateSchema);
export const AffiliateClick = mongoose.model('AffiliateClick', affiliateClickSchema);
export const InternalEarning = mongoose.model('InternalEarning', internalEarningSchema);
export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export const AffiliateAuditLog = mongoose.model('AffiliateAuditLog', affiliateAuditLogSchema);

// Constants
export const MINIMUM_WITHDRAWAL_AMOUNT = 5000000; // ₹50,000 in paise
export const DEFAULT_COMMISSION_PERCENT = 20;
export const COOKIE_NAME = 'aff_ref';
export const COOKIE_EXPIRY_DAYS = 30;
