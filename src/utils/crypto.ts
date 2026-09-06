/**
 * Secure cryptographic helper for password hashing and verification
 * Uses W3C Web Cryptography API (PBKDF2-HMAC-SHA256 with 100,000 iterations)
 * Passwords are never stored in plaintext.
 */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ saltHex: string; hashHex: string }> {
  const salt = saltHex
    ? hexToBytes(saltHex)
    : window.crypto.getRandomValues(new Uint8Array(16));

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return {
    saltHex: bytesToHex(salt),
    hashHex: bytesToHex(new Uint8Array(derivedBits)),
  };
}

export async function verifyPassword(
  password: string,
  saltHex: string,
  expectedHashHex: string
): Promise<boolean> {
  const { hashHex } = await hashPassword(password, saltHex);
  return hashHex === expectedHashHex;
}

export function generateSessionToken(): string {
  const bytes = window.crypto.getRandomValues(new Uint8Array(24));
  return bytesToHex(bytes);
}
