import { getCurrentSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import {
  Stethoscope,
  Activity,
  Users,
  HeartPulse,
  Syringe,
  Bed,
  Building,
  Boxes,
  Wrench,
  Sparkles,
  Ticket,
  Heart,
  Calendar,
  Award,
  ChevronRight,
  BadgeDollarSign,
  UserCheck,
} from "lucide-react";

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/parent/login");
  }

  const role = session.role;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentRole={role}
        userEmail={session.email}
        userName={session.fullName}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                  role === "SUPER_ADMIN"
                    ? "bg-purple-600 shadow-purple-600/20"
                    : role === "DOCTOR"
                    ? "bg-emerald-600 shadow-emerald-600/20"
                    : role === "NURSE"
                    ? "bg-teal-600 shadow-teal-600/20"
                    : role === "STAFF"
                    ? "bg-amber-600 shadow-amber-600/20"
                    : "bg-indigo-600 shadow-indigo-600/20"
                }`}
              >
                {role === "SUPER_ADMIN"
                  ? "SA"
                  : role === "DOCTOR"
                  ? "Dr"
                  : role === "NURSE"
                  ? "RN"
                  : role === "STAFF"
                  ? "ST"
                  : "FP"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {session.fullName}
                </p>
                <span className="text-[10px] font-mono uppercase bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <nav className="space-y-1 text-xs font-semibold">
              {role === "SUPER_ADMIN" && (
                <>
                  <Link
                    href="/dashboard/super-admin"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-purple-700 bg-purple-50 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Admin Console</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/staff/services"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <BadgeDollarSign className="w-4 h-4 text-amber-600" />
                      <span>Fee Catalog (₱)</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/staff/users"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>User Role Tagger</span>
                    </div>
                  </Link>
                </>
              )}

              {role === "DOCTOR" && (
                <>
                  <Link
                    href="/dashboard/doctor"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-emerald-700 bg-emerald-50 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span>SOAP Consultation</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/doctor/patients"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>Patient Records</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/doctor/surgeries"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-slate-400" />
                      <span>Surgery Protocols</span>
                    </div>
                  </Link>
                </>
              )}

              {role === "NURSE" && (
                <>
                  <Link
                    href="/dashboard/nurse"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-teal-700 bg-teal-50 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <HeartPulse className="w-4 h-4 text-teal-600" />
                      <span>Nurse Station</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/nurse/inpatient"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span>ICU Ward Inpatient</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/nurse/shots"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Syringe className="w-4 h-4 text-slate-400" />
                      <span>Vaccine Records</span>
                    </div>
                  </Link>
                </>
              )}

              {role === "STAFF" && (
                <>
                  <Link
                    href="/dashboard/staff"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-amber-700 bg-amber-50 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-amber-600" />
                      <span>Front Desk Ops</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/staff/pets"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>Patient Directory</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/staff/services"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <BadgeDollarSign className="w-4 h-4 text-slate-400" />
                      <span>Fee Catalog (₱)</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/staff/inventory"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes className="w-4 h-4 text-slate-400" />
                      <span>Pharmacy Inventory</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/staff/equipment"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-slate-400" />
                      <span>Equipment Assets</span>
                    </div>
                  </Link>
                </>
              )}

              {role === "FUR_PARENT" && (
                <>
                  <Link
                    href="/dashboard/parent"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-indigo-700 bg-indigo-50 font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-indigo-600" />
                      <span>Pet Health Passport</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/dashboard/parent/my-pets"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>My Pets</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/parent/appointments"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Appointments</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/parent/vouchers"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ticket className="w-4 h-4 text-slate-400" />
                      <span>Promos & Vouchers</span>
                    </div>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
