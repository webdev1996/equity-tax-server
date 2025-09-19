#!/bin/bash

# Oracle Cloud Infrastructure Setup Script for Equity Tax Application
# Run this script on your Oracle Cloud compute instance

set -e

echo "🚀 Setting up Oracle Cloud Infrastructure for Equity Tax Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root. Use 'opc' user or your regular user."
    exit 1
fi

print_header "Step 1: System Update"
print_status "Updating system packages..."
sudo yum update -y

print_header "Step 2: Install Docker"
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    print_warning "Please log out and log back in for Docker group changes to take effect"
    print_warning "Or run: newgrp docker"
else
    print_status "Docker is already installed"
fi

print_header "Step 3: Install Docker Compose"
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose is already installed"
fi

print_header "Step 4: Install Nginx"
print_status "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo yum install -y nginx
    sudo systemctl enable nginx
    print_status "Nginx installed successfully"
else
    print_status "Nginx is already installed"
fi

print_header "Step 5: Install Certbot"
print_status "Installing Certbot for SSL certificates..."
if ! command -v certbot &> /dev/null; then
    sudo yum install -y certbot python3-certbot-nginx
    print_status "Certbot installed successfully"
else
    print_status "Certbot is already installed"
fi

print_header "Step 6: Configure Firewall"
print_status "Configuring firewall rules..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
print_status "Firewall configured successfully"

print_header "Step 7: Create Application Directory"
print_status "Setting up application directory..."
sudo mkdir -p /opt/equity-tax
sudo chown $USER:$USER /opt/equity-tax
cd /opt/equity-tax
print_status "Application directory created at /opt/equity-tax"

print_header "Step 8: Create Environment File Template"
print_status "Creating environment configuration template..."
cat > .env.template << EOF
# Production Environment Variables for Equity Tax Application
# Copy this to .env and update with your actual values

# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://dashboard.equitytax1.com

# Database Configuration
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/equity-tax?retryWrites=true&w=majority

# JWT Configuration - CHANGE THESE IN PRODUCTION
# Generate secure secrets using: openssl rand -hex 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-32-chars-minimum
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-32-chars-minimum
JWT_REFRESH_EXPIRE=30d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF

print_status "Environment template created at /opt/equity-tax/.env.template"

print_header "Step 9: Create Logs Directory"
mkdir -p logs
print_status "Logs directory created"

print_header "Step 10: Setup Complete!"
print_status "Oracle Cloud Infrastructure setup completed successfully!"
print_warning "Next steps:"
print_warning "1. Upload your application files to /opt/equity-tax/"
print_warning "2. Copy .env.template to .env and update with your values"
print_warning "3. Configure your MongoDB Atlas database"
print_warning "4. Set up DNS records for your domains"
print_warning "5. Run: docker-compose -f docker-compose.prod.yml up -d --build"
print_warning "6. Configure SSL certificates with: sudo certbot --nginx -d accounts.equitytax1.com -d dashboard.equitytax1.com"

echo ""
print_status "Your server is ready for deployment!"
print_status "Application directory: /opt/equity-tax"
print_status "Environment template: /opt/equity-tax/.env.template"
print_status "Logs directory: /opt/equity-tax/logs"

echo ""
print_warning "Important: Make sure to:"
print_warning "- Update .env file with your MongoDB Atlas connection string"
print_warning "- Generate secure JWT secrets"
print_warning "- Configure DNS to point to this server"
print_warning "- Test your application before going live"

echo "🎉 Oracle Cloud setup completed successfully!"
