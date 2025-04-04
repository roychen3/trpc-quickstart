import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import { User } from './interface';

const fetchGetUsers = async () => {
  const userList = await trpc.user.getUsers.query();
  return userList;
};

const NormalGetUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setError(null);

    fetchGetUsers()
      .then((response) => {
        if (ignore) return;

        setUsers(response);
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
        setIsLoading(false);
      });

    return () => {
      ignore = true;
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
