import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "产业链投资研究雷达",
  description: "机器人产业链公司长期跟踪指标雷达。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
