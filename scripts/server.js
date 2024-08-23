import express from 'express';
import http from 'http';
import { Server as SocketIoServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDeck } from './generateCards.js';
import RoomManager from './roomManager.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIoServer(server);

//Initialize RoomManager and GameManager
const roomManager = new RoomManager(io);
//const gameManager = new GameManager(io);

//Used to keep track of players in each room and their scores
const rooms = {};    //Map to store clients' metadata


// Route to serve the home page, single player page, and the multiplayer page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // Adjusted the path
});

app.get('/singlePlayer', (req, res) => {
    res.sendFile(path.join(__dirname, '../singlePlayer.html'));
});

app.get('/multiplayer', (req, res) => {
    res.sendFile(path.join(__dirname, '../multiplayer.html'));
});

app.get('/multiplayerGame', (req, res) => {
    res.sendFile(path.join(__dirname, '../multiplayerGameScreen.html'));
});

// Serve static files from 'assets' and 'scripts' directories
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));
app.use('/scripts', express.static(path.join(__dirname, '../scripts')));
app.use('/data', express.static(path.join(__dirname, '../data')));

//Retrieve the cards for the deck
app.get('/api/cards', async (req, res) => {
    try {
        const cards = await generateDeck();
        res.json({ cards });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate cards' });
    }
});

//Establish client connection to server
io.on('connection', (socket) => {           
    console.log('A client connected:', socket.id);      //Displays when a client connects

    //Delegate room and game management to the respective managers
    roomManager.handleConnection(socket);


    //Creates a game room
    /*socket.on('createRoom', () => {         
        const roomCode = uuidv4();     //Generates unique ID for room     
        rooms[roomCode] = { [socket.id]: { score: 0} }; //Add the room to the list of rooms
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
        io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
        console.log(`Room ${roomCode} created`);
    });

    //Allows client to join 'private' game room
    socket.on('joinRoom', (roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode][socket.id] = { score: 0 };
            socket.join(roomCode);

            //Update all the clients in the room
            io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
            console.log(`Client ${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });
*/
    //updates individual scores for players
    socket.on('updateScore', ({ roomCode, points}) => {
        if(rooms[roomCode] && rooms[roomCode][socket.id]) {
            //update to score for the client
            rooms[roomCode][socket.id].score += points;

            //Broadcast updated scores
            io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
        }
    });

    //Listen for room updates
    socket.on('roomUpdate', (room) => {
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
});

const PORT = process.env.PORT || 4000;

function startServer(port) {
    console.log(`Attempting to start server on port ${port}`);
    server.listen(port, () => {
        console.log(`listening on *:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying another port...`);
            startServer(port + 1); // Try the next port
        } else {
            console.error(err);
        }
    });
}

startServer(PORT);
