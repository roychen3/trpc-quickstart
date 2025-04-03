import { sleep } from '../../utils/sleep.js';
import { randomBetween } from '../../utils/random.js';

type User = { id: string; name: string };

export const users: User[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
  { id: '4', name: 'David' },
  { id: '5', name: 'Eve' },
];

// 使用 Async Generator 來逐步回傳 User
type UserStream = AsyncGenerator<User & { isEnd: boolean }, void, unknown>;
export async function* userGenerator(signal?: AbortSignal): UserStream {
  const usersStream = users.map((user, idx) => {
    return {
      ...user,
      isEnd: idx + 1 === users.length,
    };
  });
  for (const user of usersStream) {
    if (signal && signal.aborted) return; // 如果訂閱被取消，則停止迭代
    await sleep(randomBetween(500, 1500)); // 模擬延遲
    yield user;
  }
}
