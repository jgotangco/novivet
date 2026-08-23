import { Bed, Activity, AlertTriangle } from "lucide-react";
import { store } from "@/db";

export default async function NurseInpatientPage() {
  const hospitalizations = await store.getActiveHospitalizations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">ICU Inpatient Ward</h1>
        <p className="text-xs text-slate-500">Bedside fluid rates, telemetry, and critical monitoring schedules.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900">Active ICU Bedside Monitoring</h2>
            <p className="text-xs text-slate-500">Continuous IV infusion pumps calibrated in mL/hr with species alarms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
