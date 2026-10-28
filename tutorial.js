// ===================== TUTORIAL: FIRST-TURN COACH MARKS =====================
// Loaded after ui.js. Spotlights one element at a time on the player's first turn.
// Shown once (localStorage), reopened from the "❓ วิธีเล่น" button. Never changes game state,
// except holding the turn timer still while it is open.
(function () {
  'use strict';

  const STORE_KEY = 'lp_tutorial_done';
  let doneInMemory = false;
  function isDone() {
    try { return localStorage.getItem(STORE_KEY) === '1' || doneInMemory; } catch (e) { return doneInMemory; }
  }
  function markDone() {
    doneInMemory = true;
    try { localStorage.setItem(STORE_KEY, '1'); } catch (e) { /* private mode: remember for this page only */ }
  }

  function g() { try { return G; } catch (e) { return null; } }
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[tutorial] cannot hook', name); return; }
    window[name] = make(orig);
  }
  function myPanel() { return document.getElementById(`panel-p${Math.max(0, myIndex())}`); }

  // ---------- steps ----------
  const STEPS = [
    {
      target: () => myPanel(),
      title: '👤 นี่คือตัวคุณ',
      text: 'แผงนี้คือสถานะของคุณ: ❤️ HP, 🍖 ความหิว, 💧 ความกระหาย, ⚡ พลังงาน และ 🧠 ค่าสติ ทุกค่าจะลดลงทุกเทิร์น ถ้าหิวหรือกระหายจนเหลือ 0 จะเสีย HP — HP หมดคือตาย',
    },
    {
      target: () => myPanel() && myPanel().querySelector('.fill-time')?.closest('.stat-row'),
      title: '⏰ เวลา 24 ชม.',
      text: 'ทุกเทิร์นคุณมีเวลา 24 ชั่วโมง ทุกการกระทำใช้เวลา (ดูตัวเลขมุมขวาของปุ่ม) เวลาหมดเมื่อไรเทิร์นก็จบ',
    },
    {
      target: () => myPanel() && myPanel().querySelector('.skill-badge'),
      title: '🎭 อาชีพลับ',
      text: 'คุณได้อาชีพลับพร้อมสกิลพิเศษที่ใช้ได้ครั้งเดียว ผู้เล่นคนอื่นมองไม่เห็นของในกระเป๋าคุณ — และคุณก็มองไม่เห็นของพวกเขา อย่าไว้ใจใครง่ายๆ',
    },
    {
      target: () => document.getElementById('action-buttons'),
      title: '🎯 การกระทำ',
      text: 'กิน รักษาตัว พักผ่อน คราฟของ แบ่งของให้เพื่อน (เพิ่มความไว้วางใจ) หรือใช้สกิล อาชีพโจรและทหารยังโจมตีผู้เล่นอื่นได้ด้วย',
    },
    {
      target: () => document.getElementById('locations-row'),
      title: '🌿 สำรวจป่า',
      text: 'กด "🌿 สำรวจสถานที่" แล้วแตะการ์ดสถานที่เพื่อหาของ แต่ละที่ใช้เวลาและอันตรายไม่เท่ากัน การ์ด 🗺️ พิเศษคือเหตุการณ์ประจำวัน',
    },
    {
      target: () => document.getElementById('camp-box'),
      title: '⛺ ค่ายส่วนกลาง',
      text: 'กลับแคมป์เพื่อฝากของในคลังส่วนกลาง และใช้ "🛠️ จัดการแคมป์" สร้างกองไฟ กระท่อม หรือรั้ว ช่วยให้ทุกคนรอดง่ายขึ้น',
    },
    {
      target: () => document.getElementById('end-turn-btn'),
      title: '⏭️ จบเทิร์น',
      text: 'ทำเสร็จแล้วกดปุ่มนี้เพื่อส่งตาให้คนถัดไป ระวังนาฬิกาด้านบน — ถ้าหมดเวลา เทิร์นจะจบเอง',
    },
    {
      target: () => document.getElementById('day-badge'),
      title: '🚁 เป้าหมาย: รอด 7 วัน',
      text: 'เอาชีวิตรอดให้ครบ 7 วัน ในวันที่ 7 ใช้คบเพลิงหรือสัญญาณขอความช่วยเหลือเพื่อส่งสัญญาณกู้ภัย ขอให้โชคดี!',
    },
  ];

  // ---------- DOM ----------
  const root = document.createElement('div');
  root.id = 'tut-root';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'tut-title');
  root.innerHTML = `
    <div id="tut-blocker"></div>
    <div id="tut-spot"></div>
    <div id="tut-tip">
      <div id="tut-count"></div>
      <div id="tut-title"></div>
      <div id="tut-text"></div>
      <div id="tut-btns">
        <button type="button" id="tut-skip">ข้าม</button>
        <button type="button" id="tut-back">ย้อนกลับ</button>
        <button type="button" id="tut-next">ถัดไป</button>
      </div>
    </div>`;
  document.body.appendChild(root);
  const spot = root.querySelector('#tut-spot');
  const tip = root.querySelector('#tut-tip');
  const btnNext = root.querySelector('#tut-next');
  const btnBack = root.querySelector('#tut-back');
  root.querySelector('#tut-skip').onclick = () => close();
  btnBack.onclick = () => show(step - 1);
  btnNext.onclick = () => (step >= STEPS.length - 1 ? close() : show(step + 1));
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); btnNext.click(); }
    else if (e.key === 'ArrowLeft' && step > 0) { e.preventDefault(); show(step - 1); }
  });

  const helpBtn = document.createElement('button');
  helpBtn.type = 'button';
  helpBtn.id = 'tut-help-btn';
  helpBtn.title = 'เปิดวิธีเล่นอีกครั้ง';
  helpBtn.textContent = '❓ วิธีเล่น';
  helpBtn.onclick = () => start();
  const headerRight = document.getElementById('header-right');
  if (headerRight) headerRight.prepend(helpBtn);

  // ---------- turn timer hold ----------
  // The game's timer ticks once a second and ends the turn at 0. While the tutorial is open we keep
  // putting secondsLeft back, so it can drop by at most one tick and resumes where it was.
  let hold = null;
  function holdTimer() {
    const s = g();
    if (!s || hold) return;
    const frozen = Math.max(s.secondsLeft || 0, 60);
    s.secondsLeft = frozen;
    hold = setInterval(() => {
      s.secondsLeft = frozen;
      try { updateTimerUI(); } catch (e) { /* timer UI missing */ }
      const el = document.getElementById('turn-timer');
      if (el) el.classList.remove('warning');
    }, 200);
  }
  function releaseTimer() { clearInterval(hold); hold = null; }

  // ---------- open / position ----------
  let open = false, step = 0, target = null;

  function start() {
    if (open) return;
    open = true;
    root.classList.add('show');
    holdTimer();
    show(0);
  }

  function close() {
    if (!open) return;
    open = false;
    root.classList.remove('show');
    releaseTimer();
    markDone();
    target = null;
  }

  function show(i) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    const s = STEPS[step];
    let el = null;
    try { el = s.target(); } catch (e) { el = null; }
    target = el && el.getClientRects().length ? el : null;
    root.querySelector('#tut-count').textContent = `${step + 1} / ${STEPS.length}`;
    root.querySelector('#tut-title').textContent = s.title;
    root.querySelector('#tut-text').textContent = s.text;
    btnBack.style.visibility = step > 0 ? 'visible' : 'hidden';
    btnNext.textContent = step === STEPS.length - 1 ? 'เริ่มเล่น!' : 'ถัดไป';
    tip.classList.remove('pop'); void tip.offsetWidth; tip.classList.add('pop');
    reveal();
    layout();
    // scrolling may be smooth, and the game may still be laying out: settle again shortly after
    const shown = step;
    setTimeout(() => { if (open && step === shown) { reveal(true); layout(); } }, 400);
    btnNext.focus({ preventScroll: true });
  }

  function reveal(onlyIfHidden) {
    if (!target) return;
    const r = target.getBoundingClientRect(), vh = window.innerHeight;
    if (onlyIfHidden && r.top >= 0 && r.bottom <= vh) return;
    if (onlyIfHidden && r.height > vh && r.top <= 0 && r.bottom >= vh * 0.5) return;
    target.scrollIntoView({ block: r.height > vh ? 'start' : 'center', inline: 'nearest' });
  }

  function layout() {
    if (!open) return;
    const vw = window.innerWidth, vh = window.innerHeight, pad = 6, gap = 12, margin = 12;
    const tw = Math.min(340, vw - margin * 2);
    tip.style.width = tw + 'px';
    const th = tip.offsetHeight;

    if (!target) {
      spot.style.display = 'none';
      tip.style.left = (vw - tw) / 2 + 'px';
      tip.style.top = Math.max(margin, (vh - th) / 2) + 'px';
      return;
    }
    const r = target.getBoundingClientRect();
    // clamp the hole to the viewport so huge targets still look sensible
    const top = Math.max(4, r.top - pad), bottom = Math.min(vh - 4, r.bottom + pad);
    const left = Math.max(4, r.left - pad), right = Math.min(vw - 4, r.right + pad);
    spot.style.display = 'block';
    spot.style.left = left + 'px';
    spot.style.top = top + 'px';
    spot.style.width = Math.max(0, right - left) + 'px';
    spot.style.height = Math.max(0, bottom - top) + 'px';

    let tx = Math.min(Math.max(margin, (left + right) / 2 - tw / 2), vw - tw - margin);
    let ty;
    const below = vh - bottom - gap - margin, above = top - gap - margin;
    if (below >= th) ty = bottom + gap;
    else if (above >= th) ty = top - gap - th;
    else {
      // no room above or below: sit beside it on wide screens, else over the bottom of the screen
      const rightRoom = vw - right - gap - margin, leftRoom = left - gap - margin;
      if (rightRoom >= tw) { tx = right + gap; ty = Math.min(Math.max(margin, top), vh - th - margin); }
      else if (leftRoom >= tw) { tx = left - gap - tw; ty = Math.min(Math.max(margin, top), vh - th - margin); }
      else ty = vh - th - margin;
    }
    tip.style.left = tx + 'px';
    tip.style.top = Math.max(margin, ty) + 'px';
  }
  window.addEventListener('resize', () => { if (open) layout(); });
  window.addEventListener('scroll', () => { if (open) layout(); }, true);

  // ---------- first turn trigger ----------
  // startTurnTimer only runs when the turn belongs to this browser's player.
  let pending = false;
  wrap('startTurnTimer', orig => function () {
    const res = orig.apply(this, arguments);
    try {
      const s = g(), me = myIndex(), p = s && s.players && s.players[me];
      if (!pending && !open && !isDone() && p && !p.isBot && s.currentPlayer === me) {
        pending = true;
        waitThenStart(Date.now());
      }
    } catch (e) { /* tutorial is optional */ }
    return res;
  });
  function blockingOverlayOpen() {
    const cut = document.getElementById('fx-cutscene');
    if (cut && cut.classList.contains('show')) return true;
    return ['combat-overlay', 'pvp-overlay', 'share-overlay', 'map-confirm-overlay', 'end-screen'].some(id => {
      const el = document.getElementById(id);
      return el && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
    });
  }
  function waitThenStart(t0) {
    // let the turn banner (1.6s) finish first, then wait out cutscenes and popups
    setTimeout(function check() {
      const s = g(), me = myIndex();
      if (!s || s.currentPlayer !== me || isDone()) { pending = false; return; }
      if (blockingOverlayOpen() && Date.now() - t0 < 20000) return setTimeout(check, 400);
      pending = false;
      start();
    }, 1700);
  }

  window.Tutorial = { start, close, reset: () => { doneInMemory = false; try { localStorage.removeItem(STORE_KEY); } catch (e) {} } };
})();
