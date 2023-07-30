import React, { useContext } from "react";
import Conversations from '../Conversations/Conversations';
import { AuthContext } from '../Auth/AuthContext';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  const LoadingDiv = {
    color: '#ebebeb'
  }

  return (
    <>
      {user ? <Conversations /> : <div style={LoadingDiv}>Loading...</div>}
    </>
  );
}

export default App;
