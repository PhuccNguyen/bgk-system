# HƯỚNG DẪN TẠO SOCIAL PREVIEW IMAGES

## Kích thước cần thiết:

### Facebook & OpenGraph (1200x630px)
- File: `social-preview-1200x630.png`
- Tỉ lệ: 1.91:1
- Dung lượng: < 300KB
- Format: PNG hoặc JPG

### Twitter Cards (1200x600px)  
- File: `social-preview-1200x600.png`
- Tỉ lệ: 2:1
- Dung lượng: < 5MB
- Format: PNG hoặc JPG

### Nội dung nên có:
1. **Logo TingNect** ở góc trái hoặc center
2. **Text**: "HỆ THỐNG GIÁM KHẢO"
3. **Subtitle**: "Chấm Điểm Điện Tử"
4. **Brand**: "TingNect x TrustLabs"
5. **Background**: Gradient với màu brand (#00d4ff, #0099ff, #f093fb)

## Design Guidelines:

### Màu sắc:
- Primary: #00d4ff (TingNect Blue)
- Secondary: #0099ff, #f093fb, #f5576c
- Background: Gradient hoặc dark theme
- Text: White với shadow để dễ đọc

### Typography:
- Font: Inter, Arial, sans-serif
- Title: Bold, 48-64px
- Subtitle: Medium, 24-32px
- Brand: Regular, 18-24px

### Layout:
```
┌─────────────────────────────────┐
│ [LOGO]     HỆ THỐNG GIÁM KHẢO   │
│           Chấm Điểm Điện Tử     │
│                                 │
│         [Gradient Background]   │
│                                 │
│   TingNect x TrustLabs          │
└─────────────────────────────────┘
```

## Tools để tạo:
- **Figma** (recommended)
- **Canva Pro**
- **Adobe Photoshop**
- **GIMP** (free)

## Sau khi tạo xong:
1. Đặt files vào `/public/PreviewSeo/`
2. Test preview trên:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - WhatsApp/Zalo: Share link trực tiếp để test