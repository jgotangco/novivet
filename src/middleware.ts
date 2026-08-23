import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "novivet-super-secure-production-clinical-jwt-secret-key-2026"
);

const SESSION_COOKIE = "novivet_session";

const ROUTE_ROLE_MAP: { prefix: string; allowedRoles: string[]; loginPath: string }[] = [
  {
    prefix: "/dashboard/doctor",
    allowedRoles: ["DOCTOR"],
    loginPath: "/auth/doctor/login",
  },
  {
    prefix: "/dashboard/nurse",
    allowedRoles: ["NURSE"],
    loginPath: "/auth/nurse/login",
  },
  {
    prefix: "/dashboard/staff",
    allowedRoles: ["STAFF"],
    loginPath: "/auth/staff/login",
  },
  {
    prefix: "/dashboard/parent",
    allowedRoles: ["FUR_PARENT"],
    loginPath: "/auth/parent/login",
  },
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matchedRule = ROUTE_ROLE_MAP.find((rule) => pathname.startsWith(rule.prefix));

  if (!matchedRule) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL(matchedRule.loginPath, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (!matchedRule.allowedRoles.includes(userRole)) {
      const targetDashboard =
        userRole === "DOCTOR"
          ? "/dashboard/doctor"
          : userRole === "NURSE"
          ? "/dashboard/nurse"
          : userRole === "STAFF"
          ? "/dashboard/staff"
          : "/dashboard/parent";

      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL(matchedRule.loginPath, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/doctor/:path*",
    "/dashboard/nurse/:path*",
    "/dashboard/staff/:path*",
    "/dashboard/parent/:path*",
  ],
};
