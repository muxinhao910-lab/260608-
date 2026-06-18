import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

const ADMIN_SESSION_KEY = "chain-radar-admin-session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getAdminSessionSecret() {
  return process.env.CHAIN_RADAR_ADMIN_SESSION_SECRET ?? process.env.CHAIN_RADAR_ADMIN_PASSWORD ?? "";
}

function signAdminSession(payload: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(payload).digest("base64url");
}

function isValidAdminSession(value?: string) {
  const secret = getAdminSessionSecret();
  if (!secret || !value) {
    return false;
  }

  const [issuedAtRaw, nonce, signature, ...extraParts] = value.split(".");
  if (extraParts.length || !issuedAtRaw || !nonce || !signature) {
    return false;
  }

  const issuedAt = Number(issuedAtRaw);
  const now = Date.now();
  if (!Number.isSafeInteger(issuedAt) || issuedAt > now + 60_000 || now - issuedAt > ADMIN_SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const expectedSignature = signAdminSession(`${issuedAtRaw}.${nonce}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  return signatureBuffer.length === expectedSignatureBuffer.length && timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdminSessionActive = isValidAdminSession(cookieStore.get(ADMIN_SESSION_KEY)?.value);

  if (!isAdminSessionActive) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
