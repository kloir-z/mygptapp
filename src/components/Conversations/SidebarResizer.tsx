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

  const handleTouchStart = (e: React.TouchEvent) => {
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    onResize(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart} 
    style={{
      cursor: 'ew-resize',
      width: '12px',
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
