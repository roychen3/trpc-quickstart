import { router } from '../trpc.js';

import { userRouter } from './user/index.js';
import { chatroomRouter } from './chatroom/index.js';

export const appRouter = router({
  user: userRouter,
  chatroom: chatroomRouter,
});
export type AppRouter = typeof appRouter;
