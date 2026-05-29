// ===================== DATA =====================
const JOBS = [
  { id:'hunter',    name:'นักล่า',      emoji:'🏹', skill:'ล่าสัตว์ได้ทันที (ใช้ได้ 1 ครั้ง/เกม)',     skDesc:'ล่าสัตว์' },
  { id:'doctor',    name:'หมอ',         emoji:'🩺', skill:'รักษาทุกคนในกลุ่ม HP +50 (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'รักษากลุ่ม' },
  { id:'thief',     name:'โจร',         emoji:'🗡️', skill:'ขโมยไอเทม 2 ชิ้นจากใครก็ได้ (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'ขโมยคู่' },
  { id:'chef',      name:'พ่อครัว',     emoji:'🍳', skill:'เสกอาหารอุ่น 3 กล่องให้กลุ่ม (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'เสกอาหาร' },
  { id:'scout',     name:'ลูกเสือ',     emoji:'🧭', skill:'เปิดเผย Loot ของทุกที่ในวันนี้ (ใช้ได้ 1 ครั้ง/เกม)',              skDesc:'สแกนพื้นที่' },
  { id:'soldier',   name:'ทหาร',        emoji:'⚔️', skill:'กำจัดสัตว์ป่าในพื้นที่ปัจจุบันทันที (ใช้ได้ 1 ครั้ง/เกม)',  skDesc:'ปราบบอส' },
  { id:'shaman',    name:'หมอผี',       emoji:'🪄', skill:'พยากรณ์อากาศและเหตุการณ์ 3 วันข้างหน้า (ใช้ได้ 1 ครั้ง/เกม)',   skDesc:'หยั่งรู้' },
  { id:'engineer',  name:'วิศวกร',      emoji:'🔧', skill:'สร้างสิ่งปลูกสร้างแคมป์ 1 อย่างฟรี (ใช้ได้ 1 ครั้ง/เกม)',    skDesc:'สร้างฟรี' },
  { id:'merchant',  name:'พ่อค้า',      emoji:'💰', skill:'แลกไอเทมในตัวกับคลังแคมป์ได้ 3 ชิ้น (ใช้ได้ 1 ครั้ง/เกม)',    skDesc:'เทรดด่วน' },
  { id:'spy',       name:'สายลับ',      emoji:'🕵️', skill:'ดูบทบาทและของทุกคน (ใช้ได้ 1 ครั้ง/เกม)',       skDesc:'เปิดเผยความลับ' },
];

const LOCATIONS = [
  { id:'cave',     name:'ถ้ำมืด',        emoji:'🪨', time:6,  danger:0.4, desc:'อาจพบที่พักและแร่', loot:['หิน','ไม้เนื้อแข็ง','ค้างคาว','น้ำใต้ดิน','แร่เหล็ก','ฟอสซิล','ตะเกียงเก่า'], wild:['ค้างคาว','หมี'] },
  { id:'river',    name:'แม่น้ำ',         emoji:'🌊', time:4,  danger:0.2, desc:'น้ำดื่ม ปลา ยา', loot:['ปลา','น้ำสะอาด','สมุนไพร','หิน','กุ้งฝอย','หอยเชลล์','สาหร่ายผูกเชือก'], wild:['จระเข้','งูน้ำ'] },
  { id:'hut',      name:'กระท่อมร้าง',    emoji:'🛖', time:5,  danger:0.3, desc:'ของใช้เก่า อาหาร อุปกรณ์', loot:['มีด','ไม้ขีดไฟ','อาหารกระป๋อง','เชือก','ผ้า','กระทะเก่า','เมล็ดพืช'], wild:['หมาจิ้งจอก','งู'] },
  { id:'forest',   name:'ป่าทึบ',         emoji:'🌳', time:5,  danger:0.35,desc:'ผลไม้ ไม้ สมุนไพร', loot:['ผลไม้','ผลไม้มีพิษ','ไม้','สมุนไพร','เห็ด','รวงผึ้ง','ไก่ป่า','ไข่นก'], wild:['หมูป่า','เสือ','งูพิษ'] },
  { id:'cliff',    name:'หน้าผาสูง',      emoji:'🏔️', time:7,  danger:0.45,desc:'มองเห็นไกล แต่อันตราย', loot:['หิน','สัญญาณขอความช่วยเหลือ','แร่หายาก','ขนมกอินทรี','พลอย','เถาวัลย์'], wild:['นกอินทรี','แมวป่า'] },
  { id:'swamp',   name:'หนองน้ำ',         emoji:'🌿', time:5,  danger:0.3, desc:'พืชยา แต่เสี่ยงป่วย', loot:['สมุนไพรหายาก','น้ำเน่า','กบ','ดินเหนียว','ไข่จระเข้','มอสเรืองแสง'], wild:['งูพิษ','จระเข้'] },
  { id:'meadow',  name:'ทุ่งหญ้า',        emoji:'🌾', time:3,  danger:0.1, desc:'เปิดโล่ง หาสัญญาณได้ง่าย', loot:['หญ้าแห้ง','แมลง','ดอกไม้ยา','กระต่าย','ดอกไม้ป่า','รังตั๊กแตน'], wild:['กระต่าย','กวาง'] },
  { id:'ruins',   name:'ซากอาคาร',        emoji:'🏚️', time:6,  danger:0.35,desc:'ของเก่า แต่เสี่ยงพัง', loot:['โลหะเก่า','แก้ว','เชือก','อาหารเก่า','ชิ้นส่วนวิทยุ','แบตเตอรี่เสื่อม','เศษเหล็ก'], wild:['สุนัขจรจัด','แมลงพิษ'] },
  { id:'waterfall',name:'น้ำตกใหญ่',      emoji:'🚿', time:5,  danger:0.25,desc:'น้ำสะอาดและปลาชุกชุม', loot:['น้ำสะอาด','ปลา','หินสวยงาม','ดอกไม้บาน','ปูน้ำจืด'], wild:['ลิง','งูน้ำ'] },
  { id:'temple',   name:'วัดร้าง',        emoji:'🛕', time:8,  danger:0.5, desc:'สถานที่ลึกลับ อาจมีอาวุธ', loot:['เครื่องราง','ผ้าเก่า','แร่หายาก','สมุนไพรหายาก','อาวุธโบราณ'], wild:['งูจงอาง','ค้างคาว'] },
  { id:'orchard',  name:'สวนผลไม้ป่า',    emoji:'🍎', time:4,  danger:0.15,desc:'ผลไม้เยอะแยะและน้ำผึ้ง', loot:['ผลไม้','รวงผึ้ง','เมล็ดพืช','ไก่ป่า','ไม้'], wild:['ผึ้ง','กระรอก'] },
  { id:'graveyard',name:'สุสานเครื่องจักร', emoji:'⚙️', time:7,  danger:0.4, desc:'ขยะเหล็กและแบตเตอรี่', loot:['เศษเหล็ก','โลหะเก่า','แก้ว','แบตเตอรี่เสื่อม','ตะเกียงเก่า'], wild:['สุนัขจรจัด','แมลงพิษ'] },
];

const CRAFTS = [
  { name:'หอก',      needs:['ไม้','หิน'],                 time:2, desc:'โจมตีสัตว์ HP-40' },
  { name:'กับดักสัตว์', needs:['ไม้','เชือก'],            time:2, desc:'ดักสัตว์อัตโนมัติ' },
  { name:'ที่พักชั่วคราว', needs:['ไม้','ผ้า'],            time:2, desc:'พักฟื้นพลังงาน+30' },
  { name:'ยาสมุนไพร', needs:['สมุนไพร'],                  time:1, desc:'รักษาอาการป่วย' },
  { name:'คบเพลิง',   needs:['ไม้'],                    time:1, desc:'ป้องกันสัตว์ตอนกลางคืน' },
  { name:'เครื่องกลั่นน้ำ',needs:['หิน','ดินเหนียว'],      time:2, desc:'ผลิตน้ำสะอาดเมื่อสิ้นสุดวัน' },
  { name:'ยาพิษ',     needs:['ผลไม้มีพิษ'],             time:1, desc:'ทาบนอาหารให้ผู้อื่น' },
  { name:'เชือกยาว',  needs:['เถาวัลย์'],               time:1, desc:'ใช้ปีนหน้าผาปลอดภัย' },
  { name:'กระเป๋าคาดเอว',needs:['ผ้า','เชือก'],           time:2, desc:'เพิ่มช่องเก็บของ +2 (Permanent)' },
  // --- NEW ADVANCED CRAFTS ---
  { name:'วิทยุกู้ภัย SOS', needs:['วิทยุสื่อสาร','ชิ้นส่วนวิทยุ','ชิ้นส่วนวิทยุ','แบตเตอรี่เสื่อม','โลหะเก่า'], time:5, desc:'เรียกกู้ภัยสำเร็จ 100% ในวันที่ 7' },
  { name:'ชุดแผนที่นำทาง', needs:['แผนที่โลก','เข็มทิศทองคำ','แก้ว','แผนที่ลึกลับ'], time:4, desc:'เปิดแผนที่ถาวร + ไม่โดนกับดักพื้นที่' },
  { name:'ธูปสมุนไพร',   needs:['มอสเรืองแสง','มอสเรืองแสง','หญ้าแห้ง','หญ้าแห้ง','คัมภีร์ลับ'], time:2, desc:'ฟื้นฟู Sanity ทุกคนเป็น 100%' },
  { name:'หม้อไฟป่า',     needs:['กระทะเก่า','น้ำใต้ดิน','ไก่ป่า','กระต่าย','สมุนไพร'], time:3, desc:'ฟื้นฟู HP/Hunger/Thirst เต็มทั้งแคมป์' },
];

const MAP_EVENT_LOCATIONS = [
  { name:'ถ้ำใต้ดินลึกลับ',    emoji:'🕳️', desc:'ถ้ำลึกที่ซ่อนสมบัติโบราณ แต่มืดสนิท', time:8, danger:0.65, requiredItem:'คบเพลิง', reqDesc:'ต้องมี คบเพลิง', loot:['แร่หายาก','อาวุธโบราณ','สมุนไพรหายาก','ยาสมุนไพร','ทองคำแท่ง','ชุดเกราะเก่า'], wild:['ค้างคาวยักษ์','งูพิษ'] },
  { name:'เนินหินศักดิ์สิทธิ์',  emoji:'⛩️', desc:'สถานที่ศักดิ์สิทธิ์บนยอดเขา ทางชันมาก', time:9, danger:0.6, requiredItem:'เชือกยาว', reqDesc:'ต้องมี เชือกยาว', loot:['แร่หายาก','สัญญาณขอความช่วยเหลือ','ยาสมุนไพร','อาวุธโบราณ','เครื่องรางศักดิ์สิทธิ์','คัมภีร์ลับ'], wild:['นกอินทรี','แมวป่า'] },
  { name:'ซากเรือโบราณ',       emoji:'🚢', desc:'ซากเรือจมอยู่ในหนองน้ำ มีของมีค่า', time:8, danger:0.55, requiredItem:'มีด', reqDesc:'ต้องมี มีด', loot:['โลหะเก่า','อาหารกระป๋อง','เชือก','แก้ว','อาวุธโบราณ','หีบสมบัติ','เข็มทิศทองคำ'], wild:['จระเข้','งูน้ำ'] },
  { name:'หอสังเกตการณ์เก่า',   emoji:'🗼', desc:'หอคอยเก่าที่อาจยังมีวิทยุทำงาน', time:10, danger:0.5, requiredItem:'เชือกยาว', reqDesc:'ต้องมี เชือกยาว', loot:['สัญญาณขอความช่วยเหลือ','โลหะเก่า','แก้ว','แร่หายาก','วิทยุสื่อสาร','แผนที่โลก'], wild:['แมลงพิษ','สุนัขจรจัด'] },
  { name:'ค่ายร้างในป่าลึก',    emoji:'⛺', desc:'ค่ายเก่าที่ถูกทิ้งร้าง มีอุปกรณ์เหลืออยู่', time:7, danger:0.5, requiredItem:'คบเพลิง', reqDesc:'ต้องมี คบเพลิง', loot:['อาหารกระป๋อง','ผ้า','ไม้ขีดไฟ','เชือก','มีด','ยาสมุนไพร','เต็นท์ทหาร','กระสุนเก่า'], wild:['หมาจิ้งจอก','งู'] },
  { name:'น้ำตกที่ซ่อนเร้น',    emoji:'🌊', desc:'น้ำตกลับแลที่ต้องบุกฝ่าพงหนาม', time:8, danger:0.55, requiredItem:'มีด', reqDesc:'ต้องมี มีด', loot:['น้ำสะอาด','น้ำสะอาด','สมุนไพรหายาก','ปลา','ปลา','มุกน้ำจืด','กุ้งมังกรป่า'], wild:['งูพิษ','จระเข้'] },
];

const WEATHER_TYPES = [
  { icon:'☀️', text:'แดดจัด — พลังงานลดเร็ว', eMod:-5 },
  { icon:'⛅', text:'เมฆบางส่วน — สภาพปกติ', eMod:0 },
  { icon:'🌧️', text:'ฝนตก — เส้นทางลื่น เสี่ยงป่วย', eMod:-10 },
  { icon:'⛈️', text:'พายุ — ห้ามออกนอกแคมป์', eMod:-20 },
  { icon:'🌫️', text:'หมอกหนา — หลงทางง่าย', eMod:-5 },
  { icon:'🌤️', text:'อากาศดี — ฟื้นฟูพลังงาน', eMod:5 },
];

// ===================== API CONFIGURATION =====================
let ANTHROPIC_API_KEY = localStorage.getItem('anthropic_api_key') || '';
const ANTHROPIC_MODEL = 'claude-3-5-haiku-latest';

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

const SYSTEM_PROMPT = `คุณคือ AI ผู้บรรยายเกมเอาชีวิตรอดในป่า ภาษาไทย เขียนแบบนิยายผจญภัย สั้น กระชับ ตื่นเต้น

กฎสำคัญ:
1. บรรยายผลของการกระทำ 2-3 ประโยค มีรายละเอียดเฉพาะของ/สถานที่
2. ระบบมีค่า Sanity (ค่าสติ) หากผู้เล่นเจอเหตุการณ์สยองขวัญหรือโดดเดี่ยว ให้ลด Sanity
3. ไอเท็ม "ขยะ" (เช่น เศษเหล็ก, ชิ้นส่วนวิทยุ, มอสเรืองแสง) มีความสำคัญมากในการคราฟอุปกรณ์ Tier สูงเพื่อชนะเกม
4. ตอบ JSON เท่านั้น ตามรูปแบบนี้:

{
  "story": "บรรยายสั้นของการกระทำ",
  "hpDelta": 0,
  "hungerDelta": 0,
  "thirstDelta": 0,
  "energyDelta": 0,
  "sanityDelta": 0,
  "loot": [],
  "wildlife": null,
  "event": "none|good|bad",
  "eventText": ""
}`;

/**
 * 2. ข้อแนะนำ: แจ้งเตือนเมื่อไม่มี API Key
 */
function validateApiKey() {
  if (!ANTHROPIC_API_KEY) {
    console.warn("Offline Mode: No Anthropic API Key found. Using mock narrator.");
  }
}
validateApiKey();

/**
 * BUG-01: modePrompt (ReferenceError) - ย้ายมาประกาศให้เข้าถึงได้
 */
const getModePrompt = () => `\nโหมดปัจจุบัน: ${G.mode === 'multi' ? 'ออนไลน์มัลติเพลเยอร์' : 'เล่นคนเดียวกับบอต'}`;

// ===================== GAME STATE =====================
// Dynamic daily events loaded from events.js
// Removed early init; will be added in G object
function getDailyEvent() {
  if (G.day === 7) {
    return { id:'rescue-day-7', name: '🚁 วันแห่งการค้นหา', desc: 'เฮลิคอปเตอร์กู้ภัยกำลังบินผ่านในวันนี้! ใครมีสัญญาณหรือคบเพลิงมีโอกาสรอดสูงขึ้น.' };
  }
  if (!window.EVENTS || typeof window.EVENTS.getRandomEvent !== 'function') {
    console.error('Events system not loaded properly');
    return { name: `🗓️ วัน ${G.day}`, desc: 'ไม่มีเหตุการณ์พิเศษ (ระบบเหตุการณ์ขัดข้อง)' };
  }
  const ev = window.EVENTS.getRandomEvent(G.day, G.usedEventIds);
  if (ev) {
    if (!ev.id) ev.id = `${ev.name}-${G.day}`;
    G.usedEventIds.push(ev.id);
    return { id: ev.id, name: ev.name, desc: ev.desc };
  }
  return { name: `🗓️ วัน ${G.day}`, desc: 'ไม่มีเหตุการณ์พิเศษ' };
}

// ===================== SOCKET.IO CLIENT =====================
const socket = typeof io !== 'undefined' ? io() : null;

if (socket) {
  socket.on('roomCreated', (roomData) => {
    G.roomCode = roomData.code;
    G.lobbyPlayers = roomData.players;
    G.isHost = true;
    
    document.getElementById('mode-selector-screen').style.display = 'none';
    document.getElementById('online-lobby-panel').style.display = 'flex';
    document.getElementById('lobby-room-code').textContent = G.roomCode;
    
    toggleLobbyControls('host');
    renderLobbyPlayers();
  });

  socket.on('playerJoined', (roomData) => {
    G.lobbyPlayers = roomData.players;
    renderLobbyPlayers();
    addMsg(`👤 ${roomData.players[roomData.players.length-1].name} เข้าร่วมห้องแล้ว`, 'bubble-system');
  });

  socket.on('updateLobby', (roomData) => {
    G.lobbyPlayers = roomData.players;
    // Check if we are the new host
    const me = G.lobbyPlayers.find(p => p.id === socket.id);
    if (me && me.isHost) {
      G.isHost = true;
      toggleLobbyControls('host');
    }
    renderLobbyPlayers();
  });

  socket.on('gameStarted', (roomData) => {
    G.lobbyPlayers = roomData.players;
    startCharacterSequenceFromLobby();
  });

  socket.on('allConfirmed', (roomData) => {
    G.lobbyPlayers = roomData.players;
    initGameMultiplayer(roomData);
  });

  socket.on('kicked', () => {
    alert('คุณถูกเตะออกจากห้อง');
    leaveLobby(true);
  });

  socket.on('error', (msg) => {
    alert(msg);
  });
  
  // Real-time Action Sync
  socket.on('syncAction', (data) => {
    // Handle synced action (e.g., someone else explored)
    // This will be expanded in later steps for state management
  });
}

// ===================== DUAL-MODE ROUTER & LOBBY =====================
/**
 * 1. ฟังก์ชันควบคุมปุ่มเลือกโหมดเกม (Game Mode Selector)
 */
function selectGameMode(mode) {
  G.mode = mode; // 'single' or 'multi'
  if (mode === 'single') {
    document.getElementById('mode-selector-screen').style.display = 'none';
    document.getElementById('online-lobby-panel').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    
    // Ensure UI is unlocked for single player
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }

    // Clear any previous multiplayer state
    G.isHost = false;
    G.lobbyPlayers = [];
  }
}

function showMultiplayerOptions() {
  const options = document.getElementById('multi-options');
  if (options) options.style.display = 'flex';
}

function hideMultiplayerOptions() {
  const options = document.getElementById('multi-options');
  if (options) options.style.display = 'none';
}

function createOnlineRoom() {
  const nameInput = document.getElementById('player-name-input');
  const playerName = nameInput ? nameInput.value.trim() : 'คุณ (Host)';
  
  if (socket) {
    socket.emit('createRoom', { playerName });
  } else {
    // Fallback simulation if no server
    G.mode = 'multi';
    G.isHost = true;
    G.roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    G.lobbyPlayers = [{ name: playerName, isHost: true, isBot: false, ready: true }];
    
    document.getElementById('mode-selector-screen').style.display = 'none';
    document.getElementById('online-lobby-panel').style.display = 'flex';
    document.getElementById('lobby-room-code').textContent = G.roomCode;
    
    toggleLobbyControls('host');
    renderLobbyPlayers();
  }
}

function joinOnlineRoom() {
  const codeInput = document.getElementById('join-room-code');
  const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
  if (code.length < 4) { alert('กรุณาใส่รหัสห้อง 4 หลัก'); return; }
  
  const nameInput = document.getElementById('player-name-input');
  const playerName = nameInput ? nameInput.value.trim() : 'คุณ (Client)';

  if (socket) {
    socket.emit('joinRoom', { roomCode: code, playerName });
    G.mode = 'multi';
    G.roomCode = code;
    G.isHost = false;
    document.getElementById('mode-selector-screen').style.display = 'none';
    document.getElementById('online-lobby-panel').style.display = 'flex';
    document.getElementById('lobby-room-code').textContent = G.roomCode;
    toggleLobbyControls('player');
  } else {
    // Fallback
    G.mode = 'multi';
    G.isHost = false;
    G.roomCode = code;
    G.lobbyPlayers = [
      { name: 'หัวหน้าห้อง', isHost: true, isBot: false, ready: true },
      { name: playerName, isHost: false, isBot: false, ready: false }
    ];
    document.getElementById('mode-selector-screen').style.display = 'none';
    document.getElementById('online-lobby-panel').style.display = 'flex';
    document.getElementById('lobby-room-code').textContent = G.roomCode;
    toggleLobbyControls('player');
    renderLobbyPlayers();
  }
}

function copyRoomCode() {
  const text = G.roomCode;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = '✅ คัดลอกแล้ว!';
    setTimeout(() => { btn.textContent = originalText; }, 2000);
  });
}

function toggleLobbyControls(role) {
  const isHost = (role === 'host');
  const startBtn = document.getElementById('start-online-game-btn');
  const readyBtn = document.getElementById('ready-online-btn');
  const addBotBtn = document.getElementById('add-bot-btn');
  
  if (startBtn) startBtn.style.display = isHost ? 'block' : 'none';
  if (readyBtn) readyBtn.style.display = !isHost ? 'block' : 'none';
  if (addBotBtn) addBotBtn.style.display = isHost ? 'block' : 'none';
  
  const app = document.getElementById('app');
  if (app) {
    app.style.pointerEvents = 'none';
    app.style.filter = 'blur(5px)';
  }
}

function renderLobbyPlayers() {
  const slotsContainer = document.getElementById('player-slots');
  if (!slotsContainer) return;
  slotsContainer.innerHTML = '';
  
  for (let i = 0; i < 4; i++) {
    const p = G.lobbyPlayers[i];
    const slot = document.createElement('div');
    slot.className = `lobby-slot ${p ? 'filled' : 'empty'}`;
    
    if (p) {
      const isMe = socket ? p.id === socket.id : p.name.includes('คุณ');
      const statusClass = p.ready ? 'status-ready' : 'status-waiting';
      const statusLabel = p.ready ? 'Ready' : 'Waiting';
      let hostControls = '';
      
      if (G.isHost && !p.isHost) {
        hostControls = `<button class="kick-btn" onclick="kickPlayer(${i})" title="เตะผู้เล่น">✕</button>`;
      }
      
      slot.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:24px;">${p.isBot ? '🤖' : '👤'}</div>
          <div>
            <div style="font-size:15px; font-weight:700; color:${isMe ? 'var(--blue2)' : 'var(--text)'};">${p.name} ${isMe ? '(คุณ)' : ''} ${p.isHost ? '<span style="color:var(--amber2); font-size:10px;">(HOST)</span>' : ''}</div>
            <div class="status-indicator ${statusClass}" style="margin-top:4px;">${statusLabel}</div>
          </div>
        </div>
        <div>${hostControls}</div>
      `;
    } else {
      slot.innerHTML = `
        <div style="color:var(--text3); font-size:12px; font-style:italic; width:100%; text-align:center;">
          รอกระโดดเข้าร่วม...
        </div>
      `;
    }
    slotsContainer.appendChild(slot);
  }
  
  const everyoneReady = G.lobbyPlayers.length === 4 && G.lobbyPlayers.every(p => p.ready);
  const startBtn = document.getElementById('start-online-game-btn');
  if (startBtn) {
    startBtn.disabled = !everyoneReady;
    startBtn.style.opacity = everyoneReady ? '1' : '0.5';
  }
  
  const statusMsg = document.getElementById('lobby-status-msg');
  if (everyoneReady) {
    statusMsg.textContent = 'ทุกคนพร้อมแล้ว! หัวหน้าห้องเริ่มเกมได้เลย ⚔️';
    statusMsg.style.color = 'var(--green2)';
  } else {
    statusMsg.textContent = G.lobbyPlayers.length < 4 ? 'รอผู้เล่นหรือเติมบอตให้ครบ 4 คน...' : 'รอเพื่อนๆ กด Ready ให้ครบ...';
    statusMsg.style.color = 'var(--text3)';
  }
}

function kickPlayer(index) {
  if (!G.isHost) return;
  if (socket) {
    socket.emit('kickPlayer', { roomCode: G.roomCode, playerIndex: index });
  } else {
    const p = G.lobbyPlayers[index];
    if (p && confirm(`เตะ ${p.name} ออกจากห้อง?`)) {
      G.lobbyPlayers.splice(index, 1);
      renderLobbyPlayers();
    }
  }
}

function addBotToLobby() {
  if (G.lobbyPlayers.length >= 4) return;
  if (socket) {
    socket.emit('addBot', { roomCode: G.roomCode });
  } else {
    const botNames = ['บอตสมชาย', 'บอตสมหญิง', 'บอตสมเกียรติ', 'บอตสมศรี'];
    const name = botNames[G.lobbyPlayers.length % botNames.length];
    G.lobbyPlayers.push({ name: name, isHost: false, isBot: true, ready: true });
    renderLobbyPlayers();
  }
}

function toggleReady() {
  if (socket) {
    socket.emit('toggleReady', { roomCode: G.roomCode });
  } else {
    const myIndex = G.lobbyPlayers.findIndex(p => p.name.includes('คุณ (Client)'));
    if (myIndex !== -1) {
      G.lobbyPlayers[myIndex].ready = !G.lobbyPlayers[myIndex].ready;
      renderLobbyPlayers();
    }
  }
}

function startCharacterSequenceFromLobby() {
  document.getElementById('online-lobby-panel').style.display = 'none';
  document.getElementById('start-screen').style.display = 'flex';
  
  const roomCodeDisplay = document.getElementById('room-code-display');
  if (roomCodeDisplay) {
    roomCodeDisplay.textContent = `ROOM: SURV-${G.roomCode}`;
    roomCodeDisplay.style.display = 'block';
  }

  // Pre-fill user name and auto-start gacha for multiplayer
  if (socket && G.mode === 'multi') {
    const me = G.lobbyPlayers.find(p => p.id === socket.id);
    const nameInput = document.getElementById('player-name-input');
    if (me && nameInput) {
      nameInput.value = me.name;
    }
    // Auto-start gacha immediately so players can't bypass the confirm flow
    setTimeout(() => {
      startCharacterSequence();
    }, 200);
  }
}

function hostStartGame() {
  if (!G.isHost) return;
  if (G.lobbyPlayers.length < 4) {
    alert('ต้องมีผู้เล่นครบ 4 คนก่อนจึงจะเริ่มเกมได้ (สามารถกดปุ่ม "🤖 + เติมบอต" ได้ครับ)');
    return;
  }
  const allReady = G.lobbyPlayers.every(p => p.ready);
  if (!allReady) {
    alert('ผู้เล่นทุกคนต้องเตรียมพร้อมก่อนเริ่มเกม');
    return;
  }
  if (socket) {
    socket.emit('startGame', { roomCode: G.roomCode });
  }
}

function leaveLobby(force = false) {
  if (!force && G.isHost) {
    if (!confirm('หากคุณออก ห้องจะถูกปิด (Dissolve Room) ยืนยันหรือไม่?')) return;
  }
  
  if (socket) {
    socket.disconnect();
    setTimeout(() => { window.location.reload(); }, 500);
  } else {
    G.lobbyPlayers = [];
    document.getElementById('online-lobby-panel').style.display = 'none';
    document.getElementById('mode-selector-screen').style.display = 'flex';
    hideMultiplayerOptions();
    
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }
  }
}

let G = {
  mode: 'single', 
  isHost: false,
  roomCode: '',
  lobbyPlayers: [],
  day: 1,
  currentPlayer: 0,
  players: [],
  locations: [],
  weather: null,
  isLoading: false,
  thiefUsed: [false,false,false,false],
  dayDone: [false,false,false,false],
  activeTraps: [], // Array to store placed traps: { playerIndex, locationId }
  combatState: null, // Stores current active combat: { playerIndex, animalName, animalHp, maxHp, animalDmg, location }
  usedEventIds: [], // Track used event IDs per day
  activeEvent: {},
  mapEvent: null, // Current day's map event location
  camp: {
    structures: [],     // built camp structures
    sharedItems: [],    // shared items
    level: 1            // camp level (1-3)
  },
  rescueData: {
    attempts: [],
    lastChance: 0,
    success: false
  },
  turnTimer: null,
  secondsLeft: 180
};

function adjustTrust(pi, delta, reason) {
  const p = G.players[pi];
  if (!p) return;
  const before = typeof p.trust === 'number' ? p.trust : 50;
  p.trust = clamp(before + delta, 0, 100);
  if (delta === 0) return;
  const verb = delta > 0 ? 'ได้รับความไว้วางใจเพิ่มขึ้น' : 'รู้สึกไม่ไว้ใจมากขึ้น';
  addMsg(`🧭 ${p.name} ${verb} ${Math.abs(delta)} จาก ${reason}`, delta > 0 ? 'bubble-event-good' : 'bubble-event-bad');
}

function recordRescueAttempt(pi, chance) {
  G.rescueData.attempts.push({ player: G.players[pi].name, day: G.day, chance: Math.round(chance * 100) });
  G.rescueData.lastChance = Math.round(chance * 100);
}

function startTurnTimer() {
  clearInterval(G.turnTimer);
  if (G.currentPlayer !== 0) {
    document.getElementById('turn-timer').style.display = 'none';
    return;
  }
  
  G.secondsLeft = 180;
  const timerEl = document.getElementById('turn-timer');
  timerEl.style.display = 'block';
  timerEl.classList.remove('warning');
  updateTimerUI();

  G.turnTimer = setInterval(() => {
    G.secondsLeft--;
    updateTimerUI();
    if (G.secondsLeft <= 30) timerEl.classList.add('warning');
    if (G.secondsLeft <= 0) {
      clearInterval(G.turnTimer);
      addMsg('⌛ หมดเวลาเทิร์นของคุณแล้ว!', 'bubble-system');
      endPlayerTurn(0);
    }
  }, 1000);
}

function updateTimerUI() {
  const m = Math.floor(G.secondsLeft / 60);
  const s = G.secondsLeft % 60;
  const timerEl = document.getElementById('turn-timer');
  if (timerEl) timerEl.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function stopTurnTimer() {
  clearInterval(G.turnTimer);
  const timerEl = document.getElementById('turn-timer');
  if (timerEl) timerEl.style.display = 'none';
}

let shareMode = null;
let shareFromPi = null;

const PLAYER_NAMES = ['อลิส','บ็อบ','คาร่า','แดน'];
const PLAYER_EMOJIS = ['👩','👨','👩','👦'];
const PLAYER_COLORS = ['#7aab3a','#3a7ab0','#c03070','#d4902a'];

function startCharacterSequence() {
  const nameInput = document.getElementById('player-name-input');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (!name) { 
      alert('กรุณาใส่ชื่อของคุณ'); 
      return; 
  }
  
  const lobbyArea = document.getElementById('lobby-input-area');
  const startBtn = document.getElementById('start-btn');
  if (lobbyArea) lobbyArea.style.display = 'none';
  if (startBtn) startBtn.style.display = 'none';
  
  const seqContainer = document.getElementById('character-sequence');
  if (!seqContainer) { 
      console.error('Character sequence container not found'); 
      return; 
  }
  
  seqContainer.style.display = 'flex';
  
  seqContainer.innerHTML = `
    <div id="char-animation" class="gacha-reel">👤</div>
    <div class="gacha-label">บทบาทของคุณคือ...</div>
    <div id="char-name" class="gacha-job-name">???</div>
    <div id="char-desc" style="font-size:12px;color:var(--text2);margin-top:10px;text-align:center;"></div>
    <button class="screen-btn" id="confirm-start-btn" style="display:none; margin-top:20px;">⚔️ เข้าสู่ป่า</button>
  `;
  
  const confirmBtn = document.getElementById('confirm-start-btn');
  confirmBtn.style.display = 'none';

  let count = 0;
  const totalSteps = 25;
  const interval = setInterval(() => {
    const job = JOBS[Math.floor(Math.random() * JOBS.length)];
    const reel = document.getElementById('char-animation');
    const jobName = document.getElementById('char-name');
    
    if (reel && jobName) {
        reel.textContent = job.emoji;
        jobName.textContent = job.name;
    }
    
    count++;
    if (count >= totalSteps) {
      clearInterval(interval);
      if (reel) reel.classList.add('burst-effect');
      if (jobName) jobName.classList.add('glow-text');
      
      let finalJob;
      if (socket && G.mode === 'multi') {
        const myLobbyData = G.lobbyPlayers.find(p => p.id === socket.id);
        finalJob = JOBS.find(j => j.id === myLobbyData.job.id) || myLobbyData.job;
      } else {
        finalJob = JOBS[Math.floor(Math.random() * JOBS.length)];
      }
      
      if (reel) reel.textContent = finalJob.emoji;
      if (jobName) jobName.textContent = finalJob.name;
      
      const charDesc = document.getElementById('char-desc');
      if (charDesc) charDesc.textContent = finalJob.skill;
      
      confirmBtn.style.display = 'block';
      if (socket && G.mode === 'multi') {
        confirmBtn.onclick = function() {
          socket.emit('confirmJob', { roomCode: G.roomCode, playerName: name });
          confirmBtn.disabled = true;
          confirmBtn.style.background = 'var(--bg4)';
          confirmBtn.textContent = '⏱️ รอเพื่อนคนอื่นเลือกอาชีพ...';
        };
      } else {
        confirmBtn.onclick = function() { initGame(name); };
      }
    }
  }, 100);
}

window.startCharacterSequence = startCharacterSequence;

function initGameMultiplayer(roomData) {
  try {
    const keyInput = document.getElementById('api-key-input');
    if (keyInput && keyInput.value.trim()) {
      localStorage.setItem('anthropic_api_key', keyInput.value.trim());
      window.ANTHROPIC_API_KEY = keyInput.value.trim();
    }
    document.getElementById('start-screen').style.display = 'none';
    
    // Unlock main game interface
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }
    
    G.day = 1;
    G.currentPlayer = 0;
    G.usedEventIds = [];
    G.activeTraps = [];
    G.combatState = null;
    G.activeEvent = {};
    G.mapEvent = null;
    G.camp = {
      structures: [],
      sharedItems: [],
      level: 1
    };

    G.rescueData = { attempts: [], lastChance: 0, success: false };

    G.players = roomData.players.map((p, i) => {
      const jobDetails = JOBS.find(j => j.id === p.job.id) || p.job;
      return {
        name: p.name, 
        emoji: PLAYER_EMOJIS[i] || '👤', 
        color: PLAYER_COLORS[i] || '#ffffff',
        job: jobDetails,
        hp: 100, hunger: 80, thirst: 100, energy: 100, sanity: 100,
        hoursLeft: 24,
        trust: 50,
        inventory: [],
        statuses: [],
        history: [],
        alive: true,
        atCamp: true,
        dayNotes: [],
        skillUsed: false,
        isBot: !!p.isBot,
        id: p.id,
        stats: {
          itemsCrafted: 0,
          itemsShared: 0,
          animalsDefeated: 0,
          damageTaken: 0,
          dayDied: null,
          actionsTaken: 0
        }
      };
    });

    const wp = document.getElementById('week-progress');
    if (wp) {
      wp.innerHTML = Array.from({length:7},(_,i)=>`<div class="day-pip${i===0?' current':''}" id="pip${i}"></div>`).join('');
    }

    buildCraftList();
    updateCampUI();
    startDay();
    addMsg('🌲 ทุกคนเลือกอาชีพและเข้าสู่ป่าแล้ว! เริ่มต้นเอาชีวิตรอดไปด้วยกัน', 'bubble-system');
  } catch(err) {
    console.error('Error in initGameMultiplayer:', err);
    alert('เกิดข้อผิดพลาดในการเริ่มต้นเกมหลายคน: ' + err.message);
  }
}

function initGame(playerName) {
  try {
    const keyInput = document.getElementById('api-key-input');
    if (keyInput && keyInput.value.trim()) {
      localStorage.setItem('anthropic_api_key', keyInput.value.trim());
      ANTHROPIC_API_KEY = keyInput.value.trim();
    }
    document.getElementById('start-screen').style.display = 'none';
    
    // Unlock main game interface
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }
    
    // Reset G state
    G.day = 1;
    G.currentPlayer = 0;
    G.usedEventIds = [];
    G.activeTraps = [];
    G.combatState = null;
    G.activeEvent = {};
    G.mapEvent = null;
    G.camp = {
      structures: [],
      sharedItems: [],
      level: 1
    };

    G.rescueData = { attempts: [], lastChance: 0, success: false };

    G.players = PLAYER_NAMES.map((name, i) => {
      // Use playerName for the first player
      const pName = (i === 0 && playerName) ? playerName : name;
      return {
        name: pName, 
        emoji: PLAYER_EMOJIS[i], color: PLAYER_COLORS[i],
        job: null,
        hp: 100, hunger: 80, thirst: 100, energy: 100, sanity: 100,
        hoursLeft: 24,
        trust: 50,
        inventory: [],
        statuses: [],
        history: [],
        alive: true,
        atCamp: true,
        dayNotes: [],
        skillUsed: false,
        isBot: i !== 0,
        stats: {
          itemsCrafted: 0,
          itemsShared: 0,
          animalsDefeated: 0,
          damageTaken: 0,
          dayDied: null,
          actionsTaken: 0
        }
      };
    });
    // shuffle jobs
    const shuffled = [...JOBS].sort(()=>Math.random()-0.5).slice(0,4);
    G.players.forEach((p,i) => p.job = shuffled[i]);

    // week progress
    const wp = document.getElementById('week-progress');
    if (wp) {
      wp.innerHTML = Array.from({length:7},(_,i)=>`<div class="day-pip${i===0?' current':''}" id="pip${i}"></div>`).join('');
    }

    buildCraftList();
    updateCampUI();
    startDay();
  } catch(err) {
    console.error('Error in initGame:', err);
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

function startDay() {
  try {
    G.usedEventIds = [];
    G.dayDone = [false,false,false,false];
    G.thiefUsed = [false,false,false,false];
    G.players.forEach(p => p.skillUsed = false);

    // weather
    G.weather = WEATHER_TYPES[Math.floor(Math.random()*WEATHER_TYPES.length)];
    document.getElementById('weather-icon').textContent = G.weather.icon;
    document.getElementById('weather-text').textContent = G.weather.text;

    // apply weather to all living players
    G.players.forEach(p => {
      if (!p.alive) return;
      p.energy = clamp(p.energy + G.weather.eMod, 0, 100);
      if (G.weather.icon === '🌧️' && Math.random() < 0.25) p.statuses.push('wet');
    });

    // pick 3 random locations
    const shuffled = [...LOCATIONS].sort(()=>Math.random()-0.5);
    G.locations = shuffled.slice(0,3).map(l=>({...l, explored:[]}));

    // Generate map event location (special 4th slot)
    const mapHolder = G.players.find(p => p.alive && p.inventory.includes('แผนที่ลึกลับ'));
    if (mapHolder) {
      mapHolder.inventory.splice(mapHolder.inventory.indexOf('แผนที่ลึกลับ'), 1);
      addMsg(`🗺️ ${mapHolder.name} ใช้แผนที่ลึกลับสำรวจพื้นที่ใหม่!`, 'bubble-event-good');
      const mapEvt = MAP_EVENT_LOCATIONS[Math.floor(Math.random() * MAP_EVENT_LOCATIONS.length)];
      G.mapEvent = { ...mapEvt, explored: false, exploredBy: null };
    }

    renderLocations();
    document.getElementById('day-badge').textContent = `วันที่ ${G.day} / 7`;
    updateCampUI();

    // Trigger daily event using dynamic system
    const dailyEvent = getDailyEvent();
    if (dailyEvent) {
      addMsg(`📢 **เหตุการณ์วันนี้: ${dailyEvent.name}**\n*${dailyEvent.desc}*`, 'bubble-system');
      const evBox = document.getElementById('daily-event-box');
      if (evBox) evBox.innerHTML = `<strong style="color:var(--amber2)">${dailyEvent.name}</strong><br><span style="color:var(--text2)">${dailyEvent.desc}</span>`;
      applyEventModifiers(dailyEvent);
    }

    addMsg(`☀️ วันที่ ${G.day} เริ่มต้นขึ้น — ${G.weather.icon} ${G.weather.text}`, 'bubble-system');

    // find first alive player
    G.currentPlayer = G.players.findIndex(p=>p.alive);
    startTurn(G.currentPlayer);
  } catch(err) {
    console.error('Error in startDay:', err);
    alert('เกิดข้อผิดพลาดในการเริ่มวัน: ' + err.message);
  }
}

function applyEventModifiers(dailyEvent) {
  const name = dailyEvent.name;
  G.activeEvent = {
    name,
    wildMult: 1,
    extraEnergyDecay: 0,
    extraHungerDecay: 0,
    waterPoison: false,
    noDecay: false,
    acidRain: false,
    forestBlock: false,
    blockedLocations: []
  };

  if (name.includes('ฝนหยุด')) {
    G.players.forEach(p => { if (p.alive) p.hp = clamp(p.hp + 10, 0, 100); });
  } else if (name.includes('วันโชคดี')) {
    G.locations.forEach(loc => loc.extraLoot = true);
  } else if (name.includes('ดอกไม้ยาบาน')) {
    G.locations.forEach(loc => loc.herbEasy = true);
  } else if (name.includes('นกนำทาง')) {
    G.locations.forEach(loc => { loc.time = Math.max(1, loc.time - 1); });
  } else if (name.includes('คืนเงียบสงบ')) {
    G.activeEvent.noDecay = true;
  } else if (name.includes('ลมเย็น')) {
    G.activeEvent.wetResist = true;
  } else if (name.includes('ควันไฟจากทิศเหนือ')) {
    G.activeEvent.radioHint = 'hut';
  } else if (name.includes('พายุฝน')) {
    const storm = WEATHER_TYPES.find(w => w.icon === '⛈️');
    if (storm) {
      G.weather = storm;
      document.getElementById('weather-icon').textContent = storm.icon;
      document.getElementById('weather-text').textContent = storm.text;
    }
    G.locations.forEach(loc => loc.time += 2);
    G.activeEvent.wetRisk = true;
  } else if (name.includes('สัตว์ออกอาละวาด')) {
    G.activeEvent.wildMult = 2;
  } else if (name.includes('ไข้ป่าระบาด')) {
    G.players.forEach(p => { if (p.alive && Math.random() < 0.4) { p.statuses = addStatus(p.statuses, 'sick'); addMsg(`🤒 ${p.name} ติดไข้ป่าระบาด!`, 'bubble-event-bad'); } });
  } else if (name.includes('ป่าแห้งแล้ง')) {
    G.locations.forEach(loc => { if (loc.id === 'forest') loc.loot = loc.loot.filter(item => item !== 'ผลไม้' && item !== 'สมุนไพร'); });
  } else if (name.includes('สัญญาณวิทยุ')) {
    G.activeEvent.radioHint = 'ruins';
    addMsg('📡 สัญญาณวิทยุแนะนำให้สำรวจซากอาคารมากขึ้น', 'bubble-system');
  } else if (name.includes('วันแห่งการค้นหา')) {
    G.activeEvent.rescueDay = true;
    addMsg('🚁 วันนี้เฮลิคอปเตอร์บินผ่านพื้นที่! สัญญาณช่วยเหลือมีโอกาสมองเห็นได้มากขึ้น', 'bubble-event-good');
  } else if (name.includes('น้ำท่วมฉับพลัน')) {
    G.locations.forEach(loc => { if (loc.id === 'river' || loc.id === 'swamp') loc.blocked = true; });
  } else if (name.includes('แมลงบุก')) {
    G.activeEvent.extraEnergyDecay = 5;
  } else if (name.includes('เห็ดพิษระบาด')) {
    G.activeEvent.forestToxin = true;
  } else if (name.includes('หมอกหนา')) {
    G.locations.forEach(loc => loc.time += 1);
  } else if (name.includes('พบซากคน')) {
    const alivePlayers = G.players.filter(p => p.alive);
    if (alivePlayers.length) {
      const recipient = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const loot = ['สมุนไพร','ไม้ขีดไฟ','อาหารกระป๋อง','เชือก'][Math.floor(Math.random() * 4)];
      addToInventory(G.players.indexOf(recipient), loot);
      addMsg(`💀 ${recipient.name} พบซากคนและเก็บได้ ${loot}`, 'bubble-event-good');
    }
  } else if (name.includes('ดินถล่ม')) {
    G.locations.forEach(loc => { if (loc.id === 'cave' || loc.id === 'cliff') loc.blocked = true; });
  } else if (name.includes('อากาศร้อนจัด')) {
    G.activeEvent.extraHungerDecay = 5;
  } else if (name.includes('นักล่าตัวใหม่')) {
    G.activeEvent.animalHpMult = 1.5;
  } else if (name.includes('น้ำปนเปื้อน')) {
    G.activeEvent.waterPoison = true;
  } else if (name.includes('ไฟป่า')) {
    G.locations.forEach(loc => { if (loc.id === 'forest') loc.blocked = true; });
  } else if (name.includes('พายุทราย')) {
    const hasMap = G.players.some(p => p.alive && p.inventory.includes('ชุดแผนที่นำทาง'));
    if (hasMap) {
      addMsg(`🌪️ พายุทรายรุนแรงพัดผ่าน! แต่ "ชุดแผนที่นำทาง" ช่วยให้ทุกคนหาที่กำบังที่ปลอดภัยได้ทัน!`, 'bubble-event-good');
      G.activeEvent.injureRisk = false;
    } else {
      G.activeEvent.injureRisk = true;
    }
  } else if (name.includes('ความตื่นตระหนก')) {
    const victim = G.players.filter(p=>p.alive)[Math.floor(Math.random()*G.players.filter(p=>p.alive).length)];
    if (victim) {
      victim.statuses = addStatus(victim.statuses, 'paranoid');
      addMsg(`😱 ${victim.name} ตื่นตระหนกและเริ่มหวาดระแวง`, 'bubble-event-bad');
    }
  } else if (name.includes('โจรป่า')) {
    if (G.camp.structures.includes('fortified')) {
      addMsg(`🛡️ โจรป่าพยายามบุกแคมป์! แต่ถูก "กำแพงเหล็กกันภัย" สะท้อนกลับจนบาดเจ็บหนีไป!`, 'bubble-event-good');
      const loots = ['มีด','เศษเหล็ก','อาหารกระป๋อง','ผ้า','เชือก'];
      const l1 = loots[Math.floor(Math.random()*loots.length)];
      const l2 = loots[Math.floor(Math.random()*loots.length)];
      G.camp.sharedItems.push(l1, l2);
      addMsg(`🎒 พบของดรอปจากศพโจร: ${l1}, ${l2} ถูกเก็บเข้าคลังแคมป์!`, 'bubble-event-good');
      updateCampUI();
    } else {
      const victims = G.players.filter(p => p.alive && p.inventory.length);
      if (victims.length) {
        const victim = victims[Math.floor(Math.random()*victims.length)];
        const stolen = victim.inventory.splice(Math.floor(Math.random()*victim.inventory.length),1)[0];
        const raider = G.players[Math.floor(Math.random()*G.players.length)];
        addToInventory(G.players.indexOf(raider), stolen);
        addMsg(`🗡️ โจรป่าขโมย ${stolen} จาก ${victim.name}!`, 'bubble-event-bad');
      }
    }
  } else if (name.includes('ฝนกรด')) {
    G.activeEvent.acidRain = true;
  }
}

function startTurn(pi) {
  try {
    const p = G.players[pi];
    if (!p.alive) { nextTurn(); return; }

    // hunger/energy/thirst/sanity decay
    const hungerLoss = G.activeEvent.noDecay ? 0 : 8 + (G.activeEvent.extraHungerDecay || 0);
    const energyLoss = G.activeEvent.noDecay ? 0 : 5 + (G.activeEvent.extraEnergyDecay || 0);
    const thirstLoss = G.activeEvent.noDecay ? 0 : 10 + (G.weather.icon === '☀️' ? 10 : 0) + (G.activeEvent.extraHungerDecay ? 5 : 0);
    const sanityLoss = (G.activeEvent.noDecay || G.camp.structures.includes('fortified')) ? 0 : 5;
    
    p.hunger = clamp(p.hunger - hungerLoss, 0, 100);
    p.energy = clamp(p.energy - energyLoss, 0, 100);
    p.thirst = clamp(p.thirst - thirstLoss, 0, 100);
    p.sanity = clamp(p.sanity - sanityLoss, 0, 100);
    
    if (p.hunger <= 20) p.statuses = addStatus(p.statuses, 'hungry');
    else p.statuses = p.statuses.filter(s => s !== 'hungry');
    
    if (p.energy <= 15) p.statuses = addStatus(p.statuses, 'tired');
    else p.statuses = p.statuses.filter(s => s !== 'tired');
    
    if (p.thirst <= 20) p.statuses = addStatus(p.statuses, 'thirsty');
    else p.statuses = p.statuses.filter(s => s !== 'thirsty');

    if (p.sanity <= 30) {
      p.statuses = addStatus(p.statuses, 'paranoid');
      if (p.isBot && Math.random() < 0.3) {
        addMsg(`😱 ${p.name} เริ่มมีอาการคลั่งเพราะค่าสติ (Sanity) ต่ำ!`, 'bubble-event-bad');
      }
    } else {
      p.statuses = p.statuses.filter(s => s !== 'paranoid');
    }

    if (p.thirst <= 0) {
      p.hp = clamp(p.hp - 10, 0, 100);
      addMsg(`💧 ${p.name} ขาดน้ำรุนแรง! — HP -10`, 'bubble-event-bad');
    }

    if (G.activeEvent.acidRain && !p.atCamp) {
      p.hp = clamp(p.hp - 5, 0, 100);
      addMsg(`🌧️ ฝนกรดกัดกร่อน! ${p.name} เสีย HP -5`, 'bubble-event-bad');
    }

    // Apply wet status effect: 20% chance to become sick (prevented by wetResist) (Bug 16)
    if (p.statuses.includes('wet')) {
      if (!G.activeEvent.wetResist && Math.random() < 0.20) {
        p.statuses = addStatus(p.statuses, 'sick');
        addMsg(`🤒 เพราะตัวเปียกปอนและหนาวเหน็บ ${p.name} จึงล้มป่วยเป็นไข้ป่า!`, 'bubble-event-bad');
      }
    }

    // Apply poison/sick effects
    if (p.statuses.includes('poison')) { p.hp = clamp(p.hp - 15, 0, 100); addMsg(`☠️ ${p.name} ได้รับพิษ — HP -15`, 'bubble-event-bad'); }
    if (p.statuses.includes('sick'))   { p.hp = clamp(p.hp - 8, 0, 100);  p.energy = clamp(p.energy-10,0,100); addMsg(`🤒 ${p.name} กำลังป่วย — HP -8, พลังงาน -10`, 'bubble-event-bad'); }

    if (p.hp <= 0) { killPlayer(pi); return; }

    renderAllPanels();
    updateTurnHeader(pi);
    renderActions(pi);
    addMsg(`🎮 ตาของ ${p.name} — ${p.hoursLeft} ชม. เหลือ`, 'bubble-system');
    
    if (pi === 0) startTurnTimer();
    else stopTurnTimer();

    // ถ้าเป็นบอท ให้เล่นอัตโนมัติหลังจากหน่วงเวลา
    if (p.isBot) {
      setTimeout(() => botChooseAction(pi), 1500 + Math.random() * 1000);
    }
  } catch(err) {
    console.error('Error in startTurn:', err);
    alert('เกิดข้อผิดพลาดในเทิร์น: ' + err.message);
  }
}

function updateTurnHeader(pi) {
  const p = G.players[pi];
  document.getElementById('turn-player-name').textContent = `${p.emoji} ${p.name}`;
  document.getElementById('turn-class-name').textContent = `${p.job.emoji} ${p.job.name} — สกิล: ${p.job.skDesc}`;
  document.getElementById('turn-time-left').innerHTML = `<i class="ti ti-clock" aria-hidden="true"></i> ${p.hoursLeft} ชม. เหลือ`;
  document.getElementById('turn-time-left').style.color = p.hoursLeft < 8 ? 'var(--red2)' : 'var(--blue2)';

  // highlight panel
  G.players.forEach((_,i) => {
    const el = document.getElementById(`panel-p${i}`);
    el.classList.toggle('active', i === pi);
  });

  // Gray-out overlay controls if it's bot's turn (pi !== 0)
  const isUser = (pi === 0);
  const elementsToOverlay = [
    document.getElementById('locations-row'),
    document.getElementById('actions-area'),
    document.getElementById('craft-list')
  ];
  
  elementsToOverlay.forEach(el => {
    if (el) {
      el.classList.toggle('bot-turn-overlay', !isUser);
    }
  });

  const customIn = document.getElementById('custom-in');
  const sendBtn = document.getElementById('send-custom');
  if (customIn) customIn.disabled = !isUser;
  if (sendBtn) sendBtn.disabled = !isUser;
}

function renderActions(pi) {
  const p = G.players[pi];
  const canCraftAny = updateCraftBadge(pi);
  
  const btns = [
    { label:'🌿 สำรวจสถานที่', cost:'ตามสถานที่', action:'explore' },
    { label:'😴 พักผ่อนที่แคมป์', cost:'4 ชม.', action:'rest' },
    { label:'🍽️ กินอาหาร', cost:'1 ชม.', action:'eat' },
    { label:'💊 รักษาตัวเอง', cost:'2 ชม.', action:'heal' },
    { label:`🎁 แบ่งของให้เพื่อน`, cost:'1 ชม.', action:'share' },
    { label:'🔨 คราฟของใช้', cost:'ตามสูตร', action:'craft', badge: canCraftAny },
    { label:`🗡️ ใช้สกิล: ${p.job.skDesc}`, cost:'2 ชม.', action:'skill', highlight:true },
    { label:'🏕️ กลับแคมป์', cost:'2 ชม.', action:'camp' },
  ];

  // Add PVP action only if player has attack skill (thief or soldier)
  const canAttackPvp = p.job.id === 'thief' || p.job.id === 'soldier';
  if (canAttackPvp) {
    btns.splice(7, 0, { label:'⚔️ โจมตีผู้รอดชีวิต', cost:'2 ชม.', action:'pvp', highlight:true });
  }

  // Dynamic actions based on items
  if (p.inventory.includes('ยาพิษ') && p.inventory.some(isFood)) {
    btns.push({ label:'🧪 ผสมยาพิษลงอาหาร', cost:'1 ชม.', action:'poison', highlight:true });
  }
  if (p.inventory.includes('กับดักสัตว์')) {
    btns.push({ label:'🪤 วางกับดักสัตว์', cost:'2 ชม.', action:'place_trap' });
  }
  // แสดงปุ่มปรุงอาหารเมื่อมีกองไฟและมีวัตถุดิบ
  const hasFire = G.camp.structures.includes('campfire') || G.camp.structures.includes('stove');
  const hasCookable = CAMP_RECIPES.some(r => p.inventory.includes(r.input));
  if (hasFire && hasCookable) {
    btns.push({ label:'🍳 ปรุงอาหารที่กองไฟแคมป์', cost:'1 ชม.', action:'cookcamp', highlight:true });
  }
  if (G.day === 7 && (p.inventory.includes('คบเพลิง') || p.inventory.includes('สัญญาณขอความช่วยเหลือ'))) {
    btns.push({ label:'🚁 ส่งสัญญาณกู้ภัย', cost:'2 ชม.', action:'rescue', highlight:true });
  }

  const container = document.getElementById('action-buttons');
  container.innerHTML = '';
  btns.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'act-btn' + (b.highlight ? ' highlight' : '');
    btn.style.position = 'relative';
    btn.innerHTML = `<span>${b.label}</span><span class="act-cost">${b.cost}</span>${b.badge ? '<div class="craft-badge"></div>' : ''}`;
    btn.onclick = () => handleAction(pi, b.action);
    btn.disabled = p.hoursLeft <= 0;
    container.appendChild(btn);
  });
  
  // Update end turn button
  const endBtn = document.getElementById('end-turn-btn');
  if (endBtn) {
    endBtn.onclick = () => endPlayerTurn(pi);
  }
}

function updateCraftBadge(pi) {
  const p = G.players[pi];
  if (!p) return false;
  
  const canCraftAny = CRAFTS.some(c => {
    const inv = [...p.inventory];
    const needs = (p.job && p.job.id === 'engineer') ? c.needs.slice(0, c.needs.length-1) : c.needs;
    const canCraft = needs.every(need => {
      const idx = inv.indexOf(need);
      if (idx > -1) {
        inv.splice(idx, 1);
        return true;
      }
      return false;
    });
    return canCraft && p.hoursLeft >= c.time;
  });

  // UI update: toggle badge visibility
  const craftBtn = document.querySelector('.act-btn[onclick*="craft"]');
  if (craftBtn) {
    let badge = craftBtn.querySelector('.craft-badge');
    if (canCraftAny) {
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'craft-badge';
        craftBtn.appendChild(badge);
      }
    } else {
      if (badge) badge.remove();
    }
  }
  return canCraftAny;
}

function handleAction(pi, action) {
  if (G.isLoading) return;
  const p = G.players[pi];
  
  // Set global loading state to prevent spam clicking
  G.isLoading = true;
  setButtons(true);
  
  if (action === 'cookcamp') {
    if (!p.atCamp) { addMsg('❌ ต้องกลับมาที่แคมป์ก่อนถึงจะปรุงอาหารได้', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    openCampMenu(); G.isLoading = false; setButtons(false); return;
  }
  if (action === 'explore') { showLocationPicker(pi); G.isLoading = false; setButtons(false); return; }
  if (action === 'share') { showShareOverlay(pi); G.isLoading = false; setButtons(false); return; }
  if (action === 'craft') { showCraftPicker(pi); G.isLoading = false; setButtons(false); return; }
  if (action === 'pvp') { showPvpOverlay(pi); G.isLoading = false; setButtons(false); return; }

  let hoursCost = 0;

  if (action === 'rest') {
    hoursCost = 4;
    p.atCamp = true;
    const shelterIdx = p.inventory.indexOf('ที่พักชั่วคราว');
    const hasCampHut = G.camp.structures.includes('hut');
    const hasCampFire = G.camp.structures.includes('campfire');
    let energyBonus = 30;
    let restMsg = `${p.name} พักผ่อนกลางดินกลางดึก — พลังงาน +30`;
    if (hasCampHut) {
      energyBonus = 65;
      restMsg = `🛖 ${p.name} พักในกระท่อมแคมป์ อย่างสบายและปลอดภัย — พลังงาน +65`;
    } else if (shelterIdx > -1) {
      energyBonus = 50;
      p.inventory.splice(shelterIdx, 1);
      restMsg = `🛖 ${p.name} กางที่พักชั่วคราวและพักผ่อนอย่างอบอุ่น — พลังงาน +50`;
    } else if (hasCampFire) {
      energyBonus = 40;
      restMsg = `🔥 ${p.name} นอนผิงกองไฟแคมป์ — พลังงาน +40`;
    }
    
    // PASSIVE: Explorer's Notebook bonus
    if (p.inventory.includes('สมุดบันทึกนักสำรวจ')) {
      energyBonus += 10;
      restMsg += ' (บันทึกประสบการณ์ช่วยให้หลับลึก +10)';
    }

    addMsg(restMsg, 'bubble-player');
    p.energy = clamp(p.energy + energyBonus, 0, 100);
    p.hunger = clamp(p.hunger - 5, 0, 100);
    p.statuses = p.statuses.filter(s => s !== 'tired');
    if (hasCampHut) p.statuses = p.statuses.filter(s => s !== 'wet' && s !== 'cold');
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'eat') {
    const food = p.inventory.find(i => isFood(i) || i === 'อาหารอาบยาพิษ');
    if (!food) { addMsg('❌ ไม่มีอาหารหรือน้ำ', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    hoursCost = 1;
    let toxic = food === 'ผลไม้มีพิษ' || food === 'น้ำเน่า' || food === 'เห็ด' || food === 'อาหารอาบยาพิษ';
    if (G.activeEvent.forestToxin && food === 'ผลไม้') {
      if (Math.random() < 0.5) {
        toxic = true;
        addMsg(`🍄 เห็ดพิษระบาดป่าส่งผลให้ ${food} ที่ทานเข้าไปมีสารพิษปนเปื้อน!`, 'bubble-event-bad');
      }
    }
    const isCook = p.job.id === 'chef';
    p.inventory.splice(p.inventory.indexOf(food), 1);
    
    // RAW FOOD POISONING CHECK (User's Synergy Grid)
    const rawItems = ['ไก่ป่า', 'กระต่าย', 'ค้างคาว', 'กบ', 'กุ้งฝอย', 'หอยเชลล์', 'ปูน้ำจืด', 'ไข่นก', 'ไข่จระเข้', 'แมลง', 'มอสเรืองแสง', 'เนื้อสัตว์', 'ปลา'];
    if (rawItems.includes(food) && !isCook) {
      p.statuses = addStatus(p.statuses, 'sick');
      addMsg(`🤢 ${p.name} กิน ${food} แบบดิบๆ! สารพิษและพยาธิในป่าทำให้ล้มป่วยทันที!`, 'bubble-event-bad');
    }

    let hungerGain = 0, thirstGain = 0, hpGain = 0, energyGain = 0;
    let extraEffect = '';

    switch(food) {
      case 'น้ำสะอาด': thirstGain = 80; break;
      case 'น้ำเน่า': thirstGain = 50; break;
      case 'ผลไม้': hungerGain = 15; thirstGain = 15; break;
      case 'ผลไม้มีพิษ': hungerGain = 15; thirstGain = 15; break;
      case 'เห็ด': hungerGain = 15; break;
      case 'ปลา': hungerGain = 25; break;
      case 'ปลาย่าง': hungerGain = 40; hpGain = 5; break;
      case 'กบ': hungerGain = 20; break;
      case 'แมลง': hungerGain = 10; energyGain = 5; break;
      case 'ไข่': case 'ไข่นก': hungerGain = 20; hpGain = 5; break;
      case 'เนื้อสัตว์': hungerGain = 35; break;
      case 'เนื้อย่าง': hungerGain = 50; hpGain = 8; break;
      case 'กระต่าย': case 'ไก่ป่า': hungerGain = 25; break;
      case 'อาหารกระป๋อง': hungerGain = 35; break;
      case 'อาหารอุ่น': hungerGain = 55; hpGain = 12; break;
      case 'ยาบำรุง': hpGain = 35; hungerGain = 20; break;
      case 'ซุปเห็ด': hungerGain = 35; energyGain = 25; break;
      case 'รวงผึ้ง': hungerGain = 20; energyGain = 20; extraEffect = ' (น้ำผึ้งหวานช่วยฟื้นพลังงาน)'; break;
      case 'กุ้งฝอย': case 'หอยเชลล์': case 'ปูน้ำจืด': hungerGain = 15; thirstGain = 10; break;
      case 'กุ้งมังกรป่า': hungerGain = 50; hpGain = 15; break;
      case 'มุกน้ำจืด': hpGain = 20; energyGain = 15; extraEffect = ' (มุกบดช่วยบำรุงกาย)'; break;
      case 'ไข่จระเข้': hungerGain = 45; hpGain = 20; break;
      case 'หม้อไฟป่า': {
        G.players.forEach(p2 => {
          if (p2.alive) {
            p2.hp = 100; p2.hunger = 100; p2.thirst = 100;
            p2.statuses = p2.statuses.filter(s => s !== 'sick' && s !== 'hungry' && s !== 'thirsty');
          }
        });
        addMsg(`🍲 **หม้อไฟป่ามหาบำบัด!** ทุกคนในแคมป์ HP/Hunger/Thirst เต็ม และหายป่วยทันที!`, 'bubble-event-good');
        renderAllPanels();
        spendTime(pi, 1);
        return;
      }
      case 'ซุปสมาธิ': hungerGain = 20; hpGain = 10; p.sanity = clamp(p.sanity + 50, 0, 100); extraEffect = ' (Sanity +50)'; break;
      default: hungerGain = 20;
    }
    
    if (isCook && hungerGain > 0) hungerGain = Math.ceil(hungerGain * 1.5);
    if (isCook && hpGain > 0) hpGain = Math.ceil(hpGain * 1.5);
    
    p.hunger = clamp(p.hunger + hungerGain, 0, 100);
    p.thirst = clamp(p.thirst + thirstGain, 0, 100);
    p.hp = clamp(p.hp + hpGain, 0, 100);
    p.energy = clamp(p.energy + energyGain, 0, 100);
    
    if (p.hunger > 20) p.statuses = p.statuses.filter(s => s !== 'hungry');
    if (p.thirst > 20) p.statuses = p.statuses.filter(s => s !== 'thirsty');
    
    if (food === 'น้ำสะอาด' && G.activeEvent.waterPoison) {
      p.statuses = addStatus(p.statuses, 'poison');
      addMsg(`💧 ${p.name} ดื่มน้ำสะอาดแต่วันนี้น้ำปนเปื้อน! ติดพิษ! ☠️`, 'bubble-event-bad');
    } else if (toxic) {
      if (isCook && food !== 'อาหารอาบยาพิษ') {
        addMsg(`${p.name} ปรุง ${food} อย่างชาญฉลาดจนปลอดพิษและอิ่มอร่อย!`, 'bubble-event-good');
      } else {
        p.statuses = addStatus(p.statuses, 'poison');
        addMsg(`${p.name} บริโภค ${food === 'อาหารอาบยาพิษ' ? 'อาหาร' : food} — ทันใดนั้นเกิดอาการเป็นพิษ! ☠️`, 'bubble-event-bad');
      }
    } else {
      let msg = `${p.name} บริโภค ${food}${extraEffect}`;
      addMsg(msg, 'bubble-player');
    }
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'heal') {
    hoursCost = 2;
    const isDoc = p.job.id === 'doctor';
    const herb = p.inventory.find(i => i === 'สมุนไพร' || i === 'สมุนไพรหายาก' || i === 'ยาสมุนไพร');
    if (!herb && !isDoc) { addMsg('❌ ไม่มีสมุนไพรหรือยา', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    if (!isDoc && herb) p.inventory.splice(p.inventory.indexOf(herb),1);
    p.hp = clamp(p.hp + 20, 0, 100);
    p.statuses = p.statuses.filter(s => s !== 'sick' && s !== 'poison' && s !== 'injured');
    addMsg(`${p.name} รักษาตัวเอง — HP +20, อาการป่วยหาย${isDoc?' (สกิลหมอ)':''}`, 'bubble-event-good');
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'camp') {
    hoursCost = 2;
    p.atCamp = true;
    addMsg(`${p.name} กลับแคมป์แล้ว`, 'bubble-player');
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'skill') {
    doSkillAction(pi);
    return;
  }
  if (action === 'poison') {
    const foods = p.inventory.filter(isFood);
    if (!foods.length) { addMsg('❌ ไม่มีอาหารที่ผสมพิษได้', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    
    let html = '<div style="padding:12px 16px;">';
    html += '<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px;">🧪 เลือกอาหารที่ต้องการผสมยาพิษ</div>';
    foods.forEach(f => {
      html += `<div style="padding:7px;background:var(--bg4);border:0.5px solid var(--border);border-radius:5px;margin-bottom:5px;cursor:pointer;"
        onclick="doPoisonFood(${pi}, '${f}');closeShare()">
        <div style="font-size:12px;color:var(--text);">${f}</div>
      </div>`;
    });
    html += '<button class="share-close" style="margin-top:8px" onclick="closeShare()">ปิด</button></div>';
    document.getElementById('share-title').textContent = '';
    document.getElementById('share-target-list').innerHTML = html;
    document.getElementById('share-overlay').style.display = 'flex';
    // Keep loading state until selection
    return;
  }
  if (action === 'place_trap') {
    const trapIdx = p.inventory.indexOf('กับดักสัตว์');
    if (trapIdx === -1) { addMsg('❌ ไม่มีกับดักสัตว์', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    p.inventory.splice(trapIdx, 1);
    G.activeTraps.push({ playerIndex: pi });
    addMsg(`🪤 ${p.name} ได้วางกับดักสัตว์ไว้รอบแคมป์! กับดักจะจับสัตว์ออโต้เมื่อสิ้นสุดวัน`, 'bubble-event-good');
    spendTime(pi, 2);
    return;
  }
  if (action === 'rescue') {
    const hasSignal = p.inventory.includes('สัญญาณขอความช่วยเหลือ');
    const hasTorch = p.inventory.includes('คบเพลิง');
    const hasRadio = p.inventory.includes('วิทยุกู้ภัย SOS');
    if (!hasSignal && !hasTorch && !hasRadio) { addMsg('❌ ไม่มีอุปกรณ์ส่งสัญญาณ (ต้องใช้ คบเพลิง, สัญญาณขอความช่วยเหลือ หรือ วิทยุกู้ภัย SOS)', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    
    addMsg(`🚁 ${p.name} ส่งสัญญาณกู้ภัยขึ้นสู่ท้องฟ้าอย่างเต็มที่!`, 'bubble-player');
    let chance = 0.2;
    if (hasRadio) chance = 1.0; // 100% win with Rescue Radio
    else {
      if (hasSignal) chance += 0.45;
      if (hasTorch) chance += 0.15;
      if (G.camp.structures.includes('tower')) chance += 0.25;
      if (G.activeEvent.rescueDay) chance += 0.25;
      const trustBonus = Math.min(p.trust / 100, 0.25);
      chance += trustBonus;
      
      const hasOpenArea = G.locations.some(l => l.explored.includes(pi) && (l.id === 'cliff' || l.id === 'meadow'));
      if (hasOpenArea) chance += 0.15;
    }

    recordRescueAttempt(pi, chance);
    
    setTimeout(() => {
      G.isLoading = false;
      setButtons(false);
      if (Math.random() < chance) {
        G.rescueData.success = true;
        addMsg(`✨ เฮลิคอปเตอร์กู้ภัยมองเห็นสัญญาณของคุณ! ทีมช่วยเหลือกำลังร่อนลง... ทุกคนรอดชีวิตแล้ว!`, 'bubble-event-good');
        setTimeout(() => gameEnd(true), 1500);
      } else {
        addMsg(`💨 เสียงเครื่องบินค่อยๆ ลับหายไป... ไม่มีใครมองเห็นสัญญาณกู้ภัยในวันนี้`, 'bubble-event-bad');
        spendTime(pi, 2);
      }
    }, 2000);
    return;
  }
}

function doPoisonFood(pi, foodName) {
  const p = G.players[pi];
  const poisonIdx = p.inventory.indexOf('ยาพิษ');
  const foodIdx = p.inventory.indexOf(foodName);
  if (poisonIdx > -1 && foodIdx > -1) {
    p.inventory.splice(poisonIdx, 1);
    p.inventory.splice(p.inventory.indexOf(foodName), 1);
    addToInventory(pi, 'อาหารอาบยาพิษ');
    addMsg(`🧪 ${p.name} ได้แอบผสมยาพิษลงใน ${foodName} เรียบร้อยแล้ว!`, 'bubble-event-good');
    renderAllPanels();
    spendTime(pi, 1);
  }
}

// ===================== BOT AI =====================
function botChooseAction(pi) {
  const p = G.players[pi];
  if (!p.alive || G.dayDone[pi]) { nextTurn(); return; }
  
  if (G.isLoading) { 
    setTimeout(() => botChooseAction(pi), 800);
    return; 
  }

  // 1. Heal if low HP
  if (p.hp < 40 && (p.job.id === 'doctor' || p.inventory.find(i => i === 'สมุนไพร' || i === 'สมุนไพรหายาก' || i === 'ยาสมุนไพร'))) {
    handleAction(pi, 'heal');
    return;
  }

  // 2. Eat/Drink if extremely low
  if ((p.hunger < 30 || p.thirst < 30) && p.inventory.find(i => isFood(i))) {
    handleAction(pi, 'eat');
    return;
  }

  // 3. Special Map Event - Bot chooses to explore if has required item and enough time
  if (G.mapEvent && !G.mapEvent.explored && p.hoursLeft >= G.mapEvent.time + 3) {
    if (p.inventory.includes(G.mapEvent.requiredItem) || Math.random() < 0.2) {
      exploreMapEvent(pi);
      return;
    }
  }

  // 4. Return to camp if hours are running low and not at camp
  if (!p.atCamp && p.hoursLeft <= 3) {
    handleAction(pi, 'camp');
    return;
  }

  // 5. Rest if tired and already at camp
  if (p.atCamp && p.energy < 30 && p.hoursLeft >= 4) {
    handleAction(pi, 'rest');
    return;
  }

  /**
   * BUG-06: แก้ไขการตรวจ hoursLeft ของ Bot ให้ถูกต้องตามเวลาสถานที่จริง
   */
  const unexplored = G.locations.findIndex(loc => !loc.explored.includes(pi) && !loc.blocked);
  if (unexplored !== -1) {
    const loc = G.locations[unexplored];
    if (p.hoursLeft >= loc.time + 3) {
      exploreLocation(pi, unexplored);
      return;
    }
  }

  // 6. Use thief skill
  if (p.job.id === 'thief' && !p.skillUsed && p.hoursLeft >= 2) {
    doSkillAction(pi);
    return;
  }

  // 7. Bot Camp Actions (Build, Cook, Store)
  if (p.atCamp && p.hoursLeft >= 2) {
    if (botCampAction(pi)) return;
  }

  // NEW: 8. Independent thought for Bots (Custom Actions)
  if (p.hoursLeft >= 5 && Math.random() < 0.7) {
    const customPrompts = [
      `พยายามขุดดินหาสมบัติหรือของเก่าใกล้แคมป์`,
      `ลองปีนต้นไม้สูงเพื่อมองหาควันไฟหรือสัญญาณคนอื่น`,
      `พยายามซ่อมแซมอุปกรณ์ที่พังหรือดัดแปลงของในตัว`,
      `เดินสำรวจรอบๆ แคมป์เพื่อวางกับดักธรรมชาติ`,
      `ลองหาพืชแปลกๆ มาทดสอบว่าเป็นยารักษาได้ไหม`,
      `พยายามแกะรอยสัตว์ขนาดใหญ่เพื่อหาแหล่งที่อยู่ของมัน`,
      `รวบรวมก้อนหินมาเรียงเป็นสัญลักษณ์ขอความช่วยเหลือขนาดใหญ่`
    ];
    const action = customPrompts[Math.floor(Math.random() * customPrompts.length)];
    addMsg(`${p.emoji} ${p.name}: [ตัดสินใจอิสระ] ${action}`, 'bubble-player');
    callAI(pi, action, 4);
    return;
  }

  // 9. If already at camp, end turn
  if (p.atCamp) {
    endPlayerTurn(pi);
    return;
  }

  // 10. Not at camp and not enough time to explore — go back to camp
  handleAction(pi, 'camp');
}

function getInventoryLimit(p) {
  if (!p) return 5;
  return p.inventory.includes('กระเป๋าคาดเอว') ? 7 : 5;
}

function addToInventory(pi, item) {
  const p = G.players[pi];
  const limit = getInventoryLimit(p);
  if (p.inventory.length >= limit) {
    addMsg(`🎒 กระเป๋าของ ${p.name} เต็มแล้ว! (ลิมิต ${limit} ชิ้น) — ${item} ถูกทิ้งลงพื้น`, 'bubble-event-bad');
    // If it's human, we could also consider dropping it to camp storage if they are at camp
    if (p.atCamp) {
      G.camp.sharedItems.push(item);
      addMsg(`📦 ${item} ถูกเก็บเข้าคลังแคมป์แทน`, 'bubble-system');
      updateCampUI();
    }
    return false;
  }
  p.inventory.push(item);
  renderAllPanels();
  return true;
}

function botCampAction(pi) {
  const p = G.players[pi];
  const isEngineer = p.job && p.job.id === 'engineer';
  const limit = getInventoryLimit(p);
  
  // A. Build structure if materials exist
  const buildable = CAMP_STRUCTURES.find(s => !G.camp.structures.includes(s.id) && s.needs.every(item => p.inventory.includes(item)) && p.hoursLeft >= s.time);
  if (buildable) {
    doBuildCampStructure(pi, buildable.id, buildable.name);
    return true;
  }
  
  // B. Craft useful items if materials exist
  const craftable = CRAFTS.find(c => {
    const needs = isEngineer ? c.needs.slice(0, c.needs.length-1) : c.needs;
    return needs.every(mat => p.inventory.includes(mat)) && p.hoursLeft >= c.time;
  });
  if (craftable) {
    doCraft(pi, craftable.name);
    return true;
  }

  // C. Cook food if has materials + fire
  const hasFire = G.camp.structures.includes('campfire') || G.camp.structures.includes('stove');
  if (hasFire && p.hoursLeft >= 1) {
    const cookable = CAMP_RECIPES.find(r => p.inventory.includes(r.input));
    if (cookable) {
      doCookFood(pi, cookable.input, cookable.output, cookable.hungerGain, cookable.hpGain);
      return true;
    }
  }

  // D. Store excess items (not food/weapon) - ONLY if at camp
  if (p.atCamp) {
    if (p.inventory.length > (limit - 1)) {
      const nonEssentials = p.inventory.filter(item => !isFood(item) && !['หอก','มีด','ยาพิษ','กับดักสัตว์','คบเพลิง','เครื่องกลั่นน้ำ','เชือกยาว','ชุดปฐมพยาบาล','ขวานเหล็ก'].includes(item));
      if (nonEssentials.length > 0) {
        const item = nonEssentials[0];
        const idx = p.inventory.indexOf(item);
        if (idx > -1) {
          p.inventory.splice(idx, 1);
          G.camp.sharedItems.push(item);
          addMsg(`📦 ${p.name} ฝาก ${item} ไว้ในคลังแคมป์`, 'bubble-system');
          updateCampUI();
          renderAllPanels();
          spendTime(pi, 0); // Small delay to continue bot turn
          return true;
        }
      }
    }

    // E. Take essentials from camp if needed (e.g. food/heal)
    if (p.inventory.length < limit) {
      const needFood = p.hunger < 50 || p.thirst < 50;
      const needHeal = p.hp < 60;
      const takeableIdx = G.camp.sharedItems.findIndex(item => {
        if (needFood && isFood(item)) return true;
        if (needHeal && (item === 'สมุนไพร' || item === 'สมุนไพรหายาก' || item === 'ยาสมุนไพร')) return true;
        return false;
      });

      if (takeableIdx > -1) {
        const item = G.camp.sharedItems[takeableIdx];
        G.camp.sharedItems.splice(takeableIdx, 1);
        addToInventory(pi, item);
        addMsg(`🎒 ${p.name} หยิบ ${item} ออกจากคลังแคมป์`, 'bubble-system');
        updateCampUI();
        spendTime(pi, 0);
        return true;
      }
    }
  }

  return false;
}

function endPlayerTurn(pi) {
  stopTurnTimer();
  const p = G.players[pi];
  if (!p.atCamp) {
    addMsg(`🌙 ${p.name} ไม่ได้กลับแคมป์! — พลังงานลดถาวร -10 พรุ่งนี้`, 'bubble-event-bad');
    p.energy = clamp(p.energy - 10, 0, 100);
    p.statuses = addStatus(p.statuses, 'tired');
  }
  G.dayDone[pi] = true;
  addMsg(`⏰ ${p.name} จบเทิร์นแล้ว`, 'bubble-system');
  nextTurn();
}

function doSkillAction(pi) {
  const p = G.players[pi];
  if (p.skillUsed) { 
    addMsg(`❌ ${p.name} ได้ใช้สกิลของอาชีพนี้ไปแล้ว (ใช้ได้ 1 ครั้ง/เกม)`, 'bubble-system'); 
    spendTime(pi, 0);
    return; 
  }
  
  let hoursCost = 2;
  switch (p.job.id) {
    case 'hunter': {
      const animals = ['กวาง', 'หมูป่า', 'ไก่ป่า'];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      addToInventory(pi, 'เนื้อสัตว์');
      addToInventory(pi, 'เนื้อสัตว์');
      addMsg(`🏹 ${p.name} ใช้สกิลนักล่า — ล่า${animal}ได้สำเร็จทันที! ได้รับเนื้อสัตว์ 2 ชิ้น 🥩🥩`, 'bubble-event-good');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'doctor': {
      G.players.forEach((p2, idx) => {
        if (p2.alive) {
          p2.hp = clamp(p2.hp + 50, 0, 100);
          p2.statuses = p2.statuses.filter(s => s !== 'sick' && s !== 'poison' && s !== 'injured');
          if (idx !== pi) {
            adjustTrust(idx, 4, 'การรักษาโดยหมอ');
          }
        }
      });
      addMsg(`🩺 ${p.name} ใช้สกิลหมอ — รักษาทุกคนในกลุ่มอย่างเต็มที่! HP +50 และล้างสถานะผิดปกติ`, 'bubble-event-good');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'thief': {
      if (p.skillUsed) { 
        addMsg(`❌ ${p.name} ได้ใช้สกิลโจรไปแล้ว`, 'bubble-system'); 
        spendTime(pi, 0); 
        break; 
      }
      const victims = G.players.filter((p2,i)=>i!==pi && p2.alive && p2.inventory.length);
      if (victims.length) {
        let stolenCount = 0;
        for (let i=0; i<2; i++) {
          const v = victims[Math.floor(Math.random() * victims.length)];
          if (v.inventory.length) {
            const item = v.inventory.splice(Math.floor(Math.random() * v.inventory.length), 1)[0];
            addToInventory(pi, item);
            stolenCount++;
          }
        }
        addMsg(`🗡️ ${p.name} ใช้สกิลโจร — ขโมยไอเทมมาได้ ${stolenCount} ชิ้น!`, 'bubble-event-bad');
        p.skillUsed = true;
        G.thiefUsed[pi] = true;
        renderAllPanels();
        spendTime(pi, hoursCost);
      } else {
        addMsg('ไม่มีใครให้ขโมย', 'bubble-system');
        p.skillUsed = true;
        G.thiefUsed[pi] = true;
        spendTime(pi, 0);
      }
      break;
    }
    case 'chef': {
      for(let i=0; i<3; i++) addToInventory(pi, 'อาหารอุ่น');
      addMsg(`🍳 ${p.name} ใช้สกิลพ่อครัว — เสกอาหารอุ่น 3 กล่องให้ทีม!`, 'bubble-event-good');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'scout': {
      let scoutText = `🧭 ${p.name} สแกนพื้นที่ในวันนี้:\n`;
      G.locations.forEach(loc => {
        scoutText += `• ${loc.name}: มี ${loc.loot.slice(0,3).join(', ')}...\n`;
      });
      addMsg(scoutText, 'bubble-player');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'soldier': {
      if (p.atCamp) { 
        addMsg('❌ ต้องอยู่ในพื้นที่ป่าเพื่อใช้สกิลนี้', 'bubble-system'); 
        spendTime(pi, 0); // Always call spendTime to avoid freeze
        return; 
      }
      addMsg(`⚔️ ${p.name} ใช้สกิลทหาร — เคลียร์พื้นที่ปัจจุบันให้ปลอดภัย! สัตว์ป่าจะถูกกำจัด`, 'bubble-event-good');
      addToInventory(pi, 'เนื้อสัตว์');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'shaman': {
      const futureWeather = Array.from({length:3}, () => WEATHER_TYPES[Math.floor(Math.random()*WEATHER_TYPES.length)]);
      let msg = `🪄 ${p.name} หยั่งรู้สภาพอากาศ 3 วันข้างหน้า:\n`;
      futureWeather.forEach((w, i) => msg += `• วันที่ ${G.day+i+1}: ${w.icon} ${w.text}\n`);
      addMsg(msg, 'bubble-player');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    case 'engineer': {
      const buildable = CAMP_STRUCTURES.find(s => !G.camp.structures.includes(s.id));
      if (buildable && p.atCamp) {
        G.camp.structures.push(buildable.id);
        addMsg(`🔨 วิศวกรสร้าง ${buildable.name} สำเร็จทันที!`, 'bubble-event-good');
        p.skillUsed = true;
        updateCampUI();
        spendTime(pi, hoursCost);
      } else {
        addMsg('❌ ต้องอยู่ที่แคมป์เพื่อสร้าง', 'bubble-system');
        spendTime(pi, 0);
      }
      break;
    }
    case 'merchant': {
      // Merchant can trade up to 3 items from inventory with camp storage instantly
      if (p.atCamp && G.camp.sharedItems.length > 0 && p.inventory.length > 0) {
        let tradeCount = 0;
        for (let i=0; i<3; i++) {
          if (p.inventory.length > 0 && G.camp.sharedItems.length > 0) {
            const myItem = p.inventory.splice(0,1)[0];
            const campItem = G.camp.sharedItems.splice(Math.floor(Math.random()*G.camp.sharedItems.length), 1)[0];
            G.camp.sharedItems.push(myItem);
            addToInventory(pi, campItem);
            tradeCount++;
          }
        }
        addMsg(`💰 ${p.name} ใช้สกิลพ่อค้า — แลกเปลี่ยนไอเทมฉุกเฉินกับคลังแคมป์ ${tradeCount} ชิ้น!`, 'bubble-event-good');
        p.skillUsed = true;
        updateCampUI();
        spendTime(pi, hoursCost);
      } else {
        addMsg('❌ ต้องอยู่ที่แคมป์และมีของในคลังแคมป์เพื่อแลกเปลี่ยน', 'bubble-system');
        spendTime(pi, 0);
      }
      break;
    }
    case 'spy': {
      G.players.forEach(p2 => {
        addMsg(`🕵️ [สายลับ] ${p2.name} คือ ${p2.job.name} — ของ: ${p2.inventory.join(',')||'ไม่มี'}`, 'bubble-player');
      });
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
    default: {
      addMsg(`${p.name} ใช้สกิล ${p.job.name}`, 'bubble-player');
      p.skillUsed = true;
      spendTime(pi, hoursCost);
      break;
    }
  }
}

function showLocationPicker(pi) {
  const p = G.players[pi];
  const container = document.getElementById('locations-row');
  G.locations.forEach((loc, li) => {
    const el = document.getElementById(`loc-${li}`);
    if (!el) return;
    el.onclick = () => exploreLocation(pi, li);
    el.classList.toggle('explored', loc.explored.includes(pi));
  });
  addMsg('เลือกสถานที่สำรวจ 👆', 'bubble-system');
}

function exploreLocation(pi, li) {
  const p = G.players[pi];
  const loc = G.locations[li];
  if (!loc || loc.explored.includes(pi)) return;

  if (loc.blocked) { 
    addMsg(`⛔ ${loc.name} ถูกปิดไม่สามารถสำรวจได้ในวันนี้`, 'bubble-system'); 
    // If bot, force it to choose another action instead of stalling
    if (p.isBot) {
        spendTime(pi, 0); 
    }
    return; 
  }

  let hoursCost = loc.time;
  if (p.job.id === 'scout') hoursCost = Math.max(1, hoursCost - 2); // Scout bonus
  
  // PASSIVE: Travel items
  if (p.inventory.includes('ชุดแผนที่นำทาง')) {
    hoursCost = Math.max(1, hoursCost - 3);
    addMsg(`🗺️ "ชุดแผนที่นำทาง" ช่วยให้คุณรู้เส้นทางลัดและจุดปลอดภัย! (-3 ชม.)`, 'bubble-system');
  } else if (p.inventory.includes('เข็มทิศทองคำ')) {
    hoursCost = Math.max(1, hoursCost - 2);
    addMsg(`🧭 เข็มทิศทองคำช่วยย่อระยะทาง! (-2 ชม.)`, 'bubble-system');
  } else if (p.inventory.includes('สมุดบันทึกนักสำรวจ')) {
    hoursCost = Math.max(1, hoursCost - 1);
    addMsg(`📒 สมุดบันทึกมีแผนที่คร่าวๆ ช่วยให้เดินทางเร็วขึ้น (-1 ชม.)`, 'bubble-system');
  }

  if (p.hoursLeft < hoursCost) { addMsg(`⏰ เวลาไม่พอสำรวจ ${loc.name} (ต้องการ ${hoursCost} ชม.)`, 'bubble-system'); return; }

  p.atCamp = false;
  loc.explored.push(pi);
  
  if (p.isBot) {
    botExploreLocation(pi, li, hoursCost);
    return;
  }

  const prompt = `${p.name} สำรวจ${loc.name} — อาชีพ: ${p.job.name} — พลังงาน:${p.energy}% — สภาพอากาศ:${G.weather.text}`;
  callAI(pi, prompt, hoursCost, { loc });
}

function exploreMapEvent(pi) {
  const p = G.players[pi];
  const m = G.mapEvent;
  if (!m || m.explored) return;

  let hoursCost = m.time;
  if (p.job.id === 'scout') hoursCost = Math.max(1, hoursCost - 3);
  
  // PASSIVE: Travel items for map event
  if (p.inventory.includes('เข็มทิศทองคำ')) {
    hoursCost = Math.max(1, hoursCost - 3); // Better bonus for map event
  } else if (p.inventory.includes('สมุดบันทึกนักสำรวจ')) {
    hoursCost = Math.max(1, hoursCost - 1);
  }

  if (p.hoursLeft < hoursCost) {
    if (pi === 0) addMsg(`⏰ เวลาไม่พอสำรวจ ${m.name} (ต้องการ ${hoursCost} ชม.)`, 'bubble-system');
    return;
  }

  const hasItem = p.inventory.includes(m.requiredItem);
  if (pi === 0 && !hasItem) {
    showMapConfirm(pi, m, hoursCost);
    return;
  }

  doExploreMapEvent(pi, m, hoursCost, hasItem);
}

function showMapConfirm(pi, m, hoursCost) {
  const overlay = document.getElementById('map-confirm-overlay');
  const desc = document.getElementById('map-confirm-desc');
  desc.innerHTML = `⚠️ คุณไม่มี <b>"${m.requiredItem}"</b> การฝืนเข้าไปสำรวจ <b>"${m.name}"</b> จะอันตรายมากและเสีย HP สูง (ประมาณ -40 HP)<br><br>ยืนยันจะสำรวจหรือไม่?`;
  
  document.getElementById('map-confirm-yes').onclick = () => {
    overlay.style.display = 'none';
    doExploreMapEvent(pi, m, hoursCost, false);
  };
  overlay.style.display = 'flex';
}

function closeMapConfirm() {
  document.getElementById('map-confirm-overlay').style.display = 'none';
}

function doExploreMapEvent(pi, m, hoursCost, hasItem) {
  const p = G.players[pi];
  p.atCamp = false;
  m.explored = true;
  m.exploredBy = pi;

  if (p.isBot) {
    addMsg(`${p.emoji} ${p.name}: ตัดสินใจสำรวจ ${m.name}!`, 'bubble-player');
    let penalty = !hasItem ? 40 : 10;
    if (G.activeEvent.animalHpMult) {
      penalty = Math.round(penalty * G.activeEvent.animalHpMult);
    }
    if (G.activeEvent.injureRisk) {
      penalty += 15;
      if (Math.random() < 0.5) {
        p.statuses = addStatus(p.statuses, 'injured');
      }
    }
    penalty = Math.min(penalty, 50); // cap max penalty to 50 HP (Bug 13)
    p.hp = clamp(p.hp - penalty, 0, 100);
    p.energy = clamp(p.energy - 20, 0, 100);
    
    const lootCount = hasItem ? 3 : 1;
    let finalLoot = [];
    for(let i=0; i<lootCount; i++) {
      finalLoot.push(m.loot[Math.floor(Math.random() * m.loot.length)]);
    }
    
    finalLoot.forEach(item => addToInventory(pi, item));
    addMsg(`${p.name} สำรวจ ${m.name} สำเร็จ! ${!hasItem ? 'แต่ได้รับบาดเจ็บสาหัสจากการฝืนเข้า' : ''}`, 'bubble-narrator');
    
    renderLocations();
    spendTime(pi, hoursCost);
    return;
  }

  const prompt = `${p.name} สำรวจพื้นที่พิเศษ: ${m.name} — ${!hasItem ? 'ฝืนเข้าไปโดยไม่มี ' + m.requiredItem : 'ใช้อุปกรณ์ ' + m.requiredItem + ' เข้าไป'} — ต้องการของดีที่สุดในนี้`;
  callAI(pi, prompt, hoursCost, { loc: m });
}

function botExploreLocation(pi, li, hoursCost) {
  const p = G.players[pi];
  const loc = G.locations[li];
  
  addMsg(`${p.emoji} ${p.name}: สำรวจ${loc.name}`, 'bubble-player');
  
  const outcomes = [
    { story: `${p.name} เดินเข้าไปใน${loc.name} อย่างระมัดระวัง`, hp: 0, hunger: -5, energy: -8, loot: [], wild: null, event: 'none' },
    { story: `${p.name} พบสิ่งที่น่าสนใจใน${loc.name}!`, hp: 0, hunger: 0, energy: -10, loot: [loc.loot[Math.floor(Math.random()*loc.loot.length)]], wild: null, event: 'good' },
    { story: `${p.name} ได้รับบาดเจ็บเล็กน้อยระหว่างสำรวจ`, hp: -15, hunger: -3, energy: -12, loot: [], wild: loc.wild[Math.floor(Math.random()*loc.wild.length)], event: 'bad' },
    { story: `${p.name} หาของได้หลายชิ้น แต่ถูกสัตว์ป่าไล่ต่อ!`, hp: -10, hunger: -5, energy: -15, loot: [loc.loot[Math.floor(Math.random()*loc.loot.length)]], wild: loc.wild[Math.floor(Math.random()*loc.wild.length)], event: 'bad' },
    { story: `${p.name} มีความโชคดี พบสิ่งของราคาแพง!`, hp: 0, hunger: -2, energy: -8, loot: [loc.loot[Math.floor(Math.random()*loc.loot.length)], loc.loot[Math.floor(Math.random()*loc.loot.length)]], wild: null, event: 'good' },
  ];
  
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  let hpDelta = outcome.hp;
  let energyDelta = outcome.energy;
  
  if (p.job.id === 'soldier' && outcome.wild) hpDelta = Math.ceil(hpDelta * 0.5);
  if (p.job.id === 'scout') energyDelta = Math.ceil(energyDelta * 0.7);
  
  // Apply wetRisk and injureRisk status effects during exploration
  if (G.activeEvent.wetRisk && Math.random() < 0.5) {
    p.statuses = addStatus(p.statuses, 'wet');
    addMsg(`🌧️ พายุฝนทำให้ ${p.name} ตัวเปียกปอนระหว่างสำรวจ!`, 'bubble-event-bad');
  }
  if (G.activeEvent.injureRisk && Math.random() < 0.35) {
    p.statuses = addStatus(p.statuses, 'injured');
    hpDelta -= 10;
    addMsg(`🌪️ พายุทรายรุนแรงทำให้ ${p.name} ได้รับบาดเจ็บ! HP -10 🩸`, 'bubble-event-bad');
  }

  let finalLoot = [...outcome.loot];
  if (p.job.id === 'hunter' && Math.random() < 0.3) {
    finalLoot.push(loc.loot[Math.floor(Math.random()*loc.loot.length)]);
  }
  
  // Rare loot chance!
  if (Math.random() < 0.15) {
    const rareLoot = ['ชุดปฐมพยาบาล','สมุดบันทึกนักสำรวจ','มีดพกพับ','เข็มทิศทองคำ','ขวานเหล็ก'][Math.floor(Math.random()*5)];
    finalLoot.push(rareLoot);
    addMsg(`✨ ${p.name} พบไอเทมหายาก: ${rareLoot}!`, 'bubble-event-good');
  }
  
  // Extra loot event bonus (Bug 14)
  if (loc.extraLoot) {
    const extra = loc.loot[Math.floor(Math.random() * loc.loot.length)];
    finalLoot.push(extra);
  }
  // Herb easy event bonus (Bug 15)
  if (loc.herbEasy && Math.random() < 0.5) {
    const herb = loc.loot.find(item => ['สมุนไพรหายาก', 'สมุนไพร', 'ดอกไม้ยา'].includes(item)) || 'สมุนไพร';
    finalLoot.push(herb);
  }

  // WATER DROP RATE BOOST (Bug 9 - Only at water sources, 40% chance)
  const isWaterSource = loc && ['river', 'waterfall', 'swamp'].includes(loc.id);
  if (isWaterSource && Math.random() < 0.4) {
      finalLoot.push('น้ำสะอาด');
      addMsg(`💧 ${p.name} เจอแหล่งน้ำสะอาดระหว่างสำรวจ!`, 'bubble-event-good');
  }

  p.hp = clamp(p.hp + hpDelta, 0, 100);
  p.energy = clamp(p.energy + energyDelta, 0, 100);
  p.hunger = clamp(p.hunger + outcome.hunger, 0, 100);
  
  if (finalLoot.length) {
    finalLoot.forEach(item => addToInventory(pi, item));
    addMsg(`🎒 ได้รับ: ${finalLoot.join(', ')}`, 'bubble-event-good');
  }
  
  addMsg(outcome.story, 'bubble-narrator');
  
  if (outcome.wild) {
    addWildlife(`${p.name} เจอ ${outcome.wild}`);
    const hasSpear = p.inventory.includes('หอก');
    const hasKnife = p.inventory.includes('มีด');
    const botDmgMult = G.activeEvent.animalHpMult || 1;
    
    if (hasSpear) {
      addMsg(`⚔️ ${p.name} ใช้หอกต่อสู้และกำจัด ${outcome.wild} ได้สำเร็จ! ได้รับเนื้อสัตว์ 🥩`, 'bubble-event-good');
      addToInventory(pi, 'เนื้อสัตว์');
      p.stats.animalsDefeated++;
    } else if (hasKnife) {
      const dmg = Math.round((p.job.id === 'soldier' ? 4 : 8) * botDmgMult);
      p.hp = clamp(p.hp - dmg, 0, 100);
      p.stats.damageTaken += dmg;
      addMsg(`⚔️ ${p.name} ใช้มีดต่อสู้และกำจัด ${outcome.wild} ได้สำเร็จ! (สูญเสีย HP -${dmg}) ได้รับเนื้อสัตว์ 🥩`, 'bubble-event-good');
      addToInventory(pi, 'เนื้อสัตว์');
      p.stats.animalsDefeated++;
    } else {
      if (Math.random() < 0.5) {
        p.energy = clamp(p.energy - 10, 0, 100);
        addMsg(`🏃 ${p.name} ตัดสินใจวิ่งหนีจาก ${outcome.wild}!`, 'bubble-player');
      } else {
        const dmg = Math.round((p.job.id === 'soldier' ? 10 : 20) * botDmgMult);
        p.hp = clamp(p.hp - dmg, 0, 100);
        p.stats.damageTaken += dmg;
        addMsg(`👊 ${p.name} ต่อสู้กับ ${outcome.wild} ด้วยมือเปล่า! ได้รับความเสียหาย ${dmg} หน่วย`, 'bubble-event-bad');
        const winChance = 0.6 / botDmgMult;
        if (Math.random() < winChance) {
          addMsg(`🏆 ${p.name} ล้มสัตว์สำเร็จ! ได้รับเนื้อสัตว์ 🥩`, 'bubble-event-good');
          addToInventory(pi, 'เนื้อสัตว์');
          p.stats.animalsDefeated++;
        }
      }
    }
  }
  
  if (outcome.event === 'good' && Math.random() < 0.5) {
    addMsg(`✨ ${p.name} มีโชค!`, 'bubble-event-good');
  } else if (outcome.event === 'bad' && Math.random() < 0.5) {
    addMsg(`⚠️ ${p.name} ประสบความเสี่ยง!`, 'bubble-event-bad');
    if (Math.random() < 0.3) p.statuses = addStatus(p.statuses, 'injured');
  }
  
  if (p.hp <= 0) { killPlayer(pi); return; }
  
  spendTime(pi, hoursCost);
}

function mockNarrateAction(pi, action, meta={}) {
  const p = G.players[pi];
  const loc = meta.loc;
  
  const stories = [
    { story: `${p.name} ทำหน้าที่อย่างเต็มไปด้วยความเฉียบแหลม`, hp: 0, hunger: -3, thirst: -8, energy: -5, loot: [], event: 'none' },
    { story: `${p.name} ประสบความสำเร็จในความพยายามของตัวเอง`, hp: 5, hunger: -2, thirst: -5, energy: -4, loot: loc?.loot ? [loc.loot[Math.floor(Math.random()*loc.loot.length)]] : [], event: 'good' },
    { story: `${p.name} พบเรื่องที่น่าสนใจแต่ยังต้องระมัดระวัง`, hp: -5, hunger: -5, thirst: -10, energy: -8, loot: [], event: 'bad' },
    { story: `${p.name} ขอบคุณที่เก็บตัวอย่างสมุนไพรจากสถานที่นี้`, hp: 0, hunger: -1, thirst: -4, energy: -6, loot: loc?.loot ? [loc.loot[Math.floor(Math.random()*loc.loot.length)]] : [], event: 'good' },
  ];

  const story = stories[Math.floor(Math.random() * stories.length)];
  
  return {
    story: story.story,
    hpDelta: story.hp,
    hungerDelta: story.hunger,
    thirstDelta: story.thirst,
    energyDelta: story.energy,
    loot: story.loot,
    wildlife: loc?.wild ? (Math.random() < 0.3 * (G.activeEvent.wildMult || 1) ? loc.wild[Math.floor(Math.random()*loc.wild.length)] : null) : null,
    event: story.event,
    eventText: story.event === 'good' ? '✨ สิ่งดีๆ เกิดขึ้น' : story.event === 'bad' ? '⚠️ ประสบความยากลำบาก' : ''
  };
}

/**
 * REC-01: processActionResult (Architecture Refactor)
 * รวมโค้ดการจัดการผลลัพธ์จาก AI/Mock ให้เหลือที่เดียว ลด Code Duplication ~200 บรรทัด
 */
function processActionResult(pi, parsed, meta, hoursCost) {
  const p = G.players[pi];
  
  // Apply deltas
  p.hp = clamp(p.hp + (parseInt(parsed.hpDelta, 10) || 0), 0, 100);
  p.hunger = clamp(p.hunger + (parseInt(parsed.hungerDelta, 10) || 0), 0, 100);
  p.thirst = clamp(p.thirst + (parseInt(parsed.thirstDelta, 10) || 0), 0, 100);
  p.energy = clamp(p.energy + (parseInt(parsed.energyDelta, 10) || 0), 0, 100);
  
  /**
   * REC-06: จัดการ sanityDelta ที่เดิม AI ส่งมาแต่เกมไม่อ่าน
   */
  if (parsed.sanityDelta) {
    p.sanity = clamp(p.sanity + (parseInt(parsed.sanityDelta, 10) || 0), 0, 100);
  }
  
  if (p.hunger > 20) p.statuses = p.statuses.filter(s => s !== 'hungry');
  if (p.thirst > 20) p.statuses = p.statuses.filter(s => s !== 'thirsty');

  /**
   * BUG-05: ย้ายตรรกะ wetRisk/injureRisk มาไว้ที่เดียว
   */
  applyExploreStatusEffects(pi);

  // Loot Processing
  let finalLoot = parsed.loot || [];
  if (meta.loc) {
    if (meta.loc.id === 'ruins' && G.activeEvent?.radioHint === 'ruins') finalLoot.push('โลหะเก่า');
    if (meta.loc.id === 'hut' && G.activeEvent?.radioHint === 'hut') finalLoot.push('มีด');
    if (meta.loc.extraLoot) finalLoot.push(meta.loc.loot[Math.floor(Math.random() * meta.loc.loot.length)]);
    if (meta.loc.herbEasy && Math.random() < 0.5) {
      const herb = meta.loc.loot.find(item => ['สมุนไพรหายาก', 'สมุนไพร', 'ดอกไม้ยา'].includes(item)) || 'สมุนไพร';
      finalLoot.push(herb);
    }
    // Water Source boost
    if (['river', 'waterfall', 'swamp'].includes(meta.loc.id) && Math.random() < 0.4) {
      finalLoot.push('น้ำสะอาด');
      addMsg(`💧 พบแหล่งน้ำสะอาด!`, 'bubble-event-good');
    }
  }

  if (finalLoot.length && (!parsed.wildlife || pi !== 0)) {
    finalLoot.forEach(item => addToInventory(pi, item));
    addMsg(`🎒 ได้รับ: ${finalLoot.join(', ')}`, 'bubble-event-good');
  }

  // Wildlife handling
  if (parsed.wildlife) {
    addWildlife(`${p.name} เจอ ${parsed.wildlife}`);
    if (pi === 0) {
      initiateCombat(pi, parsed.wildlife, hoursCost, finalLoot, parsed.story);
      G.isLoading = false;
      removeTyping();
      return true; // Interrupted by combat
    }
  }

  addMsg(parsed.story || '...', 'bubble-narrator');
  if (parsed.event !== 'none' && parsed.eventText) {
    addMsg(`${parsed.event==='bad'?'⚠️':'✨'} ${parsed.eventText}`, parsed.event==='bad'?'bubble-event-bad':'bubble-event-good');
  }

  if (p.hp <= 0) { G.isLoading = false; killPlayer(pi); return true; }
  if (meta.loc && meta.loc === G.mapEvent) renderLocations();
  
  spendTime(pi, hoursCost);
  return false;
}

/**
 * BUG-05: Helper สำหรับ wetRisk และ injureRisk
 */
function applyExploreStatusEffects(pi) {
  const p = G.players[pi];
  if (G.activeEvent.wetRisk && Math.random() < 0.5) {
    p.statuses = addStatus(p.statuses, 'wet');
    addMsg(`🌧️ พายุฝนทำให้ ${p.name} ตัวเปียกปอนระหว่างสำรวจ!`, 'bubble-event-bad');
  }
  if (G.activeEvent.injureRisk && Math.random() < 0.35) {
    p.statuses = addStatus(p.statuses, 'injured');
    p.hp = clamp(p.hp - 10, 0, 100);
    addMsg(`🌪️ พายุทรายรุนแรงทำให้ ${p.name} ได้รับบาดเจ็บ! HP -10 🩸`, 'bubble-event-bad');
  }
}

async function callAI(pi, action, hoursCost, meta={}) {
  if (G.isLoading) return;
  G.isLoading = true;
  setButtons(true);

  const p = G.players[pi];
  addMsg(`${p.emoji} ${p.name}: ${action}`, 'bubble-player');

  const messages = [
    ...p.history,
    { role:'user', content:`การกระทำ: "${action}"\nStats: HP:${p.hp}, ความหิว:${p.hunger}, ความกระหาย:${p.thirst}, พลังงาน:${p.energy}, สติ:${p.sanity}\nวันที่:${G.day} ชม.เหลือ:${p.hoursLeft}${G.activeEvent?.name ? `\nเหตุการณ์วันนี้: ${G.activeEvent.name}` : ''}` }
  ];

  showTyping();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-html-user-access': 'true'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        temperature: 0.8,
        max_tokens: 500,
        system: SYSTEM_PROMPT + getModePrompt(),
        messages: messages
      })
    });
    
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    const raw = data.content?.[0]?.text || '{}';
    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { story: raw };
    } catch (e) { parsed = { story: raw }; }

    removeTyping();
    p.history.push({role:'user',content:messages[messages.length-1].content}, {role:'assistant',content:raw});
    if (p.history.length > 20) p.history = p.history.slice(-20);

    processActionResult(pi, parsed, meta, hoursCost);
  } catch(err) {
    console.warn('API fallback:', err.message);
    removeTyping();
    const parsed = mockNarrateAction(pi, action, meta);
    processActionResult(pi, parsed, meta, hoursCost);
  }
}

// ===================== COMBAT ENGINE =====================
function getAnimalMaxHp(name) {
  let hp = 20;
  if (name.includes('หมี')) hp = 80;
  else if (name.includes('เสือ')) hp = 60;
  else if (name.includes('จระเข้')) hp = 50;
  else if (name.includes('หมูป่า')) hp = 40;
  else if (name.includes('งูพิษ') || name.includes('งู')) hp = 25;
  else if (name.includes('หมาจิ้งจอก') || name.includes('สุนัข')) hp = 30;
  else if (name.includes('ค้างคาว') || name.includes('นก') || name.includes('แมลง')) hp = 15;
  
  if (G.activeEvent.animalHpMult) {
    hp = Math.round(hp * G.activeEvent.animalHpMult);
  }
  return hp;
}

function getAnimalDmg(name) {
  if (name.includes('หมี')) return 22;
  if (name.includes('เสือ')) return 18;
  if (name.includes('จระเข้')) return 15;
  if (name.includes('หมูป่า')) return 12;
  if (name.includes('งูพิษ')) return 15;
  if (name.includes('งู') || name.includes('หมาจิ้งจอก') || name.includes('สุนัข')) return 10;
  if (name.includes('ค้างคาว') || name.includes('นก') || name.includes('แมลง')) return 6;
  return 8;
}

function initiateCombat(pi, animalName, exploreHours, loot, exploreStory) {
  const p = G.players[pi];
  G.combatState = {
    playerIndex: pi,
    animalName: animalName,
    animalHp: getAnimalMaxHp(animalName),
    maxHp: getAnimalMaxHp(animalName),
    animalDmg: getAnimalDmg(animalName),
    exploreHours: exploreHours,
    loot: loot || [],
    exploreStory: exploreStory || ''
  };

  document.getElementById('combat-overlay').style.display = 'flex';
  renderCombatScreen();
}

function renderCombatScreen() {
  if (!G.combatState) return;
  const cs = G.combatState;
  const p = G.players[cs.playerIndex];
  
  document.getElementById('combat-wild-hp').textContent = cs.animalHp;
  document.getElementById('combat-player-hp').textContent = p.hp;
  
  let desc = `คุณเดินทางเข้าไปในป่าและเผชิญหน้ากับ **${cs.animalName}** อย่างหลีกเลี่ยงไม่ได้!<br><br>`;
  desc += `*${cs.exploreStory}*<br><br>`;
  desc += `จงเลือกตัดสินใจดำเนินการ:`;
  document.getElementById('combat-desc').innerHTML = desc;
  
  const actionsList = document.getElementById('combat-actions-list');
  actionsList.innerHTML = '';
  
  const hasSpear = p.inventory.includes('หอก');
  const hasKnife = p.inventory.includes('มีด');
  let weaponName = 'มือเปล่า';
  let dmg = 8;
  if (hasSpear) {
    weaponName = 'หอก 🗡️';
    dmg = 40;
  } else if (hasKnife) {
    weaponName = 'มีด 🔪';
    dmg = 20;
  }
  
  const fightBtn = document.createElement('button');
  fightBtn.className = 'combat-btn combat-btn-fight';
  fightBtn.innerHTML = `<span>⚔️ โจมตีด้วย ${weaponName}</span><span>สร้าง DMG ${dmg}</span>`;
  fightBtn.onclick = () => doCombatRound('fight', dmg);
  actionsList.appendChild(fightBtn);
  
  const fleeBtn = document.createElement('button');
  fleeBtn.className = 'combat-btn combat-btn-flee';
  fleeBtn.innerHTML = `<span>🏃 วิ่งหนีเอาชีวิตรอด</span><span>ใช้พลังงาน 15</span>`;
  fleeBtn.onclick = () => doCombatRound('flee');
  actionsList.appendChild(fleeBtn);
  
  const hideBtn = document.createElement('button');
  hideBtn.className = 'combat-btn';
  hideBtn.innerHTML = `<span>🍃 แอบซ่อนตัวในพุ่มไม้</span><span>เสี่ยงต่ำ / เสียเวลา 2 ชม.</span>`;
  hideBtn.onclick = () => doCombatRound('hide');
  actionsList.appendChild(hideBtn);
}

function doCombatRound(action, playerDmg) {
  if (!G.combatState) return;
  const cs = G.combatState;
  const p = G.players[cs.playerIndex];
  
  if (action === 'fight') {
    // PASSIVE: Damage boosts
    let finalPlayerDmg = playerDmg;
    if (p.inventory.includes('ขวานเหล็ก')) finalPlayerDmg += 12;
    if (p.inventory.includes('อาวุธโบราณ')) finalPlayerDmg += 20;

    cs.animalHp = Math.max(0, cs.animalHp - finalPlayerDmg);
    addMsg(`⚔️ คุณโจมตี ${cs.animalName} ได้รับความเสียหาย ${finalPlayerDmg} หน่วย!`, 'bubble-player');
    
    if (cs.animalHp <= 0) {
      addMsg(`🏆 คุณสามารถล้ม ${cs.animalName} ได้สำเร็จ!`, 'bubble-event-good');
      p.stats.animalsDefeated++;
      addToInventory(cs.playerIndex, 'เนื้อสัตว์');
      addMsg(`🎒 ได้รับ: เนื้อสัตว์ 🥩`, 'bubble-event-good');
      
      if (cs.loot && cs.loot.length) {
        cs.loot.forEach(item => addToInventory(cs.playerIndex, item));
        addMsg(`🎒 ได้รับของสำรวจ: ${cs.loot.join(', ')}`, 'bubble-event-good');
      }
      closeCombat(true);
      return;
    }
    
    let dmg = cs.animalDmg;
    if (p.job.id === 'soldier') dmg = Math.ceil(dmg * 0.5);
    
    // PASSIVE: Defense boosts
    if (p.inventory.includes('ชุดเกราะเก่า')) {
      dmg = Math.max(1, Math.ceil(dmg * 0.6));
      addMsg(`🛡️ ชุดเกราะเก่าช่วยลดแรงปะทะ! (-40% ดาเมจ)`, 'bubble-system');
    } else if (p.inventory.includes('เครื่องรางศักดิ์สิทธิ์')) {
      dmg = Math.max(1, Math.ceil(dmg * 0.8));
      addMsg(`✨ เครื่องรางส่องแสงปกป้องคุณ! (-20% ดาเมจ)`, 'bubble-system');
    }

    p.hp = clamp(p.hp - dmg, 0, 100);
    p.stats.damageTaken += dmg;
    addMsg(`💥 ${cs.animalName} โจมตีกลับ! คุณได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
    
    if (p.hp <= 0) {
      closeCombat(false);
      killPlayer(cs.playerIndex);
      return;
    }
    renderCombatScreen();
  }
  else if (action === 'flee') {
    p.energy = clamp(p.energy - 15, 0, 100);
    if (Math.random() < 0.3) {
      let dmg = Math.ceil(cs.animalDmg * 0.7);
      if (p.job.id === 'soldier') dmg = Math.ceil(dmg * 0.5);
      p.hp = clamp(p.hp - dmg, 0, 100);
      p.stats.damageTaken += dmg;
      addMsg(`🏃 คุณพยายามวิ่งหนี แต่ถูก ${cs.animalName} ตะปบหลัง! ได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
      
      if (p.hp <= 0) {
        closeCombat(false);
        killPlayer(cs.playerIndex);
        return;
      }
    } else {
      addMsg(`🏃 คุณวิ่งหนีจาก ${cs.animalName} จนพ้นอย่างปลอดภัย!`, 'bubble-player');
    }
    closeCombat(false);
  }
  else if (action === 'hide') {
    p.hoursLeft = Math.max(0, p.hoursLeft - 2);
    if (Math.random() < 0.15) {
      let dmg = cs.animalDmg;
      if (p.job.id === 'soldier') dmg = Math.ceil(dmg * 0.5);
      p.hp = clamp(p.hp - dmg, 0, 100);
      p.stats.damageTaken += dmg;
      addMsg(`🍃 คุณซ่อนตัวในพุ่มไม้ แต่ ${cs.animalName} ดมกลิ่นจนพบตัว! ได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
      
      if (p.hp <= 0) {
        closeCombat(false);
        killPlayer(cs.playerIndex);
        return;
      }
    } else {
      addMsg(`🍃 คุณซ่อนตัวเงียบกริบในพุ่มไม้ จน ${cs.animalName} เดินผ่านไปโดยไม่พบคุณ!`, 'bubble-player');
    }
    closeCombat(false);
  }
}

function closeCombat(win) {
  document.getElementById('combat-overlay').style.display = 'none';
  const cs = G.combatState;
  if (!cs) return;
  
  spendTime(cs.playerIndex, cs.exploreHours);
  G.combatState = null;
}

function spendTime(pi, hours) {
  const p = G.players[pi];
  if (!p || !p.alive || G.dayDone[pi]) {
    G.isLoading = false;
    setButtons(false);
    return;
  }
  p.hoursLeft = Math.max(0, p.hoursLeft - hours);
  renderAllPanels();
  document.getElementById('turn-time-left').innerHTML = `<i class="ti ti-clock" aria-hidden="true"></i> ${p.hoursLeft} ชม. เหลือ`;
  G.isLoading = false;
  setButtons(false);

  if (p.hoursLeft <= 0) {
    endPlayerTurn(pi);
  } else if (!p.isBot) {
    renderActions(pi);
  } else {
    setTimeout(() => botChooseAction(pi), 1000);
  }
}

function nextTurn() {
  const next = G.players.findIndex((p,i) => p.alive && !G.dayDone[i]);
  if (next === -1) {
    if (G.mode === 'multi') {
      addMsg('⌛ รอผู้เล่นคนอื่นทำเทิร์นให้เสร็จ... (โหมดจำลองออนไลน์)', 'bubble-system');
      setTimeout(() => endDay(), 2000);
    } else {
      endDay();
    }
  } else {
    G.currentPlayer = next;
    renderAllPanels();
    startTurn(next);
  }
}

function endDay() {
  if (G.activeTraps.length > 0) {
    let trapLooted = [];
    G.activeTraps.forEach(trap => {
      const capturer = G.players[trap.playerIndex];
      if (capturer.alive) {
        if (Math.random() < 0.6) {
          const prey = ['กระต่าย', 'กบ', 'ปลา', 'แมลง'][Math.floor(Math.random() * 4)];
          addToInventory(trap.playerIndex, prey);
          trapLooted.push(`🪤 กับดักของ ${capturer.name} จับ **${prey}** ได้สำเร็จ! 🎒`);
        } else {
          trapLooted.push(`🪤 กับดักของ ${capturer.name} ยังคงว่างเปล่า...`);
        }
      }
    });
    if (trapLooted.length > 0) {
      addMsg(trapLooted.join('\n'), 'bubble-system');
    }
    G.activeTraps = [];
  }

  G.players.forEach(p => {
    if (p.alive && p.inventory.includes('เครื่องกลั่นน้ำ')) {
      addToInventory(G.players.indexOf(p), 'น้ำสะอาด');
      addMsg(`💧 เครื่องกลั่นน้ำของ ${p.name} ผลิตน้ำสะอาดให้ 1 ขวด`, 'bubble-event-good');
    }
  });

  // Camp structure end-of-day effects
  if (G.camp.structures.includes('watertank')) {
    G.camp.sharedItems.push('น้ำสะอาด','น้ำสะอาด');
    addMsg('💧 ถังเก็บน้ำแคมป์ผลิตน้ำสะอาด 2 ขวดอัตโนมัติ!', 'bubble-event-good');
    updateCampUI();
  }
  if (G.camp.structures.includes('purifier')) {
    G.camp.sharedItems.push('น้ำสะอาด','น้ำสะอาด','น้ำสะอาด');
    addMsg('🏗️ เครื่องกรองน้ำเหล็กทำงานเต็มที่! ผลิตน้ำสะอาด 3 ขวดอัตโนมัติ!', 'bubble-event-good');
    updateCampUI();
  }
  if (G.camp.structures.includes('clinic')) {
    G.players.forEach(p => {
      if (p.alive && (p.statuses.includes('sick') || p.statuses.includes('injured') || p.statuses.includes('poison'))) {
        p.statuses = p.statuses.filter(s => s !== 'sick' && s !== 'injured' && s !== 'poison');
        p.hp = clamp(p.hp + 10, 0, 100);
        addMsg(`🏥 มุมรักษาแคมป์รักษา ${p.name} — หายจากอาการป่วย HP+10`, 'bubble-event-good');
      }
    });
  }

  // Map Event - If not explored, it becomes an item for the first living player
  if (G.mapEvent && !G.mapEvent.explored) {
    const firstAlive = G.players.find(p => p.alive);
    if (firstAlive) {
      addToInventory(G.players.indexOf(firstAlive), 'แผนที่ลึกลับ');
      addMsg(`🗺️ ไม่มีใครสำรวจ ${G.mapEvent.name} — ${firstAlive.name} เก็บแผนที่ลึกลับไว้ใช้พรุ่งนี้`, 'bubble-system');
    }
  }

  let summary = `📋 สรุปวันที่ ${G.day}:\n`;
  G.players.forEach((p,i) => {
    if (!p.alive) { summary += `• ${p.name} — ☠️ เสียชีวิตในวันที่ ${p.stats.dayDied || G.day}\n`; return; }
    const notes = [];
    if (p.statuses.includes('tired')) notes.push('ง่วงนอนมาก');
    if (p.statuses.includes('hungry')) notes.push('หิวโหย');
    if (p.statuses.includes('poison')) notes.push('ได้รับพิษ');
    if (p.statuses.includes('sick')) notes.push('ป่วย');
    if (p.statuses.includes('injured')) notes.push('บาดเจ็บ');
    if (!p.atCamp) notes.push('ค้างคืนกลางป่า');
    summary += `• ${p.name} [${p.job.name}] — HP:${p.hp} | ${notes.length?notes.join(', '):'ปกติ'} | ของ:${p.inventory.length}ชิ้น\n`;
    
    p.hoursLeft = 24;
    p.dayNotes = [];
  });
  addMsg(summary, 'bubble-day-summary');

  G.day++;
  for (let i=0;i<7;i++) {
    const pip = document.getElementById(`pip${i}`);
    if (!pip) continue;
    pip.classList.remove('current','done');
    if (i < G.day-1) pip.classList.add('done');
    if (i === G.day-1) pip.classList.add('current');
  }

  if (G.day > 7) {
    gameEnd(true);
    return;
  }

  const aliveCount = G.players.filter(p=>p.alive).length;
  if (aliveCount === 0) { gameEnd(false); return; }

  setTimeout(() => startDay(), 500);
}

function killPlayer(pi) {
  const p = G.players[pi];
  p.alive = false;
  p.hp = 0;
  p.stats.dayDied = G.day;
  G.dayDone[pi] = true;
  addMsg(`☠️ ${p.name} เสียชีวิตแล้ว — รอจนกว่าเกมจะจบ`, 'bubble-event-bad');
  renderAllPanels();
  document.getElementById(`panel-p${pi}`).classList.add('dead');
  const alive = G.players.filter(p=>p.alive).length;
  if (alive === 0) { setTimeout(()=>gameEnd(false),500); return; }
  nextTurn();
}

function gameEnd(survived) {
  const screen = document.getElementById('end-screen');
  screen.style.display = 'flex';
  const aliveP = G.players.filter(p=>p.alive);
  document.getElementById('end-icon').textContent = survived ? '🏆' : '💀';
  document.getElementById('end-title').textContent = survived ? 'รอดชีวิตแล้ว!' : 'ทุกคนเสียชีวิต';
  document.getElementById('end-msg').textContent = survived
    ? `${aliveP.map(p=>p.name).join(', ')} สามารถเอาชีวิตรอดในป่าทึบครบ 7 วันได้สำเร็จ!`
    : 'ไม่มีใครรอดพ้นจากเงื้อมมือของป่าดงดิบแห่งนี้...';

  let tbodyHtml = '';
  G.players.forEach(p => {
    let finalScore = 0;
    if (p.alive) {
      finalScore = p.hp + p.hunger + p.energy + 700 + (p.stats.animalsDefeated * 50) + (p.stats.itemsCrafted * 10) + (p.stats.itemsShared * 15) + (p.trust * 2) + (G.rescueData.success ? 100 : 0);
    } else {
      finalScore = (p.stats.dayDied * 100) + (p.stats.animalsDefeated * 50) + (p.stats.itemsCrafted * 10) + (p.stats.itemsShared * 15) + (p.trust * 2);
    }
    p.finalScore = finalScore;
    
    let statusText = p.alive ? '<span style="color: var(--green2); font-weight: bold;">🌱 รอดชีวิต</span>' : `<span style="color: var(--red2);">☠️ ตาย (วันที่ ${p.stats.dayDied})</span>`;
    tbodyHtml += `
      <tr>
        <td style="font-weight: 600; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 16px;">${p.emoji}</span> ${p.name}
        </td>
        <td style="font-weight: 500;">
          ${p.job ? p.job.emoji + ' ' + p.job.name : 'ไม่มี'}
        </td>
        <td>${statusText}</td>
        <td style="font-size: 13px; font-weight: bold; color: var(--amber2);">${finalScore}</td>
      </tr>
    `;
  });
  document.getElementById('end-scoreboard-body').innerHTML = tbodyHtml;

  const awardsContainer = document.getElementById('end-awards');
  awardsContainer.innerHTML = '';
  
  let maxDefeated = -1; let slayer = null;
  let maxShared = -1; let generous = null;
  let minDayDied = 99; let firstDie = null;
  
  G.players.forEach(p => {
    if (p.stats.animalsDefeated > maxDefeated) { maxDefeated = p.stats.animalsDefeated; slayer = p; }
    if (p.stats.itemsShared > maxShared) { maxShared = p.stats.itemsShared; generous = p; }
    if (!p.alive && p.stats.dayDied < minDayDied) { minDayDied = p.stats.dayDied; firstDie = p; }
  });
  
  let awardsHtml = '';
  if (slayer && maxDefeated > 0) {
    awardsHtml += `
      <div class="end-award-card">
        <div class="end-award-title">👊 นักสู้แห่งพงไพร</div>
        <div class="end-award-desc">**${slayer.name}** กำจัดสัตว์ร้ายได้ทั้งหมด **${maxDefeated}** ตัว!</div>
      </div>
    `;
  }
  if (generous && maxShared > 0) {
    awardsHtml += `
      <div class="end-award-card">
        <div class="end-award-title">🤝 ผู้โอบอ้อมอารี</div>
        <div class="end-award-desc">**${generous.name}** แบ่งปันเสบียงให้เพื่อนรวม **${maxShared}** ครั้ง!</div>
      </div>
    `;
  }
  if (firstDie) {
    awardsHtml += `
      <div class="end-award-card">
        <div class="end-award-title">💀 ผู้ดับสูญคนแรก</div>
        <div class="end-award-desc">**${firstDie.name}** จากไปก่อนใครในวันที่ **${minDayDied}**</div>
      </div>
    `;
  }
  
  let mvp = G.players.reduce((prev, current) => (prev.finalScore > current.finalScore) ? prev : current);
  awardsHtml += `
    <div class="end-award-card" style="grid-column: span 2; border-color: var(--amber2); background: rgba(212, 144, 42, 0.08);">
      <div class="end-award-title" style="color: var(--amber2);">🏆 ผู้รอดชีวิตระดับตำนาน (MVP)</div>
      <div class="end-award-desc">**${mvp.name}** เป็นผู้นำสูงสุดของกลุ่มด้วยสถิติอันยอดเยี่ยม ทำคะแนนรวมได้ **${mvp.finalScore}** แต้ม!</div>
    </div>
  `;
  
  awardsContainer.innerHTML = awardsHtml;
}

// ===================== CAMP SYSTEM =====================
const CAMP_STRUCTURES = [
  { id:'campfire',  name:'กองไฟ',        emoji:'🔥', needs:['ไม้'],                    time:1, desc:'ปรุงอาหารได้ + ไล่สัตว์กลางคืน' },
  { id:'stove',     name:'เตาดิน',        emoji:'🍳', needs:['หิน','ดินเหนียว'],          time:2, desc:'ปรุงอาหาร HP bonus + เตาอยู่ถาวร' },
  { id:'hut',       name:'กระท่อม',       emoji:'🛖', needs:['ไม้','ผ้า'],               time:2, desc:'พักผ่อน energy +55, กำบังฝน/หนาว' },
  { id:'fence',     name:'รั้วไม้',        emoji:'🪵', needs:['ไม้','เชือก'],              time:1, desc:'ลดโอกาสสัตว์บุกแคมป์' },
  { id:'watertank', name:'ถังเก็บน้ำ',    emoji:'💧', needs:['หิน','ดินเหนียว'],          time:2, desc:'ผลิตน้ำสะอาด 2 ชิ้น/สิ้นวัน auto' },
  { id:'clinic',    name:'มุมรักษา',      emoji:'🏥', needs:['สมุนไพร','ผ้า'],           time:1, desc:'ทุกคนรักษาฟรี 1 ครั้ง/วัน' },
  { id:'trapfence', name:'รั้วกับดัก',    emoji:'🪤', needs:['กับดักสัตว์'],              time:1, desc:'จับสัตว์บุกแคมป์ได้ 100%' },
  { id:'tower',     name:'หอคอยสัญญาณ',  emoji:'🔦', needs:['ไม้','โลหะเก่า'],           time:2, desc:'rescue chance +30% วันที่ 7' },
  { id:'smoker',    name:'ชั้นรมควัน',    emoji:'🍖', needs:['ไม้'],                    time:1, desc:'เก็บเนื้อสัตว์ได้ไม่เน่า' },
  // --- NEW MEGA UPGRADES ---
  { id:'purifier',  name:'เครื่องกรองน้ำเหล็ก', emoji:'🏗️', needs:['แร่เหล็ก','เศษเหล็ก','แก้ว','ผ้าเก่า'], time:3, desc:'ผลิตน้ำสะอาด 3 ขวดฟรีทุกเช้า' },
  { id:'fortified', name:'กำแพงเหล็กกันภัย',  emoji:'🛡️', needs:['ไม้เนื้อแข็ง','ชุดเกราะเก่า','กระสุนเก่า','เครื่องราง'], time:4, desc:'ป้องกันสัตว์/โจร 100% + ดรอปของจากศพโจร' },
];

const CAMP_RECIPES = [
  { input:'เนื้อสัตว์',   needs:'campfire|stove', output:'เนื้อย่าง',   hungerGain:40, hpGain:5,  desc:'เนื้อย่าง — หิว+40 HP+5' },
  { input:'ปลา',          needs:'campfire|stove', output:'ปลาย่าง',    hungerGain:35, hpGain:3,  desc:'ปลาย่าง — หิว+35 HP+3' },
  { input:'กบ',           needs:'campfire|stove', output:'ยาบำรุง',    hungerGain:20, hpGain:25, desc:'ยาบำรุง — หิว+20 HP+25' },
  { input:'อาหารกระป๋อง', needs:'campfire|stove', output:'อาหารอุ่น',  hungerGain:45, hpGain:5,  desc:'อาหารอุ่น — หิว+45 HP+5' },
  { input:'ไก่ป่า',       needs:'campfire|stove', output:'เนื้อย่าง',   hungerGain:35, hpGain:5,  desc:'เนื้อย่าง — หิว+35 HP+5' },
  { input:'กระต่าย',      needs:'campfire|stove', output:'เนื้อย่าง',   hungerGain:30, hpGain:3,  desc:'เนื้อย่าง — หิว+30 HP+3' },
  // --- NEW SPECIAL RECIPES ---
  { input:'มอสเรืองแสง',  needs:'campfire|stove', output:'ซุปสมาธิ',   hungerGain:20, hpGain:10, desc:'ซุปสมาธิ — Sanity +50' },
];

function openCampMenu() {
  const pi = 0; // Always show user's inventory when they open the menu
  const p = G.players[pi];
  const isHumanTurn = (G.currentPlayer === 0);
  if (!p || !p.alive) return;

  const hasFire = G.camp.structures.includes('campfire') || G.camp.structures.includes('stove');
  
  // Build cook options
  let cookHTML = '';
  if (hasFire) {
    const cookable = CAMP_RECIPES.filter(r => p.inventory.includes(r.input));
    if (cookable.length) {
      cookHTML = '<div style="margin-top:10px;"><div style="font-size:11px;font-weight:700;color:var(--amber2);margin-bottom:6px;">🍳 ปรุงอาหาร (มีกองไฟ)</div>';
      cookable.forEach(r => {
        const canCook = isHumanTurn && p.atCamp;
        cookHTML += `<div style="padding:7px;background:var(--bg4);border:0.5px solid var(--amber);border-radius:5px;margin-bottom:5px;cursor:${canCook?'pointer':'not-allowed'};opacity:${canCook?1:0.5}"
          onclick="${canCook ? `doCookFood(${pi},'${r.input}','${r.output}',${r.hungerGain},${r.hpGain});closeShare()` : ''}">
          <div style="font-size:12px;color:var(--amber2);">🔥 ปรุง ${r.input} → ${r.output}</div>
          <div style="font-size:10px;color:var(--text3);">${r.desc} | เวลา 1 ชม.</div>
        </div>`;
      });
      cookHTML += '</div>';
    }
  } else {
    cookHTML = '<div style="font-size:10px;color:var(--text3);margin-top:8px;">⚠️ ต้องสร้างกองไฟหรือเตาดินก่อนจึงจะปรุงอาหารได้</div>';
  }

  // Build structure options
  const isEngineer = p.job && p.job.id === 'engineer';
  let structHTML = '<div style="margin-top:10px;"><div style="font-size:11px;font-weight:700;color:var(--green2);margin-bottom:6px;">🔨 สร้างสิ่งปลูกสร้าง</div>';
  CAMP_STRUCTURES.forEach(s => {
    const alreadyBuilt = G.camp.structures.includes(s.id);
    const needs = isEngineer ? s.needs.slice(0,-1) : s.needs;
    const canBuild = isHumanTurn && p.atCamp && !alreadyBuilt && needs.every(mat => {
      const inv = [...p.inventory, ...G.camp.sharedItems];
      const idx = inv.indexOf(mat);
      if (idx > -1) { inv.splice(idx,1); return true; }
      return false;
    });
    const matList = [...new Set(s.needs)].map(m => `${m}x${s.needs.filter(x=>x===m).length}`).join('+');
    structHTML += `<div style="padding:7px;background:var(--bg4);border:0.5px solid ${alreadyBuilt?'var(--green)':canBuild?'var(--border)':'rgba(80,80,80,0.3)'};border-radius:5px;margin-bottom:5px;cursor:${canBuild?'pointer':'default'};opacity:${canBuild||alreadyBuilt?1:0.4}"
      onclick="${canBuild?`doBuildCampStructure(${pi},'${s.id}','${s.name}');closeShare()`:''}"
    >
      <div style="font-size:12px;color:${alreadyBuilt?'var(--green2)':canBuild?'var(--text)':'var(--text3)'};">${s.emoji} ${s.name} ${alreadyBuilt?'✅ สร้างแล้ว':''}</div>
      <div style="font-size:10px;color:var(--text3);">วัสดุ: ${matList} | เวลา: ${s.time}ชม. | ${s.desc}</div>
    </div>`;
  });
  structHTML += '</div>';

  // Shared item deposit
  let sharedHTML = `<div style="margin-top:10px;"><div style="font-size:11px;font-weight:700;color:var(--blue2);margin-bottom:6px;">📦 ฝากของเข้าคลังแคมป์</div>`;
  if (p.inventory.length) {
    p.inventory.forEach((item,idx) => {
      const canDep = p.atCamp;
      sharedHTML += `<div style="display:inline-block;padding:3px 7px;background:var(--bg4);border:0.5px solid var(--border);border-radius:4px;font-size:10px;color:var(--text2);cursor:${canDep?'pointer':'not-allowed'};margin:2px;opacity:${canDep?1:0.5}"
        onclick="${canDep ? `depositToCamp(${pi},${idx});closeShare()` : ''}">${item} →📦</div>`;
    });
  } else {
    sharedHTML += '<div style="font-size:10px;color:var(--text3);">ไม่มีของในครอบครอง</div>';
  }
  sharedHTML += '</div>';

  document.getElementById('share-title').textContent = '🏕️ จัดการแคมป์';
  document.getElementById('share-target-list').innerHTML = cookHTML + structHTML + sharedHTML + '<div style="margin-top:8px;font-size:10px;color:var(--text3);">สิ่งปลูกสร้างแคมป์ใช้ร่วมกันได้ทุกคน</div>';
  document.getElementById('share-overlay').style.display = 'flex';
}

function doCookFood(pi, inputItem, outputItem, hungerGain, hpGain) {
  const p = G.players[pi];
  const idx = p.inventory.indexOf(inputItem);
  if (idx === -1) { addMsg('❌ ไม่มีวัตถุดิบ', 'bubble-system'); return; }
  const isChef = p.job && p.job.id === 'chef';
  p.inventory.splice(idx, 1);
  addToInventory(pi, outputItem);
  const bonus = isChef ? ' [พ่อครัว: คุณค่าเพิ่ม +50%]' : '';
  const finalHunger = isChef ? Math.ceil(hungerGain * 1.5) : hungerGain;
  const finalHp = isChef ? Math.ceil(hpGain * 1.5) : hpGain;
  addMsg(`🍳 ${p.name} ปรุง ${inputItem} → ${outputItem} สำเร็จ!${bonus} (หิว+${finalHunger} HP+${finalHp} เมื่อกิน)`, 'bubble-event-good');
  p.stats.itemsCrafted++;
  renderAllPanels();
  spendTime(pi, 1);
}

function doBuildCampStructure(pi, structId, structName) {
  const p = G.players[pi];
  if (!p.atCamp) { addMsg('❌ ต้องอยู่ที่แคมป์เพื่อสร้างสิ่งปลูกสร้าง', 'bubble-system'); return; }
  const s = CAMP_STRUCTURES.find(x => x.id === structId);
  if (!s) return;
  const isEngineer = p.job && p.job.id === 'engineer';
  const needs = isEngineer ? s.needs.slice(0,-1) : s.needs;

  // Try to take from player inventory first, then camp shared
  const tempInv = [...p.inventory];
  const tempShared = [...G.camp.sharedItems];
  const usedFrom = { player:[], shared:[] };
  for (const mat of needs) {
    const pi2 = tempInv.indexOf(mat);
    if (pi2 > -1) { tempInv.splice(pi2,1); usedFrom.player.push(mat); continue; }
    const si = tempShared.indexOf(mat);
    if (si > -1) { tempShared.splice(si,1); usedFrom.shared.push(mat); continue; }
    addMsg(`❌ วัสดุไม่พอ — ขาด ${mat}`, 'bubble-system'); return;
  }
  p.inventory = tempInv;
  G.camp.sharedItems = tempShared;
  G.camp.structures.push(structId);
  updateCampLevel();
  updateCampUI();
  addMsg(`🔨 ${p.name} สร้าง ${s.emoji} ${s.name} ให้กับแคมป์รวมแล้ว!${isEngineer?' [วิศวกร: ใช้วัสดุน้อยลง]':''}`, 'bubble-event-good');
  p.stats.itemsCrafted++;
  renderAllPanels();
  spendTime(pi, s.time);
}

// ฟังก์ชัน depositToCamp ถูกใช้งานที่บรรทัด 2066 เพื่อความปลอดภัยและถูกต้องครับ

function updateCampLevel() {
  const n = G.camp.structures.length;
  G.camp.level = n >= 5 ? 3 : n >= 2 ? 2 : 1;
}

function updateCampUI() {
  const levelNames = { 1:'Lv. 1 ค่ายชั่วคราว', 2:'Lv. 2 ค่ายพักแรม', 3:'Lv. 3 ฐานทัพ' };
  const badge = document.getElementById('camp-level-badge');
  if (badge) badge.textContent = levelNames[G.camp.level] || levelNames[1];

  const structList = document.getElementById('camp-structures-list');
  if (structList) {
    const icons = { 'campfire':'🔥','stove':'🍳','hut':'🛖','fence':'🪵','watertank':'💧','clinic':'🏥','trapfence':'🪤','tower':'🔦','smoker':'🍖' };
    const all = ['campfire','hut','fence','watertank','clinic'];
    structList.innerHTML = all.map(id => {
      const built = G.camp.structures.includes(id);
      const s = CAMP_STRUCTURES.find(x => x.id === id);
      return `<div style="font-size:10px;${built?'color:var(--green2)':'color:var(--text3)'};text-align:center;padding:4px;background:var(--bg2);border:0.5px solid ${built?'var(--green)':'var(--border)'};border-radius:5px;">
        ${icons[id]||'🏗️'} ${built?(s?s.name:id):`ไม่มี${s?s.name:id}`}
      </div>`;
    }).join('');
  }

  const sharedEl = document.getElementById('camp-shared-items');
  if (sharedEl) {
    // Make container a drop zone
    sharedEl.setAttribute('ondragover', 'event.preventDefault()');
    sharedEl.setAttribute('ondrop', 'handleDrop(event)');

    if (!G.camp.sharedItems.length) {
      sharedEl.innerHTML = '<span style="color:var(--text3);font-style:italic;">ว่างเปล่า (วางของที่นี่)</span>';
    } else {
      sharedEl.innerHTML = G.camp.sharedItems.map((item, idx) =>
        `<span style="font-size:10px;padding:2px 5px;background:var(--bg4);border:0.5px solid var(--border);border-radius:3px;color:var(--text2);cursor:pointer;" onclick="takeFromCamp(${idx})">${item}</span>`
      ).join('');
    }
  }
}

// Add handleDrop function
function handleDrop(event) {
  event.preventDefault();
  const itemIdx = event.dataTransfer.getData('text/plain');
  depositToCamp(G.currentPlayer, parseInt(itemIdx));
}

function takeFromCamp(idx) {
  const pi = G.currentPlayer;
  const p = G.players[pi];
  if (!p.alive || G.isLoading) return;
  if (!p.atCamp) { addMsg('❌ ต้องอยู่ที่แคมป์เพื่อหยิบของ', 'bubble-system'); return; }
  
  const item = G.camp.sharedItems[idx];
  if (addToInventory(pi, item)) {
    G.camp.sharedItems.splice(idx, 1);
    addMsg(`🎒 ${p.name} หยิบ ${item} ออกจากคลังแคมป์`, 'bubble-system');
    updateCampUI();
  }
}

function depositToCamp(pi, itemIdx) {
  const p = G.players[pi];
  if (!p.atCamp) { addMsg('❌ ต้องอยู่ที่แคมป์เพื่อฝากของ', 'bubble-system'); return; }
  
  const item = p.inventory[itemIdx];
  p.inventory.splice(itemIdx, 1);
  G.camp.sharedItems.push(item);
  addMsg(`📦 ${p.name} ฝาก ${item} ไว้ในคลังแคมป์`, 'bubble-system');
  updateCampUI();
  renderAllPanels();
}

function showShareOverlay(pi) {
  shareMode = 'share';
  shareFromPi = pi;
  const box = document.getElementById('share-target-list');
  box.innerHTML = '';
  const p = G.players[pi];
  if (!p.inventory.length) { addMsg('❌ ไม่มีของแบ่ง', 'bubble-system'); return; }
  document.getElementById('share-title').textContent = `แบ่งของให้ใคร?`;
  G.players.forEach((p2,i) => {
    if (i===pi || !p2.alive) return;
    const row = document.createElement('div');
    row.className = 'share-row';
    p.inventory.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'share-btn';
      const displayName = item === 'อาหารอาบยาพิษ' ? 'อาหาร (ผสมยาพิษ 🧪)' : item;
      btn.textContent = `ให้ ${p2.name}: ${displayName}`;
      btn.onclick = () => doShare(pi, i, item);
      row.appendChild(btn);
    });
    box.appendChild(row);
  });
  document.getElementById('share-overlay').style.display = 'flex';
}

function doShare(fromPi, toPi, item) {
  closeShare();
  const from = G.players[fromPi];
  const to = G.players[toPi];
  from.inventory.splice(from.inventory.indexOf(item), 1);
  from.stats.itemsShared++;

  const isMerchant = from.job.id === 'merchant';
  const isChef = to.job.id === 'chef';
  const isShaman = to.job.id === 'shaman';
  const toxic = item === 'ผลไม้มีพิษ' || item === 'เห็ด' || item === 'น้ำเน่า' || item === 'อาหารอาบยาพิษ';

  if (toxic && (isChef || isShaman)) {
    addMsg(`🎁 ${from.name} แบ่ง "${item === 'อาหารอาบยาพิษ' ? 'อาหาร' : item}" ให้ ${to.name} — แต่ด้วยความเชี่ยวชาญของ ${to.job.name} ทำให้ตรวจพบสารพิษและโยนทิ้งไปได้สำเร็จ! 🛡️`, 'bubble-event-good');
    adjustTrust(toPi, 5, 'ความเชี่ยวชาญในการตรวจจับพิษ');
    adjustTrust(fromPi, -5, 'การพยายามแบ่งของอันตราย');
  } else {
    addToInventory(toPi, item);
    to.hunger = clamp(to.hunger + (isFood(item) || item === 'อาหารอาบยาพิษ' ? 15 : 0), 0, 100);
    if (toxic) {
      to.statuses = addStatus(to.statuses, 'poison');
      addMsg(`🎁 ${from.name} แบ่ง "${item === 'อาหารอาบยาพิษ' ? 'อาหารอาบยาพิษ' : item}" ให้ ${to.name} — ${to.name} กินเข้าไปและติดพิษทันที! ☠️`, 'bubble-event-bad');
      adjustTrust(toPi, -10, 'การได้รับของเป็นพิษ');
      adjustTrust(fromPi, -20, 'การให้ของเป็นพิษ');
    } else {
      const jewelry = ['พลอย', 'หินสวยงาม', 'มุกน้ำจืด', 'ฟอสซิล', 'ทองคำแท่ง', 'หีบสมบัติ'];
      const trustBonus = jewelry.includes(item) ? 30 : 5;
      addMsg(`🎁 ${from.name} แบ่ง "${item}" ให้ ${to.name} ${isMerchant ? '[พ่อค้า: ได้คืน 1 ชิ้น]' : ''}`, 'bubble-event-good');
      adjustTrust(toPi, trustBonus, jewelry.includes(item) ? 'ของกำนัลล้ำค่า' : 'ความช่วยเหลือจากเพื่อน');
      adjustTrust(fromPi, trustBonus, jewelry.includes(item) ? 'การให้ของล้ำค่า' : 'การแบ่งปัน');
    }
  }

  if (isMerchant) addToInventory(fromPi, item);
  renderAllPanels();
  spendTime(fromPi, 1);
}

function showThiefPicker(pi) {
  shareMode = 'thief';
  shareFromPi = pi;
  const box = document.getElementById('share-target-list');
  box.innerHTML = '';
  document.getElementById('share-title').textContent = '🗡️ ขโมยของจากใคร?';
  G.players.forEach((p2,i) => {
    if (i===pi || !p2.alive || !p2.inventory.length) return;
    const row = document.createElement('div');
    row.className = 'share-row';
    p2.inventory.slice(0,3).forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'share-btn';
      btn.textContent = `ขโมย ${item} จาก ${p2.name}`;
      btn.onclick = () => doThief(pi, i, item);
      row.appendChild(btn);
    });
    box.appendChild(row);
  });
  document.getElementById('share-overlay').style.display = 'flex';
}

function doThief(fromPi, toPi, item) {
  closeShare();
  const from = G.players[fromPi];
  const to = G.players[toPi];
  to.inventory.splice(to.inventory.indexOf(item), 1);
  addToInventory(fromPi, item);
  G.thiefUsed[fromPi] = true;
  addMsg(`🗡️ ${from.name} ขโมย "${item}" จาก ${to.name}!`, 'bubble-event-bad');
  renderAllPanels();
  spendTime(fromPi, 2);
}

function closeShare() { document.getElementById('share-overlay').style.display = 'none'; }

// ===================== PVP OVERLAY =====================
function showPvpOverlay(pi) {
  const p = G.players[pi];
  const box = document.getElementById('pvp-target-list');
  box.innerHTML = '';
  // Check if player has attack skill
  const canAttack = p.job.id === 'thief' || p.job.id === 'soldier';
  
  // List other alive players as targets
  G.players.forEach((target,i) => {
    if (i===pi || !target.alive) return;
    const row = document.createElement('div');
    row.className = 'pvp-row';
    
    // Create attack button only if player has attack skill
    if (canAttack) {
      const attackBtn = document.createElement('button');
      attackBtn.className = 'pvp-btn highlight';
      attackBtn.textContent = `⚔️ โจมตี ${target.name}`;
      attackBtn.onclick = () => selectPvpTarget(pi, i, 'attack');
      row.appendChild(attackBtn);
    }
    
    // Create demoralize button (if has torch)
    if (p.inventory.includes('คบเพลิง')) {
      const demBtn = document.createElement('button');
      demBtn.className = 'pvp-btn';
      demBtn.textContent = `💔 ทำลายศักดิ์ศรี ${target.name}`;
      demBtn.onclick = () => selectPvpTarget(pi, i, 'demoralize');
      row.appendChild(demBtn);
    }
    
    // Create rob button (if has signal)
    if (p.inventory.includes('สัญญาณขอความช่วยเหลือ')) {
      const robBtn = document.createElement('button');
      robBtn.className = 'pvp-btn';
      robBtn.textContent = `🪙 ลักพาตัว ${target.name}`;
      robBtn.onclick = () => selectPvpTarget(pi, i, 'rob');
      row.appendChild(robBtn);
    }
    
    // Only add row if there's at least one button
    if (row.children.length > 0) {
      box.appendChild(row);
    }
  });
  document.getElementById('pvp-overlay').style.display = 'flex';
}

function closePvp() {
  document.getElementById('pvp-overlay').style.display = 'none';
}

function selectPvpTarget(fromPi, toPi, method) {
  closePvp();
  const attacker = G.players[fromPi];
  const target = G.players[toPi];
  // Basic cost
  let hoursCost = 2;
  // Resolve outcome based on method
  if (method === 'attack') {
    // Simple attack: damage target HP, attacker may take recoil if target has weapon
    const damage = attacker.inventory.includes('หอก') ? 30 : attacker.inventory.includes('มีด') ? 15 : 10;
    target.hp = clamp(target.hp - damage, 0, 100);
    addMsg(`⚔️ ${attacker.name} โจมตี ${target.name} ทำให้ HP ลด -${damage}`, 'bubble-player');
    // Possible retaliation if target alive and has weapon
    if (target.hp <= 0) {
      killPlayer(toPi);
    } else if (target.alive && target.hp > 0) {
      const retDmg = target.inventory.includes('หอก') ? 20 : target.inventory.includes('มีด') ? 10 : 5;
      attacker.hp = clamp(attacker.hp - retDmg, 0, 100);
      addMsg(`⚔️ ${target.name} โต้ตอบกลับทำให้ ${attacker.name} HP -${retDmg}`, 'bubble-event-bad');
      if (attacker.hp <= 0) {
        killPlayer(fromPi);
      }
    }
  } else if (method === 'demoralize') {
    // Demoralize reduces target's energy and may add 'tired' status
    const reduction = 20;
    target.energy = clamp(target.energy - reduction, 0, 100);
    target.statuses = addStatus(target.statuses, 'tired');
    addMsg(`💔 ${attacker.name} ทำลายศักดิ์ศรีของ ${target.name} ลดพลังงาน -${reduction}`, 'bubble-player');
  } else if (method === 'rob') {
    // Rob steals a random item from target if possible
    if (target.inventory.length) {
      const stolen = target.inventory.splice(Math.floor(Math.random()*target.inventory.length),1)[0];
      addToInventory(fromPi, stolen);
      addMsg(`🪙 ${attacker.name} ลักพาตัว ${target.name} ได้ '${stolen}'`, 'bubble-player');
    } else {
      addMsg(`🪙 ${attacker.name} พยายามลักพาตัว ${target.name} แต่ไม่มีของให้ขโมย`, 'bubble-event-bad');
    }
  }
  // Apply time cost and refresh UI
  spendTime(fromPi, hoursCost);
  renderAllPanels();
}


function showCraftPicker(pi) {
  const p = G.players[pi];
  const isEngineer = p.job.id === 'engineer';
  let html = '<div style="padding:12px 16px;">';
  html += '<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px;">🔨 คราฟของใช้</div>';
  CRAFTS.forEach(c => {
    const needs = isEngineer ? c.needs.slice(0, c.needs.length-1) : c.needs;
    const canCraft = needs.every(mat => p.inventory.includes(mat));
    html += `<div style="padding:7px;background:var(--bg4);border:0.5px solid var(--border);border-radius:5px;margin-bottom:5px;cursor:${canCraft?'pointer':'not-allowed'};opacity:${canCraft?1:0.4}"
      onclick="${canCraft?`doCraft(${pi},'${c.name}');closeShare()`:''}">
      <div style="font-size:12px;color:var(--text);font-weight:500;">${c.name}</div>
      <div style="font-size:10px;color:var(--text3);">วัสดุ: ${needs.join(',')} | เวลา: ${c.time} ชม. | ${c.desc}</div>
    </div>`;
  });
  html += '<button class="share-close" style="margin-top:8px" onclick="closeShare()">ปิด</button></div>';
  document.getElementById('share-title').textContent = '';
  document.getElementById('share-target-list').innerHTML = html;
  document.getElementById('share-overlay').style.display = 'flex';
}

function doCraft(pi, itemName) {
  const p = G.players[pi];
  const c = CRAFTS.find(x=>x.name===itemName);
  if (!c) return;
  const isEngineer = p.job.id === 'engineer';
  const needs = isEngineer ? c.needs.slice(0, c.needs.length-1) : c.needs;
  
  // Validate materials (Bug 12)
  const tempInv = [...p.inventory];
  const hasAll = needs.every(mat => {
    const idx = tempInv.indexOf(mat);
    if (idx > -1) {
      tempInv.splice(idx, 1);
      return true;
    }
    return false;
  });
  
  if (!hasAll) {
    addMsg('❌ วัตถุดิบไม่พอสำหรับการคราฟ', 'bubble-system');
    return;
  }
  
  p.inventory = tempInv;
  
  if (itemName === 'ธูปสมุนไพร') {
    G.players.forEach(p2 => { if (p2.alive) p2.sanity = 100; });
    addMsg(`✨ ${p.name} จุด "ธูปสมุนไพร" กลิ่นหอมอบอวลไปทั่วแคมป์... ทุกคน Sanity กลับมาเต็ม 100% และหายจากความกลัว!`, 'bubble-event-good');
  } else if (itemName === 'ชุดแผนที่นำทาง') {
    addToInventory(pi, itemName);
    addMsg(`🗺️ ${p.name} คราฟ "ชุดแผนที่นำทาง" สำเร็จ! จากนี้ไปจะมองเห็น Loot ทั้งหมดและไม่โดนกับดักพื้นที่อีกต่อไป`, 'bubble-event-good');
  } else {
    addToInventory(pi, itemName);
  }

  p.stats.itemsCrafted++;
  if (itemName === 'ที่พักชั่วคราว') {
    addMsg(`🔨 ${p.name} คราฟ "${itemName}" สำเร็จ! ใช้พักผ่อนคราวหลังจะได้พลังงาน +50 (ใช้งาน 1 ครั้ง)`, 'bubble-event-good');
  } else if (itemName === 'เครื่องกลั่นน้ำ') {
    addMsg(`🔨 ${p.name} คราฟ "${itemName}" สำเร็จ! อุปกรณ์จะผลิตน้ำสะอาดให้ตอนสิ้นวัน`, 'bubble-event-good');
  } else if (itemName !== 'ธูปสมุนไพร' && itemName !== 'ชุดแผนที่นำทาง') {
    addMsg(`🔨 ${p.name} คราฟ "${itemName}" สำเร็จ!${isEngineer?' [วิศวกร: ใช้วัสดุน้อยลง 1]':''}`, 'bubble-event-good');
  }
  renderAllPanels();
  spendTime(pi, c.time);
}

// ===================== RENDER =====================
function renderAllPanels() {
  G.players.forEach((p,i) => renderPanel(i));
}

function renderPanel(i) {
  const p = G.players[i];
  const el = document.getElementById(`panel-p${i}`);
  const hpW = p.hp; const huW = p.hunger; const enW = p.energy; const tiW = (p.hoursLeft/24)*100;
  const statusHTML = p.alive
    ? p.statuses.map(s=>`<span class="status-tag tag-${s}">${statusLabel(s)}</span>`).join('')
    : '<span class="status-tag tag-dead">☠️ เสียชีวิต</span>';

  const isHuman = (i === 0);
  const humanIsSpy = (G.players[0] && G.players[0].job && G.players[0].job.id === 'spy');
  const shouldReveal = isHuman || humanIsSpy || !p.alive;
  
  let invHTML = '';
  if (shouldReveal) {
    invHTML = p.inventory.map((item, idx)=> {
      const isPoisoned = item === 'อาหารอาบยาพิษ';
      const cssClass = isPoisoned ? ' inv-item-poisoned' : (item==='ผลไม้มีพิษ'||item==='น้ำเน่า'||item==='ยาพิษ'?' toxic':'');
      const canDeposit = isHuman && p.atCamp;
      
      // Calculate craftable hint
      const recipes = CRAFTS.filter(c => c.needs.includes(item));
      const recipeText = recipes.length ? `\nคราฟได้: ${recipes.map(r=>r.name).join(', ')}` : '\n(ใช้ประโยนช์อื่นๆ)';
      const tooltip = `${item}${recipeText}`;
      const isUsedInCraftable = recipes.some(c => {
        const inv = [...p.inventory];
        return c.needs.every(need => {
          const nIdx = inv.indexOf(need);
          if (nIdx > -1) { inv.splice(nIdx, 1); return true; }
          return false;
        }) && p.hoursLeft >= c.time;
      });

      // ... (previous logic for CSS and tooltip)
      
      // Added draggable support
      return `<span class="inv-item${cssClass}" title="${tooltip}" style="cursor:grab;position:relative;" 
        draggable="true" 
        ondragstart="event.dataTransfer.setData('text/plain', '${idx}')"
        onclick="showItemInfo('${item.replace(/'/g, "\\'")}')" 
        oncontextmenu="if(${canDeposit}){depositToCamp(0, ${idx});return false;}">
        ${item}${isUsedInCraftable ? '<div class="craft-badge" style="width:6px;height:6px;top:0;right:0;"></div>' : ''}
      </span>`;
    }).join('');
  } else {
    invHTML = `<span class="inv-item inv-item-secret">[ ซ่อนอยู่ ]</span>`;
  }

  const limit = getInventoryLimit(p);
  const inventoryTitle = shouldReveal ? `🎒 ของในครอบครอง (${p.inventory.length}/${limit})` : `🎒 ของในครอบครอง (ความลับ - ${p.inventory.length} ชิ้น)`;

  el.innerHTML = `
    <div class="p-header">
      <div class="p-avatar" style="background:${p.color}22;color:${p.color};">${p.emoji}</div>
      <div>
        <div class="p-name">${p.name}</div>
        <div class="p-class">${p.job ? p.job.emoji + ' ' + p.job.name : 'รอดำเนินการ'}</div>
        <div style="font-size:11px;color:var(--text3);">🔒 ความไว้วางใจ ${p.trust || 0}%</div>
      </div>
      <div style="font-size:11px;color:var(--text3);">${p.atCamp?'⛺ แคมป์':'🌿 ป่า'}</div>
    </div>
    <div class="stat-row"><div class="stat-label"><span>❤️ HP</span><span>${p.hp}</span></div><div class="stat-track"><div class="stat-fill fill-hp" style="width:${hpW}%"></div></div></div>
    <div class="stat-row"><div class="stat-label"><span>🍖 ความหิว</span><span>${p.hunger}</span></div><div class="stat-track"><div class="stat-fill fill-hunger" style="width:${huW}%"></div></div></div>
    <div class="stat-row"><div class="stat-label"><span>💧 ความกระหาย</span><span>${p.thirst}%</span></div><div class="stat-track"><div class="stat-fill fill-thirst" style="width:${p.thirst}%"></div></div></div>
    <div class="stat-row"><div class="stat-label"><span>⚡ พลังงาน</span><span>${p.energy}%</span></div><div class="stat-track"><div class="stat-fill fill-energy" style="width:${enW}%"></div></div></div>
    <div class="stat-row"><div class="stat-label"><span>🧠 ค่าสติ (Sanity)</span><span>${p.sanity}%</span></div><div class="stat-track"><div class="stat-fill fill-sanity" style="width:${p.sanity}%"></div></div></div>
    <div class="stat-row"><div class="stat-label"><span>⏰ เวลา</span><span>${p.hoursLeft}ชม.</span></div><div class="stat-track"><div class="stat-fill fill-time" style="width:${tiW}%"></div></div></div>
    <div class="p-status-tags">${statusHTML}</div>
    <div class="p-inventory">
      <div class="inv-title">${inventoryTitle}</div>
      <div class="inv-items${p.inventory.length >= limit ? ' full' : ''}">${invHTML}</div>
      ${isHuman && p.atCamp ? '<div style="font-size:8px;color:var(--text3);margin-top:2px;">* คลิกเพื่อฝากของในคลังแคมป์</div>' : ''}
    </div>
    <div class="skill-badge">✨ ${p.job ? p.job.skill : 'รอดำเนินการ'}</div>
  `;
}

function renderLocations() {
  const container = document.getElementById('locations-row');
  const hasMap = G.players.some(p => p.alive && p.inventory.includes('ชุดแผนที่นำทาง'));
  
  let html = G.locations.map((loc,i)=> {
    const lootList = hasMap ? `<div style="font-size:9px;color:var(--amber2);margin-top:4px;">📦 Loot: ${loc.loot.join(', ')}</div>` : '';
    return `
    <div class="loc-card${loc.blocked?' loc-blocked':''}" id="loc-${i}" onclick="showLocationPicker(${G.currentPlayer})">
      <div class="loc-icon">${loc.emoji}</div>
      <div class="loc-name">${loc.name}</div>
      <div class="loc-time">⏰ ${loc.time} ชม.</div>
      <div class="loc-desc">${loc.desc}</div>
      ${lootList}
      ${loc.blocked?'<div class="loc-badge badge-danger">⛔ ปิดวันนี้</div>':''}
      ${loc.danger>0.35?'<div class="loc-badge badge-danger">⚠️ อันตราย</div>':''}
      ${loc.loot.length>2?'<div class="loc-badge badge-loot" style="top:22px">🎒 มีของ</div>':''}
    </div>
  `;}).join('');

  // Add Map Event Card
  if (G.mapEvent) {
    const m = G.mapEvent;
    html += `
      <div class="loc-card map-event${m.explored?' explored':''}" onclick="exploreMapEvent(${G.currentPlayer})">
        <div class="loc-icon">${m.emoji}</div>
        <div class="loc-name">${m.name}</div>
        <div class="loc-time">⏰ ${m.time} ชม.</div>
        <div class="loc-desc">${m.desc}</div>
        <div class="loc-badge badge-special">🗺️ พิเศษ</div>
        ${m.explored ? `<div class="loc-badge badge-loot" style="top:22px">✔️ โดย ${G.players[m.exploredBy].name}</div>` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

function buildCraftList() {
  document.getElementById('craft-list').innerHTML = CRAFTS.map(c=>`
    <div class="craft-item" title="${c.desc}">
      <div>${c.name}</div>
      <div class="craft-req">🪵 ${c.needs.join('+')} | ⏰${c.time}ชม.</div>
    </div>
  `).join('');
}

function addWildlife(text) {
  const log = document.getElementById('wildlife-log');
  if (log.children[0]?.style?.color === 'var(--text3)') log.innerHTML = '';
  const entry = document.createElement('div');
  entry.className = 'wild-entry';
  entry.innerHTML = `<i class="ti ti-paw" aria-hidden="true" style="color:var(--amber);font-size:13px;"></i>${text}`;
  log.prepend(entry);
  if (log.children.length > 5) log.removeChild(log.lastChild);
}

function showItemInfo(item) {
  const recipes = CRAFTS.filter(c => c.needs.includes(item));
  let msg = `🔎 **ไอเทม: ${item}**\n`;
  if (isFood(item)) msg += `• ประโยชน์: ใช้กินเพื่อฟื้นฟูความหิว/กระหาย\n`;
  if (['หอก','มีด','ขวานเหล็ก'].includes(item)) msg += `• ประโยชน์: ใช้ป้องกันตัวจากสัตว์ป่า\n`;
  if (item === 'ยาสมุนไพร' || item === 'ชุดปฐมพยาบาล') msg += `• ประโยชน์: ใช้รักษาบาดแผลและโรค\n`;
  
  if (recipes.length) {
    msg += `• คราฟเป็น: ${recipes.map(r => r.name).join(', ')}\n`;
    recipes.forEach(r => {
      msg += `  - *${r.name}*: ใช้ ${r.needs.join('+')} (⏰ ${r.time}ชม.)\n`;
    });
  } else {
    msg += `• ประโยชน์: ไอเทมนี้ไม่มีสูตรคราฟ (อาจใช้กับอีเวนต์พิเศษ)\n`;
  }
  addMsg(msg, 'bubble-system');
}

// ===================== UI HELPERS =====================
function addMsg(text, cls) {
  const area = document.getElementById('story-box');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'story-msg';
  const bubble = document.createElement('div');
  bubble.className = `story-bubble ${cls}`;
  bubble.innerHTML = text.replace(/\n/g,'<br>');
  msgDiv.appendChild(bubble);
  area.appendChild(msgDiv);
  area.scrollTop = area.scrollHeight;
}

function showTyping() {
  const area = document.getElementById('story-box');
  const el = document.createElement('div');
  el.className = 'story-msg'; el.id = 'typing-indicator';
  el.innerHTML = '<div class="story-bubble bubble-narrator"><div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>';
  area.appendChild(el);
  area.scrollTop = area.scrollHeight;
}

function removeTyping() { document.getElementById('typing-indicator')?.remove(); }

function setButtons(disabled) {
  document.querySelectorAll('.act-btn, #send-custom, #custom-in').forEach(b=>b.disabled=disabled);
}

function clamp(v,mn,mx) { return Math.max(mn,Math.min(mx,v)); }

function isFood(item) { return ['ปลา','ปลาย่าง','น้ำสะอาด','ผลไม้','ผลไม้มีพิษ','สมุนไพร','เห็ด','น้ำเน่า','กบ','แมลง','อาหารกระป๋อง','อาหารเก่า','อาหารอุ่น','ค้างคาว','กวาง','กระต่าย','เนื้อสัตว์','เนื้อย่าง','ซุปเห็ด','ยาบำรุง','ไข่','หม้อไฟป่า','ซุปสมาธิ'].includes(item); }

function addStatus(arr, s) { return arr.includes(s) ? arr : [...arr, s]; }

function statusLabel(s) {
  return {poison:'☠️พิษ',sick:'🤒ป่วย',tired:'😴ง่วง',hungry:'😫หิว',thirsty:'💧กระหาย',injured:'🩸บาดเจ็บ',wet:'💧เปียก',cold:'🥶หนาว',paranoid:'😱หวาดระแวง',burned:'🔥ไหม้',stunned:'💫งง'}[s] || s;
}

function sendCustomAction() {
  if (G.currentPlayer !== 0) {
    addMsg('❌ ไม่สามารถพิมพ์ได้ในขณะที่ไม่ใช่ตาของคุณ', 'bubble-system');
    return;
  }
  const input = document.getElementById('custom-in');
  const val = input.value.trim();
  if (!val || G.isLoading) return;
  input.value = '';
  const pi = G.currentPlayer;
  const p = G.players[pi];
  if (!p || !p.alive) return;
  callAI(pi, val, 3);
}

document.getElementById('custom-in')?.addEventListener('keydown', e => { if(e.key==='Enter') sendCustomAction(); });

// Start screen triggering
document.addEventListener('DOMContentLoaded', () => {
    // API Key Auto-load
    const keyInput = document.getElementById('api-key-input');
    if (keyInput) {
        const savedKey = localStorage.getItem('anthropic_api_key');
        if (savedKey) {
            keyInput.value = savedKey;
            window.ANTHROPIC_API_KEY = savedKey;
        }
    }

    // Direct JS Event Binding to avoid HTML reference errors
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = startCharacterSequence;
    }
});







