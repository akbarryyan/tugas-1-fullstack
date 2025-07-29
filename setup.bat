@echo off
echo ===============================================
echo     Tugas 3 - Fullstack Integration Setup
echo ===============================================
echo.

echo 1. Setting up Backend (Laravel)...
cd tugas-2-backend
echo - Installing Composer dependencies...
call composer install
echo - Running migrations and seeders...
call php artisan migrate --seed --force
echo - Backend setup complete!
cd ..

echo.
echo 2. Setting up Frontend (React)...
cd tugas-1-frontend
echo - Installing NPM dependencies...
call npm install
echo - Frontend setup complete!
cd ..

echo.
echo ===============================================
echo                Setup Complete!
echo ===============================================
echo.
echo To start the applications:
echo 1. Run start-backend.bat to start Laravel server
echo 2. Run start-frontend.bat to start React dev server
echo 3. Open http://localhost:5173 in your browser
echo 4. Login with: admin / pastibisa
echo.
pause
