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
};
