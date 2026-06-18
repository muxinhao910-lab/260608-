"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthConfigured, setAdminLoggedIn, validateAdminCredentials } from "@/lib/cms-store";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isConfigured = isAdminAuthConfigured();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) {
      setError("后台登录未配置。请先设置 NEXT_PUBLIC_CHAIN_RADAR_ADMIN_USER 和 NEXT_PUBLIC_CHAIN_RADAR_ADMIN_PASSWORD。");
      return;
    }
    if (validateAdminCredentials(username, password)) {
      setAdminLoggedIn(true);
      router.push("/admin/dashboard");
      return;
    }
    setError("账号或密码不正确。");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#050505] p-6 text-white">
      <form className="w-full max-w-md border-2 border-white/20 bg-white/[.06] p-6 shadow-[0_0_80px_rgba(243,107,33,.18)]" onSubmit={submit}>
        <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">admin panel</p>
        <h1 className="mt-3 font-serif text-5xl font-black leading-none">登录后台</h1>
        {!isConfigured ? (
          <p className="mt-6 border border-[#f36b21] bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">
            后台访问边界：当前未配置管理员登录环境变量，因此后台登录被锁定。
          </p>
        ) : null}
        <label className="mt-8 block">
          <span className="font-mono text-xs text-white/55">账号</span>
          <input className="mt-2 w-full border border-white/20 bg-black/50 px-4 py-3 outline-none focus:border-[#f36b21]" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className="font-mono text-xs text-white/55">密码</span>
          <input className="mt-2 w-full border border-white/20 bg-black/50 px-4 py-3 outline-none focus:border-[#f36b21]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="mt-4 border border-[#f36b21] bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">{error}</p> : null}
        <button className="mt-6 w-full border border-[#f36b21] bg-[#f36b21] px-5 py-3 font-mono text-xs uppercase tracking-normal text-black hover:bg-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!isConfigured}>
          登录
        </button>
      </form>
    </main>
  );
}

