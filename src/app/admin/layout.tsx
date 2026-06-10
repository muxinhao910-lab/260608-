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

  useEffect(() => {
    if (!isLogin && !isAdminLoggedIn()) {
      router.replace("/admin/login");
    }
  }, [isLogin, router]);

  if (isLogin) {
    return children;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell-sidebar">
        <Link className="admin-shell-logo" href="/admin/dashboard">Admin</Link>
        <nav>
          {adminLinks.map((item) => (
            <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href}>
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
