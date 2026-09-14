import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { POST as googleHandler } from "@/app/api/auth/google/route";
import { POST as demoLoginHandler } from "@/app/api/auth/demo-login/route";
import { GET as petsHandler, POST as createPetHandler } from "@/app/api/pets/route";
import { GET as petByIdHandler } from "@/app/api/pets/[id]/route";
import { GET as usersHandler } from "@/app/api/users/route";
import { PUT as userRoleHandler } from "@/app/api/users/[id]/role/route";
import { GET as backupExportHandler } from "@/app/api/admin/backup/export/route";
import { PUT as settingsPutHandler } from "@/app/api/admin/settings/route";
import { POST as themesPostHandler } from "@/app/api/admin/themes/route";
import { GET as inventoryHandler } from "@/app/api/inventory/route";
import { GET as equipmentHandler } from "@/app/api/equipment/route";
import { GET as immunizationsHandler } from "@/app/api/immunizations/route";
import { GET as proceduresHandler } from "@/app/api/procedures/route";
import { GET as servicesHandler } from "@/app/api/services/route";
import { GET as vouchersGetHandler, POST as vouchersPostHandler } from "@/app/api/vouchers/route";
import { store, exportFullBackup } from "@/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

let mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn(),
    set: (...args: any[]) => mockCookieSet(...args),
    delete: vi.fn(),
  }),
}));

const TEST_SECRET = "test-jwt-secret-key-with-minimum-32-characters-length-2026";

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

describe("NoviVet Security & Authorization Suite", () => {
  it("Wrong password returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@novivet.local",
        password: "WrongPassword123!",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await loginHandler(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Invalid email or password.");
  });

  it("Google email-only body returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        email: "hacker@example.com",
        fullName: "Fake Google User",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await googleHandler(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("idToken is required");
  });

  it("demo-login returns 404 when ALLOW_DEMO_LOGIN is false or in production", async () => {
    delete process.env.ALLOW_DEMO_LOGIN;
    const req = new NextRequest("http://localhost:3000/api/auth/demo-login", {
      method: "POST",
      body: JSON.stringify({ role: "DOCTOR" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await demoLoginHandler(req);
    expect(res.status).toBe(404);
  });

  it("Unauthenticated /api/pets and /api/users return 401", async () => {
    const petsReq = new NextRequest("http://localhost:3000/api/pets");
    const petsRes = await petsHandler(petsReq);
    expect(petsRes.status).toBe(401);

    const usersReq = new NextRequest("http://localhost:3000/api/users");
    const usersRes = await usersHandler(usersReq);
    expect(usersRes.status).toBe(401);
  });

  it("parent cannot read foreign pet (returns 403)", async () => {
    // Create a foreign pet owned by a different user
    const foreignPet = await store.createPet({
      name: "Foreign Doggo",
      species: "CANINE",
      breed: "Pug",
      ownerId: "usr-other-parent-999",
    });

    // Generate valid session token for Emily Watson (FUR_PARENT)
    const parentUser = await store.getUserByEmail("emily.watson@novivet.local");
    expect(parentUser).toBeDefined();

    const parentToken = await createSessionToken({
      userId: parentUser!.id,
      email: parentUser!.email,
      fullName: parentUser!.fullName,
      role: "FUR_PARENT",
    });

    const req = new NextRequest(`http://localhost:3000/api/pets/${foreignPet.id}`, {
      headers: {
        cookie: `novivet_session=${parentToken}`,
      },
    });

    const res = await petByIdHandler(req, { params: { id: foreignPet.id } });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toMatch(/restricted to pet owner/i);
  });

  it("STAFF cannot promote/change user roles (returns 403)", async () => {
    const staffUser = await store.getUserByEmail("marcus.vance@novivet.local");
    expect(staffUser).toBeDefined();

    const staffToken = await createSessionToken({
      userId: staffUser!.id,
      email: staffUser!.email,
      fullName: staffUser!.fullName,
      role: "STAFF",
    });

    const targetUser = await store.getUserByEmail("emily.watson@novivet.local");
    expect(targetUser).toBeDefined();

    const req = new NextRequest(`http://localhost:3000/api/users/${targetUser!.id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role: "DOCTOR" }),
      headers: {
        "Content-Type": "application/json",
        cookie: `novivet_session=${staffToken}`,
      },
    });

    const res = await userRoleHandler(req, { params: { id: targetUser!.id } });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toMatch(/Only SUPER_ADMIN can change user roles/i);
  });

  it("fallback JWT string is completely gone from src/", () => {
    const forbiddenString = "novivet-super-secure-production-clinical-jwt-secret-key-2026";
    const srcDir = path.resolve(process.cwd(), "src");

    function scanDir(dir: string): string[] {
      const results: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...scanDir(fullPath));
        } else if (entry.isFile()) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes(forbiddenString)) {
            results.push(fullPath);
          }
        }
      }
      return results;
    }

    const matches = scanDir(srcDir);
    expect(matches).toEqual([]);
  });

  it("PIN is strictly 6 digits and locks out after 5 consecutive failures", async () => {
    // 4-digit PIN returns 401
    const shortReq = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "elena.gomez@novivet.local",
        pin: "1234",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const shortRes = await loginHandler(shortReq);
    expect(shortRes.status).toBe(401);
    const shortData = await shortRes.json();
    expect(shortData.error).toMatch(/6 numeric digits/i);

    // Test 5 failures trigger lockout
    for (let i = 0; i < 5; i++) {
      const failReq = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "elena.gomez@novivet.local",
          pin: "999999",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const failRes = await loginHandler(failReq);
      expect(failRes.status).toBe(401);
    }

    // 6th attempt should be locked out
    const lockedReq = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "elena.gomez@novivet.local",
        pin: "123456",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const lockedRes = await loginHandler(lockedReq);
    expect(lockedRes.status).toBe(401);
    const lockedData = await lockedRes.json();
    expect(lockedData.error).toMatch(/locked/i);
  });

  it("Google route returns 503 when GOOGLE_CLIENT_ID is unset and idToken is provided", async () => {
    const originalClientId = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;

    const req = new NextRequest("http://localhost:3000/api/auth/google", {
      method: "POST",
      body: JSON.stringify({
        idToken: "sample-google-id-token",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await googleHandler(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toMatch(/Google OAuth is not configured/i);

    if (originalClientId) {
      process.env.GOOGLE_CLIENT_ID = originalClientId;
    }
  });

  it("exportFullBackup strips password_hash and pin_hash from every user", async () => {
    const backup = await exportFullBackup();
    expect(backup.users.length).toBeGreaterThan(0);
    for (const u of backup.users) {
      expect((u as any).password_hash).toBeUndefined();
      expect((u as any).pin_hash).toBeUndefined();
    }
  });

  it("backup export route strips password_hash and pin_hash and requires SUPER_ADMIN", async () => {
    const staffUser = await store.getUserByEmail("marcus.vance@novivet.local");
    const staffToken = await createSessionToken({
      userId: staffUser!.id,
      email: staffUser!.email,
      fullName: staffUser!.fullName,
      role: "STAFF",
    });

    const forbiddenReq = new NextRequest("http://localhost:3000/api/admin/backup/export", {
      headers: { cookie: `novivet_session=${staffToken}` },
    });
    const forbiddenRes = await backupExportHandler(forbiddenReq);
    expect(forbiddenRes.status).toBe(403);

    const adminUser = await store.getUserByEmail("admin@novivet.local");
    const adminToken = await createSessionToken({
      userId: adminUser!.id,
      email: adminUser!.email,
      fullName: adminUser!.fullName,
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
    });

    const adminReq = new NextRequest("http://localhost:3000/api/admin/backup/export", {
      headers: { cookie: `novivet_session=${adminToken}` },
    });
    const adminRes = await backupExportHandler(adminReq);
    expect(adminRes.status).toBe(200);
    const backupData = await adminRes.json();
    expect(backupData.users.length).toBeGreaterThan(0);
    for (const u of backupData.users) {
      expect(u.password_hash).toBeUndefined();
      expect(u.pin_hash).toBeUndefined();
    }
  });

  it("Settings PUT and themes POST require SUPER_ADMIN (rejects non-SUPER_ADMIN with 403)", async () => {
    const doctorUser = await store.getUserByEmail("sarah.chen@novivet.local");
    const doctorToken = await createSessionToken({
      userId: doctorUser!.id,
      email: doctorUser!.email,
      fullName: doctorUser!.fullName,
      role: "DOCTOR",
    });

    const adminUser = await store.getUserByEmail("admin@novivet.local");
    const adminToken = await createSessionToken({
      userId: adminUser!.id,
      email: adminUser!.email,
      fullName: adminUser!.fullName,
      role: "SUPER_ADMIN",
      isSuperAdmin: true,
    });

    // Settings PUT
    const settingsDoctorReq = new NextRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ name: "Hacked Clinic" }),
      headers: { "Content-Type": "application/json", cookie: `novivet_session=${doctorToken}` },
    });
    expect((await settingsPutHandler(settingsDoctorReq)).status).toBe(403);

    const settingsAdminReq = new NextRequest("http://localhost:3000/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ name: "NoviVet Animal Hospital" }),
      headers: { "Content-Type": "application/json", cookie: `novivet_session=${adminToken}` },
    });
    expect((await settingsPutHandler(settingsAdminReq)).status).toBe(200);

    // Themes POST
    const themeDoctorReq = new NextRequest("http://localhost:3000/api/admin/themes", {
      method: "POST",
      body: JSON.stringify({ themeId: "ocean-cyan" }),
      headers: { "Content-Type": "application/json", cookie: `novivet_session=${doctorToken}` },
    });
    expect((await themesPostHandler(themeDoctorReq)).status).toBe(403);

    const themeAdminReq = new NextRequest("http://localhost:3000/api/admin/themes", {
      method: "POST",
      body: JSON.stringify({ themeId: "ocean-cyan" }),
      headers: { "Content-Type": "application/json", cookie: `novivet_session=${adminToken}` },
    });
    expect((await themesPostHandler(themeAdminReq)).status).toBe(200);
  });

  it("Clinic endpoints return 403 for FUR_PARENT, but vouchers GET allows FUR_PARENT", async () => {
    const parentUser = await store.getUserByEmail("emily.watson@novivet.local");
    const parentToken = await createSessionToken({
      userId: parentUser!.id,
      email: parentUser!.email,
      fullName: parentUser!.fullName,
      role: "FUR_PARENT",
    });
    const parentHeaders = { cookie: `novivet_session=${parentToken}` };

    // Inventory GET -> 403
    const invRes = await inventoryHandler(new NextRequest("http://localhost:3000/api/inventory", { headers: parentHeaders }));
    expect(invRes.status).toBe(403);

    // Equipment GET -> 403
    const equipRes = await equipmentHandler(new NextRequest("http://localhost:3000/api/equipment", { headers: parentHeaders }));
    expect(equipRes.status).toBe(403);

    // Immunizations GET -> 403
    const immRes = await immunizationsHandler(new NextRequest("http://localhost:3000/api/immunizations", { headers: parentHeaders }));
    expect(immRes.status).toBe(403);

    // Procedures GET -> 403
    const procRes = await proceduresHandler(new NextRequest("http://localhost:3000/api/procedures", { headers: parentHeaders }));
    expect(procRes.status).toBe(403);

    // Services GET -> 403
    const servRes = await servicesHandler(new NextRequest("http://localhost:3000/api/services", { headers: parentHeaders }));
    expect(servRes.status).toBe(403);

    // Vouchers GET -> 200 (FUR_PARENT allowed)
    const vouchGetRes = await vouchersGetHandler(new NextRequest("http://localhost:3000/api/vouchers", { headers: parentHeaders }));
    expect(vouchGetRes.status).toBe(200);

    // Vouchers POST -> 403 (FUR_PARENT forbidden)
    const vouchPostRes = await vouchersPostHandler(new NextRequest("http://localhost:3000/api/vouchers", {
      method: "POST",
      body: JSON.stringify({ code: "TEST10", discountType: "PERCENTAGE", discountValue: 10 }),
      headers: { "Content-Type": "application/json", ...parentHeaders },
    }));
    expect(vouchPostRes.status).toBe(403);
  });

  it("Session cookie is secure when NODE_ENV is production or K_SERVICE is set", async () => {
    mockCookieSet.mockClear();

    // In dev without K_SERVICE -> secure is false
    const origEnv = process.env.NODE_ENV;
    const origKService = process.env.K_SERVICE;
    try {
      (process.env as any).NODE_ENV = "development";
      delete process.env.K_SERVICE;

      await setSessionCookie({
        userId: "usr-1",
        email: "test@novivet.local",
        fullName: "Test User",
        role: "DOCTOR",
      });
      expect(mockCookieSet).toHaveBeenCalled();
      const devOptions = mockCookieSet.mock.calls[0][2];
      expect(devOptions.secure).toBe(false);

      // In production -> secure is true
      mockCookieSet.mockClear();
      (process.env as any).NODE_ENV = "production";
      await setSessionCookie({
        userId: "usr-1",
        email: "test@novivet.local",
        fullName: "Test User",
        role: "DOCTOR",
      });
      const prodOptions = mockCookieSet.mock.calls[0][2];
      expect(prodOptions.secure).toBe(true);

      // In dev with K_SERVICE -> secure is true
      mockCookieSet.mockClear();
      (process.env as any).NODE_ENV = "development";
      process.env.K_SERVICE = "novivet-cloud-run";
      await setSessionCookie({
        userId: "usr-1",
        email: "test@novivet.local",
        fullName: "Test User",
        role: "DOCTOR",
      });
      const kServiceOptions = mockCookieSet.mock.calls[0][2];
      expect(kServiceOptions.secure).toBe(true);
    } finally {
      (process.env as any).NODE_ENV = origEnv;
      if (origKService !== undefined) {
        process.env.K_SERVICE = origKService;
      } else {
        delete process.env.K_SERVICE;
      }
    }
  });
});
