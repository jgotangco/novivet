"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, Lock, Mail, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "DOCTOR" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Doctor authentication failed.");
      }

      router.push("/dashboard/doctor");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoDoctor = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "DOCTOR" }),
      });
      if (res.ok) {
        router.push("/dashboard/doctor");
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Veterinarian Clinician Portal
          </h1>
          <p className="text-xs text-slate-400">
            Electronic SOAP notes, vitals, anesthesia and surgical logs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Clinician</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              Doctor Account
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoDoctor}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition active:scale-95 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                SC
              </div>
              <div>
                <p className="leading-none">Dr. Sarah Chen, DVM</p>
                <span className="text-[10px] text-emerald-200">sarah.chen@novivet.local</span>
              </div>
            </div>
            <span className="text-xs font-mono">1-Click Launch →</span>
          </button>
        </div>

        <div className="space-y-3">
          <GoogleSignInButton label="Sign in with Google" />
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Or Sign In with Credentials
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.chen@novivet.local"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating Clinician..." : "Sign In to SOAP Workspace"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="p-4 sm:p-6 text-center text-xs text-slate-600">
        NoviVet Cloud Veterinary Clinical Engine • Author: Jerome Gotangco
      </div>
    </div>
  );
}
