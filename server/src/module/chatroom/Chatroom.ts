import { EventEmitter } from 'events';
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

  addNewMessage(value: Message) {
    this._messages.push(value);
    this._emitter.emit('onAddNewMessage', value);
    return this._messages;
  }

  onAddNewMessage(listener: (newTab: Message) => void) {
    this._emitter.on('onAddNewMessage', listener);
    return () => this._emitter.removeListener('onAddNewMessage', listener);
  }
}

export const chatroom = new Chatroom();
