/**
 * Jana football/preview.html daripada football-simulator.html.
 *
 * Hos preview membalut fail yang diterbitkan dengan rangka
 * <!doctype html><head>…</head><body> sendiri, jadi fail preview mesti
 * mengandungi kandungan halaman sahaja — tanpa <html>, <head> atau <body>.
 * Skrip ini menanggalkan pembalut itu supaya permainan hanya ada SATU sumber
 * kebenaran; jangan sunting preview.html secara manual.
 *
 *   node football/build-preview.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const SUMBER = path.join(dir, '..', 'football-simulator.html');
const KELUARAN = path.join(dir, 'preview.html');

const html = fs.readFileSync(SUMBER, 'utf8');

const gaya = html.match(/<style>[\s\S]*?<\/style>/);
const badan = html.match(/<body>([\s\S]*)<\/body>/);
if (!gaya) throw new Error('Blok <style> tidak dijumpai dalam ' + SUMBER);
if (!badan) throw new Error('Blok <body> tidak dijumpai dalam ' + SUMBER);

const keluaran =
  '<!-- DIJANA AUTOMATIK oleh football/build-preview.mjs — jangan sunting fail ini.\n' +
  '     Sunting football-simulator.html, kemudian jalankan skrip itu semula. -->\n' +
  gaya[0] + '\n' + badan[1].trim() + '\n';

// Rangka hos menyediakan pembalut itu sendiri; jika ia tertinggal di sini
// halaman akan bersarang dan <head> kita disingkirkan senyap. Semak markah
// sebenar sahaja — komen HTML/CSS boleh menyebut nama tag secara sah.
const tanpaKomen = keluaran
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const pembalut = tanpaKomen.match(/<!doctype|<\s*\/?\s*(html|head|body)[\s>]/i);
if (pembalut) {
  throw new Error('Pembalut ' + pembalut[0].trim() + ' masih tertinggal dalam keluaran');
}
if (/https?:\/\/(?!www\.w3\.org)/.test(tanpaKomen)) {
  throw new Error('Keluaran memuat sumber luar — CSP hos akan menyekatnya');
}

fs.writeFileSync(KELUARAN, keluaran);
console.log('preview.html ditulis —', (keluaran.length / 1024).toFixed(0), 'KB');
