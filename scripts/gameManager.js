import express from 'express';
import http from 'http';
import { Server as socketIoServer} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketIoServer(server);

/*
socket.on('play card', (roomCode, card) => {
    //Game logic here
    updateGameState(roomCode, socket.id, card);
    io.to(roomCode).emit('update state', rooms[roomCode].state);
});
*/
function useCard(io, socket, roomCode, card) {
    console.log(`Card played in room ${roomCode} by ${socket.id}: ${card}`);

    //Here, update the game state based on the card played
    //For example, update points, remove the card from player's hand, etc.
    
    //Then, emit the updated game state to all clients in the room
    const updatedGameState = {/*... */};
    io.to(roomCode).emit('update state', updatedGameState);
}
function initializeGame(io, socket) {
    socket.on('play card', (roomCode, card) => {
        console.log(`Card played in room ${roomCode}: ${card}`);
        //Update game state logic here
        //updateGameState(roomCode, socket.id, card);
        useCard(io, socket, roomCode, card);
        //And then emit the updated game state to all clients in the room
        //io.to(roomCode).emit('update state', {/* updated game state*/});
    });

    //Add more game-related socket event listeners and logic here
}

function playCard(card, cardElement, deck){ 
    totalPoints += parseInt(card.points, 10);

    //const pointsDisplay = document.getElementById("totalPoints");
    //pointsDisplay.textContent = totalPoints;
    document.getElementById("totalPoints").textContent = totalPoints;

    //console.log("Total Points:", totalPoints);


    var randNum = Math.floor(Math.random() * deck.cards.length);
    const newCard = deck.cards[randNum];
    cardElement.innerHTML = `${newCard.descript}<br><br>${newCard.penalty}<br><br>Points: ${newCard.points}`;
}

function updateGameState(roomCode, playerID, card) {
    //update the game state for the room
    // This function should modify the game state stored in the server based on the card played
}

export { initializeGame };