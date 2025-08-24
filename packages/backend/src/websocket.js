// packages/backend/src/websocket.js

import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

// This will store the connections, mapping a userId to their WebSocket object
const clients = new Map();

export const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('A new client connected!');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        // The first message from the client should be an auth token
        if (data.type === 'AUTH') {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          if (decoded.userId) {
            console.log(`Client authenticated as user: ${decoded.userId}`);
            // Save the connection for this user
            clients.set(decoded.userId, ws);
            ws.userId = decoded.userId; // Attach userId to the connection
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error.message);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        console.log(`Client disconnected: ${ws.userId}`);
        clients.delete(ws.userId); // Remove user on disconnect
      }
    });
  });
};

// This function lets other parts of our app send messages to a specific user
export const sendMessageToUser = (userId, message) => {
  const client = clients.get(userId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify(message));
  }
};