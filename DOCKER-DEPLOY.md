# ===========================================
# HƯỚNG DẪN DEPLOY BGK SYSTEM VỚI DOCKER
# ===========================================

## 🚀 Deploy trên VPS

### 1. Chuẩn bị VPS
```bash
# Cài đặt Docker và Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Clone dự án
```bash
git clone https://github.com/PhuccNguyen/bgk-system.git
cd bgk-system
```

### 3. Tạo file .env.local
```bash
nano .env.local
```

Dán nội dung:
```env
GOOGLE_PROJECT_ID=bgk-system
GOOGLE_PRIVATE_KEY_ID=240d1ec440aa52a1aae6b8ec4f51f4476d0468aa
GOOGLE_CLIENT_EMAIL=hhsv-checkin-writer@hhsv-2025-checkin.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=100487589069130409368
GOOGLE_SHEET_ID=1oC4bLGzdd5BHJsSiwTmvBOkqrBQzJHCYKinqnv8wkMs
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[Your Private Key Here]
-----END PRIVATE KEY-----"
NEXT_PUBLIC_TOKEN_SECRET=240d1sadsfds45j343c123sadaa
```

Lưu: Ctrl+X, Y, Enter

### 4. Build và chạy Docker
```bash
# Build image
docker-compose build

# Chạy container
docker-compose up -d

# Xem logs
docker-compose logs -f

# Kiểm tra status
docker-compose ps
```

### 5. Truy cập
Mở trình duyệt: `http://your-vps-ip:3000`

---

## 🔧 Các lệnh Docker hữu ích

### Quản lý container
```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose stop

# Khởi động lại
docker-compose restart

# Xóa container (giữ data)
docker-compose down

# Xóa container + images
docker-compose down --rmi all

# Xem logs realtime
docker-compose logs -f

# Vào shell của container
docker-compose exec bgk-system sh
```

### Update code mới
```bash
# Pull code mới
git pull origin main

# Rebuild và restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Debug
```bash
# Xem logs lỗi
docker-compose logs bgk-system | grep -i error

# Kiểm tra container đang chạy
docker ps

# Kiểm tra resource usage
docker stats bgk-system
```

---

## 🌐 Setup Nginx Reverse Proxy (Optional)

### 1. Cài đặt Nginx
```bash
sudo apt install nginx -y
```

### 2. Tạo config
```bash
sudo nano /etc/nginx/sites-available/bgk-system
```

Nội dung:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable site
```bash
sudo ln -s /etc/nginx/sites-available/bgk-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Setup SSL (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 📊 Monitoring

### Xem resource usage
```bash
docker stats bgk-system
```

### Xem logs theo thời gian
```bash
# Logs 5 phút gần nhất
docker-compose logs --since 5m

# Logs 100 dòng cuối
docker-compose logs --tail 100
```

---

## 🔐 Bảo mật

1. **Không commit file .env.local**
2. **Đổi NEXT_PUBLIC_TOKEN_SECRET** thành chuỗi ngẫu nhiên khác
3. **Giới hạn port 3000** chỉ cho localhost (nếu dùng Nginx)
4. **Enable firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🆘 Troubleshooting

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs bgk-system

# Check port đã bị chiếm chưa
sudo netstat -tulpn | grep 3000
```

### Build lỗi
```bash
# Xóa cache và rebuild
docker-compose build --no-cache
```

### Out of memory
```bash
# Tăng memory limit trong docker-compose.yml
services:
  bgk-system:
    mem_limit: 1g
    mem_reservation: 512m
```

---

## 📝 Backup

### Backup .env.local
```bash
cp .env.local .env.local.backup
```

### Export logs
```bash
docker-compose logs > logs_$(date +%Y%m%d).txt
```
