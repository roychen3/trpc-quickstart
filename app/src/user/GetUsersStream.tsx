import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { User } from './interface';

const getUsersStream = async (signal?: AbortSignal) => {
  const usersIterable = await trpc.user.getUsersStream.query(undefined, {
    signal,
  });
  return usersIterable;
};

const GetUsersStream: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(true);
    setError(null);

    getUsersStream(abortController.signal)
      .then(async (responseIterable) => {
        if (abortController.signal.aborted) return;

        for await (const user of responseIterable) {
          setUsers((prev) => [...prev, user]);
        }
      })
      .catch((error) => {
        if (abortController.signal.aborted) return;

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Fetch users fails.'));
        }
      })
      .finally(() => {
        if (abortController.signal.reason === '_SKIP_') {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      abortController.abort('_SKIP_');
    };
  }, []);

  return (
    <div>
      <h3>Get Users Stream</h3>
      {error ? `Error: ${error}` : null}
      {!error ? (
        <>
          {users.map((user, idx) => {
            if (idx + 1 === users.length) {
              return <span key={user.id}>{`${user.name}.`}</span>;
            }
            return <span key={user.id}>{`${user.name}, `}</span>;
          })}
          {isLoading ? <span>...</span> : null}
        </>
      ) : null}
    </div>
  );
};

export default GetUsersStream;
