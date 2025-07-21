import { z } from 'zod';

import { publicProcedure, router } from '../../trpc.js';
import { chatroom, messageStream } from '../../module/chatroom/index.js';

export const chatroomRouter = router({
  sendMessage: publicProcedure
    .input(z.object({ text: z.string(), user: z.string() }))
    .mutation(({ input }) => {
      const message = {
        id: crypto.randomUUID(),
        createAt: Date.now().toString(),
        ...input,
      };
      chatroom.addNewMessage(message);
      return message;
    }),

  getMessages: publicProcedure.query(() => chatroom.getMessages()),

  onAddNewMessage: publicProcedure.subscription(async function* ({ signal }) {
    for await (const [message] of chatroom.onAddNewMessageAsyncIterator({
      signal,
    })) {
      yield message;
    }
  }), 
  // onAddNewMessage: publicProcedure.subscription(async function* ({ signal }) {
  //   for await (const message of messageStream(chatroom, {
  //     signal,
  //   })) {
  //     yield message;
  //   }
  // }),
});
