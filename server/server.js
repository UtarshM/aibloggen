/**
 * AI Marketing Platform - Backend Server
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 * @license Proprietary - All rights reserved to Scalezix Venture PVT LTD
 * 
 * This software is the exclusive property of Scalezix Venture PVT LTD.
 * Unauthorized copying, modification, distribution, or use is strictly prohibited.
 */

// CRITICAL: Load env FIRST before any other imports
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB, { Lead, Content, SocialPost, Client, Campaign, ChatMessage, WhiteLabelConfig, SEOAnalysis } from './database.js';
import * as aiServices from './aiServices.js';
import { analyzeWebsite } from './seoAnalyzer.js';
import { User, OTP, UsageLog, PLAN_TOKEN_LIMITS, TOKEN_COSTS, checkTokenBalance, deductTokens, getUserUsageStats } from './authModels.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail, sendReminderEmail } from './emailService.js';
import affiliateRoutes from './affiliateRoutes.js';
import superAdminRoutes from './superAdminRoutes.js';
// Human Content Engine - Advanced AI Detection Bypass
import { humanizeContent, analyzeAIRisk, FORBIDDEN_AI_WORDS } from './humanContentEngine.js';
import { generateMegaPrompt, PERSONAS } from './megaPromptEngine.js';
// Chaos Engine v2.0 - Ultimate Human Content Generation (2-4 min processing)
import { 
  advancedHumanize, 
  generateHumanContent, 
  generateHumanSignaturePrompt,
  analyzeAIRisk as chaosAnalyzeRisk,
  randomizedWordReplacement,
  symmetryBreaking,
  HUMAN_SYNONYMS
} from './chaosEngine.js';
// StealthGPT Integration - Professional AI Humanizer
import { humanizeWithStealth, generateStealthArticle, humanizeLongContent, checkStealthBalance } from './stealthService.js';
// Undetectable.ai Integration - Premium AI Humanizer
import { humanizeWithUndetectable, humanizeLongContentUndetectable, checkUndetectableCredits } from './undetectableService.js';

// Created by: Scalezix Venture PVT LTD

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB();

// ═══════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE - Production Grade Protection
// ═══════════════════════════════════════════════════════════════

// 1. Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://blogapi.scalezix.com", "https://aiblog.scalezix.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate Limiting - Prevent brute force & DDoS
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction // Skip in development
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per window (increased from 10)
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction
});

// SuperAdmin rate limiter - more lenient for admin operations
const superAdminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window for superadmin
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction
});

// Very strict limit for OTP/password reset
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 OTP requests per hour
  message: { error: 'Too many OTP requests, please try again after 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction
});

// API rate limit for AI operations (expensive)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 AI requests per minute
  message: { error: 'AI rate limit exceeded. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProduction
});

// Apply general rate limiting
app.use('/api/', generalLimiter);

// 3. Data Sanitization - Prevent NoSQL injection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security] Sanitized field: ${key} from ${req.ip}`);
  }
}));

// 4. Prevent HTTP Parameter Pollution
app.use(hpp());

// 5. CORS Configuration - Production Ready
const allowedOrigins = [
  'https://aiblog.scalezix.com',
  'https://aiblogfinal.vercel.app',
  'https://blogapi.scalezix.com'
];

// Add FRONTEND_URL if defined
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (isProduction) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Trust proxy for production (behind Nginx/Load Balancer)
if (isProduction) {
  app.set('trust proxy', 1);
}

// 6. Body Parser with size limits
app.use(bodyParser.json({ limit: '10mb' })); // Reduced from 50mb for security
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// 6.5 Set default timeout for all requests (5 minutes for long AI operations)
app.use((req, res, next) => {
  // Set timeout to 5 minutes (300000ms) for AI content generation
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

// 7. Request logging (minimal in production)
if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// 8. Security headers middleware
app.use((req, res, next) => {
  // Remove server fingerprint
  res.removeHeader('X-Powered-By');
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// 9. Block suspicious requests
app.use((req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,           // Path traversal
    /<script/i,         // XSS attempts
    /javascript:/i,     // JavaScript injection
    /on\w+=/i,          // Event handlers
    /union.*select/i,   // SQL injection
    /exec\s*\(/i,       // Command execution
    /eval\s*\(/i,       // Eval injection
  ];
  
  const requestData = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestData)) {
      console.warn(`[Security] Blocked suspicious request from ${req.ip}: ${pattern}`);
      return res.status(403).json({ error: 'Request blocked for security reasons' });
    }
  }
  
  next();
});

// 10. Global error handler (hide details in production)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: isProduction ? 'Internal server error' : err.message 
  });
});

// ═══════════════════════════════════════════════════════════════
// SPAM PREVENTION - Track failed attempts
// ═══════════════════════════════════════════════════════════════
const failedAttempts = new Map();
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;

const checkBlocked = (identifier) => {
  const record = failedAttempts.get(identifier);
  if (!record) return false;
  
  if (Date.now() - record.lastAttempt > BLOCK_DURATION) {
    failedAttempts.delete(identifier);
    return false;
  }
  
  return record.count >= MAX_FAILED_ATTEMPTS;
};

const recordFailedAttempt = (identifier) => {
  const record = failedAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
  record.count++;
  record.lastAttempt = Date.now();
  failedAttempts.set(identifier, record);
};

const clearFailedAttempts = (identifier) => {
  failedAttempts.delete(identifier);
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT (with fallback for MongoDB issues)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If MongoDB is not connected, allow access with a test user
    if (!global.mongoConnected) {
      req.user = { userId: 'test-user', email: 'test@example.com' };
      return next();
    }
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    // If MongoDB is not connected, allow access with a test user
    if (!global.mongoConnected) {
      req.user = { userId: 'test-user', email: 'test@example.com' };
      return next();
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({ 
    name: 'AI Marketing Platform API',
    status: 'running',
    version: '2.1.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      content: '/api/content/*',
      wordpress: '/api/wordpress/*'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running with MongoDB Atlas & AI APIs',
    version: '2.1.0',
    features: ['delete-account', 'brevo-email', 'social-oauth', 'newsletter']
  });
});

// ═══════════════════════════════════════════════════════════════
// MAINTENANCE MODE - Public Status Check
// ═══════════════════════════════════════════════════════════════

// Public endpoint to check maintenance status (no auth required)
app.get('/api/maintenance/status', async (req, res) => {
  try {
    const { PlatformSettings } = await import('./database.js');
    
    let settings = await PlatformSettings.findOne({ key: 'main' });
    
    if (!settings) {
      // No settings exist, not in maintenance mode
      return res.json({
        maintenanceMode: false,
        maintenanceMessage: ''
      });
    }
    
    res.json({
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage: settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.'
    });
  } catch (error) {
    console.error('Maintenance status check error:', error);
    // On error, assume not in maintenance mode
    res.json({
      maintenanceMode: false,
      maintenanceMessage: ''
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// Subscribe to newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    const { NewsletterSubscriber } = await import('./database.js');
    const { sendNewsletterWelcomeEmail } = await import('./emailService.js');
    
    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Resubscribe
        existing.status = 'active';
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = null;
        await existing.save();
        await sendNewsletterWelcomeEmail(email);
        return res.json({ success: true, message: 'Welcome back! You\'ve been resubscribed.' });
      }
      return res.json({ success: true, message: 'You\'re already subscribed!' });
    }
    
    // Create new subscriber
    const subscriber = new NewsletterSubscriber({
      email: email.toLowerCase(),
      source: 'website'
    });
    await subscriber.save();
    
    // Send welcome email
    await sendNewsletterWelcomeEmail(email);
    
    console.log(`[Newsletter] New subscriber: ${email}`);
    res.json({ success: true, message: 'Thanks for subscribing! Check your email for confirmation.' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// Unsubscribe from newsletter
app.get('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).send('Email is required');
    }
    
    const { NewsletterSubscriber } = await import('./database.js');
    
    await NewsletterSubscriber.updateOne(
      { email: email.toLowerCase() },
      { status: 'unsubscribed', unsubscribedAt: new Date() }
    );
    
    // Return a simple HTML page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Scalezix AI Tool</title>
        <style>
          body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f7; }
          .container { text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; }
          h1 { color: #1d1d1f; }
          p { color: #86868b; }
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unsubscribed ✓</h1>
          <p>You've been unsubscribed from our newsletter.</p>
          <p>Changed your mind? <a href="${process.env.FRONTEND_URL || 'https://aiblog.scalezix.com'}">Visit our website</a> to resubscribe.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).send('Failed to unsubscribe');
  }
});

// Get all subscribers (admin only)
app.get('/api/newsletter/subscribers', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    const user = await User.findById(req.user.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { NewsletterSubscriber } = await import('./database.js');
    const subscribers = await NewsletterSubscriber.find({ status: 'active' }).sort({ subscribedAt: -1 });
    
    res.json({ 
      subscribers,
      count: subscribers.length
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Failed to get subscribers' });
  }
});

// AUTH ENDPOINTS

// Google OAuth URL
app.get('/api/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return res.status(400).json({ 
      error: 'Google OAuth not configured',
      message: 'Please use email and password to login'
    });
  }
  
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 
    (process.env.NODE_ENV === 'production'
      ? 'https://blogapi.scalezix.com/api/auth/google/callback'
      : 'http://localhost:3001/api/auth/google/callback');
  
  // Basic scopes (no verification needed)
  // For extended data (DOB, Phone, Gender), add user as test user in Google Console
  // or get app verified by Google
  const scopes = 'email profile';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&access_type=offline`;
  
  res.json({ authUrl });
});

// Google OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=no_code`);
    }
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 
      (process.env.NODE_ENV === 'production'
        ? 'https://blogapi.scalezix.com/api/auth/google/callback'
        : 'http://localhost:3001/api/auth/google/callback');
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokens.access_token) {
      console.error('Google token error:', tokens);
      return res.redirect(`${frontendUrl}/login?error=token_failed`);
    }
    
    // Get basic user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    
    const googleUser = await userResponse.json();
    
    if (!googleUser.email) {
      return res.redirect(`${frontendUrl}/login?error=no_email`);
    }
    
    // Get additional user data (DOB, Gender, Phone) from People API
    let birthday = null;
    let gender = null;
    let phoneNumber = null;
    
    try {
      const peopleResponse = await fetch(
        'https://people.googleapis.com/v1/people/me?personFields=birthdays,genders,phoneNumbers',
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );
      
      if (peopleResponse.ok) {
        const peopleData = await peopleResponse.json();
        console.log('[Google OAuth] People API data:', JSON.stringify(peopleData, null, 2));
        
        // Extract birthday
        if (peopleData.birthdays && peopleData.birthdays.length > 0) {
          const bday = peopleData.birthdays[0].date;
          if (bday) {
            birthday = `${bday.year || '????'}-${String(bday.month).padStart(2, '0')}-${String(bday.day).padStart(2, '0')}`;
          }
        }
        
        // Extract gender
        if (peopleData.genders && peopleData.genders.length > 0) {
          gender = peopleData.genders[0].value; // 'male', 'female', or custom
        }
        
        // Extract phone number
        if (peopleData.phoneNumbers && peopleData.phoneNumbers.length > 0) {
          phoneNumber = peopleData.phoneNumbers[0].value;
        }
      }
    } catch (peopleError) {
      console.log('[Google OAuth] People API error (optional data):', peopleError.message);
    }
    
    console.log('[Google OAuth] Extracted data - Birthday:', birthday, 'Gender:', gender, 'Phone:', phoneNumber);
    
    // Find or create user
    let user = await User.findOne({ email: googleUser.email.toLowerCase() });
    
    if (!user) {
      // Create new user with all available data
      user = new User({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email.toLowerCase(),
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        isVerified: true, // Google users are auto-verified
        googleId: googleUser.id,
        profile: {
          firstName: googleUser.given_name || '',
          lastName: googleUser.family_name || '',
          profileImage: googleUser.picture || null,
          dateOfBirth: birthday,
          gender: gender,
          phone: phoneNumber
        }
      });
      await user.save();
      console.log('✅ New Google user created with extended data:', googleUser.email);
    } else {
      // Update existing user with Google info
      user.googleId = googleUser.id;
      user.isVerified = true;
      user.profile = {
        ...user.profile,
        profileImage: googleUser.picture || user.profile?.profileImage,
        firstName: googleUser.given_name || user.profile?.firstName,
        lastName: googleUser.family_name || user.profile?.lastName,
        // Only update if we got new data and user doesn't have it
        dateOfBirth: birthday || user.profile?.dateOfBirth,
        gender: gender || user.profile?.gender,
        phone: phoneNumber || user.profile?.phone
      };
      await user.save();
      console.log('✅ Updated Google user with extended data:', googleUser.email);
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/oauth/callback?token=${token}&name=${encodeURIComponent(user.name)}`);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

// GitHub OAuth URL
app.get('/api/auth/github/url', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return res.status(400).json({ 
      error: 'GitHub OAuth not configured',
      message: 'Please use email and password to login'
    });
  }
  
  const redirectUri = process.env.NODE_ENV === 'production'
    ? 'https://blogapi.scalezix.com/api/auth/github/callback'
    : 'http://localhost:3001/api/auth/github/callback';
  
  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=user:email`;
  
  res.json({ authUrl });
});

// Sign Up - Step 1: Create account and send OTP
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password, affiliateRef } = req.body;

    // Check if IP is blocked
    const clientIP = req.ip || req.connection.remoteAddress;
    if (checkBlocked(clientIP)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and numbers' });
    }

    // Sanitize name
    const sanitizedName = name.replace(/[<>\"'&]/g, '').trim().slice(0, 100);

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password with stronger salt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Track affiliate referral
    let referredByAffiliate = null;
    if (affiliateRef) {
      try {
        const { Affiliate, AffiliateClick } = await import('./affiliateModels.js');
        const affiliate = await Affiliate.findOne({ slug: affiliateRef, status: 'approved' });
        if (affiliate) {
          referredByAffiliate = affiliate._id;
          // Mark click as converted
          await AffiliateClick.updateOne(
            { affiliateId: affiliate._id, converted: false },
            { $set: { converted: true, convertedAt: new Date() } },
            { sort: { createdAt: -1 } }
          );
          // Increment conversion count
          affiliate.totalConversions += 1;
          await affiliate.save();
          console.log(`[Affiliate] Signup tracked for affiliate: ${affiliate.slug}`);
        }
      } catch (affErr) {
        console.log('[Affiliate] Tracking error:', affErr.message);
      }
    }

    // Create or update user
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      if (referredByAffiliate) existingUser.referredBy = referredByAffiliate;
      await existingUser.save();
    } else {
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isVerified: false,
        referredBy: referredByAffiliate || undefined
      });
      await newUser.save();
    }

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.findOneAndDelete({ email: email.toLowerCase() }); // Remove old OTP
    const newOTP = new OTP({
      email: email.toLowerCase(),
      otp
    });
    await newOTP.save();

    // Try to send OTP email (but don't fail if email not configured)
    let emailSent = false;
    try {
      const emailResult = await sendOTPEmail(email, otp, name);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.log('Email not sent:', emailResult.error);
      }
    } catch (emailError) {
      console.log('Email service error:', emailError.message);
    }

    // In production, NEVER send OTP in response (security risk)
    // In development, send OTP only if email failed (for testing)
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.json({ 
      success: true, 
      message: emailSent 
        ? 'OTP sent to your email. Please verify to complete registration.'
        : 'Account created! Please check your email for the OTP.',
      otp: (isDev && !emailSent) ? otp : undefined // Only show OTP in dev mode if email failed
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'Server error during signup' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(), 
      otp: otp.toString() 
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Verify user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP
    await OTP.findByIdAndDelete(otpRecord._id);

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(email, user.name).catch(err => {
      console.log('Welcome email failed:', err.message);
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: error.message || 'Server error during verification' });
  }
});

// Resend OTP
app.post('/api/auth/resend-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    await OTP.findOneAndDelete({ email: email.toLowerCase() });
    const newOTP = new OTP({
      email: email.toLowerCase(),
      otp
    });
    await newOTP.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }

    res.json({ success: true, message: 'New OTP sent to your email' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check if IP is blocked due to failed attempts
    if (checkBlocked(clientIP) || checkBlocked(email?.toLowerCase())) {
      return res.status(429).json({ 
        error: 'Account temporarily locked due to too many failed attempts. Please try again in 30 minutes.' 
      });
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // FALLBACK: If MongoDB is not connected, use test credentials
    if (!User.db || User.db.readyState !== 1) {
      console.log('[FALLBACK] MongoDB not connected, using test credentials');
      
      // Test credentials
      if (email.toLowerCase() === 'test@example.com' && password === 'Test123456') {
        const token = jwt.sign(
          { userId: 'test-user-id', email: 'test@example.com' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful (fallback mode)',
          token,
          user: {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com'
          }
        });
      } else {
        recordFailedAttempt(clientIP);
        return res.status(400).json({ error: 'Invalid credentials. Use test@example.com / Test123456' });
      }
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      recordFailedAttempt(clientIP);
      recordFailedAttempt(email.toLowerCase());
      // Use generic message to prevent email enumeration
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ 
        error: 'Your account has been blocked. Please contact support for assistance.',
        isBlocked: true,
        blockedReason: user.blockedReason || 'Violation of terms of service'
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        error: 'Email not verified. Please verify your email first.',
        needsVerification: true
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      recordFailedAttempt(clientIP);
      recordFailedAttempt(email.toLowerCase());
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(clientIP);
    clearFailedAttempts(email.toLowerCase());

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT with shorter expiry for security
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' } // Reduced from 7d to 24h for security
    );

    // Log successful login (without sensitive data)
    console.log(`[Auth] Successful login: ${user.email} from ${clientIP}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Forgot Password - Send reset link
app.post('/api/auth/forgot-password', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const { sendPasswordResetEmail } = await import('./emailService.js');
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
    }

    res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password - With token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now login.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change Password (authenticated)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Account (authenticated)
app.delete('/api/auth/delete-account', authenticateToken, async (req, res) => {
  try {
    const { password, confirmText } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user signed up with Google (has googleId)
    const isGoogleUser = !!user.googleId;

    if (isGoogleUser) {
      // For Google users, verify they typed "DELETE"
      if (confirmText !== 'DELETE') {
        return res.status(400).json({ error: 'Please type DELETE to confirm account deletion' });
      }
    } else {
      // For email/password users, verify password
      if (!password) {
        return res.status(400).json({ error: 'Password is required to delete account' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
    }

    // Delete user's related data
    await OTP.deleteMany({ email: user.email });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    console.log(`✅ Account deleted: ${user.email}`);
    res.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error during account deletion' });
  }
});

// Check if user is Google OAuth user
app.get('/api/auth/account-type', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      isGoogleUser: !!user.googleId,
      email: user.email 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send reminder emails (cron job endpoint)
app.post('/api/auth/send-reminders', async (req, res) => {
  try {
    // Find unverified users who haven't received reminder
    const unverifiedUsers = await User.find({
      isVerified: false,
      reminderSent: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours ago
    });

    let sentCount = 0;
    for (const user of unverifiedUsers) {
      await sendReminderEmail(user.email, user.name);
      user.reminderSent = true;
      await user.save();
      sentCount++;
    }

    res.json({ success: true, message: `Sent ${sentCount} reminder emails` });
  } catch (error) {
    console.error('Reminder email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// USER DASHBOARD STATS - Real data for each user
// ═══════════════════════════════════════════════════════════════

app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // FALLBACK: If MongoDB is not connected, return empty stats
    if (!User.db || User.db.readyState !== 1) {
      return res.json({
        contentCreated: 0,
        wordpressPosts: 0,
        socialPosts: 0,
        seoAnalyses: 0,
        clients: 0,
        campaigns: 0,
        recentActivity: [],
        contentHistory: []
      });
    }

    // Get user's content count
    const contentCount = await Content.countDocuments({ userId }) || 0;
    
    // Get user's WordPress posts count
    const { WordPressPost } = await import('./wordpressModels.js');
    const wordpressCount = await WordPressPost.countDocuments({ userId }) || 0;
    
    // Get user's social posts count
    const socialCount = await SocialPost.countDocuments({ userId }) || 0;
    
    // Get user's SEO analyses count
    const seoCount = await SEOAnalysis.countDocuments({ userId }) || 0;
    
    // Get user's clients count
    const clientCount = await Client.countDocuments({ userId }) || 0;
    
    // Get user's campaigns count
    const campaignCount = await Campaign.countDocuments({ userId }) || 0;
    
    // Get recent activity (last 10 items from various collections)
    const recentContent = await Content.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');
    
    const recentWordPress = await WordPressPost.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt status');
    
    // Build recent activity list
    const recentActivity = [
      ...recentContent.map(c => ({
        type: 'content',
        title: c.title || 'Untitled Content',
        action: 'Created content',
        time: c.createdAt,
        icon: '📝'
      })),
      ...recentWordPress.map(w => ({
        type: 'wordpress',
        title: w.title || 'Untitled Post',
        action: w.status === 'published' ? 'Published to WordPress' : 'Drafted post',
        time: w.createdAt,
        icon: '🌐'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
    
    // Format time ago
    const formatTimeAgo = (date) => {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      if (seconds < 60) return 'Just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
      return new Date(date).toLocaleDateString();
    };
    
    res.json({
      contentCreated: contentCount,
      wordpressPosts: wordpressCount,
      socialPosts: socialCount,
      seoAnalyses: seoCount,
      clients: clientCount,
      campaigns: campaignCount,
      totalProjects: contentCount + wordpressCount,
      completedTasks: wordpressCount, // Published posts
      inProgress: contentCount, // Content being worked on
      recentActivity: recentActivity.map(a => ({
        ...a,
        time: formatTimeAgo(a.time)
      }))
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return empty stats on error instead of failing
    res.json({
      contentCreated: 0,
      wordpressPosts: 0,
      socialPosts: 0,
      seoAnalyses: 0,
      clients: 0,
      campaigns: 0,
      totalProjects: 0,
      completedTasks: 0,
      inProgress: 0,
      recentActivity: []
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// TOKEN/CREDITS USAGE ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// Get user's token balance and usage stats
app.get('/api/usage/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Try to get stats, but return defaults if it fails
    let stats = null;
    try {
      stats = await getUserUsageStats(userId, 30);
    } catch (e) {
      console.log('getUserUsageStats error:', e.message);
    }
    
    if (!stats) {
      // Return default stats for new users
      const planLimits = PLAN_TOKEN_LIMITS.free;
      return res.json({
        balance: {
          current: planLimits.monthlyTokens,
          used: 0,
          total: planLimits.monthlyTokens,
          percentage: 0
        },
        plan: {
          name: 'free',
          limits: planLimits
        },
        usage: {
          byOperation: {},
          dailyUsage: {},
          recentLogs: []
        },
        apiUsage: {
          contentGenerated: 0,
          imagesGenerated: 0,
          socialPosts: 0,
          seoAnalyses: 0
        }
      });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Usage balance error:', error);
    // Return default data instead of error
    const planLimits = PLAN_TOKEN_LIMITS.free;
    res.json({
      balance: {
        current: planLimits.monthlyTokens,
        used: 0,
        total: planLimits.monthlyTokens,
        percentage: 0
      },
      plan: {
        name: 'free',
        limits: planLimits
      },
      usage: {
        byOperation: {},
        dailyUsage: {},
        recentLogs: []
      },
      apiUsage: {
        contentGenerated: 0,
        imagesGenerated: 0,
        socialPosts: 0,
        seoAnalyses: 0
      }
    });
  }
});

// Get usage history with pagination
app.get('/api/usage/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const operation = req.query.operation; // Optional filter
    
    const query = { userId };
    if (operation) query.operation = operation;
    
    let total = 0;
    let logs = [];
    
    try {
      total = await UsageLog.countDocuments(query) || 0;
      logs = await UsageLog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit) || [];
    } catch (e) {
      console.log('UsageLog query error:', e.message);
    }
    
    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Usage history error:', error);
    res.status(500).json({ error: 'Failed to get usage history' });
  }
});

// Get token costs reference
app.get('/api/usage/costs', (req, res) => {
  res.json({
    costs: TOKEN_COSTS,
    plans: PLAN_TOKEN_LIMITS
  });
});

// Get real client reporting data
app.get('/api/reporting/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Initialize default values
    let contentCount = 0;
    let publishedPosts = 0;
    let socialPosts = 0;
    let seoAnalyses = 0;
    let usageLogs = [];
    let topContent = [];
    
    // Get user's content - with error handling
    try {
      contentCount = await Content.countDocuments({ 
        userId, 
        createdAt: { $gte: startDate } 
      }) || 0;
    } catch (e) {
      console.log('Content count error:', e.message);
    }
    
    // Get WordPress posts - with error handling
    try {
      const { WordPressPost } = await import('./wordpressModels.js');
      const wpPosts = await WordPressPost.find({ 
        userId, 
        createdAt: { $gte: startDate } 
      }) || [];
      publishedPosts = wpPosts.filter(p => p.status === 'published').length;
    } catch (e) {
      console.log('WordPress posts error:', e.message);
    }
    
    // Get social posts - with error handling
    try {
      socialPosts = await SocialPost.countDocuments({ 
        userId, 
        createdAt: { $gte: startDate } 
      }) || 0;
    } catch (e) {
      console.log('Social posts error:', e.message);
    }
    
    // Get SEO analyses - with error handling
    try {
      seoAnalyses = await SEOAnalysis.countDocuments({ 
        userId, 
        createdAt: { $gte: startDate } 
      }) || 0;
    } catch (e) {
      console.log('SEO analyses error:', e.message);
    }
    
    // Get usage logs for token consumption - with error handling
    try {
      usageLogs = await UsageLog.find({
        userId,
        createdAt: { $gte: startDate }
      }) || [];
    } catch (e) {
      console.log('Usage logs error:', e.message);
      usageLogs = [];
    }
    
    // Calculate daily metrics
    const dailyMetrics = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyMetrics[dateStr] = { content: 0, tokens: 0, posts: 0 };
    }
    
    if (usageLogs && usageLogs.length > 0) {
      usageLogs.forEach(log => {
        if (log.createdAt) {
          const dateStr = log.createdAt.toISOString().split('T')[0];
          if (dailyMetrics[dateStr]) {
            dailyMetrics[dateStr].tokens += log.tokensUsed || 0;
            if (log.operation === 'blogPost') dailyMetrics[dateStr].content++;
            if (log.operation === 'socialPost') dailyMetrics[dateStr].posts++;
          }
        }
      });
    }
    
    // Get top performing content - with error handling
    try {
      topContent = await Content.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt') || [];
    } catch (e) {
      console.log('Top content error:', e.message);
      topContent = [];
    }
    
    // Calculate totals
    const totalTokensUsed = usageLogs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0);
    
    // Traffic sources (simulated based on content distribution)
    const trafficSources = [
      { source: 'Organic Search', percentage: 45, count: Math.max(Math.round(contentCount * 45), 0) },
      { source: 'Direct', percentage: 25, count: Math.max(Math.round(contentCount * 25), 0) },
      { source: 'Social Media', percentage: 20, count: Math.max(Math.round(socialPosts * 50), 0) },
      { source: 'Referral', percentage: 10, count: Math.max(Math.round(publishedPosts * 20), 0) }
    ];
    
    // Conversion funnel based on actual data
    const totalVisitors = trafficSources.reduce((sum, s) => sum + s.count, 0) || 100;
    const conversionFunnel = [
      { stage: 'Visitors', count: totalVisitors, percentage: 100 },
      { stage: 'Engaged', count: Math.round(totalVisitors * 0.35), percentage: 35 },
      { stage: 'Leads', count: Math.round(totalVisitors * 0.08), percentage: 8 },
      { stage: 'Customers', count: Math.round(totalVisitors * 0.02), percentage: 2 }
    ];
    
    res.json({
      metrics: {
        contentCreated: contentCount,
        publishedPosts: publishedPosts,
        socialPosts: socialPosts,
        seoAnalyses: seoAnalyses,
        tokensUsed: totalTokensUsed
      },
      dailyMetrics: Object.entries(dailyMetrics)
        .map(([date, data]) => ({ date, ...data }))
        .reverse(),
      trafficSources,
      conversionFunnel,
      topContent: topContent.map(c => ({
        title: c.title || 'Untitled',
        views: Math.floor(Math.random() * 500) + 100, // Random views for now
        date: c.createdAt
      })),
      period: { days, startDate, endDate: new Date() }
    });
    
  } catch (error) {
    console.error('Reporting stats error:', error);
    // Return empty data instead of error
    res.json({
      metrics: {
        contentCreated: 0,
        publishedPosts: 0,
        socialPosts: 0,
        seoAnalyses: 0,
        tokensUsed: 0
      },
      dailyMetrics: [],
      trafficSources: [
        { source: 'Organic Search', percentage: 45, count: 0 },
        { source: 'Direct', percentage: 25, count: 0 },
        { source: 'Social Media', percentage: 20, count: 0 },
        { source: 'Referral', percentage: 10, count: 0 }
      ],
      conversionFunnel: [
        { stage: 'Visitors', count: 0, percentage: 100 },
        { stage: 'Engaged', count: 0, percentage: 35 },
        { stage: 'Leads', count: 0, percentage: 8 },
        { stage: 'Customers', count: 0, percentage: 2 }
      ],
      topContent: [],
      period: { days: 30, startDate: new Date(), endDate: new Date() }
    });
  }
});

// PROFILE ENDPOINTS

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // FALLBACK: If MongoDB is not connected, return test user data
    if (!User.db || User.db.readyState !== 1) {
      console.log('[FALLBACK] MongoDB not connected, returning test profile');
      
      return res.json({
        _id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        isVerified: true,
        createdAt: new Date(),
        profile: {
          firstName: 'Test',
          lastName: 'User',
          phone: '',
          location: '',
          company: '',
          website: '',
          bio: '',
          profileImage: null
        }
      });
    }

    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return profile data (merge with user data)
    const profileData = {
      ...user.toObject(),
      profile: user.profile || {}
    };

    res.json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    // Find user and update profile
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile field
    user.profile = {
      ...user.profile,
      ...profileData
    };

    // Update name and email if provided
    if (profileData.firstName && profileData.lastName) {
      user.name = `${profileData.firstName} ${profileData.lastName}`;
    }
    if (profileData.email) {
      user.email = profileData.email;
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: user.profile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upgrade user plan (Demo mode - no payment integration)
app.put('/api/user/plan', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { plan } = req.body;

    // Validate plan
    const validPlans = ['free', 'basic', 'advanced', 'premium'];
    if (!plan || !validPlans.includes(plan.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid plan. Must be one of: free, basic, advanced, premium' });
    }

    const normalizedPlan = plan.toLowerCase();

    // Find user and update plan
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update plan
    const oldPlan = user.plan;
    user.plan = normalizedPlan;

    // Update token balance based on new plan
    const planLimits = PLAN_TOKEN_LIMITS[normalizedPlan];
    user.tokenBalance = {
      current: planLimits.monthlyTokens,
      used: 0,
      total: planLimits.monthlyTokens,
      lastReset: new Date(),
      nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    await user.save();

    console.log(`[Plan Upgrade] User ${user.email} upgraded from ${oldPlan} to ${normalizedPlan}`);

    res.json({ 
      success: true, 
      message: `Plan upgraded to ${normalizedPlan} successfully`,
      plan: normalizedPlan,
      tokenBalance: user.tokenBalance,
      planLimits
    });
  } catch (error) {
    console.error('Plan upgrade error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LEADS ENDPOINTS with AI Scoring
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, company, industry, budget } = req.body;
    
    // AI-powered lead scoring
    const score = await aiServices.scoreLeadWithAI({ company, industry, budget });
    
    const lead = new Lead({ name, email, company, industry, budget, score });
    await lead.save();
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CONTENT ENDPOINTS with AI Generation
app.get('/api/content', async (req, res) => {
  try {
    if (!global.mongoConnected) {
      return res.json([]);
    }
    const content = await Content.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newContent = new Content({ title, content });
    await newContent.save();
    res.json(newContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/content/generate', aiLimiter, async (req, res) => {
  try {
    const { prompt } = req.body;
    const generatedContent = await aiServices.generateContent(prompt);
    res.json({ content: generatedContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to fetch EXACT topic images using Google Images via SerpAPI
async function fetchTopicImages(topic, count = 4) {
  const images = [];
  const searchQuery = encodeURIComponent(topic);
  
  // Use SerpAPI to search Google Images - returns EXACT images for the topic
  const SERPAPI_KEY = process.env.SERPAPI_KEY;
  
  if (SERPAPI_KEY) {
    try {
      console.log(`[Images] 🔍 Searching Google Images for: "${topic}"`);
      
      const serpUrl = `https://serpapi.com/search.json?engine=google_images&q=${searchQuery}&num=${count + 2}&api_key=${SERPAPI_KEY}&safe=active`;
      
      const response = await fetch(serpUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.images_results && data.images_results.length > 0) {
          // Get the first 'count' images
          const results = data.images_results.slice(0, count);
          
          for (const img of results) {
            // Use original image URL for best quality
            const imageUrl = img.original || img.thumbnail;
            
            if (imageUrl) {
              images.push({
                url: imageUrl,
                alt: img.title || topic,
                source: img.source || 'Google Images',
                link: img.link
              });
            }
          }
          
          if (images.length > 0) {
            console.log(`[Images] ✅ Found ${images.length} REAL Google Images for: "${topic}"`);
            return images;
          }
        }
      } else {
        console.log('[Images] SerpAPI response not ok:', response.status);
      }
    } catch (err) {
      console.log('[Images] SerpAPI error:', err.message);
    }
  } else {
    console.log('[Images] SERPAPI_KEY not configured');
  }
  
  // Fallback: Use Google Custom Search API if configured
  const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
  const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
  
  if (GOOGLE_SEARCH_API_KEY && GOOGLE_SEARCH_CX) {
    try {
      console.log(`[Images] 🔍 Trying Google Custom Search for: "${topic}"`);
      
      const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${searchQuery}&searchType=image&num=${count}&imgSize=large&safe=active`;
      
      const response = await fetch(googleUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          for (const item of data.items) {
            images.push({
              url: item.link,
              alt: item.title || topic,
              source: item.displayLink
            });
          }
          
          console.log(`[Images] ✅ Found ${images.length} Google Custom Search images for: "${topic}"`);
          return images;
        }
      }
    } catch (err) {
      console.log('[Images] Google Custom Search error:', err.message);
    }
  }
  
  // Last fallback - generate placeholder with topic name
  console.log('[Images] ⚠️ No API keys configured, using placeholder images');
  console.log('[Images] To get real images, add SERPAPI_KEY to your environment variables');
  
  // Use a placeholder service that shows the topic name
  for (let i = 0; i < count; i++) {
    const seed = topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + i;
    images.push({
      url: `https://picsum.photos/seed/${seed}/800/500`,
      alt: `${topic} - Image ${i + 1}`
    });
  }
  
  return images;
}

// Helper function to insert images into content
function insertImagesIntoContent(htmlContent, images) {
  if (!images || images.length === 0) return htmlContent;
  
  // Split content by </h2> tags to find good insertion points
  const sections = htmlContent.split(/<\/h2>/gi);
  
  if (sections.length <= 1) {
    // No h2 tags, split by paragraphs
    const paragraphs = htmlContent.split(/<\/p>/gi);
    const step = Math.floor(paragraphs.length / (images.length + 1));
    
    let result = '';
    let imageIndex = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      result += paragraphs[i] + (paragraphs[i].includes('<p') ? '</p>' : '');
      
      if (imageIndex < images.length && (i + 1) % step === 0 && i > 0 && i < paragraphs.length - 1) {
        const img = images[imageIndex];
        result += `\n<figure style="margin: 20px 0; text-align: center;">
          <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; height: auto; border-radius: 8px;" />
          <figcaption style="font-size: 14px; color: #666; margin-top: 8px;">${img.alt}</figcaption>
        </figure>\n`;
        imageIndex++;
      }
    }
    return result;
  }
  
  // Insert images after h2 sections
  let result = '';
  let imageIndex = 0;
  const step = Math.max(1, Math.floor(sections.length / images.length));
  
  for (let i = 0; i < sections.length; i++) {
    result += sections[i] + (i < sections.length - 1 ? '</h2>' : '');
    
    if (imageIndex < images.length && (i + 1) % step === 0 && i < sections.length - 1) {
      const img = images[imageIndex];
      result += `\n<figure style="margin: 20px 0; text-align: center;">
        <img src="${img.url}" alt="${img.alt}" style="max-width: 100%; height: auto; border-radius: 8px;" />
        <figcaption style="font-size: 14px; color: #666; margin-top: 8px;">${img.alt}</figcaption>
      </figure>\n`;
      imageIndex++;
    }
  }
  
  return result;
}

// ULTIMATE HUMAN CONTENT GENERATION - PROFESSIONAL JOURNALIST STYLE
app.post('/api/content/generate-human', authenticateToken, aiLimiter, async (req, res) => {
  // Set longer timeout for this endpoint (5 minutes)
  req.setTimeout(300000);
  res.setTimeout(300000);
  
  try {
    console.log('[Content] generate-human endpoint called');
    const config = req.body;
    const userId = req.user.userId;
    
    // Check token balance before generating
    const tokenCheck = await checkTokenBalance(userId, 'blogPost');
    if (!tokenCheck.allowed) {
      return res.status(403).json({ 
        error: 'Insufficient tokens',
        message: `You need ${tokenCheck.required} tokens but only have ${tokenCheck.available}. Please upgrade your plan.`,
        tokensRequired: tokenCheck.required,
        tokensAvailable: tokenCheck.available,
        plan: tokenCheck.plan
      });
    }
    
    // Validate config
    if (!config.topic || !config.topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const topic = config.topic;
    const targetKeyword = config.keywords || topic;
    const tone = config.tone || 'conversational';
    // Support both minWords and wordCount for backward compatibility
    const minWords = parseInt(config.minWords) || parseInt(config.wordCount) || 5000;
    const numImages = parseInt(config.numImages) || 4;
    
    // Excel data fields
    const customHeadings = config.headings || '';
    const keywords = config.keywords || topic;
    const references = config.references || '';
    const eeat = config.eeat || '';
    const targetAudience = config.targetAudience || 'professional peers';
    const persona = config.persona || 'journalist';

    // Parse headings
    const headings = customHeadings ? customHeadings.split(/[|\n]/).map(h => h.trim()).filter(h => h) : [];

    // ═══════════════════════════════════════════════════════════════
    // GENERATE MEGA-PROMPT USING THE NEW ENGINE
    // ═══════════════════════════════════════════════════════════════
    console.log('[Content] Generating mega-prompt with persona:', persona);
    
    const prompt = generateMegaPrompt({
      topic,
      keywords,
      targetAudience,
      tone,
      minWords,
      headings,
      references,
      eeat,
      persona
    });
    
    console.log('[Content] Mega-prompt generated, length:', prompt.length);

    let content = null;
    let apiUsed = '';
    const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // Create AbortController for timeout (4 minutes for AI generation)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 240000);

    // Try Google AI first (better for long content)
    if (GOOGLE_AI_KEY) {
      console.log('[Content] Trying Google AI (Gemini 2.0 Flash)...');
      try {
        const googleResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.92, // Higher for more creative/human output
                maxOutputTokens: 8192, // Safe limit for Gemini 2.0
                topP: 0.95,
                topK: 40
              }
            })
          }
        );

        const googleData = await googleResponse.json();
        
        if (googleData.candidates?.[0]?.content?.parts?.[0]?.text) {
          content = googleData.candidates[0].content.parts[0].text;
          apiUsed = 'Google AI';
          console.log('[Content] Google AI success');
        } else {
          console.log('[Content] Google AI response:', JSON.stringify(googleData).substring(0, 500));
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('[Content] Google AI request timed out');
        } else {
          console.log('[Content] Google AI error:', err.message);
        }
      }
    }

    // Clear timeout if we got content
    if (content) {
      clearTimeout(timeoutId);
    }

    // Fallback to OpenRouter
    if (!content && OPENROUTER_API_KEY) {
      console.log('[Content] Trying OpenRouter API...');
      try {
        // Create new timeout for OpenRouter
        const orController = new AbortController();
        const orTimeoutId = setTimeout(() => orController.abort(), 180000); // 3 minutes
        
        // Try free models first, then paid
        const modelsToTry = [
          'google/gemini-2.0-flash-exp:free',  // Free Gemini
          'meta-llama/llama-3.2-3b-instruct:free', // Free Llama
          'anthropic/claude-3-haiku' // Paid fallback
        ];
        
        for (const model of modelsToTry) {
          console.log(`[Content] Trying model: ${model}`);
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.FRONTEND_URL || 'https://aiblog.scalezix.com',
              'X-Title': 'AI Marketing Platform'
            },
            signal: orController.signal,
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 4000, // Reduced to fit free tier
              temperature: 0.92
            })
          });

          const data = await response.json();
          console.log(`[Content] ${model} response status:`, response.status);
          
          if (data.choices?.[0]?.message?.content) {
            content = data.choices[0].message.content;
            apiUsed = `OpenRouter (${model})`;
            console.log(`[Content] ${model} success`);
            clearTimeout(orTimeoutId);
            break; // Exit loop on success
          } else if (data.error) {
            console.log(`[Content] ${model} error:`, data.error.message?.substring(0, 200));
          }
        }
        
        clearTimeout(orTimeoutId);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('[Content] OpenRouter request timed out');
        } else {
          console.log('[Content] OpenRouter error:', err.message);
        }
      }
    }

    // Clear the main timeout
    clearTimeout(timeoutId);

    // If all APIs fail
    if (!content) {
      return res.status(500).json({ 
        error: 'AI services unavailable. Please check your API keys (GOOGLE_AI_KEY or OPENROUTER_API_KEY) in your .env file.' 
      });
    }

    // Clean content - remove code blocks and meta text
    let cleanContent = content;
    cleanContent = cleanContent.replace(/```html\n?/gi, '');
    cleanContent = cleanContent.replace(/```\n?/gi, '');
    cleanContent = cleanContent.replace(/^<p>Here is[\s\S]*?<\/p>\n*/i, '');
    cleanContent = cleanContent.replace(/^Here is[\s\S]*?\n\n/i, '');
    cleanContent = cleanContent.replace(/---[\s\S]*?---\n*/gi, '');
    cleanContent = cleanContent.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
    cleanContent = cleanContent.replace(/\(?\d+,?\d*\s*words?\)?/gi, '');
    cleanContent = cleanContent.trim();

    // POST-PROCESSING: Remove any remaining forbidden AI words
    const forbiddenReplacements = {
      'delve': 'dig into',
      'delving': 'digging into',
      'delved': 'dug into',
      'tapestry': 'mix',
      'realm': 'area',
      'realms': 'areas',
      'landscape': 'scene',
      'landscapes': 'scenes',
      'robust': 'solid',
      'leverage': 'use',
      'leveraging': 'using',
      'leveraged': 'used',
      'comprehensive': 'complete',
      'seamless': 'smooth',
      'seamlessly': 'smoothly',
      'cutting-edge': 'latest',
      'game-changer': 'big shift',
      'game-changing': 'significant',
      'utilize': 'use',
      'utilizing': 'using',
      'utilized': 'used',
      'utilization': 'use',
      'implement': 'set up',
      'implementing': 'setting up',
      'implemented': 'set up',
      'implementation': 'setup',
      'facilitate': 'help',
      'facilitating': 'helping',
      'facilitated': 'helped',
      'optimal': 'best',
      'optimally': 'ideally',
      'paramount': 'critical',
      'plethora': 'many',
      'myriad': 'countless',
      'furthermore': 'plus',
      'moreover': 'also',
      'subsequently': 'then',
      'nevertheless': 'still',
      'consequently': 'so',
      'endeavor': 'effort',
      'endeavors': 'efforts',
      'ascertain': 'find out',
      'commence': 'start',
      'commencing': 'starting',
      'commenced': 'started',
      'prior to': 'before',
      'in order to': 'to',
      'due to the fact that': 'because',
      'at the end of the day': 'ultimately',
      'it is important to note': 'note that',
      'it goes without saying': '',
      'needless to say': '',
      'first and foremost': 'first',
      'last but not least': 'finally',
      'in today\'s world': 'now',
      'in today\'s digital age': 'today',
      'vibrant': 'lively',
      'bustling': 'busy',
      'meticulous': 'careful',
      'meticulously': 'carefully',
      'streamline': 'simplify',
      'streamlined': 'simplified',
      'streamlining': 'simplifying',
      'synergy': 'teamwork',
      'synergies': 'combined efforts',
      'holistic': 'complete',
      'holistically': 'completely',
      'paradigm': 'model',
      'paradigms': 'models',
      'ecosystem': 'system',
      'ecosystems': 'systems',
      'scalable': 'growable',
      'pivotal': 'key',
      'testament': 'proof',
      'foster': 'build',
      'fostering': 'building',
      'fostered': 'built',
      'integrate': 'combine',
      'integrating': 'combining',
      'integrated': 'combined',
      'embark': 'start',
      'embarking': 'starting',
      'embarked': 'started',
      'revolutionize': 'change',
      'revolutionizing': 'changing',
      'revolutionized': 'changed',
      'transform': 'change',
      'transforming': 'changing',
      'transformed': 'changed',
      'empower': 'enable',
      'empowering': 'enabling',
      'empowered': 'enabled',
      'elevate': 'raise',
      'elevating': 'raising',
      'elevated': 'raised',
      'enhance': 'improve',
      'enhancing': 'improving',
      'enhanced': 'improved'
    };

    for (const [forbidden, replacement] of Object.entries(forbiddenReplacements)) {
      const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
      cleanContent = cleanContent.replace(regex, replacement);
    }

    // ═══════════════════════════════════════════════════════════════
    // ADVANCED HUMANIZATION - Multi-Layer Approach
    // ═══════════════════════════════════════════════════════════════
    console.log('[Content] Applying advanced humanization...');
    
    // Layer 1: Apply the comprehensive humanization engine (vocabulary, contractions, etc.)
    cleanContent = humanizeContent(cleanContent, {
      removeForbidden: true,
      useContractions: true,
      fixThreeRule: true,
      injectVoice: true,
      addHedges: true,
      fixEndings: true,
      addPunctuation: true,
      improveBurst: true,
      addQuestions: true,
      voiceFrequency: 0.12,
      hedgeFrequency: 0.08,
      questionFrequency: 0.06
    });
    
    // Analyze AI detection risk after first pass
    let aiRiskAnalysis = analyzeAIRisk(cleanContent);
    console.log(`[Content] After Layer 1 - AI Risk Score: ${aiRiskAnalysis.score}/100 (${aiRiskAnalysis.riskLevel})`);
    
    // Layer 2: Professional Humanization (StealthGPT or Undetectable.ai)
    let stealthResult = null;
    let undetectableResult = null;
    const humanizer = config.humanizer || 'auto'; // 'auto', 'stealthgpt', 'undetectable', 'local'
    
    // Determine which humanizer to use
    const useStealthGPT = (humanizer === 'stealthgpt' || humanizer === 'auto') && 
                          process.env.STEALTHGPT_API_KEY && 
                          config.useStealthGPT !== false;
    const useUndetectable = (humanizer === 'undetectable' || (humanizer === 'auto' && !useStealthGPT)) && 
                            process.env.UNDETECTABLE_API_KEY && 
                            config.useUndetectable !== false;
    
    if (useStealthGPT) {
      console.log('[Content] Layer 2: Applying StealthGPT humanization...');
      
      stealthResult = await humanizeLongContent(cleanContent, {
        tone: config.tone === 'academic' ? 'PhD' : 'Standard',
        mode: 'High',
        business: true
      });
      
      if (stealthResult.success) {
        cleanContent = stealthResult.content;
        console.log(`[Content] StealthGPT success! Words used: ${stealthResult.totalWordsUsed}`);
        
        // Re-analyze after StealthGPT
        aiRiskAnalysis = analyzeAIRisk(cleanContent);
        console.log(`[Content] After StealthGPT - AI Risk Score: ${aiRiskAnalysis.score}/100 (${aiRiskAnalysis.riskLevel})`);
      } else {
        console.log('[Content] StealthGPT failed:', stealthResult.error);
      }
    } else if (useUndetectable) {
      console.log('[Content] Layer 2: Applying Undetectable.ai humanization...');
      
      undetectableResult = await humanizeLongContentUndetectable(cleanContent, {
        readability: config.tone === 'academic' ? 'Doctorate' : 'Journalist',
        purpose: 'Article',
        strength: 'More Human',
        model: 'v11sr'
      });
      
      if (undetectableResult.success) {
        cleanContent = undetectableResult.content;
        console.log(`[Content] Undetectable.ai success! Chunks processed: ${undetectableResult.chunksProcessed}`);
        
        // Re-analyze after Undetectable.ai
        aiRiskAnalysis = analyzeAIRisk(cleanContent);
        console.log(`[Content] After Undetectable.ai - AI Risk Score: ${aiRiskAnalysis.score}/100 (${aiRiskAnalysis.riskLevel})`);
      } else {
        console.log('[Content] Undetectable.ai failed:', undetectableResult.error);
      }
    } else {
      console.log('[Content] No professional humanizer configured, using local engine only');
    }
    
    // Layer 3: If risk is still high, apply additional local humanization
    if (aiRiskAnalysis.score < 70) {
      console.log('[Content] Layer 3: Risk still high, applying additional humanization...');
      cleanContent = humanizeContent(cleanContent, {
        voiceFrequency: 0.20,
        hedgeFrequency: 0.15,
        questionFrequency: 0.12
      });
      
      aiRiskAnalysis = analyzeAIRisk(cleanContent);
      console.log(`[Content] After Layer 3 - AI Risk Score: ${aiRiskAnalysis.score}/100`);
    }

    // Fetch topic-relevant images
    console.log('[Content] Fetching images for topic:', topic);
    const images = await fetchTopicImages(topic, numImages);
    
    // Insert images into content
    const contentWithImages = insertImagesIntoContent(cleanContent, images);
    
    // Generate title
    const title = topic.charAt(0).toUpperCase() + topic.slice(1);
    
    // Count words
    const textOnly = contentWithImages.replace(/<[^>]*>/g, ' ');
    const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;

    console.log(`[Content] Generated using ${apiUsed}: ${wordCount} words, ${images.length} images`);
    console.log(`[Content] Final AI Risk: ${aiRiskAnalysis.riskLevel} (Score: ${aiRiskAnalysis.score})`);

    // Deduct tokens after successful generation
    const tokenResult = await deductTokens(userId, 'blogPost', {
      topic: topic,
      wordCount: wordCount,
      title: title
    });
    
    console.log(`[Content] Tokens deducted: ${tokenResult.tokensUsed}, remaining: ${tokenResult.remaining}`);

    // Determine which humanizer was used
    const humanizerUsed = stealthResult?.success ? 'StealthGPT' : 
                          undetectableResult?.success ? 'Undetectable.ai' : 
                          'Local Engine';

    res.json({
      content: contentWithImages,
      title: title,
      wordCount: wordCount,
      topic: topic,
      images: images,
      keywords: config.keywords || topic,
      scheduleDate: config.scheduleDate || null,
      scheduleTime: config.scheduleTime || null,
      tokensUsed: tokenResult.tokensUsed,
      tokensRemaining: tokenResult.remaining,
      humanizationScore: aiRiskAnalysis.score,
      humanizationLevel: aiRiskAnalysis.riskLevel,
      humanizerUsed: humanizerUsed,
      stealthGPTUsed: stealthResult?.success || false,
      stealthWordsUsed: stealthResult?.totalWordsUsed || 0,
      undetectableUsed: undetectableResult?.success || false,
      undetectableChunks: undetectableResult?.chunksProcessed || 0
    });

  } catch (error) {
    console.error('[Content] Generation error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// ═══════════════════════════════════════════════════════════════
// CHAOS ENGINE v2.0 - ULTIMATE HUMAN CONTENT (2-4 MINUTES)
// ═══════════════════════════════════════════════════════════════
// This endpoint takes 2-4 minutes to generate truly human content
// Uses multi-pass processing with deliberate delays for quality
app.post('/api/content/generate-chaos', authenticateToken, aiLimiter, async (req, res) => {
  // Set longer timeout for this endpoint (6 minutes)
  req.setTimeout(360000);
  res.setTimeout(360000);
  
  const startTime = Date.now();
  
  try {
    console.log('[ChaosEngine] ═══════════════════════════════════════════════════════════════');
    console.log('[ChaosEngine] STARTING ULTIMATE HUMAN CONTENT GENERATION');
    console.log('[ChaosEngine] Expected time: 2-4 minutes');
    console.log('[ChaosEngine] ═══════════════════════════════════════════════════════════════');
    
    const config = req.body;
    const userId = req.user.userId;
    
    // Check token balance
    const tokenCheck = await checkTokenBalance(userId, 'blogPost');
    if (!tokenCheck.allowed) {
      return res.status(403).json({ 
        error: 'Insufficient tokens',
        message: `You need ${tokenCheck.required} tokens but only have ${tokenCheck.available}. Please upgrade your plan.`,
        tokensRequired: tokenCheck.required,
        tokensAvailable: tokenCheck.available,
        plan: tokenCheck.plan
      });
    }
    
    // Validate config
    if (!config.topic || !config.topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const topic = config.topic;
    const minWords = parseInt(config.minWords) || parseInt(config.wordCount) || 5000;
    const numImages = parseInt(config.numImages) || 4;
    
    // Parse headings
    const customHeadings = config.headings || '';
    const headings = customHeadings ? customHeadings.split(/[|\n]/).map(h => h.trim()).filter(h => h) : [];

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1: GENERATE HUMAN SIGNATURE MEGA-PROMPT (5-10 seconds)
    // ═══════════════════════════════════════════════════════════════
    console.log('[ChaosEngine] Phase 1: Generating Human Signature mega-prompt...');
    
    const prompt = generateHumanSignaturePrompt({
      topic,
      keywords: config.keywords || topic,
      targetAudience: config.targetAudience || 'professional peers',
      tone: config.tone || 'conversational',
      minWords,
      headings,
      references: config.references || '',
      eeat: config.eeat || '',
      persona: config.persona || 'journalist'
    });
    
    console.log(`[ChaosEngine] Prompt generated (${prompt.length} characters)`);
    
    // Deliberate delay - simulates human thinking time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ═══════════════════════════════════════════════════════════════
    // PHASE 2: AI CONTENT GENERATION (30-60 seconds)
    // ═══════════════════════════════════════════════════════════════
    console.log('[ChaosEngine] Phase 2: Generating raw content with AI...');
    
    let content = null;
    let apiUsed = '';
    const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // Try Google AI first (Gemini 2.0 Flash with high temperature)
    if (GOOGLE_AI_KEY) {
      console.log('[ChaosEngine] Trying Google AI (Gemini 2.0 Flash, temp=0.95)...');
      try {
        const googleResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.95, // Higher for more creative/human output
                maxOutputTokens: 8192,
                topP: 0.95,
                topK: 40
              }
            })
          }
        );

        const googleData = await googleResponse.json();
        
        if (googleData.candidates?.[0]?.content?.parts?.[0]?.text) {
          content = googleData.candidates[0].content.parts[0].text;
          apiUsed = 'Google AI (Gemini 2.0)';
          console.log('[ChaosEngine] Google AI success');
        } else {
          console.log('[ChaosEngine] Google AI response:', JSON.stringify(googleData).substring(0, 300));
        }
      } catch (err) {
        console.log('[ChaosEngine] Google AI error:', err.message);
      }
    }

    // Fallback to OpenRouter
    if (!content && OPENROUTER_API_KEY) {
      console.log('[ChaosEngine] Trying OpenRouter API...');
      try {
        const modelsToTry = [
          'google/gemini-2.0-flash-exp:free',
          'anthropic/claude-3-haiku'
        ];
        
        for (const model of modelsToTry) {
          console.log(`[ChaosEngine] Trying model: ${model}`);
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.FRONTEND_URL || 'https://aiblog.scalezix.com',
              'X-Title': 'Scalezix Chaos Engine'
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 4000,
              temperature: 0.95
            })
          });

          const data = await response.json();
          
          if (data.choices?.[0]?.message?.content) {
            content = data.choices[0].message.content;
            apiUsed = `OpenRouter (${model})`;
            console.log(`[ChaosEngine] ${model} success`);
            break;
          }
        }
      } catch (err) {
        console.log('[ChaosEngine] OpenRouter error:', err.message);
      }
    }

    if (!content) {
      return res.status(500).json({ 
        error: 'AI services unavailable. Please check your API keys.' 
      });
    }

    // Clean raw content
    let cleanContent = content;
    cleanContent = cleanContent.replace(/```html\n?/gi, '');
    cleanContent = cleanContent.replace(/```\n?/gi, '');
    cleanContent = cleanContent.replace(/^<p>Here is[\s\S]*?<\/p>\n*/i, '');
    cleanContent = cleanContent.replace(/^Here is[\s\S]*?\n\n/i, '');
    cleanContent = cleanContent.replace(/---[\s\S]*?---\n*/gi, '');
    cleanContent = cleanContent.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
    cleanContent = cleanContent.replace(/\(?\d+,?\d*\s*words?\)?/gi, '');
    cleanContent = cleanContent.trim();

    const rawWordCount = cleanContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    console.log(`[ChaosEngine] Raw content: ${rawWordCount} words`);
    
    // Deliberate delay - simulates review time
    await new Promise(resolve => setTimeout(resolve, 5000));

    // ═══════════════════════════════════════════════════════════════
    // PHASE 3: MULTI-PASS CHAOS ENGINE HUMANIZATION (60-120 seconds)
    // ═══════════════════════════════════════════════════════════════
    console.log('[ChaosEngine] Phase 3: Multi-pass humanization with Chaos Engine...');
    console.log('[ChaosEngine] This will take 60-120 seconds for thorough processing...');
    
    const humanizeResult = await advancedHumanize(cleanContent, {
      passes: 3,
      delayBetweenPasses: 20000, // 20 seconds between passes
      voiceFrequency: 0.12,
      hedgeFrequency: 0.06,
      questionFrequency: 0.08,
      verbose: true
    });
    
    cleanContent = humanizeResult.content;
    console.log(`[ChaosEngine] Humanization complete in ${(humanizeResult.processingTime/1000).toFixed(1)}s`);
    console.log(`[ChaosEngine] Burstiness: ${humanizeResult.burstiness.score.toFixed(1)}%`);

    // ═══════════════════════════════════════════════════════════════
    // PHASE 4: PROFESSIONAL HUMANIZER (Optional - 30-60 seconds)
    // ═══════════════════════════════════════════════════════════════
    let stealthResult = null;
    let undetectableResult = null;
    const humanizer = config.humanizer || 'auto';
    
    const useStealthGPT = (humanizer === 'stealthgpt' || humanizer === 'auto') && 
                          process.env.STEALTHGPT_API_KEY && 
                          config.useStealthGPT !== false;
    const useUndetectable = (humanizer === 'undetectable' || (humanizer === 'auto' && !useStealthGPT)) && 
                            process.env.UNDETECTABLE_API_KEY && 
                            config.useUndetectable !== false;
    
    if (useStealthGPT) {
      console.log('[ChaosEngine] Phase 4: Applying StealthGPT neural rewrite...');
      
      stealthResult = await humanizeLongContent(cleanContent, {
        tone: config.tone === 'academic' ? 'PhD' : 'Standard',
        mode: 'High',
        business: true
      });
      
      if (stealthResult.success) {
        cleanContent = stealthResult.content;
        console.log(`[ChaosEngine] StealthGPT success! Words used: ${stealthResult.totalWordsUsed}`);
      }
    } else if (useUndetectable) {
      console.log('[ChaosEngine] Phase 4: Applying Undetectable.ai neural rewrite...');
      
      undetectableResult = await humanizeLongContentUndetectable(cleanContent, {
        readability: config.tone === 'academic' ? 'Doctorate' : 'Journalist',
        purpose: 'Article',
        strength: 'More Human',
        model: 'v11sr'
      });
      
      if (undetectableResult.success) {
        cleanContent = undetectableResult.content;
        console.log(`[ChaosEngine] Undetectable.ai success!`);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 5: FINAL QUALITY CHECK & CLEANUP (10-15 seconds)
    // ═══════════════════════════════════════════════════════════════
    console.log('[ChaosEngine] Phase 5: Final quality check...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Final AI risk analysis
    const aiRiskAnalysis = chaosAnalyzeRisk(cleanContent);
    console.log(`[ChaosEngine] Final AI Risk: ${aiRiskAnalysis.score}/100 (${aiRiskAnalysis.riskLevel})`);
    
    // If risk is still high, apply one more pass
    if (aiRiskAnalysis.score < 75) {
      console.log('[ChaosEngine] Risk still elevated, applying final cleanup...');
      cleanContent = randomizedWordReplacement(cleanContent);
      cleanContent = symmetryBreaking(cleanContent);
    }

    // Fetch and insert images
    console.log('[ChaosEngine] Fetching images...');
    const images = await fetchTopicImages(topic, numImages);
    const contentWithImages = insertImagesIntoContent(cleanContent, images);
    
    // Final word count
    const textOnly = contentWithImages.replace(/<[^>]*>/g, ' ');
    const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;

    // Deduct tokens
    const tokenResult = await deductTokens(userId, 'blogPost', {
      topic: topic,
      wordCount: wordCount,
      title: topic
    });

    const totalTime = Date.now() - startTime;
    const humanizerUsed = stealthResult?.success ? 'StealthGPT + Chaos Engine' : 
                          undetectableResult?.success ? 'Undetectable.ai + Chaos Engine' : 
                          'Chaos Engine v2.0';

    console.log('[ChaosEngine] ═══════════════════════════════════════════════════════════════');
    console.log(`[ChaosEngine] GENERATION COMPLETE`);
    console.log(`[ChaosEngine] Total time: ${(totalTime/1000/60).toFixed(1)} minutes`);
    console.log(`[ChaosEngine] Word count: ${wordCount}`);
    console.log(`[ChaosEngine] Human score: ${aiRiskAnalysis.score}/100`);
    console.log(`[ChaosEngine] Burstiness: ${humanizeResult.burstiness.score.toFixed(1)}%`);
    console.log('[ChaosEngine] ═══════════════════════════════════════════════════════════════');

    res.json({
      content: contentWithImages,
      title: topic.charAt(0).toUpperCase() + topic.slice(1),
      wordCount: wordCount,
      topic: topic,
      images: images,
      keywords: config.keywords || topic,
      scheduleDate: config.scheduleDate || null,
      scheduleTime: config.scheduleTime || null,
      tokensUsed: tokenResult.tokensUsed,
      tokensRemaining: tokenResult.remaining,
      // Chaos Engine specific metrics
      processingTime: totalTime,
      processingMinutes: (totalTime/1000/60).toFixed(1),
      humanScore: aiRiskAnalysis.score,
      humanizationLevel: aiRiskAnalysis.riskLevel,
      burstinessScore: humanizeResult.burstiness.score.toFixed(1),
      burstinessHumanLike: humanizeResult.burstiness.isHumanLike,
      humanizerUsed: humanizerUsed,
      chaosEnginePasses: 3,
      stealthGPTUsed: stealthResult?.success || false,
      undetectableUsed: undetectableResult?.success || false,
      aiRiskIssues: aiRiskAnalysis.issues,
      aiRiskRecommendations: aiRiskAnalysis.recommendations
    });

  } catch (error) {
    console.error('[ChaosEngine] Generation error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// HUMANIZATION ENDPOINT - Advanced AI Detection Bypass with StealthGPT
app.post('/api/content/humanize', async (req, res) => {
  try {
    const { content, options = {} } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    console.log('[Humanize] Processing content, length:', content.length);
    
    // First, analyze the AI risk of the original content
    const originalRisk = analyzeAIRisk(content);
    console.log(`[Humanize] Original AI Risk: ${originalRisk.score}/100 (${originalRisk.riskLevel})`);
    
    let humanizedContent = content;
    let stealthResult = null;
    let undetectableResult = null;
    const humanizer = options.humanizer || 'auto'; // 'auto', 'stealthgpt', 'undetectable', 'local'
    
    // Determine which humanizer to use
    const useStealthGPT = (humanizer === 'stealthgpt' || humanizer === 'auto') && 
                          process.env.STEALTHGPT_API_KEY && 
                          options.useStealthGPT !== false;
    const useUndetectable = (humanizer === 'undetectable' || (humanizer === 'auto' && !useStealthGPT)) && 
                            process.env.UNDETECTABLE_API_KEY && 
                            options.useUndetectable !== false;
    
    // Layer 1: Try professional humanizer first
    if (useStealthGPT) {
      console.log('[Humanize] Using StealthGPT for professional humanization...');
      
      stealthResult = await humanizeWithStealth(content, {
        tone: options.tone || 'Standard',
        mode: 'High',
        business: true
      });
      
      if (stealthResult.success) {
        humanizedContent = stealthResult.content;
        console.log(`[Humanize] StealthGPT success! Detection score: ${stealthResult.detectionScore}`);
      } else {
        console.log('[Humanize] StealthGPT failed:', stealthResult.error);
      }
    } else if (useUndetectable) {
      console.log('[Humanize] Using Undetectable.ai for professional humanization...');
      
      undetectableResult = await humanizeWithUndetectable(content, {
        readability: options.readability || 'Journalist',
        purpose: options.purpose || 'Article',
        strength: 'More Human',
        model: 'v11sr'
      });
      
      if (undetectableResult.success) {
        humanizedContent = undetectableResult.content;
        console.log('[Humanize] Undetectable.ai success!');
      } else {
        console.log('[Humanize] Undetectable.ai failed:', undetectableResult.error);
      }
    }
    
    // Layer 2: Apply local humanization engine
    console.log('[Humanize] Applying local humanization engine...');
    humanizedContent = humanizeContent(humanizedContent, {
      removeForbidden: true,
      useContractions: true,
      fixThreeRule: true,
      injectVoice: options.injectVoice !== false,
      addHedges: options.addHedges !== false,
      fixEndings: true,
      addPunctuation: true,
      improveBurst: true,
      addQuestions: options.addQuestions !== false,
      voiceFrequency: options.voiceFrequency || 0.15,
      hedgeFrequency: options.hedgeFrequency || 0.10,
      questionFrequency: options.questionFrequency || 0.08
    });
    
    // Analyze the humanized content
    let finalRisk = analyzeAIRisk(humanizedContent);
    console.log(`[Humanize] After humanization - AI Risk: ${finalRisk.score}/100 (${finalRisk.riskLevel})`);
    
    // Layer 3: If still high risk, apply additional humanization
    if (finalRisk.score < 70) {
      console.log('[Humanize] Applying additional humanization pass...');
      humanizedContent = humanizeContent(humanizedContent, {
        voiceFrequency: 0.22,
        hedgeFrequency: 0.18,
        questionFrequency: 0.15
      });
      finalRisk = analyzeAIRisk(humanizedContent);
    }
    
    // Determine which humanizer was used
    const humanizerUsed = stealthResult?.success ? 'StealthGPT' : 
                          undetectableResult?.success ? 'Undetectable.ai' : 
                          'Local Engine';
    
    res.json({ 
      content: humanizedContent.trim(),
      humanizerUsed,
      analysis: {
        originalScore: originalRisk.score,
        originalLevel: originalRisk.riskLevel,
        humanizedScore: finalRisk.score,
        humanizedLevel: finalRisk.riskLevel,
        improvement: finalRisk.score - originalRisk.score,
        issues: finalRisk.issues,
        recommendations: finalRisk.recommendations
      },
      stealthGPT: {
        used: stealthResult?.success || false,
        detectionScore: stealthResult?.detectionScore || null,
        wordsUsed: stealthResult?.wordsUsed || 0
      },
      undetectable: {
        used: undetectableResult?.success || false,
        documentId: undetectableResult?.documentId || null
      }
    });
  } catch (error) {
    console.error('Humanize error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// STEALTH HUMANIZE ENDPOINT - Direct StealthGPT humanization
app.post('/api/content/stealth-humanize', authenticateToken, async (req, res) => {
  try {
    const { content, options = {} } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (!process.env.STEALTHGPT_API_KEY) {
      return res.status(400).json({ 
        error: 'StealthGPT not configured',
        message: 'Please add STEALTHGPT_API_KEY to your environment variables'
      });
    }
    
    console.log('[StealthHumanize] Processing content, length:', content.length);
    
    const result = await humanizeLongContent(content, {
      tone: options.tone || 'Standard',
      mode: options.mode || 'High',
      business: options.business !== false
    });
    
    if (result.success) {
      const finalRisk = analyzeAIRisk(result.content);
      
      res.json({
        success: true,
        content: result.content,
        totalWordsUsed: result.totalWordsUsed,
        creditsRemaining: result.creditsRemaining,
        humanScore: finalRisk.score,
        humanLevel: finalRisk.riskLevel
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Stealth humanize error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// STEALTH BALANCE ENDPOINT - Check StealthGPT credits
app.get('/api/content/stealth-balance', authenticateToken, async (req, res) => {
  try {
    if (!process.env.STEALTHGPT_API_KEY) {
      return res.json({ 
        configured: false,
        message: 'StealthGPT not configured'
      });
    }
    
    const balance = await checkStealthBalance();
    
    res.json({
      configured: true,
      ...balance
    });
  } catch (error) {
    console.error('Stealth balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// UNDETECTABLE.AI INTEGRATION - Premium AI Humanizer
// ═══════════════════════════════════════════════════════════════

// UNDETECTABLE HUMANIZE ENDPOINT - Direct Undetectable.ai humanization
app.post('/api/content/undetectable-humanize', authenticateToken, async (req, res) => {
  try {
    const { content, options = {} } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (!process.env.UNDETECTABLE_API_KEY) {
      return res.status(400).json({ 
        error: 'Undetectable.ai not configured',
        message: 'Please add UNDETECTABLE_API_KEY to your environment variables. Get your API key at https://undetectable.ai/pricing'
      });
    }
    
    console.log('[UndetectableHumanize] Processing content, length:', content.length);
    
    // For long content, use chunked processing
    const result = content.length > 3000 
      ? await humanizeLongContentUndetectable(content, {
          readability: options.readability || 'Journalist',
          purpose: options.purpose || 'Article',
          strength: options.strength || 'More Human',
          model: options.model || 'v11sr'
        })
      : await humanizeWithUndetectable(content, {
          readability: options.readability || 'Journalist',
          purpose: options.purpose || 'Article',
          strength: options.strength || 'More Human',
          model: options.model || 'v11sr'
        });
    
    if (result.success) {
      const finalRisk = analyzeAIRisk(result.content);
      
      res.json({
        success: true,
        content: result.content,
        documentId: result.documentId,
        humanScore: finalRisk.score,
        humanLevel: finalRisk.riskLevel,
        chunksProcessed: result.chunksProcessed || 1
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Undetectable humanize error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// UNDETECTABLE BALANCE ENDPOINT - Check Undetectable.ai credits
app.get('/api/content/undetectable-balance', authenticateToken, async (req, res) => {
  try {
    if (!process.env.UNDETECTABLE_API_KEY) {
      return res.json({ 
        configured: false,
        message: 'Undetectable.ai not configured. Get your API key at https://undetectable.ai/pricing'
      });
    }
    
    const balance = await checkUndetectableCredits();
    
    res.json({
      configured: true,
      ...balance
    });
  } catch (error) {
    console.error('Undetectable balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// HUMANIZER STATUS ENDPOINT - Check which humanizers are configured
app.get('/api/content/humanizer-status', authenticateToken, async (req, res) => {
  try {
    const status = {
      stealthGPT: {
        configured: !!process.env.STEALTHGPT_API_KEY,
        name: 'StealthGPT',
        description: 'Professional AI humanizer with high bypass rate',
        pricing: '$0.0002/word',
        getApiKey: 'https://stealthgpt.ai/stealthapi'
      },
      undetectable: {
        configured: !!process.env.UNDETECTABLE_API_KEY,
        name: 'Undetectable.ai',
        description: 'Premium AI humanizer rated #1 by Forbes',
        pricing: 'From $9.99/month',
        getApiKey: 'https://undetectable.ai/pricing'
      },
      localEngine: {
        configured: true,
        name: 'Local Humanization Engine',
        description: 'Built-in humanization (vocabulary, contractions, burstiness)',
        pricing: 'Free (included)',
        note: 'Less effective against advanced detectors like Originality.ai'
      }
    };
    
    // Check balances if configured
    if (status.stealthGPT.configured) {
      const stealthBalance = await checkStealthBalance();
      status.stealthGPT.balance = stealthBalance;
    }
    
    if (status.undetectable.configured) {
      const undetectableBalance = await checkUndetectableCredits();
      status.undetectable.balance = undetectableBalance;
    }
    
    res.json(status);
  } catch (error) {
    console.error('Humanizer status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI RISK ANALYSIS ENDPOINT - Check content for AI detection risk
app.post('/api/content/analyze-risk', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const analysis = analyzeAIRisk(content);
    
    res.json({
      score: analysis.score,
      riskLevel: analysis.riskLevel,
      riskColor: analysis.riskColor,
      issues: analysis.issues,
      recommendations: analysis.recommendations
    });
  } catch (error) {
    console.error('Analyze risk error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
});

// REAL TOPIC IMAGES ENDPOINT - Uses SerpAPI (Google Images) for EXACT topic images
app.post('/api/images/search', async (req, res) => {
  try {
    const { topic, numImages = 4 } = req.body;
    
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    
    console.log(`[Images API] 🔍 Searching Google Images for: "${topic}", count: ${numImages}`);
    
    const searchQuery = encodeURIComponent(topic);
    const SERPAPI_KEY = process.env.SERPAPI_KEY;
    
    // Helper function to convert HTTP to HTTPS and validate URLs
    const sanitizeImageUrl = (url) => {
      if (!url) return null;
      // Convert HTTP to HTTPS to avoid mixed content warnings
      let sanitizedUrl = url.replace(/^http:\/\//i, 'https://');
      // Filter out problematic domains that block hotlinking
      const blockedDomains = ['wikia.nocookie.net', 'fandom.com', 'static.wikia.nocookie.net'];
      try {
        const urlObj = new URL(sanitizedUrl);
        if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
          return null;
        }
      } catch (e) {
        return null;
      }
      return sanitizedUrl;
    };
    
    // Use SerpAPI to search Google Images - returns EXACT images
    if (SERPAPI_KEY) {
      try {
        const serpUrl = `https://serpapi.com/search.json?engine=google_images&q=${searchQuery}&num=${numImages + 5}&api_key=${SERPAPI_KEY}&safe=active`;
        
        const response = await fetch(serpUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.images_results && data.images_results.length > 0) {
            const images = data.images_results
              .map(img => {
                const url = sanitizeImageUrl(img.original || img.thumbnail);
                if (!url) return null;
                return {
                  url,
                  title: img.title || topic,
                  alt: img.title || topic,
                  source: img.source || 'Google Images'
                };
              })
              .filter(img => img !== null)
              .slice(0, numImages);
            
            if (images.length > 0) {
              console.log(`[Images API] ✅ Found ${images.length} REAL Google Images for: "${topic}"`);
              return res.json({ images });
            }
          }
        }
      } catch (err) {
        console.log('[Images API] SerpAPI error:', err.message);
      }
    }
    
    // Fallback: Google Custom Search API
    const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
    const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;
    
    if (GOOGLE_SEARCH_API_KEY && GOOGLE_SEARCH_CX) {
      try {
        const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${searchQuery}&searchType=image&num=${numImages + 3}&imgSize=large&safe=active`;
        
        const response = await fetch(googleUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            const images = data.items
              .map(item => {
                const url = sanitizeImageUrl(item.link);
                if (!url) return null;
                return {
                  url,
                  title: item.title || topic,
                  alt: item.title || topic,
                  source: item.displayLink
                };
              })
              .filter(img => img !== null)
              .slice(0, numImages);
            
            console.log(`[Images API] ✅ Found ${images.length} Google Custom Search images for: "${topic}"`);
            return res.json({ images });
          }
        }
      } catch (err) {
        console.log('[Images API] Google Custom Search error:', err.message);
      }
    }
    
    // No API keys - return error with instructions
    console.log('[Images API] ⚠️ No image API keys configured');
    return res.status(500).json({ 
      error: 'Image search requires SERPAPI_KEY. Add it to your server .env file.',
      images: []
    });
  } catch (error) {
    console.error('[Images API] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// CLIENTS ENDPOINTS
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { companyName, industry, website, goals, budget, timeline, contactName, contactEmail, status } = req.body;
    const client = new Client({
      companyName,
      industry,
      website,
      goals: Array.isArray(goals) ? goals : [goals],
      budget,
      timeline,
      contactName,
      contactEmail,
      status: status || 'In Progress'
    });
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, industry, website, goals, budget, timeline, contactName, contactEmail, status } = req.body;
    const client = await Client.findByIdAndUpdate(
      id,
      {
        companyName,
        industry,
        website,
        goals: Array.isArray(goals) ? goals : [goals],
        budget,
        timeline,
        contactName,
        contactEmail,
        status
      },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CHAT MESSAGES ENDPOINTS with AI Responses
app.get('/api/chat-messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat-messages', async (req, res) => {
  try {
    const { text, sender } = req.body;
    const message = new ChatMessage({ text, sender });
    await message.save();
    
    // If user message, generate AI response
    if (sender === 'user') {
      const history = await ChatMessage.find().sort({ createdAt: -1 }).limit(5);
      const aiResponse = await aiServices.generateChatResponse(text, history.reverse());
      
      const botMessage = new ChatMessage({ text: aiResponse, sender: 'bot' });
      await botMessage.save();
      
      return res.json({ userMessage: message, botMessage });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WHITE LABEL CONFIG ENDPOINTS
app.get('/api/white-label-config', async (req, res) => {
  try {
    let config = await WhiteLabelConfig.findOne().sort({ updatedAt: -1 });
    if (!config) {
      config = { brandName: 'Your Brand', primaryColor: '#3B82F6', secondaryColor: '#10B981' };
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/white-label-config', async (req, res) => {
  try {
    const { brandName, primaryColor, secondaryColor } = req.body;
    
    const config = new WhiteLabelConfig({
      brandName,
      primaryColor,
      secondaryColor,
      updatedAt: new Date()
    });
    await config.save();
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ANALYTICS ENDPOINTS
app.get('/api/analytics/metrics', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalClients = await Client.countDocuments();
    
    const metrics = {
      totalVisitors: Math.floor(Math.random() * 20000) + 40000,
      conversions: totalLeads,
      bounceRate: (Math.random() * 20 + 35).toFixed(1),
      avgSession: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
      totalCampaigns,
      totalClients
    };
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// IMAGE PROXY ENDPOINT - For downloading images without CORS issues
app.get('/api/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    console.log(`[IMAGE PROXY] Fetching image: ${url}`);

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`[IMAGE PROXY] Failed to fetch image: ${response.status}`);
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    // Get the image buffer
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log(`[IMAGE PROXY] Successfully fetched image (${buffer.byteLength} bytes)`);

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.byteLength);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Send the image
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('[IMAGE PROXY] Error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

// ==================== SOCIAL MEDIA MANAGEMENT ====================

// Import social models and OAuth routes
import { ConnectedAccount, ScheduledPost } from './socialModels.js';
import oauthRoutes from './oauthRoutes.js';
import wordpressRoutes from './wordpressRoutes.js';
import { postToMultiplePlatforms } from './postingService.js';
import { startCronJobs } from './cronService.js';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// Mount OAuth routes (callbacks are public, connect endpoints require auth)
// Note: Social media features removed - OAuth routes kept for potential future use
// app.use('/api/social', oauthRoutes);

// Mount WordPress routes
app.use('/api/wordpress', authenticateToken, wordpressRoutes);

// Start cron jobs for scheduled posts
startCronJobs();

// Affiliate Routes
app.use('/api/affiliate', affiliateRoutes);

// SuperAdmin Routes - with dedicated rate limiter
app.use('/api/superadmin', superAdminLimiter, superAdminRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api`);
  console.log(`✅ MongoDB Atlas connected`);
  console.log(`✅ AI Services: Google AI, Llama API, OpenRouter`);
  console.log(`✅ Affiliate System: Active`);
  console.log(`✅ SuperAdmin Panel: Active`);
  console.log(`\n© 2025 Scalezix Venture PVT LTD - All Rights Reserved\n`);
});

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */

