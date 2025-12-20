/**
 * Authentication Models - User and OTP
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import mongoose from 'mongoose';

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
    enum: ['free', 'starter', 'professional', 'enterprise'],
    default: 'free'
  },
  planExpiry: {
    type: Date
  },
  // Usage tracking
  apiUsage: {
    contentGenerated: { type: Number, default: 0 },
    imagesGenerated: { type: Number, default: 0 },
    socialPosts: { type: Number, default: 0 },
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
  }
});

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
