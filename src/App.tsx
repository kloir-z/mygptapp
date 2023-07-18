import React, { useContext } from "react";
import './App.css';
import Conversations from './Conversations';
import { AuthContext } from './AuthContext';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
    {user ? <Conversations /> : <div>Loading...</div>}
    </div>
  );
}

export default App;
