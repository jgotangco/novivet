# 🐾 NoviVet — Cloud-Native Veterinary Clinical Operating System

[![Next.js](https://img.shields.io/badge/Next.js-14.2.11-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16.0-336791?logo=postgresql)](https://www.postgresql.org/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=google-cloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Architected & Developed by [Jerome Gotangco](https://github.com/jgotangco)**  
> An enterprise veterinary clinical management platform tailored for small animal hospitals (canine & feline), designed for deployment on Google Cloud Run and Google Cloud SQL.

---

## 🌟 Key Features & Persona Workspaces

### 1. 👨‍⚕️ Doctor & Clinician Workspace (`/dashboard/doctor`)
- **Electronic SOAP Consultations**: Subjective history, Objective physical exam, Assessment/Differential diagnosis, and Plan.
- **Canine & Feline Specifics**: Automatic weight-based BSA dosage calculator, AAHA/WSAVA pain scoring scale, Body Condition Score (BCS 1-9), and species vital range alerts.
- **Surgical Theater**: Pre-op checklists, anesthesia logs (Isoflurane/Propofol/Ketamine), ASA classification, and recovery telemetry.

### 2. 🩺 Nurse & Inpatient Ward (`/dashboard/nurse`)
- **Touchscreen Fast PIN Login**: Station PIN access optimized for wet clinical environments and tablet mounts.
- **Bedside ICU Fluid Telemetry**: IV infusion rate monitoring (mL/hr) with species fluid overload alarms.
- **PureVax & Core Vaccine Records**: Rabies, DHPP, FVRCP, FeLV immunizations with lot numbers and expiration reminders.

### 3. 🏢 Clinic Staff & Operations (`/dashboard/staff`)
- **Patient Directory & Universal Pet CRUD**: Complete pet profiles with species photo uploads, microchip IDs, and breed registries.
- **Pharmacy & Inventory Management**: Expiration tracking, low-stock reorder thresholds, and controlled substance logging.
- **Philippine Peso Fee Catalog (₱ PHP)**: Dynamic multi-currency service catalog with base tariff configuration and VAT management.
- **User Role Manager**: Admin assignment and role promotion for staff, nurses, clinicians, and fur parents.

### 4. 🐾 Fur Parent Portal (`/dashboard/parent`)
- **Verified Digital Pet Health Passports**: Printable passports with rabies vaccination tags and microchip verification.
- **Medical & Surgery History**: Full chronological consultation history and prescribed home medications.
- **Promos & Vouchers**: Digital promotional discount redemption with automatic billing deduction.

### 5. 🏥 System Administration & Clinic Console (`/dashboard/super-admin`)
- **6 Curated Clinical Themes**: Instant 1-click theme switching (*Clinical Emerald*, *Ocean Cyan*, *Royal Indigo*, *Warm Amber*, *Nordic Slate*, *Midnight Dark*).
- **Hospital Vital Metadata**: Hospital legal name, 24/7 emergency triage hotline, address, and PRC veterinary license number.
- **Full Database Snapshot Backup & Restore**: 1-click JSON database snapshot export and disaster recovery restore.
- **Sandbox Mock Data Purge**: 1-click test patient and visit wiping to prepare instances for production go-live.
- **Live Environment Health Diagnostics**: Automatic detection of Google Cloud Run `K_SERVICE`, Docker container, and PostgreSQL connection.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/jgotangco/novivet.git
cd novivet

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker & Production Deployment

NoviVet is packaged as a standalone multi-stage Docker container listening on port `8080`.

### Run via Docker
```bash
# Build Docker image
docker build -t novivet:latest .

# Run container on port 8080
docker run -p 8080:8080 novivet:latest
```

### Deploy to Google Cloud Run
```bash
# Set Google Cloud Project
gcloud config set project [YOUR_PROJECT_ID]

# Build and submit container via Cloud Build
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/novivet

# Deploy to Cloud Run
gcloud run deploy novivet \
  --image gcr.io/[YOUR_PROJECT_ID]/novivet \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: PostgreSQL 16 (Google Cloud SQL compatible) with [Drizzle ORM](https://orm.drizzle.team/) & In-Memory Dual Store
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Authentication**: JWT Sessions (`jose`), Google OAuth integration, and Touchscreen PIN access

---

## 👤 Author

**Jerome Gotangco**  
- GitHub: [@jgotangco](https://github.com/jgotangco)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
