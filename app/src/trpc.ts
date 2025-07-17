import {
  createTRPCClient,
  splitLink,
  httpLink,
  httpBatchStreamLink,
  httpSubscriptionLink,
  createWSClient,
  wsLink,
} from '@trpc/client';
import type { AppRouter } from '@trpc-quickstart/server';

const url = 'http://localhost:4000';
const wsUrl = 'ws://localhost:4000';
const wsClient = createWSClient({
  url: wsUrl,
});

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === 'subscription';
      },
      true: splitLink({
        condition: (op) => op.context.useWS === true,
        true: wsLink({ client: wsClient }),
        false: httpSubscriptionLink({ url }),
      }),
      false: splitLink({
        condition: (op) => ['user.getUsersStream'].includes(op.path),
        true: httpBatchStreamLink({ url, maxItems: 1 }),
        false: httpLink({ url }),
      }),
    }),
  ],
});
