export const COOKIE_NAME = "admin_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

function base64UrlEncode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlEncodeString(str) {
  return base64UrlEncode(new TextEncoder().encode(str));
}

function base64UrlDecodeString(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed JWT with the provided payload.
 * Fully compatible with both Node.js and Edge runtimes.
 */
export async function signToken(payload, expiresInSeconds = 7 * 24 * 60 * 60) {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "blogger-admin-secret-fallback-key-2026";
  const key = await getHmacKey(secret);

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(fullPayload));
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies a JWT token signature and expiration.
 * Returns payload if valid, null otherwise.
 */
export async function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "blogger-admin-secret-fallback-key-2026";
    const key = await getHmacKey(secret);
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

    let base64 = encodedSignature.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const binary = atob(base64);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecodeString(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

