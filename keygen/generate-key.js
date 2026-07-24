#!/usr/bin/env node
// Jana kod lesen Monster MathArena. Jalankan TEMPATAN (jangan deploy fail ni).
//
// Cara guna:
//   MMA_LICENSE_SECRET="rahsia-sama-macam-di-vercel" node generate-key.js 5
//
// "5" = bilangan kod nak jana (default 1 kalau tak letak nombor).
const { generateKey } = require('../vercel-licensed/lib/license-algo');

const secret = process.env.MMA_LICENSE_SECRET;
if (!secret) {
  console.error('❌ MMA_LICENSE_SECRET tidak diset.');
  console.error('   Guna rahsia SAMA macam yang awak set di Vercel Project Settings > Environment Variables.');
  console.error('   Contoh: MMA_LICENSE_SECRET="rahsia-anda-yang-panjang" node generate-key.js 5');
  process.exit(1);
}

const count = Math.max(1, parseInt(process.argv[2], 10) || 1);
console.log(`\n🔑 ${count} kod lesen baharu:\n`);
for (let i = 0; i < count; i++) {
  console.log('  ' + generateKey(secret));
}
console.log('');
