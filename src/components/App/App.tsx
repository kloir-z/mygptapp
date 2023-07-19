import React, { useContext } from "react";
import styled from '@emotion/styled';
import Conversations from '../Conversations/Conversations';
import { AuthContext } from '../Auth/AuthContext';

const AppContainer = styled.div`
  text-align: left;
  background-color: #c1d5ff;
  background-color: #bbdebb;
  background-color: #282c34;
`;

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <AppContainer>
      {user ? <Conversations /> : <div>Loading...</div>}
    </AppContainer>
  );
}

export default App;
