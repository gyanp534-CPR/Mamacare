@echo off
REM MamaCare Edge Functions Deployment Script
REM This script deploys both Edge Functions with JWT authentication enabled

echo ================================================================
echo     MamaCare Edge Functions Deployment
echo ================================================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Supabase CLI not found!
    echo.
    echo Please install Supabase CLI first:
    echo.
    echo Option 1 - NPM:
    echo   npm install -g supabase
    echo.
    echo Option 2 - Scoop ^(Windows^):
    echo   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    echo   scoop install supabase
    echo.
    echo Option 3 - Direct Download:
    echo   https://github.com/supabase/cli/releases
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo [OK] Supabase CLI found
echo.

REM Check for CORS placeholder
findstr /C:"your-domain.vercel.app" "supabase\functions\claude-proxy\index.ts" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] CORS domain placeholder detected!
    echo.
    echo The Edge Functions still have placeholder CORS domains.
    echo You need to replace "https://your-domain.vercel.app" with your actual domain.
    echo.
    set /p domain="Enter your production domain (e.g., mamacare.vercel.app): "
    
    if "!domain!"=="" (
        echo [ERROR] Domain cannot be empty
        pause
        exit /b 1
    )
    
    REM Update CORS in both files using PowerShell
    powershell -Command "(Get-Content 'supabase\functions\claude-proxy\index.ts') -replace 'https://your-domain.vercel.app', 'https://!domain!' | Set-Content 'supabase\functions\claude-proxy\index.ts'"
    powershell -Command "(Get-Content 'supabase\functions\razorpay-subscription\index.ts') -replace 'https://your-domain.vercel.app', 'https://!domain!' | Set-Content 'supabase\functions\razorpay-subscription\index.ts'"
    
    echo [OK] CORS domains updated to: https://!domain!
    echo.
)

REM Check if logged in to Supabase
supabase projects list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Not logged in to Supabase
    echo.
    echo Please login first:
    supabase login
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Login failed
        pause
        exit /b 1
    )
)

echo [OK] Logged in to Supabase
echo.

REM Check if project is linked
if not exist ".supabase\config.toml" (
    echo [WARNING] Project not linked
    echo.
    echo Please link your Supabase project:
    supabase link
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Project link failed
        pause
        exit /b 1
    )
)

echo [OK] Project linked
echo.
echo ================================================================
echo     Deploying Edge Functions
echo ================================================================
echo.

REM Deploy claude-proxy
echo [1/2] Deploying claude-proxy...
echo       - JWT authentication: ENABLED
echo       - Rate limiting: Database-backed
echo       - CORS: Domain-locked
echo.

supabase functions deploy claude-proxy
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] claude-proxy deployment failed!
    echo.
    echo Common issues:
    echo   1. ANTHROPIC_API_KEY secret not set
    echo      Fix: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
    echo   2. TypeScript compilation error
    echo      Fix: Check index.ts for syntax errors
    echo   3. Project not linked
    echo      Fix: supabase link
    echo.
    pause
    exit /b 1
)

echo [OK] claude-proxy deployed successfully
echo.

REM Deploy razorpay-subscription
echo [2/2] Deploying razorpay-subscription...
echo       - JWT authentication: ENABLED
echo       - Payment verification: HMAC-SHA256
echo       - CORS: Domain-locked
echo.

supabase functions deploy razorpay-subscription
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] razorpay-subscription deployment failed!
    echo.
    echo Common issues:
    echo   1. RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set
    echo      Fix: supabase secrets set RAZORPAY_KEY_ID=rzp_...
    echo      Fix: supabase secrets set RAZORPAY_KEY_SECRET=...
    echo   2. TypeScript compilation error
    echo      Fix: Check index.ts for syntax errors
    echo.
    pause
    exit /b 1
)

echo [OK] razorpay-subscription deployed successfully
echo.
echo ================================================================
echo     Deployment Complete!
echo ================================================================
echo.
echo [SUCCESS] Both Edge Functions deployed with JWT authentication
echo.
echo Next Steps:
echo   1. Verify deployment in Supabase Dashboard
echo   2. Run database migration: schema_security_updates.sql
echo   3. Deploy frontend to Vercel: vercel --prod
echo   4. Run verification: node verify-security.js
echo.
echo Security Features Enabled:
echo   - JWT authentication required (no anonymous access)
echo   - Database-backed rate limiting (survives cold starts)
echo   - Domain-locked CORS (prevents abuse)
echo   - HMAC signature verification (Razorpay payments)
echo.
pause
