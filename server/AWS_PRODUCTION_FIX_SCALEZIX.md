# AWS Production Fix Guide
**Project:** AI Blog Automation / Scalezix  
**Purpose:** Final production fixes & handover for AWS deployment  

---

## 1. Objective
Migrate completely from Railway/Render to AWS EC2 and ensure:
- Single backend (AWS)
- Correct CORS
- Stable MongoDB
- Working AI content generation
- Clean frontend-backend integration

---

## 2. Final Architecture
Frontend (Vite): https://aiblog.scalezix.com  
Backend (AWS EC2 + PM2): https://blogapi.scalezix.com/api  
Database: MongoDB Atlas  

---

## 3. Backend – server.js (MANDATORY)

```js
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import connectDB from './database.js';

const app = express();

app.use(cors({
  origin: [
    'https://aiblog.scalezix.com',
    'https://blogapi.scalezix.com'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());
app.use(express.json());

connectDB();

app.listen(process.env.PORT || 3001, () => {
  console.log('Server running');
});
```

---

## 4. Backend – database.js (FINAL)

```js
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) return;

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB error', err.message);
  }
};

export default connectDB;
```

---

## 5. Backend Environment (.env)

```
NODE_ENV=production
PORT=3001
MONGODB_URI=...
MONGO_URI=...
EMAIL_ENABLED=false
OPENROUTER_API_KEY=...
JWT_SECRET=...
```

---

## 6. Frontend – API Configuration

- Remove ALL hardcoded URLs:
  - railway.app
  - onrender.com

Use only:
```js
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

---

## 7. Frontend Environment (.env.production)

```
VITE_API_URL=https://blogapi.scalezix.com/api
```

---

## 8. Frontend Rebuild (REQUIRED)

```bash
npm run build
```

Deploy build output to:
https://aiblog.scalezix.com

---

## 9. PM2 Commands

```bash
pm2 start server.js --name scalezix-backend
pm2 save
pm2 startup
```

---

## 10. Common Errors & Fixes

### CORS Error
Cause: frontend using old backend or backend missing origin  
Fix: rebuild frontend + correct CORS config

### 500 AI Error
Cause: missing AI API keys  
Fix: add OPENROUTER_API_KEY or GOOGLE_AI_KEY

---

## 11. Developer Rules

- Never hardcode API URLs
- dotenv only in server.js
- Always rebuild frontend after env change
- One backend only (AWS)

---

## 12. Status
This document represents the **final correct production state**.
