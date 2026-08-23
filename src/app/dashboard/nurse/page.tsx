import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { store } from "@/db";
import { HeartPulse, Syringe, Bed, Activity, Clock, ShieldCheck, CheckCircle2, User } from "lucide-react";

export default async function NurseDashboardPage() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "NURSE" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth/nurse/login");
  }

  const hospitalizations = await store.getActiveHospitalizations();
  const pets = await store.getPets();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-teal-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Nurse Station & Triage</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800 font-mono">
                Station Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {session.fullName} • Bedside monitoring, telemetry, and vaccines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
