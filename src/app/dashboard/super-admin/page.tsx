"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cpu, Database, Download, Upload, Trash2, Palette, Wrench, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, Layers, ArrowRight, Server, Building, Phone, MapPin, FileBadge, Save, Activity, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function AdminDashboard() {
  const { currentTheme, themes, clinicSettings, applyTheme, updateClinicSettings } = useTheme();
  const [savingSettings, setSavingSettings] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formSettings, setFormSettings] = useState({
    clinicName: "",
    tagline: "",
    contactPhone: "",
    emergencyHotline: "",
    address: "",
    licenseNumber: "",
    baseCurrency: "PHP",
    taxRatePercent: "12.00",
  });

  const [stats, setStats] = useState<any>({ users: 0, pets: 0, services: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/pets").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
    ]).then(([u, p, s]) => {
      setStats({
        users: u.users?.length || 0,
        pets: p.pets?.length || 0,
        services: s.services?.length || 0,
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (clinicSettings) {
      setFormSettings({
        clinicName: clinicSettings.clinicName || "NoviVet Animal Hospital",
        tagline: clinicSettings.tagline || "Cloud Veterinary Clinical Engine",
        contactPhone: clinicSettings.contactPhone || "+63 2 8123 4567",
        emergencyHotline: clinicSettings.emergencyHotline || "+63 917 999 8888",
        address: clinicSettings.address || "123 Mabini St., Bonifacio Global City, Taguig, Philippines",
        licenseNumber: clinicSettings.licenseNumber || "PRC-VET-HOSP-0091",
        baseCurrency: clinicSettings.baseCurrency || "PHP",
        taxRatePercent: clinicSettings.taxRatePercent || "12.00",
      });
    }
  }, [clinicSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMsg(null);
    try {
      await updateClinicSettings(formSettings);
      setMsg({ text: "Hospital settings updated successfully!", type: "success" });
    } catch (e: any) {
      setMsg({ text: e.message || "Failed to save settings", type: "error" });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch("/api/admin/backup/export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `novivet_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (e) {
      console.error("Backup export failed", e);
    }
  };

  const handlePurgeMockData = async () => {
    if (!confirm("Are you sure you want to purge all sandbox and mock records for production?")) return;
    try {
      const res = await fetch("/api/admin/purge-mock-data", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Mock data purged successfully. Hospital is now in fresh production state.");
        window.location.reload();
      }
    } catch (e) {
      console.error("Purge failed", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-purple-600/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Admin Control Center</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 font-mono">
                System Master
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hospital Configuration, 6 Clinical Themes, Database Backup Snapshots & Sandbox Purge.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Snapshot</span>
          </button>
          <button
            onClick={handlePurgeMockData}
            className="py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Mock Data</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-bold ${msg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
          {msg.text}
        </div>
      )}

      {/* 6 Themes Palette */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-base text-slate-900">Curated Clinical Themes (6 Palettes)</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTheme(t.id)}
              className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between space-y-2 ${
                currentTheme.id === t.id ? "border-indigo-600 bg-indigo-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accentColor }} />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 leading-tight">{t.name}</p>
                <span className="text-[10px] text-slate-400">{t.isDark ? "Dark Theme" : "Light Theme"}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Settings Form */}
      <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base text-slate-900">Hospital Vital Information</h2>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSettings ? "Saving..." : "Save Hospital Details"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Clinic / Hospital Name</label>
            <input
              type="text"
              value={formSettings.clinicName}
              onChange={(e) => setFormSettings({ ...formSettings, clinicName: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formSettings.tagline}
              onChange={(e) => setFormSettings({ ...formSettings, tagline: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">License / Accreditation</label>
            <input
              type="text"
              value={formSettings.licenseNumber}
              onChange={(e) => setFormSettings({ ...formSettings, licenseNumber: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              value={formSettings.contactPhone}
              onChange={(e) => setFormSettings({ ...formSettings, contactPhone: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Emergency Hotline (24/7)</label>
            <input
              type="text"
              value={formSettings.emergencyHotline}
              onChange={(e) => setFormSettings({ ...formSettings, emergencyHotline: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-mono text-rose-700 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Base Currency</label>
            <input
              type="text"
              value={formSettings.baseCurrency}
              onChange={(e) => setFormSettings({ ...formSettings, baseCurrency: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block font-bold text-slate-700 mb-1">Hospital Physical Address</label>
            <input
              type="text"
              value={formSettings.address}
              onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>
        </div>
      </form>

      {/* Footer System Attribution */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>NoviVet Cloud Clinical Engine • PostgreSQL 16 / Cloud SQL</span>
        <span>
          Designed and product-directed by{" "}
          <a
            href="https://github.com/jgotangco"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 hover:underline"
          >
            Jerome Gotangco
          </a>
          . Developed with Google Antigravity / Gemini.
        </span>
      </div>
    </div>
  );
}
