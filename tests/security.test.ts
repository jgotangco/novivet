import { describe, it, expect, beforeEach, beforeAll } from "vitest";
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
import { store } from "@/db";
import { createSessionToken, createSessionToken as signJwt } from "@/lib/auth";

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
});
