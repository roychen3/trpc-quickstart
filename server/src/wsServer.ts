import { applyWSSHandler, WSSHandlerOptions } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { appRouter } from './router/index.js';

const port = 4001;

const wss = new WebSocketServer({
  port,
}) as WSSHandlerOptions<never>['wss'];

const handler = applyWSSHandler({
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

console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
