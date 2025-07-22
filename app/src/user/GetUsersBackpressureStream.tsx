import { useEffect, useState } from 'react';

import { User } from './interface';

async function getUsersBackpressureStream(
  signal?: AbortSignal
): Promise<AsyncIterable<User>> {
  async function* generator() {
    const response = await fetch(
      'http://localhost:4000/users/backpressure-stream',
      { signal }
    );
    if (!response.ok) {
      const text = await response.text();
      const errorResponse = JSON.parse(text);
      throw new Error(errorResponse.error.message);
    }

    const decoder = new TextDecoder();
    const stream = response.body;
    if (!stream) return;

    const reader = stream.getReader();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      console.log('Received chunk:', buffer);
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.trim()) {
          const response = JSON.parse(line);
          yield response as User;
        }
      }
    }
    if (buffer.trim()) {
      yield JSON.parse(buffer) as User;
    }
  }
  return await Promise.resolve(generator());
}

const GetUsersBackpressureStream: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(true);
    setError(null);

    getUsersBackpressureStream(abortController.signal)
      .then(async (responseIterable) => {
        if (abortController.signal.aborted) return;
        for await (const user of responseIterable) {
          // sleep 4s
          await new Promise((resolve) => setTimeout(resolve, 4000));
          setUsers((prev) => [...prev, user]);
        }
      })
      .catch((error: unknown) => {
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
      <h3>Get Users Backpressure Stream</h3>
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

export default GetUsersBackpressureStream;
