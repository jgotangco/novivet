import { pgTable, text, timestamp, varchar, boolean, numeric, uuid, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF", "FUR_PARENT", "BILLING"]);
export const petSpeciesEnum = pgEnum("pet_species", ["CANINE", "FELINE"]);
export const petGenderEnum = pgEnum("pet_gender", ["INTACT_MALE", "NEUTERED_MALE", "INTACT_FEMALE", "SPAYED_FEMALE"]);
export const visitTypeEnum = pgEnum("visit_type", ["ROUTINE_CHECKUP", "EMERGENCY", "VACCINATION", "FOLLOW_UP", "SURGERY", "DENTAL"]);
export const supplyTargetEnum = pgEnum("supply_target", ["CANINE_ONLY", "FELINE_ONLY", "UNIVERSAL"]);
export const equipmentStatusEnum = pgEnum("equipment_status", ["OPERATIONAL", "MAINTENANCE_REQUIRED", "OUT_OF_SERVICE"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }),
  role: userRoleEnum("role").notNull().default("FUR_PARENT"),
  metadata: jsonb("metadata").$type<{
    specialty?: string;
    licenseNumber?: string;
    stationPin?: string;
    preferredLanguage?: string;
    emergencyContact?: string;
  }>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clinicSettings = pgTable("clinic_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  clinicName: varchar("clinic_name", { length: 255 }).notNull().default("NoviVet Animal Hospital"),
  tagline: varchar("tagline", { length: 255 }).default("Cloud Veterinary Clinical Engine"),
  contactPhone: varchar("contact_phone", { length: 50 }).default("+63 2 8123 4567"),
  emergencyHotline: varchar("emergency_hotline", { length: 50 }).default("+63 917 999 8888"),
  address: text("address").default("123 Mabini St., Bonifacio Global City, Taguig, Philippines"),
  licenseNumber: varchar("license_number", { length: 100 }).default("PRC-VET-HOSP-0091"),
  baseCurrency: varchar("base_currency", { length: 10 }).notNull().default("PHP"),
  taxRatePercent: numeric("tax_rate_percent", { precision: 5, scale: 2 }).default("12.00"),
  activeThemeId: varchar("active_theme_id", { length: 50 }).default("theme-emerald"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pets = pgTable("pets", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  species: petSpeciesEnum("species").notNull(),
  breed: varchar("breed", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: petGenderEnum("gender").notNull(),
  microchipId: varchar("microchip_id", { length: 50 }).unique(),
  photoUrl: text("photo_url"),
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
  isDeceased: boolean("is_deceased").default(false).notNull(),
  allergies: jsonb("allergies").$type<string[]>().default([]),
  specialNotes: text("special_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;
export type ClinicSettings = typeof clinicSettings.$inferSelect;
export type NewClinicSettings = typeof clinicSettings.$inferInsert;

export interface ClinicTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDark?: boolean;
  isDefault?: boolean;
  createdAt: Date;
}
