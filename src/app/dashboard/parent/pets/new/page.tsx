"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, Heart, Dog, Cat } from "lucide-react";
import { PetPhotoUploader } from "@/components/pets/pet-photo-uploader";

export default function ParentNewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"CANINE" | "FELINE">("CANINE");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState<"INTACT_MALE" | "NEUTERED_MALE" | "INTACT_FEMALE" | "SPAYED_FEMALE">("NEUTERED_MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weightKg, setWeightKg] = useState("5.00");
  const [microchipId, setMicrochipId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          species,
          breed,
          gender,
          dateOfBirth: dateOfBirth || null,
          weightKg,
          microchipId: microchipId || null,
          photoUrl: photoUrl || null,
          specialNotes: specialNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register pet.");

      router.push("/dashboard/parent/my-pets");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        href="/dashboard/parent/my-pets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Pets</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Register New Pet</h1>
            <p className="text-xs text-slate-500">Create a digital pet passport with vaccination history & photos.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PetPhotoUploader photoUrl={photoUrl} onChange={setPhotoUrl} species={species} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pet Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barnaby"
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="CANINE">🐕 Canine (Dog)</option>
                <option value="FELINE">🐈 Feline (Cat)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Breed *</label>
              <input
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Microchip ID</label>
              <input
                type="text"
                value={microchipId}
                onChange={(e) => setMicrochipId(e.target.value)}
                placeholder="15-digit ISO microchip"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition"
          >
            {loading ? "Registering Pet..." : "Complete Pet Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
