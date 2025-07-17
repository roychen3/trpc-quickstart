import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { appRouter } from './router/index.js';

export const server = createHTTPServer({
  router: appRouter,
  middleware: cors({ origin: '*' }), // 設定 CORS 為 '*'
});

const port = 4000;
server.listen(port);
console.log(`✅ tRPC Server listening on http://localhost:${port}`);
