# 🚀 BGK System - VPS Deployment Guide

## ✅ Local Testing Complete!
Your application is running successfully on Docker locally. All tests passed:
- ✅ Container Health: Running
- ✅ API Endpoints: Working  
- ✅ Main Page: Loading
- ✅ Admin Panel: Accessible
- ✅ Authentication: Working

## 🌐 VPS Deployment Checklist

### 1. Prepare VPS Environment
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Upload Project to VPS
```bash
# Clone or upload your project
git clone https://github.com/PhuccNguyen/bgk-system.git
cd bgk-system
```

### 3. Create Production Environment File
Create `.env.production` on VPS:
```bash
# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://bgk.tingnect.com
NEXT_PUBLIC_DOMAIN=bgk.tingnect.com

# Same Google Sheets config as local
GOOGLE_PROJECT_ID=bgk-system
GOOGLE_PRIVATE_KEY_ID=240d1ec440aa52a1aae6b8ec4f51f4476d0468aa
GOOGLE_CLIENT_EMAIL=hhsv-checkin-writer@hhsv-2025-checkin.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=100487589069130409368
GOOGLE_SHEET_ID=1oC4bLGzdd5BHJsSiwTmvBOkqrBQzJHCYKinqnv8wkMs
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXDqkh4luAS+ik\n4T4x+kf5R1VGip1p/6UdgJdt2N4HoAWzDTjK735CIQc2qB/tddRkE2/b3LCXhyUQ\nM2dFvnfmqnj6rwWu42ocH8dwkSf9fwCqbKZ6vtZ9ftoaxkMZTP+ojQ/7eLMXmtkj\nKp/5lLagb7WcnHrDKC2kqtFRIVr0rNL5SEoaVV9gzrvMRnGHp3+Wp7xEATQTKrtt\n3dMVCbylG1AwIgCtNXYHyy9Cg0Sj5cmj5yKmrhhT9B06If9N5pwtl8Dj4qp3sKhb\nGBMsFzfr7UNGd2a40BF69/RzBL5YyS2nIPzX0WcmoVFac35QFBMp0fJF04n94nc3\n9Fn9qs4HAgMBAAECggEAAvW6sjKxW7SvwQUwm/N75hxrOgtSW1EfbqaEbwibFbPI\nIEzASVq+fB6EQOZTeisy/yWdVoNVEuDTS8PJWhZjBBO4koqyI1QR880kK5Jz4HNN\nCQtxxyK1RQjn65Jq/gAnTKSUYbupi1ugPXGqvf6j/NVMxJkKv4DgD/Ih62HwJInt\n7fr8rrzoCbb9Tj20acJfDvU/KEL1iF0wSOMaKztrmcEEaqQ0AqrQckrO8Uz94QnN\nFiTzGIqzo71LfNGyCUYTm9dPSmWgwjL5TQ9JPw2fuUYJBFOImVSvt5MHiYSv1Ukw\nssg39BIXt1zwKu8JwzBECS8LskuvT+1s907Yu/rZMQKBgQD2aiXZbtqOAzpOql0l\nn/Itl2MTv9lHjTRJGbZzt4Pu3OySu8pYX99knxqULMIOZK9x8RTNLhgUIhJA1zMy\noEpErbQUlxkS7Mb6aZQqldT5vz5pTG+JKiSFKPImN8TY3IAg+3Xh/PeshWDjnASu\n4ncWUCmY/+lWq+BJWijObzMJiwKBgQDfbD/Ewbvf8pMAXcsGzoKRwwNZMB0yiJia\nm9lOzyot8gL7/YhJ1DKPG7Q6jq2T5Z4u2EZYdBo42+fBrPTM+IFpr+CDg5YtcgNd\nVK72HRtsdxxSNgsCNTATV3yxIIHs31RoEQNyL/tHjlWQZ8+tTmK9//MGliA8gy7E\npac0eZWE9QKBgQCr7EF+I+7O2Ies7QZSQvc4QgB5fgg9+NH7ErqOoAKn/HH+qpEx\n+aomTS/BJD08x5j1OYwW38si+OadYMgy0U0f/8W9+/Idlx/5BQLAd4uBuKH128OS\nAto6IehZK93mpGmtGWUVCGdRcjm4dFl8HzuRUNrFCgAmXYL+Cq6f4UvNowKBgDvW\nMf3wJPEFdnlSpV1dUXrYT71DNY6jJrvBoaGJujIz7riuXiHnwuKw+MP2EmbZyFOj\neLOX5K31t0wXljiPFZnIkMioJUBmmKAWXgVsJjwWam9aKfidZhLIC40kt6dI6MI2\nTEX4s8OmSyQxqV0w8SERu3S4IEoUmCHye6WCKplBAoGAehqGCh8w6CcCdPwERvV5\ni22EEmvXvDwcDJu9KI3GQ2MC7GaFmxrSjtQUJsmDJfuUPec4IhQYoYkt9n7nELCI\n9PuVkqISUnGZ43/YBbXyb+8U53/Ayh6z0EJsENCWKO8g8l4Cr36VOr+Sl/6q+VAE\nSMM7B/ugdPPYMVGGiKnD90g=\n-----END PRIVATE KEY-----\n"

# Security
NEXTAUTH_SECRET=change-this-to-a-strong-secret-for-production
NEXTAUTH_URL=https://bgk.tingnect.com
```

### 4. Update Docker Compose for Production
```bash
# Copy .env.production to .env
cp .env.production .env

# Modify docker-compose.yml for production
# Update ports to use reverse proxy (nginx) if needed
```

### 5. Deploy Commands on VPS
```bash
# Build and start
sudo docker-compose down --remove-orphans
sudo docker-compose up --build -d

# Check status
sudo docker-compose ps
sudo docker-compose logs -f

# Test endpoints
curl http://localhost:3000/api/config
curl http://localhost:3000/api/contestants
```

### 6. Setup SSL with Nginx (Optional)
```nginx
server {
    listen 80;
    server_name bgk.tingnect.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name bgk.tingnect.com;
    
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. Final VPS Testing
```bash
# Health check
curl https://bgk.tingnect.com/api/config
curl https://bgk.tingnect.com/api/contestants

# Load test
curl https://bgk.tingnect.com
curl https://bgk.tingnect.com/test
```

## 🎯 Key Success Factors

1. **Same Docker Setup**: Use exact same Docker configuration
2. **Environment Variables**: Update URLs to production domain
3. **SSL Configuration**: Ensure HTTPS is properly configured
4. **Google Sheets**: Keep same credentials (already working)
5. **Port Configuration**: Map correctly with reverse proxy
6. **Health Checks**: Use same health check endpoints

## 🔧 Troubleshooting on VPS

### If API fails:
```bash
# Check logs
sudo docker-compose logs -f bgk-system

# Check container health
sudo docker-compose ps

# Restart if needed
sudo docker-compose restart
```

### If Google Sheets fails:
- Verify credentials in .env file
- Check network connectivity from VPS
- Test with: `curl -X POST https://bgk.tingnect.com/api/contestants`

## ✨ Production Features
Your app includes:
- ✅ SEO optimized for bgk.tingnect.com
- ✅ Social media previews
- ✅ Progressive Web App features
- ✅ Health monitoring
- ✅ Proper error handling
- ✅ Google Sheets integration

**Ready for production deployment! 🚀**