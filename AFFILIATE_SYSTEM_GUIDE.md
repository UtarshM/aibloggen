# Affiliate System Guide
## Complete Documentation for AI Marketing Platform

**Author:** Scalezix Venture PVT LTD  
**Version:** 1.0.0  
**Last Updated:** December 2025

---

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Affiliate Flow](#affiliate-flow)
4. [Admin Flow](#admin-flow)
5. [URLs & Access Points](#urls--access-points)
6. [How to Approve Affiliates](#how-to-approve-affiliates)
7. [Managing Withdrawals](#managing-withdrawals)
8. [Adding Earnings Manually](#adding-earnings-manually)
9. [Database Models](#database-models)
10. [API Endpoints](#api-endpoints)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

The Affiliate System allows users to:
- Apply to become affiliates
- Get unique referral links
- Earn 20% commission on referred sales
- Request manual withdrawals (minimum ₹50,000)

Admins can:
- Approve/reject affiliate applications
- Process withdrawal requests
- Add earnings manually
- View all affiliate statistics

---

## User Roles

### 1. Affiliate (Public User)
- Applies via `/affiliate/apply`
- Logs in via `/affiliate/login`
- Views dashboard at `/affiliate/dashboard`
- Cannot access main platform admin features

### 2. Admin (Logged-in Platform User)
- Any user logged into the main platform can access Affiliate Admin
- Access via sidebar: "Affiliate Admin" or `/tools/affiliate-admin`
- Can approve/reject affiliates and process withdrawals

---

## Affiliate Flow

```
┌─────────────────┐
│  User visits    │
│ /affiliate/apply│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fills form:     │
│ - Name          │
│ - Email         │
│ - Password      │
│ - Website (opt) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status: PENDING │
│ (Cannot login)  │
└────────┬────────┘
         │
         ▼ (Admin approves)
┌─────────────────┐
│ Status: APPROVED│
│ (Can login now) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Affiliate       │
│ Dashboard       │
│ - Referral link │
│ - Stats         │
│ - Earnings      │
│ - Withdrawals   │
└─────────────────┘
```

---

## Admin Flow

```
┌─────────────────┐
│ Login to main   │
│ platform        │
│ /login          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Go to sidebar   │
│ "Affiliate Admin"│
│ or /tools/      │
│ affiliate-admin │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Admin Dashboard                 │
│ ┌─────────┬─────────┬─────────┐│
│ │Overview │Affiliates│Withdrawals││
│ └─────────┴─────────┴─────────┘│
└─────────────────────────────────┘
```

---

## URLs & Access Points

### Public URLs (No login required)
| URL | Description |
|-----|-------------|
| `/affiliate/apply` | Application form for new affiliates |
| `/affiliate/login` | Login page for approved affiliates |

### Affiliate URLs (Affiliate login required)
| URL | Description |
|-----|-------------|
| `/affiliate/dashboard` | Main affiliate dashboard |

### Admin URLs (Platform login required)
| URL | Description |
|-----|-------------|
| `/tools/affiliate-admin` | Admin panel for managing affiliates |

### Footer Link
- "Affiliate Program" link in footer → `/affiliate/apply`

### Sidebar Link
- "Affiliate Admin" in sidebar (after platform login)

---

## How to Approve Affiliates

### Step 1: Login to Main Platform
1. Go to `https://aiblog.scalezix.com/login`
2. Login with your admin/user credentials

### Step 2: Access Affiliate Admin
1. Click "Affiliate Admin" in the sidebar
2. Or go directly to `/tools/affiliate-admin`

### Step 3: View Pending Applications
1. Click "Affiliates" tab
2. Filter by "Pending" status
3. You'll see all pending applications

### Step 4: Approve an Affiliate
1. Find the affiliate in the list
2. Click the ✓ (green checkmark) button
3. Confirm the approval
4. Affiliate status changes to "Approved"
5. Affiliate can now login!

### Step 5: Reject an Affiliate (if needed)
1. Click the ✗ (red X) button
2. Enter rejection reason
3. Affiliate status changes to "Rejected"

---

## Managing Withdrawals

### When Affiliate Requests Withdrawal:
1. Affiliate must have minimum ₹50,000 available balance
2. They fill payment details (Bank/UPI/PayPal)
3. Request appears in Admin panel

### Admin Processing:
1. Go to "Withdrawals" tab in Affiliate Admin
2. Filter by "Requested" status
3. Review the withdrawal request
4. **To Complete:**
   - Click ✓ button
   - Enter transaction ID (your bank reference)
   - Funds are marked as withdrawn
5. **To Reject:**
   - Click ✗ button
   - Enter rejection reason
   - Funds return to affiliate's available balance

---

## Adding Earnings Manually

When a referred user makes a purchase:

1. Go to Affiliate Admin
2. Click "Add Earning" button (top right)
3. Fill the form:
   - **Affiliate ID:** MongoDB ID of the affiliate
   - **Revenue Amount:** Total sale amount in ₹
   - **Description:** e.g., "Subscription sale"
4. Click "Add Earning"
5. System automatically calculates 20% commission

**Example:**
- Revenue: ₹10,000
- Commission (20%): ₹2,000
- Added to affiliate's available balance

---

## Database Models

### Affiliate
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  slug: String,           // Unique referral code
  commissionPercent: 20,  // Default 20%
  status: 'pending' | 'approved' | 'rejected' | 'suspended',
  totalEarnings: Number,  // In paise (÷100 for ₹)
  availableBalance: Number,
  pendingBalance: Number,
  withdrawnBalance: Number,
  totalClicks: Number,
  totalConversions: Number
}
```

### Withdrawal
```javascript
{
  affiliateId: ObjectId,
  amount: Number,         // In paise
  status: 'requested' | 'processing' | 'completed' | 'rejected',
  paymentMethod: 'bank_transfer' | 'upi' | 'paypal',
  paymentDetails: {
    bankName, accountNumber, ifscCode, accountHolderName,
    upiId, paypalEmail
  }
}
```

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/affiliate/apply` | Submit application |
| POST | `/api/affiliate/login` | Affiliate login |
| POST | `/api/affiliate/track-click` | Track referral clicks |

### Affiliate Endpoints (requires affiliate token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/affiliate/dashboard` | Get dashboard data |
| GET | `/api/affiliate/earnings` | Get earnings history |
| GET | `/api/affiliate/withdrawals` | Get withdrawal history |
| POST | `/api/affiliate/withdraw` | Request withdrawal |
| PUT | `/api/affiliate/profile` | Update profile |
| PUT | `/api/affiliate/change-password` | Change password |

### Admin Endpoints (requires platform token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/affiliate/admin/list` | List all affiliates |
| GET | `/api/affiliate/admin/stats` | Get system stats |
| GET | `/api/affiliate/admin/:id` | Get affiliate details |
| PUT | `/api/affiliate/admin/:id/approve` | Approve affiliate |
| PUT | `/api/affiliate/admin/:id/reject` | Reject affiliate |
| GET | `/api/affiliate/admin/withdrawals` | List withdrawals |
| PUT | `/api/affiliate/admin/withdrawal/:id/complete` | Complete withdrawal |
| PUT | `/api/affiliate/admin/withdrawal/:id/reject` | Reject withdrawal |
| POST | `/api/affiliate/admin/add-earning` | Add earning manually |

---

## Troubleshooting

### "Application still under review"
**Cause:** Affiliate status is "pending"  
**Solution:** Admin must approve the affiliate in Affiliate Admin panel

### "Failed to submit application"
**Cause:** Backend not updated on AWS  
**Solution:** Deploy latest code to AWS and restart PM2

### "Affiliate Admin shows no data"
**Cause:** API calls failing  
**Solution:** Check if backend is running and CORS is configured

### "Cannot find Affiliate Admin in sidebar"
**Cause:** Not logged into main platform  
**Solution:** Login at `/login` first, then check sidebar

### Minimum Withdrawal Amount
- Set to ₹50,000 (5000000 paise)
- Can be changed in `server/affiliateModels.js`:
  ```javascript
  export const MINIMUM_WITHDRAWAL_AMOUNT = 5000000; // Change this
  ```

---

## Quick Start Checklist

- [ ] Deploy backend to AWS
- [ ] Restart PM2: `pm2 restart scalezix-backend`
- [ ] Login to main platform
- [ ] Go to Affiliate Admin
- [ ] Approve pending affiliates
- [ ] Test affiliate login

---

## Support

For issues, contact: Scalezix Venture PVT LTD

---

*© 2025 Scalezix Venture PVT LTD - All Rights Reserved*
