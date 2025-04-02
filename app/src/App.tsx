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
  return <div>tRPC app</div>;
}

export default App;
