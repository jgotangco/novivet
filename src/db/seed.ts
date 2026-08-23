import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { mockUsers, mockPets, mockVisits, mockClinicalServices } from "./mock-data";

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/novivet";
  console.log("🌱 Starting NoviVet database seed to:", connectionString);

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log(`Inserting ${mockUsers.length} users...`);
    for (const u of mockUsers) {
      await db.insert(schema.users).values(u).onConflictDoNothing();
    }

    console.log(`Inserting ${mockPets.length} pets...`);
    for (const p of mockPets) {
      await db.insert(schema.pets).values(p).onConflictDoNothing();
    }

    console.log("✅ NoviVet Database Seed Completed Successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
