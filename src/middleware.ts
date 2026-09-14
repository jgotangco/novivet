import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "novivet_session";

// Public API endpoints that do not require an active JWT session cookie
const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/google",
  "/api/auth/demo-login",
  "/api/cron/",
];

const ROUTE_ROLE_MAP: { prefix: string; allowedRoles: string[]; loginPath: string }[] = [
  {
    prefix: "/dashboard/super-admin",
    allowedRoles: ["SUPER_ADMIN"],
    loginPath: "/auth/super-admin/login",
  },
  {
    prefix: "/dashboard/deploy",
    allowedRoles: ["SUPER_ADMIN"],
    loginPath: "/auth/super-admin/login",
  },
  {
    prefix: "/deploy",
    allowedRoles: ["SUPER_ADMIN"],
    loginPath: "/auth/super-admin/login",
  },
  {
    prefix: "/dashboard/doctor",
    allowedRoles: ["DOCTOR", "SUPER_ADMIN"],
    loginPath: "/auth/doctor/login",
  },
  {
    prefix: "/dashboard/nurse",
    allowedRoles: ["NURSE", "SUPER_ADMIN"],
    loginPath: "/auth/nurse/login",
  },
  {
    prefix: "/dashboard/staff",
    allowedRoles: ["STAFF", "SUPER_ADMIN"],
    loginPath: "/auth/staff/login",
  },
  {
    prefix: "/dashboard/parent",
    allowedRoles: ["FUR_PARENT", "SUPER_ADMIN"],
    loginPath: "/auth/parent/login",
  },
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    const isPublic = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    if (isPublic) {
      return NextResponse.next();
    }

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Handle /deploy and /dashboard/:path*
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/deploy");
  if (!isProtectedPage) {
    return NextResponse.next();
  }

  if (!token || !process.env.JWT_SECRET) {
    const loginPath = pathname.startsWith("/dashboard/super-admin") || pathname.startsWith("/deploy") || pathname.startsWith("/dashboard/deploy")
      ? "/auth/super-admin/login"
      : pathname.startsWith("/dashboard/doctor")
      ? "/auth/doctor/login"
      : pathname.startsWith("/dashboard/nurse")
      ? "/auth/nurse/login"
      : pathname.startsWith("/dashboard/staff")
      ? "/auth/staff/login"
      : "/auth/parent/login";

    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role as string;

    const matchedRule = ROUTE_ROLE_MAP.find((rule) => pathname.startsWith(rule.prefix));

    if (matchedRule && !matchedRule.allowedRoles.includes(userRole)) {
      const targetDashboard =
        userRole === "SUPER_ADMIN"
          ? "/dashboard/super-admin"
          : userRole === "DOCTOR"
          ? "/dashboard/doctor"
          : userRole === "NURSE"
          ? "/dashboard/nurse"
          : userRole === "STAFF"
          ? "/dashboard/staff"
          : "/dashboard/parent";

      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/auth/parent/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/deploy",
    "/deploy/:path*",
  ],
};
