import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DoctorConsultationStation from "@/app/dashboard/doctor/page";

export default function PatientConsultPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/doctor/patients"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Patient Directory</span>
      </Link>
      <DoctorConsultationStation />
    </div>
  );
}
