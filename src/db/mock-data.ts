import { ClinicTheme, ClinicSettings, User, Pet } from "./schema";

export const mockClinicSettings: ClinicSettings = {
  id: "default",
  clinicName: "NoviVet Animal Hospital",
  tagline: "Cloud Veterinary Clinical Engine",
  contactPhone: "+63 2 8123 4567",
  emergencyHotline: "+63 917 999 8888",
  address: "123 Mabini St., Bonifacio Global City, Taguig, Philippines",
  licenseNumber: "PRC-VET-HOSP-0091",
  baseCurrency: "PHP",
  taxRatePercent: "12.00",
  activeThemeId: "theme-emerald",
  updatedAt: new Date(),
};

export const mockThemes: ClinicTheme[] = [
  {
    id: "theme-emerald",
    name: "Clinical Emerald",
    primaryColor: "#059669",
    secondaryColor: "#0d9488",
    accentColor: "#10b981",
    isDark: false,
    isDefault: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "theme-ocean",
    name: "Ocean Cyan",
    primaryColor: "#0284c7",
    secondaryColor: "#0891b2",
    accentColor: "#38bdf8",
    isDark: false,
    isDefault: false,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "theme-indigo",
    name: "Royal Indigo",
    primaryColor: "#4f46e5",
    secondaryColor: "#4338ca",
    accentColor: "#818cf8",
    isDark: false,
    isDefault: false,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "theme-amber",
    name: "Warm Amber",
    primaryColor: "#d97706",
    secondaryColor: "#b45309",
    accentColor: "#f59e0b",
    isDark: false,
    isDefault: false,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "theme-nordic",
    name: "Nordic Slate",
    primaryColor: "#475569",
    secondaryColor: "#334155",
    accentColor: "#64748b",
    isDark: false,
    isDefault: false,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "theme-midnight",
    name: "Midnight Dark",
    primaryColor: "#6366f1",
    secondaryColor: "#4338ca",
    accentColor: "#10b981",
    isDark: true,
    isDefault: false,
    createdAt: new Date("2026-01-01"),
  },
];

export const mockUsers: User[] = [
  {
    id: "usr-admin-001",
    email: "admin@novivet.com",
    fullName: "System Administrator",
    phoneNumber: "+63 917 111 0000",
    role: "SUPER_ADMIN",
    metadata: { licenseNumber: "PRC-ADMIN-0001", stationPin: "9999" },
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "usr-doc-001",
    email: "sarah.chen@novivet.com",
    fullName: "Dr. Sarah Chen, DVM",
    phoneNumber: "+63 917 222 3333",
    role: "DOCTOR",
    metadata: { specialty: "Small Animal Surgery & Canine Internal Medicine", licenseNumber: "PRC-VET-09871", stationPin: "1234" },
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "usr-nurse-001",
    email: "elena.gomez@novivet.com",
    fullName: "Elena Gomez, RVT",
    phoneNumber: "+63 917 444 5555",
    role: "NURSE",
    metadata: { stationPin: "5678" },
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "usr-staff-001",
    email: "marcus.vance@novivet.com",
    fullName: "Marcus Vance",
    phoneNumber: "+63 917 666 7777",
    role: "STAFF",
    metadata: { stationPin: "0000" },
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "usr-parent-001",
    email: "emily.watson@gmail.com",
    fullName: "Emily Watson",
    phoneNumber: "+63 917 888 9999",
    role: "FUR_PARENT",
    metadata: {},
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const mockPets: Pet[] = [
  {
    id: "pet-canine-001",
    ownerId: "usr-parent-001",
    name: "Barnaby",
    species: "CANINE",
    breed: "Golden Retriever",
    dateOfBirth: new Date("2021-04-15"),
    gender: "NEUTERED_MALE",
    microchipId: "985141002348912",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
    weightKg: "31.50",
    isDeceased: false,
    allergies: ["Chicken byproduct", "Beef protein"],
    specialNotes: "Prone to otitis externa during humid seasons. Keep ears dry.",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "pet-feline-001",
    ownerId: "usr-parent-001",
    name: "Mochi",
    species: "FELINE",
    breed: "Scottish Fold",
    dateOfBirth: new Date("2023-01-20"),
    gender: "SPAYED_FEMALE",
    microchipId: "985141009988221",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    weightKg: "4.20",
    isDeceased: false,
    allergies: [],
    specialNotes: "Stress induced FLUTD risk. Use Feliway during visits.",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
];

export const mockVisits: any[] = [
  {
    id: "vis-001",
    petId: "pet-canine-001",
    veterinarianId: "usr-doc-001",
    visitType: "ROUTINE_CHECKUP",
    visitDate: new Date("2026-02-15T09:30:00Z"),
    soapSubjective: "Owner reports mild bilateral ear scratching over past 4 days. Diet unchanged.",
    soapObjective: "T: 38.6°C, HR: 88 bpm, RR: 22 bpm. Weight: 31.5kg. Erythema in right vertical canal with dark cerumen.",
    soapAssessment: "Unilateral Otitis Externa (Malassezia suspected).",
    soapPlan: "Cytology performed. Prescribed Posatex Otic suspension 1ml SID x 7 days. Ear flush with Epi-Otic.",
    status: "COMPLETED",
  },
];

export const mockClinicalServices: any[] = [
  { id: "srv-001", code: "CONS-01", name: "General Veterinary Consultation", basePricePhp: 650, targetSpecies: "ALL", category: "Consultation" },
  { id: "srv-002", code: "CONS-EMERG", name: "Emergency & Critical Triage", basePricePhp: 1500, targetSpecies: "ALL", category: "Emergency" },
  { id: "srv-003", code: "VAC-RABIES", name: "Rabies Annual Vaccination (Defensor/Rabisin)", basePricePhp: 450, targetSpecies: "ALL", category: "Vaccination" },
  { id: "srv-004", code: "VAC-DHPP", name: "Canine 6-in-1 Vanguard Plus Core Vaccine", basePricePhp: 750, targetSpecies: "CANINE", category: "Vaccination" },
  { id: "srv-005", code: "VAC-FVRCP", name: "PureVax Feline 4-Way Non-Adjuvanted Vaccine", basePricePhp: 850, targetSpecies: "FELINE", category: "Vaccination" },
  { id: "srv-006", code: "SURG-SPAY-K9", name: "Canine Ovariohysterectomy (Spay < 15kg)", basePricePhp: 4500, targetSpecies: "CANINE", category: "Surgery" },
  { id: "srv-007", code: "SURG-SPAY-FEL", name: "Feline Flank/Midline Spay", basePricePhp: 3200, targetSpecies: "FELINE", category: "Surgery" },
];

export const mockImmunizations: any[] = [];
export const mockProcedures: any[] = [];
export const mockHospitalizations: any[] = [];
export const mockInventory: any[] = [];
export const mockEquipment: any[] = [];
export const mockVouchers: any[] = [];
export const mockCommunications: any[] = [];
