const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// API Proxy
app.post('/api/narrate', async (req, res) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'dangerously-allow-html-user-access': 'true'
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Game State Management
const rooms = new Map();

const SERVER_JOBS = [
  { id:'hunter',    name:'นักล่า',      emoji:'🏹', skill:'ล่าสัตว์ได้ทันที (ใช้ได้ 1 ครั้ง/เกม)',     skDesc:'ล่าสัตว์' },
  { id:'doctor',    name:'หมอ',         emoji:'🩺', skill:'รักษาทุกคนในกลุ่ม HP +50 (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'รักษากลุ่ม' },
  { id:'thief',     name:'โจร',         emoji:'🗡️', skill:'ขโมยไอเทม 2 ชิ้นจากใครก็ได้ (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'ขโมยคู่' },
  { id:'chef',      name:'พ่อครัว',     emoji:'🍳', skill:'เสกอาหารอุ่น 3 กล่องให้กลุ่ม (ใช้ได้ 1 ครั้ง/เกม)', skDesc:'เสกอาหาร' },
  { id:'scout',     name:'ลูกเสือ',     emoji:'🧭', skill:'เปิดเผย Loot ของทุกที่ในวันนี้ (ใช้ได้ 1 ครั้ง/เกม)',              skDesc:'สแกนพื้นที่' },
  { id:'soldier',   name:'ทหาร',        emoji:'⚔️', skill:'กำจัดสัตว์ป่าในพื้นที่ปัจจุบันทันที (ใช้ได้ 1 ครั้ง/เกม)',  skDesc:'ปราบบอส' },
  { id:'shaman',    name:'หมอผี',       emoji:'🪄', skill:'พยากรณ์อากาศและเหตุการณ์ 3 วันข้างหน้า (ใช้ได้ 1 ครั้ง/เกม)',   skDesc:'หยั่งรู้' },
  { id:'engineer',  name:'วิศวกร',      emoji:'🔧', skill:'สร้างสิ่งปลูกสร้างแคมป์ 1 อย่างฟรี (ใช้ได้ 1 ครั้ง/เกม)',    skDesc:'สร้างฟรี' },
  { id:'merchant',  name:'พ่อค้า',      emoji:'💰', skill:'แลกไอเทมในตัวกับคลังแคมป์ได้ 3 ชิ้น (ใช้ได้ 1 ครั้ง/เกม)',    skDesc:'เทรดด่วน' },
  { id:'spy',       name:'สายลับ',      emoji:'🕵️', skill:'ดูบทบาทและของทุกคน (ใช้ได้ 1 ครั้ง/เกม)',       skDesc:'เปิดเผยความลับ' }
];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', (data) => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        const roomData = {
            code: roomCode,
            host: socket.id,
            players: [{
                id: socket.id,
                name: data.playerName || 'Host',
                isHost: true,
                ready: true,
                job: null
            }],
            gameState: 'lobby', // lobby, playing, gameover
            currentDay: 1,
            currentPlayerIndex: 0
        };
        rooms.set(roomCode, roomData);
        socket.join(roomCode);
        socket.emit('roomCreated', roomData);
        console.log(`Room created: ${roomCode} by ${socket.id}`);
    });

    socket.on('joinRoom', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) {
            socket.emit('error', 'ไม่พบห้องที่ระบุ');
            return;
        }
        if (room.players.length >= 4) {
            socket.emit('error', 'ห้องเต็มแล้ว (สูงสุด 4 คน)');
            return;
        }
        if (room.gameState !== 'lobby') {
            socket.emit('error', 'เกมเริ่มไปแล้ว ไม่สามารถเข้าได้');
            return;
        }

        const newPlayer = {
            id: socket.id,
            name: data.playerName || `Player ${room.players.length + 1}`,
            isHost: false,
            ready: false,
            job: null
        };
        room.players.push(newPlayer);
        socket.join(data.roomCode);
        socket.emit('joinedRoom', room); // Send room data specifically to the new player
        io.to(data.roomCode).emit('updateLobby', room);
        console.log(`${newPlayer.name} joined room: ${data.roomCode}`);
    });

    socket.on('toggleReady', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) return;
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.ready = !player.ready;
            io.to(data.roomCode).emit('updateLobby', room);
        }
    });

    socket.on('addBot', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || socket.id !== room.host) return;
        if (room.players.length >= 4) return;

        const botNames = ['บอตสมชาย', 'บอตสมหญิง', 'บอตสมเกียรติ', 'บอตสมศรี'];
        const botName = botNames[room.players.length % botNames.length];
        room.players.push({
            id: 'bot-' + Date.now(),
            name: botName,
            isHost: false,
            isBot: true,
            ready: true,
            job: null
        });
        io.to(data.roomCode).emit('updateLobby', room);
    });

    socket.on('kickPlayer', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || socket.id !== room.host) return;
        const playerIndex = data.playerIndex;
        if (playerIndex >= 0 && playerIndex < room.players.length) {
            const kickedPlayer = room.players[playerIndex];
            if (kickedPlayer.isBot) {
                room.players.splice(playerIndex, 1);
            } else {
                // If it's a real player, we might want to tell them they were kicked
                io.to(kickedPlayer.id).emit('kicked');
                room.players.splice(playerIndex, 1);
            }
            io.to(data.roomCode).emit('updateLobby', room);
        }
    });

// Helper to initialize server-side Game State (G) for a multiplayer room
function initializeMultiplayerState(roomCode, players) {
    return {
        mode: 'multi',
        isHost: true,
        roomCode: roomCode,
        day: 1,
        currentPlayer: 0,
        players: players.map((p, i) => ({
            id: p.id,
            name: p.name,
            hp: 100, hunger: 80, thirst: 100, energy: 100, sanity: 100,
            inventory: [],
            statuses: [],
            alive: true,
            atCamp: true,
            job: p.job,
            stats: { itemsCrafted: 0, itemsShared: 0, animalsDefeated: 0, damageTaken: 0, dayDied: null, actionsTaken: 0 }
        })),
        locations: [],
        weather: null,
        camp: { structures: [], sharedItems: [], level: 1 },
        rescueData: { attempts: [], lastChance: 0, success: false }
    };
}

// ... existing socket.on('startGame', ...) ...
    socket.on('startGame', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || socket.id !== room.host) return;
        
        const allReady = room.players.every(p => p.ready);
        if (allReady && room.players.length === 4) {
            const shuffledJobs = [...SERVER_JOBS].sort(() => Math.random() - 0.5);
            room.players.forEach((player, index) => {
                player.job = shuffledJobs[index];
                player.confirmedJob = false;
                if (player.isBot) {
                    player.confirmedJob = true;
                }
            });
            room.gameState = 'character_select';
            
            // Initialize server-side G state
            room.G = initializeMultiplayerState(data.roomCode, room.players);
            
            io.to(data.roomCode).emit('gameStarted', room);
            console.log(`Game starting in room ${data.roomCode}. Server-side state initialized.`);
        }
    });

    socket.on('confirmJob', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            if (data.playerName) {
                player.name = data.playerName;
            }
            player.confirmedJob = true;
            console.log(`Player ${player.name} confirmed job ${player.job.name} in room ${data.roomCode}`);
            
            // Check if all players have confirmed their jobs
            const allConfirmed = room.players.every(p => p.confirmedJob);
            if (allConfirmed) {
                room.gameState = 'playing';
                io.to(data.roomCode).emit('allConfirmed', room);
                console.log(`All players in room ${data.roomCode} confirmed their jobs. Transitioning to playing state!`);
            } else {
                io.to(data.roomCode).emit('updateLobby', room);
            }
        }
    });

    // Relay Handlers for Host-Relay Multiplayer
    socket.on('hostSyncState', (data) => {
        const room = rooms.get(data.roomCode);
        if (room) {
            room.G = data.G; // Keep the last state for host migration
            socket.to(data.roomCode).emit('gameStateUpdate', { G: data.G });
        }
    });

    socket.on('broadcastMessage', (data) => {
        socket.to(data.roomCode).emit('broadcastMessage', { text: data.text, cls: data.cls });
    });

    socket.on('broadcastTyping', (data) => {
        socket.to(data.roomCode).emit('broadcastTyping', { show: data.show });
    });

    socket.on('clientAction', (data) => {
        const room = rooms.get(data.roomCode);
        if (room && room.host) {
            io.to(room.host).emit('handleClientAction', {
                action: data.action,
                args: data.args
            });
        }
    });


    socket.on('disconnect', () => {
        rooms.forEach((room, code) => {
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                const isHost = (socket.id === room.host);
                room.players.splice(index, 1);
                
                if (isHost && room.players.length > 0) {
                    // Host Migration
                    const newHost = room.players[0];
                    room.host = newHost.id;
                    newHost.isHost = true;
                    // Transfer state and notify new host
                    io.to(newHost.id).emit('hostChanged', room.G);
                    io.to(code).emit('updateLobby', room);
                } else if (room.players.length === 0) {
                    rooms.delete(code);
                } else {
                    io.to(code).emit('updateLobby', room);
                }
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
