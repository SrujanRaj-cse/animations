@echo off
echo Starting Algorithm Visualizer...
echo.
echo Installing dependencies...
call npm install
cd frontend
call npm install
cd ../backend
call npm install
cd ..
echo.
echo Starting development servers...
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
echo.
call npm run dev
