#!/bin/bash

# Algorithm Visualizer Deployment Script

echo "🚀 Starting Algorithm Visualizer Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration before running again."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test API health
echo "🏥 Testing API health..."
curl -f http://localhost:5000/api/health || echo "❌ Backend health check failed"

# Test frontend
echo "🌐 Testing frontend..."
curl -f http://localhost:3000 || echo "❌ Frontend health check failed"

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 MongoDB: localhost:27017"

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  Update services: docker-compose pull && docker-compose up -d"
