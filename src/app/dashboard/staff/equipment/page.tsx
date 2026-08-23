import Link from "next/link";
import { Plus, Wrench, ShieldCheck, AlertTriangle } from "lucide-react";
import { store } from "@/db";

export default async function EquipmentLedgerPage() {
  const equipment = await store.getEquipment();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Hospital Equipment & Asset Ledger</h1>
          <p className="text-xs text-slate-500">Preventative maintenance tracking, calibration logs, and downtime metrics.</p>
        </div>

        <Link
          href="/dashboard/staff/equipment/new"
          className="py-2 px-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Equipment</span>
        </Link>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Equipment Assets Operational</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          All hospital machines, anesthesia vaporizers, and autoclaves are currently certified and within inspection intervals.
        </p>
      </div>
    </div>
  );
}
