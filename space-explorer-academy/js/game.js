/* ============================================================
   SPACE EXPLORER ACADEMY - Game Engine
   ============================================================ */

const STORAGE_KEY = 'seaState_v1';
const app = document.getElementById('app');

function freshState() {
  return {
    explorer: { gender: 'male', name: 'Explorer Ace' },
    shipId: 'basic',
    robotId: 'drone',
    resources: { minerals: 0, coins: 0, exp: 0, knowledgeStars: 0 },
    planetProgress: {}, // id -> {completed, bestAccuracy, attempts, correct, unlocked}
    encyclopedia: {}, // alienKey -> true
    playTimeMin: 0,
  };
}

let state = load();
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch (e) {}
  const s = freshState();
  s.planetProgress[PLANETS[0].id] = { completed: false, bestAccuracy: 0, attempts: 0, correct: 0, unlocked: true };
  return s;
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function isUnlocked(planet) {
  const p = state.planetProgress[planet.id];
  if (p) return p.unlocked;
  return planet.num === 1;
}
function ensureProgress(planetId) {
  if (!state.planetProgress[planetId]) state.planetProgress[planetId] = { completed: false, bestAccuracy: 0, attempts: 0, correct: 0, unlocked: planetId === PLANETS[0].id };
  return state.planetProgress[planetId];
}
function getShip() { return SHIPS.find(s => s.id === state.shipId) || SHIPS[0]; }
function getRobot() { return ROBOTS.find(r => r.id === state.robotId) || ROBOTS[0]; }

function route(screen, params) {
  window.scrollTo(0, 0);
  SCREENS[screen](params || {});
}

/* ---------------- MAIN MENU (dashboard) ---------------- */
const AVATARS = [
  { gender: 'male', emoji: '🧑‍🚀', label: 'Lelaki' },
  { gender: 'female', emoji: '👩‍🚀', label: 'Perempuan' },
];
const SKILL_ICONS = { 'Laser Beam': '✨', 'Shield': '🛡', 'Heal': '➕', 'Freeze': '❄', 'Double Attack': '⚔' };
const ALL_SKILLS = ['Laser Beam', 'Shield', 'Heal', 'Freeze', 'Double Attack'];

let robotBrowseIdx = null;
let shipBrowseIdx = null;

function renderMenu() {
  if (robotBrowseIdx === null) robotBrowseIdx = Math.max(0, ROBOTS.findIndex(r => r.id === state.robotId));
  if (shipBrowseIdx === null) shipBrowseIdx = Math.max(0, SHIPS.findIndex(s => s.id === state.shipId));

  const avatarIdx = AVATARS.findIndex(a => a.gender === state.explorer.gender);
  const avatar = AVATARS[avatarIdx < 0 ? 0 : avatarIdx];
  const robot = ROBOTS[robotBrowseIdx];
  const robotEquipped = robot.id === state.robotId;
  const robotUnlocked = robot.id === 'drone';
  const level = 1 + Math.floor(state.resources.exp / 100);
  const xpPct = state.resources.exp % 100;

  const ship = SHIPS[shipBrowseIdx];
  const shipEquipped = ship.id === state.shipId;
  const maxHp = Math.max(...SHIPS.map(s => s.hp));
  const maxShield = Math.max(...SHIPS.map(s => s.shield));
  const maxSpeed = Math.max(...SHIPS.map(s => s.speed));
  const maxLaser = Math.max(...SHIPS.map(s => s.laser));
  const maxCargo = Math.max(...SHIPS.map(s => s.cargo));

  app.innerHTML = `
    <div class="dash-topbar">
      <div class="dash-brand"><span class="b1">✦ STARIS STUDIO</span><span class="b2">LEARN · PLAY · EXCEL</span></div>
      <div class="dash-currencies">
        <div class="currency-chip">🪨 ${state.resources.minerals.toLocaleString()}</div>
        <div class="currency-chip">🌟 ${state.resources.knowledgeStars.toLocaleString()}</div>
      </div>
    </div>

    <div class="hero-banner">
      <div class="rocket">🚀</div>
      <h1 class="hero-title">SPACE EXPLORER</h1>
      <div class="hero-sub">ACADEMY</div>
      <div class="hero-tagline">Explore. Learn. Upgrade.</div>
    </div>

    <div class="dash-grid">
      <div class="dash-card card-explorer">
        <div class="dash-card-header"><div class="num-badge">1</div><div class="dash-card-title">EXPLORER DATA</div></div>
        <div><div class="field-label">NAMA EXPLORER</div><input class="name-input" id="name-input" maxlength="18" value="${escAttr(state.explorer.name)}"></div>
        <div>
          <div class="field-label">PILIH AVATAR</div>
          <div class="carousel-row">
            <button class="carousel-btn" id="av-prev">‹</button>
            <div class="carousel-center"><div class="carousel-emoji">${avatar.emoji}</div><div class="carousel-name">${avatar.label}</div></div>
            <button class="carousel-btn" id="av-next">›</button>
          </div>
        </div>
        <div>
          <div class="field-label">TAHUN</div>
          <div class="year-pills">
            <div class="year-pill active" data-y="1">1 ⭐</div>
            <div class="year-pill locked" data-y="2">2 ⭐⭐</div>
            <div class="year-pill locked" data-y="3">3 ⭐⭐⭐</div>
          </div>
        </div>
      </div>

      <div class="dash-card card-robot">
        <div class="dash-card-header"><div class="num-badge">2</div><div class="dash-card-title">ROBOT WORKSHOP</div></div>
        <div class="robot-preview">
          <div class="carousel-row">
            <button class="carousel-btn" id="rb-prev">‹</button>
            <div class="carousel-center">
              <div class="carousel-emoji">${robot.icon}</div>
              <div class="carousel-name ${robotUnlocked ? '' : 'locked-name'}">${robot.name} ${robotEquipped ? '✅' : robotUnlocked ? '' : '🔒'}</div>
            </div>
            <button class="carousel-btn" id="rb-next">›</button>
          </div>
        </div>
        <div>
          <div class="level-row"><span>LEVEL ${level}</span><span>${xpPct}/100 EXP</span></div>
          <div class="level-bar"><div style="width:${xpPct}%"></div></div>
        </div>
        <div class="skill-grid">
          ${ALL_SKILLS.map(sk => `<div class="skill-chip ${robot.skills.includes(sk) ? 'unlocked' : 'locked'}"><span class="sk-icon">${SKILL_ICONS[sk]}</span>${sk}</div>`).join('')}
        </div>
        <button class="card-cta" id="btn-robot">UPGRADE ROBOT</button>
      </div>

      <div class="dash-card card-ship" style="grid-column:1/-1">
        <div class="dash-card-header"><div class="num-badge">3</div><div class="dash-card-title">SPACESHIP HANGAR</div></div>
        <div class="carousel-row">
          <button class="carousel-btn" id="sh-prev">‹</button>
          <div class="carousel-center">
            <div class="carousel-emoji">🚀</div>
            <div class="carousel-name">${ship.name} ${shipEquipped ? '✅' : ship.cost > 0 ? '🔒' : ''}</div>
          </div>
          <button class="carousel-btn" id="sh-next">›</button>
        </div>
        <div class="stat-bars">
          <div class="stat-bar-item"><span class="lbl">❤ HP</span><div class="hp-bar hp"><div style="width:${ship.hp / maxHp * 100}%"></div></div></div>
          <div class="stat-bar-item"><span class="lbl">🛡 Shield</span><div class="hp-bar shield"><div style="width:${ship.shield / maxShield * 100}%"></div></div></div>
          <div class="stat-bar-item"><span class="lbl">⚡ Speed</span><div class="hp-bar speed"><div style="width:${ship.speed / maxSpeed * 100}%"></div></div></div>
          <div class="stat-bar-item"><span class="lbl">🔺 Laser</span><div class="hp-bar laser"><div style="width:${ship.laser / maxLaser * 100}%"></div></div></div>
          <div class="stat-bar-item"><span class="lbl">📦 Cargo</span><div class="hp-bar cargo"><div style="width:${ship.cargo / maxCargo * 100}%"></div></div></div>
        </div>
        <button class="card-cta" id="btn-hangar">UPGRADE SPACESHIP</button>
      </div>

      <div class="dash-card nav-card" style="grid-column:1/-1;border-color:#ffffff26;box-shadow:none">
        <div class="nav-item" id="btn-ency">
          <div class="nav-icon" style="background:#38bdf833">📖</div>
          <div class="nav-text"><div class="nav-title" style="color:var(--star)">ENCYCLOPEDIA</div><div class="nav-desc">Discover aliens, planets, minerals and more!</div></div>
          <div class="nav-arrow">›</div>
        </div>
        <div class="nav-item" id="btn-achieve">
          <div class="nav-icon" style="background:#22c55e33">🏆</div>
          <div class="nav-text"><div class="nav-title" style="color:var(--good)">ACHIEVEMENTS</div><div class="nav-desc">Complete missions and earn amazing rewards!</div></div>
          <div class="nav-arrow">›</div>
        </div>
        <div class="nav-item" id="btn-parent">
          <div class="nav-icon" style="background:#fbbf2433">👨‍👩‍👧</div>
          <div class="nav-text"><div class="nav-title" style="color:var(--gold)">PARENT MODE</div><div class="nav-desc">Track progress and manage learning settings.</div></div>
          <div class="nav-arrow">›</div>
        </div>
      </div>
    </div>

    <button class="start-cta" id="btn-start">🚀 START ADVENTURE</button>
    <div class="reset-link" id="btn-reset">♻ Reset Progress</div>
  `;

  document.getElementById('name-input').oninput = (e) => { state.explorer.name = e.target.value || 'Kadet'; save(); };
  document.getElementById('av-prev').onclick = () => { const i = (avatarIdx < 0 ? 0 : avatarIdx - 1 + AVATARS.length) % AVATARS.length; state.explorer.gender = AVATARS[i].gender; save(); route('menu'); };
  document.getElementById('av-next').onclick = () => { const i = (avatarIdx < 0 ? 0 : avatarIdx + 1) % AVATARS.length; state.explorer.gender = AVATARS[i].gender; save(); route('menu'); };

  document.getElementById('rb-prev').onclick = () => { robotBrowseIdx = (robotBrowseIdx - 1 + ROBOTS.length) % ROBOTS.length; route('menu'); };
  document.getElementById('rb-next').onclick = () => { robotBrowseIdx = (robotBrowseIdx + 1) % ROBOTS.length; route('menu'); };
  document.getElementById('btn-robot').onclick = () => route('robot');

  document.getElementById('sh-prev').onclick = () => { shipBrowseIdx = (shipBrowseIdx - 1 + SHIPS.length) % SHIPS.length; route('menu'); };
  document.getElementById('sh-next').onclick = () => { shipBrowseIdx = (shipBrowseIdx + 1) % SHIPS.length; route('menu'); };
  document.getElementById('btn-hangar').onclick = () => route('hangar');

  document.getElementById('btn-ency').onclick = () => route('encyclopedia');
  document.getElementById('btn-achieve').onclick = () => route('achievements');
  document.getElementById('btn-parent').onclick = () => route('parent');
  document.getElementById('btn-start').onclick = () => route('galaxy');
  document.getElementById('btn-reset').onclick = () => {
    if (confirm('Reset semua kemajuan? Tindakan ini tidak boleh dibuat asal.')) {
      state = freshState();
      state.planetProgress[PLANETS[0].id] = { completed: false, bestAccuracy: 0, attempts: 0, correct: 0, unlocked: true };
      robotBrowseIdx = null; shipBrowseIdx = null;
      save();
      route('menu');
    }
  };
}

/* ---------------- ACHIEVEMENTS ---------------- */
function renderAchievements() {
  const completedCount = PLANETS.filter(p => state.planetProgress[p.id] && state.planetProgress[p.id].completed).length;
  const rows = PLANETS.map(p => {
    const done = state.planetProgress[p.id] && state.planetProgress[p.id].completed;
    return `<div class="nav-item" style="cursor:default">
      <div class="nav-icon" style="background:${done ? '#22c55e33' : '#ffffff10'}">${done ? '🏅' : '🔒'}</div>
      <div class="nav-text"><div class="nav-title">${p.name}</div><div class="nav-desc">${done ? 'Ditamatkan — badge diperoleh!' : 'Selesaikan planet untuk badge.'}</div></div>
    </div>`;
  }).join('');
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">🏆 Achievements</div>
    <div class="subtitle">${completedCount}/${PLANETS.length} planet ditamatkan.</div>
    ${rows}
  `;
  document.getElementById('back').onclick = () => route('menu');
}

/* ---------------- SPACESHIP HANGAR ---------------- */
function renderHangar() {
  const rows = SHIPS.map(s => {
    const owned = s.id === 'basic' || (state.resources.minerals >= 0 && s.unlocked);
    const isCurrent = s.id === state.shipId;
    return `
      <div class="planet-node ${s.cost > 0 ? 'locked' : ''}" data-id="${s.id}">
        <div class="icon" style="background:${isCurrent ? '#22c55e' : '#7c6cf0'}">🚀</div>
        <div class="info">
          <div class="name">${s.name} ${isCurrent ? '✅' : ''}</div>
          <div class="meta">HP ${s.hp} · Shield ${s.shield} · Laser ${s.laser} · Speed ${s.speed}</div>
          <div class="meta">${s.cost === 0 ? 'PERCUMA' : '🪨 ' + s.cost + ' mineral (belum dibuka)'}</div>
        </div>
      </div>`;
  }).join('');
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">🚀 Spaceship Hangar</div>
    <div class="subtitle">Kapal lain dibuka dengan mineral dari eksplorasi.</div>
    ${rows}
  `;
  document.getElementById('back').onclick = () => route('menu');
  document.querySelectorAll('.planet-node[data-id="basic"]').forEach(n => {
    n.onclick = () => { state.shipId = 'basic'; save(); route('hangar'); };
  });
}

/* ---------------- ROBOT WORKSHOP ---------------- */
function renderRobot() {
  const rows = ROBOTS.map(r => {
    const isCurrent = r.id === state.robotId;
    const unlocked = r.id === 'drone';
    return `
      <div class="planet-node ${unlocked ? '' : 'locked'}" data-id="${r.id}">
        <div class="icon" style="background:${isCurrent ? '#22c55e' : '#7c6cf0'}">${r.icon}</div>
        <div class="info">
          <div class="name">${r.name} ${isCurrent ? '✅' : ''}</div>
          <div class="meta">Skill: ${r.skills.join(', ')}</div>
          <div class="meta">${unlocked ? 'Sedia digunakan' : 'Unlock melalui pencapaian planet'}</div>
        </div>
      </div>`;
  }).join('');
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">🤖 Robot Workshop</div>
    <div class="subtitle">Robot menemani kamu semasa pertempuran alien.</div>
    ${rows}
  `;
  document.getElementById('back').onclick = () => route('menu');
  document.querySelectorAll('.planet-node[data-id="drone"]').forEach(n => {
    n.onclick = () => { state.robotId = 'drone'; save(); route('robot'); };
  });
}

/* ---------------- GALAXY MAP ---------------- */
function renderGalaxy() {
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">Pilih Galaxy</div>
    <div class="subtitle">Tahun 2 &amp; 3, serta Galaxy Sains dan English akan datang.</div>
    <div class="planet-node" data-g="math">
      <div class="icon" style="background:#6366F1">🔢</div>
      <div class="info"><div class="name">Galaxy Matematik</div><div class="meta">Tahun 1 tersedia</div></div>
    </div>
    <div class="planet-node locked">
      <div class="icon" style="background:#16a34a">🧪</div>
      <div class="info"><div class="name">Galaxy Sains</div><div class="meta">Coming soon</div></div>
    </div>
    <div class="planet-node locked">
      <div class="icon" style="background:#a855f7">🔤</div>
      <div class="info"><div class="name">Galaxy English</div><div class="meta">Coming soon</div></div>
    </div>
  `;
  document.getElementById('back').onclick = () => route('menu');
  document.querySelector('.planet-node[data-g="math"]').onclick = () => route('year', { galaxy: 'math' });
}

/* ---------------- YEAR SELECT ---------------- */
function renderYear() {
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">Galaxy Matematik</div>
    <div class="subtitle">Pilih tahun.</div>
    <div class="planet-node" data-y="1">
      <div class="icon" style="background:#6366F1">⭐</div>
      <div class="info"><div class="name">Tahun 1</div><div class="meta">10 planet tersedia</div></div>
    </div>
    <div class="planet-node locked">
      <div class="icon" style="background:#6366F1">⭐⭐</div>
      <div class="info"><div class="name">Tahun 2</div><div class="meta">Coming soon</div></div>
    </div>
    <div class="planet-node locked">
      <div class="icon" style="background:#6366F1">⭐⭐⭐</div>
      <div class="info"><div class="name">Tahun 3</div><div class="meta">Coming soon</div></div>
    </div>
  `;
  document.getElementById('back').onclick = () => route('galaxy');
  document.querySelector('.planet-node[data-y="1"]').onclick = () => route('planetmap');
}

/* ---------------- PLANET MAP ---------------- */
function renderPlanetMap() {
  const rows = PLANETS.map(p => {
    const prog = ensureProgress(p.id);
    const unlocked = isUnlocked(p);
    const pct = prog.completed ? 100 : 0;
    return `
      <div class="planet-node ${unlocked ? '' : 'locked'}" data-id="${p.id}">
        <div class="icon" style="background:${p.color}">${p.num}</div>
        <div class="info">
          <div class="name">${p.name} ${prog.completed ? '🏆' : ''}</div>
          <div class="meta">${unlocked ? (prog.completed ? `Terbaik: ${prog.bestAccuracy}% ketepatan` : 'Belum ditamatkan') : '🔒 Selesaikan planet sebelumnya'}</div>
          <div class="progress-bar"><div style="width:${pct}%;background:${p.color}"></div></div>
        </div>
      </div>`;
  }).join('');
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="topbar">
      <div class="title">Galaxy Matematik · Tahun 1</div>
    </div>
    ${resourceBar()}
    ${rows}
  `;
  document.getElementById('back').onclick = () => route('year');
  PLANETS.forEach(p => {
    const el = document.querySelector(`.planet-node[data-id="${p.id}"]`);
    if (el && isUnlocked(p)) el.onclick = () => route('planetintro', { planetId: p.id });
  });
}

function resourceBar() {
  const r = state.resources;
  return `<div class="topbar">
    <span class="resource-pill">🪨 ${r.minerals}</span>
    <span class="resource-pill">🌟 ${r.knowledgeStars}</span>
    <span class="resource-pill">🪙 ${r.coins}</span>
    <span class="resource-pill">✨ EXP ${r.exp}</span>
  </div>`;
}

/* ---------------- PLANET INTRO ---------------- */
function renderPlanetIntro(params) {
  const planet = PLANETS.find(p => p.id === params.planetId);
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="panel" style="text-align:center;border-color:${planet.color}">
      <div style="font-size:10px;letter-spacing:3px;color:${planet.color};font-weight:800">BAB ${planet.num}</div>
      <h2 style="color:${planet.color}">${planet.name}</h2>
      <img class="enemy-art" src="${ALIEN_ART[planet.boss]}" alt="${planet.bossName}">
      <div style="font-size:13px;color:var(--text-dim);margin-bottom:10px">Kamu akan hadapi <b style="color:${planet.color}">${planet.bossName}</b> di Boss Area!</div>
      <div class="badge">Fokus: ${planet.weakness}</div>
    </div>
    <div class="btn gold" id="btn-go">🚀 Mula Eksplorasi</div>
  `;
  document.getElementById('back').onclick = () => route('planetmap');
  document.getElementById('btn-go').onclick = () => startPlanetRun(planet);
}

/* ---------------- PLANET RUN ---------------- */
let run = null;

function startPlanetRun(planet) {
  const bank = shuffle(buildBank(planet.topic, 20));
  let cursor = 0;
  const zones = ZONE_PLAN.map(z => {
    if (!z.questions) return { ...z, questions: [] };
    const qs = bank.slice(cursor, cursor + z.questions);
    cursor += z.questions;
    return { ...z, questions: qs };
  });
  const ship = getShip();
  run = {
    planet, zones, zoneIndex: 0, qIndexInZone: 0,
    playerHp: ship.hp, playerHpMax: ship.hp,
    correct: 0, total: 0,
    enemyHp: 0, enemyHpMax: 0,
  };
  renderZone();
}

function currentZone() { return run.zones[run.zoneIndex]; }

function renderZone() {
  const zone = currentZone();
  if (zone.type === 'landing') {
    app.innerHTML = zoneHeader(zone) + `
      <div class="panel" style="text-align:center">
        <div style="font-size:40px">🛬</div>
        <div style="margin:8px 0;color:var(--text-dim);font-size:13px">Kadet mendarat di ${run.planet.name}. Bersedia untuk meneroka!</div>
        <div class="btn gold" id="btn-continue">Teruskan</div>
      </div>`;
    document.getElementById('btn-continue').onclick = () => advanceZone();
    return;
  }
  if (zone.type === 'boss') {
    const boss = run.planet.boss;
    if (run.enemyHpMax === 0) { run.enemyHpMax = 100; run.enemyHp = 100; }
    app.innerHTML = zoneHeader(zone) + `
      <div class="panel" style="text-align:center">
        <div style="font-weight:800;color:${run.planet.color}">👑 ${run.planet.bossName}</div>
        <img class="enemy-art" src="${ALIEN_ART[boss]}" alt="boss">
        <div class="hp-row"><span>👾</span><div class="hp-bar enemy"><div style="width:${run.enemyHp}%"></div></div></div>
        <div class="hp-row"><span>🚀</span><div class="hp-bar player"><div style="width:${(run.playerHp/run.playerHpMax*100)}%"></div></div></div>
      </div>
      ${questionCard(zone.questions[run.qIndexInZone])}
    `;
    bindChoices((ok) => handleAnswer(ok, zone));
    return;
  }
  if (zone.type === 'battle') {
    const grunt = pick(run.planet.grunts);
    if (run.enemyHpMax === 0) { run.enemyHpMax = 100; run.enemyHp = 100; }
    app.innerHTML = zoneHeader(zone) + `
      <div class="panel" style="text-align:center">
        <div style="font-weight:800">${zone.label}</div>
        <img class="enemy-art small" src="${ALIEN_ART[grunt]}" alt="alien">
        <div class="hp-row"><span>👾</span><div class="hp-bar enemy"><div style="width:${run.enemyHp}%"></div></div></div>
        <div class="hp-row"><span>🚀</span><div class="hp-bar player"><div style="width:${(run.playerHp/run.playerHpMax*100)}%"></div></div></div>
      </div>
      ${questionCard(zone.questions[run.qIndexInZone])}
    `;
    bindChoices((ok) => handleAnswer(ok, zone));
    return;
  }
  // mining
  app.innerHTML = zoneHeader(zone) + `
    <div class="panel" style="text-align:center">
      <div style="font-weight:800">🪨 Mineral Deposit — ${zone.name}</div>
      <div style="font-size:36px;margin:6px 0">🪨</div>
    </div>
    ${questionCard(zone.questions[run.qIndexInZone])}
  `;
  bindChoices((ok) => handleAnswer(ok, zone));
}

function zoneHeader(zone) {
  const dots = run.zones.map((z, i) => {
    const cls = i < run.zoneIndex ? 'done' : i === run.zoneIndex ? 'active' : '';
    return `<div class="zone-dot ${cls}">${z.icon}</div>` + (i < run.zones.length - 1 ? '<div class="zone-line"></div>' : '');
  }).join('');
  return `
    <div class="back-link" id="back-run">← Keluar</div>
    <div class="title" style="font-size:15px">${run.planet.name} · ${zone.name}</div>
    <div class="zone-track">${dots}</div>
  `;
}

function questionCard(q) {
  if (!q) return '';
  window.__curQ = q;
  const cls = q.two ? 'choices two' : 'choices';
  const btns = q.choices.map(c => `<button class="choice-btn" data-v="${escAttr(String(c.value))}">${c.label}</button>`).join('');
  return `
    <div class="panel q-card">
      <div class="q-prompt">${q.prompt}</div>
      ${q.visual || ''}
      <div class="${cls}">${btns}</div>
      <div class="flash" id="flash"></div>
    </div>`;
}
function escAttr(s) { return s.replace(/"/g, '&quot;'); }

function bindChoices(onAnswer) {
  document.getElementById('back-run').onclick = () => { if (confirm('Keluar dari planet ini? Kemajuan run semasa akan hilang.')) route('planetmap'); };
  const q = window.__curQ;
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
      const val = btn.dataset.v;
      const ok = String(q.answer) === val;
      btn.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) {
        document.querySelectorAll('.choice-btn').forEach(b => { if (String(q.answer) === b.dataset.v) b.classList.add('correct'); });
      }
      const flash = document.getElementById('flash');
      flash.textContent = ok ? '✅ Betul!' : '❌ Silap!';
      flash.className = 'flash ' + (ok ? 'good' : 'bad');
      setTimeout(() => onAnswer(ok), 700);
    };
  });
}

function handleAnswer(ok, zone) {
  run.total++;
  const ship = getShip();
  if (zone.type === 'mining') {
    if (ok) { run.correct++; state.resources.minerals += 5; }
    else { /* no mineral gained */ }
  } else {
    // battle or boss
    const hitDmg = Math.ceil(100 / zone.questions.length);
    if (ok) { run.correct++; run.enemyHp = Math.max(0, run.enemyHp - hitDmg); state.resources.minerals += 2; }
    else { run.playerHp = Math.max(0, run.playerHp - Math.ceil(ship.hp * 0.08)); }
  }
  save();
  run.qIndexInZone++;
  if (run.playerHp <= 0) { run.playerHp = Math.ceil(run.playerHpMax * 0.5); } // forgiving: no permadeath
  if (run.qIndexInZone >= zone.questions.length) { advanceZone(); }
  else { renderZone(); }
}

function advanceZone() {
  run.zoneIndex++;
  run.qIndexInZone = 0;
  run.enemyHp = 0; run.enemyHpMax = 0;
  if (run.zoneIndex >= run.zones.length) { finishPlanetRun(); return; }
  renderZone();
}

function finishPlanetRun() {
  const planet = run.planet;
  const accuracy = run.total > 0 ? Math.round((run.correct / run.total) * 100) : 0;
  const prog = ensureProgress(planet.id);
  prog.attempts++;
  prog.correct += run.correct;
  prog.bestAccuracy = Math.max(prog.bestAccuracy, accuracy);
  const earnedStars = Math.round((accuracy / 100) * 10);
  state.resources.knowledgeStars += earnedStars;
  state.resources.exp += 20 + run.correct * 2;
  state.resources.coins += 10 + run.correct;

  const passed = accuracy >= 60;
  if (passed) {
    prog.completed = true;
    state.encyclopedia[planet.boss] = true;
    const nextPlanet = PLANETS[planet.num]; // num is 1-indexed, array is 0-indexed -> next
    if (nextPlanet) ensureProgress(nextPlanet.id).unlocked = true;
  }
  save();

  app.innerHTML = `
    <div class="panel" style="text-align:center;border-color:${planet.color}">
      <div style="font-size:40px">${passed ? '🏆' : '🌀'}</div>
      <h2 style="color:${planet.color}">${passed ? 'Planet Ditamatkan!' : 'Cubaan Belum Cukup'}</h2>
      <div class="summary-stat"><span>Ketepatan</span><span>${accuracy}%</span></div>
      <div class="summary-stat"><span>Jawapan Betul</span><span>${run.correct}/${run.total}</span></div>
      <div class="summary-stat"><span>🌟 Knowledge Stars</span><span>+${earnedStars}</span></div>
      <div class="summary-stat"><span>✨ EXP</span><span>+${20 + run.correct * 2}</span></div>
      <div class="summary-stat"><span>🪙 Coins</span><span>+${10 + run.correct}</span></div>
      ${passed ? `<div class="summary-stat"><span>👾 Encyclopedia</span><span>${planet.bossName} direkodkan!</span></div>` : `<div style="font-size:12px;color:var(--bad);margin-top:8px">Perlu sekurang-kurangnya 60% ketepatan untuk buka planet seterusnya. Cuba lagi!</div>`}
    </div>
    <div class="btn gold" id="btn-again">🔁 Main Semula Planet Ini</div>
    <div class="btn secondary" id="btn-map">🗺 Kembali ke Peta Planet</div>
  `;
  document.getElementById('btn-again').onclick = () => startPlanetRun(planet);
  document.getElementById('btn-map').onclick = () => route('planetmap');
}

/* ---------------- ENCYCLOPEDIA ---------------- */
function renderEncyclopedia() {
  const rows = PLANETS.map(p => {
    const discovered = !!state.encyclopedia[p.boss];
    return `
      <div class="encyclo-entry ${discovered ? '' : 'undiscovered'}">
        <img src="${ALIEN_ART[p.boss]}" alt="">
        <div>
          <div style="font-weight:700">${discovered ? p.bossName : '???'}</div>
          <div style="font-size:11px;color:var(--text-dim)">${discovered ? `Planet: ${p.name} · Kelemahan: ${p.weakness}` : 'Belum ditemui'}</div>
          ${discovered ? `<div style="font-size:11px;color:var(--text-dim);margin-top:2px">${p.trivia}</div>` : ''}
        </div>
      </div>`;
  }).join('');
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">📖 Encyclopedia</div>
    <div class="subtitle">Kalahkan boss planet untuk merekodkan alien.</div>
    ${rows}
  `;
  document.getElementById('back').onclick = () => route('menu');
}

/* ---------------- PARENT MODE ---------------- */
function renderParent() {
  const rows = PLANETS.map(p => {
    const prog = state.planetProgress[p.id];
    const acc = prog ? prog.bestAccuracy : 0;
    const status = !prog || (!prog.completed && prog.attempts === 0) ? 'Belum dicuba' : prog.completed ? 'Selesai' : 'Dalam percubaan';
    const weak = prog && prog.attempts > 0 && acc < 70;
    return `<div class="summary-stat"><span>${p.name}</span><span class="${weak ? 'weak-tag' : prog && prog.completed ? 'ok-tag' : ''}">${status} ${prog && prog.attempts ? '· ' + acc + '%' : ''}</span></div>`;
  }).join('');
  const weakList = PLANETS.filter(p => {
    const prog = state.planetProgress[p.id];
    return prog && prog.attempts > 0 && prog.bestAccuracy < 70;
  });
  app.innerHTML = `
    <div class="back-link" id="back">← Kembali</div>
    <div class="title">👨‍👩‍👧 Parent Dashboard</div>
    <div class="subtitle">Kemajuan pembelajaran Galaxy Matematik Tahun 1.</div>
    <div class="panel">${rows}</div>
    <div class="panel">
      <div style="font-weight:700;margin-bottom:6px">Cadangan Latihan</div>
      ${weakList.length === 0 ? '<div style="font-size:13px;color:var(--text-dim)">Tiada topik lemah setakat ini. Teruskan!</div>' : weakList.map(p => `<div style="font-size:13px" class="weak-tag">⚠ ${p.name} — ketepatan bawah 70%, cadangkan ulang kaji.</div>`).join('')}
    </div>
    <div class="panel">
      <div class="summary-stat"><span>🪨 Jumlah Mineral</span><span>${state.resources.minerals}</span></div>
      <div class="summary-stat"><span>🌟 Knowledge Stars</span><span>${state.resources.knowledgeStars}</span></div>
      <div class="summary-stat"><span>✨ Total EXP</span><span>${state.resources.exp}</span></div>
    </div>
  `;
  document.getElementById('back').onclick = () => route('menu');
}

const SCREENS = {
  menu: renderMenu,
  hangar: renderHangar,
  robot: renderRobot,
  achievements: renderAchievements,
  galaxy: renderGalaxy,
  year: renderYear,
  planetmap: renderPlanetMap,
  planetintro: renderPlanetIntro,
  encyclopedia: renderEncyclopedia,
  parent: renderParent,
};

route('menu');
