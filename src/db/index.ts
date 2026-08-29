import { mockUsers, mockClinicSettings, mockThemes, mockPets, mockVisits, mockImmunizations, mockProcedures, mockHospitalizations, mockInventory, mockEquipment, mockClinicalServices, mockVouchers, mockCommunications } from "./mock-data";
import { User, Pet, ClinicSettings, ClinicTheme } from "./schema";

export interface NoviVetBackupSnapshot {
  version: string;
  developer: string;
  exportedAt: string;
  clinicSettings: ClinicSettings;
  users: User[];
  clinicalServices: any[];
  themes: ClinicTheme[];
  pets: Pet[];
  visits: any[];
  immunizations: any[];
  procedures: any[];
  hospitalizations: any[];
  inventory: any[];
  equipment: any[];
  vouchers: any[];
  communications: any[];
}

class ClinicalDataStore {
  private users: User[] = [...mockUsers];
  private clinicSettings: ClinicSettings = { ...mockClinicSettings };
  private themes: ClinicTheme[] = [...mockThemes];
  private pets: Pet[] = [...mockPets];
  private visits: any[] = [...mockVisits];
  private immunizations: any[] = [...mockImmunizations];
  private procedures: any[] = [...mockProcedures];
  private hospitalizations: any[] = [...mockHospitalizations];
  private inventory: any[] = [...mockInventory];
  private equipment: any[] = [...mockEquipment];
  private services: any[] = [...mockClinicalServices];
  private vouchers: any[] = [...mockVouchers];
  private communications: any[] = [...mockCommunications];

  // USERS
  async getUsers(role?: string): Promise<User[]> {
    if (role) return this.users.filter((u) => u.role === role);
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(data: Partial<User>): Promise<User> {
    const newUser: User = {
      id: data.id || `usr-${Date.now()}`,
      email: data.email || "",
      fullName: data.fullName || "",
      phoneNumber: data.phoneNumber || "",
      role: data.role || "FUR_PARENT",
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  async updateUserRole(id: string, newRole: any): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      user.role = newRole;
      user.updatedAt = new Date();
    }
    return user;
  }

  // CLINIC SETTINGS
  async getClinicSettings(): Promise<ClinicSettings> {
    return this.clinicSettings;
  }

  async updateClinicSettings(data: Partial<ClinicSettings>): Promise<ClinicSettings> {
    this.clinicSettings = {
      ...this.clinicSettings,
      ...data,
      updatedAt: new Date(),
    };
    return this.clinicSettings;
  }

  // THEMES
  async getThemes(): Promise<ClinicTheme[]> {
    return this.themes;
  }

  async activateTheme(themeId: string): Promise<ClinicTheme | undefined> {
    const target = this.themes.find((t) => t.id === themeId);
    if (!target) return undefined;
    this.themes = this.themes.map((t) => ({
      ...t,
      isDefault: t.id === themeId,
    }));
    this.clinicSettings.activeThemeId = themeId;
    return target;
  }

  // PETS
  async getPets(species?: string, search?: string): Promise<Pet[]> {
    let list = this.pets;
    if (species) list = list.filter((p) => p.species === species);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q));
    }
    return list;
  }

  async getPetById(id: string): Promise<Pet | undefined> {
    return this.pets.find((p) => p.id === id);
  }

  async createPet(data: Partial<Pet>): Promise<Pet> {
    const newPet: Pet = {
      id: data.id || `pet-${Date.now()}`,
      ownerId: data.ownerId || this.users[0]?.id,
      name: data.name || "Unnamed Pet",
      species: data.species || "CANINE",
      breed: data.breed || "Mixed",
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
      gender: data.gender || "INTACT_MALE",
      microchipId: data.microchipId || null,
      photoUrl: data.photoUrl || null,
      weightKg: data.weightKg || "5.0",
      isDeceased: data.isDeceased || false,
      allergies: data.allergies || [],
      specialNotes: data.specialNotes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pets.unshift(newPet);
    return newPet;
  }

  async updatePet(id: string, data: Partial<Pet>): Promise<Pet | undefined> {
    const index = this.pets.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.pets[index] = {
      ...this.pets[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.pets[index];
  }

  async deletePet(id: string): Promise<boolean> {
    const index = this.pets.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.pets.splice(index, 1);
    return true;
  }

  // SERVICES
  async getServices(): Promise<any[]> {
    return this.services;
  }

  async getServiceById(id: string): Promise<any | undefined> {
    return this.services.find((s) => s.id === id);
  }

  // INVENTORY
  async getInventory(): Promise<any[]> {
    return this.inventory;
  }

  // EQUIPMENT
  async getEquipment(): Promise<any[]> {
    return this.equipment;
  }

  // VISITS
  async getVisits(): Promise<any[]> {
    return this.visits;
  }

  // VOUCHERS
  async getVouchers(): Promise<any[]> {
    return this.vouchers;
  }

  // BACKUP EXPORT & RESTORE
  async exportFullBackup(): Promise<NoviVetBackupSnapshot> {
    return {
      version: "1.0.0",
      developer: "Designed and product-directed by Jerome Gotangco. Developed with Google Antigravity / Gemini.",
      exportedAt: new Date().toISOString(),
      clinicSettings: this.clinicSettings,
      users: this.users,
      clinicalServices: this.services,
      themes: this.themes,
      pets: this.pets,
      visits: this.visits,
      immunizations: this.immunizations,
      procedures: this.procedures,
      hospitalizations: this.hospitalizations,
      inventory: this.inventory,
      equipment: this.equipment,
      vouchers: this.vouchers,
      communications: this.communications,
    };
  }

  async restoreFullBackup(data: Partial<NoviVetBackupSnapshot>): Promise<{ success: boolean; stats: any }> {
    if (data.clinicSettings) this.clinicSettings = { ...this.clinicSettings, ...data.clinicSettings };
    if (data.users && Array.isArray(data.users)) this.users = data.users;
    if (data.clinicalServices && Array.isArray(data.clinicalServices)) this.services = data.clinicalServices;
    if (data.themes && Array.isArray(data.themes)) this.themes = data.themes;
    if (data.pets && Array.isArray(data.pets)) this.pets = data.pets;
    if (data.visits && Array.isArray(data.visits)) this.visits = data.visits;
    if (data.immunizations && Array.isArray(data.immunizations)) this.immunizations = data.immunizations;
    if (data.procedures && Array.isArray(data.procedures)) this.procedures = data.procedures;
    if (data.hospitalizations && Array.isArray(data.hospitalizations)) this.hospitalizations = data.hospitalizations;
    if (data.inventory && Array.isArray(data.inventory)) this.inventory = data.inventory;
    if (data.equipment && Array.isArray(data.equipment)) this.equipment = data.equipment;
    if (data.vouchers && Array.isArray(data.vouchers)) this.vouchers = data.vouchers;
    return {
      success: true,
      stats: {
        users: this.users.length,
        pets: this.pets.length,
        services: this.services.length,
      },
    };
  }

  async purgeMockData(): Promise<{ purgedCount: number; remainingUsers: number }> {
    const totalBefore = this.pets.length + this.visits.length + this.vouchers.length;
    this.pets = [];
    this.visits = [];
    this.immunizations = [];
    this.procedures = [];
    this.hospitalizations = [];
    this.vouchers = [];
    return {
      purgedCount: totalBefore,
      remainingUsers: this.users.length,
    };
  }
}

export const store = new ClinicalDataStore();
