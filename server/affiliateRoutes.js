/**
 * Affiliate System Routes
 * Production-ready API endpoints for affiliate management
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  Affiliate,
  AffiliateClick,
  InternalEarning,
  Withdrawal,
  AffiliateAuditLog,
  MINIMUM_WITHDRAWAL_AMOUNT,
  DEFAULT_COMMISSION_PERCENT,
  COOKIE_NAME,
  COOKIE_EXPIRY_DAYS
} from './affiliateModels.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

// Authenticate affiliate
const authenticateAffiliate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'affiliate') {
      return res.status(403).json({ error: 'Invalid token type' });
    }
    
    const affiliate = await Affiliate.findById(decoded.affiliateId);
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    if (affiliate.status !== 'approved') {
      return res.status(403).json({ error: 'Affiliate account not approved' });
    }
    
    req.affiliate = affiliate;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Rate limiter for click tracking
const clickRateLimiter = new Map();
const CLICK_RATE_LIMIT_WINDOW = 60000;
const CLICK_RATE_LIMIT_MAX = 10;

const checkClickRateLimit = (ip) => {
  const now = Date.now();
  if (!clickRateLimiter.has(ip)) {
    clickRateLimiter.set(ip, { count: 1, resetAt: now + CLICK_RATE_LIMIT_WINDOW });
    return true;
  }
  const record = clickRateLimiter.get(ip);
  if (now > record.resetAt) {
    clickRateLimiter.set(ip, { count: 1, resetAt: now + CLICK_RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= CLICK_RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
};

// Clean up rate limiter periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of clickRateLimiter.entries()) {
    if (now > value.resetAt) clickRateLimiter.delete(key);
  }
}, 60000);

// ═══════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/affiliate/apply
 * Submit affiliate application
 */
router.post('/apply', async (req, res) => {
  try {
    const { 
      name, email, password, website, 
      youtube, tiktok, instagram, twitter,
      audienceSize, promotionChannels, whyJoin, agreedToTerms,
      promotionMethod // Legacy field
    } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    if (!agreedToTerms) {
      return res.status(400).json({ error: 'You must agree to the terms and conditions' });
    }

    const existingAffiliate = await Affiliate.findOne({ email: email.toLowerCase() });
    if (existingAffiliate) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate unique 7-10 character alphanumeric slug
    const generateSlug = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const length = 7 + Math.floor(Math.random() * 4); // 7-10 chars
      let slug = '';
      for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return slug;
    };
    
    // Ensure slug is unique
    let slug = generateSlug();
    while (await Affiliate.findOne({ slug })) {
      slug = generateSlug();
    }
    
    const affiliate = new Affiliate({
      name,
      email: email.toLowerCase(),
      passwordHash,
      slug,
      website,
      youtube,
      tiktok,
      instagram,
      twitter,
      audienceSize: audienceSize || '<1k',
      promotionChannels: promotionChannels || [],
      whyJoin,
      agreedToTerms: true,
      promotionMethod, // Legacy
      status: 'pending',
      commissionPercent: DEFAULT_COMMISSION_PERCENT
    });
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'affiliate',
      actorId: affiliate._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'application_submitted',
      details: { name, email, website, audienceSize, promotionChannels }
    });
    
    // Simulate admin notification email
    console.log(`
═══════════════════════════════════════════════════════════════
📧 NEW AFFILIATE APPLICATION - ADMIN NOTIFICATION
═══════════════════════════════════════════════════════════════
To: admin@scalezix.com
Subject: New Affiliate Application - ${name}

A new affiliate application has been submitted:

Name: ${name}
Email: ${email}
Website: ${website || 'Not provided'}
Audience Size: ${audienceSize || 'Not specified'}
Promotion Channels: ${promotionChannels?.join(', ') || 'Not specified'}

Why they want to join:
${whyJoin || 'Not provided'}

Review at: https://aiblog.scalezix.com/affiliate-admin
═══════════════════════════════════════════════════════════════
    `);
    
    res.json({
      success: true,
      message: 'Thank you! Your application has been submitted. We usually review within 1-3 business days.',
      affiliateId: affiliate._id
    });
  } catch (error) {
    console.error('Affiliate apply error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

/**
 * POST /api/affiliate/login
 * Affiliate login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const affiliate = await Affiliate.findOne({ email: email.toLowerCase() });
    
    if (!affiliate) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, affiliate.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Handle different statuses
    if (affiliate.status === 'pending') {
      return res.status(403).json({ 
        error: 'Your application is currently under review. We\'ll notify you by email soon.',
        status: 'pending'
      });
    }
    
    if (affiliate.status === 'rejected') {
      return res.status(403).json({ 
        error: affiliate.rejectionReason 
          ? `Your application was rejected: ${affiliate.rejectionReason}. Contact us at support@scalezix.com for more information.`
          : 'Your application was rejected. Contact us at support@scalezix.com for more information.',
        status: 'rejected'
      });
    }
    
    if (affiliate.status === 'suspended') {
      return res.status(403).json({ 
        error: 'Your account has been suspended. Please contact support@scalezix.com.',
        status: 'suspended'
      });
    }
    
    if (affiliate.status === 'banned') {
      return res.status(403).json({ 
        error: affiliate.banReason 
          ? `Your account has been permanently banned: ${affiliate.banReason}`
          : 'Your account has been permanently banned. This decision is final.',
        status: 'banned'
      });
    }
    
    affiliate.lastLoginAt = new Date();
    await affiliate.save();
    
    const token = jwt.sign(
      { affiliateId: affiliate._id, email: affiliate.email, type: 'affiliate' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      affiliate: {
        id: affiliate._id,
        name: affiliate.name,
        email: affiliate.email,
        slug: affiliate.slug,
        referralLink: affiliate.referralLink,
        commissionPercent: affiliate.commissionPercent,
        totalEarnings: affiliate.totalEarnings,
        availableBalance: affiliate.availableBalance,
        pendingBalance: affiliate.pendingBalance,
        withdrawnBalance: affiliate.withdrawnBalance,
        totalClicks: affiliate.totalClicks,
        totalConversions: affiliate.totalConversions
      }
    });
  } catch (error) {
    console.error('Affiliate login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});


/**
 * POST /api/affiliate/track-click
 * Track referral link clicks
 */
router.post('/track-click', async (req, res) => {
  try {
    const { slug, page, referrer } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    
    if (!slug) {
      return res.status(400).json({ error: 'Referral slug is required' });
    }
    
    if (!checkClickRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    const affiliate = await Affiliate.findOne({ slug, status: 'approved' });
    if (!affiliate) {
      return res.status(404).json({ error: 'Invalid referral link' });
    }
    
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    
    // Check for duplicate click within 24 hours
    const recentClick = await AffiliateClick.findOne({
      affiliateId: affiliate._id,
      ipHash,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (!recentClick) {
      await AffiliateClick.create({
        affiliateId: affiliate._id,
        ip,
        ipHash,
        userAgent,
        page: page || '/',
        referrer
      });
      
      affiliate.totalClicks += 1;
      await affiliate.save();
    }
    
    res.json({
      success: true,
      cookieName: COOKIE_NAME,
      cookieValue: slug,
      cookieExpiry: COOKIE_EXPIRY_DAYS
    });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});


// ═══════════════════════════════════════════════════════════════
// AUTHENTICATED AFFILIATE ENDPOINTS
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/affiliate/dashboard
 * Get affiliate dashboard data
 */
router.get('/dashboard', authenticateAffiliate, async (req, res) => {
  try {
    const affiliate = req.affiliate;
    
    // Get recent earnings
    const recentEarnings = await InternalEarning.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get recent clicks (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const clickStats = await AffiliateClick.aggregate([
      { $match: { affiliateId: affiliate._id, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get pending withdrawal
    const pendingWithdrawal = await Withdrawal.findOne({
      affiliateId: affiliate._id,
      status: { $in: ['requested', 'processing'] }
    });
    
    res.json({
      affiliate: {
        id: affiliate._id,
        name: affiliate.name,
        email: affiliate.email,
        slug: affiliate.slug,
        referralLink: affiliate.referralLink,
        commissionPercent: affiliate.commissionPercent,
        totalEarnings: affiliate.totalEarnings,
        availableBalance: affiliate.availableBalance,
        pendingBalance: affiliate.pendingBalance,
        withdrawnBalance: affiliate.withdrawnBalance,
        totalClicks: affiliate.totalClicks,
        totalConversions: affiliate.totalConversions,
        conversionRate: affiliate.conversionRate
      },
      recentEarnings,
      clickStats,
      pendingWithdrawal,
      minimumWithdrawal: MINIMUM_WITHDRAWAL_AMOUNT
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});


/**
 * GET /api/affiliate/earnings
 * Get all earnings history
 */
router.get('/earnings', authenticateAffiliate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const earnings = await InternalEarning.find({ affiliateId: req.affiliate._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await InternalEarning.countDocuments({ affiliateId: req.affiliate._id });
    
    res.json({
      earnings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({ error: 'Failed to load earnings' });
  }
});

/**
 * GET /api/affiliate/withdrawals
 * Get withdrawal history
 */
router.get('/withdrawals', authenticateAffiliate, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ affiliateId: req.affiliate._id })
      .sort({ createdAt: -1 });
    
    res.json({ withdrawals });
  } catch (error) {
    console.error('Withdrawals error:', error);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});


/**
 * POST /api/affiliate/withdraw
 * Request withdrawal
 */
router.post('/withdraw', authenticateAffiliate, async (req, res) => {
  try {
    const affiliate = req.affiliate;
    const { amount, paymentMethod, paymentDetails, note } = req.body;
    
    // Validate amount
    const withdrawAmount = parseInt(amount);
    if (!withdrawAmount || withdrawAmount < MINIMUM_WITHDRAWAL_AMOUNT) {
      return res.status(400).json({ 
        error: `Minimum withdrawal amount is ₹${(MINIMUM_WITHDRAWAL_AMOUNT / 100).toLocaleString()}` 
      });
    }
    
    if (withdrawAmount > affiliate.availableBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Check for existing pending withdrawal
    const existingWithdrawal = await Withdrawal.findOne({
      affiliateId: affiliate._id,
      status: { $in: ['requested', 'processing'] }
    });
    
    if (existingWithdrawal) {
      return res.status(400).json({ error: 'You already have a pending withdrawal request' });
    }
    
    // Validate payment details
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    
    if (paymentMethod === 'bank_transfer') {
      if (!paymentDetails?.bankName || !paymentDetails?.accountNumber || 
          !paymentDetails?.ifscCode || !paymentDetails?.accountHolderName) {
        return res.status(400).json({ error: 'Complete bank details are required' });
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails?.upiId) {
        return res.status(400).json({ error: 'UPI ID is required' });
      }
    } else if (paymentMethod === 'paypal') {
      if (!paymentDetails?.paypalEmail) {
        return res.status(400).json({ error: 'PayPal email is required' });
      }
    }

    
    // Create withdrawal request
    const withdrawal = new Withdrawal({
      affiliateId: affiliate._id,
      amount: withdrawAmount,
      paymentMethod,
      paymentDetails,
      affiliateNote: note,
      status: 'requested'
    });
    
    await withdrawal.save();
    
    // Update affiliate balances
    const previousState = {
      availableBalance: affiliate.availableBalance,
      pendingBalance: affiliate.pendingBalance
    };
    
    affiliate.availableBalance -= withdrawAmount;
    affiliate.pendingBalance += withdrawAmount;
    await affiliate.save();
    
    // Log action
    await AffiliateAuditLog.create({
      actorType: 'affiliate',
      actorId: affiliate._id,
      targetType: 'withdrawal',
      targetId: withdrawal._id,
      action: 'withdrawal_requested',
      details: { amount: withdrawAmount, paymentMethod },
      previousState,
      newState: {
        availableBalance: affiliate.availableBalance,
        pendingBalance: affiliate.pendingBalance
      }
    });
    
    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully! We will process it within 3-5 business days.',
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt
      }
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Failed to submit withdrawal request' });
  }
});


/**
 * PUT /api/affiliate/profile
 * Update affiliate profile
 */
router.put('/profile', authenticateAffiliate, async (req, res) => {
  try {
    const affiliate = req.affiliate;
    const { name, website, promotionMethod } = req.body;
    
    if (name) affiliate.name = name;
    if (website !== undefined) affiliate.website = website;
    if (promotionMethod !== undefined) affiliate.promotionMethod = promotionMethod;
    
    await affiliate.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      affiliate: {
        id: affiliate._id,
        name: affiliate.name,
        email: affiliate.email,
        website: affiliate.website,
        promotionMethod: affiliate.promotionMethod
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * PUT /api/affiliate/change-password
 * Change affiliate password
 */
router.put('/change-password', authenticateAffiliate, async (req, res) => {
  try {
    const affiliate = req.affiliate;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    
    const validPassword = await bcrypt.compare(currentPassword, affiliate.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    affiliate.passwordHash = await bcrypt.hash(newPassword, salt);
    await affiliate.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});


// ═══════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS (requires admin authentication)
// ═══════════════════════════════════════════════════════════════

// Admin middleware - checks for admin token AND admin role
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.log('[Affiliate Admin] No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[Affiliate Admin] Token decoded:', decoded);
    
    // Check if user has userId (logged in user from main platform)
    if (!decoded.userId) {
      console.log('[Affiliate Admin] No userId in token');
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Import User model and check if user is admin
    const { User } = await import('./authModels.js');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('[Affiliate Admin] User not found');
      return res.status(403).json({ error: 'User not found' });
    }
    
    if (!user.isAdmin) {
      console.log('[Affiliate Admin] User is not admin:', user.email);
      return res.status(403).json({ error: 'Admin access required. You do not have permission to access this page.' });
    }
    
    req.adminId = decoded.userId;
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('[Affiliate Admin] Token error:', error.message);
    res.status(403).json({ error: 'Invalid token. Please login again.' });
  }
};

/**
 * GET /api/affiliate/admin/list
 * Get all affiliates (admin)
 */
router.get('/admin/list', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = status ? { status } : {};
    
    const affiliates = await Affiliate.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Affiliate.countDocuments(query);
    
    // Get counts by status
    const statusCounts = await Affiliate.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      affiliates,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
    });
  } catch (error) {
    console.error('Admin list error:', error);
    res.status(500).json({ error: 'Failed to load affiliates' });
  }
});


/**
 * PUT /api/affiliate/admin/:id/approve
 * Approve affiliate application
 */
router.put('/admin/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { commissionPercent, adminNotes } = req.body;
    
    affiliate.status = 'approved';
    affiliate.approvedAt = new Date();
    if (commissionPercent) affiliate.commissionPercent = commissionPercent;
    if (adminNotes) affiliate.adminNotes = adminNotes;
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_approved',
      details: { commissionPercent: affiliate.commissionPercent, adminNotes }
    });
    
    res.json({ success: true, message: 'Affiliate approved successfully', affiliate });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: 'Failed to approve affiliate' });
  }
});

/**
 * PUT /api/affiliate/admin/:id/reject
 * Reject affiliate application
 */
router.put('/admin/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { reason, adminNotes } = req.body;
    
    affiliate.status = 'rejected';
    affiliate.rejectedAt = new Date();
    if (adminNotes) affiliate.adminNotes = adminNotes;
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_rejected',
      details: { reason, adminNotes }
    });
    
    res.json({ success: true, message: 'Affiliate rejected', affiliate });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ error: 'Failed to reject affiliate' });
  }
});

/**
 * PUT /api/affiliate/admin/:id/ban
 * Ban affiliate (admin)
 */
router.put('/admin/:id/ban', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { reason, adminNotes } = req.body;
    
    affiliate.status = 'banned';
    affiliate.banReason = reason;
    if (adminNotes) affiliate.adminNotes = adminNotes;
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_banned',
      details: { reason, adminNotes }
    });
    
    // Simulate ban notification email
    console.log(`
═══════════════════════════════════════════════════════════════
📧 AFFILIATE BANNED - EMAIL NOTIFICATION
═══════════════════════════════════════════════════════════════
To: ${affiliate.email}
Subject: Your Affiliate Account Has Been Banned

Dear ${affiliate.name},

Your affiliate account has been permanently banned from the Scalezix Affiliate Program.

${reason ? `Reason: ${reason}` : ''}

This decision is final. Any pending commissions have been forfeited.

If you believe this was done in error, contact support@scalezix.com.

Scalezix Team
═══════════════════════════════════════════════════════════════
    `);
    
    res.json({ success: true, message: 'Affiliate banned', affiliate });
  } catch (error) {
    console.error('Ban error:', error);
    res.status(500).json({ error: 'Failed to ban affiliate' });
  }
});

/**
 * PUT /api/affiliate/admin/:id/suspend
 * Suspend affiliate (admin)
 */
router.put('/admin/:id/suspend', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { reason, adminNotes } = req.body;
    
    affiliate.status = 'suspended';
    if (adminNotes) affiliate.adminNotes = adminNotes;
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_suspended',
      details: { reason, adminNotes }
    });
    
    res.json({ success: true, message: 'Affiliate suspended', affiliate });
  } catch (error) {
    console.error('Suspend error:', error);
    res.status(500).json({ error: 'Failed to suspend affiliate' });
  }
});

/**
 * PUT /api/affiliate/admin/:id/reactivate
 * Reactivate suspended affiliate (admin)
 */
router.put('/admin/:id/reactivate', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    if (affiliate.status === 'banned') {
      return res.status(400).json({ error: 'Cannot reactivate a banned affiliate' });
    }
    
    affiliate.status = 'approved';
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_reactivated',
      details: {}
    });
    
    res.json({ success: true, message: 'Affiliate reactivated', affiliate });
  } catch (error) {
    console.error('Reactivate error:', error);
    res.status(500).json({ error: 'Failed to reactivate affiliate' });
  }
});


/**
 * GET /api/affiliate/admin/withdrawals
 * Get all withdrawal requests (admin)
 */
router.get('/admin/withdrawals', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = status ? { status } : {};
    
    const withdrawals = await Withdrawal.find(query)
      .populate('affiliateId', 'name email slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Withdrawal.countDocuments(query);
    
    const statusCounts = await Withdrawal.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      withdrawals,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
    });
  } catch (error) {
    console.error('Admin withdrawals error:', error);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});

/**
 * PUT /api/affiliate/admin/withdrawal/:id/complete
 * Complete withdrawal (admin)
 */
router.put('/admin/withdrawal/:id/complete', authenticateAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'requested' && withdrawal.status !== 'processing') {
      return res.status(400).json({ error: 'Withdrawal cannot be completed' });
    }
    
    const { transactionId, adminNote } = req.body;
    
    const affiliate = await Affiliate.findById(withdrawal.affiliateId);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }

    
    const previousState = {
      pendingBalance: affiliate.pendingBalance,
      withdrawnBalance: affiliate.withdrawnBalance
    };
    
    // Update withdrawal
    withdrawal.status = 'completed';
    withdrawal.processedBy = req.adminId;
    withdrawal.processedAt = new Date();
    withdrawal.transactionId = transactionId;
    withdrawal.adminNote = adminNote;
    await withdrawal.save();
    
    // Update affiliate balances
    affiliate.pendingBalance -= withdrawal.amount;
    affiliate.withdrawnBalance += withdrawal.amount;
    await affiliate.save();
    
    // Update earnings status
    await InternalEarning.updateMany(
      { affiliateId: affiliate._id, status: 'locked' },
      { status: 'withdrawn' }
    );
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'withdrawal',
      targetId: withdrawal._id,
      action: 'withdrawal_completed',
      details: { amount: withdrawal.amount, transactionId, adminNote },
      previousState,
      newState: { pendingBalance: affiliate.pendingBalance, withdrawnBalance: affiliate.withdrawnBalance }
    });
    
    res.json({ success: true, message: 'Withdrawal completed successfully', withdrawal });
  } catch (error) {
    console.error('Complete withdrawal error:', error);
    res.status(500).json({ error: 'Failed to complete withdrawal' });
  }
});

/**
 * PUT /api/affiliate/admin/withdrawal/:id/reject
 * Reject withdrawal (admin)
 */
router.put('/admin/withdrawal/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'requested' && withdrawal.status !== 'processing') {
      return res.status(400).json({ error: 'Withdrawal cannot be rejected' });
    }
    
    const { reason, adminNote } = req.body;

    
    const affiliate = await Affiliate.findById(withdrawal.affiliateId);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const previousState = {
      availableBalance: affiliate.availableBalance,
      pendingBalance: affiliate.pendingBalance
    };
    
    // Update withdrawal
    withdrawal.status = 'rejected';
    withdrawal.processedBy = req.adminId;
    withdrawal.processedAt = new Date();
    withdrawal.rejectionReason = reason;
    withdrawal.adminNote = adminNote;
    await withdrawal.save();
    
    // Refund to available balance
    affiliate.pendingBalance -= withdrawal.amount;
    affiliate.availableBalance += withdrawal.amount;
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'withdrawal',
      targetId: withdrawal._id,
      action: 'withdrawal_rejected',
      details: { amount: withdrawal.amount, reason, adminNote },
      previousState,
      newState: { availableBalance: affiliate.availableBalance, pendingBalance: affiliate.pendingBalance }
    });
    
    res.json({ success: true, message: 'Withdrawal rejected and funds returned', withdrawal });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
});

/**
 * POST /api/affiliate/admin/add-earning
 * Manually add earning to affiliate (admin)
 */
router.post('/admin/add-earning', authenticateAdmin, async (req, res) => {
  try {
    const { affiliateId, revenueAmount, description, referenceId, referenceType } = req.body;
    
    const affiliate = await Affiliate.findById(affiliateId);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    if (affiliate.status !== 'approved') {
      return res.status(400).json({ error: 'Affiliate is not approved' });
    }

    
    const commissionAmount = Math.floor(revenueAmount * (affiliate.commissionPercent / 100));
    
    const earning = new InternalEarning({
      affiliateId: affiliate._id,
      revenueAmount,
      commissionAmount,
      commissionPercent: affiliate.commissionPercent,
      description,
      referenceId,
      referenceType: referenceType || 'manual',
      status: 'available'
    });
    
    await earning.save();
    
    // Update affiliate balances
    affiliate.totalEarnings += commissionAmount;
    affiliate.availableBalance += commissionAmount;
    affiliate.totalConversions += 1;
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.adminId,
      targetType: 'earning',
      targetId: earning._id,
      action: 'earning_added',
      details: { revenueAmount, commissionAmount, description }
    });
    
    res.json({
      success: true,
      message: 'Earning added successfully',
      earning,
      affiliate: {
        totalEarnings: affiliate.totalEarnings,
        availableBalance: affiliate.availableBalance
      }
    });
  } catch (error) {
    console.error('Add earning error:', error);
    res.status(500).json({ error: 'Failed to add earning' });
  }
});

/**
 * GET /api/affiliate/admin/stats
 * Get affiliate system stats (admin)
 */
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalAffiliates = await Affiliate.countDocuments();
    const approvedAffiliates = await Affiliate.countDocuments({ status: 'approved' });
    const pendingApplications = await Affiliate.countDocuments({ status: 'pending' });
    
    const totalEarnings = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);
    
    const totalWithdrawn = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$withdrawnBalance' } } }
    ]);
    
    const pendingWithdrawals = await Withdrawal.aggregate([
      { $match: { status: { $in: ['requested', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    
    const totalClicks = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$totalClicks' } } }
    ]);
    
    const totalConversions = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$totalConversions' } } }
    ]);
    
    res.json({
      totalAffiliates,
      approvedAffiliates,
      pendingApplications,
      totalEarnings: totalEarnings[0]?.total || 0,
      totalWithdrawn: totalWithdrawn[0]?.total || 0,
      pendingWithdrawals: {
        amount: pendingWithdrawals[0]?.total || 0,
        count: pendingWithdrawals[0]?.count || 0
      },
      totalClicks: totalClicks[0]?.total || 0,
      totalConversions: totalConversions[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

/**
 * GET /api/affiliate/admin/:id
 * Get single affiliate details (admin)
 */
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id).select('-passwordHash');
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const earnings = await InternalEarning.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 }).limit(20);
    
    const withdrawals = await Withdrawal.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 }).limit(10);
    
    const auditLogs = await AffiliateAuditLog.find({ targetId: affiliate._id })
      .sort({ createdAt: -1 }).limit(20);
    
    res.json({ affiliate, earnings, withdrawals, auditLogs });
  } catch (error) {
    console.error('Admin get affiliate error:', error);
    res.status(500).json({ error: 'Failed to load affiliate' });
  }
});

/**
 * POST /api/affiliate/admin/simulate-purchase
 * Simulate a purchase for testing (admin only)
 * This adds commission to the affiliate who referred the user
 */
router.post('/admin/simulate-purchase', authenticateAdmin, async (req, res) => {
  try {
    const { userEmail, planName, amount } = req.body;
    
    if (!userEmail || !amount) {
      return res.status(400).json({ error: 'userEmail and amount are required' });
    }
    
    // Import User model
    const { User } = await import('./authModels.js');
    
    // Find the user
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.referredBy) {
      return res.status(400).json({ error: 'This user was not referred by any affiliate' });
    }
    
    // Find the affiliate
    const affiliate = await Affiliate.findById(user.referredBy);
    if (!affiliate) {
      return res.status(404).json({ error: 'Referring affiliate not found' });
    }
    
    if (affiliate.status !== 'approved') {
      return res.status(400).json({ error: 'Referring affiliate is not approved' });
    }
    
    // Calculate commission (amount is in rupees, convert to paise)
    const revenueAmount = parseInt(amount) * 100; // Convert to paise
    const commissionAmount = Math.floor(revenueAmount * (affiliate.commissionPercent / 100));
    
    // Create earning record
    const earning = new InternalEarning({
      affiliateId: affiliate._id,
      revenueAmount,
      commissionAmount,
      commissionPercent: affiliate.commissionPercent,
      source: 'subscription',
      referenceId: user._id.toString(),
      referenceType: 'user_upgrade',
      description: `${planName || 'Plan'} subscription by ${user.email}`,
      status: 'available'
    });
    
    await earning.save();
    
    // Update affiliate balances
    affiliate.totalEarnings += commissionAmount;
    affiliate.availableBalance += commissionAmount;
    await affiliate.save();
    
    // Log the action
    await AffiliateAuditLog.create({
      actorType: 'system',
      actorId: req.adminId,
      targetType: 'earning',
      targetId: earning._id,
      action: 'commission_earned',
      details: {
        userEmail,
        planName,
        revenueAmount,
        commissionAmount,
        commissionPercent: affiliate.commissionPercent
      }
    });
    
    console.log(`[Affiliate] Commission added: ₹${commissionAmount/100} to ${affiliate.name} (${affiliate.slug})`);
    
    res.json({
      success: true,
      message: `Commission of ₹${(commissionAmount/100).toLocaleString()} added to affiliate ${affiliate.name}`,
      earning: {
        id: earning._id,
        revenueAmount: revenueAmount,
        commissionAmount: commissionAmount,
        affiliateName: affiliate.name,
        affiliateSlug: affiliate.slug
      }
    });
  } catch (error) {
    console.error('Simulate purchase error:', error);
    res.status(500).json({ error: 'Failed to simulate purchase' });
  }
});

/**
 * GET /api/affiliate/admin/referred-users/:affiliateId
 * Get users referred by a specific affiliate
 */
router.get('/admin/referred-users/:affiliateId', authenticateAdmin, async (req, res) => {
  try {
    const { User } = await import('./authModels.js');
    
    const users = await User.find({ referredBy: req.params.affiliateId })
      .select('name email createdAt plan isVerified')
      .sort({ createdAt: -1 });
    
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get referred users error:', error);
    res.status(500).json({ error: 'Failed to load referred users' });
  }
});

export default router;
