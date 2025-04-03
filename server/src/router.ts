import { publicProcedure, router } from './trpc.js';

import { userGenerator, users } from './module/user/index.js';

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return users;
  }),
  getUsersStream: publicProcedure.query(async function* (opts) {
    yield* userGenerator(opts.signal);
  }),
  subscribeGetUsersStream: publicProcedure.subscription(async function* (opts) {
    yield* userGenerator(opts.signal);
  }),
});
export type AppRouter = typeof appRouter;
