import { NextRequest, NextResponse } from "next/server";
import { authenticateWithPassword, authenticateWithPin, setSessionCookie, sanitizeUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, pin, role } = body;

    let user = null;

    if (pin !== undefined && pin !== null) {
      const pinResult = await authenticateWithPin(String(pin), { email, role });
      if (!pinResult.user) {
        return NextResponse.json(
          { error: pinResult.error || "Invalid Station PIN code." },
          { status: 401 }
        );
      }
      user = pinResult.user;
    } else if (email && password) {
      user = await authenticateWithPassword(email, password);
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Credentials required." }, { status: 400 });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as any,
      specialty: user.metadata?.specialty,
      isSuperAdmin: user.role === "SUPER_ADMIN",
    });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
