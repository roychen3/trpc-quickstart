import NormalGetUsers from './user/NormalGetUsers';
import GetUsersStream from './user/GetUsersStream';
import SubscribeGetUsersStream from './user/SubscribeGetUsersStream';

function App() {
  return (
    <>
      <h1>tRPC app</h1>
      <NormalGetUsers />
      <GetUsersStream />
      <SubscribeGetUsersStream />
    </>
  );
}

export default App;
