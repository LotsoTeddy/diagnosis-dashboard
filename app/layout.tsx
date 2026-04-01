import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArkClaw 诊断仪表板",
  description: "浏览和分析 ArkClaw 诊断报告",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">ArkClaw 诊断数据浏览器</h1>
                  <p className="text-sm text-muted-foreground">
                    查看和分析来自 OpenClaw 实例的诊断报告
                  </p>
                </div>
                {session?.user && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{session.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.user.email}
                      </div>
                    </div>
                    <LogoutButton />
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
