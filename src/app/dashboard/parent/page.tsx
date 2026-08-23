import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { store } from "@/db";
import { Heart, Plus, Calendar, Ticket, ShieldCheck, ArrowRight } from "lucide-react";

export default async function ParentDashboardPage() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "FUR_PARENT" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth/parent/login");
  }

  const pets = await store.getPets();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-indigo-500/20">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Pet Parent Health Portal</h1>
            <p className="text-xs text-slate-500">Welcome, {session.fullName} • Digital Pet Health Passports</p>
          </div>
        </div>

        <Link
          href="/dashboard/parent/pets/new"
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Pet</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {pets.map((pet) => (
          <div key={pet.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <img
                src={pet.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400"}
                alt={pet.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{pet.name}</h3>
                <p className="text-xs text-slate-500">{pet.species} • {pet.breed}</p>
                <p className="text-[10px] font-mono text-slate-400">Microchip: {pet.microchipId || "Unchipped"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{pet.weightKg || "5.0"} kg</span>
              <Link
                href={`/dashboard/parent/my-pets/${pet.id}/history`}
                className="py-1 px-2.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition"
              >
                Passport →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
