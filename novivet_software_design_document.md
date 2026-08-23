# Software Design Document (SDD): NoviVet (Cat & Dog Clinical Management System)

**Project Name:** NoviVet  
**Target Platform:** Google Cloud Run (Containerized Microservices / Full-Stack Next.js + FastAPI)  
**Database:** Google Cloud SQL (PostgreSQL 16) + Cloud Storage for Medical Assets  
**Document Version:** 1.0.0  
**Date:** August 2026  
**Intended Use:** Autonomous coding prompt specification for Antigravity, Git version control, and automated GCP CI/CD deployment.

---

## 1. System Architecture & Cloud Run Specification

NoviVet is engineered as a cloud-native veterinary practice management platform optimized for canine and feline clinical care, pet lifecycle medical records, clinic inventory, equipment maintenance, and automated client re-engagement.

```
                    +-----------------------------+
                    | Cloudflare / Cloud Armor   |
                    | (SSL, WAF, DDoS Protection) |
                    +--------------+--------------+
                                   |
                                   v
             +---------------------+---------------------+
             |         Google Cloud Load Balancer        |
             +---------------------+---------------------+
                                   |
                                   v
             +---------------------+---------------------+
             |         Google Cloud Run Service          |
             |       (Next.js App + FastAPI/Node)        |
             +---+-----------------+-----------------+---+
                 |                 |                 |
                 v                 v                 v
   +-------------+----+   +--------+-------+   +-----+-------------+
   | Cloud SQL        |   | Cloud Storage  |   | Cloud Tasks /     |
   | (PostgreSQL 16)  |   | (Lab / Scans)  |   | Cloud Scheduler   |
   +------------------+   +----------------+   +-------------------+
```

### 1.1 Infrastructure & GCP Stack
- **Compute**: Google Cloud Run (Fully managed serverless container runtime listening on port `8080`).
- **Database**: Cloud SQL for PostgreSQL 16 (connected via Unix socket using Cloud SQL Auth Proxy).
- **Blob Storage**: Google Cloud Storage (`gs://novivet-diagnostic-media`) for X-rays, ultrasound scans, and lab reports with time-limited Signed URLs.
- **Asynchronous Task Queue**: Google Cloud Tasks + Cloud Scheduler for daily follow-up scans and voucher dispatch.
- **Authentication**: Firebase Authentication / Google Cloud Identity with Custom Claims (`role: doctor | nurse | staff | fur_parent`).
- **Secrets Management**: Google Secret Manager (`DB_URL`, `FIREBASE_ADMIN_KEY`, `SENDGRID_API_KEY`, `TWILIO_AUTH_TOKEN`).

---

## 2. Authentication & Persona Workspaces

The system implements strict Role-Based Access Control (RBAC). Each persona accesses dedicated route layouts with customized telemetry and workflow tools.

### 2.1 Persona Specifications & RBAC Matrix

| Persona | Primary Login Route | Authentication Mechanism | Permissions & Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Doctor** | `/auth/doctor/login` | Email/Password + 2FA TOTP | SOAP clinical notes, prescription issuance, surgical records, hospitalization discharge orders, lab evaluations. |
| **Nurse** | `/auth/nurse/login` | Email/Password + 4-digit Station PIN | Vital signs triage, vaccine/shot administration, IV fluid monitoring, hospitalization ward rounds, lab sample collection. |
| **Staff / Admin** | `/auth/staff/login` | Email/Password | Appointment booking, front-desk triage intake, pet registration, inventory supply management, equipment maintenance logs, billing & voucher issuance. |
| **Fur Parent** | `/auth/parent/login` | Magic Link / Google OAuth / SMS OTP | View pet digital health card, vaccine certifications, upcoming appointments, view visit histories, redeem promotional discount vouchers. |

---

## 3. Data Models & Database Schema (PostgreSQL DDL)

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('DOCTOR', 'NURSE', 'STAFF', 'FUR_PARENT');
CREATE TYPE pet_species AS ENUM ('CANINE', 'FELINE');
CREATE TYPE pet_gender AS ENUM ('INTACT_MALE', 'NEUTERED_MALE', 'INTACT_FEMALE', 'SPAYED_FEMALE');
CREATE TYPE visit_type AS ENUM ('ROUTINE_CHECKUP', 'EMERGENCY', 'VACCINATION', 'FOLLOW_UP', 'SURGERY', 'DENTAL');
CREATE TYPE supply_target AS ENUM ('CANINE_ONLY', 'FELINE_ONLY', 'UNIVERSAL');
CREATE TYPE equipment_status AS ENUM ('OPERATIONAL', 'MAINTENANCE_REQUIRED', 'OUT_OF_SERVICE');

-- Users / Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role user_role NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pets Table (Canine / Feline)
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    species pet_species NOT NULL,
    breed VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    estimated_age_months INT,
    gender pet_gender NOT NULL,
    color_markings VARCHAR(255),
    microchip_number VARCHAR(100) UNIQUE,
    weight_kg NUMERIC(5,2) NOT NULL,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    existing_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Frontend Route Architecture & Page Workspaces

```
/app
├── (auth)
│   ├── /doctor/login/page.tsx
│   ├── /nurse/login/page.tsx
│   ├── /staff/login/page.tsx
│   └── /parent/login/page.tsx
├── /dashboard
│   ├── /doctor
│   │   ├── /patients/page.tsx
│   │   ├── /patients/[id]/consult/page.tsx
│   │   └── /surgeries/page.tsx
│   ├── /nurse
│   │   ├── /triage/page.tsx
│   │   ├── /shots/page.tsx
│   │   └── /inpatient/page.tsx
│   ├── /staff
│   │   ├── /pets
│   │   │   ├── /page.tsx
│   │   │   ├── /new/page.tsx
│   │   │   └── /[id]/edit/page.tsx
│   │   ├── /inventory
│   │   │   ├── /page.tsx
│   │   │   └── /suppliers/page.tsx
│   │   ├── /equipment
│   │   │   ├── /page.tsx
│   │   │   └── /new/page.tsx
│   │   └── /marketing
│   │       ├── /vouchers/page.tsx
│   │       └── /re-engagement/page.tsx
│   └── /parent
│       ├── /my-pets/page.tsx
│       ├── /my-pets/[id]/history/page.tsx
│       ├── /appointments/page.tsx
│       └── /vouchers/page.tsx
```

---

## 5. Proactive Follow-Up & Re-Engagement Automation Engine

### 5.1 Daily Cloud Scheduler Task (`/api/cron/proactive-followups`)
Runs daily at 08:00 AM UTC+8. Checks upcoming vaccine boosters (within 7 days) and re-engages inactive clients with promotional discount vouchers.

---

## 6. Dockerfile & Cloud Run Deployment Configuration

### 6.1 Multi-Stage Production `Dockerfile`
Containerizes the standalone Next.js build listening on port 8080.

---

## 7. Author Attribution & License
- **Author & Lead Engineer**: Jerome Gotangco (<https://github.com/jgotangco>)
- **License**: MIT License
