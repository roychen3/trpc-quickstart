import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { User } from './interface';

const fetchGetUsers = async (signal?: AbortSignal) => {
  const userList = await trpc.user.getUsers.query(undefined, { signal });
  return userList;
};

const NormalGetUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(true);
    setError(null);

    fetchGetUsers(abortController.signal)
      .then((response) => {
        if (abortController.signal.aborted) return;

        setUsers(response);
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
        setIsLoading(false);
      });

    return () => {
      abortController.abort('The useEffect is cleaned up.');
    };
  }, []);

  return (
    <div>
      <h3>Normal Get Users</h3>
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

export default NormalGetUsers;
