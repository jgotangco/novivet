import { HeartPulse, CheckCircle2 } from "lucide-react";

export default function SurgeriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Surgical Theater & Anesthesia</h1>
          <p className="text-xs text-slate-500">Isoflurane vaporization, Propofol induction, ASA class, and vitals monitoring.</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <HeartPulse className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Surgical Protocol System Ready</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Active surgical suites and anesthesia records are linked with patient electronic charts and emergency recovery checklists.
        </p>
      </div>
    </div>
  );
}
