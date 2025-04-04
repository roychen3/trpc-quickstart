import { ChatroomService, Message } from './interface.js';

export function messageStream(
  chatroom: ChatroomService
): AsyncIterableIterator<Message> {
  return (async function* () {
    const queue: Message[] = [];
    let resolve: (() => void) | null = null;

    const listener = (message: Message) => {
      queue.push(message);
      if (resolve) {
        resolve();
        resolve = null;
      }
    };

    const unsubscribe = chatroom.onAddNewMessage(listener);

    try {
      while (true) {
        while (queue.length === 0) {
          await new Promise<void>((res) => (resolve = res));
        }

        while (queue.length > 0) {
          yield queue.shift()!;
        }
      }
    } finally {
      unsubscribe(); // Clean up listener when iteration stops
    }
  })();
}
