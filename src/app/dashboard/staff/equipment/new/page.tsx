import Link from "next/link";
import { ArrowLeft, Wrench, Shield } from "lucide-react";

export default function NewEquipmentPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        href="/dashboard/staff/equipment"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Equipment Asset Ledger</span>
      </Link>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Register Clinical Asset / Machine</h1>
        <p className="text-xs text-slate-500">Track anesthesia machines, ultrasonic dental scalers, autoclaves, and digital DR X-ray sensors.</p>
      </div>
    </div>
  );
}
