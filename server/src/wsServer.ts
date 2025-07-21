import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

import { appRouter } from './router/index.js';
import { server } from './server.js';

const wss = new WebSocketServer({
  server,
});

const handler = applyWSSHandler({
  createContext: (opts) => {
    return opts;
  },
  wss,
  router: appRouter,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});

wss.on('connection', (ws: WebSocketServer) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

const address = server.address();
if (address && typeof address === 'object') {
  console.log(
    `✅ WebSocket Server listening on ws://localhost:${address.port}`
  );
}
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
