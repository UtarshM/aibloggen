@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo AUTOMATED DEPLOYMENT SCRIPT
echo Enhanced Chaos Engine v2.0 to GitHub and AWS
echo ================================================================
echo.

REM Check if token file exists
if exist .github-token (
    set /p GITHUB_TOKEN=<.github-token
    echo Using saved GitHub token...
) else (
    echo ================================================================
    echo FIRST TIME SETUP - GitHub Personal Access Token Required
    echo ================================================================
    echo.
    echo Please get your token from: https://github.com/settings/tokens
    echo   1. Click "Generate new token (classic)"
    echo   2. Select "repo" scope
    echo   3. Copy the token
    echo.
    set /p GITHUB_TOKEN="Paste your GitHub token here: "
    echo !GITHUB_TOKEN!>.github-token
    echo Token saved for future use.
)

echo.
echo ================================================================
echo STEP 1: Pushing to GitHub
echo ================================================================
echo Repository: https://github.com/UtarshM/Harsh_AI_Blogs
echo.

REM Update remote URL with token
git remote set-url origin https://!GITHUB_TOKEN!@github.com/UtarshM/Harsh_AI_Blogs.git

REM Push to GitHub
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo SUCCESS! Code pushed to GitHub
    echo ================================================================
    echo View at: https://github.com/UtarshM/Harsh_AI_Blogs
    echo.
    
    REM Ask for AWS deployment
    echo ================================================================
    echo STEP 2: Deploy to AWS?
    echo ================================================================
    echo.
    set /p DEPLOY_AWS="Do you want to deploy to AWS now? (y/n): "
    
    if /i "!DEPLOY_AWS!"=="y" (
        echo.
        echo ================================================================
        echo AWS Deployment
        echo ================================================================
        echo.
        
        REM Check if AWS config exists
        if exist .aws-config (
            set /p AWS_SERVER=<.aws-config
            echo Using saved AWS server: !AWS_SERVER!
        ) else (
            set /p AWS_SERVER="Enter AWS server IP or hostname: "
            echo !AWS_SERVER!>.aws-config
        )
        
        set /p SSH_USER="Enter SSH username (default: ubuntu): "
        if "!SSH_USER!"=="" set SSH_USER=ubuntu
        
        echo.
        echo Connecting to AWS server...
        echo.
        
        REM SSH and deploy
        ssh !SSH_USER!@!AWS_SERVER! "cd /var/www/scalezix-backend && git pull origin main && pm2 restart scalezix-backend && pm2 logs scalezix-backend --lines 20 --nostream"
        
        if %ERRORLEVEL% EQU 0 (
            echo.
            echo ================================================================
            echo AWS DEPLOYMENT SUCCESSFUL!
            echo ================================================================
            echo.
            echo Your Enhanced Chaos Engine v2.0 is now live!
            echo.
            echo Test at: https://aiblog.scalezix.com
            echo.
            echo Expected Results:
            echo   - Human Score: 85-95%%
            echo   - Burstiness: 45-55%%
            echo   - Processing Time: 2-4 minutes
            echo   - Originality.ai: 80-100%% Human
            echo.
        ) else (
            echo.
            echo ================================================================
            echo AWS DEPLOYMENT FAILED
            echo ================================================================
            echo.
            echo Please check:
            echo   1. SSH connection to AWS server
            echo   2. Repository path: /var/www/scalezix-backend
            echo   3. PM2 service name: scalezix-backend
            echo.
        )
    ) else (
        echo.
        echo Skipping AWS deployment.
        echo You can deploy later by running: bash deploy-to-aws.sh
        echo.
    )
    
) else (
    echo.
    echo ================================================================
    echo GITHUB PUSH FAILED
    echo ================================================================
    echo.
    echo Please check:
    echo   1. Your GitHub token is valid
    echo   2. You have access to the repository
    echo   3. Internet connection is working
    echo.
    echo Delete .github-token file and run again to enter a new token.
    echo.
)

echo.
echo ================================================================
echo DEPLOYMENT COMPLETE
echo ================================================================
echo.
pause
