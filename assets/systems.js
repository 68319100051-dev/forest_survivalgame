// ===================== SYSTEMS UI: WORKBENCH, MATERIAL BAR, EAT & SKILL PICKERS =====================
// Loaded after game.js. game.js calls window.SX.* for UI; the game rules stay in game.js.
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  function g() { try { return G; } catch (e) { return null; } }
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function esc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
  function myTurn(pi) { const s = g(); return s && s.currentPlayer === pi && !s.dayDone[pi] && s.players[pi].alive && !s.isLoading; }

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  #sx-matbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:-2px 0 10px;padding:6px 10px;border-radius:12px;background:rgba(12,18,16,.72);border:1px solid var(--border);backdrop-filter:blur(8px)}
  #sx-matbar .sx-mb-title{font-size:10px;color:var(--text3);letter-spacing:1px;margin-right:4px;text-transform:uppercase}
  .sx-mat{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:var(--bg4);border:1px solid var(--border);font-size:12px;font-weight:700;color:var(--text);transition:transform .2s,border-color .2s}
  .sx-mat.zero{opacity:.45}
  .sx-mat.bump{animation:sxBump .6s cubic-bezier(.2,1.8,.4,1);border-color:var(--amber2)}
  #sx-matbar .sx-wb-btn{margin-left:auto;padding:4px 12px;border-radius:20px;border:1px solid var(--amber2);background:rgba(232,168,48,.12);color:var(--amber2);font:700 11px 'Noto Sans Thai',sans-serif;cursor:pointer}
  #sx-matbar .sx-wb-btn:hover{background:rgba(232,168,48,.25)}
  @keyframes sxBump{40%{transform:scale(1.25)}}

  #sx-modal{position:fixed;inset:0;z-index:1850;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);padding:14px}
  #sx-modal.show{display:flex;animation:sxFade .2s ease}
  #sx-card{width:min(760px,100%);max-height:92vh;display:flex;flex-direction:column;background:linear-gradient(180deg,#141c18,#0b110f);border:1px solid var(--border2);border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.8);animation:sxPop .3s cubic-bezier(.2,1.3,.4,1);overflow:hidden}
  #sx-head{padding:14px 16px 8px;border-bottom:1px solid var(--border)}
  #sx-title{font-size:18px;font-weight:800;color:var(--green3);display:flex;align-items:center;gap:8px}
  #sx-sub{font-size:11px;color:var(--text3);margin-top:3px}
  #sx-close{margin-left:auto;background:none;border:1px solid var(--border);color:var(--text2);border-radius:8px;padding:2px 10px;cursor:pointer;font-size:14px}
  #sx-tabs{display:flex;flex-wrap:wrap;gap:4px;padding:8px 12px 0;flex-shrink:0}
  .sx-tab{flex-shrink:0;padding:8px 14px 9px;line-height:1.5;border-radius:10px 10px 0 0;border:1px solid var(--border);border-bottom:none;background:var(--bg3);color:var(--text2);font:700 12px 'Noto Sans Thai',sans-serif;cursor:pointer;white-space:nowrap;position:relative}
  .sx-mat .sx-mat-n{font-weight:600;font-size:10px;color:var(--text3)}
  .sx-tab.on{background:var(--bg4);color:var(--green3);border-color:var(--border2)}
  .sx-tab .sx-dot{position:absolute;top:4px;right:4px;width:7px;height:7px;border-radius:50%;background:var(--green2);box-shadow:0 0 6px var(--green2)}
  #sx-body{padding:12px;overflow-y:auto;flex:1;border-top:1px solid var(--border2);background:var(--bg4)}
  .sx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
  .sx-rc{position:relative;border-radius:12px;padding:10px;background:var(--bg3);border:1px solid var(--border);display:flex;flex-direction:column;gap:6px;transition:transform .15s,border-color .15s,box-shadow .15s}
  .sx-rc.ok{border-color:rgba(114,200,130,.6);box-shadow:0 0 12px rgba(114,200,130,.15)}
  .sx-rc.near{border-color:rgba(232,168,48,.55)}
  .sx-rc.ok:hover{transform:translateY(-2px)}
  .sx-rc.locked,.sx-rc.unknown{opacity:.55}
  .sx-rc.built{border-color:var(--green);background:rgba(72,158,92,.1)}
  .sx-rc-top{display:flex;align-items:center;gap:8px}
  .sx-rc-ico{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-size:20px;background:rgba(255,255,255,.05);border:1px solid var(--border);flex-shrink:0}
  .sx-rc-name{font-weight:800;font-size:13px;color:var(--text)}
  .sx-rc-tier{font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;background:rgba(72,144,200,.15);color:var(--blue2);border:1px solid rgba(72,144,200,.3);margin-left:4px}
  .sx-rc-desc{font-size:11px;color:var(--text2);line-height:1.5}
  .sx-needs{display:flex;flex-wrap:wrap;gap:4px}
  .sx-need{font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;background:rgba(114,200,130,.12);color:var(--green3);border:1px solid rgba(114,200,130,.3)}
  .sx-need.miss{background:rgba(216,72,72,.12);color:#f3a0a0;border-color:rgba(216,72,72,.35)}
  .sx-rc-foot{display:flex;align-items:center;gap:6px;margin-top:auto}
  .sx-status{font-size:10px;font-weight:700;color:var(--text3)}
  .sx-go{margin-left:auto;padding:6px 12px;border-radius:9px;border:1px solid var(--green2);background:rgba(114,200,130,.15);color:var(--green3);font:800 12px 'Noto Sans Thai',sans-serif;cursor:pointer}
  .sx-go:hover:not(:disabled){background:rgba(114,200,130,.3)}
  .sx-go:disabled{opacity:.35;cursor:not-allowed}
  .sx-section{font-size:12px;font-weight:800;color:var(--amber2);margin:12px 2px 8px}
  .sx-empty{font-size:12px;color:var(--text3);padding:20px;text-align:center}
  .sx-food{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:var(--bg3);border:1px solid var(--border);cursor:pointer;transition:transform .15s,border-color .15s}
  .sx-food:hover{transform:translateY(-2px);border-color:var(--green2)}
  .sx-food.warn{border-color:rgba(216,72,72,.45)}
  .sx-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px}
  .sx-chip{font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;background:rgba(255,255,255,.06);color:var(--text2)}
  .sx-chip.g{color:#9be8a8;background:rgba(48,152,72,.15)} .sx-chip.b{color:#f3a0a0;background:rgba(184,40,40,.15)}
  #sx-toast{position:fixed;left:50%;top:70px;transform:translate(-50%,-20px);z-index:1880;opacity:0;pointer-events:none;padding:10px 18px;border-radius:14px;background:linear-gradient(100deg,rgba(40,30,8,.95),rgba(20,16,6,.95));border:1px solid var(--amber2);color:#ffe08a;font:800 13px 'Noto Sans Thai',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6);transition:opacity .3s,transform .3s;cursor:pointer}
  #sx-toast.show{opacity:1;transform:translate(-50%,0);pointer-events:auto}
  @keyframes sxFade{from{opacity:0}} @keyframes sxPop{from{opacity:0;transform:scale(.94) translateY(10px)}}
  @media (max-width:520px){.sx-grid{grid-template-columns:1fr}#sx-card{max-height:96vh}}
  `;
  document.head.appendChild(style);

  // ---------- modal shell ----------
  const modal = document.createElement('div');
  modal.id = 'sx-modal';
  modal.innerHTML = '<div id="sx-card"><div id="sx-head"><div id="sx-title"><span id="sx-title-t"></span><button id="sx-close" title="ปิด">✕</button></div><div id="sx-sub"></div></div><div id="sx-tabs"></div><div id="sx-body"></div></div>';
  document.body.appendChild(modal);
  $('sx-close').onclick = close;
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) close(); });
  let view = null; // { kind, pi, tab }
  function open(kind, pi, tab) { view = { kind, pi, tab }; modal.classList.add('show'); render(); }
  function close() { modal.classList.remove('show'); view = null; }
  function render() {
    if (!view) return;
    if (view.kind === 'workbench') renderWorkbench();
    else if (view.kind === 'eat') renderEat();
    else if (view.kind === 'skill') renderSkill();
  }
  // re-render after an action resolves; close when the turn is over
  function afterAction() {
    setTimeout(() => {
      if (!view) return;
      const s = g();
      if (!s || s.dayDone[view.pi] || s.currentPlayer !== view.pi || !s.players[view.pi].alive) { close(); return; }
      render();
    }, 60);
  }

  // ---------- material bar ----------
  function ensureMatBar() {
    let bar = $('sx-matbar');
    if (bar) return bar;
    const header = $('header');
    if (!header) return null;
    bar = document.createElement('div');
    bar.id = 'sx-matbar';
    header.insertAdjacentElement('afterend', bar);
    return bar;
  }
  function renderMatBar(bumpName) {
    const s = g();
    if (!s || !s.players || !s.players.length || typeof BASIC_MATS === 'undefined') return;
    const bar = ensureMatBar(); if (!bar) return;
    ensureMats();
    bar.innerHTML = '<span class="sx-mb-title">🧺 ถุงวัสดุทีม</span>' + BASIC_MATS.map(m =>
      `<span class="sx-mat${s.mats[m] ? '' : ' zero'}${m === bumpName ? ' bump' : ''}" title="${m}">${MAT_ICON[m]} <span class="sx-mat-n">${m}</span> ${s.mats[m]}</span>`).join('') +
      '<button class="sx-wb-btn" id="sx-open-wb">🔨 โต๊ะช่าง</button>';
    $('sx-open-wb').onclick = () => { const pi = getMyPlayerIndex(); if (pi > -1) openWorkbench(pi, 'tool'); };
  }

  // ---------- recipe helpers ----------
  function needChips(pi, needs) {
    const counts = countNeeds(needs);
    const pool = itemPool(pi, true);
    return Object.entries(counts).map(([n, need]) => {
      const have = isBasicMat(n) ? matCount(n) : pool.filter(i => i === n).length;
      return `<span class="sx-need${have >= need ? '' : ' miss'}">${MAT_ICON[n] || '📦'} ${esc(n)} ${Math.min(have, need)}/${need}</span>`;
    }).join('');
  }
  function recipeState(pi, needs, tier, hours) {
    const p = g().players[pi];
    if (!tierUnlocked(tier)) return { cls:'locked', text:'🔒 ' + tierLockText(tier), can:false, rank:3 };
    const miss = missingFor(pi, needs).reduce((a, m) => a + (m.need - m.have), 0);
    if (miss === 0 && p.hoursLeft >= hours) return { cls:'ok', text:'🟢 ทำได้เลย', can:true, rank:0 };
    if (miss === 0) return { cls:'near', text:'⏰ เวลาไม่พอวันนี้', can:false, rank:1 };
    if (miss === 1) return { cls:'near', text:'🟡 ขาดอีก 1 ชิ้น', can:false, rank:1 };
    return { cls:'', text:`⚪ ขาดอีก ${miss} ชิ้น`, can:false, rank:2 };
  }
  function tierBadge(t) { return `<span class="sx-rc-tier">ขั้น ${t}</span>`; }

  // ---------- workbench ----------
  const TABS = [
    { id:'tool', label:'🛠️ เครื่องมือ' },
    { id:'med', label:'💊 ยา / อาหาร' },
    { id:'rescue', label:'📻 กู้ภัย' },
    { id:'camp', label:'🏕️ แคมป์' },
    { id:'salvage', label:'🔧 แยก / ซ่อม' },
  ];
  function openWorkbench(pi, tab) { discoverRecipes(); open('workbench', pi, tab || 'tool'); sfx('click'); }
  function visibleCrafts(pi, cat) {
    const p = g().players[pi];
    return CRAFTS.filter(c => c.cat === cat && (!c.side || p.side === c.side));
  }
  function tabHasReady(pi, tab) {
    const s = g(), p = s.players[pi];
    if (tab === 'camp') return p.atCamp && CAMP_STRUCTURES.some(st => !s.camp.structures.includes(st.id) && recipeState(pi, st.needs, st.tier, craftHours(pi, st.time)).can);
    if (tab === 'salvage') return p.inventory.some(i => SALVAGE[i]);
    return visibleCrafts(pi, tab).some(c => s.discovered.includes(c.name) && recipeState(pi, c.needs, c.tier, craftHours(pi, c.time)).can);
  }
  function renderWorkbench() {
    const s = g(), pi = view.pi, p = s.players[pi];
    ensureMats();
    $('sx-title-t').textContent = '🔨 โต๊ะช่าง';
    const lvl = s.camp.structures.includes('workbench') ? (s.camp.level >= 3 ? 'ปลดล็อกถึงขั้น 3' : 'ปลดล็อกถึงขั้น 2') : 'ขั้น 1 (สร้างโต๊ะช่างที่แคมป์เพื่อปลดล็อกขั้น 2)';
    $('sx-sub').innerHTML = `${esc(p.name)} · ⏰ เหลือ ${p.hoursLeft} ชม. · ${p.atCamp ? '⛺ อยู่แคมป์ (ใช้ของในคลังได้)' : '🌿 อยู่ในป่า'} · ${lvl}` +
      `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${BASIC_MATS.map(m => `<span class="sx-mat${s.mats[m] ? '' : ' zero'}" title="${m}">${MAT_ICON[m]} <span class="sx-mat-n">${m}</span> ${s.mats[m]}</span>`).join('')}</div>`;
    $('sx-tabs').innerHTML = TABS.map(t => `<button class="sx-tab${t.id === view.tab ? ' on' : ''}" data-tab="${t.id}">${t.label}${tabHasReady(pi, t.id) ? '<span class="sx-dot"></span>' : ''}</button>`).join('');
    $('sx-tabs').querySelectorAll('.sx-tab').forEach(b => b.onclick = () => { view.tab = b.dataset.tab; render(); sfx('click'); });
    const body = $('sx-body');
    const canAct = myTurn(pi);
    if (view.tab === 'camp') body.innerHTML = campTab(pi, canAct);
    else if (view.tab === 'salvage') body.innerHTML = salvageTab(pi, canAct);
    else body.innerHTML = craftTab(pi, view.tab, canAct) + (view.tab === 'med' ? cookSection(pi, canAct) : '');
    body.querySelectorAll('[data-craft]').forEach(b => b.onclick = () => { doCraft(pi, b.dataset.craft); afterAction(); });
    body.querySelectorAll('[data-build]').forEach(b => b.onclick = () => { doBuildCampStructure(pi, b.dataset.build); afterAction(); });
    body.querySelectorAll('[data-cook]').forEach(b => b.onclick = () => { const r = CAMP_RECIPES[+b.dataset.cook]; doCookFood(pi, r.input, r.output); afterAction(); });
    body.querySelectorAll('[data-salvage]').forEach(b => b.onclick = () => { doSalvage(pi, b.dataset.salvage); sfx('craft'); afterAction(); });
    body.querySelectorAll('[data-repair]').forEach(b => b.onclick = () => { doRepair(pi, b.dataset.repair); afterAction(); });
  }
  function craftTab(pi, cat, canAct) {
    const s = g();
    const list = visibleCrafts(pi, cat).map(c => {
      const known = s.discovered.includes(c.name);
      const hrs = craftHours(pi, c.time);
      const st = known ? recipeState(pi, c.needs, c.tier, hrs) : { cls:'unknown', text:'❓ ยังไม่ค้นพบ', can:false, rank:4 };
      return { c, known, hrs, st };
    }).sort((a, b) => a.st.rank - b.st.rank);
    if (!list.length) return '<div class="sx-empty">ไม่มีสูตรในหมวดนี้</div>';
    return '<div class="sx-grid">' + list.map(({ c, known, hrs, st }) => known ? `
      <div class="sx-rc ${st.cls}">
        <div class="sx-rc-top"><div class="sx-rc-ico">${c.icon}</div><div><div class="sx-rc-name">${esc(c.name)}${tierBadge(c.tier)}</div><div class="sx-status">${st.text}</div></div></div>
        <div class="sx-rc-desc">${esc(c.desc)}</div>
        <div class="sx-needs">${needChips(pi, c.needs)}</div>
        <div class="sx-rc-foot"><span class="sx-status">⏰ ${hrs ? hrs + ' ชม.' : 'ไม่เสียเวลา'}</span>
          <button class="sx-go" data-craft="${esc(c.name)}" ${st.can && canAct ? '' : 'disabled'}>คราฟ</button></div>
      </div>` : `
      <div class="sx-rc unknown">
        <div class="sx-rc-top"><div class="sx-rc-ico">❓</div><div><div class="sx-rc-name">สูตรลับ${tierBadge(c.tier)}</div><div class="sx-status">ค้นพบเมื่อได้ ${MAT_ICON[c.needs[0]] || '📦'} ${esc(c.needs[0])}</div></div></div>
      </div>`).join('') + '</div>';
  }
  function cookSection(pi, canAct) {
    const s = g(), p = s.players[pi];
    const hasFire = s.camp.structures.includes('campfire') || s.camp.structures.includes('stove');
    const pool = itemPool(pi, true);
    const cookable = CAMP_RECIPES.map((r, i) => ({ r, i })).filter(({ r }) => pool.includes(r.input));
    let html = `<div class="sx-section">🍳 ทำอาหารที่กองไฟ${s.camp.structures.includes('stove') ? ' (เตาดิน: ไม่เสียเวลา + มีโอกาสได้ 2 ชิ้น)' : ''}</div>`;
    if (!hasFire) return html + '<div class="sx-empty">ต้องสร้าง 🔥 กองไฟ ที่แท็บแคมป์ก่อน</div>';
    if (!p.atCamp) return html + '<div class="sx-empty">ต้องอยู่ที่แคมป์ถึงจะทำอาหารได้</div>';
    if (!cookable.length) return html + '<div class="sx-empty">ไม่มีของดิบให้ทำ (เนื้อ ปลา ไก่ป่า กระต่าย กบ อาหารกระป๋อง)</div>';
    return html + '<div class="sx-grid">' + cookable.map(({ r, i }) => `
      <div class="sx-rc ok"><div class="sx-rc-top"><div class="sx-rc-ico">🔥</div><div><div class="sx-rc-name">${esc(r.input)} → ${esc(r.output)}</div><div class="sx-status">${esc(r.desc)}</div></div></div>
      <div class="sx-rc-foot"><span class="sx-status">ปลอดภัย ไม่ป่วย</span><button class="sx-go" data-cook="${i}" ${canAct ? '' : 'disabled'}>ทำอาหาร</button></div></div>`).join('') + '</div>';
  }
  function campTab(pi, canAct) {
    const s = g(), p = s.players[pi];
    const list = CAMP_STRUCTURES.map(st => {
      const built = s.camp.structures.includes(st.id);
      const hrs = craftHours(pi, st.time);
      let state = built ? { cls:'built', text:'✅ สร้างแล้ว', can:false, rank:5 } : recipeState(pi, st.needs, st.tier, hrs);
      let usingAlt = false;
      if (!built && !state.can && st.alt && tierUnlocked(st.tier) && haveAll(pi, st.alt) && p.hoursLeft >= hrs) { state = { cls:'ok', text:'🟢 ทำได้ (สูตรทางเลือก)', can:true, rank:0 }; usingAlt = true; }
      return { st, built, hrs, state, usingAlt };
    }).sort((a, b) => a.state.rank - b.state.rank);
    const note = p.atCamp ? '' : '<div class="sx-empty" style="padding:8px">⚠️ ต้องกลับแคมป์ก่อนถึงจะสร้างได้</div>';
    return note + '<div class="sx-grid">' + list.map(({ st, built, hrs, state, usingAlt }) => `
      <div class="sx-rc ${state.cls}">
        <div class="sx-rc-top"><div class="sx-rc-ico">${st.emoji}</div><div><div class="sx-rc-name">${esc(st.name)}${tierBadge(st.tier)}</div><div class="sx-status">${state.text}</div></div></div>
        <div class="sx-rc-desc">${esc(st.desc)}</div>
        ${built ? '' : `<div class="sx-needs">${needChips(pi, usingAlt ? st.alt : st.needs)}</div>${st.alt && !usingAlt ? `<div class="sx-status">หรือ: ${st.alt.join(' + ')}</div>` : ''}`}
        ${built ? '' : `<div class="sx-rc-foot"><span class="sx-status">⏰ ${hrs} ชม.</span><button class="sx-go" data-build="${st.id}" ${state.can && canAct && p.atCamp ? '' : 'disabled'}>สร้าง</button></div>`}
      </div>`).join('') + '</div>';
  }
  function salvageTab(pi, canAct) {
    const p = g().players[pi];
    const items = [...new Set(p.inventory.filter(i => SALVAGE[i]))];
    let html = '<div class="sx-section">🔧 แยกชิ้นส่วนเป็นวัสดุ (ไม่เสียเวลา)</div>';
    html += items.length ? '<div class="sx-grid">' + items.map(i => `
      <div class="sx-rc ok"><div class="sx-rc-top"><div class="sx-rc-ico">📦</div><div><div class="sx-rc-name">${esc(i)}</div>
      <div class="sx-needs">${Object.entries(SALVAGE[i]).map(([m, n]) => `<span class="sx-need">${MAT_ICON[m]} ${m} +${n}</span>`).join('')}</div></div></div>
      <div class="sx-rc-foot"><button class="sx-go" data-salvage="${esc(i)}" ${canAct ? '' : 'disabled'}>แยก</button></div></div>`).join('') + '</div>'
      : '<div class="sx-empty">ไม่มีของที่แยกได้ในกระเป๋า (ตะเกียงเก่า กระทะเก่า เต็นท์ทหาร แก้ว ฯลฯ)</div>';
    const tools = [...new Set(p.inventory.filter(i => DURABILITY[i]))];
    html += '<div class="sx-section">⚒ ความทนทานของอุปกรณ์</div>';
    if (!tools.length) return html + '<div class="sx-empty">ยังไม่มีอุปกรณ์ที่สึกหรอได้</div>';
    const isEng = p.job && p.job.id === 'engineer';
    return html + '<div class="sx-grid">' + tools.map(t => {
      const left = duraLeft(p, t), max = DURABILITY[t];
      return `<div class="sx-rc"><div class="sx-rc-top"><div class="sx-rc-ico">⚒</div><div><div class="sx-rc-name">${esc(t)}</div><div class="sx-status">ใช้ได้อีก ${left}/${max} ครั้ง</div></div></div>
        <div class="sx-rc-foot">${isEng ? `<button class="sx-go" data-repair="${esc(t)}" ${canAct && left < max ? '' : 'disabled'}>🔧 ซ่อม (1 ชม. + ไม้/โลหะ 1)</button>` : '<span class="sx-status">วิศวกรซ่อมได้</span>'}</div></div>`;
    }).join('') + '</div>';
  }

  // ---------- eat picker ----------
  // [hunger, thirst, hp, energy] — mirrors handleAction('eat')
  const FOOD_FX = {
    'น้ำสะอาด':[0,80,0,0], 'น้ำเน่า':[0,50,0,0], 'ผลไม้':[15,15,0,0], 'ผลไม้มีพิษ':[15,15,0,0], 'เห็ด':[15,0,0,0],
    'ปลา':[25,0,0,0], 'ปลาย่าง':[40,0,5,0], 'กบ':[20,0,0,0], 'แมลง':[10,0,0,5], 'ไข่':[20,0,5,0], 'ไข่นก':[20,0,5,0],
    'เนื้อสัตว์':[35,0,0,0], 'เนื้อย่าง':[50,0,8,0], 'กระต่าย':[25,0,0,0], 'ไก่ป่า':[25,0,0,0], 'อาหารกระป๋อง':[35,0,0,0],
    'อาหารอุ่น':[55,0,12,0], 'ยาบำรุง':[20,0,35,0], 'ยาบำรุงกำลัง':[10,0,0,40], 'ซุปเห็ด':[35,0,0,25], 'รวงผึ้ง':[20,0,0,20],
    'กุ้งฝอย':[15,10,0,0], 'หอยเชลล์':[15,10,0,0], 'ปูน้ำจืด':[15,10,0,0], 'กุ้งมังกรป่า':[50,0,15,0], 'ไข่จระเข้':[45,0,20,0],
    'รังตั๊กแตน':[15,0,0,5], 'ซุปสมาธิ':[20,0,10,0], 'หม้อไฟป่า':[100,100,100,0],
  };
  const RAW = ['ไก่ป่า','กระต่าย','ค้างคาว','กบ','กุ้งฝอย','หอยเชลล์','ปูน้ำจืด','ไข่นก','ไข่จระเข้','แมลง','มอสเรืองแสง','เนื้อสัตว์','ปลา'];
  const TOXIC = ['ผลไม้มีพิษ','น้ำเน่า','เห็ด','อาหารอาบยาพิษ'];
  function openEatPicker(pi) {
    const p = g().players[pi];
    if (!p.inventory.some(i => isFood(i) || i === 'อาหารอาบยาพิษ')) { addMsg('❌ ไม่มีอาหารหรือน้ำในกระเป๋า — หยิบจากคลังแคมป์ หรือตกปลา/สำรวจหาอาหาร', 'bubble-system'); return; }
    open('eat', pi);
  }
  function renderEat() {
    const s = g(), pi = view.pi, p = s.players[pi];
    const chef = p.job && p.job.id === 'chef';
    $('sx-title-t').textContent = '🍽️ เลือกอาหาร / น้ำ';
    $('sx-sub').textContent = `${p.name} · หิว ${p.hunger} · น้ำ ${p.thirst}% · HP ${p.hp} · ใช้เวลา 1 ชม.${chef ? ' · พ่อครัว: กินของดิบ/มีพิษได้ปลอดภัย และอิ่มขึ้น 50%' : ''}`;
    $('sx-tabs').innerHTML = '';
    const foods = [...new Set(p.inventory.filter(i => isFood(i) || i === 'อาหารอาบยาพิษ'))];
    $('sx-body').innerHTML = '<div class="sx-grid">' + foods.map(f => {
      const [h, t, hp, en] = FOOD_FX[f] || [20, 0, 0, 0];
      const mul = chef ? 1.5 : 1;
      const raw = RAW.includes(f) && !chef, toxic = TOXIC.includes(f) && !chef;
      const chips = [h && `<span class="sx-chip g">🍖 +${Math.ceil(h * mul)}</span>`, t && `<span class="sx-chip g">💧 +${t}</span>`, hp && `<span class="sx-chip g">❤️ +${Math.ceil(hp * mul)}</span>`, en && `<span class="sx-chip g">⚡ +${en}</span>`,
        raw && '<span class="sx-chip b">⚠️ ดิบ: 50% ป่วย</span>', toxic && '<span class="sx-chip b">☠️ อาจมีพิษ</span>'].filter(Boolean).join('');
      const n = p.inventory.filter(i => i === f).length;
      return `<div class="sx-food${raw || toxic ? ' warn' : ''}" data-eat="${esc(f)}"><div class="sx-rc-ico">${t >= 50 ? '💧' : raw ? '🥩' : toxic ? '🍄' : '🍽️'}</div>
        <div><div class="sx-rc-name">${esc(f)}${n > 1 ? ` ×${n}` : ''}</div><div class="sx-chips">${chips}</div></div></div>`;
    }).join('') + '</div>' + (s.camp.structures.includes('campfire') && foods.some(f => RAW.includes(f)) ? '<div class="sx-status" style="margin-top:10px">💡 มีกองไฟแล้ว — ทำของดิบให้สุกที่แท็บ 💊 ในโต๊ะช่างจะไม่ป่วย</div>' : '');
    $('sx-body').querySelectorAll('[data-eat]').forEach(el => el.onclick = () => {
      if (!myTurn(pi)) return;
      close();
      handleAction(pi, 'eat', el.dataset.eat);
    });
  }

  // ---------- skill picker (engineer / merchant / spy) ----------
  let swapPick = null, swaps = [];
  function openSkillPicker(pi) { swapPick = null; swaps = []; open('skill', pi); }
  function renderSkill() {
    const s = g(), pi = view.pi, p = s.players[pi];
    $('sx-tabs').innerHTML = '';
    const body = $('sx-body');
    const go = choice => { close(); handleAction(pi, 'skill', choice); };
    if (p.job.id === 'engineer') {
      $('sx-title-t').textContent = '🔧 สกิลวิศวกร: สร้างฟรี 1 อย่าง';
      $('sx-sub').textContent = 'เลือกสิ่งปลูกสร้างที่จะสร้างทันทีโดยไม่ใช้วัสดุ';
      const opts = CAMP_STRUCTURES.filter(st => !s.camp.structures.includes(st.id) && tierUnlocked(st.tier));
      body.innerHTML = opts.length ? '<div class="sx-grid">' + opts.map(st => `<div class="sx-rc ok"><div class="sx-rc-top"><div class="sx-rc-ico">${st.emoji}</div><div><div class="sx-rc-name">${esc(st.name)}${tierBadge(st.tier)}</div></div></div><div class="sx-rc-desc">${esc(st.desc)}</div><div class="sx-rc-foot"><button class="sx-go" data-v="${st.id}">สร้างฟรี</button></div></div>`).join('') + '</div>'
        : '<div class="sx-empty">สร้างครบทุกอย่างที่ปลดล็อกแล้ว</div>';
      body.querySelectorAll('[data-v]').forEach(b => b.onclick = () => go(b.dataset.v));
    } else if (p.job.id === 'spy') {
      $('sx-title-t').textContent = '🕵️ สกิลสายลับ: ส่องคน 1 คน';
      $('sx-sub').textContent = 'เห็นอาชีพ ฝ่ายลับ และของในกระเป๋า — เห็นแค่คุณคนเดียว';
      const opts = s.players.map((t, i) => ({ t, i })).filter(({ t, i }) => i !== pi && t.alive);
      body.innerHTML = '<div class="sx-grid">' + opts.map(({ t, i }) => `<div class="sx-food" data-v="${i}"><div class="sx-rc-ico">${t.emoji}</div><div><div class="sx-rc-name">${esc(t.name)}</div><div class="sx-status">${t.job.emoji} ${esc(t.job.name)} · ความไว้วางใจ ${t.trust}%</div></div></div>`).join('') + '</div>';
      body.querySelectorAll('[data-v]').forEach(b => b.onclick = () => go(+b.dataset.v));
    } else if (p.job.id === 'merchant') {
      $('sx-title-t').textContent = '💰 สกิลพ่อค้า';
      $('sx-sub').textContent = p.atCamp ? 'ขายของมีค่าเป็นวัสดุ 4 ชิ้น หรือเลือกแลกของกับคลังแคมป์ได้ถึง 3 คู่' : '⚠️ ต้องอยู่ที่แคมป์';
      const vals = [...new Set(p.inventory.filter(isValuable))];
      let html = '<div class="sx-section">💎 ขายของมีค่า</div>';
      html += vals.length ? '<div class="sx-grid">' + vals.map(v => `<div class="sx-rc ok"><div class="sx-rc-name">💎 ${esc(v)}</div><div class="sx-needs">${BASIC_MATS.map(m => `<button class="sx-go" style="margin:0" data-sell="${esc(v)}" data-mat="${m}">${MAT_ICON[m]}×4</button>`).join('')}</div></div>`).join('') + '</div>'
        : '<div class="sx-empty">ไม่มีของมีค่า (ทองคำแท่ง พลอย ฟอสซิล มุก ขนนกอินทรี ฯลฯ)</div>';
      html += `<div class="sx-section">🔄 แลกของ (${swaps.length}/3 คู่)${swapPick ? ` — เลือกของในคลังที่จะเอา แทน "${esc(swapPick)}"` : ' — เลือกของในกระเป๋าก่อน'}</div>`;
      const bag = p.inventory.filter((it, i) => !swaps.some(sw => sw[0] === it && p.inventory.indexOf(it) === i));
      html += `<div class="sx-needs">${bag.map(it => `<button class="sx-go" style="margin:0" data-bag="${esc(it)}">${swapPick === it ? '👉 ' : ''}${esc(it)}</button>`).join('') || '<span class="sx-status">กระเป๋าว่าง</span>'}</div>`;
      html += `<div class="sx-needs" style="margin-top:8px">${s.camp.sharedItems.map(it => `<button class="sx-go" style="margin:0;border-color:var(--blue2);color:var(--blue2)" data-camp="${esc(it)}" ${swapPick ? '' : 'disabled'}>📦 ${esc(it)}</button>`).join('') || '<span class="sx-status">คลังว่าง</span>'}</div>`;
      if (swaps.length) html += `<div class="sx-status" style="margin-top:8px">${swaps.map(sw => `${esc(sw[0])} ⇄ ${esc(sw[1])}`).join(' · ')}</div><div style="margin-top:8px"><button class="sx-go" id="sx-swap-go">✔ ยืนยันแลก ${swaps.length} คู่</button></div>`;
      body.innerHTML = html;
      body.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => go({ sell: b.dataset.sell, mat: b.dataset.mat }));
      body.querySelectorAll('[data-bag]').forEach(b => b.onclick = () => { swapPick = b.dataset.bag; render(); });
      body.querySelectorAll('[data-camp]').forEach(b => b.onclick = () => { if (swapPick && swaps.length < 3) { swaps.push([swapPick, b.dataset.camp]); swapPick = null; render(); } });
      const ok = $('sx-swap-go'); if (ok) ok.onclick = () => go({ swap: swaps });
    }
  }

  // ---------- notifications ----------
  const toast = document.createElement('div');
  toast.id = 'sx-toast';
  document.body.appendChild(toast);
  let toastT = 0;
  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 3500);
  }
  toast.onclick = () => { toast.classList.remove('show'); const pi = getMyPlayerIndex(); if (pi > -1) openWorkbench(pi, 'tool'); };
  function onDiscover(list) {
    const s = g();
    if (!s || !s.players || s.currentPlayer !== getMyPlayerIndex()) return; // only toast on the human's turn
    const names = list.length <= 2 ? list.map(c => `${c.icon} ${esc(c.name)}`).join(' · ') : `${list.slice(0, 2).map(c => c.icon).join(' ')} และอีก ${list.length - 2} สูตร`;
    showToast(`💡 ค้นพบสูตรใหม่: ${names} <span style="opacity:.7;font-weight:600">(แตะเพื่อดู)</span>`);
    sfx('pickup');
  }
  let lastBump = null;
  function onMats(name, n, silent) { lastBump = name || null; renderMatBar(lastBump); if (view) render(); }
  function celebrate(icon) { if (window.FX) { FX.pop(icon); FX.sfx('craft'); } }

  // keep the bar fresh
  const wrapRender = window.renderAllPanels;
  if (typeof wrapRender === 'function') {
    window.renderAllPanels = function () { const r = wrapRender.apply(this, arguments); try { renderMatBar(); } catch (e) { /* ok */ } return r; };
  }

  window.SX = { openWorkbench, openEatPicker, openSkillPicker, renderMatBar, onMats, onDiscover, celebrate, close };
})();
