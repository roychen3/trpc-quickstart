import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { Message } from './interface';

const fetchGetMessages = () => {
  return trpc.chatroom.getMessages.query();
};
const fetchSendMessages = (params: { user: string; text: string }) => {
  return trpc.chatroom.sendMessage.mutate(params);
};

const Chatroom: React.FC = () => {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [triggerFetchMessages, setTriggerFetchMessages] = useState({});

  useEffect(() => {
    let ignore = false;

    setError(null);

    fetchGetMessages()
      .then((response) => {
        if (ignore) return;

        setMessages(response);
      })
      .catch((error) => {
        if (ignore) return;

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Fetch users fails.'));
        }
      });

    return () => {
      ignore = true;
    };
  }, [triggerFetchMessages]);

  useEffect(() => {
    const unsubscriptable = trpc.chatroom.onAddNewMessage.subscribe(undefined, {
      onData(value) {
        console.log('onAddNewMessage:', value);
        setTriggerFetchMessages({});
      },
    });

    return () => {
      unsubscriptable.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h3>Chatroom</h3>
      {error ? `Error: ${error}` : null}
      {!error ? (
        <>
          {messages.map((message) => {
            return (
              <div key={message.id}>
                <strong>{`${message.user}: `}</strong>
                <span>{`${message.text}`}</span>
              </div>
            );
          })}
        </>
      ) : null}
      <input
        style={{ width: '80%' }}
        value={message}
        placeholder={`[${
          user || 'Anonymous'
        }] Type a message and press Enter to send`}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            let submitUser = user;
            if (!submitUser) {
              while (true) {
                const initUser = window.prompt(`Enter your nickname:`);
                if (initUser) {
                  submitUser = initUser;
                  setUser(submitUser);
                  break;
                }
              }
            }
            fetchSendMessages({
              user: submitUser,
              text: event.currentTarget.value,
            });
            setMessage('');
          }
        }}
      />
    </div>
  );
};

export default Chatroom;
