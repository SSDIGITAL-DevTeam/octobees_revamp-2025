@echo off
echo ========================================
echo Partner API Full Testing Script
echo ========================================
echo.

REM Step 1: Login to get JWT token
echo [1/6] Testing Login...
curl.exe -X POST http://localhost:8080/api/v1/affiliate/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"testpartner@example.com\",\"password\":\"password123\"}" ^
  -o login-response.json
echo.
echo Login response saved to login-response.json
echo Please copy the JWT token from the response and set it as TOKEN variable
echo.
pause

REM Set your JWT token here (copy from login-response.json)
set TOKEN=YOUR_JWT_TOKEN_HERE

echo.
echo [2/6] Testing Dashboard Stats...
curl.exe http://localhost:8080/api/v1/partner/dashboard/stats ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo [3/6] Testing Dashboard Services...
curl.exe http://localhost:8080/api/v1/partner/dashboard/services ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo [4/6] Testing Dashboard Commissions...
curl.exe http://localhost:8080/api/v1/partner/dashboard/commissions ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo [5/6] Testing Get All Leads...
curl.exe http://localhost:8080/api/v1/partner/leads ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo [6/6] Testing Get Profile...
curl.exe http://localhost:8080/api/v1/partner/profile ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo.

echo ========================================
echo Testing Complete!
echo ========================================
pause
