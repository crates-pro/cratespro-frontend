import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import React from 'react';
import { message } from 'antd';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html >
  );
}
