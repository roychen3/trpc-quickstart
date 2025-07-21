import { ChatroomService, Message } from './interface.js';

export function messageStream(
  chatroom: ChatroomService,
  options?: { signal?: AbortSignal }
): AsyncIterableIterator<Message> {
  return (async function* () {
    const queue: Message[] = [];
    let resolve: (() => void) | null = null;
    let aborted = false;
    
    options?.signal?.addEventListener('abort', () => {
      aborted = true;
      if (resolve) {
        resolve();
        resolve = null;
      }
    });

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
        if (aborted) {
          break;
        }
        if (queue.length === 0) {
          await new Promise<void>((res) => (resolve = res));
          if (aborted) {
            break;
          }
        }
        while (queue.length > 0) {
          yield queue.shift()!;
        }
      }
    } finally {
      unsubscribe(); // Clean up listener when iteration stops
      console.log('Message stream closed');
    }
  })();
}
