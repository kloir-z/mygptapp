import React, { useContext } from "react";
import styled from '@emotion/styled';
import Conversations from '../Conversations/Conversations';
import { AuthContext } from '../Auth/AuthContext';

const AppContainer = styled.div`
  text-align: left;
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
