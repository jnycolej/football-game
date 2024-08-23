import io from 'socket.io-client';
const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('messafe', 'Hello from client');
});

socket.on('message', (data) => {
    console.log(`Message from server: ${data}`);
});

socket.on('card played', (card) => {
    //Update the game state based on the card played
    console.log(`Card received: ${card}`);
});

function playCard(card) {
    socket.emit('play card', card);
}

function createRoom() {
    socket.emit('create room');
    socket.on('room created', (roomCode) => {
        document.getElementById('roomCodeDisplay').textContent =   `Room Code: ${roomCode}`;
        // Set the roomCode globally or manage it as needed for game state
    });
}

function joinRoom() {
    const roomCode = document.getElementById('roomCodeInput').value;
    socket.emit('join room', roomCode);
    //Handle the logic to transition to multiplayer
}