@echo off
chcp 65001 > nul
echo ===============================================
echo   Push portfolio redesign to GitHub
echo ===============================================
echo.

cd /d "%~dp0"

REM Remove stale lock file if present
if exist ".git\index.lock" (
  echo [1/4] Removing stale lock file...
  del /f /q ".git\index.lock"
)

echo [2/4] Staging changes...
git add -A
if errorlevel 1 goto :error

echo.
echo [3/4] Creating commit...
git commit -m "Redesign portfolio: hacker terminal theme + 19 HTB badges + CTF cert" -m "- Upgraded hacker/terminal design with matrix rain background, neon green/cyan palette, glitch hover effects" -m "- Added all 19 HTB Academy module badges in HTB-style circular grid with progress bar (19/158)" -m "- Added HTB CTF Cyber Apocalypse 2025 Certificate (image preview + PDF download)" -m "- Removed broken contact form; replaced with email/phone/LinkedIn/GitHub/HTB grid" -m "- Added scroll-reveal animations, sticky navbar, mobile menu, image modal" -m "- Added Metasploit and Nmap to skills"
if errorlevel 1 (
  echo.
  echo Commit may have failed - perhaps nothing to commit, or no git identity set.
  echo Trying anyway with default identity...
  git config user.name "plastma65"
  git config user.email "trantuananh.businessman@gmail.com"
)

echo.
echo [4/4] Pushing to origin/main...
git push origin main
if errorlevel 1 goto :error

echo.
echo ===============================================
echo   Done! Check https://github.com/plastma65/Portfolio
echo ===============================================
pause
exit /b 0

:error
echo.
echo ===============================================
echo   Something went wrong. See messages above.
echo ===============================================
pause
exit /b 1
