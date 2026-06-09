"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/cms-store";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAdminLoggedIn() ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return <main className="min-h-screen bg-[#050505]" />;
}

