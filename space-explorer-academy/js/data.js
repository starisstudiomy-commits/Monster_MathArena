/* ============================================================
   SPACE EXPLORER ACADEMY - Data: planets, enemies, ships, robots
   Enemy artwork reused from Monster Math Arena assets.
   ============================================================ */

const ART = './assets';

const ALIEN_ART = {
  slime: `${ART}/enemies/slime.png`,
  ghost: `${ART}/enemies/ghost.png`,
  bloopy: `${ART}/enemies/bloopy.png`,
  mushy: `${ART}/enemies/mushy.png`,
  crystal: `${ART}/enemies/crystal.png`,
  dark_knight: `${ART}/enemies/dark_knight.png`,
  cubey: `${ART}/enemies/cubey.png`,
  coiny: `${ART}/enemies/coiny.png`,
  notey: `${ART}/enemies/notey.png`,
  riddly: `${ART}/enemies/riddly.png`,
  shrinky: `${ART}/enemies/shrinky.png`,
  ticky: `${ART}/enemies/ticky.png`,
  blocky: `${ART}/enemies/blocky.png`,
  stacky: `${ART}/enemies/stacky.png`,
  weighty: `${ART}/enemies/weighty.png`,
  plus_titan: `${ART}/enemies/plus_titan.png`,
  minus_reaper: `${ART}/enemies/minus_reaper.png`,
  king_coinza: `${ART}/enemies/king_coinza.png`,
  chrono_wraith: `${ART}/enemies/chrono_wraith.png`,
  geometri_golem: `${ART}/enemies/geometri_golem.png`,
  measure_titan: `${ART}/enemies/measure_titan.png`,
  boss_king: `${ART}/enemies/boss_king.png`,
  boss_dragon: `${ART}/enemies/boss_dragon.png`,
  boss_wizard: `${ART}/enemies/boss_wizard.png`,
};

const PLANETS = [
  { id: 'nombor', num: 1, name: 'Planet Nombor', topic: 'nombor', color: '#6366F1',
    grunts: ['slime', 'bloopy'], boss: 'boss_king', bossName: 'King Calculator',
    weakness: 'Kiraan Nombor', trivia: 'King Calculator mentadbir Planet Nombor dan menjaga setiap digit dengan angkuh.' },
  { id: 'tambah', num: 2, name: 'Planet Tambah', topic: 'tambah', color: '#F59E0B',
    grunts: ['cubey', 'coiny'], boss: 'plus_titan', bossName: 'Titan Overload',
    weakness: 'Operasi Tambah', trivia: 'Titan Overload membesar setiap kali dua nombor disatukan.' },
  { id: 'tolak', num: 3, name: 'Planet Tolak', topic: 'tolak', color: '#4F46E5',
    grunts: ['dark_knight', 'shrinky'], boss: 'minus_reaper', bossName: 'Void Reaper',
    weakness: 'Operasi Tolak', trivia: 'Void Reaper menghisap nombor sehingga tinggal baki sahaja.' },
  { id: 'wang', num: 4, name: 'Planet Wang', topic: 'wang', color: '#EAB308',
    grunts: ['coiny', 'blocky'], boss: 'king_coinza', bossName: 'Coinza the Magnate',
    weakness: 'Pengiraan Wang', trivia: 'Coinza the Magnate mengumpul syiling angkasa dari seluruh galaksi.' },
  { id: 'masa', num: 5, name: 'Planet Masa', topic: 'masa', color: '#06B6D4',
    grunts: ['ticky', 'notey'], boss: 'chrono_wraith', bossName: 'Eternal Chronos',
    weakness: 'Waktu & Tempoh', trivia: 'Eternal Chronos mampu memutar jam planet ke arah bertentangan.' },
  { id: 'bentuk', num: 6, name: 'Planet Bentuk', topic: 'bentuk', color: '#22D3EE',
    grunts: ['crystal', 'riddly'], boss: 'geometri_golem', bossName: 'Prism Colossus',
    weakness: 'Bentuk 2D & 3D', trivia: 'Prism Colossus dibina daripada setiap bentuk geometri yang wujud.' },
  { id: 'panjang', num: 7, name: 'Planet Panjang', topic: 'panjang', color: '#10B981',
    grunts: ['ghost', 'mushy'], boss: 'measure_titan', bossName: 'Infinity Titan (Panjang)',
    weakness: 'Ukuran Panjang', trivia: 'Infinity Titan boleh meregangkan badannya sehingga tak terhingga.' },
  { id: 'berat', num: 8, name: 'Planet Berat', topic: 'berat', color: '#8B5CF6',
    grunts: ['stacky', 'dark_knight'], boss: 'weighty', bossName: 'Weighty Prime',
    weakness: 'Ukuran Berat', trivia: 'Weighty Prime menjadi lebih berat setiap kali ia menelan asteroid.' },
  { id: 'isipadu', num: 9, name: 'Planet Isipadu', topic: 'isipadu', color: '#0EA5E9',
    grunts: ['bloopy', 'crystal'], boss: 'stacky', bossName: 'Stacky Overflow',
    weakness: 'Ukuran Isipadu', trivia: 'Stacky Overflow gemar mengisi bekas angkasa sehingga melimpah.' },
  { id: 'ulangkaji', num: 10, name: 'Planet Ulang Kaji', topic: 'ulangkaji', color: '#EF4444',
    grunts: ['boss_king', 'plus_titan'], boss: 'boss_dragon', bossName: 'Dragon Calculator',
    weakness: 'Semua Topik Tahun 1', trivia: 'Dragon Calculator menguji semua ilmu yang telah kamu pelajari sepanjang perjalanan.' },
];

const SHIPS = [
  { id: 'basic', name: 'Basic Explorer Ship', hp: 100, shield: 20, speed: 5, cargo: 10, laser: 8, cost: 0, unlocked: true },
  { id: 'falcon', name: 'Falcon MK-II', hp: 120, shield: 25, speed: 7, cargo: 12, laser: 10, cost: 300, unlocked: false },
  { id: 'nova', name: 'Nova Cruiser', hp: 140, shield: 30, speed: 6, cargo: 15, laser: 12, cost: 600, unlocked: false },
  { id: 'titan', name: 'Titan Explorer', hp: 180, shield: 40, speed: 4, cargo: 25, laser: 14, cost: 1000, unlocked: false },
  { id: 'phantom', name: 'Phantom Wing', hp: 130, shield: 22, speed: 9, cargo: 10, laser: 13, cost: 1200, unlocked: false },
  { id: 'solar', name: 'Solar Hunter', hp: 150, shield: 28, speed: 7, cargo: 14, laser: 15, cost: 1500, unlocked: false },
  { id: 'quantum', name: 'Quantum Spear', hp: 160, shield: 30, speed: 8, cargo: 12, laser: 18, cost: 1800, unlocked: false },
  { id: 'eclipse', name: 'Eclipse Rider', hp: 170, shield: 35, speed: 8, cargo: 16, laser: 19, cost: 2200, unlocked: false },
  { id: 'galaxy', name: 'Galaxy Storm', hp: 200, shield: 45, speed: 6, cargo: 20, laser: 21, cost: 2600, unlocked: false },
  { id: 'infinity', name: 'Infinity Voyager', hp: 250, shield: 55, speed: 7, cargo: 30, laser: 25, cost: 3200, unlocked: false },
];

const ROBOTS = [
  { id: 'drone', name: 'Mini Drone', icon: '🤖', skills: ['Laser Beam'] },
  { id: 'fox', name: 'Robo Fox', icon: '🦊', skills: ['Laser Beam', 'Shield'] },
  { id: 'panda', name: 'Robo Panda', icon: '🐼', skills: ['Laser Beam', 'Heal'] },
  { id: 'tiger', name: 'Robo Tiger', icon: '🐯', skills: ['Laser Beam', 'Double Attack'] },
  { id: 'dragon', name: 'Robo Dragon', icon: '🐉', skills: ['Laser Beam', 'Freeze', 'Double Attack'] },
];

// Zones inside a planet run; question counts must total 20 (matches per-chapter bank size).
const ZONE_PLAN = [
  { type: 'landing', name: 'Landing Zone', icon: '🛬' },
  { type: 'mining', name: 'Forest', icon: '🌲', questions: 3 },
  { type: 'mining', name: 'Crystal Cave', icon: '💎', questions: 3 },
  { type: 'battle', name: 'Ancient Lab', icon: '⚡', label: 'Ancient Machine', questions: 3 },
  { type: 'battle', name: 'Alien Base', icon: '👾', label: 'Alien Patrol', questions: 3 },
  { type: 'boss', name: 'Boss Area', icon: '👑', questions: 8 },
];
