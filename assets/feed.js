// ===================== FEED: GUIDANCE, ACTION PREVIEWS, SCENE PANEL, EVENT-CARD STORY FEED =====================
// Presentation and guidance only — never changes game rules. Loaded after game.js / systems / fx / gameplay / roles.
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  function g() { try { return G; } catch (e) { return null; } }
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[feed] cannot hook', name); return; }
    window[name] = make(orig);
  }

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  /* scene panel */
  #fd-scene{position:relative;height:92px;border-radius:12px;overflow:hidden;border:1px solid var(--border2);box-shadow:var(--shadow);background:#0b1410}
  #fd-scene canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;transition:opacity .6s}
  #fd-scene .fd-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,8,6,.85) 0%,rgba(4,8,6,.35) 55%,rgba(4,8,6,.1) 100%)}
  #fd-scene .fd-cap{position:absolute;left:12px;top:10px;right:12px;display:flex;flex-direction:column;gap:3px}
  #fd-scene .fd-where{font-size:15px;font-weight:800;color:#f3ecd2;text-shadow:2px 2px 0 #000}
  #fd-scene .fd-meta{font-size:11px;color:#c9d8bf;text-shadow:1px 1px 0 #000}
  #fd-slots{display:flex;gap:6px;margin-top:4px}
  .fd-slot{position:relative;min-width:74px;height:20px;border-radius:10px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.15);overflow:hidden;font-size:10px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;text-shadow:1px 1px 0 #000}
  .fd-slot i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(232,168,48,.75),rgba(255,214,120,.75));transition:width .7s cubic-bezier(.22,1,.36,1)}
  .fd-slot span{position:relative}
  .fd-slot.now{border-color:#ffd878;box-shadow:0 0 10px rgba(255,216,120,.45)}
  .fd-slot.gone{opacity:.45}

  /* guidance strip */
  #fd-hints{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  #fd-hints .fd-hint-title{font-size:10px;font-weight:800;letter-spacing:1px;color:var(--amber2);text-transform:uppercase;width:100%;display:flex;align-items:center;gap:6px}
  .fd-hint{display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:20px;border:1px solid rgba(232,168,48,.45);background:linear-gradient(90deg,rgba(232,168,48,.14),rgba(232,168,48,.04));color:#ffe3a0;font:700 11px 'Noto Sans Thai',sans-serif;cursor:pointer;transition:transform .15s,box-shadow .15s;animation:fdHintIn .4s cubic-bezier(.2,1.4,.4,1) backwards}
  .fd-hint:nth-child(3){animation-delay:.07s}.fd-hint:nth-child(4){animation-delay:.14s}
  .fd-hint:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.4),0 0 12px rgba(232,168,48,.3)}
  .fd-hint.urgent{border-color:rgba(255,106,106,.6);background:linear-gradient(90deg,rgba(216,72,72,.22),rgba(216,72,72,.05));color:#ffc0c0;animation:fdHintIn .4s cubic-bezier(.2,1.4,.4,1) backwards,fdUrgent 1.4s ease-in-out .4s infinite}
  @keyframes fdHintIn{from{opacity:0;transform:translateY(8px) scale(.9)}}
  @keyframes fdUrgent{50%{box-shadow:0 0 0 2px rgba(255,106,106,.35),0 0 14px rgba(255,106,106,.35)}}

  /* action previews */
  .act-btn .act-sub{display:block;font-size:10px;font-weight:600;color:var(--text3);margin-top:1px;line-height:1.3}
  .act-btn.fd-unavail{opacity:.55}
  .act-btn.fd-unavail .act-sub{color:#f3a0a0}
  .act-btn.fd-good .act-sub{color:#9be8a8}

  /* feed */
  #fd-filters{display:flex;gap:4px;margin-bottom:-2px;padding-left:4px}
  .fd-filter{padding:5px 12px;border-radius:10px 10px 0 0;border:1px solid var(--border);border-bottom:none;background:var(--bg3);color:var(--text3);font:700 11px 'Noto Sans Thai',sans-serif;cursor:pointer}
  .fd-filter.on{background:var(--panel);color:var(--green3);border-color:var(--border2)}
  #story-box[data-filter="imp"] .story-msg:not([data-imp="1"]),
  #story-box[data-filter="mine"] .story-msg:not([data-mine="1"]){display:none}
  #story-box[data-filter="imp"] .fd-group,#story-box[data-filter="mine"] .fd-group{display:none}
  .story-msg{align-items:flex-start;gap:8px}
  .fd-ava{flex-shrink:0;width:28px;height:28px;border-radius:9px;display:grid;place-items:center;font-size:15px;border:1px solid;margin-top:2px}
  .story-msg.fd-mine{flex-direction:row-reverse}
  .story-msg.fd-mine .story-bubble{margin-left:auto}
  .fd-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
  .fd-chip{font-size:10px;font-weight:800;padding:1px 7px;border-radius:9px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1)}
  .fd-chip.up{color:#9be8a8;border-color:rgba(48,152,72,.45);background:rgba(48,152,72,.14)}
  .fd-chip.down{color:#f3a0a0;border-color:rgba(184,40,40,.45);background:rgba(184,40,40,.14)}
  .fd-chip.item{color:#ffe3a0;border-color:rgba(232,168,48,.45);background:rgba(232,168,48,.12)}
  .bubble-event-good,.bubble-event-bad{text-align:left !important;align-self:stretch !important;display:flex;gap:10px;align-items:flex-start}
  .fd-ev-ico{font-size:22px;line-height:1;flex-shrink:0;filter:drop-shadow(0 2px 0 rgba(0,0,0,.5))}
  .fd-ev-body{flex:1;min-width:0}
  .fd-day{align-self:stretch;display:flex;align-items:center;gap:10px;margin:8px 0 4px;color:#ffe3a0;font-weight:800;font-size:12px;animation:fdDay .7s cubic-bezier(.22,1,.36,1) backwards}
  .fd-day::before,.fd-day::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(232,168,48,.6),transparent)}
  .fd-day span{padding:3px 12px;border-radius:12px;border:1px solid rgba(232,168,48,.5);background:rgba(232,168,48,.1)}
  @keyframes fdDay{from{opacity:0;letter-spacing:6px}}
  .fd-group{align-self:stretch;border-radius:10px;border:1px dashed var(--border2);background:rgba(255,255,255,.02);animation:msgIn .4s cubic-bezier(.22,1,.36,1) backwards}
  .fd-group summary{list-style:none;cursor:pointer;padding:7px 10px;font-size:11px;font-weight:700;color:var(--text2);display:flex;align-items:center;gap:8px}
  .fd-group summary::-webkit-details-marker{display:none}
  .fd-group summary .fd-count{margin-left:auto;font-size:10px;color:var(--text3)}
  .fd-group summary::after{content:'▾';color:var(--text3);transition:transform .2s}
  .fd-group[open] summary::after{transform:rotate(180deg)}
  .fd-group .fd-group-body{display:flex;flex-direction:column;gap:5px;padding:0 8px 8px}
  .fd-group .fd-live{width:7px;height:7px;border-radius:50%;background:var(--green2);box-shadow:0 0 6px var(--green2);animation:fdBlink 1s steps(2) infinite}
  @keyframes fdBlink{50%{opacity:.2}}
  @media (prefers-reduced-motion: reduce){.fd-hint,.fd-day,.fd-group{animation:none !important}}
  `;
  document.head.appendChild(style);

  // ---------- scene panel + time slots ----------
  let sceneKey = '';
  function ensureScene() {
    let el = $('fd-scene');
    if (el) return el;
    const th = $('turn-header');
    if (!th) return null;
    el = document.createElement('div');
    el.id = 'fd-scene';
    el.innerHTML = '<canvas width="240" height="88"></canvas><div class="fd-shade"></div><div class="fd-cap"><div class="fd-where"></div><div class="fd-meta"></div><div id="fd-slots"></div></div>';
    th.insertAdjacentElement('afterend', el);
    return el;
  }
  function placeOf(pi) {
    const s = g(), p = s.players[pi];
    if (p.atCamp) return { id: s.camp.structures.includes('hut') ? 'hut' : 'meadow', name: `⛺ แคมป์ (Lv.${s.camp.level})` };
    const loc = [...s.locations].reverse().find(l => l.explored.includes(pi));
    return loc ? { id: loc.id, name: `${loc.emoji} ${loc.name}` } : { id: 'forest', name: '🌿 กลางป่า' };
  }
  function renderScene() {
    const s = g();
    if (!s || !s.players || !s.players.length || !s.locations || !s.locations.length) return;
    const el = ensureScene(); if (!el) return;
    const pi = s.currentPlayer, p = s.players[pi]; if (!p) return;
    const place = placeOf(pi);
    const key = `${pi}|${place.id}|${s.day}`;
    if (key !== sceneKey && window.FX && FX.locationThumb) {
      sceneKey = key;
      const c = el.querySelector('canvas');
      c.style.opacity = '0';
      FX.locationThumb(c, place.id);
      requestAnimationFrame(() => { c.style.opacity = '1'; });
    }
    el.querySelector('.fd-where').textContent = `${p.emoji} ${p.name} · ${place.name}`;
    el.querySelector('.fd-meta').textContent = `วันที่ ${s.day}/7 · ${s.weather ? s.weather.icon + ' ' + s.weather.text : ''}`;
    // 24 hours shown as three 8-hour parts of the day
    const used = 24 - Math.max(0, p.hoursLeft);
    const slots = [['☀️ เช้า', 0], ['🌤️ บ่าย', 8], ['🌙 เย็น', 16]];
    $('fd-slots').innerHTML = slots.map(([label, start]) => {
      const fill = Math.max(0, Math.min(8, used - start)) / 8;
      const cls = fill >= 1 ? ' gone' : (used >= start && used < start + 8) ? ' now' : '';
      return `<div class="fd-slot${cls}"><i style="width:${Math.round(fill * 100)}%"></i><span>${label}</span></div>`;
    }).join('') + `<div class="fd-slot" style="min-width:auto;padding:0 8px"><span>⏰ ${p.hoursLeft} ชม.</span></div>`;
  }

  // ---------- guidance: what should I do now? ----------
  function hints(pi) {
    const s = g(), p = s.players[pi];
    const out = [];
    const foods = p.inventory.filter(i => isFood(i) && !['ผลไม้มีพิษ', 'น้ำเน่า', 'อาหารอาบยาพิษ'].includes(i));
    const water = p.inventory.find(i => i === 'น้ำสะอาด');
    const med = pickHealItem(p);
    const hasFire = s.camp.structures.includes('campfire');
    const weapon = ['หอก', 'มีด', 'ธนู'].some(w => p.inventory.includes(w));
    const craftable = CRAFTS.filter(c => !c.side && s.discovered && s.discovered.includes(c.name) && tierUnlocked(c.tier) && haveAll(pi, c.needs) && p.hoursLeft >= craftHours(pi, c.time)).length;
    if (s.day === 7 && ['คบเพลิง', 'สัญญาณขอความช่วยเหลือ', 'วิทยุกู้ภัย SOS'].some(i => p.inventory.includes(i)))
      out.push({ icon:'🚁', text:'วันสุดท้าย! ส่งสัญญาณกู้ภัยเลย', urgent:true, act:'rescue' });
    if (p.statuses.some(st => st === 'sick' || st === 'poison') || p.hp < 35)
      out.push(med || p.job.id === 'doctor' ? { icon:'💊', text:`HP ${p.hp}${p.statuses.includes('poison') ? ' + โดนพิษ' : ''} — รักษาตัวด่วน`, urgent:true, act:'heal' }
        : { icon:'🩹', text:'บาดเจ็บแต่ไม่มียา — คราฟผ้าพันแผล/ยาสมุนไพร', urgent:true, wb:'med' });
    if (p.thirst < 35) out.push(water ? { icon:'💧', text:`น้ำเหลือ ${p.thirst}% — ดื่มน้ำ`, urgent:true, act:'eat' }
      : { icon:'💧', text:'กระหายน้ำ — ไปแม่น้ำ/น้ำตกหาน้ำ', urgent:true, act:'explore' });
    if (p.hunger < 35) out.push(foods.length ? { icon:'🍖', text:`หิวมาก (${p.hunger}) — กินอาหาร`, urgent:true, act:'eat' }
      : p.inventory.includes('เบ็ดตกปลา') ? { icon:'🎣', text:'หิวแต่ไม่มีอาหาร — ตกปลา', urgent:true, act:'fish' }
      : { icon:'🍖', text:'ไม่มีอาหาร — ออกสำรวจหรือหยิบจากคลังแคมป์', urgent:true, act:'explore' });
    if (p.energy < 25) out.push({ icon:'😴', text:`พลังงานเหลือ ${p.energy}% — พักผ่อน`, urgent:true, act:'rest' });
    if (!p.atCamp && p.hoursLeft <= 3 && p.hoursLeft > 0) out.push({ icon:'🏕️', text:'ใกล้ค่ำแล้ว — กลับแคมป์ ไม่งั้นพลังงานลดถาวร', urgent:true, act:'camp' });
    if (!hasFire && p.atCamp) out.push(haveAll(pi, ['ไม้', 'ไม้']) ? { icon:'🔥', text:'สร้างกองไฟ — ทำอาหาร กันหนาว ไล่สัตว์', wb:'camp' } : { icon:'⛏️', text:'เก็บไม้ไปสร้างกองไฟ', act:'gather' });
    if (!weapon && haveAll(pi, ['ไม้', 'หิน'])) out.push({ icon:'🗡️', text:'คราฟหอกก่อนเข้าป่า', wb:'tool' });
    if (craftable) out.push({ icon:'🔨', text:`มีของคราฟได้ ${craftable} อย่าง`, wb:'tool' });
    if (p.side === 'evil') out.push({ icon:'🔴', text:'คืนนี้ลงมือได้ — ทำตัวให้ปกติไว้ตอนกลางวัน' });
    const d = s.rescueData && s.rescueData.story && s.rescueData.story.daily;
    if (d && !d.rewarded) { const q = { build:'🔨 สร้างของในแคมป์', deposit:'📦 ฝากของเข้าคลัง', hunt:'🐾 ล้มสัตว์ป่า', explore:'🗺️ สำรวจให้ครบ', share:'🎁 แบ่งของ', craft:'🧪 คราฟของ', healthy:'❤️ รักษาทุกคนให้ HP 50+' }[d.id]; if (q) out.push({ icon:'🎯', text:`ภารกิจวันนี้: ${q}` }); }
    if (!out.length) out.push({ icon:'🌿', text:'ออกสำรวจหาวัสดุ อาหาร และเรื่องราวใหม่', act:'explore' });
    return out.slice(0, 3);
  }
  function renderHints(pi) {
    const s = g(); if (!s || pi !== myIndex() || !s.players[pi] || s.players[pi].isBot) { $('fd-hints')?.remove(); return; }
    const area = $('actions-area'); if (!area) return;
    let box = $('fd-hints');
    if (!box) { box = document.createElement('div'); box.id = 'fd-hints'; area.insertBefore(box, area.firstChild); }
    const list = hints(pi);
    box.innerHTML = '<div class="fd-hint-title">🧭 ตอนนี้ควรทำอะไร</div>' + list.map((h, k) => `<button class="fd-hint${h.urgent ? ' urgent' : ''}" data-k="${k}">${h.icon} ${esc(h.text)}</button>`).join('');
    box.querySelectorAll('.fd-hint').forEach(b => b.onclick = () => {
      const h = list[+b.dataset.k];
      if (h.wb && window.SX) SX.openWorkbench(pi, h.wb);
      else if (h.act) handleAction(pi, h.act);
    });
  }

  // ---------- action previews ----------
  function preview(pi, action) {
    const s = g(), p = s.players[pi];
    const sts = s.camp.structures;
    switch (action) {
      case 'explore': { const left = s.locations.filter(l => !l.explored.includes(pi) && !l.blocked).length; return left ? { t:`ได้วัสดุ 1–3 + ของสุ่ม · เหลือ ${left} ที่` } : { t:'ไปครบทุกที่แล้ววันนี้', bad:true }; }
      case 'rest': return { t:`⚡ +${sts.includes('hut') ? 65 : p.inventory.includes('ที่พักชั่วคราว') ? 50 : sts.includes('campfire') ? 40 : 30}${sts.includes('hut') ? ' (กระท่อม)' : ''}`, good:true };
      case 'eat': { const n = new Set(p.inventory.filter(isFood)).size; return n ? { t:`เลือกได้ ${n} อย่าง`, good:true } : { t:'ไม่มีอาหารในกระเป๋า', bad:true }; }
      case 'heal': { if (p.job.id === 'doctor') return { t:'หมอ: รักษาฟรี +25', good:true }; const m = pickHealItem(p); return m ? { t:`ใช้ ${m} (+${HEAL_ITEMS[m].hp} HP)`, good:true } : { t:'ไม่มียา', bad:true }; }
      case 'share': return { t:'ให้ของเพื่อน · ได้ความไว้วางใจ' };
      case 'craft': { const n = CRAFTS.filter(c => !c.side && s.discovered && s.discovered.includes(c.name) && tierUnlocked(c.tier) && haveAll(pi, c.needs)).length; return n ? { t:`คราฟได้ ${n} อย่าง`, good:true } : { t:'ดูสูตร / ขาดวัสดุ' }; }
      case 'skill': return p.skillUsed ? { t:'ใช้แล้ววันนี้ — พรุ่งนี้ใช้ได้ใหม่', bad:true } : { t: p.job.skill.split('(')[0].slice(0, 46) };
      case 'gather': return { t:`+2 วัสดุ (ไม้/หิน/หญ้า/เชือก)${p.inventory.includes('ขวานเหล็ก') ? ' + ไม้ 2 (ขวาน)' : ''}`, good:true };
      case 'camp': return { t:'กลับไปพัก คราฟ ฝากของ' };
      case 'fish': return { t:'65% ได้ปลา · ริมน้ำ 90%', good:true };
      default: return null;
    }
  }
  wrap('renderActions', orig => function (pi) {
    const res = orig.apply(this, arguments);
    // ui.js rewrites the button labels after this wrapper returns; add previews once it has
    queueMicrotask(() => decorateActions(pi));
    return res;
  });
  function decorateActions(pi) {
    try {
      document.querySelectorAll('#action-buttons .act-btn').forEach(btn => {
        const pv = preview(pi, btn.dataset.action);
        if (!pv) return;
        const label = btn.querySelector('.act-text') || btn.querySelector('span:not(.act-cost):not(.act-ico)');
        if (!label || label.querySelector('.act-sub')) return;
        const sub = document.createElement('span');
        sub.className = 'act-sub';
        sub.textContent = pv.t;
        label.appendChild(sub);
        btn.classList.toggle('fd-unavail', !!pv.bad);
        btn.classList.toggle('fd-good', !!pv.good);
      });
      renderHints(pi);
      renderScene();
    } catch (e) { console.warn('[feed] actions', e); }
  }

  // ---------- story feed: event cards ----------
  const IMPORTANT = /🗳️|📜|☀️ วันที่|👁️|☠️|🏆|🚪|🚁|💥|🎯|🏅|💡|⚔️ คุณ|🔔|🪓|🎒 ตื่นเช้า/;
  function chipsFor(text) {
    // craft/build lines quote the item's description ("HP +15"), which isn't a real change
    if (/คราฟ|สร้าง .* ให้แคมป์|ใช้สกิล/.test(text)) return '';
    const chips = [];
    const re = /(HP|พลังงาน|สติ|ค่าสติ|Sanity|หิว|ความหิว|น้ำ|ความกระหาย)\s*([+-]\s?\d+)/g;
    let m;
    const icon = { 'HP':'❤️', 'พลังงาน':'⚡', 'สติ':'🧠', 'ค่าสติ':'🧠', 'Sanity':'🧠', 'หิว':'🍖', 'ความหิว':'🍖', 'น้ำ':'💧', 'ความกระหาย':'💧' };
    while ((m = re.exec(text))) {
      const v = m[2].replace(/\s/g, '');
      chips.push(`<span class="fd-chip ${v.startsWith('-') ? 'down' : 'up'}">${icon[m[1]] || ''} ${v}</span>`);
    }
    const got = text.match(/ได้รับ(?:ของสำรวจ)?:\s*([^\n(]+)/);
    if (got) got[1].split(/,|·/).map(x => x.trim()).filter(Boolean).slice(0, 5).forEach(it => chips.push(`<span class="fd-chip item">🎒 ${esc(it.replace(/[🥩]/g, '').trim())}</span>`));
    return chips.length ? `<div class="fd-chips">${chips.join('')}</div>` : '';
  }
  function playerByText(text) {
    const s = g(); if (!s || !s.players) return -1;
    return s.players.findIndex(p => p && p.name && (text.startsWith(`${p.emoji} ${p.name}`) || text.startsWith(p.name + ' ')));
  }
  let group = null; // { key, el, body, count, name, emoji }
  // a bot's turn is over: freeze its card
  function finishGroup() {
    if (!group) return;
    const summary = group.el.querySelector('summary');
    const label = [...summary.childNodes].find(n => n.nodeType === 3);
    if (label) label.textContent = ` ${group.emoji} สรุปเทิร์นของ ${group.name} `;
    group.el.querySelector('.fd-live')?.remove();
    group = null;
  }
  wrap('addMsg', orig => function (text, cls) {
    const res = orig.apply(this, arguments);
    try { decorate(String(text), cls); } catch (e) { /* visuals only */ }
    return res;
  });
  function decorate(text, cls) {
    const box = $('story-box'); if (!box) return;
    const msg = box.lastElementChild; if (!msg || !msg.classList.contains('story-msg')) return;
    const bubble = msg.querySelector('.story-bubble');
    const s = g(), mi = myIndex();
    const me = s && s.players && s.players[mi];
    const imp = /bubble-event-(bad|good)|bubble-day-summary|bubble-pvp/.test(cls) || IMPORTANT.test(text);
    msg.dataset.imp = imp ? '1' : '0';
    msg.dataset.mine = me && text.includes(me.name) ? '1' : '0';

    // day divider
    if (/^☀️ วันที่ \d+ เริ่มต้นขึ้น/.test(text)) {
      msg.className = 'story-msg fd-day';
      msg.dataset.imp = '1';
      msg.innerHTML = `<span>${esc(text.replace(' เริ่มต้นขึ้น', ''))}</span>`;
      finishGroup();
      return;
    }
    // good / bad events become icon cards with stat chips
    if (/bubble-event-(bad|good)/.test(cls)) {
      const m = text.match(/^(\p{Extended_Pictographic}️?)\s*/u);
      const ico = m ? m[1] : (cls.includes('bad') ? '⚠️' : '✨');
      const body = bubble.innerHTML.replace(/^(\p{Extended_Pictographic}️?)\s*/u, '');
      bubble.innerHTML = `<div class="fd-ev-ico">${ico}</div><div class="fd-ev-body">${body}${chipsFor(text)}</div>`;
    } else if (cls === 'bubble-narrator') {
      bubble.insertAdjacentHTML('beforeend', chipsFor(text));
    }
    // portraits for player lines
    const who = playerByText(text);
    if (who > -1 && (cls === 'bubble-player' || cls === 'bubble-narrator')) {
      const p = s.players[who];
      const ava = document.createElement('div');
      ava.className = 'fd-ava';
      ava.textContent = p.emoji;
      ava.style.borderColor = p.color || '#4a9e5c';
      ava.style.background = (p.color || '#4a9e5c') + '26';
      msg.prepend(ava);
      if (who === mi) msg.classList.add('fd-mine');
    }
    // fold a bot's routine messages into one card per turn
    const cur = s && s.players && s.players[s.currentPlayer];
    if (cur && cur.isBot && s.currentPlayer !== mi && !imp && !(s.mode === 'multi')) {
      const key = `${s.day}:${s.currentPlayer}`;
      if (!group || group.key !== key || !group.el.isConnected) {
        finishGroup();
        const el = document.createElement('details');
        el.className = 'fd-group';
        el.innerHTML = `<summary><span class="fd-live"></span>${cur.emoji} ระหว่างนั้น… ${esc(cur.name)} กำลังทำเทิร์น <span class="fd-count"></span></summary><div class="fd-group-body"></div>`;
        box.insertBefore(el, msg);
        group = { key, el, body: el.querySelector('.fd-group-body'), count: 0, name: cur.name, emoji: cur.emoji };
      }
      group.body.appendChild(msg);
      group.count++;
      group.el.querySelector('.fd-count').textContent = `${group.count} เหตุการณ์ · แตะเพื่อดู`;
      box.scrollTop = box.scrollHeight;
    } else if (group && cur && !cur.isBot) {
      finishGroup();
    }
  }

  // filter tabs above the story box
  function ensureFilters() {
    const box = $('story-box'); if (!box || $('fd-filters')) return;
    const bar = document.createElement('div');
    bar.id = 'fd-filters';
    bar.innerHTML = '<button class="fd-filter on" data-f="all">📜 ทั้งหมด</button><button class="fd-filter" data-f="imp">⭐ สำคัญ</button><button class="fd-filter" data-f="mine">🙋 ของฉัน</button>';
    box.parentNode.insertBefore(bar, box);
    bar.querySelectorAll('.fd-filter').forEach(b => b.onclick = () => {
      bar.querySelectorAll('.fd-filter').forEach(x => x.classList.toggle('on', x === b));
      box.dataset.filter = b.dataset.f;
      box.scrollTop = box.scrollHeight;
      if (window.FX) FX.sfx('click');
    });
  }
  ensureFilters();

  wrap('renderAllPanels', orig => function () {
    const res = orig.apply(this, arguments);
    try { renderScene(); } catch (e) { /* visuals only */ }
    return res;
  });
  wrap('updateTurnHeader', orig => function (pi) {
    const res = orig.apply(this, arguments);
    try { renderScene(); renderHints(pi); } catch (e) { /* visuals only */ }
    return res;
  });
})();
