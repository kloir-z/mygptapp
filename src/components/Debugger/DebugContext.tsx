import React, { createContext, useContext, useState } from 'react';

const DebugContext = createContext({
  debugInfo: '',
  setDebugInfo: (info: string) => {}
});

export const useDebugInfo = () => useContext(DebugContext);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [debugInfo, setDebugInfo] = useState('');
  return (
    <DebugContext.Provider value={{ debugInfo, setDebugInfo }}>
      {children}
    </DebugContext.Provider>
  );
};

export const DebugDisplay: React.FC = () => {
    const { debugInfo } = useDebugInfo();
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          left: 0,
          opacity: 0.8,
          fontSize: '12px',
          zIndex: 1000,
          backgroundColor: '#000000',
          color: '#09ff00'
        }}
      >
        {debugInfo}
      </div>
    );
  };