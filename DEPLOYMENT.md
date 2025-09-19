# 🚀 Equity Tax Application - Oracle Cloud Deployment Guide

## 📋 Prerequisites

1. **Oracle Cloud Account** with free tier access
2. **Domain DNS Access** for equitytax1.com
3. **MongoDB Atlas Account** (free tier)
4. **Git Repository** with your code

## 🏗️ Step-by-Step Deployment Process

### Step 1: Set Up Oracle Cloud Infrastructure

#### 1.1 Create a Compute Instance
1. **Login to Oracle Cloud Console**: https://cloud.oracle.com
2. **Navigate to**: Compute → Instances
3. **Click**: "Create Instance"
4. **Configure**:
   - **Name**: `equity-tax-server`
   - **Image**: Oracle Linux 8 or Ubuntu 20.04 LTS
   - **Shape**: VM.Standard.E2.1.Micro (Always Free)
   - **SSH Keys**: Upload your public SSH key
   - **Networking**: Use default VCN
   - **Subnet**: Public subnet
   - **Assign Public IP**: Yes

#### 1.2 Configure Security Lists
1. **Navigate to**: Networking → Virtual Cloud Networks
2. **Click on your VCN** → Security Lists
3. **Edit Ingress Rules**:
   ```
   Source: 0.0.0.0/0, Protocol: TCP, Port: 22 (SSH)
   Source: 0.0.0.0/0, Protocol: TCP, Port: 80 (HTTP)
   Source: 0.0.0.0/0, Protocol: TCP, Port: 443 (HTTPS)
   ```

### Step 2: Set Up MongoDB Atlas (Production Database)

#### 2.1 Create MongoDB Atlas Account
1. **Go to**: https://www.mongodb.com/atlas
2. **Sign up** for free account
3. **Create new project**: "Equity Tax"

#### 2.2 Create Cluster
1. **Click**: "Build a Database"
2. **Choose**: M0 Sandbox (Free)
3. **Provider**: AWS
4. **Region**: Choose closest to your Oracle Cloud region
5. **Cluster Name**: `equity-tax-cluster`

#### 2.3 Configure Database Access
1. **Go to**: Database Access
2. **Add New Database User**:
   - **Username**: `equity-tax-user`
   - **Password**: Generate strong password
   - **Database User Privileges**: Read and write to any database

#### 2.4 Configure Network Access
1. **Go to**: Network Access
2. **Add IP Address**: `0.0.0.0/0` (Allow from anywhere)
   - **Note**: For production, use your Oracle Cloud server IP

#### 2.5 Get Connection String
1. **Go to**: Database → Connect
2. **Choose**: "Connect your application"
3. **Copy connection string**: 
   ```
   mongodb+srv://equity-tax-user:<password>@equity-tax-cluster.xxxxx.mongodb.net/equity-tax?retryWrites=true&w=majority
   ```

### Step 3: Configure DNS

#### 3.1 Add DNS Records
Add these records to your domain DNS (equitytax1.com):

```
Type: A
Name: accounts
Value: [Your Oracle Cloud Server IP]
TTL: 300

Type: A
Name: dashboard
Value: [Your Oracle Cloud Server IP]
TTL: 300
```

### Step 4: Deploy Application to Oracle Cloud

#### 4.1 Connect to Your Server
```bash
ssh opc@[YOUR_SERVER_IP]
```

#### 4.2 Update System
```bash
sudo yum update -y  # For Oracle Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu
```

#### 4.3 Install Docker
```bash
# For Oracle Linux
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker opc

# For Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 4.4 Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 4.5 Clone Your Application
```bash
# Create application directory
sudo mkdir -p /opt/equity-tax
sudo chown opc:opc /opt/equity-tax
cd /opt/equity-tax

# Clone your repository (replace with your actual repo)
git clone https://github.com/yourusername/equity-tax.git .
```

#### 4.6 Configure Environment Variables
```bash
# Create production environment file
cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://dashboard.equitytax1.com

# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://equity-tax-user:YOUR_PASSWORD@equity-tax-cluster.xxxxx.mongodb.net/equity-tax?retryWrites=true&w=majority

# JWT Configuration - Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_EXPIRE=30d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
```

#### 4.7 Build and Deploy Application
```bash
# Create logs directory
mkdir -p logs

# Build and start the application
docker-compose -f docker-compose.prod.yml up -d --build

# Check if application is running
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

### Step 5: Set Up Nginx Reverse Proxy

#### 5.1 Install Nginx
```bash
# For Oracle Linux
sudo yum install -y nginx

# For Ubuntu
sudo apt install nginx -y
```

#### 5.2 Configure Nginx
```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/equity-tax
sudo ln -sf /etc/nginx/sites-available/equity-tax /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### Step 6: Set Up SSL Certificates

#### 6.1 Install Certbot
```bash
# For Oracle Linux
sudo yum install -y certbot python3-certbot-nginx

# For Ubuntu
sudo apt install certbot python3-certbot-nginx -y
```

#### 6.2 Obtain SSL Certificates
```bash
# Make sure DNS is pointing to your server first
sudo certbot --nginx -d accounts.equitytax1.com -d dashboard.equitytax1.com
```

### Step 7: Configure Firewall

```bash
# For Oracle Linux (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# For Ubuntu (ufw)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### Step 8: Set Up Monitoring and Logs

#### 8.1 Set Up Log Rotation
```bash
sudo tee /etc/logrotate.d/equity-tax > /dev/null << EOF
/opt/equity-tax/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 opc opc
    postrotate
        docker-compose -f /opt/equity-tax/docker-compose.prod.yml restart equity-tax-app
    endscript
}
EOF
```

#### 8.2 Set Up Systemd Service
```bash
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
```

## 🔧 Production Configuration

### Environment Variables
Make sure to set these in your `.env` file:

```bash
# Required for production
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/equity-tax
JWT_SECRET=your-secure-jwt-secret-32-chars-minimum
JWT_REFRESH_SECRET=your-secure-refresh-secret-32-chars-minimum

# Optional but recommended
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Security Checklist
- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB Atlas with IP whitelist
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Log rotation set up
- [ ] Regular backups scheduled

## 🚀 Deployment Commands

### Quick Deploy
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Manual Commands
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart application
docker-compose -f docker-compose.prod.yml restart

# Stop application
docker-compose -f docker-compose.prod.yml down
```

## 🔍 Troubleshooting

### Check Application Status
```bash
# Check if containers are running
docker ps

# Check application logs
docker-compose -f docker-compose.prod.yml logs

# Check Nginx status
sudo systemctl status nginx

# Test application health
curl http://localhost:3001/health
```

### Common Issues
1. **Port 3001 not accessible**: Check firewall and security groups
2. **SSL certificate issues**: Verify DNS is pointing to server
3. **Database connection errors**: Check MongoDB Atlas connection string
4. **Application not starting**: Check logs for missing environment variables

## 📊 Monitoring

### Health Checks
- Application: `https://dashboard.equitytax1.com/health`
- Nginx: `sudo systemctl status nginx`
- Docker: `docker ps`

### Log Locations
- Application logs: `/opt/equity-tax/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u equity-tax.service`

## 🎉 Success!

Your Equity Tax application should now be live at:
- **Accounts**: https://accounts.equitytax1.com
- **Dashboard**: https://dashboard.equitytax1.com

## 📞 Support

If you encounter any issues:
1. Check the logs first
2. Verify all environment variables
3. Ensure DNS is properly configured
4. Check Oracle Cloud security groups
