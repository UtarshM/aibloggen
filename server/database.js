import mongoose from 'mongoose';

// NO dotenv here - env is loaded ONCE in server.js

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MongoDB URI missing from environment variables');
    console.log('⚠️ Server will continue without database (content generation still works)');
    global.mongoConnected = false;
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected successfully');
    global.mongoConnected = true;
  } catch (error) {
    console.error('⚠️ MongoDB connection error:', error.message);
    console.log('⚠️ Server will continue without database (content generation still works)');
    global.mongoConnected = false;
    // Don't exit - allow server to run without MongoDB
  }
};

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: String,
  industry: String,
  budget: String,
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Content Schema
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  aiGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Social Post Schema
const socialPostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  platform: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, default: 'scheduled' },
  aiGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Client Schema
const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: String,
  website: String,
  goals: [String],
  budget: String,
  timeline: String,
  contactName: String,
  contactEmail: String,
  status: { type: String, default: 'In Progress' },
  createdAt: { type: Date, default: Date.now }
});

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roi: Number,
  spend: Number,
  conversions: Number,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// White Label Config Schema
const whiteLabelConfigSchema = new mongoose.Schema({
  brandName: String,
  primaryColor: String,
  secondaryColor: String,
  logoUrl: String,
  updatedAt: { type: Date, default: Date.now }
});

// SEO Analysis Schema
const seoAnalysisSchema = new mongoose.Schema({
  url: String,
  keyword: String,
  score: Number,
  analysis: Object,
  createdAt: { type: Date, default: Date.now }
});

// Newsletter Subscriber Schema
const newsletterSubscriberSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  source: {
    type: String,
    default: 'website' // website, signup, manual
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date
});

export const Lead = mongoose.model('Lead', leadSchema);
export const Content = mongoose.model('Content', contentSchema);
export const SocialPost = mongoose.model('SocialPost', socialPostSchema);
export const Client = mongoose.model('Client', clientSchema);
export const Campaign = mongoose.model('Campaign', campaignSchema);
export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export const WhiteLabelConfig = mongoose.model('WhiteLabelConfig', whiteLabelConfigSchema);
export const SEOAnalysis = mongoose.model('SEOAnalysis', seoAnalysisSchema);
export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

export default connectDB;
