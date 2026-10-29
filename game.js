// ===================== DATA =====================
const JOBS = [
  { id:'hunter',    name:'นักล่า',      emoji:'🏹', skill:'ล่าสัตว์ได้ทันที (วันละ 1 ครั้ง)',     skDesc:'ล่าสัตว์' },
  { id:'doctor',    name:'หมอ',         emoji:'🩺', skill:'รักษาทุกคนในกลุ่ม HP +50 (วันละ 1 ครั้ง)', skDesc:'รักษากลุ่ม' },
  { id:'thief',     name:'โจร',         emoji:'🗡️', skill:'ขโมยไอเทม 2 ชิ้นจากใครก็ได้ (วันละ 1 ครั้ง)', skDesc:'ขโมยคู่' },
  { id:'chef',      name:'พ่อครัว',     emoji:'🍳', skill:'เสกอาหารอุ่น 3 กล่องให้กลุ่ม (วันละ 1 ครั้ง)', skDesc:'เสกอาหาร' },
  { id:'scout',     name:'ลูกเสือ',     emoji:'🧭', skill:'สแกนพื้นที่: วันนี้สำรวจได้ผลดีเสมอ ไม่เจอสัตว์ป่า และเห็นอันตรายทุกที่ (วันละ 1 ครั้ง)',              skDesc:'สแกนพื้นที่' },
  { id:'soldier',   name:'ทหาร',        emoji:'⚔️', skill:'เคลียร์เส้นทาง: ทั้งทีมไม่เจอสัตว์ป่าตลอดวันนี้ + ได้เนื้อสัตว์ (วันละ 1 ครั้ง)',  skDesc:'ปราบบอส' },
  { id:'shaman',    name:'หมอผี',       emoji:'🪄', skill:'พยากรณ์อากาศ 3 วันข้างหน้าได้แม่นยำ + ทุกคนค่าสติ +15 (วันละ 1 ครั้ง)',   skDesc:'หยั่งรู้' },
  { id:'engineer',  name:'วิศวกร',      emoji:'🔧', skill:'เลือกสร้างสิ่งปลูกสร้างแคมป์ 1 อย่างฟรี (วันละ 1 ครั้ง) · ติดตัว: คราฟเร็วขึ้น 1 ชม. ซ่อมของได้',    skDesc:'สร้างฟรี' },
  { id:'merchant',  name:'พ่อค้า',      emoji:'💰', skill:'เลือกแลกของกับคลังแคมป์ได้ 3 ชิ้น หรือขายของมีค่าเป็นวัสดุ (วันละ 1 ครั้ง)',    skDesc:'เทรดด่วน' },
  { id:'spy',       name:'สายลับ',      emoji:'🕵️', skill:'ส่องฝ่ายลับของคน 1 คน และดูของในกระเป๋าเขา (วันละ 1 ครั้ง)',       skDesc:'เปิดเผยความลับ' },
];

const LOCATIONS = [
  { id:'cave',     name:'ถ้ำมืด',        emoji:'🪨', time:6,  danger:0.4, desc:'อาจพบที่พักและแร่', loot:['หิน','ไม้เนื้อแข็ง','ค้างคาว','น้ำใต้ดิน','แร่เหล็ก','ฟอสซิล','ตะเกียงเก่า'], wild:['ค้างคาว','หมี'] },
  { id:'river',    name:'แม่น้ำ',         emoji:'🌊', time:4,  danger:0.2, desc:'น้ำดื่ม ปลา ยา', loot:['ปลา','น้ำสะอาด','สมุนไพร','หิน','กุ้งฝอย','หอยเชลล์','สาหร่ายผูกเชือก'], wild:['จระเข้','งูน้ำ'] },
  { id:'hut',      name:'กระท่อมร้าง',    emoji:'🛖', time:5,  danger:0.3, desc:'ของใช้เก่า อาหาร อุปกรณ์', loot:['มีด','ไม้ขีดไฟ','อาหารกระป๋อง','เชือก','ผ้า','กระทะเก่า','เมล็ดพืช'], wild:['หมาจิ้งจอก','งู'] },
  { id:'forest',   name:'ป่าทึบ',         emoji:'🌳', time:5,  danger:0.35,desc:'ผลไม้ ไม้ สมุนไพร', loot:['ผลไม้','ผลไม้มีพิษ','ไม้','สมุนไพร','เห็ด','รวงผึ้ง','ไก่ป่า','ไข่นก'], wild:['หมูป่า','เสือ','งูพิษ'] },
  { id:'cliff',    name:'หน้าผาสูง',      emoji:'🏔️', time:7,  danger:0.45,desc:'มองเห็นไกล แต่อันตราย', loot:['หิน','สัญญาณขอความช่วยเหลือ','แร่หายาก','ขนนกอินทรี','พลอย','เถาวัลย์'], wild:['นกอินทรี','แมวป่า'] },
  { id:'swamp',   name:'หนองน้ำ',         emoji:'🌿', time:5,  danger:0.3, desc:'พืชยา แต่เสี่ยงป่วย', loot:['สมุนไพรหายาก','น้ำเน่า','กบ','ดินเหนียว','ไข่จระเข้','มอสเรืองแสง'], wild:['งูพิษ','จระเข้'] },
  { id:'meadow',  name:'ทุ่งหญ้า',        emoji:'🌾', time:3,  danger:0.1, desc:'เปิดโล่ง หาสัญญาณได้ง่าย', loot:['หญ้าแห้ง','แมลง','ดอกไม้ยา','กระต่าย','ดอกไม้ป่า','รังตั๊กแตน'], wild:['กระต่าย','กวาง'] },
  { id:'ruins',   name:'ซากอาคาร',        emoji:'🏚️', time:6,  danger:0.35,desc:'ของเก่า แต่เสี่ยงพัง', loot:['โลหะเก่า','แก้ว','เชือก','อาหารเก่า','ชิ้นส่วนวิทยุ','แบตเตอรี่เสื่อม','เศษเหล็ก'], wild:['สุนัขจรจัด','แมลงพิษ'] },
  { id:'waterfall',name:'น้ำตกใหญ่',      emoji:'🚿', time:5,  danger:0.25,desc:'น้ำสะอาดและปลาชุกชุม', loot:['น้ำสะอาด','ปลา','หินสวยงาม','ดอกไม้บาน','ปูน้ำจืด'], wild:['ลิง','งูน้ำ'] },
  { id:'temple',   name:'วัดร้าง',        emoji:'🛕', time:8,  danger:0.5, desc:'สถานที่ลึกลับ อาจมีอาวุธ', loot:['เครื่องราง','ผ้าเก่า','แร่หายาก','สมุนไพรหายาก','อาวุธโบราณ'], wild:['งูจงอาง','ค้างคาว'] },
  { id:'orchard',  name:'สวนผลไม้ป่า',    emoji:'🍎', time:4,  danger:0.15,desc:'ผลไม้เยอะแยะและน้ำผึ้ง', loot:['ผลไม้','รวงผึ้ง','เมล็ดพืช','ไก่ป่า','ไม้'], wild:['ผึ้ง','กระรอก'] },
  { id:'graveyard',name:'สุสานเครื่องจักร', emoji:'⚙️', time:7,  danger:0.4, desc:'ขยะเหล็กและแบตเตอรี่', loot:['เศษเหล็ก','โลหะเก่า','แก้ว','แบตเตอรี่เสื่อม','ตะเกียงเก่า'], wild:['สุนัขจรจัด','แมลงพิษ'] },
];

// ===================== CRAFTING DATA =====================
// Basic materials live in the team's material pouch (G.mats) as counts, not in the 5-slot bag.
const BASIC_MATS = ['ไม้','หิน','เชือก','ผ้า','สมุนไพร','โลหะเก่า','หญ้าแห้ง'];
const MAT_ICON = { 'ไม้':'🪵', 'หิน':'🪨', 'เชือก':'🪢', 'ผ้า':'🧵', 'สมุนไพร':'🌿', 'โลหะเก่า':'🔩', 'หญ้าแห้ง':'🌾' };
// Loot that turns into materials when picked up
const MAT_ALIAS = {
  'ไม้เนื้อแข็ง':['ไม้',2], 'เถาวัลย์':['เชือก',1], 'สาหร่ายผูกเชือก':['เชือก',1], 'ผ้าเก่า':['ผ้า',1],
  'เศษเหล็ก':['โลหะเก่า',1], 'แร่เหล็ก':['โลหะเก่า',2], 'ดินเหนียว':['หิน',1],
  'ดอกไม้ยา':['สมุนไพร',1], 'ดอกไม้ป่า':['สมุนไพร',1], 'ดอกไม้บาน':['สมุนไพร',1],
};
// Loot that turns into a more common item when picked up
const ITEM_ALIAS = { 'น้ำใต้ดิน':'น้ำสะอาด', 'แผนที่โลก':'แผนที่ลึกลับ', 'วิทยุสื่อสาร':'ชิ้นส่วนวิทยุ' };
// Materials every explore gives for sure, by location type
const LOC_MATS = {
  cave:['หิน','หิน','โลหะเก่า'], river:['หิน','เชือก','สมุนไพร'], hut:['ผ้า','ไม้','เชือก'], forest:['ไม้','ไม้','เชือก'],
  cliff:['หิน','เชือก','หญ้าแห้ง'], swamp:['สมุนไพร','เชือก','หญ้าแห้ง'], meadow:['หญ้าแห้ง','สมุนไพร','ไม้'],
  ruins:['โลหะเก่า','ผ้า','โลหะเก่า'], waterfall:['หิน','สมุนไพร','เชือก'], temple:['ผ้า','หิน','สมุนไพร'],
  orchard:['ไม้','หญ้าแห้ง','ไม้'], graveyard:['โลหะเก่า','โลหะเก่า','ผ้า'],
};
// Valuables: end score, the treasure-hunter's goal, and the merchant can sell them for materials
const VALUABLES = ['ทองคำแท่ง','พลอย','ฟอสซิล','มุกน้ำจืด','หินสวยงาม','ขนนกอินทรี','แร่หายาก','คัมภีร์ลับ','เครื่องราง'];
// Break things down into materials at the workbench
const SALVAGE = {
  'ตะเกียงเก่า':{ 'โลหะเก่า':1 }, 'กระทะเก่า':{ 'โลหะเก่า':2 }, 'เต็นท์ทหาร':{ 'ผ้า':3, 'เชือก':1 }, 'กระสุนเก่า':{ 'โลหะเก่า':1 },
  'แก้ว':{ 'หิน':1 }, 'แบตเตอรี่เสื่อม':{ 'โลหะเก่า':1 }, 'อาวุธโบราณ':{ 'โลหะเก่า':3 }, 'ชุดเกราะเก่า':{ 'โลหะเก่า':2, 'ผ้า':1 },
  'ที่พักชั่วคราว':{ 'ผ้า':1, 'ไม้':1 }, 'ผลไม้มีพิษ':{ 'สมุนไพร':1 }, 'รังตั๊กแตน':{ 'หญ้าแห้ง':2 },
};
// Uses before a tool breaks
const DURABILITY = { 'หอก':5, 'มีด':8, 'โล่ไม้':5, 'ธนู':6, 'ขวานเหล็ก':8, 'ไม้เท้าเดินป่า':6, 'เบ็ดตกปลา':5, 'คบเพลิง':2 };

// cat: tool | med | rescue · tier 1 anywhere, 2 needs the workbench, 3 needs camp Lv.3
// start: known from the beginning; the rest are discovered when the team first holds an ingredient
// side: 'evil' recipes only show to the evil player
const CRAFTS = [
  { name:'หอก',          icon:'🗡️', cat:'tool', tier:1, needs:['ไม้','หิน'], time:1, start:true, desc:'อาวุธ DMG 40 · ใช้ได้ 5 ครั้ง' },
  { name:'มีด',          icon:'🔪', cat:'tool', tier:1, needs:['หิน','หิน'], time:1, desc:'อาวุธ DMG 20 · เปิดหีบ/ทางพิเศษ · ใช้ได้ 8 ครั้ง' },
  { name:'โล่ไม้',        icon:'🛡️', cat:'tool', tier:1, needs:['ไม้','ไม้','เชือก'], time:1, desc:'ลดดาเมจที่ได้รับ 30% · ใช้ได้ 5 ครั้ง' },
  { name:'คบเพลิง',       icon:'🔥', cat:'tool', tier:1, needs:['ไม้','หญ้าแห้ง'], time:0, start:true, desc:'สำรวจที่มืดปลอดภัยขึ้น · ส่งสัญญาณกู้ภัยวันที่ 7' },
  { name:'เชือกยาว',      icon:'🪢', cat:'tool', tier:1, needs:['เชือก','เชือก'], time:0, desc:'ปีนผา/น้ำตกปลอดภัยขึ้น · เข้าพื้นที่พิเศษได้' },
  { name:'ไม้เท้าเดินป่า', icon:'🦯', cat:'tool', tier:1, needs:['ไม้'], time:0, desc:'สำรวจเร็วขึ้น 1 ชม. · ใช้ได้ 6 ครั้ง' },
  { name:'เบ็ดตกปลา',     icon:'🎣', cat:'tool', tier:1, needs:['ไม้','เชือก'], time:1, desc:'ปลดล็อกปุ่ม "ตกปลา" · ใช้ได้ 5 ครั้ง' },
  { name:'กับดักสัตว์',    icon:'🪤', cat:'tool', tier:1, needs:['ไม้','เชือก'], time:1, desc:'วางรอบแคมป์ จับสัตว์ได้ตอนกลางคืน' },
  { name:'กระเป๋าคาดเอว',  icon:'👝', cat:'tool', tier:1, needs:['ผ้า','ผ้า','เชือก'], time:1, desc:'ช่องกระเป๋า +2 ถาวร' },
  { name:'ที่พักชั่วคราว',  icon:'⛺', cat:'tool', tier:1, needs:['ผ้า','ไม้'], time:1, desc:'พักนอกแคมป์ได้ พลังงาน +50 (ใช้ครั้งเดียว)' },
  { name:'ธนู',          icon:'🏹', cat:'tool', tier:2, needs:['ไม้','ไม้','เชือก'], time:1, desc:'ยิงก่อน DMG 25 สัตว์สวนกลับไม่ได้ · ใช้ได้ 6 ครั้ง' },
  { name:'ขวานเหล็ก',     icon:'🪓', cat:'tool', tier:2, needs:['โลหะเก่า','โลหะเก่า','ไม้'], time:2, desc:'DMG +12 · เก็บวัสดุได้ไม้เพิ่ม · ใช้ได้ 8 ครั้ง' },
  { name:'ไฟฉาย',        icon:'🔦', cat:'tool', tier:2, needs:['ตะเกียงเก่า','แบตเตอรี่เสื่อม'], time:1, desc:'สำรวจถ้ำ/วัด/ซากอาคารปลอดภัย + ได้ของเพิ่ม (ไม่หมด)' },
  { name:'เครื่องกลั่นน้ำ',  icon:'💧', cat:'tool', tier:2, needs:['หิน','หิน','ผ้า'], time:2, desc:'ได้น้ำสะอาด 1 ขวดทุกคืน' },
  { name:'ผ้าพันแผล',     icon:'🩹', cat:'med',  tier:1, needs:['ผ้า'], time:0, start:true, desc:'รักษาบาดเจ็บ HP +15' },
  { name:'ยาสมุนไพร',     icon:'💊', cat:'med',  tier:1, needs:['สมุนไพร','สมุนไพร'], time:1, start:true, desc:'หายป่วย/พิษ/บาดเจ็บ HP +25' },
  { name:'ยาบำรุงกำลัง',   icon:'⚡', cat:'med',  tier:1, needs:['สมุนไพร','รวงผึ้ง'], time:0, desc:'กินแล้วพลังงาน +40 หิว +10' },
  { name:'ธูปสมุนไพร',     icon:'🪔', cat:'med',  tier:2, needs:['สมุนไพร','สมุนไพร','หญ้าแห้ง'], time:1, desc:'จุดทันที: ทุกคนค่าสติ +40' },
  { name:'หม้อไฟป่า',      icon:'🍲', cat:'med',  tier:3, needs:['กระทะเก่า','เนื้อสัตว์','สมุนไพร'], time:2, desc:'กินแล้วทุกคน HP/หิว/น้ำ เต็ม และหายป่วย' },
  { name:'สัญญาณขอความช่วยเหลือ', icon:'🎆', cat:'rescue', tier:2, needs:['หญ้าแห้ง','หญ้าแห้ง','ผ้า','ไม้ขีดไฟ'], time:1, desc:'พลุสัญญาณ: โอกาสกู้ภัย +45% วันที่ 7' },
  { name:'ชุดแผนที่นำทาง',  icon:'🗺️', cat:'rescue', tier:2, needs:['แผนที่ลึกลับ','ผ้า'], time:1, desc:'สำรวจเร็วขึ้น 3 ชม. + เห็นของทุกสถานที่' },
  { name:'วิทยุกู้ภัย SOS', icon:'📻', cat:'rescue', tier:3, needs:['ชิ้นส่วนวิทยุ','แบตเตอรี่เสื่อม','โลหะเก่า','โลหะเก่า'], time:3, desc:'กู้ภัยสำเร็จ 100% ในวันที่ 7' },
  { name:'ยาพิษ',        icon:'🧪', cat:'med',  tier:1, needs:['ผลไม้มีพิษ'], time:0, side:'evil', desc:'(ลับ) ผสมลงอาหารของคนอื่น' },
  { name:'ยาพิษไร้กลิ่น',  icon:'🫙', cat:'med',  tier:1, needs:['ผลไม้มีพิษ','สมุนไพร'], time:1, side:'evil', desc:'(ลับ) วางยาตอนกลางคืนโดยแทบไม่ทิ้งเบาะแส' },
  { name:'กับดักแคมป์',    icon:'🕸️', cat:'tool', tier:1, needs:['ไม้','เชือก'], time:1, side:'evil', desc:'(ลับ) ซ่อนในแคมป์ คนเฝ้ายามจะบาดเจ็บ' },
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

// decay: stat loss per turn, animalHp/animalDmg: wildlife strength,
// restHp: HP regained when resting, botCaution: >1 = bots play safer
const DIFFICULTIES = {
  easy:   { id:'easy',   name:'ง่าย',  emoji:'🌱', decay:0.65, animalHp:0.75, animalDmg:0.7,  restHp:10, botCaution:1.25, desc:'ค่าสถานะลดช้า สัตว์ป่าอ่อนแอ' },
  normal: { id:'normal', name:'ปกติ',  emoji:'🌲', decay:0.85, animalHp:0.9,  animalDmg:0.85, restHp:6,  botCaution:1.0,  desc:'สมดุล เหมาะกับการเล่นครั้งแรก' },
  hard:   { id:'hard',   name:'ยาก',   emoji:'💀', decay:1.35, animalHp:1.3,  animalDmg:1.4,  restHp:0,  botCaution:0.6,  desc:'ป่าโหดร้าย บอทกล้าเสี่ยงมากขึ้น' },
};
let selectedDifficulty = 'normal';

function getDifficulty() {
  return DIFFICULTIES[G.difficulty] || DIFFICULTIES.normal;
}

function selectDifficulty(id) {
  if (!DIFFICULTIES[id]) return;
  selectedDifficulty = id;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === id));
  const desc = document.getElementById('difficulty-desc');
  if (desc) desc.textContent = DIFFICULTIES[id].desc;
}
window.selectDifficulty = selectDifficulty;

function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

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
  socket.on('gameStateUpdate', (data) => {
    if (G.mode === 'multi') {
      const wasMyTurn = (G.players[G.currentPlayer] && G.players[G.currentPlayer].id === socket.id);
      
      G = data.G;
      
      // Update UI panels
      renderAllPanels();
      updateCampUI();
      buildCraftList();
      renderLocations();
      
      // Update turn headers and overlay locking
      updateTurnHeader(G.currentPlayer);
      
      const isMyTurn = (G.players[G.currentPlayer] && G.players[G.currentPlayer].id === socket.id);
      if (isMyTurn) {
        renderActions(G.currentPlayer);
        if (!wasMyTurn) {
          addMsg(`🎮 ตาของคุณแล้ว! เลือกการกระทำของคุณ (${G.players[G.currentPlayer].hoursLeft} ชม. เหลือ)`, 'bubble-system');
        }
      } else {
        // Clear buttons area
        const container = document.getElementById('action-buttons');
        if (container) container.innerHTML = '';
      }

      // Update combat overlay visibility based on combatState
      const combatOverlay = document.getElementById('combat-overlay');
      if (combatOverlay) {
        if (G.combatState) {
          combatOverlay.style.display = 'flex';
          renderCombatScreen();
        } else {
          combatOverlay.style.display = 'none';
        }
      }
    }
  });

  socket.on('joinedRoom', (roomData) => {
    G.lobbyPlayers = roomData.players;
    G.roomCode = roomData.code;
    toggleLobbyControls('player');
    renderLobbyPlayers();
  });

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

  socket.on('broadcastMessage', (data) => {
    if (G.mode === 'multi' && !G.isHost) {
      addMsg(data.text, data.cls);
    }
  });

  socket.on('broadcastTyping', (data) => {
    if (G.mode === 'multi' && !G.isHost) {
      if (data.show) showTyping();
      else removeTyping();
    }
  });

  socket.on('handleClientAction', (data) => {
    if (G.mode === 'multi' && G.isHost) {
      const { action, args } = data;
      console.log('Host processing client action:', action, args);
      
      switch(action) {
        case 'handleAction':
          handleAction(args[0], args[1], args[2]);
          break;
        case 'explore':
          exploreLocation(args[0], args[1]);
          break;
        case 'exploreMapEvent':
          doExploreMapEvent(args[0], args[1], args[2], args[3]);
          break;
        case 'share':
          doShare(args[0], args[1], args[2]);
          break;
        case 'craft':
          doCraft(args[0], args[1]);
          break;
        case 'salvage':
          doSalvage(args[0], args[1]);
          break;
        case 'repair':
          doRepair(args[0], args[1]);
          break;
        case 'pvp':
          selectPvpTarget(args[0], args[1], args[2]);
          break;
        case 'cook':
          doCookFood(args[0], args[1], args[2], args[3], args[4]);
          break;
        case 'build':
          doBuildCampStructure(args[0], args[1], args[2]);
          break;
        case 'deposit':
          depositToCamp(args[0], args[1]);
          break;
        case 'withdraw':
          takeFromCamp(args[0], args[1]);
          break;
        case 'combatRound':
          doCombatRound(args[0]);
          break;
        case 'endPlayerTurn':
          endPlayerTurn(args[0]);
          break;
        default:
          console.error('Unknown action received by host:', action);
      }
    }
  });

  socket.on('hostChanged', (savedG) => {
    G.isHost = true;
    if (savedG) {
      G = savedG;
    }
    addMsg('👑 คุณได้รับเลือกเป็นหัวหน้าห้องคนใหม่ (Host) ระบบประสานข้อมูลได้รับการโอนย้ายแล้ว', 'bubble-system');
    socket.emit('hostSyncState', { roomCode: G.roomCode, G });
    
    renderAllPanels();
    updateCampUI();
    buildCraftList();
    renderLocations();
    updateTurnHeader(G.currentPlayer);
    if (G.currentPlayer !== -1 && G.players[G.currentPlayer]) {
      const isMyTurn = (G.players[G.currentPlayer].id === socket.id);
      if (isMyTurn) {
        renderActions(G.currentPlayer);
      } else {
        const container = document.getElementById('action-buttons');
        if (container) container.innerHTML = '';
      }
    }
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
    const diffPicker = document.getElementById('difficulty-picker');
    if (diffPicker) diffPicker.style.display = '';
    
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

  // Difficulty is a single-player option
  const diffPicker = document.getElementById('difficulty-picker');
  if (diffPicker) diffPicker.style.display = 'none';

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

// ===================== SINGLE-PLAYER AUTOSAVE =====================
// Bump SAVE_VERSION whenever the saved shape changes; older saves are then ignored.
const SAVE_KEY = 'forest_survival_save';
const SAVE_VERSION = 2;
const SAVE_LOG_LIMIT = 150; // story-box messages kept in a save

// phase 'turn': saved at the top of startTurn (before decay) → resume with startTurn(currentPlayer)
// phase 'newDay': saved at the end of endDay (day already advanced) → resume with startDay()
function saveGame(phase) {
  if (G.mode === 'multi') return;
  try {
    const box = document.getElementById('story-box');
    const msgs = box ? [...box.children].filter(el => el.id !== 'typing-indicator') : [];
    const data = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      phase,
      state: {
        players: G.players, day: G.day, currentPlayer: G.currentPlayer,
        dayDone: G.dayDone, thiefUsed: G.thiefUsed, locations: G.locations,
        camp: G.camp, weather: G.weather, activeEvent: G.activeEvent,
        mapEvent: G.mapEvent, rescueData: G.rescueData,
        usedEventIds: G.usedEventIds, activeTraps: G.activeTraps,
        mats: G.mats, discovered: G.discovered, weatherQueue: G.weatherQueue, safeDay: G.safeDay
      },
      storyLog: msgs.slice(-SAVE_LOG_LIMIT).map(el => el.outerHTML).join(''),
      dailyEventHtml: document.getElementById('daily-event-box')?.innerHTML || ''
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Autosave failed:', err);
  }
}

// Returns a valid save or null; a broken or outdated save is removed.
function readSave() {
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); } catch (err) { return null; }
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const s = data && data.state;
    const ok = data.version === SAVE_VERSION && s
      && Array.isArray(s.players) && s.players.length
      && s.players.every(p => p && p.job && Array.isArray(p.inventory) && Array.isArray(p.statuses))
      && Number.isInteger(s.day) && s.day >= 1 && s.day <= 7
      && Number.isInteger(s.currentPlayer) && s.players[s.currentPlayer]
      && Array.isArray(s.locations) && s.camp && s.weather
      && (data.phase === 'turn' || data.phase === 'newDay');
    if (ok) return data;
  } catch (err) { /* fall through */ }
  clearSave();
  return null;
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (err) { /* ignore */ }
  refreshContinueButton();
}

function refreshContinueButton() {
  const btn = document.getElementById('continue-btn');
  if (!btn) return;
  const save = readSave();
  btn.style.display = save ? 'block' : 'none';
  if (save) btn.textContent = `▶️ เล่นต่อ (วันที่ ${save.state.day})`;
}

function continueSavedGame() {
  const save = readSave();
  if (!save) { refreshContinueButton(); return; }
  try {
    const s = save.state;
    Object.assign(G, {
      mode: 'single', isHost: false, roomCode: '', lobbyPlayers: [],
      players: s.players, day: s.day, currentPlayer: s.currentPlayer,
      dayDone: s.dayDone || [false,false,false,false],
      thiefUsed: s.thiefUsed || [false,false,false,false],
      locations: s.locations, camp: s.camp, weather: s.weather,
      activeEvent: s.activeEvent || {}, mapEvent: s.mapEvent || null,
      rescueData: s.rescueData || { attempts: [], lastChance: 0, success: false },
      usedEventIds: s.usedEventIds || [], activeTraps: s.activeTraps || [],
      mats: s.mats || null, discovered: s.discovered || null, weatherQueue: s.weatherQueue || [], safeDay: s.safeDay || 0,
      combatState: null, isLoading: false
    });

    ['mode-selector-screen', 'online-lobby-panel', 'start-screen'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }

    const wp = document.getElementById('week-progress');
    if (wp) {
      wp.innerHTML = Array.from({length:7},(_,i)=>`<div class="day-pip${i<G.day-1?' done':''}${i===G.day-1?' current':''}" id="pip${i}"></div>`).join('');
    }
    document.getElementById('day-badge').textContent = `วันที่ ${G.day} / 7`;
    document.getElementById('weather-icon').textContent = G.weather.icon;
    document.getElementById('weather-text').textContent = G.weather.text;
    const evBox = document.getElementById('daily-event-box');
    if (evBox && save.dailyEventHtml) evBox.innerHTML = save.dailyEventHtml;
    const box = document.getElementById('story-box');
    if (box) {
      box.innerHTML = save.storyLog || '';
      box.scrollTop = box.scrollHeight;
    }

    buildCraftList();
    updateCampUI();
    renderLocations();
    renderAllPanels();
    G.players.forEach((p, i) => {
      if (!p.alive) document.getElementById(`panel-p${i}`)?.classList.add('dead');
    });
    addMsg(`💾 โหลดเกมที่บันทึกไว้ — วันที่ ${G.day}`, 'bubble-system');

    if (save.phase === 'newDay') startDay();
    else startTurn(G.currentPlayer);
  } catch (err) {
    console.error('Error loading save:', err);
    clearSave();
    alert('ไม่สามารถโหลดเกมที่บันทึกไว้ได้ — กรุณาเริ่มเกมใหม่');
    location.reload();
  }
}

window.continueSavedGame = continueSavedGame;
refreshContinueButton();

function getMyPlayerIndex() {
  if (!socket || G.mode !== 'multi' || !G.players) return 0;
  const idx = G.players.findIndex(p => p.id === socket.id);
  return idx !== -1 ? idx : -1;
}

function syncStateToAll() {
  if (socket && G.mode === 'multi' && G.isHost) {
    socket.emit('hostSyncState', { roomCode: G.roomCode, G });
  }
}

function sendClientAction(action, ...args) {
  if (socket && G.mode === 'multi' && !G.isHost) {
    socket.emit('clientAction', { roomCode: G.roomCode, action, args });
    return true;
  }
  return false;
}


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
  const myPi = getMyPlayerIndex();
  if (myPi === -1) return;
  clearInterval(G.turnTimer);
  if (G.currentPlayer !== myPi) {
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
      endPlayerTurn(getMyPlayerIndex());
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
        confirmBtn.onclick = function() { initGame(name, finalJob); };
      }
    }
  }, 100);
}

window.startCharacterSequence = startCharacterSequence;

function initGameMultiplayer(roomData) {
  try {
    G.mode = 'multi';
    G.difficulty = 'normal';
    G.isHost = !!(roomData.players.find(p => p.id === socket?.id)?.isHost);
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
    G.mats = null; G.discovered = null; G.weatherQueue = []; G.safeDay = 0;
    ensureMats();
    Object.assign(G.mats, STARTER_MATS); discoverRecipes(true);

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

function initGame(playerName, playerJob) {
  try {
    document.getElementById('start-screen').style.display = 'none';
    
    // Unlock main game interface
    const app = document.getElementById('app');
    if (app) {
      app.style.pointerEvents = 'auto';
      app.style.filter = 'none';
    }
    
    clearSave();

    // Reset G state
    G.difficulty = selectedDifficulty;
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
    G.mats = null; G.discovered = null; G.weatherQueue = []; G.safeDay = 0;
    ensureMats();
    Object.assign(G.mats, STARTER_MATS); discoverRecipes(true);

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
    // shuffle jobs — keep the job the player rolled in the gacha
    const shuffled = [...JOBS].filter(j => !playerJob || j.id !== playerJob.id).sort(()=>Math.random()-0.5);
    if (playerJob) shuffled.unshift(playerJob);
    G.players.forEach((p,i) => p.job = shuffled[i]);

    // week progress
    const wp = document.getElementById('week-progress');
    if (wp) {
      wp.innerHTML = Array.from({length:7},(_,i)=>`<div class="day-pip${i===0?' current':''}" id="pip${i}"></div>`).join('');
    }

    buildCraftList();
    updateCampUI();
    const diff = getDifficulty();
    addMsg(`${diff.emoji} ระดับความยาก: **${diff.name}** — ${diff.desc}`, 'bubble-system');
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
    // The shaman's forecast queues upcoming weather; use it so the prediction comes true
    G.weather = (Array.isArray(G.weatherQueue) && G.weatherQueue.length) ? G.weatherQueue.shift()
      : WEATHER_TYPES[Math.floor(Math.random()*WEATHER_TYPES.length)];
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

    saveGame('turn');

    if (!socket || G.isHost || G.mode !== 'multi') {
      // hunger/energy/thirst/sanity decay
      const decay = getDifficulty().decay;
      const hungerLoss = G.activeEvent.noDecay ? 0 : Math.round((8 + (G.activeEvent.extraHungerDecay || 0)) * decay);
      const energyLoss = G.activeEvent.noDecay ? 0 : Math.round((5 + (G.activeEvent.extraEnergyDecay || 0)) * decay);
      const thirstLoss = G.activeEvent.noDecay ? 0 : Math.round((10 + (G.weather.icon === '☀️' ? 10 : 0) + (G.activeEvent.extraHungerDecay ? 5 : 0)) * decay);
      const sanityLoss = (G.activeEvent.noDecay || G.camp.structures.includes('fortified')) ? 0 : Math.round(5 * decay);
      
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
        const dmg = Math.round(10 * decay);
        p.hp = clamp(p.hp - dmg, 0, 100);
        addMsg(`💧 ${p.name} ขาดน้ำรุนแรง! — HP -${dmg}`, 'bubble-event-bad');
      }
      if (p.hunger <= 0) {
        const dmg = Math.round(8 * decay);
        p.hp = clamp(p.hp - dmg, 0, 100);
        addMsg(`🍖 ${p.name} อดอาหารจนร่างกายทรุด! — HP -${dmg}`, 'bubble-event-bad');
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
      if (p.statuses.includes('poison')) { const dmg = Math.round(15 * decay); p.hp = clamp(p.hp - dmg, 0, 100); addMsg(`☠️ ${p.name} ได้รับพิษ — HP -${dmg}`, 'bubble-event-bad'); }
      if (p.statuses.includes('sick'))   { const dmg = Math.round(8 * decay); p.hp = clamp(p.hp - dmg, 0, 100);  p.energy = clamp(p.energy-10,0,100); addMsg(`🤒 ${p.name} กำลังป่วย — HP -${dmg}, พลังงาน -10`, 'bubble-event-bad'); }

      if (p.hp <= 0) { killPlayer(pi); return; }
    }

    renderAllPanels();
    updateTurnHeader(pi);
    renderActions(pi);
    addMsg(`🎮 ตาของ ${p.name} — ${p.hoursLeft} ชม. เหลือ`, 'bubble-system');
    
    const myPi = getMyPlayerIndex();
    if (pi === myPi) startTurnTimer();
    else stopTurnTimer();

    // ถ้าเป็นบอท ให้เล่นอัตโนมัติหลังจากหน่วงเวลา
    if (p.isBot) {
      if (!socket || G.isHost || G.mode !== 'multi') {
        setTimeout(() => botChooseAction(pi), 1500 + Math.random() * 1000);
      }
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

  // Gray-out overlay controls if it's not my turn
  const isUser = (pi === getMyPlayerIndex());
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
    { label:'🍽️ กิน / ดื่ม', cost:'1 ชม.', action:'eat' },
    { label:'💊 รักษาตัวเอง', cost:'1 ชม.', action:'heal' },
    { label:`🎁 แบ่งของให้เพื่อน`, cost:'1 ชม.', action:'share' },
    { label:'🔨 โต๊ะช่าง / คราฟ', cost:'ตามสูตร', action:'craft', badge: canCraftAny },
    { label:`✨ ใช้สกิล: ${p.job.skDesc}${p.skillUsed ? ' (ใช้แล้ววันนี้)' : ''}`, cost:'2 ชม.', action:'skill', highlight:!p.skillUsed },
    p.atCamp
      ? { label:'⛏️ เก็บวัสดุรอบแคมป์', cost:'1 ชม.', action:'gather' }
      : { label:'🏕️ กลับแคมป์', cost:'2 ชม.', action:'camp' },
  ];
  if (p.inventory.includes('เบ็ดตกปลา')) {
    btns.push({ label:`🎣 ตกปลา (${duraLeft(p, 'เบ็ดตกปลา')} ครั้ง)`, cost:'1 ชม.', action:'fish' });
  }

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
  const hasCookable = CAMP_RECIPES.some(r => itemPool(pi, true).includes(r.input));
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
  if (!p || !G.camp) return false;
  ensureMats();
  const canCraft = CRAFTS.some(c => (!c.side || p.side === c.side) && G.discovered.includes(c.name) &&
    tierUnlocked(c.tier) && p.hoursLeft >= craftHours(pi, c.time) && haveAll(pi, c.needs));
  const canBuild = p.atCamp && CAMP_STRUCTURES.some(s => !G.camp.structures.includes(s.id) && tierUnlocked(s.tier) &&
    p.hoursLeft >= craftHours(pi, s.time) && (haveAll(pi, s.needs) || (s.alt && haveAll(pi, s.alt))));
  return canCraft || canBuild;
}

// arg: extra choice for some actions (eat: which food)
function handleAction(pi, action, arg) {
  const p = G.players[pi];
  // Choosing what to eat happens locally; the chosen food is then sent to the host
  const pickFood = action === 'eat' && !arg && p && !p.isBot && window.SX;
  const uiActions = ['cookcamp', 'explore', 'share', 'craft', 'pvp'];
  if (pickFood) { SX.openEatPicker(pi); return; }
  if (!uiActions.includes(action)) {
    if (sendClientAction('handleAction', pi, action, arg)) return;
  }
  if (G.isLoading) return;

  
  // Set global loading state to prevent spam clicking
  G.isLoading = true;
  setButtons(true);
  
  if (action === 'cookcamp') {
    if (!p.atCamp) { addMsg('❌ ต้องกลับมาที่แคมป์ก่อนถึงจะปรุงอาหารได้', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    G.isLoading = false; setButtons(false);
    if (window.SX) SX.openWorkbench(pi, 'med'); return;
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

    const restHp = getDifficulty().restHp + (hasCampHut ? 4 : 0);
    if (restHp > 0 && p.hp < 100) restMsg += `, HP +${restHp}`;
    addMsg(restMsg, 'bubble-player');
    p.energy = clamp(p.energy + energyBonus, 0, 100);
    p.hp = clamp(p.hp + restHp, 0, 100);
    p.hunger = clamp(p.hunger - 5, 0, 100);
    p.statuses = p.statuses.filter(s => s !== 'tired');
    if (hasCampHut) p.statuses = p.statuses.filter(s => s !== 'wet' && s !== 'cold');
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'eat') {
    const food = (arg && p.inventory.includes(arg)) ? arg : p.inventory.find(i => isFood(i) || i === 'อาหารอาบยาพิษ');
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
    if (rawItems.includes(food) && !isCook && Math.random() < RAW_SICK_CHANCE) {
      p.statuses = addStatus(p.statuses, 'sick');
      addMsg(`🤢 ${p.name} กิน ${food} แบบดิบๆ! พยาธิในป่าทำให้ล้มป่วย`, 'bubble-event-bad');
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
      case 'ยาบำรุงกำลัง': hungerGain = 10; energyGain = 40; extraEffect = ' (พลังงาน +40)'; break;
      case 'รังตั๊กแตน': hungerGain = 15; energyGain = 5; break;
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
    hoursCost = 1;
    const isDoc = p.job.id === 'doctor';
    const med = pickHealItem(p);
    if (!med && !isDoc) {
      addMsg('❌ ไม่มียา — คราฟ 🩹 ผ้าพันแผล (ผ้า) หรือ 💊 ยาสมุนไพร (สมุนไพร ×2) ได้ที่โต๊ะช่าง', 'bubble-system');
      G.isLoading = false; setButtons(false); return;
    }
    const all = ['sick', 'poison', 'injured'];
    const fx = isDoc && !med ? { hp:25, cures:all, label:'สกิลหมอ' } : HEAL_ITEMS[med];
    if (med === 'สมุนไพร') G.mats['สมุนไพร']--;
    else if (med) p.inventory.splice(p.inventory.indexOf(med), 1);
    p.hp = clamp(p.hp + fx.hp, 0, 100);
    p.statuses = p.statuses.filter(s => !fx.cures.includes(s));
    addMsg(`💊 ${p.name} รักษาตัวด้วย${fx.label || med} — HP +${fx.hp}${fx.cures.length ? `, หาย${fx.cures.map(statusLabel).join(' ')}` : ''}`, 'bubble-event-good');
    renderAllPanels();
    spendTime(pi, hoursCost);
    return;
  }
  if (action === 'gather') {
    if (!p.atCamp) { addMsg('❌ เก็บวัสดุรอบแคมป์ได้เฉพาะตอนอยู่ที่แคมป์', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    const pool = ['ไม้', 'ไม้', 'หิน', 'หญ้าแห้ง', 'เชือก'];
    const got = [pick(pool), pick(pool)];
    if (p.inventory.includes('ขวานเหล็ก')) { got.push('ไม้', 'ไม้'); useTool(pi, 'ขวานเหล็ก'); }
    got.forEach(m => addMats(m, 1, true));
    discoverRecipes();
    p.energy = clamp(p.energy - 5, 0, 100);
    const counts = countNeeds(got);
    addMsg(`⛏️ ${p.name} เก็บวัสดุรอบแคมป์: ${Object.entries(counts).map(([m, k]) => `${MAT_ICON[m]}${m} ×${k}`).join(' · ')}`, 'bubble-event-good');
    renderAllPanels();
    spendTime(pi, 1);
    return;
  }
  if (action === 'fish') {
    if (!p.inventory.includes('เบ็ดตกปลา')) { addMsg('❌ ต้องมีเบ็ดตกปลา', 'bubble-system'); G.isLoading = false; setButtons(false); return; }
    useTool(pi, 'เบ็ดตกปลา');
    const nearWater = !p.atCamp && G.locations.some(l => l.explored.includes(pi) && ['river', 'waterfall', 'swamp'].includes(l.id));
    if (Math.random() < (nearWater ? 0.9 : 0.65)) {
      const catchItem = Math.random() < 0.12 ? 'กุ้งมังกรป่า' : 'ปลา';
      addToInventory(pi, catchItem);
      addMsg(`🎣 ${p.name} ตกได้ ${catchItem}!${nearWater ? ' (ริมน้ำปลาชุม)' : ''}`, 'bubble-event-good');
    } else {
      addMsg(`🎣 ${p.name} นั่งรอนานแต่ปลาไม่กินเบ็ด`, 'bubble-system');
    }
    spendTime(pi, 1);
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
    doSkillAction(pi, arg);
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
const BOT_HERBS = ['สมุนไพรหายาก','ยาสมุนไพร','ผ้าพันแผล','ชุดปฐมพยาบาล'];
const BOT_RAW_FOODS = ['ไก่ป่า','กระต่าย','ค้างคาว','กบ','กุ้งฝอย','หอยเชลล์','ปูน้ำจืด','ไข่นก','ไข่จระเข้','แมลง','มอสเรืองแสง','เนื้อสัตว์','ปลา'];
const BOT_TOXIC_FOODS = ['ผลไม้มีพิษ','น้ำเน่า','เห็ด','อาหารอาบยาพิษ'];
const BOT_WEAPONS = ['หอก','มีด','ธนู'];
const BOT_WATER_LOCS = ['river','waterfall','swamp'];
// [hunger, thirst] gained when eaten — mirrors handleAction('eat'); unknown foods give hunger 20
const BOT_FOOD_VALUE = {
  'น้ำสะอาด':[0,80], 'น้ำเน่า':[0,50], 'ผลไม้':[15,15], 'ผลไม้มีพิษ':[15,15], 'เห็ด':[15,0],
  'ปลา':[25,0], 'ปลาย่าง':[40,0], 'กบ':[20,0], 'แมลง':[10,0], 'ไข่':[20,0], 'ไข่นก':[20,0],
  'เนื้อสัตว์':[35,0], 'เนื้อย่าง':[50,0], 'กระต่าย':[25,0], 'ไก่ป่า':[25,0], 'อาหารกระป๋อง':[35,0],
  'อาหารอุ่น':[55,0], 'ยาบำรุง':[20,0], 'ซุปเห็ด':[35,0], 'รวงผึ้ง':[20,0], 'กุ้งฝอย':[15,10],
  'หอยเชลล์':[15,10], 'ปูน้ำจืด':[15,10], 'ไข่จระเข้':[45,0], 'หม้อไฟป่า':[100,100], 'ซุปสมาธิ':[20,0],
};

// Multiset check: every entry of needs must be covered by a distinct entry of inv
function hasMaterials(inv, needs) {
  const tmp = [...inv];
  return needs.every(mat => {
    const idx = tmp.indexOf(mat);
    if (idx === -1) return false;
    tmp.splice(idx, 1);
    return true;
  });
}

function botCraftNeeds(p, needs) {
  return needs;
}

function botHasWeapon(p) {
  return BOT_WEAPONS.some(w => p.inventory.includes(w));
}

function botIsSafeFood(p, item) {
  if (!isFood(item) && item !== 'อาหารอาบยาพิษ') return false;
  const isChef = p.job.id === 'chef';
  if (item === 'อาหารอาบยาพิษ') return false;
  if (BOT_TOXIC_FOODS.includes(item) && !isChef) return false;
  if (BOT_RAW_FOODS.includes(item) && !isChef) return false;
  if (item === 'น้ำสะอาด' && G.activeEvent.waterPoison) return false;
  if (item === 'ผลไม้' && G.activeEvent.forestToxin && !isChef) return false;
  return true;
}

function botSafeFoods(p) {
  return p.inventory.filter(i => botIsSafeFood(p, i));
}

// Best safe food for the stat(s) the bot needs; null when nothing helps
function botPickFood(p, needHunger, needThirst) {
  let best = null, bestScore = 0;
  botSafeFoods(p).forEach(f => {
    const [h, t] = BOT_FOOD_VALUE[f] || [20, 0];
    // only count the gain that isn't wasted on a full stat
    const score = (needHunger ? Math.min(h, 100 - p.hunger) : 0) + (needThirst ? Math.min(t, 100 - p.thirst) : 0);
    if (score > bestScore) { best = f; bestScore = score; }
  });
  return best;
}

// Eat a specific item through the normal eat action (it eats the first food in the bag)
function botEat(pi, food) {
  const p = G.players[pi];
  // the eat action only consumes isFood() items; anything else would stall the bot's turn
  if (!p.inventory.includes(food) || !isFood(food)) return false;
  handleAction(pi, 'eat', food);
  return true;
}

// Free (0-hour) camp-store moves allowed per bot per day, so take/deposit can never ping-pong forever
const BOT_MAX_FREE_ACTIONS = 8;

// Pull what the bot needs out of the shared camp store (free action)
function botTakeFromCamp(pi) {
  const p = G.players[pi];
  if (!p.atCamp || p.inventory.length >= getInventoryLimit(p) || p.botFreeActions >= BOT_MAX_FREE_ACTIONS) return false;
  const shared = G.camp.sharedItems;
  const safeFoods = botSafeFoods(p);
  // never take food when carrying 3+ (botCampAction deposits food above 3)
  const roomForFood = safeFoods.length < 3;
  const hasWater = safeFoods.some(f => (BOT_FOOD_VALUE[f] || [0, 0])[1] >= 50);
  const wantWater = roomForFood && p.thirst < 70 && !hasWater;
  const wantFood = roomForFood && p.hunger < 65 && safeFoods.filter(f => (BOT_FOOD_VALUE[f] || [20, 0])[0] > 0).length < 1;
  const wantHerb = (p.hp < 75 || p.statuses.some(s => ['sick','poison','injured'].includes(s))) && p.job.id !== 'doctor' && !pickHealItem(p);
  const wantWeaponMats = !botHasWeapon(p);

  let idx = -1;
  if (wantWater) idx = shared.findIndex(i => i === 'น้ำสะอาด' && botIsSafeFood(p, i));
  if (idx === -1 && wantHerb) idx = shared.findIndex(i => BOT_HERBS.includes(i));
  if (idx === -1 && wantFood) idx = shared.findIndex(i => botIsSafeFood(p, i) && (BOT_FOOD_VALUE[i] || [20, 0])[0] > 0);
  if (idx === -1 && wantWeaponMats) idx = shared.findIndex(i => BOT_WEAPONS.includes(i));
  if (idx === -1) return false;

  const item = shared[idx];
  shared.splice(idx, 1);
  p.botFreeActions++;
  addToInventory(pi, item);
  addMsg(`🎒 ${p.name} หยิบ ${item} ออกจากคลังแคมป์`, 'bubble-system');
  updateCampUI();
  spendTime(pi, 0);
  return true;
}

function botChooseAction(pi) {
  const p = G.players[pi];
  if (!p.alive || G.dayDone[pi]) { nextTurn(); return; }

  if (G.isLoading) {
    setTimeout(() => botChooseAction(pi), 800);
    return;
  }

  const caution = getDifficulty().botCaution;
  const isDoc = p.job.id === 'doctor';
  const hasHerb = !!pickHealItem(p);
  const ailing = p.statuses.some(s => s === 'sick' || s === 'poison');
  const retreatHp = Math.round(45 * caution);
  if (p.botDay !== G.day) { p.botDay = G.day; p.botExplores = 0; p.botFreeActions = 0; p.botRescueTried = false; }

  // 1. Day 7: try to call the rescue helicopter once
  if (G.day === 7 && !p.botRescueTried && p.hoursLeft >= 2 &&
      ['คบเพลิง','สัญญาณขอความช่วยเหลือ','วิทยุกู้ภัย SOS'].some(i => p.inventory.includes(i))) {
    p.botRescueTried = true;
    handleAction(pi, 'rescue');
    return;
  }

  // 2. Treat sickness/poison right away, and heal when hurt
  if ((isDoc || hasHerb) && p.hoursLeft >= 2 &&
      (ailing || p.hp < Math.min(80, retreatHp + 15) || (p.statuses.includes('injured') && p.hp < 85))) {
    handleAction(pi, 'heal');
    return;
  }

  // 3. Restock from the camp store (water, food, herbs, weapon materials)
  if (botTakeFromCamp(pi)) return;

  // 4. Cook raw food at the camp fire so it is safe to eat
  const hasFire = G.camp.structures.includes('campfire') || G.camp.structures.includes('stove');
  if (p.atCamp && hasFire && p.job.id !== 'chef' && p.hoursLeft >= 1) {
    const cookable = CAMP_RECIPES.find(r => p.inventory.includes(r.input));
    if (cookable) {
      doCookFood(pi, cookable.input, cookable.output, cookable.hungerGain, cookable.hpGain);
      return;
    }
  }

  // 5. Eat/drink before stats get dangerous
  const eatAt = Math.round(50 * caution);
  if ((p.hunger < eatAt || p.thirst < eatAt) && p.hoursLeft >= 1) {
    const food = botPickFood(p, p.hunger < eatAt, p.thirst < eatAt);
    if (food && botEat(pi, food)) return;
    // Starving with only raw food: eat it anyway if we can cure the sickness afterwards
    if (p.hunger <= 15 && (isDoc || hasHerb) && !p.statuses.includes('sick')) {
      const raw = p.inventory.find(i => BOT_RAW_FOODS.includes(i) && isFood(i));
      if (raw && botEat(pi, raw)) return;
    }
  }

  // 6. Craft a weapon before walking into the wild
  if (!botHasWeapon(p) && p.hoursLeft >= 2) {
    const spear = CRAFTS.find(c => c.name === 'หอก');
    if (haveAll(pi, spear.needs) && p.hoursLeft >= craftHours(pi, spear.time)) {
      doCraft(pi, spear.name);
      return;
    }
  }

  // 6b. Fish for food when hungry and out of safe food
  if (p.inventory.includes('เบ็ดตกปลา') && p.hunger < 60 && !botSafeFoods(p).length && p.hoursLeft >= 1) {
    handleAction(pi, 'fish');
    return;
  }

  // 7. Badly hurt: go home and recover
  if (p.hp < retreatHp) {
    if (!p.atCamp && p.hoursLeft >= 2) { handleAction(pi, 'camp'); return; }
    if (p.atCamp && p.hoursLeft >= 2 && botCampAction(pi)) return;
    if (p.atCamp && p.hoursLeft >= 4) { handleAction(pi, 'rest'); return; }
  }

  // 8. Tired: rest (at camp) or head back
  if (p.energy < Math.round(35 * caution)) {
    if (!p.atCamp && p.hoursLeft >= 2) { handleAction(pi, 'camp'); return; }
    if (p.atCamp && p.hoursLeft >= 4) { handleAction(pi, 'rest'); return; }
  }

  // 9. Return to camp if hours are running low
  if (!p.atCamp && p.hoursLeft <= 3) {
    handleAction(pi, 'camp');
    return;
  }

  // 10. Special map event — only when healthy and properly equipped
  if (G.mapEvent && !G.mapEvent.explored && p.hoursLeft >= G.mapEvent.time + 3 &&
      p.inventory.includes(G.mapEvent.requiredItem) && p.hp >= Math.min(90, Math.round(70 * caution)) && p.energy >= 40) {
    p.botExplores++;
    exploreMapEvent(pi);
    return;
  }

  // 11. Explore the safest useful location the bot can handle right now
  const maxExplores = caution >= 1 ? 2 : 3;
  if (p.botExplores < maxExplores && p.energy >= 30 && p.hp >= retreatHp) {
    const armed = botHasWeapon(p);
    const maxDanger = ((p.hp - 30) / 100) / caution + (armed ? 0.1 : 0);
    const needWater = p.thirst < 70 && !botSafeFoods(p).some(f => (BOT_FOOD_VALUE[f] || [0, 0])[1] >= 50);
    let bestLi = -1, bestScore = -Infinity;
    G.locations.forEach((loc, li) => {
      if (loc.explored.includes(pi) || loc.blocked) return;
      if (p.hoursLeft < loc.time + 3) return;
      if (loc.danger > maxDanger) return;
      let score = -loc.danger + Math.random() * 0.1;
      if (needWater && BOT_WATER_LOCS.includes(loc.id)) score += 0.5;
      if (!armed && (loc.loot.includes('ไม้') || loc.loot.includes('หิน') || loc.loot.includes('มีด'))) score += 0.15;
      if (score > bestScore) { bestScore = score; bestLi = li; }
    });
    if (bestLi !== -1) {
      p.botExplores++;
      exploreLocation(pi, bestLi);
      return;
    }
  }

  // 12. Use thief skill
  if (p.job.id === 'thief' && !p.skillUsed && p.hoursLeft >= 2) {
    doSkillAction(pi);
    return;
  }

  // 13. Go home to build, cook and store
  if (!p.atCamp && p.hoursLeft >= 2) {
    handleAction(pi, 'camp');
    return;
  }
  if (p.atCamp && p.hoursLeft >= 1) {
    if (botCampAction(pi)) return;
  }

  // 13b. Gather materials around camp when the team pouch is low
  const pouch = BASIC_MATS.reduce((a, m) => a + matCount(m), 0);
  if (p.atCamp && p.hoursLeft >= 1 && pouch < 8 && p.energy >= 30) {
    handleAction(pi, 'gather');
    return;
  }

  // 14. Spare time: recover at camp
  if (p.atCamp && p.hoursLeft >= 4 && (p.energy < 85 || p.hp < 90)) {
    handleAction(pi, 'rest');
    return;
  }

  // 15. Independent thought for Bots (Custom Actions) — only when healthy
  if (p.hoursLeft >= 5 && p.hp >= 60 && Math.random() < 0.4) {
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

  // 16. If already at camp, end turn
  if (p.atCamp) {
    endPlayerTurn(pi);
    return;
  }

  // 17. Not at camp and nothing else to do — go back to camp
  handleAction(pi, 'camp');
}

function getInventoryLimit(p) {
  if (!p) return 5;
  return p.inventory.includes('กระเป๋าคาดเอว') ? 7 : 5;
}

function addToInventory(pi, item) {
  const p = G.players[pi];
  if (ITEM_ALIAS[item]) item = ITEM_ALIAS[item];
  // Basic materials go to the team's material pouch, not the 5-slot bag
  if (MAT_ALIAS[item] || isBasicMat(item)) {
    const [mat, n] = MAT_ALIAS[item] || [item, 1];
    addMats(mat, n);
    discoverRecipes();
    renderAllPanels();
    return true;
  }
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
  if (DURABILITY[item] && p.dura && p.inventory.filter(i => i === item).length === 1) delete p.dura[item];
  discoverRecipes();
  renderAllPanels();
  return true;
}

// Camp structures in the order bots try to build them
const BOT_BUILD_ORDER = ['campfire','workbench','hut','watertank','fence','clinic','smoker','tower','stove','garden','lock','bell','trapfence','purifier','fortified'];
// Items a bot keeps in its bag instead of depositing
const BOT_KEEP_ITEMS = ['หอก','มีด','ธนู','โล่ไม้','เบ็ดตกปลา','ไม้เท้าเดินป่า','ไฟฉาย','ผ้าพันแผล','ยาพิษ','กับดักสัตว์','คบเพลิง','เครื่องกลั่นน้ำ','เชือกยาว','ชุดปฐมพยาบาล','ขวานเหล็ก',
  'กระเป๋าคาดเอว','สัญญาณขอความช่วยเหลือ','วิทยุกู้ภัย SOS','ชุดแผนที่นำทาง','เข็มทิศทองคำ','สมุดบันทึกนักสำรวจ',
  'อาวุธโบราณ','ชุดเกราะเก่า','เครื่องรางศักดิ์สิทธิ์','ที่พักชั่วคราว','แผนที่ลึกลับ', ...BOT_HERBS];

function botCampAction(pi) {
  const p = G.players[pi];
  if (!p.atCamp) return false;
  const limit = getInventoryLimit(p);

  // A. Build structure if materials exist (bag + camp store)
  const buildable = BOT_BUILD_ORDER.map(id => CAMP_STRUCTURES.find(s => s.id === id)).find(s =>
    s && !G.camp.structures.includes(s.id) && tierUnlocked(s.tier) && p.hoursLeft >= craftHours(pi, s.time) &&
    (haveAll(pi, s.needs) || (s.alt && haveAll(pi, s.alt))));
  if (buildable) {
    doBuildCampStructure(pi, buildable.id, buildable.name);
    return true;
  }

  // B. Craft useful items if materials exist
  const sanityLow = G.players.some(o => o.alive && o.sanity < 40);
  const wanted = [
    !p.inventory.includes('เบ็ดตกปลา') && 'เบ็ดตกปลา',
    !p.inventory.includes('โล่ไม้') && 'โล่ไม้',
    !pickHealItem(p) && 'ยาสมุนไพร',
    !p.inventory.includes('ผ้าพันแผล') && 'ผ้าพันแผล',
    !p.inventory.includes('เครื่องกลั่นน้ำ') && 'เครื่องกลั่นน้ำ',
    !p.inventory.includes('กระเป๋าคาดเอว') && 'กระเป๋าคาดเอว',
    !G.camp.structures.includes('hut') && !p.inventory.includes('ที่พักชั่วคราว') && 'ที่พักชั่วคราว',
    G.day >= 5 && !p.inventory.includes('คบเพลิง') && 'คบเพลิง',
    G.day >= 5 && 'สัญญาณขอความช่วยเหลือ',
    'วิทยุกู้ภัย SOS',
    'หม้อไฟป่า',
    sanityLow && 'ธูปสมุนไพร',
    'กับดักสัตว์',
  ].filter(Boolean);
  const craftable = wanted.map(name => CRAFTS.find(c => c.name === name)).find(c =>
    c && !c.side && tierUnlocked(c.tier) && p.hoursLeft >= craftHours(pi, c.time) && haveAll(pi, c.needs) &&
    (p.inventory.length < getInventoryLimit(p) || c.name === 'ธูปสมุนไพร'));
  if (craftable) {
    doCraft(pi, craftable.name);
    return true;
  }

  // C. Set a trap around camp for tomorrow's food
  if (p.inventory.includes('กับดักสัตว์') && p.hoursLeft >= 2) {
    handleAction(pi, 'place_trap');
    return true;
  }

  // D. Cook food if has materials + fire
  const hasFire = G.camp.structures.includes('campfire') || G.camp.structures.includes('stove');
  if (hasFire && p.hoursLeft >= 1 && p.job.id !== 'chef') {
    const cookable = CAMP_RECIPES.find(r => p.inventory.includes(r.input));
    if (cookable) {
      doCookFood(pi, cookable.input, cookable.output, cookable.hungerGain, cookable.hpGain);
      return true;
    }
  }

  // E. Deposit surplus to the camp store: spare materials when the bag is filling up,
  //    and food beyond what the bot needs so other survivors can eat
  const safeFoods = botSafeFoods(p);
  let surplus = null;
  if (p.botFreeActions >= BOT_MAX_FREE_ACTIONS) return false;
  if (p.inventory.length >= limit - 1) {
    const spearNeeds = [];
    surplus = p.inventory.find(item => !isFood(item) && !BOT_KEEP_ITEMS.includes(item) && !spearNeeds.includes(item))
      || p.inventory.find(item => BOT_TOXIC_FOODS.includes(item) && item !== 'อาหารอาบยาพิษ' && p.job.id !== 'chef');
  }
  if (!surplus && safeFoods.length > 3) {
    // give away the food type we have the most of, so the bot keeps some water and some food
    const count = f => safeFoods.filter(x => x === f).length;
    surplus = [...safeFoods].sort((a, b) => count(b) - count(a))[0];
  }
  if (surplus) {
    p.botFreeActions++;
    const idx = p.inventory.indexOf(surplus);
    p.inventory.splice(idx, 1);
    G.camp.sharedItems.push(surplus);
    addMsg(`📦 ${p.name} ฝาก ${surplus} ไว้ในคลังแคมป์`, 'bubble-system');
    updateCampUI();
    renderAllPanels();
    spendTime(pi, 0); // Small delay to continue bot turn
    return true;
  }

  return false;
}

function endPlayerTurn(pi) {
  if (sendClientAction('endPlayerTurn', pi)) return;
  stopTurnTimer();
  const p = G.players[pi];
  if (!p.atCamp) {
    addMsg(`🌙 ${p.name} ไม่ได้กลับแคมป์! — พลังงานลดถาวร -10 พรุ่งนี้`, 'bubble-event-bad');
    p.energy = clamp(p.energy - 10, 0, 100);
    p.statuses = addStatus(p.statuses, 'tired');
  }
  G.dayDone[pi] = true;
  addMsg(`⏰ ${p.name} จบเทิร์นแล้ว`, 'bubble-system');
  syncStateToAll();
  nextTurn();
}

// choice: what the player picked in the skill picker (engineer: structure id,
// merchant: { sell, mat } or { swap:[bagItem, campIdx] }, spy: target index)
function doSkillAction(pi, choice) {
  const p = G.players[pi];
  if (p.skillUsed) {
    addMsg(`❌ ${p.name} ใช้สกิลไปแล้ววันนี้ (วันละ 1 ครั้ง)`, 'bubble-system');
    spendTime(pi, 0);
    return;
  }
  const needsChoice = ['engineer', 'merchant', 'spy'].includes(p.job.id);
  if (needsChoice && choice === undefined && !p.isBot && window.SX && pi === getMyPlayerIndex()) {
    G.isLoading = false; setButtons(false);
    SX.openSkillPicker(pi);
    return;
  }
  const done = (hours = 2) => { p.skillUsed = true; renderAllPanels(); updateCampUI(); spendTime(pi, hours); };
  const fail = msg => { addMsg(msg, 'bubble-system'); spendTime(pi, 0); };

  switch (p.job.id) {
    case 'hunter': {
      const animal = pick(['กวาง', 'หมูป่า', 'ไก่ป่า']);
      addToInventory(pi, 'เนื้อสัตว์');
      addToInventory(pi, 'เนื้อสัตว์');
      addMsg(`🏹 ${p.name} ใช้สกิลนักล่า — ล่า${animal}ได้สำเร็จ! ได้เนื้อสัตว์ 2 ชิ้น 🥩🥩`, 'bubble-event-good');
      done();
      break;
    }
    case 'doctor': {
      G.players.forEach((p2, idx) => {
        if (!p2.alive) return;
        p2.hp = clamp(p2.hp + 50, 0, 100);
        p2.statuses = p2.statuses.filter(s => s !== 'sick' && s !== 'poison' && s !== 'injured');
        if (idx !== pi) adjustTrust(idx, 4, 'การรักษาโดยหมอ');
      });
      addMsg(`🩺 ${p.name} ใช้สกิลหมอ — รักษาทุกคน HP +50 และล้างสถานะผิดปกติ`, 'bubble-event-good');
      done();
      break;
    }
    case 'thief': {
      const victims = G.players.filter((p2, i) => i !== pi && p2.alive && p2.inventory.length);
      if (!victims.length) { p.skillUsed = true; fail('ไม่มีใครให้ขโมย'); break; }
      let stolen = 0;
      for (let i = 0; i < 2; i++) {
        const v = pick(victims);
        if (!v.inventory.length) continue;
        const item = v.inventory.splice(Math.floor(Math.random() * v.inventory.length), 1)[0];
        addToInventory(pi, item);
        stolen++;
      }
      addMsg(`🗡️ ${p.name} ใช้สกิลโจร — ขโมยไอเทมมาได้ ${stolen} ชิ้น!`, 'bubble-event-bad');
      G.thiefUsed[pi] = true;
      done();
      break;
    }
    case 'chef': {
      for (let i = 0; i < 3; i++) addToInventory(pi, 'อาหารอุ่น');
      addMsg(`🍳 ${p.name} ใช้สกิลพ่อครัว — ทำอาหารอุ่น 3 กล่องให้ทีม!`, 'bubble-event-good');
      done();
      break;
    }
    case 'scout': {
      p.scoutDay = G.day;
      let txt = `🧭 ${p.name} สแกนพื้นที่ — วันนี้สำรวจได้ผลดีเสมอและไม่เจอสัตว์ป่า:\n`;
      G.locations.forEach(loc => {
        const lvl = loc.danger >= 0.45 ? '🔴 อันตราย' : loc.danger >= 0.3 ? '🟡 ปานกลาง' : '🟢 ปลอดภัย';
        txt += `• ${loc.emoji} ${loc.name}: ${lvl} · สัตว์: ${loc.wild.join(', ')} · วัสดุ: ${[...new Set(LOC_MATS[loc.id] || [])].join(' ')}\n`;
      });
      addMsg(txt, 'bubble-event-good');
      done();
      break;
    }
    case 'soldier': {
      G.safeDay = G.day;
      addToInventory(pi, 'เนื้อสัตว์');
      addMsg(`⚔️ ${p.name} ออกลาดตระเวนเคลียร์เส้นทาง — วันนี้ทั้งทีมจะไม่เจอสัตว์ป่า! ได้เนื้อสัตว์ 1 ชิ้น`, 'bubble-event-good');
      done();
      break;
    }
    case 'shaman': {
      if (!Array.isArray(G.weatherQueue)) G.weatherQueue = [];
      while (G.weatherQueue.length < 3) G.weatherQueue.push(pick(WEATHER_TYPES));
      let msg = `🪄 ${p.name} หยั่งรู้อนาคต — ทุกคนค่าสติ +15\n`;
      G.weatherQueue.forEach((w, i) => { if (G.day + i + 1 <= 7) msg += `• วันที่ ${G.day + i + 1}: ${w.icon} ${w.text}\n`; });
      G.players.forEach(p2 => { if (p2.alive) p2.sanity = clamp(p2.sanity + 15, 0, 100); });
      addMsg(msg, 'bubble-event-good');
      done();
      break;
    }
    case 'engineer': {
      if (!p.atCamp) { fail('❌ ต้องอยู่ที่แคมป์เพื่อสร้าง'); break; }
      const options = CAMP_STRUCTURES.filter(s => !G.camp.structures.includes(s.id) && tierUnlocked(s.tier));
      const s = options.find(o => o.id === choice) || (p.isBot ? options.find(o => BOT_BUILD_ORDER.includes(o.id)) || options[0] : null);
      if (!s) { fail('❌ ไม่มีสิ่งปลูกสร้างที่สร้างได้'); break; }
      G.camp.structures.push(s.id);
      updateCampLevel();
      addMsg(`🔧 ${p.name} ใช้สกิลวิศวกร — สร้าง ${s.emoji} ${s.name} ฟรีทันที! (${s.desc})`, 'bubble-event-good');
      if (window.SX) SX.celebrate(s.emoji, s.name);
      done();
      break;
    }
    case 'merchant': {
      if (!p.atCamp) { fail('❌ ต้องอยู่ที่แคมป์เพื่อค้าขาย'); break; }
      // Sell a valuable for 4 materials of one kind
      const sellItem = choice && choice.sell ? choice.sell : (p.isBot ? p.inventory.find(isValuable) : null);
      if (sellItem && p.inventory.includes(sellItem)) {
        const mat = (choice && BASIC_MATS.includes(choice.mat)) ? choice.mat : 'ไม้';
        p.inventory.splice(p.inventory.indexOf(sellItem), 1);
        addMats(mat, 4);
        addMsg(`💰 ${p.name} ขาย ${sellItem} ได้ ${MAT_ICON[mat]}${mat} ×4`, 'bubble-event-good');
        done(1);
        break;
      }
      // Swap up to 3 picked bag items for picked camp items
      const swaps = (choice && Array.isArray(choice.swap)) ? choice.swap : [];
      let traded = 0;
      swaps.slice(0, 3).forEach(([bagItem, campItem]) => {
        const bi = p.inventory.indexOf(bagItem), ci = G.camp.sharedItems.indexOf(campItem);
        if (bi === -1 || ci === -1) return;
        p.inventory[bi] = campItem;
        G.camp.sharedItems[ci] = bagItem;
        traded++;
      });
      if (!traded) { fail('❌ ไม่ได้เลือกของที่จะแลก'); break; }
      addMsg(`💰 ${p.name} ใช้สกิลพ่อค้า — แลกของกับคลังแคมป์ ${traded} ชิ้น`, 'bubble-event-good');
      done(1);
      break;
    }
    case 'spy': {
      const target = G.players[choice] || (p.isBot ? pick(G.players.filter((p2, i) => i !== pi && p2.alive)) : null);
      if (!target || target === p) { fail('❌ เลือกคนที่จะส่อง'); break; }
      const side = typeof sideLabel === 'function' ? sideLabel(target.side) : 'ไม่ทราบ';
      const secret = `🕵️ [สายลับ] ${target.name} คือ ${target.job.emoji} ${target.job.name} · ฝ่าย: ${side} · ของ: ${target.inventory.join(', ') || 'ไม่มี'}`;
      // only the spy sees the result
      if (!p.isBot && pi === getMyPlayerIndex()) addMsg(secret, 'bubble-player');
      else addMsg(`🕵️ ${p.name} แอบสังเกตใครบางคนอย่างเงียบๆ...`, 'bubble-system');
      if (p.isBot) { p.spyNotes = p.spyNotes || {}; p.spyNotes[G.players.indexOf(target)] = target.side; }
      done();
      break;
    }
    default: {
      addMsg(`${p.name} ใช้สกิล ${p.job.name}`, 'bubble-player');
      done();
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
  if (sendClientAction('explore', pi, li)) return;
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

  const staff = p.inventory.includes('ไม้เท้าเดินป่า') && hoursCost > 1;
  if (staff) hoursCost -= 1;

  if (p.hoursLeft < hoursCost) { addMsg(`⏰ เวลาไม่พอสำรวจ ${loc.name} (ต้องการ ${hoursCost} ชม.)`, 'bubble-system'); return; }
  if (staff) useTool(pi, 'ไม้เท้าเดินป่า');

  p.atCamp = false;
  loc.explored.push(pi);
  
  if (p.isBot) {
    botExploreLocation(pi, li, hoursCost);
    return;
  }

  const prompt = `${loc.emoji} ออกสำรวจ${loc.name} (${hoursCost} ชม.)`;
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
    if (pi === getMyPlayerIndex()) addMsg(`⏰ เวลาไม่พอสำรวจ ${m.name} (ต้องการ ${hoursCost} ชม.)`, 'bubble-system');
    return;
  }

  const hasItem = p.inventory.includes(m.requiredItem);
  if (pi === getMyPlayerIndex() && !hasItem) {
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
  if (sendClientAction('exploreMapEvent', pi, m, hoursCost, hasItem)) return;
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

  const prompt = `${m.emoji} บุกพื้นที่พิเศษ: ${m.name} — ${!hasItem ? 'ฝืนเข้าไปโดยไม่มี ' + m.requiredItem : 'ใช้ ' + m.requiredItem + ' นำทาง'}`;
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
  
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  if (p.scoutDay === G.day) outcome = Math.random() < 0.5 ? outcomes[1] : outcomes[4];
  else if (outcome.event === 'bad' && exploreProtection(pi, loc) > 0 && Math.random() < 0.5) outcome = outcomes[0];
  if (G.safeDay === G.day || p.scoutDay === G.day) outcome = { ...outcome, wild: null };
  // Use the location's own narration lines so bot turns don't repeat the same sentence
  const locLines = LOC_STORIES[loc.id];
  if (locLines) outcome.story = pick(locLines[outcome.event === 'none' ? 'normal' : outcome.event]).replace(/\{n\}/g, p.name);

  let hpDelta = Math.round(outcome.hp * getDifficulty().animalDmg);
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
    const rareLoot = ['ชุดปฐมพยาบาล','สมุดบันทึกนักสำรวจ','มีด','เข็มทิศทองคำ','ขวานเหล็ก'][Math.floor(Math.random()*5)];
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

  grantLocMats(pi, loc);

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
    botFightOrFlee(pi, outcome.wild);
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

// ===================== NARRATOR (built-in, no external AI) =====================
// Each location has its own lines for a good / normal / bad outcome. {n} = player name.
const LOC_STORIES = {
  cave: {
    good:   ['{n} คลำทางเข้าไปในถ้ำ แสงสลัวจากรอยแยกบนเพดานส่องให้เห็นซอกหินที่มีของซ่อนอยู่', '{n} เจอโพรงแห้งลึกเข้าไปในถ้ำ อากาศเย็นสบาย ได้พักหายใจก่อนเก็บของกลับมา'],
    normal: ['{n} เดินลัดเลาะผนังถ้ำที่ชื้นแฉะ เสียงน้ำหยดดังก้องไปทั่ว', '{n} ใช้เวลาไล่สำรวจทีละซอก กลิ่นอับชื้นทำให้หายใจไม่สะดวก'],
    bad:    ['{n} ลื่นล้มบนหินเปียกในความมืด เข่ากระแทกพื้นอย่างแรง', 'ฝูงค้างคาวพุ่งออกมาจากความมืด {n} ตกใจจนหัวใจแทบหยุดเต้น'],
  },
  river: {
    good:   ['{n} ลุยน้ำตื้นริมฝั่ง น้ำใสจนเห็นปลาว่ายวนอยู่รอบขา', '{n} เจอโขดหินกลางลำธารที่มีของติดค้างมาจากต้นน้ำ'],
    normal: ['{n} เดินเลียบแม่น้ำ เสียงน้ำไหลช่วยให้ใจสงบลงบ้าง', '{n} ก้มลงล้างหน้าในแม่น้ำ แล้วค่อยๆ ค้นหาตามโคลนริมตลิ่ง'],
    bad:    ['กระแสน้ำแรงกว่าที่คิด {n} เสียหลักจนเกือบถูกพัดไป', '{n} ถูกปลิงเกาะขาหลายตัวกว่าจะรู้ตัว'],
  },
  hut: {
    good:   ['{n} รื้อตู้ไม้เก่าในกระท่อมร้าง เจอของใช้ที่ยังพอใช้ได้', 'ใต้พื้นกระดานที่ผุพัง {n} เจอกล่องที่ใครบางคนซ่อนไว้'],
    normal: ['{n} ค้นกระท่อมทีละมุม ฝุ่นหนาจนต้องปิดจมูก', 'บนโต๊ะในกระท่อมมีบันทึกเก่าที่อ่านไม่ออกแล้ว {n} ค้นของต่ออย่างเงียบๆ'],
    bad:    ['พื้นไม้ผุทรุดลงใต้เท้า {n} ขาติดอยู่ในช่องพื้นจนถลอก', 'มีบางอย่างเคลื่อนไหวในเงามืดของกระท่อม {n} รู้สึกขนลุกไปทั้งตัว'],
  },
  forest: {
    good:   ['{n} แหวกพุ่มไม้เข้าไปเจอต้นไม้ผลดกรอเก็บอยู่', '{n} ตามเสียงนกไปจนพบลานโล่งที่อุดมไปด้วยของป่า'],
    normal: ['{n} ฝ่ากิ่งไม้หนาทึบ แสงแดดลอดลงมาเป็นลำๆ', '{n} เดินตามทางสัตว์ในป่าทึบ ทุกก้าวต้องระวังรากไม้'],
    bad:    ['{n} หลงวนอยู่ในป่าทึบนานกว่าจะหาทางออกเจอ', 'หนามแหลมเกี่ยวแขนขา {n} เป็นแผลยาวหลายแห่ง'],
  },
  cliff: {
    good:   ['{n} ปีนขึ้นไปถึงยอดผา มองเห็นป่าทั้งผืน และอาจเห็นทางออก', '{n} เจอซอกผาที่มีของหายากติดอยู่'],
    normal: ['{n} ไต่หน้าผาช้าๆ ลมแรงพัดจนต้องเกาะหินแน่น', '{n} สำรวจตามแนวหน้าผา เห็นรังนกอินทรีอยู่ไกลๆ'],
    bad:    ['หินใต้มือ {n} หลุดร่วง จนเกือบพลัดตกลงไป', '{n} เท้าพลิกบนหินคมระหว่างปีนลง'],
  },
  swamp: {
    good:   ['{n} พบพืชสมุนไพรหายากขึ้นอยู่กลางหนองน้ำ', 'แสงเรืองๆ จากมอสในหนองนำทาง {n} ไปเจอของดี'],
    normal: ['{n} ย่ำโคลนลึกถึงเข่า กลิ่นเน่าของหนองลอยมาเป็นระยะ', '{n} ใช้ไม้แหย่นำทางทีละก้าวในหนองน้ำ'],
    bad:    ['{n} จมโคลนลึกลงเรื่อยๆ กว่าจะดึงตัวขึ้นมาได้หมดแรงไปมาก', 'ยุงฝูงใหญ่รุมกัด {n} จนตัวบวมไปหมด'],
  },
  meadow: {
    good:   ['ทุ่งหญ้ากว้างเปิดโล่ง {n} เดินสบายและเจอของหลายอย่าง', '{n} นอนพักในทุ่งหญ้าสักครู่ ลมเย็นช่วยให้สดชื่น'],
    normal: ['{n} เดินลุยทุ่งหญ้าสูงท่วมเอว แมลงบินกรูออกมาตลอดทาง', '{n} มองไปรอบๆ ทุ่งเผื่อจะเห็นควันไฟหรือสัญญาณใดๆ'],
    bad:    ['แดดในทุ่งโล่งร้อนจัด {n} เริ่มเวียนหัว', '{n} เหยียบรังมดแดงเข้าเต็มๆ'],
  },
  ruins: {
    good:   ['{n} คุ้ยซากอาคารเก่า เจอชิ้นส่วนที่น่าจะเอาไปประกอบอะไรได้', 'ในห้องที่ยังไม่พังของซากอาคาร {n} เจอตู้เหล็กที่ยังไม่มีใครเปิด'],
    normal: ['{n} ค่อยๆ ปีนข้ามกองปูนและเหล็กเส้นที่ระเกะระกะ', 'ซากอาคารเงียบสงัด {n} ได้ยินแต่เสียงลมพัดผ่านช่องหน้าต่าง'],
    bad:    ['ผนังปูนถล่มลงมาข้างตัว {n} เศษหินกระเด็นโดนเต็มๆ', '{n} โดนเศษเหล็กสนิมบาดมือ'],
  },
  waterfall: {
    good:   ['ละอองน้ำตกเย็นชื่นใจ {n} จับปลาในแอ่งน้ำได้ง่ายดาย', 'หลังม่านน้ำตก {n} เจอโพรงที่มีของซ่อนอยู่'],
    normal: ['เสียงน้ำตกดังสนั่น {n} เดินหาของตามโขดหินลื่นๆ', '{n} นั่งพักริมแอ่งน้ำ ก่อนจะค้นรอบๆ น้ำตก'],
    bad:    ['{n} ลื่นตกลงแอ่งน้ำเย็นเฉียบ ตัวสั่นไปหมด', 'หินลื่นใต้น้ำตกทำให้ {n} ล้มกระแทก'],
  },
  temple: {
    good:   ['{n} เข้าไปในวัดร้าง เจอแท่นบูชาที่ยังมีของถวายเก่าวางอยู่', 'แสงแดดลอดผ่านหลังคาที่พังลงมาบนสิ่งของล้ำค่าตรงหน้า {n}'],
    normal: ['รูปปั้นเก่าแก่จ้องมองมา {n} รู้สึกเหมือนถูกจับตาดู', '{n} เดินสำรวจระเบียงวัดที่รากไม้ชอนไชจนพัง'],
    bad:    ['เสียงกระซิบดังมาจากในโบสถ์ {n} วิ่งออกมาแทบไม่ทัน', '{n} ฝันร้ายกลางวันในวัดร้าง จนสติเริ่มรวน'],
  },
  orchard: {
    good:   ['สวนผลไม้ป่าเต็มไปด้วยผลสุก {n} เก็บได้เต็มมือ', '{n} เจอรังผึ้งที่ห้อยต่ำ น้ำผึ้งหยดหวานฉ่ำ'],
    normal: ['{n} เดินเก็บผลไม้ ต้องระวังผึ้งที่บินวนอยู่รอบๆ', 'กลิ่นผลไม้สุกหอมไปทั่ว {n} ค่อยๆ เลือกเก็บลูกที่ดูกินได้'],
    bad:    ['ผึ้งทั้งรังรุมต่อย {n} จนต้องวิ่งหนี', '{n} ปีนต้นไม้เก็บผลแล้วกิ่งหัก ตกลงมากระแทกพื้น'],
  },
  graveyard: {
    good:   ['{n} คุ้ยกองเครื่องจักรเก่า เจออะไหล่ที่ยังพอใช้ได้', 'ในห้องเครื่องที่ล็อกไว้ {n} เจอของที่ยังอยู่ในสภาพดี'],
    normal: ['สนิมและน้ำมันเครื่องเลอะเต็มมือ {n} ค้นหาของต่อไป', '{n} เดินผ่านซากรถที่ถูกต้นไม้กลืนจนเกือบมองไม่เห็น'],
    bad:    ['{n} ถูกแผ่นเหล็กคมบาดขาเป็นแผลลึก', 'เครื่องจักรเก่าล้มทับ {n} ดึงตัวออกมาได้อย่างทุลักทุเล'],
  },
  mystery: {
    good:   ['{n} ฝ่าความมืดเข้าไปจนพบสมบัติที่ถูกลืมมานาน', 'สิ่งที่ {n} พบทำให้หัวใจเต้นแรง มันคือของที่หาไม่ได้ที่ไหนอีกแล้ว'],
    normal: ['{n} สำรวจพื้นที่ลึกลับอย่างระมัดระวัง ทุกเงาดูน่ากลัว', 'ทางเดินคดเคี้ยวพา {n} ลึกเข้าไปเรื่อยๆ'],
    bad:    ['กับดักโบราณทำงาน {n} หลบได้แต่ยังโดนเฉี่ยว', 'ความมืดและความเงียบทำให้ {n} เริ่มหวาดผวา'],
  },
};
const GOOD_TEXT = ['สิ่งดีๆ เกิดขึ้น', 'โชคเข้าข้าง!', 'วันนี้ป่าใจดี', 'เจอของดีเกินคาด'];
const BAD_TEXT  = ['ประสบความยากลำบาก', 'ป่าไม่ปรานี', 'โชคไม่ดีเลย', 'ต้องระวังมากกว่านี้'];

// Free-typed or bot "independent" actions, matched by keyword
const FREE_ACTIONS = [
  { re: /ตกปลา|จับปลา|ปลา/, loot: ['ปลา', 'กุ้งฝอย'], good: '{n} ทำเบ็ดจากกิ่งไม้ นั่งรออย่างอดทนจนปลาติด', bad: '{n} นั่งรอปลาทั้งชั่วโมงแต่ไม่มีอะไรมากิน' },
  { re: /ล่า|แกะรอย|ดักสัตว์|กับดัก/, loot: ['กระต่าย', 'ไก่ป่า', 'กบ'], good: '{n} แกะรอยสัตว์ได้อย่างแม่นยำ และได้เหยื่อมา', bad: 'รอยสัตว์พา {n} วนไปมาจนเหนื่อยเปล่า' },
  // checked in order, so "ปีน…มองหา" lands here before the generic search entry below
  { re: /ปีน|มอง|สัญญาณ|ควันไฟ|เรียง/, loot: [], sanity: 6, good: '{n} มองเห็นภูมิประเทศไกลออกไป ความหวังว่าจะรอดกลับมาอีกครั้ง', bad: '{n} มองไปจนสุดสายตา แต่ไม่เห็นวี่แววของใครเลย' },
  { re: /ขุด|ค้น|หา|เก็บ/, loot: ['ไม้', 'หิน', 'สมุนไพร', 'เชือก', 'เห็ด'], good: '{n} ค้นหาอย่างละเอียด และเจอของที่มีประโยชน์', bad: '{n} ขุดคุ้ยจนมือพอง แต่ไม่ได้อะไรเลย' },
  { re: /ซ่อม|สร้าง|ประดิษฐ์|ดัดแปลง/, loot: [], sanity: 4, good: '{n} ลงมือซ่อมของอย่างตั้งใจ ผลงานออกมาดีเกินคาด', bad: 'ของที่ {n} พยายามซ่อมพังคามือ' },
  { re: /พัก|นอน|นั่ง|สวด|ร้องเพลง|สมาธิ/, loot: [], sanity: 10, energy: 10, good: '{n} หยุดพักใจ ความกังวลค่อยๆ เบาลง', bad: '{n} พยายามพัก แต่เสียงป่ารอบตัวทำให้ข่มตาไม่ลง' },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollRange(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

// Bot wildlife encounter: simulate the same fight a player would have and only
// commit to it when the bot can win without ending up badly hurt; otherwise run.
function botFightOrFlee(pi, wild) {
  const p = G.players[pi];
  let weaponDmg = 8, weaponName = 'มือเปล่า';
  if (p.inventory.includes('หอก')) { weaponDmg = 40; weaponName = 'หอก'; }
  else if (p.inventory.includes('มีด')) { weaponDmg = 20; weaponName = 'มีด'; }
  if (p.inventory.includes('ขวานเหล็ก')) weaponDmg += 12;
  if (p.inventory.includes('อาวุธโบราณ')) weaponDmg += 20;

  let animalDmg = getAnimalDmg(wild);
  if (p.job.id === 'soldier') animalDmg = Math.ceil(animalDmg * 0.5);
  if (p.inventory.includes('ชุดเกราะเก่า')) animalDmg = Math.max(1, Math.ceil(animalDmg * 0.6));
  else if (p.inventory.includes('เครื่องรางศักดิ์สิทธิ์')) animalDmg = Math.max(1, Math.ceil(animalDmg * 0.8));
  if (p.inventory.includes('โล่ไม้')) animalDmg = Math.max(1, Math.ceil(animalDmg * 0.7));

  const rounds = Math.ceil(getAnimalMaxHp(wild) / weaponDmg);
  const expectedDmg = (rounds - 1) * animalDmg;
  const caution = getDifficulty().botCaution;
  const armed = weaponName !== 'มือเปล่า';
  const willFight = p.hp - expectedDmg >= Math.round(35 * caution) && (armed || expectedDmg <= 15);

  if (willFight) {
    if (armed) useTool(pi, weaponName);
    if (expectedDmg && p.inventory.includes('โล่ไม้')) useTool(pi, 'โล่ไม้');
    p.hp = clamp(p.hp - expectedDmg, 0, 100);
    p.stats.damageTaken += expectedDmg;
    addMsg(`⚔️ ${p.name} ใช้${weaponName}ต่อสู้และกำจัด ${wild} ได้สำเร็จ!${expectedDmg ? ` (สูญเสีย HP -${expectedDmg})` : ''} ได้รับเนื้อสัตว์ 🥩`, expectedDmg ? 'bubble-player' : 'bubble-event-good');
    addToInventory(pi, 'เนื้อสัตว์');
    p.stats.animalsDefeated++;
    return;
  }

  p.energy = clamp(p.energy - 15, 0, 100);
  if (Math.random() < 0.3) {
    const dmg = Math.ceil(animalDmg * 0.7);
    p.hp = clamp(p.hp - dmg, 0, 100);
    p.stats.damageTaken += dmg;
    addMsg(`🏃 ${p.name} วิ่งหนีจาก ${wild} แต่ถูกตะปบหลัง! ได้รับความเสียหาย ${dmg} หน่วย`, 'bubble-event-bad');
  } else {
    addMsg(`🏃 ${p.name} ประเมินแล้วว่าสู้ ${wild} ไม่ไหว จึงวิ่งหนีจนพ้นอย่างปลอดภัย!`, 'bubble-player');
  }
}

function mockNarrateAction(pi, action, meta={}) {
  const p = G.players[pi];
  const loc = meta.loc;
  const fill = s => s.replace(/\{n\}/g, p.name);
  const weatherBad = G.weather && ['🌧️', '⛈️', '🌫️'].includes(G.weather.icon);

  // Outcome odds: danger, weather and exhaustion make things worse; luck/sanity helps
  const danger = loc ? (loc.danger || 0.3) : 0.2;
  let badChance = danger * 0.6 + (weatherBad ? 0.1 : 0) + (p.energy < 20 ? 0.1 : 0);
  let goodChance = 0.35 + (p.sanity > 70 ? 0.05 : 0) + (p.job && (p.job.id === 'scout' || p.job.id === 'hunter') ? 0.05 : 0);
  if (loc) badChance = Math.max(0, badChance - exploreProtection(pi, loc, true));
  if (p.scoutDay === G.day) { badChance = 0; goodChance = 1; }
  const r = Math.random();
  const outcome = r < badChance ? 'bad' : r < badChance + goodChance ? 'good' : 'normal';

  let story, loot = [], hp = 0, sanity = 0, energy = -rollRange(5, 9);
  const hunger = -rollRange(2, 5), thirst = -rollRange(5, 10);

  if (loc) {
    const lines = LOC_STORIES[loc.id] || LOC_STORIES.mystery;
    story = fill(pick(lines[outcome]));
    const pool = loc.loot || [];
    const n = outcome === 'good' ? rollRange(1, 2) : outcome === 'normal' ? (Math.random() < 0.65 ? 1 : 0) : (Math.random() < 0.25 ? 1 : 0);
    for (let i = 0; i < n && pool.length; i++) loot.push(pick(pool));
  } else {
    const kind = FREE_ACTIONS.find(a => a.re.test(action || ''));
    if (kind) {
      story = fill(outcome === 'bad' ? kind.bad : kind.good);
      if (outcome !== 'bad' && kind.loot.length && Math.random() < 0.7) loot.push(pick(kind.loot));
      if (outcome !== 'bad') { sanity += kind.sanity || 0; energy += kind.energy || 0; }
    } else {
      story = fill(outcome === 'bad' ? '{n} ลองทำตามที่คิดไว้ แต่สถานการณ์ไม่เป็นใจเลย'
        : outcome === 'good' ? '{n} ลงมือทำตามแผน และมันได้ผลดีกว่าที่คิด'
        : '{n} ใช้เวลาไปกับสิ่งที่ตั้งใจ ไม่มีอะไรพิเศษเกิดขึ้น');
    }
  }

  if (outcome === 'good') { hp += rollRange(0, 5); sanity += 3; }
  if (outcome === 'bad')  { hp -= Math.round(rollRange(4, 9) * (0.6 + danger)); sanity -= rollRange(3, 7); }

  return {
    story,
    hpDelta: hp,
    hungerDelta: hunger,
    thirstDelta: thirst,
    energyDelta: energy,
    sanityDelta: sanity,
    loot,
    wildlife: (loc?.wild && G.safeDay !== G.day && p.scoutDay !== G.day) ? (Math.random() < 0.3 * (G.activeEvent.wildMult || 1) ? pick(loc.wild) : null) : null,
    event: outcome === 'normal' ? 'none' : outcome,
    eventText: outcome === 'good' ? pick(GOOD_TEXT) : outcome === 'bad' ? pick(BAD_TEXT) : ''
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
  if (meta.loc && G.locations.includes(meta.loc)) grantLocMats(pi, meta.loc);
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

  // A human who meets an animal gets this loot from the fight instead (initiateCombat),
  // so only hand it out now when there is no fight to resolve.
  if (finalLoot.length && (!parsed.wildlife || p.isBot)) {
    finalLoot.forEach(item => addToInventory(pi, item));
    addMsg(`🎒 ได้รับ: ${finalLoot.join(', ')}`, 'bubble-event-good');
  }

  // Wildlife handling
  if (parsed.wildlife) {
    addWildlife(`${p.name} เจอ ${parsed.wildlife}`);
    if (!p.isBot) {
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

// Narrates an action with the built-in narrator. Kept async with a short pause so
// the typing dots show and the result doesn't appear instantly.
async function callAI(pi, action, hoursCost, meta={}) {
  if (G.isLoading) return;
  G.isLoading = true;
  setButtons(true);

  const p = G.players[pi];
  addMsg(`${p.emoji} ${p.name}: ${action}`, 'bubble-player');

  showTyping();
  await new Promise(r => setTimeout(r, p.isBot ? 350 : 600 + Math.random() * 500));
  removeTyping();
  processActionResult(pi, mockNarrateAction(pi, action, meta), meta, hoursCost);
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
  return Math.max(1, Math.round(hp * getDifficulty().animalHp));
}

function getAnimalDmg(name) {
  let dmg = 8;
  if (name.includes('หมี')) dmg = 22;
  else if (name.includes('เสือ')) dmg = 18;
  else if (name.includes('จระเข้')) dmg = 15;
  else if (name.includes('หมูป่า')) dmg = 12;
  else if (name.includes('งูพิษ')) dmg = 15;
  else if (name.includes('งู') || name.includes('หมาจิ้งจอก') || name.includes('สุนัข')) dmg = 10;
  else if (name.includes('ค้างคาว') || name.includes('นก') || name.includes('แมลง')) dmg = 6;
  return Math.max(1, Math.round(dmg * getDifficulty().animalDmg));
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

// Best melee weapon in the bag: { item, dmg, label }
function combatWeapon(p) {
  if (p.inventory.includes('หอก')) return { item:'หอก', dmg:40, label:'หอก 🗡️' };
  if (p.inventory.includes('มีด')) return { item:'มีด', dmg:20, label:'มีด 🔪' };
  return { item:null, dmg:8, label:'มือเปล่า' };
}

function renderCombatScreen() {
  if (!G.combatState) return;
  const cs = G.combatState;
  const p = G.players[cs.playerIndex];

  document.getElementById('combat-wild-hp').textContent = cs.animalHp;
  document.getElementById('combat-player-hp').textContent = p.hp;

  let desc = `คุณเดินทางเข้าไปในป่าและเผชิญหน้ากับ **${cs.animalName}** อย่างหลีกเลี่ยงไม่ได้!\n\n`;
  if (cs.exploreStory) desc += `*${cs.exploreStory}*\n\n`;
  const gear = ['โล่ไม้', 'ชุดเกราะเก่า', 'ขวานเหล็ก', 'อาวุธโบราณ'].filter(i => p.inventory.includes(i));
  if (gear.length) desc += `อุปกรณ์: ${gear.join(' · ')}\n`;
  desc += `จงเลือกตัดสินใจดำเนินการ:`;
  document.getElementById('combat-desc').innerHTML = formatMsg(desc);

  const actionsList = document.getElementById('combat-actions-list');
  actionsList.innerHTML = '';
  const addBtn = (cls, left, right, onclick) => {
    const b = document.createElement('button');
    b.className = 'combat-btn ' + cls;
    b.innerHTML = `<span>${left}</span><span>${right}</span>`;
    b.onclick = onclick;
    actionsList.appendChild(b);
  };

  const w = combatWeapon(p);
  let bonus = (p.inventory.includes('ขวานเหล็ก') ? 12 : 0) + (p.inventory.includes('อาวุธโบราณ') ? 20 : 0);
  const left = w.item ? ` (เหลือ ${duraLeft(p, w.item)})` : '';
  addBtn('combat-btn-fight', `⚔️ โจมตีด้วย ${w.label}${left}`, `DMG ${w.dmg + bonus}`, () => doCombatRound('fight'));
  if (p.inventory.includes('ธนู')) {
    addBtn('combat-btn-fight', `🏹 ยิงธนูจากระยะไกล (เหลือ ${duraLeft(p, 'ธนู')})`, 'DMG 25 · ไม่โดนสวน', () => doCombatRound('shoot'));
  }
  addBtn('combat-btn-flee', '🏃 วิ่งหนีเอาชีวิตรอด', 'ใช้พลังงาน 15', () => doCombatRound('flee'));
  addBtn('', '🍃 แอบซ่อนตัวในพุ่มไม้', 'เสี่ยงต่ำ / เสียเวลา 2 ชม.', () => doCombatRound('hide'));
}

// Damage an animal deals to the player this hit, after job, armour and shield
function incomingDamage(pi, base) {
  const p = G.players[pi];
  let dmg = base;
  if (p.job.id === 'soldier') dmg = Math.ceil(dmg * 0.5);
  if (p.inventory.includes('ชุดเกราะเก่า')) {
    dmg = Math.max(1, Math.ceil(dmg * 0.6));
    addMsg(`🛡️ ชุดเกราะเก่าช่วยลดแรงปะทะ! (-40% ดาเมจ)`, 'bubble-system');
  } else if (p.inventory.includes('เครื่องรางศักดิ์สิทธิ์')) {
    dmg = Math.max(1, Math.ceil(dmg * 0.8));
    addMsg(`✨ เครื่องรางส่องแสงปกป้องคุณ! (-20% ดาเมจ)`, 'bubble-system');
  }
  if (p.inventory.includes('โล่ไม้')) {
    dmg = Math.max(1, Math.ceil(dmg * 0.7));
    useTool(pi, 'โล่ไม้');
    addMsg(`🛡️ โล่ไม้รับแรงกระแทกไว้ได้ส่วนหนึ่ง (-30%)`, 'bubble-system');
  }
  return dmg;
}

function winCombat(cs, p) {
  addMsg(`🏆 คุณสามารถล้ม ${cs.animalName} ได้สำเร็จ!`, 'bubble-event-good');
  p.stats.animalsDefeated++;
  addToInventory(cs.playerIndex, 'เนื้อสัตว์');
  addMsg(`🎒 ได้รับ: เนื้อสัตว์ 🥩`, 'bubble-event-good');
  if (cs.loot && cs.loot.length) {
    cs.loot.forEach(item => addToInventory(cs.playerIndex, item));
    addMsg(`🎒 ได้รับของสำรวจ: ${cs.loot.join(', ')}`, 'bubble-event-good');
  }
  closeCombat(true);
}

function doCombatRound(action) {
  if (sendClientAction('combatRound', action)) return;
  if (!G.combatState) return;
  const cs = G.combatState;
  const pi = cs.playerIndex;
  const p = G.players[pi];

  if (action === 'shoot') {
    if (!p.inventory.includes('ธนู')) return;
    useTool(pi, 'ธนู');
    cs.animalHp = Math.max(0, cs.animalHp - 25);
    addMsg(`🏹 คุณยิงธนูใส่ ${cs.animalName} จากระยะไกล! ความเสียหาย 25 หน่วย`, 'bubble-player');
    if (cs.animalHp <= 0) { winCombat(cs, p); return; }
    renderCombatScreen();
    return;
  }
  if (action === 'fight') {
    const w = combatWeapon(p);
    let finalPlayerDmg = w.dmg;
    if (p.inventory.includes('ขวานเหล็ก')) { finalPlayerDmg += 12; useTool(pi, 'ขวานเหล็ก'); }
    if (p.inventory.includes('อาวุธโบราณ')) finalPlayerDmg += 20;
    if (w.item) useTool(pi, w.item);

    cs.animalHp = Math.max(0, cs.animalHp - finalPlayerDmg);
    addMsg(`⚔️ คุณโจมตี ${cs.animalName} ด้วย${w.label} ได้รับความเสียหาย ${finalPlayerDmg} หน่วย!`, 'bubble-player');
    if (cs.animalHp <= 0) { winCombat(cs, p); return; }

    const dmg = incomingDamage(pi, cs.animalDmg);
    p.hp = clamp(p.hp - dmg, 0, 100);
    p.stats.damageTaken += dmg;
    addMsg(`💥 ${cs.animalName} โจมตีกลับ! คุณได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
    if (p.hp <= 0) { closeCombat(false); killPlayer(pi); return; }
    renderCombatScreen();
  }
  else if (action === 'flee') {
    p.energy = clamp(p.energy - 15, 0, 100);
    if (Math.random() < 0.3) {
      const dmg = incomingDamage(pi, Math.ceil(cs.animalDmg * 0.7));
      p.hp = clamp(p.hp - dmg, 0, 100);
      p.stats.damageTaken += dmg;
      addMsg(`🏃 คุณพยายามวิ่งหนี แต่ถูก ${cs.animalName} ตะปบหลัง! ได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
      if (p.hp <= 0) { closeCombat(false); killPlayer(pi); return; }
    } else {
      addMsg(`🏃 คุณวิ่งหนีจาก ${cs.animalName} จนพ้นอย่างปลอดภัย!`, 'bubble-player');
    }
    closeCombat(false);
  }
  else if (action === 'hide') {
    p.hoursLeft = Math.max(0, p.hoursLeft - 2);
    if (Math.random() < 0.15) {
      const dmg = incomingDamage(pi, cs.animalDmg);
      p.hp = clamp(p.hp - dmg, 0, 100);
      p.stats.damageTaken += dmg;
      addMsg(`🍃 คุณซ่อนตัวในพุ่มไม้ แต่ ${cs.animalName} ดมกลิ่นจนพบตัว! ได้รับความเสียหาย ${dmg} หน่วย!`, 'bubble-event-bad');
      if (p.hp <= 0) { closeCombat(false); killPlayer(pi); return; }
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
  G.combatState = null;
  // A player killed in combat is handled by killPlayer() (which advances the turn);
  // spending time here too would advance the turn twice.
  if (G.players[cs.playerIndex].hp <= 0) { G.isLoading = false; setButtons(false); return; }
  spendTime(cs.playerIndex, cs.exploreHours);
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
    endDay();
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
  if (G.camp.structures.includes('smoker')) {
    const raw = { 'เนื้อสัตว์':'เนื้อย่าง', 'ปลา':'ปลาย่าง', 'ไก่ป่า':'เนื้อย่าง', 'กระต่าย':'เนื้อย่าง' };
    let smoked = 0;
    G.camp.sharedItems = G.camp.sharedItems.map(it => (raw[it] && smoked < 2) ? (smoked++, raw[it]) : it);
    if (smoked) addMsg(`🍖 ชั้นรมควันทำให้ของดิบในคลังสุกแล้ว ${smoked} ชิ้น`, 'bubble-event-good');
  }
  if (G.camp.structures.includes('garden')) {
    G.camp.sharedItems.push('ผลไม้', 'ผลไม้');
    addMsg('🌱 แปลงผักให้ผลไม้ 2 ลูกเข้าคลังแคมป์', 'bubble-event-good');
  }
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

  saveGame('newDay');
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
  clearSave();
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
        <div class="end-award-desc">${formatMsg(`**${slayer.name}** กำจัดสัตว์ร้ายได้ทั้งหมด **${maxDefeated}** ตัว!`)}</div>
      </div>
    `;
  }
  if (generous && maxShared > 0) {
    awardsHtml += `
      <div class="end-award-card">
        <div class="end-award-title">🤝 ผู้โอบอ้อมอารี</div>
        <div class="end-award-desc">${formatMsg(`**${generous.name}** แบ่งปันเสบียงให้เพื่อนรวม **${maxShared}** ครั้ง!`)}</div>
      </div>
    `;
  }
  if (firstDie) {
    awardsHtml += `
      <div class="end-award-card">
        <div class="end-award-title">💀 ผู้ดับสูญคนแรก</div>
        <div class="end-award-desc">${formatMsg(`**${firstDie.name}** จากไปก่อนใครในวันที่ **${minDayDied}**`)}</div>
      </div>
    `;
  }
  
  let mvp = G.players.reduce((prev, current) => (prev.finalScore > current.finalScore) ? prev : current);
  awardsHtml += `
    <div class="end-award-card" style="grid-column: span 2; border-color: var(--amber2); background: rgba(212, 144, 42, 0.08);">
      <div class="end-award-title" style="color: var(--amber2);">🏆 ผู้รอดชีวิตระดับตำนาน (MVP)</div>
      <div class="end-award-desc">${formatMsg(`**${mvp.name}** เป็นผู้นำสูงสุดของกลุ่มด้วยสถิติอันยอดเยี่ยม ทำคะแนนรวมได้ **${mvp.finalScore}** แต้ม!`)}</div>
    </div>
  `;
  
  awardsContainer.innerHTML = awardsHtml;
}

// ===================== CAMP SYSTEM =====================
// tier 1 anywhere · 2 needs the workbench · 3 needs camp Lv.3. alt: an alternative recipe
const CAMP_STRUCTURES = [
  { id:'campfire',  name:'กองไฟ',          emoji:'🔥', tier:1, needs:['ไม้','ไม้'], alt:['ไม้ขีดไฟ','ไม้'], time:1, desc:'ปรุงอาหารได้ · กันหนาว · สัตว์บุกแคมป์ยากขึ้น' },
  { id:'workbench', name:'โต๊ะช่าง',        emoji:'🔨', tier:1, needs:['ไม้','ไม้','หิน'], time:1, desc:'ปลดล็อกสูตรขั้น 2' },
  { id:'hut',       name:'กระท่อม',        emoji:'🛖', tier:1, needs:['ไม้','ไม้','ไม้','ผ้า'], alt:['เต็นท์ทหาร'], time:2, desc:'พักผ่อนพลังงาน +65 · กันฝน/หนาว' },
  { id:'watertank', name:'ถังเก็บน้ำ',      emoji:'💧', tier:1, needs:['หิน','หิน','ผ้า'], time:2, desc:'ได้น้ำสะอาด 2 ขวดทุกคืน' },
  { id:'clinic',    name:'มุมรักษา',        emoji:'🏥', tier:1, needs:['สมุนไพร','สมุนไพร','ผ้า'], time:1, desc:'ทุกคืนรักษาป่วย/พิษ/บาดเจ็บ HP +10' },
  { id:'fence',     name:'รั้วไม้',          emoji:'🪵', tier:1, needs:['ไม้','ไม้','ไม้','เชือก'], time:1, desc:'สัตว์บุกแคมป์ยากขึ้น' },
  { id:'smoker',    name:'ชั้นรมควัน',      emoji:'🍖', tier:1, needs:['ไม้','ไม้','หญ้าแห้ง'], time:1, desc:'ทุกคืนรมควันของดิบในคลังแคมป์ให้สุก 2 ชิ้น' },
  { id:'garden',    name:'แปลงผัก',        emoji:'🌱', tier:2, needs:['เมล็ดพืช','ไม้','ไม้'], time:1, desc:'ได้ผลไม้ 2 ลูกเข้าคลังทุกคืน' },
  { id:'stove',     name:'เตาดิน',          emoji:'🍳', tier:2, needs:['หิน','หิน','หิน'], time:2, desc:'ทำอาหารไม่เสียเวลา + อิ่มขึ้น 50%' },
  { id:'trapfence', name:'รั้วกับดัก',      emoji:'🪤', tier:2, needs:['กับดักสัตว์','ไม้','ไม้'], time:1, desc:'สัตว์ที่บุกแคมป์ติดกับดัก ได้เนื้อสัตว์' },
  { id:'tower',     name:'หอคอยสัญญาณ',    emoji:'🗼', tier:2, needs:['ไม้','ไม้','ไม้','โลหะเก่า','โลหะเก่า'], time:2, desc:'โอกาสกู้ภัย +25% วันที่ 7' },
  { id:'lock',      name:'กุญแจคลัง',       emoji:'🔐', tier:2, needs:['โลหะเก่า','โลหะเก่า'], time:1, desc:'ของในคลังแคมป์ถูกขโมยยากขึ้นมาก' },
  { id:'bell',      name:'ระฆังเตือนภัย',    emoji:'🔔', tier:2, needs:['โลหะเก่า','เชือก'], time:1, desc:'คนเฝ้ายามจับผู้บุกรุกได้ง่ายขึ้น' },
  { id:'purifier',  name:'เครื่องกรองน้ำเหล็ก', emoji:'🏗️', tier:3, needs:['โลหะเก่า','โลหะเก่า','โลหะเก่า','หิน','แก้ว'], time:3, desc:'ได้น้ำสะอาด 3 ขวดทุกคืน' },
  { id:'fortified', name:'กำแพงเหล็กกันภัย', emoji:'🛡️', tier:3, needs:['โลหะเก่า','โลหะเก่า','โลหะเก่า','โลหะเก่า','ไม้','ไม้','ไม้'], time:3, desc:'กันสัตว์บุกและคนบุกรุก 100% · ค่าสติไม่ลด' },
];

// ===================== MATERIALS & RECIPE HELPERS =====================
function ensureMats() {
  if (!G.mats) G.mats = {};
  BASIC_MATS.forEach(m => { if (typeof G.mats[m] !== 'number') G.mats[m] = 0; });
  if (!Array.isArray(G.discovered)) G.discovered = CRAFTS.filter(c => c.start).map(c => c.name);
  return G.mats;
}
function isBasicMat(item) { return BASIC_MATS.includes(item); }
function matCount(name) { return (ensureMats()[name]) || 0; }
function addMats(name, n, silent) {
  ensureMats();
  G.mats[name] = (G.mats[name] || 0) + n;
  if (window.SX) SX.onMats(name, n, silent);
}

// Count how many of each name a recipe needs
function countNeeds(needs) {
  const c = {};
  needs.forEach(n => { c[n] = (c[n] || 0) + 1; });
  return c;
}
// Items (not materials) a player can use right now: bag, plus the camp store when at camp
function itemPool(pi, useCamp) {
  const p = G.players[pi];
  return [...p.inventory, ...((useCamp && p.atCamp) ? G.camp.sharedItems : [])];
}
// What is still missing for a recipe: [{name, have, need}]
function missingFor(pi, needs, useCamp = true) {
  const pool = itemPool(pi, useCamp);
  return Object.entries(countNeeds(needs)).map(([name, need]) => {
    const have = isBasicMat(name) ? matCount(name) : pool.filter(i => i === name).length;
    return { name, have, need };
  }).filter(m => m.have < m.need);
}
function haveAll(pi, needs, useCamp = true) { return missingFor(pi, needs, useCamp).length === 0; }
// Consume a recipe's needs: materials from the pouch, items from the bag first, then the camp store
function takeAll(pi, needs, useCamp = true) {
  if (!haveAll(pi, needs, useCamp)) return false;
  const p = G.players[pi];
  needs.forEach(name => {
    if (isBasicMat(name)) { G.mats[name]--; return; }
    const i = p.inventory.indexOf(name);
    if (i > -1) { p.inventory.splice(i, 1); return; }
    const j = G.camp.sharedItems.indexOf(name);
    if (j > -1) G.camp.sharedItems.splice(j, 1);
  });
  if (window.SX) SX.onMats();
  return true;
}
// Recipe or structure can be made at this tier? (2 = workbench, 3 = camp Lv.3)
function tierUnlocked(tier) {
  if (tier <= 1) return true;
  if (tier === 2) return G.camp.structures.includes('workbench');
  return G.camp.level >= 3;
}
function tierLockText(tier) {
  return tier === 2 ? 'ต้องสร้าง 🔨 โต๊ะช่าง ที่แคมป์ก่อน' : 'ต้องพัฒนาแคมป์เป็น Lv.3 (สร้าง 5 อย่างขึ้นไป)';
}
// Engineer: crafts and builds 1 hour faster
function craftHours(pi, base) {
  const p = G.players[pi];
  return Math.max(0, base - ((p.job && p.job.id === 'engineer') ? 1 : 0));
}
// Recipes become known when the team first holds one of their ingredients
function discoverRecipes(silent) {
  ensureMats();
  const held = new Set();
  G.players.forEach(p => p.alive && p.inventory.forEach(i => held.add(i)));
  G.camp.sharedItems.forEach(i => held.add(i));
  BASIC_MATS.forEach(m => { if (G.mats[m] > 0) held.add(m); });
  const found = [];
  CRAFTS.forEach(c => {
    if (G.discovered.includes(c.name)) return;
    if (c.needs.some(n => held.has(n))) { G.discovered.push(c.name); if (!c.side) found.push(c); }
  });
  if (found.length && !silent && window.SX) SX.onDiscover(found);
  return found;
}
// Durability: uses left for the first copy of a tool in a player's bag
function duraLeft(p, item) {
  if (!DURABILITY[item] || !p.inventory.includes(item)) return null;
  if (!p.dura) p.dura = {};
  if (typeof p.dura[item] !== 'number') p.dura[item] = DURABILITY[item];
  return p.dura[item];
}
// Use a tool once; it breaks (one copy removed) when it runs out. Returns false if the player doesn't have it.
function useTool(pi, item) {
  const p = G.players[pi];
  const left = duraLeft(p, item);
  if (left === null) return false;
  p.dura[item] = left - 1;
  if (p.dura[item] <= 0) {
    p.inventory.splice(p.inventory.indexOf(item), 1);
    delete p.dura[item];
    addMsg(`💥 ${item} ของ ${p.name} พังแล้ว!`, 'bubble-event-bad');
  }
  return true;
}
// Guaranteed materials from exploring a location
function grantLocMats(pi, loc) {
  const pool = LOC_MATS[loc && loc.id];
  if (!pool) return [];
  const p = G.players[pi];
  const n = 1 + Math.floor(Math.random() * 3);
  const got = [];
  for (let i = 0; i < n; i++) got.push(pool[Math.floor(Math.random() * pool.length)]);
  if (p.inventory.includes('ไฟฉาย') && ['cave','temple','ruins'].includes(loc.id)) got.push(pool[0]);
  got.forEach(m => addMats(m, 1, true));
  const counts = countNeeds(got);
  addMsg(`🧺 ${p.name} เก็บวัสดุได้: ${Object.entries(counts).map(([m, k]) => `${MAT_ICON[m] || ''}${m} ×${k}`).join(' · ')}`, 'bubble-event-good');
  discoverRecipes();
  return got;
}
function isValuable(item) { return VALUABLES.includes(item); }

// Break an item down into materials (free action)
function doSalvage(pi, item) {
  if (sendClientAction('salvage', pi, item)) return;
  const p = G.players[pi];
  const out = SALVAGE[item];
  const idx = p.inventory.indexOf(item);
  if (!out || idx === -1) return;
  p.inventory.splice(idx, 1);
  Object.entries(out).forEach(([m, n]) => addMats(m, n, true));
  discoverRecipes();
  addMsg(`🔧 ${p.name} แยกชิ้นส่วน ${item} ได้ ${Object.entries(out).map(([m, n]) => `${MAT_ICON[m]}${m} ×${n}`).join(' · ')}`, 'bubble-event-good');
  renderAllPanels();
  updateCampUI();
  if (window.SX) SX.onMats();
}
// Engineer: restore a worn tool for 1 material and 1 hour
function doRepair(pi, item) {
  if (sendClientAction('repair', pi, item)) return;
  const p = G.players[pi];
  if (!p.job || p.job.id !== 'engineer' || duraLeft(p, item) === null || p.hoursLeft < 1) return;
  const mat = matCount('โลหะเก่า') > 0 ? 'โลหะเก่า' : matCount('ไม้') > 0 ? 'ไม้' : null;
  if (!mat) { addMsg('❌ ต้องมีไม้หรือโลหะ 1 ชิ้นเพื่อซ่อม', 'bubble-system'); return; }
  G.mats[mat]--;
  p.dura[item] = DURABILITY[item];
  addMsg(`🔧 ${p.name} ซ่อม ${item} กลับมาใช้ได้ ${DURABILITY[item]} ครั้ง`, 'bubble-event-good');
  renderAllPanels();
  spendTime(pi, 1);
}
// How much the player's gear lowers the chance of a bad explore here (torch is used up when it helps)
function exploreProtection(pi, loc, consume) {
  const p = G.players[pi];
  const dark = !loc.id || ['cave','temple','ruins','graveyard'].includes(loc.id);
  let cut = 0;
  if (dark && p.inventory.includes('ไฟฉาย')) cut += 0.25;
  else if (dark && p.inventory.includes('คบเพลิง')) { cut += 0.2; if (consume) useTool(pi, 'คบเพลิง'); }
  if (['cliff','waterfall'].includes(loc.id) && p.inventory.includes('เชือกยาว')) cut += 0.25;
  return cut;
}


// What the team carries when the plane goes down
const STARTER_MATS = { 'ไม้':2, 'หิน':1, 'เชือก':1, 'ผ้า':1 };
const RAW_SICK_CHANCE = 0.5; // chance raw meat/fish/eggs make you sick
// What each healing item does ('สมุนไพร' is the raw material from the pouch)
const HEAL_ITEMS = {
  'ชุดปฐมพยาบาล':{ hp:35, cures:['sick','poison','injured'] },
  'สมุนไพรหายาก':{ hp:30, cures:['sick','poison','injured'] },
  'ยาสมุนไพร':   { hp:25, cures:['sick','poison','injured'] },
  'ผ้าพันแผล':   { hp:15, cures:['injured'] },
  'สมุนไพร':     { hp:10, cures:['sick'], label:'สมุนไพรสด' },
};
// Best healing item for the player's current condition, or null
function pickHealItem(p) {
  const onlyInjured = p.statuses.includes('injured') && !p.statuses.some(s => s === 'sick' || s === 'poison');
  if (onlyInjured && p.inventory.includes('ผ้าพันแผล')) return 'ผ้าพันแผล';
  const item = ['ชุดปฐมพยาบาล', 'สมุนไพรหายาก', 'ยาสมุนไพร', 'ผ้าพันแผล'].find(m => p.inventory.includes(m));
  if (item) return item;
  return matCount('สมุนไพร') > 0 ? 'สมุนไพร' : null;
}

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

// The camp menu is now the workbench (assets/systems.js), opened on the camp tab
function openCampMenu() {
  const pi = getMyPlayerIndex();
  if (pi === -1) return;
  if (window.SX) SX.openWorkbench(pi, 'camp');
}

function doCookFood(pi, inputItem, outputItem) {
  if (sendClientAction('cook', pi, inputItem, outputItem)) return;
  const p = G.players[pi];
  const idx = p.inventory.indexOf(inputItem);
  const campIdx = idx === -1 && p.atCamp ? G.camp.sharedItems.indexOf(inputItem) : -1;
  if (idx === -1 && campIdx === -1) { addMsg('❌ ไม่มีวัตถุดิบ', 'bubble-system'); spendTime(pi, 0); return; }
  if (idx > -1) p.inventory.splice(idx, 1); else G.camp.sharedItems.splice(campIdx, 1);
  const hasStove = G.camp.structures.includes('stove');
  addToInventory(pi, outputItem);
  let extra = '';
  if (hasStove && Math.random() < 0.5) { addToInventory(pi, outputItem); extra = ' 🍳 เตาดินทำให้ได้ 2 ชิ้น!'; }
  addMsg(`🍳 ${p.name} ปรุง ${inputItem} → ${outputItem} สำเร็จ!${extra}`, 'bubble-event-good');
  p.stats.itemsCrafted++;
  updateCampUI();
  renderAllPanels();
  spendTime(pi, hasStove ? 0 : 1);
}

function doBuildCampStructure(pi, structId) {
  if (sendClientAction('build', pi, structId)) return;
  const p = G.players[pi];
  const s = CAMP_STRUCTURES.find(x => x.id === structId);
  if (!s || G.camp.structures.includes(s.id)) { spendTime(pi, 0); return; }
  if (!p.atCamp) { addMsg('❌ ต้องอยู่ที่แคมป์เพื่อสร้างสิ่งปลูกสร้าง', 'bubble-system'); spendTime(pi, 0); return; }
  if (!tierUnlocked(s.tier)) { addMsg(`🔒 ${tierLockText(s.tier)}`, 'bubble-system'); spendTime(pi, 0); return; }
  const recipe = haveAll(pi, s.needs) ? s.needs : (s.alt && haveAll(pi, s.alt) ? s.alt : null);
  if (!recipe) {
    addMsg(`❌ วัสดุไม่พอ — ขาด ${missingFor(pi, s.needs).map(m => `${m.name} ×${m.need - m.have}`).join(', ')}`, 'bubble-system');
    spendTime(pi, 0);
    return;
  }
  const hrs = craftHours(pi, s.time);
  if (p.hoursLeft < hrs) { addMsg('⏰ เวลาไม่พอสำหรับสร้าง', 'bubble-system'); spendTime(pi, 0); return; }
  takeAll(pi, recipe);
  G.camp.structures.push(s.id);
  updateCampLevel();
  updateCampUI();
  addMsg(`🔨 ${p.name} สร้าง ${s.emoji} ${s.name} ให้แคมป์แล้ว! — ${s.desc}`, 'bubble-event-good');
  p.stats.itemsCrafted++;
  if (window.SX) SX.celebrate(s.emoji, s.name);
  renderAllPanels();
  spendTime(pi, hrs);
}

// ฟังก์ชัน depositToCamp ถูกใช้งานที่บรรทัด 2066 เพื่อความปลอดภัยและถูกต้องครับ

function updateCampLevel() {
  const n = G.camp.structures.length;
  G.camp.level = n >= 5 ? 3 : n >= 2 ? 2 : 1;
}

function updateCampUI() {
  // Basic materials that land in the camp store move into the material pouch
  if (G.camp && Array.isArray(G.camp.sharedItems)) {
    let moved = false;
    G.camp.sharedItems = G.camp.sharedItems.map(it => ITEM_ALIAS[it] || it).filter(it => {
      if (!isBasicMat(it) && !MAT_ALIAS[it]) return true;
      const [m, n] = MAT_ALIAS[it] || [it, 1];
      addMats(m, n, true);
      moved = true;
      return false;
    });
    if (moved) discoverRecipes();
  }

  const levelNames = { 1:'Lv. 1 ค่ายชั่วคราว', 2:'Lv. 2 ค่ายพักแรม', 3:'Lv. 3 ฐานทัพ' };
  const badge = document.getElementById('camp-level-badge');
  if (badge) badge.textContent = levelNames[G.camp.level] || levelNames[1];

  const structList = document.getElementById('camp-structures-list');
  if (structList) {
    const key = ['campfire','workbench','hut','watertank','fence','clinic'];
    const ids = [...new Set([...key, ...G.camp.structures])];
    structList.innerHTML = ids.map(id => {
      const built = G.camp.structures.includes(id);
      const s = CAMP_STRUCTURES.find(x => x.id === id);
      if (!s) return '';
      return `<div title="${s.desc}" style="font-size:10px;${built?'color:var(--green2)':'color:var(--text3)'};text-align:center;padding:4px;background:var(--bg2);border:0.5px solid ${built?'var(--green)':'var(--border)'};border-radius:5px;">
        ${s.emoji} ${built ? s.name : `ไม่มี${s.name}`}
      </div>`;
    }).join('');
  }

  const sharedEl = document.getElementById('camp-shared-items');
  if (sharedEl) {
    sharedEl.setAttribute('ondragover', 'event.preventDefault()');
    sharedEl.setAttribute('ondrop', 'handleDrop(event)');
    if (!G.camp.sharedItems.length) {
      sharedEl.innerHTML = '<span style="color:var(--text3);font-style:italic;">ว่างเปล่า (วางของที่นี่)</span>';
    } else {
      sharedEl.innerHTML = G.camp.sharedItems.map((item, idx) =>
        `<span style="font-size:10px;padding:2px 5px;background:var(--bg4);border:0.5px solid ${isValuable(item)?'var(--amber2)':'var(--border)'};border-radius:3px;color:${isValuable(item)?'var(--amber2)':'var(--text2)'};cursor:pointer;" onclick="takeFromCamp(${getMyPlayerIndex()}, ${idx})">${isValuable(item)?'💎 ':''}${item}</span>`
      ).join('');
    }
  }
  if (window.SX) SX.renderMatBar();
}

// Add handleDrop function
function handleDrop(event) {
  event.preventDefault();
  const itemIdx = event.dataTransfer.getData('text/plain');
  depositToCamp(getMyPlayerIndex(), parseInt(itemIdx));
}

function takeFromCamp(pi, idx) {
  if (pi === -1) return;
  if (sendClientAction('withdraw', pi, idx)) return;
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
  if (pi === -1) return;
  if (sendClientAction('deposit', pi, itemIdx)) return;
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
  if (sendClientAction('share', fromPi, toPi, item)) return;
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
  if (sendClientAction('pvp', fromPi, toPi, method)) return;
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
  if (window.SX) SX.openWorkbench(pi, 'tool');
}

function doCraft(pi, itemName) {
  if (sendClientAction('craft', pi, itemName)) return;
  const p = G.players[pi];
  const c = CRAFTS.find(x => x.name === itemName);
  if (!c) return;
  ensureMats();
  if (c.side && p.side !== c.side) { spendTime(pi, 0); return; }
  if (!tierUnlocked(c.tier)) { addMsg(`🔒 ${tierLockText(c.tier)}`, 'bubble-system'); spendTime(pi, 0); return; }
  const hrs = craftHours(pi, c.time);
  if (p.hoursLeft < hrs) { addMsg('⏰ เวลาไม่พอสำหรับคราฟ', 'bubble-system'); spendTime(pi, 0); return; }
  if (!haveAll(pi, c.needs)) {
    addMsg(`❌ วัตถุดิบไม่พอ — ขาด ${missingFor(pi, c.needs).map(m => `${m.name} ×${m.need - m.have}`).join(', ')}`, 'bubble-system');
    spendTime(pi, 0);
    return;
  }
  const instant = itemName === 'ธูปสมุนไพร';
  if (!instant && p.inventory.length >= getInventoryLimit(p) && !p.atCamp) {
    addMsg('🎒 กระเป๋าเต็ม — กลับแคมป์หรือใช้ของก่อนค่อยคราฟ', 'bubble-system');
    spendTime(pi, 0);
    return;
  }
  takeAll(pi, c.needs);
  if (!G.discovered.includes(c.name)) G.discovered.push(c.name);
  if (instant) {
    G.players.forEach(p2 => { if (p2.alive) p2.sanity = clamp(p2.sanity + 40, 0, 100); });
    addMsg(`🪔 ${p.name} จุดธูปสมุนไพร กลิ่นหอมอบอวลทั่วแคมป์ — ทุกคนค่าสติ +40`, 'bubble-event-good');
  } else {
    addToInventory(pi, itemName);
    addMsg(`${c.icon} ${p.name} คราฟ "${itemName}" สำเร็จ! — ${c.desc}`, 'bubble-event-good');
  }
  p.stats.itemsCrafted++;
  if (window.SX) SX.celebrate(c.icon, itemName);
  updateCampUI();
  renderAllPanels();
  spendTime(pi, hrs);
}

// ===================== RENDER =====================
function renderAllPanels() {
  G.players.forEach((p,i) => renderPanel(i));
  syncStateToAll();
}


function renderPanel(i) {
  const p = G.players[i];
  const el = document.getElementById(`panel-p${i}`);
  const hpW = p.hp; const huW = p.hunger; const enW = p.energy; const tiW = (p.hoursLeft/24)*100;
  const statusHTML = p.alive
    ? p.statuses.map(s=>`<span class="status-tag tag-${s}">${statusLabel(s)}</span>`).join('')
    : '<span class="status-tag tag-dead">☠️ เสียชีวิต</span>';

  const myIndex = getMyPlayerIndex();
  const isHuman = (G.mode === 'multi') ? (p.id === socket?.id) : (i === 0);
  const humanIsSpy = (G.players[myIndex] && G.players[myIndex].job && G.players[myIndex].job.id === 'spy');

  // bags are secret; the spy uses the skill to look at one person instead
  const shouldReveal = isHuman || !p.alive;
  
  let invHTML = '';
  if (shouldReveal) {
    invHTML = p.inventory.map((item, idx)=> {
      const isPoisoned = item === 'อาหารอาบยาพิษ';
      const cssClass = isPoisoned ? ' inv-item-poisoned' : (item==='ผลไม้มีพิษ'||item==='น้ำเน่า'||item==='ยาพิษ'?' toxic':'');
      const canDeposit = isHuman && p.atCamp;
      
      // Calculate craftable hint
      const recipes = CRAFTS.filter(c => c.needs.includes(item) && (!c.side || p.side === c.side));
      const recipeText = recipes.length ? `\nคราฟได้: ${recipes.map(r=>r.name).join(', ')}`
        : SALVAGE[item] ? '\nแยกชิ้นส่วนเป็นวัสดุได้ที่โต๊ะช่าง' : isValuable(item) ? '\nของมีค่า (ขายกับพ่อค้า / คะแนนตอนจบ)' : '';
      const tooltip = `${item}${recipeText}`;
      const isUsedInCraftable = recipes.some(c => tierUnlocked(c.tier) && haveAll(i, c.needs) && p.hoursLeft >= craftHours(i, c.time));
      const dura = duraLeft(p, item);

      // ... (previous logic for CSS and tooltip)
      
      // Added draggable support
      return `<span class="inv-item${cssClass}" title="${tooltip}" style="cursor:grab;position:relative;" 
        draggable="true" 
        ondragstart="event.dataTransfer.setData('text/plain', '${idx}')"
        onclick="showItemInfo('${item.replace(/'/g, "\\'")}')" 
        oncontextmenu="if(${canDeposit}){depositToCamp(${i}, ${idx});return false;}">
        ${isValuable(item) ? '💎 ' : ''}${item}${dura !== null ? ` <b style="color:${dura <= 1 ? 'var(--red3)' : 'var(--amber2)'}">⚒${dura}</b>` : ''}${isUsedInCraftable ? '<div class="craft-badge" style="width:6px;height:6px;top:0;right:0;"></div>' : ''}
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
  const el = document.getElementById('craft-list');
  if (el) el.innerHTML = CRAFTS.filter(c => !c.side).map(c => `<div class="craft-item" title="${c.desc}"><div>${c.icon} ${c.name}</div><div class="craft-req">${c.needs.join('+')} | ⏰${c.time}ชม.</div></div>`).join('');
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
// Escape HTML (player names / AI text) then render **bold**, *italic* and newlines
function formatMsg(text) {
  return String(text)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')
    .replace(/\*(.+?)\*/g,'<i>$1</i>')
    .replace(/\n/g,'<br>');
}

function addMsg(text, cls) {
  const area = document.getElementById('story-box');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'story-msg';
  const bubble = document.createElement('div');
  bubble.className = `story-bubble ${cls}`;
  bubble.innerHTML = formatMsg(text);
  msgDiv.appendChild(bubble);
  area.appendChild(msgDiv);
  area.scrollTop = area.scrollHeight;

  if (socket && G.mode === 'multi' && G.isHost) {
    socket.emit('broadcastMessage', { roomCode: G.roomCode, text, cls });
  }
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

function isFood(item) { return ['ปลา','ปลาย่าง','น้ำสะอาด','ผลไม้','ผลไม้มีพิษ','เห็ด','น้ำเน่า','กบ','แมลง','อาหารกระป๋อง','อาหารเก่า','อาหารอุ่น','ค้างคาว','กวาง','กระต่าย','ไก่ป่า','เนื้อสัตว์','เนื้อย่าง','ซุปเห็ด','ยาบำรุง','ยาบำรุงกำลัง','ไข่','ไข่นก','ไข่จระเข้','รวงผึ้ง','กุ้งฝอย','หอยเชลล์','ปูน้ำจืด','กุ้งมังกรป่า','รังตั๊กแตน','หม้อไฟป่า','ซุปสมาธิ'].includes(item); }

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
    // Older versions stored an Anthropic API key in the browser; clear it
    try { localStorage.removeItem('anthropic_api_key'); } catch (e) { /* storage blocked */ }

    // Direct JS Event Binding to avoid HTML reference errors
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = startCharacterSequence;
    }
});







