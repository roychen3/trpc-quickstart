import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { User } from './interface';

const SubscribeGetUsersStream: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscriptable = trpc.subscribeGetUsersStream.subscribe(undefined, {
      onData: (user) => {
        setIsLoading(false);
        setUsers((prev) => [...prev, user]);
        if (user.isEnd) {
          unsubscriptable.unsubscribe();
        }
      },
      onError: (error) => {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Fetch users fails.'));
        }
      },
    });

    return () => {
      unsubscriptable.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h3>Subscribe Get Users Stream</h3>
      {isLoading ? 'loading...' : null}
      {error ? `Error: ${error}` : null}
      {!isLoading && !error ? (
        <>
          {users.map((user, idx) => {
            if (idx + 1 === users.length) {
              return <span key={user.id}>{`${user.name}.`}</span>;
            }
            return <span key={user.id}>{`${user.name}, `}</span>;
          })}
        </>
      ) : null}
    </div>
  );
};

export default SubscribeGetUsersStream;
