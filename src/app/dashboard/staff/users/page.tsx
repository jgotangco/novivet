"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, Shield, Stethoscope, HeartPulse, Building, Heart, Edit, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StaffUsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newRole, setNewRole] = useState("FUR_PARENT");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Hospital User & Role Tagging</h1>
        <p className="text-xs text-slate-500">Tag registered Gmail/password accounts as Clinicians, Nurses, Operations, or Pet Parents.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                  u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800" :
                  u.role === "DOCTOR" ? "bg-emerald-100 text-emerald-800" :
                  u.role === "NURSE" ? "bg-teal-100 text-teal-800" :
                  u.role === "STAFF" ? "bg-amber-100 text-amber-800" :
                  "bg-indigo-100 text-indigo-800"
                }`}>
                  {u.role}
                </span>
                <span className="text-[10px] text-slate-400">{formatDate(u.createdAt)}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{u.fullName}</h3>
              <p className="text-xs text-slate-500 font-mono truncate">{u.email}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Phone: {u.phoneNumber || "None"}</span>
              <button
                onClick={() => {
                  setSelectedUser(u);
                  setNewRole(u.role);
                }}
                className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
              >
                Change Role
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900">Change Role: {selectedUser.fullName}</h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value="FUR_PARENT">FUR_PARENT (Default)</option>
              <option value="DOCTOR">DOCTOR (Clinician)</option>
              <option value="NURSE">NURSE (Inpatient Triage)</option>
              <option value="STAFF">STAFF (Front Desk / Inventory)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (System Master)</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-1/2 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRole(selectedUser.id)}
                disabled={submitting}
                className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow"
              >
                {submitting ? "Saving..." : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
