import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { AuthProvider } from './components/Auth/AuthProvider';
import { Global } from '@emotion/react'
import { css } from '@emotion/react'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Global
        styles={css`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #282c34;
          }
          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace;
          }
        `}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
