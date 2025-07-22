import NormalGetUsers from './user/NormalGetUsers';
import SubscribeGetUsersStream from './user/SubscribeGetUsersStream';
import GetUsersStream from './user/GetUsersStream';
import GetUsersBackpressureStream from './user/GetUsersBackpressureStream';
import Chatroom from './chatroom/Chatroom';

function App() {
  return (
    <>
      <h1>tRPC app</h1>
      <hr />
      <h2>Get User</h2>
      <NormalGetUsers />
      <hr />
      <SubscribeGetUsersStream />
      <hr />
      <h3>Stream Example</h3>
      <GetUsersStream />
      <GetUsersBackpressureStream />
      <hr />
      <h2>Websocket Example</h2>
      <Chatroom />
    </>
  );
}

export default App;
