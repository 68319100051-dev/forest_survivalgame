const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Game State Management
const rooms = new Map();

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
        io.to(data.roomCode).emit('playerJoined', room);
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

    socket.on('startGame', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room || socket.id !== room.host) return;
        
        const allReady = room.players.every(p => p.ready);
        if (allReady && room.players.length === 4) {
            room.gameState = 'playing';
            io.to(data.roomCode).emit('gameStarted', room);
        }
    });

    // Synchronize Actions
    socket.on('gameAction', (data) => {
        const room = rooms.get(data.roomCode);
        if (!room) return;
        // Broadcast action to all other players in the room
        socket.to(data.roomCode).emit('syncAction', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Handle player leaving room
        rooms.forEach((room, code) => {
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                if (socket.id === room.host) {
                    if (room.players.length > 0 && !room.players[0].isBot) {
                        room.host = room.players[0].id;
                        room.players[0].isHost = true;
                        io.to(code).emit('updateLobby', room);
                    } else {
                        rooms.delete(code);
                    }
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
