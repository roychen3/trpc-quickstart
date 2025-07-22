import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import { Readable } from 'stream';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { userGenerator } from '../module/user/index.js';
import { appRouter } from '../router/index.js';

function createUsersBackpressureStream() {
  let generator: AsyncGenerator<any, void, unknown> | undefined;
  return new Readable({
    objectMode: true,
    async read() {
      try {
        if (!generator) generator = userGenerator();
        for await (const user of generator) {
          const shouldContinue = this.push(JSON.stringify(user) + '\n');
          if (!shouldContinue) {
            console.log('Backpressure: paused');
            break; // 等待下一次 read
          }
          if (user.isEnd) {
            console.log('Stream ended');
            this.push(null); // 結束 stream
            return;
          }
        }
      } catch (err) {
        this.destroy(err as Error);
      }
    },
  });
}

const usersBackpressureStreamHandler = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const stream = createUsersBackpressureStream();
  stream.pipe(res);

  stream.on('drain', () => {
    console.log('Backpressure: resumed');
  });

  stream.on('error', (err) => {
    console.error('Stream error:', err);
    if (!res.writableEnded) res.end();
  });

  req.on('close', () => {
    stream.destroy();
    if (!res.writableEnded) res.end();
    console.log('Client disconnected');
  });
};

export const createCustomHttpServer = (options: { port: number }) => {
  const { port } = options;
  const corsMiddleware = cors({ origin: '*' }); // 設定 CORS 為 '*'

  const handler = createHTTPHandler({
    router: appRouter,
    createContext: (opts) => {
      return opts;
    },
  });

  const server = createHttpServer((req, res) => {
    corsMiddleware(req, res, () => {
      if (req.url === '/users/backpressure-stream') {
        usersBackpressureStreamHandler(req, res);
        return;
      }
      handler(req, res);
    });
  });

  server.listen(port);
  console.log(`✅ Custom tRPC Server listening on http://localhost:${port}`);

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    server.close();
  });

  return server;
};
