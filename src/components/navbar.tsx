"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  HeartPulse, 
  Building, 
  Heart, 
  LogOut, 
  Cpu, 
  Server
} from "lucide-react";
import { useTheme } from "./theme-provider";

interface NavbarProps {
  currentRole?: string;
  userEmail?: string;
  userName?: string;
}

export function Navbar({ currentRole, userEmail, userName }: NavbarProps) {
  const router = useRouter();
  const { currentTheme, clinicSettings } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mode, setMode] = useState<"demo" | "production">("demo");
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("novivet_mode") as "demo" | "production";
    if (savedMode) setMode(savedMode);

    const onModeChanged = () => {
      const updated = localStorage.getItem("novivet_mode") as "demo" | "production";
      if (updated) setMode(updated);
    };

    window.addEventListener("novivet_mode_changed", onModeChanged);

    fetch("/api/env")
      .then((r) => r.json())
      .then((d) => setEnvInfo(d))
      .catch(() => {});

    return () => window.removeEventListener("novivet_mode_changed", onModeChanged);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleQuickSwitchRole = async (targetRole: string) => {
    try {
      await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (targetRole === "SUPER_ADMIN") {
        router.push("/dashboard/super-admin");
      } else {
        router.push(`/dashboard/${targetRole.toLowerCase().replace("fur_", "")}`);
      }
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              🐾
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-base tracking-tight flex items-center gap-1.5 leading-none">
                {clinicSettings.clinicName || "NoviVet"}
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase tracking-widest font-mono">
                  Cloud
                </span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {clinicSettings.tagline || "Clinical Engine"}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("novivet_open_mode_modal"))}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
              mode === "demo"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
            }`}
            title="Click to switch environment mode"
          >
            <span className={`w-2 h-2 rounded-full ${mode === "demo" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>{mode === "demo" ? "🧪 Sandbox Mode" : "🏥 Production"}</span>
          </button>

          {(currentRole === "SUPER_ADMIN" || mode === "demo") && (
            <Link
              href="/dashboard/super-admin"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-bold transition"
              title="Admin Console: Themes, Hospital Settings & Backups"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Admin Console</span>
            </Link>
          )}

          {mode === "demo" && (
            <Link
              href="/dashboard/deploy"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition"
            >
              <Server className="w-3 h-3" />
              <span>Deploy Guide</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {mode === "demo" && currentRole && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-2">Switch:</span>
              <button
                onClick={() => handleQuickSwitchRole("SUPER_ADMIN")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentRole === "SUPER_ADMIN" ? "bg-slate-900 text-indigo-300 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Admin Role"
              >
                <Cpu className="w-3 h-3" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleQuickSwitchRole("DOCTOR")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentRole === "DOCTOR" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope className="w-3 h-3" />
                <span>Dr</span>
              </button>
              <button
                onClick={() => handleQuickSwitchRole("NURSE")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentRole === "NURSE" ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HeartPulse className="w-3 h-3" />
                <span>Nurse</span>
              </button>
              <button
                onClick={() => handleQuickSwitchRole("STAFF")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentRole === "STAFF" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building className="w-3 h-3" />
                <span>Staff</span>
              </button>
              <button
                onClick={() => handleQuickSwitchRole("FUR_PARENT")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  currentRole === "FUR_PARENT" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>Parent</span>
              </button>
            </div>
          )}

          {userEmail ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900">{userName || "User"}</span>
                <span className="text-[11px] font-mono text-slate-500">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/parent/login"
                className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
