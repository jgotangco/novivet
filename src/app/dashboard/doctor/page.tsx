import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Stethoscope, FileText, Activity, Heart, Dog, Cat, Plus, Calendar, Clock, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function DoctorDashboardPage() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "DOCTOR" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth/doctor/login");
  }

  const visits = await store.getVisits();
  const pets = await store.getPets();

  const enrichedVisits = visits.map((v) => {
    const pet = pets.find((p) => p.id === v.petId);
    return { ...v, pet };
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-emerald-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Veterinary Clinician Workspace</h1>
            <p className="text-xs text-slate-500">Welcome, {session.fullName} • Electronic SOAP Medical Records</p>
          </div>
        </div>

        <Link
          href="/dashboard/doctor/patients"
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Select Patient for Consultation</span>
        </Link>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Recent Completed SOAP Consultations</h2>
        <div className="space-y-3">
          {enrichedVisits.map((v) => (
            <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{v.pet?.name || "Patient"}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                    {v.visitType}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{formatDate(v.visitDate)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">S (Subjective)</span>
                  <p className="text-slate-700 mt-1 line-clamp-2">{v.soapSubjective || "N/A"}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O (Objective)</span>
                  <p className="text-slate-700 mt-1 line-clamp-2">{v.soapObjective || "N/A"}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">A (Assessment)</span>
                  <p className="text-slate-700 mt-1 line-clamp-2">{v.soapAssessment || "N/A"}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">P (Plan)</span>
                  <p className="text-slate-700 mt-1 line-clamp-2">{v.soapPlan || "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
