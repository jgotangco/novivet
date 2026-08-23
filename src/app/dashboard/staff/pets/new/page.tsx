"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, Dog, Cat } from "lucide-react";
import { PetPhotoUploader } from "@/components/pets/pet-photo-uploader";

export default function NewPetRegistrationWizard() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"CANINE" | "FELINE">("CANINE");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState<"INTACT_MALE" | "NEUTERED_MALE" | "INTACT_FEMALE" | "SPAYED_FEMALE">("NEUTERED_MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weightKg, setWeightKg] = useState("5.00");
  const [microchipId, setMicrochipId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) {
          setOwners(data.users);
          if (data.users.length > 0) setOwnerId(data.users[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
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
          ownerId: ownerId || null,
          specialNotes: specialNotes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register pet.");

      router.push("/dashboard/staff/pets");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        href="/dashboard/staff/pets"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Patient Directory</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h1 className="text-2xl font-black text-slate-900">New Clinical Patient Intake</h1>

        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PetPhotoUploader photoUrl={photoUrl} onChange={setPhotoUrl} species={species} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pet Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Barnaby" className="w-full p-2.5 border rounded-xl" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Species *</label>
              <select value={species} onChange={(e) => setSpecies(e.target.value as any)} className="w-full p-2.5 border rounded-xl font-semibold">
                <option value="CANINE">🐕 Canine (Dog)</option>
                <option value="FELINE">🐈 Feline (Cat)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Breed *</label>
              <input type="text" required value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Golden Retriever" className="w-full p-2.5 border rounded-xl" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Owner *</label>
              <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className="w-full p-2.5 border rounded-xl">
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.fullName} ({o.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full p-2.5 border rounded-xl font-mono" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Microchip ID</label>
              <input type="text" value={microchipId} onChange={(e) => setMicrochipId(e.target.value)} placeholder="15-digit ISO microchip" className="w-full p-2.5 border rounded-xl font-mono" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
            {submitting ? "Registering Patient..." : "Complete Patient Intake"}
          </button>
        </form>
      </div>
    </div>
  );
}
