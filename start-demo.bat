@echo off
echo ================================================================
echo SCALEZIX - Enhanced Chaos Engine v2.0
echo Client Demo Startup
echo ================================================================
echo.

echo Starting Backend Server...
echo.
start cmd /k "cd server && echo [BACKEND] Starting on port 3001... && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
echo.
start cmd /k "echo [FRONTEND] Starting on port 5173... && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ================================================================
echo DEMO READY!
echo ================================================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Two terminal windows have opened:
echo   1. Backend Server (port 3001)
echo   2. Frontend Dev Server (port 5173)
echo.
echo Wait 10-15 seconds for both servers to start, then:
echo   Open browser: http://localhost:5173
echo.
echo ================================================================
echo DEMO TIPS:
echo ================================================================
echo.
echo 1. Create test account: demo@scalezix.com / demo123
echo 2. Go to Content Creation
echo 3. Click "AI Gen" button
echo 4. Generate sample blog post (2-4 minutes)
echo 5. Show 85-95%% human score
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173

echo.
echo Browser opened! Demo is ready.
echo.
echo To stop servers: Close both terminal windows
echo.
pause
