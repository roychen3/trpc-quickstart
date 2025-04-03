import {
  createTRPCClient,
  splitLink,
  httpBatchStreamLink,
  httpSubscriptionLink,
} from '@trpc/client';
import type { AppRouter } from '@trpc-quickstart/server';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        console.log('op.type:', op.type)
        return op.type === 'subscription';
      },
      true: httpSubscriptionLink({ url: 'http://localhost:4000' }),
      false: httpBatchStreamLink({ url: 'http://localhost:4000' }),
    }),
  ],
});
