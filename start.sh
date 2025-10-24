#!/bin/bash

echo "Starting Algorithm Visualizer..."
echo ""
echo "Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
echo ""
echo "Starting development servers..."
echo "Frontend will be available at: http://localhost:5173"
echo "Backend will be available at: http://localhost:5000"
echo ""
npm run dev
