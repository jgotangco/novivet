import Link from "next/link";
import { Calendar, Clock, Plus, Heart } from "lucide-react";

export default function ParentAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Clinical Appointments</h1>
          <p className="text-xs text-slate-500">Upcoming wellness exams, vaccination boosters, and follow-ups.</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">No Pending Appointments</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Contact our 24/7 hospital desk or book online for your pet's next annual wellness check.
        </p>
      </div>
    </div>
  );
}
