# 🚀 Quick Start - BGK System Docker

## ✅ Test thành công trên Local Windows

Docker đã được test và chạy thành công! App khởi động bình thường và có thể login.

## 📋 Deploy lên VPS

### Bước 1: Clone dự án
```bash
git clone https://github.com/PhuccNguyen/bgk-system.git
cd bgk-system
```

### Bước 2: Tạo file .env.local
```bash
nano .env.local
```

Paste nội dung (thay YOUR_VALUES):
```env
GOOGLE_PROJECT_ID=bgk-system
GOOGLE_PRIVATE_KEY_ID=your_key_id
GOOGLE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_SHEET_ID=your_sheet_id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...your private key...
-----END PRIVATE KEY-----"
NEXT_PUBLIC_TOKEN_SECRET=your_random_secret
```

Save: `Ctrl+X` → `Y` → `Enter`

### Bước 3: Chạy Docker
```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Xem logs
docker-compose logs -f
```

### Bước 4: Truy cập
```
http://your-server-ip:3000
```

## 🔧 Các lệnh hữu ích

```bash
# Xem status
docker-compose ps

# Xem logs realtime
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update code mới
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

## ⚠️ Lưu ý

- Container sẽ có warning về TypeScript nhưng **app vẫn chạy bình thường**
- Port 3000 sẽ được expose ra ngoài
- Nếu cần SSL, xem file `DOCKER-DEPLOY.md` để setup Nginx

## ✅ Đã test thành công

- ✅ Build image thành công (1.11GB)
- ✅ Container start và running
- ✅ Next.js server khởi động (Ready in 300ms)
- ✅ API endpoints hoạt động
- ✅ Login thành công (có log xác nhận)
- ✅ Kết nối Google Sheets hoạt động

## 🆘 Troubleshooting

### Container không start
```bash
docker-compose logs bgk-system
```

### Rebuild từ đầu
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Kiểm tra port
```bash
docker-compose ps
# Xem cột PORTS, phải có: 0.0.0.0:3000->3000/tcp
```
