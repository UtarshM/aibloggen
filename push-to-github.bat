@echo off
echo ================================================================
echo Pushing Enhanced Chaos Engine v2.0 to GitHub
echo ================================================================
echo.

REM Update remote URL
git remote set-url origin https://github.com/UtarshM/Harsh_AI_Blogs.git

echo Repository URL updated to: https://github.com/UtarshM/Harsh_AI_Blogs.git
echo.
echo ================================================================
echo IMPORTANT: You need to authenticate as UtarshM
echo ================================================================
echo.
echo When prompted:
echo   Username: UtarshM
echo   Password: Use your Personal Access Token (NOT your password)
echo.
echo Get token from: https://github.com/settings/tokens
echo   - Click "Generate new token (classic)"
echo   - Select "repo" scope
echo   - Copy the token
echo.
echo ================================================================
echo.

REM Configure credential helper to cache credentials
git config --global credential.helper wincred

echo Pushing to GitHub...
echo.

git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo SUCCESS! Code pushed to GitHub
    echo ================================================================
    echo.
    echo Repository: https://github.com/UtarshM/Harsh_AI_Blogs
    echo.
    echo Next step: Deploy to AWS
    echo   Run: bash deploy-to-aws.sh
    echo.
) else (
    echo.
    echo ================================================================
    echo PUSH FAILED
    echo ================================================================
    echo.
    echo Please check:
    echo   1. You're authenticated as UtarshM (not harshkuhikar)
    echo   2. You have access to the repository
    echo   3. Your Personal Access Token is valid
    echo.
    echo Alternative: Use GitHub Desktop to push
    echo.
)

pause
