"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { PetPhotoUploader } from "@/components/pets/pet-photo-uploader";

export default function EditPetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"CANINE" | "FELINE">("CANINE");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [microchipId, setMicrochipId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  useEffect(() => {
    fetch(`/api/pets/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.pet) {
          const p = data.pet;
          setName(p.name);
          setSpecies(p.species || "CANINE");
          setBreed(p.breed);
          setGender(p.gender);
          setWeightKg(p.weightKg || "");
          setMicrochipId(p.microchipId || "");
          setPhotoUrl(p.photoUrl || "");
          setSpecialNotes(p.specialNotes || "");
        }
      })
      .catch(() => setError("Failed to load pet details"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/pets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          species,
          breed,
          gender,
          weightKg,
          microchipId,
          photoUrl,
          specialNotes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update pet");
      router.push(`/dashboard/staff/pets/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        href={`/dashboard/staff/pets/${params.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Cancel & Return</span>
      </Link>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Edit Pet Record</h1>

        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PetPhotoUploader photoUrl={photoUrl} onChange={setPhotoUrl} species={species} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Breed</label>
              <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} className="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
              <input type="text" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full p-2 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Microchip</label>
              <input type="text" value={microchipId} onChange={(e) => setMicrochipId(e.target.value)} className="w-full p-2 border rounded-xl" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
