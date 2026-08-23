import Link from "next/link";
import { ArrowLeft, Plus, Stethoscope } from "lucide-react";
import { store } from "@/db";

export default async function DoctorPatientsPage() {
  const pets = await store.getPets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Small Animal Patients</h1>
          <p className="text-xs text-slate-500">Electronic health records, vital history, and active clinical plans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <img
                src={pet.photoUrl || (pet.species === "FELINE" ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400")}
                alt={pet.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{pet.name}</h3>
                <span className="text-[11px] text-slate-500">{pet.species} • {pet.breed}</span>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Microchip: {pet.microchipId || "Unchipped"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{pet.weightKg || "5.0"} kg</span>
              <Link
                href={`/dashboard/doctor/patients/${pet.id}/consult`}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Start SOAP</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
