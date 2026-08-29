"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  HeartPulse, 
  Building, 
  Heart, 
  Server, 
  Sparkles, 
  ArrowRight,
  UserPlus,
  Cpu,
  ExternalLink,
  CheckCircle2,
  Terminal,
  ArrowUpRight,
  Play,
  Zap
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function HomePage() {
  const router = useRouter();
  const { currentTheme, clinicSettings } = useTheme();
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [sandboxActive, setSandboxActive] = useState(true);
  const [launchingRole, setLaunchingRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/env")
      .then((r) => r.json())
      .then((data) => setEnvInfo(data))
      .catch(() => {});

    const savedMode = localStorage.getItem("novivet_mode");
    if (savedMode === "production") {
      setSandboxActive(false);
    }
  }, []);

  const handleQuickDemoLaunch = async (role: string, redirectUrl: string) => {
    setLaunchingRole(role);
    try {
      localStorage.setItem("novivet_mode", "demo");
      setSandboxActive(true);
      window.dispatchEvent(new Event("novivet_mode_changed"));

      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (e) {
      console.error("Demo login error:", e);
    } finally {
      setLaunchingRole(null);
    }
  };

  const handleSelectSandbox = () => {
    localStorage.setItem("novivet_mode", "demo");
    setSandboxActive(true);
    window.dispatchEvent(new Event("novivet_mode_changed"));
    handleQuickDemoLaunch("DOCTOR", "/dashboard/doctor");
  };

  const handleSelectProduction = () => {
    localStorage.setItem("novivet_mode", "production");
    setSandboxActive(false);
    window.dispatchEvent(new Event("novivet_mode_changed"));
  };

  const personas = [
    {
      role: "SUPER_ADMIN",
      title: "Clinic & System Admin",
      desc: "Theme manager, hospital vital settings, mock data purge, and database backup/restore.",
      href: "/auth/super-admin/login",
      dashUrl: "/dashboard/super-admin",
      icon: Cpu,
      color: "from-purple-600 to-indigo-600",
      accent: "text-purple-700 bg-purple-50 border-purple-200",
      badge: "Admin Master",
      name: "System Administrator",
      email: "admin@novivet.com",
    },
    {
      role: "DOCTOR",
      title: "Doctor & Clinician",
      desc: "Electronic SOAP consultations, vitals, surgeries & small animal protocols.",
      href: "/auth/doctor/login",
      dashUrl: "/dashboard/doctor",
      icon: Stethoscope,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
      badge: "SOAP & Vitals",
      name: "Dr. Sarah Chen, DVM",
      email: "sarah.chen@novivet.com",
    },
    {
      role: "NURSE",
      title: "Nurse & Inpatient",
      desc: "Touchscreen station PIN access for bedside triage and ICU fluid telemetry.",
      href: "/auth/nurse/login",
      dashUrl: "/dashboard/nurse",
      icon: HeartPulse,
      color: "from-teal-500 to-cyan-600",
      accent: "text-teal-700 bg-teal-50 border-teal-200",
      badge: "Bedside Ward",
      name: "Elena Gomez, RVT",
      email: "elena.gomez@novivet.com",
    },
    {
      role: "STAFF",
      title: "Staff & Operations",
      desc: "Patient directory, species pharmacy inventory, service tariffs & user management.",
      href: "/auth/staff/login",
      dashUrl: "/dashboard/staff",
      icon: Building,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-700 bg-amber-50 border-amber-200",
      badge: "Operations",
      name: "Marcus Vance",
      email: "marcus.vance@novivet.com",
    },
    {
      role: "FUR_PARENT",
      title: "Fur Parent Portal",
      desc: "Verified digital pet health passports, vaccine records, photo uploads & vouchers.",
      href: "/auth/parent/login",
      dashUrl: "/dashboard/parent",
      icon: Heart,
      color: "from-indigo-500 to-purple-600",
      accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
      badge: "Pet Passport",
      name: "Emily Watson",
      email: "emily.watson@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
              🐾
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg tracking-tight leading-none flex items-center gap-2">
                {clinicSettings.clinicName || "NoviVet Animal Hospital"}
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase tracking-widest font-mono">
                  Cloud
                </span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {clinicSettings.tagline || "Cloud Veterinary Clinical Engine"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {envInfo && (
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-slate-50 border-slate-200 text-slate-700">
                <span className={`w-2 h-2 rounded-full ${envInfo.isProduction ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                <span>{envInfo.isProduction ? "🏥 Live Production" : "🧪 Local Sandbox"}</span>
              </div>
            )}

            <a
              href="https://github.com/jgotangco"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <span>Jerome Gotangco • Google Antigravity</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <Link
              href="/auth/register"
              className="py-2 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>

            <Link
              href="/auth/parent/login"
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Welcome to NoviVet • Veterinary Operating System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Select Your Environment to Begin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Choose whether to explore in Sandbox Mode with sample clinical data, or review the step-by-step blueprints to deploy your own production instance on Google Cloud Run or Linux VMs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-6 ${
            sandboxActive 
              ? "bg-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/20" 
              : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-sm border border-emerald-100">
                  🧪
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Option 1: Interactive Sandbox
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Explore Sandbox Demo</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Test the complete clinical workflows instantly. Pre-loaded with canine and feline patients, electronic SOAP notes, inpatient ICU vitals, surgical protocols, pharmacy inventory, and Philippine Peso fee tariffs.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  1-Click Fast Launch as:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch("DOCTOR", "/dashboard/doctor")}
                    disabled={!!launchingRole}
                    className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-left transition flex items-center gap-2 group text-xs font-bold"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Dr. Sarah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch("SUPER_ADMIN", "/dashboard/super-admin")}
                    disabled={!!launchingRole}
                    className="p-2 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-900 text-left transition flex items-center gap-2 group text-xs font-bold"
                  >
                    <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch("NURSE", "/dashboard/nurse")}
                    disabled={!!launchingRole}
                    className="p-2 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-900 text-left transition flex items-center gap-2 group text-xs font-bold"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">Nurse Elena</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch("STAFF", "/dashboard/staff")}
                    disabled={!!launchingRole}
                    className="p-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-left transition flex items-center gap-2 group text-xs font-bold"
                  >
                    <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Staff Marcus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLaunch("FUR_PARENT", "/dashboard/parent")}
                    disabled={!!launchingRole}
                    className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-left transition flex items-center gap-2 group text-xs font-bold sm:col-span-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">Fur Parent (Emily)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSelectSandbox}
                disabled={!!launchingRole}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{launchingRole ? `Launching as ${launchingRole}...` : "Launch Sandbox Experience"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard/deploy"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Need to deploy? View Production Deployment Guide</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className={`p-8 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-6 ${
            !sandboxActive 
              ? "bg-white border-indigo-500 shadow-xl ring-2 ring-indigo-500/20" 
              : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-sm border border-indigo-100">
                  🚀
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Option 2: Go to Production
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Deploy to Production</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ready to launch NoviVet for your veterinary hospital? Access comprehensive step-by-step instructions for Google Cloud Run, Linux VM with Docker Compose, and on-premise local servers.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>3 Automated Deployment Blueprints</span>
                </div>
                <ul className="text-[11px] text-indigo-800 list-disc list-inside space-y-0.5">
                  <li><strong>Target 1:</strong> Google Cloud Run + Cloud SQL (PostgreSQL 16)</li>
                  <li><strong>Target 2:</strong> Linux VM (Ubuntu/Debian) with Docker Compose</li>
                  <li><strong>Target 3:</strong> On-Premise Local Server listening on port 8080</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Link
                href="/dashboard/deploy"
                onClick={handleSelectProduction}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Open Step-by-Step Deployment Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleSelectProduction}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Switch App to Production Mode</span>
              </button>
            </div>
          </div>
        </div>

        {envInfo && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">Environment Detection Engine</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Host: <strong>{envInfo.host}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Detection Status</span>
                <span className={`font-bold block text-sm ${envInfo.isProduction ? "text-emerald-700" : "text-amber-700"}`}>
                  {envInfo.isProduction ? "🚀 Production Setup" : "🧪 Local Workstation"}
                </span>
                <p className="text-[11px] text-slate-500">
                  {envInfo.isProduction ? "Running live cloud container target" : "Local development runtime detected"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Platform Target</span>
                <span className="font-bold text-slate-800 block text-sm truncate" title={envInfo.platform}>
                  {envInfo.platform}
                </span>
                <p className="text-[11px] text-slate-500">
                  Port: <strong>{envInfo.port}</strong> • Node: <strong>{envInfo.nodeEnv}</strong>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Database Provider</span>
                <span className="font-bold text-slate-800 block text-sm truncate" title={envInfo.database}>
                  {envInfo.database}
                </span>
                <p className="text-[11px] text-slate-500">
                  Dual in-memory mock store / PostgreSQL 16
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Active Clinic Theme</span>
                <span className="font-bold text-indigo-700 block text-sm">
                  {currentTheme.name}
                </span>
                <p className="text-[11px] text-slate-500">
                  6 curated palettes available in Admin Console
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 {clinicSettings.clinicName || "NoviVet Animal Hospital"}.</span>
            <span>•</span>
            <span>
              Designed and product-directed by{" "}
              <a
                href="https://github.com/jgotangco"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-900 hover:text-emerald-600 transition underline underline-offset-2"
              >
                Jerome Gotangco
              </a>
              . Developed with Google Antigravity / Gemini.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jgotangco"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-slate-900 transition"
            >
              <span>github.com/jgotangco</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>Base Currency: <strong>{clinicSettings.baseCurrency || "PHP"} (₱)</strong></span>
            <span>•</span>
            <span>Google Cloud Run Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
