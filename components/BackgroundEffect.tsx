import React, { useEffect, useState } from 'react';

const BackgroundEffect: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set initial size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Parallax Calculation
  // We move the background slightly opposite to the mouse to create depth
  const xOffset = windowSize.width ? (mousePosition.x / windowSize.width - 0.5) * 30 : 0;
  const yOffset = windowSize.height ? (mousePosition.y / windowSize.height - 0.5) * 30 : 0;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden">
      
      {/* 1. The Image Layer with Parallax */}
      {/* inset-[-50px] provides a buffer so the edges don't show when moving */}
      <div 
        className="absolute inset-[-50px] bg-cover bg-center transition-transform duration-100 ease-out will-change-transform"
        style={{
          backgroundImage: 'url("https://i.pinimg.com/736x/bf/dd/45/bfdd457e009195d21251158ba1cefc85.jpg")',
          transform: `translate3d(${-xOffset}px, ${-yOffset}px, 0)`,
          filter: 'blur(5px) brightness(0.8) contrast(1.2)',
          opacity: 0.15 // Very subtle ("pouco visivel")
        }}
      />

      {/* 2. Spotlight Overlay - Adds local interaction */}
      <div 
        className="absolute inset-0"
        style={{
            background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.08), transparent 70%)`
        }}
      />
    </div>
  );
};

export default BackgroundEffect;