#!/bin/bash

echo "🚀 Setting up UbuntuCap development environment..."

# Update and install system dependencies
sudo apt-get update
sudo apt-get install -y postgresql-client redis-tools

# Install Python dependencies
cd backend
pip install --upgrade pip
pip install -r requirements/development.txt

# Setup frontend
cd ../frontend
npm install

# Create necessary directories
cd ../backend
mkdir -p data/ml_models
mkdir -p data/datasets/{raw,processed}
mkdir -p staticfiles
mkdir -p media

echo "✅ Setup complete! Starting services..."

# Start Redis
redis-server --daemonize yes

echo "🎉 UbuntuCap is ready! Run 'python manage.py runserver' to start the backend."