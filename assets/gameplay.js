// ===================== GAMEPLAY: SITUATIONS, NIGHT PHASE, QUESTS, ENDINGS =====================
// Loaded after fx.js. Hooks existing game functions by wrapping window[name].
// All state lives in G.rescueData.story so autosave (which saves G.rescueData) keeps it.
(function () {
  'use strict';

  // ---------- helpers ----------
  function g() { try { return G; } catch (e) { return null; } }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[gameplay] cannot hook', name); return; }
    window[name] = make(orig);
  }
  const rnd = () => Math.random();
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  function isMulti() { const s = g(); return !!(s && s.mode === 'multi'); }
  function isLocalHuman(pi) {
    const s = g(); const p = s && s.players && s.players[pi];
    return !!p && !p.isBot && pi === myIndex();
  }
  function alive() { return g().players.map((p, i) => ({ p, i })).filter(x => x.p.alive); }
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function cutsceneShowing() { const el = document.getElementById('fx-cutscene'); return !!(el && el.classList.contains('show')); }
  function whenClear(fn) { // wait for any cutscene to finish before opening a modal
    if (!cutsceneShowing()) return fn();
    const t = setInterval(() => { if (!cutsceneShowing()) { clearInterval(t); fn(); } }, 200);
  }

  function st() {
    const s = g();
    if (!s.rescueData) s.rescueData = { attempts: [], lastChance: 0, success: false };
    if (!s.rescueData.story) {
      s.rescueData.story = { seen: [], flags: {}, daily: null, dailyDone: [], deposits: 0, guard: null, nightLog: [] };
    }
    return s.rescueData.story;
  }

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  #gp-modal{position:fixed;inset:0;z-index:1900;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);padding:16px}
  #gp-modal.show{display:flex;animation:gpFade .25s ease}
  #gp-card{width:min(460px,100%);max-height:90vh;overflow:auto;background:linear-gradient(180deg,#141c18,#0c1210);border:1px solid var(--border2,#3a6);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.8),0 0 30px rgba(114,200,130,.15);animation:gpPop .35s cubic-bezier(.2,1.4,.4,1)}
  #gp-card.night{border-color:#6a78c8;box-shadow:0 20px 60px rgba(0,0,0,.8),0 0 30px rgba(110,130,230,.2)}
  #gp-banner{display:block;width:100%;aspect-ratio:120/44;image-rendering:pixelated;border-radius:16px 16px 0 0;border-bottom:1px solid var(--border,#244)}
  #gp-body{padding:14px 16px 16px}
  #gp-title{font-size:18px;font-weight:800;color:var(--green3,#bfe);margin-bottom:6px;display:flex;gap:8px;align-items:center}
  #gp-card.night #gp-title{color:#c8d0ff}
  #gp-text{font-size:13px;color:var(--text,#cdc);line-height:1.7;margin-bottom:12px;white-space:pre-line}
  .gp-choices{display:flex;flex-direction:column;gap:8px}
  .gp-choice{display:flex;align-items:center;gap:10px;text-align:left;padding:10px 12px;border-radius:10px;border:1px solid var(--border,#244);background:var(--bg4,#1a2020);color:var(--text,#cdc);font:600 13px 'Noto Sans Thai',sans-serif;cursor:pointer;transition:transform .15s,border-color .15s,box-shadow .15s;position:relative;overflow:hidden}
  .gp-choice:not(:disabled):hover{transform:translateY(-2px);border-color:var(--green2,#7c8);box-shadow:0 6px 16px rgba(0,0,0,.4)}
  .gp-choice:disabled{opacity:.4;cursor:not-allowed}
  .gp-choice .gp-ico{font-size:18px;width:28px;text-align:center;flex-shrink:0}
  .gp-choice .gp-lbl{flex:1}
  .gp-choice .gp-hint{font-size:10px;font-weight:600;color:var(--text3,#577);display:block;margin-top:2px}
  .gp-choice .gp-cost{font-size:10px;padding:2px 7px;border-radius:10px;background:rgba(72,144,200,.15);border:1px solid rgba(72,144,200,.3);color:var(--blue2,#49c);white-space:nowrap}
  .gp-result{padding:10px 12px;border-radius:10px;margin-bottom:12px;font-size:13px;line-height:1.7;white-space:pre-line;animation:gpPop .35s ease}
  .gp-result.good{background:rgba(48,152,72,.15);border:1px solid rgba(48,152,72,.4);color:#9be8a8}
  .gp-result.bad{background:rgba(184,40,40,.15);border:1px solid rgba(184,40,40,.4);color:#f39a9a}
  .gp-result.neutral{background:rgba(200,134,26,.1);border:1px solid rgba(200,134,26,.35);color:var(--amber2,#e8a830)}
  #gp-quest-box .gp-q{font-size:11px;line-height:1.5;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid var(--border,#244);margin-bottom:6px}
  #gp-quest-box .gp-q.done{border-color:rgba(114,200,130,.5);background:rgba(114,200,130,.08)}
  #gp-quest-box .gp-q b{color:var(--amber2,#e8a830)}
  #gp-quest-box .gp-q.done b{color:var(--green2,#7c8)}
  #gp-quest-box .gp-bar{height:4px;border-radius:2px;background:rgba(255,255,255,.07);margin-top:4px;overflow:hidden}
  #gp-quest-box .gp-bar span{display:block;height:100%;background:linear-gradient(90deg,var(--amber,#c8861a),var(--green2,#7c8));transition:width .6s}
  #gp-quest-box .gp-step{display:flex;gap:6px;align-items:flex-start;font-size:11px;color:var(--text3,#577);margin:2px 0}
  #gp-quest-box .gp-step.ok{color:var(--green2,#7c8)}
  #gp-quest-box .gp-step.now{color:var(--text,#cdc);font-weight:700}
  .gp-ending{margin:4px 0 14px;padding:10px 16px;border-radius:12px;border:1px solid var(--amber2,#e8a830);background:rgba(232,168,48,.08);text-align:center;max-width:min(92%,580px)}
  .gp-ending .gp-e-title{font-size:20px;font-weight:800;color:var(--amber2,#e8a830)}
  .gp-ending .gp-e-text{font-size:12px;color:var(--text2,#8a8);margin-top:4px;line-height:1.6}
  .gp-ending .gp-e-col{font-size:11px;color:var(--text3,#577);margin-top:8px}
  @keyframes gpFade{from{opacity:0}}
  @keyframes gpPop{from{opacity:0;transform:scale(.92) translateY(10px)}}
  @media (prefers-reduced-motion: reduce){#gp-modal.show,#gp-card,.gp-result{animation:none}}
  `;
  document.head.appendChild(style);

  // ---------- modal ----------
  const modal = document.createElement('div');
  modal.id = 'gp-modal';
  modal.innerHTML = '<div id="gp-card"><canvas id="gp-banner" width="120" height="44"></canvas><div id="gp-body"><div id="gp-title"></div><div id="gp-text"></div><div id="gp-result-slot"></div><div class="gp-choices" id="gp-choices"></div></div></div>';
  document.body.appendChild(modal);
  const $ = id => document.getElementById(id);

  // opts: { icon, title, text, scene (location id for banner), night, choices: [{icon,label,hint,cost,disabled,onPick}] }
  function openModal(opts) {
    $('gp-card').classList.toggle('night', !!opts.night);
    const banner = $('gp-banner');
    if (opts.scene && window.FX && FX.locationThumb) { banner.style.display = ''; FX.locationThumb(banner, opts.scene); }
    else banner.style.display = 'none';
    $('gp-title').textContent = `${opts.icon || ''} ${opts.title || ''}`;
    $('gp-text').textContent = opts.text || '';
    $('gp-result-slot').innerHTML = '';
    renderChoices(opts.choices || []);
    modal.classList.add('show');
    sfx('alert');
  }
  function renderChoices(choices) {
    const box = $('gp-choices');
    box.innerHTML = '';
    choices.forEach(c => {
      const b = document.createElement('button');
      b.className = 'gp-choice';
      b.disabled = !!c.disabled;
      const ico = document.createElement('span'); ico.className = 'gp-ico'; ico.textContent = c.icon || '▶';
      const lbl = document.createElement('span'); lbl.className = 'gp-lbl'; lbl.textContent = c.label;
      if (c.hint) { const h = document.createElement('span'); h.className = 'gp-hint'; h.textContent = c.hint; lbl.appendChild(h); }
      b.append(ico, lbl);
      if (c.cost) { const k = document.createElement('span'); k.className = 'gp-cost'; k.textContent = c.cost; b.appendChild(k); }
      b.onclick = () => { if (!b.disabled) { box.querySelectorAll('button').forEach(x => x.disabled = true); c.onPick(); } };
      box.appendChild(b);
    });
  }
  function showResult(text, tone, onDone, btnLabel) {
    const slot = $('gp-result-slot');
    slot.innerHTML = '';
    const r = document.createElement('div');
    r.className = 'gp-result ' + (tone || 'neutral');
    r.textContent = text;
    slot.appendChild(r);
    sfx(tone === 'good' ? 'pickup' : tone === 'bad' ? 'hurt' : 'click');
    renderChoices([{ icon: '✔️', label: btnLabel || 'ตกลง', onPick: () => { closeModal(); onDone && onDone(); } }]);
  }
  function closeModal() { modal.classList.remove('show'); }

  // ---------- effect helpers used by situations ----------
  function ctxFor(pi) {
    const s = g(), p = s.players[pi];
    const notes = [];
    const c = {
      p, pi,
      has: it => p.inventory.includes(it),
      hasAny: list => list.some(it => p.inventory.includes(it)),
      food: () => p.inventory.find(it => isFood(it) && !['ผลไม้มีพิษ', 'น้ำเน่า', 'อาหารอาบยาพิษ'].includes(it)),
      take: it => { const k = p.inventory.indexOf(it); if (k > -1) { p.inventory.splice(k, 1); notes.push(`-${it}`); return true; } return false; },
      give: it => { if (addToInventory(pi, it)) notes.push(`+${it}`); },
      toCamp: it => { s.camp.sharedItems.push(it); notes.push(`📦+${it}`); },
      hp: d => { p.hp = cl(p.hp + d, 0, 100); notes.push(`❤️${d > 0 ? '+' : ''}${d}`); },
      hunger: d => { p.hunger = cl(p.hunger + d, 0, 100); notes.push(`🍖${d > 0 ? '+' : ''}${d}`); },
      thirst: d => { p.thirst = cl(p.thirst + d, 0, 100); notes.push(`💧${d > 0 ? '+' : ''}${d}`); },
      energy: d => { p.energy = cl(p.energy + d, 0, 100); notes.push(`⚡${d > 0 ? '+' : ''}${d}`); },
      sanity: d => { p.sanity = cl(p.sanity + d, 0, 100); notes.push(`🧠${d > 0 ? '+' : ''}${d}`); },
      status: tag => { p.statuses = addStatus(p.statuses, tag); notes.push(`[${statusLabel(tag)}]`); },
      hours: h => { p.hoursLeft = cl(p.hoursLeft + h, 0, 24); notes.push(`⏰${h > 0 ? '+' : ''}${h} ชม.`); },
      flag: (k, v) => { st().flags[k] = v; },
      notes,
    };
    return c;
  }

  // ---------- SITUATIONS ----------
  // locs: location ids where it can happen (null = anywhere). when(ctx): optional extra condition.
  // Each choice: { icon, label, hint, hours, need(ctx)->bool, run(ctx)->[text, tone] , fight?:[animal, intro] }
  const SITUATIONS = [
    {
      id: 'stranger', locs: null, icon: '🧔', title: 'คนแปลกหน้าหิวโหย',
      text: '{n} เจอชายผอมโซนั่งพิงต้นไม้ เขาบอกว่าหลงป่ามาหลายวัน แล้วขออาหารสักนิด',
      choices: [
        { icon: '🍖', label: 'แบ่งอาหารให้', hint: 'ต้องมีอาหาร 1 ชิ้น', need: c => !!c.food(),
          run: c => { c.take(c.food()); c.sanity(10); c.flag('stranger', 'helped'); c.flag('strangerDay', g().day); return ['เขาขอบคุณเสียงสั่น แล้วสัญญาว่าจะตอบแทนถ้าได้เจอกันอีก', 'good']; } },
        { icon: '🚶', label: 'เดินผ่านไป', run: c => { c.sanity(-4); return ['สายตาของเขายังติดอยู่ในใจ…', 'neutral']; } },
        { icon: '🗡️', label: 'ปล้นของในเป้เขา', hint: 'ได้ของ แต่ใจคุณจะหนักอึ้ง',
          run: c => { c.give(pick(['เชือก', 'ไม้ขีดไฟ', 'อาหารกระป๋อง', 'มีด'])); c.sanity(-15); c.flag('stranger', 'robbed'); return ['เขาไม่มีแรงขัดขืน… แต่ก่อนจากไปเขาจ้องคุณด้วยแววตาแค้นเคือง', 'bad']; } },
      ],
    },
    {
      id: 'backpack', locs: null, icon: '🎒', title: 'เป้ที่ถูกทิ้งไว้',
      text: 'กลางทาง {n} เจอเป้เดินป่าเก่าๆ ซ่อนอยู่ในพุ่มไม้ ดูเหมือนมีของอยู่ข้างใน',
      choices: [
        { icon: '✋', label: 'เปิดดูทันที', run: c => {
          if (rnd() < 0.6) { c.give(pick(['อาหารกระป๋อง', 'ยาสมุนไพร', 'เชือก'])); c.give(pick(['ไม้ขีดไฟ', 'น้ำสะอาด', 'ผ้า'])); return ['ข้างในมีเสบียงที่ยังใช้ได้ดี!', 'good']; }
          c.hp(-10); c.status('injured'); return ['กับดักลวดสลิงดีดใส่มือ! มีคนวางกับดักไว้', 'bad']; } },
        { icon: '🔍', label: 'ตรวจรอบๆ ก่อนเปิด', hours: 1, run: c => { c.give(pick(['อาหารกระป๋อง', 'ยาสมุนไพร', 'เชือก', 'ไม้ขีดไฟ'])); return ['คุณปลดกับดักที่ซ่อนอยู่ได้ แล้วหยิบของออกมาอย่างปลอดภัย', 'good']; } },
        { icon: '🚶', label: 'ไม่แตะต้อง', run: () => ['บางทีมันอาจเป็นกับดัก… ปล่อยไว้ดีกว่า', 'neutral'] },
      ],
    },
    {
      id: 'cub', locs: ['forest', 'cave', 'orchard'], icon: '🐻', title: 'ลูกหมีหลงทาง',
      text: 'ลูกหมีตัวเล็กส่งเสียงร้องอยู่หน้า {n} มันดูหิวและหลงทาง แต่แม่ของมันอาจอยู่ไม่ไกล',
      choices: [
        { icon: '🤫', label: 'ถอยออกมาเงียบๆ', run: c => { c.sanity(2); return ['คุณถอยออกมาอย่างระวัง ไม่มีอะไรเกิดขึ้น', 'neutral']; } },
        { icon: '🍯', label: 'โยนอาหารให้มัน', hint: 'ต้องมีอาหาร 1 ชิ้น', need: c => !!c.food(),
          run: c => { c.take(c.food()); c.sanity(12); if (rnd() < 0.5) { c.give('รวงผึ้ง'); return ['ลูกหมีพาคุณไปที่รังผึ้งที่ร่วงอยู่ แล้ววิ่งกลับหาแม่', 'good']; } return ['ลูกหมีกินอย่างเอร็ดอร่อย แล้ววิ่งหายเข้าป่า ใจคุณอบอุ่นขึ้น', 'good']; } },
        { icon: '🤲', label: 'อุ้มมันไปด้วย', hint: 'เสี่ยงมาก', fight: ['หมี', 'แม่หมีพุ่งออกมาจากพุ่มไม้ด้วยความโกรธ!'],
          run: c => { c.sanity(-5); return ['เสียงคำรามดังสนั่น… แม่หมีมาแล้ว!', 'bad']; } },
      ],
    },
    {
      id: 'body', locs: ['river', 'swamp', 'waterfall', 'forest'], icon: '🦴', title: 'ร่างของนักเดินป่า',
      text: '{n} เจอร่างไร้วิญญาณของนักเดินป่าคนหนึ่ง ข้างตัวมีกระเป๋าใบเล็ก',
      choices: [
        { icon: '🎒', label: 'ค้นกระเป๋า', run: c => { c.give(pick(['ชิ้นส่วนวิทยุ', 'แผนที่ลึกลับ', 'ยาสมุนไพร'])); c.sanity(-12); return ['คุณเจอของที่อาจช่วยชีวิตได้… แต่ภาพนั้นติดตาไปอีกนาน', 'neutral']; } },
        { icon: '⚱️', label: 'ฝังศพให้เขา', hours: 2, run: c => { c.sanity(10); c.energy(-8); alive().forEach(x => x.p.trust = cl((x.p.trust || 50) + 3, 0, 100)); return ['คุณฝังเขาอย่างสงบ ทุกคนในทีมรู้สึกนับถือคุณมากขึ้น', 'good']; } },
        { icon: '🚶', label: 'รีบเดินจากไป', run: c => { c.sanity(-5); return ['คุณพยายามไม่หันกลับไปมอง', 'neutral']; } },
      ],
    },
    {
      id: 'eagle', locs: ['cliff'], icon: '🦅', title: 'รังนกอินทรีบนผา',
      text: 'บนชะง่อนผาสูง {n} เห็นรังนกอินทรีที่มีไข่ แม่นกบินวนอยู่ไม่ไกล',
      choices: [
        { icon: '🧗', label: 'ปีนขึ้นไปเลย', run: c => { if (rnd() < 0.5) { c.give('ไข่'); c.give('ไข่'); return ['คุณคว้าไข่มาได้สองฟองก่อนแม่นกจะกลับมา!', 'good']; } c.hp(-15); c.status('injured'); return ['หินใต้เท้าแตก คุณร่วงลงมากระแทกพื้น!', 'bad']; } },
        { icon: '🪢', label: 'ใช้เชือกโรยตัว', hint: 'ต้องมี เชือก หรือ เชือกยาว', need: c => c.hasAny(['เชือก', 'เชือกยาว']), hours: 1,
          run: c => { c.give('ไข่'); c.give('ไข่'); c.give('สัญญาณขอความช่วยเหลือ'); return ['ด้วยเชือก คุณขึ้นไปถึงรังได้ปลอดภัย แถมเจอพลุสัญญาณเก่าติดอยู่ในซอกหิน!', 'good']; } },
        { icon: '👀', label: 'แค่มองแล้วจากไป', run: c => { c.sanity(3); return ['ภาพนกอินทรีโผบินทำให้ใจคุณสงบลง', 'neutral']; } },
      ],
    },
    {
      id: 'chest', locs: ['hut', 'ruins', 'temple', 'graveyard'], icon: '🧰', title: 'หีบเหล็กที่ล็อกไว้',
      text: '{n} เจอหีบเหล็กเก่าแน่นหนา ล็อกด้วยกุญแจสนิมเขรอะ',
      choices: [
        { icon: '🔪', label: 'งัดด้วยมีด', hint: 'ต้องมี มีด', need: c => c.has('มีด'), hours: 1,
          run: c => { c.give(pick(['กระเป๋าคาดเอว', 'ชุดเกราะเก่า', 'เข็มทิศทองคำ'])); c.give('อาหารกระป๋อง'); return ['กุญแจหลุดออกอย่างง่ายดาย ข้างในมีของดีเกินคาด!', 'good']; } },
        { icon: '🪨', label: 'ทุบด้วยหิน', hours: 2, run: c => { c.energy(-10); if (rnd() < 0.7) { c.give(pick(['ยาสมุนไพร', 'อาหารกระป๋อง', 'เชือก', 'มีด'])); return ['ทุบอยู่นานจนหีบเปิดออก', 'good']; } return ['หีบพังจนของข้างในแตกเสียหมด', 'bad']; } },
        { icon: '🚶', label: 'ปล่อยไว้', run: () => ['คุณจำตำแหน่งไว้ เผื่อกลับมาพร้อมเครื่องมือ', 'neutral'] },
      ],
    },
    {
      id: 'shrine', locs: ['temple', 'cave'], icon: '🕯️', title: 'ศาลเจ้าโบราณ',
      text: 'ศาลเล็กๆ ที่ถูกลืม มีของถวายเก่าวางอยู่ บรรยากาศเงียบจน {n} ได้ยินเสียงหัวใจตัวเอง',
      choices: [
        { icon: '🙏', label: 'ถวายอาหารแล้วไหว้', hint: 'ต้องมีอาหาร 1 ชิ้น', need: c => !!c.food(),
          run: c => { c.take(c.food()); c.sanity(25); c.give('เครื่องราง'); return ['ลมเย็นพัดผ่าน… คุณรู้สึกเหมือนมีใครคุ้มครอง', 'good']; } },
        { icon: '🧘', label: 'นั่งสงบใจครู่หนึ่ง', hours: 1, run: c => { c.sanity(12); c.energy(5); return ['ความกังวลค่อยๆ จางหายไป', 'good']; } },
        { icon: '💰', label: 'หยิบของถวายไป', hint: 'ได้ของมีค่า แต่…',
          run: c => { c.give('ทองคำแท่ง'); c.sanity(-20); c.status('paranoid'); return ['ตั้งแต่หยิบมันมา คุณได้ยินเสียงกระซิบตามหลังไม่หยุด', 'bad']; } },
      ],
    },
    {
      id: 'radio', locs: ['ruins', 'graveyard'], icon: '📻', title: 'เสียงซ่าจากวิทยุเก่า',
      text: 'วิทยุสื่อสารเก่าในซากรถมีเสียงซ่าดังขึ้นเป็นระยะ บางทีอาจยังรับสัญญาณได้',
      choices: [
        { icon: '🔧', label: 'ลองจูนหาคลื่น', hours: 2, run: c => {
          if (rnd() < 0.55) { c.give('ชิ้นส่วนวิทยุ'); c.flag('heardRescue', true); c.sanity(15); return ['ได้ยินเสียงคนพูด! "…ทีมค้นหาจะบินผ่านเขตนี้ภายในสัปดาห์…" คุณถอดชิ้นส่วนสำคัญเก็บไว้', 'good']; }
          c.sanity(-5); return ['มีแต่เสียงซ่า… แล้วเครื่องก็ดับไป', 'neutral']; } },
        { icon: '🔋', label: 'ถอดแบตเตอรี่ไป', run: c => { c.give('แบตเตอรี่เสื่อม'); return ['คุณได้แบตเตอรี่มาหนึ่งก้อน', 'neutral']; } },
        { icon: '🚶', label: 'ไม่สนใจ', run: () => ['เสียงซ่าค่อยๆ เงียบลงเมื่อคุณเดินห่างออกมา', 'neutral'] },
      ],
    },
    {
      id: 'berries', locs: ['orchard', 'forest', 'meadow'], icon: '🫐', title: 'ผลไม้หน้าตาแปลก',
      text: 'พุ่มไม้เต็มไปด้วยผลสีม่วงฉ่ำ {n} ไม่แน่ใจว่ากินได้หรือเปล่า',
      choices: [
        { icon: '😋', label: 'ลองชิมเลย', run: c => { if (rnd() < 0.55) { c.hunger(20); c.thirst(8); return ['หวานฉ่ำ! อิ่มท้องไปหลายชั่วโมง', 'good']; } c.status('poison'); c.hp(-6); return ['ลิ้นชาไปหมด… มันมีพิษ!', 'bad']; } },
        { icon: '🧺', label: 'เก็บไปให้หมอ/พ่อครัวดู', run: c => { c.give(rnd() < 0.55 ? 'ผลไม้' : 'ผลไม้มีพิษ'); return ['คุณเก็บมาหนึ่งกำมือ ค่อยให้คนที่รู้ดูอีกที', 'neutral']; } },
        { icon: '🚶', label: 'ไม่เสี่ยง', run: () => ['ปลอดภัยไว้ก่อน', 'neutral'] },
      ],
    },
    {
      id: 'bees', locs: ['orchard', 'meadow', 'forest'], icon: '🐝', title: 'รังผึ้งยักษ์',
      text: 'รังผึ้งขนาดใหญ่ห้อยอยู่บนกิ่งไม้ต่ำ น้ำผึ้งไหลเยิ้มจนเห็นได้ชัด',
      choices: [
        { icon: '🔥', label: 'รมควันไล่ผึ้ง', hint: 'ต้องมี คบเพลิง หรือ ไม้ขีดไฟ', need: c => c.hasAny(['คบเพลิง', 'ไม้ขีดไฟ']), hours: 1,
          run: c => { c.give('รวงผึ้ง'); c.give('รวงผึ้ง'); return ['ควันทำให้ผึ้งมึนงง คุณเก็บรวงผึ้งมาได้สองรวง', 'good']; } },
        { icon: '🏃', label: 'คว้าแล้ววิ่ง', run: c => { c.give('รวงผึ้ง'); c.hp(-8); return ['ได้มาหนึ่งรวง แต่โดนต่อยจนหน้าบวม', 'bad']; } },
        { icon: '🚶', label: 'อยู่ห่างๆ ไว้', run: () => ['ไม่คุ้มกับการโดนต่อย', 'neutral'] },
      ],
    },
    {
      id: 'shortcut', locs: ['cliff', 'river', 'waterfall'], icon: '🌉', title: 'ทางลัดสะพานเชือกเก่า',
      text: 'สะพานเชือกผุๆ ทอดข้ามหุบ ถ้าข้ามไปได้จะกลับแคมป์เร็วขึ้นมาก',
      choices: [
        { icon: '🏃', label: 'ข้ามสะพาน', hint: 'ประหยัดเวลา 2 ชม.', run: c => { c.hours(2); if (rnd() < 0.3) { c.hp(-12); return ['ไม้กระดานหัก! คุณห้อยต่องแต่งก่อนจะปีนขึ้นมาได้', 'bad']; } return ['ข้ามมาได้อย่างหวาดเสียว แต่ประหยัดเวลาไปได้มาก', 'good']; } },
        { icon: '🚶', label: 'เดินอ้อม', run: () => ['ช้าหน่อยแต่ปลอดภัย', 'neutral'] },
      ],
    },
    {
      id: 'fog', locs: null, when: () => g().weather && g().weather.icon === '🌫️', icon: '🌫️', title: 'หลงในหมอก',
      text: 'หมอกหนาจน {n} มองไม่เห็นมือตัวเอง ทุกทิศทางดูเหมือนกันหมด',
      choices: [
        { icon: '⏳', label: 'นั่งรอให้หมอกจาง', hint: 'ปลอดภัย แต่เสียเวลา 2 ชม.', run: c => { c.hours(-2); c.energy(5); return ['หมอกค่อยๆ จางลง คุณเสียเวลาไปแต่ปลอดภัย', 'neutral']; } },
        { icon: '👂', label: 'เดินตามเสียงน้ำ', run: c => { if (rnd() < 0.5) { c.give('แผนที่ลึกลับ'); return ['เสียงน้ำพาคุณไปเจอเพิงร้างที่มีแผนที่วาดมือทิ้งไว้!', 'good']; } c.sanity(-10); c.hours(-1); return ['ยิ่งเดินยิ่งหลง… กว่าจะออกมาได้ใจก็เสียไปหมด', 'bad']; } },
        { icon: '🔪', label: 'กรีดต้นไม้ทำเครื่องหมาย', hint: 'ต้องมี มีด', need: c => c.has('มีด'), run: () => ['คุณทำรอยไว้ตลอดทาง และเดินกลับได้ไม่หลง', 'good'] },
      ],
    },
    {
      id: 'cry', locs: null, icon: '🗣️', title: 'เสียงร้องขอความช่วยเหลือ',
      text: 'เสียงร้อง "ช่วยด้วย!" ดังแว่วมาจากในป่าลึก {n} ไม่แน่ใจว่าเป็นคนหรือสัตว์',
      choices: [
        { icon: '🏃', label: 'วิ่งไปดู', hours: 2, run: c => {
          const r = rnd();
          if (r < 0.4) { c.give(pick(['อาหารกระป๋อง', 'ยาสมุนไพร'])); c.give(pick(['เชือก', 'ผ้า', 'ไม้ขีดไฟ'])); return ['ไม่มีใครอยู่ แต่เจอแคมป์ร้างที่ทิ้งเสบียงไว้!', 'good']; }
          if (r < 0.7) { c.sanity(-8); return ['ไม่มีอะไรเลย… เสียงนั้นหายไปเฉยๆ ขนลุกไปทั้งตัว', 'bad']; }
          return [null, 'fight']; },
          fightIf: true, fight: ['หมาจิ้งจอก', 'มันคือเสียงเลียนแบบของหมาจิ้งจอก! มันพุ่งเข้าใส่คุณ!'] },
        { icon: '🙉', label: 'แกล้งทำเป็นไม่ได้ยิน', run: c => { c.sanity(-5); return ['เสียงนั้นยังก้องอยู่ในหัวคุณ', 'neutral']; } },
      ],
    },
    {
      id: 'fishpool', locs: ['river', 'waterfall', 'swamp'], icon: '🐟', title: 'ปลาติดแอ่งน้ำ',
      text: 'น้ำลดจนปลาหลายตัวติดอยู่ในแอ่งตื้นๆ ตรงหน้า {n}',
      choices: [
        { icon: '🗡️', label: 'ใช้หอกแทง', hint: 'ต้องมี หอก', need: c => c.has('หอก'), run: c => { c.give('ปลา'); c.give('ปลา'); return ['แทงทีเดียวได้สองตัว!', 'good']; } },
        { icon: '🤲', label: 'จับด้วยมือ', hours: 1, run: c => { if (rnd() < 0.7) { c.give('ปลา'); return ['ลื่นมือหลายรอบ แต่สุดท้ายก็ได้มาหนึ่งตัว', 'good']; } c.status('wet'); return ['ปลาหลุดมือหมด แถมตัวเปียกโชก', 'bad']; } },
        { icon: '🚶', label: 'ไปต่อ', run: () => ['คุณจำแอ่งนี้ไว้', 'neutral'] },
      ],
    },
    {
      id: 'oldcamp', locs: ['meadow', 'forest', 'hut'], icon: '⛺', title: 'ร่องรอยแคมป์เก่า',
      text: '{n} เจอกองไฟที่มอดไปนานแล้ว มีเต็นท์ขาดๆ และสมุดเล่มเล็กตกอยู่',
      choices: [
        { icon: '📒', label: 'อ่านสมุดบันทึก', hours: 1, run: c => { c.give('สมุดบันทึกนักสำรวจ'); c.sanity(5); return ['บันทึกมีแผนที่คร่าวๆ ของป่านี้ ช่วยให้เดินทางเร็วขึ้น', 'good']; } },
        { icon: '🔍', label: 'ค้นเต็นท์', run: c => { c.give(pick(['ไม้ขีดไฟ', 'เชือก', 'ผ้า'])); return ['ยังมีของใช้หลงเหลืออยู่', 'good']; } },
        { icon: '🚶', label: 'ไม่แวะ', run: () => ['คุณเดินผ่านไป', 'neutral'] },
      ],
    },
    {
      id: 'storm', locs: null, when: () => g().weather && ['🌧️', '⛈️'].includes(g().weather.icon), icon: '⛈️', title: 'พายุกำลังมา',
      text: 'ฟ้ามืดครึ้มลงอย่างรวดเร็ว ลมกระโชกแรง {n} ต้องตัดสินใจทันที',
      choices: [
        { icon: '🏕️', label: 'รีบกลับแคมป์', hours: 1, run: c => { c.p.atCamp = true; return ['คุณกลับถึงแคมป์ทันก่อนฝนจะเทลงมา', 'good']; } },
        { icon: '🪨', label: 'หลบใต้ชะง่อนหิน', run: c => { c.sanity(-5); return ['คุณขดตัวรอจนพายุผ่านไป', 'neutral']; } },
        { icon: '🌧️', label: 'ฝ่าพายุหาของต่อ', run: c => { c.give(pick(['ไม้', 'หิน', 'สมุนไพร'])); c.status('wet'); c.hp(-5); return ['ได้ของมาเพิ่ม แต่เปียกโชกและหนาวสั่น', 'bad']; } },
      ],
    },
  ];

  function pickSituation(locId) {
    const s = st(), seen = s.seen;
    const pool = SITUATIONS.filter(x => (!x.locs || x.locs.includes(locId)) && (!x.when || x.when()) && !seen.includes(x.id));
    if (!pool.length) return null;
    // prefer location-specific ones
    const specific = pool.filter(x => x.locs);
    return pick(specific.length && rnd() < 0.65 ? specific : pool);
  }

  function runSituation(pi, sit, locId) {
    const s = g(), p = s.players[pi];
    st().seen.push(sit.id);
    s.isLoading = true;
    if (typeof setButtons === 'function') setButtons(true);
    try { stopTurnTimer(); } catch (e) { /* ok */ }
    const c0 = ctxFor(pi);
    openModal({
      icon: sit.icon, title: sit.title, scene: locId,
      text: sit.text.replace(/\{n\}/g, p.name),
      choices: sit.choices.map(ch => ({
        icon: ch.icon, label: ch.label, hint: ch.hint,
        cost: ch.hours > 0 ? `${ch.hours} ชม.` : '',
        disabled: (ch.need && !ch.need(c0)) || (ch.hours > 0 && p.hoursLeft < ch.hours),
        onPick: () => resolveChoice(pi, sit, ch),
      })),
    });
  }

  function resolveChoice(pi, sit, ch) {
    const s = g(), p = s.players[pi];
    const c = ctxFor(pi);
    let [text, tone] = ch.run(c);
    let fight = null;
    if (ch.fight && (tone === 'fight' || !ch.fightIf)) { fight = ch.fight; if (tone === 'fight') { text = ch.fight[1]; tone = 'bad'; } }
    const summary = text + (c.notes.length ? `\n${c.notes.join('  ')}` : '');
    addMsg(`${sit.icon} ${sit.title} — ${p.name} เลือก "${ch.label}"`, 'bubble-player');
    addMsg(text, tone === 'good' ? 'bubble-event-good' : tone === 'bad' ? 'bubble-event-bad' : 'bubble-narrator');
    renderAllPanels();
    if (typeof updateCampUI === 'function') updateCampUI();
    showResult(summary, tone, () => {
      if (p.hp <= 0) { s.isLoading = false; killPlayer(pi); return; }
      if (fight) { initiateCombat(pi, fight[0], ch.hours > 0 ? ch.hours : 0, [], fight[1]); return; }
      const hrs = ch.hours > 0 ? ch.hours : 0;
      spendTime(pi, hrs); // re-enables buttons, may end the turn if time ran out
      try { if (s.players[pi].hoursLeft > 0 && !s.dayDone[pi]) startTurnTimer(); } catch (e) { /* ok */ }
    });
  }

  // Trigger after an explore result resolves without a fight
  wrap('processActionResult', orig => function (pi, parsed, meta, hoursCost) {
    const interrupted = orig.apply(this, arguments);
    try {
      const s = g(), p = s.players[pi];
      const loc = meta && meta.loc;
      if (!interrupted && loc && s.locations.includes(loc) && isLocalHuman(pi) && p.alive &&
          !s.dayDone[pi] && s.currentPlayer === pi && !s.combatState && p.hoursLeft > 0 && rnd() < 0.4) {
        const sit = pickSituation(loc.id);
        if (sit) {
          s.isLoading = true; // block input until the modal opens
          whenClear(() => runSituation(pi, sit, loc.id));
        }
      }
    } catch (e) { console.warn('[gameplay] situation', e); }
    return interrupted;
  });

  // ---------- DAILY QUESTS + MAIN QUEST ----------
  const sum = k => g().players.reduce((a, p) => a + ((p.stats && p.stats[k]) || 0), 0);
  const DAILY = [
    { id: 'build', icon: '🔨', text: 'สร้างสิ่งปลูกสร้างใหม่ในแคมป์ 1 อย่าง', goal: 1, prog: b => g().camp.structures.length - b.structures },
    { id: 'deposit', icon: '📦', text: 'ฝากของเข้าคลังแคมป์ 3 ชิ้น', goal: 3, prog: b => st().deposits - b.deposits },
    { id: 'hunt', icon: '🐾', text: 'ล้มสัตว์ป่าให้ได้ 1 ตัว', goal: 1, prog: b => sum('animalsDefeated') - b.kills },
    { id: 'explore', icon: '🗺️', text: 'สำรวจให้ครบทุกสถานที่วันนี้', goal: () => g().locations.filter(l => !l.blocked).length, prog: () => g().locations.filter(l => !l.blocked && l.explored.length).length },
    { id: 'share', icon: '🎁', text: 'แบ่งของให้เพื่อน 2 ครั้ง', goal: 2, prog: b => sum('itemsShared') - b.shared },
    { id: 'craft', icon: '🧪', text: 'คราฟของใช้ 2 ชิ้น', goal: 2, prog: b => sum('itemsCrafted') - b.crafted },
    { id: 'healthy', icon: '❤️', text: 'จบวันโดยทุกคนที่รอดมี HP 50 ขึ้นไป', goal: 1, prog: () => alive().every(x => x.p.hp >= 50) ? 1 : 0, endOnly: true },
  ];
  function baseline() {
    return { structures: g().camp.structures.length, deposits: st().deposits, kills: sum('animalsDefeated'), shared: sum('itemsShared'), crafted: sum('itemsCrafted') };
  }
  function goalOf(q) { return typeof q.goal === 'function' ? q.goal() : q.goal; }
  function dailyState() {
    const d = st().daily; if (!d) return null;
    const q = DAILY.find(x => x.id === d.id); if (!q) return null;
    const goal = Math.max(1, goalOf(q));
    const prog = cl(q.prog(d.base), 0, goal);
    return { q, goal, prog, done: prog >= goal };
  }
  wrap('depositToCamp', orig => function () {
    const before = g().camp.sharedItems.length;
    const res = orig.apply(this, arguments);
    if (g().camp.sharedItems.length > before) st().deposits++;
    refreshQuestBox();
    return res;
  });

  const MAIN = [
    { text: 'หาชิ้นส่วนวิทยุ หรือ สัญญาณขอความช่วยเหลือ', done: () => anyoneHas(['ชิ้นส่วนวิทยุ', 'สัญญาณขอความช่วยเหลือ', 'วิทยุกู้ภัย SOS']) || st().flags.heardRescue },
    { text: 'สร้างกองไฟ และ หอคอยสัญญาณ ที่แคมป์', done: () => g().camp.structures.includes('campfire') && g().camp.structures.includes('tower') },
    { text: 'มีคบเพลิงหรืออุปกรณ์ส่งสัญญาณติดตัวในวันที่ 7', done: () => anyoneHas(['คบเพลิง', 'สัญญาณขอความช่วยเหลือ', 'วิทยุกู้ภัย SOS']) },
    { text: 'วันที่ 7: กด "ส่งสัญญาณกู้ภัย"', done: () => !!g().rescueData.success },
  ];
  function anyoneHas(list) {
    const s = g();
    return s.players.some(p => p.alive && list.some(it => p.inventory.includes(it))) || list.some(it => s.camp.sharedItems.includes(it));
  }

  let questBox = null;
  function ensureQuestBox() {
    if (questBox && document.body.contains(questBox)) return questBox;
    const panel = document.getElementById('world-panel'); if (!panel) return null;
    questBox = document.createElement('div');
    questBox.className = 'side-box';
    questBox.id = 'gp-quest-box';
    panel.prepend(questBox);
    return questBox;
  }
  function refreshQuestBox() {
    const s = g(); if (!s || !s.players || !s.players.length || !s.locations || !s.locations.length) return;
    if (s.players.some(p => p.alive)) ensureDaily();
    const box = ensureQuestBox(); if (!box) return;
    const d = dailyState();
    let html = '<div class="side-title">🎯 ภารกิจ</div>';
    if (d) {
      html += `<div class="gp-q${d.done ? ' done' : ''}"><b>${d.done ? '✅' : d.q.icon} วันนี้:</b> ${d.q.text}` +
        `<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-top:3px"><span>${d.q.endOnly ? 'ตรวจตอนจบวัน' : `${d.prog}/${d.goal}`}</span><span>รางวัล: เสบียง + สติ</span></div>` +
        `<div class="gp-bar"><span style="width:${Math.round(d.prog / d.goal * 100)}%"></span></div></div>`;
    }
    const firstOpen = MAIN.findIndex(m => !m.done());
    html += '<div class="gp-q"><b>📻 เส้นทางสู่การกู้ภัย</b>';
    MAIN.forEach((m, i) => {
      const ok = m.done();
      html += `<div class="gp-step${ok ? ' ok' : i === firstOpen ? ' now' : ''}"><span>${ok ? '✔' : i === firstOpen ? '▶' : '○'}</span><span>${m.text}</span></div>`;
    });
    html += `<div style="font-size:10px;color:var(--text3);margin-top:4px">ภารกิจรายวันสำเร็จ ${st().dailyDone.length} ครั้ง</div></div>`;
    box.innerHTML = html;
  }
  wrap('renderAllPanels', orig => function () {
    const res = orig.apply(this, arguments);
    try { refreshQuestBox(); } catch (e) { /* visuals only */ }
    return res;
  });

  // Pick the day's quest lazily on the first render of a new day. (startDay itself may be
  // delayed by the day cutscene, and a resumed save lands here too.)
  function ensureDaily() {
    const s = st(), day = g().day;
    if (s.daily && s.daily.day === day) return;
    const last = s.daily && s.daily.id;
    const q = pick(DAILY.filter(x => x.id !== last));
    s.daily = { id: q.id, day, base: baseline(), rewarded: false };
    addMsg(`🎯 ภารกิจวันนี้: ${q.icon} ${q.text}`, 'bubble-system');
  }

  function settleDaily() {
    const s = st(), d = dailyState();
    if (!d || s.daily.rewarded) return;
    s.daily.rewarded = true;
    if (d.done) {
      s.dailyDone.push(d.q.id);
      const gifts = [pick(['น้ำสะอาด', 'อาหารกระป๋อง', 'ยาสมุนไพร']), pick(['ไม้', 'เชือก', 'ผลไม้'])];
      gifts.forEach(it => g().camp.sharedItems.push(it));
      alive().forEach(x => { x.p.sanity = cl(x.p.sanity + 10, 0, 100); });
      addMsg(`🏅 ภารกิจวันนี้สำเร็จ! ${d.q.text}\nรางวัล: 📦 ${gifts.join(', ')} เข้าคลังแคมป์ และทุกคนสติ +10`, 'bubble-event-good');
      sfx('pickup');
    } else {
      addMsg(`🎯 ภารกิจวันนี้ไม่สำเร็จ (${d.q.text})`, 'bubble-system');
    }
  }

  // ---------- NIGHT PHASE ----------
  function defenses() {
    const sts = g().camp.structures;
    return (sts.includes('campfire') ? 1 : 0) + (sts.includes('fence') ? 1 : 0) + (sts.includes('trapfence') ? 2 : 0);
  }
  function runNight(guardPi) {
    const s = g(), story = st();
    story.guard = guardPi;
    const guard = guardPi === null ? null : s.players[guardPi];
    const lines = [];
    let tone = 'neutral';
    const def = defenses() + (guard ? 2 : 0);
    const sts = s.camp.structures;

    // stranger comes back (one time)
    if (story.flags.stranger === 'helped' && s.day > (story.flags.strangerDay || 0) && !story.flags.strangerPaid) {
      story.flags.strangerPaid = true;
      s.camp.sharedItems.push('สัญญาณขอความช่วยเหลือ', 'อาหารกระป๋อง');
      lines.push('🧔 กลางดึก ชายแปลกหน้าที่คุณเคยช่วยแวะมา เขาทิ้ง "สัญญาณขอความช่วยเหลือ" กับอาหารไว้ที่แคมป์ แล้วหายไปในความมืด');
      tone = 'good';
    } else if (story.flags.stranger === 'robbed' && !story.flags.strangerRevenge) {
      story.flags.strangerRevenge = true;
      if (guard) {
        lines.push(`🧔 เงาคนแอบย่องเข้ามาในแคมป์ แต่ ${guard.name} ที่เฝ้ายามอยู่ตะโกนไล่ไปได้ทัน`);
      } else {
        const lost = s.camp.sharedItems.splice(0, 2);
        lines.push(`🧔 ชายที่ถูกปล้นกลับมาแก้แค้น! เขาขโมย${lost.length ? ` ${lost.join(', ')} ` : 'ของ'}จากคลังแคมป์ไป`);
        tone = 'bad';
      }
    }

    // animal raid
    const raidChance = cl(0.45 - def * 0.1, 0.05, 0.6);
    if (rnd() < raidChance) {
      const beast = pick(['หมาป่า', 'หมูป่า', 'เสือดาว']);
      if (sts.includes('trapfence')) {
        s.camp.sharedItems.push('เนื้อสัตว์');
        lines.push(`🪤 ${beast} บุกเข้ามาแต่ติดรั้วกับดัก! ได้ เนื้อสัตว์ เพิ่มในคลังแคมป์`);
        tone = tone === 'bad' ? 'bad' : 'good';
      } else if (guard) {
        guard.hp = cl(guard.hp - 10, 0, 100);
        guard.stats.animalsDefeated = (guard.stats.animalsDefeated || 0) + 1;
        lines.push(`🐺 ${beast}บุกแคมป์! ${guard.name} ที่เฝ้ายามสู้จนมันหนีไป (HP -10)`);
        tone = 'bad';
      } else {
        const victims = alive().filter(x => x.p.atCamp);
        const v = victims.length ? pick(victims) : null;
        if (v) { v.p.hp = cl(v.p.hp - 14, 0, 100); v.p.statuses = addStatus(v.p.statuses, 'injured'); }
        const stolen = s.camp.sharedItems.length ? s.camp.sharedItems.splice(Math.floor(rnd() * s.camp.sharedItems.length), 1) : [];
        lines.push(`🐺 ${beast}บุกแคมป์ตอนทุกคนหลับ!${v ? ` ${v.p.name} ถูกกัดบาดเจ็บ (HP -14)` : ''}${stolen.length ? ` และคาบ ${stolen[0]} ไป` : ''}`);
        tone = 'bad';
      }
    }

    // cold night
    const coldNight = s.weather && ['🌧️', '⛈️'].includes(s.weather.icon) || rnd() < 0.2;
    if (coldNight) {
      if (sts.includes('hut') || sts.includes('campfire')) {
        lines.push('🥶 คืนนี้หนาวเหน็บ แต่ทุกคนได้ไออุ่นจาก' + (sts.includes('hut') ? 'กระท่อม' : 'กองไฟ'));
      } else {
        alive().forEach(x => { x.p.energy = cl(x.p.energy - 10, 0, 100); if (rnd() < 0.35) x.p.statuses = addStatus(x.p.statuses, 'cold'); });
        lines.push('🥶 คืนนี้หนาวจัด ไม่มีที่กำบัง ทุกคนนอนไม่หลับ (พลังงาน -10) — ลองสร้างกองไฟหรือกระท่อม');
        if (tone !== 'good') tone = 'bad';
      }
    }

    // shooting star
    if (rnd() < 0.18) {
      alive().forEach(x => { x.p.sanity = cl(x.p.sanity + 10, 0, 100); });
      lines.push('🌠 ดาวตกพาดผ่านฟ้า ทุกคนอธิษฐานพร้อมกัน (สติ +10)');
      if (tone === 'neutral') tone = 'good';
    }

    if (!lines.length) lines.push('🌙 คืนนี้เงียบสงบ ได้ยินแค่เสียงจิ้งหรีด');

    // guard cost / rest bonus
    alive().forEach(x => {
      if (guard && x.p === guard) { x.p.energy = cl(x.p.energy - 15, 0, 100); x.p.sanity = cl(x.p.sanity - 5, 0, 100); }
      else x.p.energy = cl(x.p.energy + 5, 0, 100);
    });
    if (guard) lines.push(`👁️ ${guard.name} อดนอนเฝ้ายาม (พลังงาน -15, สติ -5)`);

    lines.forEach(l => addMsg(l, tone === 'good' ? 'bubble-event-good' : tone === 'bad' ? 'bubble-event-bad' : 'bubble-system'));
    story.nightLog.push({ day: s.day, lines });
    // anyone killed by the night (not killPlayer(): that would start the next turn mid-endDay)
    alive().forEach(x => {
      if (x.p.hp > 0) return;
      x.p.alive = false; x.p.stats.dayDied = s.day;
      document.getElementById(`panel-p${x.i}`)?.classList.add('dead');
      addMsg(`☠️ ${x.p.name} ไม่รอดพ้นคืนนี้`, 'bubble-event-bad');
    });
    renderAllPanels();
    if (typeof updateCampUI === 'function') updateCampUI();
    return { lines, tone };
  }

  function autoGuard() {
    const cands = alive().filter(x => x.p.energy >= 30).sort((a, b) => b.p.energy - a.p.energy);
    return cands.length ? cands[0].i : null;
  }

  wrap('endDay', orig => function () {
    const self = this, args = arguments;
    const s = g();
    try { settleDaily(); } catch (e) { console.warn('[gameplay] settle', e); }
    if (!alive().length) return orig.apply(self, args);
    const human = s.players[myIndex()];
    const canChoose = !isMulti() && human && human.alive && !human.isBot;
    // endDay checks "day > 7" before "anyone alive", so a team wiped out on night 7
    // would count as survived — end it here instead
    const finish = () => alive().length ? orig.apply(self, args) : gameEnd(false);
    if (!canChoose) {
      try { runNight(autoGuard()); } catch (e) { console.warn('[gameplay] night', e); }
      return finish();
    }
    whenClear(() => {
      const ch = alive().map(x => ({
        icon: x.p.emoji || '👤', label: `${x.p.name} เฝ้ายาม`, hint: `${x.p.job ? x.p.job.emoji + ' ' + x.p.job.name + ' · ' : ''}⚡ ${x.p.energy}%  ❤️ ${x.p.hp}`,
        onPick: () => {
          const r = runNight(x.i);
          showResult(r.lines.join('\n'), r.tone, finish, 'นอนหลับ 💤');
        },
      }));
      ch.push({ icon: '😴', label: 'ไม่มีใครเฝ้า ทุกคนนอนพัก', hint: 'ทุกคนได้พลังงาน +5 แต่แคมป์ไม่มีคนดูแล',
        onPick: () => { const r = runNight(null); showResult(r.lines.join('\n'), r.tone, finish, 'นอนหลับ 💤'); } });
      const def = defenses();
      $('gp-card').classList.add('night');
      openModal({
        night: true, icon: '🌙', title: `คืนที่ ${s.day} — ใครจะเฝ้ายาม?`, scene: null,
        text: `ความมืดคืบคลานเข้ามา เสียงสัตว์ป่าดังรอบแคมป์\nแนวป้องกันแคมป์: ${def ? '🛡️'.repeat(def) : 'ไม่มีเลย'}${g().camp.structures.includes('trapfence') ? ' (มีรั้วกับดัก)' : ''}`,
        choices: ch,
      });
    });
  });

  // ---------- ENDINGS ----------
  const ENDINGS = {
    legend:   { icon: '🏆', title: 'ตำนานแห่งพงไพร', text: 'ทุกคนรอดชีวิตและได้รับการช่วยเหลือพร้อมกัน เรื่องราวของพวกคุณจะถูกเล่าขานไปอีกนาน' },
    rescued:  { icon: '🚁', title: 'กลับบ้าน… ไม่ครบทุกคน', text: 'เฮลิคอปเตอร์มารับแล้ว แต่ที่นั่งบางที่ว่างเปล่า ความทรงจำของเพื่อนที่จากไปจะอยู่กับคุณตลอดไป' },
    together: { icon: '🌲', title: 'ผู้พิชิตเจ็ดวัน', text: 'ไม่มีใครมารับ แต่ทุกคนยังอยู่ด้วยกันครบ ป่านี้กลายเป็นบ้านหลังใหม่ของพวกคุณ' },
    lastone:  { icon: '🕯️', title: 'ผู้รอดชีวิตคนสุดท้าย', text: 'เหลือเพียงคุณคนเดียวที่ยังยืนอยู่ เสียงของเพื่อนๆ ยังดังก้องอยู่ในความเงียบของป่า' },
    stranded: { icon: '🌫️', title: 'รอดแต่ยังติดป่า', text: 'เจ็ดวันผ่านไป พวกคุณยังมีชีวิต… แต่ทางออกยังอยู่อีกไกล' },
    fallen:   { icon: '💀', title: 'ป่ากลืนกิน', text: 'ไม่มีใครรอดพ้นจากป่าดงดิบแห่งนี้ บางทีครั้งหน้าอาจต้องเตรียมตัวให้ดีกว่านี้' },
  };
  function endingFor(survived) {
    const s = g(), n = alive().length, total = s.players.length;
    if (!survived || !n) return 'fallen';
    if (s.rescueData.success) return n === total ? 'legend' : 'rescued';
    if (n === total) return 'together';
    if (n === 1) return 'lastone';
    return 'stranded';
  }
  function unlocked() { try { return JSON.parse(localStorage.getItem('forest_endings') || '[]'); } catch (e) { return []; } }
  function unlock(id) { try { const u = unlocked(); if (!u.includes(id)) { u.push(id); localStorage.setItem('forest_endings', JSON.stringify(u)); } } catch (e) { /* storage blocked */ } }

  wrap('gameEnd', orig => function (survived) {
    const id = endingFor(survived);
    const e = ENDINGS[id];
    window.GP.lastEnding = Object.assign({ id }, e);
    const res = orig.apply(this, arguments); // fx.js plays the cutscene, then fills the end screen
    // the end screen may be filled after the cutscene; decorate once it's visible
    const t = setInterval(() => {
      const scr = document.getElementById('end-screen');
      if (!scr || getComputedStyle(scr).display === 'none') return;
      clearInterval(t);
      unlock(id);
      const old = document.getElementById('gp-ending'); if (old) old.remove();
      const box = document.createElement('div');
      box.id = 'gp-ending'; box.className = 'gp-ending';
      const u = unlocked();
      box.innerHTML = '<div class="gp-e-title"></div><div class="gp-e-text"></div><div class="gp-e-col"></div>';
      box.querySelector('.gp-e-title').textContent = `${e.icon} ฉากจบ: ${e.title}`;
      box.querySelector('.gp-e-text').textContent = e.text + (st().dailyDone.length ? `\nภารกิจรายวันที่ทำสำเร็จ: ${st().dailyDone.length} ครั้ง` : '');
      box.querySelector('.gp-e-col').textContent = `ฉากจบที่ปลดล็อกแล้ว ${u.length}/${Object.keys(ENDINGS).length}: ` +
        Object.keys(ENDINGS).map(k => u.includes(k) ? ENDINGS[k].icon : '❔').join(' ');
      const msg = document.getElementById('end-msg');
      if (msg && msg.parentNode) msg.parentNode.insertBefore(box, msg.nextSibling);
    }, 300);
    setTimeout(() => clearInterval(t), 30000);
    return res;
  });

  window.GP = { SITUATIONS, ENDINGS, endingFor, refreshQuestBox, lastEnding: null, _runSituation: runSituation, _pickSituation: pickSituation };
})();
