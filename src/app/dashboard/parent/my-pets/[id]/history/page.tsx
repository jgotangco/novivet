import Link from "next/link";
import { ArrowLeft, Clock, FileText, Stethoscope } from "lucide-react";
import { store } from "@/db";

export default async function PetHistoryPage({ params }: { params: { id: string } }) {
  const pet = await store.getPetById(params.id);
  const visits = await store.getVisits();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/parent/my-pets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Pets</span>
      </Link>

      {pet ? (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={pet.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400"}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-black text-slate-900">{pet.name}'s Medical History</h1>
              <p className="text-xs text-slate-500">{pet.species} • {pet.breed} • Microchip: {pet.microchipId || "N/A"}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">Pet not found.</p>
      )}
    </div>
  );
}
