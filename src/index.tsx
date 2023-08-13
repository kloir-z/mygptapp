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
          * {
            p{white-space: pre-wrap;}
            h1{font-size: 1.3rem}
            h2{font-size: 1rem}
            h3{font-size: 0.9rem}
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
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

            /* Firefox */
            scrollbar-width: thin;
            scrollbar-color: #525252 #282c34;
          }
          body {
            max-width: 1800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            height: 100vh;
            height: 100svh;
            color: #ebebeb;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #282c34;
            overflow-y: scroll;
          }
        `}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
