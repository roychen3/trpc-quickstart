import NormalGetUsers from './user/NormalGetUsers';
import GetUsersStream from './user/GetUsersStream';
import SubscribeGetUsersStream from './user/SubscribeGetUsersStream';
import Chatroom from './chatroom/Chatroom';

function App() {
  return (
    <>
      <h1>tRPC app</h1>
      <hr />
      <h2>Stream Example</h2>
      <NormalGetUsers />
      <GetUsersStream />
      <SubscribeGetUsersStream />
      <hr />
      <h2>Websocket Example</h2>
      <Chatroom />
    </>
  );
}

export default App;
