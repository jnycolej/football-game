import RoomManager from './roomManager.js'
//Connect to the server
const socket = io();


//Function to create a room
function createRoom() {
    socket.emit('createRoom', (roomCode) => {
        console.log(`Room created with code: ${roomCode}`);
        document.getElementById('roomCodeDisplay').innerText = `Room Code: ${roomCode}`;

        //Optionally, update the UI to transistion to the game interface
    });
}

function joinRoom() {
    const roomCode = document.getElementById('roomCodeInput').value;
    const username = document.getElementById('nameInput').value;

    socket.emit('joinRoom', roomCode, (success) => {
        if (success) {
            console.log(`Joined room: ${roomCode} name: ${username}`);
            //Optionally, update the UI to transition  to the game interface
            //generateHand();
        } else {
            alert('Failed to join room. Please check the code and try again');
        }
    });
    function multiplayerPage() {
        window.location.href = "/multiplayerGame";
      }
}

//Attach the functions to the window object so they can be accessed from the HTML
window.createRoom = createRoom;
window.joinRoom = joinRoom;