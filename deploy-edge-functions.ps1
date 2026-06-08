# MamaCare Edge Functions Deployment Script (PowerShell)
# This script deploys both Edge Functions with JWT authentication enabled

$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "    🔒 MamaCare Edge Functions Deployment" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command existence
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Check if Supabase CLI is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-Command "supabase")) {
    Write-Host "[ERROR] Supabase CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Supabase CLI first:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 - NPM:" -ForegroundColor Cyan
    Write-Host "  npm install -g supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2 - Scoop (Windows):" -ForegroundColor Cyan
    Write-Host "  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git" -ForegroundColor White
    Write-Host "  scoop install supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3 - Direct Download:" -ForegroundColor Cyan
    Write-Host "  https://github.com/supabase/cli/releases" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "[✓] Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Check for CORS placeholder
$claudeProxy = "supabase\functions\claude-proxy\index.ts"
$razorpay = "supabase\functions\razorpay-subscription\index.ts"

$claudeContent = Get-Content $claudeProxy -Raw
if ($claudeContent -match "your-domain\.vercel\.app") {
    Write-Host "[⚠] CORS domain placeholder detected!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The Edge Functions still have placeholder CORS domains." -ForegroundColor Yellow
    Write-Host "You need to replace 'https://your-domain.vercel.app' with your actual domain." -ForegroundColor Yellow
    Write-Host ""
    
    $domain = Read-Host "Enter your production domain (e.g., mamacare.vercel.app)"
    
    if ([string]::IsNullOrWhiteSpace($domain)) {
        Write-Host "[ERROR] Domain cannot be empty" -ForegroundColor Red
        exit 1
    }
    
    # Ensure https:// prefix
    if (-not $domain.StartsWith("http")) {
        $domain = "https://$domain"
    }
    
    # Update CORS in both files
    Write-Host ""
    Write-Host "Updating CORS domains to: $domain" -ForegroundColor Yellow
    
    $claudeContent = $claudeContent -replace "https://your-domain\.vercel\.app", $domain
    $razorpayContent = Get-Content $razorpay -Raw
    $razorpayContent = $razorpayContent -replace "https://your-domain\.vercel\.app", $domain
    
    Set-Content $claudeProxy -Value $claudeContent -NoNewline
    Set-Content $razorpay -Value $razorpayContent -NoNewline
    
    Write-Host "[✓] CORS domains updated" -ForegroundColor Green
    Write-Host ""
}

# Check if logged in to Supabase
Write-Host "Checking Supabase authentication..." -ForegroundColor Yellow
try {
    $null = supabase projects list 2>&1
} catch {
    Write-Host "[INFO] Not logged in to Supabase" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please login first..." -ForegroundColor Yellow
    supabase login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[✓] Logged in to Supabase" -ForegroundColor Green
Write-Host ""

# Check if project is linked
if (-not (Test-Path ".supabase\config.toml")) {
    Write-Host "[⚠] Project not linked" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please link your Supabase project..." -ForegroundColor Yellow
    supabase link
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Project link failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[✓] Project linked" -ForegroundColor Green
Write-Host ""

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "    🚀 Deploying Edge Functions" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Deploy claude-proxy
Write-Host "[1/2] Deploying claude-proxy..." -ForegroundColor Cyan
Write-Host "      - JWT authentication: ENABLED" -ForegroundColor Gray
Write-Host "      - Rate limiting: Database-backed" -ForegroundColor Gray
Write-Host "      - CORS: Domain-locked" -ForegroundColor Gray
Write-Host ""

supabase functions deploy claude-proxy

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] claude-proxy deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. ANTHROPIC_API_KEY secret not set" -ForegroundColor White
    Write-Host "     Fix: supabase secrets set ANTHROPIC_API_KEY=sk-ant-..." -ForegroundColor Gray
    Write-Host "  2. TypeScript compilation error" -ForegroundColor White
    Write-Host "     Fix: Check index.ts for syntax errors" -ForegroundColor Gray
    Write-Host "  3. Project not linked" -ForegroundColor White
    Write-Host "     Fix: supabase link" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "[✓] claude-proxy deployed successfully" -ForegroundColor Green
Write-Host ""

# Deploy razorpay-subscription
Write-Host "[2/2] Deploying razorpay-subscription..." -ForegroundColor Cyan
Write-Host "      - JWT authentication: ENABLED" -ForegroundColor Gray
Write-Host "      - Payment verification: HMAC-SHA256" -ForegroundColor Gray
Write-Host "      - CORS: Domain-locked" -ForegroundColor Gray
Write-Host ""

supabase functions deploy razorpay-subscription

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] razorpay-subscription deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set" -ForegroundColor White
    Write-Host "     Fix: supabase secrets set RAZORPAY_KEY_ID=rzp_..." -ForegroundColor Gray
    Write-Host "     Fix: supabase secrets set RAZORPAY_KEY_SECRET=..." -ForegroundColor Gray
    Write-Host "  2. TypeScript compilation error" -ForegroundColor White
    Write-Host "     Fix: Check index.ts for syntax errors" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "[✓] razorpay-subscription deployed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "    ✅ Deployment Complete!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[SUCCESS] Both Edge Functions deployed with JWT authentication" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Verify deployment in Supabase Dashboard" -ForegroundColor White
Write-Host "  2. Run database migration: schema_security_updates.sql" -ForegroundColor White
Write-Host "  3. Deploy frontend to Vercel: vercel --prod" -ForegroundColor White
Write-Host "  4. Run verification: node verify-security.js <domain> <supabase-url>" -ForegroundColor White
Write-Host ""
Write-Host "Security Features Enabled:" -ForegroundColor Yellow
Write-Host "  ✓ JWT authentication required (no anonymous access)" -ForegroundColor Green
Write-Host "  ✓ Database-backed rate limiting (survives cold starts)" -ForegroundColor Green
Write-Host "  ✓ Domain-locked CORS (prevents abuse)" -ForegroundColor Green
Write-Host "  ✓ HMAC signature verification (Razorpay payments)" -ForegroundColor Green
Write-Host ""
