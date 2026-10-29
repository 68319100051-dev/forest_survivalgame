// ===================== BOSS: เจ้าป่า RAIDS THE CAMP ON DAY 5 OR 6 =====================
// A team fight at dawn: every survivor rushes to camp, the player picks a move each round,
// bots attack with their best weapon. Up to 5 rounds; beat it for loot, or it retreats after wrecking camp.
(function () {
  'use strict';

  const ROUNDS = 5;
  const BOSS_NAME = 'เสือเผือกตาเดียว';
  const TROPHY = 'เขี้ยวเจ้าป่า';
  if (typeof VALUABLES !== 'undefined' && !VALUABLES.includes(TROPHY)) VALUABLES.push(TROPHY);

  function g() { try { return G; } catch (e) { return null; } }
  const $ = id => document.getElementById(id);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  function esc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[boss] cannot hook', name); return; }
    window[name] = make(orig);
  }
  function bs() {
    const s = g();
    if (!s.rescueData) s.rescueData = { attempts: [], lastChance: 0, success: false };
    if (!s.rescueData.boss) s.rescueData.boss = { day: Math.random() < 0.5 ? 5 : 6, done: false, warned: false, result: null };
    return s.rescueData.boss;
  }
  const team = () => g().players.map((p, i) => ({ p, i })).filter(x => x.p.alive);
  function diff() { try { return getDifficulty().id; } catch (e) { return 'normal'; } }

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  #boss-modal{position:fixed;inset:0;z-index:1950;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,rgba(80,10,10,.55),rgba(0,0,0,.92));padding:12px}
  #boss-modal.show{display:flex;animation:bsIn .4s ease}
  #boss-card{width:min(640px,100%);max-height:96vh;overflow:auto;border-radius:18px;border:1px solid rgba(255,90,90,.5);background:linear-gradient(180deg,#1a0f0f,#0b0808);box-shadow:0 0 60px rgba(255,60,60,.25),0 30px 80px rgba(0,0,0,.8);animation:bsPop .5s cubic-bezier(.2,1.5,.4,1)}
  #boss-card.shake{animation:bsShake .4s steps(6)}
  #boss-head{padding:12px 16px 6px}
  #boss-title{font-size:20px;font-weight:900;color:#ffb0a0;text-shadow:0 0 14px rgba(255,80,60,.6),2px 2px 0 #000;letter-spacing:.5px}
  #boss-sub{font-size:11px;color:#c9a9a0;margin-top:2px}
  .bs-hp{position:relative;height:16px;margin-top:8px;border-radius:9px;background:rgba(255,255,255,.08);overflow:hidden;border:1px solid rgba(255,120,100,.4)}
  .bs-hp .ghost{position:absolute;inset:0 auto 0 0;background:rgba(255,240,220,.85);transition:width .9s cubic-bezier(.5,0,.2,1) .25s}
  .bs-hp .fill{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,#b81f1f,#ff5a3a,#ffb03a);transition:width .45s cubic-bezier(.22,1,.36,1)}
  .bs-hp .txt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:#fff;text-shadow:1px 1px 0 #000}
  #boss-canvas{display:block;width:100%;aspect-ratio:320/130;image-rendering:pixelated;image-rendering:crisp-edges;border-top:1px solid rgba(255,90,90,.25);border-bottom:1px solid rgba(255,90,90,.25)}
  #boss-team{display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px}
  .bs-mate{display:flex;align-items:center;gap:6px;padding:4px 9px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);font-size:11px;font-weight:700;color:#e8dcd0;transition:transform .2s}
  .bs-mate.hit{animation:bsHit .45s steps(3)}
  .bs-mate.down{opacity:.4;filter:grayscale(1)}
  .bs-mate .mhp{width:46px;height:5px;border-radius:3px;background:rgba(255,255,255,.1);overflow:hidden}
  .bs-mate .mhp i{display:block;height:100%;background:linear-gradient(90deg,#d84848,#ff8a6a);transition:width .4s}
  #boss-log{padding:0 16px;min-height:62px;display:flex;flex-direction:column;gap:3px}
  #boss-log div{font-size:12px;color:#e8d8cc;animation:bsLog .35s ease backwards}
  #boss-log div.bad{color:#ff9a8a} #boss-log div.good{color:#9be8a8}
  #boss-acts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;padding:10px 16px 16px}
  .bs-act{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,140,110,.35);background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(0,0,0,.2));color:#ffe8dc;font:800 13px 'Noto Sans Thai',sans-serif;cursor:pointer;text-align:left;transition:transform .15s,border-color .15s,box-shadow .15s}
  .bs-act small{font-weight:600;font-size:10px;color:#c9a9a0}
  .bs-act:hover:not(:disabled){transform:translateY(-2px);border-color:#ff8a6a;box-shadow:0 0 16px rgba(255,90,60,.3)}
  .bs-act:disabled{opacity:.35;cursor:not-allowed}
  .bs-round{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:9px;background:rgba(255,90,60,.2);color:#ffc0a8;font-size:11px}
  @keyframes bsIn{from{opacity:0}} @keyframes bsPop{from{opacity:0;transform:scale(.85)}}
  @keyframes bsShake{0%,100%{transform:none}20%{transform:translate(-8px,3px)}40%{transform:translate(8px,-3px)}60%{transform:translate(-5px,-2px)}80%{transform:translate(5px,2px)}}
  @keyframes bsHit{0%,100%{transform:none}33%{transform:translateX(-4px);background:rgba(216,72,72,.4)}66%{transform:translateX(4px)}}
  @keyframes bsLog{from{opacity:0;transform:translateX(-8px)}}
  @media (prefers-reduced-motion: reduce){#boss-modal.show,#boss-card,#boss-card.shake,.bs-mate.hit,#boss-log div{animation:none}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'boss-modal';
  modal.innerHTML = `<div id="boss-card"><div id="boss-head"><div id="boss-title"></div><div id="boss-sub"></div>
    <div class="bs-hp"><div class="ghost"></div><div class="fill"></div><div class="txt"></div></div></div>
    <canvas id="boss-canvas" width="320" height="130"></canvas><div id="boss-team"></div><div id="boss-log"></div><div id="boss-acts"></div></div>`;
  document.body.appendChild(modal);
  const cv = $('boss-canvas'), cx = cv.getContext('2d');
  cx.imageSmoothingEnabled = false;

  // ---------- pixel arena ----------
  const anim = { t0: 0, raf: 0, bossLunge: null, mateLunge: {}, nums: [], flash: 0 };
  function R(x, y, w, h, c) { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); }
  function bump(win, now) { if (!win || now < win.s || now > win.s + win.d) return 0; return Math.sin((now - win.s) / win.d * Math.PI); }
  function drawTiger(x, y, t, hurt) {
    const bob = Math.round(Math.sin(t * 3) * 1.5);
    const W = hurt ? '#ffffff' : '#ecebe6', S = '#3a3a44', D = '#c9c6bd';
    R(x, y - 30 + bob, 54, 22, W);                       // body
    for (let i = 5; i < 52; i += 7) { R(x + i, y - 30 + bob, 2, 9, S); R(x + i + 1, y - 21 + bob, 2, 7, S); } // stripes
    R(x - 18, y - 38 + bob, 24, 22, W);                   // head
    R(x - 18, y - 42 + bob, 6, 5, W); R(x - 2, y - 42 + bob, 6, 5, W); // ears
    R(x - 14, y - 32 + bob, 4, 3, '#1a1a1a');             // scarred eye
    R(x - 6, y - 33 + bob, 4, 4, (Math.sin(t * 6) > 0) ? '#ff3a2a' : '#ffaa2a'); // glowing eye
    R(x - 20, y - 24 + bob, 10, 5, D); R(x - 19, y - 20 + bob, 2, 3, '#fff'); R(x - 13, y - 20 + bob, 2, 3, '#fff'); // jaw + fangs
    R(x + 54, y - 34 + bob, 18, 4, W); R(x + 70, y - 38 + bob, 4, 6, S); // tail
    R(x + 2, y - 8, 8, 8, D); R(x + 40, y - 8, 8, 8, D);  // legs
  }
  function drawPerson(x, y, color, f, down) {
    if (down) { R(x - 2, y - 4, 12, 4, '#555'); return; }
    R(x + 2, y - 12, 4, 4, '#e8b88a'); R(x + 1, y - 8, 6, 5, color); R(x + 2, y - 3, 2, 3, '#3b3f5a'); R(x + 5, y - 3, 2, 3, '#3b3f5a');
    R(x + 7, y - 9 + (f ? 1 : 0), 4, 1, '#cfcfcf'); // spear tip / arm
  }
  function frame(now) {
    if (!modal.classList.contains('show')) { anim.raf = 0; return; }
    const t = (now - anim.t0) / 1000;
    // night sky + forest + campfire
    for (let i = 0; i < 8; i++) R(0, i * 12, 320, 12, `rgb(${18 + i * 4},${10 + i * 3},${20 + i * 4})`);
    for (let i = 0; i < 40; i++) { const x = (i * 37) % 320, y = (i * 23) % 50; if (Math.sin(t * 2 + i) > 0.3) R(x, y, 1, 1, '#ccd'); }
    for (let x = -10; x < 330; x += 14) { const h = 18 + ((x * 7) % 13); for (let r = 0; r < h; r++) R(x - r * 0.35, 98 - h + r, r * 0.7 + 2, 1, '#0d1410'); }
    R(0, 98, 320, 32, '#1c1612'); R(0, 98, 320, 1, '#3a2a1c');
    const fy = 112; R(150, fy, 20, 3, '#5a3a22');
    for (let i = 0; i < 10; i++) { const fx = 152 + Math.random() * 16, h = Math.random() * 12; R(fx, fy - h, 2, 2, h > 8 ? '#ffe36b' : h > 4 ? '#ff9a2e' : '#e0402a'); }
    // survivors on the left
    const s = g();
    team().concat(s.players.map((p, i) => ({ p, i })).filter(x => !x.p.alive)).slice(0, 4).forEach((x, k) => {
      const lunge = bump(anim.mateLunge[x.i], now) * 22;
      drawPerson(40 + k * 22 + lunge, 118 - (k % 2) * 6, x.p.color || '#7aab3a', Math.floor(t * 4 + k) % 2, !x.p.alive);
    });
    // boss on the right
    const bl = bump(anim.bossLunge, now);
    drawTiger(210 - bl * 70, 116, t, now < anim.flash);
    // floating numbers
    anim.nums = anim.nums.filter(n => now - n.t < 1000);
    anim.nums.forEach(n => {
      if (now < n.t) return;
      const k = (now - n.t) / 1000;
      cx.font = 'bold 12px monospace'; cx.textAlign = 'center';
      cx.fillStyle = '#000'; cx.fillText(n.txt, n.x + 1, n.y - k * 18 + 1);
      cx.fillStyle = n.col; cx.fillText(n.txt, n.x, n.y - k * 18);
    });
    anim.raf = requestAnimationFrame(frame);
  }

  // ---------- fight state ----------
  let F = null; // { hp, max, round, log:[], done }
  function setHp() {
    const pct = Math.max(0, F.hp) / F.max * 100;
    modal.querySelector('.bs-hp .fill').style.width = pct + '%';
    modal.querySelector('.bs-hp .ghost').style.width = pct + '%';
    modal.querySelector('.bs-hp .txt').textContent = `${Math.max(0, F.hp)} / ${F.max}`;
  }
  function renderTeam(hitIdx) {
    $('boss-team').innerHTML = g().players.map((p, i) => `<div class="bs-mate${p.alive ? '' : ' down'}${hitIdx && hitIdx.includes(i) ? ' hit' : ''}">${p.emoji} ${esc(p.name)} <span class="mhp"><i style="width:${p.hp}%"></i></span> ${p.hp}</div>`).join('');
  }
  function log(text, tone) {
    F.log.push({ text, tone });
    $('boss-log').innerHTML = F.log.slice(-6).map(l => `<div class="${l.tone || ''}">${esc(l.text)}</div>`).join('');
  }
  function weaponDmg(p) {
    const w = combatWeapon(p);
    let d = w.dmg + (p.inventory.includes('ขวานเหล็ก') ? 12 : 0) + (p.inventory.includes('อาวุธโบราณ') ? 20 : 0);
    return { dmg: d, item: w.item, label: w.label };
  }
  function actionsFor(pi) {
    const p = g().players[pi];
    const w = weaponDmg(p);
    return [
      { id:'attack', icon:'⚔️', label:`โจมตีด้วย${w.label}`, sub:`DMG ${w.dmg} · โดนสวนได้` },
      { id:'bow', icon:'🏹', label:'ยิงธนู', sub:'DMG 25 · ยืนไกล ไม่โดนสวน', disabled: !p.inventory.includes('ธนู') },
      { id:'torch', icon:'🔥', label:'ไล่ด้วยคบเพลิง', sub:'DMG 35 · เจ้าป่าผงะ ไม่ได้โจมตีรอบนี้ (ใช้คบเพลิง)', disabled: !p.inventory.includes('คบเพลิง') },
      { id:'defend', icon:'🛡️', label:'ตั้งรับปกป้องเพื่อน', sub:'ทีมโดนดาเมจครึ่งเดียวรอบนี้' },
      { id:'hide', icon:'🌿', label:'หลบไปซ่อน', sub:'ปลอดภัย แต่ทีมไม่ไว้ใจ (-ความไว้วางใจ)' },
    ];
  }
  function renderActs(pi, enabled) {
    if (!g().players[pi]) { $('boss-acts').innerHTML = ''; return; } // auto mode: no player buttons
    $('boss-acts').innerHTML = actionsFor(pi).map(a => `<button class="bs-act" data-a="${a.id}" ${a.disabled || !enabled ? 'disabled' : ''}>${a.icon} ${a.label}<small>${a.sub}</small></button>`).join('');
    $('boss-acts').querySelectorAll('[data-a]').forEach(b => b.onclick = () => round(pi, b.dataset.a));
  }

  // One round: player's move + bots attack, then the boss strikes back
  function round(pi, move) {
    if (!F || F.busy || F.done) return;
    F.busy = true;
    renderActs(pi, false);
    const s = g(), now = performance.now();
    let scared = false, halve = false, dealt = 0;
    team().forEach(({ p, i }, k) => {
      let m = p.isBot || i !== pi ? (p.inventory.includes('ธนู') && Math.random() < 0.4 ? 'bow' : 'attack') : move;
      if (i !== pi && !p.isBot) m = 'attack';
      let d = 0;
      if (m === 'attack') { const w = weaponDmg(p); d = w.dmg; if (w.item) useTool(i, w.item); if (p.inventory.includes('ขวานเหล็ก')) useTool(i, 'ขวานเหล็ก'); }
      else if (m === 'bow') { if (useTool(i, 'ธนู')) d = 25; }
      else if (m === 'torch') { const ti = p.inventory.indexOf('คบเพลิง'); if (ti > -1) { p.inventory.splice(ti, 1); d = 35; scared = true; } }
      else if (m === 'defend') halve = true;
      else if (m === 'hide') { p.trust = cl((p.trust || 50) - 8, 0, 100); p.bossHid = true; }
      if (d) {
        dealt += d;
        anim.mateLunge[i] = { s: now + k * 120, d: 260 };
        anim.nums.push({ txt: '-' + d, x: 220, y: 60 - k * 6, col: '#ffd34d', t: now + k * 120 + 120 });
        log(`${p.emoji} ${p.name} ${m === 'bow' ? 'ยิงธนู' : m === 'torch' ? 'ฟาดคบเพลิงใส่' : 'โจมตี'} −${d}`, 'good');
      } else if (m === 'defend') log(`${p.emoji} ${p.name} ตั้งรับคุ้มกันทุกคน`);
      else if (m === 'hide') log(`${p.emoji} ${p.name} หลบเข้าพุ่มไม้…`, 'bad');
    });
    F.hp -= dealt;
    anim.flash = now + 220;
    sfx('hit');
    setHp();
    setTimeout(() => {
      if (F.hp <= 0) return finish(true, pi);
      if (scared) { log(`🔥 ${BOSS_NAME} ผงะถอยหนีไฟ ไม่กล้าโจมตีรอบนี้!`, 'good'); return next(pi); }
      // boss strikes 1-2 people (never the hiders)
      const targets = team().filter(x => !x.p.bossHid);
      const hits = [];
      const n = Math.random() < 0.4 ? 2 : 1;
      for (let k = 0; k < n && targets.length; k++) {
        const x = targets.splice(Math.floor(Math.random() * targets.length), 1)[0];
        const base = { easy:[14, 20], normal:[18, 26], hard:[24, 32] }[diff()] || [18, 26];
        let dmg = base[0] + Math.floor(Math.random() * (base[1] - base[0] + 1));
        if (halve) dmg = Math.ceil(dmg / 2);
        dmg = incomingDamage(x.i, dmg);
        x.p.hp = cl(x.p.hp - dmg, 0, 100);
        x.p.stats.damageTaken += dmg;
        hits.push(x.i);
        anim.nums.push({ txt: '-' + dmg, x: 60 + team().findIndex(y => y.i === x.i) * 22, y: 92, col: '#ff6a6a', t: performance.now() + 200 });
        log(`🐅 ${BOSS_NAME} ตะปบ ${x.p.name} −${dmg}`, 'bad');
        if (x.p.hp <= 0) { x.p.alive = false; x.p.stats.dayDied = g().day; log(`☠️ ${x.p.name} ล้มลง…`, 'bad'); }
      }
      anim.bossLunge = { s: performance.now(), d: 380 };
      sfx('hurt');
      if (!reduceMotion) { const c = $('boss-card'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
      renderTeam(hits);
      if (!team().length) return finish(false, pi);
      next(pi);
    }, 650);
  }
  function next(pi) {
    team().forEach(x => { delete x.p.bossHid; });
    F.round++;
    if (F.round > ROUNDS) return finish(false, pi, true);
    $('boss-title').innerHTML = `🐅 ${BOSS_NAME} บุกแคมป์! <span class="bs-round">รอบ ${F.round}/${ROUNDS}</span>`;
    F.busy = false;
    const alivePi = g().players[pi] && g().players[pi].alive;
    if (alivePi) renderActs(pi, true); else setTimeout(() => round(pi, 'attack'), 700);
  }

  function finish(win, pi, retreated) {
    F.done = true;
    const s = g(), b = bs();
    team().forEach(x => { delete x.p.bossHid; });
    let text;
    if (win) {
      b.result = 'win';
      s.camp.sharedItems.push('เนื้อสัตว์', 'เนื้อสัตว์', 'เนื้อสัตว์');
      const hero = team().sort((a, c) => c.p.hp - a.p.hp)[0];
      if (hero) addToInventory(hero.i, TROPHY);
      team().forEach(x => { x.p.sanity = cl(x.p.sanity + 20, 0, 100); x.p.stats.animalsDefeated++; });
      text = `🏆 ล้ม${BOSS_NAME}ได้สำเร็จ! ทั้งทีมฮึกเหิม (สติ +20)\n🥩 เนื้อสัตว์ 3 ชิ้นเข้าคลังแคมป์${hero ? `\n💎 ${hero.p.name} ได้ "${TROPHY}" (ของมีค่า)` : ''}`;
      sfx('victory');
      if (window.FX) FX.pop('🏆');
    } else {
      b.result = retreated ? 'retreat' : 'lose';
      const order = ['tower', 'watertank', 'workbench', 'hut', 'fence', 'garden', 'smoker', 'campfire'];
      const wrecked = order.filter(id => s.camp.structures.includes(id) && !s.camp.structures.includes('fortified')).slice(0, 2);
      wrecked.forEach(id => s.camp.structures.splice(s.camp.structures.indexOf(id), 1));
      if (typeof updateCampLevel === 'function') updateCampLevel();
      const food = s.camp.sharedItems.filter(isFood).slice(0, 3);
      food.forEach(f => s.camp.sharedItems.splice(s.camp.sharedItems.indexOf(f), 1));
      team().forEach(x => { x.p.sanity = cl(x.p.sanity - 15, 0, 100); });
      const names = wrecked.map(id => (CAMP_STRUCTURES.find(c => c.id === id) || {}).name).filter(Boolean);
      text = `${retreated ? `🐅 ${BOSS_NAME} ถอยกลับเข้าป่า แต่ทิ้งความเสียหายไว้มาก` : `💀 ทีมพ่ายแพ้ ${BOSS_NAME} อาละวาดจนพอใจแล้วจากไป`}\n${names.length ? `🏚️ ${names.join(', ')} พังเสียหาย\n` : ''}${food.length ? `🍖 อาหาร ${food.length} ชิ้นถูกคาบไป\n` : ''}😨 ทุกคนสติ -15`;
      sfx('defeat');
    }
    log(text.split('\n')[0], win ? 'good' : 'bad');
    addMsg(text, win ? 'bubble-event-good' : 'bubble-event-bad');
    s.players.forEach((p, i) => { if (!p.alive && p.hp <= 0) document.getElementById(`panel-p${i}`)?.classList.add('dead'); });
    renderAllPanels();
    if (typeof updateCampUI === 'function') updateCampUI();
    $('boss-acts').innerHTML = `<button class="bs-act" id="bs-done" style="grid-column:1/-1;align-items:center">${win ? '🏆 ฉลองชัยแล้วเริ่มวันใหม่' : '😮‍💨 เก็บกวาดแคมป์แล้วเริ่มวันใหม่'}<small>${esc(text.split('\n').slice(1).join(' · '))}</small></button>`;
    $('bs-done').onclick = () => { modal.classList.remove('show'); const cb = F.after; F = null; cb && cb(); };
  }

  // auto: resolve without the fight screen (multiplayer, or the local player is dead)
  function start(after, auto) {
    const s = g(), b = bs();
    b.done = true;
    // a bare-handed team (4 × 8 DMG × 5 rounds = 160) shouldn't win on normal: bring weapons, fences, torches
    const max = { easy:140, normal:200, hard:260 }[diff()] || 200;
    let hp = max;
    const pre = [];
    if (s.camp.structures.includes('fence')) { hp -= 20; pre.push('🪵 รั้วไม้ทำให้มันบาดเจ็บก่อนบุกเข้ามา (−20)'); }
    if (s.camp.structures.includes('trapfence')) { hp -= 30; pre.push('🪤 มันเหยียบรั้วกับดัก! (−30)'); }
    team().forEach(x => { x.p.atCamp = true; });
    F = { hp, max, round: 1, log: [], done: false, busy: false, after };
    const pi = myIndex();
    const human = s.players[pi];
    const interactive = !auto && s.mode !== 'multi' && human && human.alive && !human.isBot;
    if (s.camp.structures.includes('fortified')) {
      addMsg(`🛡️ ${BOSS_NAME} พุ่งชนกำแพงเหล็กกันภัยจนหัวแตก แล้ววิ่งหนีไป! ทิ้ง "${TROPHY}" ไว้หน้าแคมป์`, 'bubble-event-good');
      s.camp.sharedItems.push(TROPHY);
      b.result = 'repelled';
      updateCampUI(); renderAllPanels();
      return after();
    }
    if (!interactive) {
      // auto-resolve: same rules, bots only
      let guard = 0;
      while (!F.done && guard++ < 20) {
        F.busy = false;
        round(-1, 'attack');
        // round() continues in a timeout; run it synchronously for auto mode
      }
      return;
    }
    modal.classList.add('show');
    $('boss-title').innerHTML = `🐅 ${BOSS_NAME} บุกแคมป์! <span class="bs-round">รอบ 1/${ROUNDS}</span>`;
    $('boss-sub').textContent = `เจ้าป่าตัวมหึมาพุ่งออกมาจากความมืดตอนรุ่งสาง ทุกคนต้องช่วยกันสู้! ${ROUNDS} รอบ — ล้มมันให้ได้ก่อนมันจะพังแคมป์`;
    setHp();
    renderTeam();
    $('boss-log').innerHTML = '';
    pre.forEach(t => log(t, 'good'));
    log(`🐅 ${BOSS_NAME} คำรามสนั่นป่า!`, 'bad');
    renderActs(pi, true);
    sfx('alert');
    anim.t0 = performance.now();
    if (!anim.raf) anim.raf = requestAnimationFrame(frame);
    if (window.FX) FX.play && FX.prefs.cutscenes && FX.play('encounter', { animal: `🐅 ${BOSS_NAME}`, id: 'forest', shirt: human.color });
  }

  // Auto mode needs synchronous rounds: run the same logic without timers
  const _setTimeout = window.setTimeout;
  function autoResolve(after) {
    window.setTimeout = (fn) => { fn(); return 0; };
    try { start(after, true); } finally { window.setTimeout = _setTimeout; }
    if (F && F.done) { const cb = F.after; F = null; cb && cb(); }
  }

  // Foreshadow the day before, fight at the start of the boss day
  wrap('startTurn', orig => function (pi) {
    const self = this, args = arguments, s = g();
    try {
      const b = bs();
      const firstOfDay = s.dayDone && s.dayDone.every(d => !d) && pi === s.players.findIndex(p => p.alive);
      if (firstOfDay && s.day === b.day - 1 && !b.warned) {
        b.warned = true;
        addMsg(`🐾 พบรอยเท้าขนาดมหึมารอบแคมป์ และได้ยินเสียงคำรามจากป่าลึก… มีบางอย่างกำลังจับตาพวกคุณ เตรียมอาวุธ รั้ว และคบเพลิงไว้!`, 'bubble-event-bad');
      }
      if (firstOfDay && s.day === b.day && !b.done && team().length) {
        const go = () => {
          if (!team().length) { gameEnd(false); return; }
          const nextPi = s.players[pi].alive ? pi : s.players.findIndex(p => p.alive);
          s.currentPlayer = nextPi;
          orig.call(self, nextPi);
        };
        const human = s.players[myIndex()];
        if (s.mode !== 'multi' && human && human.alive && !human.isBot) GP.whenClear(() => start(go));
        else autoResolve(go);
        return;
      }
    } catch (e) { console.warn('[boss]', e); }
    return orig.apply(self, args);
  });

  window.BOSS = { start, state: bs, _auto: autoResolve };
})();
