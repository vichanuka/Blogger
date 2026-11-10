import crypto from "crypto";

/**
 * Hashes a plain-text password using a random 16-byte salt and scrypt.
 * Format: "salt:hash"
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against the stored "salt:hash" string
 * using constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(":");
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  const originalBuffer = Buffer.from(originalHash, "hex");
  const testBuffer = Buffer.from(testHash, "hex");

  if (originalBuffer.length !== testBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(originalBuffer, testBuffer);
}

