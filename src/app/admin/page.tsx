import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";
const ADMIN_SESSION_VALUE = "active";

export default async function AdminIndex() {
  const cookieStore = await cookies();
  const isAdminSessionActive = cookieStore.get(ADMIN_SESSION_KEY)?.value === ADMIN_SESSION_VALUE;
  redirect(isAdminSessionActive ? "/admin/dashboard" : "/admin/login");
}
