import { Syringe, CheckCircle2 } from "lucide-react";

export default function NurseShotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Core Immunization Records</h1>
        <p className="text-xs text-slate-500">PureVax non-adjuvanted feline vaccines, Defensor Rabies, Vanguard DHPP.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Syringe className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Vaccine Registry Online</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Administer and log immunization serial numbers, lot numbers, and automated recall reminders.
        </p>
      </div>
    </div>
  );
}
