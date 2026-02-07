/**
 * SuperAdmin Routes - Complete Admin Control Center
 * 25+ Functionalities for Platform Management
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, OTP } from './authModels.js';
import { Affiliate, AffiliateClick, InternalEarning, Withdrawal, AffiliateAuditLog } from './affiliateModels.js';
import { WordPressSite, BulkImportJob } from './wordpressModels.js';
import { ConnectedAccount, ScheduledPost } from './socialModels.js';
import { NewsletterSubscriber, Lead, Content, Campaign, PlatformSettings } from './database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// SuperAdmin Email - Only this email can be SuperAdmin
const SUPERADMIN_EMAIL = 'harshkuhikar68@gmail.com';

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE - SuperAdmin Authentication
// ═══════════════════════════════════════════════════════════════
const authenticateSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isSuperAdmin) {
      return res.status(403).json({ error: 'SuperAdmin access required' });
    }
    
    const user = await User.findById(decoded.userId);
    
    if (!user || user.email.toLowerCase() !== SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized. SuperAdmin access only.' });
    }
    
    req.superAdmin = user;
    next();
  } catch (error) {
    console.error('[SuperAdmin] Auth error:', error.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ═══════════════════════════════════════════════════════════════
// 1. SUPERADMIN LOGIN
// ═══════════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Only allow SuperAdmin email
    if (email.toLowerCase() !== SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied. You are not authorized as SuperAdmin.' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate SuperAdmin token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isSuperAdmin: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(`[SuperAdmin] Login successful: ${email}`);
    
    res.json({
      success: true,
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 2. DASHBOARD STATS - Overview of entire platform
// ═══════════════════════════════════════════════════════════════
router.get('/stats', authenticateSuperAdmin, async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    // Users by date (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Plan distribution
    const planDistribution = {
      free: await User.countDocuments({ plan: { $in: ['free', null, undefined] } }),
      starter: await User.countDocuments({ plan: 'starter' }),
      professional: await User.countDocuments({ plan: 'professional' }),
      enterprise: await User.countDocuments({ plan: 'enterprise' })
    };
    
    // Affiliate stats
    const totalAffiliates = await Affiliate.countDocuments();
    const approvedAffiliates = await Affiliate.countDocuments({ status: 'approved' });
    const pendingAffiliates = await Affiliate.countDocuments({ status: 'pending' });
    const rejectedAffiliates = await Affiliate.countDocuments({ status: 'rejected' });
    const suspendedAffiliates = await Affiliate.countDocuments({ status: 'suspended' });
    const bannedAffiliates = await Affiliate.countDocuments({ status: 'banned' });
    
    // Financial stats
    const affiliateEarnings = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);
    const totalAffiliateEarnings = affiliateEarnings[0]?.total || 0;
    
    const withdrawnAmount = await Affiliate.aggregate([
      { $group: { _id: null, total: { $sum: '$withdrawnBalance' } } }
    ]);
    const totalWithdrawn = withdrawnAmount[0]?.total || 0;
    
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: { $in: ['requested', 'processing'] } });
    const pendingWithdrawalAmount = await Withdrawal.aggregate([
      { $match: { status: { $in: ['requested', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Click & conversion stats
    const clickStats = await Affiliate.aggregate([
      { $group: { _id: null, clicks: { $sum: '$totalClicks' }, conversions: { $sum: '$totalConversions' } } }
    ]);
    const totalClicks = clickStats[0]?.clicks || 0;
    const totalConversions = clickStats[0]?.conversions || 0;
    
    // Newsletter stats
    const newsletterSubscribers = await NewsletterSubscriber.countDocuments({ status: 'active' });
    const totalNewsletterSubscribers = await NewsletterSubscriber.countDocuments();
    
    // WordPress stats
    const wordpressSites = await WordPressSite.countDocuments();
    const bulkJobs = await BulkImportJob.countDocuments();
    const completedJobs = await BulkImportJob.countDocuments({ status: 'completed' });
    
    // Social accounts
    const socialAccounts = await ConnectedAccount.countDocuments({ connected: true });
    
    // Recent users
    const recentUsers = await User.find()
      .select('name email isVerified plan createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Recent affiliates
    const recentAffiliates = await Affiliate.find()
      .select('name email status slug totalEarnings createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Top affiliates by earnings
    const topAffiliates = await Affiliate.find({ status: 'approved' })
      .select('name email slug totalEarnings totalClicks totalConversions')
      .sort({ totalEarnings: -1 })
      .limit(5);
    
    res.json({
      // User stats
      totalUsers,
      verifiedUsers,
      adminUsers,
      newUsersThisMonth,
      planDistribution,
      
      // Affiliate stats
      totalAffiliates,
      approvedAffiliates,
      pendingAffiliates,
      rejectedAffiliates,
      suspendedAffiliates,
      bannedAffiliates,
      
      // Financial stats
      totalAffiliateEarnings,
      totalWithdrawn,
      pendingWithdrawals,
      pendingWithdrawalAmount: pendingWithdrawalAmount[0]?.total || 0,
      
      // Performance stats
      totalClicks,
      totalConversions,
      conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0,
      
      // Other stats
      newsletterSubscribers,
      totalNewsletterSubscribers,
      wordpressSites,
      bulkJobs,
      completedJobs,
      socialAccounts,
      
      // Recent data
      recentUsers,
      recentAffiliates,
      topAffiliates
    });
  } catch (error) {
    console.error('[SuperAdmin] Stats error:', error);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 3-7. USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// 3. Get all users with filters
router.get('/users', authenticateSuperAdmin, async (req, res) => {
  try {
    const { filter = 'all', page = 1, limit = 20, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    
    if (filter === 'verified') query.isVerified = true;
    else if (filter === 'unverified') query.isVerified = false;
    else if (filter === 'admin') query.isAdmin = true;
    else if (filter === 'blocked') query.isBlocked = true;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Get users error:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// 4. Get single user details
router.get('/users/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetToken -resetTokenExpiry');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's WordPress sites
    const wordpressSites = await WordPressSite.find({ userId: user._id });
    
    // Get user's social accounts
    const socialAccounts = await ConnectedAccount.find({ userId: user._id });
    
    // Get user's bulk jobs
    const bulkJobs = await BulkImportJob.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    
    // Check if referred by affiliate
    let referredBy = null;
    if (user.referredBy) {
      referredBy = await Affiliate.findById(user.referredBy).select('name email slug');
    }
    
    res.json({
      user,
      wordpressSites,
      socialAccounts,
      bulkJobs,
      referredBy
    });
  } catch (error) {
    console.error('[SuperAdmin] Get user error:', error);
    res.status(500).json({ error: 'Failed to load user' });
  }
});

// 5. Verify user manually
router.put('/users/:id/verify', authenticateSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isVerified = true;
    await user.save();
    
    // Delete any pending OTPs
    await OTP.deleteMany({ email: user.email });
    
    console.log(`[SuperAdmin] User verified: ${user.email}`);
    
    res.json({ success: true, message: 'User verified successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// 6. Toggle admin status
router.put('/users/:id/admin', authenticateSuperAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent removing SuperAdmin's admin status
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() && !isAdmin) {
      return res.status(400).json({ error: 'Cannot remove SuperAdmin privileges' });
    }
    
    user.isAdmin = isAdmin;
    await user.save();
    
    console.log(`[SuperAdmin] Admin status updated for ${user.email}: ${isAdmin}`);
    
    res.json({ success: true, message: `User ${isAdmin ? 'promoted to' : 'removed from'} admin` });
  } catch (error) {
    console.error('[SuperAdmin] Toggle admin error:', error);
    res.status(500).json({ error: 'Failed to update admin status' });
  }
});

// 7. Delete user
router.delete('/users/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent deleting SuperAdmin
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot delete SuperAdmin account' });
    }
    
    // Delete related data
    await OTP.deleteMany({ email: user.email });
    await WordPressSite.deleteMany({ userId: user._id });
    await ConnectedAccount.deleteMany({ userId: user._id });
    await ScheduledPost.deleteMany({ userId: user._id });
    await BulkImportJob.deleteMany({ userId: user._id });
    
    await User.findByIdAndDelete(req.params.id);
    
    console.log(`[SuperAdmin] User deleted: ${user.email}`);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update user plan
router.put('/users/:id/plan', authenticateSuperAdmin, async (req, res) => {
  try {
    const { plan, planExpiry } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.plan = plan;
    if (planExpiry) user.planExpiry = new Date(planExpiry);
    await user.save();
    
    console.log(`[SuperAdmin] Plan updated for ${user.email}: ${plan}`);
    
    res.json({ success: true, message: 'Plan updated successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Block user - Prevents user from logging in
router.put('/users/:id/block', authenticateSuperAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent blocking SuperAdmin
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot block SuperAdmin account' });
    }
    
    user.isBlocked = true;
    user.blockedAt = new Date();
    user.blockedReason = reason || 'Blocked by SuperAdmin';
    await user.save();
    
    console.log(`[SuperAdmin] User blocked: ${user.email} - Reason: ${reason || 'No reason provided'}`);
    
    // Send block notification email
    try {
      const { sendEmail } = await import('./emailService.js');
      await sendEmail(
        user.email,
        'Account Blocked - Scalezix AI Tool',
        `<p>Dear ${user.name},</p>
        <p>Your account has been blocked by the administrator.</p>
        <p><strong>Reason:</strong> ${reason || 'Violation of terms of service'}</p>
        <p>If you believe this is a mistake, please contact support at support@scalezix.com</p>
        <p>Best regards,<br>Scalezix Team</p>`
      );
    } catch (emailErr) {
      console.error('[SuperAdmin] Block email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock user - Allows user to login again
router.put('/users/:id/unblock', authenticateSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.isBlocked) {
      return res.status(400).json({ error: 'User is not blocked' });
    }
    
    user.isBlocked = false;
    user.blockedAt = null;
    user.blockedReason = null;
    await user.save();
    
    console.log(`[SuperAdmin] User unblocked: ${user.email}`);
    
    // Send unblock notification email
    try {
      const { sendEmail } = await import('./emailService.js');
      await sendEmail(
        user.email,
        'Account Unblocked - Scalezix AI Tool',
        `<p>Dear ${user.name},</p>
        <p>Great news! Your account has been unblocked and you can now login again.</p>
        <p>We appreciate your patience and understanding.</p>
        <p>Best regards,<br>Scalezix Team</p>`
      );
    } catch (emailErr) {
      console.error('[SuperAdmin] Unblock email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});


// ═══════════════════════════════════════════════════════════════
// 8-12. AFFILIATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// 8. Get all affiliates with filters
router.get('/affiliates', authenticateSuperAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (status && status !== 'all') query.status = status;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    const affiliates = await Affiliate.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Affiliate.countDocuments(query);
    
    // Get status counts
    const statusCounts = {
      all: await Affiliate.countDocuments(),
      pending: await Affiliate.countDocuments({ status: 'pending' }),
      approved: await Affiliate.countDocuments({ status: 'approved' }),
      rejected: await Affiliate.countDocuments({ status: 'rejected' }),
      suspended: await Affiliate.countDocuments({ status: 'suspended' }),
      banned: await Affiliate.countDocuments({ status: 'banned' })
    };
    
    res.json({
      affiliates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      statusCounts
    });
  } catch (error) {
    console.error('[SuperAdmin] Get affiliates error:', error);
    res.status(500).json({ error: 'Failed to load affiliates' });
  }
});

// 9. Get single affiliate details
router.get('/affiliates/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id).select('-passwordHash');
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    // Get earnings
    const earnings = await InternalEarning.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Get withdrawals
    const withdrawals = await Withdrawal.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get referred users
    const referredUsers = await User.find({ referredBy: affiliate._id })
      .select('name email plan isVerified createdAt')
      .sort({ createdAt: -1 });
    
    // Get click stats (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const clickStats = await AffiliateClick.aggregate([
      { $match: { affiliateId: affiliate._id, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get audit logs
    const auditLogs = await AffiliateAuditLog.find({ targetId: affiliate._id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      affiliate,
      earnings,
      withdrawals,
      referredUsers,
      clickStats,
      auditLogs
    });
  } catch (error) {
    console.error('[SuperAdmin] Get affiliate error:', error);
    res.status(500).json({ error: 'Failed to load affiliate' });
  }
});

// 10. Approve affiliate
router.put('/affiliates/:id/approve', authenticateSuperAdmin, async (req, res) => {
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
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_approved',
      details: { commissionPercent: affiliate.commissionPercent, adminNotes }
    });
    
    // Send approval email
    try {
      const { sendAffiliateApprovedEmail } = await import('./emailService.js');
      await sendAffiliateApprovedEmail(affiliate.email, affiliate.name, affiliate.slug, affiliate.commissionPercent);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Affiliate approved successfully', affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Approve error:', error);
    res.status(500).json({ error: 'Failed to approve affiliate' });
  }
});

// 11. Reject affiliate
router.put('/affiliates/:id/reject', authenticateSuperAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { reason, adminNotes } = req.body;
    
    affiliate.status = 'rejected';
    affiliate.rejectedAt = new Date();
    affiliate.rejectionReason = reason;
    if (adminNotes) affiliate.adminNotes = adminNotes;
    
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_rejected',
      details: { reason, adminNotes }
    });
    
    // Send rejection email
    try {
      const { sendAffiliateRejectedEmail } = await import('./emailService.js');
      await sendAffiliateRejectedEmail(affiliate.email, affiliate.name, reason);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Affiliate rejected', affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Reject error:', error);
    res.status(500).json({ error: 'Failed to reject affiliate' });
  }
});

// 12. Suspend affiliate
router.put('/affiliates/:id/suspend', authenticateSuperAdmin, async (req, res) => {
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
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_suspended',
      details: { reason, adminNotes }
    });
    
    // Send suspension email
    try {
      const { sendAffiliateSuspendedEmail } = await import('./emailService.js');
      await sendAffiliateSuspendedEmail(affiliate.email, affiliate.name, reason);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Affiliate suspended', affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Suspend error:', error);
    res.status(500).json({ error: 'Failed to suspend affiliate' });
  }
});

// 13. Ban affiliate
router.put('/affiliates/:id/ban', authenticateSuperAdmin, async (req, res) => {
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
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_banned',
      details: { reason, adminNotes }
    });
    
    // Send ban email
    try {
      const { sendAffiliateBannedEmail } = await import('./emailService.js');
      await sendAffiliateBannedEmail(affiliate.email, affiliate.name, reason);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Affiliate banned', affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Ban error:', error);
    res.status(500).json({ error: 'Failed to ban affiliate' });
  }
});

// 14. Reactivate affiliate
router.put('/affiliates/:id/reactivate', authenticateSuperAdmin, async (req, res) => {
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
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'affiliate_reactivated',
      details: {}
    });
    
    res.json({ success: true, message: 'Affiliate reactivated', affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Reactivate error:', error);
    res.status(500).json({ error: 'Failed to reactivate affiliate' });
  }
});

// 15. Add manual earning to affiliate
router.post('/affiliates/:id/add-earning', authenticateSuperAdmin, async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    const { amount, description } = req.body;
    const amountInPaise = parseInt(amount) * 100;
    
    const earning = new InternalEarning({
      affiliateId: affiliate._id,
      revenueAmount: amountInPaise,
      commissionAmount: amountInPaise,
      commissionPercent: 100,
      description: description || 'Manual earning added by SuperAdmin',
      referenceType: 'manual',
      status: 'available'
    });
    
    await earning.save();
    
    affiliate.totalEarnings += amountInPaise;
    affiliate.availableBalance += amountInPaise;
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.superAdmin._id,
      targetType: 'earning',
      targetId: earning._id,
      action: 'earning_added',
      details: { amount: amountInPaise, description }
    });
    
    res.json({ success: true, message: `₹${amount} added to affiliate balance`, earning });
  } catch (error) {
    console.error('[SuperAdmin] Add earning error:', error);
    res.status(500).json({ error: 'Failed to add earning' });
  }
});


// ═══════════════════════════════════════════════════════════════
// 16-19. WITHDRAWAL MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// 16. Get all withdrawals
router.get('/withdrawals', authenticateSuperAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (status && status !== 'all') query.status = status;
    
    const withdrawals = await Withdrawal.find(query)
      .populate('affiliateId', 'name email slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Withdrawal.countDocuments(query);
    
    const statusCounts = {
      all: await Withdrawal.countDocuments(),
      requested: await Withdrawal.countDocuments({ status: 'requested' }),
      processing: await Withdrawal.countDocuments({ status: 'processing' }),
      completed: await Withdrawal.countDocuments({ status: 'completed' }),
      rejected: await Withdrawal.countDocuments({ status: 'rejected' })
    };
    
    res.json({
      withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      statusCounts
    });
  } catch (error) {
    console.error('[SuperAdmin] Get withdrawals error:', error);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});

// 17. Complete withdrawal
router.put('/withdrawals/:id/complete', authenticateSuperAdmin, async (req, res) => {
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
    
    withdrawal.status = 'completed';
    withdrawal.processedBy = req.superAdmin._id;
    withdrawal.processedAt = new Date();
    withdrawal.transactionId = transactionId;
    withdrawal.adminNote = adminNote;
    await withdrawal.save();
    
    affiliate.pendingBalance -= withdrawal.amount;
    affiliate.withdrawnBalance += withdrawal.amount;
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.superAdmin._id,
      targetType: 'withdrawal',
      targetId: withdrawal._id,
      action: 'withdrawal_completed',
      details: { amount: withdrawal.amount, transactionId, adminNote }
    });
    
    // Send completion email
    try {
      const { sendAffiliateWithdrawalCompletedEmail } = await import('./emailService.js');
      await sendAffiliateWithdrawalCompletedEmail(affiliate.email, affiliate.name, withdrawal.amount, transactionId);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Withdrawal completed', withdrawal });
  } catch (error) {
    console.error('[SuperAdmin] Complete withdrawal error:', error);
    res.status(500).json({ error: 'Failed to complete withdrawal' });
  }
});

// 18. Reject withdrawal
router.put('/withdrawals/:id/reject', authenticateSuperAdmin, async (req, res) => {
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
    
    withdrawal.status = 'rejected';
    withdrawal.processedBy = req.superAdmin._id;
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
      actorId: req.superAdmin._id,
      targetType: 'withdrawal',
      targetId: withdrawal._id,
      action: 'withdrawal_rejected',
      details: { amount: withdrawal.amount, reason, adminNote }
    });
    
    // Send rejection email
    try {
      const { sendAffiliateWithdrawalRejectedEmail } = await import('./emailService.js');
      await sendAffiliateWithdrawalRejectedEmail(affiliate.email, affiliate.name, withdrawal.amount, reason);
    } catch (emailErr) {
      console.error('[SuperAdmin] Email error:', emailErr.message);
    }
    
    res.json({ success: true, message: 'Withdrawal rejected and funds returned', withdrawal });
  } catch (error) {
    console.error('[SuperAdmin] Reject withdrawal error:', error);
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
});

// 19. Mark withdrawal as processing
router.put('/withdrawals/:id/processing', authenticateSuperAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }
    
    if (withdrawal.status !== 'requested') {
      return res.status(400).json({ error: 'Only requested withdrawals can be marked as processing' });
    }
    
    withdrawal.status = 'processing';
    await withdrawal.save();
    
    res.json({ success: true, message: 'Withdrawal marked as processing', withdrawal });
  } catch (error) {
    console.error('[SuperAdmin] Processing error:', error);
    res.status(500).json({ error: 'Failed to update withdrawal' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 20-22. NEWSLETTER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// 20. Get all newsletter subscribers
router.get('/newsletter/subscribers', authenticateSuperAdmin, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (status !== 'all') query.status = status;
    
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await NewsletterSubscriber.countDocuments(query);
    
    res.json({
      subscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      counts: {
        total: await NewsletterSubscriber.countDocuments(),
        active: await NewsletterSubscriber.countDocuments({ status: 'active' }),
        unsubscribed: await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' })
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Get subscribers error:', error);
    res.status(500).json({ error: 'Failed to load subscribers' });
  }
});

// 21. Add subscriber manually
router.post('/newsletter/subscribers', authenticateSuperAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        existing.subscribedAt = new Date();
        await existing.save();
        return res.json({ success: true, message: 'Subscriber reactivated' });
      }
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      source: 'admin',
      status: 'active'
    });
    await subscriber.save();
    
    res.json({ success: true, message: 'Subscriber added', subscriber });
  } catch (error) {
    console.error('[SuperAdmin] Add subscriber error:', error);
    res.status(500).json({ error: 'Failed to add subscriber' });
  }
});

// 22. Send newsletter to all subscribers
router.post('/newsletter/send', authenticateSuperAdmin, async (req, res) => {
  try {
    const { subject, headline, body, ctaText, ctaUrl } = req.body;
    
    if (!subject || !headline || !body) {
      return res.status(400).json({ error: 'Subject, headline, and body are required' });
    }
    
    const subscribers = await NewsletterSubscriber.find({ status: 'active' });
    
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'No active subscribers' });
    }
    
    const emails = subscribers.map(s => s.email);
    
    // Send promotional email
    try {
      const { sendPromotionalEmail } = await import('./emailService.js');
      await sendPromotionalEmail(emails, subject, headline, body, ctaText || 'Learn More', ctaUrl || 'https://aiblog.scalezix.com');
    } catch (emailErr) {
      console.error('[SuperAdmin] Newsletter send error:', emailErr.message);
      return res.status(500).json({ error: 'Failed to send newsletter' });
    }
    
    console.log(`[SuperAdmin] Newsletter sent to ${emails.length} subscribers`);
    
    res.json({ success: true, message: `Newsletter sent to ${emails.length} subscribers` });
  } catch (error) {
    console.error('[SuperAdmin] Send newsletter error:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// Delete subscriber
router.delete('/newsletter/subscribers/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    console.error('[SuperAdmin] Delete subscriber error:', error);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});


// ═══════════════════════════════════════════════════════════════
// 23-25. WORDPRESS & CONTENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// 23. Get all WordPress sites
router.get('/wordpress/sites', authenticateSuperAdmin, async (req, res) => {
  try {
    const sites = await WordPressSite.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ sites, count: sites.length });
  } catch (error) {
    console.error('[SuperAdmin] Get WP sites error:', error);
    res.status(500).json({ error: 'Failed to load WordPress sites' });
  }
});

// 24. Get all bulk import jobs
router.get('/wordpress/jobs', authenticateSuperAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (status && status !== 'all') query.status = status;
    
    const jobs = await BulkImportJob.find(query)
      .populate('userId', 'name email')
      .populate('wordpressSiteId', 'siteName siteUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await BulkImportJob.countDocuments(query);
    
    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      counts: {
        total: await BulkImportJob.countDocuments(),
        pending: await BulkImportJob.countDocuments({ status: 'pending' }),
        processing: await BulkImportJob.countDocuments({ status: 'processing' }),
        completed: await BulkImportJob.countDocuments({ status: 'completed' }),
        failed: await BulkImportJob.countDocuments({ status: 'failed' })
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Get WP jobs error:', error);
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

// 25. Get job details
router.get('/wordpress/jobs/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    const job = await BulkImportJob.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('wordpressSiteId', 'siteName siteUrl');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ job });
  } catch (error) {
    console.error('[SuperAdmin] Get job error:', error);
    res.status(500).json({ error: 'Failed to load job' });
  }
});

// Delete job
router.delete('/wordpress/jobs/:id', authenticateSuperAdmin, async (req, res) => {
  try {
    await BulkImportJob.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('[SuperAdmin] Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 26-28. ACTIVITY & ANALYTICS
// ═══════════════════════════════════════════════════════════════

// 26. Get activity logs
router.get('/activity', authenticateSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (action) query.action = action;
    
    const logs = await AffiliateAuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AffiliateAuditLog.countDocuments(query);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] Get activity error:', error);
    res.status(500).json({ error: 'Failed to load activity' });
  }
});

// 27. Get analytics data
router.get('/analytics', authenticateSuperAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // User signups over time
    const userSignups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Affiliate signups over time
    const affiliateSignups = await Affiliate.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Clicks over time
    const clicks = await AffiliateClick.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Earnings over time
    const earnings = await InternalEarning.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$commissionAmount' } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Newsletter signups over time
    const newsletterSignups = await NewsletterSubscriber.aggregate([
      { $match: { subscribedAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscribedAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      userSignups,
      affiliateSignups,
      clicks,
      earnings,
      newsletterSignups
    });
  } catch (error) {
    console.error('[SuperAdmin] Get analytics error:', error);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// 28. Export data
router.get('/export/:type', authenticateSuperAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    
    switch (type) {
      case 'users':
        data = await User.find().select('-password -resetToken -resetTokenExpiry').lean();
        break;
      case 'affiliates':
        data = await Affiliate.find().select('-passwordHash').lean();
        break;
      case 'withdrawals':
        data = await Withdrawal.find().populate('affiliateId', 'name email').lean();
        break;
      case 'newsletter':
        data = await NewsletterSubscriber.find().lean();
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    res.json({ data, count: data.length, exportedAt: new Date() });
  } catch (error) {
    console.error('[SuperAdmin] Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ═══════════════════════════════════════════════════════════════
// 29-30. SYSTEM SETTINGS & MISC
// ═══════════════════════════════════════════════════════════════

// 29. Get system info
router.get('/system', authenticateSuperAdmin, async (req, res) => {
  try {
    const dbStats = {
      users: await User.countDocuments(),
      affiliates: await Affiliate.countDocuments(),
      withdrawals: await Withdrawal.countDocuments(),
      clicks: await AffiliateClick.countDocuments(),
      earnings: await InternalEarning.countDocuments(),
      wordpressSites: await WordPressSite.countDocuments(),
      bulkJobs: await BulkImportJob.countDocuments(),
      socialAccounts: await ConnectedAccount.countDocuments(),
      newsletterSubscribers: await NewsletterSubscriber.countDocuments()
    };
    
    res.json({
      dbStats,
      serverTime: new Date(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('[SuperAdmin] System info error:', error);
    res.status(500).json({ error: 'Failed to load system info' });
  }
});

// 30. Verify SuperAdmin token
router.get('/verify', authenticateSuperAdmin, async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.superAdmin._id,
      name: req.superAdmin.name,
      email: req.superAdmin.email
    }
  });
});

export default router;


// ═══════════════════════════════════════════════════════════════
// ADDITIONAL IMPROVEMENTS - Affiliate Tracking & More
// ═══════════════════════════════════════════════════════════════

// Get all referred users (users who signed up via affiliate links)
router.get('/referred-users', authenticateSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, affiliateId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { referredBy: { $exists: true, $ne: null } };
    if (affiliateId) query.referredBy = affiliateId;
    
    const users = await User.find(query)
      .select('name email plan isVerified createdAt lastLogin referredBy')
      .populate('referredBy', 'name email slug totalEarnings')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    // Get affiliate breakdown
    const affiliateBreakdown = await User.aggregate([
      { $match: { referredBy: { $exists: true, $ne: null } } },
      { $group: { _id: '$referredBy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate affiliate names
    const affiliateIds = affiliateBreakdown.map(a => a._id);
    const affiliates = await Affiliate.find({ _id: { $in: affiliateIds } }).select('name email slug');
    const affiliateMap = {};
    affiliates.forEach(a => { affiliateMap[a._id.toString()] = a; });
    
    const topAffiliatesByReferrals = affiliateBreakdown.map(a => ({
      affiliate: affiliateMap[a._id.toString()],
      referralCount: a.count
    }));
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      totalReferredUsers: total,
      topAffiliatesByReferrals
    });
  } catch (error) {
    console.error('[SuperAdmin] Get referred users error:', error);
    res.status(500).json({ error: 'Failed to load referred users' });
  }
});

// Get affiliate performance report
router.get('/affiliate-performance', authenticateSuperAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // Get all approved affiliates with their stats
    const affiliates = await Affiliate.find({ status: 'approved' })
      .select('name email slug totalClicks totalConversions totalEarnings availableBalance withdrawnBalance createdAt')
      .sort({ totalEarnings: -1 });
    
    // Get referred users count for each affiliate
    const referralCounts = await User.aggregate([
      { $match: { referredBy: { $exists: true, $ne: null } } },
      { $group: { _id: '$referredBy', count: { $sum: 1 } } }
    ]);
    
    const referralMap = {};
    referralCounts.forEach(r => { referralMap[r._id.toString()] = r.count; });
    
    // Combine data
    const performance = affiliates.map(aff => ({
      id: aff._id,
      name: aff.name,
      email: aff.email,
      slug: aff.slug,
      totalClicks: aff.totalClicks,
      totalConversions: aff.totalConversions,
      referredUsers: referralMap[aff._id.toString()] || 0,
      totalEarnings: aff.totalEarnings,
      availableBalance: aff.availableBalance,
      withdrawnBalance: aff.withdrawnBalance,
      conversionRate: aff.totalClicks > 0 ? ((aff.totalConversions / aff.totalClicks) * 100).toFixed(2) : 0,
      joinedAt: aff.createdAt
    }));
    
    // Summary stats
    const summary = {
      totalAffiliates: affiliates.length,
      totalClicks: affiliates.reduce((sum, a) => sum + a.totalClicks, 0),
      totalConversions: affiliates.reduce((sum, a) => sum + a.totalConversions, 0),
      totalReferredUsers: Object.values(referralMap).reduce((sum, c) => sum + c, 0),
      totalEarnings: affiliates.reduce((sum, a) => sum + a.totalEarnings, 0),
      totalWithdrawn: affiliates.reduce((sum, a) => sum + a.withdrawnBalance, 0)
    };
    
    res.json({ performance, summary });
  } catch (error) {
    console.error('[SuperAdmin] Affiliate performance error:', error);
    res.status(500).json({ error: 'Failed to load performance data' });
  }
});

// Bulk approve affiliates
router.post('/affiliates/bulk-approve', authenticateSuperAdmin, async (req, res) => {
  try {
    const { affiliateIds, commissionPercent = 20 } = req.body;
    
    if (!affiliateIds || !Array.isArray(affiliateIds) || affiliateIds.length === 0) {
      return res.status(400).json({ error: 'Affiliate IDs are required' });
    }
    
    const result = await Affiliate.updateMany(
      { _id: { $in: affiliateIds }, status: 'pending' },
      { 
        $set: { 
          status: 'approved', 
          approvedAt: new Date(),
          commissionPercent 
        } 
      }
    );
    
    // Send approval emails
    const affiliates = await Affiliate.find({ _id: { $in: affiliateIds } });
    for (const affiliate of affiliates) {
      try {
        const { sendAffiliateApprovedEmail } = await import('./emailService.js');
        await sendAffiliateApprovedEmail(affiliate.email, affiliate.name, affiliate.slug, commissionPercent);
      } catch (emailErr) {
        console.error('[SuperAdmin] Email error:', emailErr.message);
      }
    }
    
    res.json({ success: true, message: `${result.modifiedCount} affiliates approved`, count: result.modifiedCount });
  } catch (error) {
    console.error('[SuperAdmin] Bulk approve error:', error);
    res.status(500).json({ error: 'Failed to bulk approve' });
  }
});

// Bulk reject affiliates
router.post('/affiliates/bulk-reject', authenticateSuperAdmin, async (req, res) => {
  try {
    const { affiliateIds, reason } = req.body;
    
    if (!affiliateIds || !Array.isArray(affiliateIds) || affiliateIds.length === 0) {
      return res.status(400).json({ error: 'Affiliate IDs are required' });
    }
    
    const result = await Affiliate.updateMany(
      { _id: { $in: affiliateIds }, status: 'pending' },
      { 
        $set: { 
          status: 'rejected', 
          rejectedAt: new Date(),
          rejectionReason: reason || 'Application did not meet our requirements'
        } 
      }
    );
    
    // Send rejection emails
    const affiliates = await Affiliate.find({ _id: { $in: affiliateIds } });
    for (const affiliate of affiliates) {
      try {
        const { sendAffiliateRejectedEmail } = await import('./emailService.js');
        await sendAffiliateRejectedEmail(affiliate.email, affiliate.name, reason);
      } catch (emailErr) {
        console.error('[SuperAdmin] Email error:', emailErr.message);
      }
    }
    
    res.json({ success: true, message: `${result.modifiedCount} affiliates rejected`, count: result.modifiedCount });
  } catch (error) {
    console.error('[SuperAdmin] Bulk reject error:', error);
    res.status(500).json({ error: 'Failed to bulk reject' });
  }
});

// Get user growth analytics
router.get('/user-growth', authenticateSuperAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // Daily user signups
    const dailySignups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          referred: { $sum: { $cond: [{ $ne: ['$referredBy', null] }, 1, 0] } }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Plan distribution over time
    const planStats = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);
    
    // Verification rate
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const verificationRate = totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0;
    
    // Referral rate
    const referredUsers = await User.countDocuments({ referredBy: { $exists: true, $ne: null } });
    const referralRate = totalUsers > 0 ? ((referredUsers / totalUsers) * 100).toFixed(2) : 0;
    
    res.json({
      dailySignups,
      planStats,
      summary: {
        totalUsers,
        verifiedUsers,
        verificationRate,
        referredUsers,
        referralRate
      }
    });
  } catch (error) {
    console.error('[SuperAdmin] User growth error:', error);
    res.status(500).json({ error: 'Failed to load user growth data' });
  }
});

// Send email to specific user
router.post('/send-email', authenticateSuperAdmin, async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message are required' });
    }
    
    const { sendEmail } = await import('./emailService.js');
    await sendEmail(email, subject, `<p>${message.replace(/\n/g, '<br>')}</p>`);
    
    console.log(`[SuperAdmin] Email sent to ${email}: ${subject}`);
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('[SuperAdmin] Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get click analytics for affiliates
router.get('/click-analytics', authenticateSuperAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // Daily clicks
    const dailyClicks = await AffiliateClick.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          converted: { $sum: { $cond: ['$converted', 1, 0] } }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top pages
    const topPages = await AffiliateClick.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Clicks by affiliate
    const clicksByAffiliate = await AffiliateClick.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$affiliateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate affiliate names
    const affiliateIds = clicksByAffiliate.map(c => c._id);
    const affiliates = await Affiliate.find({ _id: { $in: affiliateIds } }).select('name slug');
    const affiliateMap = {};
    affiliates.forEach(a => { affiliateMap[a._id.toString()] = a; });
    
    const topAffiliatesByClicks = clicksByAffiliate.map(c => ({
      affiliate: affiliateMap[c._id?.toString()],
      clicks: c.count
    }));
    
    res.json({
      dailyClicks,
      topPages,
      topAffiliatesByClicks,
      totalClicks: dailyClicks.reduce((sum, d) => sum + d.total, 0),
      totalConversions: dailyClicks.reduce((sum, d) => sum + d.converted, 0)
    });
  } catch (error) {
    console.error('[SuperAdmin] Click analytics error:', error);
    res.status(500).json({ error: 'Failed to load click analytics' });
  }
});

// Update affiliate commission
router.put('/affiliates/:id/commission', authenticateSuperAdmin, async (req, res) => {
  try {
    const { commissionPercent } = req.body;
    
    if (commissionPercent < 0 || commissionPercent > 100) {
      return res.status(400).json({ error: 'Commission must be between 0 and 100' });
    }
    
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate not found' });
    }
    
    affiliate.commissionPercent = commissionPercent;
    await affiliate.save();
    
    await AffiliateAuditLog.create({
      actorType: 'admin',
      actorId: req.superAdmin._id,
      targetType: 'affiliate',
      targetId: affiliate._id,
      action: 'commission_updated',
      details: { commissionPercent }
    });
    
    res.json({ success: true, message: `Commission updated to ${commissionPercent}%`, affiliate });
  } catch (error) {
    console.error('[SuperAdmin] Update commission error:', error);
    res.status(500).json({ error: 'Failed to update commission' });
  }
});

// Get revenue analytics
router.get('/revenue-analytics', authenticateSuperAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // Daily earnings
    const dailyEarnings = await InternalEarning.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$revenueAmount' },
          commission: { $sum: '$commissionAmount' }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Total stats
    const totalRevenue = await InternalEarning.aggregate([
      { $group: { _id: null, revenue: { $sum: '$revenueAmount' }, commission: { $sum: '$commissionAmount' } } }
    ]);
    
    // Withdrawals
    const withdrawalStats = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    res.json({
      dailyEarnings,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalCommission: totalRevenue[0]?.commission || 0,
      totalWithdrawn: withdrawalStats[0]?.total || 0,
      withdrawalCount: withdrawalStats[0]?.count || 0
    });
  } catch (error) {
    console.error('[SuperAdmin] Revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to load revenue analytics' });
  }
});


// ═══════════════════════════════════════════════════════════════
// PLATFORM SETTINGS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// Get platform settings
router.get('/settings', authenticateSuperAdmin, async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne({ key: 'main' });
    
    // Create default settings if not exists
    if (!settings) {
      settings = await PlatformSettings.create({
        key: 'main',
        commissionRate: 20,
        cookieDuration: 30,
        minimumWithdrawal: 50000,
        maintenanceMode: false,
        maintenanceMessage: 'We are currently performing maintenance. Please check back soon.'
      });
    }
    
    res.json({ settings });
  } catch (error) {
    console.error('[SuperAdmin] Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Update platform settings
router.put('/settings', authenticateSuperAdmin, async (req, res) => {
  try {
    const { commissionRate, cookieDuration, minimumWithdrawal, maintenanceMode, maintenanceMessage } = req.body;
    
    let settings = await PlatformSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = new PlatformSettings({ key: 'main' });
    }
    
    // Update fields if provided
    if (commissionRate !== undefined) {
      if (commissionRate < 1 || commissionRate > 100) {
        return res.status(400).json({ error: 'Commission rate must be between 1 and 100' });
      }
      settings.commissionRate = commissionRate;
    }
    
    if (cookieDuration !== undefined) {
      if (cookieDuration < 1 || cookieDuration > 365) {
        return res.status(400).json({ error: 'Cookie duration must be between 1 and 365 days' });
      }
      settings.cookieDuration = cookieDuration;
    }
    
    if (minimumWithdrawal !== undefined) {
      if (minimumWithdrawal < 1000) {
        return res.status(400).json({ error: 'Minimum withdrawal must be at least ₹10 (1000 paise)' });
      }
      settings.minimumWithdrawal = minimumWithdrawal;
    }
    
    if (maintenanceMode !== undefined) {
      settings.maintenanceMode = maintenanceMode;
    }
    
    if (maintenanceMessage !== undefined) {
      settings.maintenanceMessage = maintenanceMessage;
    }
    
    settings.updatedAt = new Date();
    settings.updatedBy = req.superAdmin._id;
    
    await settings.save();
    
    console.log(`[SuperAdmin] Settings updated by ${req.superAdmin.email}`);
    
    res.json({ success: true, message: 'Settings saved successfully', settings });
  } catch (error) {
    console.error('[SuperAdmin] Update settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Clear activity logs
router.delete('/activity/clear', authenticateSuperAdmin, async (req, res) => {
  try {
    const result = await AffiliateAuditLog.deleteMany({});
    console.log(`[SuperAdmin] Cleared ${result.deletedCount} activity logs`);
    res.json({ success: true, message: `Cleared ${result.deletedCount} activity logs` });
  } catch (error) {
    console.error('[SuperAdmin] Clear logs error:', error);
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

// Get blocked users
router.get('/users/blocked', authenticateSuperAdmin, async (req, res) => {
  try {
    const blockedUsers = await User.find({ isBlocked: true })
      .select('name email blockedAt blockedReason createdAt')
      .sort({ blockedAt: -1 });
    
    res.json({ users: blockedUsers, count: blockedUsers.length });
  } catch (error) {
    console.error('[SuperAdmin] Get blocked users error:', error);
    res.status(500).json({ error: 'Failed to load blocked users' });
  }
});
