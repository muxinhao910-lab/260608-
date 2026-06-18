import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./DashboardClient";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";
const ADMIN_SESSION_VALUE = "active";

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_KEY);
  redirect("/admin/login");
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdminSessionActive = cookieStore.get(ADMIN_SESSION_KEY)?.value === ADMIN_SESSION_VALUE;

  if (!isAdminSessionActive) {
    redirect("/admin/login");
  }

  return <AdminDashboard logoutAction={logoutAction} />;
}
