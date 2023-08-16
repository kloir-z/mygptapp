import React from 'react';

interface SidebarResizerProps {
  onResize: (width: number) => void;
  sidebarWidth: number;
  maxSidebarWidth?: number;
}

const SidebarResizer: React.FC<SidebarResizerProps> = ({ onResize, sidebarWidth, maxSidebarWidth }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none'; 
  };

  const handleMouseMove = (e: MouseEvent) => { 
    const newWidth = Math.min(e.clientX, maxSidebarWidth ?? Infinity);
    onResize(newWidth);
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
    const newWidth = Math.min(e.touches[0].clientX, maxSidebarWidth ?? Infinity);
    onResize(newWidth);
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
      height: 'calc(100svh - 33px)',
      position: 'absolute',
      left: sidebarWidth + 1,
      top: '33px',
      zIndex: 1,
      }}
    />
  );
}

export default SidebarResizer;
