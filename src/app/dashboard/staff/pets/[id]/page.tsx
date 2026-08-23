import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { PetProfileTabs } from "@/components/pets/pet-profile-tabs";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default async function StaffPetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "STAFF" && session.role !== "DOCTOR" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth/staff/login");
  }

  const pet = await store.getPetById(params.id);
  if (!pet) {
    notFound();
  }

  const owner = await store.getUserById(pet.ownerId);
  const visits = await store.getVisits();

  const enrichedPet = {
    ...pet,
    owner,
    visits,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/staff/pets"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Pet Directory</span>
        </Link>

        <Link
          href={`/dashboard/staff/pets/${pet.id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Pet Info</span>
        </Link>
      </div>

      <PetProfileTabs pet={enrichedPet} userRole={session.role} defaultTab="soap" />
    </div>
  );
}
