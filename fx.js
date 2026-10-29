// ===================== FX: PIXEL CUTSCENES, ACTION ANIMATIONS, 8-BIT SFX =====================
// Loaded after game.js. Wraps a few game functions to add visuals without changing game rules.
// Cutscenes block game flow only in single player; in multiplayer they play over the game
// without delaying the host, so other players are never kept waiting.
(function () {
  'use strict';

  const W = 192, H = 108;          // native pixel resolution of cutscene canvas
  const GROUND = 88;

  // ---------- settings (per-viewer, safe if storage is blocked) ----------
  function loadPref(key, def) {
    try { const v = localStorage.getItem(key); return v === null ? def : v === '1'; } catch (e) { return def; }
  }
  function savePref(key, val) {
    try { localStorage.setItem(key, val ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  const prefs = {
    cutscenes: loadPref('fx_cutscenes', true),
    sound: loadPref('fx_sound', true),
  };

  // ---------- styles ----------
  const css = `
  #fx-cutscene{position:fixed;inset:0;z-index:2000;background:#000;display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;animation:fxFadeIn .35s ease}
  #fx-cutscene.show{display:flex}
  #fx-cutscene canvas{width:min(96vw,calc(70vh * 16 / 9));aspect-ratio:16/9;image-rendering:pixelated;image-rendering:crisp-edges;border-top:6px solid #000;border-bottom:6px solid #000}
  #fx-caption{margin-top:14px;min-height:56px;max-width:min(92vw,720px);text-align:center;color:#f3ecd2;font-family:'Noto Sans Thai',sans-serif;font-weight:700;font-size:clamp(16px,3.2vw,26px);letter-spacing:1px;text-shadow:3px 3px 0 #000,-1px -1px 0 #000,0 0 12px rgba(122,171,58,.6)}
  #fx-caption small{display:block;font-weight:500;font-size:.6em;color:#b9c7a6;margin-top:4px;letter-spacing:.5px}
  #fx-skip{position:absolute;bottom:14px;right:16px;font:600 11px 'Noto Sans Thai',sans-serif;color:#8a9a80;animation:fxBlink 1.2s steps(2) infinite}
  #fx-layer{position:fixed;inset:0;pointer-events:none;z-index:1500;overflow:hidden}
  .fx-float{position:absolute;font:800 15px 'Noto Sans Thai',sans-serif;text-shadow:2px 2px 0 #000;white-space:nowrap;animation:fxFloat 1.4s ease-out forwards}
  .fx-pop{position:absolute;font-size:56px;transform:translate(-50%,-50%);animation:fxPop .9s cubic-bezier(.2,1.6,.4,1) forwards;filter:drop-shadow(0 4px 0 rgba(0,0,0,.5))}
  .fx-spark{position:absolute;width:6px;height:6px;background:#ffd34d;box-shadow:0 0 6px #ffb300;animation:fxSpark .7s ease-out forwards}
  .fx-hurt{animation:fxHurt .45s steps(2)}
  .fx-heal{animation:fxHeal .8s ease-out}
  body.fx-shake{animation:fxShake .35s steps(6)}
  #fx-toggles{position:fixed;bottom:12px;left:12px;z-index:1600;display:flex;gap:6px}
  #fx-toggles button{width:34px;height:34px;border-radius:8px;border:1px solid var(--border,#334);background:rgba(10,14,12,.85);color:#fff;font-size:16px;cursor:pointer;opacity:.75}
  #fx-toggles button:hover{opacity:1}
  #fx-toggles button.off{filter:grayscale(1);opacity:.4}
  #fx-duel{display:block;width:100%;aspect-ratio:16/6;image-rendering:pixelated;image-rendering:crisp-edges;border-radius:8px;margin-bottom:10px;background:#0b1410}
  @keyframes fxFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fxBlink{50%{opacity:0}}
  @keyframes fxFloat{0%{opacity:0;transform:translate(-50%,0) scale(.7)}15%{opacity:1;transform:translate(-50%,-8px) scale(1.15)}100%{opacity:0;transform:translate(-50%,-56px) scale(1)}}
  @keyframes fxPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(-20deg)}40%{opacity:1;transform:translate(-50%,-50%) scale(1.25) rotate(6deg)}75%{opacity:1;transform:translate(-50%,-60%) scale(1)}100%{opacity:0;transform:translate(-50%,-90%) scale(.9)}}
  @keyframes fxSpark{to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
  @keyframes fxHurt{0%,100%{transform:none;box-shadow:none}25%{transform:translateX(-4px);box-shadow:0 0 0 2px #e04040 inset}75%{transform:translateX(4px);box-shadow:0 0 0 2px #e04040 inset}}
  @keyframes fxHeal{0%{box-shadow:0 0 0 0 rgba(122,220,90,.0)}30%{box-shadow:0 0 18px 4px rgba(122,220,90,.55)}100%{box-shadow:0 0 0 0 rgba(122,220,90,0)}}
  @keyframes fxShake{0%,100%{transform:none}20%{transform:translate(-5px,2px)}40%{transform:translate(5px,-2px)}60%{transform:translate(-3px,-2px)}80%{transform:translate(3px,2px)}}
  @media (prefers-reduced-motion: reduce){body.fx-shake,.fx-hurt{animation:none}}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- DOM ----------
  const overlay = document.createElement('div');
  overlay.id = 'fx-cutscene';
  overlay.innerHTML = '<canvas width="' + W + '" height="' + H + '"></canvas><div id="fx-caption"></div><div id="fx-skip">คลิก / Space เพื่อข้าม ▶</div>';
  document.body.appendChild(overlay);
  const cv = overlay.querySelector('canvas');
  // drawing helpers draw into `ctx`; drawWith() temporarily points it at another canvas
  let ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const captionEl = overlay.querySelector('#fx-caption');

  const layer = document.createElement('div');
  layer.id = 'fx-layer';
  document.body.appendChild(layer);

  const toggles = document.createElement('div');
  toggles.id = 'fx-toggles';
  toggles.innerHTML = '<button id="fx-t-cut" title="เปิด/ปิดคัตซีน">🎬</button><button id="fx-t-snd" title="เปิด/ปิดเสียง">🔊</button>';
  document.body.appendChild(toggles);
  const btnCut = toggles.querySelector('#fx-t-cut');
  const btnSnd = toggles.querySelector('#fx-t-snd');
  function syncToggles() {
    btnCut.classList.toggle('off', !prefs.cutscenes);
    btnSnd.classList.toggle('off', !prefs.sound);
    btnSnd.textContent = prefs.sound ? '🔊' : '🔇';
  }
  btnCut.onclick = () => { prefs.cutscenes = !prefs.cutscenes; savePref('fx_cutscenes', prefs.cutscenes); syncToggles(); };
  btnSnd.onclick = () => { prefs.sound = !prefs.sound; savePref('fx_sound', prefs.sound); syncToggles(); if (prefs.sound) sfx('pickup'); };
  syncToggles();

  // ---------- 8-bit sound ----------
  let audio = null;
  function tone(freq, start, dur, type, vol, slideTo) {
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
    g.gain.setValueAtTime(vol || 0.06, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(audio.destination);
    o.start(start); o.stop(start + dur + 0.02);
  }
  function noise(start, dur, vol) {
    const len = Math.floor(audio.sampleRate * dur);
    const buf = audio.createBuffer(1, len, audio.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = audio.createBufferSource(), g = audio.createGain();
    s.buffer = buf; g.gain.value = vol || 0.08;
    s.connect(g).connect(audio.destination); s.start(start);
  }
  const SFX = {
    hit:     t => { noise(t, 0.12, 0.12); tone(180, t, 0.12, 'square', 0.06, 60); },
    hurt:    t => { tone(220, t, 0.25, 'sawtooth', 0.06, 70); },
    pickup:  t => { tone(660, t, 0.07); tone(990, t + 0.07, 0.1); },
    heal:    t => { [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.08, 0.14, 'triangle', 0.07)); },
    craft:   t => { noise(t, 0.05, 0.08); tone(880, t + 0.05, 0.06); noise(t + 0.12, 0.05, 0.08); tone(1320, t + 0.17, 0.12); },
    step:    t => { tone(120, t, 0.05, 'triangle', 0.05); },
    alert:   t => { tone(880, t, 0.08); tone(880, t + 0.12, 0.08); tone(1175, t + 0.24, 0.2); },
    day:     t => { [392, 523, 659, 784].forEach((f, i) => tone(f, t + i * 0.12, 0.2, 'triangle', 0.06)); },
    night:   t => { [392, 330, 262].forEach((f, i) => tone(f, t + i * 0.22, 0.35, 'triangle', 0.05)); },
    death:   t => { [392, 370, 349, 330, 196].forEach((f, i) => tone(f, t + i * 0.2, 0.3, 'square', 0.05)); },
    victory: t => { [523, 523, 523, 659, 784, 1047].forEach((f, i) => tone(f, t + [0, .12, .24, .4, .56, .75][i], i === 5 ? 0.6 : 0.14, 'square', 0.06)); },
    defeat:  t => { [330, 311, 294, 277].forEach((f, i) => tone(f, t + i * 0.3, 0.45, 'sawtooth', 0.045)); },
    click:   t => { tone(520, t, 0.04, 'square', 0.035); },
    turn:    t => { tone(784, t, 0.09, 'triangle', 0.06); tone(1047, t + 0.1, 0.16, 'triangle', 0.06); },
  };
  function sfx(name) {
    if (!prefs.sound || !SFX[name]) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      SFX[name](audio.currentTime + 0.01);
    } catch (e) { /* audio unavailable */ }
  }

  // ---------- pixel drawing helpers ----------
  function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function sky(top, bottom, bands) {
    const n = bands || 9;
    const a = hex(top), b = hex(bottom);
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1);
      R(0, Math.floor(i * GROUND / n), W, Math.ceil(GROUND / n) + 1,
        `rgb(${a[0] + (b[0] - a[0]) * k | 0},${a[1] + (b[1] - a[1]) * k | 0},${a[2] + (b[2] - a[2]) * k | 0})`);
    }
  }
  function hex(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }

  function stars(t, count) {
    const r = rng(7);
    for (let i = 0; i < count; i++) {
      const x = r() * W | 0, y = r() * 60 | 0, ph = r() * 6;
      if (Math.sin(t * 3 + ph) > -0.3) R(x, y, 1, 1, Math.sin(t * 3 + ph) > 0.6 ? '#ffffff' : '#9fb0d0');
    }
  }
  function pine(x, base, h, col, dark) {
    R(x - 1, base - 3, 2, 3, '#4a2f1c');
    for (let r = 0; r < h; r++) {
      const w = 1 + Math.floor((r % Math.ceil(h / 3)) * 0.9 + r * 0.35);
      R(x - w, base - 3 - h + r, w * 2, 1, (r % 3 === 0 && dark) ? dark : col);
    }
  }
  function forestLayer(scroll, seed, base, minH, maxH, col, dark, gap) {
    const r = rng(seed);
    const span = W + 40;
    R(0, base - 4, W, GROUND - base + 5, dark || col); // undergrowth so no sky shows under the trees
    for (let i = 0; i < 40; i++) {
      const x0 = i * gap + r() * gap * 0.6;
      const h = minH + r() * (maxH - minH) | 0;
      let x = ((x0 - scroll) % span + span) % span - 20;
      pine(x, base, h, col, dark);
    }
  }
  function ground(col, top) {
    R(0, GROUND, W, H - GROUND, col);
    R(0, GROUND, W, 1, top || col);
    const r = rng(3);
    for (let i = 0; i < 50; i++) R(r() * W, GROUND + 2 + r() * (H - GROUND - 3), 1, 1, 'rgba(0,0,0,.25)');
  }
  function person(x, y, shirt, frame, pose) {
    const skin = '#e8b88a', hair = '#3a2414', pants = '#3b3f5a';
    R(x + 2, y - 1, 3, 1, hair);
    R(x + 2, y, 3, 3, skin);
    R(x + 1, y + 3, 5, 4, shirt);
    if (pose === 'wave') { R(x + 6, y - 1 + (frame ? 1 : 0), 1, 4, skin); R(x, y + 3, 1, 3, skin); }
    else if (pose === 'sit') { R(x, y + 4, 1, 2, skin); R(x + 6, y + 4, 1, 2, skin); }
    else { R(x, y + 3 + (frame ? 1 : 0), 1, 3, skin); R(x + 6, y + 4 - (frame ? 1 : 0), 1, 3, skin); }
    if (pose === 'sit') { R(x + 1, y + 7, 6, 2, pants); return; }
    if (frame) { R(x + 1, y + 7, 2, 3, pants); R(x + 4, y + 7, 2, 3, pants); R(x, y + 10, 2, 1, '#222'); R(x + 5, y + 10, 2, 1, '#222'); }
    else { R(x + 2, y + 7, 2, 3, pants); R(x + 4, y + 7, 2, 3, pants); R(x + 2, y + 10, 2, 1, '#222'); R(x + 4, y + 10, 2, 1, '#222'); }
  }
  function campfire(x, y, t) {
    R(x - 5, y - 1, 10, 2, '#5a3a22'); R(x - 4, y - 2, 3, 1, '#6e4a2c'); R(x + 1, y - 2, 3, 1, '#6e4a2c');
    const r = rng((t * 12) | 0);
    for (let i = 0; i < 16; i++) {
      const fx = x - 3 + r() * 6 | 0, fy = y - 3 - r() * 9 | 0;
      const k = (y - fy) / 10;
      R(fx, fy, 1, 1, k > 0.7 ? '#ffe36b' : k > 0.35 ? '#ff9a2e' : '#e0402a');
    }
    // glow
    ctx.fillStyle = 'rgba(255,150,50,0.08)';
    ctx.beginPath(); ctx.arc(x, y - 4, 26 + Math.sin(t * 9) * 2, 0, 7); ctx.fill();
  }
  function animalKind(name) {
    name = name || '';
    if (/หมี/.test(name)) return 'bear';
    if (/เสือ|แมวป่า/.test(name)) return 'tiger';
    if (/จระเข้/.test(name)) return 'croc';
    if (/หมูป่า/.test(name)) return 'boar';
    if (/งู/.test(name)) return 'snake';
    if (/หมาจิ้งจอก|สุนัข/.test(name)) return 'wolf';
    if (/ค้างคาว|นก|ผึ้ง|แมลง|อินทรี/.test(name)) return 'flyer';
    if (/ลิง|กระรอก|กระต่าย|กวาง/.test(name)) return 'small';
    return 'wolf';
  }
  // draws an animal facing left with its feet on y
  function animal(kind, x, y, t, flash) {
    const c = (col) => flash ? '#ffffff' : col;
    const bob = Math.round(Math.sin(t * 6));
    if (kind === 'bear') {
      R(x, y - 14 + bob, 18, 10, c('#4a3122')); R(x - 5, y - 15 + bob, 7, 7, c('#4a3122'));
      R(x - 5, y - 16 + bob, 2, 2, c('#3a2418')); R(x, y - 16 + bob, 2, 2, c('#3a2418'));
      R(x - 6, y - 11 + bob, 2, 2, c('#1a1a1a')); R(x - 3, y - 13 + bob, 1, 1, '#ffef9a');
      R(x + 1, y - 4, 3, 4, c('#3a2418')); R(x + 13, y - 4, 3, 4, c('#3a2418'));
    } else if (kind === 'tiger') {
      R(x, y - 10 + bob, 16, 6, c('#e08a2a')); R(x - 5, y - 12 + bob, 6, 6, c('#e08a2a'));
      for (let i = 2; i < 16; i += 4) R(x + i, y - 10 + bob, 1, 6, c('#1a1a1a'));
      R(x - 3, y - 10 + bob, 1, 1, '#9fff6a'); R(x + 16, y - 11 + bob, 5, 1, c('#e08a2a'));
      R(x + 1, y - 4, 2, 4, c('#c06a1a')); R(x + 12, y - 4, 2, 4, c('#c06a1a'));
    } else if (kind === 'croc') {
      R(x, y - 4, 24, 4, c('#3f7a3a')); R(x - 8, y - 3, 9, 2, c('#3f7a3a'));
      for (let i = -7; i < 0; i += 2) R(x + i, y - 1, 1, 1, '#fff');
      R(x - 2, y - 5, 1, 1, '#ffef4a'); for (let i = 3; i < 22; i += 3) R(x + i, y - 5, 1, 1, c('#2c5a28'));
    } else if (kind === 'boar') {
      R(x, y - 9 + bob, 14, 6, c('#5e4030')); R(x - 4, y - 8 + bob, 5, 5, c('#5e4030'));
      R(x - 5, y - 5 + bob, 2, 2, c('#7a5844')); R(x - 4, y - 7 + bob, 1, 2, '#fff');
      R(x + 1, y - 3, 2, 3, c('#3e2a20')); R(x + 10, y - 3, 2, 3, c('#3e2a20'));
      for (let i = 0; i < 12; i += 2) R(x + i, y - 10 + bob, 1, 1, c('#3e2a20'));
    } else if (kind === 'snake') {
      for (let i = 0; i < 20; i++) R(x + i, y - 3 - Math.round(Math.sin(i * 0.6 + t * 8) * 2), 2, 2, c(i % 4 < 2 ? '#4f9a3a' : '#3c7a2c'));
      R(x - 3, y - 6, 4, 3, c('#4f9a3a')); R(x - 3, y - 6, 1, 1, '#ff3a3a'); R(x - 5, y - 4, 2, 1, '#e0405a');
    } else if (kind === 'flyer') {
      const f = Math.sin(t * 20) > 0;
      R(x, y - 18, 4, 3, c('#2a2a2e'));
      R(x - 5, y - 18 - (f ? 3 : -1), 5, 2, c('#2a2a2e')); R(x + 4, y - 18 - (f ? 3 : -1), 5, 2, c('#2a2a2e'));
      R(x + 1, y - 17, 1, 1, '#ff4040');
    } else if (kind === 'small') {
      R(x, y - 6 + bob, 8, 4, c('#9a7048')); R(x - 3, y - 8 + bob, 4, 4, c('#9a7048'));
      R(x - 2, y - 7 + bob, 1, 1, '#111'); R(x + 1, y - 2, 1, 2, c('#7a5434')); R(x + 6, y - 2, 1, 2, c('#7a5434'));
    } else { // wolf
      R(x, y - 9 + bob, 13, 5, c('#7d7f86')); R(x - 4, y - 11 + bob, 5, 5, c('#7d7f86'));
      R(x - 4, y - 13 + bob, 1, 2, c('#5d5f66')); R(x - 1, y - 13 + bob, 1, 2, c('#5d5f66'));
      R(x - 6, y - 9 + bob, 2, 2, c('#5d5f66')); R(x - 3, y - 10 + bob, 1, 1, '#ffd84a');
      R(x + 13, y - 10 + bob, 4, 2, c('#7d7f86'));
      R(x + 1, y - 4, 2, 4, c('#5d5f66')); R(x + 10, y - 4, 2, 4, c('#5d5f66'));
    }
  }
  function heli(x, y, t) {
    const r = Math.sin(t * 40) > 0;
    R(x - (r ? 16 : 6), y - 7, r ? 32 : 12, 1, '#222');
    R(x - 1, y - 6, 2, 2, '#333');
    R(x - 8, y - 4, 16, 7, '#c8402a'); R(x - 6, y - 3, 6, 4, '#9ad0ff');
    R(x + 8, y - 2, 14, 2, '#c8402a'); R(x + 21, y - 5, 2, 6, '#c8402a');
    R(x - 7, y + 4, 14, 1, '#333'); R(x - 5, y + 3, 1, 1, '#333'); R(x + 4, y + 3, 1, 1, '#333');
    if (Math.sin(t * 6) > 0) R(x - 9, y, 1, 1, '#ffef4a');
  }
  function letterbox() { R(0, 0, W, 6, '#000'); R(0, H - 6, W, 6, '#000'); }
  function fadeIn(t, d) { if (t < d) { ctx.fillStyle = `rgba(0,0,0,${1 - t / d})`; ctx.fillRect(0, 0, W, H); } }
  function fadeOut(t, dur, d) { if (t > dur - d) { ctx.fillStyle = `rgba(0,0,0,${(t - (dur - d)) / d})`; ctx.fillRect(0, 0, W, H); } }

  const SHIRTS = ['#7aab3a', '#3a7ab0', '#c03070', '#d4902a'];
  function shirtFor(i) {
    try { return (window.PLAYER_COLORS || SHIRTS)[i] || SHIRTS[i % 4]; } catch (e) { return SHIRTS[i % 4]; }
  }

  // location-specific backdrop for the explore scene
  function locationBackdrop(id, t, scroll) {
    switch (id) {
      case 'cave': case 'temple': case 'ruins': case 'graveyard': case 'hut':
        sky('#2a3340', '#56607a'); break;
      case 'river': case 'waterfall': case 'swamp':
        sky('#5aa0d8', '#bfe3f2'); break;
      case 'cliff':
        sky('#7ab0e0', '#e9d7b0'); break;
      case 'meadow': case 'orchard':
        sky('#6fb6e8', '#e8f3d0'); break;
      default:
        sky('#4f8f6a', '#b8d8a0');
    }
    if (id === 'cliff') {
      for (let i = 0; i < 4; i++) {
        const mx = ((i * 70 - scroll * 0.2) % 280 + 280) % 280 - 40;
        for (let r = 0; r < 40; r++) R(mx + r * 0.9, GROUND - r, 70 - r * 1.8, 1, r > 32 ? '#f2f2f2' : '#6a6f80');
      }
    }
    forestLayer(scroll * 0.3, 11, GROUND - 6, 14, 26, '#2f5a46', '#284d3c', 14);
    forestLayer(scroll * 0.6, 21, GROUND, 18, 34, '#24482e', '#1c3a25', 18);
    if (id === 'river' || id === 'waterfall' || id === 'swamp') {
      ground(id === 'swamp' ? '#3f4f2a' : '#3c6a2c', '#5a8a3a');
      R(0, GROUND + 6, W, 8, id === 'swamp' ? '#4a5e3a' : '#2f7ac0');
      for (let i = 0; i < 12; i++) R(((i * 19 - t * 30) % W + W) % W, GROUND + 8 + (i % 3) * 2, 5, 1, '#9fd4ff');
      if (id === 'waterfall') { R(150, 20, 18, GROUND - 14, '#7ac0f0'); for (let i = 0; i < 8; i++) R(151 + i * 2, 20 + ((t * 60 + i * 7) % (GROUND - 14)), 1, 4, '#e8f6ff'); }
    } else if (id === 'cave' || id === 'temple') {
      ground('#3a3a42', '#55555f');
      R(130, GROUND - 34, 50, 34, '#4a4a54'); R(142, GROUND - 22, 24, 22, '#0a0a0e');
      if (id === 'temple') { R(128, GROUND - 40, 54, 6, '#8a6a3a'); R(150, GROUND - 52, 10, 12, '#c9a24a'); }
    } else if (id === 'ruins' || id === 'graveyard' || id === 'hut') {
      ground('#4a4a3a', '#66664e');
      R(132, GROUND - 26, 40, 26, id === 'hut' ? '#6e4a2c' : '#5e5e66');
      R(140, GROUND - 16, 8, 16, '#1a1a1e'); R(155, GROUND - 20, 8, 6, '#9ad0ff');
      R(128, GROUND - 30, 48, 4, id === 'hut' ? '#8a5a2a' : '#4a4a52');
    } else {
      ground('#3c6a2c', '#5a9a3a');
      if (id === 'orchard') for (let i = 0; i < 10; i++) R(20 + i * 17, GROUND - 22 + (i % 3) * 4, 2, 2, '#e04040');
    }
  }

  // ---------- scenes: each has a duration and draw(t, data) ----------
  const SCENES = {
    intro: {
      dur: 5.2, sound: 'night',
      caption: d => ['🌲 หลงป่า', 'เครื่องบินตก... ผู้รอดชีวิต 4 คนต้องอยู่ให้รอด 7 วัน'],
      draw(t) {
        sky('#0b1026', '#2a2350');
        stars(t, 50);
        R(150, 14, 8, 8, '#f0e8c0'); R(152, 14, 6, 6, '#0b1026'); // crescent moon
        forestLayer(0, 5, GROUND - 4, 16, 30, '#14261f', null, 15);
        ground('#18301f', '#24452a');
        // crashed plane
        R(118, GROUND - 8, 40, 8, '#9aa0a8'); R(150, GROUND - 16, 10, 10, '#8a9098'); R(126, GROUND - 12, 18, 4, '#7a8088');
        for (let i = 0; i < 5; i++) R(124 + i * 6, GROUND - 6, 3, 3, '#5a7a9a');
        const r = rng((t * 10) | 0);
        for (let i = 0; i < 10; i++) R(156 + r() * 6, GROUND - 18 - r() * 6, 2, 2, r() > 0.5 ? '#ff8a2a' : '#ffd34d');
        for (let i = 0; i < 6; i++) { const sy = (t * 10 + i * 9) % 50; R(158 + Math.sin(sy * 0.2 + i) * 4, GROUND - 22 - sy, 3, 3, `rgba(120,120,130,${0.6 - sy / 90})`); }
        // survivors walk out of the wreck
        for (let i = 0; i < 4; i++) {
          const x = 120 - Math.min(t, 3.5) * (18 + i * 4) - i * 4;
          person(x, GROUND - 11, shirtFor(i), (t * 6 + i) % 2 | 0, t > 3.5 ? 'idle' : 'walk');
        }
        letterbox(); fadeIn(t, 0.8); fadeOut(t, this.dur, 0.5);
      }
    },
    day: {
      dur: 3.0, sound: 'day',
      caption: d => [`☀️ วันที่ ${d.day} / 7`, d.day === 7 ? 'วันสุดท้าย... ทีมกู้ภัยอาจมาถึง!' : 'ดวงอาทิตย์ขึ้นแล้ว — ออกไปหาเสบียงกันเถอะ'],
      draw(t) {
        const k = Math.min(1, t / 2.2);
        sky(k < 0.5 ? '#2a3a6a' : '#5aa0e0', k < 0.5 ? '#e08a4a' : '#ffe3a0');
        const sunY = GROUND + 6 - k * 50;
        ctx.fillStyle = '#ffd84a'; ctx.beginPath(); ctx.arc(96, sunY, 10, 0, 7); ctx.fill();
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t; R(96 + Math.cos(a) * 15, sunY + Math.sin(a) * 15, 2, 2, '#ffe88a'); }
        forestLayer(t * 4, 8, GROUND - 4, 16, 28, '#2f5a46', '#284d3c', 14);
        forestLayer(t * 8, 18, GROUND, 20, 36, '#1f3f28', '#183220', 18);
        ground('#2f5a24', '#4a8a34');
        // birds
        for (let i = 0; i < 3; i++) { const bx = (t * 40 + i * 30) % (W + 20) - 10, by = 20 + i * 6; const f = Math.sin(t * 14 + i) > 0; R(bx, by, 1, 1, '#222'); R(bx - 2, by - (f ? 1 : 0), 2, 1, '#222'); R(bx + 1, by - (f ? 1 : 0), 2, 1, '#222'); }
        letterbox(); fadeIn(t, 0.5); fadeOut(t, this.dur, 0.4);
      }
    },
    night: {
      dur: 3.2, sound: 'night',
      caption: d => [`🌙 คืนที่ ${d.day} ผ่านไป...`, `ผู้รอดชีวิต ${d.alive} คนนั่งล้อมกองไฟ`],
      draw(t, d) {
        sky('#05081a', '#1a1a3a');
        stars(t, 70);
        ctx.fillStyle = '#e8e4c8'; ctx.beginPath(); ctx.arc(40, 22, 7, 0, 7); ctx.fill();
        forestLayer(0, 9, GROUND - 2, 18, 32, '#0d1a14', null, 15);
        ground('#101c12', '#18281a');
        campfire(96, GROUND, t);
        const seats = [[72, 0], [110, 1], [82, 2], [104, 3]];
        for (let i = 0; i < Math.min(4, d.aliveIdx.length); i++) {
          const [sx] = seats[i];
          person(sx, GROUND - 9, shirtFor(d.aliveIdx[i]), 0, 'sit');
        }
        // fireflies
        for (let i = 0; i < 7; i++) { const fx = (Math.sin(t * 0.7 + i * 2) * 0.5 + 0.5) * W, fy = 40 + Math.sin(t * 1.3 + i) * 18; if (Math.sin(t * 5 + i) > 0) R(fx, fy, 1, 1, '#d8ff6a'); }
        letterbox(); fadeIn(t, 0.5); fadeOut(t, this.dur, 0.5);
      }
    },
    explore: {
      dur: 2.6, sound: 'step',
      caption: d => [`${d.emoji || '🌿'} ${d.name}`, `${d.player} ออกเดินทางสำรวจ...`],
      draw(t, d) {
        const scroll = t * 40;
        locationBackdrop(d.id, t, scroll);
        const x = 30 + Math.min(t, 2) * 22;
        person(x, GROUND - 11, d.shirt, (t * 8) % 2 | 0, 'walk');
        if (((t * 8) | 0) !== ((t * 8 - 0.05) | 0) && ((t * 8) | 0) % 2 === 0) sfx('step');
        letterbox(); fadeIn(t, 0.4); fadeOut(t, this.dur, 0.4);
      }
    },
    encounter: {
      dur: 2.4, sound: 'alert',
      caption: d => [`⚠️ ${d.animal}!`, 'สัตว์ร้ายขวางทางอยู่ข้างหน้า'],
      draw(t, d) {
        locationBackdrop(d.id, t, 0);
        ctx.fillStyle = 'rgba(120,0,0,0.25)'; ctx.fillRect(0, 0, W, H);
        const ax = W + 10 - Math.min(1, t / 0.7) * 70;
        const shake = t > 0.7 && t < 1.1 ? (Math.random() * 4 - 2) : 0;
        animal(animalKind(d.animal), ax + shake, GROUND, t, false);
        person(50, GROUND - 11, d.shirt, 0, 'idle');
        if (t > 0.3 && Math.sin(t * 16) > -0.2) { R(52, GROUND - 22, 2, 6, '#ffd34d'); R(52, GROUND - 15, 2, 2, '#ffd34d'); }
        letterbox(); fadeIn(t, 0.2); fadeOut(t, this.dur, 0.3);
      }
    },
    death: {
      dur: 3.2, sound: 'death',
      caption: d => [`☠️ ${d.name} เสียชีวิต`, 'ป่าแห่งนี้ไม่ปรานีใคร...'],
      draw(t) {
        sky('#1a1a22', '#3a3a44');
        for (let i = 0; i < 60; i++) { const r = rng(i); R(r() * W, ((r() * H + t * 70) % H), 1, 3, 'rgba(160,170,200,.5)'); }
        forestLayer(0, 4, GROUND - 2, 16, 30, '#1e2420', null, 15);
        ground('#262a24', '#323830');
        const rise = Math.min(1, t / 1.2);
        R(90, GROUND - 18 * rise, 12, 18 * rise, '#6a6a72'); R(91, GROUND - 18 * rise, 10, 2, '#8a8a92');
        if (rise >= 1) { R(95, GROUND - 15, 2, 9, '#2a2a30'); R(92, GROUND - 12, 8, 2, '#2a2a30'); }
        R(86, GROUND - 2, 20, 2, '#3a2a1c');
        if (t > 1.4) for (let i = 0; i < 3; i++) R(88 + i * 6, GROUND - 3, 2, 2, ['#e04070', '#f0d040', '#e0e0ff'][i]);
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, W, H);
        letterbox(); fadeIn(t, 0.6); fadeOut(t, this.dur, 0.6);
      }
    },
    victory: {
      dur: 5.0, sound: 'victory',
      // d.ending comes from assets/gameplay.js when it is loaded
      caption: d => d.ending ? [`${d.ending.icon} ${d.ending.title}`, d.ending.text]
                             : ['🚁 รอดชีวิตแล้ว!', `${d.names} ได้รับการช่วยเหลือ!`],
      draw(t, d) {
        sky('#4a90d8', '#ffe8a8');
        ctx.fillStyle = '#ffd84a'; ctx.beginPath(); ctx.arc(160, 26, 10, 0, 7); ctx.fill();
        forestLayer(0, 12, GROUND - 4, 14, 26, '#3a6a4a', null, 14);
        ground('#3c7a2c', '#5aa03a');
        if (!d.ending || ['legend', 'rescued'].includes(d.ending.id)) { // no helicopter unless rescued
          const hx = W + 30 - Math.min(1, t / 2.4) * 120, hy = 18 + Math.min(1, t / 2.4) * 34 + Math.sin(t * 3) * 2;
          heli(hx, hy, t);
          if (t > 2.4) { // rope ladder
            for (let i = 0; i < 12; i++) R(hx - 1, hy + 4 + i * 2, 1, 1, '#c9a24a');
          }
        }
        d.aliveIdx.forEach((pi, i) => person(40 + i * 14, GROUND - 11, shirtFor(pi), (t * 4 + i) % 2 | 0, 'wave'));
        // confetti
        if (t > 2.6) { const r = rng((t * 8) | 0); for (let i = 0; i < 26; i++) R(r() * W, r() * GROUND, 2, 2, ['#e04040', '#ffd34d', '#4ad0ff', '#7ae04a'][i % 4]); }
        letterbox(); fadeIn(t, 0.5); fadeOut(t, this.dur, 0.6);
      }
    },
    defeat: {
      dur: 4.0, sound: 'defeat',
      caption: d => d.ending ? [`${d.ending.icon} ${d.ending.title}`, d.ending.text]
                             : ['💀 ป่ากลืนกินทุกคน...', 'ไม่มีใครรอดพ้นจากป่าดงดิบแห่งนี้'],
      draw(t) {
        sky('#08080c', '#20141a');
        forestLayer(t * 2, 6, GROUND - 2, 18, 34, '#0e1210', null, 13);
        ground('#121410', '#1a1e18');
        for (let i = 0; i < 4; i++) { R(40 + i * 34, GROUND - 10, 8, 10, '#4a4a52'); R(43 + i * 34, GROUND - 8, 2, 6, '#222'); R(41 + i * 34, GROUND - 6, 6, 1, '#222'); }
        for (let i = 0; i < 5; i++) { const fx = ((t * 12 + i * 50) % (W + 60)) - 30; ctx.fillStyle = 'rgba(180,180,200,.10)'; ctx.fillRect(fx, GROUND - 14 + i * 2, 60, 6); }
        // glowing eyes in the dark
        if (Math.sin(t * 2) > -0.5) { R(30, 50, 2, 1, '#ff3030'); R(35, 50, 2, 1, '#ff3030'); R(160, 44, 2, 1, '#ffd030'); R(165, 44, 2, 1, '#ffd030'); }
        letterbox(); fadeIn(t, 0.8); fadeOut(t, this.dur, 0.6);
      }
    },
  };

  // ---------- cutscene player ----------
  let queue = Promise.resolve();
  let skipRequested = false;
  overlay.addEventListener('click', () => { skipRequested = true; });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('show')) return;
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') { e.preventDefault(); skipRequested = true; }
  });

  function typeCaption(lines, t, dur) {
    const [title, sub] = lines;
    const k = Math.min(1, t / Math.min(1.2, dur * 0.4));
    const chars = Array.from(title);
    const shown = chars.slice(0, Math.ceil(chars.length * k)).join('');
    captionEl.innerHTML = '';
    captionEl.append(shown);
    if (sub && k >= 1) { const s = document.createElement('small'); s.textContent = sub; captionEl.append(s); }
  }

  function runScene(name, data) {
    const scene = SCENES[name];
    return new Promise((resolve) => {
      if (!scene || !prefs.cutscenes) return resolve();
      skipRequested = false;
      overlay.classList.add('show');
      sfx(scene.sound);
      const lines = scene.caption(data);
      const t0 = performance.now();
      let raf = 0;
      // fallback in case rAF is throttled (hidden tab): never block the game for long
      const hardStop = setTimeout(finish, (scene.dur + 1.5) * 1000);
      function frame(now) {
        const t = (now - t0) / 1000;
        try { scene.draw(t, data); } catch (e) { console.warn('[fx] scene draw failed', e); return finish(); }
        typeCaption(lines, t, scene.dur);
        if (t >= scene.dur || skipRequested) return finish();
        raf = requestAnimationFrame(frame);
      }
      function finish() {
        clearTimeout(hardStop); cancelAnimationFrame(raf);
        if (!overlay.classList.contains('show')) return resolve();
        overlay.classList.remove('show');
        captionEl.textContent = '';
        resolve();
      }
      raf = requestAnimationFrame(frame);
    });
  }

  function play(name, data) {
    const p = queue.then(() => runScene(name, data || {}));
    queue = p.catch(() => {});
    return p;
  }

  // ---------- small animations on the page ----------
  function centerOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top };
  }
  function floatText(el, text, color, offset) {
    if (!el) return;
    const c = centerOf(el);
    if (c.x === 0 && c.y === 0) return;
    const f = document.createElement('div');
    f.className = 'fx-float';
    f.textContent = text;
    f.style.color = color;
    f.style.left = (c.x + (offset || 0)) + 'px';
    f.style.top = (c.top + 24) + 'px';
    layer.appendChild(f);
    setTimeout(() => f.remove(), 1500);
  }
  function pop(emoji, el) {
    const target = el || document.getElementById('story-box');
    const c = target ? centerOf(target) : { x: innerWidth / 2, y: innerHeight / 2 };
    const p = document.createElement('div');
    p.className = 'fx-pop';
    p.textContent = emoji;
    p.style.left = c.x + 'px'; p.style.top = c.y + 'px';
    layer.appendChild(p);
    sparks(c.x, c.y, 10);
    setTimeout(() => p.remove(), 1000);
  }
  function sparks(x, y, n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('div');
      s.className = 'fx-spark';
      const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      layer.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }
  function shake() {
    document.body.classList.remove('fx-shake');
    void document.body.offsetWidth;
    document.body.classList.add('fx-shake');
    setTimeout(() => document.body.classList.remove('fx-shake'), 400);
  }
  function flashClass(el, cls, ms) {
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  // ---------- helpers that read game state ----------
  function g() { try { return G; } catch (e) { return null; } }
  function isMulti() { const s = g(); return !!(s && s.mode === 'multi'); }
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  function isLocalHuman(pi) {
    const s = g(); if (!s || !s.players || !s.players[pi]) return false;
    return !s.players[pi].isBot && pi === myIndex();
  }
  function aliveIdx() { const s = g(); return s && s.players ? s.players.map((p, i) => p.alive ? i : -1).filter(i => i >= 0) : []; }

  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[fx] cannot hook', name); return; }
    window[name] = make(orig);
  }
  // Single player: wait for the cutscene, then continue. Multiplayer: continue immediately.
  function gated(sceneName, dataFn, orig) {
    return function () {
      const args = arguments, self = this;
      let data = {};
      try { data = dataFn.apply(null, args) || {}; } catch (e) { /* visuals only */ }
      if (!prefs.cutscenes || isMulti()) {
        if (prefs.cutscenes) play(sceneName, data);
        return orig.apply(self, args);
      }
      play(sceneName, data).then(() => orig.apply(self, args));
    };
  }

  // ---------- stat change animations on player panels ----------
  let snaps = [];
  const STAT_FX = [
    ['hp', '❤️', '#ff6a6a', '#7ae07a'],
    ['hunger', '🍖', '#ffb36a', '#ffd38a'],
    ['thirst', '💧', '#6ab4ff', '#9fd4ff'],
    ['energy', '⚡', '#ffd34d', '#ffe88a'],
    ['sanity', '🧠', '#c08aff', '#d8b8ff'],
  ];
  function diffPanel(i) {
    const s = g(); if (!s || !s.players || !s.players[i]) return;
    const p = s.players[i];
    const cur = { hp: p.hp, hunger: p.hunger, thirst: p.thirst, energy: p.energy, sanity: p.sanity, inv: p.inventory.slice(), alive: p.alive };
    const prev = snaps[i];
    snaps[i] = cur;
    if (!prev) return;
    const el = document.getElementById('panel-p' + i);
    if (!el) return;
    let off = -30;
    STAT_FX.forEach(([k, icon, down, up]) => {
      const d = Math.round(cur[k] - prev[k]);
      if (!d) return;
      floatText(el, `${d > 0 ? '+' : ''}${d} ${icon}`, d > 0 ? up : down, off);
      off += 22;
    });
    const dhp = cur.hp - prev.hp;
    if (dhp < 0) { flashClass(el, 'fx-hurt', 460); if (isLocalHuman(i)) { shake(); sfx('hurt'); } }
    else if (dhp > 0) { flashClass(el, 'fx-heal', 800); if (isLocalHuman(i)) sfx('heal'); }
    // items gained (only show names for the local player — others' bags are secret)
    if (cur.inv.length > prev.inv.length) {
      const gained = cur.inv.slice();
      prev.inv.forEach(it => { const k = gained.indexOf(it); if (k > -1) gained.splice(k, 1); });
      if (isLocalHuman(i)) { floatText(el, '🎒 +' + gained.join(', '), '#ffe36b', 0); sfx('pickup'); }
      else floatText(el, `🎒 +${gained.length}`, '#ffe36b', 0);
    }
  }

  // ---------- combat duel canvas ----------
  let duel = null;
  function ensureDuelCanvas() {
    const box = document.getElementById('combat-box');
    if (!box) return null;
    let c = document.getElementById('fx-duel');
    if (!c) {
      c = document.createElement('canvas');
      c.id = 'fx-duel'; c.width = 160; c.height = 60;
      const title = box.querySelector('.combat-title');
      box.insertBefore(c, title ? title.nextSibling : box.firstChild);
    }
    return c;
  }
  function startDuel() {
    const s = g(); if (!s || !s.combatState) return;
    const c = ensureDuelCanvas(); if (!c) return;
    const cs = s.combatState;
    const loc = (s.locations || []).find(l => l.explored && l.explored.includes(cs.playerIndex));
    duel = { c, x: c.getContext('2d'), kind: animalKind(cs.animalName), shirt: shirtFor(cs.playerIndex),
             loc: loc ? loc.id : 'forest', t0: performance.now(), pLunge: null, aLunge: null, nums: [] };
    duel.x.imageSmoothingEnabled = false;
    requestAnimationFrame(duelFrame);
  }
  // 0..1..0 bump while inside the [start, start+dur] window, else 0
  function bump(win, now) {
    if (!win || now < win.s || now > win.s + win.d) return 0;
    return Math.sin((now - win.s) / win.d * Math.PI);
  }
  function duelFrame(now) {
    if (!duel) return;
    const ov = document.getElementById('combat-overlay');
    if (!ov || getComputedStyle(ov).display === 'none') { duel = null; return; }
    const t = (now - duel.t0) / 1000;
    const bp = bump(duel.pLunge, now), ba = bump(duel.aLunge, now);
    drawWith(duel.x, 160, 60, () => {
      locationBackdrop(duel.loc, t, 0);
      person(36 + bp * 30, GROUND - 11, duel.shirt, (t * 3) % 2 | 0, 'idle');
      if (ba > 0.5) R(36, GROUND - 12, 8, 13, 'rgba(255,60,60,.6)');
      animal(duel.kind, 110 - ba * 30, GROUND, t, bp > 0.5);
    });
    const dc = duel.x;
    duel.nums = duel.nums.filter(n => now - n.t < 900);
    duel.nums.forEach(n => {
      if (now < n.t) return;
      const k = (now - n.t) / 900;
      dc.font = 'bold 12px monospace'; dc.textAlign = 'center';
      dc.fillStyle = '#000'; dc.fillText(n.txt, n.x + 1, n.y - k * 16 + 1);
      dc.fillStyle = n.col; dc.fillText(n.txt, n.x, n.y - k * 16);
    });
    requestAnimationFrame(duelFrame);
  }
  // Draw into another canvas with the scene helpers. Scenes are authored at 192x108;
  // scale to the target width and line the ground up near its bottom edge.
  function drawWith(targetCtx, w, h, fn) {
    const prev = ctx;
    const s = w / W;
    targetCtx.save();
    targetCtx.setTransform(s, 0, 0, s, 0, h - GROUND * s - 8);
    ctx = targetCtx;
    try { fn(); } finally { ctx = prev; targetCtx.restore(); }
  }

  // ---------- hooks ----------
  wrap('initGame', orig => function (name, job) {
    snaps = [];
    const self = this, args = arguments;
    if (!prefs.cutscenes) return orig.apply(self, args);
    document.getElementById('start-screen') && (document.getElementById('start-screen').style.display = 'none');
    play('intro', {}).then(() => orig.apply(self, args));
  });
  wrap('initGameMultiplayer', orig => function () {
    snaps = [];
    if (prefs.cutscenes) play('intro', {});
    return orig.apply(this, arguments);
  });
  wrap('startDay', orig => gated('day', () => ({ day: g().day }), orig));
  wrap('endDay', orig => gated('night', () => ({ day: g().day, alive: aliveIdx().length, aliveIdx: aliveIdx() }), orig));
  wrap('gameEnd', orig => function (survived) {
    const s = g();
    const ai = aliveIdx();
    const data = { aliveIdx: ai, names: ai.map(i => s.players[i].name).join(', '), ending: window.GP && GP.lastEnding };
    const self = this, args = arguments;
    if (!prefs.cutscenes) return orig.apply(self, args);
    play(survived ? 'victory' : 'defeat', data).then(() => orig.apply(self, args));
  });
  wrap('killPlayer', orig => gated('death', (pi) => ({ name: g().players[pi].name }), orig));

  wrap('exploreLocation', orig => function (pi, li) {
    const s = g();
    const before = s && s.locations[li] ? s.locations[li].explored.length : 0;
    const res = orig.apply(this, arguments);
    const loc = s && s.locations[li];
    if (loc && loc.explored.length > before && isLocalHuman(pi)) {
      play('explore', { id: loc.id, name: loc.name, emoji: loc.emoji, player: s.players[pi].name, shirt: shirtFor(pi) });
    }
    return res;
  });
  wrap('initiateCombat', orig => function (pi, animalName) {
    const res = orig.apply(this, arguments);
    const s = g();
    if (isLocalHuman(pi)) {
      const loc = (s.locations || []).find(l => l.explored && l.explored.includes(pi));
      play('encounter', { animal: animalName, id: loc ? loc.id : 'forest', shirt: shirtFor(pi) });
    }
    startDuel();
    return res;
  });
  wrap('doCombatRound', orig => function () {
    const s = g();
    const cs = s && s.combatState;
    const pi = cs ? cs.playerIndex : -1;
    const aBefore = cs ? cs.animalHp : 0, pBefore = pi >= 0 ? s.players[pi].hp : 0;
    const res = orig.apply(this, arguments);
    if (pi < 0) return res;
    const now = performance.now();
    const aAfter = cs.animalHp;   // same object even after closeCombat() clears G.combatState
    const pAfter = s.players[pi].hp;
    if (duel) {
      if (aAfter < aBefore) { duel.pLunge = { s: now, d: 260 }; duel.nums.push({ txt: '-' + (aBefore - aAfter), x: 110, y: 22, col: '#ffd34d', t: now + 120 }); }
      if (pAfter < pBefore) { duel.aLunge = { s: now + 300, d: 260 }; duel.nums.push({ txt: '-' + (pBefore - pAfter), x: 40, y: 26, col: '#ff5a5a', t: now + 420 }); }
    }
    if (aAfter < aBefore) sfx('hit');
    if (aAfter <= 0 && aBefore > 0) { pop('🏆'); setTimeout(() => sfx('victory'), 150); }
    return res;
  });
  wrap('renderPanel', orig => function (i) {
    const res = orig.apply(this, arguments);
    try { diffPanel(i); } catch (e) { /* visuals only */ }
    return res;
  });
  const ACTION_EMOJI = { rest: '😴', eat: '🍽️', heal: '💊', camp: '🏕️', skill: '✨', poison: '☠️', place_trap: '🪤', rescue: '📡' };
  wrap('handleAction', orig => function (pi, action) {
    const s = g();
    const wasLoading = s && s.isLoading;
    const res = orig.apply(this, arguments);
    if (!wasLoading && ACTION_EMOJI[action] && isLocalHuman(pi)) pop(ACTION_EMOJI[action]);
    return res;
  });
  wrap('doCraft', orig => function (pi) {
    const s = g();
    const before = s && s.players[pi] ? s.players[pi].stats.itemsCrafted : 0;
    const res = orig.apply(this, arguments);
    if (s && s.players[pi] && s.players[pi].stats.itemsCrafted > before && isLocalHuman(pi)) { pop('🔨'); sfx('craft'); }
    return res;
  });

  // Multiplayer guests never call startDay/gameEnd themselves; show the day card when the synced day changes
  let lastDay = null;
  wrap('renderAllPanels', orig => function () {
    const res = orig.apply(this, arguments);
    const s = g();
    if (s && isMulti() && !s.isHost && s.day !== lastDay) {
      if (lastDay !== null && s.day <= 7) play('day', { day: s.day });
      lastDay = s.day;
    }
    return res;
  });

  // Static pixel-art preview of a location, used by ui.js on the location cards
  function locationThumb(canvas, id) {
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    drawWith(c, canvas.width, canvas.height, () => locationBackdrop(id, 0.6, 30));
  }

  window.FX = { play, pop, sfx, shake, floatText, prefs, locationThumb };
})();
