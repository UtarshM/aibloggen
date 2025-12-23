import axios from 'axios';

// API URL Configuration - Uses VITE_API_URL env variable
// Fallback to AWS production URL if env not set
const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api');

// Debug: Log API URL in console
console.log('[API] Environment:', import.meta.env.MODE, 'Using:', API_BASE);

// Export for use in other components
export const getApiUrl = () => API_BASE;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Axios instance for direct use
  ...axiosInstance,
  // Leads with AI Scoring
  getLeads: async () => {
    const res = await fetch(`${API_BASE}/leads`);
    return res.json();
  },
  createLead: async (data) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Content with AI Generation
  getContent: async () => {
    const res = await fetch(`${API_BASE}/content`);
    return res.json();
  },
  saveContent: async (data) => {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  generateContent: async (prompt) => {
    const res = await fetch(`${API_BASE}/content/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate content');
    }
    return data;
  },
  generateHumanContent: async (config) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/content/generate-human`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate content');
    }
    return data;
  },
  humanizeContent: async (content) => {
    const res = await fetch(`${API_BASE}/content/humanize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to humanize content');
    }
    return data;
  },
  searchRealImages: async (content, topic, numImages = 4) => {
    const res = await fetch(`${API_BASE}/images/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, topic, numImages }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to search images');
    }
    return data;
  },

  // Social Posts with AI Generation
  getSocialPosts: async () => {
    const res = await fetch(`${API_BASE}/social-posts`);
    return res.json();
  },
  createSocialPost: async (data) => {
    const res = await fetch(`${API_BASE}/social-posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  generateSocialPost: async (topic, platform) => {
    const res = await fetch(`${API_BASE}/social-posts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, platform }),
    });
    return res.json();
  },

  // Clients
  getClients: async () => {
    const res = await fetch(`${API_BASE}/clients`);
    return res.json();
  },
  createClient: async (data) => {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Campaigns with AI Optimization
  getCampaigns: async () => {
    const res = await fetch(`${API_BASE}/campaigns`);
    return res.json();
  },
  optimizeCampaign: async (campaignData) => {
    const res = await fetch(`${API_BASE}/campaigns/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignData }),
    });
    return res.json();
  },

  // Chat with AI Responses
  getChatMessages: async () => {
    const res = await fetch(`${API_BASE}/chat-messages`);
    return res.json();
  },
  sendChatMessage: async (data) => {
    const res = await fetch(`${API_BASE}/chat-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // SEO with AI Analysis
  analyzeKeywords: async (keyword) => {
    const res = await fetch(`${API_BASE}/seo/keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    return res.json();
  },
  analyzePage: async (url, keyword) => {
    const res = await fetch(`${API_BASE}/seo/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, keyword }),
    });
    return res.json();
  },
  checkTechnicalSEO: async (url) => {
    const res = await fetch(`${API_BASE}/seo/technical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return res.json();
  },
  compareCompetitor: async (yourUrl, competitorUrl, keyword) => {
    const res = await fetch(`${API_BASE}/seo/competitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ yourUrl, competitorUrl, keyword }),
    });
    return res.json();
  },

  // Analytics
  getMetrics: async () => {
    const res = await fetch(`${API_BASE}/analytics/metrics`);
    return res.json();
  },

  // Social Media Management
  getConnectedAccounts: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  connectSocialAccount: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/accounts/connect`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to connect account');
    }
    return result;
  },
  disconnectSocialAccount: async (accountId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  getScheduledPosts: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/posts/scheduled`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  schedulePost: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/posts/schedule`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to schedule post');
    }
    return result;
  },
  postToSocial: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/posts/publish`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to publish post');
    }
    return result;
  },
  deleteScheduledPost: async (postId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },

  // WordPress Auto-Publishing
  getWordPressSites: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/sites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  addWordPressSite: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/sites`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to add WordPress site');
    }
    return result;
  },
  testWordPressSite: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/sites/test`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to test connection');
    }
    return result;
  },
  deleteWordPressSite: async (siteId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/sites/${siteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  publishToWordPress: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/publish`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to publish to WordPress');
    }
    return result;
  },
  bulkImportToWordPress: async (formData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to start bulk import');
    }
    return result;
  },
  getBulkImportJob: async (jobId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  deleteBulkImportJob: async (jobId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to delete job');
    }
    return result;
  },
  downloadBulkImportExcel: async (jobId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import/${jobId}/export-excel`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to download Excel');
    }
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordpress-bulk-import-report-${jobId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  getAllBulkImportJobs: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },
  deleteWordPressPost: async (postId, siteId, wordpressPostId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteId, wordpressPostId })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to delete post');
    }
    return result;
  },
  bulkDeleteWordPressPosts: async (siteId, postIds) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/posts/bulk-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteId, postIds })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to bulk delete posts');
    }
    return result;
  },
  getBulkImportReport: async (jobId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import/${jobId}/report`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to get report');
    }
    return result;
  },
  getAllBulkImportJobs: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/wordpress/bulk-import`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },

  // AI Social Content Generation
  generateSocialContent: async (config) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/social/generate-content`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to generate social content');
    }
    return result;
  },

  // ═══════════════════════════════════════════════════════════════
  // AFFILIATE SYSTEM API
  // ═══════════════════════════════════════════════════════════════

  // Affiliate Public Endpoints
  affiliateApply: async (data) => {
    const res = await fetch(`${API_BASE}/affiliate/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit application');
    return result;
  },

  affiliateLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/affiliate/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  affiliateTrackClick: async (slug, page, referrer) => {
    const res = await fetch(`${API_BASE}/affiliate/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, page, referrer }),
    });
    return res.json();
  },

  // Affiliate Authenticated Endpoints
  getAffiliateDashboard: async () => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load dashboard');
    return result;
  },

  getAffiliateEarnings: async (page = 1, limit = 20) => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/earnings?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load earnings');
    return result;
  },

  getAffiliateWithdrawals: async () => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/withdrawals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load withdrawals');
    return result;
  },

  affiliateWithdraw: async (data) => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/withdraw`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit withdrawal');
    return result;
  },

  updateAffiliateProfile: async (data) => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update profile');
    return result;
  },

  changeAffiliatePassword: async (currentPassword, newPassword) => {
    const token = localStorage.getItem('affiliateToken');
    const res = await fetch(`${API_BASE}/affiliate/change-password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to change password');
    return result;
  },

  // Admin Affiliate Endpoints
  getAdminAffiliates: async (status, page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE}/affiliate/admin/list?status=${status}&page=${page}&limit=${limit}`
      : `${API_BASE}/affiliate/admin/list?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load affiliates');
    return result;
  },

  approveAffiliate: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}/approve`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to approve affiliate');
    return result;
  },

  rejectAffiliate: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}/reject`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reject affiliate');
    return result;
  },

  getAdminWithdrawals: async (status, page = 1, limit = 20) => {
    const token = localStorage.getItem('token');
    const url = status 
      ? `${API_BASE}/affiliate/admin/withdrawals?status=${status}&page=${page}&limit=${limit}`
      : `${API_BASE}/affiliate/admin/withdrawals?page=${page}&limit=${limit}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load withdrawals');
    return result;
  },

  completeWithdrawal: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/withdrawal/${id}/complete`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to complete withdrawal');
    return result;
  },

  rejectWithdrawal: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/withdrawal/${id}/reject`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reject withdrawal');
    return result;
  },

  addAffiliateEarning: async (data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/add-earning`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add earning');
    return result;
  },

  getAffiliateStats: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load stats');
    return result;
  },

  getAffiliateDetails: async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load affiliate');
    return result;
  },

  simulatePurchase: async (userEmail, planName, amount) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/simulate-purchase`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userEmail, planName, amount }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to simulate purchase');
    return result;
  },

  getReferredUsers: async (affiliateId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/referred-users/${affiliateId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load referred users');
    return result;
  },

  // ═══════════════════════════════════════════════════════════════
  // NEWSLETTER API
  // ═══════════════════════════════════════════════════════════════

  subscribeNewsletter: async (email) => {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to subscribe');
    return result;
  },

  // ═══════════════════════════════════════════════════════════════
  // SUPERADMIN API
  // ═══════════════════════════════════════════════════════════════

  superAdminLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/superadmin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  getSuperAdminStats: async () => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load stats');
    return result;
  },

  getSuperAdminUsers: async (filter = 'all', page = 1, limit = 20, search = '') => {
    const token = localStorage.getItem('superAdminToken');
    const params = new URLSearchParams({ filter, page, limit, search });
    const res = await fetch(`${API_BASE}/superadmin/users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load users');
    return result;
  },

  superAdminDeleteUser: async (userId) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete user');
    return result;
  },

  superAdminVerifyUser: async (userId) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/users/${userId}/verify`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to verify user');
    return result;
  },

  superAdminToggleAdmin: async (userId, isAdmin) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/users/${userId}/admin`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ isAdmin })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update admin status');
    return result;
  },

  suspendAffiliate: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}/suspend`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to suspend affiliate');
    return result;
  },

  banAffiliate: async (id, data) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}/ban`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to ban affiliate');
    return result;
  },

  reactivateAffiliate: async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/affiliate/admin/${id}/reactivate`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reactivate affiliate');
    return result;
  },

  getSuperAdminNewsletterSubscribers: async () => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/newsletter/subscribers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load subscribers');
    return result;
  },

  sendSuperAdminNewsletter: async (data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/newsletter/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send newsletter');
    return result;
  },

  getSuperAdminWordPressJobs: async () => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/wordpress/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load jobs');
    return result;
  },

  getSuperAdminWordPressSites: async () => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/wordpress/sites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load sites');
    return result;
  },

  getSuperAdminActivityLogs: async (page = 1, limit = 50) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/activity?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load logs');
    return result;
  },

  updateSuperAdminSettings: async (settings) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(settings)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update settings');
    return result;
  },

  // SuperAdmin Affiliate Management
  getSuperAdminAffiliates: async (status = 'all', page = 1, limit = 20, search = '') => {
    const token = localStorage.getItem('superAdminToken');
    const params = new URLSearchParams({ status, page, limit, search });
    const res = await fetch(`${API_BASE}/superadmin/affiliates?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load affiliates');
    return result;
  },

  getSuperAdminAffiliateDetails: async (id) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load affiliate');
    return result;
  },

  superAdminApproveAffiliate: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/approve`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to approve affiliate');
    return result;
  },

  superAdminRejectAffiliate: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/reject`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reject affiliate');
    return result;
  },

  superAdminSuspendAffiliate: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/suspend`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to suspend affiliate');
    return result;
  },

  superAdminBanAffiliate: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/ban`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to ban affiliate');
    return result;
  },

  superAdminReactivateAffiliate: async (id) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/reactivate`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reactivate affiliate');
    return result;
  },

  superAdminAddAffiliateEarning: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/add-earning`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add earning');
    return result;
  },

  // SuperAdmin Withdrawal Management
  getSuperAdminWithdrawals: async (status = 'all', page = 1, limit = 20) => {
    const token = localStorage.getItem('superAdminToken');
    const params = new URLSearchParams({ status, page, limit });
    const res = await fetch(`${API_BASE}/superadmin/withdrawals?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load withdrawals');
    return result;
  },

  superAdminCompleteWithdrawal: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/withdrawals/${id}/complete`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to complete withdrawal');
    return result;
  },

  superAdminRejectWithdrawal: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/withdrawals/${id}/reject`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to reject withdrawal');
    return result;
  },

  // SuperAdmin User Details
  getSuperAdminUserDetails: async (id) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load user');
    return result;
  },

  superAdminUpdateUserPlan: async (id, data) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/users/${id}/plan`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update plan');
    return result;
  },

  // SuperAdmin Analytics
  getSuperAdminAnalytics: async (days = 30) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/analytics?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load analytics');
    return result;
  },

  // SuperAdmin Export
  superAdminExportData: async (type) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/export/${type}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to export data');
    return result;
  },

  // SuperAdmin System Info
  getSuperAdminSystemInfo: async () => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/system`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load system info');
    return result;
  },

  // SuperAdmin Verify Token
  verifySuperAdminToken: async () => {
    const token = localStorage.getItem('superAdminToken');
    if (!token) return { success: false };
    const res = await fetch(`${API_BASE}/superadmin/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    return result;
  },

  // SuperAdmin Newsletter Subscriber Management
  superAdminAddNewsletterSubscriber: async (email) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/newsletter/subscribers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ email })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to add subscriber');
    return result;
  },

  superAdminDeleteNewsletterSubscriber: async (id) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/newsletter/subscribers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to delete subscriber');
    return result;
  },

  // ═══════════════════════════════════════════════════════════════
  // SUPERADMIN - AFFILIATE TRACKING & ANALYTICS
  // ═══════════════════════════════════════════════════════════════

  getSuperAdminReferredUsers: async (page = 1, limit = 20, affiliateId = '') => {
    const token = localStorage.getItem('superAdminToken');
    const params = new URLSearchParams({ page, limit });
    if (affiliateId) params.append('affiliateId', affiliateId);
    const res = await fetch(`${API_BASE}/superadmin/referred-users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load referred users');
    return result;
  },

  getSuperAdminAffiliatePerformance: async (days = 30) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliate-performance?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load performance');
    return result;
  },

  superAdminBulkApproveAffiliates: async (affiliateIds, commissionPercent = 20) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/bulk-approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ affiliateIds, commissionPercent })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to bulk approve');
    return result;
  },

  superAdminBulkRejectAffiliates: async (affiliateIds, reason) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/bulk-reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ affiliateIds, reason })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to bulk reject');
    return result;
  },

  getSuperAdminUserGrowth: async (days = 30) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/user-growth?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load user growth');
    return result;
  },

  superAdminSendEmail: async (email, subject, message) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/send-email`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ email, subject, message })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to send email');
    return result;
  },

  getSuperAdminClickAnalytics: async (days = 30) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/click-analytics?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load click analytics');
    return result;
  },

  superAdminUpdateAffiliateCommission: async (id, commissionPercent) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/affiliates/${id}/commission`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ commissionPercent })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update commission');
    return result;
  },

  getSuperAdminRevenueAnalytics: async (days = 30) => {
    const token = localStorage.getItem('superAdminToken');
    const res = await fetch(`${API_BASE}/superadmin/revenue-analytics?days=${days}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to load revenue analytics');
    return result;
  },
};
