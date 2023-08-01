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
            max-width: 1800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 100svh;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #282c34;
            overflow-y: scroll;

            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #282c34;
            }
            ::-webkit-scrollbar-thumb {
              background: #525252a6;
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            // Firefox
            scrollbar-width: thin;
            scrollbar-color: #525252 #282c34;
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
