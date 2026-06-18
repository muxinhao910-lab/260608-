import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const cmsStore = readFileSync("src/lib/cms-store.ts", "utf8");
const loginPage = readFileSync("src/app/admin/login/page.tsx", "utf8");

test("admin auth baseline does not keep hardcoded default credentials", () => {
  assert.equal(cmsStore.includes("adminCredential"), false);
  assert.equal(loginPage.includes("adminCredential"), false);
  assert.equal(cmsStore.includes("radar123"), false);
  assert.equal(loginPage.includes("radar123"), false);
});

test("admin auth baseline does not allow unconditional login", () => {
  assert.equal(/function\s+isAdminLoggedIn\s*\([^)]*\)\s*{[^}]*return\s+true\s*;/s.test(cmsStore), false);
  assert.match(cmsStore, /NEXT_PUBLIC_CHAIN_RADAR_ADMIN_USER/);
  assert.match(cmsStore, /NEXT_PUBLIC_CHAIN_RADAR_ADMIN_PASSWORD/);
  assert.match(cmsStore, /validateAdminCredentials/);
});
