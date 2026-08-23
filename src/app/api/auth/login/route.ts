import { NextRequest, NextResponse } from "next/server";
import { authenticateWithPassword, authenticateWithPin, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, pin } = body;

    let user = null;

    if (pin) {
      user = await authenticateWithPin(pin);
      if (!user) {
        return NextResponse.json({ error: "Invalid Station PIN code." }, { status: 401 });
      }
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

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
