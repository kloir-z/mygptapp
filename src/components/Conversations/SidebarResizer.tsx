import React from 'react';

interface SidebarResizerProps {
  onResize: (width: number) => void;
  sidebarWidth: number;
}

const SidebarResizer: React.FC<SidebarResizerProps> = ({ onResize, sidebarWidth }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none'; 
  };

  const handleMouseMove = (e: MouseEvent) => { 
    onResize(e.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = '';
  };

  return (
    <div
    onMouseDown={handleMouseDown}
    style={{
      cursor: 'ew-resize',
      width: '5px',
      height: '100%',
      position: 'absolute',
      left: sidebarWidth + 1,
      top: 0,
      zIndex: 1,
      }}
    />
  );
}

export default SidebarResizer;
