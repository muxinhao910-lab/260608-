import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const cmsStore = readFileSync("src/lib/cms-store.ts", "utf8");
const loginPage = readFileSync("src/app/admin/login/page.tsx", "utf8");
const adminIndexPage = readFileSync("src/app/admin/page.tsx", "utf8");
const adminDashboardPage = readFileSync("src/app/admin/dashboard/page.tsx", "utf8");
const adminDashboardClient = readFileSync("src/app/admin/dashboard/AdminDashboardClient.tsx", "utf8");
const adminLogoutRoute = readFileSync("src/app/admin/logout/route.ts", "utf8");

test("admin auth baseline does not keep hardcoded default credentials", () => {
  assert.equal(cmsStore.includes("adminCredential"), false);
  assert.equal(loginPage.includes("adminCredential"), false);
  assert.equal(cmsStore.includes("radar123"), false);
  assert.equal(loginPage.includes("radar123"), false);
});

test("admin auth baseline keeps credentials out of the client bundle", () => {
  assert.equal(cmsStore.includes("NEXT_PUBLIC_CHAIN_RADAR_ADMIN_USER"), false);
  assert.equal(cmsStore.includes("NEXT_PUBLIC_CHAIN_RADAR_ADMIN_PASSWORD"), false);
  assert.equal(loginPage.includes("NEXT_PUBLIC_CHAIN_RADAR_ADMIN_USER"), false);
  assert.equal(loginPage.includes("NEXT_PUBLIC_CHAIN_RADAR_ADMIN_PASSWORD"), false);
  assert.match(loginPage, /CHAIN_RADAR_ADMIN_USER/);
  assert.match(loginPage, /CHAIN_RADAR_ADMIN_PASSWORD/);
  assert.match(loginPage, /"use server"/);
});

test("admin auth baseline does not allow client-side forged login", () => {
  assert.equal(/function\s+isAdminLoggedIn\s*\([^)]*\)\s*{[^}]*return\s+true\s*;/s.test(cmsStore), false);
  assert.equal(/function\s+isAdminLoggedIn\s*\([^)]*\)\s*{[^}]*return\s+false\s*;/s.test(cmsStore), false);
  assert.equal(/function\s+isAdminLoggedIn\s*\([^)]*\)\s*{[^}]*localStorage/s.test(cmsStore), false);
  assert.equal(/function\s+setAdminLoggedIn\s*\([^)]*\)\s*{[^}]*localStorage/s.test(cmsStore), false);
  assert.equal(loginPage.includes("setAdminLoggedIn"), false);
  assert.equal(loginPage.includes("useState"), false);
  assert.equal(loginPage.includes("useRouter"), false);
  assert.match(loginPage, /httpOnly:\s*true/);
});

test("admin session cookie does not trust a public fixed value", () => {
  assert.equal(loginPage.includes('ADMIN_SESSION_VALUE = "active"'), false);
  assert.equal(adminIndexPage.includes('ADMIN_SESSION_VALUE = "active"'), false);
  assert.equal(adminDashboardPage.includes('ADMIN_SESSION_VALUE = "active"'), false);
  assert.equal(loginPage.includes("randomBytes"), true);
  assert.equal(loginPage.includes("createHmac"), true);
  assert.equal(adminIndexPage.includes("timingSafeEqual"), true);
  assert.equal(adminDashboardPage.includes("timingSafeEqual"), true);
});

test("admin entry uses server cookie routing", () => {
  assert.equal(adminIndexPage.includes('"use client"'), false);
  assert.match(adminIndexPage, /cookies/);
  assert.match(adminIndexPage, /chain-radar-admin-session/);
  assert.match(adminIndexPage, /isValidAdminSession/);
  assert.match(adminIndexPage, /redirect\(isAdminSessionActive \? "\/admin\/dashboard" : "\/admin\/login"\)/);
});

test("admin dashboard no longer kicks out authenticated users with client storage checks", () => {
  assert.equal(adminDashboardPage.includes('"use client"'), false);
  assert.match(adminDashboardPage, /cookies/);
  assert.match(adminDashboardPage, /chain-radar-admin-session/);
  assert.match(adminDashboardPage, /isAdminSessionActive/);
  assert.match(adminDashboardPage, /isValidAdminSession/);
  assert.match(adminDashboardPage, /redirect\("\/admin\/login"\)/);
  assert.match(adminDashboardPage, /AdminDashboardClient/);
  assert.equal(adminDashboardPage.includes("logoutAction"), false);
  assert.equal(adminDashboardPage.includes("cookieStore.delete"), false);
  assert.equal(adminDashboardPage.includes("isAdminLoggedIn"), false);
  assert.equal(adminDashboardPage.includes("setAdminLoggedIn"), false);
  assert.equal(adminDashboardClient.includes("isAdminLoggedIn"), false);
  assert.equal(adminDashboardClient.includes("setAdminLoggedIn"), false);
  assert.equal(adminDashboardClient.includes('router.replace("/admin/login")'), false);
  assert.match(adminDashboardClient, /href="\/admin\/logout"/);
});

test("admin logout route clears the httpOnly session cookie", () => {
  assert.match(adminLogoutRoute, /NextResponse\.redirect/);
  assert.match(adminLogoutRoute, /new URL\("\/admin\/login", request\.url\)/);
  assert.match(adminLogoutRoute, /response\.cookies\.set\(ADMIN_SESSION_KEY,\s*""/);
  assert.match(adminLogoutRoute, /chain-radar-admin-session/);
  assert.match(adminLogoutRoute, /httpOnly:\s*true/);
  assert.match(adminLogoutRoute, /path:\s*"\/admin"/);
  assert.match(adminLogoutRoute, /maxAge:\s*0/);
  assert.equal(adminLogoutRoute.includes('"use client"'), false);
  assert.equal(adminLogoutRoute.includes("localStorage"), false);
});
