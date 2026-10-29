// ===================== MENU: HOME SCREEN, SETUP PAGE, JOB CARD DRAW =====================
// Restyles the existing start screens (keeps the ids game.js relies on) and replaces the job roll
// with a 3-card draw that flips to the job, then to the secret side.
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  function g() { try { return G; } catch (e) { return null; } }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function esc(t) { return String(t).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

  // What each job does all the time (all of these exist in game.js), plus a play tip
  const JOB_INFO = {
    hunter:   { color:'#e8a830', passive:'ดวงดีขึ้นตอนสำรวจ', tip:'ล่าสัตว์ให้ทีม เอาเนื้อไปย่างที่กองไฟ' },
    doctor:   { color:'#7ae07a', passive:'รักษาตัวเองฟรีไม่ต้องใช้ยา (+25 HP)', tip:'ดูแล HP ทีม — ศึกเจ้าป่าคือเวลาของคุณ' },
    thief:    { color:'#c08aff', passive:'โจมตีผู้รอดชีวิตคนอื่นได้', tip:'ขโมยตอนวิกฤต แต่ความไว้วางใจจะลด' },
    chef:     { color:'#ff9a5a', passive:'กินของดิบ/มีพิษได้ปลอดภัย · อิ่มขึ้น 50%', tip:'ของดิบคืออาหารของคุณ แบ่งอาหารอุ่นให้ทีม' },
    scout:    { color:'#5ac8ff', passive:'สำรวจเร็วขึ้น 2 ชม. · ดวงดีขึ้นตอนสำรวจ', tip:'สำรวจได้หลายที่ต่อวัน เก็บวัสดุให้ทีม' },
    soldier:  { color:'#ff6a6a', passive:'โดนดาเมจครึ่งเดียว · เฝ้ายามเห็นคนร้ายง่ายขึ้น', tip:'ยืนหน้าสู้สัตว์และเจ้าป่า' },
    shaman:   { color:'#d8a0ff', passive:'อากาศที่พยากรณ์ไว้จะเกิดขึ้นจริง', tip:'วางแผนสำรวจตามอากาศ ใช้สกิลตอนสติทีมต่ำ' },
    engineer: { color:'#ffd34d', passive:'คราฟ/สร้างเร็วขึ้น 1 ชม. · ซ่อมอุปกรณ์ได้', tip:'สร้างโต๊ะช่างให้เร็วที่สุด' },
    merchant: { color:'#ffe08a', passive:'ขายของมีค่าเป็นวัสดุได้', tip:'เก็บของมีค่าไว้ขาย หรือแลกของในคลัง' },
    spy:      { color:'#9ab0ff', passive:'ส่องฝ่ายลับของคนอื่นได้วันละ 1 คน', tip:'หาคนเลวให้เจอก่อนวันโหวต' },
  };

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  /* home */
  #mode-selector-screen{background:#050806 !important;overflow:hidden}
  #mn-bg{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;z-index:0}
  #mn-wrap{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:18px;width:min(92%,420px);padding:20px 0}
  #mn-logo{text-align:center;animation:mnDrop .9s cubic-bezier(.2,1.4,.4,1) backwards}
  #mn-logo .t{font-family:'Noto Sans Thai',sans-serif;font-weight:900;font-size:clamp(52px,13vw,84px);line-height:1;color:#bff0c4;letter-spacing:4px;text-shadow:0 4px 0 #0b2a14,0 8px 0 #06170b,0 0 30px rgba(120,230,140,.55);animation:mnGlow 3.5s ease-in-out infinite}
  #mn-logo .s{margin-top:10px;font-size:13px;font-weight:700;letter-spacing:2px;color:#e8d8a8;text-shadow:2px 2px 0 #000}
  #mn-logo .s b{color:#ff8a7a}
  #mn-menu{display:flex;flex-direction:column;gap:9px;width:100%}
  .mn-item{position:relative;display:flex;align-items:center;gap:12px;width:100%;padding:12px 16px;border-radius:14px;border:1px solid rgba(160,220,170,.25);background:linear-gradient(90deg,rgba(14,24,18,.88),rgba(14,24,18,.6));color:#e6f0dc;font:800 15px 'Noto Sans Thai',sans-serif;cursor:pointer;text-align:left;backdrop-filter:blur(6px);transition:transform .18s,border-color .18s,box-shadow .18s,background .18s;animation:mnIn .5s cubic-bezier(.22,1,.36,1) backwards;overflow:hidden;margin:0}
  .mn-item .i{font-size:22px;width:30px;text-align:center;filter:drop-shadow(0 2px 0 rgba(0,0,0,.5))}
  .mn-item small{display:block;font-size:11px;font-weight:600;color:#9fb49a;margin-top:1px}
  .mn-item .k{margin-left:auto;font-size:10px;color:#7a9078;font-weight:700}
  .mn-item:hover,.mn-item.sel{transform:translateX(6px);border-color:#9be8a8;box-shadow:0 0 22px rgba(120,230,140,.25);background:linear-gradient(90deg,rgba(30,60,38,.92),rgba(14,24,18,.7))}
  .mn-item.sel::before{content:'▶';position:absolute;left:-2px;color:#ffe08a;font-size:10px;animation:mnBlink 1s steps(2) infinite}
  .mn-item.primary{border-color:rgba(255,216,120,.55);background:linear-gradient(90deg,rgba(70,50,10,.9),rgba(30,24,8,.7))}
  .mn-item.primary:hover,.mn-item.primary.sel{border-color:#ffd878;box-shadow:0 0 24px rgba(255,200,90,.35)}
  #continue-btn.mn-item{display:none}
  #multi-options{width:100% !important;margin-top:0 !important;animation:mnIn .4s ease backwards}
  #mn-foot{font-size:10px;color:#6f846c;letter-spacing:1px;text-align:center}
  @keyframes mnDrop{from{opacity:0;transform:translateY(-30px) scale(.9)}}
  @keyframes mnIn{from{opacity:0;transform:translateY(14px)}}
  @keyframes mnGlow{50%{text-shadow:0 4px 0 #0b2a14,0 8px 0 #06170b,0 0 46px rgba(150,255,170,.75)}}
  @keyframes mnBlink{50%{opacity:0}}

  /* setup */
  #start-screen{background:radial-gradient(circle at 50% 20%,#14261a,#050806 70%) !important;overflow-y:auto}
  #start-screen .screen-title{font-size:clamp(22px,6vw,30px);letter-spacing:1px;margin-bottom:2px;text-align:center}
  #mn-setup-sub{font-size:12px;color:var(--text3);margin-bottom:14px;text-align:center}
  #lobby-input-area{width:min(92%,460px) !important;gap:14px !important;animation:mnIn .5s ease backwards}
  #player-name-input{padding:12px 14px !important;font-size:16px !important;border-radius:12px !important;border:1px solid var(--border2) !important;background:rgba(10,16,12,.85) !important;font-weight:700}
  #player-name-input:focus{border-color:#9be8a8 !important;box-shadow:0 0 0 3px rgba(120,230,140,.18)}
  #player-name-input.mn-shake{animation:mnShake .4s steps(6);border-color:#ff6a6a !important}
  @keyframes mnShake{0%,100%{transform:none}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
  .diff-row{display:grid !important;grid-template-columns:repeat(3,1fr);gap:8px !important}
  .diff-btn{display:flex !important;flex-direction:column;align-items:center;gap:3px;padding:12px 6px !important;border-radius:12px !important;font-size:14px !important;font-weight:800 !important;transition:transform .15s,border-color .15s,box-shadow .15s !important}
  .diff-btn small{font-size:10px;font-weight:600;opacity:.75;line-height:1.3;text-align:center}
  .diff-btn:hover{transform:translateY(-2px)}
  .diff-btn.active{box-shadow:0 0 18px rgba(120,230,140,.3)}
  #mn-team{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .mn-mate{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 10px;border-radius:12px;border:1px dashed var(--border2);background:rgba(255,255,255,.03);font-size:11px;color:var(--text2);min-width:72px;animation:mnIn .5s ease backwards}
  .mn-mate .e{font-size:22px}
  .mn-mate .q{font-size:10px;color:var(--amber2)}
  #mn-back{position:absolute;top:14px;left:14px;padding:6px 12px;border-radius:10px;border:1px solid var(--border);background:rgba(0,0,0,.4);color:var(--text2);font:700 12px 'Noto Sans Thai',sans-serif;cursor:pointer;z-index:2}
  #start-btn{font-size:16px !important;padding:12px 28px !important;border-radius:14px !important;animation:mnIn .6s ease .2s backwards}

  /* card draw */
  #character-sequence{gap:14px;width:min(96%,720px)}
  #mn-draw-title{font-size:18px;font-weight:900;color:#ffe08a;text-shadow:2px 2px 0 #000;text-align:center}
  #mn-draw-sub{font-size:12px;color:var(--text3);text-align:center;margin-top:-8px}
  #mn-cards{display:flex;gap:16px;justify-content:center;perspective:1000px;min-height:300px;align-items:center;flex-wrap:wrap}
  .mn-card{position:relative;width:180px;height:270px;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.3,1.3,.4,1),opacity .4s,margin .4s;cursor:pointer;animation:mnDeal .6s cubic-bezier(.2,1.3,.4,1) backwards}
  .mn-card:nth-child(2){animation-delay:.12s}.mn-card:nth-child(3){animation-delay:.24s}
  .mn-card:not(.chosen):hover{transform:translateY(-10px) rotate(-1deg)}
  .mn-card.flip{transform:rotateY(180deg)}
  .mn-card.flip2{transform:rotateY(360deg)}
  .mn-card.gone{opacity:0;transform:translateY(60px) scale(.7) rotate(12deg);pointer-events:none;width:0;margin:0 -8px}
  .mn-face{position:absolute;inset:0;border-radius:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.6)}
  .mn-back{border:3px solid #6d8a5a;background:repeating-linear-gradient(45deg,#16301c 0 8px,#12271a 8px 16px);}
  .mn-back::after{content:'🌲';font-size:58px;filter:drop-shadow(0 4px 0 rgba(0,0,0,.5))}
  .mn-back::before{content:'';position:absolute;inset:8px;border:2px dashed rgba(190,230,170,.35);border-radius:10px}
  .mn-front{transform:rotateY(180deg);border:3px solid var(--jc);background:radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--jc) 28%,#0e1410),#0b100d 75%)}
  .mn-front .je{font-size:70px;filter:drop-shadow(0 0 18px var(--jc));animation:mnFloat 2.4s ease-in-out infinite}
  .mn-front .jn{font-size:22px;font-weight:900;color:var(--jc);text-shadow:2px 2px 0 #000}
  /* the side face shares the back's angle; it only replaces the back while the card shows its front */
  .mn-side{display:none !important}
  .mn-card.reveal-side .mn-back{display:none}
  .mn-card.reveal-side .mn-side{display:flex !important}
  .mn-side{border:3px solid var(--sc);background:radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--sc) 30%,#100c0c),#0b0909 75%)}
  .mn-side .se{font-size:64px;filter:drop-shadow(0 0 20px var(--sc));animation:mnFloat 2.4s ease-in-out infinite}
  .mn-side .sn{font-size:20px;font-weight:900;color:var(--sc);text-shadow:2px 2px 0 #000;text-align:center}
  .mn-shine{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%);transform:translateX(-120%);animation:mnShine 2.8s ease-in-out infinite}
  #mn-info{width:min(96%,460px);border-radius:14px;border:1px solid var(--border2);background:rgba(10,16,12,.88);padding:12px 14px;font-size:12px;line-height:1.7;color:var(--text);animation:mnIn .5s ease backwards}
  #mn-info .row{display:flex;gap:8px}
  #mn-info .row b{color:var(--amber2);flex-shrink:0;width:92px}
  #mn-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
  @keyframes mnDeal{from{opacity:0;transform:translateY(-80px) rotate(-14deg) scale(.8)}}
  @keyframes mnFloat{50%{transform:translateY(-6px)}}
  @keyframes mnShine{0%,55%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
  @media (max-width:520px){.mn-card{width:118px;height:178px}.mn-front .je{font-size:46px}.mn-front .jn{font-size:16px}.mn-side .se{font-size:44px}.mn-side .sn{font-size:15px}.mn-back::after{font-size:40px}}
  @media (prefers-reduced-motion: reduce){#mn-logo,#mn-logo .t,.mn-item,.mn-card,.mn-front .je,.mn-side .se,.mn-shine,#mn-info,.mn-mate{animation:none !important}.mn-card{transition:none}}
  `;
  document.head.appendChild(style);

  // ---------- animated pixel campfire scene behind the home menu ----------
  let bgRaf = 0;
  function startHomeScene(canvas) {
    const c = canvas.getContext('2d');
    let W = 320, H = 180;
    const size = () => { H = 180; W = Math.max(200, Math.round(H * innerWidth / Math.max(1, innerHeight))); canvas.width = W; canvas.height = H; c.imageSmoothingEnabled = false; };
    size(); addEventListener('resize', size);
    const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
    const rnd = s => { let v = s; return () => ((v = (v * 1664525 + 1013904223) >>> 0) / 4294967296); };
    const pine = (x, base, h, col) => { for (let r = 0; r < h; r++) { const w = 1 + Math.floor((r % Math.ceil(h / 3)) * 0.9 + r * 0.32); R(x - w, base - h + r, w * 2, 1, col); } };
    const line = (seed, base, minH, maxH, col, gap, scroll) => { const r = rnd(seed); R(0, base, W, H - base, col); for (let i = -1; i < W / gap + 2; i++) { const h = minH + r() * (maxH - minH) | 0; pine(((i * gap + r() * gap * .6 - scroll) % (W + 40) + W + 40) % (W + 40) - 20, base, h, col); } };
    const person = (x, y, col, sit) => { R(x + 2, y - 1, 3, 1, '#3a2414'); R(x + 2, y, 3, 3, '#e8b88a'); R(x + 1, y + 3, 5, 4, col); if (sit) R(x + 1, y + 7, 6, 2, '#3b3f5a'); };
    const flies = Array.from({ length: 26 }, (_, i) => { const r = rnd(i * 7 + 3); return { x: r(), y: r(), p: r() * 6 }; });
    function frame(now) {
      if (!canvas.isConnected || getComputedStyle($('mode-selector-screen')).display === 'none') { bgRaf = 0; return; }
      const t = now / 1000;
      for (let i = 0; i < 10; i++) R(0, i * 13, W, 13, `rgb(${6 + i * 2},${9 + i * 3},${22 + i * 3})`);
      const sr = rnd(9); for (let i = 0; i < 90; i++) { const x = sr() * W | 0, y = sr() * 90 | 0, tw = Math.sin(t * 2 + i); if (tw > -0.3) R(x, y, 1, 1, tw > .75 ? '#fff' : '#8fa0c8'); }
      c.fillStyle = '#efe9c8'; c.beginPath(); c.arc(W * 0.8, 30, 9, 0, 7); c.fill(); c.fillStyle = 'rgba(239,233,200,.07)'; c.beginPath(); c.arc(W * 0.8, 30, 24, 0, 7); c.fill();
      line(11, H - 58, 16, 30, '#0f1c18', 15, t * 1.2);
      line(21, H - 40, 20, 38, '#0b1611', 19, t * 2.4);
      R(0, H - 24, W, 24, '#0d120c'); R(0, H - 24, W, 1, '#1d2a18');
      const fx = W / 2, fy = H - 22;
      c.fillStyle = 'rgba(255,150,60,0.07)'; c.beginPath(); c.arc(fx, fy - 4, 26 + Math.sin(t * 9) * 2, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,170,80,0.08)'; c.beginPath(); c.arc(fx, fy - 4, 14 + Math.sin(t * 11) * 2, 0, 7); c.fill();
      R(fx - 7, fy - 1, 14, 2, '#5a3a22');
      const fr = rnd((t * 14) | 0); for (let i = 0; i < 22; i++) { const x = fx - 4 + fr() * 8 | 0, y = fy - 2 - fr() * 13 | 0, k = (fy - y) / 13; R(x, y, 1, 1, k > .7 ? '#ffe36b' : k > .35 ? '#ff9a2e' : '#e0402a'); }
      for (let i = 0; i < 6; i++) { const sy = (t * 9 + i * 8) % 44; R(fx - 1 + Math.sin(sy * .2 + i) * 3, fy - 16 - sy, 2, 2, `rgba(130,130,140,${.45 - sy / 110})`); }
      [['#7aab3a', -30], ['#3a7ab0', -18], ['#c03070', 13], ['#d4902a', 25]].forEach(([col, dx]) => person(fx + dx, fy - 9, col, true));
      flies.forEach((f, i) => { const x = ((f.x * W + Math.sin(t * .5 + f.p) * 16 + t * 3) % W + W) % W, y = H * (.35 + f.y * .5) + Math.sin(t + f.p) * 6; if (Math.sin(t * 2.6 + f.p * 3) > .2) { R(x, y, 1, 1, '#d8ff7a'); c.fillStyle = 'rgba(216,255,122,.18)'; c.fillRect((x | 0) - 1, (y | 0) - 1, 3, 3); } });
      const v = c.createRadialGradient(W / 2, H * .6, H * .2, W / 2, H * .6, W * .7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
      bgRaf = requestAnimationFrame(frame);
    }
    if (!bgRaf) bgRaf = requestAnimationFrame(frame);
  }

  // ---------- home menu ----------
  function buildHome() {
    const home = $('mode-selector-screen'); if (!home || $('mn-wrap')) return;
    const cont = $('continue-btn'), multi = $('multi-options');
    home.innerHTML = '';
    const canvas = document.createElement('canvas'); canvas.id = 'mn-bg'; home.appendChild(canvas);
    const wrap = document.createElement('div'); wrap.id = 'mn-wrap';
    wrap.innerHTML = `<div id="mn-logo"><div class="t">หลงป่า</div><div class="s">7 วันแห่งการเอาชีวิตรอด · <b>ใครคือคนเลว?</b></div></div><div id="mn-menu"></div><div id="mn-foot">↑ ↓ เลือก · Enter ตกลง</div>`;
    home.appendChild(wrap);
    const menu = wrap.querySelector('#mn-menu');
    if (cont) {
      cont.className = 'mn-item primary';
      cont.removeAttribute('style');
      menu.appendChild(cont);
      // the save check sets display on this button; run it again now that the style was reset
      try { refreshContinueButton(); } catch (e) { /* no autosave module */ }
      if (cont.style.display === 'block') cont.style.display = 'flex';
    }
    const endings = (() => { try { return JSON.parse(localStorage.getItem('forest_endings') || '[]').length; } catch (e) { return 0; } })();
    const items = [
      { i:'🎮', t:'เล่นคนเดียว', s:'คุณกับบอต 3 ตัว · มีคนเลวแฝงอยู่ 1 คน', go: () => selectGameMode('single'), primary: !cont || cont.style.display === 'none' },
      { i:'🌐', t:'เล่นกับเพื่อน', s:'สร้างห้องหรือเข้าห้องด้วยรหัส 4 หลัก', go: () => { showMultiplayerOptions(); multi && multi.scrollIntoView({ block:'nearest' }); } },
      { i:'📖', t:'วิธีเล่น', s:'สรุปกติกาใน 1 นาที', go: showHowTo },
      { i:'🏆', t:'ฉากจบที่ปลดล็อก', s:`${endings}/6 ฉากจบ`, go: showEndings },
      { i:'⚙️', t:'ตั้งค่า', s:'เสียง · คัตซีน', go: showSettings },
    ];
    items.forEach((it, k) => {
      const b = document.createElement('button');
      b.className = 'mn-item' + (it.primary ? ' primary' : '');
      b.style.animationDelay = (0.25 + k * 0.07) + 's';
      b.innerHTML = `<span class="i">${it.i}</span><span>${it.t}<small>${it.s}</small></span>`;
      b.onclick = () => { sfx('click'); it.go(); };
      menu.appendChild(b);
    });
    if (multi) menu.appendChild(multi);
    // keyboard navigation
    let sel = -1;
    const visible = () => [...menu.querySelectorAll('.mn-item')].filter(b => b.offsetParent);
    document.addEventListener('keydown', e => {
      if (getComputedStyle(home).display === 'none' || (document.activeElement && document.activeElement.tagName === 'INPUT')) return;
      const list = visible(); if (!list.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
        list.forEach((b, i) => b.classList.toggle('sel', i === sel));
        sfx('click');
      } else if (e.key === 'Enter' && sel > -1 && list[sel]) { e.preventDefault(); list[sel].click(); }
    });
    startHomeScene(canvas);
  }

  function showHowTo() {
    GP.openModal({ icon:'📖', title:'วิธีเล่นหลงป่า', text:
      '🎯 เป้าหมาย: รอดให้ครบ 7 วัน หรือส่งสัญญาณกู้ภัยในวันที่ 7\n\n' +
      '⏰ แต่ละวันมีเวลา 24 ชม. (เช้า/บ่าย/เย็น) ใช้ทำ: สำรวจ · กิน · พัก · คราฟ · ใช้สกิล\n' +
      '🧺 สำรวจแล้วได้วัสดุเข้าถุงทีม → ไปคราฟที่ 🔨 โต๊ะช่าง (อาวุธ ยา สิ่งปลูกสร้าง)\n' +
      '🎭 ระหว่างสำรวจจะเจอสถานการณ์ให้เลือกทาง — ผลอาจตามมาทีหลัง\n' +
      '🌙 กลางคืนเลือกคนเฝ้ายาม — สัตว์ คนแปลกหน้า และคนเลวอาจบุกแคมป์\n' +
      '🔴 ทีมมีคนเลว 1 คนแฝงอยู่! เก็บเบาะแส แล้วโหวตไล่ได้ตั้งแต่วันที่ 3\n' +
      '🐅 วันที่ 5–6 เจ้าป่าจะบุกแคมป์ เตรียมอาวุธ รั้ว และคบเพลิงไว้\n\n' +
      '💡 ดูแถบ "ตอนนี้ควรทำอะไร" ในเกมได้ตลอด',
      choices: [{ icon:'👍', label:'เข้าใจแล้ว', onPick: () => GP.closeModal() }] });
  }
  function showEndings() {
    let have = [];
    try { have = JSON.parse(localStorage.getItem('forest_endings') || '[]'); } catch (e) { /* blocked */ }
    const E = (window.GP && GP.ENDINGS) || {};
    GP.openModal({ icon:'🏆', title:`ฉากจบที่ปลดล็อก ${have.length}/${Object.keys(E).length}`,
      text: Object.keys(E).map(k => have.includes(k) ? `${E[k].icon} ${E[k].title}\n   ${E[k].text}` : '❔ ??? — ยังไม่ปลดล็อก').join('\n\n'),
      choices: [{ icon:'✔️', label:'ปิด', onPick: () => GP.closeModal() }] });
  }
  function showSettings() {
    const P = window.FX ? FX.prefs : { cutscenes: true, sound: true };
    const save = (k, v) => { try { localStorage.setItem(k, v ? '1' : '0'); } catch (e) { /* blocked */ } };
    const open = () => GP.openModal({ icon:'⚙️', title:'ตั้งค่า', text:'ตั้งค่าจะถูกจำไว้ในเบราว์เซอร์นี้',
      choices: [
        { icon: P.sound ? '🔊' : '🔇', label:`เสียง: ${P.sound ? 'เปิด' : 'ปิด'}`, onPick: () => { P.sound = !P.sound; save('fx_sound', P.sound); open(); } },
        { icon: P.cutscenes ? '🎬' : '⏭️', label:`คัตซีนพิกเซล: ${P.cutscenes ? 'เปิด' : 'ปิด'}`, onPick: () => { P.cutscenes = !P.cutscenes; save('fx_cutscenes', P.cutscenes); open(); } },
        { icon:'✔️', label:'เสร็จแล้ว', onPick: () => GP.closeModal() },
      ] });
    open();
  }

  // ---------- setup page ----------
  function buildSetup() {
    const scr = $('start-screen'); if (!scr || $('mn-back')) return;
    const title = scr.querySelector('.screen-title');
    if (title) {
      title.textContent = '🎒 เตรียมตัวก่อนเข้าป่า';
      const sub = document.createElement('div'); sub.id = 'mn-setup-sub'; sub.textContent = 'ใส่ชื่อ เลือกความยาก แล้วจั่วการ์ดอาชีพของคุณ';
      title.insertAdjacentElement('afterend', sub);
      const tree = title.previousElementSibling; if (tree && tree.textContent.includes('🌲')) tree.style.display = 'none';
    }
    const back = document.createElement('button');
    back.id = 'mn-back'; back.textContent = '← กลับเมนู';
    back.onclick = () => { sfx('click'); scr.style.display = 'none'; $('mode-selector-screen').style.display = 'flex'; buildHome(); startHomeScene($('mn-bg')); };
    scr.appendChild(back);
    const input = $('player-name-input');
    if (input) { input.placeholder = '✏️ ชื่อของคุณ'; input.maxLength = 16; input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('start-btn').click(); } }); }
    // richer difficulty cards
    const D = typeof DIFFICULTIES !== 'undefined' ? DIFFICULTIES : null;
    document.querySelectorAll('.diff-btn').forEach(b => {
      const d = D && D[b.dataset.diff]; if (!d) return;
      b.innerHTML = `<span style="font-size:22px">${d.emoji}</span>${d.name}<small>${esc(d.desc)}</small>`;
      b.addEventListener('click', () => sfx('click'));
    });
    const desc = $('difficulty-desc'); if (desc) desc.style.display = 'none';
    // teammates preview
    const area = $('lobby-input-area');
    if (area && !$('mn-team')) {
      const t = document.createElement('div');
      t.innerHTML = '<div class="diff-label" style="margin-bottom:6px">เพื่อนร่วมทาง (บอต)</div><div id="mn-team"></div>';
      area.appendChild(t);
      const names = typeof PLAYER_NAMES !== 'undefined' ? PLAYER_NAMES.slice(1, 4) : ['บ็อบ', 'คาร่า', 'แดน'];
      const emojis = typeof PLAYER_EMOJIS !== 'undefined' ? PLAYER_EMOJIS.slice(1, 4) : ['👨', '👩', '👦'];
      t.querySelector('#mn-team').innerHTML = names.map((n, i) => `<div class="mn-mate" style="animation-delay:${0.2 + i * 0.08}s"><span class="e">${emojis[i]}</span>${esc(n)}<span class="q">บทบาท: ❓</span></div>`).join('');
    }
    const sb = $('start-btn'); if (sb) sb.textContent = '🎴 จั่วการ์ดอาชีพ';
  }

  // ---------- job card draw ----------
  function rollSide() {
    if (Math.random() < 0.25) return { side:'evil', botNeutral: Math.random() < 0.35 };
    const neutralExists = Math.random() < 0.35;
    if (neutralExists && Math.random() < 1 / 3) return { side:'neutral', neutralType: pick(['survivor', 'treasure', 'jester']) };
    return { side:'good', botNeutral: neutralExists };
  }
  function sideCard(sd) {
    const R = window.ROLES; if (!R) return null;
    const s = R.SIDES[sd.side];
    const n = sd.side === 'neutral' ? R.NEUTRALS[sd.neutralType] : null;
    return {
      color: s.color,
      icon: n ? n.icon : s.icon,
      name: n ? `คนกลาง — ${n.name}` : s.name,
      goal: n ? n.goal : s.goal,
    };
  }
  function drawSequence() {
    const input = $('player-name-input');
    const name = input ? input.value.trim() : '';
    if (!name) {
      if (input) { input.classList.remove('mn-shake'); void input.offsetWidth; input.classList.add('mn-shake'); input.focus(); input.placeholder = '⚠️ ใส่ชื่อก่อนนะ'; }
      sfx('hurt');
      return;
    }
    const s = g();
    const multi = typeof socket !== 'undefined' && socket && s.mode === 'multi';
    let job;
    if (multi) { const me = (s.lobbyPlayers || []).find(p => p.id === socket.id); job = me && me.job ? (JOBS.find(j => j.id === me.job.id) || me.job) : pick(JOBS); }
    else job = pick(JOBS);
    const side = multi ? null : rollSide();

    $('lobby-input-area') && ($('lobby-input-area').style.display = 'none');
    $('start-btn') && ($('start-btn').style.display = 'none');
    document.querySelector('#start-screen .screen-title') && (document.querySelector('#start-screen .screen-title').style.display = 'none');
    $('mn-setup-sub') && ($('mn-setup-sub').style.display = 'none');
    const seq = $('character-sequence');
    seq.style.display = 'flex';
    const info = JOB_INFO[job.id] || { color:'#9be8a8', passive:'—', tip:'' };
    const sc = side && sideCard(side);
    seq.innerHTML = `<div id="mn-draw-title">🎴 เลือกการ์ด 1 ใบ</div><div id="mn-draw-sub">โชคชะตาของคุณในป่าอยู่ในการ์ดใบนี้</div>
      <div id="mn-cards">${[0, 1, 2].map(i => `<div class="mn-card" data-i="${i}" style="--jc:${info.color};--sc:${sc ? sc.color : '#999'}">
        <div class="mn-face mn-back"></div>
        <div class="mn-face mn-front"><div class="mn-shine"></div><div class="je">${job.emoji}</div><div class="jn">${esc(job.name)}</div><div style="font-size:10px;color:var(--text3)">อาชีพของคุณ</div></div>
        ${sc ? `<div class="mn-face mn-side"><div class="mn-shine"></div><div class="se">${sc.icon}</div><div class="sn">${esc(sc.name)}</div><div style="font-size:10px;color:var(--text3)">บทบาทลับ — ห้ามบอกใคร</div></div>` : ''}
      </div>`).join('')}</div>
      <div id="mn-info" style="display:none"></div><div id="mn-actions"></div>
      <button class="screen-btn" id="confirm-start-btn" style="display:none"></button>`;
    sfx('pickup');
    const cards = [...seq.querySelectorAll('.mn-card')];
    cards.forEach(card => card.onclick = () => {
      if (seq.dataset.picked) return;
      seq.dataset.picked = '1';
      cards.forEach(c => { if (c !== card) c.classList.add('gone'); });
      card.classList.add('chosen');
      sfx('click');
      setTimeout(() => {
        card.classList.add('flip');
        sfx('turn');
        if (window.FX && !reduceMotion) FX.pop(job.emoji, card);
        $('mn-draw-title').textContent = `${job.emoji} คุณคือ ${job.name}!`;
        $('mn-draw-sub').textContent = 'อาชีพกำหนดสกิลและความสามารถติดตัวของคุณ';
        const box = $('mn-info');
        box.style.display = '';
        box.innerHTML = `<div class="row"><b>✨ สกิล</b><span>${esc(job.skill)}</span></div><div class="row"><b>🛡️ ติดตัว</b><span>${esc(info.passive)}</span></div><div class="row"><b>💡 เคล็ดลับ</b><span>${esc(info.tip)}</span></div>`;
        const acts = $('mn-actions');
        if (sc) {
          acts.innerHTML = '<button class="screen-btn" id="mn-flip-side">🎴 พลิกดูบทบาทลับ</button>';
          $('mn-flip-side').onclick = () => {
            card.classList.add('reveal-side'); // back face is turned away right now, so swap it unseen
            card.classList.add('flip2');
            sfx(side.side === 'evil' ? 'night' : 'pickup');
            $('mn-draw-title').textContent = `${sc.icon} บทบาทลับ: ${sc.name}`;
            $('mn-draw-sub').textContent = 'เฉพาะคุณเท่านั้นที่รู้ — คนอื่นในทีมไม่รู้ว่าคุณอยู่ฝ่ายไหน';
            box.innerHTML += `<div class="row" style="margin-top:6px;border-top:1px solid var(--border);padding-top:6px"><b style="color:${sc.color}">🎯 เป้าหมาย</b><span>${esc(sc.goal)}</span></div>`;
            acts.innerHTML = '';
            showGo();
          };
        } else showGo();
      }, 420);
    });
    function showGo() {
      const go = $('confirm-start-btn');
      go.style.display = 'block';
      go.textContent = multi ? '✅ พร้อมแล้ว' : '⚔️ เข้าสู่ป่า';
      $('mn-actions').appendChild(go);
      go.onclick = () => {
        sfx('click');
        if (multi) {
          socket.emit('confirmJob', { roomCode: s.roomCode, playerName: name });
          go.disabled = true; go.textContent = '⏱️ รอเพื่อนคนอื่นเลือกอาชีพ...';
        } else {
          s.presetSide = side;
          initGame(name, job);
        }
      };
    }
  }

  // Swap the job roll for the card draw; game.js bound start-btn to the old function on DOMContentLoaded
  window.startCharacterSequence = drawSequence;
  function bind() {
    buildHome();
    buildSetup();
    const sb = $('start-btn'); if (sb) sb.onclick = drawSequence;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
  // selectGameMode shows the setup page
  const sel = window.selectGameMode;
  if (typeof sel === 'function') window.selectGameMode = function () { const r = sel.apply(this, arguments); buildSetup(); return r; };
})();
