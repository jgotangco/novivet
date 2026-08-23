import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building, Users, Package, Wrench, Ticket, Plus, Tag, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StaffDashboardPage() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "STAFF" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth/staff/login");
  }

  const pets = await store.getPets();
  const users = await store.getUsers();
  const inventory = await store.getInventory();
  const equipment = await store.getEquipment();
  const vouchers = await store.getVouchers();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-amber-500/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Hospital Operations & Front Desk</h1>
            <p className="text-xs text-slate-500">Welcome, {session.fullName} • Operations Console</p>
          </div>
        </div>

        <Link
          href="/dashboard/staff/pets/new"
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Intake</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/staff/pets" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Registered Patients</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{pets.length}</p>
          <span className="text-[11px] text-amber-700 font-bold">Manage Directory →</span>
        </Link>

        <Link href="/dashboard/staff/services" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Service Tariffs</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">₱ Multi-Currency</p>
          <span className="text-[11px] text-amber-700 font-bold">Configure Pricing →</span>
        </Link>

        <Link href="/dashboard/staff/users" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Staff & Parent Roles</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{users.length}</p>
          <span className="text-[11px] text-amber-700 font-bold">Tag User Roles →</span>
        </Link>

        <Link href="/dashboard/staff/equipment" className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Clinical Assets</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{equipment.length}</p>
          <span className="text-[11px] text-amber-700 font-bold">Maintenance Ledger →</span>
        </Link>
      </div>
    </div>
  );
}
