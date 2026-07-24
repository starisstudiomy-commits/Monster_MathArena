/* ============================================================
   SPACE EXPLORER ACADEMY - Question Engine
   Adapted from Monster Math Arena's procedural generators.
   Each chapter exposes a generator(tier) -> {prompt, answer, choices, visual?}
   buildBank() draws 20 unique-ish questions per chapter for a planet's pool.
   ============================================================ */

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function makeChoices(answer, maxNum, numChoices) {
  const s = new Set([answer]);
  let guard = 0;
  while (s.size < numChoices && guard < 200) {
    guard++;
    const delta = rand(1, Math.max(3, Math.round(maxNum * 0.3)));
    const cand = Math.random() < 0.5 ? answer + delta : answer - delta;
    if (cand >= 0 && cand !== answer) s.add(cand);
  }
  return shuffle([...s]).map(v => ({ label: String(v), value: v }));
}

const MAXNUM = 20;
const NUMCHOICES = 4;

function genNombor(tier) {
  const types = ['count', 'compare', 'next', 'before'];
  const t = pick(types);
  const effMax = tier === 1 ? Math.max(5, Math.round(MAXNUM * 0.4)) : tier === 2 ? Math.max(8, Math.round(MAXNUM * 0.7)) : MAXNUM;
  if (t === 'count') {
    const n = rand(1, Math.min(tier === 1 ? 5 : tier === 2 ? 10 : 15, MAXNUM));
    const answer = n;
    return { prompt: 'Berapakah bilangan berikut?', answer, choices: makeChoices(answer, MAXNUM, NUMCHOICES), visual: `<div class="q-visual">${'🟢'.repeat(n)}</div>` };
  }
  if (t === 'compare') {
    let a = rand(1, effMax), b = rand(1, effMax);
    while (b === a) b = rand(1, effMax);
    const askBigger = Math.random() < 0.5;
    const answer = askBigger ? Math.max(a, b) : Math.min(a, b);
    const prompt = askBigger ? `Nombor yang manakah lebih besar? ${a} atau ${b}` : `Nombor yang manakah lebih kecil? ${a} atau ${b}`;
    return { prompt, answer, choices: shuffle([{ label: String(a), value: a }, { label: String(b), value: b }]) };
  }
  if (t === 'next') {
    const n = rand(1, Math.max(2, effMax - 1));
    const answer = n + 1;
    return { prompt: `Apakah nombor selepas ${n}?`, answer, choices: makeChoices(answer, MAXNUM, NUMCHOICES) };
  }
  const n = rand(2, Math.max(3, effMax));
  const answer = n - 1;
  return { prompt: `Apakah nombor sebelum ${n}?`, answer, choices: makeChoices(answer, MAXNUM, NUMCHOICES) };
}

function genTambah(tier) {
  const capA = tier === 1 ? Math.max(3, Math.round(MAXNUM * 0.35)) : tier === 2 ? Math.max(6, Math.round(MAXNUM * 0.6)) : MAXNUM;
  const a = rand(1, Math.max(1, capA));
  const b = rand(1, Math.max(1, Math.min(MAXNUM - a, capA)));
  const answer = a + b;
  return { prompt: `${a} + ${b} = ?`, answer, choices: makeChoices(answer, Math.max(answer * 2, 20), NUMCHOICES) };
}

function genTolak(tier) {
  const capA = tier === 1 ? Math.max(4, Math.round(MAXNUM * 0.4)) : tier === 2 ? Math.max(8, Math.round(MAXNUM * 0.7)) : MAXNUM;
  const a = rand(2, Math.max(2, capA));
  const b = rand(1, a - 1);
  const answer = a - b;
  return { prompt: `${a} − ${b} = ?`, answer, choices: makeChoices(answer, MAXNUM, NUMCHOICES) };
}

function genWang(tier) {
  const isCount = Math.random() < 0.5;
  const coinPool = tier === 1 ? [5, 10] : tier === 2 ? [5, 10, 20] : [5, 10, 20, 50];
  if (isCount) {
    const coinCount = tier === 1 ? rand(2, 3) : tier === 2 ? rand(3, 4) : rand(4, 6);
    let total = 0, display = '';
    for (let i = 0; i < coinCount; i++) {
      const v = pick(coinPool);
      total += v;
      display += `<span class="coin">${v}</span>`;
    }
    return { prompt: 'Berapa jumlah wang ini?', answer: total, choices: makeChoices(total, MAXNUM * 5, NUMCHOICES), visual: `<div class="q-visual">${display}</div>` };
  }
  const duitPool = tier === 1 ? [50] : tier === 2 ? [50, 100] : [50, 100, 200];
  const duit = pick(duitPool);
  const harga = rand(10, duit - 10);
  const answer = duit - harga;
  return { prompt: `Kamu ada RM${duit}. Kamu beli barang berharga RM${harga}. Berapakah baki wang kamu?`, answer, choices: makeChoices(answer, MAXNUM * 3, NUMCHOICES) };
}

function genMasa(tier) {
  const pool = tier === 1 ? ['hari', 'hari', 'jam'] : tier === 2 ? ['hari', 'jam', 'tempoh'] : ['jam', 'tempoh', 'tempoh'];
  const t = pick(pool);
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  if (t === 'hari') {
    const i = rand(0, 6);
    const after = Math.random() < 0.5;
    const answer = after ? days[(i + 1) % 7] : days[(i + 6) % 7];
    const prompt = after ? `Hari selepas ${days[i]}?` : `Hari sebelum ${days[i]}?`;
    const others = days.filter(d => d !== answer && d !== days[i]).sort(() => Math.random() - 0.5).slice(0, NUMCHOICES - 1);
    return { prompt, answer, choices: shuffle([answer, ...others]).map(v => ({ label: v, value: v })) };
  }
  if (t === 'tempoh') {
    const a = rand(1, 11);
    const n = tier === 3 ? rand(1, 5) : rand(1, 3);
    const answer = ((a + n - 1) % 12) + 1;
    return { prompt: `Sekarang pukul ${a}. Pukul berapakah selepas ${n} jam?`, answer, choices: makeChoices(answer, 12, NUMCHOICES) };
  }
  const h = rand(1, 12);
  const half = tier === 1 ? false : Math.random() < 0.3;
  const answer = half ? `${h}:30` : `${h}:00`;
  const prompt = half ? `Jam menunjukkan pukul ${h}:30. Pukul berapakah ini?` : `Jam menunjukkan pukul ${h}:00. Pukul berapakah ini?`;
  const labels = new Set([answer]);
  labels.add(`${(h % 12) + 1}:00`);
  labels.add(`${h}:${half ? '00' : '30'}`);
  while (labels.size < NUMCHOICES) labels.add(`${rand(1, 12)}:${Math.random() < 0.5 ? '00' : '30'}`);
  return { prompt, answer, choices: [...labels].map(v => ({ label: v, value: v })) };
}

function genBentuk(tier) {
  const shapes2D = ['Bulatan', 'Segi Tiga', 'Segi Empat Sama', 'Segi Empat Tepat', 'Segi Lima', 'Segi Enam', 'Oval', 'Trapezium'];
  const shapes3D = ['Kubus', 'Sfera', 'Silinder', 'Kon', 'Piramid'];
  const facts2D = { 'Bulatan': { sisi: 0, bucu: 0 }, 'Segi Tiga': { sisi: 3, bucu: 3 }, 'Segi Empat Sama': { sisi: 4, bucu: 4 }, 'Segi Empat Tepat': { sisi: 4, bucu: 4 }, 'Segi Lima': { sisi: 5, bucu: 5 }, 'Segi Enam': { sisi: 6, bucu: 6 }, 'Oval': { sisi: 0, bucu: 0 }, 'Trapezium': { sisi: 4, bucu: 4 } };
  const emoji3D = { Kubus: '🎲', Sfera: '⚽', Silinder: '🥫', Kon: '🍦', Piramid: '🔺' };
  const emoji2D = { 'Bulatan': '⭕', 'Segi Tiga': '🔺', 'Segi Empat Sama': '🟦', 'Segi Empat Tepat': '⬛', 'Segi Lima': '⬠', 'Segi Enam': '⬡', 'Oval': '🥚', 'Trapezium': '🔷' };
  if (tier === 3 && Math.random() < 0.4) {
    const shape = pick(shapes3D);
    const others = shapes3D.filter(s => s !== shape).sort(() => Math.random() - 0.5);
    return { prompt: 'Apakah nama bentuk 3D di bawah?', answer: shape, choices: [shape, ...others.slice(0, NUMCHOICES - 1)].map(v => ({ label: v, value: v })), visual: `<div class="q-visual big">${emoji3D[shape]}</div>` };
  }
  if (tier >= 2 && Math.random() < 0.35) {
    const shape = pick(shapes2D);
    const askSisi = Math.random() < 0.5;
    const answer = askSisi ? facts2D[shape].sisi : facts2D[shape].bucu;
    const s = new Set([answer]);
    let delta = 1;
    while (s.size < NUMCHOICES && delta <= 10) { if (answer + delta >= 0) s.add(answer + delta); if (s.size < NUMCHOICES && answer - delta >= 0) s.add(answer - delta); delta++; }
    return { prompt: `Berapa ${askSisi ? 'SISI' : 'BUCU'} pada ${shape}?`, answer, choices: [...s].map(v => ({ label: String(v), value: v })), visual: `<div class="q-visual">${emoji2D[shape]}</div>` };
  }
  const shape = pick(shapes2D);
  const others = shapes2D.filter(s => s !== shape).sort(() => Math.random() - 0.5);
  return { prompt: 'Apakah nama bentuk di bawah?', answer: shape, choices: [shape, ...others.slice(0, NUMCHOICES - 1)].map(v => ({ label: v, value: v })), visual: `<div class="q-visual">${emoji2D[shape]}</div>` };
}

function genPanjang(tier) {
  const pairs = [['Ular 🐍', 'Cacing 🪱'], ['Jalan raya 🛣️', 'Lorong kecil 🏘️'], ['Tali skipping', 'Gelang getah'], ['Pensel panjang ✏️', 'Pensel pendek'], ['Pembaris meter 📏', 'Pemadam 🧼'], ['Sungai 🏞️', 'Parit'], ['Kereta api 🚆', 'Basikal 🚲'], ['Tangga tinggi', 'Bangku kecil']];
  const p = pick(pairs);
  const askLong = Math.random() < 0.5;
  const answer = askLong ? p[0] : p[1];
  const prompt = askLong ? 'Manakah yang lebih PANJANG?' : 'Manakah yang lebih PENDEK?';
  return { prompt, answer, choices: shuffle([p[0], p[1]]).map(v => ({ label: v, value: v })), two: true };
}

function genBerat(tier) {
  const pairs = [['Gajah 🐘', 'Tikus 🐭'], ['Batu 🪨', 'Bulu 🪶'], ['Badak sumbu 🦏', 'Kucing 🐱'], ['Besi 🔩', 'Span 🧽'], ['Beg pasir 🏋️', 'Belon 🎈'], ['Meja besar 📦', 'Pensel ✏️'], ['Paus 🐋', 'Ikan kecil 🐟'], ['Guni beras', 'Sekeping kertas']];
  const p = pick(pairs);
  const askHeavy = Math.random() < 0.5;
  const answer = askHeavy ? p[0] : p[1];
  const prompt = askHeavy ? 'Manakah yang lebih BERAT?' : 'Manakah yang lebih RINGAN?';
  return { prompt, answer, choices: shuffle([p[0], p[1]]).map(v => ({ label: v, value: v })), two: true };
}

function genIsipadu(tier) {
  const pairs = [['Gelas penuh 🥛', 'Gelas kosong 🥛'], ['Balai besar 🪣', 'Cawan kecil ☕'], ['Kolam 🏊', 'Botol air 🧴'], ['Tong air 🛢️', 'Sudu kecil 🥄'], ['Akuarium 🐠', 'Mangkuk kecil 🥣'], ['Baldi 🪣', 'Botol kecil 🧴']];
  const p = pick(pairs);
  const askMore = Math.random() < 0.5;
  const answer = askMore ? p[0] : p[1];
  const prompt = askMore ? 'Bekas manakah yang boleh memuatkan LEBIH BANYAK air?' : 'Bekas manakah yang boleh memuatkan LEBIH SEDIKIT air?';
  return { prompt, answer, choices: shuffle([p[0], p[1]]).map(v => ({ label: v, value: v })), two: true };
}

const GENERATORS = {
  nombor: genNombor, tambah: genTambah, tolak: genTolak, wang: genWang,
  masa: genMasa, bentuk: genBentuk, panjang: genPanjang, berat: genBerat, isipadu: genIsipadu,
};

// Ulang Kaji draws randomly from every previous chapter
function genUlangKaji() {
  const topics = ['nombor', 'tambah', 'tolak', 'wang', 'masa', 'bentuk', 'panjang', 'berat', 'isipadu'];
  const topic = pick(topics);
  const q = GENERATORS[topic](rand(1, 3));
  q.reviewTopic = topic;
  return q;
}

function buildBank(topicId, count) {
  const gen = topicId === 'ulangkaji' ? genUlangKaji : GENERATORS[topicId];
  const bank = [];
  const seen = new Set();
  let guard = 0;
  while (bank.length < count && guard < count * 15) {
    guard++;
    const tier = bank.length < count * 0.4 ? 1 : bank.length < count * 0.75 ? 2 : 3;
    const q = gen(tier);
    const key = q.prompt + '|' + q.answer;
    if (seen.has(key)) continue;
    seen.add(key);
    bank.push(q);
  }
  return bank;
}
