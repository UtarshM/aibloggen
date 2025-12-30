/**
 * Authentication Models - User, OTP, and Usage Tracking
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import mongoose from 'mongoose';

// ═══════════════════════════════════════════════════════════════
// PLAN TOKEN LIMITS - Define token allocations per plan
// ═══════════════════════════════════════════════════════════════
export const PLAN_TOKEN_LIMITS = {
  free: {
    monthlyTokens: 10000,      // 10K tokens/month (~2-3 blog posts)
    maxBlogPosts: 3,
    maxSocialPosts: 10,
    maxSeoAnalyses: 5,
    features: ['content-creation']
  },
  basic: {
    monthlyTokens: 50000,      // 50K tokens/month (~10-15 blog posts)
    maxBlogPosts: 15,
    maxSocialPosts: 50,
    maxSeoAnalyses: 20,
    features: ['content-creation']
  },
  advanced: {
    monthlyTokens: 200000,     // 200K tokens/month (~50+ blog posts)
    maxBlogPosts: 60,
    maxSocialPosts: 200,
    maxSeoAnalyses: 100,
    features: ['content-creation']
  },
  premium: {
    monthlyTokens: 1000000,    // 1M tokens/month (unlimited practical use)
    maxBlogPosts: -1,          // -1 = unlimited
    maxSocialPosts: -1,
    maxSeoAnalyses: -1,
    features: ['content-creation']
  }
};

// Token costs per operation
export const TOKEN_COSTS = {
  blogPost: 3500,              // ~3500 tokens per blog post (5000 words)
  socialPost: 200,             // ~200 tokens per social post
  seoAnalysis: 500,            // ~500 tokens per SEO analysis
  imageSearch: 50,             // ~50 tokens per image search
  contentHumanize: 1000,       // ~1000 tokens per humanization
  chatMessage: 100             // ~100 tokens per chat message
};

// User Schema
const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    sparse: true
  },
  profile: {
    firstName: String,
    lastName: String,
    profileImage: String,
    dateOfBirth: String,
    gender: String,
    phone: String,
    location: String,
    company: String,
    website: String,
    bio: String
  },
  // Password reset fields
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  // Subscription/Plan fields
  plan: {
    type: String,
    enum: ['free', 'basic', 'advanced', 'premium'],
    default: 'free'
  },
  planExpiry: {
    type: Date
  },
  // Token/Credits Balance
  tokenBalance: {
    current: { type: Number, default: 10000 },      // Current available tokens
    used: { type: Number, default: 0 },             // Tokens used this period
    total: { type: Number, default: 10000 },        // Total allocated for period
    lastReset: { type: Date, default: Date.now },   // When tokens were last reset
    nextReset: { type: Date }                       // When tokens will reset next
  },
  // Usage tracking (legacy + enhanced)
  apiUsage: {
    contentGenerated: { type: Number, default: 0 },
    imagesGenerated: { type: Number, default: 0 },
    socialPosts: { type: Number, default: 0 },
    seoAnalyses: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },
  // Affiliate referral tracking
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affiliate'
  },
  // Admin role
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Block user - prevents login
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedAt: {
    type: Date
  },
  blockedReason: {
    type: String
  }
});

// ═══════════════════════════════════════════════════════════════
// USAGE LOG SCHEMA - Track every token-consuming operation
// ═══════════════════════════════════════════════════════════════
const usageLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  operation: {
    type: String,
    enum: ['blogPost', 'socialPost', 'seoAnalysis', 'imageSearch', 'contentHumanize', 'chatMessage'],
    required: true
  },
  tokensUsed: {
    type: Number,
    required: true
  },
  metadata: {
    topic: String,
    wordCount: Number,
    platform: String,
    keyword: String,
    title: String
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'partial'],
    default: 'success'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for efficient queries
usageLogSchema.index({ userId: 1, createdAt: -1 });
usageLogSchema.index({ userId: 1, operation: 1 });

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes
  }
});

export const User = mongoose.model('User', userSchema);
export const OTP = mongoose.model('OTP', otpSchema);
export const UsageLog = mongoose.model('UsageLog', usageLogSchema);

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR TOKEN MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Check if user has enough tokens for an operation
 */
export async function checkTokenBalance(userId, operation) {
  try {
    const user = await User.findById(userId);
    if (!user) return { allowed: true, reason: 'User not found - allowing operation', cost: 0 };
    
    const cost = TOKEN_COSTS[operation] || 0;
    const planLimits = PLAN_TOKEN_LIMITS[user.plan] || PLAN_TOKEN_LIMITS.free;
    
    // Initialize tokenBalance if it doesn't exist
    if (!user.tokenBalance || !user.tokenBalance.current) {
      user.tokenBalance = {
        current: planLimits.monthlyTokens,
        used: 0,
        total: planLimits.monthlyTokens,
        lastReset: new Date(),
        nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      await user.save();
    }
    
    // Check if tokens need to be reset (monthly)
    const now = new Date();
    const lastReset = user.tokenBalance?.lastReset || user.createdAt;
    const daysSinceReset = (now - new Date(lastReset)) / (1000 * 60 * 60 * 24);
    
    if (daysSinceReset >= 30) {
      // Reset tokens for new month
      user.tokenBalance = {
        current: planLimits.monthlyTokens,
        used: 0,
        total: planLimits.monthlyTokens,
        lastReset: now,
        nextReset: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      };
      await user.save();
    }
    
    const currentBalance = user.tokenBalance?.current || planLimits.monthlyTokens;
    
    if (currentBalance < cost) {
      return { 
        allowed: false, 
        reason: 'Insufficient tokens',
        required: cost,
        available: currentBalance,
        plan: user.plan
      };
    }
    
    return { 
      allowed: true, 
      cost,
      remaining: currentBalance - cost,
      plan: user.plan
    };
  } catch (error) {
    console.error('checkTokenBalance error:', error);
    // Allow operation on error to not block users
    return { allowed: true, cost: 0, reason: 'Error checking balance - allowing operation' };
  }
}

/**
 * Deduct tokens after successful operation
 */
export async function deductTokens(userId, operation, metadata = {}) {
  try {
    const cost = TOKEN_COSTS[operation] || 0;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          'tokenBalance.current': -cost,
          'tokenBalance.used': cost,
          [`apiUsage.${operation === 'blogPost' ? 'contentGenerated' : 
                       operation === 'socialPost' ? 'socialPosts' : 
                       operation === 'seoAnalysis' ? 'seoAnalyses' : 
                       'imagesGenerated'}`]: 1
        }
      },
      { new: true }
    );
    
    // Log the usage - wrapped in try-catch
    try {
      await UsageLog.create({
        userId,
        operation,
        tokensUsed: cost,
        metadata,
        status: 'success'
      });
    } catch (logError) {
      console.error('UsageLog create error:', logError);
    }
    
    return {
      tokensUsed: cost,
      remaining: user?.tokenBalance?.current || 0,
      totalUsed: user?.tokenBalance?.used || cost
    };
  } catch (error) {
    console.error('deductTokens error:', error);
    return { tokensUsed: 0, remaining: 0, totalUsed: 0 };
  }
}

/**
 * Get user's usage statistics
 */
export async function getUserUsageStats(userId, days = 30) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get usage logs for the period - with error handling
    let logs = [];
    try {
      logs = await UsageLog.find({
        userId,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: -1 }) || [];
    } catch (e) {
      console.log('UsageLog find error:', e.message);
      logs = [];
    }
    
    // Aggregate by operation type
    const byOperation = {};
    logs.forEach(log => {
      if (!byOperation[log.operation]) {
        byOperation[log.operation] = { count: 0, tokens: 0 };
      }
      byOperation[log.operation].count++;
      byOperation[log.operation].tokens += log.tokensUsed || 0;
    });
    
    // Daily usage for charts
    const dailyUsage = {};
    logs.forEach(log => {
      if (log.createdAt) {
        const day = log.createdAt.toISOString().split('T')[0];
        if (!dailyUsage[day]) dailyUsage[day] = 0;
        dailyUsage[day] += log.tokensUsed || 0;
      }
    });
    
    const planLimits = PLAN_TOKEN_LIMITS[user.plan] || PLAN_TOKEN_LIMITS.free;
    
    // Initialize tokenBalance if needed
    const tokenBalance = user.tokenBalance || {
      current: planLimits.monthlyTokens,
      used: 0,
      total: planLimits.monthlyTokens
    };
    
    return {
      balance: {
        current: tokenBalance.current || planLimits.monthlyTokens,
        used: tokenBalance.used || 0,
        total: tokenBalance.total || planLimits.monthlyTokens,
        percentage: Math.round(((tokenBalance.used || 0) / planLimits.monthlyTokens) * 100)
      },
      plan: {
        name: user.plan,
        limits: planLimits
      },
      usage: {
        byOperation,
        dailyUsage,
        recentLogs: logs.slice(0, 20)
      },
      apiUsage: user.apiUsage || { contentGenerated: 0, socialPosts: 0, seoAnalyses: 0, imagesGenerated: 0 }
    };
  } catch (error) {
    console.error('getUserUsageStats error:', error);
    return null;
  }
}
