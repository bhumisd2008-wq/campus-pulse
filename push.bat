@echo off
set "PATH=C:\Users\HP\AppData\Local\Programs\Git\cmd;C:\Users\HP\AppData\Local\Programs\Git\ucrt64\bin;%PATH%"
cd /d "%~dp0"
echo ===================================================
echo   Pushing 'Campus Pulse' to GitHub
echo   Repository: https://github.com/bhumisd2008-wq/campus-pulse.git
echo ===================================================
echo.
git add .
git commit -m "Update Campus Pulse files" 2>nul
git push -u origin main
echo.
echo ===================================================
echo   Success! Code is updated on GitHub.
echo ===================================================
echo.
pause
