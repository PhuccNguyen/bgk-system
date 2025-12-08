# Hướng dẫn Fix Lỗi Đăng Nhập - BGK System

## ✅ ĐÃ FIX

### 1. Lỗi localStorage (Runtime Error)
**Vấn đề:** `localStorage.removeItem is not a function`
**Nguyên nhân:** Code gọi localStorage trong Server Component (Next.js)
**Giải pháp:** Đã thêm check `typeof window !== 'undefined'` trước khi dùng localStorage

**Files đã sửa:**
- `src/lib/auth.ts`: Thêm browser check cho `getSession()`, `createSession()`, `clearSession()`

### 2. Lỗi Hash Password
**Vấn đề:** Password hash không khớp
**Kiểm tra:** Hash đã đúng! ✅
```
Password: ngannguyen@2025
Hash: df141b87d364e498dd0956c2877dba79fa9ba050775bbadd3f5827703caa8d21
```

## ❌ CẦN FIX

### 3. Lỗi Permission Google Sheets
**Vấn đề:** Service Account không có quyền truy cập Sheet
```
Error: 403 - The caller does not have permission
```

**CÁCH FIX:**

#### Bước 1: Mở Google Sheet
Truy cập: https://docs.google.com/spreadsheets/d/1oC4bLGzdd5BHJsSiwTmvBOkqrBQzJHCYKinqnv8wkMs

#### Bước 2: Share với Service Account
1. Click nút **"Chia sẻ"** (Share) ở góc trên bên phải
2. Trong ô "Add people and groups", paste email:
   ```
   hhsv-checkin-writer@hhsv-2025-checkin.iam.gserviceaccount.com
   ```
3. Chọn quyền: **Editor** (hoặc Viewer nếu chỉ đọc)
4. **BỎ TICK** ô "Notify people" (không cần gửi email)
5. Click **"Share"** hoặc **"Done"**

#### Bước 3: Kiểm tra cấu trúc Sheet
Đảm bảo Sheet có tab tên **"JUDGES"** với cấu trúc:

| A (USERNAME) | B (PASSWORD_HASH) | C (FULL_NAME) | D (STATUS) |
|--------------|-------------------|---------------|------------|
| ngannguyen   | df141b87d364e498dd0956c2877dba79fa9ba050775bbadd3f5827703caa8d21 | Ngân Nguyễn | ACTIVE |

**Lưu ý quan trọng:**
- Cột A (USERNAME): Viết thường, không dấu cách
- Cột B (PASSWORD_HASH): SHA-256 hash của password
- Cột D (STATUS): Phải là "ACTIVE" hoặc "INACTIVE"

#### Bước 4: Test lại
Sau khi cấp quyền, chạy:
```powershell
node test-google-sheets.js
```

Nếu thấy kết quả như này là OK:
```
✅ Access token obtained: ya29.c...
📡 Response status: 200
✅ Data received: {...}
👥 Judges found:
  1. USERNAME: "ngannguyen" | HASH: df141b87d364e498dd09... | NAME: Ngân Nguyễn | STATUS: ACTIVE
```

#### Bước 5: Test đăng nhập trên web
1. Mở http://localhost:3000
2. Nhập:
   - Username: `ngannguyen`
   - Password: `ngannguyen@2025`
3. Click "Đăng nhập"

## 🔧 Script Hỗ Trợ

### Tạo hash cho password mới
```powershell
node test-hash.js
```

### Test kết nối Google Sheets
```powershell
node test-google-sheets.js
```

### Khởi động dev server
```powershell
npm run dev
```

## 📝 Checklist

- [x] Fix lỗi localStorage
- [x] Verify password hash
- [ ] Cấp quyền cho Service Account trên Google Sheet
- [ ] Kiểm tra cấu trúc Sheet JUDGES
- [ ] Test đăng nhập thành công

## 💡 Tips

1. **Username luôn lowercase:** Hệ thống tự động convert về lowercase khi so sánh
2. **Cache token:** Access token được cache 1 giờ để tăng tốc độ
3. **Session timeout:** 8 giờ - sau đó cần đăng nhập lại
4. **Debug logs:** Mở Console (F12) để xem chi tiết lỗi

## 🆘 Nếu vẫn lỗi

1. Kiểm tra Console logs (F12 > Console)
2. Chạy `node test-google-sheets.js` để xem lỗi cụ thể
3. Đảm bảo tất cả biến trong `.env.local` đều đúng
4. Restart dev server: Ctrl+C rồi `npm run dev`
