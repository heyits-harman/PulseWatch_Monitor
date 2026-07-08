import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import urlRouter from './routes/urls'
import { startHealthCheckSchedule } from './queue/urlQueue';
import { subscriber } from './utils/redis';
 
dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({server});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', urlRouter);

app.get('/health', (req, res) => {
  res.json({ status: "Server is running"})
})

wss.on('connnection', (ws) => {
  console.log("Client connected to WebSocket");

  subscriber.subscribe('status-update', (message) => { ws.send(message) });

  ws.on('close', () => {
    console.log("Client Disconnected");
    subscriber.unsubscribe('status-update');
  })
})


app.listen(PORT, async () => {
  await startHealthCheckSchedule();
  console.log(`Server is running on ${PORT}`)
})