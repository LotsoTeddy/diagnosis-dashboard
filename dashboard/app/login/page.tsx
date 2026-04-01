import { signIn } from "@/lib/auth";
import { FileText, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">ArkClaw 诊断系统</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            请登录以访问诊断报告
          </p>
        </div>

        <div className="mt-8">
          <form
            action={async (formData: FormData) => {
              "use server";
              const username = formData.get("username") as string;
              const password = formData.get("password") as string;

              try {
                const result = await signIn("credentials", {
                  username,
                  password,
                  redirectTo: "/",
                });
              } catch (error: any) {
                if (error.type === "CredentialsSignin") {
                  redirect("/login?error=invalid");
                }
                throw error;
              }
            }}
            className="space-y-4"
          >
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>用户名或密码错误，请重试</span>
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="请输入密码"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              登录
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            登录即表示您同意使用本诊断系统
          </p>
        </div>
      </div>
    </div>
  );
}
