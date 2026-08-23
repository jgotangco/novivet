import Link from "next/link";
import { Plus, Heart, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import { store } from "@/db";

export default async function MyPetsPage() {
  const pets = await store.getPets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Registered Pets</h1>
          <p className="text-xs text-slate-500">Manage digital pet health passports, vaccination tags, and records.</p>
        </div>

        <Link
          href="/dashboard/parent/pets/new"
          className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Pet</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {pets.map((pet) => (
          <div key={pet.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={pet.photoUrl || (pet.species === "FELINE" ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400")}
                  alt={pet.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{pet.name}</h3>
                  <span className="text-xs text-slate-500">{pet.species} • {pet.breed}</span>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">Chip: {pet.microchipId || "Unchipped"}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{pet.weightKg || "5.0"} kg</span>
              <Link
                href={`/dashboard/parent/my-pets/${pet.id}/history`}
                className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1"
              >
                <span>View Passport</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
