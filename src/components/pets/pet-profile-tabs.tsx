"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, FileText, Syringe, Activity, Bed, Dog, Cat, Calendar, Clock, AlertCircle, Plus, ShieldCheck, Droplets, CheckCircle2, X, Phone, User, Heart, Thermometer, Edit, Trash2 } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

interface PetProfileTabsProps {
  pet: any;
  userRole?: string;
  defaultTab?: "soap" | "vaccines" | "surgeries" | "inpatient";
}

export function PetProfileTabs({ pet, userRole = "STAFF", defaultTab = "soap" }: PetProfileTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"soap" | "vaccines" | "surgeries" | "inpatient">(defaultTab);

  const [showSoapModal, setShowSoapModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [soapForm, setSoapForm] = useState({
    type: "ROUTINE_CHECKUP",
    chiefComplaint: "",
    temp_c: "38.5",
    heart_rate_bpm: pet.species === "FELINE" ? "170" : "90",
    respiratory_rate: pet.species === "FELINE" ? "28" : "20",
    weight_kg: pet.weightKg || "4.0",
    crt_sec: "1.5",
    mucous_membrane: "pink",
    soapSubjective: "",
    soapObjective: "",
    soapAssessment: "",
    soapPlan: "",
  });

  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: pet.species === "FELINE" ? "FVRCP 3-Year Booster (PureVax)" : "DHPP Core Canine (Nobivac)",
    batchLotNumber: `LOT-${Math.floor(1000 + Math.random() * 9000)}-${pet.species === "FELINE" ? "F" : "C"}`,
    administeredDate: new Date().toISOString().split("T")[0],
    nextDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Administered right front SQ. Well tolerated, no adverse reaction noted.",
  });

  const [surgeryForm, setSurgeryForm] = useState({
    procedureName: "",
    anesthesiaProtocol: "Pre-med: Butorphanol 0.2mg/kg + Midazolam 0.2mg/kg IV. Induction: Propofol 4mg/kg IV. Maintenance: Isoflurane in 100% O2.",
    surgicalFindings: "",
    postOpInstructions: "1. Strict cage rest x 10 days.\n2. E-collar worn at all times.\n3. Analgesia PO BID x 5 days.",
  });

  const [wardForm, setWardForm] = useState({
    temp_c: "38.4",
    heartRate: pet.species === "FELINE" ? "165" : "95",
    respiratoryRate: "24",
    fluidRateMlHr: "25.0",
    urination: true,
    defecation: false,
    appetite: "FAIR",
    demeanor: "BAR",
    notes: "Patient resting comfortably in cage. IV line patent.",
  });

  const handleCreateSoap = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pet.id,
          type: soapForm.type,
          chiefComplaint: soapForm.chiefComplaint,
          vitalSigns: {
            temp_c: parseFloat(soapForm.temp_c) || null,
            heart_rate_bpm: parseInt(soapForm.heart_rate_bpm) || null,
            respiratory_rate: parseInt(soapForm.respiratory_rate) || null,
            weight_kg: parseFloat(soapForm.weight_kg) || null,
            crt_sec: parseFloat(soapForm.crt_sec) || null,
            mucous_membrane: soapForm.mucous_membrane,
          },
          soapSubjective: soapForm.soapSubjective,
          soapObjective: soapForm.soapObjective,
          soapAssessment: soapForm.soapAssessment,
          soapPlan: soapForm.soapPlan,
        }),
      });
      if (res.ok) {
        setShowSoapModal(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/immunizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pet.id,
          vaccineName: vaccineForm.vaccineName,
          batchLotNumber: vaccineForm.batchLotNumber,
          administeredDate: vaccineForm.administeredDate,
          nextDueDate: vaccineForm.nextDueDate,
          notes: vaccineForm.notes,
        }),
      });
      if (res.ok) {
        setShowVaccineModal(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSurgery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/procedures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pet.id,
          procedureName: surgeryForm.procedureName,
          anesthesiaProtocol: surgeryForm.anesthesiaProtocol,
          surgicalFindings: surgeryForm.surgicalFindings,
          postOpInstructions: surgeryForm.postOpInstructions,
        }),
      });
      if (res.ok) {
        setShowSurgeryModal(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const activeHospitalization = pet.hospitalizations?.find((h: any) => h.status === "ADMITTED");

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={pet.photoUrl || (pet.species === "FELINE" ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" : "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400")}
            alt={pet.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{pet.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                {pet.species} • {pet.breed}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Microchip: <span className="font-mono font-bold text-slate-700">{pet.microchipId || "Unchipped"}</span> • Weight: <span className="font-bold text-slate-700">{pet.weightKg || "5.0"} kg</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("soap")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "soap" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            SOAP Notes
          </button>
          <button
            onClick={() => setActiveTab("vaccines")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "vaccines" ? "bg-teal-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Vaccinations
          </button>
          <button
            onClick={() => setActiveTab("surgeries")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "surgeries" ? "bg-cyan-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Surgeries
          </button>
          <button
            onClick={() => setActiveTab("inpatient")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "inpatient" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            ICU Inpatient
          </button>
        </div>
      </div>

      {activeTab === "soap" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">SOAP Clinical Consultations</h2>
            {(userRole === "DOCTOR" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={() => setShowSoapModal(true)}
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New SOAP Encounter</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {pet.visits && pet.visits.length > 0 ? (
              pet.visits.map((v: any) => (
                <div key={v.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-900">{v.visitType}</span>
                    <span className="text-slate-400 font-mono">{formatDate(v.visitDate)}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Subjective:</strong> {v.soapSubjective || "N/A"}</div>
                    <div><strong>Objective:</strong> {v.soapObjective || "N/A"}</div>
                    <div><strong>Assessment:</strong> {v.soapAssessment || "N/A"}</div>
                    <div><strong>Plan:</strong> {v.soapPlan || "N/A"}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No recorded SOAP encounters.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "vaccines" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Vaccine & Shot Records</h2>
            {(userRole === "NURSE" || userRole === "DOCTOR" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={() => setShowVaccineModal(true)}
                className="py-2 px-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Administer Vaccine</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">PureVax feline vaccines, Vanguard canine DHPP, and Rabies annual boosters.</p>
        </div>
      )}

      {activeTab === "surgeries" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Surgical Procedures & Anesthesia</h2>
            {(userRole === "DOCTOR" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={() => setShowSurgeryModal(true)}
                className="py-2 px-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Surgery</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">Isoflurane vaporization, Propofol induction, and postoperative care notes.</p>
        </div>
      )}

      {activeTab === "inpatient" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">ICU Inpatient Ward Telemetry</h2>
            {(userRole === "NURSE" || userRole === "DOCTOR" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={() => setShowWardModal(true)}
                className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ward Telemetry</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">Continuous infusion telemetry, fluid rate mL/hr, and bedside vitals rounds.</p>
        </div>
      )}
    </div>
  );
}
