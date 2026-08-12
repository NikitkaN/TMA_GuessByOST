import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleAuth } from './socket/authMiddleware';
import './config/firebase';
import 'dotenv/config';

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

if (process.env.DEV_MODE !== 'true') {
  io.use((socket, next) => {
    const initData = socket.handshake.auth?.initData;
  
    if (!initData) {
      return next(new Error('Отсутствует initData'));
    }
  
    const result = handleAuth(initData);
  
    if (!result.success) {
      return next(new Error(result.error || 'Ошибка авторизации'));
    }
  
    socket.data.user = result.user;
  
    next();
  });  
}
