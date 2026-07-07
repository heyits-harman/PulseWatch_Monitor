import { WebSocketServer } from 'ws';
import { subscriber } from '../utils/redis';

const wss = new WebSocketServer({ port: 8080 });

export function startWebSocketServer(){
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client Connection');

    subscriber.subscribe('status-update').then(() => {
      console.log("Subscribed to status-update");
    })

    subscriber.on('message', (channel, message) => {
      if(channel === "status-update"){
        ws.send(message);
      }
    })
  })

  wss.on('close', () => {
    console.log('Client disconnected');
    subscriber.unsubscribe('status-update');
  })

  console.log('WebSocket server running on ws://localhost:8080');
}