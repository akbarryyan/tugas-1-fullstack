@echo off
echo ===============================================
echo    Starting Fullstack Application
echo ===============================================
echo.
echo Starting both Backend and Frontend servers...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ===============================================
echo.

start /b cmd /c "cd tugas-2-backend && php artisan serve"
timeout /t 3 /nobreak >nul
start /b cmd /c "cd tugas-1-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Please wait a moment for servers to fully initialize.
echo Then open http://localhost:5173 in your browser.
echo Login with: admin / pastibisa
echo.
pause
