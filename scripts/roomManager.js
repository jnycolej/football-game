//import { v4 as uuidv4 } from 'uuid';

//const socket = io();
//const io = require('socket.io')(server);

let roomCode = '';
let playerId = '';

export default class RoomManager {
    constructor(io) {
        this.io = io;
        this.rooms = {};
    }

    handleConnection(socket) {
        // Handle room connection

        socket.on('createRoom', (callback) => {
            const roomCode = this.generateRoomCode();
            this.rooms[roomCode] = { players: [socket.id] };
            socket.join(roomCode);
            callback(roomCode);
        });

        socket.on('joinRoom', (roomCode, callback) => {
            if (this.rooms[roomCode]) {
                this.rooms[roomCode].players.push(socket.id);
                socket.join(roomCode);
                callback(true);
            } else {
                callback(false);
            }
        });

        //Handle disconnection
        socket.on('disconnect', () => {
            this.leaveRoom(socket);
        });
    }

    generateRoomCode() {
        //Implement your logic to generate a unique room code
        const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        console.log('Room Created:', roomCode);
        return roomCode;
    }

    leaveRoom(socket){
        //Implement your logic to handle a player leaving a room
        for (const roomCode in rooms) {
            if (rooms[roomCode][socket.id]) {
                delete rooms[roomCode][socket.id];  //Remove client from all rooms its connected in
                io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
                if (Object.keys(rooms[roomCode]).length === 0) {    //If room is empty delete it
                    delete rooms[roomCode];
                    console.log(`Room ${roomCode} deleted`);
                }
            }
        }
        console.log('Client disconnected:', socket.id);
    }


}



//Listen for room updates
/*socket.on('roomUpdate', (room) => {
    console.log('Room update:', room);
    //Update the UI with the currnt room state
    //Example: display scores of all players in the room

});

//Listen for errors
socket.on('error', (message) => {
    alert(message);
});

//Listn for room created event
socket.on('roomCreated', (code) => {
    roomCode = code;
    console.log(`Room created with code: ${roomCode}`);
    //Display the room to the user
});

//Attach functions to buttons
//document.querySelector('.btn-primary').onclick = generateHand;
//document.querySelector('.btn-secondary:nth-of-type(1)').onclick = createRoom;
//document.querySelector('.btn-secondary:nth-of-type(2)').onclick = joinRoom;
*/
//export default RoomManager;