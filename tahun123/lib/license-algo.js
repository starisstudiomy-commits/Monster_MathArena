// Algoritma keygen/pengesahan kod lesen Monster MathArena.
// Digunakan oleh KEDUA-DUA: keygen/generate-key.js (mint key baru, jalan tempatan)
// DAN vercel-licensed/api/validate-license.js (sahkan key, jalan di server Vercel).
// Kedua-dua guna SATU rahsia sama (MMA_LICENSE_SECRET) - tiada database diperlukan,
// pengesahan cuma checksum HMAC. JANGAN commit nilai rahsia sebenar ke git.
const crypto = require('crypto');

// Alfabet selamat - buang 0/O, 1/I/L supaya kod senang ditaip & tak mengelirukan
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomSerial(len = 8) {
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

function checksumFor(serial, secret) {
  return crypto.createHmac('sha256', secret).update(serial).digest('hex').slice(0, 6).toUpperCase();
}

function generateKey(secret) {
  const serial = randomSerial(8);
  const checksum = checksumFor(serial, secret);
  return `MMA-${serial}-${checksum}`;
}

function validateKey(key, secret) {
  if (typeof key !== 'string') return false;
  const m = key.trim().toUpperCase().match(/^MMA-([A-Z2-9HJKMNPQRSTUVWXYZ]{8})-([A-F0-9]{6})$/);
  if (!m) return false;
  const [, serial, checksum] = m;
  return checksumFor(serial, secret) === checksum;
}

module.exports = { generateKey, validateKey, randomSerial, checksumFor };
