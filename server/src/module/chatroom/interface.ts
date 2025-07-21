export interface Message {
  id: string;
  text: string;
  user: string;
  createAt: string;
}

export interface ChatroomService {
  getMessages: () => Message[];
  addNewMessage: (value: Message) => Message[];
  onAddNewMessage: (listener: (value: Message) => void) => () => void;
  onAddNewMessageAsyncIterator(options: {
    signal?: AbortSignal;
  }): AsyncIterableIterator<Message[]>;
}
