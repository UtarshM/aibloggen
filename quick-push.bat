@echo off
echo ================================================================
echo Quick Push to GitHub
echo ================================================================
echo.
echo IMPORTANT: You need a Personal Access Token (not password)
echo Get it from: https://github.com/settings/tokens
echo.
set /p TOKEN="Paste your GitHub token here: "
echo.
echo Pushing to GitHub...
git remote set-url origin https://%TOKEN%@github.com/UtarshM/Harsh_AI_Blogs.git
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ================================================================
    echo SUCCESS! Code pushed to GitHub
    echo ================================================================
    echo View at: https://github.com/UtarshM/Harsh_AI_Blogs
) else (
    echo ================================================================
    echo FAILED - Please check your token
    echo ================================================================
)
pause
