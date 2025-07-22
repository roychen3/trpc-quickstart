import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { appRouter } from '../router/index.js';

export const createStandaloneServer = (options: { port: number }) => {
  const { port } = options;

  const server = createHTTPServer({
    router: appRouter,
    middleware: cors({ origin: '*' }), // 設定 CORS 為 '*'
    createContext: (opts) => {
      return opts;
    },
  });

  server.listen(port);
  console.log(`✅ tRPC Server listening on http://localhost:${port}`);

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    server.close();
  });

  return server;
};
