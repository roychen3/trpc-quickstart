import { publicProcedure, router } from './trpc.js';

type User = { id: string; name: string };

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const users: User[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

// 使用 Async Generator 來逐步回傳 User
type UserStream = AsyncGenerator<User & { isEnd: boolean }, void, unknown>;
async function* userGenerator(signal?: AbortSignal): UserStream {
  const usersStream = users.map((user, idx) => {
    return {
      ...user,
      isEnd: idx + 1 === users.length,
    };
  });
  for (const user of usersStream) {
    if (signal && signal.aborted) return; // 如果訂閱被取消，則停止迭代
    await sleep(); // 模擬延遲
    yield user;
  }
}

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    return users;
  }),
  // getUsersStream: publicProcedure.subscription(async function* (opts) {
  //   yield* userGenerator(opts.signal); // 呼叫 userGenerator
  // }),
  subscribeUsersStream: publicProcedure.subscription(async function* (opts) {
    yield* userGenerator(opts.signal); // 呼叫 userGenerator
  }),
});
export type AppRouter = typeof appRouter;
