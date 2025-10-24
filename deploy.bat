@echo off
echo 🚀 Starting Algorithm Visualizer Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating environment file from template...
    copy env.example .env
    echo ⚠️  Please update .env file with your configuration before running again.
    pause
    exit /b 1
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

REM Test API health
echo 🏥 Testing API health...
curl -f http://localhost:5000/api/health || echo ❌ Backend health check failed

REM Test frontend
echo 🌐 Testing frontend...
curl -f http://localhost:3000 || echo ❌ Frontend health check failed

echo ✅ Deployment completed!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 📊 MongoDB: localhost:27017

echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart
echo   Update services: docker-compose pull ^&^& docker-compose up -d

pause
