import { Activity, AlertTriangle } from "lucide-react";

export default function NurseTriagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Emergency & Bedside Triage</h1>
        <p className="text-xs text-slate-500">Rapid vitals entry, capillary refill time (CRT), and pain scoring.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900">Rapid Patient Intake</h2>
            <p className="text-xs text-slate-500">Temperature, Heart Rate, Respiration Rate, CRT, Mucous Membranes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
