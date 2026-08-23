"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";

interface GoogleSignInButtonProps {
  label?: string;
  defaultRole?: string;
  defaultEmail?: string;
  defaultFullName?: string;
  redirectPath?: string;
  className?: string;
}

export function GoogleSignInButton({
  label = "Sign in with Google",
  defaultRole = "FUR_PARENT",
  defaultEmail,
  defaultFullName,
  redirectPath = "/dashboard/parent",
  className = "",
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState(defaultEmail || (defaultRole === "SUPER_ADMIN" ? "admin@novivet.com" : "emily.watson@gmail.com"));
  const [customName, setCustomName] = useState(defaultFullName || (defaultRole === "SUPER_ADMIN" ? "System Administrator" : "Emily Watson"));
  const [error, setError] = useState("");

  const handleGoogleAuth = async (emailToUse: string, nameToUse: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          fullName: nameToUse,
          googleId: `google-oauth-${Date.now()}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailToUse}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google sign-in failed");
      }

      setShowModal(false);

      if (data.user.role === "SUPER_ADMIN") {
        router.push("/dashboard/super-admin");
      } else if (data.user.role === "DOCTOR") {
        router.push("/dashboard/doctor");
      } else if (data.user.role === "NURSE") {
        router.push("/dashboard/nurse");
      } else if (data.user.role === "STAFF") {
        router.push("/dashboard/staff");
      } else {
        router.push("/dashboard/parent");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-sm ${className}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{label}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Sign in with Google</h3>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Choose a Google Account
              </span>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth("admin@novivet.com", "System Administrator")}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      SA
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                        System Administrator
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">admin@novivet.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAuth("sarah.chen@novivet.com", "Dr. Sarah Chen, DVM")}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      SC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                        Dr. Sarah Chen, DVM
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">sarah.chen@novivet.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Doctor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAuth("elena.gomez@novivet.com", "Elena Gomez, RVT")}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                      EG
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                        Elena Gomez, RVT
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">elena.gomez@novivet.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded">
                    Nurse
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAuth("marcus.vance@novivet.com", "Marcus Vance")}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                      MV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                        Marcus Vance
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">marcus.vance@novivet.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                    Staff
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAuth("emily.watson@gmail.com", "Emily Watson (Fur Parent)")}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      EW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        Emily Watson
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">emily.watson@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                    Parent
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
