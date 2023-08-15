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
          bottom: 0,
          left: 0,
          opacity: 0.7,
          fontSize: '12px',
          zIndex: 1000,
        }}
      >
        {debugInfo}
      </div>
    );
  };