import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const PIN_REGEX = /^\d{6}$/;

/**
 * Hash a password using scrypt with a random 16-byte salt and 64-byte key length.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plaintext password against an scrypt salt:key hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    if (!password || !hash) return false;
    const parts = hash.split(":");
    if (parts.length !== 2) return false;
    const [salt, key] = parts;
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, "hex");
    if (derivedKey.length !== keyBuffer.length) return false;
    return timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

/**
 * Hash a 6-digit clinical station PIN using scrypt.
 * Must match /^\d{6}$/ strictly.
 */
export async function hashPin(pin: string): Promise<string> {
  if (!PIN_REGEX.test(pin)) {
    throw new Error("PIN must be exactly 6 digits (/^\\d{6}$/)");
  }
  return hashPassword(pin);
}

/**
 * Verify a 6-digit clinical station PIN against an scrypt salt:key hash.
 * Must match /^\d{6}$/ strictly.
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  if (!PIN_REGEX.test(pin) || !hash) {
    return false;
  }
  return verifyPassword(pin, hash);
}
