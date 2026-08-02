#!/usr/bin/env node
// Jana kod lesen Monster MathArena. Jalankan TEMPATAN (jangan deploy fail ni).
//
// Cara guna:
//   MMA_LICENSE_SECRET="rahsia-sama-macam-di-vercel" node generate-key.js 5
//
// "5" = bilangan kod nak jana (default 1 kalau tak letak nombor).
//
// Kod TRIAL (akses terhad - Bab 1 sahaja, mod lain dikunci):
//   MMA_LICENSE_SECRET="rahsia-sama-macam-di-vercel" node generate-key.js trial
// Serial trial MESTI sepadan dgn TRIAL_SERIALS dlm vercel-licensed/index.html.
const { generateKey, checksumFor } = require('../vercel-licensed/lib/license-algo');

const secret = process.env.MMA_LICENSE_SECRET;
if (!secret) {
  console.error('❌ MMA_LICENSE_SECRET tidak diset.');
  console.error('   Guna rahsia SAMA macam yang awak set di Vercel Project Settings > Environment Variables.');
  console.error('   Contoh: MMA_LICENSE_SECRET="rahsia-anda-yang-panjang" node generate-key.js 5');
  process.exit(1);
}

// Serial(s) trial rasmi - kena SAMA dgn TRIAL_SERIALS dlm vercel-licensed/index.html
const TRIAL_SERIALS = ['TRY8DEM2'];

if (process.argv[2] === 'trial') {
  console.log('\n🎟️  Kod TRIAL (Bab 1 sahaja, mod lain dikunci):\n');
  TRIAL_SERIALS.forEach(serial => {
    console.log('  MMA-' + serial + '-' + checksumFor(serial, secret));
  });
  console.log('');
  process.exit(0);
}

const count = Math.max(1, parseInt(process.argv[2], 10) || 1);
console.log(`\n🔑 ${count} kod lesen baharu:\n`);
for (let i = 0; i < count; i++) {
  console.log('  ' + generateKey(secret));
}
console.log('');
