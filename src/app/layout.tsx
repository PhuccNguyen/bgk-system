import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BGK System - Hệ thống chấm điểm Giám Khảo',
  description: 'Hệ thống chấm điểm chuyên nghiệp cho cuộc thi Hoa Hậu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
