@echo off
chcp 65001 > nul
echo ========================================================
echo   FIX stuck rebase + Re-push portfolio update
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/8] Cleaning any stale lock files...
if exist ".git\index.lock" del /f /q ".git\index.lock"

echo [2/8] Aborting any in-progress rebase / merge...
git rebase --abort 2>nul
git merge --abort 2>nul
git cherry-pick --abort 2>nul

echo [3/8] Backing up your local files to a temp folder...
if not exist "%TEMP%\portfolio_backup" mkdir "%TEMP%\portfolio_backup"
copy /y "index.html" "%TEMP%\portfolio_backup\" > nul
copy /y "styles.css" "%TEMP%\portfolio_backup\" > nul
copy /y "script.js" "%TEMP%\portfolio_backup\" > nul
if exist "images\ctf-certificate-vui.png" (
  copy /y "images\ctf-certificate-vui.png" "%TEMP%\portfolio_backup\" > nul
)
if exist "images\ctf-certificate-vui.pdf" (
  copy /y "images\ctf-certificate-vui.pdf" "%TEMP%\portfolio_backup\" > nul
)
echo     Backup saved at %TEMP%\portfolio_backup\

echo [4/8] Fetching latest from remote...
git fetch origin
if errorlevel 1 goto :error

echo [5/8] Hard-reset local main to match origin/main...
git reset --hard origin/main
if errorlevel 1 goto :error

echo [6/8] Restoring your local files from backup...
copy /y "%TEMP%\portfolio_backup\index.html" "index.html" > nul
copy /y "%TEMP%\portfolio_backup\styles.css" "styles.css" > nul
copy /y "%TEMP%\portfolio_backup\script.js" "script.js" > nul
if exist "%TEMP%\portfolio_backup\ctf-certificate-vui.png" (
  copy /y "%TEMP%\portfolio_backup\ctf-certificate-vui.png" "images\ctf-certificate-vui.png" > nul
)
if exist "%TEMP%\portfolio_backup\ctf-certificate-vui.pdf" (
  copy /y "%TEMP%\portfolio_backup\ctf-certificate-vui.pdf" "images\ctf-certificate-vui.pdf" > nul
)

echo [7/8] Staging + committing fresh changes...
git add -A
git commit -m "Add Projects section + redesign: ML Phishing Detection + Recommender System" -m "- Hacker terminal theme with matrix rain background, neon green/cyan palette" -m "- 19 HTB Academy module badges in HTB-style circular grid (19/158 progress)" -m "- HTB CTF Cyber Apocalypse 2025 Certificate (image + PDF download)" -m "- Project 1: Anomalous Email Phishing Detection - 99.96%% accuracy, 100%% precision" -m "- Project 2: Personalized Learning Recommender System - First Prize NCKH 2024-2025" -m "- New contact grid (email/phone/LinkedIn/GitHub/HTB), scroll-reveal, image modal"
if errorlevel 1 (
  echo [!] Nothing to commit - working tree may already be clean.
)

echo [8/8] Pushing to origin/main...
git push origin main
if errorlevel 1 goto :error

echo.
echo ========================================================
echo   SUCCESS! Check https://github.com/plastma65/Portfolio
echo ========================================================
pause
exit /b 0

:error
echo.
echo ========================================================
echo   Failed. Showing git status for debug:
echo ========================================================
git status
pause
exit /b 1
