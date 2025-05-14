import { useState, useEffect, useRef } from 'react';

interface PasswordProps {
  isSelected?: boolean;
  text?: string;
  onClick?: () => void;
}

export default function Password({ text, isSelected, onClick}: PasswordProps) {
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { 
        // random initial position
        x: Math.random() * (window.innerWidth - 200), 
        y: Math.random() * (window.innerHeight - 100)
      };
    }
    return { x: 50, y: 50 };
  });
  
  const [velocity, setVelocity] = useState(() => {
    // random direction, speed between 2-5
    const speed = 2 + Math.random() * 3;
    const angle = Math.random() * Math.PI * 2;
    
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  });
  
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getViewportDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const animate = () => {
      if (!textRef.current) return;
      
      const viewport = getViewportDimensions();
      const text = textRef.current.getBoundingClientRect();
      
      let newX = position.x + velocity.x;
      let newY = position.y + velocity.y;
      let newVelocity = { ...velocity };
      
      // horizontal bounds
      if (newX + text.width > viewport.width || newX < 0) {
        newVelocity.x = -velocity.x;
        // bounds check
        if (newX + text.width > viewport.width) {
          newX = viewport.width - text.width;
        }
        if (newX < 0) {
          newX = 0;
        }
      }
      
      // vertical bounds
      if (newY + text.height > viewport.height || newY < 0) {
        newVelocity.y = -velocity.y;
        // bounds check
        if (newY + text.height > viewport.height) {
          newY = viewport.height - text.height;
        }
        if (newY < 0) {
          newY = 0;
        }
      }
      
      setPosition({ x: newX, y: newY });
      setVelocity(newVelocity);
    };
    
    // animation frame
    let frameId: number;
    const frame = () => {
      animate();
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    
    const handleResize = () => {
      if (!textRef.current) return;
      
      const viewport = getViewportDimensions();
      const text = textRef.current.getBoundingClientRect();
      
      // bounds check
      let newX = position.x;
      let newY = position.y;
      
      if (newX + text.width > viewport.width) {
        newX = viewport.width - text.width;
      }
      
      if (newY + text.height > viewport.height) {
        newY = viewport.height - text.height;
      }
      
      setPosition({ x: newX, y: newY });
    };
    
    window.addEventListener('resize', handleResize);
    
    // cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [position, velocity]);
  
  return (
    <div 
      ref={textRef}
      onClick={onClick}
      className={`fixed font-bold text-2xl text-black px-3 py-1 rounded-md bg-white select-none cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        zIndex: 9999
      }}
    >
      {text}
    </div>
  );
}
