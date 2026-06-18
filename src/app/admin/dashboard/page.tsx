import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";
const ADMIN_SESSION_VALUE = "active";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdminSessionActive = cookieStore.get(ADMIN_SESSION_KEY)?.value === ADMIN_SESSION_VALUE;

  if (!isAdminSessionActive) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
