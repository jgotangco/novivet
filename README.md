# 🐾 NoviVet — Veterinary Clinical Operating System (Concept / UI Demo)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.11-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16.0-336791?logo=postgresql)](https://www.postgresql.org/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=google-cloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Designed and product-directed by [Jerome Gotangco](https://github.com/jgotangco). Developed with Google Antigravity / Gemini.**  
> A concept and UI demonstration of an enterprise veterinary clinical management platform tailored for small animal clinics (canine & feline).

> [!WARNING]
> **CONCEPT & DEMONSTRATION PROTOTYPE ONLY**  
> NoviVet is an exploratory software concept and UI demo featuring persona shells. It is **NOT intended for real clinical patients**, actual medical decisions, live prescription issuance, or production healthcare operations. All clinical fixtures use mock identities (`@novivet.local` email addresses, `MOCK-` prefixed microchips). Data is held in-memory (`DATABASE_URL` currently does not persist; store is still memory).

---

## 🌟 Persona Shells & Clinical Workspaces

The application includes interactive UI persona shells demonstrating workflows across veterinary clinic roles:

### 1. 👨‍⚕️ Doctor & Clinician Workspace (`/dashboard/doctor`)
- **Electronic SOAP Consultations**: Subjective history, Objective physical exam, Assessment/Differential diagnosis, and Plan.
- **Canine & Feline Specifics**: Weight-based dosage calculations, AAHA/WSAVA pain scoring scale, Body Condition Score (BCS 1-9), and species vital range alerts.
- **Surgical Theater**: Pre-op checklists, anesthesia protocols, ASA classification, and recovery telemetry mockups.

### 2. 🩺 Nurse & Inpatient Ward (`/dashboard/nurse`)
- **Touchscreen Fast PIN Login**: Station PIN authentication with 6-digit PIN and lockout protection.
- **Bedside ICU Fluid Telemetry**: IV infusion rate monitoring (mL/hr) with fluid overload alarms.
- **Core Vaccine Records**: Rabies, DHPP, FVRCP, FeLV immunization logs with lot numbers and expiration reminders.

### 3. 🏢 Clinic Staff & Operations (`/dashboard/staff`)
- **Patient Directory & Universal Pet CRUD**: Complete pet profiles with species photo placeholders, microchip IDs, and breed registries.
- **Pharmacy & Inventory Management**: Expiration tracking, low-stock reorder thresholds, and controlled substance logging.
- **Philippine Peso Fee Catalog (₱ PHP)**: Service catalog with base tariff configuration and VAT management.
- **User Role Manager**: Role viewing and management for staff, nurses, clinicians, and fur parents.

### 4. 🐾 Fur Parent Portal (`/dashboard/parent`)
- **Verified Digital Pet Health Passports**: Printable passports with rabies vaccination tags and microchip verification.
- **Medical & Surgery History**: Chronological consultation records and prescribed home medications.
- **Promos & Vouchers**: Promotional discount vouchers with automatic billing deduction.

### 5. 🏥 System Administration & Clinic Console (`/dashboard/super-admin`)
- **6 Curated Clinical Themes**: Instant 1-click theme switching (*Clinical Emerald*, *Ocean Cyan*, *Royal Indigo*, *Warm Amber*, *Nordic Slate*, *Midnight Dark*).
- **Hospital Vital Metadata**: Hospital legal name, 24/7 emergency triage hotline, address, and PRC veterinary license number.
- **Full Database Snapshot Backup & Restore**: JSON database snapshot export and disaster recovery restore with schema validation.
- **Sandbox Mock Data Purge**: 1-click test patient and visit wiping with confirmation safety headers.
- **Live Environment Health Diagnostics**: Diagnostics checking deployment environment without exposing credentials.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/jgotangco/novivet.git
cd novivet

# Install dependencies (creates package-lock.json)
npm install

# Run development server (runs with in-memory store by default)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> **Local Development & Demo Credentials**:
> - **Demo Password**: `DemoPass2026!`
> - **Station PIN**: `123456`
> - **Mock Accounts**: All fixture accounts use `@novivet.local` emails (e.g., `doctor@novivet.local`, `nurse@novivet.local`, `staff@novivet.local`, `admin@novivet.local`, `parent@novivet.local`) and `MOCK-` microchip identifiers.
> - **Data Persistence**: Note that `DATABASE_URL` currently does not persist; the application store is still in-memory.

---

## 🐳 Docker & Container Deployment

NoviVet is packaged as a standalone multi-stage Docker container listening on port `8080`.

### Run via Docker
```bash
# Build Docker image
docker build -t novivet:latest .

# Run container on port 8080 (supply required JWT_SECRET)
docker run -p 8080:8080 -e JWT_SECRET="your-32-char-min-secret-key-here" novivet:latest
```

### Deploy to Google Cloud Run
```bash
# Set Google Cloud Project
gcloud config set project [YOUR_PROJECT_ID]

# Build and submit container via Cloud Build
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/novivet

# Deploy to Cloud Run (authenticated service)
gcloud run deploy novivet \
  --image gcr.io/[YOUR_PROJECT_ID]/novivet \
  --platform managed \
  --region asia-southeast1 \
  --port 8080 \
  --set-env-vars JWT_SECRET="your-32-char-min-secret-key-here",DATABASE_URL="postgresql://user:pass@host:5432/novivet"
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Authentication**: JWT Cookie Sessions ([`jose`](https://github.com/panva/jose)), Node scrypt password/PIN hashing, and Google ID token verification
- **Database & Storage**: In-memory data store (`DATABASE_URL` currently does not persist; unused Drizzle schema)
- **Testing**: [Vitest](https://vitest.dev/) automated test suite

---

## 👤 Credits & Attribution

Designed and product-directed by **[Jerome Gotangco](https://github.com/jgotangco)** ([@jgotangco](https://github.com/jgotangco)).  
Developed with **Google Antigravity / Gemini**.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
