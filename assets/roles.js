// ===================== ROLES: HIDDEN GOOD / NEUTRAL / EVIL SIDES =====================
// Rules agreed with the owner:
// - every game has exactly 1 evil; a neutral appears 35% of the time; the rest are good
// - sides are hidden; each player only knows their own (the spy can look at one person a day)
// - evil acts secretly at night and leaves clues; from day 3 the team can vote someone out each morning
// - evil dead or exiled → evil loses, but the game goes on
// - good wins: rescue, or survive 7 days with 2+ good alive
// - evil wins: rescue fails AND fewer than half of the starting good survive
// - neutral wins by its own goal (can win alongside either side)
// State lives in G.rescueData.roles so the autosave keeps it.
(function () {
  'use strict';

  const NEUTRAL_CHANCE = 0.35;
  const VOTE_FROM_DAY = 3;

  const SIDES = {
    good:    { icon:'🟢', name:'คนดี',  color:'#7ae07a', goal:'กู้ภัยให้สำเร็จ หรือรอดครบ 7 วันโดยคนดีเหลือ 2 คนขึ้นไป · ระวังคนเลวในทีม!' },
    neutral: { icon:'⚪', name:'คนกลาง', color:'#d8d8e8', goal:'' },
    evil:    { icon:'🔴', name:'คนเลว', color:'#ff6a6a', goal:'ทำให้กู้ภัยล้มเหลว และคนดีรอดไม่ถึงครึ่ง · ตอนกลางคืนทำภารกิจลับได้ · อย่าให้ถูกจับได้!' },
  };
  const NEUTRALS = {
    survivor: { icon:'🧳', name:'ผู้เอาตัวรอด', goal:'มีชีวิตรอดจนจบเกม ไม่ว่าฝ่ายไหนจะชนะ' },
    treasure: { icon:'💰', name:'นักล่าสมบัติ', goal:'มีของมีค่า 3 ชิ้นในกระเป๋าตอนจบเกม (ทองคำ พลอย ฟอสซิล มุก ขนนกอินทรี…)' },
    jester:   { icon:'🎭', name:'ตัวป่วน', goal:'ทำตัวน่าสงสัยจนถูกทีมโหวตไล่ออกจากแคมป์' },
  };

  function g() { try { return G; } catch (e) { return null; } }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  function myIndex() { try { return getMyPlayerIndex(); } catch (e) { return 0; } }
  function isMulti() { const s = g(); return !!(s && s.mode === 'multi'); }
  function sfx(n) { if (window.FX) FX.sfx(n); }
  function wrap(name, make) {
    const orig = window[name];
    if (typeof orig !== 'function') { console.warn('[roles] cannot hook', name); return; }
    window[name] = make(orig);
  }
  function rs() {
    const s = g();
    if (!s.rescueData) s.rescueData = { attempts: [], lastChance: 0, success: false };
    if (!s.rescueData.roles) s.rescueData.roles = { assigned: false, clues: [], suspicion: {}, log: [], startGood: 0, voteDay: 0, votes: [], frame: null, evilOut: false, revealed: false };
    return s.rescueData.roles;
  }
  const alive = () => g().players.map((p, i) => ({ p, i })).filter(x => x.p.alive);
  const evilIdx = () => g().players.findIndex(p => p.side === 'evil');

  window.sideLabel = side => SIDES[side] ? `${SIDES[side].icon} ${SIDES[side].name}` : 'ไม่ทราบ';
  function goalOf(p) { return p.side === 'neutral' ? NEUTRALS[p.neutralType].goal : SIDES[p.side].goal; }
  function roleTitle(p) { return p.side === 'neutral' ? `⚪ คนกลาง — ${NEUTRALS[p.neutralType].icon} ${NEUTRALS[p.neutralType].name}` : sideLabel(p.side); }

  // ---------- styles ----------
  const style = document.createElement('style');
  style.textContent = `
  .rl-badge{margin:-2px 0 6px;padding:5px 8px;border-radius:8px;font-size:10px;font-weight:700;line-height:1.5;border:1px solid}
  .rl-badge b{font-size:11px}
  #rl-clue-box .rl-clue{font-size:11px;line-height:1.5;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid var(--border);margin-bottom:5px}
  #rl-clue-box .rl-clue.strong{border-color:rgba(255,106,106,.5);background:rgba(216,72,72,.08)}
  .rl-reveal{margin:8px 0 14px;padding:12px 16px;border-radius:12px;border:1px solid var(--border2);background:rgba(16,22,18,.85);width:min(92%,580px)}
  .rl-reveal h3{font-size:15px;color:var(--amber2);margin-bottom:8px;text-align:center}
  .rl-row{display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid var(--border);font-size:12px}
  .rl-row:last-child{border-bottom:none}
  .rl-row .rl-res{margin-left:auto;font-weight:800}
  .rl-banner{font-size:22px;font-weight:900;text-align:center;margin:6px 0 4px}
  .rl-log{font-size:11px;color:var(--text3);line-height:1.6;margin-top:8px}
  `;
  document.head.appendChild(style);

  // ---------- assignment ----------
  function ensureRoles() {
    const s = g();
    if (!s || !s.players || !s.players.length) return;
    const r = rs();
    if (r.assigned) return;
    if (isMulti() && !s.isHost) return; // the host decides and syncs
    const idx = s.players.map((_, i) => i).sort(() => Math.random() - 0.5);
    const evil = idx.shift();
    s.players.forEach(p => { p.side = 'good'; delete p.neutralType; });
    s.players[evil].side = 'evil';
    if (idx.length >= 3 && Math.random() < NEUTRAL_CHANCE) {
      const n = idx.shift();
      s.players[n].side = 'neutral';
      s.players[n].neutralType = pick(Object.keys(NEUTRALS));
    }
    r.assigned = true;
    r.startGood = s.players.filter(p => p.side === 'good').length;
    s.players.forEach((p, i) => { r.suspicion[i] = 0; });
    renderAllPanels();
  }

  // Show the local player their secret side once
  function revealOwnRole() {
    const s = g(), r = rs(), mi = myIndex(), me = s.players[mi];
    if (!me || !me.side || r.revealed) return;
    r.revealed = true;
    const sd = SIDES[me.side];
    const extra = me.side === 'evil'
      ? '\n\n🌙 ทุกคืนคุณเลือกทำภารกิจลับได้: ขโมยของในคลัง · วางยา · ทำลายสิ่งปลูกสร้าง · ใส่ร้ายคนอื่น\n🧪 สูตรคราฟลับของคนเลวจะโผล่ในโต๊ะช่าง\n⚠️ ทุกการกระทำอาจทิ้งเบาะแส — คนเฝ้ายามอาจเห็นคุณ'
      : me.side === 'good'
        ? `\n\n🕵️ ทีมนี้มีคนเลว 1 คนแฝงอยู่${s.players.length >= 4 ? ' (อาจมีคนกลางด้วย)' : ''}\n📜 เก็บเบาะแสจากรายงานกลางคืน แล้วโหวตไล่ได้ตั้งแต่เช้าวันที่ ${VOTE_FROM_DAY}`
        : `\n\n🎯 คุณไม่ได้อยู่ฝ่ายไหน — ชนะได้ด้วยเป้าหมายของตัวเองเท่านั้น`;
    // give the tutorial (which opens on the first turn) a moment, then wait for it to close
    setTimeout(() => GP.whenClear(() => {
      GP.openModal({
        icon: '🎴', title: `บทบาทลับของคุณ: ${roleTitle(me)}`,
        text: `เป้าหมาย: ${goalOf(me)}${extra}\n\nห้ามบอกใคร — คนอื่นไม่รู้ว่าคุณอยู่ฝ่ายไหน`,
        choices: [{ icon: '🤫', label: 'เข้าใจแล้ว', onPick: () => GP.closeModal() }],
      });
      sfx(me.side === 'evil' ? 'night' : 'turn');
    }), 900);
  }

  // ---------- evil night actions ----------
  function evilPlayer() { const i = evilIdx(); return i > -1 ? g().players[i] : null; }
  function evilActive() { const e = evilPlayer(); return !!(e && e.alive && !rs().evilOut); }
  function localEvil() {
    const s = g(), e = evilIdx();
    return evilActive() && !isMulti() && e === myIndex() && !s.players[e].isBot;
  }
  function evilOptions(guardPi) {
    const s = g(), e = evilIdx(), me = s.players[e];
    const others = alive().filter(x => x.i !== e);
    const sts = s.camp.structures;
    const breakable = sts.filter(id => id !== 'fortified');
    const poison = me.inventory.includes('ยาพิษไร้กลิ่น') ? 'ยาพิษไร้กลิ่น' : me.inventory.includes('ยาพิษ') ? 'ยาพิษ' : null;
    const foodTargets = others.filter(x => x.p.inventory.some(isFood));
    const opts = [
      { id:'steal', icon:'🎒', label:'แอบขโมยของจากคลังแคมป์', hint: sts.includes('lock') ? 'มีกุญแจคลัง: สำเร็จยาก' : `ในคลังมี ${s.camp.sharedItems.length} ชิ้น`, disabled: !s.camp.sharedItems.length || sts.includes('fortified') },
      { id:'sabotage', icon:'🪓', label:'ทำลายสิ่งปลูกสร้าง', hint: breakable.length ? 'ทำลาย 1 อย่าง (เลือกที่สำคัญที่สุด)' : 'ยังไม่มีอะไรให้ทำลาย', disabled: !breakable.length || sts.includes('fortified') },
      ...(poison ? foodTargets.map(x => ({ id:'poison:' + x.i, icon:'🧪', label:`วางยาอาหารของ ${x.p.name}`, hint: poison === 'ยาพิษไร้กลิ่น' ? 'ยาพิษไร้กลิ่น: แทบไม่ทิ้งเบาะแส' : 'ใช้ยาพิษ 1 ขวด' })) : []),
      ...(me.inventory.includes('กับดักแคมป์') && guardPi !== null && guardPi !== e ? [{ id:'trap', icon:'🕸️', label:'วางกับดักให้คนเฝ้ายาม', hint:'คนเฝ้ายามบาดเจ็บ' }] : []),
      ...others.map(x => ({ id:'frame:' + x.i, icon:'🎭', label:`ใส่ร้าย ${x.p.name}`, hint:'ทิ้งหลักฐานปลอม ทำให้ทีมสงสัยเขา' })),
      { id:'none', icon:'😴', label:'อยู่เฉยๆ คืนนี้', hint:'ไม่ทิ้งเบาะแสใดๆ' },
    ];
    return opts;
  }
  function evilPrompt(guardPi) {
    const s = g();
    const guard = guardPi === null ? 'ไม่มีใครเฝ้ายาม — โอกาสดี!' : guardPi === evilIdx() ? 'คุณเป็นคนเฝ้ายามเอง — ไม่มีใครเห็นคุณ แต่ถ้าของหาย คนจะสงสัยคุณ' : `${s.players[guardPi].name} เฝ้ายามอยู่ — อาจเห็นคุณ`;
    return `ทุกคนหลับแล้ว… ${guard}${s.camp.structures.includes('bell') ? '\n🔔 มีระฆังเตือนภัย: ถูกจับได้ง่ายขึ้น' : ''}`;
  }
  function botEvilChoice(guardPi) {
    if (!evilActive() || localEvil()) return null;
    const s = g(), e = evilIdx();
    if (s.players[e].isBot === false && isMulti()) return null; // a real evil player in multiplayer: no secret UI yet
    const opts = evilOptions(guardPi).filter(o => !o.disabled);
    // lie low while suspicion is high; otherwise prefer real damage on later days
    if ((rs().suspicion[e] || 0) >= 4 && Math.random() < 0.6) return 'none';
    const harm = opts.filter(o => /^(steal|sabotage|poison|trap)/.test(o.id));
    if (harm.length && Math.random() < (s.day >= 4 ? 0.75 : 0.5)) return pick(harm).id;
    const frames = opts.filter(o => o.id.startsWith('frame:'));
    return frames.length && Math.random() < 0.6 ? pick(frames).id : 'none';
  }

  // Add a clue pointing at a suspect (index), with a weight for bot suspicion
  function addClue(text, suspect, weight, strong) {
    const r = rs();
    r.clues.push({ day: g().day, text, suspect, weight, strong: !!strong });
    if (suspect !== null && suspect !== undefined) {
      r.suspicion[suspect] = (r.suspicion[suspect] || 0) + weight;
      const p = g().players[suspect];
      if (p) p.trust = cl((p.trust || 50) - weight * 3, 0, 100);
    }
  }
  // Who a clue points to: the framed target if any, otherwise mostly the evil player
  function clueTarget(accuracy) {
    const r = rs(), e = evilIdx();
    if (r.frame !== null && r.frame !== undefined && g().players[r.frame] && g().players[r.frame].alive) return r.frame;
    if (Math.random() < accuracy) return e;
    const others = alive().filter(x => x.i !== e);
    return others.length ? pick(others).i : e;
  }

  function resolveNight(guardPi, choice) {
    const out = { lines: [], tone: 'neutral' };
    if (!evilActive() || !choice || choice === 'none') { rs().frame = null; return out; }
    const s = g(), r = rs(), e = evilIdx(), evil = s.players[e];
    const sts = s.camp.structures;
    const guard = guardPi === null ? null : s.players[guardPi];
    const nameOf = i => s.players[i].name;
    let clueChance = 0.6, accuracy = 0.55;
    const what = [];

    if (choice.startsWith('frame:')) {
      const t = +choice.split(':')[1];
      r.frame = t;
      r.log.push({ day: s.day, act: `ใส่ร้าย ${nameOf(t)}` });
      addClue(`🎭 มีคนเห็น ${nameOf(t)} เดินวนเวียนรอบคลังแคมป์ตอนดึก ท่าทางมีพิรุธ`, t, 2);
      out.lines.push(`🌫️ ตอนดึกมีเสียงฝีเท้าแปลกๆ ในแคมป์…`);
      return out;
    }
    if (choice === 'steal') {
      if (sts.includes('lock') && Math.random() < 0.7) {
        out.lines.push('🔐 มีคนพยายามงัดคลังแคมป์ แต่กุญแจคลังกันไว้ได้!');
        what.push('งัดคลัง (ไม่สำเร็จ)');
        clueChance = 0.8;
      } else {
        const n = Math.min(2, s.camp.sharedItems.length);
        const taken = [];
        for (let k = 0; k < n; k++) {
          const vi = s.camp.sharedItems.findIndex(isValuable);
          const idx = vi > -1 ? vi : Math.floor(Math.random() * s.camp.sharedItems.length);
          taken.push(s.camp.sharedItems.splice(idx, 1)[0]);
        }
        // the evil player keeps what fits in the bag and stashes the rest
        taken.forEach(it => { if (evil.inventory.length < getInventoryLimit(evil)) evil.inventory.push(it); });
        out.lines.push(`🎒 ตื่นเช้ามา ของในคลังแคมป์หายไป ${taken.length} ชิ้น: ${taken.join(', ')}`);
        out.tone = 'bad';
        what.push(`ขโมย ${taken.join(', ')}`);
      }
    } else if (choice === 'sabotage') {
      const order = ['tower', 'watertank', 'purifier', 'workbench', 'clinic', 'hut', 'garden', 'smoker', 'fence', 'campfire'];
      const target = order.find(id => sts.includes(id)) || sts.find(id => id !== 'fortified');
      if (target) {
        s.camp.structures.splice(s.camp.structures.indexOf(target), 1);
        if (typeof updateCampLevel === 'function') updateCampLevel();
        const st = CAMP_STRUCTURES.find(x => x.id === target);
        out.lines.push(`🪓 เช้านี้พบว่า ${st.emoji} ${st.name} ถูกทำลายพังยับ! มีคนตั้งใจทำ`);
        out.tone = 'bad';
        what.push(`ทำลาย${st.name}`);
        clueChance = 0.75;
      }
    } else if (choice.startsWith('poison:')) {
      const t = +choice.split(':')[1], victim = s.players[t];
      const pi = evil.inventory.indexOf('ยาพิษไร้กลิ่น') > -1 ? evil.inventory.indexOf('ยาพิษไร้กลิ่น') : evil.inventory.indexOf('ยาพิษ');
      const scentless = evil.inventory[pi] === 'ยาพิษไร้กลิ่น';
      const fi = victim.inventory.findIndex(isFood);
      if (pi > -1 && fi > -1) {
        evil.inventory.splice(pi, 1);
        victim.inventory[victim.inventory.indexOf(victim.inventory[fi])] = 'อาหารอาบยาพิษ';
        what.push(`วางยาอาหารของ ${victim.name}`);
        clueChance = scentless ? 0.15 : 0.55;
        out.lines.push('🌫️ กลางดึกมีกลิ่นแปลกๆ ลอยมาจากที่เก็บอาหาร…');
      }
    } else if (choice === 'trap' && guard) {
      const ti = evil.inventory.indexOf('กับดักแคมป์');
      if (ti > -1) {
        evil.inventory.splice(ti, 1);
        guard.hp = cl(guard.hp - 15, 0, 100);
        guard.statuses = addStatus(guard.statuses, 'injured');
        out.lines.push(`🕸️ ${guard.name} เหยียบกับดักที่ซ่อนอยู่ระหว่างเฝ้ายาม! (HP -15)`);
        out.tone = 'bad';
        what.push(`วางกับดักทำร้าย ${guard.name}`);
        clueChance = 0.7;
      }
    }
    if (!what.length) { r.frame = null; return out; }
    r.log.push({ day: s.day, act: what.join(', ') });

    // Was the evil player seen?
    if (guard && guardPi !== e) {
      const see = 0.3 + (sts.includes('bell') ? 0.3 : 0) + (guard.job && guard.job.id === 'soldier' ? 0.1 : 0);
      if (Math.random() < see) {
        const who = clueTarget(0.85);
        addClue(`👁️ ${guard.name} ที่เฝ้ายามเห็นเงาคนแอบทำ${what[0].split(' ')[0]}… รูปร่างคล้าย ${nameOf(who)}${sts.includes('bell') ? ' (ระฆังเตือนภัยดังขึ้นทัน!)' : ''}`, who, 4, true);
        out.lines.push(`🔔 ${guard.name} เห็นผู้บุกรุกในความมืด!`);
        r.frame = null;
        return out;
      }
    }
    if (guard && guardPi === e) {
      addClue(`🤔 เรื่องเกิดขึ้นตอนที่ ${nameOf(e)} เฝ้ายามอยู่แท้ๆ แต่เขาบอกว่าไม่เห็นอะไรเลย`, e, 2);
    } else if (Math.random() < clueChance) {
      const who = clueTarget(accuracy);
      const tpl = pick([
        `👣 พบรอยเท้าเปื้อนโคลนใกล้จุดเกิดเหตุ ขนาดใกล้เคียงกับรองเท้าของ ${nameOf(who)}`,
        `🧵 พบเศษผ้าติดกิ่งไม้ สีเดียวกับเสื้อของ ${nameOf(who)}`,
        `🔦 มีคนจำได้ว่าได้ยินเสียง ${nameOf(who)} ลุกออกไปข้างนอกตอนดึก`,
      ]);
      addClue(tpl, who, 2);
    }
    r.frame = null;
    return out;
  }

  // ---------- morning vote ----------
  function suspicionScores(voter) {
    const s = g(), r = rs(), me = s.players[voter];
    const scores = {};
    alive().forEach(({ p, i }) => {
      if (i === voter) return;
      let sc = (r.suspicion[i] || 0) + (50 - (p.trust || 50)) / 15;
      if (me.spyNotes && me.spyNotes[i] === 'evil') sc += 100;
      if (me.spyNotes && me.spyNotes[i] && me.spyNotes[i] !== 'evil') sc -= 5;
      scores[i] = sc;
    });
    return scores;
  }
  function botVote(voter) {
    const s = g(), me = s.players[voter];
    const scores = suspicionScores(voter);
    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (!ranked.length) return null;
    if (me.side === 'evil') {
      // deflect: push the most suspected non-evil if anyone is suspected at all
      const top = ranked.find(([i]) => +i !== voter);
      return top && top[1] >= 2 ? +top[0] : null;
    }
    if (me.side === 'neutral' && me.neutralType === 'jester') return Math.random() < 0.5 ? +ranked[0][0] : null;
    return ranked[0][1] >= 4 ? +ranked[0][0] : null;
  }
  function tally(votes) {
    const s = g(), counts = {};
    votes.forEach(v => { if (v.target !== null) counts[v.target] = (counts[v.target] || 0) + 1; });
    const need = Math.floor(alive().length / 2) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top && top[1] >= need ? +top[0] : null;
  }
  function exile(i) {
    const s = g(), p = s.players[i], r = rs();
    p.alive = false; p.exiled = true; p.stats.dayDied = s.day;
    document.getElementById(`panel-p${i}`)?.classList.add('dead');
    if (p.side === 'evil') r.evilOut = true;
    if (p.side === 'neutral' && p.neutralType === 'jester') r.jesterWon = true;
    addMsg(`🚪 ${p.name} ถูกทีมโหวตขับออกจากแคมป์! (ฝ่ายของเขาจะเปิดเผยตอนจบเกม)`, 'bubble-event-bad');
    renderAllPanels();
  }
  function voteSummary(votes, out) {
    const s = g();
    const lines = votes.map(v => `${s.players[v.voter].emoji} ${s.players[v.voter].name} → ${v.target === null ? 'งดออกเสียง' : s.players[v.target].name}`);
    lines.push(out === null ? '\nผลโหวต: ไม่มีใครได้เสียงข้างมาก — ไม่มีใครถูกไล่' : `\nผลโหวต: ${s.players[out].name} ถูกขับออกจากแคมป์`);
    return lines.join('\n');
  }
  function runVote(done) {
    const s = g(), r = rs();
    r.voteDay = s.day;
    const mi = myIndex(), me = s.players[mi];
    const humanVotes = !isMulti() && me && me.alive && !me.isBot;
    const finish = humanTarget => {
      const votes = alive().map(({ i }) => ({ voter: i, target: (humanVotes && i === mi) ? humanTarget : botVote(i) }));
      const out = tally(votes);
      r.votes.push({ day: s.day, votes, out });
      const text = voteSummary(votes, out);
      addMsg(`🗳️ โหวตเช้าวันที่ ${s.day}\n${text}`, out === null ? 'bubble-system' : 'bubble-event-bad');
      if (out !== null) exile(out);
      if (humanVotes) GP.showResult(text, out === null ? 'neutral' : 'bad', done, 'เริ่มวันใหม่ ☀️');
      else done();
    };
    if (!humanVotes) return finish(null);
    const recent = r.clues.slice(-4).map(c => `• วันที่ ${c.day}: ${c.text}`).join('\n') || '• ยังไม่มีเบาะแส';
    GP.whenClear(() => GP.openModal({
      icon: '🗳️', title: `เช้าวันที่ ${s.day} — โหวตขับไล่ผู้ต้องสงสัย`,
      text: `เบาะแสล่าสุด:\n${recent}\n\nต้องได้เสียงข้างมาก (${Math.floor(alive().length / 2) + 1} เสียง) ถึงจะไล่ได้ · ไล่ผิดคน = ทีมเสียกำลังคน`,
      choices: [
        ...alive().filter(x => x.i !== mi).map(x => ({ icon: x.p.emoji, label: `โหวตไล่ ${x.p.name}`, hint: `${x.p.job.emoji} ${x.p.job.name} · ความไว้วางใจ ${x.p.trust}%`, onPick: () => finish(x.i) })),
        { icon: '🤐', label: 'งดออกเสียง', hint: 'ยังไม่แน่ใจ', onPick: () => finish(null) },
      ],
    }));
  }

  // ---------- results ----------
  function results(survived) {
    const s = g(), r = rs();
    const goodAlive = s.players.filter(p => p.side === 'good' && p.alive).length;
    const rescued = !!s.rescueData.success;
    const goodWin = rescued || (survived && goodAlive >= 2);
    const evil = evilPlayer();
    const evilWin = !!evil && evil.alive && !r.evilOut && !rescued && goodAlive < (r.startGood || 1) / 2;
    return s.players.map(p => {
      let win = false;
      if (p.side === 'good') win = goodWin;
      else if (p.side === 'evil') win = evilWin;
      else if (p.neutralType === 'survivor') win = p.alive;
      else if (p.neutralType === 'treasure') win = p.inventory.filter(isValuable).length >= 3;
      else if (p.neutralType === 'jester') win = !!r.jesterWon;
      return { p, win };
    });
  }

  // ---------- UI: own badge, clue box, end reveal ----------
  wrap('renderPanel', orig => function (i) {
    const res = orig.apply(this, arguments);
    try {
      const s = g(), p = s.players[i];
      const showSide = p && p.side && (i === myIndex() || !s.players.some(x => x.alive && !x.isBot)) ;
      const el = document.getElementById('panel-p' + i);
      if (el && p && p.side && i === myIndex()) {
        const sd = SIDES[p.side];
        const b = document.createElement('div');
        b.className = 'rl-badge';
        b.style.borderColor = sd.color; b.style.color = sd.color; b.style.background = sd.color + '14';
        b.innerHTML = `<b>บทบาทลับ: ${roleTitle(p)}</b><br>${goalOf(p)}`;
        el.insertBefore(b, el.children[1] || null);
      }
      if (el && p && p.exiled) {
        const tag = el.querySelector('.tag-dead');
        if (tag) tag.textContent = '🚪 ถูกขับไล่';
      }
      void showSide;
    } catch (e) { /* visuals only */ }
    return res;
  });

  function renderClues() {
    const s = g(); if (!s || !s.players || !s.players.length) return;
    const r = rs();
    let box = document.getElementById('rl-clue-box');
    if (!box) {
      const panel = document.getElementById('world-panel'); if (!panel) return;
      box = document.createElement('div');
      box.className = 'side-box'; box.id = 'rl-clue-box';
      const quest = document.getElementById('gp-quest-box');
      panel.insertBefore(box, quest ? quest.nextSibling : panel.firstChild);
    }
    const susp = alive().map(x => ({ x, v: r.suspicion[x.i] || 0 })).filter(o => o.v > 0).sort((a, b) => b.v - a.v);
    box.innerHTML = '<div class="side-title">📜 เบาะแส & ผู้ต้องสงสัย</div>' +
      (r.clues.length ? r.clues.slice(-5).reverse().map(c => `<div class="rl-clue${c.strong ? ' strong' : ''}">วันที่ ${c.day}: ${c.text}</div>`).join('') : '<div class="rl-clue">ยังไม่มีเบาะแส — คนเลวยังไม่ลงมือ หรือยังไม่ถูกจับได้</div>') +
      (susp.length ? `<div style="font-size:10px;color:var(--text3);margin-top:4px">ถูกสงสัยมากสุด: ${susp.slice(0, 3).map(o => `${o.x.p.emoji} ${o.x.p.name} (${o.v})`).join(' · ')}</div>` : '') +
      `<div style="font-size:10px;color:var(--text3);margin-top:4px">${s.day < VOTE_FROM_DAY ? `🗳️ โหวตไล่ได้ตั้งแต่เช้าวันที่ ${VOTE_FROM_DAY}` : '🗳️ โหวตทุกเช้า'}</div>`;
  }
  wrap('renderAllPanels', orig => function () {
    const res = orig.apply(this, arguments);
    try { renderClues(); } catch (e) { /* visuals only */ }
    return res;
  });

  // Assign sides, reveal the local player's, and run the morning vote at the start of each day
  wrap('startTurn', orig => function (pi) {
    const self = this, args = arguments;
    const s = g();
    try {
      ensureRoles();
      if (rs().assigned && !rs().revealed) revealOwnRole();
    } catch (e) { console.warn('[roles] assign', e); }
    const firstOfDay = s.dayDone && s.dayDone.every(d => !d) && pi === s.players.findIndex(p => p.alive);
    if (!isMulti() && firstOfDay && s.day >= VOTE_FROM_DAY && rs().voteDay !== s.day && alive().length >= 3) {
      runVote(() => {
        if (!alive().length) { gameEnd(false); return; }
        const next = s.players[pi].alive ? pi : s.players.findIndex(p => p.alive);
        s.currentPlayer = next;
        orig.call(self, next);
      });
      return;
    }
    return orig.apply(self, args);
  });

  wrap('gameEnd', orig => function (survived) {
    const res = orig.apply(this, arguments);
    const list = results(survived);
    const t = setInterval(() => {
      const scr = document.getElementById('end-screen');
      if (!scr || getComputedStyle(scr).display === 'none') return;
      clearInterval(t);
      document.getElementById('rl-reveal')?.remove();
      const s = g(), r = rs(), mi = myIndex(), mine = list[mi];
      const box = document.createElement('div');
      box.id = 'rl-reveal'; box.className = 'rl-reveal';
      const banner = mine ? `<div class="rl-banner" style="color:${mine.win ? '#9be8a8' : '#ff8a8a'}">${mine.win ? '🏆 คุณชนะ!' : '💀 คุณแพ้'}</div><div style="text-align:center;font-size:11px;color:var(--text3)">บทบาทลับของคุณ: ${roleTitle(mine.p)}</div>` : '';
      const rows = list.map(({ p, win }) => `<div class="rl-row"><span style="font-size:16px">${p.emoji}</span><b>${p.name}</b><span style="color:var(--text3)">${p.job.emoji} ${p.job.name}</span><span>${roleTitle(p)}</span>${p.exiled ? '<span style="color:var(--text3)">🚪ถูกไล่</span>' : ''}<span class="rl-res" style="color:${win ? '#9be8a8' : '#ff8a8a'}">${win ? '✅ ชนะ' : '❌ แพ้'}</span></div>`).join('');
      const log = r.log.length ? '<div class="rl-log"><b>🌙 สิ่งที่คนเลวทำตอนกลางคืน:</b><br>' + r.log.map(l => `คืนที่ ${l.day}: ${l.act}`).join('<br>') + '</div>' : '<div class="rl-log">🌙 คนเลวไม่ได้ลงมือเลยสักคืน</div>';
      box.innerHTML = `<h3>⚖️ เฉลยบทบาทลับ</h3>${banner}${rows}${log}`;
      const anchor = document.getElementById('gp-ending') || document.getElementById('end-msg');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling);
      sfx(mine && mine.win ? 'victory' : 'defeat');
    }, 300);
    setTimeout(() => clearInterval(t), 30000);
    return res;
  });

  window.ROLES = { localEvil, evilOptions, evilPrompt, botEvilChoice, resolveNight, results, SIDES, NEUTRALS, _ensure: ensureRoles, _vote: runVote };
})();
