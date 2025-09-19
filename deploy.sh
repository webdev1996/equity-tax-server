#!/bin/bash

# Equity Tax Application Deployment Script for Oracle Cloud
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Equity Tax Application Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_warning "Please log out and log back in for Docker group changes to take effect"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx
print_status "Installing Nginx..."
sudo apt install nginx -y

# Install Certbot for SSL
print_status "Installing Certbot for SSL certificates..."
sudo apt install certbot python3-certbot-nginx -y

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /opt/equity-tax
sudo chown $USER:$USER /opt/equity-tax
cd /opt/equity-tax

# Copy application files
print_status "Copying application files..."
# Note: You'll need to upload your application files here
# This could be done via git clone, scp, or other methods

# Create logs directory
mkdir -p logs

# Create environment file template
print_status "Creating environment configuration..."
cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://dashboard.equitytax1.com

# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/equity-tax

# JWT Configuration - CHANGE THESE IN PRODUCTION
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-$(openssl rand -hex 32)
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-$(openssl rand -hex 32)
JWT_REFRESH_EXPIRE=30d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF

print_warning "Please update the .env file with your actual MongoDB Atlas connection string and other production values"

# Build and start the application
print_status "Building and starting the application..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for application to start
print_status "Waiting for application to start..."
sleep 30

# Check if application is running
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "Application is running successfully!"
else
    print_error "Application failed to start. Check logs with: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

# Configure Nginx
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/equity-tax
sudo ln -sf /etc/nginx/sites-available/equity-tax /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Setup SSL certificates
print_status "Setting up SSL certificates..."
print_warning "You need to have your domain DNS pointing to this server before running the next command"
print_warning "Run this command manually after DNS is configured:"
echo "sudo certbot --nginx -d accounts.equitytax1.com -d dashboard.equitytax1.com"

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/equity-tax > /dev/null << EOF
/opt/equity-tax/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker-compose -f /opt/equity-tax/docker-compose.prod.yml restart equity-tax-app
    endscript
}
EOF

# Setup systemd service for auto-start
print_status "Setting up systemd service..."
sudo tee /etc/systemd/system/equity-tax.service > /dev/null << EOF
[Unit]
Description=Equity Tax Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/equity-tax
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable equity-tax.service

print_status "Deployment completed successfully!"
print_status "Your application should be accessible at:"
print_status "  - https://accounts.equitytax1.com"
print_status "  - https://dashboard.equitytax1.com"
print_warning "Don't forget to:"
print_warning "  1. Update .env file with your MongoDB Atlas connection string"
print_warning "  2. Configure DNS to point to this server"
print_warning "  3. Run SSL certificate setup: sudo certbot --nginx -d accounts.equitytax1.com -d dashboard.equitytax1.com"
print_warning "  4. Test your application thoroughly"

echo "🎉 Deployment script completed!"