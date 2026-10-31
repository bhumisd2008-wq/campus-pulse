@echo off
set "PATH=C:\Users\HP\AppData\Local\Programs\Git\cmd;C:\Users\HP\AppData\Local\Programs\Git\ucrt64\bin;%PATH%"
cd /d "%~dp0"

:: 1. If Git is not set up yet, initialize it automatically
if not exist ".git" (
    echo Initializing new Git repository...
    git init
    git branch -M main
    git remote add origin https://github.com/bhumisd2008-wq/campus-pulse.git
)

:: 2. Stage all files, commit, and push
echo Pushing files to GitHub...
git add .
git commit -m "Initial commit" 2>nul
git push -u origin main

echo.
echo Done! Your code is on GitHub.
pause