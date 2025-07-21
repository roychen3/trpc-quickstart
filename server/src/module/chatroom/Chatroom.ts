import { EventEmitter, on } from 'node:events';

import { ChatroomService } from './interface.js';

export interface Message {
  id: string;
  text: string;
  user: string;
  createAt: string;
}

export class Chatroom implements ChatroomService {
  private _emitter = new EventEmitter();
  private _messages: Message[] = [];

  constructor() {}

  getMessages() {
    return this._messages;
  }

  getMessageEventName() {
    return 'onAddNewMessage';
  }

  addNewMessage(value: Message) {
    this._messages.push(value);
    this._emitter.emit(this.getMessageEventName(), value);
    return this._messages;
  }

  onAddNewMessage(listener: (newMessage: Message) => void) {
    this._emitter.on(this.getMessageEventName(), listener);
    return () =>
      this._emitter.removeListener(this.getMessageEventName(), listener);
  }

  onAddNewMessageAsyncIterator(options: {
    signal?: AbortSignal;
  }): AsyncIterableIterator<Message[]> {
    const eventName = this.getMessageEventName();
    return on(this._emitter, eventName, { signal: options.signal });
  }
}

export const chatroom = new Chatroom();
