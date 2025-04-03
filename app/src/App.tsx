import { useEffect } from 'react';
import { trpc } from './trpc';

function App() {
  useEffect(() => {
    const fetchUserList = async () => {
      const userList = await trpc.userList.query();
      console.log('userList:', userList);
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    const fetchGetUsersStream = async () => {
      const responseIterable = await trpc.getUsersStream.query();
      for await (const user of responseIterable) {
        console.log('getUsersStream.user:', user);
      }
    };
    fetchGetUsersStream();
  }, []);

  useEffect(() => {
    const fetchUserListStream = () => {
      const unsubscriptable = trpc.subscribeUsersStream.subscribe(undefined, {
        onData: (user) => {
          console.log('stream user:', user);
          if (user.isEnd) {
            unsubscriptable.unsubscribe();
          }
        },
        onError: (error) => {
          console.error('error:', error);
        },
      });
      return unsubscriptable;
    };
    const unsubscriptable = fetchUserListStream();

    return () => {
      unsubscriptable.unsubscribe();
    };
  }, []);

  return <div>tRPC app</div>;
}

export default App;
