-- ===================================================================
-- NoviVet Clinical Database Schema (PostgreSQL 16 / Cloud SQL)
-- Document Version: 1.0.0
-- Author: Jerome Gotangco (https://github.com/jgotangco)
-- ===================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'DOCTOR', 'NURSE', 'STAFF', 'FUR_PARENT', 'BILLING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pet_species AS ENUM ('CANINE', 'FELINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pet_gender AS ENUM ('INTACT_MALE', 'NEUTERED_MALE', 'INTACT_FEMALE', 'SPAYED_FEMALE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role user_role NOT NULL DEFAULT 'FUR_PARENT',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinic_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    clinic_name VARCHAR(255) NOT NULL DEFAULT 'NoviVet Animal Hospital',
    tagline VARCHAR(255) DEFAULT 'Cloud Veterinary Clinical Engine',
    contact_phone VARCHAR(50) DEFAULT '+63 2 8123 4567',
    emergency_hotline VARCHAR(50) DEFAULT '+63 917 999 8888',
    address TEXT DEFAULT '123 Mabini St., Bonifacio Global City, Taguig, Philippines',
    license_number VARCHAR(100) DEFAULT 'PRC-VET-HOSP-0091',
    base_currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    tax_rate_percent NUMERIC(5,2) DEFAULT '12.00',
    active_theme_id VARCHAR(50) DEFAULT 'theme-emerald',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    species pet_species NOT NULL,
    breed VARCHAR(100) NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE,
    gender pet_gender NOT NULL,
    microchip_id VARCHAR(50) UNIQUE,
    photo_url TEXT,
    weight_kg NUMERIC(5,2),
    is_deceased BOOLEAN DEFAULT false NOT NULL,
    allergies JSONB DEFAULT '[]',
    special_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
