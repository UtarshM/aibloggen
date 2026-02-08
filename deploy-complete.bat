@echo off
echo ========================================
echo Scalezix Complete Deployment Script
echo ========================================
echo.

REM Step 1: Commit and push to GitHub
echo [1/3] Pushing code to GitHub...
git add .
git commit -m "Fix: Added /affiliate/ redirect and updated deployment docs"
git push origin main

if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

echo.
echo ✅ Code pushed to GitHub successfully!
echo.

REM Step 2: Instructions for AWS deployment
echo [2/3] AWS Deployment Instructions:
echo ========================================
echo.
echo Please run these commands on your AWS server:
echo.
echo   ssh ec2-user@your-aws-ip
echo   cd /home/ec2-user/apps/aibloggen
echo   git pull origin main
echo   cd server
echo   npm install
echo   pm2 restart aibloggen-backend
echo   pm2 logs aibloggen-backend --lines 50
echo.
echo ========================================
echo.

REM Step 3: Instructions for Vercel deployment
echo [3/3] Vercel Deployment Instructions:
echo ========================================
echo.
echo 1. Go to: https://vercel.com/dashboard
echo 2. Select your project (aiblogfinal or aibloggen)
echo 3. Go to Settings → Environment Variables
echo 4. Add/Update:
echo    Name: VITE_API_URL
echo    Value: https://blogapi.scalezix.com/api
echo 5. Go to Deployments tab
echo 6. Click Redeploy (UNCHECK "Use existing Build Cache")
echo.
echo ========================================
echo.

echo ✅ Deployment script completed!
echo.
echo Next Steps:
echo 1. Deploy to AWS (see instructions above)
echo 2. Update Vercel environment variable
echo 3. Test: https://aiblog.scalezix.com
echo.
pause
