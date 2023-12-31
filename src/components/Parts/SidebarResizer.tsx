import React from 'react';

interface SidebarResizerProps {
  onResize: (width: number) => void;
  sidebarWidth: number;
  maxSidebarWidth?: number;
  minSidebarWidth?: number;
}

const SidebarResizer: React.FC<SidebarResizerProps> = ({ onResize, sidebarWidth, minSidebarWidth=0, maxSidebarWidth }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    const handleMouseMove = (e: MouseEvent) => { 
      const newWidth = Math.min(Math.max(e.clientX, minSidebarWidth), maxSidebarWidth ?? Infinity);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none'; 
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const newWidth = Math.min(Math.max(e.touches[0].clientX, minSidebarWidth), maxSidebarWidth ?? Infinity);
      onResize(newWidth);
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart}
    style={{
      cursor: 'ew-resize',
      width: '15px',
      height: '94svh',
      position: 'absolute',
      left: sidebarWidth - 1,
      top: '2.25rem',
      zIndex: 1500,
      }}
    />
  );
}

export default SidebarResizer;
