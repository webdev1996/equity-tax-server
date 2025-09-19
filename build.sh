#!/bin/bash

# Equity Tax Production Build Script
# This script builds the application for production deployment

set -e

echo "🏗️  Building Equity Tax for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Display Node.js and npm versions
print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf build
rm -rf backend/node_modules
rm -rf node_modules

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Create production environment file
print_status "Creating production environment configuration..."
cat > .env.production << EOF
REACT_APP_API_URL=/api
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
EOF

# Build frontend
print_status "Building frontend for production..."
npm run build

# Verify build
if [ -d "build" ]; then
    print_success "Frontend build completed successfully"
    print_status "Build size: $(du -sh build | cut -f1)"
else
    print_error "Frontend build failed"
    exit 1
fi

# Create production package
print_status "Creating production package..."
mkdir -p dist
cp -r build dist/frontend
cp -r backend dist/backend
cp docker-compose.yml dist/
cp Dockerfile.frontend dist/
cp nginx.conf dist/
cp deploy.sh dist/
cp README.md dist/

# Create production package.json for backend
cat > dist/backend/package.json << EOF
{
  "name": "equity-tax-backend",
  "version": "1.0.0",
  "description": "Backend API for Equity Tax Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0",
    "multer": "^1.4.5-lts.1",
    "express-rate-limit": "^6.10.0",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.4",
    "stripe": "^13.5.0",
    "compression": "^1.7.4",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.4",
    "hpp": "^0.2.3"
  }
}
EOF

# Create deployment instructions
cat > dist/DEPLOYMENT.md << EOF
# Equity Tax Production Deployment

## Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - At least 2GB RAM available
   - Ports 80, 3000, 3001, 27017, 6379 available

2. **Deploy with Docker Compose**
   \`\`\`bash
   chmod +x deploy.sh
   ./deploy.sh
   \`\`\`

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Admin Panel: http://localhost:3000/admin

## Manual Deployment

1. **Configure Environment**
   \`\`\`bash
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   \`\`\`

2. **Start Services**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Verify Deployment**
   \`\`\`bash
   curl http://localhost:3001/health
   curl http://localhost:3000
   \`\`\`

## Configuration

### Environment Variables

#### Backend (.env)
- \`MONGODB_URI\`: MongoDB connection string
- \`JWT_SECRET\`: JWT signing secret
- \`EMAIL_HOST\`: SMTP server for emails
- \`STRIPE_SECRET_KEY\`: Stripe payment integration

#### Frontend
- \`REACT_APP_API_URL\`: Backend API URL
- \`REACT_APP_ENVIRONMENT\`: Environment (production/development)

## Security

1. **Change Default Passwords**
   - Update JWT secrets
   - Change MongoDB passwords
   - Configure SSL certificates

2. **Firewall Configuration**
   - Only expose necessary ports
   - Use reverse proxy for SSL termination

3. **Database Security**
   - Enable MongoDB authentication
   - Use encrypted connections
   - Regular backups

## Monitoring

- Health checks: http://localhost:3001/health
- Logs: \`docker-compose logs -f [service]\`
- Metrics: Available via API endpoints

## Support

For support, contact: support@equitytax1.com
EOF

# Create a simple start script
cat > dist/start.sh << EOF
#!/bin/bash
echo "Starting Equity Tax..."
docker-compose up -d
echo "Application is starting up..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Use 'docker-compose logs -f' to view logs"
EOF

chmod +x dist/start.sh
chmod +x dist/deploy.sh

# Display build summary
print_success "Production build completed successfully!"
echo ""
echo "📦 Build Summary:"
echo "  Frontend: $(du -sh build | cut -f1)"
echo "  Backend: $(du -sh backend | cut -f1)"
echo "  Total Package: $(du -sh dist | cut -f1)"
echo ""
echo "🚀 Deployment Options:"
echo "  1. Docker Compose: cd dist && ./deploy.sh"
echo "  2. Manual: cd dist && docker-compose up -d"
echo "  3. Quick Start: cd dist && ./start.sh"
echo ""
echo "📋 Next Steps:"
echo "  1. Copy the 'dist' folder to your production server"
echo "  2. Configure environment variables"
echo "  3. Run the deployment script"
echo "  4. Access your application at http://localhost:3000"
echo ""

# Optional: Create a tarball for easy distribution
read -p "Would you like to create a distribution tarball? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Creating distribution tarball..."
    tar -czf equity-tax-production-$(date +%Y%m%d-%H%M%S).tar.gz dist/
    print_success "Distribution tarball created: equity-tax-production-$(date +%Y%m%d-%H%M%S).tar.gz"
fi

print_success "Build process completed! Your production-ready application is in the 'dist' folder."
