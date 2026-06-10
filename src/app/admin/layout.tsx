"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdminLoggedIn, setAdminLoggedIn } from "@/lib/cms-store";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/builder", label: "Builder V3" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/components", label: "Components" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const shouldRequireLogin = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isLogin && shouldRequireLogin && !isAdminLoggedIn()) {
      router.replace("/admin/login");
    }
  }, [isLogin, router, shouldRequireLogin]);

  if (isLogin) {
    return children;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell-sidebar">
        <Link className="admin-shell-logo" href="/admin/dashboard">Admin</Link>
        <nav>
          {adminLinks.map((item) => (
            <Link
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
              className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : ""}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-shell-main">
        <header className="admin-shell-topbar">
          <span>{pathname}</span>
          <div>
            <Link href="/">前台首页</Link>
            <button
              type="button"
              onClick={() => {
                setAdminLoggedIn(false);
                router.push("/admin/login");
              }}
            >
              退出
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
