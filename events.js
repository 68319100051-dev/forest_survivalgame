const LIGHT_EVENTS = [
  { id: "light_rain_stops", name: "🌈 ฝนหยุด", desc: "อากาศสดชื่น — HP +10 ทุกคน" },
  { id: "light_lucky_day", name: "🍀 วันโชคดี", desc: "loot เพิ่ม 1 ชิ้นทุกสถานที่" },
  { id: "light_blooming_flowers", name: "🌺 ดอกไม้ยาบาน", desc: "สมุนไพรหายากพบได้ง่ายขึ้น" },
  { id: "light_guide_bird", name: "🐦 นกนำทาง", desc: "เวลาสำรวจ -1 ชม.ทุกสถานที่" },
  { id: "light_quiet_night", name: "🌙 คืนเงียบสงบ", desc: "energy ไม่ decay วันนี้" },
  { id: "light_cool_wind", name: "🍃 ลมเย็น", desc: "ลดโอกาสป่วยจาก wet" },
  { id: "light_north_smoke", name: "🔥 ควันไฟจากทิศเหนือ", desc: "บอก hint ว่ามีกระท่อมร้าง" }
];

const MEDIUM_EVENTS = [
  { id: "med_rain_storm", name: "⛈️ พายุฝน", desc: "เวลาสำรวจ +2, เสี่ยง wet" },
  { id: "med_wild_animals", name: "🐻 สัตว์ออกอาละวาด", desc: "โอกาสเจอสัตว์ x2" },
  { id: "med_forest_fever", name: "🤒 ไข้ป่าระบาด", desc: "random ติด sick 40%" },
  { id: "med_dry_forest", name: "🍂 ป่าแห้งแล้ง", desc: "loot จากป่าลดลง" },
  { id: "med_radio_signal", name: "📻 สัญญาณวิทยุ", desc: "hint ของหายากในซากอาคาร" },
  { id: "med_flash_flood", name: "🌊 น้ำท่วมฉับพลัน", desc: "แม่น้ำ/หนองน้ำ ปิดชั่วคราว" },
  { id: "med_insect_invasion", name: "🐝 แมลงบุก", desc: "energy decay +5 ทุกเทิร์น" },
  { id: "med_poison_mushroom", name: "🍄 เห็ดพิษระบาด", desc: "อาหารจากป่ามีโอกาสเป็นพิษ 50%" },
  { id: "med_dense_fog", name: "🌫️ หมอกหนา", desc: "เวลาสำรวจ +1 ชม.ทุกที่" },
  { id: "med_corpse_found", name: "💀 พบซากคน", desc: "random ได้ไอเทมจากศพ 1 ชิ้น" },
  { id: "med_landslide", name: "🪨 ดินถล่ม", desc: "ถ้ำ/หน้าผา block 1 วัน" },
  { id: "med_heatwave", name: "🌡️ อากาศร้อนจัด", desc: "hunger decay เพิ่ม +5" }
];

const HEAVY_EVENTS = [
  { id: "heavy_new_predator", name: "🐯 นักล่าตัวใหม่", desc: "สัตว์อันตรายกว่าปกติ (HP x1.5)" },
  { id: "heavy_toxic_water", name: "☠️ น้ำปนเปื้อน", desc: "น้ำสะอาด/แม่น้ำทำให้ป่วยแทน" },
  { id: "heavy_forest_fire", name: "🔥 ไฟป่า", desc: "ป่าทึบ block + HP -20 ถ้าเข้าไป" },
  { id: "heavy_sand_storm", name: "🌪️ พายุทราย", desc: "ทุกการสำรวจเสี่ยง injured" },
  { id: "heavy_panic", name: "😱 ความตื่นตระหนก", desc: "random ผู้เล่นติด paranoid (กระทำสุ่ม)" },
  { id: "heavy_bandits", name: "🗡️ โจรป่า", desc: "NPC ขโมยของจาก random ผู้เล่น 1 คน" },
  { id: "heavy_acid_rain", name: "🌧️ ฝนกรด", desc: "อยู่นอกแคมป์ HP -5/ชม." }
];

window.EVENTS = {
  getRandomEvent: function(day, usedIds) {
    const pools = [];
    if (day >= 1 && day <= 3) pools.push(LIGHT_EVENTS);
    if (day >= 2 && day <= 5) pools.push(MEDIUM_EVENTS);
    if (day >= 4 && day <= 6) pools.push(HEAVY_EVENTS);
    
    const candidates = pools.flat().filter(ev => !usedIds.includes(ev.id));
    if (!candidates.length) return null;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }
};
