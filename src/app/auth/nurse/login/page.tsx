"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeartPulse, KeyRound, ArrowRight, Sparkles, AlertCircle, ArrowLeft, Shield } from "lucide-react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default function NurseLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePinSubmit = async (pinValue: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinValue, role: "NURSE" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Station PIN authorization failed.");
      }

      router.push("/dashboard/nurse");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoNurse = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "NURSE" }),
      });
      if (res.ok) {
        router.push("/dashboard/nurse");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100">
      <div className="p-4 sm:p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal Directory</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Nurse Station PIN Access
          </h1>
          <p className="text-xs text-slate-400">
            Bedside telemetry, fluid infusion rates, and vaccination logs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Nurse</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
              PIN: 123456
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoNurse}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                EG
              </div>
              <div>
                <p className="leading-none">Elena Gomez, RVT</p>
                <span className="text-[10px] text-teal-200">elena.gomez@novivet.local</span>
              </div>
            </div>
            <span className="text-xs font-mono">1-Click Launch →</span>
          </button>
        </div>

        <div className="space-y-3">
          <GoogleSignInButton label="Sign in with Google" />
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-center text-xs font-bold text-slate-300">Enter 6-Digit Station PIN</label>
            <div className="flex justify-center">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (e.target.value.length === 6) handlePinSubmit(e.target.value);
                }}
                placeholder="••••••"
                className="w-48 text-center text-2xl tracking-[0.4em] bg-slate-950 border border-slate-800 rounded-2xl py-3 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 text-center text-xs text-slate-600">
        NoviVet Cloud Veterinary Clinical Engine • Author: Jerome Gotangco
      </div>
    </div>
  );
}
