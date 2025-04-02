import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { publicProcedure, router } from './trpc.js';

type User = { id: string; name: string };

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users: User[] = [{ id: '1', name: 'Roy' }];
    return users;
  }),
});
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  middleware: cors({ origin: '*' }), // 設定 CORS 為 '*'
});

const port = 4000;
server.listen(port);
console.log(`API endpoint: http://localhost:${port}`);
