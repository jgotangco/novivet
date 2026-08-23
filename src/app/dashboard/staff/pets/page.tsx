"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Dog, 
  Cat, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  AlertCircle,
  Phone,
  UserCheck
} from "lucide-react";

export default function StaffPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<"ALL" | "CANINE" | "FELINE">("ALL");

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pets");
      const data = await res.json();
      if (data.pets) {
        setPets(data.pets);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesSpecies = speciesFilter === "ALL" || pet.species === speciesFilter;
    const matchesSearch =
      search === "" ||
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      (pet.microchipId && pet.microchipId.includes(search));
    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Hospital Patient Directory</h1>
          <p className="text-xs text-slate-500">Universal patient CRUD, photo management, species segmentation, and owner lookup.</p>
        </div>

        <Link
          href="/dashboard/staff/pets/new"
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Intake</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <img
                src={pet.photoUrl || (pet.species === "FELINE" ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400")}
                alt={pet.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{pet.name}</h3>
                <span className="text-[11px] text-slate-500">{pet.species} • {pet.breed}</span>
                <p className="text-[10px] font-mono text-slate-400">Microchip: {pet.microchipId || "Unchipped"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{pet.weightKg || "5.0"} kg</span>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/staff/pets/${pet.id}`}
                  className="py-1 px-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/staff/pets/${pet.id}/edit`}
                  className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
