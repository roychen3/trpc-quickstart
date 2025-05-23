import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { User } from './interface';

const getUsersStream = async () => {
  const usersIterable = await trpc.user.getUsersStream.query();
  return usersIterable;
};

const GetUsersStream: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setError(null);

    getUsersStream()
      .then(async (responseIterable) => {
        if (ignore) return;

        for await (const user of responseIterable) {
          if (ignore) break;

          setUsers((prev) => [...prev, user]);
        }
      })
      .catch((error) => {
        if (ignore) return;

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Fetch users fails.'));
        }
      })
      .finally(() => {
        if (ignore) return;

        setIsLoading(false);
      });

    return () => {
      ignore = true;
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
