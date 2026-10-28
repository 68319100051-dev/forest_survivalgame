// ===================== UI: LIVING BACKGROUND, ANIMATED PANELS, CARDS, TURN BANNER =====================
// Loaded after fx.js. Presentation only: wraps render functions to add motion; never changes game state.
(function () {
  'use strict';

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function g() { try { return G; } catch (e) { return null; } }
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[ui] cannot hook', name); return; }
    window[name] = make(orig);
  }
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }

  // =====================================================================
  // 1. LIVING BACKGROUND — low-res pixel forest behind the whole UI
  //    sky follows the current player's remaining hours (morning → night),
  //    weather comes from the weather box (rain / storm / fog / sun)
  // =====================================================================
  const bg = document.createElement('canvas');
  bg.id = 'ui-ambient';
  document.body.prepend(bg);
  const bx = bg.getContext('2d');
  let BW = 320, BH = 180;
  function sizeBg() {
    BH = 180;
    BW = Math.max(120, Math.round(BH * innerWidth / Math.max(1, innerHeight)));
    bg.width = BW; bg.height = BH;
    bx.imageSmoothingEnabled = false;
  }
  sizeBg();
  addEventListener('resize', sizeBg);

  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function mix(a, b, k) { return a.map((v, i) => Math.round(v + (b[i] - v) * k)); }
  function rgb(c, a) { return a === undefined ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

  // [top, bottom] sky colours per phase — kept dark so panels stay readable
  const SKY = [
    [[22, 40, 46], [58, 72, 56]],   // morning
    [[24, 50, 62], [44, 70, 60]],   // midday
    [[52, 34, 40], [86, 56, 40]],   // dusk
    [[6, 8, 18], [16, 20, 34]],     // night
  ];
  function skyAt(k) {
    const seg = Math.min(2.999, k * 3), i = Math.floor(seg), f = seg - i;
    return [mix(SKY[i][0], SKY[i + 1][0], f), mix(SKY[i][1], SKY[i + 1][1], f)];
  }
  function dayProgress() {
    const s = g();
    if (!s || !s.players || !s.players.length || !s.day) return 1; // title screen: night
    const p = s.players[s.currentPlayer] || s.players[0];
    if (!p || typeof p.hoursLeft !== 'number') return 0;
    return Math.min(1, Math.max(0, 1 - p.hoursLeft / 24));
  }
  function weatherKind() {
    const el = document.getElementById('weather-icon');
    const t = el ? el.textContent : '';
    if (t.includes('⛈')) return 'storm';
    if (t.includes('🌧')) return 'rain';
    if (t.includes('🌫')) return 'fog';
    if (t.includes('☀')) return 'sun';
    return 'clear';
  }

  function pine(x, base, h, col) {
    bx.fillStyle = col;
    for (let r = 0; r < h; r++) {
      const w = 1 + Math.floor((r % Math.ceil(h / 3)) * 0.9 + r * 0.32);
      bx.fillRect(Math.round(x - w), base - h + r, w * 2, 1);
    }
    bx.fillRect(Math.round(x) - 1, base, 2, 3);
  }
  function treeLine(scroll, seed, base, minH, maxH, col, gap) {
    const r = rng(seed), span = BW + 60;
    bx.fillStyle = col; bx.fillRect(0, base, BW, BH - base);
    for (let i = 0; i < Math.ceil(span / gap) + 2; i++) {
      const x0 = i * gap + r() * gap * 0.7, h = minH + r() * (maxH - minH) | 0;
      pine((((x0 - scroll) % span) + span) % span - 30, base, h, col);
    }
  }

  let smoothK = dayProgress();
  let flash = 0;
  const motes = Array.from({ length: 40 }, (_, i) => { const r = rng(i * 31 + 7); return { x: r(), y: r(), s: 0.2 + r() * 0.8, ph: r() * 6 }; });
  const leaves = Array.from({ length: 10 }, (_, i) => { const r = rng(i * 17 + 3); return { x: r(), y: r(), s: 0.5 + r(), ph: r() * 6 }; });

  function drawBg(t) {
    smoothK += (dayProgress() - smoothK) * 0.02;
    const k = smoothK, w = weatherKind();
    const [top, bot] = skyAt(k);
    const dim = (w === 'storm' || w === 'rain') ? 0.7 : 1;
    // sky bands
    const bands = 12;
    for (let i = 0; i < bands; i++) {
      bx.fillStyle = rgb(mix(top, bot, i / (bands - 1)).map(v => v * dim | 0));
      bx.fillRect(0, Math.floor(i * BH / bands), BW, Math.ceil(BH / bands) + 1);
    }
    // stars at night
    if (k > 0.6 && w !== 'storm' && w !== 'rain') {
      const r = rng(5), a = Math.min(1, (k - 0.6) * 3);
      for (let i = 0; i < 70; i++) {
        const x = r() * BW | 0, y = r() * BH * 0.5 | 0, tw = Math.sin(t * 2 + i);
        if (tw > -0.4) { bx.fillStyle = `rgba(220,230,255,${a * (tw > 0.7 ? 0.9 : 0.45)})`; bx.fillRect(x, y, 1, 1); }
      }
    }
    // sun / moon travelling across the sky
    const arcX = BW * (0.15 + 0.7 * k), arcY = BH * (0.42 - Math.sin(k * Math.PI) * 0.28);
    if (w !== 'storm' && w !== 'rain') {
      if (k < 0.75) {
        bx.fillStyle = k > 0.5 ? 'rgba(255,170,90,0.55)' : 'rgba(255,225,140,0.5)';
        bx.beginPath(); bx.arc(arcX, arcY, 9, 0, 7); bx.fill();
        bx.fillStyle = 'rgba(255,220,140,0.06)'; bx.beginPath(); bx.arc(arcX, arcY, 26, 0, 7); bx.fill();
      } else {
        bx.fillStyle = 'rgba(230,228,200,0.55)'; bx.beginPath(); bx.arc(BW * 0.78, BH * 0.18, 6, 0, 7); bx.fill();
      }
    }
    // sun rays
    if (w === 'sun' && k < 0.7) {
      for (let i = 0; i < 5; i++) {
        bx.fillStyle = `rgba(255,230,160,${0.035 + 0.02 * Math.sin(t + i)})`;
        bx.beginPath(); bx.moveTo(arcX, arcY);
        const a = 1.6 + i * 0.22 + Math.sin(t * 0.3) * 0.05;
        bx.lineTo(arcX + Math.cos(a) * BW, arcY + Math.sin(a) * BW);
        bx.lineTo(arcX + Math.cos(a + 0.08) * BW, arcY + Math.sin(a + 0.08) * BW);
        bx.fill();
      }
    }
    // mountains + three parallax tree lines
    const shade = (c, f) => rgb(c.map(v => v * f | 0));
    const base = mix(bot, [10, 18, 14], 0.55);
    bx.fillStyle = shade(base, 0.9);
    for (let x = 0; x < BW; x++) { const h = 30 + Math.sin(x * 0.03 + 1) * 10 + Math.sin(x * 0.011) * 14; bx.fillRect(x, BH - 60 - h * 0.5, 1, h); }
    treeLine(t * 1.5, 11, BH - 46, 14, 26, shade(base, 0.7), 16);
    treeLine(t * 3, 21, BH - 30, 18, 34, shade(base, 0.5), 20);
    treeLine(t * 6, 31, BH - 12, 24, 44, shade(base, 0.3), 26);
    // fog
    if (w === 'fog' || k < 0.1) {
      const fa = w === 'fog' ? 0.08 : 0.04;
      for (let i = 0; i < 6; i++) {
        const fx = ((t * (6 + i * 2) + i * 80) % (BW + 160)) - 80;
        bx.fillStyle = `rgba(190,200,210,${fa})`;
        bx.fillRect(fx, BH - 70 + i * 9, 140, 7);
      }
    }
    // fireflies at night, drifting dust by day
    motes.forEach((m, i) => {
      const x = ((m.x * BW + Math.sin(t * 0.4 + m.ph) * 14 + t * 2 * m.s) % BW + BW) % BW;
      const y = BH * (0.35 + m.y * 0.6) + Math.sin(t * 0.9 + m.ph) * 6;
      if (k > 0.55) {
        if (Math.sin(t * 2.5 + m.ph * 3) > 0.2) { bx.fillStyle = 'rgba(210,255,120,0.85)'; bx.fillRect(x | 0, y | 0, 1, 1); bx.fillStyle = 'rgba(210,255,120,0.15)'; bx.fillRect((x | 0) - 1, (y | 0) - 1, 3, 3); }
      } else if (i % 2 === 0) {
        bx.fillStyle = 'rgba(255,245,210,0.25)'; bx.fillRect(x | 0, y | 0, 1, 1);
      }
    });
    // falling leaves (not in rain)
    if (w !== 'rain' && w !== 'storm') {
      leaves.forEach(l => {
        const y = ((l.y * BH + t * 8 * l.s) % (BH + 10)) - 5;
        const x = ((l.x * BW + Math.sin(t + l.ph) * 10 + t * 4) % BW + BW) % BW;
        bx.fillStyle = k > 0.5 ? 'rgba(160,110,60,0.5)' : 'rgba(150,190,90,0.5)';
        bx.fillRect(x | 0, y | 0, 2, 1);
      });
    }
    // rain / storm
    if (w === 'rain' || w === 'storm') {
      const n = w === 'storm' ? 140 : 80;
      bx.fillStyle = 'rgba(170,200,230,0.35)';
      for (let i = 0; i < n; i++) {
        const r = rng(i * 13);
        const x = ((r() * BW + t * 40) % BW), y = ((r() * BH + t * (160 + r() * 60)) % BH);
        bx.fillRect(x | 0, y | 0, 1, 4);
      }
      if (w === 'storm') {
        if (flash <= 0 && Math.random() < 0.004) flash = 1;
        if (flash > 0) { bx.fillStyle = `rgba(230,235,255,${flash * 0.35})`; bx.fillRect(0, 0, BW, BH); flash -= 0.06; }
      }
    }
    // vignette keeps the centre calm behind the panels
    const v = bx.createRadialGradient(BW / 2, BH / 2, BH * 0.3, BW / 2, BH / 2, BW * 0.75);
    v.addColorStop(0, 'rgba(4,6,6,0.35)'); v.addColorStop(1, 'rgba(0,0,0,0.75)');
    bx.fillStyle = v; bx.fillRect(0, 0, BW, BH);
  }

  let last = 0;
  function bgLoop(now) {
    requestAnimationFrame(bgLoop);
    const interval = reduceMotion ? 2000 : 33; // ~30fps, or a slow refresh with reduced motion
    if (document.hidden || now - last < interval) return;
    last = now;
    try { drawBg(reduceMotion ? 0 : now / 1000); } catch (e) { /* visuals only */ }
  }
  requestAnimationFrame(bgLoop);

  // =====================================================================
  // 2. PLAYER PANELS — stat bars slide from the old value, a white "ghost"
  //    shows what was lost, low stats pulse, new items pop in
  // =====================================================================
  const LOW = [30, 20, 20, 15, 30, 4]; // hp, hunger, thirst, energy, sanity, hours
  const invSnap = [];
  const recentItems = []; // per player: [{name, t}] so a re-render mid-animation continues the pop
  const POP_MS = 700;
  // current on-screen width in % (mid-transition aware), so back-to-back renders don't jump
  function shownWidth(f) {
    const track = f.parentNode && f.parentNode.getBoundingClientRect().width;
    return track ? f.getBoundingClientRect().width / track * 100 : parseFloat(f.style.width);
  }
  wrap('renderPanel', orig => function (i) {
    const el = document.getElementById('panel-p' + i);
    const oldW = el ? [...el.querySelectorAll('.stat-fill')].map(shownWidth) : [];
    const res = orig.apply(this, arguments);
    try { animatePanel(i, el, oldW); } catch (e) { /* visuals only */ }
    return res;
  });
  function animatePanel(i, el, oldW) {
    if (!el) return;
    const s = g(), p = s && s.players[i];
    const rows = el.querySelectorAll('.stat-row');
    const fills = el.querySelectorAll('.stat-fill');
    const vals = p ? [p.hp, p.hunger, p.thirst, p.energy, p.sanity, p.hoursLeft] : [];
    rows.forEach((row, k) => row.classList.toggle('low', !!p && p.alive && vals[k] <= LOW[k]));
    fills.forEach((f, k) => {
      const nw = parseFloat(f.style.width), ow = oldW[k];
      if (ow === undefined || isNaN(ow) || Math.abs(ow - nw) < 0.5 || reduceMotion) return;
      f.style.transition = 'none';
      f.style.width = ow + '%';
      if (nw < ow) {
        const ghost = document.createElement('div');
        ghost.className = 'stat-ghost';
        ghost.style.width = ow + '%';
        f.parentNode.insertBefore(ghost, f);
        setTimeout(() => { ghost.style.width = nw + '%'; }, 350);
        setTimeout(() => ghost.remove(), 1300);
      }
      requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = ''; f.style.width = nw + '%'; }));
    });
    // pop-in for items that weren't there last render
    if (p) {
      const now = performance.now();
      const prev = invSnap[i];
      invSnap[i] = p.inventory.slice();
      const recent = (recentItems[i] || []).filter(r => now - r.t < POP_MS);
      if (prev && p.inventory.length > prev.length) {
        const left = prev.slice();
        p.inventory.forEach(it => {
          const at = left.indexOf(it);
          if (at > -1) left.splice(at, 1); else recent.push({ name: it, t: now });
        });
      }
      recentItems[i] = recent;
      if (recent.length && !reduceMotion) {
        const items = [...el.querySelectorAll('.inv-item:not(.inv-item-secret)')];
        const used = new Set();
        recent.forEach(r => {
          for (let k = items.length - 1; k >= 0; k--) {
            if (used.has(k) || p.inventory[k] !== r.name) continue;
            used.add(k);
            items[k].classList.add('inv-new');
            items[k].style.animationDelay = -(now - r.t) + 'ms'; // resume where the last render left off
            break;
          }
        });
      }
    }
  }

  // =====================================================================
  // 3. LOCATION CARDS — pixel-art preview, danger meter, staggered deal-in,
  //    3D tilt on hover, pulse while the player is choosing
  // =====================================================================
  wrap('renderLocations', orig => function () {
    const res = orig.apply(this, arguments);
    try { decorateLocations(); } catch (e) { console.warn('[ui] locations', e); }
    return res;
  });
  function decorateLocations() {
    const s = g(); if (!s) return;
    const row = document.getElementById('locations-row'); if (!row) return;
    row.classList.remove('picking');
    row.querySelectorAll('.loc-card').forEach((card, idx) => {
      const loc = s.locations[idx];
      const isMap = card.classList.contains('map-event');
      card.style.setProperty('--i', idx);
      if (!reduceMotion) card.classList.add('ui-deal');
      if (window.FX && FX.locationThumb && !card.querySelector('.loc-thumb')) {
        const c = document.createElement('canvas');
        c.className = 'loc-thumb'; c.width = 120; c.height = 44;
        FX.locationThumb(c, isMap ? 'temple' : (loc ? loc.id : 'forest'));
        card.prepend(c);
      }
      const danger = isMap ? (s.mapEvent ? s.mapEvent.danger : 0.5) : (loc ? loc.danger : 0);
      if (!card.querySelector('.loc-danger')) {
        const d = document.createElement('div');
        d.className = 'loc-danger';
        d.title = 'ระดับอันตราย';
        d.innerHTML = `<span style="width:${Math.round(Math.min(1, danger / 0.65) * 100)}%"></span>`;
        card.appendChild(d);
      }
    });
  }
  wrap('showLocationPicker', orig => function () {
    const res = orig.apply(this, arguments);
    const row = document.getElementById('locations-row');
    if (row) { row.classList.add('picking'); row.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' }); }
    return res;
  });
  wrap('exploreLocation', orig => function () {
    document.getElementById('locations-row')?.classList.remove('picking');
    return orig.apply(this, arguments);
  });
  // tilt
  const locRow = document.getElementById('locations-row');
  if (locRow && !reduceMotion) {
    locRow.addEventListener('pointermove', e => {
      const card = e.target.closest('.loc-card');
      if (!card || card.classList.contains('explored') || card.classList.contains('loc-blocked')) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(500px) rotateX(${(-y * 10).toFixed(1)}deg) rotateY(${(x * 12).toFixed(1)}deg) translateY(-4px)`;
      card.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(0) + '%');
      card.style.setProperty('--my', ((y + 0.5) * 100).toFixed(0) + '%');
    });
    locRow.addEventListener('pointerout', e => {
      const card = e.target.closest('.loc-card');
      if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
    });
  }

  // =====================================================================
  // 4. ACTION BUTTONS — icon tile + label + cost chip, staggered entrance,
  //    ripple + click blip, "end turn" nudge when time is nearly gone
  // =====================================================================
  const EMOJI_RE = /^((?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|‍\p{Extended_Pictographic})*)\s*/u;
  wrap('renderActions', orig => function (pi) {
    const res = orig.apply(this, arguments);
    try { decorateActions(pi); } catch (e) { console.warn('[ui] actions', e); }
    return res;
  });
  function decorateActions(pi) {
    const box = document.getElementById('action-buttons'); if (!box) return;
    box.querySelectorAll('.act-btn').forEach((btn, idx) => {
      const label = btn.querySelector('span:not(.act-cost)');
      if (label && !btn.querySelector('.act-ico')) {
        const m = label.textContent.match(EMOJI_RE);
        if (m) {
          const ico = document.createElement('span');
          ico.className = 'act-ico'; ico.textContent = m[1];
          label.textContent = label.textContent.slice(m[0].length);
          label.className = 'act-text';
          btn.prepend(ico);
        }
      }
      btn.style.setProperty('--i', idx);
      if (!reduceMotion) btn.classList.add('ui-rise');
    });
    const s = g(), p = s && s.players[pi];
    const end = document.getElementById('end-turn-btn');
    if (end && p) end.classList.toggle('nudge', p.hoursLeft > 0 && p.hoursLeft <= 3);
  }
  document.addEventListener('pointerdown', e => {
    const btn = e.target.closest('.act-btn, .combat-btn, .screen-btn, #end-turn-btn, .share-btn, .pvp-btn');
    if (!btn || btn.disabled) return;
    sfx('click');
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ui-ripple';
    const size = Math.max(r.width, r.height) * 2;
    rip.style.width = rip.style.height = size + 'px';
    rip.style.left = (e.clientX - r.left - size / 2) + 'px';
    rip.style.top = (e.clientY - r.top - size / 2) + 'px';
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  }, true);

  // =====================================================================
  // 5. TURN BANNER — sweeps across the screen when the turn changes
  // =====================================================================
  const banner = document.createElement('div');
  banner.id = 'ui-turn-banner';
  document.body.appendChild(banner);
  let lastTurnKey = '';
  wrap('updateTurnHeader', orig => function (pi) {
    const res = orig.apply(this, arguments);
    try {
      const s = g(), p = s.players[pi];
      const key = s.day + ':' + pi;
      if (p && key !== lastTurnKey) {
        lastTurnKey = key;
        showBanner(p, pi === myIndex() && !p.isBot);
        const th = document.getElementById('turn-header');
        if (th) { th.classList.remove('ui-flash'); void th.offsetWidth; th.classList.add('ui-flash'); }
      }
    } catch (e) { /* visuals only */ }
    return res;
  });
  function showBanner(p, mine) {
    banner.className = mine ? 'mine' : '';
    banner.innerHTML = '';
    const av = document.createElement('div'); av.className = 'tb-avatar'; av.textContent = p.emoji || '👤';
    av.style.background = (p.color || '#4a9e5c') + '33'; av.style.borderColor = p.color || '#4a9e5c';
    const txt = document.createElement('div'); txt.className = 'tb-text';
    const t1 = document.createElement('div'); t1.className = 'tb-title'; t1.textContent = mine ? '🎮 ตาของคุณ!' : `ตาของ ${p.name}`;
    const t2 = document.createElement('div'); t2.className = 'tb-sub'; t2.textContent = p.job ? `${p.job.emoji} ${p.job.name} · ⏰ ${p.hoursLeft} ชม.` : '';
    txt.append(t1, t2); banner.append(av, txt);
    if (reduceMotion) return;
    void banner.offsetWidth;
    banner.classList.add('show');
    if (mine) sfx('turn');
  }

  // =====================================================================
  // 6. SMALL TOUCHES — day badge bump, weather icon change
  // =====================================================================
  function bumpOnChange(id) {
    const el = document.getElementById(id); if (!el) return;
    new MutationObserver(() => { el.classList.remove('ui-bump'); void el.offsetWidth; el.classList.add('ui-bump'); })
      .observe(el, { childList: true, characterData: true, subtree: true });
  }
  bumpOnChange('day-badge');
  bumpOnChange('weather-icon');
})();
