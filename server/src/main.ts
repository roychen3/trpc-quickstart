import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { publicProcedure, router } from './trpc.js';

type User = { id: string; name: string };

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users: User[] = [{ id: '1', name: 'Roy' }];
    return users;
  }),
});

const server = createHTTPServer({
  router: appRouter,
});

const port = 4000;
server.listen(port);
console.log(`API endpoint: http://localhost:${port}`);
