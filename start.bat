@echo off
title TouchGrass AI
echo ==========================================
echo       Launching TouchGrass AI
echo ==========================================
echo Starting Python FastAPI backend on port 8000...
start "TouchGrass Backend" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo Starting Vite React frontend on port 5173...
start "TouchGrass Frontend" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1"

echo.
echo TouchGrass AI is starting up!
echo Visit: http://127.0.0.1:5173/
pause
