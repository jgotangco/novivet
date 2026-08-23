"use client";

import { useState } from "react";
import Link from "next/link";
import { Cloud, Server, Terminal, Copy, Check, ExternalLink, ShieldCheck, Database, Cpu, ArrowLeft, Boxes, Lock, Clock, Sparkles } from "lucide-react";

export default function DeployGuidePage() {
  const [activeTab, setActiveTab] = useState<"cloudrun" | "vm" | "local">("cloudrun");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Portal</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Production Infrastructure Guide</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Downtime Deployment Blueprints</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Production Deployment Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          NoviVet is designed as a cloud-native, standalone Next.js container listening on port <strong>8080</strong>. Follow the instructions below to deploy on Google Cloud Run, a Linux VM, or an on-premise local server.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("cloudrun")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === "cloudrun" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          ☁️ Target 1: Google Cloud Run & Cloud SQL
        </button>
        <button
          onClick={() => setActiveTab("vm")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === "vm" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          🐧 Target 2: Linux VM (Docker Compose)
        </button>
        <button
          onClick={() => setActiveTab("local")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === "local" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          💻 Target 3: Local Bare-Metal Server
        </button>
      </div>

      {activeTab === "cloudrun" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Google Cloud Run Deployment</h2>
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
            <p className="text-emerald-400"># 1. Build and push container to Google Artifact Registry</p>
            <p>gcloud builds submit --config cloudbuild.yaml .</p>
            <p className="text-emerald-400 mt-3"># 2. Deploy Cloud Run service on Port 8080</p>
            <p>gcloud run deploy novivet-clinical-app \</p>
            <p>  --image gcr.io/$PROJECT_ID/novivet:latest \</p>
            <p>  --region asia-southeast1 \</p>
            <p>  --platform managed \</p>
            <p>  --allow-unauthenticated \</p>
            <p>  --port 8080</p>
          </div>
        </div>
      )}

      {activeTab === "vm" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Linux VM with Docker Compose</h2>
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
            <p className="text-emerald-400"># Clone and start full PostgreSQL 16 stack</p>
            <p>git clone https://github.com/jgotangco/novivet.git</p>
            <p>cd novivet</p>
            <p>docker compose up -d --build</p>
          </div>
        </div>
      )}

      {activeTab === "local" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Local Workstation / Node 20+</h2>
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
            <p className="text-emerald-400"># Install and start development runtime</p>
            <p>npm install</p>
            <p>npm run dev</p>
          </div>
        </div>
      )}
    </div>
  );
}
