import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { appRouter, type AppRouter } from './router.js';

const server = createHTTPServer({
  router: appRouter,
  middleware: cors({ origin: '*' }), // 設定 CORS 為 '*'
});

const port = 4000;
server.listen(port);
console.log(`API endpoint: http://localhost:${port}`);

export type { AppRouter };
