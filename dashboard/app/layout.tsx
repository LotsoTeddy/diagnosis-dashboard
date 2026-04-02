import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ArkClaw EE Oncall 诊断系统" };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN">
            <body className="min-h-screen bg-background font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
