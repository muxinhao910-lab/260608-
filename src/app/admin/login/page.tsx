import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";
const ADMIN_SESSION_VALUE = "active";

function isAdminAuthConfigured() {
  return Boolean(process.env.CHAIN_RADAR_ADMIN_USER && process.env.CHAIN_RADAR_ADMIN_PASSWORD);
}

function validateAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.CHAIN_RADAR_ADMIN_USER;
  const expectedPassword = process.env.CHAIN_RADAR_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return false;
  }
  return username.trim() === expectedUser && password === expectedPassword;
}

async function loginAction(formData: FormData) {
  "use server";

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_KEY, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8
  });
  redirect("/admin/dashboard");
}

export default async function AdminLogin({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const isConfigured = isAdminAuthConfigured();
  const hasInvalidLogin = params?.error === "invalid";

  return (
    <main className="grid min-h-screen place-items-center bg-[#050505] p-6 text-white">
      <form className="w-full max-w-md border-2 border-white/20 bg-white/[.06] p-6 shadow-[0_0_80px_rgba(243,107,33,.18)]" action={loginAction}>
        <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">admin panel</p>
        <h1 className="mt-3 font-serif text-5xl font-black leading-none">登录后台</h1>
        {!isConfigured ? (
          <p className="mt-6 border border-[#f36b21] bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">
            后台访问边界：当前未配置管理员登录环境变量，因此后台登录被锁定。
          </p>
        ) : null}
        <label className="mt-8 block">
          <span className="font-mono text-xs text-white/55">账号</span>
          <input className="mt-2 w-full border border-white/20 bg-black/50 px-4 py-3 outline-none focus:border-[#f36b21]" name="username" />
        </label>
        <label className="mt-4 block">
          <span className="font-mono text-xs text-white/55">密码</span>
          <input className="mt-2 w-full border border-white/20 bg-black/50 px-4 py-3 outline-none focus:border-[#f36b21]" name="password" type="password" />
        </label>
        {hasInvalidLogin ? <p className="mt-4 border border-[#f36b21] bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">账号或密码不正确。</p> : null}
        <button className="mt-6 w-full border border-[#f36b21] bg-[#f36b21] px-5 py-3 font-mono text-xs uppercase tracking-normal text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!isConfigured}>
          登录
        </button>
      </form>
    </main>
  );
}
