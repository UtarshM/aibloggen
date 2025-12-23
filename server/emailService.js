/**
 * Scalezix AI Tool - Professional Email Service
 * Complete email system for all notifications
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import nodemailer from 'nodemailer';

// Configuration
const BRAND_NAME = 'Scalezix AI Tool';
const BRAND_COLOR = '#667eea';
const BRAND_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const LOGO_URL = 'https://aiblog.scalezix.com/scalezix_logo.png';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://aiblog.scalezix.com';
const SUPPORT_EMAIL = 'support@scalezix.com';

// Email transporter setup
let transporter;
let useBrevo = false;

console.log('[EMAIL] Initializing Scalezix Email Service...');
console.log('[EMAIL] BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'SET' : 'NOT SET');

if (process.env.BREVO_API_KEY) {
  useBrevo = true;
  console.log('✅ Email Service: Brevo HTTP API configured');
} else {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
  console.log('✅ Email Service: Gmail SMTP configured');
}

// Verify transporter
if (transporter) {
  transporter.verify((error) => {
    if (error) console.log('⚠️ Email service error:', error.message);
    else console.log('✅ Email service ready');
  });
}

// ═══════════════════════════════════════════════════════════════
// EMAIL TEMPLATE - Professional Scalezix Design
// ═══════════════════════════════════════════════════════════════
function getEmailTemplate(content, preheader = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; height: 0; width: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: ${BRAND_GRADIENT}; padding: 30px 20px; text-align: center; }
    .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1d1d1f; margin: 0 0 20px 0; font-size: 22px; }
    .content p { color: #424245; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
    .highlight-box { background: #f5f5f7; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
    .otp-code { font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${BRAND_COLOR}; margin: 10px 0; }
    .button { display: inline-block; background: ${BRAND_COLOR}; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .button:hover { background: #5a6fd6; }
    .info-box { background: #e8f4fd; border-left: 4px solid ${BRAND_COLOR}; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .error-box { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .feature-list { list-style: none; padding: 0; margin: 20px 0; }
    .feature-list li { padding: 10px 0; border-bottom: 1px solid #eee; color: #424245; }
    .feature-list li:last-child { border-bottom: none; }
    .footer { background: #1d1d1f; padding: 30px 20px; text-align: center; }
    .footer p { color: #86868b; font-size: 13px; margin: 5px 0; }
    .footer a { color: ${BRAND_COLOR}; text-decoration: none; }
    .social-links { margin: 15px 0; }
    .social-links a { display: inline-block; margin: 0 10px; color: #86868b; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .content { padding: 25px 20px; }
      .header { padding: 25px 15px; }
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div style="background: #f5f5f7; padding: 20px 10px;">
    <div class="container" style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div class="header">
        <img src="${LOGO_URL}" alt="${BRAND_NAME}" class="logo" style="max-width: 120px;">
        <h1>${BRAND_NAME}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin-bottom: 15px;">
          <a href="${FRONTEND_URL}">Visit Website</a> • 
          <a href="${FRONTEND_URL}/affiliate/apply">Become an Affiliate</a> • 
          <a href="mailto:${SUPPORT_EMAIL}">Contact Support</a>
        </p>
        <p>© ${new Date().getFullYear()} Scalezix Venture PVT LTD. All rights reserved.</p>
        <p style="font-size: 11px; color: #666;">
          You're receiving this email because you signed up for ${BRAND_NAME}.<br>
          <a href="${FRONTEND_URL}/unsubscribe" style="color: #86868b;">Unsubscribe</a> from marketing emails
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
// SEND EMAIL FUNCTION
// ═══════════════════════════════════════════════════════════════
async function sendEmail(to, subject, htmlContent, preheader = '') {
  const html = getEmailTemplate(htmlContent, preheader);
  
  try {
    if (useBrevo) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: BRAND_NAME, email: process.env.BREVO_EMAIL || 'scalezix@gmail.com' },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        })
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Brevo error: ${response.status}`);
      }
      console.log(`✅ Email sent to ${to}: ${subject}`);
      return { success: true };
    } else if (transporter) {
      await transporter.sendMail({
        from: `"${BRAND_NAME}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });
      console.log(`✅ Email sent to ${to}: ${subject}`);
      return { success: true };
    }
    throw new Error('No email service configured');
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// GENERATE OTP
// ═══════════════════════════════════════════════════════════════
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// ═══════════════════════════════════════════════════════════════
// USER AUTHENTICATION EMAILS
// ═══════════════════════════════════════════════════════════════

// Send OTP Email
export async function sendOTPEmail(email, otp, name) {
  const content = `
    <h2>Hi ${name || 'there'}! 👋</h2>
    <p>Welcome to ${BRAND_NAME}! We're excited to have you on board.</p>
    <p>To complete your registration, please verify your email using the code below:</p>
    <div class="highlight-box">
      <p style="margin: 0 0 10px 0; color: #86868b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
      <div class="otp-code">${otp}</div>
      <p style="margin: 15px 0 0 0; color: #86868b; font-size: 13px;">Valid for 10 minutes</p>
    </div>
    <p style="font-size: 14px; color: #86868b;">If you didn't request this code, please ignore this email.</p>
  `;
  return sendEmail(email, `${otp} - Verify Your Email | ${BRAND_NAME}`, content, `Your verification code is ${otp}`);
}

// Send Welcome Email
export async function sendWelcomeEmail(email, name) {
  const content = `
    <h2>Welcome to ${BRAND_NAME}! 🎉</h2>
    <p>Hi ${name},</p>
    <p>Your account is now active! You're all set to explore our powerful AI tools.</p>
    <div class="success-box">
      <strong>✅ Account Verified Successfully</strong>
    </div>
    <h3 style="margin-top: 30px;">What You Can Do:</h3>
    <ul class="feature-list">
      <li>🤖 Generate human-like content with AI</li>
      <li>📝 Create SEO-optimized blog posts</li>
      <li>📊 Bulk upload and publish to WordPress</li>
      <li>📈 Track leads and campaigns</li>
      <li>🔍 Analyze website SEO</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/dashboard" class="button">Go to Dashboard →</a>
    </div>
    <p>Need help? Reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
  `;
  return sendEmail(email, `Welcome to ${BRAND_NAME}! 🎉`, content, `Your account is ready. Start creating amazing content!`);
}

// Send Password Reset Email
export async function sendPasswordResetEmail(email, resetToken, name) {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
  const content = `
    <h2>Password Reset Request 🔐</h2>
    <p>Hi ${name || 'there'},</p>
    <p>We received a request to reset your password for your ${BRAND_NAME} account.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <div class="warning-box">
      <strong>⚠️ This link expires in 1 hour.</strong><br>
      If you didn't request this, please ignore this email.
    </div>
    <p style="font-size: 13px; color: #86868b; word-break: break-all;">
      Or copy this link: <a href="${resetUrl}">${resetUrl}</a>
    </p>
  `;
  return sendEmail(email, `Reset Your Password | ${BRAND_NAME}`, content, `Click to reset your password`);
}

// Send Reminder Email
export async function sendReminderEmail(email, name) {
  const content = `
    <h2>Complete Your Registration ⏰</h2>
    <p>Hi ${name},</p>
    <p>We noticed you started signing up but haven't verified your email yet.</p>
    <p>Your account is almost ready! Just verify your email to unlock all our powerful AI tools.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/login" class="button">Complete Registration</a>
    </div>
    <p style="font-size: 14px; color: #86868b;">If you didn't sign up, you can safely ignore this email.</p>
  `;
  return sendEmail(email, `Complete Your Registration | ${BRAND_NAME}`, content, `Your account is waiting for you!`);
}


// ═══════════════════════════════════════════════════════════════
// AFFILIATE PROGRAM EMAILS
// ═══════════════════════════════════════════════════════════════

// Affiliate Application Received
export async function sendAffiliateApplicationReceivedEmail(email, name) {
  const content = `
    <h2>Application Received! 📩</h2>
    <p>Hi ${name},</p>
    <p>Thank you for applying to the <strong>${BRAND_NAME} Affiliate Program</strong>!</p>
    <div class="info-box">
      <strong>What happens next?</strong><br>
      Our team will review your application within 1-3 business days. We'll notify you by email once a decision is made.
    </div>
    <h3>Program Highlights:</h3>
    <ul class="feature-list">
      <li>💰 <strong>20% Lifetime Recurring Commission</strong> on all referred customers</li>
      <li>🍪 30-day cookie duration</li>
      <li>📊 Real-time tracking dashboard</li>
      <li>💳 Monthly payouts (₹50,000 minimum)</li>
    </ul>
    <p>Questions? Contact us at <a href="mailto:affiliates@scalezix.com">affiliates@scalezix.com</a></p>
  `;
  return sendEmail(email, `Application Received | ${BRAND_NAME} Affiliate Program`, content, `We've received your affiliate application`);
}

// Affiliate Approved
export async function sendAffiliateApprovedEmail(email, name, slug, commissionPercent = 20) {
  const referralLink = `${FRONTEND_URL}/?ref=${slug}`;
  const content = `
    <h2>Congratulations! You're Approved! 🎉</h2>
    <p>Hi ${name},</p>
    <p>Great news! Your application to the <strong>${BRAND_NAME} Affiliate Program</strong> has been <strong style="color: #28a745;">APPROVED</strong>!</p>
    <div class="success-box">
      <strong>✅ You're now an official Scalezix Affiliate!</strong>
    </div>
    <h3>Your Affiliate Details:</h3>
    <div class="highlight-box" style="text-align: left;">
      <p><strong>Commission Rate:</strong> ${commissionPercent}% Lifetime Recurring</p>
      <p><strong>Your Referral Code:</strong> <code style="background: #e8f4fd; padding: 3px 8px; border-radius: 4px;">${slug}</code></p>
      <p><strong>Your Referral Link:</strong></p>
      <p style="background: #f5f5f7; padding: 10px; border-radius: 6px; word-break: break-all; font-size: 14px;">
        <a href="${referralLink}">${referralLink}</a>
      </p>
    </div>
    <h3>How It Works:</h3>
    <ul class="feature-list">
      <li>1️⃣ Share your unique referral link</li>
      <li>2️⃣ When someone signs up and subscribes, you earn ${commissionPercent}%</li>
      <li>3️⃣ Earn on EVERY payment they make - forever!</li>
      <li>4️⃣ Request payout when you reach ₹50,000</li>
    </ul>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/affiliate/login" class="button">Access Your Dashboard →</a>
    </div>
    <p>Start sharing and earning today! 🚀</p>
  `;
  return sendEmail(email, `🎉 You're Approved! Welcome to ${BRAND_NAME} Affiliates`, content, `Congratulations! Your affiliate application has been approved.`);
}

// Affiliate Rejected
export async function sendAffiliateRejectedEmail(email, name, reason = '') {
  const content = `
    <h2>Application Update 📋</h2>
    <p>Hi ${name},</p>
    <p>Thank you for your interest in the <strong>${BRAND_NAME} Affiliate Program</strong>.</p>
    <p>After careful review, we regret to inform you that we're unable to approve your application at this time.</p>
    ${reason ? `
    <div class="info-box">
      <strong>Reason:</strong><br>
      ${reason}
    </div>
    ` : ''}
    <p>This decision doesn't have to be final. You're welcome to reapply in the future with updated information about your audience and promotion methods.</p>
    <h3>Tips for a Successful Application:</h3>
    <ul class="feature-list">
      <li>Have an established online presence (blog, YouTube, social media)</li>
      <li>Audience interested in AI tools, content creation, or marketing</li>
      <li>Clear promotion strategy</li>
    </ul>
    <p>Questions? Contact us at <a href="mailto:affiliates@scalezix.com">affiliates@scalezix.com</a></p>
  `;
  return sendEmail(email, `Affiliate Application Update | ${BRAND_NAME}`, content, `Update on your affiliate application`);
}

// Affiliate Suspended
export async function sendAffiliateSuspendedEmail(email, name, reason = '') {
  const content = `
    <h2>Account Suspended ⚠️</h2>
    <p>Hi ${name},</p>
    <p>Your ${BRAND_NAME} affiliate account has been <strong>temporarily suspended</strong>.</p>
    ${reason ? `
    <div class="warning-box">
      <strong>Reason:</strong><br>
      ${reason}
    </div>
    ` : ''}
    <p>During suspension:</p>
    <ul class="feature-list">
      <li>Your referral links will not track new clicks</li>
      <li>Pending commissions are on hold</li>
      <li>You cannot request withdrawals</li>
    </ul>
    <p>If you believe this was done in error, please contact us immediately at <a href="mailto:affiliates@scalezix.com">affiliates@scalezix.com</a></p>
  `;
  return sendEmail(email, `Account Suspended | ${BRAND_NAME} Affiliate Program`, content, `Your affiliate account has been suspended`);
}

// Affiliate Banned
export async function sendAffiliateBannedEmail(email, name, reason = '') {
  const content = `
    <h2>Account Permanently Banned 🚫</h2>
    <p>Hi ${name},</p>
    <p>Your ${BRAND_NAME} affiliate account has been <strong style="color: #dc3545;">permanently banned</strong>.</p>
    ${reason ? `
    <div class="error-box">
      <strong>Reason:</strong><br>
      ${reason}
    </div>
    ` : ''}
    <p>This means:</p>
    <ul class="feature-list">
      <li>Your account has been terminated</li>
      <li>All pending commissions have been forfeited</li>
      <li>You cannot create a new affiliate account</li>
    </ul>
    <p>This decision is final. If you have questions, contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
  `;
  return sendEmail(email, `Account Banned | ${BRAND_NAME} Affiliate Program`, content, `Your affiliate account has been permanently banned`);
}

// Affiliate Commission Earned
export async function sendAffiliateCommissionEmail(email, name, commissionAmount, customerEmail, planName) {
  const maskedEmail = customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  const content = `
    <h2>You Earned a Commission! 💰</h2>
    <p>Hi ${name},</p>
    <p>Great news! You just earned a commission from a referral!</p>
    <div class="success-box">
      <strong style="font-size: 24px;">+₹${(commissionAmount / 100).toLocaleString('en-IN')}</strong><br>
      <span style="font-size: 14px; color: #666;">Commission Earned</span>
    </div>
    <div class="info-box">
      <strong>Details:</strong><br>
      Customer: ${maskedEmail}<br>
      Plan: ${planName}<br>
      Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
    </div>
    <p>This commission has been added to your available balance. Keep sharing and earning!</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/affiliate/dashboard" class="button">View Dashboard →</a>
    </div>
  `;
  return sendEmail(email, `💰 You Earned ₹${(commissionAmount / 100).toLocaleString('en-IN')}! | ${BRAND_NAME}`, content, `You just earned a commission!`);
}

// Affiliate Withdrawal Requested
export async function sendAffiliateWithdrawalRequestedEmail(email, name, amount, paymentMethod) {
  const content = `
    <h2>Withdrawal Request Received 📤</h2>
    <p>Hi ${name},</p>
    <p>We've received your withdrawal request.</p>
    <div class="highlight-box">
      <p style="margin: 0; font-size: 14px; color: #86868b;">Withdrawal Amount</p>
      <p style="font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; margin: 10px 0;">₹${(amount / 100).toLocaleString('en-IN')}</p>
      <p style="margin: 0; font-size: 14px; color: #86868b;">via ${paymentMethod.replace('_', ' ').toUpperCase()}</p>
    </div>
    <div class="info-box">
      <strong>What's Next?</strong><br>
      Our team will process your withdrawal within 3-5 business days. You'll receive a confirmation email once completed.
    </div>
    <p>Questions? Contact <a href="mailto:affiliates@scalezix.com">affiliates@scalezix.com</a></p>
  `;
  return sendEmail(email, `Withdrawal Request Received | ${BRAND_NAME}`, content, `Your withdrawal request for ₹${(amount / 100).toLocaleString('en-IN')} is being processed`);
}

// Affiliate Withdrawal Completed
export async function sendAffiliateWithdrawalCompletedEmail(email, name, amount, transactionId) {
  const content = `
    <h2>Withdrawal Completed! ✅</h2>
    <p>Hi ${name},</p>
    <p>Great news! Your withdrawal has been processed successfully.</p>
    <div class="success-box">
      <strong style="font-size: 24px;">₹${(amount / 100).toLocaleString('en-IN')}</strong><br>
      <span style="font-size: 14px;">has been sent to your account</span>
    </div>
    <div class="info-box">
      <strong>Transaction Details:</strong><br>
      Amount: ₹${(amount / 100).toLocaleString('en-IN')}<br>
      Transaction ID: ${transactionId || 'N/A'}<br>
      Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
    </div>
    <p>Thank you for being a valued affiliate partner! Keep up the great work. 🚀</p>
  `;
  return sendEmail(email, `✅ Withdrawal Completed - ₹${(amount / 100).toLocaleString('en-IN')} | ${BRAND_NAME}`, content, `Your withdrawal has been processed`);
}

// Affiliate Withdrawal Rejected
export async function sendAffiliateWithdrawalRejectedEmail(email, name, amount, reason = '') {
  const content = `
    <h2>Withdrawal Request Update ⚠️</h2>
    <p>Hi ${name},</p>
    <p>Unfortunately, your withdrawal request for <strong>₹${(amount / 100).toLocaleString('en-IN')}</strong> could not be processed.</p>
    ${reason ? `
    <div class="warning-box">
      <strong>Reason:</strong><br>
      ${reason}
    </div>
    ` : ''}
    <div class="info-box">
      <strong>What happens now?</strong><br>
      The amount has been returned to your available balance. You can submit a new withdrawal request after addressing the issue.
    </div>
    <p>Questions? Contact <a href="mailto:affiliates@scalezix.com">affiliates@scalezix.com</a></p>
  `;
  return sendEmail(email, `Withdrawal Request Update | ${BRAND_NAME}`, content, `Your withdrawal request needs attention`);
}


// ═══════════════════════════════════════════════════════════════
// NEWSLETTER & MARKETING EMAILS
// ═══════════════════════════════════════════════════════════════

// Newsletter Welcome
export async function sendNewsletterWelcomeEmail(email) {
  const content = `
    <h2>You're Subscribed! 📬</h2>
    <p>Thank you for subscribing to the ${BRAND_NAME} newsletter!</p>
    <div class="success-box">
      <strong>✅ Subscription Confirmed</strong>
    </div>
    <p>Here's what you'll receive:</p>
    <ul class="feature-list">
      <li>🚀 New feature announcements</li>
      <li>💡 AI marketing tips and strategies</li>
      <li>📊 Industry insights and trends</li>
      <li>🎁 Exclusive offers and early access</li>
    </ul>
    <p>We respect your inbox and only send valuable content. Expect 1-2 emails per month.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}" class="button">Explore ${BRAND_NAME} →</a>
    </div>
  `;
  return sendEmail(email, `Welcome to ${BRAND_NAME} Newsletter! 📬`, content, `You're now subscribed to our newsletter`);
}

// New Feature Announcement
export async function sendNewFeatureEmail(emails, featureTitle, featureDescription, featureImage = '') {
  const content = `
    <h2>New Feature Alert! 🚀</h2>
    <p>We're excited to announce a new feature:</p>
    <div class="highlight-box">
      <h3 style="margin: 0 0 10px 0; color: ${BRAND_COLOR};">${featureTitle}</h3>
      <p style="margin: 0; color: #424245;">${featureDescription}</p>
    </div>
    ${featureImage ? `<img src="${featureImage}" alt="${featureTitle}" style="max-width: 100%; border-radius: 8px; margin: 20px 0;">` : ''}
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/dashboard" class="button">Try It Now →</a>
    </div>
    <p>We're constantly improving ${BRAND_NAME} based on your feedback. Have suggestions? Reply to this email!</p>
  `;
  
  // Send to multiple emails
  const results = [];
  for (const email of (Array.isArray(emails) ? emails : [emails])) {
    const result = await sendEmail(email, `🚀 New Feature: ${featureTitle} | ${BRAND_NAME}`, content, `Check out our latest feature: ${featureTitle}`);
    results.push({ email, ...result });
  }
  return results;
}

// Product Update Email
export async function sendProductUpdateEmail(emails, updateTitle, updates = []) {
  const updatesList = updates.map(u => `<li>${u}</li>`).join('');
  const content = `
    <h2>${updateTitle} 📦</h2>
    <p>We've made some improvements to ${BRAND_NAME}:</p>
    <div class="info-box">
      <ul style="margin: 0; padding-left: 20px;">
        ${updatesList}
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/dashboard" class="button">See What's New →</a>
    </div>
    <p>Thank you for being part of the ${BRAND_NAME} community!</p>
  `;
  
  const results = [];
  for (const email of (Array.isArray(emails) ? emails : [emails])) {
    const result = await sendEmail(email, `${updateTitle} | ${BRAND_NAME}`, content, `New updates available in ${BRAND_NAME}`);
    results.push({ email, ...result });
  }
  return results;
}

// Promotional Email
export async function sendPromotionalEmail(emails, subject, headline, body, ctaText, ctaUrl) {
  const content = `
    <h2>${headline}</h2>
    <p>${body}</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaUrl}" class="button">${ctaText} →</a>
    </div>
  `;
  
  const results = [];
  for (const email of (Array.isArray(emails) ? emails : [emails])) {
    const result = await sendEmail(email, `${subject} | ${BRAND_NAME}`, content, headline);
    results.push({ email, ...result });
  }
  return results;
}

// ═══════════════════════════════════════════════════════════════
// ADMIN NOTIFICATION EMAILS
// ═══════════════════════════════════════════════════════════════

// Notify Admin of New Affiliate Application
export async function notifyAdminNewAffiliateApplication(affiliate) {
  const adminEmail = process.env.ADMIN_EMAIL || 'harshkuhikar68@gmail.com';
  const content = `
    <h2>New Affiliate Application 📋</h2>
    <p>A new affiliate application has been submitted:</p>
    <div class="info-box">
      <strong>Applicant Details:</strong><br>
      Name: ${affiliate.name}<br>
      Email: ${affiliate.email}<br>
      Website: ${affiliate.website || 'Not provided'}<br>
      Audience Size: ${affiliate.audienceSize || 'Not specified'}<br>
      Channels: ${affiliate.promotionChannels?.join(', ') || 'Not specified'}
    </div>
    ${affiliate.whyJoin ? `
    <div class="highlight-box" style="text-align: left;">
      <strong>Why they want to join:</strong><br>
      ${affiliate.whyJoin}
    </div>
    ` : ''}
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/tools/affiliate-admin" class="button">Review Application →</a>
    </div>
  `;
  return sendEmail(adminEmail, `New Affiliate Application: ${affiliate.name} | ${BRAND_NAME}`, content, `New affiliate application from ${affiliate.name}`);
}

// Notify Admin of Withdrawal Request
export async function notifyAdminWithdrawalRequest(affiliate, withdrawal) {
  const adminEmail = process.env.ADMIN_EMAIL || 'harshkuhikar68@gmail.com';
  const content = `
    <h2>New Withdrawal Request 💸</h2>
    <p>An affiliate has requested a withdrawal:</p>
    <div class="highlight-box">
      <p style="font-size: 28px; font-weight: 700; color: ${BRAND_COLOR}; margin: 0;">₹${(withdrawal.amount / 100).toLocaleString('en-IN')}</p>
    </div>
    <div class="info-box">
      <strong>Affiliate:</strong> ${affiliate.name} (${affiliate.email})<br>
      <strong>Method:</strong> ${withdrawal.paymentMethod?.replace('_', ' ').toUpperCase()}<br>
      <strong>Requested:</strong> ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${FRONTEND_URL}/tools/affiliate-admin" class="button">Process Withdrawal →</a>
    </div>
  `;
  return sendEmail(adminEmail, `Withdrawal Request: ₹${(withdrawal.amount / 100).toLocaleString('en-IN')} | ${BRAND_NAME}`, content, `New withdrawal request from ${affiliate.name}`);
}

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL FUNCTIONS
// ═══════════════════════════════════════════════════════════════
export {
  sendEmail,
  getEmailTemplate,
  BRAND_NAME,
  FRONTEND_URL,
  LOGO_URL
};
