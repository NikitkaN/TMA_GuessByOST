import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import './config/firebase';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // пока для разработки
});

app.get('/', (req, res) => res.send('GuessByOST Server'));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));